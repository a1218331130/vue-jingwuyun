<!--我的常用-->
<template>
  <el-layout class="app-layout" :fit="true">
     <!--头部导航-->
    <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
      <top-bar></top-bar>
    </el-region>
    <!--内容-->
    <el-region class="app-center" slot="center" type="center">
      <!--我的常用-->
      <myListColle @call:change="changeEast"></myListColle>
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
      margin-top: 0px;
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
  import mixin from '../../utils/mixin'
  import {
    mapState
  } from 'vuex'
  import TopBar from '../common/topbar/index.vue'
  import East from './east.vue'
  import List from './list.vue'
  import myListColle from './myListColle.vue'
  // 资源
  export default {
    mixins: [mixin],
    data: function () {
      return {
        sideUp: true, // 默认收起
        active: 1,
        num: 1,
        info: {}
      }
    },
    components: {
      TopBar,
      List,
      East,
      myListColle
    },
    computed: {
      ...mapState([])
    },
    watch: {
      info(val) {
        if (val.id) {
          if (!val.sideUp) {
            this.sideUp = false // 收起侧栏
          }
        } else {
          this.sideUp = true // 展开侧栏
        }
      }
    },
    methods: {
      current: function (current) {
        this.active = current;
        this.info = {}
      },
      changeEast: function (object) {
        this.info = object
      }
    },
    mounted() {
    }
  }
</script>
