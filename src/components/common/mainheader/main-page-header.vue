<template>
<div class="header-box">
  <!--通告中心弹窗-->
  <notification :dialog="dialogVisible" @close="dialogVisible=false"></notification>
  <div class="header-slogan" >
    <div class="clickImg" @click="goHome"></div>
      <img src="../../../assets/t_left_slogan.png" />
  </div>
  <!-- 用户信息 -->
  <user-info></user-info>

</div>
</template>
<style lang="scss" scoped>
  .header-box {
    width: 100%;
    height: 60px; // overflow: hidden;
    background-color: rgba(0, 0, 0, 0.26);
    .header-slogan {
      .clickImg {
        position: absolute;
        height: 50px;
        width: 50px;
        top: 10px;
        left: 16px;
      }
      float: left;
      margin-left: 20px;
      img {
        margin-top: 12.5px;
      }
    }
  }

</style>
<script>
  import Notification from '../topbar/notification.vue'
  import userInfo from '../topbar/user-info.vue'
  import mixin from '../../../utils/mixin'
  export default {
    mixins: [mixin],
    data() {
      return {
        dialogVisible: false
      }
    },
    components: {
      notification: Notification,
      userInfo
    },
    computed: {
      indexUrl() {
        let res, userUrl = this.userData.JumpUrl
        if (userUrl === 'DLRK_4X') {
          res = '/xCenter'
        } else {
          if (userUrl.includes('http://') || userUrl.includes('https://')) {
            res = userUrl;
          } else {
            res = userUrl // + '/' + this.userData.MenuId
          }
        }
        return res
      }
    },
    methods: {
      showDialog() {
        this.dialogVisible = true;
      },
      goHome() {
        this.$router.push(this.indexUrl)
      }
    },
    created() {}
  }

</script>
