<template>
<div v-loading="loading">
  <tabs :tab="tab"></tabs>
  <el-row>
    <el-col :span="24">
      <div class="list-box">
        <div class="app-toolbar">
          <!-- 查询条件 -->
          <!-- <el-form :inline="true" label-position="right" label-width="80px">
            <el-form-item prop="keyword" label="关键字">
              <el-input v-model="queryForm.keyword" placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" native-type="submit" @click.prevent="query(true)">查询</el-button>
            </el-form-item>
          </el-form> -->
          <div class="app-search__buttons">
            <el-button type="primary" icon="plus" @click="add">新增</el-button>
          </div>
        </div>
        <!-- 查询结果 -->
        <div class="app-content" style="padding:10px">
           <el-table id="orgTableBox" @cell-mouse-enter="cellMouseEnter" class="app-table" border :stripe="true" :data="versionlList">
            <!-- <el-table-column type="index" label="序号" align="center" width="80">
              <template scope="scope">
                {{index + 1}}
              </template>
              </el-table-column> -->
              <el-table-column width="100" prop="versionType" label="版本类型"></el-table-column>
              <el-table-column width="100" prop="versionNum" label="版本号"></el-table-column>
              <el-table-column width="100" prop="createUsername" label="发布人"></el-table-column>
              <el-table-column width="150" prop="createTime" label="发布时间"></el-table-column>
              <el-table-column prop="updateContent" label="更新内容"></el-table-column>
           </el-table> 
      </div>
<!-- 分页栏 -->
<!-- <div class="app-toolbar">
  <pagination :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
</div> -->
</div>
</el-col>
</el-row>

<!-- 编辑模态窗 -->
<dialog-form :dialog="editDialog"  @close="closeVersion"></dialog-form>
</div>
</template>
<style lang="scss" scoped>
  .el-tabs {
    margin-bottom: 0;
  }

  .app-toolbar {
    padding: 5px;
    height: 30px;
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .tree-box {
    .el-tree {
      height: calc(100vh - 105px);
      overflow: auto;
    }
  }

  .list-box {
    height: calc(100vh - 105px);
    border-top: 0;
    border-left: 0;
  }

</style>
<script>
  import mixin from '../../../utils/mixin'
  import { mapState } from 'vuex'
  import { VERSION_LIST } from '../../../store/types'
  import Tabs from '../../common/tabs.vue'
  import dialogForm from './dialog-form'
  export default {
    mixins: [mixin],
    components: {
      Tabs,
      dialogForm
    },
    data() {
      return {
        loading: false,
        count: 0,
        versionlList: [],
        editDialog: false,
        dialogTitle: ''
      }
    },
    computed: {
      ...mapState(['version'])
    },
    watch: {
    },
    methods: {
      closeVersion() {
        this.editDialog = false
        this.query();
      },
      query() {
        this.loading = true;
        this.dispatch(VERSION_LIST).then(() => {
          this.versionlList = this.version.versionList;
          this.loading = false;
          // console.log(this.versionlList, 'this.moudelList');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '获取列表失败'
          });
        })
      },
      add() {
        this.dialogTitle = '新增'
        this.editDialog = true
      }
    },
    mounted() {
      this.query()
    },
    activated() {
      this.tab = {
        label: this.$route.name,
        name: this.$route.path
      }
    },
    created() {
      this.tab = {
        label: this.$route.name,
        name: this.$route.path
      }
    }
  }

</script>
