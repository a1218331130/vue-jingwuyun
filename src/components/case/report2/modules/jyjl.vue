<!-- 团伙交易记录 -->
<template>
<div>
  <!-- 标题 -->
  <card-header title="团伙交易记录" :tool="checkUserRuleCase('ajgl/bill/save', caseId,true,cjrId)" :add="true" @call:add="add"></card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="kinship-box">
    <el-col :span="24">
      <el-table :data="tableData" stripe border>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="jylx" label="交易类型" width="100"></el-table-column>
        <el-table-column prop="jyje" label="交易金额"></el-table-column>
        <el-table-column prop="jysj" label="交易时间"></el-table-column>
        <el-table-column prop="jykh" label="交易账号"></el-table-column>
        <el-table-column prop="zy" label="内容" align="left">
          <template scope="scope">
            <p class="describe-text">
              {{scope.row.zy}}
            </p>
          </template>
</el-table-column>
<el-table-column prop="khm" label="开户名"></el-table-column>
<el-table-column prop="jywdmc" label="交易网点名称"></el-table-column>
<el-table-column prop="zy" label="备注"></el-table-column>
<el-table-column prop="sourceCode" label="来源">
  <template scope="scope">
    {{scope.row.source!==1 && scope.row.source !=='1'?'手动':'检索'}}
    </template>
</el-table-column>

<el-table-column label="操作" width="80" align="center">
  <template scope="scope">
            <el-button type="text" @click="edit(scope.row)"  title="编辑" v-if="checkUserRuleCase('ajgl/bill/update', caseId,true,cjrId) && scope.row.sourceCode !== '1'&& scope.row.sourceCode !== 1" icon="icon iconfont icon-brush"></el-button>
            <el-button type="text" title="删除" v-if="checkUserRuleCase('ajgl/bill/delete', caseId,true,cjrId) && scope.row.sourceCode !== '1' && scope.row.sourceCode !== 1" @click="remove(scope.row,scope)" icon="icon iconfont icon-trash"></el-button>
          </template>
</el-table-column>
</el-table>

<!-- add/updata 弹窗 -->
<jyjl-edit :dialog="dialogSwitch" :title="dialogTitle" :dataForm="dialogData" @update:submit="submit" @close="dialogSwitch = false"></jyjl-edit>

</el-col>
</el-row>
</div>
</template>

<style scoped lang="scss">
  .kinship-box {
    margin-top: 13px;
  }

  .describe-text {
    white-space: normal;
  }

  .k-user-img-box {
    width: 49px;
    height: 49px;
    border: 1px solid #D7D7D7;
    margin: 10px auto;
    overflow: hidden;
    .k-user-img {
      width: 90%;
      height: 100%;
      margin: 1px auto;
    }
  }

</style>

<script>
  import '../../../../utils/dateFormat'
  import cardHeader from '../../base/card-header.vue'
  //  import {mapState} from 'vuex'
  import reportMixin from '../reportMixin'
  import { arrayGetRid, clone } from '../../../../utils/util'
  import jyjlEdit from '../dialog/jyjl-edit.vue'
  export default {
    mixins: [reportMixin],
    components: {
      cardHeader,
      jyjlEdit
    },
    props: {
      reportData: {
        type: Array,
        default: () => {
          return null
        }
      }
    },
    computed: {},
    data() {
      return {
        tableDataLoc: [],
        caseId: '',
        cjrId: '', //
        tableData: [],
        dialogData: '',
        dialogTitle: '',
        dialogSwitch: false // 弹窗触发
      }
    },
    methods: {
      queryList() {
        if (this.reportData) {
          this.tableData = clone(this.reportData)
          this.tableDataLoc = clone(this.reportData)
        }
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
          this.tableDataLoc.map(lr => {
            if (lr.id === item.id) {
              this.dialogData = lr
              this.dialogTitle = '编辑'
              this.dialogSwitch = true
            }
          })
        }
      },
      /**
       * 提交表单
       * @param f
       */
      submit(f) {
        let _machF = clone(f)
        let _message = '团伙交易记录添加'
        if (f.id) { // 判断id 是否为空, 否则做更新提交
          // _machF.id = f.id
          this.tableData.map((tr, tIndex) => {
            if (tr.id === f.id) {
              this.$set(this.tableData, tIndex, _machF)
              this.tableDataLoc[tIndex] = _machF
            }
          })
          _message = '团伙交易记录更新'
        } else {
          _machF.id = 'tdeal_' + new Date().getTime()
          _machF.ly = f.source
          this.tableData = this.tableData.concat([_machF])
          this.tableDataLoc = this.tableDataLoc.concat([_machF])
          _message = '团伙交易记录添加'
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
          // this.$emit('removeRow')
          this.tableData = arrayGetRid(this.tableData, [item])
          this.tableDataLoc = this.tableDataLoc.filter(fr => fr.id !== item.id)
          this.localUpdate(this.tableDataLoc, '删除该条团伙交易记录')
        }).catch(() => {});
      },
      /**
       * 本地更新数据操作
       * @param _text
       */
      localUpdate(TtableData, _text = null) {
        let _tempReportContent = JSON.parse(this.caseReportVersion.getCaseReportVersion.data)
        if (_tempReportContent) {
          _tempReportContent['tdeal'] = TtableData
        }
        this.updateReport({ type: 'tdeal', data: _tempReportContent['tdeal'], text: _text }) // 更新数据对象
      }
    },
    watch: {
      reportData(val) {
        if (val) {
          this.queryList()
        }
      }
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.cjrId = this.$route.query.b // 初始化获取案件id
      this.queryList()
    }
  }

</script>
