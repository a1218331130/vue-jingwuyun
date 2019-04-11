<template>
<el-layout class="app-layout" :fit="true">
  <!-- 头部导航 -->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar></top-bar>
  </el-region>
  <!-- 侧边栏(左导航按钮) -->
  <el-region :class="{'app-west':true, 'app-west--collapsed':isWestCollapsed}" slot="west" type="west" :zoom="false" :fixed="false">

    <side-bar :collapsed="isWestCollapsed" :active="active" :data="menu"></side-bar>

    <div :class="{'app-side-bar__fold':true, 'el-icon-d-arrow-left':isWestCollapsed===false,'el-icon-d-arrow-right':isWestCollapsed===true,}" @click="switchWest"></div>
  </el-region>
  <!-- 内容区 -->
  <el-region class="app-center" slot="center" type="center">
    <router-view></router-view>
  </el-region>

</el-layout>
</template>
<style lang="scss" scoped>
  .app-position {
    width: 56px;
    border-left: 3px solid #1c8de0;
  }

  .app-position.app-position--collapsed {
    width: 230px;
    border-left: 1px solid #1c8de0;
    background-color: #f3f3f3;
  }

</style>
<script>
  import mixin from '../../utils/mixin'
  import TopBar from '../common/topbar/index.vue'
  import SideBar from '../common/side-bar.vue'
  import toolbar from './toolbar'
  export default {
    mixins: [mixin],
    components: {
      TopBar,
      SideBar,
      toolbar
    },
    data() {
      return {
        isWestCollapsed: true,
        isEastCollapsed: false,
        active: '',
        menu: [{
          MenuId: 1,
          MenuName: '已收通报',
          RequestUrl: '/notification/list',
          MenuType: 0,
          MenuIcon: 'iconfont icon-folder-open',
          SubMenus: []
        }, {
          MenuId: 1,
          MenuName: '草稿箱',
          RequestUrl: '/notification/draft',
          MenuType: 0,
          MenuIcon: 'iconfont icon-anjianyanpan',
          SubMenus: []
        }]
      }
    },
    props: [],
    computed: {},
    methods: {
      toggleEastCollapse() {
        this.isEastCollapsed = !this.isEastCollapsed
      },
      switchWest() {
        this.isWestCollapsed = this.isWestCollapsed === false
      }
    },
    created() {
      // this.active = this.$route.path
    },
    mounted() {
      console.log('on bus opendialog')
    }
  }

</script>
