import socketIo from './socket-io'
import { DOWNLOAD_FILE_PATH, LOGIN_HOST, FWZX_BASE_PATH, CAR_VERSION_PATH, CAR_BRAND_PATH, SITEOPTIONS_KEY } from '../config'
import { FETCH_SYS_ORG_BY_CURRY_ORG, GET_SYS_DICT_BY_TYPE, GET_DEPT_DICTS_LIST } from '../store/types'
import { save, get, removeLoginUser, clear, sessionGet, getLoginUser, getAdminUser, saveSiteInfo, getSiteInfo } from './storage'

import Draggable from './directives/draggable'
import { getReturnPath } from './util'
import { listToTree } from './listToTree'

/**
 * @module Mixin 通用继承类
 * @desc 通用继承类
 * @example
 * import mixin from '../../utils/mixin'
 * export default {  mixins: [mixin] }
 *
 */
export default {
  mixins: [socketIo],
  components: {},
  directives: {
    Draggable,
    'height-fix': {
      /**
       * 通过浏览器的高度减去一个值计算元素的高度
       * @param value 浏览器高度需要减去的值
       */
      inserted: function (el, { value }) {
        let h = document.documentElement.clientHeight - parseInt(value);
        el.style.height = `${h}px`;
      },
      componentUpdated: function (el, { value }) {
        let h = document.documentElement.clientHeight - parseInt(value);
        el.style.height = `${h}px`;
      }
    }
  },
  data() {
    return {
      siteInfo: null,
      loading: false,
      dictList: null,
      dictLoading: false,
      submitLoading: false,
      submitLoadText: '正在提交中',
      heightLightCount: 0,
      httpSettings: {
        crossOrigin: false,
        emulateJSON: true, // 设置请求头Content-Type的值为application/x-www-form-urlencoded
        credentials: true, // 跨域发送请求带上cookie
        emulateHTTP: true // 用HTTP的POST方式PUT，PATCH，DELETE等请求，并设置请求头字段HTTP_Method_Override为原始请求方法。
      },
      userBgSrc: '/static/img/test_bg.png',
      dialogDraggableOptions: {
        handle: '.el-dialog__header',
        children: '.el-dialog',
        range: {
          left: -10000,
          top: 0,
          width: 10000,
          height: 10000
        }
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date(),
              start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近30天', // '最近一个月',
          onClick(picker) {
            const end = new Date(),
              start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近60天', // '最近两个月',
          onClick(picker) {
            const end = new Date(),
              start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近90天', // '最近三个月',
          onClick(picker) {
            const end = new Date(),
              start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近半年',
          onClick(picker) {
            const end = new Date(),
              start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = new Date(),
              start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近两年',
          onClick(picker) {
            const end = new Date(),
              start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 730)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三年',
          onClick(picker) {
            const end = new Date(),
              start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1095)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: {
    /**
     * 当前登录用户信息, 如果使用此属性，当用户退出登录再进入时，第一个接口申请所发的userData会有缓存，计算属性不知道localStorage已经改变
     * @function userData
     */
    userData() {
      let loginUser = getLoginUser(),
        res = {
          UserToken: ''
        }
      if(!loginUser) {
        if(this.$route.path !== '/login') this.returnLogin()
      } else {
        res = loginUser.UserData
      }
      return res
    },
    /**
     * 当前用户所属单位信息
     * @function userOrgInfo
     */
    userOrgInfo() {
      return this.$store.getters.userOrgInfo
    },
    /**
     * 下载文件路径
     * @function downloadFilePath
     */
    downloadFilePath() {
      return DOWNLOAD_FILE_PATH
    },
    /**
     * 前端页面权限
     * @function permission
     */
    permission() {
      let res
      if(this.$route.path.indexOf('external-single') !== -1) {
        res = 'permission_' + 'external_' + this.$route.path.split('/')[2]
      } else {
        res = 'permission_' + this.$route.path.split('/')[1]
      }
      return res
    },
    /**
     * 用户头像地址
     * @function personImagePath
     */
    personImagePath() {
      let info = getSiteInfo() || { JAVA_HOST: '10.146.14.66', JAVA_PORT: '80' }
      return `http://${info.JAVA_HOST}:${info.JAVA_PORT}/qingbaoyun-navigation/query/getperson/gettx?token=${this.userData.UserToken}&sfzh=`
    },
    /**
     * 汽车品牌图路径
     * @function carBrandPath
     */
    carBrandPath() {
      return CAR_BRAND_PATH
    },
    /**
     * 汽车型号图路径
     * @function carVersionPath
     */
    carVersionPath() {
      return CAR_VERSION_PATH
    }
  },
  methods: {
    getUserData() {
      let loginUser = getLoginUser(),
        res = {
          UserToken: ''
        }
      if(!loginUser) {
        if(this.$route.path !== '/login') this.returnLogin()
      } else {
        res = loginUser.UserData
      }
      return res
    },
    /**
     * 初始化网站配置
     * @function initSiteInfo
     * @return {Promise} 承诺回调, 第一参数网站配置对象
     */
    initSiteInfo() {
      let self = this,
        siteInfo = getSiteInfo()
      // this.$store.getters.dictList
      return new Promise(function (resolve, reject) {
        if(!siteInfo || siteInfo.static === true) {
          // 获取网站配置
          self.$http.get(FWZX_BASE_PATH + '/GetSysConfig').then((res) => {
            let jsonString = self.uncMe(res.body.Data, SITEOPTIONS_KEY),
              trimString = jsonString.substr(0, jsonString.indexOf(']') + 1)
            siteInfo = {}
            JSON.parse(trimString).forEach(d => {
              siteInfo[d.Key] = d.Value
            })
            self.siteInfo = siteInfo
            saveSiteInfo(self.siteInfo)
            resolve(self.siteInfo)
          }).catch(() => {
            // 获取网站配置失败
            reject()
          })
        } else {
          self.siteInfo = siteInfo
          saveSiteInfo(self.siteInfo)
          resolve(self.siteInfo)
        }
      })
    },
    /**
     * 通用接口调用
     * @function dispatch
     * @param  {ACTIONTYPE} type        action 名称
     * @param  {Object} data            接需要发送的数据
     * @param  {Number} index           操作数据列索引
     * @param  {Boolean} disabledLoading 禁用loading
     * @param  {Boolean} disabledNotify  禁用接口错误回调提示框
     * @param  {String} [token='']      静态token
     * @return {Promise}                承诺回调
     */
    dispatch(type, data, index, disabledLoading, disabledNotify, token = '', options = { autoCancelLoading: true }) {
      this.loading = !disabledLoading;
      const head = {
        // c: 0, // 超级权限,弃用 @2017.10.27 by Eeqlee
        token: this.getUserData().UserToken || token
      }
      return this.$store.dispatch(type, {
        body: {
          ...head,
          data: JSON.stringify({
            ...data,
            token: head.token
          })
        },
        index: index
      }).then(_ => {
        // const thisPath = this.$route.fullPath
        // let accessMenu = this.$store.getters.userMenu
        // if (thisPath.indexOf('/system') >= 0) {
        //   if(accessMenu && thisPath !== '/system') {
        //     this.$router.push('/system')
        //   }
        // }
        if(options.autoCancelLoading) {
          this.loading = false
        }
      }).catch(res => {
        if(this.$store.getters.isTipsing === false) {
          this.$store.commit('changeTipsingState', true)
          const messageMap = {
            '0': (res.data || res.Data) || '请求失败，请联系管理员！错误代码(0)',
            '1': '成功',
            '-1': '登录状态已失效，请重新登录！', // 'Token失效',
            '-2': '权限不足',
            '-3': '系统异常，请联系管理员！错误代码(-3)',
            '-4': (res.data || res.Data) || '请求失败，请联系管理员！错误代码(-4)'
          }
          if(options.autoCancelLoading) {
            this.loading = false
          }
          const status = (res.Status || res.status) + ''
          const msg = messageMap[status] || res.message || res.Message || res.msg || res.Data || '未知原因错误，请联系管理员！'
          if(status !== '-3') {
            !disabledNotify && this.$alert(msg, '温馨提示', {
              confirmButtonText: '确定',
              type: 'warning',
              callback: action => {
                if(status === '-1' || status === '-2') {
                  this.clearUserInfoFromStorage();
                } else {
                  this.$store.commit('changeTipsingState', false)
                }
              }
            })
          } else {
            console.log(res)
          }
        }
        return Promise.reject(res)
      })
    },
    /**
     * 123
     */
    cellMouseEnter(row, column, cell, event) {
      if(!cell.title) {
        cell.title = cell.innerText
      }
    },
    /**
     * 获取当前用户有权限的单位树
     * @function getRuleOrgTree
     * @desc 指定单位的下级单位树(包含该单位)
     * @param  {String}  [parentOrgId=''] 指定父级单位orgId, 为空,则获取当前用户主单位
     * @param  {Boolean} [needList=false] 是否需要返回未递归的LIST
     * @param  {Boolean} [clearLocalStore=false] 是否清除本地储存缓存好的单位树并重新获取
     * @param  {String} [orderType = ''] 排序类型：NAME(名称),ORG_ID(单位编号),ADD_TIME(创建时间),JZLX(警种类型)
     * @return {Promise}                 承诺回调, 第一参数:根据needList返回list或map
     */
    getRuleOrgTree(parentOrgId = '', needList = false, clearLocalStore = false, orderType = '') {
      let self = this
      return new Promise(function (resolve, reject) {
        if(get('ngw_rule_org_tree') === null || clearLocalStore === true) {
          self.dispatch(FETCH_SYS_ORG_BY_CURRY_ORG, {
            orgId: parentOrgId || self.userOrgInfo.mainOrgId,
            orderType: orderType
          }).then(() => {
            let mainOrg = self.userOrgInfo.mainOrg,
              res = [{
                orgId: mainOrg.KeyId,
                code: mainOrg.KeyId,
                name: mainOrg.DeptName,
                parentId: mainOrg.ParentId,
                sscsdm: mainOrg.SSCSDM,
                sscsmc: mainOrg.SSCSMC,
                ssqydm: mainOrg.SSQYDM,
                ssqymc: mainOrg.SSQYMC,
                sssfdm: mainOrg.SSSFDM,
                sssfmc: mainOrg.SSSFMC,
                children: listToTree(self.$store.state.orgs.orgByCurryOrg, parentOrgId || self.userOrgInfo.mainOrgId, 0, {
                  id: 'orgId',
                  parentId: 'parentId',
                  children: 'children'
                })
              }]
            save('ngw_rule_org_tree', res = {
              map: res,
              list: self.$store.state.orgs.orgByCurryOrg
            })
            push()
          }).catch(() => {
            reject()
          })
        } else {
          push()
        }

        function push() {
          let res = get('ngw_rule_org_tree')
          if(needList === false) {
            resolve(res.map)
          } else {
            resolve(res)
          }
        }
      })
    },
    /**
     * 无需权限获取所有的单位树
     * @function getRuleOrgTree
     * @desc 指定单位的下级单位树(包含该单位)
     * @param  {String}  [parentOrgId=''] 指定父级单位orgId, 为空,则获取当前用户主单位
     * @param  {Boolean} [needList=false] 是否需要返回未递归的LIST
     * @param  {Boolean} [clearLocalStore=false] 是否清除本地储存缓存好的单位树并重新获取
     * @param  {String} [orderType = ''] 排序类型：NAME(名称),ORG_ID(单位编号),ADD_TIME(创建时间),JZLX(警种类型)
     * @return {Promise}                 承诺回调, 第一参数:根据needList返回list或map
     */
    getRuleOrgTree1(parentOrgId = '', needList = false, clearLocalStore = false, orderType = '') {
      let self = this
      return new Promise(function (resolve, reject) {
        if(get('ngw_rule_org_tree') === null || clearLocalStore === true) {
          self.dispatch(FETCH_SYS_ORG_BY_CURRY_ORG, {
            orgId: parentOrgId || self.userOrgInfo.mainOrgId,
            orderType: orderType
          }).then(() => {
            let res = [{
              orgId: parentOrgId,
              code: parentOrgId,
              name: '怀化市公安局',
              parentId: '430000000000',
              sscsdm: '431200',
              sscsmc: '怀化市',
              ssqydm: '431200',
              ssqymc: '怀化市',
              sssfdm: '430000',
              sssfmc: '湖南省',
              children: listToTree(self.$store.state.orgs.orgByCurryOrg, parentOrgId || self.userOrgInfo.mainOrgId, 0, {
                id: 'orgId',
                parentId: 'parentId',
                children: 'children'
              })
            }]
            save('ngw_rule_org_tree', res = {
              map: res,
              list: self.$store.state.orgs.orgByCurryOrg
            })
            push()
          }).catch(() => {
            reject()
          })
        } else {
          push()
        }

        function push() {
          let res = get('ngw_rule_org_tree')
          if(needList === false) {
            resolve(res.map)
          } else {
            resolve(res)
          }
        }
      })
    },
    /**
     * 批量获取字典
     * @function getDict
     * @desc 批量根据TYPE获取字典数据, 另有this.dictLoading可用于判断所有字典是否已获取完成
     * @param  {Array} types 字典TYPE数组
     * @param  {Boolean} needMap 返回值是否为MAP模式, 默认:true
     * @return {Promise}     承诺回调, 第一参数:根据needMap返回list或map
     */
    getDict(types, needMap = true) {
      let self = this
      return new Promise(function (resolve, reject) {
        let resCount = 0,
          typesLen = types.length
        self.dictLoading = true
        if(types instanceof Array) {
          let next = (getNextDict) => {
            resCount++
            if(resCount === typesLen) {
              self.dictLoading = false
              if(needMap === false) {
                resolve(self.$store.getters.dictList)
              } else {
                resolve(self.$store.getters.dictMap)
              }
            } else {
              getNextDict()
            }
          }
          // by lgs此处应使用递归，判断store中有则用store中的，没有则请求数据
          // 原先使用的是forEach循环，会存在同步和异步并存的情况，例如倒数第二个是异步，最后一个是同步，
          // 则返回的数据可能会不等倒数第二个请求完就resolve返回，造成数据丢失
          (function getNextDict() {
            let type = types[resCount]
            if(!self.$store.getters.dictList.find(d => d.type === type)) {
              self.dispatch(GET_SYS_DICT_BY_TYPE, {
                DictType: type
              }).then(d => {
                let res = {
                  type: type,
                  children: [...self.$store.getters.dict]
                }
                self.$store.commit('pushDict', res)
                next(getNextDict)
              })
            } else {
              next(getNextDict)
            }
          })()
        } else {
          console.log('getDict参数错误,第一参数为Array');
          reject()
        }
      })
    },
    /**
     * 单位层级下拉选择
     * @function getCascaderDict
     * @param  {String} [parentOrgId=''] 根级orgId
     * @return {Promise}                 承诺回调, 第一参数: 分层单位list, 第二参数:当前用户orgId
     */
    getCascaderDict(parentOrgId = '') {
      let self = this
      return new Promise(function (resolve, reject) {
        self.dispatch(FETCH_SYS_ORG_BY_CURRY_ORG, { orgId: parentOrgId || self.userOrgInfo.mainOrg.DeptNo }).then(() => {
          resolve(self.$store.getters.cascaderDept, self.userOrgInfo.mainOrgId)
        }).catch(() => {
          reject()
        })
      })
    },
    getCascaderNative() {
      let self = this
      return new Promise(function (resolve, reject) {
        if(get('ngw_cascader_native') === null) {
          self.dispatch(GET_SYS_DICT_BY_TYPE, { DictType: 'XZQHDM' }).then(() => {
            save('ngw_cascader_native', self.$store.getters.cascaderNative)
            push()
          }).catch(() => {
            reject()
          })
        } else {
          push()
        }

        function push() {
          resolve(get('ngw_cascader_native'))
        }
      })
    },
    /**
     * 获取当前用户所属单位信息
     * @function getUserDept
     * @return {Promise} 承诺回调, 第一参数: 前用户所属单位信息对象
     */
    getUserDept() {
      let self = this
      return new Promise(function (resolve, reject) {
        self.dispatch(GET_DEPT_DICTS_LIST).then(() => { // 所属单位选择
          resolve(self.$store.getters.userDept)
        }).catch(() => {
          reject()
        })
      })
    },
    getFileIconByType(type) {
      let res
      switch(type) {
        case 'doc':
          res = 'icon-word'
          break;
        case 'xls':
          res = 'icon-excel'
          break;
        case 'xlsx':
          res = 'icon-excel'
          break;
        case 'txt':
          res = 'icon-TXT'
          break;
        case 'jpg':
          res = 'icon-jpg'
          break;
        default:
          res = 'icon-note'
      }
      return res
    },
    /**
     * 确认提示框
     * @function confirm
     * @param  {String} [msg='此操作将永久删除该数据，是否继续？'] 消息内容
     * @param  {String} [title='温馨提示']            标题
     * @param  {String} [type='warning']          消息类型
     * @return {$confirm}                           确认提示框
     */
    confirm(msg = '此操作将永久删除该数据，是否继续？', title = '温馨提示', type = 'warning') {
      return this.$confirm(msg, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: type
      })
    },
    /**
     * 用户注销
     * @function logout
     * @param  {Boolean} [jump=true] 清除登录信息后是否跳转到登录页
     */
    logout(jump = true) {
      let info = getSiteInfo()
      if(!info || !info.NET_HOST || !this.userData.UserToken) {
        // this.$alert('获取网站配置失败, 请重新登录!', '温馨提示');
        this.returnLogin()
      } else {
        this.$http.get(`http://${info.NET_HOST}:${info.NET_PORT}/jwy/Login/LoginOut?token=${this.userData.UserToken}`).then((res) => {
          this.$message({
            message: '退出成功, 即将跳转至登录页面！',
            type: 'success'
          });
          this.clearUserInfoFromStorage(jump);
        }).catch(() => {
          this.$message({
            message: '退出异常！',
            type: 'warning'
          })
        })
      }
    },
    /**
     * 跳转到登录页
     * @desc 添加回跳链接, URl添加参数'url=...'
     * @function returnLogin
     */
    returnLogin() {
      this.$router.push({ name: '登录页', query: { url: encodeURIComponent(getReturnPath(this.$route)) } })
    },
    /**
     * 清除用户登录信息
     * @function clearUserInfoFromStorage
     * @param  {Boolean} [jump=true] 清除登录信息后是否跳转到登录页
     */
    clearUserInfoFromStorage(jump = true) {
      removeLoginUser();
      clear();
      if(jump === true) this.returnLogin()
      this.$store.commit('changeTipsingState', false)
    },
    historyBakc() {
      window.history.back()
    },
    /**
     * 高亮命中关键字
     * @function heightLightElms
     * @desc 命中关键字通过'<mark>'包裹, 结果字符串请使用v-html应用到页面
     * @param  {String} val 需处理的源字符串
     * @param  {String|Array} key 关键字
     * @return {String}     处理过后的结果字符串
     */
    heightLightElms(val, key) {
      if(!key) {
        key = this.$route.query.keyword || this.$route.query.key || null
      }
      if((typeof val) === 'string' && key) {
        if(key instanceof Array && key.length > 0) {
          key.forEach(k => {
            replaceKeyword(k)
          })
        } else {
          replaceKeyword(key)
        }
      }

      return val

      function replaceKeyword(word) {
        val = val.replace(new RegExp(word.replace(/^\||\|$/, ''), 'gi'), function (subval) {
          return '<mark>' + subval + '</mark>';
        });
      }
    },
    /**
     * 匹配对标字段
     * @function getColumnsType
     * @desc {
     *    idCard:'身份证',
     *    plateNum:'车牌号',
     *    caseNum:'案件编号',
     *    tel:'电话号码'
     * }
     * @param  {String} val 公安对标码
     * @return {String}     匹配类型
     */
    getColumnsType(val) {
      let props = {
        // DE00002: 'name', // 姓名
        // DE00059: 'name', // 姓名
        // DE00029: 'name', // 姓名
        DE00618: 'idCard', // 身份证
        DE00001: 'idCard', // 身份证
        DE00692: 'idCard', // 身份证
        DE00085: 'idCard', // 身份证
        DE00307: 'plateNum', // 车牌号
        DE00092: 'caseNum', // 案件编号
        DE00216: 'tel', // 电话号码
        DE00214: 'tel', // 电话号码
        DE00215: 'tel', // 电话号码
        DE00908: 'tel' // 电话号码
        // DE00241: 'bankAccount', // 银行账号
        // DE01001: 'qq', // QQ号码
        // DE00082: 'email' // 电子邮箱
      }
      return props[val] || null
    },
    submitFormLoading() {
      this.submitLoading = true
    },
    /**
     * 页面跳转
     * @function jumpTo
     * @desc 专为单页应用而设, 如mode为true并且url首字匹配'http'则直接新窗口打开第三方链接
     * @param  {String}  [url='']     目标URL
     * @param  {Boolean} [mode=false] 是否新窗口打开
     * @param  {String}  [alias='']   总线名称,用于权限验证
     */
    jumpTo(url = '', mode = false, alias = '') {
      if(alias !== '' && this.checkRule(alias) === false) {
        return false
      }
      if(!get('permission_' + url.split('/')[1])) {
        save('permission_' + url.split('/')[1], { id: '', name: '' }); // 对应菜单权限
      }
      if(url !== '') {
        // console.log('655', url)
        if(!mode) {
          this.$router.push(url)
        } else {
          if(url.indexOf('/#') !== 0 && url.indexOf('http') !== 0) {
            url = '/#' + url
          }
          // console.log(url)
          window.open(url)
        }
      }
    },
    /**
     * 总线权限验证
     * @function checkRule
     * @param  {String}  alias          总线名称
     * @param  {Boolean} [noTips=false] 禁用无权提示
     * @return {Boolean}                验证结果
     */
    checkRule(alias, noTips = false) {
      if(!alias) {
        return true
      } else {
        // console.log(this.$store.getters.userActionMap, 'this.$store.getters.userActionMap[alias]');
        if(this.$store.getters.userActionMap[alias] === true) {
          return true
        } else {
          console.log('总线权限不足, rule_alias: ' + alias, noTips)
          if(noTips === false) {
            this.ruleTips()
          }
          return false
        }
      }
    },
    /**
     * 案件研判点击创建人规则权限验证
     * @function checkUserRuleCase
     * @param  {String}  alias         总线名称
     * @param  {String}  caseId        案件Id
     * @param  {Boolean} [noTips=true] 禁用无权提示
     * @param  {String}  [cjrId='']    案件创建人ID
     * @return {Boolean}               验证结果
     */
    checkUserRuleCase(alias, caseId, noTips = true, cjrId = '') {
      let _loginUserId = getLoginUser().UserData.UserId // 获取登录用户Id
      if(_loginUserId === getAdminUser().userId || !alias) { // 判断是否为管理员
        return true
      } else if(_loginUserId === cjrId || !alias) { // 判断登录用户是否为创建人
        return true
      } else {
        let _caseCheckRule = sessionGet('ngw_actions_u_' + _loginUserId + '_c_' + caseId)
        if(this.checkRule(alias) && (_caseCheckRule && _caseCheckRule[alias])) {
          return true
        } else {
          console.log('研判权限不足, rule_alias: ' + alias)
          if(noTips === false) {
            this.ruleTips()
          }
          return false
        }
      }
    },
    /**
     * 案件研判点击规则权限验证
     * @function checkRuleCase
     * @param  {String}  alias         总线名称
     * @param  {String}  caseId        案件Id
     * @param  {Boolean} [noTips=true] 禁用无权提示
     * @return {Boolean}               验证结果
     */
    checkRuleCase(alias, caseId, noTips = true) {
      let _loginUserId = getLoginUser().UserData.UserId // 获取登录用户Id
      if(_loginUserId === getAdminUser().userId || !alias) { // 判断是否为管理员
        return true
      } else {
        let _caseCheckRule = sessionGet('ngw_actions_u_' + _loginUserId + '_c_' + caseId)
        if(this.checkRule(alias) && (_caseCheckRule && _caseCheckRule[alias])) {
          return true
        } else {
          console.log('研判权限不足, rule_alias: ' + alias)
          if(noTips === false) {
            this.ruleTips()
          }
          return false
        }
      }
    },
    /**
     * 权限提示
     * @function ruleTips
     * @param  {String} [msg='你没权限进行此操作'] 提示内容
     */
    ruleTips(msg = '你没权限进行此操作') {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true
      })
    },
    /**
     *  gochart组件切换layout
     * @function setLayout
     * @param {String} layout名称
     * @param {String} 目标元素ref名称
     */
    setLayout(name, ref) {
      this.goOptions.layout = name
      if(this.$refs[ref] instanceof Array) {
        this.$refs[ref][0].initMaker()
      } else {
        this.$refs[ref].initMaker()
      }
    },
    /**
     * 删除对象内为空的键
     * @function delEmpey
     * @param  {Object} queryForm 目标对象
     * @return {Object}           处理结果对象
     */
    delEmpey(queryForm, filterInt = false) {
      for(let d in queryForm) {
        if(queryForm[d] === '' || (filterInt === true && queryForm[d] === 0)) {
          delete queryForm[d]
        }
      }
      return queryForm
    },
    /**
     * 日期时间段拆分及格式化
     * @function dateFormat
     * @param  {Date} date 时间
     * @param  {String} fmt 格式,如'yyyy-MM-dd'
     * @return {String}      格式化结果
     */
    dateFormat(date, fmt) { // author: meizz
      if(!date) {
        return date
      }
      var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
      };
      if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      for(let k in o) {
        if(new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
      return fmt;
    },
    /**
     * 获取车辆形象图
     * @function getCarImage
     * @param  {String} [brand='']   车辆品牌
     * @param  {String} [version=''] 车辆型号
     * @return {String}              远程车辆形象图链接
     */
    getCarImage(brand = '', version = '') {
      let res
      // if(version) {
      //   res = `${this.carVersionPath}/${version}.png`
      // } else if(brand) {
      //   res = `${this.carBrandPath}/${brand}.png`
      // } else {
      res = '/static/img/default-car.jpg'
      // }
      return res
    }
  },
  updated() {
    this.$nextTick(() => {
      let $target = this.$('.user-bg')
      //  && $target.css('background-image') && $target.css('background-image') === 'none'
      if($target) {
        // 用户背景 this.userBgSrc
        $target.css({
          'background-image': `url(${LOGIN_HOST + '/sys/GetUserWatermark?w=400&h=200&a=1&r=220&g=220&b=220&rotate=-20&isBold=false&token=' + this.userData.UserToken})`
        })
      }
    })
  }
}
