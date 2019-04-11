<!-- flight / 同行航班 -->
<template>
<div>
  <el-table :data="tableList" border>
    <el-table-column type="index" width="50" label="序号"></el-table-column>
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column prop="IDCard" label="证件号码"></el-table-column>

    <el-table-column prop="airline" label="航空公司"></el-table-column>
    <el-table-column prop="bookingTicketTime" label="机票预订时间"></el-table-column>
    <el-table-column prop="airportTakeoff" label="起飞机场"></el-table-column>
    <el-table-column prop="airportLanding" label="落地机场"></el-table-column>
    <el-table-column prop="timeTakeoff" label="起飞时间"></el-table-column>
    <el-table-column prop="timeLanding" label="降落时间"></el-table-column>
    <el-table-column prop="source" label="来源" width="50"></el-table-column>

    <el-table-column label="操作" width="80" align="center">
      <template scope="scope">
        <el-button type="text" @click="edit(scope.row)" title="编辑" v-if="checkRuleCase('ajgl/flight/update', caseId) && scope.row.sourceCode !== '1'" icon="icon iconfont icon-brush"></el-button>
        <el-button type="text" title="删除" v-if="checkRuleCase('ajgl/flight/delete', caseId)" @click="remove(scope.row,scope)" icon="icon iconfont icon-trash"></el-button>
      </template>
</el-table-column>
</el-table>

<!-- add/updata 弹窗 -->
<flightDialog :dialog="dialogSwitch" :title="dialogTitle" :dataForm="dialogData" :theSuspectList="theSuspectList" :isGangs="!theSuspect" @update:submit="submit" @close="close"></flightDialog>
</div>
</template>

<style lang="scss" scoped>


</style>

<script>
  import { mapState } from 'vuex'
  import mixin from '../../../../../utils/mixin'
  import { arrayGetRid } from '../../../../../utils/util'
  import {
    FETCH_FLIGHT_RELATE_LIST,
    ADD_FLIGHT_RELATE,
    UPDATE_FLIGHT_RELATE,
    REMOVE_FLIGHT_RELATE,
    GET_FLIGHT_RELATE
  } from '../../../../../store/types'

  import flightDialog from '../../dialog/social-flight-edit.vue'

  export default {
    mixins: [mixin],
    components: {
      flightDialog
    },
    props: ['tableData', 'theSuspect', 'addSwitch', 'theSuspectList'],
    computed: {
      ...mapState(['flightRelate'])
    },
    data() {
      return {
        tableList: [],
        dialogData: '',
        caseId: '', // 初始化案件ID
        dialogTitle: '',
        dialogSwitch: false // 弹窗触发
      }
    },
    methods: {
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

              bookingTicketTime: ra.dpsj, // 机票预订时间
              airline: ra.hk, // 航空公司
              airportTakeoff: ra.qfdjc, // 起飞机场
              airportLanding: ra.lddjc, // 落地机场
              timeTakeoff: ra.qfsj, // 起飞时间
              timeLanding: ra.ddsj // 降落时间
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
        let _path = ADD_FLIGHT_RELATE
        let _optForm = {
          xm: f.name, // 姓名
          zjhm: f.IDCard, // 证件号码
          hk: f.airlines,
          jc: f.airfield,
          qfdd: f.takeOffSite,
          lddd: f.landingSite,
          qfdjc: f.takeOffSiteAirfield,
          lddjc: f.landingSiteAirfield,
          dpsj: f.bookingTime,
          qfsj: f.takeOffTime,
          ddsj: f.landingTime
        }
        if (f.id !== '') {
          _path = UPDATE_FLIGHT_RELATE
          _optForm.id = f.id
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

        this.dispatch(_path, Object.assign(_optForm, _optForm2, {
          ajid: this.caseId
        })).then(r => {
          this.close()
          this.queryList()
          if (_path === ADD_FLIGHT_RELATE) {
            this.$emit('addRow')
          }
        })
      },
      /**
       * 关闭弹窗
       */
      close() {
        this.dialogSwitch = false
        this.$emit('close')
      },
      /**
       * 列表查询
       */
      queryList() {
        if (this.checkRuleCase('ajgl/flight/list', this.caseId)) {
          // 判断是否来自于团伙操作
          let _optQuery = {}
          if (this.theSuspect) {
            Object.assign(_optQuery, {
              sfxyrtx: '0',
              xyrid: this.theSuspect.id // 嫌疑人ID
            })
          } else {
            Object.assign(_optQuery, { // 团伙
              sfxyrtx: '1'
            })
          }
          this.dispatch(FETCH_FLIGHT_RELATE_LIST, Object.assign(_optQuery, {
            ajid: this.caseId
          })).then((row) => {
            this.tableList = this.dataMatch(this.flightRelate.fetchFlightRelateList)
          })
        }
      },
      /**
       * 编辑
       * @param item
       */
      edit(item) {
        if (item.id) {
          this.dispatch(GET_FLIGHT_RELATE, {
            id: item.id
          }).then(() => {
            this.dialogData = this.flightRelate.getFlightRelate
            this.dialogSwitch = true
            this.dialogTitle = '编辑'
          })
        }
      },
      /**
       * 删除
       * @param item
       * @param scope
       */
      remove(item, scope) {
        let removeId = item.id
        this.$confirm('确认删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dispatch(REMOVE_FLIGHT_RELATE, {
            id: removeId
          }, scope.$index).then(() => {
            this.$message({
              message: '删除操作成功！',
              type: 'success'
            })
            console.log('delete', 'flightdelete')
            this.$emit('removeRow')
          })
          this.tableList = arrayGetRid(this.tableList, [item])
        }).catch(() => {});
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
        }
      }
    },
    mounted() {},
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      if (this.tableData) { // 初始化表格列
        this.tableList = this.dataMatch(this.tableData)
      }
    }
  }

</script>
