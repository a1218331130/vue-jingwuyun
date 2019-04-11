<template>
<el-dialog v-draggable="dialogDraggableOptions" class="no-padding" :visible.sync="dialog" :title="title||'批量选择'" :modal-append-to-body="true" :append-to-body="true" size="bigest--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <!-- 第一步: 选字段 -->
  <div class="wrap" v-if="step===1" v-loading="loading">
    <el-form ref="form" class="form" :model="form" inline>
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
    </el-form>
    <div ref="importTableBox" class="table-box">
      <table class="el-table app-table el-table--fit el-table--striped el-table--border el-table--enable-row-hover el-table--enable-row-transition" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th class="is-leaf" v-for="(column,i) in columns" :key="i">
              <div class="cell" style="width:160px;">
                <div style="font-size:12px;font-weight:normal;text-align:left;">{{column.label}}</div>
                <div  style="font-size: 12px;font-weight: normal">
                  <span>保存该字段</span>
                  <el-switch v-model="column.isSave" on-text="是" off-text="否" @change="dataTypeSwitch(i)" style="width:40px;"></el-switch>
                </div>
                <el-select v-model="column.dataType" value-key="value" v-show="column.show" @change="updateSelectedTypes">
                  <el-option v-for="(item,i) in dataTypes" :key="i" :label="item.label" :value="item.value">
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
  <div class="wrap step-2" v-show="step===2" v-loading="loading">
    <el-form ref="form2" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="数据名称" prop="name">
          <el-input v-model="form.name"></el-input>
       </el-form-item>
      <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark" :rows="4"></el-input>
       </el-form-item>
    </el-form>
  </div>
  <!-- 第三步: 导入(进度) -->
  <div class="wrap" v-if="step===3">
    <div class="loading">
      <el-progress class="loading__progress" type="circle" :percentage="importPercentage" :status="importPercentage===100?'success':''"></el-progress>
      <div class="" style="text-align:center; position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);">
        您的数据已加入处理列队, 大约需要等待5分钟, 请在5分钟后手动刷新页面.
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
      height: calc(100vh - 256px);
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
    .el-form {
      max-width: 600px;
      margin: 35px auto;
    }
  }

</style>
<script>
  import {
    FETCH_IMPROT_PRVIEW,
    SAVE_MY_DATA,
    GET_IMPROT_AUTO_MATCH_COLUMNS
  } from '../../../../store/types'

  import mixin from '../../../../utils/mixin'
  import mixinImportDialog from '../../../../utils/mixinImportDialog'
  // import { clone } from '../../../../utils/util'

  /**
   * @module ImportDialog
   * @desc 导入模态窗组件, 依赖: mixinImportDialog（'../../utils/mixinImportDialog'）
   * @example <import-dialog :dialog="dialogImport" :type="2" @close="clearFileInput"></import-dialog>
   */
  export default {
    mixins: [mixin, mixinImportDialog],
    data() {
      return {
        tableHeight: 0,
        form: {
          fileType: '',
          name: '',
          remark: ''
        },
        query: null,
        step: 1,
        sfzXmList: [],
        importPercentage: 0,
        rules: {
          name: [
            { required: true, message: '请填写数据名称', trigger: 'blur' }
          ]
        }
      }
    },
    /**
     * 接收参数
     * @prop {Number} type 导入类型 (0:话单, 1:账单) @default 0
     * @prop {Boolean} dialog  [mixinImportDialog] 窗口是否打开 @default false
     * @prop {String} title  [mixinImportDialog] 窗口标题
     * @prop {File} file  [mixinImportDialog] JS文件实体
     */
    props: {
      type: {
        type: Number,
        default: 0
      }
    },
    computed: {
      dataTypes() {
        return [{ label: '文本', value: 'text' }, { label: '日期', value: 'date' }, { label: '数字', value: 'number' }]
      }
    },
    methods: {
      /**
       * 打开导入窗后，上传文件到服务器，并拿到处理后的数据列表，在table中显示
       */
      initDialog() {
        this.form = {
          fileType: null,
          break: '',
          sheet: '',
          isHeadInStartRow: true, // 是否首行头部
          beginRow: 1, // 数据起始行
          columns: []
        }

        this.step = 1
        this.percentage = 0
        this.isFirst = true
        this.columns = []
        this.list = []
        this.upload().then((res) => {
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
        })
      },
      closeEvent(reload = false) {
        /**
         * 关闭窗口事件
         * @event module:ImportDialog~close
         * @param {Boolean} a 关闭后是否需要重新加载页面
         */
        this.$emit('close', reload)
      },
      fetchList() {
        if (!this.attachmentId) return false
        this.isFirst = false
        this.columns = []
        this.list = []

        this.$nextTick(() => {
          this.dispatch(FETCH_IMPROT_PRVIEW, this.params).then(() => {
            this.dispatch(GET_IMPROT_AUTO_MATCH_COLUMNS, {
              YwID: this.type,
              Columns: this.improt.list.Columns
            }).then(() => {
              this.columns = [...this.improt.list.Columns.map(d => {
                return {
                  label: d,
                  value: d,
                  dataType: 'text',
                  show: true,
                  isSave: true
                }
              })]
            })
            this.list = this.improt.list.Source
          })
        })
      },
      updateSelectedTypes(val) {},
      /**
       * 第二步，通过第一步的数据获得第二步所用到的案件相关的身份证号码信息
       */
      makeUpInfo() {
        this.step = 2
        // 第二步组件数据清空
        this.form.name = '';
        this.form.remark = '';
      },
      /**
       * 第三步，提交数据
       */
      submit() {
        // if (this.query.Zhxxs[0].Xm === '') {
        //   this.$message({
        //     message: '姓名不能为空',
        //     type: 'warning',
        //     duration: 1500
        //   })
        //   return
        // }
        this.$refs.form2.validate((valid) => {
          if (valid) {
            // this.$alert('请填写数据名称');
            return
          } else {
            console.log('err submit!!!');
            return false;
          }
        })
        let columnsArr = [];
        columnsArr = this.columns.filter(el => {
          return el.isSave
        }).map(e => {
          return { 'ColumnNameCn': e.label, 'ColumnType': e.dataType }
        })
        this.query = {
          SheetName: this.params.SheetName, // 文件表名
          FileID: this.params.FjId, // 附件ID
          FileType: this.params.FileType, // 文件类型
          // IsHeadInStartRow: this.params.IsHeadInStartRow, // 是否首行头部
          SourceType: '1', // 数据类型
          // BeginRow: this.params.BeginRow, // 起始行
          // SeparatorType: this.params.SeparatorType, // 分隔符类型
          // Separator: this.params.Separator, // 分隔符
          Columns: columnsArr,
          Name: this.form.name,
          Content: this.form.remark
        }
        this.dispatch(SAVE_MY_DATA, this.query).then(() => {
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
        } else if (this.step === 2) {
          this.submit()
        }
      },
      reload() {
        this.closeEvent(true)
      },
      reset() {
        this.query = null
        this.step = 1
        this.importPercentage = 0
      },
      dataTypeSwitch(index) {
        this.columns[index].show = !this.columns[index].show
      }
    },
    created() {
      this.$connect.on('ImportSjbdDataProcess', (data) => {
        console.log(data);
        if (data.ID === this.params.FjId) {
          console.log('收到 ImportSjbdDataProcess 推送, 开始回调处理');
          this.importPercentage = parseInt((data.CompletedCount / data.Total) * 100) || 3
          console.log('ImportSjbdDataProcess 回调处理完成');
        }
      })
    },
    mounted() {}
  }

</script>
