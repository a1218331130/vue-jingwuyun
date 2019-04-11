<template>
  <div>
    <page-header title="角色管理" :path="[{
          text: '首页',
          to: '/'
        }, {
          text: '系统管理',
          to: '/system'
        }, {
          text: '角色管理'
        }]"></page-header>

    <div class="app-toolbar clearfix" style="padding-bottom: 0;">
      <el-form :inline="true" label-position="right" label-width="80px" class="app-search__form">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="searchKeys.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" native-type="submit">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="app-search__buttons">
        <el-button icon="plus" type="info" @click="handleAdd">新增</el-button>
      </div>
    </div>

    <el-table class="app-table"
              :data="role.list"
              v-loading="loading"
              border
              stripe>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column label="ID" prop="id" width="200"></el-table-column>
      <el-table-column label="角色名称" prop="name" width="150"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="操作" width="200">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
          <el-button size="small" type="warning" @click="handleRight(scope.row, scope.$index)">授权</el-button>
          <el-button size="small" type="danger" @click="handleRemove(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="app-toolbar clearfix">
      <el-pagination style="float: right"
                     :current-page="role.page"
                     :page-sizes="[10,20,50,100]"
                     :page-size="role.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     @current-change="handlePageChange"
                     @size-change="handleSizeChange"
                     :total="role.total">
      </el-pagination>
    </div>

    <el-dialog style="min-width:800px;"
               :visible.sync="dialogVisible"
               :title="dialogTitle"
    >
      <el-form ref="form" :model="item" :rules="rules" label-position="right" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="item.name"></el-input>
        </el-form-item>
        <el-form-item label="角色备注" prop="remark">
          <el-input v-model="item.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style scoped>
</style>

<script>
  import { mapState } from 'vuex'
  import { FETCH_ROLE, UPDATE_ROLE, ADD_ROLE, REMOVE_ROLE } from '../../store/types'
  import PageHeader from '../common/page-header.vue'
  import mixin from '../../utils/mixin'
  export default {
    mixins: [mixin],
    components: {PageHeader},
    data() {
      return {
        searchKeys: {
          name: null
        },
        dialogVisible: false,
        item: {},
        currentItemIndex: null,
        rules: {
          name: [{required: true, message: '名称不能为空', trigger: 'blur'}]
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
      ...mapState(['role']),
      dialogTitle() {
        return this.item.id ? '编辑角色' : '新增角色'
      }
    },
    methods: {
      loadData(page = 1, limit = 10) {
        this.dispatch(FETCH_ROLE, {query: {page, limit, ...this.searchKeys}})
      },
      handlePageChange(page) {
        this.loadData(page, this.role.limit)
      },
      handleSizeChange(size) {
        this.loadData(1, size)
      },
      handleSearch() {
        this.loadData(1, this.role.limit)
      },
      handleAdd() {
        this.item = {
          name: '',
          remark: ''
        }
        this.dialogVisible = true
      },
      handleSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.doSubmit()
            this.dialogVisible = false
          } else {
            this.$message({
              type: 'error',
              message: '表单验证错误'
            })
          }
        })
      },
      doSubmit() {
        this.$store.dispatch(this.item.id ? UPDATE_ROLE : ADD_ROLE,
          {model: this.item, index: this.currentItemIndex})
          .then(_ => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          })
          .catch(_ => {
            this.$message({
              type: 'error',
              message: '操作失败'
            })
          })
      },
      handleEdit(row, index) {
        this.currentItemIndex = index
        this.item = {...row}
        this.dialogVisible = true
      },
      handleRight(row, index) {},
      handleRemove(row, index) {
        this.confirm()
          .then(_ => {
            this.$store.dispatch(REMOVE_ROLE, {index: index, query: {id: row.id}})
              .then(_ => {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
              })
          })
          .catch(_ => {})
      }
    },
    created() {
      this.loadData()
    }
  }
</script>
