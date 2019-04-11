<template>
  <div>
    <page-header title="用户管理" :path="[{
          text: '首页',
          to: '/'
        }, {
          text: '系统管理',
          to: '/system'
        }, {
          text: '用户管理'
        }]"></page-header>
    <div class="app-toolbar clearfix" style="padding-bottom: 0;">
      <el-form :inline="true" class="app-search__form">
        <el-form-item label="角色" porp="role">
          <el-select v-model="searchKeys.role"></el-select>
        </el-form-item>
        <el-form-item label="组织" porp="role">
          <el-select v-model="searchKeys.org"></el-select>
        </el-form-item>
        <el-form-item label="用户名" porp="role">
          <el-input v-model="searchKeys.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" native-type="submit">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="app-search__buttons">
        <el-button icon="plus" type="info">新增</el-button>
      </div>
    </div>
    <el-table class="app-table"
              :data="users.list"
              v-loading="loading"
              border
              stripe>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column label="用户名" prop="account"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="phone"></el-table-column>
      <el-table-column label="角色" prop="roleName"></el-table-column>
      <el-table-column label="组织" prop="orgName"></el-table-column>
      <el-table-column label="状态" prop="status" width="80">
        <template scope="scope">
          <el-tag type="primary" v-if="scope.row.status">启用</el-tag>
          <el-tag type="warning" v-else>禁用</el-tag>

        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template scope="scope">
          <el-button size="small">编辑</el-button>
          <el-button size="small" type="info" v-if="!scope.row.status">启用</el-button>
          <el-button size="small" type="warning" v-else>禁用</el-button>
          <el-button size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="app-toolbar clearfix">
      <el-pagination style="float: right"
                     :current-page="users.page"
                     :page-sizes="[10,20,50,100]"
                     :page-size="users.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     @current-change="handlePageChange"
                     @size-change="handleSizeChange"
                     :total="users.total">
      </el-pagination>
    </div>
  </div>
</template>

<style scoped>
</style>

<script>
  import PageHeader from '../common/page-header.vue'
  import mixin from '../../utils/mixin'
  import { mapState } from 'vuex'
  import { FETCH_USERS } from '../../store/types'
  export default {
    mixins: [mixin],
    components: {PageHeader},
    data() {
      return {
        searchKeys: {
          role: '',
          org: '',
          name: ''
        }
      }
    },
    computed: {
      ...mapState({
        users: state => state.users
      })
    },
    methods: {
      loadData(page = 1, limit = 10) {
        this.dispatch(FETCH_USERS, {query: {page, limit, ...this.searchKeys}})
      },
      handlePageChange(page) {
        this.loadData(page, this.users.limit)
      },
      handleSizeChange(size) {
        this.loadData(1, size)
      },
      handleSearch() {
        this.loadData(1, this.users.limit)
      }
    },
    created() {
      this.loadData()
    }
  }
</script>
