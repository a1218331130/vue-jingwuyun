<!-- 重点人员类型统计 -->
<template>
  <div class="echarts-div_box">
    <div class="tactics__box">
      <div class="tactics__box__title">
        重点对象比例
      </div>
      <el-row class="tactics__box__content">
        <el-col :span="24" class="tactics__box__content-echars" style="height: 100%">
          <!--<el-radio-group v-model="showChart" style="right: 10px;top: 10px;position: absolute;z-index: 9999">-->
            <!--<el-radio :label="1">性别</el-radio>-->
            <!--<el-radio :label="2">年龄</el-radio>-->
            <!--<el-radio :label="3">人员等级</el-radio>-->
          <!--</el-radio-group>-->
          <echarts :option="pieTestOpsGender" style="width:100%; height:100%;"></echarts>
          <!--<echarts v-if="showChart === 1" :option="pieTestOpsGender" style="width:100%; height:100%;"></echarts>-->
          <!--<echarts v-if="showChart === 2" :option="pieTestOpsAge" style="width:100%; height:100%;"></echarts>-->
          <!--<echarts v-if="showChart === 3" :option="pieTestOpsGrade" style="width:100%; height:100%;"></echarts>-->
        </el-col>
        <!--<el-col :span="8" class="tactics__box__content-echars">
          <echarts :option="pieTestOpsAge" style="width:100%; height:100%;"></echarts>
        </el-col>
        <el-col :span="8" class="tactics__box__content-echars">
          <echarts :option="pieTestOpsGrade" style="width:100%; height:100%;"></echarts>
        </el-col>-->
      </el-row>
    </div>
  </div>
</template>
<style lang="scss" scoped>

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
        showChart: 1,
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
      this.pieTestOpsGender = clone(this.echartsPieOptions.stack)
      this.pieTestOpsAge = clone(this.echartsPieOptions.ringkike)
      this.pieTestOpsGrade = clone(this.echartsPieOptions.ringkike)
      this.pieTestOpsGender.series[0].data = [{name: '失控', value: 11}, {name: '在控', value: 21}]
      this.pieTestOpsGender.series[1].data = [{name: '重点群体人员', value: 11}, {name: '重点行业单位', value: 21}, {
        name: '无人驾驶航空器管理',
        value: 31
      }, {name: '队伍和内部管理', value: 41}, {name: '重点场所部位', value: 51}, {name: '重点线索管理', value: 85}, {name: '重点案事件', value: 36}]
      this.pieTestOpsGender.series[2].data = [{name: '重大风险', value: 8}, {name: '较大风险', value: 19}, {
        name: '中等风险',
        value: 11
      }, {name: '较小风险', value: 41}, {name: '无风险', value: 51}]
    }
  }
</script>
