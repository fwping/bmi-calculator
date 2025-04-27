#!/usr/bin/env python3
"""
SVG到PNG转换工具 (Python版)

此脚本将svg目录中的SVG文件转换为PNG格式并保存到images目录
运行此脚本需要安装cairosvg包: pip install cairosvg

使用方法: python convert_icons.py
"""

import os
import sys
import cairosvg

# 配置参数
SVG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'svg')
PNG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'images')
SIZE = 24  # 生成24x24像素的图标

def main():
    # 确保输出目录存在
    if not os.path.exists(PNG_DIR):
        os.makedirs(PNG_DIR)
    
    # 获取所有SVG文件
    svg_files = [f for f in os.listdir(SVG_DIR) if f.endswith('.svg')]
    
    if not svg_files:
        print('没有找到SVG文件。请确保svg目录中包含.svg文件。')
        sys.exit(1)
    
    print(f'开始将SVG文件转换为PNG ({SIZE}x{SIZE})...')
    
    success_count = 0
    for svg_file in svg_files:
        input_path = os.path.join(SVG_DIR, svg_file)
        output_path = os.path.join(PNG_DIR, svg_file.replace('.svg', '.png'))
        
        try:
            # 使用cairosvg转换
            cairosvg.svg2png(
                url=input_path,
                write_to=output_path,
                output_width=SIZE,
                output_height=SIZE
            )
            print(f'✓ 已转换: {svg_file} -> {os.path.basename(output_path)}')
            success_count += 1
        except Exception as e:
            print(f'✗ 转换失败: {svg_file}', str(e))
    
    print(f'\n转换完成! {success_count}/{len(svg_files)} 个文件已成功转换')
    
    if success_count == len(svg_files):
        print('\n所有图标已成功生成。图标文件位于 images 目录中。')

if __name__ == '__main__':
    main() 