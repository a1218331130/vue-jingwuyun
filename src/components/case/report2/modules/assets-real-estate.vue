<!-- 资产情况 -->
<template>
<div>
  <!-- 标题 -->
  <card-header title="房产信息" :tool="true" :add="true" @call:add="add"></card-header>
  <!-- 内容 -->
  <el-row :gutter="10" class="certificate-box">
    <el-col :span="24">
      <el-table :data="tableList" border>
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="number" label="房产证号"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="use" label="房屋用途"></el-table-column>
        <el-table-column prop="type" label="房屋类型"></el-table-column>
        <el-table-column prop="area" label="住房面积"></el-table-column>
        <el-table-column prop="marketPrice" label="市场价值"></el-table-column>
        <el-table-column prop="nowBelongsPeople" label="房主"></el-table-column>
        <el-table-column prop="nowBelongsPeopleIDCard" label="房主证件号码"></el-table-column>
        <el-table-column prop="sourceCode" label="来源" >
            <template scope="scope">
                {{(scope.row.sourceCode !== 1 && scope.row.sourceCode!=='1' ) ?'手动':'检索' }}
              </template>
</el-table-column>
<el-table-column label="操作" width="80" align="center">
  <template scope="scope">
            <el-button type="text" @click="edit(scope.row)" title="编辑" v-if="checkUserRuleCase('ajgl/suspect/houseupdate', caseId,true,cjrId) && scope.row.sourceCode !== '1' && scope.row.sourceCode !== 1" icon="icon iconfont icon-brush"></el-button>
            <el-button type="text" @click="remove(scope.row,scope)" title="删除" v-if="checkUserRuleCase('ajgl/suspect/housedel', caseId,true,cjrId)&& scope.row.sourceCode !== '1' && scope.row.sourceCode !== 1" icon="icon iconfont icon-trash"></el-button>
          </template>
</el-table-column>
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
                number: r.cqzZjhm, // 产权证_证件号码 房产证号
                address: r.fwdzJyqk, // 房屋地址 地址
                useCode: r.fwytdm, // 房屋用途代码
                use: r.fwytmc, // 房屋用途名称
                typeCode: r.fwlxJyqk, // 房屋类型代码
                type: r.fwlxJyqkmc, // 房屋类型名称
                area: r.jzmjMjpfm, // 建筑面积_面积（平方米) 住房面积
                nowBelongsPeople: r.xqlrXm, // 现权利人_姓名
                nowBelongsPeopleIDCard: r.xqlrZjhm, // 现权利人_证件号码
                marketPrice: r.cjzjJe, // 市场价值
                sourceCode: r.ly
              }
            })
          }
          if (type === 'save') {
            let _f = rowArray
            _dataM = {
              id: _f.id, // 主键
              cqzZjhm: _f.number, // 产权证_证件号码 房产证号
              fwdzJyqk: _f.address, // 房屋地址 地址
              fwytdm: _f.useCode, // 用途_简要情况 房屋用途
              fwytmc: _f.use, // 用途_简要情况 房屋用途
              fwlxJyqk: _f.typeCode, // 房屋类型 房屋类型
              fwlxJyqkmc: _f.type, // 房屋类型 房屋类型
              jzmjMjpfm: _f.area, // 建筑面积_面积（平方米) 住房面积
              xqlrXm: _f.nowBelongsPeople, // 现权利人_姓名
              xqlrZjhm: _f.nowBelongsPeopleIDCard, // 现权利人_证件号码
              cjzjJe: _f.marketPrice, // 市场价值
              ly: _f.sourceCode
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
          this.tableDataLoc.map(ir => {
            if (ir.id === item.id) {
              this.dialogData = item
              this.dialogTitle = '编辑房产信息'
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
        console.log(f)
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
          _message = '房产信息更新'
        } else {
          _optForm.id = this.theSuspect.id + '_house_' + new Date().getTime();
          this.tableList = this.tableList.concat([this.dataMatch([_optForm], 'get')[0]])
          this.tableDataLoc = this.tableDataLoc.concat([_optForm])
          _message = '房产信息添加'
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
        if (_tempReportContent) {
          _tempReportContent['xinfo'].map((rt, rIndex) => {
            if (rt.baseinfo.id === this.theSuspect.id) {
              rt.house = htableData
            }
          })
        }
        this.close()
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
