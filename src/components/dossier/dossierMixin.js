import { mapState } from 'vuex'
import bus from '../../utils/bus'
import mixin from '../../utils/mixin'
import { REMOVE_DOSSIER_INFO } from '../../store/types'
export default {
  mixins: [mixin],
  computed: {
    ...mapState(['caseReportVersion'])
  },
  data() {
    return {
      subData: [], // 初始化左侧标题
      isChangeMenuTitle: true, // 是否可以切换标题
      isChangeMenuScrollTop: 0, // 当前切换标题的距离
      rollDict: [], // 滚动数据集合
      socketTableList: [], // socket 追加数据列表
      dossierKey: '', // 案件关键字
      fdjhm: '', // 发动机号
      clxh: '', // 车辆型号
      expandMark: false // 收起展开标志
    }
  },
  methods: {
    /**
     * 页面滚动操纵
     * @param rollStart 开始scrollTop
     * @param rollEnd  结束scrollTop
     * @param title 当前选中的标签名
     * @param refsR 当初操纵的父节点ref 名
     */
    rollAnimation(rollStart, rollEnd, title, refsR) {
      let parentDom = this.$('#' + refsR)[0]
      let _stepL = 60
      let stepLength = rollEnd - rollStart
      if(stepLength > 0) {
        let st = setInterval(_ => {
          if(rollStart >= rollEnd) {
            parentDom.parentNode.scrollTop = rollEnd
            clearInterval(st)
          }
          rollStart += stepLength / _stepL
          parentDom.parentNode.scrollTop = rollStart
        }, 1)
      } else {
        stepLength = (rollStart - rollEnd) / _stepL
        let st = setInterval(_ => {
          if(rollEnd >= rollStart) {
            clearInterval(st)
          }
          rollStart -= stepLength
          parentDom.parentNode.scrollTop = rollStart
        }, 1)
      }
    },
    /**
     * 滚动监控
     * @param refsR
     */
    parentNodeScroll(refsR) {
      let parentDom = this.$('#' + refsR)[0]
      if(parentDom) {
        parentDom.parentNode.addEventListener('scroll', it => { // 页面滚动监控
          this.updateRollDict(refsR)
        })
      }
    },
    /**
     * 档案接口请求代理,方便对单个数据请求成功后,处理附加事件
     * @param type
     * @param data
     */
    dispatchDossier(type, data) {
      return this.dispatch(type, data).then(_ => {
        // console.log('当前请求>>>', type, data)
      })
    },
    /**
     * 最近一年
     */
    defaultDatePicker() {
      let _formatT = (ft) => {
        return [(ft.getFullYear() - 1) + '-' + (ft.getMonth() + 1) + '-' + ft.getDate(), ft.getFullYear() + '-' + (ft.getMonth() + 1) + '-' + ft.getDate()]
      }
      const end = new Date()
      return _formatT(end)
    },
    /**
     * 更新页面滚动数据字典
     * @param refsR
     */
    updateRollDict(refsR = 'dossier-list-ref', title = null) {
      let parentDom = this.$('#' + refsR)[0]
      if(parentDom) {
        this.rollDict = [] // 置空滚动历史数据
        for(let iIndex = 0; iIndex < parentDom.children.length; iIndex++) {
          let iDom = parentDom.children[iIndex]
          this.rollDict.push({
            title: iDom.title,
            scrollTop: iDom.offsetTop
          })
          if(parentDom.parentNode && parentDom.parentNode.scrollTop + 150 >= iDom.offsetTop) { // 实时调整左侧滚动数据标签
            bus.$emit('update:dossierThisSubTitle', iDom.title)
          }
          if(title && title === iDom.title) { // 点击左侧标签 操作右侧滚动距离
            this.rollAnimation(parentDom.parentNode && parentDom.parentNode.scrollTop, iDom.offsetTop - 50, title, 'dossier-list-ref')
            return false
          }
        }
      }
    },
    /**
     * 点击左侧菜单 切换
     * @param title
     */
    menuChangeClick(title) {
      this.updateRollDict('dossier-list-ref', title)
    },
    /**
     * 自定义列表数据删除
     * @param id 数据id
     * @param type 数据类型
     */
    dossierDeLInfo(tId = null, tType = null, callback = () => {}) {
      if(tId && tType) {
        this.$confirm('确认删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dispatchDossier(REMOVE_DOSSIER_INFO, {
            id: tId,
            type: tType
          }).then(() => {
            this.$message({
              message: '删除操作成功！',
              type: 'success'
            })
            callback()
          })
        })
      }
    },
    /**
     * 档案列表Socket追加栏目
     */
    dossierSocketAppend(guid) {
      if(this.$connect) {
        this.$connect.on('SearchProcess', (res) => {
          if(guid === res.SearchEntity.NotifyID && res.Total > 0) {
            let data = [...res.SearchDatas][0]
            data['list'] = []
            data['columns'] = []
            data['viewColumns'] = []
            data['loading'] = false
            data['showList'] = false
            this.socketTableList.push(data)
            // 左侧菜单列表
            // this.subData.push({ title: data.TableInfo.ZyName })
            // bus.$emit('update:dossierSubTitle', this.subData)
          }
        })
      }
    },
    updateExpand(data) {
      this.expandMark = data
    }
  },
  updated() {
    this.$nextTick(() => {
      this.updateRollDict() // 页面结构变动 更新滚动页面字典数据
    })
  },
  created() {
    let transParamArray = this.$route.query.key.split('|')
    this.dossierKey = transParamArray[0] // 初始化获取证件号码
    let arr1 = this.$route.path.split('/')
    if(arr1[arr1.length - 1] === 'car') {
      this.fdjhm = transParamArray[1] // 发动机号
      this.clxh = transParamArray[2] // 车辆型号
      if(!this.fdjhm) {
        this.$message('该车无发动机号,部分数据无法查询', '温馨提示')
        return
      } else if(!this.clxh) {
        this.$message('无车辆型号,部分数据无法查询', '温馨提示')
        return
      }
    }
    window.addEventListener('resize', (e) => { // 监控窗体改变,根据滚动数据
      this.updateRollDict()
    })
  }
}
