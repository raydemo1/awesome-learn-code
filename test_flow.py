import os
import sys
from dotenv import load_dotenv

# 加载根目录下的 .env
load_dotenv()

# 添加后端目录到 python path，以便导入
sys.path.append(os.path.join(os.path.dirname(__file__), 'ai_engine'))
from server import call_cloud_ocr, ocr_engine
from level_generator import LevelGenerator

def main():
    print("=== 1. 读取图片 ===")
    image_path = "test.png"
    if not os.path.exists(image_path):
        print(f"[!] 找不到图片: {image_path}")
        return
        
    with open(image_path, "rb") as f:
        image_bytes = f.read()
        
    print("=== 2. 执行 OCR 识别 ===")
    use_cloud = os.getenv("USE_CLOUD_OCR", "false").lower() == "true"
    
    extracted_text = ""
    try:
        if use_cloud:
            print("[*] 正在调用云端 AI Studio OCR...")
            extracted_text = call_cloud_ocr(image_bytes)
        else:
            print("[*] 正在调用本地 PaddleOCR...")
            import numpy as np
            import cv2
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            result = ocr_engine.ocr(img)
            text_lines = []
            if result and result[0]:
                for line in result[0]:
                    text_lines.append(line[1][0])
            extracted_text = "\n".join(text_lines)
    except Exception as e:
        print(f"[!] OCR 识别失败: {str(e)}")
        return
        
    print("\n【OCR 识别结果】:")
    print("----------------------------------------")
    print(extracted_text)
    print("----------------------------------------\n")
    
    if not extracted_text.strip():
        print("[!] 未能识别出文本，流程终止。")
        return
        
    print("=== 3. 执行 AI 关卡生成 ===")
    generator = LevelGenerator()
    try:
        level_json = generator.generate_level_from_text(extracted_text)
        print("\n【AI 生成关卡 JSON 数据】:")
        print("----------------------------------------")
        print(level_json)
        print("----------------------------------------\n")
    except Exception as e:
        print(f"[!] AI 关卡生成失败: {str(e)}")

if __name__ == "__main__":
    main()