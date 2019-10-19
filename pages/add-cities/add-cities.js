let recommendCities = require('../../data/data.js')
let util = require('../../utils/util.js')
let app = getApp()

Page({
  data: {

  },
  onLoad: function(options) {
    //获取最原始的“推荐城市”的数据
    let recommend_cities = recommendCities.recommendCities;
    let recommend_new_cities = wx.getStorageSync('recommend_cities');
    let cities = wx.getStorageSync('cities');
    let city_list = recommendCities.city_list;
    let currentLocation=wx.getStorageSync('currentLocation');
    if (recommend_new_cities) {
      //处理通过搜索增加的城市和与当前位置相同的城市的storaged属性的值
      if (cities) {
        for (let i = 0; i < cities.length; i++) {
          if (city_list.includes(cities[i])) {
            let index = city_list.indexOf(cities[i]);
            recommend_new_cities[index].storaged = true;
          }
        }
        if(currentLocation){
         let index=city_list.indexOf(currentLocation);
         if(index>-1){
           recommend_new_cities[index].storaged = true;
         }
        }
        this.setData({
          recommend_cities: recommend_new_cities
        })
      }
    } else {
      wx.setStorageSync('recommend_cities', recommend_cities);
      this.setData({
        recommend_cities: recommend_cities
      })
    }
  },
  toShowWeather: function(event) {
    let city_name = event.currentTarget.dataset.city;
    //位于推荐城市里的下标
    let index = event.currentTarget.dataset.index;
    //位于存储的城市天气里的下标
    let city_index = 0;
    let recommend_new_cities = this.data.recommend_cities;
    let cities = wx.getStorageSync('cities');
    if (cities) {
      city_index = cities.length;
    }
    if (city_name == '当前位置') {
      wx.getLocation({
        success: (res) => {
          city_name = `${res.latitude},${res.longitude}`;
          wx.navigateTo({
            url: `/pages/index/index?city=${city_name}&index=${city_index}&currentLocation=true`,
          })
        },
        fail: () => {
          wx.showToast({
            title: '定位失败',
            icon: 'none'
          })
          wx.navigateTo({
            url: `/pages/index/index?city=${city_name}&index=${city_index}&currentLocation=true`,
          })
        }
      })
    } else {
      wx.navigateTo({
        url: `/pages/index/index?city=${city_name}&index=${city_index}`,
      })
    }
    recommend_new_cities[index].storaged = true;
    wx.setStorageSync('recommend_cities', recommend_new_cities);
    this.setData({
      cities: recommend_new_cities
    })
  },
  toSearchPage() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  }
})