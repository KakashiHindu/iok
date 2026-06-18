from __future__ import annotations

import argparse
import json
import urllib.request
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import yaml


def load_catalog(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)


def download_url(url: str, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    request = urllib.request.Request(url, headers={"User-Agent": "SignBridgeAI/0.1"})
    with urllib.request.urlopen(request, timeout=60) as response:
        output_path.write_bytes(response.read())


def main() -> None:
    parser = argparse.ArgumentParser(description="Download online sign-language dataset metadata/assets.")
    parser.add_argument("--catalog", type=Path, required=True)
    parser.add_argument("--dataset", required=True, help="Dataset key from catalog.yaml or 'all'.")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    catalog = load_catalog(args.catalog)
    selected = [item for item in catalog["datasets"] if args.dataset == "all" or item["key"] == args.dataset]
    if not selected:
        raise SystemExit(f"Dataset {args.dataset!r} not found")

    provenance: list[dict[str, Any]] = []
    for dataset in selected:
        dataset_dir = args.output / dataset["key"]
        dataset_dir.mkdir(parents=True, exist_ok=True)
        metadata_urls = dataset.get("metadata_urls") or []
        for index, url in enumerate(metadata_urls):
            suffix = Path(url).suffix or ".json"
            target = dataset_dir / f"metadata_{index}{suffix}"
            download_url(url, target)
            provenance.append({"dataset": dataset["key"], "url": url, "path": str(target), "downloaded_at": datetime.now(UTC).isoformat()})
        if not metadata_urls:
            (dataset_dir / "README.requires_manual_access.md").write_text(
                f"# {dataset['name']}\n\nAccess: {dataset['access']}\n\nURL: {dataset['url']}\n\nLicense: {dataset['license_note']}\n",
                encoding="utf-8",
            )
            provenance.append({"dataset": dataset["key"], "url": dataset["url"], "manual_access_required": True})

    (args.output / "provenance.json").write_text(json.dumps(provenance, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
