import Vue from 'vue'
/**
 *  日期格式过滤器
 *
 *  @desc 用法： {{ date | format('yyyy-MM-dd HH:mm:ss')}}
 *
 *
 * masks = {
    'default': 'ddd MMM dd yyyy HH:mm:ss',
    shortDate: 'M/D/yy',
    mediumDate: 'MMM d, yyyy',
    longDate: 'MMMM d, yyyy',
    fullDate: 'dddd, MMMM d, yyyy',
    shortTime: 'HH:mm',
    mediumTime: 'HH:mm:ss',
    longTime: 'HH:mm:ss.SSS'
  }
 */

// import date from '../../node_modules/element-ui/src/utils/date';
// export default date.format;
function dateFormat(date, fmt) { // author: meizz
  if(!date) {
    return date
  }
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for(let k in o) {
    if(new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  }
  return fmt;
}

Vue.filter('dateFormat', function (value, format = 'yyyy-MM-dd') {
  if(!value) {
    return value
  }
  return dateFormat(new Date(Date.parse(value)), format);
})
