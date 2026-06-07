import json
from level_generator import LevelGenerator

def main():
    # 模拟一道经典的 LeetCode 题目（在真实场景中，这段文本由 OCR 从截图提取）
    problem_text = """
    题目：反转链表
    给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。
    示例 1：
    输入：head = [1,2,3,4,5]
    输出：[5,4,3,2,1]
    """
    
    # 实例化生成器
    # 注意：运行前需在环境变量中配置 OPENAI_API_KEY
    # 如果您使用的是 DeepSeek (推荐，性价比极高)，可以像下面这样覆盖参数：
    # generator = LevelGenerator(
    #     api_key="your-deepseek-api-key", 
    #     base_url="https://api.deepseek.com/v1",
    #     model_name="deepseek-chat"
    # )
    generator = LevelGenerator()
    
    try:
        # 生成关卡 JSON
        result_json_str = generator.generate_level_from_text(problem_text)
        
        # 格式化输出以供查看
        parsed_json = json.loads(result_json_str)
        print("\n[+] 关卡生成成功！\n")
        print(json.dumps(parsed_json, indent=2, ensure_ascii=False))
        
    except Exception as e:
        print(f"\n[-] 运行出错: {e}")
        print("💡 提示: 请确保您在代码中填入了有效的大模型 API Key (如 OpenAI, DeepSeek, 或者智谱 GLM 等)。")

if __name__ == "__main__":
    main()
