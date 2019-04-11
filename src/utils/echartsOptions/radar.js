// Echarts 雷达图
export default {
  data() {
    return {
      echartsRadarOptions: {
        base: {
          title: {
            text: ''
          },
          tooltip: {},
          legend: {
            data: []
          },
          radar: [{
            indicator: [],
            center: ['45%', '50%'],
            radius: 120,
            startAngle: 90,
            name: {
              textStyle: {
                color: '#666'
              }
            },
            splitNumber: 4,
            shape: 'circle',
            splitArea: {
              areaStyle: {
                color: ['rgba(114, 172, 209, 0.2)',
                  'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)',
                  'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'
                ],
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 10
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.5)'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }
          }],
          series: [{
            name: '雷达图',
            type: 'radar',
            symbol: 'arrow',
            itemStyle: {
              normal: {
                color: '#1c7dc6',
                borderColor: '#0274b0'
              }
            },
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  console.log('params', params);
                }
              }
            },
            data: []
          }]
        }
      }
    }
  }
}
