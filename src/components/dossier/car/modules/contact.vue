<!-- 联系方式 -->
<template>
  <div class="contact-box">
    <!-- 标题 -->
    <card-header title="联系方式"></card-header>
    <!-- 内容 -->
    <el-row :gutter="15" class="contact-box">
      <el-col :span="24">
        <el-table
          :data="tableData"
          :show-header=false
          :border="true"

        >
          <el-table-column
            prop="relation"
            label="电话"
            width="100"
          >
            <template scope="scope">
              <div >
                联系电话
              </div>

            </template>

          </el-table-column>
          <el-table-column
            prop="relation"
            label="电话"
          >
            <template scope="scope">
              <p class="text-left">
                <span class="telcolor">{{scope.row.tel}}</span><span>{{scope.row.name}}{{scope.row.number}}</span>
              </p>
            </template>

          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .contact-box {
    margin-top: 13px;
    .title_bg{
      background: #f2f2f2;
    }
    .telcolor {
      color: #2a7efd;
      font-weight: bold;
    }
    .text-left {
      text-align: left;
      span{
        display: inline-block;
        margin-right:10px;
      }
    }
  }
</style>
<style>
  .contact-box .el-table td.el-table_1_column_4,.contact-box .el-table td.el-table_1_column_6{
    background: #f2f2f2;
  }

  .contact-box .el-table td{
    background: #fff;
  }
</style>

<script>
  import cardHeader from './card-header.vue'
  export default {
    components: {
      cardHeader
    },
    data() {
      return {
        tableData: [{
          tel: '15818966985',
          name: '黄里',
          number: '12'
        }, {
          tel: '15818966985',
          name: '黄里',
          number: '12'
        } ]
      }
    }
  }
</script>
