from fastapi import FastAPI
from app.models import MatchRequest
from app.matcher import rank_users

app = FastAPI()

@app.get("/")
def health():
    return { "status": "ML service running" }

@app.post("/match")
def match(data: MatchRequest):
    ranked_users = rank_users(data.ideaText, data.users)
    return ranked_users
