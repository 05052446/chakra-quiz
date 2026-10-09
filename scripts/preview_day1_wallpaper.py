import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont

def draw_artistic_mandala_enhanced(draw, cx, cy, color):
    """
    绘制极简空灵、具有晶石透光感的高阶几何曼陀罗核心
    """
    c_r, c_g, c_b = color

    # 1. 晶石微光外晕 (朝霞金红向外柔和扩散)
    for r in range(75, 40, -2):
        alpha = ((75 - r) / 35.0) ** 1.5 * 0.45
        col = (
            int(250 * (1 - alpha) + (c_r + 20) * alpha),
            int(247 * (1 - alpha) + (c_g + 15) * alpha),
            int(242 * (1 - alpha) + c_b * alpha)
        )
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=col)

    # 2. 核心红宝石聚光核
    for r in range(40, 0, -2):
        alpha = (40 - r) / 40.0
        col = (
            int(250 * (1 - alpha) + c_r * alpha),
            int(247 * (1 - alpha) + c_g * alpha),
            int(242 * (1 - alpha) + c_b * alpha)
        )
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=col)

    # 3. 纤细八芒微光星芒与末端星珠
    ray_inner = 34
    ray_outer = 88
    for i in range(8):
        angle = i * (math.pi / 4)
        x_s = cx + ray_inner * math.cos(angle)
        y_s = cy + ray_inner * math.sin(angle)
        x_e = cx + ray_outer * math.cos(angle)
        y_e = cy + ray_outer * math.sin(angle)
        draw.line([x_s, y_s, x_e, y_e], fill=(c_r, c_g, c_b), width=1)
        # 末端星珠
        dot_r = 3.5
        draw.ellipse([x_e - dot_r, y_e - dot_r, x_e + dot_r, y_e + dot_r], fill=(c_r, c_g, c_b))

    # 4. 晶莹同心纤细星轨
    draw.ellipse([cx - 26, cy - 26, cx + 26, cy + 26], outline=(255, 255, 255), width=2)
    draw.ellipse([cx - 7, cy - 7, cx + 7, cy + 7], fill=(255, 255, 255))

def draw_celestial_dots(draw, cx, cy, r, color, angles=[0, math.pi/2, math.pi, 3*math.pi/2], dot_radius=3):
    """在外圈星轨上绘制古老神圣几何星芒微珠"""
    for a in angles:
        x = cx + r * math.cos(a)
        y = cy + r * math.sin(a)
        draw.ellipse([x - dot_radius, y - dot_radius, x + dot_radius, y + dot_radius], fill=color)

def generate_day1_preview():
    width, height = 1080, 1920

    # 1. 生成带有【特种和纸/胶片温润微呼吸噪点】的高级底色
    base_color = np.array([250, 247, 241], dtype=np.float32)
    # 高斯细腻微颗粒 (标准差 2.0，细密且不抢戏)
    noise = np.random.normal(0, 2.0, (height, width, 1))
    textured = np.clip(base_color + noise, 0, 255).astype(np.uint8)
    textured_rgb = np.repeat(textured, 1, axis=2)

    img = Image.fromarray(textured_rgb, "RGB")
    draw = ImageDraw.Draw(img)

    cx, cy = width // 2, 910
    color = (216, 122, 104)
    c_r, c_g, c_b = color

    # 2. 弥散柔光氛围
    for r in range(480, 50, -10):
        alpha = int(3 + (480 - r) * 0.075)
        fill_color = (
            int(250 * (1 - alpha/255) + c_r * (alpha/255)),
            int(247 * (1 - alpha/255) + c_g * (alpha/255)),
            int(241 * (1 - alpha/255) + c_b * (alpha/255))
        )
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill_color)

    # 3. 精致同心微星轨与【四方星点 (Celestial Dots)】
    ring1_r = 210
    ring2_r = 300
    draw.ellipse([cx - ring1_r, cy - ring1_r, cx + ring1_r, cy + ring1_r], outline=(205, 190, 175), width=1)
    draw.ellipse([cx - ring2_r, cy - ring2_r, cx + ring2_r, cy + ring2_r], outline=(225, 212, 200), width=1)

    # 内圈四正微星珠
    draw_celestial_dots(draw, cx, cy, ring1_r, (185, 168, 152), angles=[0, math.pi/2, math.pi, 3*math.pi/2], dot_radius=2.5)
    # 外圈四隅微星珠
    draw_celestial_dots(draw, cx, cy, ring2_r, (200, 185, 170), angles=[math.pi/4, 3*math.pi/4, 5*math.pi/4, 7*math.pi/4], dot_radius=2)

    # 4. 字体加载：清秀仿宋体
    font_path_fangsong = "C:\\Windows\\Fonts\\simfang.ttf"
    font_en_sub = ImageFont.truetype(font_path_fangsong, 24)
    font_title = ImageFont.truetype(font_path_fangsong, 58)
    font_freq = ImageFont.truetype(font_path_fangsong, 40)
    font_affirmation = ImageFont.truetype(font_path_fangsong, 34)

    # 5. 标题与副标（严格保持在用户确定的黄金位置 y=470 与 y=545）
    draw.text((cx, 470), "—  M U L A D H A R A  ·  3 9 6 H z  —", fill=(145, 132, 120), font=font_en_sub, anchor="mm")
    draw.text((cx, 545), "海  底  轮", fill=(45, 38, 32), font=font_title, anchor="mm")

    # 6. 中间：高阶几何能量曼陀罗核心 (带晶石透光晕)
    draw_artistic_mandala_enhanced(draw, cx, cy, color)

    # 7. 核心频段标注
    draw.text((cx, 1055), "396 Hz", fill=(60, 52, 45), font=font_freq, anchor="mm")

    # 8. 诗意暗示语：优化双行视觉体量平衡（俳句式对称）
    line1 = "“ 我安全地扎根于大地之上，"
    line2 = "世界正以全然的丰盛支持着我 ”"

    draw.text((cx, 1340), line1, fill=(52, 45, 38), font=font_affirmation, anchor="mm")
    draw.text((cx, 1400), line2, fill=(52, 45, 38), font=font_affirmation, anchor="mm")

    # 安全输出
    out_dir = os.path.join("7天脉轮身心自愈包", "03_赠品_7大脉轮能量手机壁纸")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "01_海底轮_扎根安全_壁纸.png")

    img.save(out_file, "PNG")
    print(f"[OK] 精修大片版壁纸已生成: {out_file}")

if __name__ == "__main__":
    generate_day1_preview()
