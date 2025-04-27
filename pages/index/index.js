// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

// 引入BMI工具类
const bmiUtils = require('../../utils/bmi.js');
// 引入历史记录工具类
const historyUtils = require('../../utils/history.js');
// 引入ECharts
import * as echarts from '../../components/ec-canvas/echarts';

// 创建全局图表实例变量
let chartInstance = null;

// 初始化图表
function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 设备像素比
  });
  canvas.setChart(chart);
  
  // 初始化一个空的图表配置，后续会更新
  const option = bmiUtils.getBMIGaugeOption(0);
  chart.setOption(option);
  
  // 保存到全局变量
  chartInstance = chart;
  
  // 返回图表实例
  return chart;
}

Page({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    
    // 用户输入
    gender: 'male',
    age: '',
    height: '',
    weight: '',
    
    // 计算结果
    showResult: false,
    bmiValue: 0,
    bmiCategory: {},
    bmiReferences: [],
    
    // ECharts配置
    ec: {
      onInit: initChart
    }
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  onLoad: function() {
    // 初始化BMI参考数据
    this.setData({
      bmiReferences: bmiUtils.getBMIReferences()
    });
  },
  
  // 性别选择变化
  onGenderChange: function(e) {
    this.setData({
      gender: e.detail.value
    });
  },
  
  // 验证表单输入
  validateForm: function(formData) {
    let message = '';
    
    if (!formData.age || formData.age <= 0 || formData.age > 120) {
      message = '请输入有效的年龄（1-120岁）';
    } else if (!formData.height || formData.height <= 0 || formData.height > 250) {
      message = '请输入有效的身高（1-250厘米）';
    } else if (!formData.weight || formData.weight <= 0 || formData.weight > 300) {
      message = '请输入有效的体重（1-300千克）';
    }
    
    if (message) {
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    
    return true;
  },
  
  // 计算BMI
  calculateBMI: function(e) {
    const formData = e.detail.value;
    formData.gender = this.data.gender; // 获取性别
    
    // 验证表单数据
    if (!this.validateForm(formData)) {
      return;
    }
    
    // 转换为数字类型
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    const age = parseInt(formData.age);
    
    // 计算BMI值
    const bmiValue = bmiUtils.calculateBMI(weight, height);
    
    // 获取BMI分类
    const bmiCategory = bmiUtils.getBMICategory(bmiValue);
    
    // 更新数据
    this.setData({
      showResult: true,
      bmiValue: bmiValue,
      bmiCategory: bmiCategory
    });
    
    // 保存到历史记录
    this.saveToHistory(formData, bmiValue, bmiCategory);
    
    // 更新图表
    this.updateChart(bmiValue);
  },
  
  // 更新图表
  updateChart: function(bmiValue) {
    const chartOption = bmiUtils.getBMIGaugeOption(bmiValue);
    
    // 使用全局变量访问图表实例
    if (chartInstance) {
      chartInstance.setOption(chartOption);
    } else {
      console.log('图表实例尚未初始化，无法更新');
    }
  },
  
  // 保存历史记录
  saveToHistory: function(formData, bmiValue, bmiCategory) {
    const record = {
      date: new Date().toISOString(),
      gender: formData.gender,
      age: parseInt(formData.age),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      bmi: bmiValue,
      category: bmiCategory.name
    };
    
    historyUtils.saveRecord(record);
  }
});
