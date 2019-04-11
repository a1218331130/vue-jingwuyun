<template>
  <div style="padding: 20px;">
    <echarts ref="echarts" @init="echartInit" :option="option" style="width:100%; height:600px;"></echarts>
  </div>
</template>
<style scoped>
</style>
<script>
  import echarts from '../../widgets/echarts'
  import socketIO from '../../utils/socket-io'
  export default {
    mixins: [socketIO],
    components: {echarts},
    data() {
      return {
        option: {
          title: {
            text: 'ECharts 示例子'
          },
          tooltip: {},
          legend: {
            data: ['销量']
          },
          xAxis: {
            data: ['衬衫', '羊毛衣', '雪纺衫', '裤子', '高跟鞋', '袜子']
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        }
      }
    },
    methods: {
      echartInit(chart) {
        // echart完成初始化
        console.log(chart);
      }
    },
    created() {
    }
  }
</script>
