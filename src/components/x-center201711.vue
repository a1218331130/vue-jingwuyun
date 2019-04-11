<template>
<page-container>
  <div class="xcenter">
      <!-- 反馈模态窗 -->
     <dialog-form :dialog="editDialog"  @close="editDialog=false"></dialog-form>
      <!-- 版本模态窗 -->
     <version-form :dialog="versionDialog"  @close="versionDialogs"></version-form>
    <div class="xcenter__title">
      <img class="xcenter-slogan" src="/static/img/login/xcanterlogo.png" />
    </div>
    <div class="xcenter__box">
      
    <!-- <div class="xcenter__box__item" >
      <div class="item__image-box" >
        <img class="item__image-box__image" >
        <div class="item__image-box__text">
          app
        </div>
      </div>
    </div>

    <div class="xcenter__box__item" >
      <div class="item__image-box" >
        <img class="item__image-box__image" >
        <div class="item__image-box__text">
          app1
        </div>
      </div>
    </div>

    <div class="xcenter__box__item">
      <div class="item__image-box">
        <img class="item__image-box__image">
        <div class="item__image-box__text">
          app2
        </div>
      </div>
    </div> -->

  <div class="xcenter__box__item" v-for="xMenu in users.userMenu" v-if="xMenu.MenuType === 0&&xMenu.HasAuthority!=='0'">
    <div class="item__image-box" @click="openPage(xMenu.RequestUrl+'/'+xMenu.TreeId, xMenu.HasAuthority,xMenu.TreeId,xMenu.MenuName,xMenu.NameEn,xMenu.NameBm)">
      <img class="item__image-box__image" :src="xMenu.MenuIcon">
      <div class="item__image-box__text">
        {{xMenu.MenuName}}
      </div>
    </div>
  </div>


        <div class="xcenter_earth">
          <img src="/static/img/login/diqiu.png" />
      </div>
      <div class="xcenter_huaih">
        <img src="/static/img/login/hhua.png" />
      </div>
      <div class="xcenter_hunan">
        <img src="/static/img/login/hndt.png" />
      </div>
    </div>
    <div class="bottom-logo-box">
      <img src="../assets/jcxy_logo.png" />
      <!--<img src="../assets/xdh_logo.png"/>-->
    </div>
    <div class="rightContent">
      <div class="connectText" style="background:#ff9c24" @click="question">
        <i class="iconfont icon-pinglu"></i>
         问题反馈
       </div>
       <div class="connectText"  @mouseover="connectFlag=true" @mouseout="connectFlag=false">
        <i class="iconfont icon-tonghua icon"></i>
        联系我们
      </div>
    </div> 
    <div v-show="connectFlag" class="connect">
      <div>&nbsp&nbsp&nbsp联系人:&nbsp&nbsp 王庆</div>
      <div>联系电话:&nbsp&nbsp 13922126059</div>
    </div>
  </div>
</page-container>
</template>
<style lang="scss" scoped>
  .page-container {
    background: none;
    position: relative;
    z-index: 2;
  }

  .rightContent {
    position: absolute;
    top: 50%;
    right: 0;
    height: 300px;
    margin-top: -150px;
  }

  .connectText {
    /* position: absolute; */
    font-size: 15px;
    /* top: 40%; */
    width: 1rem;
    margin-top: 10px;
    padding: 10px 6px;
    line-height: 24px;
    background: #15c1f3;
    border-radius: 3px;
    color: white;
    cursor: pointer;
  }

  .icon {
    font-size: 18px;
  }

  .connect {
    width: 200px;
    position: absolute;
    bottom: 180px;
    right: 80px;
    background-color: yellow;
    overflow: hidden;
    &>img {
      width: 100%;
      height: 100%;
    }
    &>div {
      padding-left: 20px;
      line-height: 24px;
    }
  }

  .xcenter_earth {
    position: absolute;
    transform-origin: bottom center;
    left: 50%;
    top: 0%;
    transform: translateX(-50%) translateY(0%);
    z-index: -1;
  }

  .xcenter_huaih {
    position: absolute;
    transform-origin: bottom center;
    left: 50%;
    top: 201%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 1;
  }

  .xcenter_hunan {
    position: absolute;
    transform-origin: bottom center;
    left: 50%;
    top: 201%;
    transform: translateX(-50%) translateY(-50%);
    z-index: -1;
  }

</style>
<script>
  import { mapState } from 'vuex'
  import PageContainer from './common/page-container.vue'
  import { FETCH_USER_MENU, LOOK_VERSION } from '../store/types'
  import mixin from '../utils/mixin'
  import { save, remove } from '../utils/storage'
  import dialogForm from './question-dialog-form'
  import versionForm from './version-dialog-form'
  export default {
    data() {
      return {
        versionDialog: false,
        connectFlag: false,
        editDialog: false
      }
    },
    mixins: [mixin],
    methods: {
      versionDialogs() {
        this.versionDialog = false;
      },
      question() {
        this.editDialog = true;
      },
      openPage(path, accredit, subMenuId, subMenuName, subMenuNameEn, subMenuNameBm) {
        if (accredit === '0') {
          this.$message({
            type: 'error',
            message: '暂无此中心权限！',
            showClose: true
          })
        } else {
          save(subMenuId, { subMenuName, subMenuNameEn, subMenuNameBm });
          // const url = ['http://', location.host, location.pathname, '#', path].join('')
          // window.open(url)
          this.$router.push(path);
        }
      }
    },
    computed: {
      ...mapState(['users', 'version'])
    },
    components: {
      PageContainer,
      dialogForm,
      versionForm
    },
    created() {
      this.dispatch(LOOK_VERSION).then(() => {
        if (this.version.lookVersion.acceptUserid === null) {
          return;
        }
        this.versionDialog = true;
      })
      let pageId = this.users.UserLogin.UserData.MenuId;
      if (pageId) {
        this.dispatch(FETCH_USER_MENU, {
          CurMenuId: pageId
        }).then(() => {}).catch(() => {
          remove('ngw_user_actions')
          this.$router.push('/login')
        })
      }
      document.title = '智慧警务'
    },
    mounted() {
      console.log(this.users.userMenu, 'users.userMenu')
    },
    updated() {
      let arr = this.users.userMenu.filter(item => {
        return item.MenuType === 0 && item.HasAuthority !== '0'
      })
      if (arr.length === 1) {
        this.openPage(arr[0].RequestUrl + '/' + arr[0].TreeId, arr[0].HasAuthority, arr[0].TreeId, arr[0].MenuName, arr[0].NameEn, arr[0].NameBm)
      }
    }
  }

</script>
