<template>
<div slot="center">
  <!-- <tabs :tab="tab"></tabs> -->
  <div class="app-toolbar">
    <transition enter-active-class="animated slideInUp">
      <el-form :inline="true" label-position="right" label-width="80px">
        <el-form-item prop="keyword" label="关键字">
          <el-input v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="">查询</el-button>
          <el-button type="primary" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </transition>
  </div>
  <div class="app-content-box">
    <el-table @cell-mouse-enter="cellMouseEnter" :data="list">
      <el-table-column label="序号" prop="id" width="80"></el-table-column>
      <el-table-column label="模板名称" prop="title" align="left" width="300"></el-table-column>
      <el-table-column label="模板描述" prop="desc" align="left"></el-table-column>
      <el-table-column label="操作" width="80">
        <template scope="scope">
          <el-button type="text" @click="edit(scope.row)" icon="icon iconfont icon-brush"></el-button>
          <el-button type="text" @click="remove" icon="icon iconfont icon-trash"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="app-toolbar">
    <pagination :count="100" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
  </div>

  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="dialogTitle" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
    <el-row :gutter="20">
      <!-- 找人 -->
      <el-form ref="editForm" :model="form" :rules="rules" label-width="100px">
        <el-col :span="24">
          <el-form-item prop="title" label="模板名称">
            <el-input v-model="form.title" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="desc" label="模板描述">
            <el-input v-model="form.desc" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="content" label="模板内容">
            <quill-editor :options="editorOptions" v-model="form.content"></quill-editor>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button type="" @click="closeEvent">取消</el-button>
    </div>
  </el-dialog>
</div>
</div>
</template>
<style lang="scss" scoped>
.app-toolbar {
    .el-form-item {
        margin-bottom: 0;
    }
}
</style>
<script>
import mixin from '../../../utils/mixin'
import { tableFill } from '../../../utils/util'
import pagination from '../../../widgets/pagination/pagination.vue'

import { quillEditor } from 'vue-quill-editor'
import editor from '../../../utils/editorOptions'

export default {
  mixins: [mixin, editor],
  components: {
    pagination,
    quillEditor
  },
  data() {
    return {
      dialog: false,
      dialogTitle: '',
      keyword: '',
      list: [],
      pagenav: {
        currentpage: 1,
        limit: 30
      },
      form: {
        id: 0,
        title: '',
        desc: '',
        content: ''
      },
      rules: {
        title: [{
          required: true,
          message: '标题不能为空'
        }],
        desc: [{
          required: true,
          message: '摘要不能为空'
        }],
        content: [{
          required: true,
          message: '内容不能为空'
        }]
      }
    }
  },
  computed: {

  },
  watch: {},
  methods: {
    add() {
      this.dialogTitle = '新增'
      this.dialog = true
    },
    edit(data) {
      console.log(data);
      this.dialogTitle = '修改'
      this.form = JSON.parse(JSON.stringify(data))
      this.dialog = true
    },
    remove() {
      this.$confirm('确定要删除此模板?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功',
          showClose: true
        })
      })
    },
    initDialog() {},
    closeEvent() {
      this.$refs['editForm'].resetFields()
      this.dialog = false
    },
    submit() {
      this.$refs['editForm'].validate((valid) => {
        if (valid === true) {
          this.$message({
            type: 'success',
            message: '模板提交成功',
            showClose: true
          })
          this.dialog = false
          this.$refs['editForm'].resetFields()
        }
      })
    }
  },
  mounted() {
    for (let i = 1; i <= 30; i++) {
      this.list.push({
        id: i,
        title: '模板名称模板名称模板名称模板名称',
        desc: '模板摘要模板摘要模板摘要模板摘要模板摘要模板摘要模板摘要模板摘要模板摘要模板摘要模板摘要模板摘要模板摘要模板摘要',
        content: '内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 内容内容内容 '
      })
    }
    tableFill(this.$)
  }
}
</script>
