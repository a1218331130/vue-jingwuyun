<!-- 亲属人员 -->
<template>
  <div>
    <!-- 标题 -->
    <card-header title="嫌疑人信息"></card-header>

    <!-- 内容 -->
    <el-row :gutter="0" :class="{'info-box':true, 'info-box--edit':editMode}" v-for="(suspect,key) in suspectList"
            :key="key">
      <!-- 信息 -->
      <el-col :span="2">
        <div class="user-box_div">
          <img src="/static/img/testPersonImg.jpg"/>
          <span class="img-tag_span">{{suspect.suspectTag}}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <el-row>
          <el-col :span="24">
            <div class="info-text-box">
              <label>姓名</label>
              <span class="lable-text-input">{{suspect.name}}</span>
            </div>
            <div class="info-text-box">
              <label>民族</label>
              <span class="lable-text-input">{{suspect.nation}}</span>
            </div>
            <div class="info-text-box">
              <label>身高</label>
              <span class="lable-text-input">{{suspect.stature}}</span>
            </div>
            <div class="info-text-box">
              <label>体型</label>
              <span class="lable-text-input">{{suspect.weight}}</span>
            </div>
            <div class="info-text-box">
              <label>团伙名称</label>
              <span class="lable-text-input">{{suspect.gangName}}</span>
            </div>
            <div class="info-text-box">
              <label>身份证</label>
              <span class="lable-text-input">{{suspect.IDCard}}</span>
            </div>
            <div class="info-text-box">
              <label>手机号</label>
              <span class="lable-text-input"><span class="hover-menu" data-type="mobile">{{suspect.phone}}</span></span>
            </div>
            <div class="info-text-box">
              <label>出生日期</label>
              <span class="lable-text-input">{{suspect.dateOfBirth}}</span>
            </div>
            <div class="info-text-box">
              <label>住址</label>
              <span class="lable-text-input">{{suspect.address}}</span>
            </div>
            <div class="info-text-box">
              <label>作案手段</label>
              <span class="lable-text-input">{{suspect.means}}</span>
            </div>
            <div class="info-text-box">
              <label>外貌描述</label>
              <span class="lable-text-input">{{suspect.graphic}}</span>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="16" style="border-left: 2px solid #4aa5e9;">
        <kinshipS></kinshipS>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
  .info-box {
    margin-top: 13px;
  }

  .describe-text {
    white-space: normal;
  }

  .k-user-img-box {
    width: 49px;
    height: 49px;
    border: 1px solid #D7D7D7;
    margin: 10px auto;
    overflow: hidden;
    .k-user-img {
      width: 90%;
      height: 100%;
      margin: 1px auto;
    }
  }

  .user-box_div {
    max-width: 100px;
    margin-left: 10%;
    border: 1px solid #d7d7d7;
    padding: 2%;
    position: relative;
    >.img-tag_span {
      display: block;
      width: 100%;
      background-color: #e79614;
      margin-top: -5px;
      text-align: center;
      color: #fff;
    }
    >img {
      width: 100%;
      max-height: 100%;
    }
  }

  .info-text-box {
    /*display: flex;*/
    float: left;
    margin-right: 30px;
    label {
      padding: 0 5px;
      margin-bottom: 2px;
      display: inline-block;
      color: #999; // text-align: justify;
      // text-align-last: justify;
      &:after {
        content: ':';
      }
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

</style>

<script>
  // 嫌疑人：姓名 民族 身高 体型  团伙名称 身份证 手机号 出生日期   住址   主从（主犯 从犯） 作案手段（持刀抢劫 入室盗取等） 外貌描述（短发国字脸中年男子）
  import cardHeader from '../report/modules/card-header.vue'

  import kinshipS from './certificate.vue'

  export default {
    data() {
      return {
        suspectList: [{
          id: '1',
          useIcon: '../../../../assets/user.jpg',
          name: '李四',
          sex: '男',
          nation: '汉',
          dateOfBirth: '1987年9月10日',
          stature: '178cm',
          weight: '62kg',
          num: '55',
          IDCard: '440977197305031234',
          gangName: '天门',
          phone: '15866668888',
          suspectTag: '主犯',
          means: '入室抢劫',
          address: '长沙岳麓区***小区**栋1203号',
          graphic: '短发国字脸中年男子',
          describe: '2017-08-24:34:58时于2017年1月4日出现于长沙中心  ****宾馆，非法聚众集会。'
        }]
      }
    },
    components: {
      cardHeader,
      kinshipS
    }
  }

</script>
