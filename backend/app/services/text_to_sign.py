import re

from app.schemas import LanguageCode, SignToken

PHRASE_MAP: dict[str, list[str]] = {
    "how are you": ["HOW", "YOU", "QUESTION"],
    "need water": ["WATER", "NEED"],
    "need help": ["HELP", "URGENT"],
    "call doctor": ["DOCTOR", "CALL", "URGENT"],
    "thank you": ["THANK YOU"],
    "namaste": ["NAMASTE"],
}

HINDI_MAP = {
    "paani": "WATER",
    "madad": "HELP",
    "doctor": "DOCTOR",
    "dhanyavaad": "THANK YOU",
    "namaste": "NAMASTE",
}


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip())


def text_to_sign_tokens(text: str, language: LanguageCode) -> list[SignToken]:
    normalized = normalize_text(text)
    lookup_key = re.sub(r"[^a-zA-Z\s]", "", normalized).lower()
    glosses = PHRASE_MAP.get(lookup_key)
    if glosses is None:
        words = re.findall(r"[\w']+|[?]", normalized.lower())
        glosses = [HINDI_MAP.get(word, word.upper()) for word in words if word.strip()]
    if not glosses:
        glosses = ["UNKNOWN"]
    tokens: list[SignToken] = []
    for gloss in glosses:
        expression = "question" if gloss == "QUESTION" or normalized.endswith("?") else "neutral"
        if gloss in {"HELP", "URGENT", "DOCTOR"}:
            expression = "urgent"
        if gloss in {"HELLO", "THANK YOU", "NAMASTE"}:
            expression = "happy"
        tokens.append(SignToken(gloss=gloss, durationMs=700 if language in {LanguageCode.asl, LanguageCode.isl} else 560, expression=expression, handshape="lexical"))
    return tokens
