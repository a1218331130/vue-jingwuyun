import { mapState } from 'vuex'
import { USER_LOGIN, GET_CURRENT_USER } from '../store/types'
import mixin from '../utils/mixin'
import { clone } from '../utils/util'

import PageContainer from '../components/common/page-container.vue'
import PageFooter from '../components/common/page-footer.vue'
import { RSA_KEY, LOGIN_HOST } from '../config'
import { save, saveLoginUser, removeSiteInfo, getLoginUser } from './storage'
import { addClass } from './util'

// import CryptoJs from 'crypto-js'
export default {
  mixins: [mixin],
  components: {
    PageContainer,
    PageFooter
  },
  data() {
    return {
      loading: false,
      resUrl: '',
      showLogin: true,
      siteTitle: [],
      loginToggle: 'loginPassword',
      resizeLoginBox: false,
      fields: {
        UserAccount: '',
        UserPassWord: ''
      },
      focus: {
        account: true,
        password: false
      },
      validateInput: {
        UserAccount: false,
        UserPassWord: false
      },
      validateTip: ''
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.users.CurrentUser,
      loginUser: state => state.users.UserLogin
    })
  },
  watch: {
    loginUser(val) {},
    'fields.UserAccount' (val) {
      this.validateInput.UserAccount = !val;
      this.validateTip = val ? '' : '请输入用户名！'
    },
    'fields.UserPassWord' (val) {
      this.validateInput.UserPassWord = !val;
      this.validateTip = val ? '' : '请输入用户密码！'
    }
  },
  methods: {
    showMessage(msg, type = 'error') {
      this.$message({
        type: type,
        message: msg,
        showClose: true
      })
    },
    doLogin() {
      this.loading = true
      window.rspk = RSA_KEY;
      this.$.ajax({
        type: 'POST',
        url: LOGIN_HOST + '/login/UserLogin',
        data: this.fields,
        dataType: 'json'
      }).then(res => {
        this.loading = false
        if(res.Status === 0) {
          //            this.showMessage(res.Data)
          this.validateTip = res.Data;
        } else {
          this.success(res.Data)
        }
      }).fail(res => {
        this.loading = false
        this.showMessage('请求错误')
      })
    },
    success(data) {
      let userData = data ? data.UserData : null
      // todo: 把用户信息写入离线存储
      saveLoginUser(data);
      this.$store.commit(USER_LOGIN, {
        UserLogin: data
      })
      console.log(getLoginUser())
      //
      if(userData !== null) {
        if(userData.mainMenu) save(userData.mainMenu.treeId, '')
        addClass(this.$refs.loginBox, 'pull-out')
        setTimeout(() => {
          if(this.$route.query.c === '1') {
            // 临时测试直接跳风控
            save('permission_control', { id: '5C4F5B1CD9F0A3D8E0533C5C920A971A', name: '风险排查管控系统', single: true });
            save('permission_logincat', { single: true })
            this.$router.push('/control')
          } else {
            this.$router.push((this.resUrl.indexOf('menuId') !== -1) ? this.resUrl : null || userData.JumpUrl)
          }
        }, 1500)
      }
    },
    submit() {
      if(this.fields.UserAccount === '') {
        //          this.showMessage('请输入用户名！');
        this.validateTip = '请输入用户名！';
        this.validateInput.UserAccount = true;
        this.validateInput.UserPassWord = false;
        this.$refs.account.$refs.input.focus();
      } else {
        //          this.validateInput.UserAccount = false;
        if(this.fields.UserPassWord === '') {
          //            this.showMessage('请输入用户密码！')
          this.validateInput.UserPassWord = true;
          this.validateTip = '请输入用户密码！';
          this.$refs.password.$refs.input.focus();
        } else {
          this.validateInput.UserPassWord = false;
          this.validateTip = '';
          this.doLogin()
        }
      }
    },
    kpiLogin() {
      let callbackUrl = encodeURIComponent(window.location.href)
      window.location.href = `${this.siteInfo.KPI_LOGIN}?url=${callbackUrl}`
    },
    fixedTitle() {
      let len = this.siteInfo.Title.length
      if(len % 2 === 0 && len === 4) {
        this.siteTitle = []
        this.siteTitle.push(this.siteInfo.Title.substr(0, len / 2))
        this.siteTitle.push(this.siteInfo.Title.substr(len / 2, len))
      } else {
        this.siteTitle = ['智慧', '警务']
      }
    },
    /**
     * [pkiEvent PKI回调]
     */
    pkiEvent() {
      if(this.$route.query.token === '' && this.$route.query.msg) {
        this.loginToggle = 'loginKPI'
        this.validateTip = this.$route.query.msg
      } else if(this.$route.query.token) {
        let temp = {
          UserLogin: {
            UserData: {
              UserToken: this.$route.query.token
            }
          }
        }

        saveLoginUser(temp);
        this.$store.commit(USER_LOGIN, temp)

        this.loginToggle = 'loginKPI'
        this.validateTip = '加载中...'

        this.dispatch(GET_CURRENT_USER, {}, null, false, false, this.$route.query.token).then(d => {
          this.success({
            UserData: clone(this.currentUser)
          })
        })
      }
    }
  },
  directives: {
    focus: {
      inserted: (el) => {
        el.focus()
      }
    }
  },
  created() {},
  mounted() {
    document.title = '加载中...'

    // 回跳链接
    this.resUrl = decodeURIComponent(this.$route.query.url || '')

    // 清除网站配置
    removeSiteInfo()
    // 获取网站配置
    this.initSiteInfo().then(siteInfo => {
      if(siteInfo.IS_SYSTEM_MAINTENANCE === '1') {
        // 维护中
        document.title = '维护中'
        this.$router.push({ name: '维护页', params: { msg: siteInfo.SYSTEM_MAINTENANCE_MSG } })
      } else {
        document.title = siteInfo.Title
        this.fixedTitle()
        this.$nextTick(() => {
          this.$refs.footer.siteInfo = siteInfo
        })
        this.pkiEvent()
      }
    })

    // 高度修整
    if(document.body.offsetHeight < 920) {
      this.resizeLoginBox = true;
    } else {
      this.resizeLoginBox = false;
    }
    window.addEventListener('resize', (e) => {
      if(document.body.offsetHeight < 920) {
        this.resizeLoginBox = true;
      } else {
        this.resizeLoginBox = false;
      }
    })
  }
}
