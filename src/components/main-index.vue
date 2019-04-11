<template>
<page-container>
  <main-page-header class="top-header_main"></main-page-header>
  <!-- 两行标题
    <div class="app-xcenter-title">
      <p class="main-subtitle">{{pageTitle}}</p>
    </div>
    -->
  <div class="app-xcenter-title2">
    <p class="main-subtitle2">{{pageTitle}}</p>
  </div>
  <div class="main-box">
    <carousel></carousel>
    <carousel-menu @clickOpen="openPage"></carousel-menu>
    <!--<ul class="main-menu-list clearfix">
        <li v-for="uMenu in users.userMenu" @click="openPage(uMenu)">
          <img class="menu-icon" :src="uMenu.MenuIcon === null ?'/static/img/default02.png':uMenu.MenuIcon"/>
          <span class="menu-text">{{uMenu.MenuName}}</span>
        </li>
      </ul>-->
  </div>
</page-container>
</template>
<style lang="scss" scoped>
.page-container {
    background: url('../assets/main_bg.jpg') no-repeat center top;
    /*background-size: cover;*/
    height: auto;
    min-height: 100% !important;
    .app-xcenter-title {
        margin: 20px auto 0;
        width: 100%;
        min-height: 130px;
        background: url("../assets/xcenter_title.png") no-repeat center top;
        position: relative;
        text-align: center;
    }
}

.main-subtitle {
    font-size: 32px;
    font-weight: bold;
    color: #fefefe;
    text-align: center;
    padding-top: 130px;
    margin: 0;
    line-height: 1;
    /* background-image: -webkit-gradient(linear,0 0,0 bottom,from(rgb(255, 255, 255)),to(rgb(204, 204, 204))); */
    /* -webkit-background-clip: text; */
    /* -webkit-text-fill-color: transparent; */
    text-shadow: 0 4px 8px #063a5b;
    letter-spacing: 7px;
}

.main-subtitle2 {
    font-size: 42px;
    font-weight: 600;
    color: #fefefe;
    text-align: center;
    padding-top: calc(2% + 65px);
    margin: 0;
    line-height: 1;
    /* background-image: -webkit-gradient(linear,0 0,0 bottom,from(rgb(255, 255, 255)),to(rgb(204, 204, 204))); */
    /* -webkit-background-clip: text; */
    /* -webkit-text-fill-color: transparent; */
    text-shadow: 0 4px 8px #063a5b;
    letter-spacing: 7px;
    &:before {
        content: url("../assets/logo2.png");
        display: inline-block;
        vertical-align: middle;
        padding-right: 20px;
    }
}

.el-carousel_item {
    h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        line-height: 300px;
        margin: 0;
    }
    &:nth-child(2n) {
        background-color: #00a65a !important;
    }
    &:nth-child(2n+1) {
        background-color: red;
    }
}

.main-box {
    width: 1055px;
    margin: 20px auto 0;
}

.main-menu-list {
    width: 975px;
    list-style-type: none;
    margin: 20px auto;
    overflow: hidden;
    padding: 0;
    li {
        float: left;
        width: 130px;
        margin: 15px;
        height: 80px;
        cursor: pointer;
        color: #fff;
        text-align: center;
    }
}

.menu-icon {}

.menu-text {
    margin-top: -32px;
    display: block;
}
</style>
<script>
import { mapState } from 'vuex'
import mixin from '../utils/mixin'
import { FETCH_USER_MENU } from '../store/types'
import PageContainer from './common/page-container.vue'
import MainPageHeader from './common/mainheader/main-page-header.vue'
import Carousel from './mainparts/carousel.vue'
import CarouselMenu from './mainparts/carousel-menu.vue'
import { get, save } from '../utils/storage'
export default {
  data() {
    return {
      pageTitle: ''
    }
  },
  mixins: [mixin],
  methods: {
    openPage(data) {
      let path = data.RequestUrl,
        uMenuId = data.MenuId,
        accredit = data.HasAuthority,
        uMenuName = data.MenuName;
      if (accredit === '0') {
        this.$message({
          type: 'error',
          message: '暂无此模块权限！',
          showClose: true
        })
      } else {
        if (path == null || path === '-') {
          this.$message({
            type: 'error',
            message: '此模块无指向地址，无法访问',
            showClose: true
          })
        } else {
          if (path.includes('http://') || path.includes('https://')) {
            window.open(path);
          } else {
            save('permission_' + path.split('/')[1], { id: uMenuId, name: uMenuName }); // 对应菜单权限
            // 打开新标签页
            const url = ['http://', location.host, location.pathname, '#', path].join('');
            window.open(url);
            // 本系统应用 当前浏览器标签打开
            //              this.$router.push(path)
          }
        }
      }
    }
  },
  computed: {
    ...mapState(['users'])
  },
  components: {
    PageContainer,
    MainPageHeader,
    Carousel,
    CarouselMenu
  },
  created() {
    let pageId = this.$route.params.id;
    if (pageId) {
      this.dispatch(FETCH_USER_MENU, {
        CurMenuId: pageId
      }).then(() => {
        this.pageTitle = get(pageId).subMenuName;
        //          remove('permission')
      }).catch(() => {
        this.$router.back();
      })
    }
  }
}
</script>
