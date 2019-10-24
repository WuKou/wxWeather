const app = getApp();
const util = require('../../utils/util.js');
const globalData = app.globalData;
const key = globalData.key;
Page({
  data: {
    search_result: [],
    //控制关闭符号的显示
    showClose: false,
    //控制搜索面板的显示
    showSearchPanel: false,
    //控制搜索结果的显示
    showSearch: false,
    inputText: ''
  },
  onLoad: function(options) {

  },
  getSearchResult(e) {
    let result = [];
    let value = e.detail.value.replace(/\s+/g, '');
    let pos = e.detail.cursor;
    let url = globalData.search_url;
    //如果输入框不为空，则根据输入框的值请求并显示搜索结果
    if (value != '') {
      let data={
        'location':value,
        'key':key
      }
      util.request(url,data)
        .then((res) => {
          if (res.HeWeather6[0].status === 'ok') {
            for (let i = 0; i < res.HeWeather6[0].basic.length; i++) {
              if (res.HeWeather6[0].basic[i].type === 'city') {
                result.push(res.HeWeather6[0].basic[i]);
              }
            }
            this.setData({
              search_result: result,
            })
          }
        })
      this.setData({
        showClose: true
      })
    }//如果输入框为空，则将搜索结果清空
     else {
      this.setData({
        search_result: [],
        showClose: false
      })
    }
  },
  clear() {
    this.setData({
      search_result: [],
      inputText: ''
    })
  },
  showSearchPanel(e) {
    this.setData({
      showSearchPanel: true
    })
  },
  toWeatherPage(e) {
    let city = e.currentTarget.dataset.city;
    let cities = wx.getStorageSync('cities');
    let currentLocation = wx.getStorageSync('currentLocation');
    //如果搜索的城市是当前定位的城市
    if (currentLocation === city) {
      let currentLocation_index = cities.indexOf('当前位置');
      wx.navigateTo({
        url: `/pages/index/index?city=${city}&index=${currentLocation_index}`
      })
      return;
    }
    if (cities) {
      //如果要搜索的城市已存在
      if (cities.includes(city)) {
        let index = cities.indexOf(city);
        wx.navigateTo({
          url: `/pages/index/index?city=${city}&index=${index}`
        })
      }//如果要搜索的城市是新的城市 
      else {
        let index = cities.length;
        wx.navigateTo({
          url: `/pages/index/index?city=${city}&index=${index}`
        })
      }
    } else {
      cities = [];
      cities.push(city);
      wx.setStorageSync('cities', cities);
      wx.navigateTo({
        url: `/pages/index/index?city=${city}&index=0`
      })
    }
  }
})