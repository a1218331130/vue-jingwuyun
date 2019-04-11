<!-- hostel / 同行旅店 -->
<template>
<div>
  <div class="add-box-button">
    <el-button type="text" class="export-text iconfont icon-plus" @click="add()">添加</el-button>
  </div>
  <el-table :data="tableList" border>
    <el-table-column type="index" width="50" label="序号"></el-table-column>
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column prop="IDCard" label="证件号码"></el-table-column>

    <el-table-column prop="hotelCode" label="旅馆编码"></el-table-column>
    <el-table-column prop="hotelName" label="旅馆名称"></el-table-column>
    <el-table-column prop="hotelAddress" label="旅馆地址"></el-table-column>
    <el-table-column prop="hotelRoomNumber" label="入住房号"></el-table-column>
    <el-table-column prop="hotelCheckinTime" label="入住时间"></el-table-column>
    <el-table-column prop="hotelCheckoutTime" label="退房时间"></el-table-column>
    <el-table-column prop="source" label="来源" width="50"></el-table-column>

    <el-table-column label="操作" width="80" align="center">
      <template scope="scope">
        <el-button type="text" @click="edit(scope.row)" title="编辑" v-if="checkUserRuleCase('ajgl/hostel/update', caseId,true,cjrId) && scope.row.sourceCode !== '1'" icon="icon iconfont icon-brush"></el-button>
        <el-button type="text" title="删除" v-if="checkUserRuleCase('ajgl/hostel/delete', caseId,true,cjrId)" @click="remove(scope.row,scope)" icon="icon iconfont icon-trash"></el-button>
      </template>
</el-table-column>
</el-table>

<!-- add/updata 弹窗 -->
<hostelDialog :dialog="dialogSwitch" :title="dialogTitle" :theSuspectList="theSuspectList" :isGangs="!theSuspect" :dataForm="dialogData" @update:submit="submit" @close="close"></hostelDialog>
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
  import mixin from '../../../../../utils/mixin'
  import hostelDialog from '../../dialog/social-hostel-edit.vue'

  export default {
    mixins: [reportMixin, mixin],
    components: {
      hostelDialog
    },
    props: ['tableData', 'theSuspect', 'theSuspectList', 'addSwitch'],
    computed: {},
    data() {
      return {
        tableList: [],
        tableDataLoc: [],
        dialogData: '',
        caseId: '', // 初始化案件ID
        cjrId: '',
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

              hotelCode: ra.lgbm, // 旅馆编码
              hotelName: ra.lgmc, // 旅馆名称
              hotelAddress: ra.lgdz, // 旅馆地址
              hotelRoomNumber: ra.rzfh, // 入住房号
              hotelCheckinTime: ra.rzsj ? this.dateFormat(new Date(ra.rzsj), 'yyyy-MM-dd hh:mm:ss') : '', // 入住时间
              hotelCheckoutTime: ra.tfsj ? this.dateFormat(new Date(ra.tfsj), 'yyyy-MM-dd hh:mm:ss') : '' // 退房时间
            }
          })
        }
        return _dataM
      },
      /**
       * 提交表单
       * @param f
       */
      submit(f) {
        let _optForm = {
          xm: f.name, // 姓名
          zjhm: f.IDCard, // 证件号码
          lgbm: f.hotelCode, // 旅馆编码
          lgmc: f.hotelName, // 旅馆名称
          lgdz: f.hotelAddress, // 旅馆地址
          rzfh: f.hotelRoomNumber, // 入住房号
          rzsj: f.hotelCheckinTime, // 入住时间
          tfsj: f.hotelCheckoutTime // 退房时间
        }

        // 判断是否来自于团伙操作
        let _optForm2 = {}
        if (this.theSuspect) {
          Object.assign(_optForm2, {
            sfxyrtz: '0',
            xyrid: this.theSuspect.id // 嫌疑人ID
          })
        } else {
          Object.assign(_optForm2, { // 团伙
            sfxyrtz: '1',
            xyrid: f.associatedSuspect // 嫌疑人ID
          })
        }
        Object.assign(_optForm, _optForm2)
        let _message = ''
        if (f.id !== '') {
          _optForm.id = f.id
          this.tableList.map((tr, tIndex) => {
            if (tr.id === f.id) {
              this.$set(this.tableList, tIndex, this.dataMatch([_optForm])[0])
              this.tableDataLoc[tIndex] = _optForm
            }
          })
          _message = '同旅店记录更新'
        } else {
          _optForm.id = '_hostel_' + new Date().getTime()
          this.tableList = this.tableList.concat([this.dataMatch([_optForm])[0]])
          this.tableDataLoc = this.tableDataLoc.concat([_optForm])
          _message = '同旅店记录添加'
        }
        this.localUpdate(this.tableDataLoc, _message, 'add-hostel') // 更新数据操作
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
        if (item.id) {
          this.tableDataLoc.map(ir => {
            if (ir.id === item.id) {
              this.dialogData = ir
              this.dialogSwitch = true
              this.dialogTitle = '编辑'
            }
          })
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
          this.localUpdate(this.tableDataLoc, '删除该条同旅店记录', 'minus-hostel')
        }).catch(() => {});
      },
      /**
       * 本地更新数据操作
       * @param _text
       */
      localUpdate(ltableData, _text = null, types) {
        let _tempReportContent = JSON.parse(this.caseReportVersion.getCaseReportVersion.data)
        if (_tempReportContent) {
          _tempReportContent['thostel'] = ltableData
        }
        this.close()
        this.updateReport({ type: 'thostel', data: _tempReportContent['thostel'], text: _text, modelType: types }) // 更新数据对象
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
      this.cjrId = this.$route.query.b // 初始化获取案件id
      if (this.tableData) { // 初始化表格列
        this.tableList = this.dataMatch(this.tableData)
        this.tableDataLoc = this.tableData
      }
    }
  }

</script>
