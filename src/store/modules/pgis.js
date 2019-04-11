/**
 *  提示框状态
 */
export default {
  state: {
    pgisUrl: 'http://10.146.14.66:8888/crossTest/proxy.jsp?http://10.146.90.6:8885/tkweb/static/map.jsp'
  },
  mutations: {
    mapAt(state, payload) {
      var x = payload.x;
      var y = payload.y;
      var html = payload.html;
      document.getElementById('mapGis').contentWindow.moveTo(x, y, html);
    }
  }
}
