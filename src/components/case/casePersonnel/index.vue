<template>
<div style="height: 100%;">
  <div class="app-toolbar" style="border: none">
    <span class="" style="color: #46BDFD;font-size: 16px">办案人员</span>
    <div class="app-search__buttons" v-if="loginUserIsAddPer()">
      <el-button type="primary" size="small" icon="plus" @click="add()">新增</el-button>
    </div>
  </div>
  <div class="app-content-box">
    <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" border stripe :data="pertionnelInfo">
      <el-table-column type="index" label="序号" width="100">
        <template scope="scope">
          {{scope.$index + 1 + pageInfo.limit * (pageInfo.currentpage - 1)}}
        </template>
      </el-table-column>
      <el-table-column type="alarmNum" prop="num" label="警号" width="150"></el-table-column>
      <el-table-column prop="zjhm" label="头像" width="80" align="center">
        <template scope="scope">
          <data-image class="person-box__person__image" :idCard="scope.row.zjhm"></data-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="unitText" label="所属单位" width="200">
      </el-table-column>
      <el-table-column prop="mobile" label="联系方式">
      </el-table-column>
      <el-table-column prop="work" label="岗位">
      </el-table-column>
      <el-table-column prop="duty" label="职责"></el-table-column>
      <!-- loginUserJobCode === '4'  checkUserRuleCase('ajgl/personnelqx/update',caseId,true,cjrId)-->
      <el-table-column label="操作" width="240" v-if="loginUserIsHandle()">
        <template scope="scope">
          <el-button type="primary" size="mini" @click="jurisdictionHandle(scope.row.userId)" v-if="loginUserAdjustPer" icon="icon iconfont icon-dunpai">权限
          </el-button>
          <el-button v-if="checkUserRuleCase('ajgl/police/update',caseId,true,cjrId)" type="primary" size="mini" @click="edit(scope.row)" icon="icon iconfont icon-brush">编辑
          </el-button>
          <el-button v-if="checkUserRuleCase('ajgl/police/delete',caseId,true,cjrId)" type="danger" size="mini" @click="remove(scope.row.id,scope.$index,scope.row)" icon="icon iconfont icon-trash">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="app-toolbar footer">
    <pagination :count="pageInfo.count" :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}" @update:pagenav="pagenavChange"></pagination>
  </div>
  <!-- 编辑模态窗 large/tiny-->
  <editor :dialog="editDialog" :data="formdate" :currentTabelList="pertionnelInfo" :editmode="editMode" @form:submit="submit" @close="editDialog=false"></editor>

  <!-- 权限模态窗 large/tiny-->
  <jurisdiction :jurisdictionUserId="jurisdictionUserId" :dialog="jurisdictionDialog" @close="jurisdictionDialog=false"></jurisdiction>

</div>
</template>
<style scoped>
.app-content-box {
  height: calc(100% - 139px);
  background: #fff;
  margin-top: 3px;
}

.person-box__person__image {
  width: 60px;
  max-height: 70px;
  margin-top: 6px;
}
</style>
<script>
import { mapState } from 'vuex'
import mixin from '../../../utils/mixin'
import {
  FETCH_PEOPLE_CASE_LIST,
  ADD_PEOPLE_CASE,
  UPDATE_PEOPLE_CASE,
  GET_PEOPLE_CASE_INFO,
  REMOVE_PEOPLE_CASE,
  UPDATE_PERSONNEL_LIMITS // 更新办案人员权限
} from '../../../store/types'

import pagination from '../../../widgets/pagination/pagination'
import editor from './editor.vue'
import jurisdiction from './jurisdiction.vue'
import {
  getLoginUser,
  getAdminUser
} from '../../../utils/storage'
import dataImage from '../../../widgets/data-image/data-image'
export default {
  mixins: [mixin],
  components: {
    dataImage,
    pagination,
    editor,
    jurisdiction
  },
  data() {
    return {
      editMode: 'add',
      targetId: '',
      editDialog: false,
      jurisdictionUserId: '', // 当前操作办案人员ID
      jurisdictionDialog: false,
      active: '',
      queryForm: {},
      pertionnelInfo: [],
      formdate: {},
      caseId: '',
      cjrId: '',
      loginUserId: '', // 当前登录用户ID
      loginUserJobCode: '', // 当前登录用户此案中岗位代码 // 1 组长 2 队长 3 组员 4 总负责人
      loginUserAdjustPer: false, // 当前登录用户此案中是否能修改权限
      loginUserMenuList: [], // 当前登录用户的菜单权限
      pageInfo: { // 页面分页信息相关配置
        count: 10,
        limit: 10,
        currentpage: 1
      },
      jurDataList: []
    }
  },
  computed: {
    ...mapState(['peopleCase', 'users'])
  },
  methods: {
    queryList() {
      if(this.checkUserRuleCase('ajgl/police/list', this.caseId, true, this.cjrId)) {
        // 获取办案人员列表
        this.pertionnelInfo = []
        this.dispatch(FETCH_PEOPLE_CASE_LIST, {
          ajid: this.caseId,
          PageIndex: this.pageInfo.currentpage,
          PageSize: this.pageInfo.limit
        }).then(r => {})
      }
    },
    /**
     * 当前登录用户是否有权限添加办案人员
     */
    loginUserIsAddPer() {
      let _isPre = false
      // 配置有添加权限
      if(this.checkUserRuleCase('ajgl/police/save', this.caseId, true, this.cjrId) && (this.loginUserAdjustPer || this.loginUserJobCode === '4')) {
        _isPre = true
      }
      return _isPre
    },
    /**
     * 当前登录用户是否有办案人员操作列权限
     */
    loginUserIsHandle() {
      let _isPre = false
      // 配置有添加权限
      if((this.checkUserRuleCase('ajgl/police/update', this.caseId, true, this.cjrId) || this.checkUserRuleCase('ajgl/police/delete', this.caseId, true, this.cjrId)) && (this.loginUserAdjustPer || this.loginUserJobCode === '4')) {
        _isPre = true
      }
      return _isPre
    },
    /**
     * 当前登录用户是否管理员
     */
    loginUserIsAdmin() {
      let _isAdmin = false
      if(this.loginUserId === getAdminUser().userId) {
        _isAdmin = true
      }
      return _isAdmin
    },
    getQueryInfo(carId, callback = () => {}) {
      // 查询单条办案人员信息
      this.dispatch(GET_PEOPLE_CASE_INFO, {
        ajid: this.caseId,
        userId: carId
      }).then(() => {
        callback()
      })
    },
    pagenavChange(obj) {
      // 分页切换操作
      this.pageInfo.limit = obj.limit
      this.pageInfo.currentpage = obj.currentpage
      this.queryList()
    },
    /**
     * 新增按钮事件
     */
    add() {
      this.targetId = ''
      this.editMode = 'add'
      this.editDialog = true
    },
    /**
     * 权限配置
     */
    jurisdictionHandle(userId) {
      this.jurisdictionUserId = userId
      this.jurisdictionDialog = true
    },
    edit(row) {
      // 编辑办案人员信息
      let peopleId = row.userId
      this.getQueryInfo(peopleId, () => {
        this.editMode = 'edit'
        this.editDialog = true
      })
    },
    submit(form, model) {
      // 表单数据提交
      let submitType = ADD_PEOPLE_CASE
      let dataDetail = {
        jh: form.num,
        mc: form.name,
        ssdw: form.unit,
        qx: form.mobile,
        zz: form.duty,
        userId: form.userId,
        gw: form.work,
        sfxg: form.adjustPer
      }
      if(form.id !== '') { // 判断表单id是否为空，非空可判断为更新提交
        submitType = UPDATE_PEOPLE_CASE
        dataDetail.id = form.id
      } else {
        dataDetail.ajid = this.caseId // 新增数据赋值当前案件id
      }
      this.dispatch(submitType, {
        data: dataDetail
      }).then(() => {
        this.editDialog = false
        if(submitType === UPDATE_PEOPLE_CASE) {
          this.queryList()
        } else {
          // 添加数据，更新当前显示页面
          this.pageInfo.currentpage = this.pageInfo.count % this.pageInfo.limit === 0 ? this.pageInfo.currentpage + 1 : Math.ceil(this.pageInfo.count / this.pageInfo.limit)
          this.queryList()
        }
      })
      if(model !== 'edit') {
        let arr = []
        if(this.jurDataList.length) {
          this.jurDataList.forEach((d, i) => {
            arr.push({ id: d.menuId, pid: d.parentId })
            if(d.children.length) {
              d.children.forEach((c, n) => {
                arr.push({ id: c.menuId, pid: c.parentId })
                if(c.children.length) {
                  c.children.forEach((b, x) => {
                    arr.push({ id: b.menuId, pid: b.parentId })
                  })
                }
              })
            }
          })
        }
        // 更新办案人员权限选择
        this.dispatch(UPDATE_PERSONNEL_LIMITS, {
          ajid: this.caseId, // 必填
          userid: form.userId, // 必填
          menuList: arr
        }).then(r => {
          console.log('办案权限设置成功')
        }).catch(e => {})
      }
    },
    remove(rowPeopleId, rowIndex, item) {
      if(item.userId === this.loginUserId) {
        this.$message({
          type: 'warning',
          message: '办案人员不能删除自己'
        })
        return
      }
      // console.log(rowPeopleId, 'rowPeopleId', rowIndex, 'rowIndex')
      this.$confirm('确定要删除此项?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.dispatch(REMOVE_PEOPLE_CASE, {
          ids: rowPeopleId
        }, rowIndex).then(() => {
          this.$message({
            type: 'success',
            message: '删除办案人员成功！'
          })
          this.queryList()
        })
      }).catch(() => {});
    },
    /**
     * 获取研判权限菜单列表
     */
    queryUserMenuList() {
      console.log(this.users.userMenu, 'userMenu')
      let _ForEachList = (d) => { // 查找下级树map
        let _cChildren = [],
          listArry = []
        for(let rsd in d) {
          let _rds = d[rsd]
          if(_rds.SubMenus.length > 0) {
            _cChildren.push(_ForEachList(_rds.SubMenus))
          } else {
            // 当前登录用户是否权限菜单筛选，过滤二级节点
            if(this.loginUserId === getAdminUser().userId || this.cjrId === this.loginUserId || this.loginUserMenuList.includes(_rds.MenuId)) {
              let _listA = {
                id: _rds.TreeId,
                parentId: _rds.ParentId,
                menuId: _rds.MenuId,
                label: _rds.MenuName
              }
              if(_cChildren.length > 0) _listA.children = _cChildren
              listArry.push(_listA)
            }
          }
          if(parseInt(d.length - 1) === parseInt(rsd)) {
            return listArry
          }
        }
      }
      let _menuList = []
      let _menuListParentId = '' // 当前父节点id,用于默认展开第一级树 .filter(rfsm => (this.loginUserId === getAdminUser().userId || this.loginUserMenuList.includes(rfsm.TreeId)))
      if(this.users.userMenu) {
        this.users.userMenu.filter(rf => (rf.MenuType === 1 && rf.MenuName.includes('研判'))).map(r => {
          if(!_menuListParentId) _menuListParentId = r.MenuId // 获取当前菜单列表父节点ID
          let _subChildren = []
          if(r.SubMenus) {
            _subChildren = r.SubMenus.filter(rfsm => {
              // 菜单权限选择筛选
              rfsm.SubMenus.map(rfsmS => { // 过滤有选子类的取其父类ID
                if(this.loginUserMenuList.includes(rfsmS.TreeId) && !this.loginUserMenuList.includes(rfsmS.ParentId)) {
                  this.loginUserMenuList.push(rfsmS.ParentId)
                }
              })
              return this.loginUserId === getAdminUser().userId || this.cjrId === this.loginUserId || this.loginUserMenuList.includes(rfsm.TreeId)
            }).map(rSub => {
              let _rSubmenuTree = {
                id: rSub.TreeId,
                parentId: rSub.ParentId,
                menuId: rSub.MenuId,
                label: rSub.MenuName
              }
              let _cforE = _ForEachList(rSub.SubMenus)
              if(_cforE) _rSubmenuTree.children = _cforE
              return _rSubmenuTree
            })
          }
          _menuList.push({
            id: r.TreeId,
            parentId: r.ParentId,
            menuId: r.MenuId,
            label: r.MenuName,
            children: _subChildren
          })
        })
      }

      this.jurDataList = _menuList
      // 树节点筛选触发【暂停使用,筛选后树节点会全部展开】
      //        this.$nextTick(() => {
      //          // 触发默认根筛选
      //          this.$refs.menuTree.filter(this.loginUserMenuList)
      //        })
    }
  },
  mounted() {},
  watch: {
    'peopleCase.PageData' (val) {
      this.pertionnelInfo = val.map(d => {
        if(this.loginUserId === d.userId) {
          this.loginUserJobCode = d.gwdm // 当前登录用户岗位代码
          this.loginUserAdjustPer = this.loginUserIsAdmin() || d.sfxg === '1'
        }
        return {
          id: d.id,
          userId: d.userId,
          zjhm: d.zjhm,
          name: d.mc,
          num: d.jh,
          unit: d.ssdw,
          unitText: d.ssdwmc,
          gwdm: d.gwdm,
          duty: d.zz,
          mobile: d.qx,
          work: d.gw,
          workCode: d.gwdm,
          adjustPer: d.sfxg
        }
      })
      this.pageInfo.count = this.peopleCase.DataCount
    }
  },
  created() {
    this.caseId = this.$route.query.a // 初始化获取案件id
    this.cjrId = this.$route.query.b // 初始化获取案件创建人id
    this.loginUserId = getLoginUser('UserLogin').UserData.UserId // 初始化获取登录用户Id
    // 初始化查询办案人员列表
    this.queryList()
    this.loginUserAdjustPer = this.loginUserIsAdmin()
    this.queryUserMenuList()
  }
}
</script>
