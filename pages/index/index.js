const app = getApp();
const util = require('../../utils/util.js');
const globalData = app.globalData;
const key = globalData.key;
Page({
  data: {
    //记录swiper当前显示哪个页面的index
    currentSwiper: 0,
    //记录当前页面的city值
    currentCity: '',
    //记录当前位置
    currentLocation:''
  },
  onLoad: function(options) {
    let city = options.city;
    let index = options.index;
    let currentLocation=options.currentLocation;
    let exist_current_location=wx.getStorageSync('currentLocation');
    if (exist_current_location){
       this.setData({
         'currentLocation': exist_current_location
       })
    }
    let saved_cities = wx.getStorageSync('cities_saved');
    if (!saved_cities) {
      wx.setStorageSync('cities_saved', []);
      wx.navigateTo({
        url: '/pages/add-cities/add-cities',
      })
      return;
    } else if(saved_cities.length==0&&!city){
      wx.navigateTo({
        url: '/pages/add-cities/add-cities',
      })
      return; 
    }else {
      this.setData({
        'cities_saved': saved_cities
      })
    }
    //用来存储城市列表的
    let cities = wx.getStorageSync('cities');
    if (!cities) {  
      cities = [];
      wx.setStorageSync('cities', cities);
    }
    if (typeof(city) == 'string' && city.length > 0) {
      let old_length = cities.length;
      //如果要获取用户所在位置
      if (currentLocation) {
        cities.push('当前位置');
      }
      //搜索的城市与当前位置一样时，则不重复添加
      else if (city===exist_current_location){
       
      }
      else{
      cities.push(city);
      }
      //数组去重
      cities = [...new Set(cities)];
      let new_length = cities.length;
      if (new_length != old_length) {
        wx.setStorageSync('cities', cities);
        this.processCityMsg(city, true, index, currentLocation);
      } else {
        this.processCityMsg(city, false, index, currentLocation);
      }
    }
  },
  getTime: function() {
    let now = util.formatTime(new Date);
    now = now.slice(0, 16);
    return now;
  },
  //处理天气信息
  processWeather(data) {
    data = data.HeWeather6[0];
    if (data.status === 'ok') {
      //给未来几天的天气预报加上星期
      let forecast_days = data.daily_forecast.length;
      let daily_forecast = data.daily_forecast;
      //获取当前时间是星期几
      let now_week = this.getWeekDay();
      data.daily_forecast = this.getWeekDays(now_week, forecast_days, daily_forecast);
      //处理逐小时预报的时间格式
      data.hourly = this.processTimeFormat(data.hourly);
      return data;
    } else {
      console.log("无法获取天气信息：" + data.status);
    }
  },
  //处理空气信息
  processAir(data) {
    data = data.HeWeather6[0];
    if (data.status !== 'ok') {
      console.log("无法获取空气信息：" + data.status);
    }
    else{
      return data;
    }
  },
  //处理单个城市需要展示的信息，save_type判断是添加新城市(true)还是更新已有的城市(false)
  async processCityMsg(city, save_type, index, currentLocation) {
    try {
      //存储单个城市的天气预报信息
      let city_saved = new Object();
      let cities=wx.getStorageSync('cities');
      let weather_url = globalData.weather_url;
      let air_url = globalData.air_url + 'now';
      let weather_data = await util.request(weather_url, city, key);
      let air_data = await util.request(air_url, city, key);
      city_saved.weather = this.processWeather(weather_data);
      city_saved.air = this.processAir(air_data);
      city_saved.time = this.getTime();
      //存储用户现在所在位置
      if(currentLocation){
        let location = city_saved.weather.basic.location;
        wx.setStorageSync('currentLocation', location);
        this.setData({
          'currentLocation':location
        })
        //如果当前位置与已添加的城市相同，则将当前位置覆盖住相同的城市，且删掉cities中的最后一项（即"当前位置"）
        let currentIndex = cities.indexOf(location);
        if(currentIndex>-1){
          let length=cities.length;
          cities.copyWithin(currentIndex,length);
          cities.pop();
          wx.setStorageSync('cities', cities);
          save_type=false;
          index = currentIndex;
        }
      }
      if (save_type) {
        this.add(city_saved);
        this.setData({
          currentSwiper: index
        })
      } else {
        this.update(city_saved, index);
        this.setData({
          currentSwiper: index
        })
      }
    } catch (error) {
      console.log(error);
      this.showToast('获取天气信息失败');
      let cities_saved = wx.getStorageSync('cities_saved');
      let cities = wx.getStorageSync('cities');
      if (cities_saved.length<cities.length){
        let city_save=new Object();
        city_save.weather=new Object();
        city_save.weather.basic=new Object();
        city_save.weather.basic.location=city;
        cities_saved.push(city_save);
        wx.setStorageSync('cities_saved',cities_saved);
        this.setData({
          cities_saved,
          currentSwiper:index
          });
      }
    }
  },
  //获取当前时间是星期几
  getWeekDay() {
    let now = new Date();
    let day = now.getDay();
    let weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    let week = weeks[day];
    return week;
  },
  //获取未来几天的星期
  getWeekDays(now_week, forecast_days, daily_forecast) {
    let weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    let forecast_weeks = [];
    let index;
    for (let i = 0; i < weeks.length; i++) {
      if (now_week == weeks[i]) {
        index = i;
        break;
      }
    }
    for (let i = 0; i < forecast_days; i++) {
      if (index < 7) {
        forecast_weeks[i] = weeks[index];
        daily_forecast[i].week = weeks[index];
      } else {
        forecast_weeks[i] = weeks[index - 7];
        daily_forecast[i].week = weeks[index - 7];
      }
      index++;
    }
    return daily_forecast;
  },
  //处理时间格式（去掉逐小时天气预报时间的日期部分）
  processTimeFormat(hourly) {
    for (let i = 0; i < hourly.length; i++) {
      hourly[i].time = hourly[i].time.slice(11);
    }
    return hourly;
  },
  //添加和存储城市的各种数据
  add(city_saved) {
    let cities_saved = wx.getStorageSync('cities_saved');
    if (cities_saved) {
      cities_saved.push(city_saved);
      wx.setStorageSync('cities_saved', cities_saved);
      this.setData({
        cities_saved: cities_saved
      });
    } else {
      let cities_saved = [];
      cities_saved.push(city_saved);
      wx.setStorageSync('cities_saved', cities_saved);
      this.setData({
        cities_saved: cities_saved
      });
    }
  },
  //更新和存储城市的各种数据
  update(city_saved, index) {
    let cities_saved = wx.getStorageSync('cities_saved');
    cities_saved.splice(index, 1, city_saved);
    wx.setStorageSync('cities_saved', cities_saved);
    this.setData({
      'cities_saved': cities_saved
    })
  },
  //滑动事件监听
  swiperChange: function(event) {
    this.setData({
      currentSwiper: event.detail.current
    });
  },
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    let city = wx.getStorageSync('cities')[this.data.currentSwiper];
    if (city==="当前位置"){
      wx.getLocation({
        success: (res) => {
          city= `${res.latitude},${res.longitude}`;
          this.processCityMsg(city, false, this.data.currentSwiper);
          let location = city_saved.weather.basic.location;
          wx.setStorageSync('currentLocation', location);
          this.setData({
            'currentLocation': location
          })
        },
        fail: () => {
          wx.showToast({
            title: '定位失败',
            icon: 'none'
          })
        }
      })
    }
    else{
    this.processCityMsg(city, false, this.data.currentSwiper);
    }
    setTimeout(function() {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  },
  toManageCities: function() {
    wx.navigateTo({
      url: "/pages/city-management/city-management",
    })
  }
})