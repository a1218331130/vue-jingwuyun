<template>
<div>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :modal-append-to-body="true" :append-to-body="true" title="权限配置" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent" v-loading.body="loading">
    <p>选择菜单权限</p>
    <el-tree ref="menuTree" :data="jurDataList" show-checkbox :props="treeProps" :node-key="treeProps.id" :default-expanded-keys="defaultExpandedKeys" :default-checked-keys="defaultCheckedKeys" :check-strictly="false" :filter-node-method="filterNodeMethod"
      :expand-on-click-node="false" :default-expand-all="false" :render-content="renderContent">
    </el-tree>


    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<style scoped>


</style>
<script>
  import mixin from '../../../utils/mixin'
  import { mapState } from 'vuex'
  import {
    UPDATE_PERSONNEL_LIMITS, // 更新办案人员权限
    FETCH_PERSONNEL_LIMITS_LIST // 查询办案人员权限
  } from '../../../store/types'
  import { getLoginUser, getAdminUser } from '../../../utils/storage'
  import { clone } from '../../../utils/util'

  export default {
    mixins: [mixin],
    props: ['dialog', 'jurisdictionUserId'],
    computed: {
      ...mapState(['peopleCase', 'users'])
    },
    components: {},
    data() {
      return {
        loading: false,
        caseId: '', // 案件ID,
        cjrId: '',
        treeProps: {
          children: 'children',
          label: 'label',
          id: 'menuId'
        },
        loginUserMenuList: [], // 当前登录用户的菜单权限
        loginUserId: '', // 当前登录用户ID
        defaultCheckedKeys: [], // 默认当前选中的菜单
        jurDataList: [],
        defaultExpandedKeys: [] // 默认展开树节点
      }
    },
    methods: {
      /**
       *初始化编辑窗口
       * @return {[type]} [description]
       */
      initDialog() {
        // 初始化登录用户案件研判权限
        if (this.peopleCase.fetchLoginPersonnelLimitsList) {
          this.loginUserMenuList = clone(this.peopleCase.fetchLoginPersonnelLimitsList.map(r => {
            return r.menuId
          }))
        }
        this.queryList() // 获取当前办案人员权限
      },
      /**
       * 编辑窗关闭事件
       * @return {[type]} [description]
       */
      closeEvent() {
        this.$emit('close')
        // this.dialog = false
      },

      /**
       * 获取研判权限菜单列表
       */
      queryUserMenuList() {
        let _ForEachList = (d) => { // 查找下级树map
          let _cChildren = [],
            listArry = []
          for (let rsd in d) {
            let _rds = d[rsd]
            if (_rds.SubMenus.length > 0) {
              _cChildren.push(_ForEachList(_rds.SubMenus))
            } else {
              // 当前登录用户是否权限菜单筛选，过滤二级节点
              if (this.loginUserId === getAdminUser().userId || this.cjrId === this.loginUserId || this.loginUserMenuList.includes(_rds.MenuId)) {
                let _listA = {
                  id: _rds.TreeId,
                  parentId: _rds.ParentId,
                  menuId: _rds.MenuId,
                  label: _rds.MenuName
                }
                if (_cChildren.length > 0) _listA.children = _cChildren
                listArry.push(_listA)
              }
            }
            if (parseInt(d.length - 1) === parseInt(rsd)) {
              return listArry
            }
          }
        }
        let _menuList = []
        let _menuListParentId = '' // 当前父节点id,用于默认展开第一级树 .filter(rfsm => (this.loginUserId === getAdminUser().userId || this.loginUserMenuList.includes(rfsm.TreeId)))
        if (this.users.userMenu) {
          this.users.userMenu.filter(rf => (rf.MenuType === 1 && rf.MenuName.includes('研判'))).map(r => {
            if (!_menuListParentId) _menuListParentId = r.MenuId // 获取当前菜单列表父节点ID
            let _subChildren = []
            if (r.SubMenus) {
              console.log(r.SubMenus, '123');
              _subChildren = r.SubMenus.filter(rfsm => {
                // 菜单权限选择筛选
                rfsm.SubMenus.map(rfsmS => { // 过滤有选子类的取其父类ID
                  console.log(rfsm.SubMenus, '菜单');
                  if (this.loginUserMenuList.includes(rfsmS.TreeId) && !this.loginUserMenuList.includes(rfsmS.ParentId)) {
                    this.loginUserMenuList.push(rfsmS.ParentId)
                  }
                })
                console.log(this.loginUserMenuList, 222);
                return this.loginUserId === getAdminUser().userId || this.cjrId === this.loginUserId || this.loginUserMenuList.includes(rfsm.TreeId)
              }).map(rSub => {
                let _rSubmenuTree = {
                  id: rSub.TreeId,
                  parentId: rSub.ParentId,
                  menuId: rSub.MenuId,
                  label: rSub.MenuName
                }
                let _cforE = _ForEachList(rSub.SubMenus)
                if (_cforE) _rSubmenuTree.children = _cforE
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
        this.defaultExpandedKeys.push(_menuListParentId)
        // 树节点筛选触发【暂停使用,筛选后树节点会全部展开】
        //        this.$nextTick(() => {
        //          // 触发默认根筛选
        //          this.$refs.menuTree.filter(this.loginUserMenuList)
        //        })
      },
      /**
       * 查询当前用户权限树
       */
      queryList() {
        this.dispatch(FETCH_PERSONNEL_LIMITS_LIST, {
          ajid: this.caseId, // 必填
          userid: this.jurisdictionUserId // 必填
        }).then(r => {
          this.defaultCheckedKeys = this.peopleCase.fetchPersonnelLimitsList.map(r => {
            return r.menuId
          })

          this.queryUserMenuList() // 获取研判权限菜单树
        })
      },
      /**
       * 提交编辑文章表单事件
       * @return {[type]} [description]
       */
      submit() {
        this.loading = true
        // 表单验证
        let _selectMenus = this.$refs.menuTree.getCheckedNodes().map(r => {
          return {
            id: r.menuId,
            pid: r.parentId
          }
        })
        // 更新办案人员权限选择
        this.dispatch(UPDATE_PERSONNEL_LIMITS, {
          ajid: this.caseId, // 必填
          userid: this.jurisdictionUserId, // 必填
          menuList: _selectMenus
        }).then(r => {
          this.$message({
            type: 'success',
            message: '办案权限设置成功'
          })
          this.loading = false
          this.closeEvent()
        }).catch(e => {})
      },
      /**
       * 编辑模态窗取消按钮事件
       * @return {[type]} [description]
       */
      cancel() {
        this.closeEvent()
      },
      renderContent(h, { node, data, store }) {
        var self = this,
          nodeContent,
          buttonBox = '';
          // buttonAll = ''
        //   buttonRev = ''
        if (node.isLeaf === false) {
          // buttonAll = h('el-button', {
          //   props: {
          //     size: 'mini'
          //   },
          //   on: {
          //     click() {
          //       self.checkAll(store, data)
          //     }
          //   }
          // }, '全选')
          buttonBox = h('span', {
            class: 'float-right'
          })
          // }, [buttonAll])
        }
        nodeContent = h('span', {
          key: data[self.treeProps.id]
        }, [node.label, buttonBox])
        return nodeContent;
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

        if (rev === true) {
          // 反选
          targets.forEach(t => {
            let c = checker.find(d => {
              return d !== t
            })
            if (!c) {
              this.$refs.menuTree.setChecked(t, true)
            } else {
              this.$refs.menuTree.setChecked(c, false)
            }
          })
        } else {
          // 全选
          this.$refs.menuTree.setChecked(id, checker.length !== targets.length, true)
        }
      },
      /**
       *  树节点筛选【暂停使用,筛选后树节点会全部展开】
       * @param v
       * @param d
       * @param n
       */
      filterNodeMethod(v, d, n) {
        n.expanded = true
        return this.loginUserId === getAdminUser().userId || v.includes(d.id)
      }
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.cjrId = this.$route.query.b // 初始化获取案件id
      this.loginUserId = getLoginUser('UserLogin').UserData.UserId // 初始化获取登录用户Id
    },
    mounted() {}
  }

</script>
