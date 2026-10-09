import os
import wave
import struct
import math
import random
import sys

# 设置默认控制台输出兼容
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

SAMPLE_RATE = 44100
DURATION_SECONDS = 60  # 每首 60 秒高保真无缝循环单曲 (支持手机单曲循环)

CHAKRA_TRACKS = [
    {
        "file": "Day1_海底轮_396Hz_扎根释惧.wav",
        "name": "海底轮 · 扎根与安全感",
        "base_freq": 396.0,
        "beat_diff": 4.5
    },
    {
        "file": "Day2_本我轮_417Hz_情绪流动.wav",
        "name": "本我轮 · 情绪释放与愉悦",
        "base_freq": 417.0,
        "beat_diff": 5.0
    },
    {
        "file": "Day3_太阳轮_528Hz_自信奇迹.wav",
        "name": "太阳神经丛 · 自信与魄力",
        "base_freq": 528.0,
        "beat_diff": 6.0
    },
    {
        "file": "Day4_心轮_639Hz_自爱愈合.wav",
        "name": "心轮 · 自爱与深层接纳",
        "base_freq": 639.0,
        "beat_diff": 7.0
    },
    {
        "file": "Day5_喉轮_741Hz_发声表达.wav",
        "name": "喉轮 · 真实发声与直觉表达",
        "base_freq": 741.0,
        "beat_diff": 7.83
    },
    {
        "file": "Day6_眉心轮_852Hz_直觉清明.wav",
        "name": "眉心轮 · 直觉洞察与心灵清澈",
        "base_freq": 852.0,
        "beat_diff": 8.5
    },
    {
        "file": "Day7_顶轮_963Hz_万物臣服.wav",
        "name": "顶轮 · 纯粹宁静与宇宙意识",
        "base_freq": 963.0,
        "beat_diff": 4.0
    }
]

def generate_chakra_track(track_info, output_path):
    print(f"正在合成: {track_info['file']} ({track_info['base_freq']}Hz)...")
    total_samples = int(SAMPLE_RATE * DURATION_SECONDS)
    
    base_l = track_info["base_freq"]
    base_r = track_info["base_freq"] + track_info["beat_diff"]
    
    # 呼吸调频包络 (8秒呼吸周期)
    breath_period = 8.0
    fade_in_samples = int(SAMPLE_RATE * 3.0)     # 3秒平滑淡入
    fade_out_samples = int(SAMPLE_RATE * 4.0)    # 4秒平滑淡出

    with wave.open(output_path, 'w') as wav:
        wav.setnchannels(2)      # 立体声 (双耳节拍)
        wav.setsampwidth(2)      # 16-bit
        wav.setframerate(SAMPLE_RATE)
        
        frames = bytearray()
        chunk_size = 4096
        noise_buffer = [random.uniform(-0.015, 0.015) for _ in range(chunk_size)]

        for i in range(total_samples):
            t = i / SAMPLE_RATE
            
            # 淡入淡出增益
            gain = 1.0
            if i < fade_in_samples:
                gain = i / fade_in_samples
            elif i > total_samples - fade_out_samples:
                gain = (total_samples - i) / fade_out_samples
            
            # 8秒呼吸起伏振幅调制
            breath = 0.90 + 0.10 * math.sin(2.0 * math.pi * t / breath_period)
            current_amp = gain * breath * 0.45

            # 基础正弦波
            sine_l = math.sin(2.0 * math.pi * base_l * t)
            sine_r = math.sin(2.0 * math.pi * base_r * t)
            
            # 次谐波仿颂钵共振
            sub_l = 0.22 * math.sin(2.0 * math.pi * (base_l * 0.5) * t)
            sub_r = 0.22 * math.sin(2.0 * math.pi * (base_r * 0.5) * t)
            
            # 自然环境微风白噪音
            ambient = noise_buffer[i % chunk_size]
            
            # 合成采样
            sample_l = (sine_l + sub_l + ambient) * current_amp
            sample_r = (sine_r + sub_r + ambient) * current_amp
            
            val_l = int(max(-0.95, min(0.95, sample_l)) * 32767)
            val_r = int(max(-0.95, min(0.95, sample_r)) * 32767)
            
            frames.extend(struct.pack('<hh', val_l, val_r))
            
            if len(frames) >= chunk_size * 4:
                wav.writeframes(frames)
                frames = bytearray()
                
        if len(frames) > 0:
            wav.writeframes(frames)
            
    print(f"[DONE] 生成完成: {os.path.basename(output_path)}")

def main():
    target_dir = os.path.join(os.path.dirname(__file__), "..", "7天脉轮身心自愈包", "01_7天特定赫兹脉轮音频")
    os.makedirs(target_dir, exist_ok=True)
    
    for item in CHAKRA_TRACKS:
        out_file = os.path.join(target_dir, item["file"])
        generate_chakra_track(item, out_file)
    print("全部 7 首脉轮高保真赫兹音频已生成完毕！")

if __name__ == "__main__":
    main()
