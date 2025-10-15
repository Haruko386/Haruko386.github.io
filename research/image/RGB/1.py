import os
import glob
from pathlib import Path

def rename_images():
    # 获取当前脚本所在目录
    current_dir = Path(__file__).parent
    
    # 支持的图片格式
    image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.gif', '*.bmp', '*.tiff', '*.webp']
    
    # 获取所有图片文件
    image_files = []
    for extension in image_extensions:
        image_files.extend(glob.glob(str(current_dir / extension)))
        image_files.extend(glob.glob(str(current_dir / extension.upper())))
    
    # 按文件名排序
    image_files.sort()
    
    # 计算需要的数字位数
    total_images = len(image_files)
    if total_images == 0:
        print("未找到任何图片文件！")
        return
    
    num_digits = len(str(total_images - 1))
    if num_digits < 2:
        num_digits = 2
    
    print(f"找到 {total_images} 个图片文件，开始重命名...")
    
    # 重命名文件
    renamed_count = 0
    for i, old_path in enumerate(image_files):
        old_file = Path(old_path)
        extension = old_file.suffix
        
        # 生成新文件名，如：00.jpg, 01.png, 等等
        new_name = f"{i:0{num_digits}d}{extension}"
        new_path = old_file.parent / new_name
        
        try:
            # 如果目标文件已存在，先跳过（可能是之前已经重命名过的）
            if not new_path.exists():
                old_file.rename(new_path)
                print(f"重命名: {old_file.name} -> {new_name}")
                renamed_count += 1
            else:
                print(f"跳过: {new_name} 已存在")
        except Exception as e:
            print(f"重命名 {old_file.name} 时出错: {e}")
    
    print(f"重命名完成！成功处理 {renamed_count} 个文件。")

if __name__ == "__main__":
    rename_images()