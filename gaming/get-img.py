import os
import json

# 定义图片文件夹路径 (相对于脚本所在目录)
current_dir = os.getcwd()
# 假设你的图片都放在这个目录下，并且有子目录结构，例如 img/devil-may-cry-5/xxx.jpg
img_dir = os.path.join(current_dir, 'img') 
json_path = os.path.join(current_dir, 'images.json')

image_paths = []

# 确保图片目录存在
if not os.path.exists(img_dir):
    print(f"Error: Directory '{img_dir}' does not exist.")
    exit()

print(f"Scanning directory: {img_dir}")

# 遍历目录和子目录
for root, dirs, files in os.walk(img_dir):
    for file in files:
        # 检查文件扩展名
        if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.avif', '.webp')):
            # 获取文件的绝对路径
            full_path = os.path.join(root, file)
            
            # 获取相对于脚本所在目录（网站根目录）的相对路径
            # 例如: img/devil-may-cry-5/20241124102701_1.jpg
            relative_path = os.path.relpath(full_path, current_dir)
            
            # 将路径分隔符统一为正斜杠 /，以确保在 Web 上的兼容性
            relative_path = relative_path.replace(os.sep, '/')
            
            image_paths.append(relative_path)
            print(f"Found: {relative_path}")

# 将路径列表写入 JSON 文件
try:
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(image_paths, f, ensure_ascii=False, indent=4)
    print(f"\nSuccessfully saved {len(image_paths)} image paths to {json_path}")
except Exception as e:
    print(f"Error writing JSON file: {e}")

# 运行提示：
# 请确保在运行此脚本前，你的目录结构如下：
# /your-website-root/
#   ├── index.html
#   ├── get-img.py
#   └── img/
#       ├── devil-may-cry-5/
#       │   └── screenshot1.jpg
#       └── other-game/
#           └── screenshot2.png