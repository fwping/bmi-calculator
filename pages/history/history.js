// 引入BMI工具类
const bmiUtils = require('../../utils/bmi.js');
// 引入历史记录工具类
const historyUtils = require('../../utils/history.js');

Page({
  data: {
    historyList: []
  },

  onLoad: function() {
    this.loadHistoryData();
  },
  
  // 每次显示页面时刷新数据
  onShow: function() {
    this.loadHistoryData();
  },
  
  // 加载历史数据
  loadHistoryData: function() {
    const historyData = historyUtils.getHistory();
    
    // 添加格式化的日期和分类样式类名
    const formattedHistory = historyData.map(item => {
      // 基于BMI值获取分类信息
      const category = bmiUtils.getBMICategory(item.bmi);
      
      return {
        ...item,
        formattedDate: historyUtils.formatDate(item.date),
        className: category.className
      };
    });
    
    this.setData({
      historyList: formattedHistory
    });
  },
  
  // 清空历史记录
  clearHistory: function() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有BMI计算历史记录吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          // 用户点击确定，清空记录
          historyUtils.clearHistory();
          
          // 刷新页面数据
          this.setData({
            historyList: []
          });
          
          wx.showToast({
            title: '历史记录已清空',
            icon: 'success',
            duration: 2000
          });
        }
      }
    });
  }
}); 