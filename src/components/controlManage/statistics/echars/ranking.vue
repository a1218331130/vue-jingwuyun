<!-- 近三年重点人员类型同比分析 -->
<template>
  <div>
    <div class="tactics__box">
      <div class="tactics__box__title">
        近三年重点人员类型同比分析
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
    padding-bottom: 0;
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
      // 柱图数据base
      this.barTestOps = clone(this.echartsBarOptions.horizontal)
      this.barTestOps.legend.data = ['2015', '2016', '2017']
      this.barTestOps.xAxis.data = ['涉恐人员', '涉稳人员', '精神病人', '吸毒人员', '前科人员', '涉枪涉爆人员', '在逃人员', '上访人员']
      var temps = [{
        name: '2015',
        type: 'bar',
        barWidth: 20,
        data: [320, 270, 360, 340, 280, 800, 270, 360]
      }, {
        name: '2016',
        type: 'bar',
        barWidth: 20,
        data: [30, 270, 60, 340, 280, 800, 270, 360, 340, 280, 800]
      }, {
        name: '2017',
        type: 'bar',
        barWidth: 20,
        data: [30, 270, 60, 340, 280, 800, 270, 360, 340, 280, 800]
      }]
      this.barTestOps.series = temps
    }
  }
</script>
