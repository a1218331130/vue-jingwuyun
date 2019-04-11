<template>
<div class="sidebar app-side-bar">
  <el-menu default-active='2' :default-openeds="['1']" @open="handleOpen" @close="handleClose" :collapse='miniModel'>
    <el-submenu :index='item.index' v-for="(item,i) in list" :key='i' :collapse='item.collapse'>
      <template slot='title'>
          <div class="sidebar__titlemar"><i :class='item.icon'></i><span>{{item.title}}</span></div>
        </template>
      <el-menu-item style="padding-left: 35px; height: 40px; line-height: 40px" :class='subitem.icon' :index='subitem.index' v-for="(subitem,i) in item.submenu" :key='i' @click="nodeOnClickEvent(item,i)">
        {{subitem.title}}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</div>
</template>

<style lang="scss" scoped>
.iconfont {
    margin: 2px 10px 0 8px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

.sidebar {
    line-height: 38px;
    &__item {
        height: 38px;
        padding: 0 10px;
        color: #ffffff;
        font-size: 12px;
        border-bottom: 1px solid #2288d4;
        &:hover {
            background-color: #ff924a;
        }
        &--current {
            background-color: #ff924a;
            font-weight: bold;
        }
        /*.text{*/
        /*overflow: hidden;*/
        /*white-space: nowrap;*/
        /*text-overflow: ellipsis;*/
        /*}*/

    }
    &__titlemar {}
}
</style>

<style>
.sidebar .el-menu {
  background: #1c7dc6;
}

.sidebar .el-menu-item {
  color: #ffffff;
}

.sidebar .el-menu-item:hover {
  background: #ff924a;
}

.el-submenu__title:hover {
  background: #ff924a;
}

.sidebar .el-submenu__title {
  color: #ffffff;
}
</style>

<script>
import mixin from '../../../utils/mixin'

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      list: [{
        title: '个人分析',
        index: '1',
        icon: 'iconfont icon-ren1',
        submenu: [
          {
            title: '活动规律',
            comm: 'activityRule',
            //            icon: 'iconfont icon-guiji',
            index: '2'
          }, {
            title: '旅店',
            comm: 'hotel',
            //            icon: 'iconfont icon-feiji2',
            index: '3'
          }, {
            title: '铁路',
            comm: 'ralway',
            //            icon: 'iconfont icon-huoche',
            index: '4'
          }, {
            title: '网吧',
            comm: 'cyberBar',
            //            icon: 'iconfont icon-web',
            index: '5'
          }, {
            //            title: '航班同订票',
            //            comm: 'flightTicket',
            //            icon: 'iconfont icon-wangba',
            //            index: '6'
            //          }, {
            title: '航班同离港',
            comm: 'flightDeparture',
            //            icon: 'iconfont icon-feiji2',
            index: '7'
          }
        ]
      }, {
        title: '多人分析',
        index: '8',
        icon: 'iconfont icon-guanxi',
        submenu: [
          {
            title: '旅店',
            comm: 'manyHotel',
            //            icon: 'iconfont icon-feiji2',
            index: '9'
          }, {
            title: '铁路',
            comm: 'manyRalway',
            //            icon: 'iconfont icon-huoche',
            index: '10'
          }, {
            title: '网吧',
            comm: 'manyCyberBar',
            //            icon: 'iconfont icon-web',
            index: '11'
          }, {
            //            title: '航班同订票',
            //            comm: 'manyFlightTicket',
            //            icon: 'iconfont icon-wangba',
            //            index: '12'
            //          }, {
            title: '航班同离港',
            comm: 'manyFlightDeparture',
            //            icon: 'iconfont icon-feiji2',
            index: '13'
          }
        ]
      }, {
        title: '轨迹找人',
        icon: 'iconfont icon-guiji1',
        index: '14',
        submenu: [{
          title: '多时空分析',
          comm: 'multi',
          //            icon: 'iconfont icon-guiji_xiao',
          index: '15'
        }]
      }]
    }
  },
  computed: {},
  props: ['miniModel'],
  watch: {},
  methods: {
    handleOpen() {},
    handleClose() {},
    nodeOnClickEvent(item, i) {
      //        console.log('这是node点击事件i', i)
      //        console.log('这是node点击事件item', item)
      //        console.log('这是node点击事件comn', item.submenu[i])
      this.$emit('call:comm', item.submenu[i])
    }
  }
}
</script>
