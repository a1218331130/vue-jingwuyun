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
    <slot name="center">
      <router-view></router-view>
    </slot>
  </el-region>
  <!-- 侧边栏(右工具按钮) -->
  <!-- <el-region class="position" :class="{'app-position':true, 'app-position--collapsed':isEastCollapsed}" slot="east" type="east" :zoom="false" :fixed="true">
    <div :class="['app-side-bar__fold', 'iconfont', isEastCollapsed? 'icon-fold': 'icon-unfold']" @click="toggleEastCollapse"></div>
    <slot name="east">
    </slot>
  </el-region> -->
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
export default {
  mixins: [mixin],
  components: {
    TopBar,
    SideBar
  },
  data() {
    return {
      isWestCollapsed: false,
      isEastCollapsed: false,
      active: '',
      menu: [{
        MenuId: 1,
        MenuName: '申请概况',
        RequestUrl: '/union/applyStatistics',
        MenuType: 0,
        MenuIcon: 'iconfont icon-ripple',
        SubMenus: []
      }, {
        MenuId: 2,
        MenuName: '受理概况',
        RequestUrl: '/union/acceptStatistics',
        MenuType: 0,
        MenuIcon: 'iconfont icon-shiyongliang',
        SubMenus: []
      }, {
        MenuId: 3,
        MenuName: '我的申请',
        RequestUrl: '/union/apply',
        MenuType: 0,
        MenuIcon: 'iconfont icon-pinglu',
        SubMenus: []
      }, {
        MenuId: 4,
        MenuName: '我的受理',
        RequestUrl: '/union/accept',
        MenuType: 0,
        MenuIcon: 'iconfont icon-folder-open',
        SubMenus: []
      }, {
        MenuId: 5,
        MenuName: '待我审批',
        RequestUrl: '/union/examine',
        MenuType: 0,
        MenuIcon: 'iconfont icon-copy',
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
  mounted() {}
}
</script>
