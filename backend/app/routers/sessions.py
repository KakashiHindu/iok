from datetime import UTC, datetime
from uuid import uuid4

from fastapi import APIRouter

from app.schemas import ConversationMessage

router = APIRouter()

_SESSION_MESSAGES: list[ConversationMessage] = []


@router.get("/{session_id}/messages", response_model=list[ConversationMessage])
def list_messages(session_id: str) -> list[ConversationMessage]:
    return [message for message in _SESSION_MESSAGES if message.id.startswith(session_id)]


@router.post("/{session_id}/messages", response_model=ConversationMessage)
def create_message(session_id: str, message: ConversationMessage) -> ConversationMessage:
    saved = message.model_copy(update={"id": f"{session_id}-{uuid4()}", "timestamp": datetime.now(UTC)})
    _SESSION_MESSAGES.append(saved)
    return saved
