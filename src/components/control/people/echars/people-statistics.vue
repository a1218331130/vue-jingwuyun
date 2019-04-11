<!-- 人员类型统计分析 -->
<template>
<div class="echarts-div_box">
  <div class="tactics__box">
    <div class="tactics__box__title">
      {{title}}
    </div>
    <div class="tactics__box__content">
      <img :src="echartImg" v-show="echartImg" />
      <echarts v-show="!echartImg" :option="pieTestOps" style="width:100%; height:100%;" ref="echart"></echarts>
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
    props: ['echartdata', 'cardata', 'title'],
    data() {
      return {
        echartImg: '',
        pieTestOps: null,
        lineTestOps: null,
        mapTestOps: null,
        barTestOps: null,
        list: [],
        statis: {
          data: [],
          serives: []
        }
      }
    },
    computed: {},
    watch: {
      echartdata(val) {
        this.statis.data = Array.from(new Set(val.statistics.map(d => {
          return d.FJDMMC
        })))
        this.statis.serives = val.statistics.map(d => {
          return { name: d.FJDMMC, value: d.NUM }
        })
        // 饼图数据
        this.pieTestOps = clone(this.echartsPieOptions.full)
        // 涉稳人员、涉恐人员、精神病人、前科人员、涉枪涉爆人员、涉案人员、重点上访人员、吸毒人员
        this.pieTestOps.legend.data = this.statis.data
        this.pieTestOps.series[0].data = this.statis.serives
        this.pieTestOps.series[0].center = ['50%', '50%']
        this.pieTestOps.series[0].labelLine = {
          show: true
        }
        this.pieTestOps.series[0].label.normal = {
          position: 'outside',
          formatter: '{b}{c}'
        }
      },
      cardata(val) {
        this.statis.data = Array.from(new Set(val.statistics.map(d => {
          return d.CLLXMC
        })))
        this.statis.serives = val.statistics.map(d => {
          return { name: d.CLLXMC, value: d.NUM }
        })
        // 饼图数据
        this.pieTestOps = clone(this.echartsPieOptions.full)
        // 涉稳人员、涉恐人员、精神病人、前科人员、涉枪涉爆人员、涉案人员、重点上访人员、吸毒人员
        this.pieTestOps.legend.data = this.statis.data
        this.pieTestOps.series[0].data = this.statis.serives
        this.pieTestOps.series[0].center = ['50%', '50%']
        this.pieTestOps.series[0].labelLine = {
          show: true
        }
        this.pieTestOps.series[0].label.normal = {
          position: 'outside',
          formatter: '{b}{c}'
        }
      }
    },
    methods: {},
    created() {
      console.log();
    },
    mounted() {
      // // 饼图数据
      // this.pieTestOps = clone(this.echartsPieOptions.base)
      // // 涉稳人员、涉恐人员、精神病人、前科人员、涉枪涉爆人员、涉案人员、重点上访人员、吸毒人员
      // this.pieTestOps.legend.data = ['重点群体人员', '重点行业单位', '重点场所部位', '队伍和内部管理', '无人驾驶航空器管理', '重点线索管理', '重点案事件']
      // this.pieTestOps.series[0].data = [
      //   { name: '重点群体人员', value: 580 },
      //   { name: '重点行业单位', value: 280 },
      //   { name: '重点场所部位', value: 400 },
      //   { name: '队伍和内部管理', value: 68 },
      //   { name: '无人驾驶航空器管理', value: 300 },
      //   { name: '重点线索管理', value: 600 },
      //   { name: '重点案事件', value: 260 }
      // ]
    }
  }

</script>
