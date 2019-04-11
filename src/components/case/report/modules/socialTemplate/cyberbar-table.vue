<!-- cyberbar / 同行网吧 -->
<template>
  <div>
    <el-table :data="tableList" border>
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="IDCard" label="证件号码"></el-table-column>

      <el-table-column prop="internetBarCode" label="网吧编码"></el-table-column>
      <el-table-column prop="internetBarName" label="网吧名称"></el-table-column>
      <el-table-column prop="internetBarAddress" label="网吧地址"></el-table-column>
      <el-table-column prop="onlineStartTime" label="上网时间"></el-table-column>
      <el-table-column prop="onlineEndTime" label="下线时间"></el-table-column>
      <el-table-column prop="source" label="来源" width="50"></el-table-column>

      <el-table-column label="操作" width="80" align="center">
        <template scope="scope">
          <el-button type="text" @click="edit(scope.row)" title="编辑"
                     v-if="checkRuleCase('ajgl/cyberbar/update', caseId) && scope.row.sourceCode !== '1'"
                     icon="icon iconfont icon-brush"></el-button>
          <el-button type="text" title="删除" v-if="checkRuleCase('ajgl/cyberbar/delete', caseId)"
                     @click="remove(scope.row,scope)" icon="icon iconfont icon-trash"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- add/updata 弹窗 -->
    <cyberbarDialog :dialog="dialogSwitch"
                    :title="dialogTitle"
                    :theSuspectList="theSuspectList"
                    :isGangs="!theSuspect"
                    :dataForm="dialogData"
                    @update:submit="submit"
                    @close="close"></cyberbarDialog>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  import {mapState} from 'vuex'
  import mixin from '../../../../../utils/mixin'
  import {arrayGetRid} from '../../../../../utils/util'
  import {
    FETCH_CYBERBAR_RELATE_LIST,
    ADD_CYBERBAR_RELATE,
    UPDATE_CYBERBAR_RELATE,
    REMOVE_CYBERBAR_RELATE,
    GET_CYBERBAR_RELATE
  } from '../../../../../store/types'

  import cyberbarDialog from '../../dialog/social-cyberbar-edit.vue'

  export default {
    mixins: [mixin],
    components: {
      cyberbarDialog
    },
    props: ['tableData', 'theSuspect', 'addSwitch', 'theSuspectList'],
    computed: {
      ...mapState(['cyberbarRelate'])
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

              internetBarCode: ra.wbbm, // 网吧编码
              internetBarName: ra.wbmc, // 网吧名称
              internetBarAddress: ra.wbdz, // 网吧地址
              onlineStartTime: ra.swsj, // 上网时间
              onlineEndTime: ra.xxsj // 下线时间
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
        let _path = ADD_CYBERBAR_RELATE
        let _optForm = {
          xm: f.name, // 姓名
          zjhm: f.IDCard, // 证件号码

          wbbm: f.internetBarCode, // 网吧编码
          wbmc: f.internetBarName, // 网吧名称
          wbdz: f.internetBarAddress, // 网吧地址
          swsj: f.onlineStartTime, // 上网时间
          xxsj: f.onlineEndTime // 下线时间
        }
        if (f.id) {
          _path = UPDATE_CYBERBAR_RELATE
          _optForm.id = f.id
        }

        // 判断是否来自于团伙操作
        let _optForm2 = {}
        if (this.theSuspect) {
          Object.assign(_optForm2, {
            sfxyrtx: '0',
            xyrid: this.theSuspect.id // 嫌疑人ID
          })
        } else {
          Object.assign(_optForm2, { // 团伙
            sfxyrtx: '1',
            xyrid: f.associatedSuspect // 嫌疑人ID
          })
        }

        this.dispatch(_path, Object.assign(_optForm, _optForm2, {
          ajid: this.caseId
        })).then(r => {
          this.close()
          this.queryList()
          if (_path === ADD_CYBERBAR_RELATE) {
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
        if (this.checkRuleCase('ajgl/cyberbar/list', this.caseId)) {
          // 判断是否来自于团伙操作
          let _optQuery = {}
          if (this.theSuspect) {
            Object.assign(_optQuery, {
              sfxyrtx: '0',
              xyrid: this.theSuspect.id // 嫌疑人ID
            })
          } else {
            Object.assign(_optQuery, { // 团伙
              sfxyrtx: '1'
            })
          }

          this.dispatch(FETCH_CYBERBAR_RELATE_LIST, Object.assign(_optQuery, {
            ajid: this.caseId
          })).then((row) => {
            this.tableList = this.dataMatch(this.cyberbarRelate.fetchCyberbarRelateList)
          })
        }
      },
      /**
       * 编辑
       * @param item
       */
      edit(item) {
        if (item.id) {
          this.dispatch(GET_CYBERBAR_RELATE, {
            id: item.id
          }).then(() => {
            this.dialogData = this.cyberbarRelate.getCyberbarRelate
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
          this.dispatch(REMOVE_CYBERBAR_RELATE, {
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
