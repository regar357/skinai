from fastapi import FastAPI
from ultralytics import YOLO

app = FastAPI()

# Load YOLO model (assuming model is trained and saved locally)
# model = YOLO('path/to/your/model.pt')  # Uncomment and set path when model is ready

@app.get("/")
async def root():
    return {"message": "Hello from FastAPI AI Server"}
