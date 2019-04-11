<!-- 证件信息 -->
<template>
  <div class="certificates-box">
    <!-- 标题 -->
    <card-header title="证件信息"></card-header>
    <!-- 内容 -->
    <el-row :gutter="15" class="contact-box">
      <el-col :span="24">
        <el-table
          :data="tableData"
          :show-header=false
          :border="true"
        >
          <el-table-column
            label="证件类型"
            width="100"
          >
            <template scope="scope">
              <p>
                {{scope.row.certtype}}
              </p>
            </template>

          </el-table-column>
          <el-table-column
            prop="relation"
            label="信息"
          >
            <template scope="scope">
              <p class="text-left">
                <span class="telcolor">{{scope.row.describe.sfnumber}}</span>{{scope.row.describe.name}}

               行驶证号：<span class="telcolor">{{scope.row.describe.driving}}</span>联系人：{{scope.row.describe.contacts}}品牌：{{scope.row.describe.brand}}经营范围：{{scope.row.describe.nature}}
                发动机号：<span class="telcolor">{{scope.row.describe.engine}}</span> 车辆注册码：{{scope.row.describe.identnumber}}注册时间：<span class="telcolor">{{scope.row.describe.registertime}}</span>


              驾驶证号：<span class="telcolor">{{scope.row.describe.jsnumber}}</span>联系人：{{scope.row.describe.jscontacts}}性别：{{scope.row.describe.sex}}国籍：{{scope.row.describe.nation}}
                地址：<span class="telcolor">{{scope.row.describe.address}}</span> 准驾车型：{{scope.row.describe.type}}有效期限：<span class="jstime">{{scope.row.describe.endyear}}</span>
                管辖部门：<span class="telcolor">{{scope.row.describe.depa}}</span>
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
    .telcolor {
      color: #2a7efd;
      font-weight: bold;
    }
    .text-left {
      text-align: left;
      white-space:normal;
      span {
        display: inline-block;
        margin-right: 10px;
      }
    }
    .bluetr {
      background: #b4d6f1;
      color: #fff
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
          certtype: '身份证',
          describe: {
            sfnumber: '440456621189805234',
            name: '张伟'
          }

        }, {
          certtype: '行驶证',
          describe: {
            driving: '湘APD66',
            contacts: '张伟',
            brand: '宝马',
            nature: '非营运',
            engine: '05L32751',
            identnumber: 'LAPXCHJUI450022451',
            registertime: '2010/01/01'
          }
        }, {
          certtype: '驾驶证',
          describe: {
            jsnumber: '4444123589745986',
            jscontacts: '张伟',
            sex: '男',
            nation: '中国',
            address: '湖南省长沙市',
            jstime: '2008/01/07',
            type: 'B2',
            endyear: '6年',
            depa: '湖南省交警支队'
          }

        }]
      }
    }
  }
</script>
