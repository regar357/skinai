import os
import glob
import shutil
import random
from collections import defaultdict

def split_dataset_by_patient():
    # 1. 경로 설정 
    src_root = r"E:\머학\4-1\1. 종프\학습데이터\YOLO_try1" 
    # 새로 만들어질 데이터셋 
    dst_root = r"E:\머학\4-1\1. 종프\학습데이터\YOLO_Final_0510"

    # 비율 설정 
    split_ratio = {'train': 0.8, 'val': 0.1, 'test': 0.1}

    # 2. 모든 이미지 파일 수집 
    # Training/[질병명]/*.png 형식을 찾기
    all_image_paths = glob.glob(os.path.join(src_root, "**", "*.png"), recursive=True)
    all_image_paths += glob.glob(os.path.join(src_root, "**", "*.jpg"), recursive=True)

    print(f"총 {len(all_image_paths)}개의 이미지를 발견")

    # 3. 환자 ID별로 이미지 그룹화
    # 파일명 예시: Z4_69014_P0_L0.png -> '69014' 추출
    patient_to_images = defaultdict(list)
    
    for img_path in all_image_paths:
        filename = os.path.basename(img_path)
        parts = filename.split('_')
        
        if len(parts) >= 2:
            patient_id = parts[1] # 환자 고유 번호 추출
            # 클래스명(질병명)은 파일이 속한 폴더명으로 파악
            class_name = os.path.basename(os.path.dirname(img_path))
            patient_to_images[patient_id].append((img_path, class_name))

    patient_ids = list(patient_to_images.keys())
    random.seed(42) # 결과 재현성을 위해 시드 고정
    random.shuffle(patient_ids)

    # 4. 환자 ID 기준으로 분할 지점 계산
    total_patients = len(patient_ids)
    train_end = int(total_patients * split_ratio['train'])
    val_end = train_end + int(total_patients * split_ratio['val'])

    splits = {
        'train': patient_ids[:train_end],
        'val': patient_ids[train_end:val_end],
        'test': patient_ids[val_end:]
    }

    # 5. 파일 복사 수행
    print("데이터 분할 및 복사를 시작")
    
    for split_name, ids in splits.items():
        for p_id in ids:
            for src_path, class_name in patient_to_images[p_id]:
                # 목적지 폴더 생성 (dataset/train/건선/파일명.png)
                target_dir = os.path.join(dst_root, split_name, class_name)
                os.makedirs(target_dir, exist_ok=True)
                
                # 파일 복사
                shutil.copy2(src_path, os.path.join(target_dir, os.path.basename(src_path)))

    print(f"전처리 완료. 새 데이터셋 위치: {dst_root}")
    print(f"환자 분포 - Train: {len(splits['train'])}, Val: {len(splits['val'])}, Test: {len(splits['test'])}")

if __name__ == "__main__":
    split_dataset_by_patient()