import { mapState } from 'vuex'
import mixin from '../../../utils/mixin'
import {
  FETCH_CASE_REPORT_VERSION,
  GET_CASE_REPORT_VERSION,
  UPDATE_CASE_REPORT_VERSION,
  REMOVE_CASE_REPORT_VERSION
} from '../../../store/types'
import { clone, outerHeight } from '../../../utils/util'
export default {
  mixins: [mixin],
  computed: {
    ...mapState(['caseReportVersion'])
  },
  data() {
    return {
      caseChartImgShow: false,
      pageInfo: { // 页面分页信息相关配置
        count: 10000,
        limit: 10000,
        currentpage: 1
      },
      snapshot: { // 研判报告快照参数初始化
        isTF: false,
        name: '研判报告',
        height: 0,
        el: document.body
      },
      initLoading: true,
      initLoadingContent: true,
      reportList: [],
      reportContent: {}, // 当前选择报告的内容
      initLoadingText: '',
      caseId: '' // 案件ID
    }
  },
  methods: {
    /**
     * 根据报告ID查询当前显示的报告
     * @param ById
     */
    queryReportById(ById) {
      if(ById) {
        this.initLoadingContent = true
        this.reportContent = {}
        this.initLoadingText = '报告信息初始化...'
        this.dispatch(GET_CASE_REPORT_VERSION, {
          id: ById
        }).then(bSu => {
          this.initLoadingText = '报告信息初始化成功！'
          this.reportContent = this.caseReportVersion.getCaseReportVersion.data ? JSON.parse(this.caseReportVersion.getCaseReportVersion.data) : null;
          this.reportContent['xinfo'].map(item => {
            this.$set(item, 'flag', false)
          })
          this.initLoadingText = '完成'
          this.initLoading = false
          this.initLoadingContent = false
          this.$nextTick(() => {
            if(this.$refs.zcdt) {
              this.$refs.zcdt.dataModel()
            }
          })
        })
      }
    },
    /**
     * 获取研判报告历史列表
     */
    queryReportList() {
      this.initLoadingText = '报告列表初始化...'
      this.dispatch(FETCH_CASE_REPORT_VERSION, {
        ajid: this.caseId,
        PageIndex: this.pageInfo.currentpage,
        PageSize: this.pageInfo.limit
      }).then(su => {
        this.initLoadingText = '报告列表初始化成功！'
        this.reportList = this.caseReportVersion.fetchCaseReportVersion.PageData.map((rl, rIndex) => {
          if(rIndex === 0) {
            this.selectReport(rl.id) // 默认选中第一个数据
          }
          return rl
        })
        if(!(this.reportList.length > 0)) {
          this.initLoading = false
        }
      })
    },
    /**
     * 历史研判报告数据更新
     * @param obj
     */
    updateReport(obj) {
      this.reportContent = this.caseReportVersion.getCaseReportVersion.data ? JSON.parse(this.caseReportVersion.getCaseReportVersion.data) : null
      if(!obj.type) {
        console.error('请指定更新数据参数类型type', obj)
      } else {
        this.reportContent[obj.type] = obj.data
        let _tempOption = clone(this.caseReportVersion.getCaseReportVersion)
        _tempOption.data = JSON.stringify(this.reportContent)
        this.dispatch(UPDATE_CASE_REPORT_VERSION,
          _tempOption
        ).then(() => {
          this.$message({
            message: (obj.text || '报告数据操作处理') + '成功!',
            type: 'success'
          })
          this.queryReportById(_tempOption.id)
          let arr = obj.modelType.split('-')
          this.$emit('update:Data', { type: arr[0], model: arr[1] })
        })
      }
    },
    /**
     * 添加删除社会关系时,时时跟新数量数据
     * @param {any}
     */
    updataData(val) {
      let count = 0;
      let obj = this.$refs['wrnTextRef_' + val.model][0]
      if(val.type === 'add') {
        count = parseInt(obj.innerText) + 1
      } else {
        count = parseInt(obj.innerText) - 1
      }
      obj.innerText = count;
    },
    /**
     * 根据报告id 删除历史报告
     * @param rId
     */
    removeGetById(rId, title = '') {
      if(title) {
        title = '【' + title + '】'
      }
      if(rId) {
        this.$confirm('确认删除报告' + title + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dispatch(REMOVE_CASE_REPORT_VERSION, {
            id: rId
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除历史报告成功！'
            })
            this.queryReportList()
          })
        })
      }
    },
    /**
     * 快照导出触发
     * 用了jq $
     */
    exportSnapshot(r) {
      this.caseChartImgShow = true;
      this.exportSnapshotFlag = true;
      this.$nextTick(() => {
        let _tDom = this.$('#' + r).clone().appendTo(document.body)
        if(_tDom) {
          this.$('.handle-tool').css({ 'display': 'none' })
          this.$('.add-box-button').css({ 'display': 'none' })
          _tDom.css('width', this.$('#' + r).width());
          this.snapshot.height = outerHeight(_tDom[0])
          this.snapshot.el = _tDom[0]
          this.$nextTick(_ => {
            this.snapshot.isTF = true
          })
        }
      })
    },
    generateState(type) {
      this.caseChartImgShow = false;
      this.exportSnapshotFlag = false;
      // 快照生成结束,状态重置
      this.$('.handle-tool').css({ 'display': 'block' })
      this.$('.add-box-button').css({ 'display': 'block' })
      this.gochartsFlag = true
      this.snapshot.isTF = false
      setTimeout(() => {
        this.$(this.snapshot.el).remove();
      }, 500)
    }
  },
  created() {
    this.caseId = this.$route.query.a // 初始化获取案件id
    // this.removeGetById('d896b4bc9c9544e58f397e337cdab138')
  }
}
