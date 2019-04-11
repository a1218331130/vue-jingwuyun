<template>
<div class="result-item result-item-case">
  <div class="result-item-flex">
    <div class="avatar">
      <div class="avatar-index">
        <span>{{index + 1}}</span>
      </div>
    </div>
    <div class="result-info compact__box user-bg">
      <div class="result-content">
        <!-- 关系图片 -->
        <div class="relation" style="position:relative;height:auto">
          <!-- 图片信息 -->
          <div class="relation-info" style="display:flex" v-if="data.xyrxx.length > 0 || data.qkryxx.length > 0">
            <div class="relation-info-left">
              <a class="relation-item" v-model="person">
                  <img
                    :src="`${personImagePath}${person.sfzhm}`"
                    onerror="this.src='/static/img/default_person.jpg'"
                    @click="handlePersonClick(person,1)"
                    alt="">
                  <span v-html="person.qkry_qkqk?'前科':(person.xyry_qkqk?'嫌疑人':'')"></span>
                </a>
            </div>
            <el-form v-model="person" class="relation-info-right" inline label-position="right" style="padding-left:10px">
              <el-form-item label="姓名" style='display:block'>
                <span v-html="heightLightElms(person.xm?person.xm:'',keyWords)"></span>
              </el-form-item>
              <!-- <el-form-item label="案件编号" style='display:block'>
                <span v-html="person.pid?person.pid:''"></span>
              </el-form-item> -->
              <el-form-item label="证件号码" style='display:block'>
                <span @click="handlePersonClick(person,1)" class="info-base__item--point" v-html="heightLightElms(person.sfzhm?person.sfzhm:'',keyWords)"></span>
              </el-form-item>
              <el-form-item label="手机" style='display:block'>
                <span v-html="heightLightElms(person.xyry_sj?person.qkry_sj:'',keyWords)"></span>
              </el-form-item>
              <div class="case-info" style="display:block;line-height:30px">
                <!-- <el-form-item label="涉案情况" style='display:inline'>
                  <span v-html="heightLightElms(person.qkry_qkqk?person.qkry_qkqk:'')"></span>
                </el-form-item> -->
                <span style="color:#9c9c9c">涉案情况:</span>
                <span v-html="heightLightElms(person.qkry_qkqk?person.qkry_qkqk:'',keyWords)"></span>
              </div>
              <!--<el-form-item label="证件号码"><span class="keyword">440883030303030330</span></el-form-item>-->
            </el-form>
          </div>
          <!-- 嫌疑人图片 -->
          <div class="relation-img" v-if="data.xyrxx.length > 1 || data.qkryxx.length > 1">
            <div class="relation-img-content">
              <!-- 悬停信息提示框 -->
              <el-tooltip placement="top" v-for="(item, index) in data.xyrxx" :key="index">
                <div slot="content">
                  姓名:{{item.xm}}<br/> 身份证号:
                  <span class="hover-menu" data-type="idCard">{{item.sfzhm}}</span><br/> 手机:
                  <span class="hover-menu" data-type="mobile">{{item.xyry_sj}}</span><br/> 涉案情况:{{item.xyry_qkqk}}
                </div>
                <a class="relation-item" @click="changePersonClick(item)">
                    <img
                      :src="`${personImagePath}${item.sfzhm}`"
                      onerror="this.src='/static/img/default_person.jpg'"
                      alt="">
                    {{item.xm}}
                    <span>嫌疑人</span>
                  </a>
              </el-tooltip>
              <el-tooltip placement="top" v-for="(item, index) in data.qkryxx" :key="index">
                <div slot="content">
                  姓名: {{item.xm}}<br/> 身份证号:
                  <span class="hover-menu" data-type="idCard">{{item.sfzhm}}</span><br/> 手机:
                  <span class="hover-menu" data-type="mobile">{{item.qkry_sj}}</span><br/> 涉案情况: {{item.qkry_qkqk}}
                </div>
                <a class="relation-item" @click="changePersonClick(item)">
                  <img
                    :class="'relation-item'+(number===item.sfzhm?'--action':'')"
                    :src="`${personImagePath}${item.sfzhm}`"
                    onerror="this.src='/static/img/default_person.jpg'"
                    alt="">
                  {{item.xm}}
                  <span>前科</span>
                </a>
              </el-tooltip>
            </div>
          </div>
          <!-- 信息空提示 -->
          <div :class="{empty:true,'empty--tips':data.xyrxx.length ===0 && data.qkryxx.length === 0}" v-show="data.xyrxx.length ===0 && data.qkryxx.length === 0">
            <span>无案件嫌疑人相关信息</span>
          </div>
        </div>
        <div class="info-base">
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
          <el-form class="info-base-right" inline label-position="right">
            <!-- 回退 -->
            <!-- <el-form-item v-for="(item,index) in data.info.filter(d=>d.value!==null)" :key="index" :label="item.name">
              <span v-html="heightLightElms(item.value)"></span>
            </el-form-item> -->
            <div class="info-base-content">
              <el-form-item label="案件编号">
                <span class="info-base__item--point" v-html="heightLightElms(data.info[0].value,keyWords)" @click="handleCaseClick(data.info[0].value)"></span>
              </el-form-item>
              <el-form-item label="案件名称">
                <span v-html="heightLightElms(data.info[1].value,keyWords)"></span>
              </el-form-item>
              <el-form-item label="案件类型">
                <span v-html="heightLightElms(data.info[47].value,keyWords)"></span>
              </el-form-item>
              <el-form-item label="案发地点">
                <span>
                  {{heightLightElms(data.info[9].value,keyWords)}}
                  <i class="iconfont icon-dingwei" style="cursor:pointer" v-if="heightLightElms(data.info[13].value && data.info[14].value)"></i>
                </span>
              </el-form-item>
              <el-form-item label="立案日期">
                <span v-html="heightLightElms(data.info[84].value,keyWords)"></span>
              </el-form-item>
              <el-form-item label="立案单位">
                <span v-html="heightLightElms(data.info[47].value,keyWords)"></span>
              </el-form-item>
              <el-form-item label="接警编号">
                <span v-html="heightLightElms(data.info[3].value,keyWords)"></span>
              </el-form-item>
              <!-- <el-form-item label="经纬度">
                <span v-if="heightLightElms(data.info[13].value && data.info[14].value)"></span>
              </el-form-item> -->
              <el-form-item label="主办人">
                <span v-html="heightLightElms(data.info[58].value,keyWords)"></span>
              </el-form-item>
              <el-form-item label="协办人">
                <span v-html="heightLightElms(data.info[61].value,keyWords)"></span>
              </el-form-item>
              <div class="clear"></div>
              <div class="case-info" style="margin-top:5px">
                <div class="info-name" style="display:inline-block;width:64px;color: #9c9c9c;line-height: 22px">
                  简要案情:
                </div>
                <div class="info-content" style="display:inline;line-height:22px" v-html="heightLightElms(data.info[2].value.trim(),keyWords)">
                </div>
              </div>
            </div>
            <!--<el-form-item label="证件号码"><span class="keyword">440883030303030330</span></el-form-item>-->
            <!-- 信息表 -->
            <div class="result-wd">
              <el-form inline label-position="right">
                <span class="result-wd-list">信息来源:</span>
                <!-- <el-form-item v-for="(item,index) in data.ext" :key="index" :label="`${item.xxlyms}-${item.xxlyzdms}`">
                  <span v-html="heightLightElms(item.nr,keyWords)"></span> -->
                <span v-for="(item,index) in data.ext" :key="index" class="result-wd__item">{{item.xxlyms}}-{{item.xxlyzdms}}</span>
                </el-form-item>
              </el-form>
            </div>
          </el-form>
        </div>
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

.result-item-title {
    color: #fd6533;
}

.result-item {
    margin-bottom: 10px;
    background: #fff;
    box-shadow: 0 0 3px #ccc;
}
.result-item:nth-chlid(odd) {
    background: #f4f9fd;
}
.result-info:hover {
    background: #deeffa;
}

.avatar {
    border-right: 1px solid #ddd; // width: 200px;
    // min-width: 198px;
    min-width: 15px;
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
}

.el-form--inline .info-base-right {
    > .el-form-item {
        margin-right: 24px;
        margin-bottom: 0;
        width: 330px;
    }
}

.relation-img-content {
    overflow: hidden;
}
// 判断第三个右侧padding去掉、
.keyword {
    color: red;
}

.result-info {
    width: calc(100% - 20px);
    .result-content {
        display: flex;
    }
}

.info-base {
    display: inline-block;
    box-sizing: border-box;
    width: calc( 100% - 500px);
    border-bottom: 1px solid #eee;
    .info-base-content {
        padding: 10px;
        border-bottom: 1px solid #eee;
    }
}

.relation {
    display: inline-block;
    box-sizing: border-box;
    width: 470px;
    padding: 8px;
    height: 100%;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
}

.relation-item {
    position: relative;
    display: inline-block;
    font-size: 12px;
    margin: 0 3px;
    text-align: center;
    cursor: pointer;
}

.relation-item--action {
    margin: 0 3px;
    border: 1px solid #0e90d2 !important;
}

.relation-item img {
    display: block;
    width: 50px;
    border: 1px solid #f1f1f1;
}

.relation-item span {
    position: absolute;
    right: 4px;
    top: 1px;
    background: #0e90d2;
    color: #fff;
}

.el-form-item__label {
    color: #777;
}

.relation-info-left {
    .relation-item {
        img {
            width: 120px;
            height: 150px;
        }
    }
}

.relation-img {
    height: 100%; // max-height: 324px;
    width: 465px;
    overflow-y: scroll;
    .relation-item {
        img {
            height: 63px;
        }
    }
}
// 图片信息
.relation-info-right {
    .el-form-item {
        margin: 0;
    }
    .info-base__item--point {
        color: #1e8ffd;
        cursor: pointer;
    }
}

.info-base-right {
    .info-base__item--point {
        color: #1e8ffd;
        cursor: pointer;
    }
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
      person: {},
      number: null
    }
  },
  computed: {},
  methods: {
    handlePrimaryClick() {
      this.$emit('on-primary-click', this.data)
    },
    handleCaseClick(item) {
      this.$emit('on-case-click', item)
    },
    // 点击小图片在大图位置显示
    changePersonClick(item) {
      if(item === {}) {
        return
      }
      this.number = item.sfzhm
      this.person = item
    },
    handlePersonClick(item, type) {
      this.$emit('on-person-click', item.sfzhm, type)
    }
  },
  created() {
    //      this.dispatch(FETCH_RESULT_FROM_OBJECT, {keyword: this.data.primary, type: 1})
  },
  mounted() {
    this.changePersonClick(this.data.xyrxx.length > 0 ? this.data.xyrxx[0] : (this.data.qkryxx.length > 0 ? this.data.qkryxx[0] : {}))
  }
}
</script>
