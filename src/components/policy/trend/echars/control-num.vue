<!-- 全市2017主要刑事案累积分布图 -->
<template>
<div>
  <div class="tactics__box">
    <div class="tactics__box__title">
      全市2017主要刑事案累积分布图
    </div>
    <el-row class="tactics__box__content">
      <el-col :span="16" class="tactics__box__content-echars">
        <echarts :option="lineTestOps" style="width:100%; height:100%;"></echarts>
      </el-col>
      <el-col :span="8" class="tactics__box__content-echars rel">
        <echartsDetails :options="options"></echartsDetails>
      </el-col>
    </el-row>
  </div>
</div>
</template>
<style lang="scss" scoped>
.tactics__box {
    margin: 0;
    height: 455px;
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
import { clone } from '../../../../utils/util'
import echarts from '../../../../widgets/echarts'
import echartsDetails from '../../../../widgets/echarts/echart-details'
import chartsOps from '../../../../utils/echartsOptions/all'
export default {
  mixins: [mixin, chartsOps],
  components: {
    echarts,
    echartsDetails
  },
  data() {
    return {
      pieTestOps: null,
      lineTestOps: null,
      barTestOps: null,
      options: {
        column: 'four',
        title: '全市2017主要刑事案累积分布图',
        tool: null,
        head: ['月份', '同比', '环比'],
        // 诈骗案、盗窃案、抢夺案、抢劫案、敲诈案、故意杀人
        list: [{ id: 1, name: '01月', alarm: '52%', danger: '52%', order: '71' },
          { id: 2, name: '02月', alarm: '52%', danger: '52%', order: '71' },
          { id: 3, name: '03月', alarm: '52%', danger: '52%', order: '71' },
          { id: 4, name: '04月', alarm: '52%', danger: '52%', order: '71' },
          { id: 5, name: '05月', alarm: '52%', danger: '52%', order: '71' },
          { id: 6, name: '06月', alarm: '52%', danger: '52%', order: '71' },
          { id: 7, name: '07月', alarm: '234', danger: '52%', order: '71' }
        ]
      }
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
    this.lineTestOps.legend.data = ['反贪', '反渎']
    this.lineTestOps.xAxis.data = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    var temps = [{
      name: '反贪',
      type: 'line',
      sampling: 'average',
      itemStyle: {
        normal: {
          color: 'rgb(236,21,98)'
        }
      },
      data: []
    }, {
      name: '反渎',
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
    this.lineTestOps.series[0].data = [250, 350, 450, 150, 1200, 430, 500, 1250, 150, 100, 450, 250, 250, 350, 450, 150, 1200, 430, 500, 1250, 150, 100, 450, 250, 540]
    this.lineTestOps.series[1].data = [850, 650, 150, 150, 200, 930, 300, 250, 150, 950, 450, 250, 850, 650, 150, 150, 200, 930, 300, 250, 150, 950, 450, 250, 540]
  }
}
</script>
