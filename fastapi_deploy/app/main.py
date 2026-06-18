from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SignBridge AI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "SignBridge AI API", "docs": "/docs"}


@app.get("/api/v1/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "signbridge-ai"}


@app.get("/api/v1/analytics/summary")
def analytics() -> dict[str, object]:
    return {
        "accuracy": 0.93,
        "sessionLengthMinutes": 18,
        "wordsRecognized": 1248,
        "commonSigns": ["HELLO", "THANK YOU", "HELP", "WATER"],
        "usageTrend": [8, 12, 15, 19, 23, 26, 31],
    }


@app.post("/api/v1/translation/text-to-sign")
def text_to_sign(payload: dict[str, str]) -> dict[str, object]:
    text = " ".join(payload.get("text", "Hello").split())
    words = text.replace("?", " QUESTION").split()
    return {
        "normalizedText": text,
        "tokens": [
            {"gloss": word.upper(), "durationMs": 600, "expression": "question" if word == "QUESTION" else "neutral", "handshape": "lexical"}
            for word in words
        ],
    }
