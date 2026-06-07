from PIL import Image, ImageDraw

def create_sprite(filename, color):
    # 4 frames, 48x32 each -> 192x32
    img = Image.new('RGBA', (192, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    for i in range(4):
        # 模拟呼吸动画 (y 轴上下浮动)
        offset_y = (i % 2) * 2
        # 画一个简单的像素小人 (身体)
        draw.rectangle([i*48 + 16, 8 + offset_y, i*48 + 32, 24 + offset_y], fill=color)
        # 眼睛
        draw.rectangle([i*48 + 20, 12 + offset_y, i*48 + 22, 14 + offset_y], fill=(0,0,0))
        draw.rectangle([i*48 + 26, 12 + offset_y, i*48 + 28, 14 + offset_y], fill=(0,0,0))
        
    img.save(filename)

create_sprite('public/assets/images/hero_idle.png', (100, 200, 255)) # 蓝色的英雄
create_sprite('public/assets/images/goblin_idle.png', (255, 100, 100)) # 红色的怪物
