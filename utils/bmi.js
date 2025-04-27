/**
 * BMI计算和分类工具
 */

/**
 * 计算BMI值
 * @param {Number} weight 体重（kg）
 * @param {Number} height 身高（cm）
 * @returns {Number} BMI值，保留一位小数
 */
function calculateBMI(weight, height) {
  // 将身高从厘米转为米
  const heightInMeter = height / 100;
  // 计算BMI = 体重(kg) / 身高(m)²
  const bmi = weight / (heightInMeter * heightInMeter);
  // 保留一位小数
  return parseFloat(bmi.toFixed(1));
}

/**
 * 获取BMI分类
 * @param {Number} bmi BMI值
 * @returns {Object} 包含分类的名称、描述和CSS类名
 */
function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return {
      name: '偏瘦',
      description: '体重过轻，建议适当增加营养摄入',
      className: 'bmi-underweight'
    };
  } else if (bmi < 24) {
    return {
      name: '正常',
      description: '体重正常，请继续保持健康的生活方式',
      className: 'bmi-normal'
    };
  } else if (bmi < 28) {
    return {
      name: '超重',
      description: '体重超重，建议控制饮食并增加运动',
      className: 'bmi-overweight'
    };
  } else if (bmi < 32) {
    return {
      name: '肥胖',
      description: '体重肥胖，建议咨询医生制定健康减重计划',
      className: 'bmi-obese'
    };
  } else {
    return {
      name: '重度肥胖',
      description: '体重严重肥胖，建议寻求专业医疗帮助',
      className: 'bmi-severely-obese'
    };
  }
}

/**
 * 获取BMI分类对照表
 * @returns {Array} BMI分类标准
 */
function getBMIReferences() {
  return [
    { range: '< 18.5', category: '偏瘦', className: 'bmi-underweight' },
    { range: '18.5 - 23.9', category: '正常', className: 'bmi-normal' },
    { range: '24 - 27.9', category: '超重', className: 'bmi-overweight' },
    { range: '28 - 31.9', category: '肥胖', className: 'bmi-obese' },
    { range: '≥ 32', category: '重度肥胖', className: 'bmi-severely-obese' }
  ];
}

/**
 * 获取BMI仪表盘的配置
 * @param {Number} bmi BMI值
 * @returns {Object} 仪表盘配置对象
 */
function getBMIGaugeOption(bmi) {
  return {
    series: [{
      type: 'gauge',
      min: 15,
      max: 35,
      splitNumber: 4,
      radius: '100%',
      axisLine: {
        lineStyle: {
          width: 30,
          color: [
            [0.2, '#3498db'], // 偏瘦 - 蓝色
            [0.4, '#2ecc71'], // 正常 - 绿色
            [0.6, '#f39c12'], // 超重 - 黄色
            [0.8, '#e74c3c'], // 肥胖 - 红色
            [1, '#c0392b']    // 重度肥胖 - 深红色
          ]
        }
      },
      pointer: {
        itemStyle: {
          color: 'auto'
        }
      },
      axisTick: {
        distance: -30,
        length: 8,
        lineStyle: {
          color: '#fff',
          width: 2
        }
      },
      splitLine: {
        distance: -30,
        length: 30,
        lineStyle: {
          color: '#fff',
          width: 2
        }
      },
      axisLabel: {
        color: 'auto',
        distance: 40,
        fontSize: 16
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}',
        color: 'auto',
        fontSize: 30,
        offsetCenter: [0, '70%']
      },
      data: [{
        value: bmi
      }]
    }]
  };
}

module.exports = {
  calculateBMI,
  getBMICategory,
  getBMIReferences,
  getBMIGaugeOption
}; 