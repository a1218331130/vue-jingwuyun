<template>
<el-row class="app-top-bar">
  <div class="topBarbg">
    <img src="../../../assets/topBarbg.jpg" />
  </div>
  <logo></logo>
  <el-col class="app-top-menu">
    <slot name="search">
      <span class="sub-title">{{subTitle}}</span>
    </slot>
  </el-col>
  <el-col class="app-user-info" :span="8">
    <user-info></user-info>
  </el-col>

</el-row>
</template>

<script>
import mixin from '../../../utils/mixin'

import Logo from './logo.vue'
import UserInfo from './user-info.vue'
import { save, get, remove } from '../../../utils/storage'

export default {
  mixins: [mixin],
  components: {
    Logo,
    UserInfo
  },
  data() {
    return {
      subTitle: ''
    }
  },
  computed: {},
  created() {
    if(this.userData.MenuId === '1') {
      save('permission_system', { id: '1', name: '系统管理平台' }); // 跳转到系统管理页面
    }
    let permission = get(this.permission) || { id: this.$route.query.menuId || null, name: this.$route.query.menuName || null }

    if(!permission || !permission.id || !permission.name) permission = null

    if(this.$route.path.indexOf('/controlManage/tacticsApplyDetail/') !== -1) {
      this.subTitle = '精准布控'
      document.title = this.subTitle + '-精准布控'
    } else if(this.$route.path.indexOf('search/result') !== -1) {
      this.subTitle = '通用搜索'
      document.title = this.subTitle + '-智慧警务'
    } else if(this.$route.path.indexOf('mynav') !== -1) {
      this.subTitle = '我的常用'
      document.title = this.subTitle + '-智慧警务'
    } else if(this.$route.path.indexOf('question') !== -1) {
      this.subTitle = '问题反馈'
      document.title = this.subTitle + '-智慧警务'
    } else if(permission !== null || this.$route.path.indexOf('/analysis/') !== -1) {
      this.subTitle = this.$route.path.indexOf('/analysis/') !== -1 ? (this.$route.path.indexOf('/analysis/image') !== -1 ? '图片比对' : this.$route.name) : get(this.permission).name
      document.title = this.subTitle + '-智慧警务'
    } else if(this.$route.path.indexOf('/petition/') !== -1 || this.$route.path.indexOf('/terrorism/') !== -1 || this.$route.path.indexOf('/army/') !== -1 || this.$route.path.indexOf('/drug/') !== -1 || this.$route.path.indexOf('/abnormals/') !==
      -1) {
      this.subTitle = '风险排查管控-智慧警务'
      document.title = this.subTitle + '-智慧警务'
    } else {
      this.$alert('权限校验失败, 即将为您跳转回登录页面.', '温馨提示', {
        confirmButtonText: '确定',
        callback: action => {
          remove('ngw_user_actions')
          this.$router.push('/login')
        }
      });
    }
  }
}
</script>
