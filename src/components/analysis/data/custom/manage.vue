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
        <searchBox>
          <div slot="formBox">
            <el-form :model="form" :inline="true" label-position="right" label-width="90px">
              <el-form-item label="模型名称">
                <el-input v-model="form.input" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="创建时间">
                <el-date-picker v-model="value" type="datetimerange" placeholder="选择时间范围"></el-date-picker>
              </el-form-item>
              <el-button type="primary" class="analysis primary-btn" native-type="submit" @click.prevent="query">查询</el-button>
            </el-form>
          </div>
        </searchBox>
        <!-- 查询结果 -->
        <div class="app-content-box" v-if="resBox===true">
          <!-- :h="440" -->
          <list :tab="tabList" v-if="!loading" :pagenav="pageInfo" v-height-fix="390"></list>
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
  import pagination from '../../../../widgets/pagination/pagination'
  import mixin from '../../../../utils/mixin'
  export default {
    mixins: [mixin],
    components: {
      searchBox,
      list,
      pagination
    },
    data() {
      return {
        value: [],
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
        resBox: true,
        detailBox: false,
        tabList: [
          { label: '模型名称', prop: 'mxmc' },
          { label: '数据表', prop: 'sjb' },
          { label: '对比方式', prop: 'dbfs' },
          { label: '关联条件', prop: 'gltj' },
          { label: '创建时间', prop: 'cjsj' }
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
