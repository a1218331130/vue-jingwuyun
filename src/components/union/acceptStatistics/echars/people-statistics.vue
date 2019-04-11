<!-- 人员类型统计分析 -->
<template>
  <div>
    <div class="tactics__box">
      <div class="tactics__box__title">
        人员类型统计分析
      </div>
      <div class="tactics__box__content">
        <echarts :option="pieTestOps" style="width:100%; height:100%;"></echarts>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .tactics__box {
    margin: 0;
    height: 355px;
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
      &-echars {
        height: 100%;
      }
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
      // 饼图数据
      this.pieTestOps = clone(this.echartsPieOptions.base)
      this.pieTestOps.series[0].data = [{ name: '人员类型1', value: 11 }, { name: '人员类型2', value: 21 }, { name: '人员类型3', value: 31 }, { name: '人员类型4', value: 41 }, { name: '人员类型5', value: 51 }]
    }
  }
</script>
