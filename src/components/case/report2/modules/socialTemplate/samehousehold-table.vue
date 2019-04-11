<!-- samehousehold / 同户 -->
<template>
<div>
  <div class="add-box-button">
    <el-button type="text" class="export-text iconfont icon-plus" @click="add()">添加</el-button>
  </div>
  <el-table :data="tableList" border>
    <el-table-column type="index" width="50" label="序号"></el-table-column>
    <el-table-column prop="name" label="姓名" width="80"></el-table-column>
    <el-table-column prop="IDCard" label="证件号码"></el-table-column>

    <el-table-column prop="sexText" label="性别" width="50"></el-table-column>
    <el-table-column prop="birthdate" label="出生日期" width="120"></el-table-column>
    <el-table-column prop="address" label="现住址"></el-table-column>
    <el-table-column prop="householdNumber" label="户号"></el-table-column>
    <el-table-column prop="PSBCode" label="公安局代码"></el-table-column>
    <el-table-column prop="PSBName" label="公安局名称"></el-table-column>
    <el-table-column prop="source" label="来源" width="50"></el-table-column>

    <el-table-column label="操作" width="80" align="center">
      <template scope="scope">
        <el-button type="text" @click="edit(scope.row)" title="编辑" v-if="checkRuleCase('ajgl/samehousehold/updateth', caseId) && scope.row.sourceCode !== '1'" icon="icon iconfont icon-brush"></el-button>
        <el-button type="text" @click="remove(scope.row,scope)" title="删除" v-if="checkRuleCase('ajgl/samehousehold/delth', caseId)" icon="icon iconfont icon-trash"></el-button>
      </template>
</el-table-column>
</el-table>

<!-- add/updata 弹窗 -->
<samehouseholdDialog :dialog="dialogSwitch" :title="dialogTitle" :dataForm="dialogData" @update:submit="submit" @close="close"></samehouseholdDialog>
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

  import samehouseholdDialog from '../../dialog/social-samehousehold-edit.vue'

  export default {
    mixins: [reportMixin],
    components: {
      samehouseholdDialog
    },
    props: ['tableData', 'theSuspect', 'addSwitch'],
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

              sex: ra.xbdm, // 性别代码
              sexText: ra.xbdm === '1' ? '男' : ra.xbdm === '2' ? '女' : '未知', // 性别名称
              birthdate: ra.csrq ? this.dateFormat(new Date(ra.csrq), 'yyyy-MM-dd') : '', // 出生日期
              address: ra.xzz, // 现住址
              householdNumber: ra.hh, // 户号
              PSBCode: ra.gajdm, // 公安局代码
              PSBName: ra.gajmc, // 公安局名称

              sourceCode: ra.ly, // 数据来源代码
              source: ra.ly === '1' ? '采集' : '手动' //  数据来源翻译

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
          ly: f.sourceCode, // 来源
          xm: f.name, // 姓名
          zjhm: f.IDCard, // 证件号码

          hh: f.householdNumber, // 户号
          gajdm: f.PSBCode, // 公安局代码
          gajmc: f.PSBName,
          csrq: f.birthdate, // 出生日期
          xbdm: f.sex, // 性别代码
          xzz: f.address // 现住址
        }
        let _message = ''
        if (f.id) {
          _optForm.id = f.id
          this.tableList.map((tr, tIndex) => {
            if (tr.id === f.id) {
              this.$set(this.tableList, tIndex, this.dataMatch([_optForm])[0])
              this.tableDataLoc[tIndex] = _optForm
            }
          })
          _message = '同户记录更新'
        } else {
          _optForm.id = this.theSuspect.id + '_samehousehold_' + new Date().getTime()
          this.tableList = this.tableList.concat([this.dataMatch([_optForm])[0]])
          this.tableDataLoc = this.tableDataLoc.concat([_optForm])
          _message = '同户记录添加'
        }
        this.localUpdate(this.tableDataLoc, _message, 'add-samehousehold') // 更新数据操作
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
          this.tableDataLoc = this.tableDataLoc.filter(fr => fr.id !== item.id)
          this.tableList = arrayGetRid(this.tableList, [item])
          this.localUpdate(this.tableDataLoc, '删除该条同户记录', 'minus-samehousehold')
        }).catch(() => {});
      },
      /**
       * 本地更新数据操作
       * @param _text
       */
      localUpdate(ltableData, _text = null, types) {
        let _tempReportContent = JSON.parse(this.caseReportVersion.getCaseReportVersion.data)
        if (_tempReportContent) {
          _tempReportContent['xinfo'].map((rt, rIndex) => {
            if (rt.baseinfo.id === this.theSuspect.id) {
              rt.samehousehold = ltableData
            }
          })
        }
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
