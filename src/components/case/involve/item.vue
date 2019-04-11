<!-- 办案管理 -->
<template>
<div class="app-content-box">
  <el-row class="involve-box">
    <el-col :span="12" class="involve-box__title">
      涉案物品
    </el-col>
    <el-col :span="12" style="text-align:right;">
      <el-button size="mini" @click="newItem">新增</el-button>
    </el-col>
    <el-col :span="24" class="involve-box__item">
      <el-table @cell-mouse-enter="cellMouseEnter" :data="list">
        <el-table-column label="序号" prop="id" width="45"></el-table-column>
        <el-table-column label="物品类型" prop="cate"></el-table-column>
        <el-table-column label="物品名称" prop="name"></el-table-column>
        <el-table-column label="物品描述" prop="desc"></el-table-column>
        <el-table-column label="说明" prop="remark"></el-table-column>
        <el-table-column label="物品在库编号" prop="no"></el-table-column>
        <el-table-column label="物品特征" prop="sign"></el-table-column>
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

  <dialog-edit-item :dialog="editItemDialog" :data="detail" @update="add" @close="editItemDialog=false"></dialog-edit-item>
</div>
</template>
<style scoped>

</style>
<script>
import {
  // clone,
  arrayGetRid
} from '../../../utils/util'

import dialogEditItem from './dialog-edit-item'
export default {
  components: {
    'dialog-edit-item': dialogEditItem
  },
  data() {
    return {
      editItemDialog: false,
      detail: null,
      list: []
    }
  },
  computed: {},
  methods: {
    newItem() {
      this.detail = null
      this.editItemDialog = true
    },
    edit(item) {
      this.detail = item
      this.editItemDialog = true
    },
    add(val) {
      this.editItemDialog = false
    },
    remove(parent, item) {
      this.$confirm('确认删除该物品?', '温馨掘进', {
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
        cate: '物品类型',
        name: '物品名称',
        desc: '物品描述',
        remark: '说明',
        no: '物品在库编号',
        sign: '物品特征',
        type: '涉案类型'
      })
    }
    this.list = mList;
  }
}
</script>
