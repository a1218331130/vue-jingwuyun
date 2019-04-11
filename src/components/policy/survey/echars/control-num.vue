<!-- 全市2017主要刑事案累积分布图 -->
<template>
  <div>
    <div class="tactics__box">
      <div class="tactics__box__title">
        本市每小时的警情趋势变化
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
  //  import _echarts from 'echarts';
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
      this.lineTestOps.xAxis.data = ['0时', '1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时', '24时']
      var temps = [{
        name: '接警',
        type: 'line',
        sampling: 'average',
        itemStyle: {
          normal: {
            color: 'rgb(236,21,98)'
          }
        },
        data: []
      }, {
        name: '处警',
        type: 'line',
        sampling: 'average',
        itemStyle: {
          normal: {
            color: 'rgb(253,139,69)'
          }
        },
        data: []
      }];
      this.lineTestOps.series = temps
      this.lineTestOps.legend.data = ['接警', '处警']
      this.lineTestOps.series[0].data = [250, 350, 450, 150, 1200, 430, 500, 1250, 150, 100, 450, 250, 250, 350, 450, 150, 1200, 430, 500, 1250, 150, 100, 450, 250, 540]
      this.lineTestOps.series[1].data = [850, 650, 150, 150, 200, 930, 300, 250, 150, 950, 450, 250, 850, 650, 150, 150, 200, 930, 300, 250, 150, 950, 450, 250, 540]
    }
  }
</script>
