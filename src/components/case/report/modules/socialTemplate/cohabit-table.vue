<!-- cohabit / 同暂住 -->
<template>
  <div>
    <el-table :data="tableList" border>
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="IDCard" label="证件号码"></el-table-column>

      <el-table-column prop="sexText" label="性别"></el-table-column>
      <el-table-column prop="birthdate" label="出生日期"></el-table-column>
      <el-table-column prop="householdNumber" label="户号"></el-table-column>
      <el-table-column prop="temporaryAddress" label="暂住地址"></el-table-column>
      <el-table-column prop="toLocalTime" label="来本地日期"></el-table-column>
      <el-table-column prop="houseOwnerRalationText" label="与房主关系"></el-table-column>
      <el-table-column prop="houseOwnerName" label="房主姓名"></el-table-column>
      <el-table-column prop="source" label="来源" width="50"></el-table-column>

      <el-table-column label="操作" width="80" align="center">
        <template scope="scope">
          <el-button type="text" @click="edit(scope.row)" title="编辑"
                     v-if="checkRuleCase('ajgl/cohabit/updatetz', caseId)&& scope.row.sourceCode !== '1'"
                     icon="icon iconfont icon-brush"></el-button>
          <el-button type="text" @click="remove(scope.row,scope)" title="删除"
                     v-if="checkRuleCase('ajgl/cohabit/deltz', caseId)"
                     icon="icon iconfont icon-trash"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- add/updata 弹窗 -->
    <cohabitDialog :dialog="dialogSwitch"
                   :title="dialogTitle"
                   :theSuspectList="theSuspectList"
                   :isGangs="!theSuspect"
                   :dataForm="dialogData"
                   @update:submit="submit"
                   @close="close"></cohabitDialog>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  import {mapState} from 'vuex'
  import '../../../../../utils/dateFormat'
  import mixin from '../../../../../utils/mixin'
  import {arrayGetRid} from '../../../../../utils/util'
  import {
    FETCH_COHABIT_RELATE_LIST,
    ADD_COHABIT_RELATE,
    UPDATE_COHABIT_RELATE,
    REMOVE_COHABIT_RELATE,
    GET_COHABIT_RELATE
  } from '../../../../../store/types'

  import cohabitDialog from '../../dialog/social-cohabit-edit.vue'

  export default {
    mixins: [mixin],
    components: {
      cohabitDialog
    },
    props: ['tableData', 'theSuspect', 'theSuspectList', 'addSwitch'],
    computed: {
      ...mapState(['cohabitRelate'])
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
              IDCard: ra.sfz, // 证件号码

              sex: ra.xbdm, // 性别代码
              sexText: ra.xbdm === '1' ? '男' : ra.xbdm === '2' ? '女' : '未知', // 性别名称
              householdNumber: ra.hh, // 户号
              birthdate: ra.csrq === '' ? '' : this.dateFormat(new Date(ra.csrq), 'yyyy-MM-dd'), // 出生日期
              householdAddress: ra.hjxxdz, // 户籍详细地址
              temporaryAddress: ra.zzdz, // 暂住地址
              toLocalTime: ra.lbdrq, // 来本地日期
              houseOwnerRalation: ra.yfzgx, // 与房主关系
              houseOwnerRalationText: ra.yfzgxmc, // 与房主关系翻译
              houseOwnerName: ra.fzxm,  // 房主姓名

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
        let _path = ADD_COHABIT_RELATE
        let _optForm = {
          xm: f.name, // 姓名
          sfz: f.IDCard, // 证件号码
          ly: f.sourceCode,  // 来源
          xbdm: f.sex, // 性别代码
          hh: f.householdNumber, // 户号
          csrq: f.birthdate, // 出生日期
          hjxxdz: f.householdAddress, // 户籍详细地址
          zzdz: f.temporaryAddress, // 暂住地址
          lbdrq: f.toLocalTime, // 来本地日期
          yfzgx: f.houseOwnerRalation, // 与房主关系
          fzxm: f.houseOwnerName // 房主姓名
        }
        if (f.id) {
          _path = UPDATE_COHABIT_RELATE
          _optForm.id = f.id
        }
        // 判断是否来自于团伙操作
        let _optForm2 = {}
        if (this.theSuspect) {
          Object.assign(_optForm2, {
            sfxyrtz: '0',
            xyrid: this.theSuspect.id, // 嫌疑人ID
            xyrsfz: this.theSuspect.sfz // 嫌疑人身份证
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
          if (_path === ADD_COHABIT_RELATE) {
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
        if (this.checkRuleCase('ajgl/cohabit/list', this.caseId)) {
          // 判断是否来自于团伙操作
          let _optQuery = {}
          if (this.theSuspect) {
            Object.assign(_optQuery, {
              sfxyrtz: '0',
              xyrid: this.theSuspect.id, // 嫌疑人ID
              sfz: this.theSuspect.sfz // 嫌疑人身份证
            })
          } else {
            Object.assign(_optQuery, { // 团伙
              sfxyrtz: '1'
            })
          }

          this.dispatch(FETCH_COHABIT_RELATE_LIST, Object.assign(_optQuery, {
            ajid: this.caseId
          })).then((row) => {
            this.tableList = this.dataMatch(this.cohabitRelate.fetchCohabitRelateList)
          })
        }
      },
      /**
       * 编辑
       * @param item
       */
      edit(item) {
        if (item.id) {
          this.dispatch(GET_COHABIT_RELATE, {
            id: item.id
          }).then(() => {
            this.dialogData = this.cohabitRelate.getCohabitRelate
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
            this.dispatch(ADD_COHABIT_RELATE, {
              xm: item.name, // 姓名
              sfz: item.IDCard, // 证件号码
              ly: item.sourceCode,  // 来源
              sfsc: '1', // 是否删除 1:是删除
              xbdm: item.sex, // 性别代码
              hh: item.householdNumber, // 户号
              csrq: item.birthdate, // 出生日期
              hjxxdz: item.householdAddress, // 户籍详细地址
              zzdz: item.temporaryAddress, // 暂住地址
              lbdrq: item.toLocalTime, // 来本地日期
              yfzgx: item.houseOwnerRalation, // 与房主关系
              fzxm: item.houseOwnerName, // 房主姓名

              ajid: this.caseId,
              xyrid: this.theSuspect.id, // 嫌疑人ID
              xyrsfz: this.theSuspect.sfz // 嫌疑人身份证
            }).then(r => {
              this.$message({
                message: '删除操作成功！',
                type: 'success'
              })
            })
          } else {
            this.dispatch(REMOVE_COHABIT_RELATE, {
              id: removeId
            }, scope.$index).then(() => {
              this.$message({
                message: '删除操作成功！',
                type: 'success'
              })
            })
          }
          this.$emit('removeRow')
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
