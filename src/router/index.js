import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import store from '../store'
import { clone, getReturnPath } from '../utils/util'
import { getLoginUser, saveLoginUser, save } from '../utils/storage'
import { USER_LOGIN, GET_USER_ACTIONS, GET_CURRENT_USER } from '../store/types'
// import { MessageBox } from 'element-ui'
Vue.use(Router)

const router = new Router({
  routes: routes
})

/**
 * URL TOKEN直接登录切换用户
 */
const tokenUserLogin = function (to) {
  if(to.query.token) {
    const head = {
      token: to.query.token
    }
    store.dispatch(GET_CURRENT_USER, {
      body: {
        ...head,
        data: JSON.stringify({
          token: head.token
        })
      }
    }).then(() => {
      let userData = {
        UserData: clone(store.state.users.CurrentUser)
      }
      saveLoginUser(userData);
      store.commit(USER_LOGIN, {
        UserLogin: userData
      })
      let query = JSON.parse(JSON.stringify(to.query))
      delete query.token
      router.push({ path: to.path, query: query })
    }).catch(() => {
      router.push({ name: '登录页' })
    })
  }
}
/**
 *  获取用户拥有的权限
 */
const getUserActions = function (next, token) {
  let resMap = store.getters.userActionMap
  if((resMap instanceof Object && JSON.stringify(resMap) === '{}') || !resMap) {
    const head = {
      c: 0, // 超级权限
      token: token
    }
    store.dispatch(GET_USER_ACTIONS, {
      body: {
        ...head,
        data: JSON.stringify({
          token: head.token
        })
      }
    }).then(() => {
      save('ngw_user_actions', store.getters.userActionMap)
      next()
    }).catch(() => {
      router.push({ name: '登录页' })
    })
  } else {
    next()
  }
}

router.beforeEach((to, from, next) => {
  if(to.path !== '/login' && to.path !== '/maintenance' && to.path !== '/ie/message') {
    if(to.query.token && !to.path.includes('/ie/message')) {
      tokenUserLogin(to)
    } else {
      // 检查本地储存中是否存在登录用户信息
      let user = getLoginUser()
      if(user) {
        // 如果存在登录信息，把本地储存的用户信息写入到状态中，并正常跳转
        store.commit(USER_LOGIN, { UserLogin: user })
        getUserActions(next, user.UserData.UserToken)
      } else {
        // 清空session的用户信息，使socket重新获取token, 获取不到则跳到登录页
        console.log(window.$globalConnect)
        global.$globalConnect && global.$globalConnect.socket.disconnect()
        // sessionRemove(LOGIN_USER_KEY)
        // 否则跳转到登录页（不作任何提示，邓名富 + 潘振法 需求）
        router.push({ name: '登录页', query: { url: encodeURIComponent(getReturnPath(to)) } })
      }
    }
  } else {
    // 清空session的用户信息，使socket重新获取token, 获取不到则跳到登录页
    global.$globalConnect && global.$globalConnect.socket.disconnect()
    // sessionRemove(LOGIN_USER_KEY)
    next()
  }
})

export default router
