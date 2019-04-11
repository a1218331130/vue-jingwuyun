<template>
<el-layout class="app-layout" :fit="true">
  <!-- 头部导航 -->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar></top-bar>
  </el-region>
  <!-- 侧边栏(左导航按钮) -->
  <el-region :class="{'app-west':true, 'app-west--collapsed':isWestCollapsed}" slot="west" type="west" :zoom="false" :fixed="false">
    <div :class="['app-side-bar__fold', isWestCollapsed? 'el-icon-d-arrow-right': 'el-icon-d-arrow-left']" @click="toggleWestCollapse"></div>
    <slot name="sunWest">
    </slot>
  </el-region>
  <!-- 内容区 -->
  <el-region class="app-center" slot="center" type="center">
    <slot name="sunCenter"></slot>
  </el-region>

</el-layout>
</template>
<style lang="scss" scoped>
  .app-center {
    background-color: #ffffff;
    height: 100%;
    margin: 0px;
    padding: 0px;
  }

  .app-west {
    min-width: 64px;
    width: 220px;
    background: #1c7dc6;
    &.app-west--collapsed {
      width: 64px;
    }
  }

</style>
<script>
  import mixin from '../../utils/mixin'
  import TopBar from '../common/topbar/index.vue'
  export default {
    mixins: [mixin],
    components: {
      TopBar
    },
    data() {
      return {
        isWestCollapsed: false
      }
    },
    props: [],
    computed: {},
    methods: {
      toggleWestCollapse() {
        this.isWestCollapsed = !this.isWestCollapsed
        this.$emit('call:showMiniModel', this.isWestCollapsed)
      }
    },
    created() {
      this.active = this.$route.path
    },
    mounted() {}
  }

</script>
