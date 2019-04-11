<!-- 近一年重点人员增长趋势 -->
<template>
<div>
  <div class="tactics__box">
    <div class="tactics__box__title">
      协同办公单位统计
    </div>
    <div class="tactics__box__content">
      <echarts :option="barTestOps" style="width:100%; height:100%;"></echarts>
    </div>
  </div>
</div>
</template>
<style lang="scss" scoped>
.tactics__box {
    margin: 0;
    height: 465px;
    padding: 10px 10px 0;
    &__title {
        background: #85c0e9;
        color: #fff;
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
    }
    &__content {
        background: #fff;
        height: 100%;
        overflow: hidden;
        border: 1px solid #ccc;
    }
    &__title + &__content {
        height: calc(100% - 40px);
        border-top: 0;
    }
}
</style>

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
    // 柱图数据
    this.barTestOps = clone(this.echartsBarOptions.horizontalType)
    this.barTestOps.xAxis.data = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    this.barTestOps.legend.data = ['人员数量', '人员类型增量']
    this.barTestOps.series[0].data = [320, 270, 360, 340, 280, 800, 320, 270, 360, 340, 280, 800]
    this.barTestOps.series[1].data = [320, 270, 360, 340, 280, 800, 320, 270, 360, 340, 280, 800]
  }
}
</script>
