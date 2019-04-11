<template>
<div>
  <tabs :tab="tab"></tabs>
  <div class="app-toolbar">
    <!-- <app-iframe url="/qingbaoyun-navigation/sys/org.html"></app-iframe> -->

    <!-- 查询条件 -->
    <el-form :inline="true" label-position="right" label-width="80px">
      <el-form-item prop="keyword" label="关键字">
        <el-input v-model="queryForm.keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" native-type="submit" @click.prevent="query">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="app-search__buttons">
      <el-button type="primary" icon="plus" @click="add">新增</el-button>
    </div>
  </div>

  <!-- 查询结果 -->
  <div class="app-content">


  </div>
  <!-- 分页栏 -->
  <div class="app-toolbar">
    <pagination :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
  </div>

  <!-- 编辑模态窗 -->
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="editDialog" :title="dialogTitle" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
    <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="name" label="组织名称" placeholder="请输入组织名称">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="code" label="组织编号" placeholder="请输入组织编号">
            <el-input v-model="editForm.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="parent" label="上级组织" placeholder="请选择上级组织">
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="address" label="地址" placeholder="请输入组织地址">
            <el-input v-model="editForm.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="sort" label="排序号" placeholder="请输入排序号">
            <el-input type="number" v-model="editForm.sort"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="" @click="closeEvent">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<style scoped>
.app-toolbar .el-form-item {
  margin-bottom: 0;
}
</style>
<script>
import Tabs from '../common/tabs.vue'
// import AppIframe from '../common/app-iframe.vue'
import pagination from '../../widgets/pagination/pagination'
import { tableFill } from '../../utils/util'
export default {
  components: {
    Tabs,
    pagination
  },
  data() {
    return {
      editDialog: false,
      dialogTitle: '',
      count: 0,
      pagenav: {
        limit: 20,
        currentpage: 1
      },
      queryForm: {
        keyword: ''
      },
      editForm: {
        name: '',
        code: '',
        parent: '',
        address: '',
        sort: ''
      },
      rules: {
        name: [{
          required: true,
          message: '请输入组织名称'
          }],
        code: [{
          required: true,
          message: '组织编号'
          }],
        parent: [{
          required: true,
          message: '请选择上级组织'
          }]
      }
    }
  },
  methods: {
    initDialog() {},
    reset() {},
    closeEvent() {
      this.editDialog = false
    },
    submit() {
      this.$refs.editForm.validate((valid) => {
        if (valid === true) {
          this.$message({
            type: 'success',
            message: '保存成功',
            showClose: true
          })
        }
      })
    },
    query() {},
    add() {
      this.dialogTitle = '新增'
      this.editDialog = true
    },
    edit(item) {
      this.dialogTitle = '修改'
      this.editDialog = true
    },
    remove(items) {
      this.$confirm('确定要删除这些选项?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '选项删除成功',
          showClose: true
        })
      })
    }
  },
  mounted() {
    tableFill(this.$)
  },
  created() {
    this.tab = {
      label: this.$route.name,
      name: this.$route.path
    }
  }
}
</script>
