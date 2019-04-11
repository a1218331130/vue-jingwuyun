<!-- 概况(统计) -->
<template>
  <div  class="echarts-div_box">
    <div class="tactics__box">
      <div class="tactics__box__title">
        辖区重点对象类型分布
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
      this.barTestOps = clone(this.echartsBarOptions.horizontalType)
      // 沅陵县、鹤城区、鹤城区、中方县、辰溪县、溆浦县、会同县、麻阳苗族自治县、新晃侗族自治县、芷江侗族自治县、靖州苗族侗族自治县、通道侗族自治县
      this.barTestOps.legend.data = ['重点群体人员', '重点行业单位', '重点场所部位', '队伍和内部管理', '无人驾驶航空器管理', '重点线索管理', '重点案事件']
      this.barTestOps.xAxis.data = ['沅陵县', '鹤城区', '鹤城区', '中方县', '辰溪县', '会同县', '麻阳苗族自治县', '新晃侗族自治县']
      var temp = [{
        name: '重点群体人员',
        type: 'bar',
        barWidth: 20,
        stack: '月份',
        data: [320, 270, 360, 340, 280, 800, 320, 270, 360, 340, 280, 800]
      }, {
        name: '重点行业单位',
        type: 'bar',
        barWidth: 20,
        stack: '月份',
        data: [320, 270, 360, 340, 280, 800, 320, 270, 360, 340, 280, 800]
      }, {
        name: '重点场所部位',
        type: 'bar',
        barWidth: 20,
        stack: '月份',
        data: [320, 270, 360, 340, 500, 700]
      }, {
        name: '队伍和内部管理',
        type: 'bar',
        barWidth: 20,
        stack: '月份',
        data: [320, 270, 360, 340, 500, 700]
      }, {
        name: '无人驾驶航空器管理',
        type: 'bar',
        barWidth: 20,
        stack: '月份',
        data: [320, 270, 360, 340, 500, 700]
      }, {
        name: '重点线索管理',
        type: 'bar',
        barWidth: 20,
        stack: '月份',
        data: [320, 270, 360, 340, 500, 700]
      }, {
        name: '重点案事件',
        type: 'bar',
        barWidth: 20,
        stack: '月份',
        data: [320, 270, 360, 340, 500, 700]
      }];
      this.barTestOps.series = temp
    }
  }
</script>
