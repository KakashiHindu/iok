from pathlib import Path

import yaml


def test_catalog_contains_online_sources() -> None:
    catalog = yaml.safe_load(Path("ml/datasets/catalog.yaml").read_text(encoding="utf-8"))
    keys = {dataset["key"] for dataset in catalog["datasets"]}
    assert {"wlasl", "ms_asl", "indian_sign_language"}.issubset(keys)
