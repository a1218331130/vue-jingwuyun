<template>
<div>
  <tabs :tab="tab"></tabs>
  <div class="app-toolbar">
    <!-- <app-iframe url="/qingbaoyun-navigation/sys/org.html"></app-iframe> -->

    <!-- 查询条件 -->
    <el-form :inline="true" label-position="right" label-width="80px">
      <el-form-item prop="keyword" label="关键字">
        <el-input v-model="queryForm.keyword" placeholder="请输入角色名称关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" native-type="submit" @click.prevent="query">查询</el-button>
        <breifPopover contentId="bc6a446972ab413f86ceb2816829d471" style="padding-top:0px"></breifPopover>
      </el-form-item>
    </el-form>
    <div class="app-search__buttons">
      <el-button type="primary" icon="plus" @click="add">新增</el-button>
    </div>
  </div>

  <!-- 查询结果 -->
  <div class="app-content-box">
    <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading.body="loading" border :stripe="true" :data="list">
      <el-table-column type="index" label="序号" align="center" width="80">
        <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" width="150"></el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
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

  <!-- 编辑模态窗 -->
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="editDialog" :title="dialogTitle" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
    <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="name" label="角色名称" placeholder="请输入角色名称">
            <el-input v-model="editForm.name" :maxlength="10"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="remark" label="备注" placeholder="请输入备注">
            <el-input v-model="editForm.remark" :maxlength="30"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="rules" label="授权" placeholder="">
            <div class="tree-box">
              <el-tree ref="menuTree" class="compact-tree" :data="tree" show-checkbox :props="treeProps" :node-key="treeProps.id" :default-expanded-all="true" :check-strictly="true" :expand-on-click-node="false" :default-expand-all="true" :render-content="renderContent"></el-tree>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="" @click="closeEvent">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<style scoped>
.app-toolbar .el-form-item {
  margin-bottom: 0;
}

.tree-box {
  max-height: 270px;
  overflow: auto;
}
</style>
<script>
import mixin from '../../utils/mixin'
import { mapState } from 'vuex'
import { FETCH_USER_MENU_LIST, GET_SYS_ROLE_LIST, GET_SYS_ROLE_INFO, SAVE_SYS_ROLE, UPDATE_SYS_ROLE, DELETE_SYS_ROLE } from '../../store/types'
import breifPopover from '../../widgets/brief-popover/brief-popover.vue'
import Tabs from '../common/tabs.vue'
// import AppIframe from '../common/app-iframe.vue'
import pagination from '../../widgets/pagination/pagination'
import { tableFill } from '../../utils/util'
import { listToTree } from '../../utils/listToTree'

export default {
  mixins: [mixin],
  components: {
    Tabs,
    breifPopover,
    pagination
  },
  data() {
    return {
      totalButtun: '全选',
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
        keyword: ''
      },
      editForm: {
        name: '',
        remark: '',
        rules: []
      },
      rules: {
        name: [{
          required: true,
          message: '请输入角色名称'
        }]
      },
      tree: [],
      treeProps: {
        children: 'SubMenus',
        label: 'MenuName',
        id: 'TreeId'
        // disabled(data, node) {
        //   return data.TreeHasAuthority === '0'
        // }
      }
    }
  },
  computed: {
    ...mapState(['roles', 'menuTree', 'users'])
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
    initDialog() {
      // this.reset()
      if(this.target !== null) {
        this.dispatch(GET_SYS_ROLE_INFO, { roleId: this.target.roleId }).then(() => {
          this.editForm = {
            id: this.roles.sysRoleInfo.roleId,
            name: this.roles.sysRoleInfo.roleName,
            remark: this.roles.sysRoleInfo.remark,
            rules: this.roles.sysRoleInfo.treeIdList
          }
          this.$refs.menuTree.setCheckedKeys(this.roles.sysRoleInfo.treeIdList)
        })
      }
    },
    reset() {
      this.$refs.editForm.resetFields()
    },
    closeEvent() {
      this.reset()
      this.editDialog = false
    },
    submit() {
      this.$refs.editForm.validate((valid) => {
        if(valid === true) {
          this.dispatch(this.target !== null ? UPDATE_SYS_ROLE : SAVE_SYS_ROLE, {
            roleId: this.target !== null ? this.target.roleId : '',
            roleName: this.editForm.name,
            remark: this.editForm.remark,
            menuIdList: this.$refs.menuTree.getCheckedNodes().map(d => d.MenuId),
            menuTreeIdList: this.$refs.menuTree.getCheckedNodes().map(d => d.TreeId)
          }).then(() => {
            this.$message({
              type: 'success',
              message: '保存成功',
              showClose: true
            })
            this.query()
            this.closeEvent()
          })
        }
      })
    },
    query() {
      this.dispatch(GET_SYS_ROLE_LIST, {
        Keyword: this.queryForm.keyword,
        PageSize: this.pagenav.limit,
        PageIndex: this.pagenav.currentpage
      }).then(() => {
        this.count = this.roles.sysRoleList.DataCount
        this.list = this.roles.sysRoleList.PageData
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
        this.dispatch(DELETE_SYS_ROLE, { roleIds: [items.roleId].join(',') }).then(() => {
          this.$message({
            type: 'success',
            message: '选项删除成功',
            showClose: true
          })
          this.query()
        })
      })
    },
    checkAll(store, data, rev) {
      let self = this,
        id = data[self.treeProps.id],
        targets = data[self.treeProps.children].map(c => c[self.treeProps.id]),
        checker,
        checkedKeys = this.$refs.menuTree.getCheckedKeys()
      targets.push(id)
      checker = checkedKeys.filter(c => {
        return targets.find(d => {
          return d === c
        })
      })

      if(rev === true) {
        // 反选
        targets.forEach(t => {
          let c = checker.find(d => {
            return d !== t
          })
          if(!c) {
            this.$refs.menuTree.setChecked(t, true)
          } else {
            this.$refs.menuTree.setChecked(c, false)
          }
        })
      } else {
        // 全选
        this.$refs.menuTree.setChecked(id, checker.length !== targets.length, true)
        //        if (checker.length === targets.length && id === 'D572AF92ED9340EE992286CDF71607DA') {
        //          this.totalButtun = '全选'
        //        }
        //        if (checker.length === 0 && id === 'D572AF92ED9340EE992286CDF71607DA') {
        //          this.totalButtun = '全不选'
        //        }
      }
    },
    renderContent(h, { node, data, store }) {
      var self = this,
        nodeContent,
        buttonBox = '',
        buttonAll = ''
      //   buttonRev = ''
      if(node.isLeaf === false) {
        buttonAll = h('el-button', {
          props: {
            size: 'mini'
          },
          on: {
            click() {
              self.checkAll(store, data)
            }
          }
        }, this.totalButtun)

        //   buttonRev = h('el-button', {
        //     props: {
        //       size: 'mini'
        //     },
        //     on: {
        //       click() {
        //         self.checkAll(store, data, true)
        //       }
        //     }
        //   }, '反选')
        buttonBox = h('span', {
          class: 'float-right'
        }, [buttonAll])
      }
      nodeContent = h('span', {
        key: data[self.treeProps.id]
      }, [node.label + '(' + self.getMenuType(node.data.MenuType) + ') ', buttonBox])
      return nodeContent;
    },
    getMenuType(type) {
      let res
      switch(type) {
        case 0:
          res = '中心'
          break;
        case 1:
          res = '菜单'
          break;
        case 2:
          res = '按钮'
          break;
        case 3:
          res = '外部链接'
          break;
        case 4:
          res = '大屏'
          break;
        case 5:
          res = '通用面板'
          break;
        case 6:
          res = '第三方应用'
          break;
      }
      return res
    }
  },
  mounted() {
    this.query()

    this.dispatch(FETCH_USER_MENU_LIST, {
      SfxsAll: true,
      Sfpu: true
    }).then(() => {
      let tempTree
      if(this.users.UserLogin.UserData.UserId !== '1') {
        // 管理员不过滤无权菜单
        tempTree = this.users.userMenuList.filter(t => t.TreeHasAuthority === '1')
      } else {
        tempTree = [...this.users.userMenuList]
      }
      this.tree = listToTree(tempTree, '0', 0, {
        id: 'TreeId',
        children: 'SubMenus',
        label: 'MenuName',
        parentId: 'ParentId'
      })
    })

    tableFill(this.$, false, false, this.$(window).height() - 112)
    window.addEventListener('resize', (e) => {
      tableFill(this.$, false, false, this.$(window).height() - 112)
    })
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
