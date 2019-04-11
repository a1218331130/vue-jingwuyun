<template>
<el-layout class="app-layout" :fit="true" v-loading.body="false" element-loading-text="正在初始化...">
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <p class="title">{{title}}</p>
  </el-region>
  <el-region class="app-center" slot="center" type="center">
    <div class="app-center-box">
      <app-west-menu class="app-menu-box"></app-west-menu>
      <div class="app-center-context">
        <router-view class="dossier-list-context"></router-view>
      </div>
    </div>
  </el-region>
</el-layout>
</template>
<style scoped lang="scss">
//.app-wrapper
.app-north {
    background-color: #199ED8;
    .title {
        font-size: 18px;
        color: #fff;
        font-weight: bold;
        max-width: 1200px;
        margin: 0 auto;
        line-height: 60px;
        text-indent: 5px;
    }
}

.app-center {
    background-color: #F2F2F2;
    .app-center-box {
        width: calc(50% + 688px);
        margin: 0 auto;
        position: absolute;
        height: calc(100% - 60px);
        left: 50%;
        margin-left: -688px;
        .app-center-context {
            width: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            height: 100%;
            float: right;
            &::-webkit-scrollbar {
                // background: transparent;
                width: 8px;
                &-track {
                    background: transparent;
                }
                &-thumb {
                    background: rgba(0, 0, 0, .4); //$borderColor;
                    border-radius: 8px;
                }
            }
            .dossier-list-context {
                width: 1190px;
                margin: 0 auto auto 185px;
                padding: 20px 0;
                float: left;
                background: #F2F2F2;
            }
        }
    }
}
@media screen and (max-width: 1366px) {
    .app-center-context {
        width: calc(100vw - 185px) !important;
        overflow-x: auto !important;
        float: left !important;
        margin-left: 185px;
        .dossier-list-context {
            margin-left: 0 !important;
        }
    }
}
</style>

<script>
import mainPageHeader from '../common/mainheader/main-page-header.vue'
import appWestMenu from './app-west-menu.vue'
import bus from '../../utils/bus'
export default {
  data() {
    return {
      title: '档案',
      load: true,
      count: 0
    }
  },
  props: {},
  components: {
    mainPageHeader,
    appWestMenu
  },
  methods: {},
  mounted() {

  },
  created() {
    bus.$on('update:dossierTitle', d => {
      this.title = d
    })
    // 统计人员档案异步加载完成情况
    bus.$on('allLoading', () => {
      this.count++;
      if(this.count === 14) { this.load = false } // console.log(this.count)
    })
    // 统计车辆档案异步加载完成情况
    bus.$on('allCarLoading', () => {
      this.count++;
      if(this.count === 9) { this.load = false } // console.log(this.count)
    })
  }
}
</script>
