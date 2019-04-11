<!-- 警情类别统计 -->
<template>
  <div>
    <div class="tactics__box">
      <div class="tactics__box__title">
        警情类别统计
      </div>
      <el-row class="tactics__box__content">
        <el-col :span="12" class="tactics__box__content-echars">
          <echarts :option="pieTestOps" style="width:100%; height:100%;"></echarts>
        </el-col>
        <el-col :span="12" class="tactics__box__content-echars">
          <echarts :option="pieTestOpsGrade" style="width:100%; height:100%;"></echarts>
        </el-col>
      </el-row>
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
        pieTestOpsAge: null,
        pieTestOpsGrade: null,
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
      this.pieTestOps.legend.orient = 'vertical'
      this.pieTestOps.legend.y = 'center'
      this.pieTestOps.legend.data = ['群体性事件', '刑事案件', '行政案件', '灾害案件', '求助', '投诉', '有害短信', '骚扰']
      this.pieTestOps.series[0].data = [{name: '群体性事件', value: 11}, {name: '刑事案件', value: 21}, {
        name: '行政案件',
        value: 31
      }, {name: '灾害案件', value: 41}, {name: '求助', value: 51}, {name: '投诉', value: 41}, {
        name: '有害短信',
        value: 51
      }, {name: '骚扰', value: 51}, {name: '其它', value: 51}]
      // 抢夺、抢劫、诈骗、盗窃
      this.pieTestOpsGrade = clone(this.echartsPieOptions.ringkike)
      this.pieTestOpsGrade.legend.data = ['抢夺', '抢劫', '诈骗', '盗窃']
      this.pieTestOpsGrade.series[0].data = [{name: '抢夺', value: 11}, {name: '抢劫', value: 21}, {
        name: '诈骗',
        value: 31
      }, {name: '盗窃', value: 41}, {name: '其它', value: 51}]
    }
  }
</script>
