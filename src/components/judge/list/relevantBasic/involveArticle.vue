<!-- 涉案物品 -->
<template>
  <div>
    <el-button type="primary" size="mini" class="import-btn add el-icon-plus" @click="add">&nbsp;添加
    </el-button>
    <el-table @cell-mouse-enter="cellMouseEnter" :data="tableData" stripe border>
      <el-table-column type="index" label="序号" width="70"></el-table-column>
      <el-table-column prop="name" label="物品名称" width="100"></el-table-column>
      <el-table-column prop="caseTypeText" label="涉案类型" width="120"></el-table-column>
      <el-table-column prop="sign" label="物品特征"></el-table-column>
      <el-table-column prop="itemTypeText" label="物品类型" width="120"></el-table-column>
      <el-table-column prop="desc" label="物品描述" width="80"></el-table-column>
      <el-table-column label="操作" width="120">
        <template scope="scope">
          <el-button type="text" @click="remove(scope.row)" icon="icon iconfont icon-trash" title="删除"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <dialog-edit-item :dialog="editDialog" :data="detail" @form:submit="tempSubmit" :dialogLevel="2"
                      @close="editDialog=false"></dialog-edit-item>
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
  import dialogEditItem from '../../../case/involve/dialog-edit-item'
  import {arrayGetRid} from '../../../../utils/util'
  import mixin from '../../../../utils/mixin'
  export default{
    mixins: [mixin],
    components: {
      dialogEditItem
    },
    data() {
      return {
        editDialog: false,
        detail: null,
        tableData: []
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
        if (this.editDialog) {
          // 临时保存
          this.editDialog = false
          this.tableData.push({...iForm})
        }
      }
    },
    watch: {
      tableData(val) {
        // 抛出表格数据
        this.$emit('update:Table', val)
      },
      isInitDialog(val) {
        if (val) {
          this.tableData = [] // 初始化表格数据
        }
      }
    },
    props: ['isInitDialog'],
    mounted() {
    },
    created() {
      this.tableData = [] // 初始化表格数据
    }
  }
</script>
