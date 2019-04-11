// Echarts 散点图
export default {
  data() {
    return {
      echartsDshedOptions: {
        test: {
          tooltip: {},
          legend: {
            data: ['销量']
          },
          xAxis: {
            data: ['衬衫', '羊毛衣', '雪纺衫', '裤子', '高跟鞋', '袜子']
          },
          yAxis: {},
          series: [{
            name: '',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        }
      }
    }
  }
}
