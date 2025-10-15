from . import app
from .core.config import settings

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/settings")
def read_settings():
    return settings.model_dump(mode="json")