import os
import torch
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
from datetime import datetime

# 1. FastAPI 앱 초기화 및 CORS 설정 
app = FastAPI(title="SkinAI 통합 AI 서버")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. 모델 로드 및 GPU 설정
if not torch.cuda.is_available():
    print("GPU를 사용할 수 없어 CPU로 가동합니다.")
DEVICE = '0' if torch.cuda.is_available() else 'cpu'

# 실제 학습된 모델 파일 경로
MODEL_PATH = r"./model/best.pt"
model = YOLO(MODEL_PATH)

# 3. [사용자용] 진단 예측 API
@app.post("/api/v1/predict")
async def predict_skin_disease(file: UploadFile = File(...)):
    try:
        # 이미지 읽기
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # YOLO 예측 
        results = model.predict(image, device=DEVICE)
        
        # 결과 추출
        top1_index = results[0].probs.top1
        confidence = results[0].probs.top1conf.item()
        disease_name = results[0].names[top1_index]

        # 관리자/사용자 API 명세서 규격에 맞춘 리턴
        return {
            "success": True,
            "data": {
                "diseaseName": disease_name,        # 의심질환명
                "probability": int(confidence * 100), # 확률 (Integer 0-100)
                "testDate": datetime.now().strftime("%Y.%m.%d"),
                "createdAt": datetime.now().isoformat()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. [관리자용] AI 모니터링 - 모델 정보 조회 API
@app.get("/api/admin/monitoring/model-info")
async def get_model_info():
    return {
        "status": 200,
        "body": {
            "modelVersion": "YOLOv8-cls SkinAI v1.0",
            "lastTrained": "2026-05-14", # 실제 마지막 학습일로 수정
            "dataset": "AI Hub Skin Disease Dataset (15,120 images)",
            "architecture": "YOLOv8-Nano Classification",
            "inputSize": "256x256 RGB",
            "classes": "21개 질환 클래스"
        }
    }

# 5. [관리자용] AI 모니터링 - 시스템 상태 조회 API
@app.get("/api/admin/monitoring/system-status")
async def get_system_status():
    return {
        "status": 200,
        "body": {
            "averageResponseTime": 150, # ms 단위 (예상치)
            "dailyRequests": 0, # DB 연동 전까지는 0으로 표기
            "errorRate": 0.1,
            "uptime": 99.9
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)