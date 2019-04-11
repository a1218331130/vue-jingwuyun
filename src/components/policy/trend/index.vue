<!-- 警情决策-态势 -->
<template>
  <div>
    <!--全市接出警分布图-->
    <huaihuaMap></huaihuaMap>
    <!--全市2017主要刑事案件占比-->
    <peopleType></peopleType>
    <!--全市2017主要刑事案累积分布图-->
    <controlNum></controlNum>
    <!--全市接处警分布图-->
    <breakRules></breakRules>
    <!--近三年重点人员类型同比分析-->
    <chinaMap></chinaMap>
  </div>
</template>

<style scoped>
</style>

<script>
  import mixin from '../../../utils/mixin'
  import chinaMap from './echars/chinaMap'
  import huaihuaMap from './echars/huaihuaMap'
  import breakRules from './echars/break-rules'
  import controlNum from './echars/control-num'
  import peopleType from './echars/people-type'
  export default {
    mixins: [mixin],
    components: {
      huaihuaMap,
      chinaMap,
      breakRules,
      controlNum,
      peopleType
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
    mounted() {
    }
  }
</script>
