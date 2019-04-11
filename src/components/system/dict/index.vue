<template>
<div>
  <tabs :tab="tab"></tabs>

  <div class="app-toolbar clearfix" style="padding: 20px;">
    <div class="app-search__buttons">
      <el-button icon="plus" type="info" @click="add">新增</el-button>
    </div>

  </div>

  <div class="app-content">
    <el-row class="table-box">
      <!-- 左侧菜单树 -->
      <el-col :span="6">
        <div class="grid-content bg-purple dict-tree-box" v-loading="loadingTree">
          <el-tree :data="dictTree" lazy :load="treeLoader" @node-click="nodeClick"></el-tree>
        </div>
      </el-col>
      <!-- 右侧内容表格 -->
      <el-col :span="18">
        <div class="dict-list-box">
          <div id="dictTableBox" class="table-box">
            <el-table @cell-mouse-enter="cellMouseEnter" v-loading.body="loading" :data="tableData" border :height="tableHeight">
              <el-table-column type="index" label="序号" width="80">
                <template scope="scope">
                  {{scope.$index + 1 + dict.PageSize * (dict.PageIndex - 1)}}
                </template>
</el-table-column>
<el-table-column prop="zdmc" label="字典名称"></el-table-column>
<el-table-column prop="zddm" label="字典代码"></el-table-column>
<el-table-column prop="fjdm" label="父级代码"></el-table-column>
<el-table-column prop="zdlx" label="类型代码"></el-table-column>
<el-table-column prop="ms" label="类型描述"></el-table-column>
<el-table-column prop="sx" label="顺序"></el-table-column>
<el-table-column prop="by1" label="备注"></el-table-column>
<el-table-column prop="date" label="操作" width="200">
  <template scope="scope">
                  <el-button typeof="info" @click="update(scope.row)" size="small">编辑</el-button>
                  <el-button @click="remove(scope)" size="small">删除</el-button>
                </template>
</el-table-column>
</el-table>
</div>
<div class="app-toolbar">
  <pagination :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
</div>
</div>
</el-col>
</el-row>
</div>

<!-- 字典操作弹窗--新增/修改 -->
<dict-dialog :handleType="handleType" :handleObjId="handleObjId" @reflash="query" :dialogVisible="dialogVisible" @cancel="closeDialog"></dict-dialog>
</div>
</template>
<style lang="scss" scoped>
  .dict-tree-box {
    height: calc(100vh - 165px);
    overflow: auto;
    border-top: 0;
    .el-tree {
      border-top: 0;
    }
  }

  .dict-list-box {
    height: calc(100vh - 165px);
    border-top: 0;
    border-left: 0;
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { FETCH_DICT_TYPE, FETCH_DICT_BY_KEY, FETCH_DICT_BY_KEY_LIST, REMOVE_DICT_INFO } from '../../../store/types'

  import mixin from '../../../utils/mixin'

  import { tableFill } from '../../../utils/util'

  import Tabs from '../../common/tabs.vue'
  import pagination from '../../../widgets/pagination/pagination'
  import dictDialog from './dict-dialog.vue'

  export default {
    mixins: [mixin],
    components: {
      dictDialog,
      pagination,
      Tabs
    },
    data() {
      return {
        dictTree: [],
        handleType: 'add',
        handleObjId: '',
        dialogVisible: false,
        loadingTree: false,
        tableData: [],
        targetDictKey: '',
        targetDictCode: '',
        count: 0,
        pagenav: {
          currentpage: 1,
          limit: 20
        },
        tableHeight: 0
      }
    },
    computed: {
      ...mapState(['dict'])
    },
    watch: {
      pagenav: {
        handler() {
          this.query()
        },
        deep: true
      }
    },
    methods: {
      treeLoader(node, resolve) {
        if (this.dictTree.length === 0) {
          this.loadingTree = true
          this.dispatch(FETCH_DICT_TYPE, { data: {} }).then(_ => {
            // todo:类型树加载完成
            this.dictTree = [...this.dict.FetchDictType.map((d, i) => {
              return {
                id: d.key + '_' + Date.parse(new Date()),
                label: d.value,
                value: d.key,
                children: 'zones',
                isLeaf: 'leaf'
              }
            })]
            this.loadingTree = false
          })
        } else {
          this.dispatch(FETCH_DICT_BY_KEY, { key: node.data.value, code: node.data.parendId }).then(() => {
            resolve(this.dict.FetchDictByKey.map((d, i) => {
              return {
                id: d.zdlx + '_' + Date.parse(new Date()),
                label: d.zdmc,
                value: d.zdlx,
                parendId: d.zddm || null,
                children: 'zones'
              }
            }))
          })
        }
      },
      query() {
        // this.dispatch(FETCH_DICT_BY_KEY_LIST, { data: this.dictBy })
        this.dispatch(FETCH_DICT_BY_KEY_LIST, {
          key: this.targetDictKey,
          code: this.targetDictCode,
          PageIndex: this.pagenav.currentpage,
          PageSize: this.pagenav.limit
        }).then(() => {
          this.tableData = this.dict.PageData
          this.count = this.dict.DataCount
        })
      },
      nodeClick(data) {
        this.targetDictKey = data.value
        this.targetDictCode = data.parendId
        if (this.pagenav.currentpage === 1) {
          this.query()
        } else {
          this.pagenav.currentpage = 1
        }
      },
      /**
       *  关闭弹出操作窗体
       */
      closeDialog() {
        this.dialogVisible = false
      },
      /**
       * 新增字典
       */
      add() {
        this.handleType = 'add'
        this.dialogVisible = true
      },
      update(row) {
        this.handleType = 'update'
        this.handleObjId = row.id
        this.dialogVisible = true
      },
      remove(scope) {
        let removeD = {
          ids: scope.row.id
        }
        this.dispatch(REMOVE_DICT_INFO, { data: removeD }).then(_ => {
          this.$message({
            message: '更新成功！',
            type: 'success'
          })
          this.dict.PageData.splice(scope.$index, 1)
          this.query()
        })
      },
      fitEvent() {
        this.tableHeight = tableFill(this.$, '#dictTableBox', false, this.$(window).height() - 165)
      }
    },
    created() {
      this.tab = {
        label: '字典管理',
        name: this.$route.path
      }

      window.addEventListener('resize', (e) => {
        this.fitEvent()
      })
    },
    activated() {
      this.tab = {
        label: this.$route.name,
        name: this.$route.path
      }
    },
    mounted() {
      this.fitEvent()
    }
  }

</script>
