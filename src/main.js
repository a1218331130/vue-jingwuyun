import Vue from 'vue'
// 修复对跨域发送cookie验证信息的支持
import VueResource from 'vue-resource'
import router from './router'
import store from './store'
import App from './app.vue'
import 'animate.css'
import './elementui'
import './widgets'
// import './mock'
import './icons/iconfont.css'
import './themes/default/index.scss'

Vue.config.productionTip = false
Vue.use(VueResource)

// 注入des解密
if(window.uncMe) {
  Vue.prototype.uncMe = window.uncMe;
}
// 注入jQuery
if(window.jQuery) {
  Vue.prototype.$ = window.jQuery;
}
// 注入socket.io
if(window.io) {
  Vue.prototype.$io = window.io;
  Vue.prototype.$connect = null;
}
// 注入UEeditor
if(window.UE) {
  Vue.prototype.UE = window.UE;
}

new Vue({
  router,
  store,
  el: '#app',
  template: '<app/>',
  components: { App },
  created() {}
})
