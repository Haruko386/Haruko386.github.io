import os
import json

def scan_images(root_dir, exts=(".jpg", ".jpeg", ".png")):
    image_paths = []
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.lower().endswith(exts):
                full_path = os.path.join(root, file)
                # 转成相对路径
                rel_path = os.path.relpath(full_path, root_dir)
                image_paths.append(rel_path.replace("\\", "/"))  # 统一成正斜杠
    return image_paths

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))

    images = scan_images(current_dir)

    output_path = os.path.join(current_dir, "images.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(images, f, indent=2, ensure_ascii=False)

    print(f"共找到 {len(images)} 张图片")
    print(f"已写入: {output_path}")
