<template>
<div class="login">
  <div class="wrap" ref="loginBox">
    <div class="pull-out__line"></div>
    <div class="side">
      <img src="/static/img/login/side.png" alt="">
    </div>
    <div class="login-box">
      <div class="pull-line"></div>
      <div class="logo">
        <img src="/static/img/login/logo.png" alt="">
      </div>
      <div class="login-form">
        <img src="/static/img/login/login2.png" alt="">
        <el-tabs v-model="loginToggle" class="login-form__box">
          <el-tab-pane label="密码登录" name="loginPassword">
            <el-form :model="fields" ref="form">
              <el-form-item prop="UserAccount" class="login-form__box__user" label="用户名">
                <el-input placeholder="用户名" :class="{'login-input-text':validateInput.UserAccount}" prop="UserAccount" size="large" ref="account" :autofocus="focus.account" v-model.trim="fields.UserAccount">
                  <template slot="prepend"><i class="iconfont">&#xe602;</i></template>
                </el-input>
              </el-form-item>
              <el-form-item class="login-form__box__pass" prop="UserPassWord" label="密码">
                <el-input type="password" size="large" placeholder="密码" :class="{'login-input-text':validateInput.UserPassWord}" prop="UserPassWord" ref="password" :autofocus="focus.password" v-model.trim="fields.UserPassWord">
                  <template slot="prepend"><i class="iconfont">&#xe609;</i></template>
                </el-input>
              </el-form-item>
              <el-button class="login-form__box__button" @click.prevent="submit" native-type="submit" type="primary" size="large" :loading="loading"></el-button>
            </el-form>
          </el-tab-pane>
          <p class="text-tip" v-if="validateTip">{{validateTip}}</p>
          <el-tab-pane label="证书登录" name="loginKPI">
            <!-- post formData https://10.40.140.21:8443/pkissl.jsp?Redirect=redirectPath&dsIP=10.40.140.22&dsPort=389 -->
            <!-- https://10.146.92.93:4433 -->
            <el-row :gutter="20">
              <el-col :span="24" class="kpi-ico">
                <img src="../assets/kpi_log.png" class="kpi_img" />
              </el-col>
            </el-row>
            <el-row :gutter="20" class="kpi-btn-box">
              <el-col :span="24">
                <el-button @click="kpiLogin" type="warning" size="large" style="width: 100%">PKI登录</el-button>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
  <page-footer ref="footer"></page-footer>
</div>
</template>

<style lang="scss" scoped>
.login {
    .login-form__box__pass input,
    .login-form__box__user input {
        font-size: 25px;
    }
}
.text-tip {
    font-size: 20px;
    color: #ffac36;
    top: 232px;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    border: 1px solid #ffac36;
    padding: 5px 15px;
    width: 351px;

}
</style>
<script>
import loginMixin from '../utils/loginMixin'

// import CryptoJs from 'crypto-js'
export default {
  mixins: [loginMixin]
}
</script>
