<!-- 资产情况 -->
<template>
  <div>
    <!-- 标题 -->
    <card-header title="车辆信息"
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
              <el-button type="text" @click="edit(scope.row)" title="编辑" v-if="checkRuleCase('ajgl/suspect/carupdate', caseId) && scope.row.sourceCode !== '2'"
                         icon="icon iconfont icon-brush"></el-button>
              <el-button type="text" @click="remove(scope.row,scope)" title="删除" v-if="checkRuleCase('ajgl/suspect/cardel', caseId)"
                         icon="icon iconfont icon-trash"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- add/updata 弹窗 -->
    <assetsCarDialog :dialog="dialogSwitch" :title="dialogTitle" :dataForm="dialogData" @update:submit="submit"
                     @close="dialogSwitch = false"></assetsCarDialog>
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
  import {mapState} from 'vuex'
  import mixin from '../../../../utils/mixin'
  import {arrayGetRid} from '../../../../utils/util'
  import {
    FETCH_SUSPECT_CAR_LIST,
    ADD_SUSPECT_CAR,
    UPDATE_SUSPECT_CAR,
    REMOVE_SUSPECT_CAR,
    GET_SUSPECT_CAR
  } from '../../../../store/types'

  import cardHeader from '../../base/card-header.vue'
  import assetsCarDialog from '../dialog/assets-car-edit.vue'
  export default{
    mixins: [mixin],
    components: {
      cardHeader,
      assetsCarDialog
    },
    props: ['data', 'theSuspect'],
    computed: {
      ...mapState(['suspectCar'])
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
                name: r.xm, // 车主
                IDCard: r.zjhm, // 证件号码
                birthdate: r.csrq, // 出生日期
                address: r.xzzdzmc, // 车主住址
                carLicence: r.jdchphm, // 机动车牌号
                brand: r.zwppmc, // 中文品牌
                carModelCode: r.clxh, // 车辆类型代码
                carModelText: r.clxhmc === null ? r.clxh + '(代码)' : r.clxhmc, // 车辆类型
                carColorCode: r.jdccsysdm, // 车身颜色代码
                carColorText: r.jdccsysmc === null ? r.jdccsysdm + '(代码)' : r.jdccsysmc, // 车身颜色
                carStateCode: r.jdcztdm, // 机动车状态代码
                carStateText: r.jdcztmc === null ? r.jdcztdm + '(代码)' : r.jdcztmc, // 机动车状态名称
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
              jdccsysdm: _f.carColorCode, // 颜色
              zwppmc: _f.brand, // 中文品牌
              xzzdzmc: _f.address, // 现住址地址名称
              jdcztdm: _f.carStateCode, // 机动车状态
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
          this.dispatch(GET_SUSPECT_CAR, {
            id: item.id
          }).then(() => {
            this.dialogData = this.dataMatch([this.suspectCar.getSuspectCar], 'get')[0]
            this.dialogTitle = '编辑'
            this.dialogSwitch = true
          })
        }
      },
      /**
       * 列表查询
       */
      queryList() {
        if (this.checkRuleCase('ajgl/suspect/carlist', this.caseId)) {
          this.dispatch(FETCH_SUSPECT_CAR_LIST, {
            ajid: this.caseId,
            xyrid: this.theSuspect.id, // 嫌疑人ID
            xyrsfz: this.theSuspect.sfz // 嫌疑人身份证
          }).then((row) => {
            this.tableList = this.dataMatch(this.suspectCar.fetchSuspectCarList, 'get')
          })
        }
      },
      /**
       * 提交表单
       * @param f
       */
      submit(f) {
        let _path = ADD_SUSPECT_CAR
        let _optForm = this.dataMatch(f, 'save')
        if (f.id) {
          _path = UPDATE_SUSPECT_CAR
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
            this.dispatch(ADD_SUSPECT_CAR, Object.assign(_opt, {
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
            }).catch(() => {
            });
          } else {
            this.dispatch(REMOVE_SUSPECT_CAR, {
              id: removeId
            }, scope.$index).then(() => {
              this.$message({
                message: '删除操作成功！',
                type: 'success'
              })
              this.$emit('removeRow')
              this.tableList = arrayGetRid(this.tableList, [item])
            }).catch(() => {
            });
          }
        }).catch(() => {
        });
      }
    },
    watch: {},
    mounted() {
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      if (this.data) { // 初始化表格列
        this.tableList = this.dataMatch(this.data, 'get')
      }
    }
  }
</script>
