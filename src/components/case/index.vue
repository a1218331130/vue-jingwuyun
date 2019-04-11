<template>
<el-layout class="app-layout" :fit="true">
  <!-- 头部导航 -->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <p class="case__title">{{caseTitle}}
      <!--<span class="state-text" v-if="caseStateText">{{caseStateText}}</span> 案件状态-->

      <input v-if="fileInput===true" type="file" ref="importUploadBtn" class="hide" accept=".csv,.mdb,.accdb,text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="fileChange">
      <import-dialog :dialog="dislogImport" :title="fileInfo.title" :file="fileInfo.file" :type="importType" :caseInfo="{caseName:caseTitle, caseId:caseId}" @close="clearFileInput"></import-dialog>
    </p>
    <div class="btn-box">
      <el-tooltip v-for="(item,i) in toolsLinks_ImgUrl" :open-delay="200" class="item" effect="dark" :key="i">
        <div slot="content">
          <span v-if="item.text==='话单分析'">{{item.text}}
            <el-button size="mini" type="text" @click="importTelList" style="color:#fff; text-decoration: underline;">话单导入</el-button>
          </span>
          <span v-else-if="item.text==='账单分析'">{{item.text}}
            <el-button size="mini" type="text" @click="importBill" style="color:#fff; text-decoration: underline;">账单导入</el-button>
          </span>
          <span v-else>{{item.text}}</span>
        </div>
        <el-button @click="jumpTo('/#'+item.url+'?caseId=' + caseId +'&key='+idCard,true)">
          <img class="img img-one" :src="'static/caseExport/'+item.icon+'1.png'" :alt="item.text">
          <img class="img img-two" :src="'static/caseExport/'+item.icon+'2.png'" :alt="item.text">
          <!--<i :class="item.icon" @click="jumpTo('/#'+item.url+'?caseId=' + caseId,true)"></i>
            <span>{{item.text.substring(0, 1)}}</span>-->
        </el-button>
      </el-tooltip>
    </div>
  </el-region>
  <!-- 侧边栏(左导航按钮) -->
  <el-region :class="{'app-west': true, 'app-west--collapsed': isWestCollapsed}" slot="west" type="west" :zoom="false" :fixed="false">
    <a v-for="item in westMenu" href="javascript:void(0)" @click="westChangeClick(item.path)" :title="!isWestCollapsed?item.text:''">
      <el-button :class="{'west-menu-button':true,current:$route.path=== item.path}"><i :class="item.icon"></i>
        <span>{{item.text}}</span>
      </el-button>
    </a>

    <el-button type="info" v-if="westMenu.length > 0" class="end-case west-menu-button" :title="isEndCase ? '已结案' : '点击结案'" @click="isEndCase ? '' : endCaseDialog = true">
      {{isEndCase ? '已' : '点击'}}结案
    </el-button>
    <!-- 结案弹窗Dialog -->
    <el-dialog v-draggable="dialogDraggableOptions" :title="'【'+caseTitle+'】结案操作'" :visible.sync="endCaseDialog">
      <el-form :model="endCaseForm" ref="endCaseFormRef" :rules="endCaseFormRules">
        <el-form-item label="结案状态" prop="jazt">
          <el-select placeholder="请选择" v-model="endCaseForm.jazt" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['JAZT']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结案描述" prop="jams">
          <el-input type="textarea" v-model="endCaseForm.jams" placeholder="描述限制150个字符" :maxlength="150" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="" @click="endCaseDialog = false">取消</el-button>
        <el-button type="primary" @click="endCaseFun">确定</el-button>
      </div>
    </el-dialog>
    <div :class="{'app-side-bar__fold':true, 'el-icon-d-arrow-left':isWestCollapsed,'el-icon-d-arrow-right':!isWestCollapsed,}" @click="switchWest"></div>
  </el-region>
  <!-- 内容区 -->
  <el-region class="app-center" slot="center" type="center" style="overflow-x: hidden;height: calc(100% - 60px);position: relative;">
    <slot name="center">
      <keep-alive>
        <router-view v-if="isShowView"></router-view>
      </keep-alive>
    </slot>
  </el-region>
  <!-- 侧边栏(右工具按钮) -->
  <!-- <el-region class="position" :class="{'app-position':true, 'app-position--collapsed':isEastCollapsed}" slot="east" type="east" :zoom="false" :fixed="true">
                  <div :class="['app-side-bar__fold', 'iconfont', isEastCollapsed? 'icon-fold': 'icon-unfold']" @click="toggleEastCollapse"></div>
                  <slot name="east">
                  </slot>
                </el-region> -->

</el-layout>
</template>
<style lang="scss" scoped>
  .app-north {
    background-color: #186cab;
    position: relative;
    .case__title {
      font-size: 18px;
      color: #fff;
      font-weight: bold;
      max-width: 1280px;
      padding: 0 20px;
      margin: 0;
      line-height: 50px;
      .state-text {
        font-size: 14px;
        background-color: #FFC323;
        color: #fff;
        padding: 3px 8px;
        border-radius: 3px;
      }
    }
    .btn-box {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      .el-button {
        /*background: #59c9b1;*/
        color: #fff;
        padding: 0;
        width: 32px;
        height: 32px;
        /*border: 2px solid #fff;*/
        border-radius: 50%;
        /*box-shadow: 0 0 2px 0.5 #000;*/
        position: relative;
        span {
          display: block;
        }
        i {
          display: none;
        }
        i,
        span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
        .img {
          margin: -1px;
          &-one {
            display: block;
          }
          &-two {
            display: none;
          }
        }
        &:hover {
          /*background: #f9873b;*/
          span {
            display: none;
          }
          .img {
            &-one {
              display: none;
            }
            &-two {
              display: block;
            }
          }
          i {
            display: block;
          }
        }
      }
    }
  }

  .app-position {
    width: 56px;
    border-left: 3px solid #1c8de0;
  }

  .app-position.app-position--collapsed {
    width: 230px;
    border-left: 1px solid #1c8de0;
    background-color: #f3f3f3;
  }

  .app-west {
    background: #1c7dc6;
    width: 55px;
    .el-button.west-menu-button {
      background: #2591DE;
      color: #fff;
      font-size: 14px;
      text-align: left;
      width: calc(100% - 15px);
      height: 38px;
      line-height: 38px;
      padding: 0;
      display: block;
      border: 0;
      border-bottom: 1px solid #027aca;
      border-radius: 0;
      box-sizing: initial;
      word-wrap: break-word;
      white-space: normal;
      margin: 0;
      padding-left: 15px;
      font-family: "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB";
      &.end-case {
        background: #12CD6F;
        color: #fff;
        border: none;
        position: absolute;
        bottom: 7%;
        width: 90%;
        left: 5%;
        padding: 0;
        margin: 0;
        text-align: center;
        display: none;
        font-weight: bold;
        font-size: 15px;
      }
      span {
        display: none;
      }
      &+& {
        border-top: none;
      }
      .iconfont {
        font-size: 18px;
        margin: 0;
        display: block;
      }
      &.current,
      &:hover {
        background: #ff9900;
      }
    }
    &--collapsed {
      width: 150px;
      .el-button.west-menu-button {
        &.end-case {
          display: inline;
        }
        .iconfont {
          display: inline;
        }
        span {
          display: inline;
        }
      }
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  import bus from '../../utils/bus'
  import {
    GET_CASE_INFO,
    UPDATE_CASE_INFO,
    FETCH_USER_MENU,
    GET_USER_CASE_ACTIONS, // 查询办案人员案件研判权限总线列表
    FETCH_LOGIN_PERSONNEL_LIMITS_LIST // 查询当前登录办案人员权限
  } from '../../store/types'
  import { get, getLoginUser, getAdminUser, sessionSave } from '../../utils/storage'
  import TopBar from '../common/topbar/index.vue'
  import importDialog from '../../widgets/import-dialog/import-dialog'
  import { clone } from '../../utils/util'
  import mixin from '../../utils/mixin'
  export default {
    mixins: [mixin],
    components: {
      TopBar,
      importDialog
    },
    data() {
      return {
        idCard: '', // 犯罪嫌疑人身份证
        dictLists: [], // 字典集合
        endCaseDialog: false,
        endCaseForm: {
          jazt: '',
          jams: ''
        },
        endCaseFormRules: {
          jazt: [
            { required: true, message: '不能为空' }
          ],
          jams: [
            { required: true, message: '不能为空' }
          ]
        },
        dislogImport: false,
        fileInfo: {
          name: '',
          title: '',
          type: '',
          file: null
        },
        isWestCollapsed: true,
        isEastCollapsed: false,
        isShowView: false,
        isEndCase: false,
        caseId: '', // 案件id
        loginUserId: '', // 当前登录用户ID
        loginUserMenuList: '', // 当前登录用户菜单
        caseTitle: '',
        caseStateText: '',
        toolsLinks: [{
          text: '图片分析',
          icon: 'iconfont icon-image',
          url: '/analysis/image'
        }, {
          text: '账单分析',
          icon: 'iconfont icon-note',
          url: '/analysis/bill'
        }, {
          text: '时光轴',
          icon: 'iconfont icon-fenxi',
          url: '/analysis/timeline'
        }, {
          text: '话单分析',
          icon: 'iconfont icon-order-phone',
          url: '/analysis/telList'
        }, {
          text: '关系分析',
          icon: 'iconfont icon-guanxi',
          url: '/analysis/relation'
        }],
        toolsLinks_ImgUrl: [{
          text: '图片比对',
          icon: 'tpdb',
          url: '/analysis/image'
        }, {
          text: '账单分析',
          icon: 'zdfx',
          url: '/analysis/bill'
        }, {
          text: '时光轴',
          icon: 'sgzfx',
          url: '/analysis/timeline'
        }, {
          text: '话单分析',
          icon: 'hdfx',
          url: '/analysis/telList'
        }, {
          text: '关系分析',
          icon: 'gxfx',
          url: '/analysis/relation'
        }],
        // {
        //   text: '视频分析',
        //   icon: 'spfx',
        //   url: '/analysis/video'
        // },  {
        //   text: '轨迹分析',
        //   icon: 'gjfx',
        //   url: '/analysis/locus'
        // },  {
        //   text: '数据比对',
        //   icon: 'sjdb',
        //   url: '/analysis/data'
        // },
        toolsLinks_backup: [{
          text: '图片分析',
          icon: 'iconfont icon-image',
          url: '/analysis/image'
        }, {
          text: '账单分析',
          icon: 'iconfont icon-note',
          url: '/analysis/bill'
        }, {
          text: '视频分析',
          icon: 'iconfont icon-video',
          url: '/analysis/video'
        }, {
          text: '时光轴',
          icon: 'iconfont icon-fenxi',
          url: '/analysis/timeline'
        }, {
          text: '轨迹分析',
          icon: 'iconfont icon-coordinates_fill',
          url: '/analysis/locus'
        }, {
          text: '话单分析',
          icon: 'iconfont icon-order-phone',
          url: '/analysis/telList'
        }, {
          text: '数据比对',
          icon: 'iconfont icon-fenxi2',
          url: '/analysis/data'
        }, {
          text: '关系分析',
          icon: 'iconfont icon-guanxi',
          url: '/analysis/relation'
        }],
        westMenu: [],
        fileInput: true,
        fileTypes: ['csv', 'mdb', 'accdb', 'txt', 'xls', 'xlsx'],
        importType: 0
      }
    },
    props: [],
    computed: {
      ...mapState(['caseInfo', 'users', 'peopleCase'])
    },
    methods: {
      /**
       * 获取研判菜单列表
       */
      queryUserMenuList() {
        this.dispatch(FETCH_USER_MENU, {
          CurMenuId: get('study_judge_per').treeId
        }).then(() => {
          this.queryloginMenuList(clm => {
            this.westMenu = []
            this.users.userMenu.filter(rf => (rf.MenuType === 1 && rf.MenuName.includes('研判'))).map(r => {
              if (r.SubMenus) {
                this.westMenu = r.SubMenus.filter(rsf => {
                  // 案件研判页左侧菜单筛选
                  rsf.SubMenus.map(rfsmS => { // 过滤有选子类的取其父类ID
                    if (clm.includes(rfsmS.MenuId) && !clm.includes(rfsmS.ParentId)) {
                      clm.push(rfsmS.ParentId)
                    }
                  })
                  return rsf.Sfqy === '1' && ((this.loginUserId === getAdminUser().userId) || this.cjrId === this.loginUserId || clm.includes(rsf.MenuId))
                }).map(rs => {
                  return {
                    id: rs.MenuId,
                    treeId: rs.TreeId,
                    text: rs.MenuName,
                    icon: rs.MenuIcon,
                    path: rs.RequestUrl
                  }
                })

                if (this.westMenu.length === 0) {
                  this.$alert('您无此案件研判权限，请联系案件负责人开通权限谢谢！', '温馨提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                      window.close()
                    }
                  });
                }
              }
            })
            if (this.westMenu.length > 0) {
              let _wMeIsPath = false
              this.westMenu.map(r => {
                if (r.path === this.$route.path) {
                  _wMeIsPath = true
                  this.getCaseInfo() // 初始化获取案件基本信息
                }
              })
              if (!_wMeIsPath) {
                this.westChangeClick(this.westMenu[0].path)
                this.getCaseInfo() // 初始化获取案件基本信息
              }
            }
          })
        })
      },
      getCaseInfo() {
        // 查询案件基础信息
        // if(this.checkRuleCase('ajgl/lawcase/info', this.caseId)) {
        this.dispatch(GET_CASE_INFO, { data: { id: this.caseId } })
        // }
      },
      toggleEastCollapse() {
        this.isEastCollapsed = !this.isEastCollapsed
      },
      switchWest() {
        this.isWestCollapsed = this.isWestCollapsed === false
      },
      westChangeClick(path) {
        // 菜单切换跳转
        let caseId = this.caseId
        let cjrId = this.cjrId
        caseId = caseId ? '?a=' + caseId : ''
        cjrId = cjrId ? '&b=' + cjrId : ''
        this.$router.push(path + caseId + cjrId)
      },
      /***
       * 结案操作
       */
      endCaseFun() {
        if (!this.isEndCase) {
          this.$refs['endCaseFormRef'].validate(vt => {
            if (vt) {
              // 更新结案信息
              this.dispatch(UPDATE_CASE_INFO, {
                data: Object.assign({
                  id: this.caseId,
                  sfja: '1'
                }, this.endCaseForm)
              }).then(d => {
                this.getCaseInfo(this.caseId)
                this.$message({
                  message: '结案操作成功！',
                  type: 'success'
                })
                this.endCaseDialog = false
              })
            } else {
              return false
            }
          })
        }
      },
      /**
       * 查询当前用户【办案人员】权限树
       */
      queryloginMenuList(callback = () => {}) {
        this.dispatch(FETCH_LOGIN_PERSONNEL_LIMITS_LIST, {
          ajid: this.caseId, // 必填
          userid: this.loginUserId // 必填
        }).then(r => {
          this.loginUserMenuList = this.peopleCase.fetchLoginPersonnelLimitsList.map(r => {
            return r.menuId
          })
          callback(this.loginUserMenuList)
        })
      },
      importTelList() {
        this.importType = 1
        this.$refs.importUploadBtn.click()
      },
      importBill() {
        this.importType = 2
        this.$refs.importUploadBtn.click()
      },
      fileChange(elm) {
        let file = elm.target.files[0],
          fileTypeArr = file.name.split('.'),
          fileType = fileTypeArr[fileTypeArr.length - 1]
        if (file.size > 1024 * 1024 * 100) {
          this.$alert('文件不能大于100MB', '温馨提示');
        } else if (!this.fileTypes.find(d => d === fileType)) {
          this.$alert('只支持 CSV/EXCEL/TXT/ACCESS 文件', '温馨提示');
        } else {
          this.fileInfo = {
            name: file.name,
            title: `${(this.importType === 1 ? '话单导入' : '账单导入')}-${file.name}`,
            type: fileType,
            file: file
          }
          this.dislogImport = true
        }
      },
      clearFileInput() {
        this.fileInput = false
        setTimeout(() => {
          this.fileInput = true
        }, 300)
        this.dislogImport = false
      },
      /**
       * todo:获取当前等办案人员当前案件研判的权限
       */
      queryLoginCaseUserActions() {
        this.dispatch(GET_USER_CASE_ACTIONS, {
          ajid: this.caseId, // 必填
          userid: this.loginUserId // 必填
        }).then(r => {
          let _thisPUCA = clone(this.peopleCase.getUserCaseActions)
          let _tempSession = {}
          if (_thisPUCA) {
            _thisPUCA.map(r => {
              _tempSession[r.REQALIAS] = true
            })
          }
          // session缓存当前案件权限
          sessionSave('ngw_actions_u_' + this.loginUserId + '_c_' + this.caseId, _tempSession)
        })
      },
      queryDictType() {
        //  表单字典初始化
        this.getDict(['JAZT']).then(res => {
          this.dictLists = res
        })
      }
    },
    watch: {
      'caseInfo.Model' (val) {
        if (val) {
          this.isEndCase = val.sfja !== '0'
          this.isShowView = true
          this.caseTitle = val.ajmc
          this.caseStateText = val.ajztmc
        } else {
          this.isShowView = false
          this.caseTitle = '当前案件不存在'
          this.caseStateText = null
          this.toolsLinks = []
          this.westMenu = []
        }
        document.title = this.caseTitle + '-智慧警务'
      }
    },
    mounted() {},
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.cjrId = this.$route.query.b // 初始化获取案件创建人id
      this.loginUserId = getLoginUser().UserData.UserId // 初始化获取登录用户Id
      this.queryLoginCaseUserActions() // 获取当前等办案人员当前案件研判的权限
      this.queryUserMenuList()
      this.queryDictType()
      bus.$on('caseIdCard', d => {
        this.idCard = d
      })
    }

  }

</script>
