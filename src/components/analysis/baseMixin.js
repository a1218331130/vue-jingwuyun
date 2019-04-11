import mixin from '../../utils/mixin'
// import {clone} from '../../utils/util'
import '../../utils/dateFormat'
import sideRightBox from '../../widgets/right-toolbar/side-right-box.vue'
import rightToolbar from '../../widgets/right-toolbar/right-toolbar.vue'
import importDialog from '../../widgets/import-dialog/import-dialog'
import dialogCase from './dialog-case'

export default {
  mixins: [mixin],
  components: {
    sideRightBox,
    importDialog,
    dialogCase,
    rightToolbar
  },
  data() {
    return {
      caseDialog: false,
      caseId: '',
      currentComm: 'detail',
      deliveryNumber: { name: '', keyVal: '', guid: '' },
      miniModel: true,
      showRightBar: false, // 当前侧栏窗体是否展开状态中继
      treeData: [],
      comm: null,
      dislogImport: false,
      fileInput: true,
      fileInfo: {
        name: '',
        title: '',
        type: '',
        file: null
      },
      fileTypes: ['csv', 'mdb', 'accdb', 'txt', 'xls', 'xlsx'],
      sidebarFocus: true
    }
  },
  props: {},
  computed: {},
  watch: {},
  methods: {
    updateDefaultTreeChecker(refName) {
      let self = this,
        nodes = []
      this.$refs[refName].setCheckedKeys([0], true)
      this.$nextTick(() => {
        nodes = this.$refs[refName].getCheckedNodes(true)
        if(nodes.length > 0) {
          pushActive(0)
        }
      })

      function pushActive(i) {
        self.pushTreeChecker(nodes[i]).then(res => {
          if(i < nodes.length - 1) {
            i++
            pushActive(i)
          }
        })
      }
    },
    pushTreeChecker(node) {
      let self = this
      return new Promise(function (resolve, reject) {
        self.rightTreeChange(node, true)
        setTimeout(() => {
          resolve('')
        }, 300)
      })
    },
    /**
     * 右侧对象勾选树勾选变化触发事件
     * @param data
     * @param state
     */
    rightTreeChange(data, state) {
      if(!data.children) { // 判断是否为末级目录
        // 勾选节点  添加标签节点
        let startTime = data.startTime,
          endTime = data.endTime;
        if(this.$route.path === '/analysis/locus') { // 轨迹分析默认7天时间
          let endTime = new Date().getTime() - 7 * 24 * 60 * 60 * 1000
          let d = new Date();
          d.setTime(endTime)
          let nowDay = new Date();
          startTime = this.dateFormat(d, 'yyyy-MM-dd')
          endTime = this.dateFormat(nowDay, 'yyyy-MM-dd')
        }
        this.deliveryNumber = {
          name: data.name,
          keyVal: data.label,
          guid: data.guid || data.id,
          state: state, // 节点操作状态
          startTime: startTime, // 最近90天时间点(话单默认最近90天)
          endTime: endTime // 当前日期
        }
        // 取消关联的数据
        if(!state) {
          let selfTreeDom = this.$refs['rightTree']
          selfTreeDom.getCheckedNodes().filter(d => !d.children).map(rmf => {
            if(rmf.label === this.deliveryNumber.keyVal) {
              this.$refs['rightTree'].setChecked(rmf, state, true)
            }
          })
        }
      }
    },
    switchRightBar(s) {
      // 外部操作更新窗体状态
      this.showRightBar = !this.showRightBar
    },
    commChange(target) {
      let checkedNodes = this.$refs.rightTree.getCheckedNodes().filter(d => !d.children)
      this.currentComm = target.comm
      setTimeout(() => {
        let targetCommDom = this.$refs[this.currentComm]
        let rightTreeDom = this.$refs['rightTree']
        if(targetCommDom.tabs.length === 0 && checkedNodes.length > 0) {
          checkedNodes.forEach(d => {
            targetCommDom.addCommTab({
              name: d.name,
              guid: d.guid || d.id,
              keyVal: d.label,
              startTime: d.startTime,
              endTime: d.endTime
            })
          })
        } else if(targetCommDom.tabs.length > 0) {
          rightTreeDom.setCheckedKeys([], false)
          if(targetCommDom.singleTab === true) {
            rightTreeDom.setCheckedKeys(targetCommDom.tabs[0].guid.map(d => d), true)
          } else {
            rightTreeDom.setCheckedKeys(targetCommDom.tabs.map(d => d.guid), true)
          }
        }
      }, 300)
    },
    updateDateBox(val) {},
    importFile() {
      this.$refs.importUploadBtn.click()
    },
    leadIn() {
      this.$refs.conversionUploadBtn.click()
    },
    commonManage(val) {
      this.currentComm = val;
      this.sidebarFocus = false;
    },
    conversion(val) {
      this.currentComm = val;
      this.sidebarFocus = false;
    },
    focusChange() {
      this.sidebarFocus = true;
    },
    clearFileInput(reload) {
      if(reload === true && this.reload) {
        this.reload()
      }
      this.fileInput = false
      setTimeout(() => {
        this.fileInput = true
      }, 300)
      this.dislogImport = false
    },
    fileChange(elm, importType = 1) {
      let file = elm.target.files[0],
        fileTypeArr = file.name.split('.'),
        fileType = fileTypeArr[fileTypeArr.length - 1]
      if(file.size > 1024 * 1024 * 100) {
        this.$alert('文件不能大于100MB', '温馨提示');
      } else if(!this.fileTypes.find(d => d === fileType)) {
        this.$alert('只支持 CSV/EXCEL/TXT/ACCESS 文件', '温馨提示');
      } else {
        this.fileInfo = {
          name: file.name,
          title: `${(importType === 1 ? '话单导入' : '账单导入')}-${file.name}`,
          type: fileType,
          file: file
        }
        this.dislogImport = true
      }
    }
  },
  created() {
    this.caseId = this.$route.query.caseId || '' // 初始化获取案件id},
  },
  mounted() {
    this.showRightBar = true
  }
}
