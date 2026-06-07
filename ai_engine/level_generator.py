import os
import json
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from openai import OpenAI
from dotenv import load_dotenv

# 加载环境变量 (如 OPENAI_API_KEY)
load_dotenv()

# ==========================================
# 定义输出的 JSON 数据结构 (使用 Pydantic)
# ==========================================
class Option(BaseModel):
    id: str = Field(..., description="选项标识，如 'A', 'B', 'C', 'D'")
    text: str = Field(..., description="选项的具体内容代码或描述，如 'right - 1'")
    is_correct: bool = Field(..., description="该选项是否是正确答案")
    damage: int = Field(default=0, description="如果是正确答案，对怪兽造成的伤害值（如 20）")
    feedback: str = Field(..., description="玩家选择该选项后得到的反馈或辅导提示")

class Step(BaseModel):
    step_id: int = Field(..., description="当前回合/步骤的序号")
    description: str = Field(..., description="描述当前算法执行到了什么状态")
    visual_state: Dict[str, Any] = Field(..., description="用于前端渲染的数据结构状态（如当前数组的内容，各个指针的位置等）")
    question: str = Field(..., description="向玩家提问，要求预测下一步的状态或代码")
    options: List[Option] = Field(..., description="提供给玩家的 2-4 个选项")

class LevelData(BaseModel):
    monster_name: str = Field(..., description="基于算法生成的具有 RPG 风格的怪兽名字，如 '混乱双指针巨魔'")
    total_steps: int = Field(..., description="击败怪兽所需的总回合数")
    steps: List[Step] = Field(..., description="具体的回合数据列表")

# ==========================================
# 核心生成器类
# ==========================================
class LevelGenerator:
    def __init__(self, api_key: str = None, base_url: str = None, model_name: str = None):
        """
        初始化 AI 关卡生成引擎
        支持兼容 OpenAI 接口的大模型 (如 DeepSeek, Claude, GPT-4)
        """
        self.client = OpenAI(
            api_key=api_key or os.getenv("OPENAI_API_KEY", "mock-api-key"),
            base_url=base_url or os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
        )
        self.model_name = model_name or os.getenv("MODEL_NAME", "gpt-4o")
        
        self.system_prompt = """
        你是一个天才的算法游戏关卡设计师。你的任务是将用户提供的“数据结构与算法题目”转换为回合制打怪 RPG 游戏的关卡数据。
        
        【设计原则】
        1. 题目 = Boss。算法的关键迭代步骤 = 战斗回合。
        2. 每一回合，你需要展示当前的数据结构状态 (visual_state)，并向玩家提问下一步该怎么做。
        3. 必须提供 2-4 个选项，只有一个是正确的。
        4. 正确选项会造成伤害；错误选项必须提供有教育意义的反馈 (feedback)，指出玩家的思维误区。
        5. visual_state 必须是一个键值对字典，方便前端进行可视化渲染（例如包含 array, pointers, current_node 等）。
        
        【输出格式】
        你必须输出合法的 JSON 格式数据，并且严格符合以下结构：
        {
            "monster_name": "怪兽名称",
            "total_steps": 3,
            "steps": [
                {
                    "step_id": 1,
                    "description": "描述当前状态",
                    "visual_state": {"array": [1,2,3], "left": 0},
                    "question": "下一步该怎么做？",
                    "options": [
                        {"id": "A", "text": "...", "is_correct": true, "damage": 20, "feedback": "回答正确！"}
                    ]
                }
            ]
        }
        """

    def generate_level_from_text(self, problem_text: str) -> str:
        """
        输入算法题干（模拟 OCR 识别后的文本），返回生成的 JSON 关卡数据字符串
        """
        print(f"[*] 正在请求 AI 拆解算法题目: {problem_text[:15].strip()}...")
        
        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": f"请为以下算法题目设计游戏关卡：\n\n{problem_text}"}
            ],
            response_format={"type": "json_object"},
            temperature=0.7
        )
        
        return response.choices[0].message.content
