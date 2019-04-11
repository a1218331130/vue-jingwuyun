import { mapState } from 'vuex'
import { tableFill } from '../../utils/util'

export default {
  components: {
    //
  },
  data() {
    return {
      steer: null,
      formDialog: false,
      detailDialog: false,
      detailId: null,
      detailType: null,
      listType: '', // tab.id 列表类型(1:待审批,2:待签收/已审批,3:待反馈,4:待评论,5:已完成)
      list_1: { count: 0, currentpage: 1, children: [] }, // 待审批列表
      list_2: { count: 0, currentpage: 1, children: [] }, // 待签收/ 已审批 列表
      list_3: { count: 0, currentpage: 1, children: [] }, // 待反馈列表
      list_4: { count: 0, currentpage: 1, children: [] }, // 待评价列表
      list_5: { count: 0, currentpage: 1, children: [] }, // 已完成列表
      list_draft: { count: 0, currentpage: 1, children: [] }, // 草稿列表
      typeRuleMap: {
        0: 'Xtbg/GetJbxxData',
        1: 'Xtbg/SignReject',
        2: 'Lcgl/GoNext',
        3: 'Xtbg/Assign',
        4: 'Xtbg/Evaluate',
        5: 'Xtbg/Feedback'
      },
      pagenav: {
        currentpage: 1,
        limit: 100
      },
      isChangeListType: false,
      showRightBar: false, // 当前侧栏窗体是否展开状态中继
      dictList: null,
      screen: {
        queryForm: {
          keyword: '',
          applyTime: '',
          assistType: '',
          level: '',
          org: ''
        },
        options: [{
          title: '关键字',
          prop: 'keyword',
          type: 'input'
        }, {
          title: '协查类型',
          prop: 'assistType',
          type: 'select',
          children: []
        }, {
          title: '紧急程度',
          prop: 'level',
          type: 'select',
          children: []
        }, {
          title: '申请时间',
          prop: 'applyTime',
          type: 'daterange'
        }]
        // {
        //   title: '协查单位',
        //   prop: 'org',
        //   type: 'select',
        //   display: true,
        //   defaultValue: '',
        //   children: []
        // },
      }
    }
  },
  computed: {
    count() {
      let res
      if (this.listType === '') {
        res = 0
      } else {
        res = this['list_' + this.listType].count
      }
      return res
    },
    list() {
      let res
      if (this.listType === '') {
        res = []
      } else {
        res = this['list_' + this.listType].children
      }
      return res
    },
    ...mapState(['union'])
  },
  watch: {
    listType(v) {
      this.isChangeListType = true
      let list = this['list_' + v]
      this.pagenav.currentpage = list.currentpage
      if (list.children.length === 0) {
        this.fetchList()
      }
      setTimeout(() => {
        this.isChangeListType = false
      }, 100)
    },
    pagenav: {
      handler() {
        this['list_' + this.listType].currentpage = this.pagenav.currentpage
        if (this.isChangeListType === false) {
          this.fetchList()
        }
      },
      deep: true
    }
  },
  methods: {
    reload() {
      this.getCounts()
      if (this.pagenav.currentpage === 1) {
        this.fetchList()
      } else {
        this.pagenav.currentpage = 1
      }
    },
    updatePage(v) {
      this.pagenav.currentpage = v.currentpage
    },
    callDetailDialog(type, id, all) {
      if (this.checkRule(this.typeRuleMap[type]) === true) {
        this.detailType = type
        this.detailId = id || null
        this.detailDialog = true
        this.steer = all
      }
    },
    searchSubmit(obj) {
      // 条件筛选
      // let checker = false
      // for (let item in obj) {
      //   if (obj[item] !== '') checker = true
      // }
      // if (checker === true) {
      this.screen.queryForm = obj
      this.reload()
      // }
      this.showRightBar = false
    },
    switchRightBar() {
      // 右侧窗体状态操作
      this.showRightBar = !this.showRightBar
    }
  },
  mounted() {
    this.listType = '1'

    // 字典
    this.getDict(['JZLX', 'JJCD']).then(res => {
      this.dictList = res
      this.screen.options.find(d => d.prop === 'assistType').children = this.dictList.JZLX
      this.screen.options.find(d => d.prop === 'level').children = this.dictList.JJCD
    })

    // 合计数
    this.getCounts()

    let heightDiff = this.$(window).height() - 60 - 40 - 68
    tableFill(this.$, false, false, heightDiff)
    window.addEventListener('resize', (e) => {
      tableFill(this.$, false, false, heightDiff)
    })
  }
}
