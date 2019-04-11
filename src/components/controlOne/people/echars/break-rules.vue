<!-- 近一年重点人员增长趋势 -->
<template>
<div class="echarts-div_box">
  <div class="tactics__box">
    <div class="tactics__box__title">
      {{title}}
    </div>
    <div class="tactics__box__content">
      <img :src="echartImg" v-show="echartImg" />
      <echarts v-show="!echartImg" :option="barTestOps" style="width:100%; height:100%;" ref="echart"></echarts>
    </div>
  </div>
</div>
</template>


<script>
  import mixin from '../../../../utils/mixin'
  import { clone } from '../../../../utils/util'
  import echarts from '../../../../widgets/echarts'
  import _echarts from 'echarts';
  import chartsOps from '../../../../utils/echartsOptions/all'
  import mapData from '../../../../utils/echartsOptions/mapData'
  export default {
    mixins: [mixin, chartsOps, mapData],
    components: {
      echarts
    },
    data() {
      return {
        echartImg: '',
        pieTestOps: null,
        lineTestOps: null,
        mapTestOps: null,
        barTestOps: null,
        list: [],
        breakechart: {
          year: [],
          legend: [],
          xdata: []
        },
        breakdata: []
      }
    },
    props: ['echartdata', 'cardata', 'title'],
    computed: {},
    watch: {
      echartdata(val) {
        // console.log(val.breakRules)
        this.breakechart.year = this.getdataMonth()
        this.breakechart.legend = Array.from(new Set(val.breakRules.map(d => {
          if (d.FJDMMC) {
            return d.FJDMMC
          } else {
            return 'pupilc'
          }
        })))
        this.breakechart.legend.map(a => {
          this.breakdata[a] = []
          this.breakechart.year.map(b => {
            let data = ''
            val.breakRules.filter(c => a === c.FJDMMC || a === 'pupilc').map(d => {
              if (d.NY === b) {
                data = d.NUM
              }
            })
            if (data !== '') {
              this.breakdata[a].push(data)
            } else {
              this.breakdata[a].push(0)
            }
          })
        })
        // console.log(this.breakechart.legend)
        // 柱图数据
        this.barTestOps = clone(this.echartsBarOptions.stack)
        this.barTestOps.xAxis.data = this.breakechart.year
        //  this.barTestOps.legend.data = ['人员数量', '人员类型增量']
        this.barTestOps.yAxis = [{ type: 'value', name: '类型' }, { type: 'value', name: '增量', min: 0, max: 10000 }]
        //  this.barTestOps.series[0].data = [320, 270, 360, 340, 280, 800, 320, 270, 360, 340, 280, 800]
        // 涉稳人员、涉恐人员、精神病人、前科人员、涉枪涉爆人员、涉案人员、重点上访人员、吸毒人员
        var temp = []
        this.breakechart.legend.filter(d => d !== 'pupilc').map(c => {
          temp.push({
            name: c,
            type: 'bar',
            barWidth: 20,
            stack: '月份',
            data: this.breakdata[c]
          })
        })
        this.breakechart.legend.filter(d => d === 'pupilc').map(c => {
          temp.push({
            name: '对象类型增量',
            type: 'line',
            symbol: 'circle',
            itemStyle: {
              normal: {
                borderWidth: 0,
                width: 0,
                color: '#ffad01'
              }
            },
            lineStyle: {
              normal: {}
            },
            areaStyle: {
              normal: {
                color: new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(236,21,98)'
                }, {
                  offset: 0.8,
                  color: 'rgba(80,51,0,.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            data: this.breakdata[c]
          })
        })
        // console.log(temp)
        this.barTestOps.series = temp
      },
      cardata(val) {
        // console.log(val.breakRules)
        this.breakechart.year = this.getdataMonth()
        this.breakechart.legend = Array.from(new Set(val.breakRules.map(d => {
          if (d.CLLXMC) {
            return d.CLLXMC
          } else {
            return 'pupilc'
          }
        })))
        this.breakechart.legend.map(a => {
          this.breakdata[a] = []
          this.breakechart.year.map(b => {
            let data = ''
            val.breakRules.filter(c => a === c.CLLXMC || a === 'pupilc').map(d => {
              if (d.NY === b) {
                data = d.NUM
              }
            })
            if (data !== '') {
              this.breakdata[a].push(data)
            } else {
              this.breakdata[a].push(0)
            }
          })
        })
        // console.log(this.breakechart.legend)
        // 柱图数据
        this.barTestOps = clone(this.echartsBarOptions.stack)
        this.barTestOps.xAxis.data = this.breakechart.year
        //  this.barTestOps.legend.data = ['人员数量', '人员类型增量']
        this.barTestOps.yAxis = [{ type: 'value', name: '类型' }, { type: 'value', name: '增量', min: 0, max: 10000 }]
        //  this.barTestOps.series[0].data = [320, 270, 360, 340, 280, 800, 320, 270, 360, 340, 280, 800]
        // 涉稳人员、涉恐人员、精神病人、前科人员、涉枪涉爆人员、涉案人员、重点上访人员、吸毒人员
        var temp = []
        this.breakechart.legend.filter(d => d !== 'pupilc').map(c => {
          temp.push({
            name: c,
            type: 'bar',
            barWidth: 20,
            stack: '月份',
            data: this.breakdata[c]
          })
        })
        this.breakechart.legend.filter(d => d === 'pupilc').map(c => {
          temp.push({
            name: '对象类型增量',
            type: 'line',
            symbol: 'circle',
            itemStyle: {
              normal: {
                borderWidth: 0,
                width: 0,
                color: '#ffad01'
              }
            },
            lineStyle: {
              normal: {}
            },
            areaStyle: {
              normal: {
                color: new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(236,21,98)'
                }, {
                  offset: 0.8,
                  color: 'rgba(80,51,0,.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            data: this.breakdata[c]
          })
        })
        // console.log(temp)
        this.barTestOps.series = temp
      }

    },
    methods: {
      getdataMonth() {
        let d = new Date()
        let result = []
        for (var i = 0; i < 12; i++) {
          d.setMonth(d.getMonth() - 1)
          let m = d.getMonth() + 1
          m = m < 10 ? '0' + m : m
          result.push(d.getFullYear() + '-' + m)
        }
        return result.reverse()
      }
    },
    created() {},
    mounted() {
      // // 柱图数据
      // this.barTestOps = clone(this.echartsBarOptions.stack)
      // this.barTestOps.xAxis.data = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      // //  this.barTestOps.legend.data = ['人员数量', '人员类型增量']
      // this.barTestOps.yAxis = [{ type: 'value', name: '类型' }, { type: 'value', name: '增量', min: 0, max: 10000 }]
      // //  this.barTestOps.series[0].data = [320, 270, 360, 340, 280, 800, 320, 270, 360, 340, 280, 800]
      // // 涉稳人员、涉恐人员、精神病人、前科人员、涉枪涉爆人员、涉案人员、重点上访人员、吸毒人员
      // var temp = [
      //   {
      //     name: '重点群体人员',
      //     type: 'bar',
      //     barWidth: 20,
      //     stack: '月份',
      //     data: [320, 270, 360, 340, 280, 800, 320, 270, 360, 340, 280, 800]
      //   },
      //   {
      //     name: '重点行业单位',
      //     type: 'bar',
      //     barWidth: 20,
      //     stack: '月份',
      //     data: [320, 270, 360, 340, 280, 800, 320, 270, 360, 340, 280, 800]
      //   },
      //   {
      //     name: '重点场所部位',
      //     type: 'bar',
      //     barWidth: 20,
      //     stack: '月份',
      //     data: [320, 270, 360, 340, 500, 700]
      //   },
      //   {
      //     name: '队伍和内部管理',
      //     type: 'bar',
      //     barWidth: 20,
      //     stack: '月份',
      //     data: [320, 270, 360, 340, 500, 700]
      //   },
      //   {
      //     name: '无人驾驶航空器管理',
      //     type: 'bar',
      //     barWidth: 20,
      //     stack: '月份',
      //     data: [320, 270, 360, 340, 500, 700]
      //   },
      //   {
      //     name: '重点线索管理',
      //     type: 'bar',
      //     barWidth: 20,
      //     stack: '月份',
      //     data: [320, 270, 360, 340, 500, 700]
      //   },
      //   {
      //     name: '重点案事件',
      //     type: 'bar',
      //     barWidth: 20,
      //     stack: '月份',
      //     data: [320, 270, 360, 340, 500, 700]
      //   },
      //   {
      //     name: '对象类型增量',
      //     type: 'line',
      //     symbol: 'circle',
      //     itemStyle: {
      //       normal: {
      //         borderWidth: 0,
      //         width: 0,
      //         color: '#ffad01'
      //       }
      //     },
      //     lineStyle: {
      //       normal: {}
      //     },
      //     areaStyle: {
      //       normal: {
      //         color: new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
      //           offset: 0,
      //           color: 'rgb(236,21,98)'
      //         }, {
      //           offset: 0.8,
      //           color: 'rgba(80,51,0,.1)'
      //         }], false),
      //         shadowColor: 'rgba(0, 0, 0, 0.1)',
      //         shadowBlur: 10
      //       }
      //     },
      //     data: [2320, 2270, 2360, 2340, 2280, 2800, 2320, 2270, 3620, 2340, 2280, 8100]
      //   }];
      // this.barTestOps.series = temp
    }
  }

</script>
