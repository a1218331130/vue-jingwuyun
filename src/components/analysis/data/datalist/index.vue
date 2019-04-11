<template>
<!--数据分析-->
<div class="tel-list root" v-loading="loading" element-loading-text="拼命分析计算中……">
  <el-row class="el-row analysis-topbar">
    <el-col :span="4" class="collap-col">
      <div class="collap-box pointer">
        <slot name="switchRightBarBtn"></slot>
      </div>
    </el-col>
  </el-row>
  <div class="tabs-box">
    <div class="tabs-box__item">
      <searchBox>
        <div slot="formBox">
          <el-form :model="item.queryForm" :inline="true" label-position="right" label-width="90px">
            <el-button type="primary" class="analysis primary-btn" native-type="submit" @click.prevent="query">筛选</el-button>
            <el-form-item label="名称">
              <el-input v-model="item.queryForm.callArea" style="width:80px;" placeholder=""></el-input>
            </el-form-item>
          </el-form>
        </div>
      </searchBox>
      <!-- 查询结果 -->
      <div class="app-content-box" v-if="resBox===true">
        <!-- :h="440" -->
        <list :list="item.mainList" :tab="tabList" v-if="!loading" :pagenav="pageInfo" v-height-fix="390"></list>

        <div class="app-toolbar footer">
          <pagination :count="pageInfo.count" :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}" @update:pagenav="pagenavChange"></pagination>
        </div>
      </div>
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
  import searchBox from '../../search-tool'
  import list from '../list'
  import pagination from '../../../../widgets/pagination/pagination.vue'
  export default {
    components: {
      searchBox,
      list,
      pagination
    },
    data() {
      return {
        pageInfo: { // 页面分页信息相关配置 默认限制每页十条
          count: 10,
          limit: 500,
          currentpage: 1
        },
        commName: 'detail',
        resBox: false,
        detailBox: false,
        tabList: [
          { label: '序号', prop: 'index' },
          { label: '数据名称', prop: 'sjmc' },
          { label: '条数', prop: 'num' },
          { label: '数据类型', prop: 'type' }
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
