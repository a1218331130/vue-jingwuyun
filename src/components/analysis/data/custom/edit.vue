<template>
  <!--数据分析-->
  <div class="tel-list root" v-loading="loading" element-loading-text="拼命分析计算中……">
    <el-row class="el-row analysis-topbar">
      <el-col :span="24" class="collap-col">
        <div class="collap-box pointer">
          <slot name="switchRightBarBtn"></slot>
        </div>
      </el-col>
    </el-row>
    <div class="tabs-box">
      <div class="tabs-box__item">
        <edit-page></edit-page>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .root {
    height: calc(100vh - 60px);
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
  import editPage from '../common/editPage'
  export default {
    components: {
      editPage
    },
    data() {
      return {
        loading: false,
        pageInfo: { // 页面分页信息相关配置 默认限制每页十条
          count: 10,
          limit: 500,
          currentpage: 1
        },
        form: {
          input: ''
        },
        commName: 'detail',
        resBox: false,
        detailBox: false,
        tabList: [
          { label: '序号', prop: 'index' },
          { label: '数据名称', prop: 'sjmc' },
          { label: '条数', prop: 'num' },
          { label: '数据类型', prop: 'type' },
          { label: '操作', prop: 'cz' }
        ]
      }
    },
    methods: {
      /**
       * 分页操作
       */
      pagenavChange(obj) {
        // 分页切换操作
        this.pageInfo.limit = obj.limit
        this.pageInfo.currentpage = obj.currentpage
        this.query()
      },
      query() {
        this.fetchMainList()
        this.resBox = true
      },
      fetchMainList() {

      }
    },
    created() {

    },
    mounted() {}
  }

</script>
