<!-- 概况(统计) -->
<template>
<div class="analysisPeople">
  <el-row :gutter="10" style="
        height:600px;
        overflow: hidden;">
    <el-col :span="6">
      <el-row :gutter="0">
        <el-col :span="24" style="height: 300px;">
          <!--人员类型统计分析-->
          <statistics></statistics>
        </el-col>
        <el-col :span="24" style="height: 300px">
          <!--近一年重点人员增长趋势-->
          <breakRules></breakRules>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="12" style="height: 600px">
      <!--人员籍贯热点分布图-->
      <chinaMap></chinaMap>
    </el-col>
    <el-col :span="6">
      <el-row :gutter="0">
        <el-col :span="24" style="height:300px;">
          <!--重点人员比例-->
          <peopleType></peopleType>
        </el-col>
        <el-col :span="24" style="height:300px;">
          <!--近三年重点人员类型同比分析-->
          <ranking></ranking>
        </el-col>
      </el-row>
    </el-col>
  </el-row>

  <el-row :gutter="10">
    <!--<el-col :span="6" style="height:310px;">-->
    <!--&lt;!&ndash;重点人员增长趋势&ndash;&gt;-->
    <!--<trend></trend>-->
    <!--</el-col>-->
    <el-col :span="12" style="height:310px;">
      <!--近三年重点人员数量同比分析-->
      <controlNum></controlNum>
    </el-col>
    <el-col :span="12" style="height:310px;">
      <!--辖区重点人员类型分布-->
      <controlType></controlType>
    </el-col>
  </el-row>

</div>
</template>

<style lang="scss" scoped>
.analysisPeople {
    height: 100%;
    overflow: auto;
    padding: 10px;
    background-color: #f5f5f5;
}

.el-col {
    padding-bottom: 10px;
}
</style>

<script>
import mixin from '../../../utils/mixin'
import chinaMap from './echars/chinaMap'
import breakRules from './echars/break-rules'
import ranking from './echars/ranking'
import controlType from './echars/control-type'
import controlNum from './echars/control-num'
import statistics from './echars/people-statistics'
import peopleType from './echars/people-type'
import trend from './echars/control-trend'
export default {
  mixins: [mixin],
  components: {
    chinaMap,
    breakRules,
    ranking,
    controlType,
    controlNum,
    peopleType,
    statistics,
    trend
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {}
}
</script>
