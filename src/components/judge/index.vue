<template>
  <el-layout class="app-layout" :fit="true">
    <!-- 头部导航 -->
    <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
      <top-bar></top-bar>
    </el-region>
    <!-- 侧边栏(左导航按钮) -->
    <el-region :class="{'app-west':true, 'app-west--collapsed':isWestCollapsed}" slot="west" type="west" :zoom="false"
               :fixed="false">
      <!-- 左导航 -->
      <side-bar :collapsed="isWestCollapsed" :active="menuActive" :data="menu"></side-bar>

      <div
        :class="{'app-side-bar__fold':true, 'el-icon-d-arrow-left':isWestCollapsed===false,'el-icon-d-arrow-right':isWestCollapsed===true,}"
        @click="switchWest"></div>
    </el-region>
    <!-- 内容区 -->
    <el-region class="app-center" slot="center" type="center">
      <keep-alive>
        <router-view></router-view>
        </keep-alive>
      <!--顶部工具栏-->
      <!--<toolbar :unfoldState="unfoldT" @unfoldHandle="unfoldHandle" :listOfdetail="listOfdetail" v-if="active===2" @call:show-east="showEast" @call:change-type="toggleTypeList" @call:change-message="toggleMessage" @call:change-add="add"></toolbar>-->
      <!-- 中心内容 -->
      <!--<caseInfo v-if="active===1"></caseInfo>-->
      <!--<noticeList :listType="listType" :listOfdetail="listOfdetail" v-if="active===2" @call:change-message="toggleMessage"></noticeList>-->
    </el-region>
    <!-- 侧边栏(右工具按钮) -->
    <el-region class="position" :class="{'app-position':true, 'app-position--collapsed':isEastCollapsed}" slot="east"
               type="east" :zoom="false" :fixed="true">

    </el-region>
  </el-layout>
</template>
<style lang="scss" scoped>
  .app-position {
    width: 0;
  }

  .app-position.app-position--collapsed {
    width: 309px;
    height: calc(100% - 70px);
    background-color: #fff;
    border-left: 1px solid #ccc;
    position: absolute;
    right: 0;
    top: 40px;
    padding: 15px 10px;
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
  export default {
    mixins: [mixin],
    components: {
      SideBar,
      TopBar
    },
    computed: {
      ...mapState(['users'])
    },
    data() {
      return {
        isWestCollapsed: false,
        isEastCollapsed: false,
        menuActive: '',
        menu: []
      }
    },
    props: [],
    methods: {
      /**
       * 获取用户菜单
       */
      queryUserMenuList() {
        let caseMenuId = get('permission_case').id
        this.dispatch(FETCH_USER_MENU, {
          CurMenuId: caseMenuId
        }).then(r => {
          let _caseMenuList = {}
          this.menu = this.users.userMenu.filter(r => !r.MenuName.includes('研判')).map(rm => {
            _caseMenuList[rm.RequestUrl] = {
              id: rm.MenuId,
              //            treeId: rm.TreeId,
              treeId: caseMenuId,
              name: rm.MenuName
            }
            return {
              MenuId: rm.MenuId,
              MenuName: rm.MenuName,
              RequestUrl: rm.RequestUrl,
              MenuType: rm.MenuType,
              MenuIcon: rm.MenuIcon,
              Sfqy: rm.Sfqy,
              SubMenus: []
            }
          })
          save('case_menu_list', _caseMenuList);
        })
      },
      toggleEastCollapse() {
        this.isEastCollapsed = !this.isEastCollapsed
      },
      switchWest() {
        this.isWestCollapsed = this.isWestCollapsed === false
      }
    },
    watch: {},
    created() {
      this.queryUserMenuList()
    },
    mounted() {}
  }

</script>
