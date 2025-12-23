from pydantic import BaseModel
from typing import List

class UserInput(BaseModel):
    userId: str
    text: str

class MatchRequest(BaseModel):
    ideaText: str
    users: List[UserInput]
