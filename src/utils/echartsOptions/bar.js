// Echarts 柱状图
var colors = ['#ff9a24', '#d87a80', '#97b552', '#2ec7c9', '#b6a2de', '#e5cf0d', '#2ec7c9', '#69ec09', '#5ab1ef', '#ffb980', '#83c929', '#9b6aea']
export default {
  data() {
    return {
      echartsBarOptions: {
        base: {
          title: {
            text: '',
            subtext: '',
            x: 'center'
          },
          tooltip: {},
          color: colors,
          legend: {},
          xAxis: {
            axisLabel: {
              interval: 0,
              rotate: '15'
            },
            axisLine: {
              lineStyle: {
                color: '#797979'
              }
            }
          },
          yAxis: {
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#797979'
              }
            }
          },
          grid: {
            left: '20',
            right: '20',
            bottom: '25',
            containLabel: true
          },
          series: [{
            name: '',
            type: 'bar'
          }]
        },
        horizontal: {
          title: {
            text: '',
            subtext: '',
            x: 'center'
          },
          tooltip: {},
          color: colors,
          legend: {
            right: '25',
            top: '15',
            height: '8',
            width: '15',
            orient: 'vertical'
          },
          xAxis: {
            axisTick: false,
            interval: 0,
            axisLabel: {
              interval: 0,
              rotate: '15'
            },
            axisLine: {
              lineStyle: {
                color: '#797979'
              }
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
            type: 'bar',
            barWidth: 20
          }]
        },
        horizontalType: {
          title: {
            text: '',
            subtext: ''
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
          color: colors,
          legend: {
            right: '25',
            top: '15',
            height: '8',
            width: '15',
            orient: 'vertical'
          },
          xAxis: {
            splitNumber: '25',
            axisTick: false,
            axisLabel: {
              interval: 1
            },
            axisLine: {
              lineStyle: {
                color: '#797979'
              }
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
            label: {
              normal: {
                show: false,
                position: 'right',
                color: '#1dabf7',
                formatter: '{c}人'
              }
            },
            name: '人员数量',
            type: 'bar',
            barWidth: 20
          }, {
            name: '人员类型增量',
            type: 'line'
          }]
        },
        stack: {
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
          color: colors,
          legend: {
            right: '25',
            top: '15',
            height: '8',
            width: '15',
            orient: 'vertical'
          },
          xAxis: {
            type: 'category',
            splitNumber: '25',
            axisTick: false,
            axisLabel: {
              interval: 0,
              rotate: '20'
            },
            axisLine: {
              lineStyle: {
                color: '#797979'
              }
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
            type: 'bar',
            barWidth: 20
          }, {
            name: '',
            type: 'line',
            barWidth: 20
          }]
        }
      }
    }
  }
}
