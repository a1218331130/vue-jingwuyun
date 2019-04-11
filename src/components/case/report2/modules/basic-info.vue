<!-- 人员基本信息 -->
<template>
  <div>
    <!-- 标题 -->
    <card-header title="基础信息" :tool="true"></card-header>
    <!-- 内容 -->
    <el-row :gutter="15" class="info-box">
      <!-- 图像 -->
      <el-col :span="3">
        <div class="users-image">
          <img src="/static/img/testPersonImg.jpg"/>
        </div>
        <div class="attention-button">关注</div>
      </el-col>
      <!-- 信息 -->
      <el-col :span="21">
        <el-row>
          <el-col :span="24" class="info-text-name">
            <span class="name">樊文斌</span>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" class="info-text-box">
            <label>性别</label>
            <span class="lable-text-input">男</span>
          </el-col>
          <el-col :span="8" class="info-text-box">
            <label>曾用名</label>
            <span class="lable-text-input">陈二狗</span>
          </el-col>
          <el-col :span="8" class="info-text-box">
            <label>绰号</label>
            <span class="lable-text-input">二狗子</span>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" class="info-text-box">
            <label>民族</label>
            <span class="lable-text-input">汉</span>
          </el-col>
          <el-col :span="8" class="info-text-box">
            <label>出生日期</label>
            <span class="lable-text-input">1988-01-13</span>
          </el-col>
          <el-col :span="8" class="info-text-box">
            <label>责任人</label>
            <span class="lable-text-input">张三</span>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" class="info-text-box">
            <label>出生地址</label>
            <span class="lable-text-input">湖南省长沙开发区XXXXX</span>
          </el-col>
          <el-col :span="16" class="info-text-box">
            <label>现住地址</label>
            <span class="lable-text-input">湖南长沙经济开发区XX小区X栋X号</span>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" class="info-text-box">
            <label>服务处所</label>
            <span class="lable-text-input">开发区派出所</span>
          </el-col>
          <el-col :span="16" class="info-text-box">
            <label>户籍地址</label>
            <span class="lable-text-input">湖南长沙开发区XX小区X栋X号</span>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" class="info-text-box label-box">
            <label>标签</label>
            <el-tag>健身教练</el-tag>
            <el-tag>暴力倾向</el-tag>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="info-box-hr">
      <div class="info-line"></div>
      <span class="info-line-title">相关资源表</span>
    </el-row>
    <el-row>
      <el-col :span="24" class="info-table-list">
        <a href="javascript:void(0)">警综_案件信息表</a>
        <a href="javascript:void(0)">公安_全国前科人员信息表</a>
        <a href="javascript:void(0)">流动人员信息表</a>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
  label {
    margin-right: 10px;
    width: 70px;
    text-align: justify;
    text-align-last: justify;
  }

  .info-box {
    margin-top: 13px;
    .users-image {
      height: 145px;
      border: 1px solid #D7D7d7;
      text-align: center;
      background-color: #F2F2F2;
      img {
        margin: 5px;
        width: calc(100% - 10px);
        height: calc(100% - 10px);
      }
    }
    .attention-button {
      width: 98%;
      height: 30px;
      line-height: 30px;
      color: #fff;
      background-color: #5BABE6;
      text-align: center;
      margin: 12px auto 0;
      cursor: pointer;
      &:hover {
        background-color: #FF9900;
      }
    }
    .info-text-name {
      margin-bottom: 12px;
      margin-left: 10px;
      .name {
        font-size: 22px;
        color: #1E1E1E;
      }
    }
    .info-text-box {
      display: flex;
      label {
        min-height: 28px;
        line-height: 28px;
        padding: 0 8px;
        background-color: #F2F2F2;
        margin-bottom: 2px;
      }
      span.lable-text-input {
        line-height: 28px;
        width: 65%;
      }
      &.label-box {
        label {
          height: 38px;
          line-height: 38px;
        }
        span {
          line-height: 22px;
          padding: 0 10px;
          margin-top: 7px;
          height: 25px;
          margin-right: 6px;
          background-color: #FF9900;
        }
      }
    }
  }

  .info-box-hr {
    padding-top: 10px;
    height: 25px;
    .info-line {
      width: 100%;
      height: 4px;
      background-color: #F2F2F2;
    }
    .info-line-title {
      position: absolute;
      margin-top: -14px;
      padding-right: 10px;
      background-color: #fff;
    }
  }

  .info-table-list {
    padding-left: 10px;
    line-height: 35px;
    a {
      margin-right: 15px;
    }
  }
</style>

<script>
  import cardHeader from './card-header.vue'
  export default{
    components: {
      cardHeader
    }
  }
</script>
