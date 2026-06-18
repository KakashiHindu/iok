from fastapi import FastAPI

from app.main import app as _app

app: FastAPI = _app

__all__ = ["app"]
