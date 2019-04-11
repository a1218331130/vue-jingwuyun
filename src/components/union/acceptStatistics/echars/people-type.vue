<!-- 重点人员类型统计 -->
<template>
  <div>
    <div class="tactics__box">
      <div class="tactics__box__title">
        重点人员类型统计
      </div>
      <el-row class="tactics__box__content">
        <el-col :span="8" class="tactics__box__content-echars">
          <echarts :option="pieTestOpsGender" style="width:100%; height:100%;"></echarts>
        </el-col>
        <el-col :span="8" class="tactics__box__content-echars">
          <echarts :option="pieTestOpsAge" style="width:100%; height:100%;"></echarts>
        </el-col>
        <el-col :span="8" class="tactics__box__content-echars">
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
        pieTestOpsGender: null,
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
      this.pieTestOpsGender = clone(this.echartsPieOptions.ringkike)
      this.pieTestOpsAge = clone(this.echartsPieOptions.ringkike)
      this.pieTestOpsGrade = clone(this.echartsPieOptions.ringkike)
      this.pieTestOpsGender.series[0].data = [{ name: '男', value: 11 }, { name: '女', value: 21 }]
      this.pieTestOpsAge.series[0].data = [{ name: '18-30', value: 11 }, { name: '30-40', value: 21 }, { name: '40-50', value: 31 }, { name: '50-60', value: 41 }, { name: '60-70', value: 51 }]
      this.pieTestOpsGrade.series[0].data = [{ name: '一级', value: 11 }, { name: '二级', value: 21 }, { name: '三级', value: 31 }, { name: '四级', value: 41 }, { name: '五级', value: 51 }]
    }
  }
</script>
