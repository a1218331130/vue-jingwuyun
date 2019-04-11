<!-- 关联地址 -->
<template>
  <div>
  <!-- 标题 -->
  <card-header title="关联地址"></card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="contact-box">
    <el-col :span="24">
      <el-table
        :data="tableData"
        :show-header=false
        :border="true"
      >
        <el-table-column
          label="电话"
          width="100"
        >
          <template scope="scope">
            <p class="">
              地址：
            </p>
          </template>

        </el-table-column
      >
        <el-table-column
          label="电话"
        >
          <template scope="scope">
            <p class="text-left">
              <span class="addresscolor">{{scope.row.address}}</span>
            </p>
          </template>

        </el-table-column
         >
      </el-table>
    </el-col>
  </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .contact-box {
    margin-top: 13px;
    .addresscolor {
      color: #000;
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


<script>
  import cardHeader from './card-header.vue'
  export default {
    components: {
      cardHeader
    },
    data() {
      return {
        tableData: [{
          address: '湖南省长沙市芙蓉区火柜西路桥边公园西北'
        }, {
          address: '湖南省长沙市芙蓉区火柜西路桥边公园西北'
        }]
      }
    }
  }
</script>
