const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//判断数字是不是单位数，是的话在数字前面+0
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function request(url, data) {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url,
      method: 'GET',
      data: data,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject("信息查询错误:" + res.statusCode);
          console.log(res.statusCode);
        }
      },
      fail: (error) => {
        reject(error);
        console.log(error);
      },
      complete() {
        wx.hideLoading();
      }
    })
  })
}

module.exports = {
  formatTime: formatTime,
  request: request
}