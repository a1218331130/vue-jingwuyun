<template>
  <!--数据分析-->
  <div class="tel-list root" v-loading="loading" element-loading-text="拼命分析计算中……">
    <!-- <el-row class="el-row analysis-topbar">
      <el-col :span="24" class="collap-col">
        <div class="collap-box pointer">
          <slot name="switchRightBarBtn"></slot>
        </div>
      </el-col>
    </el-row> -->
    <div class="tabs-box">
      <div class="tabs-box__item">
        <edit-page :step="showPage"></edit-page>
        <resource-file @step="getStep" v-show="showPage == 2"></resource-file>
        <filter-file @step="getStep" v-show="showPage == 3"></filter-file>
        <field-file @step="getStep" v-show="showPage == 4"></field-file>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .root {
    height: 100%;
    background-color: #fff;
  }

  .app-content-box {
    padding: 16px 10px;
    min-height: 75px;
  }

  .primary-btn {
    position: relative;
    top: 1px;
    left: 0;
  }

  .tabs-box {
    height: calc(100vh - 96px);
    .tel-list {
      height: calc(100vh - 380px);
      overflow-y: scroll;
    }
  }

</style>
<script>
  import editPage from './editPage'
  import resourceFile from './resourceFile'
  import filterFile from './filterFile'
  import fieldFile from './fieldFile'
  export default {
    components: {
      editPage,
      resourceFile,
      filterFile,
      fieldFile
    },
    data() {
      return {
        showPage: 2,
        loading: false
      }
    },
    methods: {
      getStep(data) {
        this.showPage = data;
      }
    },
    created() {},
    mounted() {}
  }

</script>
