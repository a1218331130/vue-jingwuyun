<template>
<ul class="user-operation">
  <li @click="goHome" v-if="toolShow.back && isSingleMode===false">
    <i class="iconfont icon-home"></i><br/>
    <span>首页</span>
  </li>
  <li class="person-count" v-if="$route.path.includes('/mainIndex/')">
    <!-- <el-badge :value="onlic > 99 ? 99 : onlic" :max="99" class="el-badge-item"> -->
    <i class="iconfont icon-renqun" style="vertical-align:middle"></i>
    <span class="onlicmun">
      <span class="textd">在线人数</span>：{{onlic}}人</span>

    <!-- </el-badge> -->
  </li>
  <li v-if="hasHistory===true && isSingleMode===false" @click="goBack">
    <i class="iconfont icon-undo"></i><br/>
    <span>返回</span>
  </li>
  <li v-if="hasHistory===true && isSingleMode===false" @click="goFankui">
    <i class="iconfont icon-pinglu"></i><br/>
    <span>反馈</span>
  </li>
  <li @click="showDialog" v-if="toolShow.message && isSingleMode===false">
    <el-badge :value="systemCount > 99 ? 99 : systemCount" :max="99" class="el-badge-item">
      <i class="iconfont">&#xe64b;</i><br/>
      <span>消息</span>
    </el-badge>
  </li>
  <li @click="userSetting" v-if="toolShow.memo">
    <el-badge :value="0 > 99 ? 99 : 0" :max="99" class="el-badge-item">
      <i class="iconfont">&#xe651;</i><br/>
      <span>备忘</span>
    </el-badge>
  </li>
  <!-- <li v-if="toolShow.exchange">
        <a :href="jwybbsPath" target="_blank" style="color:#ffffff" onfocus="this.blur()">
            <i class="iconfont icon-pinglu"></i><br/>
            <span>交流</span>
          </a>
      </li>
      <li @click="adminSystem" v-if="toolShow.set">
        <el-badge :is-dot="false" class="el-badge-item">
          <i class="iconfont">&#xe6c8;</i><br/>
          <span>设置</span>
        </el-badge>
      </li> -->
  <!-- 帮助提示 -->
  <el-popover ref="popover4" placement="bottom-start" trigger="hover">
    <!-- <el-row>
      <el-col :span="24">点击下载操作文件</el-col>
    </el-row> -->
    <el-row>
      <el-col :span="24">温馨提示: 如果操作文件内容无法正常显示</el-col>
    </el-row>
    <el-row>
      <el-col :span="24">请按照<a href="/static/help.html" target="_blank"> 操作教程 </a>进行解决</el-col>
    </el-row>
  </el-popover>
  <li @click="help" v-popover:popover4>
    <i class="iconfont">&#xe6de;</i><br/>
    <span>帮助</span>
    <form ref="docDownForm" action="/static/湖南怀化警务云系统用户手册.chm" method="get" style="display:none;"></form>
  </li>
  <li @click="logOut" v-if="toolShow.logOut || isSingleMode===true">
    <i class="iconfont">&#xe69f;</i><br/>
    <span>退出</span>
  </li>
  <li v-if="toolShow.panel">
    <i class="iconfont icon-card-list"></i><br/>
    <span>面板</span>
  </li>
  <detail ref="det" :idarr="idArrs" :dialog="readPageDialog" :id="detailId" :noticeType="activeIndex" @call:readed="readed" @call:close="closeDetail"></detail>
</ul>
</template>

<style scoped lang='scss'>
  .user-operation {
    float: left;
    list-style-type: none;
    margin: 0;
    padding: 0;
    height: 60px;
    >li {
      float: left;
      color: #fff;
      /*margin-left: 20px;*/
      text-align: center;
      cursor: pointer;
      padding: 7px 15px;
      i.iconfont {
        font-size: 22px;
      }
      .dropDownBox {
        font-size: 22px;
        color: #fff;
      }
      &:hover {
        background: #012e5d;
      }
      &.person-count {
        position: fixed;
        top: 75px;
        right: 23px;
        border-radius: 14px;
        background-color: rgba(94, 174, 213, .1);
        padding: 10px;
        .textd {
          display: none;
        }
        &:hover {
          background-color: rgba(94, 174, 213, .2);
          .textd {
            display: inline-block;
          }
          .onlicmun {
            display: inline-block;
          }
        }
      }
    }
    .el-badge__content {
      border: none !important;
    }
  }

</style>

<script>
  import mixin from '../../../utils/mixin'
  import { mapState } from 'vuex'
  import { save, get } from '../../../utils/storage'
  import { JWYBBS_PATH } from '../../../config.js'
  import detail from './notification/notice-detail'
  import {
    GET_TOTAL_UNREAD_COUNT,
    GET_ONLINE_COUNT
  } from '../../../store/types'

  export default {
    mixins: [mixin],
    components: {
      detail
    },
    data() {
      return {
        index: 0,
        idArrs: [],
        readPageDialog: false,
        detailId: '',
        activeIndex: '0',
        systemCount: 0,
        toolShow: {}, // 是否显示对应的标签
        jwybbsPath: ''
      }
    },
    props: {},
    computed: {
      isSingleMode() {
        let res = false,
          mode = get('permission_logincat')
        if (mode && mode.single === true) {
          res = true
        }
        return res
      },
      hasHistory() {
        return window.history.length > 1 // this.$route.matched.length > 1
      },
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
      },
      ...mapState({
        userMenus: state => state.users.userMenu,
        unReadList: state => state.systemNew.GetTotalUnreadCount,
        onlic: state => state.baseData.GetOnlineCount
      }),
      ...mapState(['socketConnect'])

    },
    methods: {
      GetOnlineCount() {
        this.dispatch(GET_ONLINE_COUNT).then(n => {
          console.log(this.onlic)
        })
      },
      initToolState() {
        // 初始化工具标签状态
        this.toolShow = { // 是否显示对应的标签
          back: true, // 返回
          message: false, // 消息
          memo: false, // 备忘录
          exchange: true, // 交流
          set: true, // 设置
          logOut: true, // 退出
          panel: false // 面板
        }
      },
      logOut() {
        this.logout();
      },
      // next(index) {
      //   alert(index)
      //   let v = index + 1
      //   if(v < this.idArrs.length) {
      //     this.detailId = this.idArrs[v]
      //     console.log(this.detailId)
      //     this.$refs.det.initDialog()
      //   } else {
      //     this.readPageDialog = false
      //   }
      // },
      /**
       * 查询相关消息数据条数
       */
      getUnredCount() {
        this.dispatch(GET_TOTAL_UNREAD_COUNT).then(n => {
          this.updateUnreadCount()
          if (this.unReadList && this.unReadList.DialogMessages.length > 0) {
            // this.unReadList.DialogMessages.map(d => {
            //   this.idArrs.push(d.KeyId)
            // })
            let unReadList = this.unReadList.DialogMessages
            Notification.requestPermission(function(perm) {
              if (perm === 'granted') {
                new Notification('您有一条非常紧急的通知！', {
                  dir: 'auto',
                  lang: 'hi',
                  tag: 'testTag',
                  icon: '/static/img/logo2.f1707b5.png',
                  body: unReadList[0].Title
                })
                console.log('12123123123')
              }
            })
            // this.detailId = this.idArrs[0]
            // console.log(this.idArrs)
            // this.readPageDialog = true
          }
        })
      },
      updateUnreadCount() {
        this.systemCount = 0
        if (this.unReadList && this.unReadList.DataCounts.length > 0) {
          this.unReadList.DataCounts.forEach(ur => {
            if (ur.TotalCount) {
              this.systemCount += ur.TotalCount // 计算消息总和
            }
          })
        }
      },
      adminSystem() {
        save('permission_system', { id: '1', name: '系统管理平台' }); // 跳转到系统管理页面
        this.$router.push('/system')
      },
      userSetting() {
        this.$message('此处正在施工中……')
      },
      showDialog() {
        this.getUnredCount()
        this.$emit('showDialog')
      },
      goBack() {
        this.$router.go(-1)
      },
      goHome() {
        // 返回到主页
        this.$router.push(this.indexUrl)
        // window.location.href = '/#' + this.indexUrl
      },
      goFankui() {
        // this.$router.push('/question')
        window.open('/#/question', '_blank');
      },
      closeDetail() {
        this.readPageDialog = false
        this.detailId = ''
      },
      readed() {
        // this.getUnredCount()
        // this.$emit('call:readed')
      },
      help() {
        if (this.$refs.docDownForm) this.$refs.docDownForm.submit()
      },
      setSocketListener(fn) {
        // WebSocket 消息条数更新
        if (this.socketConnect.socketConnected) {
          fn();
        } else {
          setTimeout(() => {
            this.setSocketListener(fn);
          }, 100);
        }
      }
    },
    watch: {},
    mounted() {},
    created() {
      console.log(this.$route.path)
      // 对右侧顶部入口相应页面显示限制
      this.initToolState()
      this.GetOnlineCount()
      let thisPath = this.$route.fullPath
      if (thisPath.indexOf('/system') === 0) {
        this.toolShow.logOut = true
        this.toolShow.set = false
      } else if (thisPath.indexOf('/mainIndex') === -1) {
        this.toolShow.logOut = false
        this.toolShow.set = false
        this.toolShow.message = true
      }
      // 论坛地址
      this.jwybbsPath = JWYBBS_PATH + '?username=' + this.userData.LoginName;
      // 初始化未读消息条数数据
      this.getUnredCount()
      this.setSocketListener(() => {
        this.$connect.on('RefreshMessage', (data) => {
          this.getUnredCount();
        })
      })
      // 协同提醒
      // this.$connect.on('RefreshMessage', (data) => {
      //     this.getUnredCount()
      //   })
    }
  }

</script>
