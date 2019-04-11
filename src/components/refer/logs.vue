<template>
  <div>
    <page-header title="日志管理" :path="[{
          text: '首页',
          to: '/'
        }, {
          text: '系统管理',
          to: '/system'
        }, {
          text: '日志管理'
        }]"></page-header>
    <div class="app-toolbar">
      <transition enter-active-class="animated slideInUp">
        <el-form :inline="true" label-position="right" label-width="80px" v-if="isCollapsed">
          <el-form-item prop="startTime" label="开始时间">
            <el-date-picker type="datetime" placeholder="请选择日期时间" v-model="searchKeys.startTime"></el-date-picker>
          </el-form-item>
          <el-form-item prop="endTime" label="结束时间">
            <el-date-picker type="datetime" placeholder="请选择日期时间" v-model="searchKeys.endTime"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit" @click.prevent="handleSearch">查询</el-button>
            <el-button icon="arrow-down" @click="isCollapsed = false">展开</el-button>
          </el-form-item>
        </el-form>
      </transition>
      <transition enter-active-class="animated fadeIn">
        <el-form :inline="true" label-position="right" label-width="80px" v-if="!isCollapsed">
          <el-form-item prop="startTime" label="开始时间">
            <el-date-picker type="datetime" placeholder="请选择日期时间" v-model="searchKeys.startTime"></el-date-picker>
          </el-form-item>
          <el-form-item prop="endTime" label="结束时间">
            <el-date-picker type="datetime" placeholder="请选择日期时间" v-model="searchKeys.endTime"></el-date-picker>
          </el-form-item>
          <el-form-item prop="account" label="用户名">
            <el-input v-model="searchKeys.account"></el-input>
          </el-form-item>
          <el-form-item prop="account" label="IP">
            <el-input v-model="searchKeys.ip"></el-input>
          </el-form-item>
          <el-form-item prop="action" label="操作">
            <el-input v-model="searchKeys.action"></el-input>
          </el-form-item>
          <div style="text-align: center">
            <el-button type="primary" native-type="submit" @click.prevent="handleSearch">查询</el-button>
            <el-button icon="arrow-up" @click="collapseSearch">收起</el-button>
          </div>
        </el-form>
      </transition>
    </div>
    <el-table
      class="app-table"
      v-loading="loading"
      :data="logs.list"
      @sort-change="handleSortChange"
      border
      stripe>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="account" label="用户名" width="150" sortable="custom"></el-table-column>
      <el-table-column prop="action" label="操作" width="100" sortable="custom"></el-table-column>
      <el-table-column prop="method" label="操作方法"></el-table-column>
      <el-table-column prop="params" label="参数"></el-table-column>
      <el-table-column prop="ip" label="IP" width="180" sortable="custom"></el-table-column>
      <el-table-column prop="time" label="时间" width="180" sortable="custom"></el-table-column>
      <el-table-column label="操作" width="80">
        <template scope="scope">
          <el-button size="small" @click="$router.push(`/system/logs/${scope.row.id}`)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="app-toolbar clearfix">
      <el-pagination style="float: right"
                     layout="total, sizes, prev, pager, next, jumper"
                     :current-page="logs.page"
                     :page-sizes="[10, 20, 50, 100]"
                     :page-size="logs.limit"
                     :total="logs.total"
                     @current-change="handlePageChange"
                     @size-change="handlePageSizeChange">

      </el-pagination>
    </div>
  </div>
</template>

<style scoped>
  .app-toolbar .el-input {
    width: 193px;
  }
</style>

<script>
  import { mapState } from 'vuex'
  import PageHeader from '../common/page-header.vue'
  import { FETCH_LOGS } from '../../store/types'
  import mixin from '../../utils/mixin'
  export default {
    mixins: [mixin],
    components: {PageHeader},
    data() {
      return {
        isCollapsed: true,
        searchKeys: {
          startTime: null,
          endTime: null,
          account: null,
          ip: null,
          action: null
        },
        sort: {
          order: null,
          orderBy: null
        }
      }
    },
    computed: {
      ...mapState(['logs'])
    },
    created() {
      this.loadData()
    },
    methods: {
      loadData(page = 1, limit = 10) {
        this.dispatch(FETCH_LOGS, {query: {page, limit, ...this.searchKeys, ...this.sort}})
      },
      handlePageChange(page) {
        this.loadData(page, this.logs.limit)
      },
      handlePageSizeChange(size) {
        this.loadData(1, size)
      },
      handleSearch() {
        this.loadData(1, this.logs.limit)
      },
      collapseSearch() {
        Object.assign(this.searchKeys, {account: null, ip: null, action: null})
        this.isCollapsed = true
      },
      handleSortChange({prop, order}) {
        this.sort = {
          order: order,
          orderBy: prop
        }
        this.loadData(this.logs.page, this.logs.limit)
      }
    }
  }
</script>
