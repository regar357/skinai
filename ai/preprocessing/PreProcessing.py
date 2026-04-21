import os
import shutil
import json
from PIL import Image

# 1. 경로 설정 및 초기화
BASE_DIR = r"E:\머학\4-1\1. 종프\학습데이터" # 학습데이터 경로
OUTPUT_DIR = os.path.join(BASE_DIR, "YOLO_Dataset_Leak_Free") # 전처리 폴더 위치

FACE_DATA_DIR = os.path.join(BASE_DIR, r"14.안면부 피부질환 이미지 합성데이터\3.개방데이터\1.데이터")
TUMOR_DATA_DIR = os.path.join(BASE_DIR, r"15.피부종양 이미지 합성데이터\3.개방데이터\1.데이터")

FACE_CLASSES = ["건선", "아토피", "여드름", "정상", "주사", "지루"]
TUMOR_CLASSES = ["광선각화증", "기저세포암", "멜라닌세포모반", "보웬병", "비립종", "사마귀", 
                 "악성흑색종", "지루각화증", "편평세포암", "표피낭종", "피부섬유종", "피지샘증식증", 
                 "혈관종", "화농 육아종", "흑색점"]

TARGET_SIZE = (224, 224)

# 2. 출력 디렉토리 생성 (train, val만 생성)
for split in ["train", "val"]:
    for cls in FACE_CLASSES + TUMOR_CLASSES:
        os.makedirs(os.path.join(OUTPUT_DIR, split, cls), exist_ok=True)

# 3. 데이터 리사이징 및 복사 함수 
def process_and_copy(dataset_dir, classes, is_face_data=False):
    # 원본 폴더 순회 (Training -> train, Validation -> val)
    for orig_split, target_split in [("Training", "train"), ("Validation", "val")]:
        img_base = os.path.join(dataset_dir, orig_split, "01.원천데이터")
        lbl_base = os.path.join(dataset_dir, orig_split, "02.라벨링데이터")
        
        img_prefix = "TS_" if orig_split == "Training" else "VS_"
        lbl_prefix = "TL_" if orig_split == "Training" else "VL_"
        
        for cls in classes:
            folder_suffix = f"{cls}_측면" if is_face_data else f"{cls}"
            img_folder = os.path.join(img_base, f"{img_prefix}{folder_suffix}")
            lbl_folder = os.path.join(lbl_base, f"{lbl_prefix}{folder_suffix}")
            
            if not os.path.exists(img_folder) or not os.path.exists(lbl_folder):
                continue
            
            count = 0
            for file_name in os.listdir(img_folder):
                if file_name.endswith(".png"):
                    img_src = os.path.join(img_folder, file_name)
                    lbl_name = file_name.replace(".png", ".json")
                    lbl_src = os.path.join(lbl_folder, lbl_name)
                    
                    if os.path.exists(lbl_src):
                        img_dst = os.path.join(OUTPUT_DIR, target_split, cls, file_name)
                        lbl_dst = os.path.join(OUTPUT_DIR, target_split, cls, lbl_name)
                        
                        try:
                            # 이미지 리사이징 (224x224)
                            with Image.open(img_src) as img:
                                resized_img = img.resize(TARGET_SIZE, Image.LANCZOS)
                                if resized_img.mode != 'RGB':
                                    resized_img = resized_img.convert('RGB')
                                resized_img.save(img_dst, format='PNG', optimize=True)
                            
                            # 라벨 복사
                            shutil.copy2(lbl_src, lbl_dst)
                            count += 1
                        except Exception as e:
                            print(f"오류 ({img_src}): {e}")
                            
            print(f"[{cls}] {orig_split} -> {target_split} 복사 완료: {count}개")

# 4. 실행
print("안면부 피부질환 데이터 전처리 중")
process_and_copy(FACE_DATA_DIR, FACE_CLASSES, is_face_data=True)

print("\n피부종양 데이터 전처리 중")
process_and_copy(TUMOR_DATA_DIR, TUMOR_CLASSES, is_face_data=False)

print(f"완료. 데이터셋 위치: {OUTPUT_DIR}")