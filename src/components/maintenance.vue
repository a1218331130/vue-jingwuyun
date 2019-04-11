<template>
<page-container>
  <!-- <div class="app-404-container">
      <img src="../assets/404.png" alt="">
      <p>:( 很抱歉，您所访问的页面不存在！</p>
      <div>
        <el-button @click="$router.replace('/')">返回首页</el-button>
      </div>
    </div> -->
  <div class="error-box">
    <div class="error-box__title">
      系统维护
    </div>
    <div class="error-box__appellation">
      尊敬的客户：
    </div>
    <div class="error-box__box">
      <div class="error-box__content" v-html="msg">
        <!-- 10月19日 21:30—10月20日 6:00 进行系统维护，<br/> 届时将无法正常访问网站。
        <br/> 给您带来不便非常抱歉！
        <br/> 如有问题，请联系客服中心
        <span class="heightlight">4008 820 542</span> -->
      </div>
    </div>
  </div>
</page-container>
</template>
<style lang="scss" scoped>
.page-container {
    background: url('/static/img/wh_bg.jpg') no-repeat center top;
    background-size: cover;
    min-height: 100% !important;
    height: 100%;
    position: relative;
}
.error-box {
    text-align: center;
    width: 1115px;
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    &__title {
        font-size: 96px;
        color: #aafdff;
        margin-bottom: 70px;
    }
    &__appellation {
        font-size: 34px;
        text-align: left;
        color: #aafdff;
        padding: 0 20px;
        margin-bottom: 30px;
    }
    &__box {
        background: url('/static/img/wh_box.png') no-repeat center center;
        width: 1104px;
        height: 320px;
    }
    &__content {
        font-size: 32px;
        color: #ffe013;
        line-height: 56px;
        padding: 40px 85px;
        p {
            margin: 0;
        }
    }
}
.heightlight {
    color: #33fff3;
    margin: 0 30px;
}
</style>
<script>
import PageContainer from './common/page-container.vue'
export default {
  components: {
    PageContainer
  },
  computed: {
    msg() {
      return this.$route.params.msg || '暂无提示信息'
    }
  }
}
</script>
