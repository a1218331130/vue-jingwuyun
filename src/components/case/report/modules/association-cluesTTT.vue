<!-- 关联线索 -->
<template>
  <div>
  <!-- 标题 -->
  <card-header title="其它关联"></card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="involved-box">
    <el-col :span="24">
      <el-table
        :data="tableData"
        :stripe="true"
        :show-header=false
      >
        <el-table-column
          prop="address"
          label="其他信息"
          align="left"
        >
          <template scope="scope">
            <p class="time-text">
              采集时间：{{scope.row.time}}
            </p>
            <p class="other-text">
              <span>企业名称：</span> {{scope.row.qename}}
              <span>企业联系QQ：</span> {{scope.row.qeqq}}
              <span>省市县：</span>{{scope.row.ssx}}
              <span>地址详址：</span>{{scope.row.address}}
              <span>企业地址详址：</span>{{scope.row.qeaddress}}
              <span>联系人姓名：</span>{{scope.row.lxname}}
              <span>企业联系电话：</span>{{scope.row.qetel}}
              <span>企业是否特种行业0为否1为是：</span>{{scope.row.special}}
              <span>企业人数：</span>{{scope.row.qenumber}}
              <span>操作员姓名：</span>{{scope.row.czname}}
              <span>操作员手机号：</span>{{scope.row.cztel}}
              <span>操作员身份证号码：</span>{{scope.row.czsfz}}
              <span>出生日期：</span>{{scope.row.cstime}}
              <span>操作员户籍：</span>{{scope.row.caxj}}
              <span>性别：</span>{{scope.row.czsex}}
              <span>籍贯行政区域：</span>{{scope.row.jgxzqy}}
              <span>企业法人姓名：</span>{{scope.row.frname}}
              <span>企业法人身份证号码：</span>{{scope.row.frsfz}}
            </p>
          </template>
        </el-table-column>


      </el-table>
    </el-col>
  </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .involved-box {
    margin-top: 13px;
    .time-text {
      color: #ff6633;
    }
    .describe-text {
      white-space: normal;
    }
    .relation-text {
      padding: 18px 15px;
      background: #88cfff;
      margin: 0px -15px;
      color: #fff;
      line-height: 27px;
      white-space: normal
    }
    .time-text {
      color: #ff6633;
      margin-bottom: 0px;
    }
    .other-text {
      white-space: normal;
      color: #000;
      span {
        display: inline-block;
        color: #999;

        &:first-child {
          margin-left: 0px;
        }
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
    data () {
      return {
        tableData: [{
          time: '2017-08-26 17:33:33',
          qename: '新圆华府6栋2单元',
          qeqq: '4056689878',
          ssx: '北京市xx县',
          address: '大亚湾XXXX华府小区',
          qeaddress: '大亚湾XXXX华府小区',
          lxname: '李四',
          qetel: '15878866505',
          special: '1',
          qenumber: '200',
          czname: '赵武',
          cztel: '14785622325',
          czsfz: '4415877855652568544',
          cstime: '1988/02/16',
          caxj: '广东省',
          czsex: '男',
          jgxzqy: '广东省惠州市',
          frname: '',
          frsfz: ''
        }, {
          time: '2017-08-26 17:33:33',
          qename: '新圆华府6栋2单元',
          qeqq: '4056689878',
          ssx: '北京市xx县',
          address: '大亚湾XXXX华府小区',
          qeaddress: '大亚湾XXXX华府小区',
          lxname: '李四',
          qetel: '15878866505',
          special: '1',
          qenumber: '200',
          czname: '赵武',
          cztel: '14785622325',
          czsfz: '4415877855652568544',
          cstime: '1988/02/16',
          caxj: '广东省',
          czsex: '男',
          jgxzqy: '广东省惠州市',
          frname: '',
          frsfz: ''
        }]
      }
    }
  }
</script>
