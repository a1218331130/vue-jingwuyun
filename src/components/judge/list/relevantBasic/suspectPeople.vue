<!-- 嫌疑人 -->
<template>
<div>
  <el-button type="primary" size="mini" class="import-btn add el-icon-plus" @click="add()">&nbsp;添加
  </el-button>
  <el-table @cell-mouse-enter="cellMouseEnter" :data="tableDataPerson" stripe border>
    <el-table-column label="序号" type="index" width="70"></el-table-column>
    <el-table-column prop="name" label="姓名" width="100"></el-table-column>
    <el-table-column prop="idCard" label="身份证" width="180"></el-table-column>
    <el-table-column prop="peopleTypeText" label="人员类型"></el-table-column>
    <el-table-column prop="sex" label="性别" width="120">
      <template scope="scope">
        {{scope.row.sex === '1' ? '男' : scope.row.sex === '2' ? '女' : '未知'}}
      </template>
    </el-table-column>
    <el-table-column prop="birthdayText" label="出生日期" width="120"></el-table-column>
    <el-table-column label="操作" width="80">
      <template scope="scope">
        <el-button type="text" @click="remove(scope.row)" icon="icon iconfont icon-trash" title="删除"></el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 嫌疑人  -->
  <dialog-add-people :dialog="addPeopleDialog" :type="2" :data="personDetail" :dialogLevel="2" @update:submit="tempSubmit" @close="addPeopleDialog=false"></dialog-add-people>
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
import dialogAddPeople from '../../../case/involve/dialog-add-people' // 涉案人员添加
import { arrayGetRid } from '../../../../utils/util'
import mixin from '../../../../utils/mixin'
export default {
  mixins: [mixin],
  components: {
    dialogAddPeople
  },
  data() {
    return {
      // 涉案人员
      addPeopleDialog: false,
      dialogType: 2,
      personDetail: {},
      tempPersonDetail: {}, // 临时存储 供剔除表格数据
      tableDataPerson: [],
      repetitionFlag: true
    }
  },
  methods: {
    add() {
      this.personDetail = null
      this.addPeopleDialog = true
    },
    remove(row) {
      // 删除临时表格数据
      arrayGetRid(this.tableDataPerson, [row])
      this.$emit('update:Table', this.tableDataPerson)
    },
    tempSubmit(iForm) { // 嫌疑人
      this.repetitionFlag = true
      this.handleRepetition(iForm)
      if(this.addPeopleDialog && this.repetitionFlag) {
        this.addPeopleDialog = false
        this.tableDataPerson.push({ ...iForm })
        this.$emit('update:Table', this.tableDataPerson)
      }
    },
    // 判断添加人是否重复添加
    handleRepetition(item) {
      return this.tableDataPerson.forEach((d, i) => {
        if(d.idCard === item.idCard) {
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
  props: ['isInitDialog'],
  watch: {
    isInitDialog(val) {
      if(val) {
        this.tableDataPerson = [] // 初始化表格数据
      }
    }
  },
  mounted() {},
  created() {
    this.tableDataPerson = [] // 初始化表格数据
  }
}
</script>
