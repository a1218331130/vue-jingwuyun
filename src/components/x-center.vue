<template>
<page-container>
  <div class="app-xcenter-title">
    <img class="xcenter-slogan" src="../assets/4x_slogan.png" />
  </div>
  <div>
    <div class="xcenter-box">
      <ul class="xcenter-list">
        <li v-for="xMenu in users.userMenu" v-if="xMenu.MenuType === 0">
          <div class="tx-img-box" @click="openPage(xMenu.RequestUrl+'/'+xMenu.TreeId, xMenu.HasAuthority,xMenu.TreeId,xMenu.MenuName)">
            <img :src="xMenu.MenuIcon">
          </div>
          <div class="tx-btn" @click="openPage(xMenu.RequestUrl+'/'+xMenu.TreeId, xMenu.HasAuthority,xMenu.TreeId,xMenu.MenuName)">
            {{xMenu.MenuName}}
          </div>
        </li>
      </ul>
    </div>
    <div class="bottom-logo-box">
      <img src="../assets/jcxy_logo.png" />
      <!--<img src="../assets/xdh_logo.png"/>-->
    </div>
  </div>
</page-container>
</template>
<style lang="scss" scoped>
  .page-container {
    background: none;
    background: url('../assets/4X_bgl.jpg') no-repeat center top;
    /*background-size: cover;*/
    position: relative;
    z-index: 2;
  }

</style>
<script>
  import { mapState } from 'vuex'
  import PageContainer from './common/page-container.vue'
  import { FETCH_USER_MENU } from '../store/types'
  import mixin from '../utils/mixin'
  import { save, remove } from '../utils/storage'
  export default {
    data() {
      return {}
    },
    mixins: [mixin],
    methods: {
      openPage(path, accredit, subMenuId, subMenuName) {
        if (accredit === '0') {
          this.$message({
            type: 'error',
            message: '暂无此中心权限！',
            showClose: true
          })
        } else {
          save(subMenuId, { subMenuName });
          // const url = ['http://', location.host, location.pathname, '#', path].join('')
          // window.open(url)
          this.$router.push(path);
        }
      }
    },
    computed: {
      ...mapState(['users'])
    },
    components: {
      PageContainer
    },
    created() {
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
    }
  }

</script>
