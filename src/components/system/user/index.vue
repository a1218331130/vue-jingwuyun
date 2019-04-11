<template>
<div>
  <tabs :tab="tab"></tabs>
  <el-row>
    <el-col :span="6">
      <div class="tree-box">
        <!-- <el-tree :data="orgTree" lazy :load="orgTreeLoader" node-key="id" :highlight-current="true" :default-expanded-keys="[this.userOrgInfo.mainOrgId]" @node-click="nodeClick"></el-tree> -->
        <el-input v-model="treeKeyword" placeholder="输入单位名称进行搜索"></el-input>
        <!--<el-select @change="ordertree" v-model="order" placeholder="排序" style="width: 130px">-->
        <!--<el-option v-for="item in orderList" :key="item.value" :value="item.value" :label="item.label"></el-option>-->
        <!--</el-select>-->
        <el-tree ref="orgTree" :data="orgTree" node-key="orgId" :filter-node-method="filterTree" :highlight-current="true" :default-expanded-keys="[this.userOrgInfo.mainOrgId]" :props="treeProps" @node-click="nodeClick"></el-tree>
      </div>
    </el-col>
    <el-col :span="18">
      <div class="list-box">
        <div class="app-toolbar">
          <!-- 查询条件 -->
          <el-form :inline="true" label-position="right" label-width="80px">
            <el-form-item prop="keyword" label="关键字">
              <el-input v-model="queryForm.keyword" placeholder="请输入用户名关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" native-type="submit" @click.prevent="query(true)">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="queryForm.isAll">展示下级单位</el-checkbox>
              <breifPopover contentId="dfe80fe9da9b40f7899cc8fd4ab18101" style="padding-top:0px"></breifPopover>
            </el-form-item>
          </el-form>
          <div class="app-search__buttons">
            <el-button type="primary" icon="plus" @click="add">新增</el-button>
          </div>
        </div>

        <!-- 查询结果 -->
        <div class="app-content">
          <el-table id="userTableBox" @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading.body="loading" border :stripe="true" :data="list" :height="tableHeight">
            <el-table-column type="index" label="序号" align="center" width="80">
              <template scope="scope">
                {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
              </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="xm" label="姓名"></el-table-column>
            <el-table-column prop="roleName" label="角色"></el-table-column>
            <el-table-column prop="orgname" label="所属单位"></el-table-column>
            <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" align="center" width="80">
              <template scope="scope">
                <el-tag :type="scope.row.status==='1'?'primary':'danger'">{{scope.row.status==='1'?'正常':'禁用'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="230">
              <template scope="scope">
                <el-button type="primary" size="mini" icon="icon iconfont icon-dunpai" @click="auth(scope.row)">授权</el-button>
                <el-button type="primary" size="mini" icon="icon iconfont icon-brush" @click="edit(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="icon iconfont icon-trash" @click="remove(scope.row)">删除</el-button>
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
  <dialog-form :dialog="editDialog" :id="target!==null?target.userId:''" @close="editDialog=false" @success="reload"></dialog-form>
  <dialog-role :dialog="roleDialog" :id="target!==null?target.userId:''" @close="roleDialog=false" @success="reload"></dialog-role>
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
        height: calc(100vh - 75px);
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
import { mapState } from 'vuex'
import { FETCH_SYS_ORG_TREE_BY_ID, FETCH_USER_LIST_BY_ORG_ID, DEL_SYS_USER } from '../../../store/types'

import mixin from '../../../utils/mixin'

import Tabs from '../../common/tabs.vue'
// import AppIframe from '../../common/app-iframe.vue'
import TreeSelect from '../../../widgets/tree-select/tree-select'
import pagination from '../../../widgets/pagination/pagination'
import dialogForm from './dialog-form'
import dialogRole from './dialog-role.vue'
import breifPopover from '../../../widgets/brief-popover/brief-popover.vue'
import { tableFill } from '../../../utils/util'

export default {
  mixins: [mixin],
  components: {
    Tabs,
    TreeSelect,
    breifPopover,
    pagination,
    dialogForm,
    dialogRole
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
      roleDialog: false,
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
    ...mapState(['users', 'orgs'])
  },
  watch: {
    treeKeyword(v) {
      this.$refs.orgTree.filter(v)
    },
    pagenav: {
      handler() {
        this.query()
      },
      deep: true
    }
  },
  methods: {
    orgTreeLoader(node, resolve) {
      let orgId = node.level === 0 ? this.userOrgInfo.mainParentId : node.data.id
      if(this.orgTree.length === 0) this.loadingTree = true
      this.dispatch(FETCH_SYS_ORG_TREE_BY_ID, { orgId: orgId }).then(() => {
        resolve([...this.orgs.sysOrgTreeById.map((d, i) => {
          return {
            id: d.orgId,
            label: d.name,
            parentId: node.data.id,
            children: 'zones'
          }
        })])
      })
    },
    nodeClick(data) {
      this.queryForm.keyword = ''
      this.queryForm.isAll = ''
      this.listTarget = data.orgId
      this.reload()
    },
    reload() {
      if(this.pagenav.currentpage === 1) {
        this.query()
      } else {
        this.pagenav.currentpage = 1
      }
      this.editDialog = false
      this.roleDialog = false
    },
    query(reset) {
      if(reset === true) {
        this.reload()
      } else {
        this.dispatch(FETCH_USER_LIST_BY_ORG_ID, {
          orgId: this.listTarget,
          Keyword: this.queryForm.keyword,
          isAll: this.queryForm.isAll === true ? '1' : '0',
          PageSize: this.pagenav.limit,
          PageIndex: this.pagenav.currentpage
        }).then(() => {
          this.count = this.users.listByOrgId.DataCount
          this.list = this.users.listByOrgId.PageData
        })
      }
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
    auth(item) {
      this.dialogTitle = '修改'
      this.target = item
      this.roleDialog = true
    },
    remove(items) {
      this.$confirm('确定要删除这些选项?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.dispatch(DEL_SYS_USER, { userIds: [items.userId].join(',') }).then(() => {
          this.$message({
            type: 'success',
            message: '选项删除成功',
            showClose: true
          })
          this.query()
        })
      })
    },
    filterTree(value, data) {
      if(!value) {
        return true
      } else {
        return data.name.indexOf(value) !== -1
      }
    },
    fitEvent() {
      this.tableHeight = tableFill(this.$, '#userTableBox', false, this.$(window).height() - 195)
    },
    ordertree() {
      //      console.log('重排树', this.userOrgInfo.mainOrgId)
      this.getRuleOrgTree(this.userOrgInfo.mainOrgId, false, true, this.order).then(res => {
        this.orgTree = res
      })
    }
  },
  mounted() {
    this.listTarget = this.userOrgInfo.mainOrgId
    this.query()
    this.fitEvent()
  },
  activated() {
    this.tab = {
      label: this.$route.name,
      name: this.$route.path
    }
  },
  created() {
    this.getRuleOrgTree().then(res => {
      this.orgTree = res
    })

    this.tab = {
      label: this.$route.name,
      name: this.$route.path
    }
    window.addEventListener('resize', (e) => {
      this.fitEvent()
    })
  }
}
</script>
