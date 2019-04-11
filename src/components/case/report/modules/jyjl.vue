<!-- 团伙交易记录 -->
<template>
  <div>
    <!-- 标题 -->
    <card-header title="团伙交易记录"
                 :tool="checkRuleCase('ajgl/bill/save', caseId)"
                 :add="true"
                 @call:add="add"
    ></card-header>
    <!-- 内容 -->
    <el-row :gutter="15" class="kinship-box">
      <el-col :span="24">
        <el-table :data="tableData" stripe border>
          <el-table-column type="index" label="序号" width="70"></el-table-column>
          <el-table-column prop="jylx" label="交易类型" width="100"></el-table-column>
          <el-table-column prop="jyje" label="交易金额" width="150"></el-table-column>
          <el-table-column prop="jysj" label="交易时间" width="220"></el-table-column>
          <el-table-column prop="jykh" label="交易账号" width="220"></el-table-column>
          <el-table-column prop="zy" label="内容" align="left">
            <template scope="scope">
              <p class="describe-text">
                {{scope.row.zy}}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="khm" label="开户名" width="220"></el-table-column>
          <el-table-column prop="jywdmc" label="交易网点名称" width="220"></el-table-column>
          <el-table-column prop="bz" label="备注" width="220"></el-table-column>
          <el-table-column prop="source" label="来源" width="50"></el-table-column>

          <el-table-column label="操作" width="80" align="center">
            <template scope="scope">
              <el-button type="text" @click="edit(scope.row)" title="编辑"
                         v-if="checkRuleCase('ajgl/bill/update', caseId) && scope.row.sourceCode !== '1'"
                         icon="icon iconfont icon-brush"></el-button>
              <el-button type="text" title="删除"
                         v-if="checkRuleCase('ajgl/bill/delete', caseId) && scope.row.sourceCode !== '1'"
                         @click="remove(scope.row,scope)" icon="icon iconfont icon-trash"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- add/updata 弹窗 -->
        <jyjl-edit :dialog="dialogSwitch"
                   :title="dialogTitle"
                   :dataForm="dialogData"
                   @update:submit="submit"
                   @close="dialogSwitch = false"></jyjl-edit>

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
  import cardHeader from '../../base/card-header.vue'
  import {mapState} from 'vuex'
  import mixin from '../../../../utils/mixin'
  import {arrayGetRid} from '../../../../utils/util'
  import {
    FETCH_GANGS_TRA_LIST, // 查询交易列表
    GET_GANGS_TRA,
    ADD_GANGS_TRA,
    REMOVE_GANGS_TRA,
    UPDATE_GANGS_TRA,
    FETCH_SUSPECT_CASE_PEOPLE_LIST, // 嫌疑人
    FETCH_GANG_TRANSACT_LIST // 交易记录，
  } from '../../../../store/types'
  import jyjlEdit from '../dialog/jyjl-edit.vue'
  export default {
    mixins: [mixin],
    components: {
      cardHeader,
      jyjlEdit
    },
    computed: {
      ...mapState(['suspectCasePeople', 'involvedCasePeople', 'gangsTra'])
    },
    data() {
      return {
        caseId: '',
        tableData: [],
        dialogData: '',
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
            _dataM = rowArray.map(gt => {
              return gt
//              return {
//                id: gt.id, // 账单guid
//                type: gt.jylx, // 交易类型
//                typeText: gt.jylxmc, // 交易类型
//                jiner: gt.jyje, // 交易金额
//                time: gt.cjsj, // 交易时间
//                jykh: gt.jykh, // 交易卡号
//                describe: gt.zy, // 摘要信息 (内容)
//                car: gt.khm, // 开户名 (账号信息)
//                sfzhm: gt.sfzhm, // 开户身份证号 (账号信息)
//                tujing: gt.jywdmc, // 交易网点名称 (途径)
//                note: gt.bz  // 备注信息
//              }
            })
          }
          if (type === 'save') {
            let _f = rowArray
            _dataM = _f
//            _dataM = {
//              id: _f.id, // 账单guid
//              jylx: _f.type, // 交易类型
//              jyje: _f.jiner, // 交易金额
//              cjsj: _f.time, // 交易时间
//              jykh: _f.jykh, // 交易卡号
//              zy: _f.describe, // 摘要信息 (内容)
//              khm: _f.car, // 开户名 (账号信息)
//              sfzhm: _f.sfzhm, // 开户身份证号 (账号信息)
//              jywdmc: _f.tujing, // 交易网点名称 (途径)
//              bz: _f.note // 备注信息
//            }
          }
        }
        return _dataM
      },
      queryList() {
        if (this.checkRuleCase('Zdfx/GetDRJYMXList', this.caseId)) {
          this.dispatch(FETCH_SUSPECT_CASE_PEOPLE_LIST, {
            ajid: this.caseId,
            PageIndex: 1,
            PageSize: 1000000
          }).then(r => {
            let _tempIdCard = []
            this.suspectCasePeople.PageData.map(r => {
              if (r.sfz) {
                _tempIdCard.push(r.sfz)
              }
            })
            if (_tempIdCard.length > 0) {
              this.dispatch(FETCH_GANG_TRANSACT_LIST, {
                v_sfzhms: _tempIdCard.join(',')
              }).then(rSub => {
                if (this.involvedCasePeople.fetchGangTransactList.DRJYMXList) {
                  this.tableData = this.involvedCasePeople.fetchGangTransactList.DRJYMXList.map(rjy => {
                    return {
                      id: rjy.guid, // 账单guid
                      type: rjy.jylx, // 交易类型
                      jiner: rjy.jyje, // 交易金额
                      time: rjy.jysj, // 交易时间
                      jykh: rjy.jykh, // 交易卡号
                      describe: rjy.zy, // 摘要信息 (内容)
                      car: rjy.khm, // 开户名 (账号信息)
                      tujing: rjy.jywdmc, // 交易网点名称 (途径)
                      sourceCode: '1', // 数据来源代码
                      source: '采集', //  数据来源翻译
                      note: rjy.bz  // 备注信息
                    }
                  })
                  // 根据案件ID查询交易记录列表
                  this.queryListByAjid()
                }
              })
            }
          })
        }
      },
      /**
       * 根据案件ID查询交易记录列表
       */
      queryListByAjid() {
        this.dispatch(FETCH_GANGS_TRA_LIST, {
          ajid: this.caseId
        }).then(() => {
          this.tableData = []
          let _tabel = this.gangsTra.fetchGangsTraList.map(gt => {
            return gt
//            return {
//              id: gt.id, // 账单guid
//              type: gt.jylx, // 交易类型
//              typeText: gt.jylxmc, // 交易类型
//              jiner: gt.jyje, // 交易金额
//              time: gt.cjsj, // 交易时间
//              jykh: gt.jykh, // 交易卡号
//              describe: gt.zy, // 摘要信息 (内容)
//              car: gt.khm, // 开户名 (账号信息)
//              tujing: gt.jywdmc, // 交易网点名称 (途径)
//              sourceCode: '0', // 数据来源代码
//              source: '手动', //  数据来源翻译
//              note: gt.bz  // 备注信息
//            }
          })
          // 合并接口列表数据
          this.tableData = this.tableData.concat(_tabel)
        })
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
          this.dispatch(GET_GANGS_TRA, {
            id: item.id,
            ajid: this.caseId
          }).then(() => {
            this.dialogData = this.dataMatch([this.gangsTra.getGangsTra], 'get')[0]
            this.dialogTitle = '编辑'
            this.dialogSwitch = true
          })
        }
      },
      /**
       * 提交表单
       * @param f
       */
      submit(f) {
        let _path = ADD_GANGS_TRA
        let _optForm = this.dataMatch(f, 'save')
        if (f.id) {
          _path = UPDATE_GANGS_TRA
          _optForm.id = f.id
        }
        this.dispatch(_path, Object.assign(_optForm, {
          ajid: this.caseId
        })).then(r => {
          this.dialogSwitch = false
          this.queryListByAjid()
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
          this.dispatch(REMOVE_GANGS_TRA, {
            id: removeId
          }, scope.$index).then(() => {
            this.$message({
              message: '删除操作成功！',
              type: 'success'
            })
            this.tableData = arrayGetRid(this.tableData, [item])
            this.$emit('removeRow')
          }).catch(() => {
          });
        }).catch(() => {
        });
      }
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.queryListByAjid()
    }
  }
</script>
