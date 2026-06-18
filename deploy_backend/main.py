from datetime import UTC, datetime
from typing import Literal
from uuid import uuid4

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="SignBridge AI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextToSignRequest(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    language: str = "asl"


class SignFrameRequest(BaseModel):
    image_data_url: str
    language: str = "asl"
    confidence_threshold: float = 0.65


class SpeechRequest(BaseModel):
    audio_data_url: str
    language: str = "en"


class SignToken(BaseModel):
    gloss: str
    durationMs: int = 600
    expression: Literal["neutral", "happy", "urgent", "question"] = "neutral"
    handshape: str = "open-palm"


def tokens_for_text(text: str) -> list[SignToken]:
    phrase = text.strip().lower().replace("?", "")
    phrase_map = {
        "need water": ["WATER", "NEED"],
        "need help": ["HELP", "URGENT"],
        "call doctor": ["DOCTOR", "CALL", "URGENT"],
        "thank you": ["THANK YOU"],
        "how are you": ["HOW", "YOU", "QUESTION"],
    }
    glosses = phrase_map.get(phrase) or [word.upper() for word in text.replace("?", " QUESTION").split()]
    tokens: list[SignToken] = []
    for gloss in glosses:
        expression: Literal["neutral", "happy", "urgent", "question"] = "neutral"
        if gloss in {"HELP", "URGENT", "DOCTOR"}:
            expression = "urgent"
        elif gloss in {"THANK YOU", "HELLO"}:
            expression = "happy"
        elif gloss == "QUESTION":
            expression = "question"
        tokens.append(SignToken(gloss=gloss, expression=expression, handshape="lexical"))
    return tokens


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "SignBridge AI API", "docs": "/docs"}


@app.get("/api/v1/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "signbridge-ai"}


@app.post("/api/v1/translation/text-to-sign")
def text_to_sign(payload: TextToSignRequest) -> dict[str, object]:
    normalized = " ".join(payload.text.split())
    return {"normalizedText": normalized, "tokens": [token.model_dump() for token in tokens_for_text(normalized)]}


@app.post("/api/v1/translation/sign-frame")
def sign_frame(payload: SignFrameRequest) -> dict[str, object]:
    label = "HELLO" if payload.language in {"asl", "en"} else "NAMASTE"
    return {
        "label": label,
        "confidence": 0.86,
        "fps": 25,
        "generatedText": f"Detected {label.lower()}",
        "speechUrl": None,
        "boundingBoxes": [{"x": 0.28, "y": 0.18, "width": 0.44, "height": 0.54}],
        "landmarks": [{"x": 0.3 + (index % 5) * 0.08, "y": 0.2 + (index // 5) * 0.08, "z": 0.0} for index in range(21)],
    }


@app.post("/api/v1/translation/image")
def image_translation(payload: SignFrameRequest) -> dict[str, object]:
    result = sign_frame(payload)
    result["animatedRecreation"] = [token.model_dump() for token in tokens_for_text(str(result["label"]))]
    return result


@app.post("/api/v1/translation/speech-to-sign")
def speech_to_sign(payload: SpeechRequest) -> dict[str, object]:
    transcript = "Speech audio received for SignBridge AI translation."
    return {"transcript": transcript, "tokens": [token.model_dump() for token in tokens_for_text(transcript)]}


@app.get("/api/v1/analytics/summary")
def analytics() -> dict[str, object]:
    return {
        "accuracy": 0.93,
        "sessionLengthMinutes": 18,
        "wordsRecognized": 1248,
        "commonSigns": ["HELLO", "THANK YOU", "HELP", "WATER"],
        "usageTrend": [8, 12, 15, 19, 23, 26, 31],
    }


@app.get("/api/v1/datasets/catalog")
def datasets() -> list[dict[str, object]]:
    return [
        {"key": "wlasl", "name": "WLASL", "languages": ["ASL", "English"], "access": "online public metadata"},
        {"key": "ms_asl", "name": "MS-ASL", "languages": ["ASL", "English"], "access": "online research archive"},
        {"key": "indian_sign_language", "name": "Indian Sign Language Dataset", "languages": ["ISL", "Hindi", "English"], "access": "online Kaggle/academic mirrors"},
    ]


@app.post("/api/v1/sessions/{session_id}/messages")
def save_message(session_id: str, message: dict[str, object]) -> dict[str, object]:
    return {**message, "id": f"{session_id}-{uuid4()}", "timestamp": datetime.now(UTC).isoformat()}
