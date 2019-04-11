<template>
  <div>
    <tabs :tab="{name:'/ui/basic', label:'基础组件'}"></tabs>
    <div class="app-toolbar clearfix" style="padding-bottom: 0;">
      <el-form :inline="true" class="app-search__form">
        <el-form-item label="姓名">
          <el-input placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="年龄" label-width="50px">
          <el-input placeholder="年龄"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>

      <div class="app-search__buttons">
        <el-button icon="plus" type="info">新增</el-button>
        <el-button icon="upload2" type="warning">批量导入</el-button>
      </div>

    </div>


    <el-table
      class="app-table"
      :data="tableData"
      border
      stripe>
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        width="55">
      </el-table-column>

      <el-table-column
        prop="date"
        label="日期"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template scope="scope">
          <el-button
            size="small">编辑
          </el-button>
          <el-button
            size="small"
            type="danger">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="app-toolbar">
      <el-button>批量删除</el-button>

      <el-pagination
        style="float: right;"
        :current-page="1"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>

  </div>
</template>

<style scoped>
</style>

<script>
  import Tabs from '../common/tabs.vue'
  import PageHeader from '../common/page-header.vue'
  export default {
    data() {
      const count = 10, data = []
      for (let i = 0; i < count; i++) {
        data.push({
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        })
      }
      return {
        tableData: data
      }
    },
    components: {
      PageHeader,
      Tabs
    }
  }
</script>
