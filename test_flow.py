import os
import sys
from dotenv import load_dotenv

# 加载根目录下的 .env
load_dotenv()

# 添加后端目录到 python path，以便导入
sys.path.append(os.path.join(os.path.dirname(__file__), 'ai_engine'))
from server import call_cloud_ocr
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
    extracted_text = ""
    try:
        # 直接使用云端 OCR
        print("[*] 正在调用云端 OCR API...")
        # 为了测试这里只是模拟一下逻辑，因为需要上传图片字节流
        # 如果需要测试真实云端 OCR，可以直接调用 server.py 的接口
        print("[*] 提示：云端 OCR 已在 server.py 中全面开启")
        extracted_text = call_cloud_ocr(image_bytes)
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