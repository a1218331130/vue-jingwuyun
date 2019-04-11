<template>
  <div>
    <page-header title="组织管理" :path="breadcrumb"></page-header>
    <div class="app-toolbar clearfix" style="padding-bottom: 0;">
      <el-form :inline="true" class="app-search__form">
        <el-form-item label="组织编号">
          <el-input placeholder="组织编号" v-model="searchKeys.code"></el-input>
        </el-form-item>
        <el-form-item label="组织名称" label-width="70px">
          <el-input placeholder="组织名称" v-model="searchKeys.name"></el-input>
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

    <el-table
      ref="table"
      v-loading.body="loading"
      :data="org.list"
      class="app-table"
      @selection-change="handleSelectionChange"
      border
      stripe>
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        width="60">
      </el-table-column>
      <el-table-column
        prop="code"
        label="组织编号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="name"
        label="组织名称"
        show-overflow-tooltip
        width="200"></el-table-column>
      <el-table-column
        prop="parentName"
        label="上级组织名称"
        show-overflow-tooltip
        width="200"></el-table-column>
      <el-table-column
        prop="address"
        min-width="100"
        label="组织地址">

      </el-table-column>
      <el-table-column
        prop="order"
        label="排序"
        width="70">
      </el-table-column>
      <el-table-column
        label="操作"
        width="140">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.row, scope.$index)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleRemove(scope.row, scope.$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="app-toolbar">
      <el-button @click="handleMultiRemove">批量删除</el-button>

      <el-pagination
        style="float: right;"
        :current-page="org.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="org.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="org.total"
        @current-change="handlePageChange"
        @size-change="handlePageSizeChange">
      </el-pagination>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      style="min-width:800px;"
    >
      <el-form ref="form" :rules="rules" :model="item" label-position="right" label-width="80px">
        <el-form-item label="组织名称" prop="name">
          <el-input v-model.trim="item.name"></el-input>
        </el-form-item>
        <el-form-item label="组织编号" prop="code">
          <el-input v-model.trim="item.code"></el-input>
        </el-form-item>
        <el-form-item label="上级组织" porp="parentName">
          <el-input v-model.trim="item.parentName"></el-input>
        </el-form-item>
        <el-form-item label="组织地址" prop="address">
          <el-input v-model="item.address"></el-input>
        </el-form-item>
        <el-form-item label="排序号" prop="order">
          <el-input-number v-model.number="item.order"></el-input-number>
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
  import { FETCH_ORG, REMOVE_ORG, UPDATE_ORG, ADD_ORG } from '../../store/types'
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
          text: '组织管理'
        }],
        dialogVisible: false,
        multipleSelection: [],
        searchKeys: {
          code: null,
          name: null
        },
        item: {
          name: '',
          code: '',
          address: '',
          parentName: '',
          order: 0
        },
        rules: {
          name: [{
            required: true,
            message: '请输入组织名称',
            trigger: 'blur'
          }],
          code: [{
            required: true,
            message: '请输入组织编码',
            trigger: 'blur'
          }],
          order: [{
            required: true,
            type: 'number',
            message: '请输入排序号',
            trigger: 'blur'
          }]
        },
        cascaderProp: {
          label: 'name',
          value: 'id',
          children: 'children'
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
        org: state => state.org
      }),
      dialogTitle() {
        return this.item.id ? '编辑组织' : '新增组织'
      }
    },
    methods: {
      loadData(page = 1, limit = 10) {
        this.dispatch(FETCH_ORG, {
          query: {page, limit, ...this.searchKeys}
        })
      },
      handlePageChange(page) {
        !this.loading && this.loadData(page, this.org.limit)
      },
      handlePageSizeChange(size) {
        !this.loading && this.loadData(1, size)
      },
      handleAdd() {
        this.item = {
          name: '',
          code: '',
          address: '',
          parentName: '',
          order: 0
        }
        this.dialogVisible = true
      },
      handleEdit(row, index) {
        this.dialogVisible = true
        this.item = Object.assign({}, row)
      },
      handleSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.dialogVisible = false
            this.$store.dispatch(this.item.id ? UPDATE_ORG : ADD_ORG, {
              model: this.item
            }).then(_ => {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            })
          } else {
            this.$message({
              type: 'error',
              message: '表单验证错误!'
            })
          }
        })
      },
      handleRemove(row, index) {
        this.confirm('此操作将将永久删除该数据，是否继续？')
          .then(_ => {
            this.dispatch(REMOVE_ORG, {query: {id: row.id}, index: index})
            this.loadData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(_ => {
            // console.log('cancel')
          })
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
          this.$store.dispatch(REMOVE_ORG, {query: {ids: ids.join(',')}})
            .then(_ => {
              this.$message({
                type: 'success',
                message: '批量删除成功!'
              })
              this.loadData()
            })
            .catch(_ => {
              this.$message({
                type: 'error',
                message: '批量删除失败!'
              })
            })
        }).catch(_ => {})
      },
      handleSearch() {
        this.loadData()
      }
    },
    created() {
      this.loadData()
    },
    components: {
      PageHeader
    }
  }
</script>
