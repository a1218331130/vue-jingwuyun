<!-- samehousehold / 同户 -->
<template>
  <div>
    <el-table :data="tableList" border>
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
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
          <el-button type="text" @click="edit(scope.row)" title="编辑"
                     v-if="checkRuleCase('ajgl/samehousehold/updateth', caseId) && scope.row.sourceCode !== '1'"
                     icon="icon iconfont icon-brush"></el-button>
          <el-button type="text" @click="remove(scope.row,scope)" title="删除"
                     v-if="checkRuleCase('ajgl/samehousehold/delth', caseId)"
                     icon="icon iconfont icon-trash"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- add/updata 弹窗 -->
    <samehouseholdDialog :dialog="dialogSwitch" :title="dialogTitle" :dataForm="dialogData" @update:submit="submit"
                         @close="close"></samehouseholdDialog>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  import {mapState} from 'vuex'
  import mixin from '../../../../../utils/mixin'
  import {arrayGetRid} from '../../../../../utils/util'
  import {
    FETCH_SAMEHOUSEHOLD_RELATE_LIST,
    ADD_SAMEHOUSEHOLD_RELATE,
    UPDATE_SAMEHOUSEHOLD_RELATE,
    REMOVE_SAMEHOUSEHOLD_RELATE,
    GET_SAMEHOUSEHOLD_RELATE
  } from '../../../../../store/types'

  import samehouseholdDialog from '../../dialog/social-samehousehold-edit.vue'

  export default {
    mixins: [mixin],
    components: {
      samehouseholdDialog
    },
    props: ['tableData', 'theSuspect', 'addSwitch'],
    computed: {
      ...mapState(['samehouseholdRelate'])
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

              sex: ra.xbdm, // 性别代码
              sexText: ra.xbdm === '1' ? '男' : ra.xbdm === '2' ? '女' : '未知', // 性别名称
              birthdate: ra.csrq, // 出生日期
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
        let _path = ADD_SAMEHOUSEHOLD_RELATE
        let _optForm = {
          ly: f.sourceCode,  // 来源
          xm: f.name, // 姓名
          zjhm: f.IDCard, // 证件号码

          hh: f.householdNumber, // 户号
          gajdm: f.PSBCode, // 公安局代码
          csrq: f.birthdate, // 出生日期
          xbdm: f.sex, // 性别代码
          xzz: f.address // 现住址
        }
        if (f.id) {
          _path = UPDATE_SAMEHOUSEHOLD_RELATE
          _optForm.id = f.id
        }
        this.dispatch(_path, Object.assign(_optForm, {
          ajid: this.caseId,
          xyrid: this.theSuspect.id, // 嫌疑人ID
          xyrsfz: this.theSuspect.sfz // 嫌疑人身份证
        })).then(r => {
          this.close()
          this.queryList()
          if (_path === ADD_SAMEHOUSEHOLD_RELATE) {
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
        if (this.checkRuleCase('ajgl/samehousehold/list', this.caseId)) {
          this.dispatch(FETCH_SAMEHOUSEHOLD_RELATE_LIST, {
            ajid: this.caseId,
            xyrid: this.theSuspect.id, // 嫌疑人ID
            sfz: this.theSuspect.sfz // 嫌疑人身份证
          }).then((row) => {
            this.tableList = this.dataMatch(this.samehouseholdRelate.fetchSamehouseholdRelateList)
          })
        }
      },
      /**
       * 编辑
       * @param item
       */
      edit(item) {
        if (item.id) {
          this.dispatch(GET_SAMEHOUSEHOLD_RELATE, {
            id: item.id
          }).then(() => {
            this.dialogData = this.samehouseholdRelate.getSamehouseholdRelate
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
          if (item.sourceCode === '1') { // 采集的数据删除处理逻辑
            this.dispatch(ADD_SAMEHOUSEHOLD_RELATE, {
              sfsc: '1', // 是否删除 1:是删除
              ly: item.sourceCode,  // 来源
              xm: item.name, // 姓名
              zjhm: item.IDCard, // 证件号码
              hh: item.householdNumber, // 户号
              gajdm: item.PSBCode, // 公安局代码
              csrq: item.birthdate, // 出生日期
              xbdm: item.sex, // 性别代码
              xzz: item.address, // 现住址

              ajid: this.caseId,
              xyrid: this.theSuspect.id, // 嫌疑人ID
              xyrsfz: this.theSuspect.sfz // 嫌疑人身份证
            }).then(r => {
              this.$message({
                message: '删除操作成功！',
                type: 'success'
              })
              this.$emit('removeRow')
              this.tableList = arrayGetRid(this.tableList, [item])
            }).catch(() => {
            });
          } else {
            this.dispatch(REMOVE_SAMEHOUSEHOLD_RELATE, {
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
    watch: {
      addSwitch(val) {
        if (val) {
          this.dialogData = ''
          this.dialogSwitch = true
          this.dialogTitle = '添加'
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
