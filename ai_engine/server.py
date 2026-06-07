import os
import base64
import requests
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import time
from level_generator import LevelGenerator

app = FastAPI()

def call_cloud_ocr(image_bytes: bytes) -> str:
    """调用 AI Studio PaddleOCR API"""
    TOKEN = os.getenv("TOKEN", "788efd29dd454e7329146f5cde4c4cf84912a528").strip('"').strip("'")
    JOB_URL = "https://paddleocr.aistudio-app.com/api/v2/ocr/jobs"
    MODEL = os.getenv("MODEL", "PaddleOCR-VL-1.6").strip('"').strip("'")

    headers = {
        "Authorization": f"bearer {TOKEN}",
    }

    optional_payload = {
        "useDocOrientationClassify": False,
        "useDocUnwarping": False,
        "useChartRecognition": False,
    }

    data = {
        "model": MODEL,
        "optionalPayload": json.dumps(optional_payload)
    }

    files = {"file": ("image.png", image_bytes)}
    job_response = requests.post(JOB_URL, headers=headers, data=data, files=files)
    
    if job_response.status_code != 200:
        raise Exception(f"提交 OCR 任务失败: {job_response.text}")
        
    jobId = job_response.json()["data"]["jobId"]
    
    jsonl_url = ""
    while True:
        job_result_response = requests.get(f"{JOB_URL}/{jobId}", headers=headers)
        if job_result_response.status_code != 200:
            raise Exception(f"查询任务状态失败: {job_result_response.text}")
            
        state = job_result_response.json()["data"]["state"]
        if state == 'done':
            jsonl_url = job_result_response.json()['data']['resultUrl']['jsonUrl']
            break
        elif state == "failed":
            error_msg = job_result_response.json()['data']['errorMsg']
            raise Exception(f"OCR 任务失败: {error_msg}")
        
        time.sleep(2)
        
    if jsonl_url:
        jsonl_response = requests.get(jsonl_url)
        jsonl_response.raise_for_status()
        lines = jsonl_response.text.strip().split('\n')
        
        full_markdown = []
        for line in lines:
            line = line.strip()
            if not line:
                continue
            result = json.loads(line).get("result", {})
            for res in result.get("layoutParsingResults", []):
                full_markdown.append(res.get("markdown", {}).get("text", ""))
                
        return "\n".join(full_markdown)
    return ""

# 允许跨域请求，方便前端调试
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化大模型生成器
generator = LevelGenerator()

class GenerateRequest(BaseModel):
    problem_text: str

@app.post("/api/generate")
async def generate_level(request: GenerateRequest):
    try:
        if not request.problem_text.strip():
            raise HTTPException(status_code=400, detail="题目内容不能为空")
            
        print(f"[*] 收到前端生成请求，正在解析...")
        # 调用生成引擎
        json_str = generator.generate_level_from_text(request.problem_text)
        
        # 将字符串解析为 Python 字典，然后直接作为 JSON 响应返回
        level_data = json.loads(json_str)
        return level_data
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="大模型返回了无效的 JSON 格式")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ocr")
async def ocr_image(file: UploadFile = File(...)):
    try:
        print(f"[*] 收到前端 OCR 请求，文件名: {file.filename}")
        # 读取上传的文件为字节流
        contents = await file.read()
        
        print("[*] 正在调用云端 OCR API...")
        extracted_text = call_cloud_ocr(contents)
        print(f"[*] 云端 OCR 识别完成，提取了文本")
        return {"text": extracted_text}
        
    except Exception as e:
        print(f"[!] OCR 识别失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OCR 识别失败: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("[*] 正在启动 Algorithm RPG Backend Server (端口 8000)...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
