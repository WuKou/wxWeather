let recommendCities = require('../../data/data.js')
Page({
  data: {
    cities_saved: [],
    slideButtons: [{
      text: '删除',
      src: '/img/delete.png'
    }],
    currentLocation: ''
  },
  onLoad: function(options) {
    let cities_saved = wx.getStorageSync('cities_saved');
    this.setData({
      cities_saved
    })
    let currentLocation = wx.getStorageSync('currentLocation');
    if (currentLocation) {
      this.setData({
        'currentLocation': currentLocation
      })
    }
  },
  processDeleteCity(e) {
    let index = e.currentTarget.dataset.index;
    let cities = wx.getStorageSync('cities');
    let cities_saved = wx.getStorageSync('cities_saved');
    this.setRecommendCities(cities, cities_saved, index);
    this.deleteCity(index, cities, cities_saved);
  },
  deleteCity2(e) {
    let index = e.currentTarget.dataset.index;
    let cities = wx.getStorageSync('cities');
    let cities_saved = wx.getStorageSync('cities_saved');
    let currentLocation = wx.getStorageSync('currentLocation');
    //如果删除的城市属于推荐城市，则将推荐城市中该城市的storaged属性设为fasle
    let recommend_cities = wx.getStorageSync('recommend_cities');
    let city_name = cities[index];
    let city_list = recommendCities.city_list;
    let recommend_index = city_list.indexOf(city_name);
    if (recommend_index > -1) {
      recommend_cities[recommend_index].storaged = false;
      wx.setStorageSync('recommend_cities', recommend_cities);
    }
    if (currentLocation) {
      //如果推荐城市中有与当前城市相同位置的城市，则删去当前位置时，另一城市的storaged属性设为fasle
      let current_index = city_list.indexOf(currentLocation);
      if (current_index > -1) {
        recommend_cities[current_index].storaged = false;
        wx.setStorageSync('recommend_cities', recommend_cities);
      }
      //删除当前位置的城市时，也要同时删除当前位置的缓存
      if (currentLocation == cities_saved[index].weather.basic.location) {
        wx.removeStorageSync('currentLocation');
      }
    }
    if (!wx.getStorageSync('currentLocation')) {
      recommend_cities[0].storaged = false;
      wx.setStorageSync('recommend_cities', recommend_cities);
    }
    //删去选中城市
    cities.splice(index, 1);
    cities_saved.splice(index, 1);
    wx.setStorageSync('cities', cities);
    wx.setStorageSync('cities_saved', cities_saved);
    this.setData({
      cities_saved
    })
    if (wx.getStorageSync('cities_saved').length === 0) {
      wx.navigateTo({
        url: '/pages/add-cities/add-cities',
      })
    } else {
      let pages = getCurrentPages(); //当前页面栈
      if (pages.length > 1) {
        let beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
        beforePage.setData({
          'cities_saved': cities_saved,
          'currentSwiper': 0
        })
      }
    }
    if (wx.getStorageSync('cities_saved').length === 0) {
      wx.navigateTo({
        url: '/pages/add-cities/add-cities',
      })
    } else {
      let pages = getCurrentPages(); //当前页面栈
      if (pages.length > 1) {
        let beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
        beforePage.setData({
          'cities_saved': cities_saved,
          'currentSwiper': 0
        })
      }
    }
  },
  //如果删除的城市跟推荐城市有关，则推荐城市的storaged值也要改变
  setRecommendCities(cities, cities_saved, index) {
    let currentLocation = wx.getStorageSync('currentLocation');
    let recommend_cities = wx.getStorageSync('recommend_cities');
    let city_name = cities[index];
    let city_list = recommendCities.city_list;
    let recommend_index = city_list.indexOf(city_name);
    //如果删除的城市属于推荐城市，则将推荐城市中该城市的storaged属性设为fasle
    if (recommend_index > -1) {
      recommend_cities[recommend_index].storaged = false;
    }
    if (currentLocation) {
      //如果推荐城市中有与当前城市相同位置的城市，则删去当前位置时，另一城市的storaged属性设为fasle
      let current_index = city_list.indexOf(currentLocation);
      if (current_index > -1) {
        recommend_cities[current_index].storaged = false;
      }
      //删除当前位置的城市时
      if (currentLocation == cities_saved[index].weather.basic.location) {
        //也要同时删除当前位置的缓存
        wx.removeStorageSync('currentLocation');
        //并将推荐城市中的“当前位置”的storaged设为false
        recommend_cities[0].storaged = false;
      }
    }
    wx.setStorageSync('recommend_cities', recommend_cities);
  },
  //删除选中城市
  deleteCity(index, cities, cities_saved) {
    cities.splice(index, 1);
    cities_saved.splice(index, 1);
    wx.setStorageSync('cities', cities);
    wx.setStorageSync('cities_saved', cities_saved);
    this.setData({
      cities_saved
    })
    this.toOtherPages(cities_saved);
  },
  //如果管理中的城市数量为零，则自动跳转至“添加城市”页面，否则则对index页面重新进行setData，保证通过返回来到index界面时显示的是最新的数据
  toOtherPages(cities_saved) {
    if (wx.getStorageSync('cities_saved').length === 0) {
      wx.navigateTo({
        url: '/pages/add-cities/add-cities',
      })
    } else {
      let pages = getCurrentPages(); //当前页面栈
      if (pages.length > 1) {
        let beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
        beforePage.setData({
          'cities_saved': cities_saved,
          'currentSwiper': 0
        })
      }
    }
  },
  toAddCities: function() {
    wx.navigateTo({
      url: "/pages/add-cities/add-cities",
    })
  }
})