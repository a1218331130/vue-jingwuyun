<!-- 亲属人员 -->
<template>
  <div>
    <!-- 标题 -->
    <card-header :title="'嫌疑人【'+suspect.name+'】'"></card-header>

    <!-- 内容 -->
    <el-row :gutter="0" :class="{'info-box':true, 'info-box--edit':editMode}">
      <!-- 信息 -->
      <el-col :span="2" v-if="checkRuleCase('ajgl/suspect/info', caseId)">
        <div class="user-box_div">
          <data-image class="person-box__person__image" v-show="suspect.photo === null" :idCard="suspect.IDCard"></data-image>
          <img class="person-box__person__image" v-show="suspect.photo !== null" :src="suspect.useIcon" width="100px" alt="照片">
          <!--<img :src="suspect.useIcon"/>-->
          <span class="img-tag_span">{{suspect.suspectTag}}</span>
        </div>
      </el-col>
      <el-col :span="4" v-if="checkRuleCase('ajgl/suspect/info', caseId)">
        <el-row>
          <el-col :span="24">
            <div class="info-text-box">
              <label>姓名</label>
              <span class="lable-text-input">{{suspect.name}}&nbsp;</span>
            </div>
            <div class="info-text-box">
              <label>身高</label>
              <span class="lable-text-input">{{suspect.stature}}&nbsp;</span>
            </div>
            <div class="info-text-box">
              <label>体型</label>
              <span class="lable-text-input">{{suspect.weight}}&nbsp;</span>
            </div>
            <div class="info-text-box">
              <label>身份证</label>
              <span class="lable-text-input">{{suspect.IDCard}}&nbsp;</span>
            </div>
            <div class="info-text-box">
              <label>年龄</label>
              <span class="lable-text-input">{{suspect.age}}&nbsp;</span>
            </div>
           <!-- <div class="info-text-box">
              <label>作案手段</label>
              <span class="lable-text-input">{{suspect.means}}&nbsp;</span>
            </div>-->
            <div class="info-text-box">
              <label>体貌特征</label>
              <span class="lable-text-input">{{suspect.graphic}}&nbsp;</span>
            </div>
            <div class="info-text-box">
              <label>绰号</label>
              <span class="lable-text-input">{{suspect.zname}}&nbsp;</span>
            </div>
            <div class="info-text-box">
              <label>作案工具</label>
              <span class="lable-text-input">{{suspect.tool}}&nbsp;</span>
            </div>
            <div class="info-text-box">
              <label>作案特点</label>
              <span class="lable-text-input">{{suspect.feature}}&nbsp;</span>
            </div>
            <div class="info-text-box">
              <label>作案原因</label>
              <span class="lable-text-input">{{suspect.reason}}&nbsp;</span>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="18" style="border-left: 0px solid #4aa5e9;" v-if="checkRuleCase('ajgl/family/list', caseId)">
        <kinshipSS :data="familyData" :suspect="data.baseinfo"></kinshipSS>
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
    > .img-tag_span {
      display: block;
      width: 100%;
      background-color: #e79614;
      margin-top: -5px;
      text-align: center;
      color: #fff;
    }
    > img {
      width: 100%;
      max-height: 100%;
    }
  }

  .info-text-box {
    /*display: flex;*/
    line-height: 1;
    float: left;
    margin-right: 30px;
    label {
      padding: 0 5px;
      margin-bottom: 2px;
      display: inline-block;
      color: #999;
      // text-align: justify;
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
  import cardHeader from './card-header.vue'
  import dataImage from '../../../../widgets/data-image/data-image'
  import kinshipSS from '../modules/certificate.vue'
  import {DOWNLOAD_FILE_PATH} from '../../../../config'

  import mixin from '../../../../utils/mixin'
  export default{
    mixins: [mixin],
    props: ['data'],
    data() {
      return {
        editMode: true,
        familyData: [],
        suspect: {},
        caseId: ''
      }
    },
    components: {
      'data-image': dataImage,
      cardHeader,
      kinshipSS
    },
    watch: {},
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      if (this.data.baseinfo) {
        let _vbi = this.data.baseinfo
        this.suspect = {
          id: _vbi.id,
          photo: _vbi.pic,
          useIcon: _vbi.pic === '' || !_vbi.pic ? '/static/img/default_user.png' : DOWNLOAD_FILE_PATH + _vbi.pic,
          name: _vbi.xm,
          sex: _vbi.xb === '1' ? '男' : _vbi.xb === '2' ? '女' : '未知',
          age: _vbi.nl, // 年龄
          dateOfBirth: _vbi.csrq,
          stature: _vbi.sg,
          weight: _vbi.ch,
          num: _vbi.nl,
          IDCard: _vbi.sfz,
          suspectTag: _vbi.sfzf,
          means: _vbi.zasd,
          tool: _vbi.zagjmc,
          reason: _vbi.zayymc,
          feature: _vbi.zatdmc,
          address: _vbi.xzz,
          graphic: _vbi.tmtz,
          zname: _vbi.ch
        }
      }
      if (this.data.family) { // 家庭成员
        this.familyData = this.data.family
      }
    }
  }
</script>
