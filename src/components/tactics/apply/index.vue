<template>
<el-layout class="app-layout" :fit="true">
  <!-- 头部导航 -->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <p class="tactics__title">{{title}}</p>
  </el-region>
  <!-- 侧边栏(左导航按钮) -->
  <el-region :class="{'app-west': true, 'app-west--collapsed': isWestCollapsed}" slot="west" type="west" :zoom="false" :fixed="false">
    <left-side :isWestCollapsed="isWestCollapsed" @call:list="callList" @call:switch="switchWest"></left-side>
  </el-region>

  <!-- 内容区 -->
  <el-region class="app-center" slot="center" type="center">
    <list ref="list" :query="query" @update:title="val=>title=val" @update:leftbar="val=>isWestCollapsed=val"></list>
  </el-region>

  <!-- 侧边栏(右工具按钮) -->
  <!-- <el-region class="position" :class="{'app-position':true, 'app-position--collapsed':isEastCollapsed}" slot="east" type="east" :zoom="false" :fixed="true">

  </el-region> -->
</el-layout>
</template>
<style lang="scss" scoped>
  .app-north {
    background-color: #0096d5;
    position: relative;
    height: 40px;
    .tactics__title {
      font-size: 18px;
      color: #fff;
      font-weight: bold;
      max-width: 1280px;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      margin: 0;
    }
    .btn-box {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      .el-button {
        background: #59c9b1;
        color: #fff;
        padding: 0;
        width: 32px;
        height: 32px;
        border: 2px solid #fff;
        border-radius: 50px;
        box-shadow: 0 0 2px 0.5 #000;
        position: relative;
        span {
          display: block;
        }
        i {
          display: none;
        }
        i,
        span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
        &:hover {
          background: #f9873b;
          span {
            display: none;
          }
          i {
            display: block;
          }
        }
      }
    }
  }

  .app-west {
    background: #fff;
    width: 55px;
    border-right: 1px solid #ccc;
    &--collapsed {
      width: 330px;
    }
    .app-side-bar__fold {
      background: #ccc;
    }
  }

</style>
<script>
  import mixin from '../../../utils/mixin'
  import leftSide from './leftSide'
  import list from './list'

  export default {
    mixins: [mixin],
    components: {
      'left-side': leftSide,
      list
    },
    data() {
      return {
        title: '',
        isWestCollapsed: true,
        isEastCollapsed: false,
        query: null
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
      },
      callList(query) {
        this.query = query
        this.$refs.list.showList = true
        this.$refs.list.showRightbar = false
      }
    },
    created() {
      document.title = '战法应用-智慧警务'
    },
    mounted() {}
  }

</script>
