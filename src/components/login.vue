<template>
<page-container>
  <!-- <div :class="{'app-login-title':true,'app-login-title--min':resizeLoginBox}">
    <div class="app-login-title__title"></div>
    <div class="app-login-title__text">湖南省怀化市公安局大数据警务云平台</div>
  </div> -->
  <el-card :class="{'app-login':true,'app-login-min':resizeLoginBox}">
    <div v-if="siteInfo" class="app-login-title__text">
      {{siteInfo.SubTitle}}
      <div class="app-login__icon-box">
        <div class="app-login__icon-box__bg"></div>
        <div class="app-login__icon-box__icon">
          <div class="app-login__icon-box__icon__text" :data-text="siteTitle[0]">{{siteTitle[0]}}</div>
          <div class="app-login__icon-box__icon__text" :data-text="siteTitle[1]">{{siteTitle[1]}}</div>
        </div>
      </div>
    </div>
    <div class="login-input-box">
      <el-tabs v-model="loginToggle" @tab-click="loginWayClick">
        <el-tab-pane label="密码登录" name="loginPassword">
          <el-form :model="fields" ref="form">
            <el-form-item prop="UserAccount">
              <el-input placeholder="用户名" :class="{'login-input-text':validateInput.UserAccount}" prop="UserAccount" size="large" ref="account" :autofocus="focus.account" v-model.trim="fields.UserAccount">
                <template slot="prepend"><i class="iconfont">&#xe602;</i></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="UserPassWord">
              <el-input type="password" size="large" placeholder="密码" :class="{'login-input-text':validateInput.UserPassWord}" prop="UserPassWord" ref="password" :autofocus="focus.password" v-model.trim="fields.UserPassWord">
                <template slot="prepend"><i class="iconfont">&#xe609;</i></template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-button @click.prevent="submit" native-type="submit" type="primary" size="large" :loading="loading" style="width: 100%">登录
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <p class="text-tip" v-if="validateTip">{{validateTip}}</p>
          <!--<el-alert v-if="validateTip" :title="validateTip" type="error"></el-alert>-->

        </el-tab-pane>
        <el-tab-pane label="证书登录">
          <el-row :gutter="20">
            <el-col :span="24" class="kpi-ico">
              <img src="../assets/kpi_log.png" />
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
    <page-footer ref="footer"></page-footer>
  </el-card>

</page-container>
</template>

<style lang="scss" scoped>
.page-container {
    background: url('../assets/login_bg.jpg') no-repeat center top;
}

.kpi-btn-box {
    padding: 10px 0;
    .el-button {
        color: #fff;
    }
}

.kpi-ico {
    text-align: center;
}

.text-tip {
    font-size: 14px;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
    border: 1px solid #fff;
    padding-left: 5px;
}
</style>

<script>
import loginMixin from '../utils/loginMixin'

// import CryptoJs from 'crypto-js'
export default {
  mixins: [loginMixin]
}
</script>
