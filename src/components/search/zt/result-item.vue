<template>
<div class="result-item">
  <div class="result-item-flex">
    <div class="avatar">
      <div class="avatar-index">
        <span>{{index + 1}}</span>
      </div>
      <!-- 图片标签 -->
      <div class="img-tag" style="display:flex">
        <span class="avatar-pic" @click="handlePrimaryClick(data.primary,false,1)"><img :src="`${personImagePath}${data.primary}`" onerror="this.src='/static/img/default_person.jpg'" alt=""></span>
        <!-- 标签 -->
        <!-- <div class="result-tags" v-if="tagList.length> 0">
          <el-tag v-for="(item,index) in tagList" :key="index" :type="item.IsCustomLable==='1'?'primary':'success'" style="margin-right:5px;">{{item.LabelName}}</el-tag>
        </div> -->
        <div class="relation-img">
          <!-- <el-tooltip v-for="(item,i) in testList" :key="i" placement="top">
            <div slot="content">
              姓名: {{item}}<br/> 身份证: {{item}}<br/> 关系: {{item}}
            </div>
            <div class="relation-item cursor--pointer" @click="handlePrimaryClick(item.endNode.zjhm)">
              <img class="relation-item__img" :src="`${personImagePath}${item}`" onerror="this.src='/static/img/default_person.jpg'" alt="item.endNode.zjhm">
              <span class="relation-item__span" :title="item">123</span>
            </div>
          </el-tooltip> -->
          <el-tooltip v-for="(item,i) in relationList" :key="i" placement="top">
            <div slot="content">
              姓名: {{item.endNode.ms}}<br/> 身份证:
              <span class="hover-menu" data-type="idCard">{{item.endNode.zjhm}}</span><br/> 关系: {{item.type.join(' ')}}
            </div>
            <div class="relation-item cursor--pointer" @click="handlePrimaryClick(item.endNode.zjhm,false,1)">
              <img class="relation-item__img" :src="`${personImagePath}${item.endNode.zjhm}`" onerror="this.src='/static/img/default_person.jpg'" alt="item.endNode.zjhm" crossorigin="anonymous"> {{item.endNode.ms}}
              <span class="relation-item__span" :title="item.type.join(',')">{{item.type[0]}}</span>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="result-tags" v-if="tagList.length> 0">
        <el-tag v-for="(item,index) in tagList" :key="index" :type="item.IsCustomLable==='1'?'primary':'success'" style="margin-right:5px;">{{item.LabelName}}</el-tag>
      </div>
    </div>

    <div class="result-info user-bg">
      <div class="info-base" style="position:relative;padding-bottom:6px">
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
          <el-form-item v-for="(item,index) in data.info.filter(d=>d.value!==null).filter(d=>flag?true:d.isDefault === true)" v-if="item.name" :key="index" :label="item.name">
            <span :class="{'info-base__item--point':item.mark!==null}" @click="handlePrimaryClick(item,!item.mark)" v-html="heightLightElms(item.value,keyWords)"></span>
          </el-form-item>
          <!--<el-form-item label="证件号码"><span class="keyword">440883030303030330</span></el-form-item>-->
          <!-- 展开按钮 -->
          <div class="show-btn" style="display:inline-block;line-height:16px;position:absolute;bottom:0;right:0;cursor:pointer;color:#9c9c9c" @click="()=>{flag = !flag}">
            <el-button type="text" size="mini" v-html="flag?'收起':'显示全部'" style="color:#9c9c9c">
            </el-button>
            <i :class="{'iconfont':true, 'icon-packup-2':flag,'icon-unfold1':!flag}" style="position:relative;top:2px;color:#1e8ffd"></i>
          </div>
        </el-form>
        <!-- 标签 -->
        <!-- <div class="result-tags" v-if="tagList.length> 0">
          <el-tag v-for="(item,index) in tagList" :key="index" :type="item.IsCustomLable==='1'?'primary':'success'" style="margin-right:5px;">{{item.LabelName}}</el-tag>
        </div> -->
      </div>
      <!-- 关系图 -->
      <div class="relation">
        <!-- <el-tooltip v-for="(item,i) in relationList" :key="i" placement="top">
          <div slot="content">
            姓名: {{item.endNode.ms}}<br/> 身份证: {{item.endNode.zjhm}}<br/> 关系: {{item.type.join(' ')}}
          </div>
          <div class="relation-item cursor--pointer" @click="handlePrimaryClick(item.endNode.zjhm)">
            <img class="relation-item__img" :src="`${personImagePath}${item.endNode.zjhm}`" onerror="this.src='/static/img/default_person.jpg'" alt="item.endNode.zjhm"> {{item.endNode.ms}}
            <span class="relation-item__span" :title="item.type.join(',')">{{item.type[0]}}</span>
          </div>
        </el-tooltip> -->
        <!-- 信息表 -->
        <div class="result-wd">
          <el-form inline label-position="right">
            <span class="result-wd-list">信息来源:</span>
            <!-- <el-form-item v-for="(item,index) in data.ext" :key="index" :label="`${item.xxlyms}-${item.xxlyzdms}`">
              <span v-text="heightLightElms(item.nr,keyWords)"></span>
            </el-form-item> -->
            <span class="result-wd__item" v-for="(item,index) in data.ext" :key="index">{{item.xxlyms}}-{{item.xxlyzdms}}</span>
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
    width: 334px;
    min-width: 284px;
    cursor: pointer;
    position: relative;
    .img-tag {
        width: 288px;
    }
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
    width: 140px;
    height: 172px;
    display: block;
}

.avatar-pic {
    // padding: 5px;
    border: 1px solid #eee; // background: #f5f5f5;
    display: inline-block;
    margin: 10px 5px 10px 10px;
    float: right;
}

.el-form--inline .el-form-item {
    margin-right: 46px;
    margin-bottom: 0;
}

.keyword {
    color: red;
}

.result-info {
    width: calc(100% - 20px);
}

.info-base {
    padding: 10px;
    border-bottom: 1px solid #eee;
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

// .relation {
//     padding: 8px;
// }
.relation-img {
    padding-top: 10px;
    max-height: 176px;
    overflow-y: scroll;
    .relation-item {
        position: relative;
        display: inline-block;
        font-size: 12px;
        margin: 0 3px;
        text-align: center;
        img {
            display: block;
            width: 53px;
            height: auto;
            border: 1px solid #f1f1f1;
        }
    }
}

.relation-item {
    position: relative;
    display: inline-block;
    font-size: 12px;
    margin: 0 3px;
    text-align: center;
    &__img {
        display: block;
        width: 50px;
        height: 63px;
        border: 1px solid #f1f1f1;
    }
    &__span {
        position: absolute;
        right: 0;
        top: 0;
        background: #0e90d2;
        color: #fff;
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

// 标签样式
.result-tags {
    padding-left: 25px;
    .el-tag {
        margin-bottom: 5px;
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
import { mapState } from 'vuex'
// GET_DB_LABELS
import { FETCH_RESULT_FROM_OBJECT_FOR_SEARCH, GET_DB_LABELS_BY_STOCKET } from '../../../store/types'
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
      guid: '',
      relationList: [],
      tagList: [],
      testList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      flag: false
    }
  },
  computed: {
    ...mapState({
      relationListRes: state => state.analysisRelation.ListForResultFromObjectForSearch.relationList,
      tagsByStocket: state => state.search.DbLabelsByStocket
    })
  },
  methods: {
    handlePrimaryClick(idCard, marker, type) {
      if(marker) {
        return
      }
      // this.$emit('on-primary-click', idCard !== null ? idCard : this.data.primary)
      this.$emit('on-primary-click', idCard, type)
    },
    socketConnected() {}
  },
  created() {
    if(this.data.primary) {
      this.dispatch(FETCH_RESULT_FROM_OBJECT_FOR_SEARCH, { keyword: this.data.primary, type: '4' }).then(() => {
        if(this.relationListRes && this.relationListRes.length > 0) {
          this.relationList = [...this.relationListRes.filter(d => d.endlabels[0] === 't_zt_ryjbqk')]
        }
      })
    }
    this.guid = Date.parse(new Date()) + '_' + this.data.primary
    if(this.guid && this.data.primary) {
      this.$connect.on('GetDbLabels', res => {
        if(res.NotifyId === this.guid && res.Source) {
          this.tagList = res.Source
          // IsCustomLable 自定义标签 (蓝) 默认(绿)
          // IsSysLabel 系统标签
        }
      })
      this.dispatch(GET_DB_LABELS_BY_STOCKET, { Keyword: this.data.primary, NotifyId: this.guid }, undefined, true, true)
    }
  }
}
</script>
