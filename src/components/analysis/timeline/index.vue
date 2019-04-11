<template>
<el-layout class="app-layout" :fit="true">
  <!-- 头部导航 -->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar></top-bar>
  </el-region>

  <el-region class="app-center" slot="center" type="center">
    <div class="time-box">
      <div class="time-left">
        <timeline-content></timeline-content>
      </div>
      <!-- <div class="time-right">
        <timeline-menu></timeline-menu>
      </div> -->

    </div>
  </el-region>

</el-layout>
</template>

<style scoped lang='scss'>
.time-box {
    height: calc(100vh - 60px);
    display: flex;
}

.time-left {
    flex-grow: 1;
    height: 100%;
    overflow-y: auto;
}

.time-right {
    flex-grow: 0;
    flex-shrink: 0;
    width: 171px;
    margin-top: 10px;
}
</style>

<script>
import TopBar from '../../common/topbar/index.vue'
import TimelineMenu from './menu.vue'
import TimelineContent from './list.vue'
export default {
  components: {
    TopBar,
    TimelineMenu,
    TimelineContent
  },
  data() {
    return {}
  },
  props: {},
  methods: {},
  watch: {},
  mounted() {},
  created() {}
}
</script>
