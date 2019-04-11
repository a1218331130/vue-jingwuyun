<!-- 资产情况 -->
<template>
<div>
  <!-- 标题 -->
  <card-header title="车辆信息" :tool="true" :add="true" @call:add="add"></card-header>
  <!-- 内容 -->

  <el-row :gutter="10" class="certificate-box">
    <el-col :span="24">
      <el-table :data="tableList" border>
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="name" label="车主"></el-table-column>
        <el-table-column prop="address" label="车主住址"></el-table-column>
        <el-table-column prop="carLicence" label="车牌号码"></el-table-column>
        <el-table-column prop="brand" label="中文品牌"></el-table-column>
        <el-table-column prop="carModelText" label="车辆类型"></el-table-column>
        <el-table-column prop="carColorText" label="车身颜色"></el-table-column>
        <el-table-column prop="carStateText" label="机动车状态"></el-table-column>
        <el-table-column prop="source" label="来源" width="50"></el-table-column>

        <el-table-column label="操作" width="80" align="center">
          <template scope="scope">
            <el-button type="text" @click="edit(scope.row)" title="编辑" v-if="checkUserRuleCase('ajgl/suspect/carupdate', caseId,true,cjrId) && scope.row.sourceCode !== '2'" icon="icon iconfont icon-brush"></el-button>
            <el-button type="text" @click="remove(scope.row,scope)" title="删除" v-if="checkUserRuleCase('ajgl/suspect/cardel', caseId,true,cjrId)" icon="icon iconfont icon-trash"></el-button>
          </template>
</el-table-column>
</el-table>
</el-col>
</el-row>

<!-- add/updata 弹窗 -->
<assetsCarDialog :dialog="dialogSwitch" :title="dialogTitle" :dataForm="dialogData" @update:submit="submit" @close="dialogSwitch = false"></assetsCarDialog>
</div>
</template>

<style scoped lang="scss">
  .certificate-box {
    margin-top: 13px;
  }

  .sun-title {
    height: 30px;
    line-height: 30px;
    color: #46BDFD;
  }

</style>

<script>
  //  import {mapState} from 'vuex'
  import reportMixin from '../reportMixin'
  import { arrayGetRid } from '../../../../utils/util'

  import cardHeader from '../../base/card-header.vue'
  import assetsCarDialog from '../dialog/assets-car-edit.vue'
  export default {
    mixins: [reportMixin],
    components: {
      cardHeader,
      assetsCarDialog
    },
    props: ['data', 'theSuspect'],
    computed: {},
    data() {
      return {
        tableList: [],
        tableDataLoc: [],
        dialogData: '',
        caseId: '', // 初始化案件ID+
        cjrId: '',
        dialogTitle: '',
        dialogSwitch: false // 弹窗触发
      }
    },
    methods: {
      /**
       * 数据匹配
       * @param rowArray 需要匹配的数据 get:[{},{}] save:{}
       * @param type 匹配类型 get: 转为前端可用  save 转为后端保存
       * @returns {Array}
       */
      dataMatch(rowArray, type) {
        let _dataM = []
        if (rowArray) {
          if (type === 'get') {
            _dataM = rowArray.map(r => {
              return {
                id: r.id,
                name: r.xm, // 车主
                IDCard: r.zjhm, // 证件号码
                birthdate: r.csrq ? this.dateFormat(new Date(r.csrq), 'yyyy-MM-dd') : '', // 出生日期
                address: r.xzzdzmc, // 车主住址
                carLicence: r.jdchphm, // 机动车牌号
                brand: r.zwppmc, // 中文品牌
                carModelCode: r.clxh, // 车辆类型代码
                carModelText: !r.clxhmc ? r.clxh + '(代码)' : r.clxhmc, // 车辆类型
                carColorCode: r.jdccsysdm, // 车身颜色代码
                carColorText: !r.jdccsysmc ? r.jdccsysdm + '(代码)' : r.jdccsysmc, // 车身颜色
                carStateCode: r.jdcztdm, // 机动车状态代码
                carStateText: !r.jdcztmc ? r.jdcztdm + '(代码)' : r.jdcztmc, // 机动车状态名称
                sourceCode: r.ly, // 数据来源代码
                source: r.ly === '2' ? '采集' : '手动' //  数据来源翻译
              }
            })
          }
          if (type === 'save') {
            let _f = rowArray
            _dataM = {
              id: _f.id, // 主键
              xm: _f.name, // 姓名
              zjhm: _f.IDCard, // 证件号码
              jdchphm: _f.carLicence, // 机动车牌号
              clxh: _f.carModelCode, // 车辆类型
              clxhmc: _f.carModelText,
              jdccsysdm: _f.carColorCode, // 颜色
              jdccsysmc: _f.carColorText,
              zwppmc: _f.brand, // 中文品牌
              xzzdzmc: _f.address, // 现住址地址名称
              jdcztdm: _f.carStateCode, // 机动车状态
              jdcztmc: _f.carStateText,
              csrq: _f.birthdate, // 出生日期
              ly: '0' // 来源
            }
          }
        }
        return _dataM
      },
      /**
       * 添加
       */
      add() {
        this.dialogData = ''
        this.dialogTitle = '添加'
        this.dialogSwitch = true
      },
      /**
       * 编辑
       * @param item
       */
      edit(item) {
        if (item.id) {
          this.dialogData = item
          this.dialogTitle = '编辑'
          this.dialogSwitch = true
        }
      },
      /**
       * 提交表单
       * @param f
       */
      submit(f) {
        let _optForm = this.dataMatch(f, 'save')
        let _message = ''
        if (f.id) {
          _optForm.id = f.id
          this.tableList.map((tr, tIndex) => {
            if (tr.id === f.id) {
              this.$set(this.tableList, tIndex, this.dataMatch([_optForm], 'get')[0])
              this.tableDataLoc[tIndex] = _optForm
            }
          })
          _message = '车辆信息更新'
        } else {
          _optForm.id = this.theSuspect.id + '_car_' + new Date().getTime();
          this.tableList = this.tableList.concat([this.dataMatch([_optForm], 'get')[0]]);
          this.tableDataLoc = this.tableDataLoc.concat([_optForm]);
          _message = '车辆信息添加'
        }
        this.dialogSwitch = false
        this.localUpdate(this.tableDataLoc, _message)
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
          this.localUpdate(this.tableDataLoc, '删除该条车辆信息')
          this.$emit('removeRow')
        }).catch(() => {});
      },
      /**
       * 本地更新数据操作
       * @param _text
       */
      localUpdate(ctableData, _text = '') {
        let _tempReportContent = JSON.parse(this.caseReportVersion.getCaseReportVersion.data)
        if (_tempReportContent) {
          _tempReportContent['xinfo'].map((rt, rIndex) => {
            if (rt.baseinfo.id === this.theSuspect.id) {
              rt.car = ctableData
            }
          })
        }
        this.updateReport({ type: 'xinfo', data: _tempReportContent['xinfo'], text: _text }) // 更新数据对象
      },
      close() {
        this.dialogSwitch = false
        this.$emit('close')
      }
    },
    watch: {},
    mounted() {},
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.cjrId = this.$route.query.b // 初始化获取案件id
      if (this.data) { // 初始化表格列
        this.tableList = this.dataMatch(this.data, 'get')
        this.tableDataLoc = this.data
      }
    }
  }

</script>
