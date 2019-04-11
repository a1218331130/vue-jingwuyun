<template>
  <div class="tableCont">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="系统资源" name="resource">
        <resource-file @step="getStep" v-show="activeName === 'resource'"></resource-file>
      </el-tab-pane>
      <el-tab-pane label="我的比对资源" name="myResource">
        <my-resource-file @step="getStep" v-show="activeName === 'myResource'"></my-resource-file>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" scoped>
  .tableCont {
    position: relative;
  }

</style>
<script>
  import resourceFile from './resourceFile'
  import myResourceFile from './myResourceFile'
  export default {
    components: {
      resourceFile,
      myResourceFile
    },
    data() {
      return {
        activeName: 'resource'
      }
    },
    methods: {
      getStep(data) {
        this.$emit('step', data);
      },
      handClick(tab, event) {
        this.activeName = tab.name
      }
    },
    created() {}
  }

</script>
