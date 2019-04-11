<!-- 办案人员 -->
<template>
<div>
  <el-button type="primary" size="mini" class="import-btn add el-icon-plus" @click="add">&nbsp;添加
  </el-button>
  <el-table @cell-mouse-enter="cellMouseEnter" :data="tableData" stripe border>
    <el-table-column type="index" label="序号" width="70"></el-table-column>
    <el-table-column prop="num" label="警号" width="100"></el-table-column>
    <el-table-column prop="name" label="姓名" width="120"></el-table-column>
    <!-- <el-table-column prop="unitText" label="所属单位"></el-table-column>-->
    <el-table-column prop="workText" label="岗位"></el-table-column>
    <el-table-column prop="job" label="职务" width="100"></el-table-column>
    <!--<el-table-column prop="power" label="权限" width="80"></el-table-column>-->
    <el-table-column label="操作" width="120" align="center">
      <template scope="scope">
        <el-button type="text" @click="remove(scope.row)" icon="icon iconfont icon-trash" title="删除"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 办案人员 large/tiny-->
  <dialogTransactEditor :dialog="transactEditDialog" :dialogLevel="2" :editmode="transactEditMode" @form:submit="tempSubmit" @close="transactEditDialog=false"></dialogTransactEditor>
</div>
</template>

<style scoped lang='scss'>
.import-btn {
    position: absolute;
    top: -33px;
    right: 10px;
    background-color: #5babe6;
    border: none;
    height: 25px;
    color: #ffffff;
    border-radius: 25px;
    padding: 0 10px;
    text-align: center;
}
</style>

<script>
/***
 * @update:Table Array [] 响应表格存储的临时数据
 */
import dialogTransactEditor from '../../../case/casePersonnel/editor.vue' // 办案人员
import { arrayGetRid } from '../../../../utils/util'
import mixin from '../../../../utils/mixin'
export default {
  mixins: [mixin],
  components: {
    dialogTransactEditor
  },
  data() {
    return {
      // 办案人员
      transactEditDialog: false,
      transactEditMode: 'add',
      tableData: [],
      repetitionFlag: true
    }
  },
  methods: {
    add() {
      this.transactEditDialog = true
    },
    remove(row) {
      // 删除临时表格数据
      arrayGetRid(this.tableData, [row])
    },
    tempSubmit(iForm) {
      console.log(iForm, 'iform');
      this.repetitionFlag = true
      this.handleRepetition(iForm)
      // 临时保存
      if(this.transactEditDialog && this.repetitionFlag) {
        this.transactEditDialog = false
        this.tableData.push({ ...iForm })
      }
    },
    // 判断添加人是否重复添加
    handleRepetition(item) {
      return this.tableData.forEach((d, i) => {
        if(d.num === item.num) { // 根据警号判断
          this.$message({
            type: 'warning',
            message: '不能重复添加同一人',
            showClose: true
          })
          this.repetitionFlag = false
          return true
        }
      })
    }
  },
  watch: {
    tableData(val) {
      // 抛出表格数据
      this.$emit('update:Table', val)
    },
    isInitDialog(val) {
      if(val) {
        this.tableData = [] // 初始化表格数据
      }
    }
  },
  props: ['isInitDialog'],
  mounted() {},
  created() {}
}
</script>
