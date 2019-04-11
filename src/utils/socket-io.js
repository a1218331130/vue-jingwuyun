/**
 * 这是一个WebSocket接受服务器推送消息的Mixin
 */
import { SOCKET_SERVER } from '../config'
import { getLoginUser } from './storage'

export default {
  computed: {
    // 会造成用户数据缓存
    userId() {
      let loginUser = getLoginUser(),
        res = null
      if(!loginUser) {
        if(this.$route.path !== '/login') this.$router.push('/login')
      } else {
        res = loginUser.UserData.UserId
      }
      return res
    },
    token() {
      let loginUser = getLoginUser(),
        res = null
      if(!loginUser) {
        if(this.$route.path !== '/login') this.$router.push('/login')
      } else {
        res = loginUser.UserData.UserToken
      }
      return res
    }
  },
  methods: {
    getUserId() {
      let loginUser = getLoginUser(),
        res = null
      if(!loginUser) {
        if(this.$route.path !== '/login') this.$router.push('/login')
      } else {
        res = loginUser.UserData.UserId
      }
      return res
    },
    getUserToken() {
      let loginUser = getLoginUser(),
        res = null
      if(!loginUser) {
        if(this.$route.path !== '/login') this.$router.push('/login')
      } else {
        res = loginUser.UserData.UserToken
      }
      return res
    },
    socketConnected() {
      // console.log('socket connected')
    },
    initSocketIo() {
      // 连接建立成功时
      this.$connect.on('connect', () => {
        console.log('socket.io 连接成功', this.$connect.socket.sessionid)
        // 先服务器发送消息
        this.$connect.emit('register', {
          userId: this.getUserId(),
          token: this.getUserToken()
        })
        this.$store.commit('socketConnected', true);
        // 回调
        this.socketConnected()
      })

      // 连接断开时
      this.$connect.on('disconnect', () => {
        // this.$message({
        //   type: 'error',
        //   message: '连接已断开',
        //   showClose: true
        // })
        console.log('socket.io 连接已断开')
      })
    },
    setConnect() {
      if(!this.$connect) {
        this.$connect = 'connecting'
        // 测试socket连接延时的情况
        // setTimeout(() => {
        //   global.$globalConnect = this.$connect = this.$io.connect(SOCKET_SERVER)
        //   this.userId && this.initSocketIo()
        // }, 300)
        global.$globalConnect = this.$connect = this.$io.connect(SOCKET_SERVER)
        this.userId && this.initSocketIo()
      } else if((this.$connect !== 'connecting' && this.$connect.socket.connected === false)) {
        if(this.$route.path !== '/login' && this.$route.path !== '/xCenter') {
          global.$globalConnect.socket.reconnect()
          // this.$connect = 'connecting'
          // global.$globalConnect = this.$connect = this.$io.connect(SOCKET_SERVER)
          // this.userId && this.initSocketIo()
        }
      } else if(this.$connect === 'connecting') {
        console.log('socket.io 连接中')
      } else {
        // console.log('socket.io 已有连接')
      }
    }
  },
  mounted() {
    this.setConnect()
  },
  created() {
    // 建立连接
    this.setConnect()

    // 收到服务器消息消息
    // socket.on('RefreshMessage', (data) => {
    //   this.$message({
    //     type: 'success',
    //     message: '收到服务器推送的消息',
    //     showClose: true
    //   })
    //   console.log('socket.io 收到服务器推送的消息', data)
    // })
  }
}
