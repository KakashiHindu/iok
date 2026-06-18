from pathlib import Path

import yaml
from fastapi import APIRouter

from app.schemas import DatasetInfo

router = APIRouter()
CATALOG_PATH = Path(__file__).resolve().parents[3] / "ml" / "datasets" / "catalog.yaml"


@router.get("/catalog", response_model=list[DatasetInfo])
def catalog() -> list[DatasetInfo]:
    with CATALOG_PATH.resolve().open("r", encoding="utf-8") as handle:
        payload = yaml.safe_load(handle)
    return [DatasetInfo(**item) for item in payload["datasets"]]
