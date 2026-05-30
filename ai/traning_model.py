import os
import glob
from ultralytics import YOLO
from sklearn.metrics import precision_score, recall_score, f1_score

def main():
    # 1. 경로 설정 
    data_path = r"C:\Users\User\Desktop\SkinAI\YOLO_Final_0510" 
    # 학습 결과물이 저장될 폴더 경로
    project_path = r"C:\Users\User\Desktop\SkinAI\YOLO_Training_Result"

    # 2. 모델 로드 
    model = YOLO('yolov8n-cls.pt') 

    # 3. 모델 학습 시작 (Train & Validation)
    results = model.train(
        data=data_path,
        epochs=50,              # 전체 반복 횟수
        patience=15,            # 15번 동안 성능 개선 없으면 조기 종료
        batch=32,               # 배치 사이즈
        lr0=0.001,               # 초기 학습률
        optimizer='Adam',        # 옵티마이저
        dropout=0.5,            # 과적합 방지 
        imgsz=256,              # 이미지 입력 사이즈
        project=project_path,   # 결과물 저장 위치
        name='skin_disease_model_tuned', # 저장 폴더 이름
        exist_ok=True,
        device='0',
        workers=0,
        
        # 데이터 증강 옵션 
        hsv_h=0.015, hsv_s=0.7, hsv_v=0.4, # 색상/채도/명도 무작위 변경 
        degrees=10.0,                      # 사진 ±10도 무작위 회전
        translate=0.1,                     # 10% 무작위 이동
        scale=0.5,                         # 무작위 확대/축소
        fliplr=0.5                         # 50% 확률로 좌우 반전
    )

    print("\n학습 및 검증 완료")


    # 4. Test 셋으로 최종 성능 평가
    print("\nTest 데이터셋으로 최종 성능 평가를 시작")

    test_metrics = model.val(
        data=data_path, 
        split='test'  
    )
    
    test_dir = os.path.join(data_path, 'test')
    y_true = []
    y_pred = []

    # test 폴더 내의 이미지들을 돌면서 정답과 예측값 비교
    for class_name in os.listdir(test_dir):
        class_dir = os.path.join(test_dir, class_name)
        if not os.path.isdir(class_dir): 
            continue

        for img_path in glob.glob(os.path.join(class_dir, "*.png")) + glob.glob(os.path.join(class_dir, "*.jpg")):
            res = model(img_path, verbose=False) 
            pred_class = res[0].names[res[0].probs.top1]
            y_true.append(class_name)
            y_pred.append(pred_class)

    # Macro 지표 계산
    macro_precision = precision_score(y_true, y_pred, average='macro', zero_division=0)
    macro_recall = recall_score(y_true, y_pred, average='macro', zero_division=0)
    macro_f1 = f1_score(y_true, y_pred, average='macro', zero_division=0)
    
    print("\nTest 데이터셋 최종 평가 완료")
    print(f"최종 Top-1 정확도: {test_metrics.top1 * 100:.2f}%")
    print(f"최종 Top-5 정확도: {test_metrics.top5 * 100:.2f}%")
    print(f"Macro Precision (정밀도) : {macro_precision:.4f} ({macro_precision * 100:.2f}%)")
    print(f"Macro Recall    (재현율) : {macro_recall:.4f} ({macro_recall * 100:.2f}%)")
    print(f"Macro F1-Score  (조화평균): {macro_f1:.4f} ({macro_f1 * 100:.2f}%)")
    
# 윈도우 환경에서 PyTorch/YOLO 멀티프로세싱 에러를 막기 위한 코드
if __name__ == '__main__':
    main()