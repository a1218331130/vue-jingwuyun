<!-- 近三年重点人员类型同比分析 -->
<template>
  <div  class="echarts-div_box">
    <div class="tactics__box">
      <div class="tactics__box__title">
        近三年重点对象类型同比分析
      </div>
      <div class="tactics__box__content">
        <echarts :option="barTestOps" style="width:100%; height:100%;"></echarts>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>

</style>

<script>
  import mixin from '../../../../utils/mixin'
  import {clone} from '../../../../utils/util'
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
        pieTestOps: null,
        lineTestOps: null,
        mapTestOps: null,
        barTestOps: null,
        list: []
      }
    },
    computed: {},
    watch: {},
    methods: {},
    created() {
      console.log();
    },
    mounted() {
      // 柱图数据stack
      this.barTestOps = clone(this.echartsBarOptions.stack)
      this.barTestOps.legend.data = ['2015', '2016', '2017']
      this.barTestOps.xAxis.data = ['重点群体人员', '重点行业单位', '重点场所部位', '队伍和内部管理', '无人驾驶航空器管理', '重点线索管理', '重点案事件']
      var temps = [{
        name: '2015',
        type: 'bar',
        stack: '年份',
        barWidth: 20,
        data: [320, 270, 360, 340, 280, 800, 270]
      }, {
        name: '2016',
        type: 'bar',
        stack: '年份',
        barWidth: 20,
        data: [30, 270, 60, 340, 280, 800, 270]
      }, {
        name: '2017',
        type: 'bar',
        stack: '年份',
        barWidth: 20,
        data: [30, 270, 60, 340, 280, 800, 270]
      }]
      this.barTestOps.series = temps
    }
  }
</script>
