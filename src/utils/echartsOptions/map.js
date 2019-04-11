// Echarts 地图
var colors = ['#f5a43b', '#ffd9a8', '#b5e5ed']
export default {
  data() {
    return {
      echartsMapOptions: {
        base: {
          tooltip: {},
          scaleLimit: {
            min: 0.8,
            max: 5
          },
          visualMap: {
            min: 0,
            max: 80,
            show: '',
            text: ['高', '低'],
            realtime: false,
            zoom: 1.3,
            calculabel: true,
            right: 'right',
            top: 'bottom',
            inRange: {
              color: ['#e0ffff', '#006edd']
            }
          },
          series: [{
            name: '怀化市',
            type: 'map',
            mapType: 'mapData',
            roam: true,
            zoom: 1.3,
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                borderColor: 'rgba(0, 0, 0, .2)'
              }
            }
          }]
        },
        flowMap: {
          scaleLimit: {
            min: 1.3,
            max: 5
          },
          visualMap: {
            type: 'continuous',
            min: 0,
            max: 100,
            show: '',
            text: ['高', '低'],
            realtime: false,
            zoom: 2,
            calculabel: true,
            right: 'right',
            top: 'bottom',
            inRange: {
              color: ['#60fba4', '#FDE44C', '#FCB25D']
            }
          },
          geo: {
            map: 'mapData',
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                borderColor: 'rgba(0, 0, 0, .2)'
              },
              emphasis: {}
            }
          },
          color: ['#f32628', '#ffd9a8', '#029edb', '#21f92b', '#f5a43b'],
          series: [{
            type: 'scatter',
            coordinateSystem: 'geo',
            data: [],
            symbolSize: 20,
            symbol: '',
            symbolRotate: 35,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: 'lime'
              }
            }
          }, {
            name: 'categoryA',
            type: 'map',
            geoIndex: 0,
            // tooltip: {show: false},
            data: []
          }]
        },
        chinaMap: {
          tooltip: {
            trigger: 'item',
            formatter: '{b}:{c}'
          },
          title: {
            text: '',
            subtext: '',
            sublink: '',
            left: 'center',
            textStyle: {
              color: '#666666'
            }
          },
          backgroundColor: '#ffffff',
          scaleLimit: {
            min: 0.8,
            max: 5
          },
          visualMap: {
            type: 'piecewise',
            inverse: true,
            left: '15',
            bottom: '15',
            // dimension: 2,
            min: 0,
            max: 500,
            splitNumber: 3,
            orient: 'horizontal',
            padding: [10, 10, 10, 30],
            borderColor: '#d7d7d7',
            borderWidth: 1,
            backgroundColor: '#F2F2F2',
            textStyle: {
              color: '#666666'
            },
            pieces: [
              { min: 10000, color: colors[0] },
              { min: 1000, max: 10000, color: colors[1] },
              { max: 1000, color: colors[2] }
            ],
            inRange: {
              opacity: 1,
              color: colors
            }
          },
          grid: {
            height: 200,
            width: 8,
            right: 80,
            bottom: 10
          },
          xAxis: {
            type: 'category',
            data: [],
            splitNumber: 1,
            show: false
          },
          yAxis: {
            position: 'right',
            min: 0,
            max: 20,
            splitNumber: 20,
            inverse: true,
            axisLabel: {
              show: true
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            data: []
          },
          series: [{
            name: '中国',
            type: 'map',
            mapType: 'chinaMapDataJson',
            // selectedMode: 'multiple',
            roam: true,
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            data: []
          }]
        },
        heatmap: {
          title: {
            text: '',
            subtext: '',
            sublink: '',
            left: 'center',
            textStyle: {
              color: '#666666'
            }
          },
          backgroundColor: '#ffffff',
          scaleLimit: {
            min: 0.8,
            max: 5
          },
          visualMap: {
            type: 'piecewise',
            inverse: true,
            left: '15',
            bottom: '15',
            // dimension: 2,
            splitNumber: 3,
            orient: 'horizontal',
            padding: [10, 10, 10, 30],
            borderColor: '#d7d7d7',
            borderWidth: 1,
            backgroundColor: '#F2F2F2',
            textStyle: {
              color: '#666666'
            },
            pieces: [
              { min: 1000, color: colors[0] },
              { min: 100, max: 1000, color: colors[1] },
              { max: 100, color: colors[2] }
            ],
            inRange: {
              opacity: 0.7,
              color: colors
            }
          },
          geo: {
            map: 'chinaMapDataJson',
            layoutCenter: ['40%', '80%'],
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            zoom: '1.13',
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#a0dde8',
                borderColor: '#fff'
              },
              emphasis: {
                areaColor: '#f5a43b'
              }
            }
          },
          series: [{
            name: '',
            type: 'heatmap',
            mapType: 'china',
            coordinateSystem: 'geo'
          }]
        }
      }
    }
  }
}
