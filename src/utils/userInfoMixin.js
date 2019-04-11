import { getLoginUser } from './storage'
export default {
  data() {
    return {}
  },
  computed: {
    userData() {
      let loginUser = getLoginUser(),
        res = {
          UserToken: ''
        }
      if (!loginUser) {
        if (this.$route.path !== '/login') this.$router.push('/login')
      } else {
        res = loginUser.UserData
      }
      return res
    },
    userOrgInfo() {
      return this.$store.getters.userOrgInfo
    }
  }
}
