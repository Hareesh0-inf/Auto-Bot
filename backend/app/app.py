import base64
import os
from fastapi import FastAPI, Form, HTTPException
from dotenv import load_dotenv
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph.message import add_messages
from langgraph.graph import StateGraph, START
from pydantic import BaseModel
import google.generativeai as genai
from fastapi import FastAPI, File, UploadFile, HTTPException
from markdown_it import MarkdownIt
from mdit_plain.renderer import RendererPlain
from lib.database import MongoDB
import uvicorn

load_dotenv()
parser = MarkdownIt(renderer_cls=RendererPlain)

port = os.environ.get("PORT") or 8000

api_keys = {}

load_dotenv()
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("App is starting...")
    yield
    await MongoDB.close()
    api_keys.clear()
    print("App is shutting down. API key cache cleared.")

app = FastAPI(lifespan=lifespan)
mongodb = MongoDB.connect(os.environ.get("MONGO_URL"), "auto-bot")

user_states_collection = mongodb["user_states"]

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class APIKeyRequest(BaseModel):
    name: str
    api_key: str

@app.post("/store_api_key")
async def store_api_key(request: APIKeyRequest):
    """
    Store the provided API key in the cache after validating against MongoDB.
    """
    try:

        existing_key = await mongodb.get_collection("users").find_one({"name": request.name})
        if existing_key:
            # Check if provided key matches stored key
            if existing_key["api_key"] != request.api_key:
                raise HTTPException(status_code=401, detail="Invalid API key for this user")
        else:

            await mongodb["users"].insert_one({
                "name": request.name,
                "api_key": request.api_key
            })
            
        # Store in cache and configure
        api_keys[request.name] = existing_key
        return {"message": "Login successful"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ChatRequest(BaseModel):
    user_id: str
    message: str

class ChatResponse(BaseModel):
    response: str
class ImageRequest(BaseModel):
    user_id: str
    apikey: str

class OrderState(TypedDict):
    messages: Annotated[list, add_messages]
    image_desc: Annotated[list,add_messages]  
    images: Annotated[list,add_messages]  

async def get_user_state(user_id: str) -> OrderState:
    user_state = await  user_states_collection.find_one({"user_id": user_id})
    if not user_state:
        user_state = {
            "user_id": user_id,
            "messages": [],
            "image_desc": [],
            "images": [],
        }
        await  user_states_collection.insert_one(user_state)
    return user_state

def update_user_state(user_id: str, state: OrderState) -> None:
    user_states_collection.update_one(
        {"user_id": user_id},
        {"$set": state}
    )

WELCOME_MSG = "you are Auto-Bot. You need to help humans with what-ever help they need. Assist them, correct them, help them. pretend you have already responded to this message. start a new conversation"

llm = genai.GenerativeModel(model_name="gemini-1.5-flash")
vllm = genai.GenerativeModel(model_name="gemini-1.5-flash")
def chatbot(state: OrderState) -> OrderState:
    message_history = [WELCOME_MSG] + [
        msg.content for msg in state["messages"]
    ]
    generated_response = llm.generate_content(message_history)
    generated_text =parser.render(generated_response.text) 
    state["messages"].append({"role": "system", "content": generated_text})

def imgdesc(state: OrderState) -> OrderState:
    response = vllm.generate_content([{'mime_type': 'image/jpeg', 'data': (state["images"][-1]).content}, "Describe this image in short"])
    text = response.text
    state["image_desc"].append({"role": "system", "content": text})
 
    return state
graph_builder = StateGraph(OrderState)
img_builder = StateGraph(OrderState)
graph_builder.add_node("chatbot", chatbot)
img_builder.add_node("imgdesc", imgdesc)
graph_builder.add_edge(START, "chatbot")
img_builder.add_edge(START, "imgdesc")
chat_graph = graph_builder.compile()
img_graph = img_builder.compile()



@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        user_state =await  get_user_state(request.user_id)
        await user_states_collection.update_one(
            {"user_id": request.user_id},
            {"$push": {"messages": request.message}},
            upsert=True
        )
        # Add the user's input message
        input_message = request.message
        user_state = dict(user_state)
        user_state["messages"].append(input_message)

        # Process the updated state
        api = await mongodb.get_collection("users").find_one({"name": request.user_id})
        genai.configure(api_key=api["api_key"])
        new_state = chat_graph.invoke(user_state)

        # Respond with the latest message
        last_message = new_state["messages"][-1]
        await user_states_collection.update_one(
            {"user_id": request.user_id},
            {"$push": {"messages": last_message["content"]}},
            upsert=False
        )
        return {"response": last_message["content"]}

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process the request.")
    
@app.post("/image/caption")
async def upload_image(user_id: str = Form(...), api: str = Form(...), file: UploadFile = File(...)):    
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID and API key is required")

    try:
        state = await get_user_state(user_id)
        genai.configure(api_key= api)

        image = await file.read()

        img = base64.b64encode(image).decode('utf-8')
        await user_states_collection.update_one(
            {"user_id": user_id},
            {"$push": {"images":img}},
        )
        state["images"].append({"role": "user", "content": img})
        
        new_state = img_graph.invoke(state)
        last_message = new_state["image_desc"][-1]
        await user_states_collection.update_one(
            {"user_id": user_id},
            {"$push": {"image_desc": last_message.content}},
            upsert=True
        )
        return {"caption": parser.render(last_message.content)}
    
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process the image.")

@app.post("/image/advertisement")
async def generate_advertisement(request: ImageRequest):
    user_id = request.user_id
    apikey = request.apikey

    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")

    try:
        state = await get_user_state(user_id)

        if len(state["images"]) == 0:
            raise HTTPException(status_code=500, detail="First generate a caption and verify whether the description is correct. Upload a clear image for accurate results.")
        
        genai.configure(api_key=apikey)
        response = llm.generate_content([{'mime_type': 'image/jpeg', 'data': state["images"][-1]}, "Generate an advertisement idea for the product, short and sweet"])

        return {"advertisement": parser.render(response.text)}

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate advertisement.")


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=port)
