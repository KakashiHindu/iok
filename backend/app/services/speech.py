import base64
import tempfile
from pathlib import Path


class SpeechRecognizer:
    def transcribe_data_url(self, audio_data_url: str, language: str) -> str:
        try:
            import whisper
        except Exception:
            return "Speech transcription fallback: audio received for sign conversion."
        encoded = audio_data_url.split(",", 1)[-1]
        audio_bytes = base64.b64decode(encoded)
        with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as handle:
            handle.write(audio_bytes)
            temp_path = Path(handle.name)
        try:
            model = whisper.load_model("base")
            result = model.transcribe(str(temp_path), language=None if language == "hinglish" else language)
            return str(result.get("text", "")).strip()
        finally:
            temp_path.unlink(missing_ok=True)
