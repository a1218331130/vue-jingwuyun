<!-- 团伙通讯记录 -->
<template>
  <div>
    <!-- 标题 -->
    <card-header title="团伙通讯记录"
                 :tool="checkRuleCase('ajgl/tel/save', caseId)"
                 :add="true"
                 @call:add="add"
    ></card-header>
    <!-- 内容 -->
    <el-row :gutter="15" class="kinship-box">
      <el-col :span="24">
        <el-table
          :data="tableData"
          stripe
          border
        >

          zjhm: '', // 主机号码
          zjxm: '', // 主机号码姓名
          zjsfzhm: '', // 主叫身份证号码
          hjlx: '', // 呼叫类型  下拉，0主叫1被叫
          dfhm: '', // 对方号码
          thd: '', // 通话位置所在地
          thsj: '', // 通话时间
          thsc: '', // 通话时长
          jzdm: '', // 基站代码
          xqdm: '', // 小区代码
          gsd: '', // 对方号码归属地
          thdd: '', // 通话地点
          jd: '', // 经度
          wd: '', // 纬度
          zw: '', // 职位
          thddm: '', // 通话地代码
          hjlxdm: '', // 呼叫类型代码0，1
          dfsfzhm: '', // 对方身份证号码
          dfxm: '' // 对方姓名

          <el-table-column type="index" label="序号" width="70"></el-table-column>
          <el-table-column prop="dfsfzhm"
                           label="被叫身份证号"
                           width="200"
          >
          </el-table-column>
          <el-table-column prop="dfxm" label="人员姓名" width="100"></el-table-column>
          <el-table-column prop="dfhm" label="联系号码" width="220"></el-table-column>
          <el-table-column prop="hjlx" label="呼叫类型" width="220"></el-table-column>
          <el-table-column prop="thsj" label="时间" width="220"></el-table-column>
          <el-table-column prop="thsc" label="通话时长">
            <template scope="scope">
              <p class="describe-text">
                {{scope.row.thsc}}
              </p>
            </template>
</el-table-column>
<el-table-column prop="source" label="来源" width="50">

</el-table-column>
<el-table-column label="操作" width="80" align="center">
  <template scope="scope">
              <el-button type="text" @click="edit(scope.row)" title="编辑"
                         v-if="checkRuleCase('ajgl/tel/update', caseId) && scope.row.sourceCode !== '1'"
                         icon="icon iconfont icon-brush"></el-button>
              <el-button type="text" title="删除"
                         v-if="checkRuleCase('ajgl/tel/delete', caseId) && scope.row.sourceCode !== '1'"
                         @click="remove(scope.row,scope)" icon="icon iconfont icon-trash"></el-button>
            </template>
</el-table-column>
</el-table>

<!-- add/updata 弹窗 -->
<txjl-edit :dialog="dialogSwitch" :title="dialogTitle" :dataForm="dialogData" @update:submit="submit" @close="dialogSwitch = false"></txjl-edit>

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
  import { mapState } from 'vuex'
  import mixin from '../../../../utils/mixin'
  import cardHeader from '../../base/card-header.vue'
  import { arrayGetRid } from '../../../../utils/util'
  import {
    FETCH_GANGS_CALL_LIST,
    ADD_GANGS_CALL,
    REMOVE_GANGS_CALL,
    UPDATE_GANGS_CALL,
    GET_GANGS_CALL,
    FETCH_SUSPECT_CASE_PEOPLE_LIST, // 嫌疑人
    FETCH_GANG_CALL_LIST // 交易记录
  } from '../../../../store/types'
  import txjlEdit from '../dialog/txjl-edit.vue'
  export default {
    mixins: [mixin],
    components: {
      cardHeader,
      txjlEdit
    },
    computed: {
      ...mapState(['suspectCasePeople', 'involvedCasePeople', 'gangsCall'])
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
              //                id: gt.id,
              //                IDCard: gt.dfsfzhm, // 对方号码身份证号
              //                name: gt.dfxm, // 人员姓名
              //                phone: gt.dfhm, // 对方号码
              //                time: gt.thsj, // 时间
              //                type: gt.hjlx, // 通信方式
              //                timeLength: gt.thsc // 通话时长
              //              }
            })
          }
          if (type === 'save') {
            let _f = rowArray
            _dataM = _f
            //            _dataM = {
            //              id: _f.id,
            //              dfsfzhm: _f.IDCard, // 对方号码身份证号
            //              dfxm: _f.name, // 人员姓名
            //              dfhm: _f.phone, // 对方号码
            //              thsj: _f.time, // 时间
            //              hjlx: _f.type, // 通信方式
            //              thsc: _f.timeLength // 通话时长
            //            }
          }
        }
        return _dataM
      },
      queryList() {
        if (this.checkRuleCase('Hdfx/GetDRTHMXList', this.caseId)) {
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
              this.dispatch(FETCH_GANG_CALL_LIST, {
                v_sfzhms: _tempIdCard.join(',')
              }).then(rSub => {
                if (this.involvedCasePeople.fetchGangCallList.DRTHMXModelList) {
                  this.tableData = this.involvedCasePeople.fetchGangCallList.DRTHMXModelList.map(rjy => {
                    return rjy
                    //                    return {
                    //                      id: rjy.guid,
                    //                      IDCard: rjy.DFSFZHM, // 对方号码身份证号
                    //                      name: rjy.xm, // 人员姓名
                    //                      phone: rjy.dfhm, // 联系号码
                    //                      time: rjy.thrq + '' + rjy.thsj, // 时间
                    //                      type: rjy.hjlx, // 通信方式
                    //                      timeLength: rjy.thsc // 通话时长
                    //                    }
                  })
                  // 根据案件案件id 查询
                  this.queryListByAjid()
                }
              })
            }
          })
        }
      },
      /**
       * 根据案件ID查询通讯记录列表
       */
      queryListByAjid() {
        this.dispatch(FETCH_GANGS_CALL_LIST, {
          ajid: this.caseId
        }).then(() => {
          this.tableData = []
          let _tabel = this.gangsCall.fetchGangsCallList.map(gt => {
            return gt
            //            return {
            //              id: gt.id,
            //              IDCard: gt.dfsfzhm, // 对方号码身份证号
            //              name: gt.dfxm, // 人员姓名
            //              phone: gt.dfhm, // 对方号码
            //              time: gt.thsj, // 时间
            //              type: gt.hjlx, // 通信方式
            //              timeLength: gt.thsc // 通话时长
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
          this.dispatch(GET_GANGS_CALL, {
            id: item.id
          }).then(() => {
            this.dialogData = this.dataMatch([this.gangsCall.getGangsCall], 'get')[0]
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
        let _path = ADD_GANGS_CALL
        let _optForm = this.dataMatch(f, 'save')
        if (f.id) {
          _path = UPDATE_GANGS_CALL
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
          this.dispatch(REMOVE_GANGS_CALL, {
            id: removeId
          }, scope.$index).then(() => {
            this.$message({
              message: '删除操作成功！',
              type: 'success'
            })
            this.tableData = arrayGetRid(this.tableData, [item])
            this.$emit('removeRow')
          }).catch(() => {});
        }).catch(() => {});
      }
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.queryListByAjid()
    }
  }

</script>
