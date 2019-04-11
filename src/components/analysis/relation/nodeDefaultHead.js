const typeMap = {
  8: 'place',
  2: 'tel',
  3: 'car',
  4: 'user',
  5: 'car',
  6: 'case'
}
const headMap = {
  default: '\uE6DE', // 默认
  dataPack: '\uE608', // 打包数据
  user: '\uE638', // 证件号码/头像
  register: '\uE620', // 户口
  passport: '\uE640', // 护照
  tel: '\uE7DD', // 电话
  licensePlate: '\uE67B', // 车牌
  car: '\uE656', // 车辆
  case: '\uE621', // 案件
  place: '\uE605', // 单位/场所
  bankcard: '\uE678', // 银行卡
  hotel: '\uE67A', // 酒店
  netbar: '\uE7C0', // 网吧
  railway: '\uE63C', // 铁路
  flight: '\uE659' // 航班
}
let typeToHead = {};
for(let i in typeMap) {
  typeToHead[i] = headMap[typeMap[i]];
}

const fontMap = {
  default: 'icon-wenhao', // 默认
  dataPack: 'icon-data-slice', // 打包数据
  user: 'icon-touxiang', // 证件号码/头像
  register: 'icon-icon_gerendangan_normal', // 户口
  passport: 'icon-huzhao', // 护照
  tel: 'icon-dianhua1', // 电话
  licensePlate: 'icon-taopaiche', // 车牌
  car: 'icon-cheliang', // 车辆
  case: 'icon-dangan1', // 案件
  place: 'icon-city', // 单位/场所
  bankcard: 'icon-zijin', // 银行卡
  hotel: 'icon-jiudian', // 酒店
  netbar: 'icon-ipguishudi', // 网吧
  railway: 'icon-huoche', // 铁路
  flight: 'icon-feiji2' // 航班
};
let typeToFont = {};
for(let i in typeMap) {
  typeToFont[i] = fontMap[typeMap[i]];
}
export {
  typeMap,
  headMap,
  fontMap,
  typeToFont,
  typeToHead
};
