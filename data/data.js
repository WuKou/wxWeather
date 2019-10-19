let recommend_cities=[
  { 
   location:"当前位置",
   storaged:false
   },
  {
    location: "普宁",
    storaged: false
  },
  {
    location: "北京",
    storaged: false
  },
  {
    location: "上海",
    storaged: false
  },
  {
    location: "广州",
    storaged: false
  },
  {
    location: "深圳",
    storaged: false
  },
  {
    location: "天津",
    storaged: false
  },
  {
    location: "武汉",
    storaged: false
  },
  {
    location: "沈阳",
    storaged: false
  },
  {
    location: "重庆",
    storaged: false
  },
  {
    location: "杭州",
    storaged: false
  },
  {
    location: "南京",
    storaged: false
  },
  {
    location: "哈尔滨",
    storaged: false
  },
  {
    location: "长春",
    storaged: false
  },
  {
    location: "呼和浩特",
    storaged: false
  },
  {
    location: "石家庄",
    storaged: false
  },
  {
    location: "银川",
    storaged: false
  },
  {
    location: "乌鲁木齐",
    storaged: false
  },
  {
    location: "拉萨",
    storaged: false
  },
  {
    location: "西宁",
    storaged: false
  },
  {
    location: "西安",
    storaged: false
  },
  {
    location: "兰州",
    storaged: false
  },
  {
    location: "太原",
    storaged: false
  },
  {
    location: "昆明",
    storaged: false
  },
  {
    location: "南宁",
    storaged: false
  },
  {
    location: "成都",
    storaged: false
  },
  {
    location: "长沙",
    storaged: false
  },
  {
    location: "济南",
    storaged: false
  },
  {
    location: "南昌",
    storaged: false
  },
  {
    location: "合肥",
    storaged: false
  },
  {
    location: "郑州",
    storaged: false
  },
  {
    location: "福州",
    storaged: false
  },
  {
    location: "贵阳",
    storaged: false
  },
  {
    location: "海口",
    storaged: false
  },
  {
    location: "秦皇岛",
    storaged: false
  },
  {
    location: "桂林",
    storaged: false
  },
  {
    location: "三亚",
    storaged: false
  },
  {
    location: "香港",
    storaged: false
  },
  {
    location: "澳门",
    storaged: false
  },
]

let city_list = [];
for (let i = 0; i < recommend_cities.length; i++) {
  city_list.push(recommend_cities[i].location);
}

module.exports={
  recommendCities: recommend_cities,
   city_list: city_list
}