<template>
  <!--数据分析-->
  <div class="data-compare">
    <el-steps :space="200" :center="true" :active="active">
      <el-step title="交叉比对"></el-step>
      <el-step title="选择表" :description="des"></el-step>
      <el-step title="筛选条件" :description="des1"></el-step>
      <el-step title="显示字段"></el-step>
    </el-steps>
  </div>
</template>
<style lang="scss" scoped>
  .data-compare {
    padding-top: 15px;
  }

</style>
<script>
  import bus from '../../../../utils/bus'
  export default {
    props: ['step'],
    components: {},
    data() {
      return {
        active: 2,
        isMaster: '',
        des: '',
        des1: ''
      }
    },
    watch: {
      step: function(val) {
        this.active = val;
      }
    },
    methods: {},
    created() {
      bus.$on('formFilterList', d => {
        this.isMaster = d[0].isMaster
        if (this.isMaster === 1) {
          this.des = `${d[0].NameCn}(主)`
        }
      })
      bus.$on('formfilterNumber', d => {
        if (this.isMaster === 1) {
          this.des1 = `筛选条件 ${d} 条`
        }
      })
      bus.$on('formfirstRest', d => {
        this.des = d
      })
      bus.$on('formsecondRest', d => {
        this.des1 = d
      })
    },
    mounted() {}
  }

</script>
