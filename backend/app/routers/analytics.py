from fastapi import APIRouter

from app.schemas import AnalyticsSummary

router = APIRouter()


@router.get("/summary", response_model=AnalyticsSummary)
def summary() -> AnalyticsSummary:
    return AnalyticsSummary(
        accuracy=0.93,
        sessionLengthMinutes=18,
        wordsRecognized=1248,
        commonSigns=["HELLO", "THANK YOU", "HELP", "WATER"],
        usageTrend=[8, 12, 15, 19, 23, 26, 31],
    )
