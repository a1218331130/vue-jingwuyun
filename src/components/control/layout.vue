<template>
<el-layout class="app-layout" :fit="true">
  <!-- 头部导航 -->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar></top-bar>
  </el-region>
  <!-- 侧边栏(左导航按钮) -->
  <el-region :class="{'app-west':true, 'app-west--collapsed':isWestCollapsed}" slot="west" type="west" :zoom="false" :fixed="false">
    <!-- 左导航 -->
    <side-bar id="controlSideBar" ref="sideBar" :collapsed="isWestCollapsed" menuActive :data="menu" :router="false" @update:external="handleMenuClick" @init:success="init"></side-bar>
    <!-- 底部收缩按钮 -->
    <div :class="{'app-side-bar__fold':true, 'el-icon-d-arrow-left':isWestCollapsed===false,'el-icon-d-arrow-right':isWestCollapsed===true,}" @click="switchWest"></div>
  </el-region>

  <!-- 内容区 -->
  <el-region class="app-center" slot="center" type="center">

    <!-- 树结构 -->
    <!-- 首页-无二级菜单 -->
    <home v-show="homeShow"></home>
    <!-- 二级菜单 -->
    <group v-for="(item,i) in menu" :data="item" :key="i" v-if="currentMenu===item.MenuId">
      <slot name="fxpcgkPeople">
        <keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </keep-alive>
      </slot>
    </group>
    <!-- 统计分析 -->
    <people v-if="tjIf" v-show="tjShow">
      <slot name="fxpcgkPeople">
        <keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </keep-alive>
      </slot>
    </people>
    <!-- 隐患概况 -->
    <count v-if="countIf" v-show="countShow">
      <slot name="fxpcgkPeople">
        <keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </keep-alive>
      </slot>
    </count>
    <!-- 重点线索 -->
    <clue v-if="clueShow"></clue>
    <!--顶部工具栏-->
    <!--<toolbar :unfoldState="unfoldT" @unfoldHandle="unfoldHandle" :listOfdetail="listOfdetail" v-if="active===2" @call:show-east="showEast" @call:change-type="toggleTypeList" @call:change-message="toggleMessage" @call:change-add="add"></toolbar>-->
    <!-- 中心内容 -->
    <!--<caseInfo v-if="active===1"></caseInfo>-->
    <!--<noticeList :listType="listType" :listOfdetail="listOfdetail" v-if="active===2" @call:change-message="toggleMessage"></noticeList>-->
  </el-region>
  <!-- 侧边栏(右工具按钮) -->
  <el-region class="position" :class="{'app-position':true, 'app-position--collapsed':isEastCollapsed}" slot="east" type="east" :zoom="false" :fixed="true">
  </el-region>
</el-layout>
</template>
<style lang="scss" scoped>
  .app-position {
    width: 0;
  }

  .app-center {
    position: relative;
  }

  .app-position.app-position--collapsed {
    width: 300px;
    height: calc(100% - 70px);
    background-color: #fff;
    border-left: 1px solid #ccc;
    position: absolute;
    right: 0;
    top: 40px; // padding: 15px 10px;
    transition: right 0.5s cubic-bezier(0.21, 0.99, 0.59, 1.03);
    -moz-transition: right 0.5s cubic-bezier(0.21, 0.99, 0.59, 1.03);
    -webkit-transition: right 0.5s cubic-bezier(0.21, 0.99, 0.59, 1.03);
    -o-transition: right 0.5s cubic-bezier(0.21, 0.99, 0.59, 1.03);
  }

  .spc-box {
    height: 30px;
    line-height: 30px;
    margin: 10px 0;
    .btn-new {
      height: 30px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
      float: right;
    }
  }

  .sunCenter-box {
    height: 100%;
  }

  .sunCenter {
    background-color: #f0f0f0;
  }

</style>

<script>
  import mixin from '../../utils/mixin'
  import TopBar from '../common/topbar/index.vue'
  import SideBar from '../common/side-bar.vue'
  import { FETCH_USER_MENU } from '../../store/types'
  import { mapState } from 'vuex'
  import { get, save } from '../../utils/storage'
  import { clone } from '../../utils/util'
  import infoDialogEvents from '../../utils/infoDialogEvents'
  import group from './group'
  import home from './home/index.vue'
  import people from './people/analysis-people'
  import count from './count/index'
  import clue from './clue/index'
  export default {
    mixins: [mixin, infoDialogEvents],
    components: {
      SideBar,
      TopBar,
      group,
      home,
      people,
      clue,
      count
    },
    computed: {
      ...mapState(['users'])
    },
    data() {
      return {
        currentMenu: '',
        countShow: false,
        countIf: false,
        showRouterView: false,
        isWestCollapsed: false,
        isEastCollapsed: false,
        isSetDefault: false,
        clickTime: true,
        homeShow: true,
        tjShow: false,
        tjIf: false,
        clueShow: false,
        menuShow: false,
        treeData: [],
        menuActive: '',
        menu: [],
        title: '',
        miniWest: true,
        defaultProps: {
          label: 'MenuName',
          children: 'SubMenus'
        }
      }
    },
    props: [],
    watch: {
      // '$route' (newVal, oldVal) {
      //   if (newVal.path !== oldVal.path) {
      //     this.isSetDefault = false
      //   }
      // }
    },
    methods: {
      init(items) {
        if (!this.isSetDefault && this.$route.query.subMenuId) {
          let target = items.find(d => d.MenuId === this.$route.query.subMenuId)
          if (target) {
            this.isSetDefault = true
            this.$nextTick(() => {
              this.handleMenuClick(target)
            })
          }
        }
        // if (this.$route.path.indexOf('control') === -1 || !this.$route.query.subMenuId) this.showRouterView = true
      },
      // 渲染树结构
      handleMenuClick(menu) {
        if ((menu && menu.children && menu.children.length > 0)) {
          if (this.clickTime) {
            this.clickTime = false
            setTimeout(() => {
              this.clickTime = true
            }, 1000)
          } else {
            this.$message('点击过快了，休息一会吧!!')
            return false
          }
        }

        this.title = menu.MenuName
        // 递归过滤menutype为2的子项
        if (menu && menu.children && menu.children.length > 0) {
          this.currentMenu = ''
          this.homeShow = false
          this.tjShow = false
          this.clueShow = false
          this.countShow = false
          this.miniWest = true
          this.menuShow = false
          this.showRouterView = false
          const parser = function(array) {
            return array.filter(n => {
              if (n.SubMenus && n.SubMenus.length > 0) {
                n.SubMenus = parser(n.SubMenus)
              }
              return n.MenuType !== 2
            })
          }
          this.treeData = parser(menu.children.slice())
          if (this.treeData.length !== 0) {
            this.currentMenu = menu.MenuId
          } else {
            this.$router.push({
              path: menu.RequestUrl
            })
          }
        } else {
          this.currentMenu = ''
          this.homeShow = false
          this.countShow = false
          this.tjShow = false
          this.clueShow = false
          this.menuShow = false
          if (menu.MenuName === '首页') {
            this.homeShow = true
          } else if (menu.MenuName === '统计分析') {
            this.tjIf = true
            this.tjShow = true
          } else if (menu.MenuName === '隐患概况') {
            this.countIf = true
            this.countShow = true
          } else if (menu.RequestUrl === '/control/risk/clue') {
            this.clueShow = true
          } else if (menu.RequestUrl === '/control/risk/check') {
            this.menuShow = true
          } else {
            // this.$router.push({ path: menu.RequestUrl, query: { menuId: menu.TreeId } })
          }
          this.miniWest = true
          this.showRouterView = true
          this.$('#controlSideBar li.el-menu-item.is-active').removeClass('is-active')
        }
      },
      /**
       * 获取用户菜单
       */
      queryUserMenuList() {
        let controlMenuId = (get('permission_control') || {}).id
        this.dispatch(FETCH_USER_MENU, {
          CurMenuId: controlMenuId
        }).then(r => {
          let menuList = {}
          // this.$refs.catTree = this.users.userMenu
          this.menu = this.users.userMenu.map(rm => {
            menuList[rm.RequestUrl] = {
              id: rm.MenuId,
              treeId: rm.TreeId,
              // treeId: controlMenuId,
              name: rm.MenuName
            }
            let res = clone(rm)
            res.children = res.SubMenus
            res.SubMenus = []
            return res
          })
          save('control_menu_list', menuList)
        })
      },
      toggleEastCollapse() {
        this.isEastCollapsed = !this.isEastCollapsed
      },
      switchWest() {
        this.isWestCollapsed = this.isWestCollapsed === false
      },
      updateKeywords(val) {
        this.heightLightKeys = [...val]
      },
      updateCat(val, formRightbar, options) {
        let pagenav = this.tabs[this.currentTab].pagenav
        this.list = []
        this.treeRes = val.data
        this.count = this.treeRes.count
        if (!formRightbar) {
          // 左栏事件
          this.type = val.type
          if (this.type === 2) {
            this.listType = 1
          }
          pagenav = {
            limit: val.limit || 20,
            currentpage: 1
          }
          if (this.type === 1) {
            this.currentTabeId = val.data.id
          }
        } else {
          // 右栏事件
          this.type = 1
          pagenav = {
            limit: pagenav.limit,
            currentpage: 1
          }
        }
        if (options) {
          pagenav = Object.assign({}, pagenav, options)
        }
        this.fetchList(pagenav)
      }
    },
    created() {
      this.queryUserMenuList()
      // if (this.$route.path.indexOf('control') === -1 && this.$route.query.menuId && this.$route.query.subMenuId) {
      //   this.$router.push({
      //     path: '/control',
      //     query: {
      //       menuId: this.$route.query.menuId,
      //       subMenuId: this.$route.query.subMenuId
      //     }
      //   })
      //   this.$nextTick(() => {
      //     this.queryUserMenuList()
      //   })
      // } else {
      //   if (!this.$route.query.subMenuId) this.showRouterView = true
      //   this.queryUserMenuList()
      // }
      // this.$router.afterEach((to, from) => {
      //   if (to.path.indexOf('control') === -1) this.showRouterView = true
      //   this.$nextTick(() => {
      //     if (this.title) {
      //       this.$('#controlSideBar li.el-menu-item.is-active').removeClass('is-active')
      //       this.$('#controlSideBar li.el-menu-item[title="' + this.title + '"]').addClass('is-active')
      //     }
      //   })
      // })
    },
    mounted() {}
  }

</script>
