<!-- samecase / 同案 -->
<template>
  <div>
    <el-table :data="tableList" border>
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="IDCard" label="证件号码"></el-table-column>
      <el-table-column prop="formerName" label="曾用名"></el-table-column>
      <el-table-column prop="nickname" label="绰号"></el-table-column>

      <el-table-column prop="caseName" label="案件名称"></el-table-column>
      <el-table-column prop="caseBrief" label="简要案情"></el-table-column>
      <el-table-column prop="caseTypeText" label="案件类别"></el-table-column>
      <el-table-column prop="caseNatureText" label="案件性质"></el-table-column>
      <el-table-column prop="collectUnitName" label="采集单位"></el-table-column>
      <el-table-column prop="source" label="来源" width="50"></el-table-column>

      <el-table-column label="操作" width="80" align="center">
        <template scope="scope">
          <el-button type="text" @click="edit(scope.row)" title="编辑" v-if="checkRuleCase('ajgl/samecase/updatexyr', caseId) && scope.row.sourceCode !== '1'"
                     icon="icon iconfont icon-brush"></el-button>
          <el-button type="text" @click="remove(scope.row,scope)" title="删除" v-if="checkRuleCase('ajgl/samecase/delxyr', caseId)"
                     icon="icon iconfont icon-trash"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- add/updata 弹窗 -->
    <samecaseDialog :dialog="dialogSwitch" :title="dialogTitle" :dataForm="dialogData" @update:submit="submit"
                    @close="close"></samecaseDialog>

  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  import {mapState} from 'vuex'
  import mixin from '../../../../../utils/mixin'
  import {arrayGetRid} from '../../../../../utils/util'
  import {
    FETCH_SAMECASE_RELATE_LIST,
    ADD_SAMECASE_RELATE,
    UPDATE_SAMECASE_RELATE,
    REMOVE_SAMECASE_RELATE,
    GET_SAMECASE_RELATE
  } from '../../../../../store/types'

  import samecaseDialog from '../../dialog/social-samecase-edit.vue'

  export default {
    mixins: [mixin],
    components: {
      samecaseDialog
    },
    props: ['tableData', 'theSuspect', 'addSwitch'],
    computed: {
      ...mapState(['samecaseRelate'])
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
              IDCard: ra.sfzhm, // 证件号码
              formerName: ra.cym, // 曾用名
              nickname: ra.ch, // 绰号

              caseName: ra.ajmc, // 案件名称
              caseNumber: ra.ajbh, // 案件名称
              caseBrief: ra.jyaq, // 简要案情
              caseType: ra.ajlb, // 案件类别
              caseTypeText: ra.ajlbmc, // 案件类别名称
              caseNature: ra.ajxz, // 案件性质
              caseNatureText: ra.ajxzmc, // 案件性质名称
              collectUnitCode: ra.cjdwdm, // 采集单位代码
              collectUnitName: ra.cjdwmc, // 采集单位名称
              collectTime: ra.cjsj, // 采集时间
              collectName: ra.cjrxm, // 采集人姓名
              collectPoliceNumber: ra.cjrjh, // 采集人警号
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
        let _path = ADD_SAMECASE_RELATE
        let _optForm = {
          xm: f.name, // 姓名
          sfzhm: f.IDCard, // 身份证号码
          ly: f.sourceCode,  // 来源
          cym: f.formerName, // 曾用名
          ch: f.nickname, // 绰号
          ajmc: f.caseName, // 案件名称
          ajbh: f.caseNumber, // 案件编号
          ajlb: f.caseType, // 案件类型
          ajxz: f.caseNature, // 案件性质
          jyaq: f.caseBrief, // 简要案情
          cjsj: f.collectTime, // 采集时间
          cjrxm: f.collectName, // 采集人姓名
          cjrjh: f.collectPoliceNumber, // 采集人警号
          cjdwdm: f.collectUnitCode // 采集单位代码

        }
        if (f.id) {
          _path = UPDATE_SAMECASE_RELATE
          _optForm.id = f.id
        }
        this.dispatch(_path, Object.assign(_optForm, {
          ajid: this.caseId,
          xyrid: this.theSuspect.id // 嫌疑人ID
        })).then(r => {
          this.close()
          this.queryList()
          if (_path === ADD_SAMECASE_RELATE) {
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
        if (this.checkRuleCase('ajgl/samecase/list', this.caseId)) {
          this.dispatch(FETCH_SAMECASE_RELATE_LIST, {
            ajid: this.caseId,
            xyrid: this.theSuspect.id // 嫌疑人ID
          }).then((row) => {
            this.tableList = this.dataMatch(this.samecaseRelate.fetchSamecaseRelateList)
          })
        }
      },
      /**
       * 编辑
       * @param item
       */
      edit(item) {
        if (item.id) {
          this.dispatch(GET_SAMECASE_RELATE, {
            id: item.id
          }).then(() => {
            this.dialogData = this.samecaseRelate.getSamecaseRelate
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
            this.dispatch(ADD_SAMECASE_RELATE, {
              sfsc: '1', // 是否删除 1:是删除
              ly: item.sourceCode,  // 来源
              xm: item.name, // 姓名
              sfzhm: item.IDCard, // 身份证号码
              cym: item.formerName, // 曾用名
              ch: item.nickname, // 绰号
              ajmc: item.caseName, // 案件名称
              ajbh: item.caseNumber, // 案件编号
              ajlb: item.caseType, // 案件类型
              ajxz: item.caseNature, // 案件性质
              jyaq: item.caseBrief, // 简要案情
              cjsj: item.collectTime, // 采集时间
              cjrxm: item.collectName, // 采集人姓名
              cjrjh: item.collectPoliceNumber, // 采集人警号
              cjdwdm: item.collectUnitCode, // 采集单位代码

              ajid: this.caseId,
              xyrid: this.theSuspect.id // 嫌疑人ID
            }).then(r => {
              this.$message({
                message: '删除操作成功！',
                type: 'success'
              })
              this.$emit('removeRow')
              this.tableList = arrayGetRid(this.tableList, [item])
            })
          } else {
            this.dispatch(REMOVE_SAMECASE_RELATE, {
              id: removeId
            }, scope.$index).then(() => {
              this.$message({
                message: '删除操作成功！',
                type: 'success'
              })
              this.$emit('removeRow')
              this.tableList = arrayGetRid(this.tableList, [item])
            })
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
