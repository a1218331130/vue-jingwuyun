// import { mapState } from 'vuex'
import mixin from '../../utils/mixin'
import {
  // arrayGetRid,
  closestRef,
  clone
} from '../../utils/util'

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      fullScreenStyle: '',
      chartIsFullScreen: false, // 图表是否全屏显示,与fullScreen方法搭配使用,暂时一个页面只支持一个图表
      singleTab: false,
      noConnectCase: false,
      tabName: '分析工具',
      baseQueryForm: { keyword: '' },
      currentTab: 0,
      tabs: [],
      mainList: [],
      count: 0,
      pagenav: {
        currentpage: 1,
        limit: 500
      },
      showRightBar: false, // 当前侧栏窗体是否展开状态中继
      logicOps: [{
        label: '大于等于',
        value: '>='
      }, {
        label: '小于等于',
        value: '<='
      }],
      goOptions: {
        readOnly: false,
        allowZoom: true,
        layout: 'TreeLayout'
      },
      resBox: false,
      detailBox: false,
      mainGo: null,
      diagram: null,
      /**
       * [data 模型数据对象(最终结果)]
       * @type {Object}
       */
      goData: {
        nodeDataArray: [],
        linkDataArray: []
      }
    }
  },
  props: {
    deliveryNumber: {
      type: Object,
      default: () => {
        return null
      }
    },
    currentComm: {
      type: String,
      default: ''
    }
  },
  computed: {
    currentTabItem() {
      let res = null
      if(this.tabs.length > 0 && this.tabs[this.currentTab]) {
        res = this.tabs[this.currentTab]
      }
      return res
    },
    elTab: {
      get() {
        return `${this.currentTabItem.keyVal}|${this.currentTabItem.name}`
      },
      set(val) {}
    },
    chartStyle() {
      if(this.chartIsFullScreen) {
        return `height:${document.documentElement.clientHeight - 110}px`
      } else {
        let height = document.documentElement.clientHeight - 500;
        return `height:${height}px`
      }
    }
  },
  watch: {
    currentTab(val) {
      let target = this.tabs[val];
      if(target) {
        if(this.pageInfo) {
          this.pageInfo.count = target.count;
        }
      }
    },
    pagenav: {
      handler() {
        this.fetchList()
      },
      deep: true
    },
    currentComm(val) {
      if(val === this.commName && this.noConnectCase === true && this.tabs.length === 0) {
        this.addEmptyTab()
      }
    },
    deliveryNumber: {
      handler(val) {
        if(val) {
          this.commTabChange(val)
        }
      },
      deep: true
    }
  },
  methods: {
    /**
     * 金额大于0 ,且为整数
     */
    moneyChange(tM, queryForm) {
      // return tM ? parseFloat(Math.abs(tM)).toFixed(2) : tM
      if(queryForm.maxAmount && queryForm.minAmount) {
        if(parseInt(queryForm.maxAmount) < parseInt(queryForm.minAmount)) {
          this.$alert('金额最大值必须大于等于最小值', '温馨提示')
        }
      }
      return tM ? parseInt(tM) : tM
    },
    /**
     * 默认填充时间 最近一天
     */
    defaultDatePicker() {
      let _formatT = (ft) => {
        // return ft.getFullYear() + '-' + (ft.getMonth() + 1) + '-' + ft.getDate()
        let Y = ft.getFullYear(),
          M = (ft.getMonth() + 1) < 10 ? '0' + (ft.getMonth() + 1) : (ft.getMonth() + 1),
          D = ft.getDate() < 10 ? '0' + ft.getDate() : ft.getDate()
        return Y + '-' + M + '-' + D
      }
      const end = new Date(),
        start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [_formatT(start), _formatT(end)]
    },
    addEmptyTab() {
      this.addCommTab({
        name: '',
        keyVal: this.tabName,
        names: [],
        vals: [],
        guid: ''
      })
    },
    /**
     * 公共Tabs 改变
     * @param val
     */
    commTabChange(val) {
      if(val && this.currentComm === this.commName && val.keyVal) {
        if(val.state) {
          this.addCommTab(val) // 增加tab
        } else {
          this.removeCommTab(val) // 删除tab
        }
      }
    },
    /**
     * [updateCurrentTab description]
     * @param  {[type]} item [description]
     */
    updateCurrentTab(item) {
      this.currentTab = parseInt(item.index || 0)
      // let target = this.tabs[this.currentTab];
      // if(target && target.mainList.length === 0) {
      //   this.query();
      // }
    },
    /**
     * 勾选增加tabs
     * @param val
     */
    addCommTab(val) {
      if(this.singleTab) { // 单标签页
        let tempCurrentTabs = []
        this.tabs.forEach(fr => {
          tempCurrentTabs = fr.vals
        })
        let startTime = this.dateFormat(new Date(val.startTime), 'yyyy-MM-dd')
        let endTime = this.dateFormat(new Date(val.endTime), 'yyyy-MM-dd')
        if(tempCurrentTabs.length === 0) {
          this.tabs.push({
            name: val.name,
            keyVal: val.keyVal,
            names: [val.name],
            vals: [val.keyVal],
            guid: [val.guid],
            queryForm: Object.assign(clone(this.baseQueryForm), {
              timeSlotArr: [val.startTime, val.endTime],
              timeSlot: [startTime, endTime] // by lgs页面首次添加时必须加上,否则会取baseQueryForm的默认值,其它的由于树选择会触发timeSlot改变
            }),
            startTimeList: [val.startTime],
            endTimeList: [val.endTime],
            mainList: [],
            secondList: [],
            thirdList: [],
            detail: null,
            chartData: null,
            count: 0,
            tabList: [{ // 基站分析接口数据处理
              name: val.name,
              label: val.keyVal,
              list: [],
              pgisList: []
            }],
            pagenav: {
              currentpage: 1,
              limit: 10
            }
          })
        } else if(!tempCurrentTabs.includes(val.keyVal)) {
          // 增加最早通话时间,从小到大排列,便于移除一项时找到新的最早通话时间,by chester
          this.tabs[0].startTimeList.push(val.startTime);
          this.tabs[0].startTimeList.sort((a, b) => {
            return new Date(a).getTime() - new Date(b).getTime();
          })
          // 增加最晚通话时间,从大到小排列,便于移除一项时找到新的最晚通话时间
          this.tabs[0].endTimeList.push(val.endTime);
          this.tabs[0].endTimeList.sort((a, b) => {
            return new Date(b).getTime() - new Date(a).getTime();
          })
          // 从最早时间列表和最晚时间列表得到新的最早和最晚日期
          this.tabs[0].queryForm.timeSlotArr = [this.tabs[0].startTimeList[0], this.tabs[0].endTimeList[0]];

          this.tabs[0].vals.push(val.keyVal)
          this.tabs[0].names.push(val.name)
          this.tabs[0].keyVal = this.tabs[0].vals.join(',')
          this.tabs[0].tabList.push({
            label: val.keyVal,
            list: []
          })
          this.tabs[0].guid.push(val.guid)
        }
        this.currentTab = 0
      } else {
        let tempCurrentTabs = []
        this.tabs.forEach(fr => {
          tempCurrentTabs.push(fr.keyVal)
        })
        let startTime = this.dateFormat(new Date(val.startTime), 'yyyy-MM-dd')
        let endTime = this.dateFormat(new Date(val.endTime), 'yyyy-MM-dd')
        let queryForm = null;
        queryForm = Object.assign(clone(this.baseQueryForm), {
          timeSlotArr: [val.startTime, val.endTime],
          timeSlot: [startTime, endTime]
        })
        if(!tempCurrentTabs.includes(val.keyVal)) {
          this.tabs.push({
            name: val.name,
            keyVal: val.keyVal,
            guid: val.guid,
            queryForm: queryForm,
            mainList: [],
            secondList: [],
            thirdList: [],
            detail: null,
            chartData: null,
            tabModel: '5',
            pagenav: {
              currentpage: 1,
              limit: 10,
              count: 0
            }
          })
          this.$emit('update:current-tab', '')
        }
        this.currentTab = this.tabs.length - 1
      }
    },
    /**
     * 勾选删除tabs
     * @param val
     */
    removeCommTab(val) {
      if(this.noConnectCase === true) {
        this.$message({
          type: 'error',
          message: '本工具不允许删除页签',
          showClose: true
        })
      } else if(this.singleTab === true) { // 单标签页
        if(this.tabs[0].vals.indexOf(val.keyVal) >= 0) { // 判断当前tabs 是否存在keyVal
          // 如果删除的时间是最早日期，则新的最早日期取第二早日期
          let newStartTime = val.startTime === this.tabs[0].startTimeList[0] ? this.tabs[0].startTimeList[1] : this.tabs[0].startTimeList[0];
          // 如果删除的日期是最晚日期，则新的最晚日期取第二晚日期
          let newEndTime = val.endTime === this.tabs[0].endTimeList[0] ? this.tabs[0].endTimeList[1] : this.tabs[0].endTimeList[0];
          // 得到新的最早日期和最晚日期
          this.tabs[0].queryForm.timeSlotArr = [newStartTime, newEndTime];

          this.tabs[0].startTimeList.splice(this.tabs[0].startTimeList.indexOf(val.startTime), 1)
          this.tabs[0].endTimeList.splice(this.tabs[0].endTimeList.indexOf(val.endTime), 1)
          this.tabs[0].vals.splice(this.tabs[0].vals.indexOf(val.keyVal), 1)
          this.tabs[0].names.splice(this.tabs[0].names.indexOf(val.name), 1)
          this.tabs[0].guid.splice(this.tabs[0].guid.indexOf(val.guid), 1)
          this.tabs[0].keyVal = this.tabs[0].keyVal.split(',').filter(d => d !== val.keyVal).toString()
          if(this.tabs[0].guid.length <= 0) { // 全部取消 就删除tabs
            this.tabs = []
          }
        }
      } else {
        this.tabs = this.tabs.filter((ts, tIndex) => {
          let _filT = ts.keyVal !== val.keyVal
          if(!_filT) {
            if(this.currentTab === tIndex) { // 判断是否删除为当前打开页
              this.currentTab = tIndex > 0 ? tIndex - 1 : 0 // 计算当前展开第几页
            } else {
              this.currentTab -= 1
            }
          }
          return _filT
        })
      }
    },
    /**
     * 删除指定标签
     * @param item
     */
    removeTab(item) {
      if(typeof item === 'string') {
        let itemArr = item.split('|'),
          itemKeyVal = itemArr[0],
          itemName = itemArr[1]
        item = this.tabs.find(t => t.keyVal === itemKeyVal && t.name === itemName)
      }
      let selfTreeDom = {}
      closestRef(this, 'rightTree', treeDOM => { // 获取右侧菜单树节点
        selfTreeDom = treeDOM
      })
      if(Array.isArray(item.guid)) { // 判断是否点击了多标签 批量删除
        this.$confirm('此操作将批量关闭分析对象,是否继续？', '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(selfTreeDom) {
            for(let iGuid in item.guid) {
              selfTreeDom.setChecked(item.guid[iGuid], false, true)
            }
          }
        })
      } else {
        if(selfTreeDom) {
          selfTreeDom.setChecked(item.guid, false, true)
        }
      }
    },
    reload() {
      this.getCounts()
      if(this.pagenav.currentpage === 1) {
        this.fetchList()
      } else {
        this.pagenav.currentpage = 1
      }
    },
    searchSubmit(obj) {
      // 条件筛选
      // let checker = false
      // for (let item in obj) {
      //   if (obj[item] !== '') checker = true
      // }
      // if (checker === true) {
      // this.screen.queryForm = obj
      this.reload()
      // }
      this.showRightBar = false
    },
    switchRightBar() {
      // 右侧窗体状态操作
      this.showRightBar = !this.showRightBar
    },
    updateTimeSlot(data, val, column = '') {
      if(column === '') {
        data.timeSlot = val !== '' ? val.split(' / ') : []
      } else {
        data[column] = val !== '' ? val.split(' / ') : []
      }
    },
    /**
     * 点击全屏按钮执行,主要是添加一个样式
     * @param {any} isFullScreen 是否全屏显示
     * @param {string} style 默认样式, 也可以不传
     */
    toggleFullScreen(isFullScreen, boxId,
      style = `position:absolute;
    top:60px;
    left:220px;
    right:0;
    bottom:0;
    z-index:11;
    background-color:#fff;
    margin-bottom: 0;
    `) {
      this.chartIsFullScreen = !isFullScreen;
      if(this.chartIsFullScreen) {
        this.fullScreenStyle = style;
      } else {
        this.fullScreenStyle = '';
      }
    }
  },
  mounted() {}
}
