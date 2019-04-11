<template>
<div v-loading="loading">
  <tabs :tab="tab"></tabs>
  <el-row>
    <el-col :span="24">
      <div class="list-box">
        <div class="app-toolbar">
          <!-- 查询条件 -->
          <el-form :inline="true" label-position="right" label-width="80px">
            <el-form-item prop="keyword" label="关键字">
              <el-input v-model="queryForm.keyword" placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" native-type="submit" @click.prevent="query(true)">查询</el-button>
            </el-form-item>
            <!-- <el-form-item>
              <el-checkbox v-model="queryForm.isAll">展示所有单位</el-checkbox>
            </el-form-item> -->
          </el-form>
          <div class="app-search__buttons">
            <el-button type="primary" icon="plus" @click="add">新增</el-button>
          </div>
        </div>
        <!-- 查询结果 -->
        <div class="app-content">
          <el-table id="orgTableBox" @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading.body="loading" border :stripe="true" :data="list" :height="tableHeight">
            <el-table-column type="index" label="序号" align="center" width="80">
              <template scope="scope">
                {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
              </template>
</el-table-column>
<!-- <el-table-column prop="code" label="单位编号"></el-table-column> -->
<el-table-column width="275" prop="id" label="ID"></el-table-column>
<el-table-column width="240" prop="bt" label="标题"></el-table-column>
<el-table-column width="240" prop="ssmk" label="所属模块"></el-table-column>
<el-table-column prop="gnms" label="功能描述">
  <template scope="scope">
                <div v-html="decodeURIComponent(scope.row.gnms)"></div>
              </template>
</el-table-column>
<!-- <el-table-column prop="orderNum" label="排序号" align="center" width="80"></el-table-column> -->
<el-table-column align="center" label="操作" width="150">
  <template scope="scope">
                <el-button type="primary" size="mini" icon="icon iconfont icon-brush" title="编辑" @click="edit(scope.row)">编辑
                </el-button>
                <el-button type="danger" size="mini" icon="icon iconfont icon-trash" title="删除" @click="remove(scope.row)">删除
                </el-button>
              </template>
</el-table-column>
</el-table>
</div>
<!-- 分页栏 -->
<div class="app-toolbar">
  <pagination :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
</div>
</div>
</el-col>
</el-row>

<!-- 编辑模态窗 -->
<dialog-form :dialog="editDialog" :id="target!==null?target.id:''" @close="editDialog=false" @success="reload"></dialog-form>
</div>
</template>
<style lang="scss" scoped>
  .el-tabs {
    margin-bottom: 0;
  }

  .app-toolbar {
    padding: 5px;
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
  // FETCH_SYS_ORG_TREE_BY_ID,
  import { SYS_BRIEF_LIST, SYS_BRIEF_DELETE } from '../../../store/types'

  import Tabs from '../../common/tabs.vue'
  // import AppIframe from '../../common/app-iframe.vue'
  import pagination from '../../../widgets/pagination/pagination'
  import dialogForm from './dialog-form'

  // import { tableFill } from '../../../utils/util'

  export default {
    mixins: [mixin],
    components: {
      Tabs,
      pagination,
      dialogForm
    },
    data() {
      return {
        order: 'ORDER_NUM',
        orderList: [{ label: '默认排序', value: 'ORDER_NUM' }, { label: '名称排序', value: 'NAME' }, {
          label: '单位编号排序',
          value: 'ORG_ID'
        }, { label: '创建时间排序', value: 'ADD_TIME' }, { label: '警种类型排序', value: 'JZLX' }],
        count: 0,
        list: [],
        editDialog: false,
        dialogTitle: '',
        target: null,
        pagenav: {
          limit: 20,
          currentpage: 1
        },
        queryForm: {
          keyword: '',
          isAll: ''
        },
        tableHeight: 0,
        listTarget: '',
        treeKeyword: '',
        orgTree: [],
        treeProps: {
          id: 'orgId',
          label: 'name',
          parentId: 'parentId',
          children: 'children'
        }
      }
    },
    computed: {
      ...mapState(['brief'])
    },
    watch: {
      // treeKeyword(v) {
      //   this.$refs.orgTree.filter(v)
      // },
      pagenav: {
        handler() {
          this.query()
        },
        deep: true
      }
    },
    methods: {
      reload() {
        if (this.pagenav.currentpage === 1) {
          this.query()
        } else {
          this.pagenav.currentpage = 1
        }
        this.editDialog = false
      },
      query(reset) {
        this.dispatch(SYS_BRIEF_LIST, {
          keyword: this.queryForm.keyword,
          PageSize: this.pagenav.limit,
          PageIndex: this.pagenav.currentpage
        }).then(() => {
          this.count = this.brief.sysBriefList.DataCount
          this.list = this.brief.sysBriefList.PageData
          this.loading = false;
        })
      },
      add() {
        this.dialogTitle = '新增'
        this.target = null
        this.editDialog = true
      },
      edit(item) {
        this.dialogTitle = '修改'
        this.target = item
        this.editDialog = true
      },
      remove(items) {
        this.$confirm('确定要删除这些选项?', '温馨提示', {
          type: 'warning'
        }).then(() => {
          this.dispatch(SYS_BRIEF_DELETE, { ids: items.id }).then(() => {
            this.$message({
              type: 'success',
              message: '选项删除成功',
              showClose: true
            })
            this.query()
          })
        })
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
