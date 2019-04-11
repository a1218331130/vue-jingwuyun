<!-- samecase / 同案 -->
<template>
<div>
  <div class="add-box-button">
    <el-button type="text" class="export-text iconfont icon-plus" @click="add()">添加</el-button>
  </div>
  <el-table :data="tableList" border>
    <el-table-column type="index" width="50" label="序号"></el-table-column>
    <el-table-column prop="name" label="姓名" width="80"></el-table-column>
    <el-table-column prop="IDCard" label="证件号码"></el-table-column>
    <el-table-column prop="formerName" label="曾用名"></el-table-column>
    <el-table-column prop="nickname" label="绰号"></el-table-column>

    <el-table-column prop="caseName" label="案件名称"></el-table-column>
    <el-table-column prop="caseBrief" label="简要案情"></el-table-column>
    <el-table-column prop="caseTypeText" label="案件类别"></el-table-column>
    <el-table-column prop="caseNatureText" label="案件性质"></el-table-column>
    <el-table-column prop="collectUnitName" label="采集单位"></el-table-column>
    <el-table-column prop="source" label="来源" width="50"></el-table-column>

    <el-table-column label="操作" width="80" align="center">
      <template scope="scope">
        <el-button type="text" @click="edit(scope.row)" title="编辑" v-if="checkRuleCase('ajgl/samecase/updatexyr', caseId) && scope.row.sourceCode !== '1'" icon="icon iconfont icon-brush"></el-button>
        <el-button type="text" @click="remove(scope.row,scope)" title="删除" v-if="checkRuleCase('ajgl/samecase/delxyr', caseId)" icon="icon iconfont icon-trash"></el-button>
      </template>
</el-table-column>
</el-table>

<!-- add/updata 弹窗 -->
<samecaseDialog :dialog="dialogSwitch" :title="dialogTitle" :dataForm="dialogData" @update:submit="submit" @close="close"></samecaseDialog>

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

  import samecaseDialog from '../../dialog/social-samecase-edit.vue'

  export default {
    mixins: [reportMixin],
    components: {
      samecaseDialog
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
              IDCard: ra.sfzhm, // 证件号码
              formerName: ra.cym, // 曾用名
              nickname: ra.ch, // 绰号

              caseName: ra.ajmc, // 案件名称
              caseNumber: ra.ajbh, // 案件名称
              caseBrief: ra.jyaq, // 简要案情
              caseType: ra.ajlb, // 案件类别
              caseTypeText: ra.ajlbmc, // 案件类别名称
              caseNature: ra.ajxz, // 案件性质
              caseNatureText: ra.ajxzmc, // 案件性质名称
              collectUnitCode: ra.cjdwdm, // 采集单位代码
              collectUnitName: ra.cjdwmc, // 采集单位名称
              collectTime: ra.cjsj ? this.dateFormat(new Date(ra.cjsj), 'yyyy-MM-dd hh:mm:ss') : '', // 采集时间
              collectName: ra.cjrxm, // 采集人姓名
              collectPoliceNumber: ra.cjrjh, // 采集人警号
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
          xm: f.name, // 姓名
          sfzhm: f.IDCard, // 身份证号码
          ly: f.sourceCode, // 来源
          cym: f.formerName, // 曾用名
          ch: f.nickname, // 绰号
          ajmc: f.caseName, // 案件名称
          ajbh: f.caseNumber, // 案件编号
          ajlb: f.caseType, // 案件类型
          ajlbmc: f.caseTypeText, // 案件类型名称
          ajxz: f.caseNature, // 案件性质
          ajxzmc: f.caseNatureText, // 案件性质名称
          jyaq: f.caseBrief, // 简要案情
          cjsj: f.collectTime, // 采集时间
          cjrxm: f.collectName, // 采集人姓名
          cjrjh: f.collectPoliceNumber, // 采集人警号
          cjdwdm: f.collectUnitCode, // 采集单位代码
          cjdwmc: f.collectUnitName // 采集单位名称
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
          _message = '同案记录更新'
        } else {
          _optForm.id = this.theSuspect.id + '_samecase_' + new Date().getTime()
          this.tableList = this.tableList.concat([this.dataMatch([_optForm])[0]])
          this.tableDataLoc = this.tableDataLoc.concat([_optForm])
          _message = '同案记录添加'
        }

        this.localUpdate(this.tableDataLoc, _message, 'add-samecase') // 更新数据操作
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
          this.localUpdate(this.tableDataLoc, '删除该条同案记录', 'minus-samecase')
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
              rt.samecase = ltableData
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
