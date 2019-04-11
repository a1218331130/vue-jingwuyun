<!-- 办案管理 -->
<template>
<div class="app-content-box">
  <el-row class="involve-box">
    <el-col :span="12" class="involve-box__title">
      涉案车辆
    </el-col>
    <el-col :span="12" style="text-align:right;">
      <el-button size="mini" @click="newItem">新增</el-button>
    </el-col>
    <el-col :span="24" class="involve-box__item">
      <el-table @cell-mouse-enter="cellMouseEnter" :data="list">
        <el-table-column label="序号" prop="id" width="45"></el-table-column>
        <el-table-column label="车辆名称" prop="name"></el-table-column>
        <el-table-column label="车辆类型" prop="cate"></el-table-column>
        <el-table-column label="车牌号码" prop="no"></el-table-column>
        <el-table-column label="车主姓名" prop="master"></el-table-column>
        <el-table-column label="扣押情况" prop="state"></el-table-column>
        <el-table-column label="车辆特征" prop="sign"></el-table-column>
        <el-table-column label="涉案类型" prop="type"></el-table-column>
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row)" icon="icon iconfont icon-brush">编辑</el-button>
            <el-button size="mini" type="danger" @click="remove(list,scope.row)"  icon="icon iconfont icon-trash">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>

  <dialog-edit-car :dialog="editCarDialog" :data="detail" @update="add" @close="editCarDialog=false"></dialog-edit-car>
</div>
</template>
<style scoped>

</style>
<script>
import {
  // clone,
  arrayGetRid
} from '../../../utils/util'

import dialogEditCar from './dialog-edit-car'
export default {
  components: {
    'dialog-edit-car': dialogEditCar
  },
  data() {
    return {
      editCarDialog: false,
      detail: null,
      list: []
    }
  },
  computed: {},
  methods: {
    newItem() {
      this.detail = null
      this.editCarDialog = true
    },
    edit(item) {
      this.detail = item
      this.editCarDialog = true
    },
    add(val) {
      this.editCarDialog = false
    },
    remove(parent, item) {
      this.$confirm('确认删除该车辆?', '温馨掘进', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        arrayGetRid(parent, item)
      }).catch(() => {});
    }
  },
  created() {},
  mounted() {
    let mList = []
    for (let i = 0; i < 9; i++) {
      mList.push({
        id: 1,
        name: '车辆名称',
        cate: '车辆类型',
        no: '车牌号码',
        master: '车主姓名',
        state: '扣押情况',
        sign: '车辆特征',
        type: '涉案类型'
      })
    }
    this.list = mList;
  }
}
</script>
