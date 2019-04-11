<!-- 近三年重点人员类型同比分析 -->
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
        ranking: {
          year: [],
          echarttype: [],
          serierdata: []
        }

      }
    },
    computed: {},
    props: ['echartdata', 'cardata', 'title'],
    watch: {
      echartdata(val) {
        this.ranking.echarttype = Array.from(new Set(val.ranking.map(d => {
          return d.FJDMMC
        })))
        this.ranking.serierdata = val.ranking.map(d => {
          return {
            name: d.YEAR,
            type: 'bar',
            stack: '年份',
            barWidth: 20,
            data: d.NUM
          }
        })
        this.ranking.year.map(a => {
          this.ranking[a] = []
          this.ranking.echarttype.map(b => {
            let data = ''
            val.ranking.filter(d => d.YEAR === a.toString()).map(c => {
              if (b === c.FJDMMC) {
                data = c.NUM
              }
            })
            if (data !== '') {
              this.ranking[a].push(data)
            } else {
              this.ranking[a].push(0)
            }
          })
        })
        // 柱图数据stack
        this.barTestOps = clone(this.echartsBarOptions.stack)
        this.barTestOps.legend.data = this.ranking.year
        this.barTestOps.xAxis.data = this.ranking.echarttype
        var temps = []
        this.ranking.year.map(d => {
          temps.push({
            name: d,
            type: 'bar',
            stack: '年份',
            barWidth: 20,
            data: this.ranking[d]
          })
        })
        // var temps = [
        //   {
        //     name: '2015',
        //     type: 'bar',
        //     stack: '年份',
        //     barWidth: 20,
        //     data: [320, 270, 360, 340, 280, 800, 270]
        //   }, {
        //     name: '2016',
        //     type: 'bar',
        //     stack: '年份',
        //     barWidth: 20,
        //     data: [30, 270, 60, 340, 280, 800, 270]
        //   }, {
        //     name: '2017',
        //     type: 'bar',
        //     stack: '年份',
        //     barWidth: 20,
        //     data: [30, 270, 60, 340, 280, 800, 270]
        //   }
        // ]
        this.barTestOps.series = temps
      },
      cardata(val) {
        this.ranking.echarttype = Array.from(new Set(val.ranking.map(d => {
          return d.CLLXMC
        })))
        this.ranking.serierdata = val.ranking.map(d => {
          return {
            name: d.YEAR,
            type: 'bar',
            stack: '年份',
            barWidth: 20,
            data: d.NUM
          }
        })
        this.ranking.year.map(a => {
          this.ranking[a] = []
          this.ranking.echarttype.map(b => {
            let data = ''
            val.ranking.filter(d => d.YEAR === a.toString()).map(c => {
              if (b === c.CLLXMC) {
                data = c.NUM
              }
            })
            if (data !== '') {
              this.ranking[a].push(data)
            } else {
              this.ranking[a].push(0)
            }
          })
        })
        // 柱图数据stack
        this.barTestOps = clone(this.echartsBarOptions.stack)
        this.barTestOps.legend.data = this.ranking.year
        this.barTestOps.xAxis.data = this.ranking.echarttype
        var temps = []
        this.ranking.year.map(d => {
          temps.push({
            name: d,
            type: 'bar',
            stack: '年份',
            barWidth: 20,
            data: this.ranking[d]
          })
        })
        // var temps = [
        //   {
        //     name: '2015',
        //     type: 'bar',
        //     stack: '年份',
        //     barWidth: 20,
        //     data: [320, 270, 360, 340, 280, 800, 270]
        //   }, {
        //     name: '2016',
        //     type: 'bar',
        //     stack: '年份',
        //     barWidth: 20,
        //     data: [30, 270, 60, 340, 280, 800, 270]
        //   }, {
        //     name: '2017',
        //     type: 'bar',
        //     stack: '年份',
        //     barWidth: 20,
        //     data: [30, 270, 60, 340, 280, 800, 270]
        //   }
        // ]
        this.barTestOps.series = temps
      }
    },
    methods: {
      getyear() {
        let d = new Date()
        for (var i = 0; i < 3; i++) {
          this.ranking.year.unshift(d.getFullYear() - i)
        }
      }
    },
    created() {
      this.getyear()
    },
    mounted() {
      // // 柱图数据stack
      // this.barTestOps = clone(this.echartsBarOptions.stack)
      // this.barTestOps.legend.data = ['2015', '2016', '2017']
      // this.barTestOps.xAxis.data = ['重点群体人员', '重点行业单位', '重点场所部位', '队伍和内部管理', '无人驾驶航空器管理', '重点线索管理', '重点案事件']
      // var temps = [
      //   {
      //     name: '2015',
      //     type: 'bar',
      //     stack: '年份',
      //     barWidth: 20,
      //     data: [320, 270, 360, 340, 280, 800, 270]
      //   }, {
      //     name: '2016',
      //     type: 'bar',
      //     stack: '年份',
      //     barWidth: 20,
      //     data: [30, 270, 60, 340, 280, 800, 270]
      //   }, {
      //     name: '2017',
      //     type: 'bar',
      //     stack: '年份',
      //     barWidth: 20,
      //     data: [30, 270, 60, 340, 280, 800, 270]
      //   }
      // ]
      // this.barTestOps.series = temps
    }
  }

</script>
