import Vue from 'vue'
// 高亮关键字
Vue.filter('heightLightElms', function(val, key) {
  val = val.replace(new RegExp(key.replace(/^\||\|$/, ''), 'gi'), function(subval) {
    return '<mark>' + subval + '</mark>';
  });
  return val
})
