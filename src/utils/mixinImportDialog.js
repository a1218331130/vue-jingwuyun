import { mapState } from 'vuex'

import { UPLOAD_PATH_IMPORT } from '../config'
import { addClass, removeClass, arrayGetRid } from './util'
import userInfoMixin from './userInfoMixin'

export default {
  mixins: [userInfoMixin],
  components: {},
  data() {
    return {
      form: {
        fileType: null,
        break: '',
        sheet: '',
        isHeadInStartRow: true, // 是否首行头部
        beginRow: 1, // 数据起始行
        columns: []
      },
      isFirst: false,
      uploading: false,
      percentage: 0,
      timer: null,
      attachmentId: '',
      fileTypeOps: [{ label: 'CSV', value: 1 }, { label: 'TXT', value: 2 }, { label: 'EXCEL', value: 0 }, { label: 'ACCESS', value: 3 }],
      breakOps: [{ label: '半角逗号( , )', value: 1 }, { label: '空格', value: 2 }, { label: 'Tab', value: 0 }, { label: '竖线( | )', value: 3 }],
      sheetOps: [],
      columns: [],
      list: []
    }
  },
  props: ['dialog', 'title', 'file', 'cats', 'case'],
  computed: {
    disableBreak() {
      return this.form.fileType !== 2
    },
    disableSheet() {
      return this.form.fileType !== 0 && this.form.fileType !== 3
    },
    isCusBreak() {
      return !this.breakOps.find(d => d.value === this.form.break)
    },
    params() {
      let columnsIsSearch = []
      this.columns.forEach(d => {
        columnsIsSearch.push(!this.form.columns.find(c => c === d) === false)
      })
      return {
        FjId: this.attachmentId, // 附件ID
        FileType: this.form.fileType, // 附件类型； Excel = 0, Csv = 1, Txt = 2, Access = 3
        ColumnsIsSearch: columnsIsSearch,
        SheetName: this.form.sheet, // 选择的表名
        IsHeadInStartRow: this.form.isHeadInStartRow, // 是否首行头部
        BeginRow: this.form.beginRow, // 数据起始行
        Separator: this.isCusBreak === true ? this.form.break : '', // this.form.break, // 自定义分隔符
        SeparatorType: this.isCusBreak === true ? -1 : this.form.break // this.form.break // 分隔符类型; 自定义 = -1, Tab = 0, 逗号 = 1,空格 = 2,竖线 = 3
      }
    },
    ...mapState(['improt', 'analysisLocus'])
  },
  methods: {
    upload(formData = new FormData()) {
      let self = this
      this.uploading = true
      this.livePercentage(90)

      // 插文件
      formData.append('file', this.file)
      // 插token
      formData.append('data', JSON.stringify({ token: this.userData.UserToken }))
      this.attachmentId = ''

      return new Promise(function (resolve, reject) {
        // let formData = new FormData()
        self.$http.post(UPLOAD_PATH_IMPORT, formData).then((res) => {
          console.log(res, res.body.Status, res.body.Data.HResult)
          if(res.body.Status === -3) {
            if(res.body.Data.HResult === -2147467259) {
              console.log('wrong')
              resolve(res.body.Data);
            }
          } else {
            resolve(res.body.Data)
          }
        }).catch(() => {
          reject()
        })
      })
    },
    uploadComplete() {
      this.livePercentage(100, true)
      setTimeout(() => {
        this.uploading = false
        this.isFirst = true
        this.fetchList()
      }, 1000)
    },
    closeEvent() {
      this.isFirst = true
      this.livePercentage(0, true)
      this.sheetOps = []
      this.columns = []
      this.list = []
      this.$refs.form.resetFields()
      this.$emit('close')
    },
    callSource() {
      this.$emit('call:rang')
    },
    checkColumn(column, e) {
      let prop = column.property,
        elm = e.target,
        className = 'active'
      if(!this.form.columns.find(d => d === prop)) {
        addClass(elm, className)
        this.form.columns.push(prop)
      } else {
        removeClass(elm, className)
        arrayGetRid(this.form.columns, [prop])
      }
    },
    livePercentage(val, immediate, target) {
      let self = this
      if(immediate === true) {
        clearTimer()
        self.percentage = val
      } else {
        if(self.timer !== null) {
          clearTimer()
        } else {
          self.timer = setInterval(() => {
            let randomInt = parseInt((Math.random() * 5) + 1),
              setVal = self.percentage + randomInt
            if(setVal < val) {
              self.percentage = setVal
            } else {
              setVal = val
              self.percentage = setVal
              clearTimer()
            }
          }, parseInt((Math.random() * 2) + 1) * 300)
        }
      }
      if(target) target = val

      function clearTimer() {
        clearInterval(self.timer)
        self.timer = null
      }
    }
  },
  created() {},
  mounted() {}
}
