<!-- 概况(统计) -->
<template>
  <div>
    <div class="tactics__box">
      <div class="tactics__box__title">
        辖区重点人员类型分布情况
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
    height: 325px;
    padding: 10px;
    padding-bottom: 0px;
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
      // 柱图数据
      this.barTestOps = clone(this.echartsBarOptions.horizontalType)
      this.barTestOps.xAxis.data = ['在逃人员', '前科人员', '少数民族', '吸毒人员', '涉人员', '涉枪人员']
      this.barTestOps.series[0].data = [320, 270, 360, 340, 280, 800, 500, 700]
    }
  }
</script>
