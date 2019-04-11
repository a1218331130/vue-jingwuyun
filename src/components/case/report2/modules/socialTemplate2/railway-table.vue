<!-- railway / 同行铁路 -->
<template>
<div>
  <div class="add-box-button">
    <el-button type="text" class="export-text iconfont icon-plus" @click="add()">添加</el-button>
  </div>
  <el-table :data="tableList" border>
    <el-table-column type="index" width="50" label="序号"></el-table-column>
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column prop="IDCard" label="证件号码"></el-table-column>

    <el-table-column prop="ticketNumber" label="票号"></el-table-column>
    <el-table-column prop="trains" label="车次"></el-table-column>
    <el-table-column prop="trainNo" label="车厢号"></el-table-column>
    <el-table-column prop="seatNo" label="座位号"></el-table-column>
    <el-table-column prop="ticketType" label="票种"></el-table-column>
    <el-table-column prop="seatLevel" label="席别"></el-table-column>
    <el-table-column prop="startStation" label="出发车站"></el-table-column>
    <el-table-column prop="arriveStation" label="到达车站"></el-table-column>
    <el-table-column prop="startTime" label="乘车时间"></el-table-column>
    <el-table-column prop="arriveTime" label="到站时间"></el-table-column>
    <el-table-column prop="fare" label="票价(元)"></el-table-column>
    <el-table-column prop="ticketOffice" label="售票处"></el-table-column>
    <el-table-column prop="seatWindow" label="窗口"></el-table-column>
    <el-table-column prop="source" label="来源" width="50"></el-table-column>

    <el-table-column label="操作" width="80" align="center">
      <template scope="scope">
        <el-button type="text" @click="edit(scope.row)" title="编辑" v-if="checkUserRuleCase('ajgl/railway/update', caseId,true,cjrId) && scope.row.sourceCode !== '1'" icon="icon iconfont icon-brush"></el-button>
        <el-button type="text" title="删除" v-if="checkUserRuleCase('ajgl/railway/delete', caseId,true,cjrId)" @click="remove(scope.row,scope)" icon="icon iconfont icon-trash"></el-button>
      </template>
</el-table-column>
</el-table>

<!-- add/updata 弹窗 -->
<railwayDialog :dialog="dialogSwitch" :title="dialogTitle" :theSuspectList="theSuspectList" :isGangs="!theSuspect" :dataForm="dialogData" @update:submit="submit" @close="close"></railwayDialog>
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

  import railwayDialog from '../../dialog/social-railway-edit.vue'
  export default {
    mixins: [reportMixin],
    components: {
      railwayDialog
    },
    props: ['tableData', 'theSuspect', 'addSwitch', 'theSuspectList'],
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

              ticketNumber: ra.ph, // 票号
              trains: ra.cc, // 车次
              startStation: ra.fz, // 出发车站
              arriveStation: ra.dz, // 到达车站
              startTime: ra.ccsj ? this.dateFormat(new Date(ra.ccsj), 'yyyy-MM-dd hh:mm:ss') : '', // 乘车时间
              arriveTime: ra.dzsj ? this.dateFormat(new Date(ra.dzsj), 'yyyy-MM-dd hh:mm:ss') : '', // 到站时间
              trainNo: ra.cxh, // 车厢号
              seatNo: ra.zwh, // 座位号
              ticketType: ra.pz, // 票种
              fare: ra.pj, // 票价（元）
              ticketOffice: ra.spc, // 售票处
              seatWindow: ra.ck, // 窗口
              seatLevel: ra.xb // 席别
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

          ph: f.ticketNumber, // 票号
          cc: f.trains, // 车次
          fz: f.startStation, // 发站
          dz: f.arriveStation, // 到站
          ccsj: f.startTime, // 乘车时间
          dzsj: f.arriveTime, // 到站时间
          gpfs: f.ticketMode, // 购票方式
          spsj: f.ticketTime, // 售票时间
          cxh: f.trainNo, // 车厢号
          xb: f.seatLevel, // 席别
          zwh: f.seatNo, // 座位号
          pz: f.ticketType, // 票种
          pj: f.fare, // 票价(元)
          spc: f.ticketOffice, // 售票处
          ck: f.seatWindow, // 窗口
          czy: f.operator // 操作员
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

        if (f.id !== '') {
          _optForm.id = f.id
          this.tableList.map((tr, tIndex) => {
            if (tr.id === f.id) {
              this.$set(this.tableList, tIndex, this.dataMatch([_optForm])[0])
              this.tableDataLoc[tIndex] = _optForm
            }
          })
          _message = '同铁路记录更新'
        } else {
          _optForm.id = '_railway_' + new Date().getTime()
          this.tableList = this.tableList.concat([this.dataMatch([_optForm])[0]])
          this.tableDataLoc = this.tableDataLoc.concat([_optForm])
          _message = '同铁路记录添加'
        }

        this.localUpdate(this.tableDataLoc, _message, 'add-railway') // 更新数据操作
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
          this.localUpdate(this.tableDataLoc, '删除该条同铁路记录', 'minus-railway')
        }).catch(() => {});
      },
      /**
       * 本地更新数据操作
       * @param _text
       */
      localUpdate(ltableData, _text = null, types) {
        let _tempReportContent = JSON.parse(this.caseReportVersion.getCaseReportVersion.data)
        if (_tempReportContent) {
          _tempReportContent['trailway'] = ltableData
        }
        this.close()
        this.updateReport({ type: 'trailway', data: _tempReportContent['trailway'], text: _text, modelType: types }) // 更新数据对象
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
      this.cjrId = this.$route.query.b // 初始化获取案件创建人id
      if (this.tableData) { // 初始化表格列
        this.tableList = this.dataMatch(this.tableData)
        this.tableDataLoc = this.tableData
      }
    }
  }

</script>
