<template>
<el-dialog v-draggable="dialogDraggableOptions" class="no-padding" :visible.sync="dialog" :title="fileInfo.title || title||'批量选择'" :modal-append-to-body="true" :append-to-body="true" size="bigest--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">

  <!-- 第一步: 选字段 -->
  <div class="wrap" v-if="step===1" v-loading="loading">
    <el-form ref="form" class="form" :model="form" inline>
      <!-- <el-form-item prop="fileType">
        <el-radio-group v-model="form.fileType">
          <el-radio v-for="item in fileTypeOps" :key="item.value" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <!-- <el-form-item prop="caseName">
        <el-input v-model="form.caseName" disabled placeholder=""></el-input>
      </el-form-item> -->
      <el-form-item>
      <case-selector ref="caseSelector" v-if="this.caseInfo === null" :width="170" @update:value="updateCase" @clear:value="clearCase"></case-selector>
      </el-form-item>
      <el-form-item prop="sourceType">
        <el-select filterable v-model="form.sourceType" placeholder="请选择资源类型" @change="typeChange" value-key="ID">
            <el-option v-for="(item, idx) in sourceTypes" :key="idx" :label="item.YWBMS" :value="item.ID"></el-option>
          </el-select>
      </el-form-item>
        <el-form-item>
            <el-button  type="primary"  @click="importFile">上传数据</el-button>
          <input  type="file" ref="importUploadBtn" class="hide" accept=".csv,.mdb,.accdb,text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="v=>fileChange(v)">
        </el-form-item>
      <el-form-item prop="break" v-show="disableBreak===false">
        <el-select v-model="form.break" filterable allow-create placeholder="选择 或 输入自定义分隔符" :disabled="disableBreak" @change="fetchList()">
          <el-option v-for="item in breakOps" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="sheet" v-show="disableSheet===false">
        <el-select v-model="form.sheet" placeholder="选择表格" :disabled="disableSheet" @change="fetchList()">
          <el-option v-for="item in sheetOps" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="isHeadInStartRow" label="是否首行头部">
        <el-switch v-model="form.isHeadInStartRow" on-text="是" off-text="否" @change="fetchList()"></el-switch>
      </el-form-item>

      <el-form-item prop="beginRow" label="数据起始行">
        <el-input-number v-model="form.beginRow" :min="1" style="width:120px;" @change="fetchList()"></el-input-number>
      </el-form-item>

      <!-- <el-form-item class="btn-box">
        <el-button type="primary" size="small" @click="fetchList">预览数据</el-button>
      </el-form-item> -->
    </el-form>

    <div ref="importTableBox" class="table-box">
      <table class="el-table app-table el-table--fit el-table--striped el-table--border el-table--enable-row-hover el-table--enable-row-transition" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th class="is-leaf" v-for="(column,i) in columns" :key="i">
              <div class="cell" style="width:160px;">
                <div style="font-size:12px;font-weight:normal;text-align:left;">{{column.label}}</div>
                <el-select v-model="column.attr" @change="updateSelectedColumn">
                  <el-option v-for="(item,i) in columnsOps" :key="i" :label="item.ColumnCn" :value="item.ID" :disabled="item.disabled">
                    <div :class="{required:item.IsRequired==='1'}">
                      {{item.ColumnCn}}
                    </div>
                  </el-option>
                </el-select>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,i) in list" :key="i">
            <td v-for="(column,j) in columns" :key="j">
              <div class="cell" :title="item[column.value]" style="width:160px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap;">
                {{item[column.value]}}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div :class="{empty:true,'empty--tips':true}" v-show="uploading===false && this.isFirst===true && percentage===100">
        <span>点击右上角按钮预览数据</span>
      </div>

    </div>
    <div class="loading" v-show="uploading===true">
      <el-progress class="loading__progress" type="circle" :percentage="percentage" :status="percentage===100?'success':''"></el-progress>
    </div>
  </div>

  <!-- 第二步: 补充资料 -->
  <!-- <div class="wrap step-2" v-if="step===2">
    <el-table :data="makeUpList" v-loading="loading">
      <el-table-column v-for="(column, i) in makeUpColumns" :key="i" :label="getTableHeader(column.label)">
        <template scope="scope">
          <el-input v-if="column.value === 'Hm'" v-model="scope.row[column.value]" placeholder="请输入"></el-input>
          <el-input v-if="column.value === 'Sfzh' && form.caseId === '02'" v-model="scope.row[column.value]"></el-input>
          <el-select v-if="column.value === 'Sfzh' && form.caseId !== '02'"
          v-model="scope.row[column.value]"
          placeholder="请选择身份证信息"
          @change = "sfzSelectChange"
          filterable
          >
              <el-option
               v-for="item in sfzXmList"
               :label="item.sfzAndXm"
               :value="item"
               :key="item.sfz">
                 <span>{{item.sfz}}</span>(<span>{{item.xm}}</span>)
              </el-option>
          </el-select>
          <el-input v-if="column.value === 'Xm' " v-model="scope.row[column.value]" :readonly="form.caseId !== '02'" ></el-input>
        </template>
</el-table-column>
</el-table>
</div> -->

<!-- 第三步: 导入(进度) -->
<div class="wrap" v-if="step===3">
  <div class="loading">
    <el-progress class="loading__progress" type="circle" :percentage="importPercentage" :status="importPercentage===100?'success':''"></el-progress>
    <div class="" style="text-align:center; position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);">
      您的数据已加入处理列队, 大约需要等待5分钟, 请在5分钟后手动刷新页面.
      <!-- {{}}条 / {{}}条 -->
    </div>
  </div>
</div>

<div slot="footer" class="dialog-footer">
  <el-button v-if="step===1" @click="closeEvent">取消</el-button>
  <el-button v-if="step!==1&&step!==3" @click="step--" :disabled="loading">上一步</el-button>
  <el-button type="primary" v-if="step!==3" @click="next" :disabled="loading">下一步</el-button>
  <el-button type="primary" v-if="step===3" @click="reload">关闭</el-button>
</div>
</el-dialog>
</template>
<style lang="scss" scoped>
  .el-dialog__body {
    padding: 0;
  }

  .wrap {
    min-height: 300px;
    overflow: hidden;
    .form {
      height: 36px;
      margin: 10px;
      position: relative;
      .el-form-item {
        margin-bottom: 0;
      }
      .btn-box {
        margin: 0;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
    .table-box {
      height: calc(100vh - 430px);
      overflow: auto;
      position: relative; // 如需全列效果, 注释这行
      .cell {
        cursor: pointer;
      }
    }
    .loading {
      background: rgba(255, 255, 255, .5);
      width: 100%;
      height: calc(100% - 60px);
      position: absolute;
      top: 0;
      left: 0;
      &__progress {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
      }
    }
    .empty {
      transform: translateX(-50%) translateY(-50%);
    }
  }

  .step-2 {
    .el-select {
      display: block;
    }
  }

</style>
<script>
  import {
    FETCH_IMPROT_PRVIEW,
    GET_IMPROT_AUTO_MATCH_COLUMNS,
    POST_IMPROT_DATA,
    GET_ZYB_LIST
  } from '../../store/types'
  import { UPLOAD_PATH_IMPORT } from '../../config'
  import mixin from '../../utils/mixin'
  import { clone } from '../../utils/util'

  import caseSelector from '../../widgets/case-selector/case-selector'
  import mixinImportDialog from '../../utils/mixinImportDialog'

  /**
   * @module ImportDialog
   * @desc 导入模态窗组件, 依赖: mixinImportDialog（'../../utils/mixinImportDialog'）
   * @example <import-dialog :dialog="dialogImport" :type="2" :caseInfo="null" @close="clearFileInput"></import-dialog>
   */
  export default {
    mixins: [mixin, mixinImportDialog],
    components: {
      caseSelector
    },
    data() {
      return {
        sourceTypes: [],
        tableHeight: 0,
        form: {
          caseName: '',
          caseId: '',
          fileType: '',
          sourceType: { ID: '' }
        },
        query: null,
        step: 1,
        sfzXmList: [],
        makeUpColumns: [],
        makeUpList: [],
        importPercentage: 0,
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
    /**
     * 接收参数
     * @prop {Object} caseInfo 案件信息对象 @default null
     * @prop {Boolean} dialog  [mixinImportDialog] 窗口是否打开 @default false
     * @prop {String} title  [mixinImportDialog] 窗口标题
     */
    props: {
      caseInfo: {
        type: Object,
        default: null
      }
    },
    computed: {
      columnsOps() {
        let res
        if (!this.improt.matchColumns) {
          res = []
        } else {
          res = [...this.improt.matchColumns.map(m => {
            m['disabled'] = !this.columns.find(c => c.attr === m.ID) === false
            return m
          })]
        }
        res.unshift({
          ColumnCn: '空',
          ColumnEn: 'empty',
          ID: '',
          IsRequired: '0',
          MatchColumnName: null,
          Sx: 10,
          YwbId: '1',
          disabled: false
        })
        return res
      }
    },
    methods: {
      initDialog() {
        this.form = {
          fileType: null,
          break: '',
          sheet: '',
          isHeadInStartRow: true, // 是否首行头部
          beginRow: 1, // 数据起始行
          columns: [],
          sourceType: null
        }
        if (this.$refs.caseSelector) this.$refs.caseSelector.caseId = ''
        if (this.caseInfo === null) {
          this.caseData = {
            caseName: '',
            caseId: ''
          }
        } else {
          this.caseData = clone(this.caseInfo)
        }

        this.step = 1
        this.percentage = 0
        this.isFirst = true
        this.columns = []
        this.list = []
        this.form.caseId = this.caseData.caseId
        this.form.caseName = this.caseData.caseName
      },
      fileChange(elm) {
        let importType = this.form.sourceType;
        let sourceName = this.sourceTypes.find(r => { return r.ID === importType }).YWBMS;
        let file = elm.target.files[0],
          fileTypeArr = file.name.split('.'),
          fileType = fileTypeArr[fileTypeArr.length - 1]
        if (file.size > 1024 * 1024 * 100) {
          this.$alert('文件不能大于100MB', '温馨提示');
          return;
        } else if (!this.fileTypes.find(d => d === fileType)) {
          this.$alert('只支持 CSV/EXCEL/TXT/ACCESS 文件', '温馨提示');
          return;
        } else {
          this.fileInfo = {
            name: file.name,
            title: `${sourceName}-${file.name}`,
            type: fileType,
            file: file
          }
        }
        this.list = [];
        // 上传文件
        this.upload().then((res) => {
          if (res.HResult !== undefined) {
            this.$alert('文件格式错误，请重新选择文件导入').then(() => {
              this.closeEvent();
            })
          } else {
            this.form.fileType = res.FileType
            this.attachmentId = res.FjId
            if (this.form.fileType === 0 || this.form.fileType === 3) {
              this.sheetOps = res.Sheets.map(d => {
                return {
                  label: d,
                  value: d
                }
              })
              this.form.sheet = res.Sheets[0]
            }
            this.uploadComplete()
          }
        })
      },
      upload(formData = new FormData()) {
        let self = this
        this.uploading = true
        this.livePercentage(90)

        // 插文件
        formData.append('file', this.fileInfo.file)
        // 插token
        formData.append('data', JSON.stringify({ token: this.userData.UserToken }))
        this.attachmentId = ''
        return new Promise(function(resolve, reject) {
          // let formData = new FormData()
          self.$http.post(UPLOAD_PATH_IMPORT, formData).then((res) => {
            resolve(res.body.Data)
          }).catch(() => {
            reject()
          })
        })
      },
      importFile() {
        if (!this.form.sourceType) {
          this.$message({ type: 'warning', message: '请先选择上传资源类型' })
        } else {
          this.$refs.importUploadBtn.click();
        }
      },
      typeChange(val) {},
      closeEvent(reload = false) {
        /**
         * 关闭窗口事件
         * @event module:ImportDialog~close
         * @param {Boolean} a 关闭后是否需要重新加载页面
         */
        this.$emit('close', reload)
      },
      fetchSourceTypes() {
        this.dispatch(GET_ZYB_LIST).then(() => {
          this.sourceTypes = this.improt.zybDataList;
        })
      },
      fetchList() {
        if (!this.attachmentId) return false
        this.isFirst = false
        this.columns = []
        this.list = []

        this.$nextTick(() => {
          this.dispatch(FETCH_IMPROT_PRVIEW, this.params).then(() => {
            this.dispatch(GET_IMPROT_AUTO_MATCH_COLUMNS, {
              YwID: this.form.sourceType,
              Columns: this.improt.list.Columns
            }).then(() => {
              console.log(this.improt.list.Columns)
              this.columns = [...this.improt.list.Columns.map(d => {
                let matchColumn = this.improt.matchColumns.find(c => {
                  if (c.MatchColumnName && d) {
                    return c.MatchColumnName.toLowerCase().trim() === d.toLowerCase().trim()
                  } else {
                    return false;
                  }
                })
                return {
                  label: d,
                  value: d,
                  attr: !matchColumn ? '' : matchColumn.ID,
                  required: true
                }
              })]
            })
            this.list = this.improt.list.Source
          })
        })
      },
      updateSelectedColumn(val) {
        this.columns = [...this.columns]
      },
      getMainAccoundLabel() {
        let res
        switch (this.type) {
          case 1:
            res = '机主号码'
            break;
          case 2:
            res = '主银行账号'
            break;
          default:
            res = '主账号'
        }
        return res
      },
      getTableHeader(val) {
        let res
        switch (val) {
          case 'Hm':
            res = this.getMainAccoundLabel()
            break;
          case 'Sfzh':
            res = '身份证号码'
            break;
          case 'Xm':
            res = '姓名'
            break;
        }
        return res
      },
      makeUpInfo() {
        let requiredColumns = this.columnsOps.filter(d => d.IsRequired === '1'),
          columns = this.columns.filter(c => c.attr !== ''),
          checkColumns = true,
          checkColumnsTips = ''
        requiredColumns.forEach(d => {
          if (!columns.find(c => c.attr === d.ID)) {
            checkColumns = false
            checkColumnsTips = `必需选择"${d.ColumnCn}"的对应列`
            return false
          } else if (columns.filter(c => c.attr === d.ID).length > 1) {
            checkColumns = false
            checkColumnsTips = `"${d.ColumnCn}"不能重复选择`
          }
        })
        if (checkColumns === false) {
          this.$alert(checkColumnsTips, '温馨提示')
          return false
        }
        this.makeUpColumns = []
        this.makeUpList = []
        this.query = {
          YwID: this.form.sourceType, // 业务ID
          SheetName: this.params.SheetName, // 文件表名
          FjId: this.params.FjId, // 附件ID
          FileType: this.params.FileType, // 文件类型
          IsHeadInStartRow: this.params.IsHeadInStartRow, // 是否首行头部
          BeginRow: this.params.BeginRow, // 起始行
          SeparatorType: this.params.SeparatorType, // 分隔符类型
          Separator: this.params.Separator, // 分隔符
          YwColumns: columns.map(c => {
            return {
              MatchColumnName: c.value, // 匹配的文件列名
              'ID': c.attr, // 匹配ID
              IsRequired: c.required === true ? '1' : '0' // 是否必填
            }
          }),
          Zhxxs: [],
          AjID: this.caseData.caseId || undefined
        }
      },
      markEmptyEvent() {
        this.step = 2
        this.makeUpColumns = [{
          label: 'Hm',
          value: 'Hm'
        }, {
          label: 'Sfzh',
          value: 'Sfzh'
        }, {
          label: 'Xm',
          value: 'Xm'
        }]
        this.makeUpList.push({
          Hm: '',
          Sfzh: '',
          Xm: ''
        })
      },
      submit() {
        this.query.Zhxxs = [...this.makeUpList]
        this.dispatch(POST_IMPROT_DATA, this.query).then(() => {
          console.log('524')
          this.step = 3
        })
      },
      /**
       * 验证身份证号
       */
      validSfzh(sfzh) {
        let reg1 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/g;
        let reg2 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/g;
        if (!reg1.test(sfzh) && !reg2.test(sfzh)) {
          return false
        } else {
          return true
        }
      },
      next() {
        if (this.step === 1) {
          this.makeUpInfo()
          // } else if (this.step === 2) {
          this.submit()
        }
      },
      reload() {
        this.closeEvent(true)
        // window.location.reload()
      },
      reset() {
        this.query = null
        this.step = 1
        this.makeUpColumns = []
        this.makeUpList = []
        this.importPercentage = 0
      },
      updateCase(val) {
        this.caseData = {
          caseName: val.caseName,
          caseId: val.caseId
        }
        this.form.caseId = val.caseId
        this.form.caseName = val.caseName
      },
      clearCase() {
        this.caseData = { caseName: '', caseId: '' };
        this.form.caseId = '';
        this.form.caseName = '';
      },
      sfzSelectChange(item) {
        // 遍历makeUpList，匹配所选的值，将值拆分给身份证和姓名
        for (var i in this.makeUpList) {
          let listNode = this.makeUpList[i].Sfzh;
          if (listNode instanceof Object &&
            listNode.sfz === item.sfz &&
            listNode.xm === item.xm) {
            this.makeUpList[i].Xm = item.xm || '';
            this.makeUpList[i].Sfzh = item.sfz || '';
          }
        }
      }
    },
    created() {
      this.fetchSourceTypes();
      this.$connect.on('ImportFileDataProcess', (data) => {
        if (data.ID === this.params.FjId) {
          console.log('收到 ImportFileDataProcess 推送, 开始回调处理');
          this.importPercentage = parseInt((data.CompletedCount / data.Total) * 100) || 3
          console.log('ImportFileDataProcess 回调处理完成');
        }
      })
    },
    mounted() {}
  }

</script>
