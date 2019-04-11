<template>
<div>
  <tabs :tab="tab"></tabs>
  <div class="app-toolbar">
    <!-- <app-iframe url="/qingbaoyun-navigation/sys/org.html"></app-iframe> -->

    <!-- 查询条件 -->
    <el-form :inline="true" label-position="right" label-width="80px">
      <el-form-item prop="keyword" label="关键字">
        <el-input v-model="queryForm.keyword" placeholder="请输入用户名关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" native-type="submit" @click.prevent="query">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="queryForm.isAll">展示下级单位</el-checkbox>
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
<el-table-column prop="username" label="用户名"></el-table-column>
<el-table-column prop="xm" label="姓名"></el-table-column>
<el-table-column prop="email" label="邮箱"></el-table-column>
<el-table-column prop="orgname" label="所属单位"></el-table-column>
<el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
<el-table-column prop="status" label="状态" align="center" width="80">
  <template scope="scope">
            <el-tag :type="scope.row.status==='1'?'primary':'danger'">{{scope.row.status==='1'?'正常':'禁用'}}</el-tag>
          </template>
</el-table-column>
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
        <el-form-item prop="username" label="用户名">
          <el-input v-model="editForm.username" placeholder="" :maxlength="10"></el-input>
        </el-form-item>
      </el-col>

      <!-- 后端有默认密码提供 -->
      <!-- <el-col :span="12">
          <el-form-item v-show="this.target === null" prop="password" label="密码">
            <el-input type="password" v-model="editForm.password" placeholder="" :maxlength="16"></el-input>
          </el-form-item>
        </el-col> -->

      <el-col :span="12">
        <el-form-item prop="xm" label="姓名">
          <el-input v-model="editForm.xm" placeholder="" :maxlength="12"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="code" label="警员编号">
          <el-input v-model="editForm.code" placeholder="" :maxlength="20"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="gmsfhm" label="身份证">
          <el-input v-model="editForm.gmsfhm" placeholder="" :maxlength="18"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item class="other-org-box" prop="status" label="所属单位" style="margin-bottom:0;"></el-form-item>
        <el-table :data="editForm.otherOrgList" style="width:515px; margin:0 auto 20px auto;">
          <el-table-column align="center" width="80" label="主单位">
            <template scope="scope">
                <el-switch v-model="scope.row.isMain" :title="scope.row.orgIds.length===0?'请先选择单位':''"   @change="updateMainOrg(scope.row.orgIds[scope.row.orgIds.length-1])"></el-switch>
              </template>
          </el-table-column>
          <el-table-column align="center" width="50" label="中心">
            <template scope="scope">
                <el-switch v-model="scope.row.isCenter" :title="scope.row.orgIds.length===0?'请先选择单位':''" on-text="" off-text="" @change="updateCenter(scope.row.orgIds[scope.row.orgIds.length-1])"></el-switch>
              </template>
          </el-table-column>
          <el-table-column align="center" label="选择单位">
            <template scope="scope">
                <el-cascader :options="orgTree" v-model="scope.row.orgIds" :props="treeProps" filterable change-on-select placeholder="选择单位" @change="updateOrgItem(scope.row.orgIds[scope.row.orgIds.length-1])"></el-cascader>
              </template>
          </el-table-column>
          <el-table-column align="center" width="120" label="选择职务">
            <template scope="scope">
                <el-select v-model="scope.row.zwjb" placeholder="选择职务">
                  <el-option v-for="(item,i) in dictList['ZJ']" :key="i" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </template>
          </el-table-column>
          <el-table-column align="center" width="50" label="">
            <template scope="scope">
                <el-button v-if="scope.$index===editForm.otherOrgList.length-1" size="mini" icon="plus" :disabled="scope.row.orgIds.length===0" @click="addOrg"></el-button>
                <el-button v-else size="mini" icon="close" @click="removeOrg(scope.row)"></el-button>
              </template>
          </el-table-column>
        </el-table>

      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item prop="loginauthorities" label="登录方式">
          <el-select v-model="editForm.loginauthorities" placeholder="请选择">
            <el-option v-for="(item,i) in loginTypeOps" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="editForm.mobile" placeholder="" :maxlength="11"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="role" label="角色">
          <tree-select ref="roleSelector" v-if="roles&&roles.sysRoleTree" :tree="{data:roles.sysRoleTree.map(d=>{return {label:d.roleName,id:d.roleId}}),'default-checked-keys':[...editForm.roleIdList],'node-key':'id','show-checkbox':true, 'check-strictly':false}"
            v-model="editForm.roleIdList"></tree-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="editForm.email" placeholder="" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>

      <!-- <el-col :span="24">
          <el-form-item prop="dlrk" label="所属中心">

          </el-form-item>
        </el-col> -->

      <el-col :span="12">
        <el-form-item prop="dlrk" label="登录入口">
          <el-select v-model="editForm.dlrk" placeholder="请选择">
            <el-option v-for="(item,i) in entryOps" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="menuId" label="默认中心">
          <el-select v-model="editForm.menuId" :disabled="editForm.dlrk!=='DLRK_PT'" placeholder="请选择">
            <el-option v-for="(item,i) in menuOps" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="sjqxkz" label="数据等级">
          <el-select v-model="editForm.sjqxkz" placeholder="请选择">
            <el-option v-for="(item,i) in leveOps" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="status" label="状态">
          <el-radio-group v-model="editForm.status">
            <el-radio label="1">正常</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
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
<style lang="scss" scoped>
  .app-toolbar {
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .other-org-box {
    .el-select,
    span {
      margin-right: 10px;
    }
    .el-button {
      padding: 3px;
    }
  }

</style>
<script>
  import mixin from '../../utils/mixin'
  import { mapState } from 'vuex'
  import { FETCH_SYS_MENU, GET_SYS_USER_LIST, GET_SYS_ROLE_TREE, GET_SYS_USER_INFO, ADD_SYS_USER, UPDATE_SYS_USER, DEL_SYS_USER } from '../../store/types'

  import Tabs from '../common/tabs.vue'
  // import AppIframe from '../common/app-iframe.vue'
  import TreeSelect from '../../widgets/tree-select/tree-select'
  import pagination from '../../widgets/pagination/pagination'
  import { tableFill, arrayGetRid, clone } from '../../utils/util'

  export default {
    mixins: [mixin],
    components: {
      Tabs,
      TreeSelect,
      pagination
    },
    data() {
      return {
        count: 0,
        list: [],
        editDialog: false,
        dialogTitle: '',
        target: null,
        dictList: [],
        pagenav: {
          limit: 20,
          currentpage: 1
        },
        queryForm: {
          keyword: '',
          isAll: ''
        },
        editForm: {
          zxid: '',
          username: '',
          password: '',
          code: '',
          gwbs: '',
          zwjb: '',
          loginauthorities: '',
          email: '',
          xm: '',
          gmsfhm: '',
          mobile: '',
          orgname: '',
          roleIdList: [],
          orgIdList: [],
          orgId: '',
          status: '1',
          sjqxkz: '4',
          dlrk: 'DLRK_4X',
          menuId: '',
          otherOrgList: []
        },
        rules: {
          username: [{
            required: true,
            message: '请输入用户名'
          }],
          password: [{
            required: true,
            message: '请输入密码'
          }],
          xm: [{
            required: true,
            message: '请输入姓名'
          }],
          email: [{
            required: true,
            message: '请输入电子邮箱'
          }],
          gmsfhm: [{
            required: true,
            message: '请输入身份证号码'
          }],
          mobile: [{
            required: true,
            message: '请输入手机号码'
          }],
          org: [{
            required: true,
            message: '请选择组织'
          }]
        },
        loginTypeOps: [
          { value: '1', label: '用户名登录' }, { value: '2', label: 'PKI登录' }, { value: '3', label: '用户名或PKI登录' }
        ],
        leveOps: [
          { value: '1', label: '一级' }, { value: '2', label: '二级' }, { value: '3', label: '三级' }, { value: '4', label: '四级' }
        ],
        entryOps: [
          { value: 'DLRK_4X', label: '中心首页' }, { value: 'DLRK_PT', label: '工作平台' }, { value: 'DLRK_HT', label: '后台管理' }
        ],
        menuOps: [],
        roleTree: [],
        orgTree: [],
        treeProps: {
          children: 'children',
          label: 'name',
          value: 'orgId'
        }
      }
    },
    computed: {
      ...mapState(['users', 'orgs', 'roles'])
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
        if (this.target !== null) {
          this.dispatch(GET_SYS_USER_INFO, { userId: this.target.userId }).then(() => {
            let resForm = clone(this.users.sysUserInfo)
            if (!resForm.roleIdList) {
              resForm.roleIdList = []
            }
            if (resForm.otherorgList && resForm.otherorgList.length > 0) {
              resForm['otherOrgList'] = [...resForm.otherorgList]
              resForm.otherOrgList.forEach(o => {
                if (o.orgIds !== '') {
                  o.orgIds = JSON.parse(o.orgIds)
                  o.isMain = o.orgid === resForm.orgId
                  o.isCenter = o.orgid === resForm.zxid
                }
              })
            } else {
              resForm.otherOrgList = []
            }

            if (resForm.otherOrgList.length === 0) {
              resForm.otherOrgList.unshift({
                isMain: true,
                isCenter: false,
                orgIds: [resForm.orgId],
                orgId: resForm.orgId || '',
                zwjb: resForm.zwjb || '',
                zwjbmc: ''
              })
            }

            if (resForm.dlrk !== 'DLRK_PT') {
              resForm.menuId = ''
            }
            this.editForm = clone(resForm)
          })
        } else {
          this.addOrg()
        }
      },
      addOrg() {
        this.editForm.otherOrgList.push({
          isMain: false,
          isCenter: false,
          orgIds: [this.userOrgInfo.mainOrgId],
          orgId: '',
          zwjb: '',
          zwjbmc: ''
        })
      },
      updateOrgItem(orgId) {
        this.updateMainOrg(orgId)
        this.updateCenter(orgId)
      },
      updateMainOrg(orgId) {
        this.editForm.otherOrgList.filter(d => d.orgIds[d.orgIds.length - 1] !== orgId).forEach(d => {
          d.isMain = false
        })
      },
      updateCenter(orgId) {
        this.editForm.otherOrgList.filter(d => d.orgIds[d.orgIds.length - 1] !== orgId).forEach(d => {
          d.isCenter = false
        })
      },
      removeOrg(item) {
        arrayGetRid(this.editForm.otherOrgList, [item])
      },
      reset() {
        this.editForm.roleIdList = []
        this.editForm.otherOrgList = []
        this.$refs.editForm.resetFields()
      },
      closeEvent() {
        this.reset()
        this.editDialog = false
      },
      submit() {
        let checkOrgList = true
        this.$refs.editForm.validate((valid) => {
          if (valid === true) {
            this.editForm.zxid = ''
            this.editForm.orgId = ''
            this.editForm.orgIdList = []
            this.editForm.otherorgList = []

            this.editForm.userId = this.target !== null ? this.target.userId : ''
            this.editForm.otherOrgList.forEach((d, i) => {
              if (d.orgIds.length > 0) {
                if (d.zwjb === '') {
                  checkOrgList = false
                  return false
                } else {
                  d.orgId = d.orgIds[d.orgIds.length - 1]
                  d.zwjbmc = this.dictList['ZJ'].find(z => z.value === d.zwjb).label

                  if (d.isMain === true) {
                    this.editForm.orgId = d.orgId
                    this.editForm.orgIdList = [d.orgId]
                  }

                  if (d.isCenter === true) {
                    this.editForm.zxid = d.orgId
                  }
                }
              } else {
                checkOrgList = false
                return false
              }
            })

            if (checkOrgList === false) {
              this.$alert('必需同时选择 单位 和 职务级别', '温馨提示');
              return false
            }
            if (this.editForm.zxid === '' || this.editForm.orgId === '') {
              this.$alert('必需选择 主单位 和 中心', '温馨提示')
              return false
            }
            if (this.editForm.dlrk === 'DLRK_4X') {
              this.editForm.menuId = 'D572AF92ED9340EE992286CDF71607DA'
            } else if (this.editForm.dlrk === 'DLRK_HT') {
              this.editForm.menuId = '1'
            }

            this.editForm.otherorgList = this.editForm.otherOrgList

            // console.log(this.editForm, this.target !== null ? UPDATE_SYS_USER : ADD_SYS_USER);
            this.dispatch(this.target !== null ? UPDATE_SYS_USER : ADD_SYS_USER, this.editForm).then(() => {
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
        this.dispatch(GET_SYS_USER_LIST, {
          Keyword: this.queryForm.keyword,
          isAll: this.queryForm.isAll === true ? '1' : '0',
          PageSize: this.pagenav.limit,
          PageIndex: this.pagenav.currentpage
        }).then(() => {
          this.count = this.users.sysUserList.DataCount
          this.list = this.users.sysUserList.PageData
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
          this.dispatch(DEL_SYS_USER, { userIds: [items.userId].join(',') }).then(() => {
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

      this.getRuleOrgTree().then(d => {
        this.orgTree = d
      })

      this.dispatch(FETCH_SYS_MENU).then(() => {
        this.menuOps = this.$store.getters.menuTree[0].children.filter(d => d.type === 0).map(d => { return { value: d.menuId, label: d.name } })
      })

      this.dispatch(GET_SYS_ROLE_TREE)

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
      this.getDict(['GW', 'ZJ'], true).then(res => {
        this.dictList = res
      })
      this.tab = {
        label: this.$route.name,
        name: this.$route.path
      }
    }
  }

</script>
