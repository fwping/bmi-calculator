#!/bin/bash
#
# SVG到PNG转换工具 (Bash版)
#
# 此脚本将svg目录中的SVG文件转换为PNG格式并保存到images目录
# 运行此脚本需要安装ImageMagick: 
# - macOS: brew install imagemagick
# - Ubuntu/Debian: sudo apt-get install imagemagick
# - CentOS/RHEL: sudo yum install imagemagick
#
# 使用方法: chmod +x convert_icons.sh && ./convert_icons.sh
#

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # 无颜色

# 配置参数
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SVG_DIR="$SCRIPT_DIR/svg"
PNG_DIR="$SCRIPT_DIR/images"
SIZE=24

# 检查ImageMagick是否已安装
if ! command -v convert &> /dev/null; then
    echo -e "${RED}错误: 未找到ImageMagick。请安装ImageMagick后再试。${NC}"
    echo "安装指南:"
    echo "  - macOS: brew install imagemagick"
    echo "  - Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  - CentOS/RHEL: sudo yum install imagemagick"
    exit 1
fi

# 确保输出目录存在
mkdir -p "$PNG_DIR"

# 获取所有SVG文件
SVG_FILES=("$SVG_DIR"/*.svg)

# 检查是否有SVG文件
if [ ${#SVG_FILES[@]} -eq 0 ] || [ ! -f "${SVG_FILES[0]}" ]; then
    echo -e "${RED}错误: 没有找到SVG文件。请确保svg目录中包含.svg文件。${NC}"
    exit 1
fi

echo "开始将SVG文件转换为PNG (${SIZE}x${SIZE})..."
echo ""

# 转换计数器
SUCCESS=0
TOTAL=${#SVG_FILES[@]}

# 转换每个SVG文件
for svg_file in "${SVG_FILES[@]}"; do
    filename=$(basename "$svg_file")
    png_file="$PNG_DIR/${filename%.svg}.png"
    
    echo -n "转换 $filename ... "
    
    if convert -background none -resize ${SIZE}x${SIZE} "$svg_file" "$png_file"; then
        echo -e "${GREEN}✓ 成功${NC}"
        ((SUCCESS++))
    else
        echo -e "${RED}✗ 失败${NC}"
    fi
done

echo ""
echo "转换完成! $SUCCESS/$TOTAL 个文件已成功转换"

if [ $SUCCESS -eq $TOTAL ]; then
    echo -e "${GREEN}所有图标已成功生成。图标文件位于 images 目录中。${NC}"
fi

exit 0 