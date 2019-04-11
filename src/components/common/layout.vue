<template>
<el-layout class="app-layout" :fit="true">
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar></top-bar>
  </el-region>
  <el-region :class="{'app-west': true, 'app-west--collapsed': isWestCollapsed,'hide-overflow-x':hideX}" slot="west" type="west" :zoom="false" :fixed="false">

    <side-bar v-if="sideMode==='grace'" :collapsed="isWestCollapsed" :active="active" @update:external="updateExternal" @init:success="updateRoute"></side-bar>
    <tree-side-bar v-if="sideMode==='tree'" :collapsed="isWestCollapsed" :active="active" @update:external="updateExternal"></tree-side-bar>

    <div :class="{'app-side-bar__fold':true, 'el-icon-d-arrow-left':isWestCollapsed===false,'el-icon-d-arrow-right':isWestCollapsed===true,}" @click="toggleWestCollapse"></div>
  </el-region>
  
  <el-region v-if="routePath ==='tactics'" class="app-center" slot="center" type="center">
      <router-view v-if="externalSrc===''"></router-view>
    <iframe v-if="externalSrc!==''" :src="externalSrc" class="external-box"></iframe>
  </el-region>
  <el-region class="app-center" slot="center" type="center" v-else>
    <keep-alive>
      <router-view v-if="externalSrc===''"></router-view>
    </keep-alive>
    <iframe v-if="externalSrc!==''" :src="externalSrc" class="external-box"></iframe>
  </el-region>
  



  <!-- 隐藏底部版权文案
      <el-region
        class="app-south"
        slot="south"
        :zoom="false"
        :fixed="false"
        type="south">
        <span>技术支持：珠海市新德汇信息技术有限公司</span>
      </el-region>-->
</el-layout>
</template>
<style scoped>
  .hide-overflow-x {
    overflow-x: hidden;
  }

  .external-box {
    width: calc(100% - 5px);
    height: calc(100vh - 78px);
    overflow: hidden;
  }

</style>
<script>
  import TopBar from './topbar/index.vue'
  import SideBar from './side-bar.vue'
  import TreeSideBar from './tree-sidebar.vue'
  import bus from '../../utils/bus'

  export default {
    data() {
      return {
        isWestCollapsed: false,
        hideX: false,
        active: '',
        externalSrc: '',
        routePath: ''
      }
    },
    components: {
      TopBar,
      SideBar,
      TreeSideBar
    },
    props: ['sideMode'],
    methods: {
      toggleWestCollapse() {
        this.hideX = true
        this.isWestCollapsed = !this.isWestCollapsed
        setTimeout(_ => {
          this.hideX = false
        }, 300)
      },
      updateExternal(val) {
        this.externalSrc = val || ''
      },
      updateRoute(menus) {
        if (this.$route.path === '/union') {
          let target = menus.find((d, i) => d.MenuType === 1 && d.HasAuthority === '1' && d.Sfqy === '1' && d.RequestUrl)
          if (target) this.$router.push(target.RequestUrl)
        }
      }
    },
    created() {
      bus.$on('tabs.remove', (path, selected) => {
        if (this.isWestCollapsed) {
          return;
        }
        this.active = path;
        this.$nextTick(() => {
          this.active = selected
        })
      })
      let path = this.$route.path.split('/')
      this.routePath = path.length > 0 ? path[1] : ''
    }
  }

</script>
