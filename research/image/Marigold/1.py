import os
import glob
from PIL import Image
import sys

def convert_webp_to_png():
    """
    将当前目录下所有webp文件转换为png格式
    """
    # 获取当前目录
    current_dir = os.getcwd()
    print(f"当前目录: {current_dir}")
    
    # 查找所有webp文件
    webp_files = glob.glob(os.path.join(current_dir, "*.webp"))
    
    if not webp_files:
        print("当前目录下没有找到webp文件")
        return
    
    print(f"找到 {len(webp_files)} 个webp文件")
    
    # 转换每个webp文件
    converted_count = 0
    for webp_file in webp_files:
        try:
            # 生成输出文件名
            base_name = os.path.splitext(webp_file)[0]
            png_file = base_name + ".png"
            
            # 检查png文件是否已存在
            if os.path.exists(png_file):
                print(f"跳过 {os.path.basename(webp_file)} -> {os.path.basename(png_file)} (目标文件已存在)")
                continue
            
            # 打开webp文件并转换为png
            with Image.open(webp_file) as img:
                img.save(png_file, "PNG")
            
            print(f"转换成功: {os.path.basename(webp_file)} -> {os.path.basename(png_file)}")
            converted_count += 1
            
        except Exception as e:
            print(f"转换失败 {os.path.basename(webp_file)}: {str(e)}")
    
    print(f"\n转换完成! 成功转换 {converted_count} 个文件")

if __name__ == "__main__":
    # 检查PIL库是否可用
    try:
        from PIL import Image
    except ImportError:
        print("错误: 需要安装Pillow库")
        print("请运行: pip install Pillow")
        sys.exit(1)
    
    convert_webp_to_png()