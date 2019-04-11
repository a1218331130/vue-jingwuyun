export default function getColumnWidth(column) {
  // console.log(column, column.prop, column.label, 'column')
  let widthMap = {
    zjhm: 120, // 主叫号码
    xm: 100, // 姓名
    dfsfzhm: 170, // 对方身份证号
    dfhm: 120, // 对方号码
    gsd: 120, // 归属地
    thd: 120, // 通话地点
    thdd: 200, // 通话地址
    thrq: 100, // 通话日期
    dwmc: 150, // 单位
    zw: 100, // 职务
    sclx: 170, // 首次
    zhlx: 170 // 最后
  };
  let res = widthMap[column.prop] || widthMap[column.prop.toLowerCase()] || 80;
  return res
}
