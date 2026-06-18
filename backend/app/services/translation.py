from app.schemas import DetectionResponse, ImageTranslationResponse, LanguageCode
from app.services.gesture_classifier import GestureClassifier
from app.services.image_utils import decode_data_url_image
from app.services.landmarks import create_landmark_extractor
from app.services.text_to_sign import text_to_sign_tokens


class TranslationService:
    def __init__(self) -> None:
        self.landmarks = create_landmark_extractor()
        self.classifier = GestureClassifier()

    def translate_frame(self, image_data_url: str, language: LanguageCode, confidence_threshold: float = 0.65) -> DetectionResponse:
        image = decode_data_url_image(image_data_url)
        landmark_result = self.landmarks.extract(image)
        label, confidence = self.classifier.predict(landmark_result.landmarks, language)
        generated = f"Detected {label.lower()}" if confidence >= confidence_threshold else "Detection confidence is low; please sign again slowly."
        return DetectionResponse(
            label=label,
            confidence=confidence,
            fps=25,
            generatedText=generated,
            boundingBoxes=landmark_result.bounding_boxes,
            landmarks=landmark_result.landmarks,
        )

    def translate_image(self, image_data_url: str, language: LanguageCode) -> ImageTranslationResponse:
        detection = self.translate_frame(image_data_url, language)
        return ImageTranslationResponse(
            **detection.model_dump(by_alias=True),
            animatedRecreation=text_to_sign_tokens(detection.label, language),
        )


translation_service = TranslationService()
