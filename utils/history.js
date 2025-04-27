/**
 * 历史记录管理工具
 */

const HISTORY_KEY = 'bmi_history';

/**
 * 保存一条BMI历史记录
 * @param {Object} record 包含身高、体重、性别、年龄和BMI结果的记录
 * @returns {Boolean} 保存成功返回true
 */
function saveRecord(record) {
  try {
    // 确保记录中有日期
    if (!record.date) {
      record.date = new Date().toISOString();
    }
    
    // 获取现有历史记录
    const history = getHistory();
    
    // 添加新记录到开头
    history.unshift(record);
    
    // 保存回存储
    wx.setStorageSync(HISTORY_KEY, history);
    
    return true;
  } catch (e) {
    console.error('保存历史记录失败:', e);
    return false;
  }
}

/**
 * 获取所有历史记录
 * @returns {Array} 历史记录数组
 */
function getHistory() {
  try {
    const history = wx.getStorageSync(HISTORY_KEY);
    return Array.isArray(history) ? history : [];
  } catch (e) {
    console.error('获取历史记录失败:', e);
    return [];
  }
}

/**
 * 清空所有历史记录
 * @returns {Boolean} 清空成功返回true
 */
function clearHistory() {
  try {
    wx.removeStorageSync(HISTORY_KEY);
    return true;
  } catch (e) {
    console.error('清空历史记录失败:', e);
    return false;
  }
}

/**
 * 格式化日期显示
 * @param {String} dateString ISO日期字符串
 * @returns {String} 格式化的日期字符串 (YYYY-MM-DD HH:MM)
 */
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hour}:${minute}`;
  } catch (e) {
    return dateString;
  }
}

module.exports = {
  saveRecord,
  getHistory,
  clearHistory,
  formatDate
}; 