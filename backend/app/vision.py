import base64
import io
from typing import Annotated, List, TypedDict
from langgraph.graph import  StateGraph,START
from google.cloud import vision
import os
from langgraph.graph.message import add_messages

# LangGraph StateGraph for Gemini AI
image_state = {"messages": []}  # Initial state for LangGraph
class VisionState(TypedDict):
    messages: Annotated[list,add_messages]  # List of messages exchanged
    image_description: Annotated[list,add_messages]  # Description of the uploaded image
    questions: Annotated[list,add_messages]  # Questions asked about the image
    advertisement: Annotated[list ,add_messages] # Generated advertisement text

state_graph = StateGraph(VisionState)
state:VisionState = {
    "messages": [],
    "image_description": [],
    "questions": [],
    "advertisement": ""
}

def answer_questions(state):
    # Answer all questions in the state and update messages
    answers = [
        f"Answer to '{q}': AI-generated response." for q in state["questions"]
    ]
    state["messages"].append({"role": "AI", "content": "\n".join(answers)})
    return state


def generate_advertisement(state):
    state["advertisement"] = "Advert idea: Perfect getaway destination."
    state["messages"].append({"role": "AI", "content": state["advertisement"]})
    return state

def process_image(image_data):
    """Process an image and generate a caption."""
    global state
    buffer = io.BytesIO()
    image_data.save(buffer, format="JPEG")
    image_bytes = buffer.getvalue()
    response = image_graph.invoke({'mime_type':'image/jpeg', 'data': base64.b64encode(image_bytes).decode('utf-8'),'task': "describe this image"})
    state["image_description"].append({response})
    return state

def process_question(question):
    """Answer questions based on the current image state."""
    image_state["questions"].append(question)
    return image_graph.invoke(image_state)

def process_advertisement(model, image_data):
    """Generate advertisements based on the current image state."""
    response = model.generate_content([{'mime_type':'image/jpeg', 'data': base64.b64encode(image_data).decode('utf-8')}, "Generate an advertisement for this product"])
    return response

state_graph.add_node("generate_caption", process_image)
state_graph.add_node("answer_questions", process_question)
state_graph.add_node("generate_advertisement", process_advertisement)
state_graph.add_edge(START, "generate_caption")
state_graph.add_edge(START, "answer_questions")
state_graph.add_edge(START, "generate_advertisement")

# Compile the StateGraph
image_graph = state_graph.compile()


