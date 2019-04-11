export default function getColumnWidth(column) {
  // console.log(column, column.prop, column.label, 'column')
  let widthMap = {
    r: 50, // 序号
    khr: 120, // 开户人
    zzh: 170, // 主账号
    dfzh: 170, // 对方账号
    jykh: 170, // 交易卡号
    skze: 170, // 收入总额(元)
    zcze: 170, // 支出总额(元)
    dwmc: 200, // 单位名称
    dfhm: 150, // 对方户名
    zzhssh: 200, // 主账号所属行
    dfzhssh: 200, // 对方账户所属行
    dfsfzhm: 170, // 对方身份证号码
    jyrq: 170, // 交易日期
    minrq: 170, // 最小交易日期
    maxrq: 170, // 最大交易日期
    jywdmc: 170 // 交易网点名称
  };
  let res = widthMap[column.prop] || widthMap[column.prop.toLowerCase()] || 80;
  return res
}
