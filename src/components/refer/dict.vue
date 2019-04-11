<template>
  <div>
    <page-header title="字典管理" :path="breadcrumb"></page-header>
    <div class="app-toolbar clearfix" style="padding-bottom: 0;">
      <el-form :inline="true" class="app-search__form">
        <el-form-item label="类型">
          <el-select placeholder="请选择" v-model="searchKeys.type">
            <el-option
              v-for="item in dictTypes.list"
              :key="item.type"
              :label="item.type"
              :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="searchKeys.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" @click.prevent="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="app-search__buttons">
        <el-button icon="plus" type="info" @click="handleAdd">新增</el-button>
        <el-upload class="app-upload-btn" :show-file-list="false" action="">
          <el-button type="warning" icon="upload2">批量导入</el-button>
        </el-upload>
      </div>
    </div>
    <el-table ref="table" v-loading="loading"
              :data="dict.list"
              class="app-table"
              @selection-change="handleSelectionChange"
              border
              stripe>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="type" label="类型" width="150"></el-table-column>
      <el-table-column prop="name" label="名称" width="200"></el-table-column>
      <el-table-column prop="value" label="值"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" width="140">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleRemove(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="app-toolbar">
      <el-button @click="handleMultiRemove">批量删除</el-button>
      <el-pagination style="float: right;"
                     layout="total, sizes, prev, pager, next, jumper"
                     :current-page="dict.page"
                     :page-sizes="[10, 20, 50, 100]"
                     :page-size="dict.limit"
                     :total="dict.total"
                     @current-change="handlePageChange"
                     @size-change="handlePageSizeChange"></el-pagination>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      style="min-height: 800px;">
      <el-form ref="form" :rules="rules" :model="item" label-position="right" label-width="60px">
        <el-form-item label="类型" prop="type">
          <el-input v-model.trim="item.type"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="item.name"></el-input>
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model.trim="item.value"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="item.remark" type="textarea"></el-input>
          <el-button type="primary" native-type="submit" style="display: none;" @click.pervent="handleSubmit">
          </el-button>
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
  import { FETCH_DICT, UPDATE_DICT, ADD_DICT, REMOVE_DICT, FETCH_DICT_TYPES } from '../../store/types'
  import PageHeader from '../common/page-header.vue'
  import mixin from '../../utils/mixin'
  export default {
    mixins: [mixin],
    components: {
      PageHeader
    },
    data() {
      return {
        breadcrumb: [{
          text: '首页',
          to: '/'
        }, {
          text: '系统管理',
          to: '/system'
        }, {
          text: '字典管理'
        }],
        searchKeys: {
          type: null,
          name: null
        },
        dialogVisible: false,
        item: {
          type: '',
          name: '',
          value: '',
          remark: ''
        },
        rules: {
          type: [{required: true, message: '类型不能为空', trigger: 'blur'}],
          name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
          value: [{required: true, message: '值不能为空', trigger: 'blur'}]
        },
        currentItemIndex: null,
        multipleSelection: []
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
      ...mapState(['dict', 'dictTypes']),
      dialogTitle() {
        return this.item.id ? '编辑字典' : '新增字典'
      }
    },
    methods: {
      loadData(page = 1, limit = 10) {
        this.dispatch(FETCH_DICT, {query: {page, limit, ...this.searchKeys}})
      },
      handlePageChange(page) {
        !this.loading && this.loadData(page, this.dict.limit)
      },
      handlePageSizeChange(size) {
        !this.loading && this.loadData(1, size)
      },
      handleAdd() {
        this.item = {
          type: '',
          name: '',
          value: '',
          remark: ''
        }
        this.dialogVisible = true
      },
      doSubmit() {
        this.$store.dispatch(
          this.item.id
            ? UPDATE_DICT
            : ADD_DICT, {model: this.item})
          .then(_ => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.loadData(0, this.dict.limit)
          })
          .catch(_ => {
            this.$message({
              type: 'warning',
              message: '操作失败'
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
              message: '表单验证错误'
            })
          }
        })
      },
      handleEdit(row, index) {
        this.currentItemIndex = index
        this.dialogVisible = true
        this.item = Object.assign({}, row)
      },
      handleRemove(row, index) {
        this.confirm()
          .then(_ => {
            this.$store.dispatch(REMOVE_DICT, {index: index, query: {id: row.id}})
              .then(_ => {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
              })
              .catch(_ => {
                this.$message({
                  type: 'warning',
                  message: '删除失败'
                })
              })
          })
          .catch(_ => {})
      },
      handleSearch() {
        this.loadData(1, this.dict.limit)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleMultiRemove() {
        const ids = this.multipleSelection.map(item => item.id)
        if (ids.length === 0) {
          this.$message({
            type: 'info',
            message: '请勾选要删除的数据'
          })
          return
        }
        this.confirm('是否确认批量删除？').then(_ => {
          this.$store.dispatch(REMOVE_DICT, {query: {ids: ids.join(',')}})
            .then(_ => {
              this.$message({
                type: 'success',
                message: '批量删除成功!'
              })
              this.loadData(1, this.dict.limit)
            })
            .catch(_ => {
              this.$message({
                type: 'error',
                message: '批量删除失败!'
              })
            })
        }).catch(_ => {})
      }
    },
    created() {
      this.loadData()
      this.$store.dispatch(FETCH_DICT_TYPES)
    }
  }
</script>
