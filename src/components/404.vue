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
    <span>4</span>
    <span>0</span>
    <span>4</span>
  </div>
</page-container>
</template>
<style lang="scss" scoped>
.page-container {
    background: url('/static/img/tips_bg.jpg') no-repeat center top;
    background-size: cover;
    min-height: 100% !important;
    height: 100%;
    position: relative;
}
.error-box {
    width: 880px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    span {
        background: url('/static/img/tips_wrap.png') no-repeat center center;
        background-size: cover;
        display: block;
        float: left;
        font-size: 120px;
        color: #3af6fb;
        font-weight: bold;
        text-align: center;
        width: 163px;
        height: 198px;
        line-height: 198px;
        margin: 0 65px;
    }
}
</style>
<script>
import PageContainer from './common/page-container.vue'
export default {
  components: {
    PageContainer
  }
}
</script>
