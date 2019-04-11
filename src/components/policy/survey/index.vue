<!-- 警情决策-态势 -->
<template>
<div>
  <!--本市各区接处警总分布点图-->
  <chinaMap></chinaMap>
  <!--本市每小时的警情趋势变化-->
  <controlNum></controlNum>
  <!--最新警情-->
  <!--本市各区值班人员表-->
  <newAlarm></newAlarm>
  <!--警情类别统计-->
  <peopleType></peopleType>
  <!--本市各区值班人员表-->
  <!--<statistics></statistics>-->
</div>
</template>

<style scoped>
</style>

<script>
import mixin from '../../../utils/mixin'
import chinaMap from './echars/chinaMap'
import controlNum from './echars/control-num'
import statistics from './echars/people-statistics'
import peopleType from './echars/people-type'
import newAlarm from './echars/new-alarm'
export default {
  mixins: [mixin],
  components: {
    chinaMap,
    controlNum,
    peopleType,
    statistics,
    newAlarm
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {},
  created() {
    console.log();
  },
  mounted() {}
}
</script>
