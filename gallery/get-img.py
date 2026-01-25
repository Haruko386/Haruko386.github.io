import os
import json
import re

# 配置
IMG_DIR = "img"  # 图片文件夹名称
JSON_NAME = "images.json" # 输出的json文件名
VALID_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"} # 支持的图片格式

def natural_sort_key(s):
    """
    自然排序辅助函数。
    确保 img_2.jpg 排在 img_10.jpg 前面，而不是后面。
    """
    return [int(text) if text.isdigit() else text.lower()
            for text in re.split('([0-9]+)', s)]

def process_images():
    # 1. 获取基础路径
    base_dir = os.path.dirname(os.path.abspath(__file__))
    target_dir = os.path.join(base_dir, IMG_DIR)
    
    # 检查文件夹是否存在
    if not os.path.exists(target_dir):
        print(f"❌ 错误: 找不到文件夹 '{IMG_DIR}'")
        return

    files = os.listdir(target_dir)
    
    # 2. 【重命名逻辑】
    # 正则表达式匹配已经符合 "img_数字.后缀" 格式的文件
    pattern = re.compile(r'^img_(\d+)\.(jpg|jpeg|png|webp|gif)$', re.IGNORECASE)
    
    max_index = 0
    files_to_rename = []

    # 第一遍扫描：找到当前最大的序号，并分离出需要重命名的文件
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext not in VALID_EXTS:
            continue
            
        match = pattern.match(f)
        if match:
            # 如果已经是 img_123.jpg 格式，更新最大序号
            current_num = int(match.group(1))
            if current_num > max_index:
                max_index = current_num
        else:
            # 如果是不符合格式的文件（新加入的），加入待处理列表
            files_to_rename.append(f)
    
    # 对待重命名的文件排序（防止每次运行顺序不一致）
    files_to_rename.sort()

    # 开始重命名新文件
    count_renamed = 0
    for old_name in files_to_rename:
        max_index += 1 # 序号递增
        ext = os.path.splitext(old_name)[1].lower()
        new_name = f"img_{max_index}{ext}"
        
        old_path = os.path.join(target_dir, old_name)
        new_path = os.path.join(target_dir, new_name)
        
        os.rename(old_path, new_path)
        print(f"🔄 重命名: {old_name} -> {new_name}")
        count_renamed += 1

    if count_renamed == 0:
        print("✅ 没有发现需要重命名的新文件。")
    else:
        print(f"✅ 成功重命名了 {count_renamed} 个文件。")

    # 3. 【JSON 生成逻辑】
    # 重新扫描文件夹以获取最新状态
    all_files = os.listdir(target_dir)
    valid_images = []

    # 筛选图片并排序
    for f in all_files:
        ext = os.path.splitext(f)[1].lower()
        if ext in VALID_EXTS:
            valid_images.append(f)
            
    # 使用自然排序 (img_1, img_2 ... img_10)
    valid_images.sort(key=natural_sort_key)
    
    # 生成带 img/ 前缀的路径列表
    # 注意：Web路径强制使用 "/" (即使在Windows上)
    json_paths = [f"{IMG_DIR}/{filename}" for filename in valid_images]

    # 写入 JSON
    output_path = os.path.join(base_dir, JSON_NAME)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(json_paths, f, indent=2, ensure_ascii=False)

    print(f"📊 已更新 {JSON_NAME}，包含 {len(json_paths)} 张图片。")
    print(f"   路径示例: {json_paths[0] if json_paths else '无'}")

if __name__ == "__main__":
    process_images()