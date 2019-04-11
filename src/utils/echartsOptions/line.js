// Echarts 折线图
import echarts from 'echarts';
export default {
  data() {
    return {
      echartsLineOptions: {
        base: {
          title: {
            text: '',
            subtext: '',
            x: 'center'
          },
          tooltip: {},
          legend: {},
          xAxis: {},
          yAxis: {},
          series: [{
            name: '',
            type: 'line',
            data: []
          }]
        },
        situation: {
          title: {
            text: '',
            subtext: '',
            x: 'center'
          },
          tooltip: {
            icon: 'circle',
            trigger: 'axis',
            backgroundColor: 'rgba(0,0,0,.8)',
            borderColor: '#797979',
            borderWidth: '1',
            axisPointer: {
              lineStyle: {
                color: '#797979'
              }
            }
          },
          legend: {
            right: '25',
            top: '15',
            height: '8',
            width: '15',
            orient: 'vertical'
          },
          xAxis: {
            type: 'category',
            axisTick: {
              show: false
            },
            boundaryGap: false,
            splitNumber: '25',
            axisLine: {
              lineStyle: {
                color: '#797979'
              }
            },
            axisLabel: {
              interval: 0,
              rotate: 45
            }
          },
          yAxis: {
            axisTick: false,
            axisLine: {
              lineStyle: {
                color: '#797979'
              }
            }
          },
          grid: {
            left: '25',
            right: '25',
            bottom: '30',
            top: '45',
            containLabel: true
          },
          series: [{
            name: '',
            type: 'line',
            sampling: 'average',
            itemStyle: {
              normal: {
                color: '#47d020'
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#47d020'
                }, {
                  offset: 1,
                  color: '#ebfae7'
                }])
              }
            }
          }]
        }
      }
    }
  }
}
