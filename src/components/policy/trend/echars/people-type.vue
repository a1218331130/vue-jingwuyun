<!--  全市2017主要刑事案件占比 -->
<template>
<div>
  <div class="tactics__box">
    <div class="tactics__box__title">
      全市2017主要刑事案件占比
    </div>
    <el-row class="tactics__box__content">
      <el-col :span="16" class="tactics__box__content-echars">
        <echarts :option="pieTestOps" style="width:100%; height:100%;"></echarts>
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
      pieTestOpsAge: null,
      pieTestOpsGrade: null,
      lineTestOps: null,
      mapTestOps: null,
      barTestOps: null,
      isChange: true,
      showDetail: true,
      options: {
        column: 'four',
        title: '全市2017主要刑事案件占比',
        tool: null,
        head: ['名称', '线索', '环比'],
        // 诈骗案、盗窃案、抢夺案、抢劫案、敲诈案、故意杀人
        list: [{ id: 1, name: '01', alarm: '435', danger: '52%', order: '71' },
          { id: 2, name: '02', alarm: '434', danger: '52%', order: '71' },
          { id: 3, name: '03', alarm: '134', danger: '52%', order: '71' },
          { id: 4, name: '04', alarm: '834', danger: '52%', order: '71' },
          { id: 5, name: '05', alarm: '1234', danger: '52%', order: '71' },
          { id: 6, name: '06', alarm: '2234', danger: '52%', order: '71' },
          { id: 7, name: '07', alarm: '234', danger: '52%', order: '71' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    showList() {
      this.showDetail = !this.showDetail;
    },
    change() {
      this.isChange = !this.isChange
    }
  },
  created() {
    console.log();
  },
  mounted() {
    // 饼图数据
    this.pieTestOps = clone(this.echartsPieOptions.base)
    // 诈骗案、盗窃案、抢夺案、抢劫案、敲诈案、故意杀人
    this.pieTestOps.legend.data = ['诈骗案', '盗窃案', '抢夺案', '抢劫案', '敲诈案', '故意杀人']
    this.pieTestOps.series[0].data = [{ name: '诈骗案', value: 11 }, { name: '盗窃案', value: 21 }, {
      name: '抢夺案',
      value: 31
    }, { name: '抢劫案', value: 41 }, { name: '敲诈案', value: 51 }, { name: '故意杀人', value: 41 }, { name: '其它', value: 51 }]
    // 抢夺、抢劫、诈骗、盗窃
    this.pieTestOpsGrade = clone(this.echartsPieOptions.ringkike)
    this.pieTestOpsGrade.series[0].data = [{ name: '抢夺', value: 11 }, { name: '抢劫', value: 21 }, {
      name: '诈骗',
      value: 31
    }, { name: '盗窃', value: 41 }, { name: '其它', value: 51 }]
  }
}
</script>
