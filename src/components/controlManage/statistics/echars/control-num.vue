<!-- 近三年重点人员数量同比分析 -->
<template>
  <div>
    <div class="tactics__box">
      <div class="tactics__box__title">
        近三年重点人员数量同比分析
      </div>
      <div class="tactics__box__content">
        <echarts :option="lineTestOps" style="width:100%; height:100%;"></echarts>
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
  import _echarts from 'echarts';
  import mixin from '../../../../utils/mixin'
  import {clone} from '../../../../utils/util'
  import echarts from '../../../../widgets/echarts'
  import chartsOps from '../../../../utils/echartsOptions/all'
  export default {
    mixins: [mixin, chartsOps],
    components: {
      echarts
    },
    data() {
      return {
        pieTestOps: null,
        lineTestOps: null,
        barTestOps: null,
        list: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      echartInit(chart) {
        // echart完成初始化
        console.log(chart);
      }
    },
    created() {
      console.log();
    },
    mounted() {
      // 折线图数据
      this.lineTestOps = clone(this.echartsLineOptions.situation)
      this.lineTestOps.xAxis.data = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      var temps = [{
        name: '2015',
        type: 'line',
        sampling: 'average',
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
            }, {
              offset: 0.8,
              color: 'rgba(236,21,98,.1)'
            }], false),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10
          }
        },
        data: []
      }, {
        name: '2016',
        type: 'line',
        sampling: 'average',
        itemStyle: {
          normal: {
            color: 'rgb(253,139,69)'
          }
        },
        areaStyle: {
          normal: {
            color: new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgb(253,139,69)'
            }, {
              offset: 0.8,
              color: 'rgba(253,139,69,.1)'
            }], false),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10
          }
        },
        data: []
      }, {
        name: '2017',
        type: 'line',
        sampling: 'average',
        itemStyle: {
          normal: {
            color: 'rgb(33,178,75)'
          }
        },
        areaStyle: {
          normal: {
            color: new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgb(33,178,75)'
            }, {
              offset: 0.8,
              color: 'rgba(33,178,75,.1)'
            }], false),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10
          }
        },
        data: []
      }];
      this.lineTestOps.series = temps
      this.lineTestOps.legend.data = ['2015', '2016', '2017']
      this.lineTestOps.series[0].data = [250, 350, 450, 150, 1200, 430, 500, 1250, 150, 100, 450, 250]
      this.lineTestOps.series[1].data = [850, 650, 150, 150, 200, 930, 300, 250, 150, 950, 450, 250]
      this.lineTestOps.series[2].data = [250, 350, 450, 190, 200, 430, 3100, 250, 150, 100, 450, 250]
    }
  }
</script>
