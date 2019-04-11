<!-- cyberbar / 同行网吧 -->
<template>
<div>
  <div class="add-box-button">
    <el-button type="text" class="export-text iconfont icon-plus" @click="add()">添加</el-button>
  </div>
  <el-table :data="tableList" border>
    <el-table-column type="index" width="50" label="序号"></el-table-column>
    <el-table-column prop="name" label="姓名" width="80"></el-table-column>
    <el-table-column prop="IDCard" label="证件号码"></el-table-column>

    <el-table-column prop="internetBarCode" label="网吧编码"></el-table-column>
    <el-table-column prop="internetBarName" label="网吧名称"></el-table-column>
    <el-table-column prop="internetBarAddress" label="网吧地址"></el-table-column>
    <el-table-column prop="onlineStartTime" label="上网时间"></el-table-column>
    <el-table-column prop="onlineEndTime" label="下线时间"></el-table-column>
    <el-table-column prop="source" label="来源" width="50">
      <template scope="scope">
      {{scope.row.sourceCode !== '1' && scope.row.sourceCode!==1?'手动': '检索'}}
      </template>
</el-table-column>

<el-table-column label="操作" width="80" align="center">
  <template scope="scope">
        <el-button type="text" @click="edit(scope.row)" title="编辑" v-if="checkRuleCase('ajgl/cyberbar/update', caseId) && scope.row.sourceCode !== '1' && scope.row.sourceCode!==1" icon="icon iconfont icon-brush"></el-button>
        <el-button type="text" title="删除" v-if="checkRuleCase('ajgl/cyberbar/delete', caseId)&& scope.row.sourceCode !== '1' && scope.row.sourceCode!==1" @click="remove(scope.row,scope)" icon="icon iconfont icon-trash"></el-button>
      </template>
</el-table-column>
</el-table>

<!-- add/updata 弹窗 -->
<cyberbarDialog :dialog="dialogSwitch" :title="dialogTitle" :theSuspectList="theSuspectList" :isGangs="!theSuspect" :dataForm="dialogData" @update:submit="submit" @close="close"></cyberbarDialog>
</div>
</template>

<style lang="scss" scoped>
  .add-box-button {
    position: absolute;
    top: -34px;
    right: 10px;
  }

  .add-box-button {
    float: left;
    width: 65px;
    height: 28px;
    background-color: #f90;
    line-height: 28px;
    color: #fff;
    text-align: center;
    font-size: 14px;
    margin-left: 10px;
    cursor: pointer;
    .print-text {
      padding: 0;
      color: #fff;
      font-size: 14px;
      width: 100%;
      height: 100%;
    }
    .export-text {
      padding: 0;
      color: #fff;
      font-size: 14px;
      width: 100%;
      height: 100%;
    }
    &:hover {
      background-color: #ff9900;
    }
  }

</style>

<script>
  //  import {mapState} from 'vuex'
  import reportMixin from '../../reportMixin'
  import { arrayGetRid } from '../../../../../utils/util'

  import cyberbarDialog from '../../dialog/social-cyberbar-edit.vue'

  export default {
    mixins: [reportMixin],
    components: {
      cyberbarDialog
    },
    props: ['tableData', 'theSuspect', 'addSwitch', 'theSuspectList'],
    computed: {},
    data() {
      return {
        tableList: [],
        tableDataLoc: [],
        dialogData: '',
        caseId: '', // 初始化案件ID
        dialogTitle: '',
        dialogSwitch: false // 弹窗触发
      }
    },
    methods: {
      add() {
        this.dialogData = ''
        this.dialogSwitch = true
        this.dialogTitle = '添加'
      },
      /**
       * 数据匹配
       * @param rowArray
       * @returns {Array}
       */
      dataMatch(rowArray) {
        let _dataM = []
        if (rowArray) {
          _dataM = rowArray.map(ra => {
            return {
              id: ra.id,
              name: ra.xm,
              IDCard: ra.zjhm, // 证件号码
              sourceCode: ra.ly, // 数据来源代码
              source: ra.ly === '1' ? '采集' : '手动', //  数据来源翻译

              internetBarCode: ra.wbbm, // 网吧编码
              internetBarName: ra.wbmc, // 网吧名称
              internetBarAddress: ra.wbdz, // 网吧地址
              onlineStartTime: ra.swsj ? this.dateFormat(new Date(ra.swsj), 'yyyy-MM-dd hh:mm:ss') : '', // 上网时间
              onlineEndTime: ra.xxsj ? this.dateFormat(new Date(ra.xxsj), 'yyyy-MM-dd hh:mm:ss') : '' // 下线时间
            }
          })
        }
        return _dataM
      },
      dataReverse(obj) {
        return {
          id: obj.id,
          xm: obj.name,
          zjhm: obj.IDCard,
          ly: obj.sourceCode,
          wbbm: obj.internetBarCode,
          wbmc: obj.internetBarName,
          wbdz: obj.internetBarAddress,
          swsy: this.dateFormat(new Date(obj.onlineStartTime), 'yyyy-MM-dd hh:mm:ss'),
          xxsj: this.dateFormat(new Date(obj.onlineEndTime), 'yyyy-MM-dd hh:mm:ss')
        }
      },
      /**
       * 提交表单
       * @param f
       */
      submit(f) {
        let _optForm = {
          xm: f.name, // 姓名
          zjhm: f.IDCard, // 证件号码

          wbbm: f.internetBarCode, // 网吧编码
          wbmc: f.internetBarName, // 网吧名称
          wbdz: f.internetBarAddress, // 网吧地址
          swsj: f.onlineStartTime, // 上网时间
          xxsj: f.onlineEndTime // 下线时间
        }

        // 判断是否来自于团伙操作
        let _optForm2 = {}
        if (this.theSuspect) {
          Object.assign(_optForm2, {
            sfxyrtx: '0',
            xyrid: this.theSuspect.id // 嫌疑人ID
          })
        } else {
          Object.assign(_optForm2, { // 团伙
            sfxyrtx: '1',
            xyrid: f.associatedSuspect // 嫌疑人ID
          })
        }
        Object.assign(_optForm, _optForm2)
        let _message = ''

        if (f.id) {
          _optForm.id = f.id
          this.tableList.map((tr, tIndex) => {
            if (tr.id === f.id) {
              this.$set(this.tableList, tIndex, this.dataMatch([_optForm])[0])
              this.tableDataLoc[tIndex] = _optForm
            }
          })
          _message = '同网吧记录更新'
        } else if (this.theSuspect) {
          _optForm.id = this.theSuspect.id + '_cyberbar_' + new Date().getTime()
          this.tableList = this.tableList.concat([this.dataMatch([_optForm])[0]])
          this.tableDataLoc = this.tableDataLoc.concat([_optForm])
          _message = '同网吧记录添加'
        }
        this.localUpdate(this.tableDataLoc, _message, 'add-cyberbar') // 更新数据操作
      },
      /**
       * 关闭弹窗
       */
      close() {
        this.dialogSwitch = false
        this.$emit('close')
      },
      /**
       * 编辑
       * @param item
       */
      edit(item) {
        console.log(item, this.tableData)
        if (item.id) {
          // this.tableData.map(ir => {
          // console.log(ir.id, item.id)
          // if (ir.id === item.id) {
          this.dialogData = this.dataReverse(item)
          this.dialogSwitch = true
          this.dialogTitle = '编辑'
          // }
          // })
        }
      },
      /**
       * 删除
       * @param item
       * @param scope
       */
      remove(item, scope) {
        this.$confirm('确认删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableList = arrayGetRid(this.tableList, [item])
          this.tableDataLoc = this.tableDataLoc.filter(fr => fr.id !== item.id)
          this.localUpdate(this.tableDataLoc, '删除该条同网吧记录', 'minus-cyberbar')
        }).catch(() => {});
      },
      /**
       * 本地更新数据操作
       * @param _text
       */
      localUpdate(ltableData, _text = null, types) {
        let _tempReportContent = JSON.parse(this.caseReportVersion.getCaseReportVersion.data)
        console.log('222', _tempReportContent)
        if (_tempReportContent) {
          _tempReportContent['xinfo'].map((rt, rIndex) => {
            if (rt.baseinfo.id === this.theSuspect.id) {
              rt.cyberbar = ltableData
            }
          })
        }
        console.log('230', _tempReportContent)
        this.close()
        this.updateReport({ type: 'xinfo', data: _tempReportContent['xinfo'], text: _text, modelType: types }) // 更新数据对象
      }
    },
    watch: {
      addSwitch(val) {
        if (val) {
          this.dialogData = ''
          this.dialogSwitch = true
          this.dialogTitle = '添加'
        }
      },
      tableData(val) {
        if (val) { // 初始化表格列
          this.tableList = this.dataMatch(val)
          this.tableDataLoc = this.tableData
        }
      }
    },
    mounted() {},
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      if (this.tableData) { // 初始化表格列
        this.tableList = this.dataMatch(this.tableData)
        this.tableDataLoc = this.tableData
      }
    }
  }

</script>
