<template>
  <div>
    <el-dialog
      title="服务总线新建"
      :visible.sync="dialogVisible"
      size="tiny"
    >
      <el-form ref="form"  :model="item" label-width="80px">
        <el-form-item label="服务名称"><el-input v-model="item.name"></el-input></el-form-item>
        <el-form-item label="请求路径"><el-input v-model="item.yydz"></el-input></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="serviceCreate"> 立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <tabs :tab="tab"></tabs>
    <div class="app-toolbar clearfix">
      <el-form :inline="true" class="app-search__form">
        <el-form-item label="服务名称">
          <el-input placeholder="支持模糊查询" v-model="searchKeys.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" @click.prevent="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>

      <div class="app-search__buttons">
        <el-button icon="plus" type="info" @click="handleAdd">新增</el-button>
      </div>
    </div>
    <el-table
      class="app-table"
      v-loading.body="loading"
      border
      stripe
      :data="serviceBus.PageData">
      <el-table-column prop="id" label="服务编号" width="90"></el-table-column>
      <el-table-column prop="name" label="服务名称"></el-table-column>
      <el-table-column prop="yydz" label="请求路径"></el-table-column>
      <el-table-column prop="kfyy" label="开发语言" width="120"></el-table-column>
      <el-table-column prop="kfxy" label="开发协议" width="120">
        <template scope="scope">
          {{scope.row.kfxy == 1 ? 'OAP协议(WebService)' : scope.row.kfxy == 2 ? 'HTTP POST' : scope.row.kfxy}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template scope="scope">
          <el-button size="small" @click="handleUpdate(scope.row, scope.$index)">编辑</el-button>
          <el-button size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="app-toolbar">
      <el-pagination
        style="float: right;"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="serviceBus.DataCount"
        @current-change="handlePageChange"
        @size-change="handlePageSizeChange">
      </el-pagination>
    </div>

  </div>
</template>

<style scoped>
</style>

<script>
  import {mapState} from 'vuex'
  import Tabs from '../common/tabs.vue'
  import {FETCH_SERVICE_BUS, ADD_SERVICE_BUS} from '../../store/types'
  import mixin from '../../utils/mixin'
  export default {
    mixins: [mixin],
    components: {
      Tabs
    },
    data() {
      return {
        tab: null,
        dialogVisible: false,
        item: {
          name: '',
          yydz: ''
        },
        searchKeys: {
          name: ''
        },
        pageSize: 10
      }
    },
    computed: {
      ...mapState(['users', 'serviceBus'])
    },
    methods: {
      loadData(page = 1, pageSize = 10) {
        this.pageSize = pageSize;
        this.dispatch(FETCH_SERVICE_BUS, {
          PageIndex: page,
          PageSize: pageSize,
          Keyword: this.searchKeys.name
        })
      },
      handleSearch() {
        !this.loading && this.loadData(1, this.pageSize)
      },
      handleUpdate(r, i) {
        this.dialogVisible = true;
        console.log(r, i);
      },
      handleAdd() {
        this.item = {
          name: '',
          yydz: ''
        }
        this.dialogVisible = true
      },
      serviceCreate() {
        this.dispatch(ADD_SERVICE_BUS, {
          data: this.item
        })
      },
      handlePageChange(page) {
        !this.loading && this.loadData(page, this.pageSize)
      },
      handlePageSizeChange(size) {
        this.pageSize = size;
        !this.loading && this.loadData(1, size)
      }
    },
    created() {
      this.tab = {
        label: '服务总线管理',
        name: this.$route.path
      }
      this.loadData();
      console.log(this.$route.params.id);
    }
  }
</script>
