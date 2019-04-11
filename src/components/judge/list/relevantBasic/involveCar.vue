<!-- 涉案车辆 -->
<template>
<div>
  <el-button type="primary" size="mini" class="import-btn add el-icon-plus" @click="add">&nbsp;添加
  </el-button>
  <el-table @cell-mouse-enter="cellMouseEnter" :data="tableData" stripe border>
    <el-table-column type="index" label="序号" width="70"></el-table-column>
    <el-table-column prop="plateNumber" label="车牌号" width="100"></el-table-column>
    <el-table-column prop="name" label="驾驶员" width="120"></el-table-column>
    <el-table-column prop="involvedTypeText" label="涉案类型"></el-table-column>
    <el-table-column prop="aspectFeature" label="驾驶员描述" width="120"></el-table-column>
    <el-table-column prop="carFeature" label="车辆特征" width="80"></el-table-column>
    <el-table-column label="操作" width="120">
      <template scope="scope">
        <el-button type="text" @click="remove(scope.row)" icon="icon iconfont icon-trash"></el-button>
      </template>
    </el-table-column>
  </el-table>

  <dialog-edit-car :isdetail="isDetail" :dialog="editDialog" :data="detail" :dialogLevel="2" @update="tempSubmit" @close="editDialog=false"></dialog-edit-car>
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
import dialogEditCar from '../../../case/involve/dialog-edit-car'
import { arrayGetRid } from '../../../../utils/util'
import mixin from '../../../../utils/mixin'
export default {
  mixins: [mixin],
  components: {
    dialogEditCar
  },
  data() {
    return {
      isDetail: false,
      editDialog: false,
      detail: null,
      tableData: [],
      repetitionFlag: true
    }
  },
  methods: {
    add() {
      this.detail = null
      this.editDialog = true
    },
    remove(row) {
      // 删除临时表格数据
      arrayGetRid(this.tableData, [row])
    },
    tempSubmit(iForm) {
      console.log(iForm, 'iform');
      this.repetitionFlag = true
      this.handleRepetition(iForm)
      if(this.editDialog && this.repetitionFlag) {
        // 临时保存
        this.editDialog = false
        this.tableData.push({ ...iForm })
      }
    },
    // 判断添加车辆是否重复添加
    handleRepetition(item) {
      return this.tableData.forEach((d, i) => {
        if(d.plateNumber === item.plateNumber) {
          this.$message({
            type: 'warning',
            message: '不能重复添加同一车辆',
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
  created() {
    this.tableData = [] // 初始化表格数据
  }
}
</script>
