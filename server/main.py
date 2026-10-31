import os
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI, OpenAIError
from pydantic import BaseModel, Field

app = FastAPI(title="AI StudyMate API", version="0.1.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:5500").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

class TutorRequest(BaseModel):
    question: str = Field(min_length=2, max_length=4000)
    mode: Literal["tutor", "homework", "notes", "quiz", "planner"] = "tutor"
    language: str = Field(default="English", min_length=2, max_length=40)
    level: str = Field(default="general", max_length=80)

class TutorResponse(BaseModel):
    answer: str

@app.get("/health")
def health():
    return {"status": "ok", "service": "AI StudyMate API"}

@app.post("/api/ask", response_model=TutorResponse)
def ask_tutor(payload: TutorRequest):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="AI service is not configured yet. Add OPENAI_API_KEY to the server environment.")

    mode_instructions = {
        "tutor": "Teach the topic clearly, step by step. Use a simple example and check understanding.",
        "homework": "Guide the student through the problem step by step. Explain the reasoning rather than only giving the final answer.",
        "notes": "Create concise, well-organized study notes with headings and key points.",
        "quiz": "Create a short quiz on the requested topic. Include questions first, then an answer key with explanations.",
        "planner": "Create a realistic study plan with focused sessions, breaks, and revision time.",
    }

    client = OpenAI(api_key=api_key)
    try:
        result = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-5.5"),
            instructions=(
                "You are AI StudyMate, a patient and encouraging teacher for school, "
                "college, and university students. Be accurate, age-appropriate, and "
                "clear. If uncertain, say so. Never invent sources. Use the student's "
                f"requested language: {payload.language}. Student level: {payload.level}. "
                f"Task: {mode_instructions[payload.mode]}"
            ),
            input=payload.question,
        )
        answer = (result.output_text or "").strip()
        if not answer:
            raise HTTPException(status_code=502, detail="The AI returned an empty answer. Please try again.")
        return TutorResponse(answer=answer)
    except OpenAIError:
        raise HTTPException(status_code=502, detail="The AI service could not complete the request. Please try again later.")
