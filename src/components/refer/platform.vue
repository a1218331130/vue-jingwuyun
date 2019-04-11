<template>
  <div>
    <page-header title="平台管理" :path="breadcrumb"></page-header>
    <div class="app-toolbar" style="text-align: right;">
      <el-button icon="plus" type="info" @click="handleAdd">新增平台</el-button>
    </div>
    <el-table
      :data="platform.list"
      v-loading="loading"
      class="app-table"
      border
      stripe
    >
      <el-table-column type="index" width="55"></el-table-column>
      <el-table-column prop="name" label="平台名称"></el-table-column>
      <el-table-column prop="key" label="平台代号"></el-table-column>
      <el-table-column prop="url" label="URL"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="order" label="排序" width="70"></el-table-column>
      <el-table-column label="操作" width="140">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleRemove(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      style="min-width: 800px"
    >
      <el-form ref="form" label-position="right" label-width="80px" :rules="rules" :model="item">
        <el-form-item label="平台名称" prop="name">
          <el-input v-model="item.name"></el-input>
        </el-form-item>
        <el-form-item label="平台代号" prop="key">
          <el-input v-model.trim="item.key"></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="item.url"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model.number="item.order"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="item.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
</style>

<script>
  import { mapState } from 'vuex'
  import { FETCH_PLATFORM, REMOVE_PLATFORM, ADD_PLATFORM, UPDATE_PLATFORM } from '../../store/types'
  import PageHeader from '../common/page-header.vue'
  import mixin from '../../utils/mixin'
  export default {
    mixins: [mixin],
    data() {
      return {
        breadcrumb: [{
          text: '首页',
          to: '/'
        }, {
          text: '系统管理',
          to: '/system'
        }, {
          text: '平台管理'
        }],
        dialogVisible: false,
        item: {},
        editIndex: null,
        rules: {
          name: [{required: true, message: '请输入平台名称', trigger: 'blur'}],
          key: [{required: true, message: '请输入平台代号', trigger: 'blur'}],
          url: [{required: true, message: '请输入URL', trigger: 'blur'}, {
            type: 'url',
            message: 'URL格式不正确',
            trigger: 'blur'
          }]
        }
      }
    },
    watch: {
      dialogVisible(val) {
        if (val) {
          this.$refs.form.resetFields()
        }
      }
    },
    computed: {
      ...mapState({
        platform: state => state.platform
      }),
      dialogTitle() {
        return this.item.id ? '编辑平台' : '新增平台'
      }
    },
    methods: {
      handleAdd() {
        this.item = {
          name: '',
          key: '',
          url: '',
          order: 0,
          remark: ''
        }
        this.dialogVisible = true
        this.editIndex = 0
      },
      doSubmit() {
        this.$store.dispatch(
          this.item.id
            ? UPDATE_PLATFORM
            : ADD_PLATFORM,
          {
            model: this.item,
            index: this.editIndex
          })
          .then(_ => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
          .catch(_ => {
            this.$message({
              type: 'warning',
              message: '操作失败!'
            })
          })
        this.dialogVisible = false
      },
      handleSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.doSubmit()
          } else {
            this.$message({
              type: 'error',
              message: '表单验证错误!'
            })
          }
        })
      },
      handleEdit(row, index) {
        this.item = Object.assign({}, row)
        this.dialogVisible = true
        this.editIndex = index
      },
      handleRemove(row, index) {
        this.confirm('此操作将将永久删除该数据，是否继续？').then(_ => {
          this.$store.dispatch(REMOVE_PLATFORM, {index: index, query: {id: row.id}})
            .then(_ => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch(_ => {
              this.$message({
                type: 'warning',
                message: '删除失败!'
              })
            })
        }).catch(_ => {})
      }
    },
    components: {
      PageHeader
    },
    created() {
      this.dispatch(FETCH_PLATFORM)
    }

  }
</script>
