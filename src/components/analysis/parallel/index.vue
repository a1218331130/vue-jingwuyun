<!--串并分析-->
<template>
<el-layout class="app-layout" :fit="true">
  <!--头部导航-->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar></top-bar>
  </el-region>
  <!--侧边导航-->
  <el-region slot="west" type="west" :zoom="false" :fixed="false">
    <div class="nav-bar">
      <div @click="current(1)" :class="'nav-item'+(active === 1 ? '--current' : '')">
        <i class="iconfont icon-leimupinleifenleileibie"></i>
        <p>分类</p>
      </div>
      <div @click="current(2)" :class="'nav-item'+(active === 2 ? '--current' : '')">
        <i class="iconfont icon-city"></i>
        <p>人员</p>
      </div>
      <div @click="current(3)" :class="'nav-item'+(active === 3 ? '--current' : '')">
        <i class="iconfont icon-sort"></i>
        <p>案件</p>
      </div>

    </div>
  </el-region>
  <!--内容-->
  <el-region class="app-center" slot="center" type="center">
    <!--分类-->
    <list v-if="active===1" @call:change="changeEast"></list>
  </el-region>
</el-layout>
</template>
<style lang="scss" scoped>
.side-box {
    transition: margin-right 0.5s cubic-bezier(0.21, 0.99, 0.59, 1.03);
    -moz-transition: margin-right 0.5s cubic-bezier(0.21, 0.99, 0.59, 1.03);
    -webkit-transition: margin-right 0.5s cubic-bezier(0.21, 0.99, 0.59, 1.03);
    -o-transition: margin-right 0.5s cubic-bezier(0.21, 0.99, 0.59, 1.03);
    &-up {
        margin-right: -308px;
    }
}

.nav-bar {
    height: 100%;
    color: #ffffff;
    text-align: center;
    width: 70px;
    background-color: #0d5399;
    .nav-item {
        cursor: pointer;
        height: 40px;
        width: 60px;
        padding: 20px 5px;
        text-align: center;
        border-bottom: 1px solid #02396f;
        &:hover {
            background-color: #e6a00c;
        }
    }
    .nav-item--current {
        background-color: #e6a00c;
        cursor: pointer;
        height: 40px;
        width: 60px;
        padding: 20px 5px;
        text-align: center;
        border-bottom: 1px solid #02396f;
    }
    i {
        font-size: 24px;
        margin-top: 0;
    }
    p {
        height: 14px;
        margin-top: 10px;
        line-height: 14px;
        font-size: 14px;
    }
}
</style>

<script>
import TopBar from '../../common/topbar/index.vue'
import List from './list.vue'
export default {
  components: {
    TopBar,
    List
  },
  data() {
    return {
      active: 1,
      num: 1,
      info: {}
    }
  },
  props: {},
  methods: {},
  watch: {},
  mounted() {},
  created() {}
}
</script>
