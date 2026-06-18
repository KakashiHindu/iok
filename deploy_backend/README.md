# SignBridge AI deploy backend

Standalone FastAPI package used when the monorepo backend deploy preflight cannot detect nested backend layouts.

```bash
pip install .
uvicorn main:app --host 0.0.0.0 --port 8000
```
