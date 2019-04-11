import mixin from '../../../utils/mixin'

import importDialog from './import-dialog/import-dialog'

export default {
  mixins: [mixin],
  components: {
    importDialog
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
      fileTypes: ['csv', 'mdb', 'accdb', 'txt', 'xls', 'xlsx']
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
        this.deliveryNumber = {
          name: data.name,
          keyVal: data.label,
          guid: data.guid || data.id,
          state: state, // 节点操作状态
          startTime: data.startTime, // 最早通话日期
          endTime: data.endTime // 最晚通话日期
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
    importFile() {
      this.$refs.importUploadBtn.click()
    },
    commonManage(val) {
      this.currentComm = 'manage';
    },
    /*
      关闭dialog
    */
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
          title: `${(importType === 1 ? '数据比对' : '')}-${file.name}`,
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
