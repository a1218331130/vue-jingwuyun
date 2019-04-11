<template>
<div class="result-item">
  <div class="result-item-flex">
    <div class="avatar">
      <div class="avatar-index">
        <span>{{index + 1}}</span>
      </div>
      <span class="avatar-pic" @click="handlePrimaryClick(data.clxx[0].pid,false,2)"><img :src="getCarImage(data.clxx[0].zwppmc, data.clxx[0].clxh)" onerror="this.src='/static/img/default-car.jpg'" alt="">
        <span class="carNumber">{{data.clxx[0].pid}}</span>
      </span>
      <!-- 关系图片 -->
      <div class="relation">
        <div class="relation-item" v-for="(item,index) in data.czxx" :title="item.xxlyms">
          <el-tooltip placement="top">
            <div slot="content">
              姓名: {{item.xm}}<br/>身份证号:
              <span class="hover-menu" data-type="idCard">{{item .sfzhm}}</span><br/>信息来源: {{item.xxlyms}}
            </div>
            <img :src="`${personImagePath}${item.sfzhm}`" onerror="this.src='/static/img/default_person.jpg'" @click="handlePersonClick(item,1)" alt=""> {{item.xm}}
            <span>车主</span>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="result-info user-bg">
      <div class="info-base" style="position:relative">
        <!-- <div class="result-item-title">
          <span>采集时间: {{data.time}}</span>
          <el-button type="text" size="small"><i title="分享" class="iconfont icon-share"></i></el-button>
          <el-button type="text" size="small" title="添加到临时储存">
            <i class="iconfont icon-save"></i>
          </el-button>
          <el-button type="text" size="small" title="移入案件池">
            <i class="iconfont icon-data-cloud"></i>
          </el-button>
        </div> -->
        <el-form inline label-position="right">
          <!-- <el-form-item v-for=" (item,index) in data.info.filter(d=>d.value!==null).filter(d=>flag?true:d.isDefault === true)" :key="index" :label="item.name">
            <span :class="{'info-base__item--point':item.mark!==null}" @click="handlePrimaryClick(item.value,!item.mark,data.info)" v-html="heightLightElms(item.value)"></span>
          </el-form-item> -->
          <div v-for="(item,index) in data.clxx" :class="{'content-info':index >=1,'info-box':true}">
            <el-form-item v-for="(itemInfo,index) in item.info.filter(d=>d.value!==null).filter(d=>flag?true:d.isDefault === true)" v-if="itemInfo.name" :key="index" :label="itemInfo.name">
              <span :class="{'info-base__item--point':itemInfo.mark!==null}" @click="handlePrimaryClick(itemInfo,!itemInfo.mark)" v-html="heightLightElms(itemInfo.value,keyWords)"></span>
            </el-form-item>
          </div>
          <!--<el-form-item label="证件号码"><span class="keyword">440883030303030330</span></el-form-item>-->
        </el-form>
        <!-- 展开按钮 -->
        <div class="show-btn" style="display:inline-block;line-height:16px;position:absolute;bottom:0;right:0;cursor:pointer;color:#9c9c9c" @click="()=>{flag = !flag}">
          <el-button type="text" size="mini" v-html="flag?'收起':'显示全部'" style="color:#9c9c9c">
          </el-button>
          <i :class="{'iconfont':true, 'icon-packup-2':flag,'icon-unfold1':!flag}" style="position:relative;top:2px;color:#1e8ffd"></i>
        </div>
      </div>
      <!-- 关系图片 -->
      <!-- <div class="relation">
        <div class="relation-item" v-for="(item,index) in data.czxx" :title="item.xxlyms">
          <img :src="`${personImagePath}${item.sfzhm}`" onerror="this.src='/static/img/default_person.jpg'" @click="handlePersonClick(item)" alt=""> {{item.xm}}
          <span>车主</span>
        </div>
      </div> -->
      <!-- 信息表 -->
      <div class="result-wd">
        <el-form inline label-position="right">
          <span class="result-wd-list">信息来源:</span>
          <!-- <el-form-item v-for="(item,index) in data.ext" :key="index" :label="`${item.xxlyms}-${item.xxlyzdms}`"> -->
          <!-- <span v-html="heightLightElms(item.nr)"></span> -->
          <span v-for="(item,index) in data.ext" :key="index" class="result-wd__item">{{item.xxlyms}}-{{item.xxlyzdms}}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>

</div>
</template>
<style lang="scss" scoped>
.result-item-flex {
    display: flex;
    flex-direction: row;
    align-items: stretch;
}
.result-item-flex:hover {
    background: #deeffa;
}

.result-item-title {
    color: #fd6533;
}

.result-item {
    margin-bottom: 10px;
    background: #fff;
    box-shadow: 0 0 3px #ccc;
}

.avatar {
    border-right: 1px solid #ddd;
    width: 200px;
    min-width: 198px;
    cursor: pointer;
    position: relative;
}

.avatar-index {
    background: #0e90d2;
    height: 100;
    font-size: 12px;
    color: #fff;
    text-align: center;
    float: left;
    width: 15px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
}

.avatar-index > span {
    display: inline-block;
    width: 12px;
    vertical-align: middle;
    word-break: break-all;
    position: absolute;
    top: 50%;
    left: 2px;
    transform: translateY(-50%);
}

.avatar img {
    width: 150px;
    display: block;
}

.avatar-pic {
    padding: 5px;
    border: 1px solid #eee;
    background: #f5f5f5;
    display: inline-block;
    margin: 10px;
    float: right;
    position: relative;
    .carNumber {
        position: absolute;
        top: 5px;
        right: 5px;
        color: #fff;
        background-color: #0e90d2;
    }
}

.el-form--inline .el-form-item {
    margin-right: 40px;
    margin-bottom: 0;
}

.keyword {
    color: red;
}

.result-info {
    width: calc(100% - 20px);
}

.info-base {
    border-bottom: 1px solid #ddd;
    &__item {
        &--point {
            color: #1e8ffd;
            opacity: 0.8;
            cursor: pointer;
            &:hover {
                opacity: 1;
            }
        }
    }
}

.relation {
    padding: 4px 2px 4px 20px;
}

.relation-item {
    position: relative;
    display: inline-block;
    font-size: 12px;
    margin: 0 3px;
    text-align: center;
    cursor: pointer;
}

.relation-item img {
    display: block;
    width: 50px;
    border: 1px solid #f1f1f1;
}

.relation-item span {
    position: absolute;
    right: 0;
    top: 0;
    background: #0e90d2;
    color: #fff;
}

.result-wd {
    // border-top: 1px solid #eee;
    padding: 5px 10px 0;
    font-size: 12px;
    &__item {
        color: orangered;
        font-size: 14px;
        line-height: 32px;
        padding-right: 20px;
    }
}

.content-info {
    border-top: 1px dashed #ccc;
}

.info-box {
    padding: 10px;
}
.result-wd-list {
    color: #9c9c9c;
    line-height: 32px;
    padding: 0 4px 0 0;
    font-size: 14px;
}
.result-wd__item {
    color: #060606;
}
</style>
<script>
//  import { FETCH_RESULT_FROM_OBJECT } from '../../../store/types'
import mixin from '../../../utils/mixin'
export default {
  mixins: [mixin],
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    },
    keyWords: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      flag: false
    }
  },
  computed: {},
  methods: {
    handlePrimaryClick(item, mark, type) {
      console.log(item, mark, type, 'pose')
      if(mark) return
      this.$emit('on-primary-click', item, type)
    },
    handlePersonClick(item, type) {
      this.$emit('on-person-click', item.sfzhm, type)
    }
  },
  created() {}
}
</script>
