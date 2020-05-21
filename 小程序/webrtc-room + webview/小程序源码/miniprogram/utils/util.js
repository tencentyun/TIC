const moment = require('../components/libs/moment');
moment.locale('zh-cn');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 计算时间差
const diffTime = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return '';
  }
  var m1 = moment(startTime);
  var m2 = moment(endTime);
  var duration = moment.duration(moment(m2 - m1));
  var hour = duration.hours() - 8;
  var minute = duration.minutes();
  var second = duration.seconds() || 0;
  var text = '';
  if (hour) {
    text += hour + '时'
  }

  if (minute) {
    text += minute + '分'
  }
  text += second + '秒'
  return text;
}

const getCurrentPageUrl = function () {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  return url
}

module.exports = {
  formatTime: formatTime,
  diffTime: diffTime,
  getCurrentPageUrl: getCurrentPageUrl
}