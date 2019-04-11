// Echarts 饼图
var colors = ['#d87a80', '#b6a2de', '#e5cf0d', '#97b552', '#2ec7c9', '#ffb980']
export default {
  data() {
    return {
      echartsPieOptions: {
        // 饼图 【不饱满】
        base: {
          title: {
            text: '',
            subtext: '',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,.8)',
            borderColor: 'rgba(12,144,214,.35)',
            borderWidth: '1',
            padding: [5, 10],
            position: function(p) { // 其中p为当前鼠标的位置
              return [p[0] - 100, p[1] - 50];
            },
            formatter: '{b}: ({c})' // formatter: "{b}: {c} ({d}%)"

          },
          color: colors,
          legend: {
            x: 'center',
            y: 'bottom',
            left: '25',
            right: '25',
            bottom: '25',
            itemWidth: 8,
            itemHeight: 8,
            orient: 'horizontal',
            itemGap: 10,
            formatter: function(item) {
              return item
            },
            textStyle: {
              color: '#666',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 10
            },
            data: []
          },
          calculable: true,
          grid: {
            left: '0%',
            right: '4%',
            bottom: '5%',
            containLabel: true
          },
          series: [{
            name: '',
            type: 'pie',
            radius: [20, '65%'],
            center: ['50%', '40%'],
            roseType: 'radius',
            label: {
              normal: {
                show: true,
                position: 'inner',
                textStyle: {
                  color: '#666',
                  fontSize: 14,
                  fontWeight: 'normal'
                },
                formatter: '{d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: '#666',
                  fontSize: 14,
                  fontWeight: 'normal'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: []
          }]
        },
        // 饼图 【饱满】
        full: {
          title: {
            text: '',
            subtext: '',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,.8)',
            borderColor: 'rgba(12,144,214,.35)',
            borderWidth: '1',
            padding: [5, 10],
            position: function(p) { // 其中p为当前鼠标的位置
              return [p[0] - 100, p[1] - 50];
            },
            formatter: '{b}: ({c})' // formatter: "{b}: {c} ({d}%)"

          },
          color: colors,
          legend: {
            x: 'center',
            y: 'bottom',
            left: '25',
            right: '25',
            bottom: '25',
            itemWidth: 8,
            itemHeight: 8,
            orient: 'horizontal',
            itemGap: 10,
            formatter: function(item) {
              return item
            },
            textStyle: {
              color: '#666',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 10
            },
            data: []
          },
          calculable: true,
          grid: {
            left: '0%',
            right: '4%',
            bottom: '5%',
            containLabel: true
          },
          series: [{
            name: '',
            type: 'pie',
            selectedMode: 'single',
            radius: [20, '65%'],
            center: ['50%', '40%'],
            label: {
              normal: {
                show: true,
                position: 'inner',
                textStyle: {
                  color: '#666',
                  fontSize: 14,
                  fontWeight: 'normal'
                },
                formatter: '{d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: '#666',
                  fontSize: 14,
                  fontWeight: 'normal'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: []
          }]
        },
        // 环图
        ringkike: {
          title: {
            text: '',
            textAlign: 'center',
            left: '48%',
            top: '46%',
            textStyle: {
              fontSize: 20,
              color: '#666',
              fontWeight: 'normal'
            }
          },
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,.8)',
            borderColor: 'rgba(12,144,214,.35)',
            borderWidth: '1',
            padding: [5, 10],
            position: function(p) { // 其中p为当前鼠标的位置
              return [p[0] - 100, p[1] - 50];
            },
            formatter: '{b}: ({d}%)' // formatter: "{b}: {c} ({d}%)"
          },
          color: colors,
          legend: {
            x: 'center',
            y: '20',
            bottom: '25',
            itemWidth: 8,
            itemHeight: 8,
            orient: 'horizontal',
            itemGap: 10,
            formatter: function(item) {
              return item
            },
            textStyle: {
              color: '#666',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 10
            },
            data: []
          },
          series: [{
            name: 'pie',
            type: 'pie',
            hoverAnimation: false,
            radius: ['30%', '50%'],
            label: {
              normal: {
                formatter: '{b}\n({d}%)'
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            }
          }]
        },
        // 三环叠加
        stack: {
          title: {
            text: '',
            subtext: '',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,.8)',
            borderColor: 'rgba(12,144,214,.35)',
            borderWidth: '1',
            padding: [5, 10],
            position: function(p) { // 其中p为当前鼠标的位置
              return [p[0] - 100, p[1] - 50];
            },
            formatter: '{b}: ({d}%)' // formatter: "{b}: {c} ({d}%)"
          },
          color: colors,
          legend: {
            x: 'center',
            y: 'bottom',
            left: '25',
            right: '25',
            bottom: '25',
            itemWidth: 8,
            itemHeight: 8,
            orient: 'horizontal',
            itemGap: 10,
            formatter: function(item) {
              return item
            },
            textStyle: {
              color: '#666',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 10
            },
            data: []
          },
          calculable: true,
          grid: {
            left: '0%',
            right: '4%',
            bottom: '5%',
            containLabel: true
          },
          series: [{
            name: '性别',
            type: 'pie',
            radius: [0, '20%'],
            selectedMode: 'single',
            label: {
              normal: {
                show: true,
                position: 'inner',
                textStyle: {
                  color: '#666',
                  fontSize: 14,
                  fontWeight: 'normal'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: []
          }, {
            name: '年龄',
            type: 'pie',
            hoverAnimation: false,
            radius: ['25%', '40%'],
            label: {
              normal: {
                show: false,
                position: 'inner',
                textStyle: {
                  color: '#666',
                  fontSize: 14,
                  fontWeight: 'normal'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            }
          }, {
            name: '人员等级',
            type: 'pie',
            radius: ['45%', '55%'],
            label: {
              normal: {
                show: true,
                //  position: 'inner',
                textStyle: {
                  color: '#666',
                  fontSize: 14,
                  fontWeight: 'normal'
                },
                formatter: '{b}\n({d}%)'
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            }
          }]
        },
        // 战法结果 A【饱满】
        tactics: {
          title: {
            text: '',
            subtext: '',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)' // {a} <br/>
          },
          color: colors,
          legend: {
            orient: 'horizontal',
            x: 'left',
            data: []
          },
          series: [{
            name: '',
            type: 'pie',
            label: {
              normal: {
                formatter: '{b}\n{c} ({d}%)'
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 20,
                shadowColor: 'rgba(0,0,0,.5)',
                shadowOffsetY: 5
              }
            },
            data: []
          }]
        }
      }
    }
  }
}
