<template>
  <page-container>
    <main-page-header class="top-header_main"></main-page-header>
    <div class="app-xcenter-title">
      <p class="main-subtitle">{{pageTitle}}</p>
    </div>
    <div class="main-box">
      <carousel-menu v-show="loading===false" @call:open="openPage" :fixed="true"></carousel-menu>
      <loader-bar :action="loading"></loader-bar>
    </div>
  </page-container>
</template>
<style lang="scss" scoped>
  .page-container {
    background: url('../assets/main_bg2.jpg') no-repeat center top;
    background-size: cover;
    min-height: 100% !important;
    height: 100%;
    position: relative;
  }

  .main-subtitle {
    font-size: 38px;
    font-weight: 600;
    transform:scale(1.3);
    color: #fefefe;
    text-align: center;
    margin: 0;
    margin-top: 15px;
    line-height: 1;
    /* background-image: -webkit-gradient(linear,0 0,0 bottom,from(rgb(255, 255, 255)),to(rgb(204, 204, 204))); */
    /* -webkit-background-clip: text; */
    /* -webkit-text-fill-color: transparent; */
    text-shadow: 0 4px 8px #063a5b;
    letter-spacing: 7px;
    &:before {
      content: '';
      background-image: url("../assets/logo2.png");
      background-size: 75px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 15px;
      width: 75px;
      height: 75px;
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
    width: 1024px;
    height: 500px;
    position: absolute;
    top: calc(50%);
    left: 50%;
    transform: translateX(-50%) translateY(calc(60px - 50%)) scale(1.3);
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

  .menu-icon {
  }

  .menu-text {
    margin-top: -32px;
    display: block;
  }
  @media screen and (max-width: 1366px) {
    .main-box {
      top: calc(50%);
      transform: translateX(-50%) translateY(calc(60px - 50%)) scale(.9);
    }
    .main-subtitle{
      transform:scale(.9);
    }
  }
  @media screen and (max-width: 1280px) {
    .main-box {
      top: calc(46%);
      transform: translateX(-50%) translateY(calc(60px - 50%)) scale(.8);
    }
    .main-subtitle{
      transform:scale(.8);
    }
  }

</style>
<script>
  import {mapState} from 'vuex'
  import mixin from '../utils/mixin'
  import {FETCH_USER_MENU, FETCH_USER_MENU_LIST} from '../store/types'
  import PageContainer from './common/page-container.vue'
  import MainPageHeader from './common/mainheader/main-page-header.vue'
  import CarouselMenu from './mainparts/carousel-menu2.vue'
  import loaderBar from '../widgets/loader/loader-bar.vue'
  import {get, save} from '../utils/storage'
  // import socketIo from '../utils/socket-io'

  export default {
    mixins: [mixin], // , socketIo
    components: {
      PageContainer,
      MainPageHeader,
      CarouselMenu,
      'loader-bar': loaderBar
    },
    data() {
      return {
        pageTitle: ''
      }
    },
    computed: {
      ...mapState(['users'])
    },
    methods: {
      init() {
        let pageId = this.$route.params.id // '915602E6FF334272A38F29AB979D6C9C' // 写死系统功能ID

        document.title = this.pageTitle + '-智慧警务'
        this.dispatch(FETCH_USER_MENU, {
          CurMenuId: pageId
        }).then(() => {
          //          remove('permission')
          this.loading = false
        }).catch(() => {
          this.$router.back();
        })
      },
      openPage(data) {
        let path = data.RequestUrl,
          uMenuId = data.TreeId,
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
            if (path.includes('http://') || path.includes('https://') || path.includes('FDBL://')) {
              if (data.OpenType === '3') {
                window.open(path);
              } else {
                window.location.href = path
              }
            } else {
              let targetUrl = path.indexOf('?') ? path.split('?')[0] : path
              save('permission_' + targetUrl.split('/')[1], {id: uMenuId, name: uMenuName}); // 对应菜单权限
              // const url = ['http://', location.host, location.pathname, '#', path].join('');
              // window.open(url);
              if (data.OpenType === '3') {
                this.jumpTo(path, true)
              } else {
                this.$router.push(path)
              }
            }
          }
        }
      }
    },
    created() {
      let subMenu = get(this.$route.params.id)
      if (subMenu !== null) {
        this.pageTitle = subMenu.subMenuName
        this.init()
      } else {
        this.dispatch(FETCH_USER_MENU_LIST).then(() => {
          this.pageTitle = this.users.userMenuList[0].SubMenus.find(d => d.MenuType === 0 && d.MenuId === this.$route.params.id + '_1').MenuName
          this.init()
        })
      }
    }
  }
</script>
