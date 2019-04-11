// Echarts 折线图
// import mapDataJson from './mapData.json'
// import chinaMapDataJson from './china.json'
export default {
  mounted() {
    // this.$http.get('/static/map/mapData.json').then(res => {
    //   console.log(1);
    //   this.mapData = res
    // })
    // this.$http.get('/static/map/china.json').then(res => {
    //   this.chinaMapDataJson = res
    // })
  },
  data() {
    return {
      mapData: 'mapData',
      chinaMapDataJson: 'chinaMapDataJson'
    }
  }
}
