<template>
<page-container>
  <main-page-header class="top-header_main"></main-page-header>
  <div class="main-box">
    <div class="main-box__title">
      <div class="main-box__title__ch">
        {{pageTitle}}
        <span class="main-box__title__en">{{pageTitleEn}}</span>
      </div>
      <div class="centerTitle1" v-if="titleIndex === 3 || titleIndex === 4"></div>
      <div class="centerTitle" v-if="titleIndex === 0">大数据实战应用</div>
      <div class="centerTitle" v-if="titleIndex === 1">中心常用系统</div>
      <div class="centerTitle" v-if="titleIndex === 2">我的常用系统</div>
    </div>
    <el-carousel ref="carousel" v-if="users.userMenu&&firstLoading===false" class="el-carousel-menu2 arrowRadio" :autoplay="false" arrow="always" trigger="click" @change="carouselChange">
      <!-- 入口菜单 -->
      <el-carousel-item v-for="(cat, ci) in [menuList[0]]" :key="ci">
        <div class="main-box__menus">
          <!-- <div class="centerTitle">大数据实战应用</div> -->
          <!-- <div class="main-box__menus__title">{{cat.MenuName}}</div> -->
          <div :class="{'main-box__menus__menu':true, 'disabled':item.Sfqy==='0'}" v-for="(item, i) in cat.SubMenus.filter(d=>d.IsHide==='0')" :key="i" @click="openPage(item)">
            <img class="main-box__menus__menu__icon" :src="item.MenuIcon === null ?'/static/img/default02.png':item.MenuIcon" />
            <div class="main-box__menus__menu__title">{{item.MenuName}}</div>
          </div>
        </div>
      </el-carousel-item>
      <el-carousel-item v-if="menuList[1]" v-for="(cat, ci) in [menuList[1]]" :key="ci">
        <div class="main-box__menus">
          <!-- <div class="centerTitle">中心常用系统</div> -->
          <div :class="{'main-box__menus__menu':true, 'disabled':item.Sfqy==='0'}" v-for="(item, i) in cat.SubMenus.filter(d=>d.IsHide==='0')" :key="i" @click="openPage(item)">
            <img class="main-box__menus__menu__icon" :src="item.MenuIcon === null ?'/static/img/default02.png':item.MenuIcon" />
            <div class="main-box__menus__menu__title">{{item.MenuName}}</div>
          </div>
        </div>
      </el-carousel-item>
      <div>
        <!-- 常用工具 -->
      <el-carousel-item v-if="firstLoading===false">
        <div class="main-box__menus">
          <!-- <div class="centerTitle">我的常用系统</div> -->
          <div class="main-box__menus__menu" v-for="(item, i) in enteryList " :title="item.name" :key="i" @click="openNavTool(item)">
            <img class="main-box__menus__menu__icon" :src="item.icon === null ?'/static/img/default02.png':item.icon" />
            <div class="main-box__menus__menu__title">{{item.name}}</div>
          </div>
        </div>
      </el-carousel-item>
      <el-carousel-item v-else></el-carousel-item> 
      </div>
      <div>
        <!-- 大屏 -->
        <el-carousel-item v-if="firstLoading===false && bigScreen && bigScreen.SubMenus">
          <div v-if="bigScreen.SubMenus.length > 0" class="main-box__menus big-screen">
            <!-- <div class="main-box__menus__title">{{bigScreen.MenuName}}</div> -->
            <div :class="{'main-box__menus__menu':true, 'disabled':item.Sfqy==='0'}" v-for="(item, i) in bigScreen.SubMenus.filter(d=>d.IsHide==='0') " :key="i" @click="openPage(item)">
              <img class="main-box__menus__menu__icon" :src="item.MenuIcon === null ?'/static/img/default02.png':item.MenuIcon" />
              <div class="main-box__menus__menu__title">{{item.MenuName}}</div>
            </div>
          </div>
        </el-carousel-item>
        <el-carousel-item v-else></el-carousel-item>
      </div>
        <!-- 消息列表 -->
      <el-carousel-item>
        <div v-show="hideMsg===false && commAppLoad===false" class="main-box__menus big-screen">
          <el-tabs v-model="activeName" @tab-click="listTabClick" class="main-box__menus__xxlist">
            <span class="morebtn" @click="showDialog = true" v-if="activeName!=='4'">+更多</span>
            <span class="morebtn" @click="dialogVisible = true" v-if="activeName==='4'">+更多</span>
            <el-tab-pane :name="item.name" v-for='(item, index) in tabList ' :key='index'>
              <span slot="label">
                <el-badge :value="item.count || 0" :max="99" class="itemcount" :hidden="item.count==='0'"><i style="margin-right:3px;" class="icon iconfont" :class="item.icon"></i>{{item.laber}}</el-badge>
              </span>
              <ul class="menus__xxlistul">
                <li v-for="(items, i) in xxlist" :key="i" @click="showDetail(items)" v-show="noticeType!=='4'">
                  {{i + 1}}. {{noticeType !=='0' ? items.xxnr : items.bt}}
                  <span style="float:right;position: relative; ">
                    <i v-if="items.isread === '0'" style="  position: absolute;    width: 5px;  height: 5px;  background: #f00;  top: 50%;  left: -10px;  border-radius: 50%;  transform: translateY(-50%);"></i>
                    {{noticeType !=='0' ?items.fjsj:items.cjsj}}
                  </span>
                </li>
                <!-- 警情消息 -->
                <li v-for="(items, i) in jqList" :key="i" @click="showWarnNew(items)" v-show="noticeType==='4'" style="position: relative;">
                  <i v-if="items.STATUS === '0'" style="position: absolute;width: 5px;height: 5px;background: #f00;top: 50%;left: -10px;border-radius: 50%;  transform: translateY(-50%);"></i>
                  {{i+1}}、{{items.message_info}}
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-carousel-item>
    </el-carousel>

    <loader-bar :action="loading"></loader-bar>
  </div>

  <div class="public" v-if="users.userMenu &&  menuList.length > 0">
    <!-- 通用工具 -->
    <div v-if="publicList.length > 0" class="public__common">
      <div :class="{'public__common__item':true, 'disabled':item.Sfqy==='0'}" v-for="(item, i) in publicList.filter(d=>d.IsHide==='0')" :key="i" :title="item.MenuName" @click="openPage(item, true)">
        <img class="public__common__item__icon" :src="item.MenuIcon === null ?'/static/img/default02.png':item.MenuIcon" />
        <div class="public__common__item__title">{{item.MenuName}}</div>
      </div>
    </div>

    <!-- 历史 -->
    <div class="public__history">
      <div :class="{'public__history__item ':true, 'disabled ':item.Sfqy==='0 '}" v-for="(item, i) in menuList[0].SubMenus.filter((d,di)=>di<4)" :key="i" :title="item.MenuName" @click="openPage(item)">
        <img class="public__common__item__icon" :src="item.MenuIcon === null ?'/static/img/default02.png ':item.MenuIcon" />
      </div>
    </div>
  </div>

  <div class="nav-list-box">
    <!-- <search-dialog :dialog="dialogSearch" @close="fetchCommAppList"></search-dialog> -->
    <search-dialog :dialog="dialogSearch" @close="updateCommAppList"></search-dialog>
  </div>
  <notification :dialog="showDialog" @close="showDialog = false" :active="activeName"></notification>
  <dialogDetail :dialog="detailDialog" :id="detailId" :type="detailType" @close="closeDetail" :due="steer" :size="full"></dialogDetail>
  <detaila ref="det" :dialog="readPageDialog" :newsType="newsType" :detailData="detailData" @call:close="closeDetail"></detaila>
  <detaile ref="dets" :dialog="readPageDialoge" :idarr="idArrs" :noticeType = "'0'" :id="detailId" @call:readed="readed" @call:close="closeDetail"></detaile>
  <approval-dialog @call:change-update="dialogApproval=false" :dialogApproval="dialogApproval" :object="messobj" @close="closeDetail" :size="full"></approval-dialog>
  <!-- 警情消息弹窗 -->
  <menus-newlist-dialog :dialog="dialogVisible" @call:change-update="dialogVisible=false" :centerId="this.$route.params.id"></menus-newlist-dialog>
  <!-- 系统消息列表详情 -->
  <detaila-dialog :dialog="dialog" :url="detailId" :lcid="lcid" :type="detailType" @close="closeDetail"></detaila-dialog>
  <contrast-results :dialog="ContrastDialog" @close="ContrastDialog=false" :ID="id" :title="caseName"></contrast-results>
  <controlNews :id="newsId" :dialog="cheNewsDialog" :keys="newsXxgn" @call:close="cheClose"></controlNews>
</page-container>
</template>
<style lang="scss" scoped>
  .centerTitle {
    width: 900px;
    height: 20px;
    color: white;
    font-size: 23px;
    border-bottom: 1px solid white;
    padding: 20px;
    margin: 0 auto;
  }

  .centerTitle1 {
    width: 900px;
    height: 2px;
    color: white;
    font-size: 23px;
    padding: 20px;
    margin: 0 auto;
  }

  .page-container {
    background: url('../assets/main_bg3.jpg') no-repeat center top;
    background-size: cover;
    min-height: 100% !important;
    height: 100%;
    position: relative;
  }

  .main-box {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    width: 1100px;
    margin: 0 auto;
    &__title {
      font-size: 46px;
      font-weight: 300;
      transform: scale(1.0);
      color: #fefefe;
      text-align: center;
      margin: 20px 0 0px;
      line-height: 1;
      /* background-image: -webkit-gradient(linear,0 0,0 bottom,from(rgb(255, 255, 255)),to(rgb(204, 204, 204))); */
      /* -webkit-background-clip: text; */
      /* -webkit-text-fill-color: transparent; */
      text-shadow: 0 4px 8px #063a5b;
      letter-spacing: 7px;
      &__ch {
        display: inline-block;
        vertical-align: middle;
        text-align: left;
      }
      &__en {
        display: block;
        font-size: 22px;
        letter-spacing: 0;
        line-height: 36px;
      }
      &:before {
        content: '';
        background: url("../assets/logo2.png") center no-repeat;
        background-size: 85px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 15px;
        width: 82px;
        height: 82px;
      }
    }
    &__menus {
      padding: 65px 44px;
      display: flex;
      align-content: center;
      /*justify-content: center;*/
      align-items: center;
      flex-wrap: wrap;
      height: 338px;
      &__title {
        color: #fff;
        font-size: 24px;
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
      }
      &__menu {
        text-align: center;
        width: 114px;
        margin: 0 31px 38px;
        padding: 13px;
        border-bottom: 3px solid #01b1d8;
        display: inline-block;
        cursor: pointer;
        &:hover {
          background-color: rgba(0, 255, 255, 0.24);
          border-bottom-color: #00ffff;
          .main-menu-list__item__box {
            //  animation: tada 1s 1 linear;
          }
        }
        &__icon {
          max-width: 100%;
          width: auto;
          height: 90px;
        }
        &__title {
          font-size: 16px;
          color: #fff;
          margin: 0 0 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
        }
      }
      &__xxlist {
        width: 825px;
        margin: 0 auto;
        height: 431px;
        color: #fff;
        .el-tabs__item {
          color: #fff;
          &.is-active {
            color: #ff6600;
          }
        }
      }
      &.big-screen {
        .main-box__menus__menu {
          width: 220px;
          margin: 0 45px 15px;
          border: 0;
          &__icon {
            max-width: 100%;
            width: auto;
            height: 140px;
          }
        }
      }
      &.entery {
        padding: 80px 44px;
        .main-box__menus__menu {
          width: 75px;
          margin: 0 11px 38px;
          border: 0;
          &__icon {
            height: 70px;
          }
        }
        .main-box__menus__add,
        .main-box__menus__more {
          color: #fff;
          text-align: center;
          width: 92px;
          margin: 0 11px 38px;
          padding: 13px;
          display: inline-block;
          cursor: pointer;
          i {
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            width: 70px;
            height: 70px;
            line-height: 70px;
            border: 1px dotted #fff;
            border-radius: 8px;
            margin: 0 auto;
            display: block;
          }
        }
        .main-box__menus__more {
          display: none;
        }
        .main-box__menus__add {}
        .main-box__menus__more {}
      }
    }
  }

  .public {
    width: 1060px;
    margin: 0 auto;
    position: relative;
    &__common {
      background: rgba(38, 130, 234, .2); // width: 890px;
      height: 100px;
      line-height: 100px;
      padding: 0 20px;
      border: 1px solid #006ba7;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      &__item {
        text-align: center;
        line-height: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        cursor: pointer;
        padding: 15px 29px;
        border-left: 1px solid rgba(0, 255, 255, 0);
        border-right: 1px solid rgba(0, 255, 255, 0);
        &__icon {
          max-width: 100%;
          width: auto;
          height: 50px;
          display: inline-block;
        }
        &__title {
          font-size: 14px;
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:hover {
          background: rgba(38, 130, 234, 0.24);
          border-left: 1px solid rgba(0, 255, 255, 0.1);
          border-right: 1px solid rgba(0, 255, 255, 0.1);
        }
      }
    }
    &__history {
      display: none;
      width: 120px;
      text-align: right;
      position: absolute;
      top: 0;
      right: 0;
      &__item {
        color: #fff;
        width: 50px;
        height: 50px;
        border-radius: 5px;
        display: inline-block;
        cursor: pointer;
        img {
          width: 100%;
          height: auto;
          margin-top: 6.25px;
        }
        &:nth-child(odd) {
          margin-right: 5px;
        }
      }
    }
  }

  @media screen and (min-width: 1900px) {
    .main-box {
      transform: translateY(65px) scale(1.0);
    }
    .public {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%) scale(1.0);
    }
  }

  @media screen and (max-width: 1366px) {
    .main-box__title {
      transform: scale(.8);
      margin-bottom: 0;
    }
    .main-box {
      transform: translateY(-59px) scale(.8);
    }
    .public {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%) scale(.8);
    }
  }

  @media screen and (max-width: 1280px) {
    .main-box__title {
      transform: scale(.8);
    }
    .main-box {
      transform: translateY(-75px) scale(.75);
    }
  }

</style>
<style lang="scss">
  .main-box .el-carousel-menu2.arrowRadio .el-carousel__indicator button {
    border-radius: 17px;
    width: 17px;
    height: 17px;
  }

  .main-box__menus__xxlist {
    position: relative;
  }

  .main-box__menus__xxlist .menus__xxlistul {
    list-style: none;
    padding: 0;
    position: relative;
    .more {
      position: absolute;
      border-radius: 15px;
      padding: 0 5px;
      top: 0;
      border: 1px solid #015B9B;
      background: #015B9B;
      right: 0;
      font-size: 12px;
      cursor: pointer;
    }
  }

  .main-box__menus__xxlist .morebtn {
    position: absolute;
    border-radius: 15px;
    padding: 0 5px;
    top: -45px;
    border: 1px solid #015B9B;
    background: #015B9B;
    right: 0;
    font-size: 12px;
    cursor: pointer;
  }

  .main-box__menus__xxlist .menus__xxlistul li {
    border-bottom: 1px solid #015B9B;
    padding: 5px 0;
    cursor: pointer;
  }

  .main-box__menus__xxlist .menus__xxlistul li span.keyword {
    color: red;
    font-weight: bold;
  }

  .main-box__menus__xxlist .el-tabs__item {
    color: #fff;
  }

  .main-box__menus__xxlist .el-tabs__header {
    border-bottom: 1px solid #02b4e3;
  }

  .main-box__menus__xxlist .el-tabs__item.is-active {
    color: #ffc641;
    font-weight: bold;
  }

  .main-box__menus__xxlist .el-tabs__active-bar {
    background-color: #ffc641;
  }

  .itemcount .el-badge__content.is-fixed {
    top: 10px;
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { FETCH_USER_MENU_LIST, FETCH_USER_MENU, FETCH_SYSTEM_NEW, FETCH_TYPE_LIST, UPDATE_NEWS_STATE, LIST_BY_CENTER_ID, GET_TOTAL_UNREAD_COUNT, CHANGE_STATUS, FXPCGK_INFO, FXPCGK_BASEPLACE_INFO, FXPCGK_INDORG_INFO, FXPCGK_CASECAR_INFO, UAV_MANUFACTURER_INFO, UAV_SELLER_INFO, UAV_TRAINING_INFO, UAV_HOBBYER_INFO, UAV_PRODUCTION_INFO, FXPCGK_CLUE_INFO, GET_DISPATCH, UPDATE_MESSAGE_STATE, FETCH_FEATURE_LIST } from '../store/types'
  import mixin from '../utils/mixin'
  import bus from '../utils/bus'
  import { FWZX_BASE_PATH, DOWNLOAD_FILE_PATH, FWZX_JUMP_URL } from '../config'
  import { getTokenUrl } from '../utils/util'
  import notification from './common/topbar/notification.vue'
  import detaile from './common/topbar/notification/notice-detail.vue'
  import detaila from './common/topbar/notification/detail.vue'
  import dialogDetail from './union/detail/dialog-detail'
  import PageContainer from './common/page-container.vue'
  import MainPageHeader from './common/mainheader/main-page-header.vue'
  import loaderBar from '../widgets/loader/loader-bar.vue'
  import { get, save } from '../utils/storage'
  import searchDialog from './nav/search-dialog'
  import regulation from '../assets/regulation.gif'
  import approvalDialog from './control/group/dialog/approval-dialog.vue'
  import menusNewlistDialog from './menus-newList-dialog.vue'
  import detailaDialog from './controlManage/detail/dialog-detail.vue'
  import contrastResults from './controlManage/supervise/contrastResults.vue'
  import controlNews from './common/dialogNews/controlNews.vue'
  export default {
    mixins: [mixin],
    components: {
      PageContainer,
      MainPageHeader,
      'loader-bar': loaderBar,
      searchDialog,
      dialogDetail,
      detaila,
      detaile,
      approvalDialog,
      notification,
      menusNewlistDialog,
      detailaDialog,
      contrastResults,
      controlNews
    },
    data() {
      return {
        isRead: null,
        titleIndex: '',
        detailData: '',
        lcid: '',
        id: '',
        caseName: '',
        newsId: '',
        newsXxgn: '',
        newsType: '',
        cheNewsDialog: false,
        xuNewsDialog: false,
        addNewsDialog: false,
        dialog: false,
        idArrs: [],
        showDialog: false,
        activeIndex: '',
        readPageDialog: false,
        readPageDialoge: false,
        ContrastDialog: false,
        full: 'full',
        steer: null,
        detailDialog: false,
        dialogVisible: false, // 警情消息弹窗
        dialogApproval: false, // 工作提醒-重点人员审批弹窗
        messobj: {},
        detailId: '',
        detailType: false,
        noticeType: '',
        firstLoading: true,
        xxlist: [],
        jqList: [], // 警情列表
        pageTitle: '',
        pageTitleEn: '',
        publicList: [],
        enteryList: [],
        activeName: '4',
        regulation: regulation,
        dialogSearch: false,
        commAppLoad: false,
        hideMsg: false,
        tabList: [{
          laber: '警情消息',
          name: '4',
          count: '0',
          icon: 'icon-jingqing'
        },
        {
          laber: '精准布控',
          name: '3',
          count: '0',
          icon: 'icon-ripple'
        },
        {
          laber: '工作提醒',
          name: '2',
          count: '0',
          icon: 'icon-fcstubiao25'
        },
        {
          laber: '通知通报',
          name: '0',
          count: '0',
          icon: 'icon-xiangqing'
        },
        {
          laber: '系统信息',
          name: '1',
          count: '0',
          icon: 'icon-fenxi2'
        }]
      }
    },
    computed: {
      /**
       * [menuList 入口菜单列表数据]
       * @return {[type]} [description]
       */
      menuList() {
        let res = []
        if (this.loading === false) {
          res = [...this.users.userMenu]
          // res.sort((a, b) => a.OrderSeq - b.OrderSeq)
          res = res.filter(d => d.HasAuthority === '1' && d.MenuName !== '情报墙')
        }
        return res
      },
      /**
       * [bigScreen 大屏列表数据]
       * @return {[type]} [description]
       */
      bigScreen() {
        let res = []
        if (this.loading === false) {
          if (!this.users.userMenu.find(d => d.MenuName === '情报墙')) {
            res = []
          } else {
            res = this.users.userMenu.find(d => d.HasAuthority === '1' && d.MenuName === '情报墙')
          }
        }
        return res
      },
      ...mapState(['users', 'message', 'systemNew', 'applyXtztc', 'centerEnter', 'focusPerson', 'focusOrg', 'focusCar', 'surveillance', 'controlManage'])
    },
    methods: {
      /***
       * 显示列表详情
       * @param data
       * @constructor
       */
      callDetail(val) {
        this.detailId = val
        this.newsType = ''
        // this.readPageDialog = true
      },
      clickDetail(val) {
        this.dispatch(UPDATE_NEWS_STATE, {
          KeyId: val,
          Id: val
        }).then(_ => {
          this.readed()
        })
      },
      /**
       * 关闭详情页面
       */
      closeDetail() {
        if (this.noticeType === '0' && Number(this.isRead) === 0) {
          this.listTabClick(this.tabList[3])
        } else if (this.noticeType === '1' && Number(this.isRead) === 0) {
          this.listTabClick(this.tabList[4])
        } else if (this.noticeType === '2' && Number(this.isRead) === 0) {
          this.listTabClick(this.tabList[2])
        } else if (this.noticeType === '3' && Number(this.isRead) === 0) {
          this.listTabClick(this.tabList[1])
        } else {
          this.cheNewsDialog = false
          this.dialogApproval = false
          this.dialog = false
          this.detailDialog = false
          this.readPageDialog = false
          this.readPageDialoge = false
        }
      },
      readed() {
        this.$emit('call:readed')
      },
      /**
       * [showDetail 显示详情]
       *  @return {[type]} [description]
       */
      showDetail(row) {
        if (!Number(row.isread)) {
          row.isread = 1
          this.getUnredCount();
          this.updateNewsState(row.id, this.noticeType)
        }
        // if (row.tblx === '6') {
        //   console.log(222222222222)
        //   this.detailId = row.id || row.id
        //   this.readPageDialoge = true
        //   return
        // } else if (row.tblx && row.tblx !== '6') {
        //   this.readPageDialog = true
        //   this.detailData = row
        //   this.newsType = '1'
        //   return
        // }
        if (row.xxmk === '2') {
          if (row.xxgn === '2') {
            this.dispatch(GET_DISPATCH, { id: row.gnlyid }).then(_ => {
              if (this.surveillance.detail) {
                if (Number(row.isread)) {
                  this.dialog = true
                  this.detailId = row.gnlyid
                  this.lcid = this.surveillance.detail.lcid
                  if (this.surveillance.detail.maplc[0].ZT === 'ZZJX') {
                    this.detailType = 1
                  } else {
                    this.detailType = 0
                  }
                } else {
                  this.dispatch(UPDATE_NEWS_STATE, { KeyId: row.id, Id: row.id }).then(_ => {
                    this.getUnredCount()
                    this.dialog = true
                    this.detailId = row.gnlyid
                    this.lcid = this.surveillance.detail.lcid
                    if (this.surveillance.detail.maplc[0].ZT === 'ZZJX') {
                      this.detailType = 1
                    } else {
                      this.detailType = 0
                    }
                  })
                }
              } else {
                this.$message({
                  message: '该消息已不存在',
                  type: 'warning'
                })
              }
            })
          } else if (row.xxgn === '5' || row.xxgn === '11' || row.xxgn === '12' ||
            row.xxgn === '13' || row.xxgn === '14' || row.xxgn === '15' || row.xxgn === '16' || row.xxgn === '17' || row.xxgn === '18' || row.xxgn === '19' || row.xxgn === '20' || row.xxgn === '21' || row.xxgn === '22' || row.xxgn === '23' || row.xxgn === '24' ||
            row.xxgn === '25' || row.xxgn === '26' || row.xxgn === '27' || row.xxgn === '28' || row.xxgn === '29' || row.xxgn === '30' || row.xxgn === '31' || row.xxgn === '32' || row.xxgn === '33' || row.xxgn === '34' || row.xxgn === '35' || row.xxgn === '36' || row.xxgn === '37' || row.xxgn === '38' || row.xxgn === '39' || row.xxgn === '41' || row.xxgn === '42' || row.xxgn === '43') {
            this.dispatch(UPDATE_NEWS_STATE, {
              KeyId: row.id,
              Id: row.id
            }).then(_ => {
              this.getUnredCount()
              if (row.xxgn === '5' || row.xxgn === '11' || row.xxgn === '12') {
                this.dispatch(FXPCGK_INFO, { id: row.gnlyid }).then(() => {
                  if (this.focusPerson.fxpcgkInfo) {
                    this.messobj.id = row.gnlyid
                    this.messobj.Type = row.xxgn
                    this.dialogApproval = true
                  } else {
                    this.$message({
                      message: '该消息已不存在',
                      type: 'warning'
                    })
                  }
                })
              } else if (row.xxgn === '13' || row.xxgn === '14' || row.xxgn === '15') {
                this.dispatch(FXPCGK_BASEPLACE_INFO, { id: row.gnlyid }).then(() => {
                  if (this.focusPerson.fxpcgkBaseplaceInfo) {
                    this.messobj.id = row.gnlyid
                    this.messobj.Type = row.xxgn
                    this.dialogApproval = true
                  } else {
                    this.$message({
                      message: '该消息已不存在',
                      type: 'warning'
                    })
                  }
                })
              } else if (row.xxgn === '16' || row.xxgn === '17' || row.xxgn === '18') {
                this.dispatch(FXPCGK_INDORG_INFO, { id: row.gnlyid, zdhylb: row.by3 }).then(() => {
                  if (this.focusOrg.fxpcgkIndorgInfo) {
                    this.messobj.id = row.gnlyid
                    this.messobj.Type = row.xxgn
                    this.messobj.zdhylb = row.by3
                    this.dialogApproval = true
                  } else {
                    this.$message({
                      message: '该消息已不存在',
                      type: 'warning'
                    })
                  }
                })
              } else if (row.xxgn === '19' || row.xxgn === '20' || row.xxgn === '21') {
                this.dispatch(FXPCGK_CASECAR_INFO, { id: row.gnlyid }).then(() => {
                  if (this.focusCar.fxpcgkCasecarInfo) {
                    this.messobj.id = row.gnlyid
                    this.messobj.Type = row.xxgn
                    this.dialogApproval = true
                  } else {
                    this.$message({
                      message: '该消息已不存在',
                      type: 'warning'
                    })
                  }
                })
              } else if (row.xxgn === '22' || row.xxgn === '23' || row.xxgn === '24') {
                this.dispatch(UAV_MANUFACTURER_INFO, { id: row.gnlyid }).then(() => {
                  if (this.focusPerson.uavManufacturerInfo) {
                    this.messobj.id = row.gnlyid
                    this.messobj.Type = row.xxgn
                    this.dialogApproval = true
                  } else {
                    this.$message({
                      message: '该消息已不存在',
                      type: 'warning'
                    })
                  }
                })
              } else if (row.xxgn === '25' || row.xxgn === '26' || row.xxgn === '27') {
                this.dispatch(UAV_SELLER_INFO, { id: row.gnlyid }).then(() => {
                  if (this.focusPerson.uavSellerInfo) {
                    this.messobj.id = row.gnlyid
                    this.messobj.Type = row.xxgn
                    this.dialogApproval = true
                  } else {
                    this.$message({
                      message: '该消息已不存在',
                      type: 'warning'
                    })
                  }
                })
              } else if (row.xxgn === '28' || row.xxgn === '29' || row.xxgn === '30') {
                this.dispatch(UAV_TRAINING_INFO, { id: row.gnlyid }).then(() => {
                  if (this.focusPerson.uavTrainingInfo) {
                    this.messobj.id = row.gnlyid
                    this.messobj.Type = row.xxgn
                    this.dialogApproval = true
                  } else {
                    this.$message({
                      message: '该消息已不存在',
                      type: 'warning'
                    })
                  }
                })
              } else if (row.xxgn === '31' || row.xxgn === '32' || row.xxgn === '33') {
                this.dispatch(UAV_HOBBYER_INFO, { id: row.gnlyid }).then(() => {
                  if (this.focusPerson.uavHobbyerInfo) {
                    this.messobj.id = row.gnlyid
                    this.messobj.Type = row.xxgn
                    this.dialogApproval = true
                  } else {
                    this.$message({
                      message: '该消息已不存在',
                      type: 'warning'
                    })
                  }
                })
              } else if (row.xxgn === '34' || row.xxgn === '35' || row.xxgn === '36') {
                this.dispatch(UAV_PRODUCTION_INFO, { id: row.gnlyid }).then(() => {
                  if (this.focusPerson.uavProductionInfo) {
                    this.messobj.id = row.gnlyid
                    this.messobj.Type = row.xxgn
                    this.dialogApproval = true
                  } else {
                    this.$message({
                      message: '该消息已不存在',
                      type: 'warning'
                    })
                  }
                })
              } else if (row.xxgn === '37' || row.xxgn === '38' || row.xxgn === '39') {
                this.dispatch(FXPCGK_CLUE_INFO, { id: row.gnlyid }).then(() => {
                  if (this.focusPerson.fxpcgkClueInfo) {
                    this.messobj.id = row.gnlyid
                    this.messobj.Type = row.xxgn
                    this.dialogApproval = true
                  } else {
                    this.$message({
                      message: '该消息已不存在',
                      type: 'warning'
                    })
                  }
                })
              } else if (row.xxgn === '41' || row.xxgn === '42' || row.xxgn === '43') {
                this.newsId = row.gnlyid
                this.newsXxgn = row.xxgn
                this.cheNewsDialog = true
              }
            })
          } else if (row.xxgn === '3') {
            this.detailDialog = true
            this.detailId = row.gnlyid
            this.detailType = parseInt(row.by1)
            this.steer = row
            this.clickDetail(row.id || row.id)
          }
        } else if (row.xxmk === '3') {
          if (row.xxgn === '2') {
            this.id = row.by1;
            let title = row.xxnr.split('布控对象')[0].split('布控名称')[1]
            this.caseName = title.substr(1, title.length - 2)
            this.dispatch(FETCH_FEATURE_LIST, {
              bkid: row.by1,
              qqly: '1'
            }).then(() => {
              let flags = false;
              this.controlManage.list.map(item => {
                if (item.dxtz_obj) {
                  flags = true
                }
              })
              if (flags) {
                this.ContrastDialog = true;
              } else {
                this.newsType = '1';
                this.detailData = { bt: row.xxnr, cjsj: row.cjsj }
                this.readPageDialog = true
              }
            })
          } else if (row.xxgn === '10') {
            this.dispatch(UPDATE_NEWS_STATE, {
              KeyId: row.id,
              Id: row.id
            }).then(_ => {
              this.getUnredCount()
              this.listTabClick(this.tabList[1])
            })
            this.jumpTo(`/controlManage/tacticsApplyDetail/${row.gnlyid}/${row.fjsj}`, true)
          }
        } else if (row.xxmk === '1') {
          if (row.xxgn === '2') {
            this.dispatch(GET_DISPATCH, { id: row.gnlyid }).then(_ => {
              if (this.surveillance.detail) {
                if (Number(row.isread)) {
                  this.dialog = true
                  this.detailId = row.gnlyid
                  this.lcid = this.surveillance.detail.lcid
                  if (this.surveillance.detail.maplc[0].ZT === 'ZZJX') {
                    this.detailType = 1
                  } else {
                    this.detailType = 0
                  }
                } else {
                  this.dispatch(UPDATE_NEWS_STATE, { KeyId: row.id, Id: row.id }).then(_ => {
                    this.getUnredCount()
                    this.dialog = true
                    this.detailId = row.gnlyid
                    this.lcid = this.surveillance.detail.lcid
                    if (this.surveillance.detail.maplc[0].ZT === 'ZZJX') {
                      this.detailType = 1
                    } else {
                      this.detailType = 0
                    }
                  })
                }
              } else {
                this.$message({
                  message: '该消息已不存在',
                  type: 'warning'
                })
              }
            })
          } else if (row.xxgn === '40') {
            this.isRead = row.isRead
            if (Number(row.isread)) {
              this.detailData = row.xxnr
              this.listTabClick(this.tabList[4])
              this.newsType = ' ';
              // this.detailData = { bt: row.xxnr, cjsj: row.cjsj }
              this.readPageDialog = true
            } else {
              this.dispatch(UPDATE_NEWS_STATE, { KeyId: row.id, Id: row.id }).then(_ => {
                this.getUnredCount()
                this.listTabClick(this.tabList[4])
                this.detailData = row.xxnr
                this.newsType = ' ';
                // this.detailData = { bt: row.xxnr, cjsj: row.cjsj }
                this.readPageDialog = true
              })
            }
          }
        } else {
          this.isRead = row.isRead
          if (Number(row.isread)) {
            this.detailId = row.id || row.id
            this.readPageDialoge = true
          } else {
            this.dispatch(UPDATE_NEWS_STATE, { KeyId: row.id, Id: row.id }).then(_ => {
              this.getUnredCount()
              this.detailId = row.id || row.id
              this.readPageDialoge = true
            })
          }
        }
      },
      cheClose(val) {
        this.cheNewsDialog = false
      },
      /**
       * [handleTabClick 滑块]
       * @return {[type]} [description]
       */
      listTabClick(tab) {
        this.xxlist = []
        this.dialogApproval = false
        this.dialog = false
        this.detailDialog = false
        this.readPageDialog = false
        this.readPageDialoge = false
        this.noticeType = tab.name
        if (this.noticeType === '4') {
          // 警情消息
          this.dispatch(LIST_BY_CENTER_ID, { centerId: this.$route.params.id }).then(() => {
            this.jqList = this.centerEnter.fetchlistByCenterId.list
            this.tabList[0].count = this.centerEnter.fetchlistByCenterId.unReadCount
          })
        } else {
          this.dispatch(FETCH_SYSTEM_NEW, {
            PageIndex: '1',
            PageSize: '10',
            Keyword: '',
            NoticeModularType: this.noticeType
          }).then(_ => {
            this.xxlist = this.systemNew.PageData
          })
        }
      },
      carouselChange(a, b) {
        this.titleIndex = a;
        if (this.commAppLoad === true) {
          setTimeout(() => {
            this.commAppLoad = false
            this.$refs.carousel.setActiveItem(b)
            setTimeout(() => {
              this.hideMsg = false
            }, 500)
          }, 500)
        }
      },
      updateCommAppList() {
        this.commAppLoad = true
        this.hideMsg = true
        this.fetchCommAppList()
      },
      fetchCommAppList() {
        this.enteryList = []
        this.dialogSearch = false
        this.dispatch(FETCH_TYPE_LIST).then(_ => {
          this.enteryList = this.applyXtztc.fetchTypeList.filter((d, i) => i < 10).map(d => {
            return {
              id: d.id,
              name: d.xtmc,
              link: d.xtlj,
              icon: d.pic ? DOWNLOAD_FILE_PATH + d.pic + '&w=91&h=125' : regulation
            }
          })
          if (this.firstLoading === true) {
            this.$nextTick(() => {
              this.firstLoading = false
            })
          }
        })
      },
      initTab() {
        this.noticeType = '4'
        // 获取警情消息列表
        this.dispatch(LIST_BY_CENTER_ID, { centerId: this.$route.params.id }).then(() => {
          this.jqList = this.centerEnter.fetchlistByCenterId.list
          this.tabList[0].count = this.centerEnter.fetchlistByCenterId.unReadCount
        })
      },
      init() {
        let pageId = this.$route.params.id
        this.dispatch(FETCH_USER_MENU, {
          CurMenuId: pageId
        }).then(() => {
          this.fetchCommAppList()
        }).catch(() => {
          this.$router.back();
        })
        document.title = (this.pageTitle || '') + '-智慧警务'
      },
      openNavTool(item) {
        let url = this.validateUrl({
          url: getTokenUrl(item.link, this.userData.UserToken),
          name: item.name
        })
        this.jumpTo(url, true)
      },
      validateUrl({ url = '', menuid = '', name = '', urlparams = '', treeid = '' }) {
        if (url.indexOf('/#') !== 0 && url.indexOf('http') !== 0 && url !== '') {
          url = `${window.location.origin}/#${url}`;
        } else if (url.indexOf('/#/ie/message') === 0) {
          url = `${window.location.origin}${url}`;
        }
        url = encodeURIComponent(url);
        urlparams = encodeURIComponent(urlparams);
        let joinUrl;
        let hostName = window.location.hostname;
        if (hostName === 'localhost' || hostName === '127.0.0.1' || !menuid) {
          joinUrl = `${FWZX_JUMP_URL}?token=${this.userData.UserToken}&name=${name}&url=${url}`;
        } else {
          joinUrl = `${FWZX_JUMP_URL}?token=${this.userData.UserToken}&menuid=${menuid}&urlparams=${urlparams}&treeid=${treeid}`;
        }
        return joinUrl;
      },
      openPage(data, isBig = false) {
        let path = data.RequestUrl,
          uMenuId = data.TreeId,
          accredit = data.HasAuthority,
          uMenuName = data.MenuName,
          pathWithToken = getTokenUrl(path, this.userData.UserToken)
        if (accredit === '0') {
          this.$message({
            type: 'error',
            message: '暂无此模块权限！',
            showClose: true
          })
        } else {
          if (data.Sfqy !== '1') {
            this.$message('此处正在施工中……')
          } else if (path == null || path === '-') {
            this.$message({
              type: 'error',
              message: '此模块无指向地址，无法访问',
              showClose: true
            })
          } else {
            // menuType:0，中心1,菜单2，按钮3,外部链接iframe 4,大屏 5，通用面板 6，第三方应用
            if (data.MenuType === 6) {
              // 第三方系统(特殊类别, 需请求接口后使用即时生成的URL做新窗口跳转)
              this.$http.get('http://127.0.0.1:8189/Service/?Msg=bilu', {}, this.httpSettings).then(() => {
                this.$http.post(FWZX_BASE_PATH + '/call', {
                  token: this.userData.UserToken,
                  id: path
                }, this.httpSettings).then((res) => {
                  if (res.body.Data && res.body.Data.source) {
                    if (data.OpenType === '3') {
                      window.open(res.body.Data.source);
                    } else {
                      window.location.href = res.body.Data.source
                    }
                  } else {
                    this.$alert('生成功能出口失败, 请与管理员联系!', '温馨提示')
                  }
                }).catch(() => {
                  this.$alert('功能开启失败, 请与管理员联系!', '温馨提示')
                })
              }).catch(() => {
                this.$confirm('您尚未安装智能笔录客户端, 可通过下方按钮进入下载页面下载安装.', '温馨提示', {
                  confirmButtonText: '前往下载',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  window.open('http://10.146.90.26:8080')
                }).catch(() => {});
              })
            } else if (data.MenuType === 3) {
              // 菜单
              save('permission_external_' + data.MenuId, {
                id: data.MenuId,
                name: data.MenuName,
                src: pathWithToken
              })
              if (data.OpenType === '3') {
                let path = `/external-single/${data.MenuId}?big=${data.MenuType === 4}`;
                let url = this.validateUrl({
                  url: getTokenUrl(path, this.userData.UserToken),
                  name: data.MenuName
                });
                this.jumpTo(url, true)
              } else {
                this.$router.push({ name: '外部系统独立页', params: { menuId: data.MenuId } })
              }
            } else if (data.MenuType === 4) {
              let url = this.validateUrl({
                url: pathWithToken,
                menuid: data.MenuId,
                name: data.MenuName
              });
              // openType 为3时，在新窗口打开
              if (data.OpenType === '3') {
                window.open(url);
              } else {
                window.location.href = url
              }
            } else if (path.includes('http://') || path.includes('https://') || path.includes('FDBL://')) {
              // 外部链接
              let url = this.validateUrl({
                url: path.includes('/#/ie/message') ? pathWithToken : path,
                menuid: data.MenuId,
                name: data.MenuName
              });
              // openType 为3时，在新窗口打开
              if (data.OpenType === '3') {
                window.open(url);
              } else {
                window.location.href = url
              }
            } else {
              // 其它 包括
              let targetUrl = path.indexOf('?') ? path.split('?')[0] : path
              path = `${path}${(path.indexOf('?') === -1 ? '?' : '&')}menuId=${uMenuId}&menuName=${uMenuName}`
              save('permission_' + targetUrl.split('/')[1], { id: uMenuId, name: uMenuName }); // 对应菜单权限
              // openType 为3时，在新窗口打开
              if (data.OpenType === '3') {
                let url = this.validateUrl({
                  url: getTokenUrl(path, this.userData.UserToken),
                  treeid: uMenuId,
                  name: uMenuName,
                  urlparams: `menuId=${uMenuId}&menuName=${uMenuName}`
                });
                this.jumpTo(url, true)
              } else {
                this.$router.push(path)
              }
            }
          }
        }
      },
      // 警情消息跳转
      showWarnNew(item) {
        this.dispatch(CHANGE_STATUS, { jqid: item.jqid, status: '1' }).then(() => {
          this.initTab()
          this.jumpTo(getTokenUrl(item.url, this.userData.UserToken), true)
        })
      },
      updateNewsState(id, NoticeModularType) {
        let jsonData = {
          isread: 0,
          id: id,
          NoticeModularType: NoticeModularType
        }
        this.dispatch(UPDATE_MESSAGE_STATE, jsonData)
      },
      /**
       * 修改字符串中数字样式
       * @function setNumber
       * @param  {str} string 字符串
       * @return {String}     结果
       */
      setNumber(str) {
        if (!str) return
        let num = '',
          keyword = '',
          resStr = '',
          res = str.split('')
        res.forEach((d, i) => {
          if (parseInt(d) && num === '') {
            num = i
          }
        })
        if (num !== '') {
          keyword = parseInt(str.substring(num)).toString()
          let keywordStr = '<span class="keyword">' + keyword + '</span>';
          res.splice(num, keyword.length, keywordStr)
          resStr = res.join('')
        } else {
          resStr = str
        }
        return resStr
      },
      /**
       * 初次进来弹出通知通报的弹窗*
       */
      firstTimeAlert() {
        this.dispatch(GET_TOTAL_UNREAD_COUNT).then(n => {
          if (this.systemNew.GetTotalUnreadCount && this.systemNew.GetTotalUnreadCount.DialogMessages.length > 0) {
            this.systemNew.GetTotalUnreadCount.DialogMessages.map(d => {
              this.idArrs.push(d.id)
            })
            this.detailId = this.idArrs[0]
            this.readPageDialoge = true
          }
        })
      },
      /**
       * 查询相关消息数据条数 *
       */
      getUnredCount() {
        this.dispatch(GET_TOTAL_UNREAD_COUNT).then(n => {
          this.tabList.forEach(a => {
            a.count = 0
          })
          this.systemNew.GetTotalUnreadCount.forEach(d => {
            if (d.Type) {
              this.tabList.forEach(a => {
                if (parseInt(d.Type) === parseInt(a.name)) {
                  a.count = d.TotalCount
                }
              })
            }
          })
        })
      }
    },
    watch: {},
    mounted() {},
    created() {
      this.firstTimeAlert()
      this.getUnredCount()
      bus.$on('changeCount', d => {
        switch (d) {
          case '10':
            this.getUnredCount()
            break
          case '2':
            this.getUnredCount()
            break
          case '3':
            this.getUnredCount()
            break
          case '88':
            this.getUnredCount()
            break
          case '66':
            this.getUnredCount()
            break
        }
      })
      this.initTab()
      let subMenu = get(this.$route.params.id)
      if (subMenu !== null) {
        this.pageTitle = subMenu.subMenuNameBm
        this.pageTitleEn = subMenu.subMenuNameEn
        this.init()
      } else {
        this.dispatch(FETCH_USER_MENU_LIST).then(() => {
          let targetMenu = this.users.userMenuList[0].SubMenus.find(d => d.MenuType === 0 && d.MenuId === this.$route.params.id + '_1')
          this.pageTitle = targetMenu.NameBm
          this.pageTitleEn = targetMenu.NameEn
          this.init()
        })
      }

      // 临时获取通用菜单
      this.$http.post(FWZX_BASE_PATH + '/call', {
        token: this.userData.UserToken,
        data: JSON.stringify({
          CurMenuId: '',
          token: this.userData.UserToken
        }),
        id: 'Sys/GetUserMenu'
      }, this.httpSettings).then((res) => {
        let publicMenu = res.body.Data[0].SubMenus.find(d => d.MenuName === '通用')
        if (!publicMenu) {

        } else {
          this.publicList = publicMenu.SubMenus
        }
      })
      bus.$on('sureControl', d => {
        if (d.flag) {
          this.id = d.row.by1;
          let title = d.row.xxnr.split('布控对象')[0].split('布控名称')[1]
          this.caseName = title.substr(1, title.length - 2)
          this.ContrastDialog = true;
          this.clickDetail(d.row.id || d.row.id)
        }
      })
      bus.$on('newsCheck', d => {
        if (d.newsId) {
          this.newsId = d.newsId
          this.newsXxgn = d.newsXxgn
          this.cheNewsDialog = true
        }
      })
      bus.$on('showDetailsDialog', d => {
        this.showDetail(d)
      })
    }
  }

</script>
