from pathlib import Path

import yaml
from fastapi import APIRouter

from app.schemas import DatasetInfo

router = APIRouter()

CATALOG_CANDIDATES = [
    Path(__file__).resolve().parents[1] / "data" / "dataset_catalog.yaml",
    Path(__file__).resolve().parents[3] / "ml" / "datasets" / "catalog.yaml",
]


def _catalog_path() -> Path:
    for candidate in CATALOG_CANDIDATES:
        if candidate.exists():
            return candidate
    raise FileNotFoundError("Dataset catalog not found")


@router.get("/catalog", response_model=list[DatasetInfo])
def catalog() -> list[DatasetInfo]:
    with _catalog_path().open("r", encoding="utf-8") as handle:
        payload = yaml.safe_load(handle)
    return [DatasetInfo(**item) for item in payload["datasets"]]
