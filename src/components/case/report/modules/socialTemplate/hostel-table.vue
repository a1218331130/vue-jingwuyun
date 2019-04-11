<!-- hostel / 同行旅店 -->
<template>
  <div>
    <el-table :data="tableList" border>
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="IDCard" label="证件号码"></el-table-column>

      <el-table-column prop="hotelCode" label="旅馆编码"></el-table-column>
      <el-table-column prop="hotelName" label="旅馆名称"></el-table-column>
      <el-table-column prop="hotelAddress" label="旅馆地址"></el-table-column>
      <el-table-column prop="hotelRoomNumber" label="入住房号"></el-table-column>
      <el-table-column prop="hotelCheckinTime" label="入住时间"></el-table-column>
      <el-table-column prop="hotelCheckoutTime" label="退房时间"></el-table-column>
      <el-table-column prop="source" label="来源" width="50"></el-table-column>

      <el-table-column label="操作" width="80" align="center">
        <template scope="scope">
          <el-button type="text" @click="edit(scope.row)" title="编辑"
                     v-if="checkRuleCase('ajgl/hostel/update', caseId) && scope.row.sourceCode !== '1'"
                     icon="icon iconfont icon-brush"></el-button>
          <el-button type="text" title="删除" v-if="checkRuleCase('ajgl/hostel/delete', caseId)"
                     @click="remove(scope.row,scope)" icon="icon iconfont icon-trash"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- add/updata 弹窗 -->
    <hostelDialog :dialog="dialogSwitch"
                  :title="dialogTitle"
                  :theSuspectList="theSuspectList"
                  :isGangs="!theSuspect"
                  :dataForm="dialogData"
                  @update:submit="submit"
                  @close="close"></hostelDialog>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  import {mapState} from 'vuex'
  import mixin from '../../../../../utils/mixin'
  import {arrayGetRid} from '../../../../../utils/util'
  import {
    FETCH_HOSTEL_RELATE_LIST,
    ADD_HOSTEL_RELATE,
    UPDATE_HOSTEL_RELATE,
    REMOVE_HOSTEL_RELATE,
    GET_HOSTEL_RELATE
  } from '../../../../../store/types'

  import hostelDialog from '../../dialog/social-hostel-edit.vue'

  export default {
    mixins: [mixin],
    components: {
      hostelDialog
    },
    props: ['tableData', 'theSuspect', 'theSuspectList', 'addSwitch'],
    computed: {
      ...mapState(['hostelRelate'])
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
              sourceCode: ra.ly, // 数据来源代码
              source: ra.ly === '1' ? '采集' : '手动', //  数据来源翻译

              hotelCode: ra.lgbm, // 旅馆编码
              hotelName: ra.lgmc, // 旅馆名称
              hotelAddress: ra.lgdz, // 旅馆地址
              hotelRoomNumber: ra.rzfh, // 入住房号
              hotelCheckinTime: ra.rzsj, // 入住时间
              hotelCheckoutTime: ra.tfsj // 退房时间
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
        let _path = ADD_HOSTEL_RELATE
        let _optForm = {
          xm: f.name, // 姓名
          zjhm: f.IDCard, // 证件号码

          lgbm: f.hotelCode, // 旅馆编码
          lgmc: f.hotelName, // 旅馆名称
          lgdz: f.hotelAddress, // 旅馆地址
          rzfh: f.hotelRoomNumber, // 入住房号
          rzsj: f.hotelCheckinTime, // 入住时间
          tfsj: f.hotelCheckoutTime // 退房时间
        }
        if (f.id) {
          _path = UPDATE_HOSTEL_RELATE
          _optForm.id = f.id
        }
        // 判断是否来自于团伙操作
        let _optForm2 = {}
        if (this.theSuspect) {
          Object.assign(_optForm2, {
            sfxyrtz: '0',
            xyrid: this.theSuspect.id // 嫌疑人ID
          })
        } else {
          Object.assign(_optForm2, { // 团伙
            sfxyrtz: '1',
            xyrid: f.associatedSuspect // 嫌疑人ID
          })
        }

        this.dispatch(_path, Object.assign(_optForm, _optForm2, {
          ajid: this.caseId
        })).then(r => {
          this.close()
          this.queryList()
          if (_path === ADD_HOSTEL_RELATE) {
            this.$emit('addRow')
          }
        })
      },
      /**
       * 关闭弹窗
       */
      close() {
        this.dialogSwitch = false
        this.$emit('close')
      },
      /**
       * 列表查询
       */
      queryList() {
        if (this.checkRuleCase('ajgl/hostel/list', this.caseId)) {
          // 判断是否来自于团伙操作
          let _optQuery = {}
          if (this.theSuspect) {
            Object.assign(_optQuery, {
              sfxyrtz: '0',
              xyrid: this.theSuspect.id // 嫌疑人ID
            })
          } else {
            Object.assign(_optQuery, { // 团伙
              sfxyrtz: '1'
            })
          }

          this.dispatch(FETCH_HOSTEL_RELATE_LIST, Object.assign(_optQuery, {
            ajid: this.caseId
          })).then((row) => {
            this.tableList = this.dataMatch(this.hostelRelate.fetchHostelRelateList)
          })
        }
      },
      /**
       * 编辑
       * @param item
       */
      edit(item) {
        if (item.id) {
          this.dispatch(GET_HOSTEL_RELATE, {
            id: item.id
          }).then(() => {
            this.dialogData = this.hostelRelate.getHostelRelate
            this.dialogSwitch = true
            this.dialogTitle = '编辑'
          })
        }
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
          this.dispatch(REMOVE_HOSTEL_RELATE, {
            id: removeId
          }, scope.$index).then(() => {
            this.$message({
              message: '删除操作成功！',
              type: 'success'
            })
            this.$emit('removeRow')
          })
          this.tableList = arrayGetRid(this.tableList, [item])
        }).catch(() => {
        });
      }
    },
    watch: {
      addSwitch(val) {
        if (val) {
          this.dialogData = ''
          this.dialogSwitch = true
          this.dialogTitle = '添加'
        }
      },
      tableData(val) {
        if (val) { // 初始化表格列
          this.tableList = this.dataMatch(val)
        }
      }
    },
    mounted() {
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      if (this.tableData) { // 初始化表格列
        this.tableList = this.dataMatch(this.tableData)
      }
    }
  }
</script>
