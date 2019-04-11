<!-- 近三年重点人员数量同比分析 -->
<template>
<div class="echarts-div_box">
  <div class="tactics__box">
    <div class="tactics__box__title">
      {{title}}
    </div>
    <div class="tactics__box__content">
      <img :src="echartImg" v-show="echartImg" />
      <echarts v-show="!echartImg" :option="lineTestOps" style="width:100%; height:100%;" ref="echart"></echarts>
    </div>
  </div>
</div>
</template>

<script>
  import _echarts from 'echarts';
  import mixin from '../../../../utils/mixin'
  import { clone } from '../../../../utils/util'
  import echarts from '../../../../widgets/echarts'
  import chartsOps from '../../../../utils/echartsOptions/all'
  export default {
    mixins: [mixin, chartsOps],
    components: {
      echarts
    },
    data() {
      return {
        echartImg: '',
        pieTestOps: null,
        lineTestOps: null,
        barTestOps: null,
        list: [],
        controlnum: {
          year: [],
          year1: [],
          year2: [],
          year3: []
        }
      }
    },
    props: ['echartdata', 'cardata', 'title'],
    computed: {},
    watch: {
      echartdata(val) {
        this.getyear()
        // let year1 = ''
        let month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        this.controlnum.year.map(a => { // 遍历年
          this.controlnum[a] = []
          month.map(b => { // 遍历月
            // let data = []
            let data = ''
            val.controlNum.filter(d => d.YEAR === a.toString()).map(c => { // 获取2018年数据
              if (b === c.NY.split('-')[1]) {
                data = c.NUM
              }
            })
            if (data !== '') {
              this.controlnum[a].push(data)
            } else {
              this.controlnum[a].push(0)
            }
          })
        })
        // 折线图数据
        this.lineTestOps = clone(this.echartsLineOptions.situation)
        this.lineTestOps.xAxis.data = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        var temps = []
        this.controlnum.year.map(d => {
          temps.push({
            name: d,
            type: 'line',
            sampling: 'average',
            data: this.controlnum[d],
            itemStyle: {
              normal: {
                color: 'rgb(236,21,98)'
              }
            },
            areaStyle: {
              normal: {
                color: new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(236,21,98)'
                },
                {
                  offset: 0.8,
                  color: 'rgba(236,21,98,.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            }
          })
        })
        temps[1].itemStyle.normal.color = 'rgb(253,139,69)'
        temps[1].areaStyle.normal.color = new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgb(253,139,69)'
        },
        {
          offset: 0.8,
          color: 'rgba(236,21,98,.1)'
        }], false)
        temps[2].itemStyle.normal.color = 'rgb(33,178,75)'
        temps[2].areaStyle.normal.color = new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgb(33,178,75)'
        },
        {
          offset: 0.8,
          color: 'rgba(236,21,98,.1)'
        }], false)
        this.lineTestOps.series = temps
        this.lineTestOps.legend.data = this.controlnum.year
      },
      cardata(val) {
        this.getyear()
        // let year1 = ''
        let month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        this.controlnum.year.map(a => { // 遍历年
          this.controlnum[a] = []
          month.map(b => { // 遍历月
            // let data = []
            let data = ''
            val.controlNum.filter(d => d.YEAR === a.toString()).map(c => { // 获取2018年数据
              if (b === c.NY.split('-')[1]) {
                data = c.NUM
              }
            })
            if (data !== '') {
              this.controlnum[a].push(data)
            } else {
              this.controlnum[a].push(0)
            }
          })
        })
        // 折线图数据
        this.lineTestOps = clone(this.echartsLineOptions.situation)
        this.lineTestOps.xAxis.data = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        var temps = []
        this.controlnum.year.map(d => {
          temps.push({
            name: d,
            type: 'line',
            sampling: 'average',
            data: this.controlnum[d],
            itemStyle: {
              normal: {
                color: 'rgb(236,21,98)'
              }
            },
            areaStyle: {
              normal: {
                color: new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(236,21,98)'
                },
                {
                  offset: 0.8,
                  color: 'rgba(236,21,98,.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            }
          })
        })
        temps[1].itemStyle.normal.color = 'rgb(253,139,69)'
        temps[1].areaStyle.normal.color = new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgb(253,139,69)'
        },
        {
          offset: 0.8,
          color: 'rgba(236,21,98,.1)'
        }], false)
        temps[2].itemStyle.normal.color = 'rgb(33,178,75)'
        temps[2].areaStyle.normal.color = new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgb(33,178,75)'
        },
        {
          offset: 0.8,
          color: 'rgba(236,21,98,.1)'
        }], false)
        this.lineTestOps.series = temps
        this.lineTestOps.legend.data = this.controlnum.year
      }
    },
    methods: {
      getyear() {
        let d = new Date()
        for (var i = 0; i < 3; i++) {
          this.controlnum.year.unshift((d.getFullYear() - i).toString())
        }
      },
      echartInit(chart) {
        // echart完成初始化
        console.log(chart);
      }
    },
    created() {
      console.log();
    },
    mounted() {
      // // 折线图数据
      // this.lineTestOps = clone(this.echartsLineOptions.situation)
      // this.lineTestOps.xAxis.data = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      // var temps = [
      //   {
      //     name: '2015',
      //     type: 'line',
      //     sampling: 'average',
      //     itemStyle: {
      //       normal: {
      //         color: 'rgb(236,21,98)'
      //       }
      //     },
      //     areaStyle: {
      //       normal: {
      //         color: new _echarts.graphic.LinearGradient(0, 0, 0, 1, [
      //           {
      //             offset: 0,
      //             color: 'rgb(236,21,98)'
      //           },
      //           {
      //             offset: 0.8,
      //             color: 'rgba(236,21,98,.1)'
      //           }
      //         ], false),
      //         shadowColor: 'rgba(0, 0, 0, 0.1)',
      //         shadowBlur: 10
      //       }
      //     },
      //     data: []
      //   },
      //   {
      //     name: '2016',
      //     type: 'line',
      //     sampling: 'average',
      //     itemStyle: {
      //       normal: {
      //         color: 'rgb(253,139,69)'
      //       }
      //     },
      //     areaStyle: {
      //       normal: {
      //         color: new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
      //           offset: 0,
      //           color: 'rgb(253,139,69)'
      //         }, {
      //           offset: 0.8,
      //           color: 'rgba(253,139,69,.1)'
      //         }], false),
      //         shadowColor: 'rgba(0, 0, 0, 0.1)',
      //         shadowBlur: 10
      //       }
      //     },
      //     data: []
      //   },
      //   {
      //     name: '2017',
      //     type: 'line',
      //     sampling: 'average',
      //     itemStyle: {
      //       normal: {
      //         color: 'rgb(33,178,75)'
      //       }
      //     },
      //     areaStyle: {
      //       normal: {
      //         color: new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
      //           offset: 0,
      //           color: 'rgb(33,178,75)'
      //         }, {
      //           offset: 0.8,
      //           color: 'rgba(33,178,75,.1)'
      //         }], false),
      //         shadowColor: 'rgba(0, 0, 0, 0.1)',
      //         shadowBlur: 10
      //       }
      //     },
      //     data: []
      //   }];
      // this.lineTestOps.series = temps
      // this.lineTestOps.legend.data = ['2015', '2016', '2017']
      // this.lineTestOps.series[0].data = [250, 350, 450, 150, 1200, 430, 500, 1250, 150, 100, 450, 250]
      // this.lineTestOps.series[1].data = [850, 650, 150, 150, 200, 930, 300, 250, 150, 950, 450, 250]
      // this.lineTestOps.series[2].data = [250, 350, 450, 190, 200, 430, 3100, 250, 150, 100, 450, 250]
    }
  }

</script>
