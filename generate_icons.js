/**
 * SVG到PNG转换工具
 * 
 * 此脚本将svg目录中的SVG文件转换为PNG格式并保存到images目录
 * 运行此脚本需要安装sharp包: npm install sharp
 * 
 * 使用方法: node generate_icons.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 配置参数
const SVG_DIR = path.join(__dirname, 'svg');
const PNG_DIR = path.join(__dirname, 'images');
const SIZE = 24; // 生成24x24像素的图标

// 确保输出目录存在
if (!fs.existsSync(PNG_DIR)) {
  fs.mkdirSync(PNG_DIR);
}

// 获取所有SVG文件
const svgFiles = fs.readdirSync(SVG_DIR).filter(file => file.endsWith('.svg'));

if (svgFiles.length === 0) {
  console.log('没有找到SVG文件。请确保svg目录中包含.svg文件。');
  process.exit(1);
}

// 转换每个SVG文件为PNG
async function convertSvgToPng() {
  console.log(`开始将SVG文件转换为PNG (${SIZE}x${SIZE})...`);
  
  const convertPromises = svgFiles.map(async (svgFile) => {
    const inputPath = path.join(SVG_DIR, svgFile);
    const outputPath = path.join(PNG_DIR, svgFile.replace('.svg', '.png'));
    
    try {
      await sharp(inputPath)
        .resize(SIZE, SIZE)
        .png()
        .toFile(outputPath);
      
      console.log(`✓ 已转换: ${svgFile} -> ${path.basename(outputPath)}`);
      return true;
    } catch (error) {
      console.error(`✗ 转换失败: ${svgFile}`, error.message);
      return false;
    }
  });
  
  const results = await Promise.all(convertPromises);
  const successCount = results.filter(r => r).length;
  
  console.log(`\n转换完成! ${successCount}/${svgFiles.length} 个文件已成功转换`);
  
  if (successCount === svgFiles.length) {
    console.log('\n所有图标已成功生成。图标文件位于 images 目录中。');
  }
}

// 运行转换
convertSvgToPng().catch(err => {
  console.error('转换过程中出现错误:', err);
  process.exit(1);
}); 