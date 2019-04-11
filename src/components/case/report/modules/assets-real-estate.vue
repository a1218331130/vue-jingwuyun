<!-- 资产情况 -->
<template>
  <div>
    <!-- 标题 -->
    <card-header title="房产信息"
                 :tool="true"
                 :add="true"
                 @call:add="add"></card-header>
    <!-- 内容 -->
    <el-row :gutter="10" class="certificate-box">
      <el-col :span="24">
        <el-table
          :data="tableList"
          border
        >
          <el-table-column type="index" label="序号" width="70"></el-table-column>
          <el-table-column prop="number" label="房产证号"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="useText" label="房屋用途"></el-table-column>
          <el-table-column prop="typeText" label="房屋类型"></el-table-column>
          <el-table-column prop="area" label="住房面积"></el-table-column>
          <el-table-column prop="marketPrice" label="市场价值"></el-table-column>
          <el-table-column prop="nowBelongsPeople" label="房主"></el-table-column>
          <el-table-column prop="nowBelongsPeopleIDCard" label="房主证件号码"></el-table-column>
                  <el-table-column prop="sourceCode" label="来源" >
            <template scope="scope">
                {{(scope.row.sourceCode !== undefined && scope.row.sourceCode !== 0 ) ? '检索' : '手动添加' }}
              </template>
        </el-table-column>
<el-table-column label="操作" width="80" align="center">
  <template scope="scope">
              <el-button type="text" @click="edit(scope.row)" title="编辑" v-if="checkRuleCase('ajgl/suspect/houseupdate', caseId) && scope.row.sourceCode !== '1' && scope.row.sourceCode !== 1"
                         icon="icon iconfont icon-brush"></el-button>
              <el-button type="text" @click="remove(scope.row,scope)" title="删除" v-if="checkRuleCase('ajgl/suspect/housedel', caseId) && scope.row.sourceCode !== '1' && scope.row.sourceCode !== 1"
                         icon="icon iconfont icon-trash"></el-button>
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

  import { mapState } from 'vuex'
  import mixin from '../../../../utils/mixin'
  import { arrayGetRid } from '../../../../utils/util'
  import {
    FETCH_SUSPECT_HOUSE_LIST,
    ADD_SUSPECT_HOUSE,
    UPDATE_SUSPECT_HOUSE,
    REMOVE_SUSPECT_HOUSE,
    GET_SUSPECT_HOUSE
  } from '../../../../store/types'
  export default {
    mixins: [mixin],
    components: {
      cardHeader,
      assetsRealEstateDialog
    },
    props: ['data', 'theSuspect'],
    computed: {
      ...mapState(['suspectHouse'])
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
                use: r.fwytdm, // 房屋用途代码
                useText: r.fwytmc, // 房屋用途名称
                type: r.fwlxJyqk, // 房屋类型代码
                typeText: r.fwlxJyqkmc, // 房屋类型名称
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
              fwytdm: _f.use, // 用途_简要情况 房屋用途
              fwlxJyqk: _f.type, // 房屋类型 房屋类型
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
          this.dispatch(GET_SUSPECT_HOUSE, {
            id: item.id
          }).then(() => {
            this.dialogData = this.dataMatch([this.suspectHouse.getSuspectHouse], 'get')[0]
            this.dialogTitle = '编辑'
            this.dialogSwitch = true
          })
        }
      },
      /**
       * 列表查询
       */
      queryList() {
        if (this.checkRuleCase('ajgl/suspect/houselist', this.caseId)) {
          this.dispatch(FETCH_SUSPECT_HOUSE_LIST, {
            ajid: this.caseId,
            xyrid: this.theSuspect.id, // 嫌疑人ID
            xyrsfz: this.theSuspect.sfz // 嫌疑人身份证
          }).then((row) => {
            this.tableList = this.dataMatch(this.suspectHouse.fetchSuspectHouseList, 'get')
          })
        }
      },
      /**
       * 提交表单
       * @param f
       */
      submit(f) {
        let _path = ADD_SUSPECT_HOUSE
        let _optForm = this.dataMatch(f, 'save')
        if (f.id) {
          _path = UPDATE_SUSPECT_HOUSE
          _optForm.id = f.id
        }
        this.dispatch(_path, Object.assign(_optForm, {
          ajid: this.caseId,
          xyrid: this.theSuspect.id, // 嫌疑人ID
          xyrsfz: this.theSuspect.sfz // 嫌疑人身份证
        })).then(r => {
          this.dialogSwitch = false
          this.queryList()
        })
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
          if (item.sourceCode === '1') { // 采集的数据删除处理逻辑
            let _opt = this.dataMatch(item, 'save')
            this.dispatch(ADD_SUSPECT_HOUSE, Object.assign(_opt, {
              ajid: this.caseId,
              xyrid: this.theSuspect.id, // 嫌疑人ID
              xyrsfz: this.theSuspect.sfz // 嫌疑人身份证
            })).then(r => {
              this.$message({
                message: '删除操作成功！',
                type: 'success'
              })
              this.$emit('removeRow')
              this.tableList = arrayGetRid(this.tableList, [item])
            }).catch(() => {});
          } else {
            this.dispatch(REMOVE_SUSPECT_HOUSE, {
              id: removeId
            }, scope.$index).then(() => {
              this.$message({
                message: '删除操作成功！',
                type: 'success'
              })
              this.$emit('removeRow')
              this.tableList = arrayGetRid(this.tableList, [item])
            }).catch(() => {});
          }
        }).catch(() => {});
      }
    },
    watch: {},
    mounted() {},
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      if (this.data) { // 初始化表格列
        this.tableList = this.dataMatch(this.data, 'get')
      }
    }
  }

</script>
