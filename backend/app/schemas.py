from datetime import datetime
from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field


class LanguageCode(str, Enum):
    en = "en"
    hi = "hi"
    hinglish = "hinglish"
    asl = "asl"
    isl = "isl"


class Landmark(BaseModel):
    x: float = Field(ge=0, le=1)
    y: float = Field(ge=0, le=1)
    z: float = 0


class BoundingBox(BaseModel):
    x: float = Field(ge=0, le=1)
    y: float = Field(ge=0, le=1)
    width: float = Field(ge=0, le=1)
    height: float = Field(ge=0, le=1)


class SignToken(BaseModel):
    gloss: str
    duration_ms: int = Field(alias="durationMs", ge=100, le=5000)
    expression: Literal["neutral", "happy", "urgent", "question"] = "neutral"
    handshape: str = "open-palm"


class FrameTranslationRequest(BaseModel):
    image_data_url: str
    language: LanguageCode = LanguageCode.asl
    confidence_threshold: float = 0.65


class SpeechTranslationRequest(BaseModel):
    audio_data_url: str
    language: LanguageCode = LanguageCode.en


class TextTranslationRequest(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    language: LanguageCode = LanguageCode.asl


class DetectionResponse(BaseModel):
    label: str
    confidence: float = Field(ge=0, le=1)
    fps: int = 0
    generated_text: str = Field(alias="generatedText")
    speech_url: str | None = Field(default=None, alias="speechUrl")
    bounding_boxes: list[BoundingBox] = Field(default_factory=list, alias="boundingBoxes")
    landmarks: list[Landmark] = Field(default_factory=list)


class ImageTranslationResponse(DetectionResponse):
    animated_recreation: list[SignToken] = Field(default_factory=list, alias="animatedRecreation")


class TextToSignResponse(BaseModel):
    normalized_text: str = Field(alias="normalizedText")
    tokens: list[SignToken]


class SpeechToSignResponse(BaseModel):
    transcript: str
    tokens: list[SignToken]


class ConversationMessage(BaseModel):
    id: str
    speaker: Literal["deaf-user", "hearing-user", "assistant"]
    modality: Literal["sign", "speech", "text"]
    text: str
    confidence: float | None = None
    timestamp: datetime


class AnalyticsSummary(BaseModel):
    accuracy: float
    session_length_minutes: int = Field(alias="sessionLengthMinutes")
    words_recognized: int = Field(alias="wordsRecognized")
    common_signs: list[str] = Field(alias="commonSigns")
    usage_trend: list[int] = Field(alias="usageTrend")


class DatasetInfo(BaseModel):
    key: str
    name: str
    languages: list[str]
    access: str
    url: str
    license_note: str
