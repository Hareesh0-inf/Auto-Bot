from typing import Annotated, TypedDict
from motor.motor_asyncio import AsyncIOMotorClient
from langgraph.graph.message import add_messages

class OrderState(TypedDict):
    messages: Annotated[list, add_messages]
    image_desc: Annotated[list,add_messages]  # Description of the uploaded image
    images: Annotated[list,add_messages]  
    advertisement: Annotated[list ,add_messages] # Generated advertisement text


class MongoDB:
    client = None
    
    @staticmethod
    def connect(uri: str, db_name: str):
        MongoDB.client = AsyncIOMotorClient(uri)
        return MongoDB.client[db_name]

    @staticmethod
    async def close():
        if MongoDB.client:
            MongoDB.client.close()

