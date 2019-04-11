<!-- 涉案人员 -->
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

  <!-- 涉案人员  -->
  <dialog-add-people :dialog="addPeopleDialog" :type="3" :data="personDetail" :dialogLevel="2" @update:submit="tempSubmit" @close="addPeopleDialog=false"></dialog-add-people>
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
      dialogType: 3,
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
    },
    tempSubmit(iForm) { // 涉案人员
      console.log(iForm, 'iForm');
      this.repetitionFlag = true
      this.handleRepetition(iForm)
      // 案件基本信息临时保存
      if(this.addPeopleDialog && this.repetitionFlag) {
        this.addPeopleDialog = false
        let __dateT = new Date(iForm.birthday.toString())
        iForm.birthdayText = iForm.birthday ? __dateT.getFullYear() + '-' + (__dateT.getMonth() + 1) + '-' + __dateT.getDate() : ''
        let _ptMap = {
          1: '报案人',
          2: '受害人',
          3: '证人'
        }
        iForm.peopleTypeText = ''
        for(let pt in iForm.peopleType) {
          iForm.peopleTypeText += _ptMap[iForm.peopleType[pt]] + (iForm.peopleType.length - 1 === Number(pt) ? '' : '/')
        }
        this.tableDataPerson.push({ ...iForm })
      }
    },
    // 判断添加人是否重复添加
    handleRepetition(item) {
      return this.tableDataPerson.forEach((d, i) => {
        if(d.idCard === item.idCard) { // 根据身份证判断
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
    tableDataPerson(val) {
      // 数据变动，抛出涉案人员表格数据
      this.$emit('update:Table', val)
    },
    isInitDialog(val) {
      if(val) {
        this.tableDataPerson = [] // 初始化表格数据
      }
    }
  },
  props: ['isInitDialog'],
  mounted() {},
  created() {
    this.tableDataPerson = [] // 初始化表格数据
  }
}
</script>
