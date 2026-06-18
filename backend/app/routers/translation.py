from fastapi import APIRouter

from app.schemas import (
    DetectionResponse,
    FrameTranslationRequest,
    ImageTranslationResponse,
    SpeechToSignResponse,
    SpeechTranslationRequest,
    TextToSignResponse,
    TextTranslationRequest,
)
from app.services.speech import SpeechRecognizer
from app.services.text_to_sign import normalize_text, text_to_sign_tokens
from app.services.translation import translation_service

router = APIRouter()
speech_recognizer = SpeechRecognizer()


@router.post("/sign-frame", response_model=DetectionResponse)
def translate_sign_frame(payload: FrameTranslationRequest) -> DetectionResponse:
    return translation_service.translate_frame(payload.image_data_url, payload.language, payload.confidence_threshold)


@router.post("/image", response_model=ImageTranslationResponse)
def translate_image(payload: FrameTranslationRequest) -> ImageTranslationResponse:
    return translation_service.translate_image(payload.image_data_url, payload.language)


@router.post("/text-to-sign", response_model=TextToSignResponse)
def text_to_sign(payload: TextTranslationRequest) -> TextToSignResponse:
    return TextToSignResponse(normalizedText=normalize_text(payload.text), tokens=text_to_sign_tokens(payload.text, payload.language))


@router.post("/speech-to-sign", response_model=SpeechToSignResponse)
def speech_to_sign(payload: SpeechTranslationRequest) -> SpeechToSignResponse:
    transcript = speech_recognizer.transcribe_data_url(payload.audio_data_url, payload.language.value)
    return SpeechToSignResponse(transcript=transcript, tokens=text_to_sign_tokens(transcript, payload.language))
