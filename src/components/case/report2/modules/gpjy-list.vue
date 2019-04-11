<!-- 资产情况 -->
<template>
<div>
  <!-- 标题 -->
  <card-header title="高频交易" :tool="false" :add="true" @call:add="add"></card-header>
  <!-- 内容 -->
  <el-row :gutter="10" class="certificate-box">
    <el-col :span="24">
      <el-table :data="tableList" border>
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="zzh" label="主帐号"></el-table-column>
        <el-table-column prop="dfzh" label="对方帐号"></el-table-column>
        <el-table-column prop="dfkhm" label="对方开户名"></el-table-column>
        <el-table-column prop="dfsfzhm" label="对方身份证号码"></el-table-column>
        <el-table-column prop="jycs" label="交易次数"></el-table-column>
        <el-table-column prop="jyje" label="交易金额"></el-table-column>
        <el-table-column prop="scjysj" label="首次交易时间"></el-table-column>
        <el-table-column prop="zhjysj" label="最后交易时间"></el-table-column>

        <!--<el-table-column label="操作" width="80" align="center">
            <template scope="scope">
              <el-button type="text" @click="edit(scope.row)" title="编辑"
                         v-if="checkUserRuleCase('ajgl/suspect/houseupdate', caseId) && scope.row.sourceCode !== '1'"
                         icon="icon iconfont icon-brush"></el-button>
              <el-button type="text" @click="remove(scope.row,scope)" title="删除"
                         v-if="checkUserRuleCase('ajgl/suspect/housedel', caseId)"
                         icon="icon iconfont icon-trash"></el-button>
            </template>
          </el-table-column>-->
      </el-table>
    </el-col>
  </el-row>

  <!-- add/updata 弹窗 -->
  <assetsRealEstateDialog :dialog="dialogSwitch" :title="dialogTitle" :dataForm="dialogData" @update:submit="submit" @close="dialogSwitch = false"></assetsRealEstateDialog>
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
import cardHeader from '../../base/card-header.vue'
import assetsRealEstateDialog from '../dialog/assets-real-estate-edit.vue'

//  import {mapState} from 'vuex'
import reportMixin from '../reportMixin'
import { arrayGetRid } from '../../../../utils/util'

export default {
  mixins: [reportMixin],
  components: {
    cardHeader,
    assetsRealEstateDialog
  },
  props: ['data', 'theSuspect'],
  computed: {},
  data() {
    return {
      tableList: [],
      tableDataLoc: [],
      dialogData: '',
      caseId: '', // 初始化案件ID
      cjrId: '', //
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
      if(rowArray) {
        if(type === 'get') {
          _dataM = rowArray.map(r => {
            return r
          })
        }
        if(type === 'save') {
          let _f = rowArray
          _dataM = _f
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
      if(item.id) {
        this.dialogData = item
        this.dialogTitle = '编辑房产信息'
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
      if(f.id) {
        _optForm.id = f.id
        this.tableList.map((tr, tIndex) => {
          if(tr.id === f.id) {
            this.$set(this.tableList, tIndex, this.dataMatch([_optForm], 'get')[0])
            this.tableDataLoc[tIndex] = _optForm
          }
        })
        _message = '高频交易更新'
      } else {
        _optForm.id = this.theSuspect.id + '_house_' + new Date().getTime()
        this.tableList = this.tableList.concat([this.dataMatch([_optForm], 'get')[0]])
        this.tableDataLoc = this.tableDataLoc.concat([_optForm])
        _message = '高频交易添加'
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
        this.localUpdate(this.tableDataLoc, '删除该条房产信息')
      }).catch(() => {});
    },
    /**
     * 本地更新数据操作
     * @param _text
     */
    localUpdate(htableData, _text = null) {
      let _tempReportContent = JSON.parse(this.caseReportVersion.getCaseReportVersion.data)
      if(_tempReportContent) {
        _tempReportContent['xinfo'].map((rt, rIndex) => {
          if(rt.baseinfo.id === this.theSuspect.id) {
            rt.house = htableData
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
    if(this.data) { // 初始化表格列
      this.tableList = this.dataMatch(this.data, 'get')
      this.tableDataLoc = this.data
    }
  }
}
</script>
