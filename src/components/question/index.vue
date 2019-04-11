<!--系统直通车-->
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
         <i class="iconfont icon-ripple"></i><span style="padding-left:5px">反馈历史</span>
        </div>
        <div @click="current(2)" :class="'nav-item'+(active === 2 ? '--current' : '')" v-if="ifAdmin===1">
          <i class="iconfont icon-pinglu"></i><span style="padding-left:5px">我回复的</span>
        </div>
      </div>
    </el-region>
    <!--内容-->
    <el-region class="app-center" slot="center" type="center">
      <list v-if="active===1" @call:change="changeEast" ></list>
      <list-answer v-if="active===2" @call:change="changeEast" ></list-answer>
      <!--分类-->
      <!-- <list v-if="active===1" @call:change="changeEast" ></list>
      <listErea v-if="active===2" @call:change="changeEast"></listErea>
      <listSort v-if="active===3" @call:change="changeEast"></listSort>
      <listColle v-if="active===4" @call:change="changeEast"></listColle> -->
    </el-region>
    <!--右边简介-->
    <!-- <el-region slot="east" :class="{'side-box':true,'side-box-up':sideUp}" type="east" :zoom="false"
               :fixed="false">
      <east :info="info"></east>
    </el-region> -->
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
    width: 220px;
    background-color: #0d5399;
    .nav-item {
      cursor: pointer;
      width: 220px;
      height: 42px;
      line-height: 42px;
      padding-left: 20px;
      /* padding: 20px 5px; */
      border-bottom: 1px solid #02396f;
      &:hover {
        background-color: #BD6C39;
      }
    }
    .nav-item--current {
      background-color: #BD6C39;
      cursor: pointer;
      width: 220px;
      height: 42px;
      line-height: 42px;
      padding-left: 20px;
      /* padding: 20px 5px; */
      border-bottom: 1px solid #02396f;
    }
    i {
      font-size: 18px;
    }
  }
</style>
<script>
  import mixin from '../../utils/mixin'
  import {
    mapState
  } from 'vuex'
  import { Q_DISTINCT_ADMIN } from '../../store/types'
  import TopBar from '../common/topbar/index.vue'
//   import East from './east.vue'
  import List from './list.vue'
  import ListAnswer from './list-answer.vue'
//   import listColle from './listColle.vue'
//   import listErea from './listErea.vue'
//   import listSort from './listSort.vue'
  // 资源
  export default {
    mixins: [mixin],
    data: function () {
      return {
        sideUp: true, // 默认收起
        active: 1,
        num: 1,
        info: {},
        ifAdmin: ''
      }
    },
    components: {
      TopBar,
      List,
      ListAnswer
    //   East,
    //   listColle,
    //   listErea,
    //   listSort
    },
    computed: {
      ...mapState(['question'])
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
      this.dispatch(Q_DISTINCT_ADMIN).then(() => {
        this.ifAdmin = this.question.qDistinctAdmin;
      })
    }
  }
</script>
