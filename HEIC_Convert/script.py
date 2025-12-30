import os
from PIL import Image
import pillow_heif

# 注册 HEIC 支持
pillow_heif.register_heif_opener()

# 修改为你的文件夹路径
INPUT_DIR = r"D:\courses\交互综合\Portfolio_Website\HEIC_Convert\heic_files"
OUTPUT_DIR = r"D:\courses\交互综合\Portfolio_Website\HEIC_Convert\png_files"

os.makedirs(OUTPUT_DIR, exist_ok=True)

for filename in os.listdir(INPUT_DIR):
    if filename.lower().endswith(".heic"):
        input_path = os.path.join(INPUT_DIR, filename)
        output_path = os.path.join(
            OUTPUT_DIR,
            os.path.splitext(filename)[0] + ".png"
        )

        with Image.open(input_path) as img:
            img.save(output_path, "PNG")

        print(f"Converted: {filename}")
