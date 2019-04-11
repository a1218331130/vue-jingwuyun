// pgis地图
import TKMap from 'TKMap'
import Polyline from 'Polyline'
import Marker from 'Marker'
export default {
  data() {
    return {
      map: '',
      imgsrc: '/static/num/red.png',
      color: [ 255, 0, 255, 1 ],
      lineWidth: 6
    }
  },
  methods: {
    // 地图初始化，mapI为传入的id
    pgisInit(mapId) {
      this.map = new TKMap(mapId);
      this.map.initMap();
    //   var color = [ 255, 0, 255, 0.3 ];
    //   var lineWidth = 6;
    //   var points = [110.00368164231077, 27.56952544725618, 110.00233107919644, 27.56988236982453, 110.001424642806, 27.569950782055955, 110.0002034971337, 27.569966542052892, 109.99868433489229, 27.56984042522025, 109.99868269156808, 27.569846476839153, 109.99868269156808, 27.569846476839153];
    //   var line = new Polyline(points, this.lineWidth, this.color);
    //   this.map.addOverlay(line);
    //   console.log(points, 'pointspointspointspoints');
    },
    entrpy(obj) {
      console.log(obj);
      var html = '<table><tr><td>名称：</td><td>' + obj.MC + '</td></tr>';
      html += '<tr><td>地址：</td><td>' + obj.DZ + '</td></tr></table>';
      return html;
    },
    // 绘制线
    addPolyline(points, lineWidth = this.lineWidth, color = this.color) {
      var line = new Polyline(points, lineWidth, color);
      this.map.addOverlay(line);
    },
    // 撒点
    addMarkers(points, bol) {
      var markers = [];
      for(var i = 0; i < points.length; i++) {
        var p = points[i];
        var marker = new Marker(p.x, p.y, p.z + 50, this.imgsrc);
        markers.push(marker);
      }
      this.map.addMarkers(markers, bol);
    },
    // 标点
    addMarker(x = 109.99328460625003, y = 27.56505198694341, z = 253.91323195994747) {
      console.log(x, y, z);
      var marker = new Marker(x, y, z, this.imgsrc, '测试啦啦');
      this.map.addOverlay(marker);
    },
    // 定位
    moveTo(x = 109.99328460625003, y = 27.56505198694341) {
      this.map.centerAtLatLng(x, y)
    },
    // 清除
    clearAll() {
      this.map.clearAll();
    }
  },
  mounted() {
  }
}
