<template>
<!--
  title : 标题
  tool: array  实现数据切换：['今天'，'昨天']
  head: array  表头：['名称', '接警数量', '出警数量']
  list  ['名称', '接警数量', '出警数量']
  column: ['three', 'four'] // 控制三列【{id: 1, name: '四川', value: '435'},】或四列【id: 1, name: '01', alarm: '435', danger: '52%'】
-->
<div :class="{'detail-list':true, small:options.column==='three', fourPlus:options.column==='fourPlus'}">
  <div v-if="options.column==='four'">
    <div class="title-box">
      <!-- <el-button class="title-box__top">TOP</el-button> -->
      <span class="pointer" @click="showList">{{options.title}} <i :class="['pointer',showDetail? 'el-icon-caret-bottom' :'el-icon-caret-top']"></i></span>
    </div>
    <div class="detail-list_item" v-if="showDetail===true">
      <!--<div class="head-list" v-if="options.tool!==null">-->
      <!--<span class="title-item right-border" @click="change(1)">{{options.tool[0]}}</span>-->
      <!--<span class="title-item" @click="change(2)">{{options.tool[1]}}</span>-->
      <!--</div>-->
      <div class="head-list">
        <span class="item1">序号</span>
        <span class="item2">{{options.head[0]}}</span>
        <span class="item3">{{options.head[1]}}</span>
        <span class="item3">{{options.head[2]}}</span>
      </div>
      <div class="list-box">
        <div :id="`echartDetail_${elmId}_${item.id}`" :class="{'item-list':true,'cursor--pointer':needClick===true}" v-for="(item,i) in options.list" @click="clickEvent(item)">
          <span class="item1">{{i+1}}</span>
          <span class="item2" :title="item.name">{{item.name}}</span>
          <span class="item3" v-if="isChange===1">{{item.alarm}}/{{item.alarm2}}</span>
          <span class="item3" v-if="isChange===1">{{item.danger}}%</span>
          <span class="item3" v-if="isChange===2">{{item.alarm2}}</span>
          <span class="item3" v-if="isChange===2">{{item.danger2}}</span>
        </div>
      </div>
    </div>
  </div>
  <div v-if="options.column==='three'">
    <div class="title-box">
      <el-button class="title-box__top">TOP</el-button>
      {{options.title}} <i :class="['pointer',showDetail? 'el-icon-caret-bottom' :'el-icon-caret-top']" @click="showList"></i>
    </div>
    <div class="detail-list_item" v-if="showDetail===true">
      <div class="head-list" v-if="options.tool!==null">
        <span class="title-item right-border" @click="change(1)">{{options.tool[0]}}</span>
        <span class="title-item" @click="change(2)">{{options.tool[1]}}</span>
      </div>
      <div class="head-list">
        <span class="item1">序号</span>
        <span class="item2">{{options.head[0]}}</span>
        <span class="item3">{{options.head[1]}}</span>
      </div>
      <div class="list-box">
        <div class="item-list" v-for="item in options.list">
          <span class="item1">{{item.id}}</span>
          <span class="item2">{{item.name}}</span>
          <span class="item3">{{item.value}}</span>

        </div>
      </div>
    </div>
  </div>
  <div v-if="options.column==='fourPlus'">
    <div class="title-box">
      <el-button class="title-box__top">TOP</el-button>
      <span class="pointer" @click="showList">{{options.title}} <i :class="['pointer',showDetail? 'el-icon-caret-bottom' :'el-icon-caret-top']"></i></span>
    </div>
    <div class="detail-list_item" v-if="showDetail===true">
      <!--<div class="head-list" v-if="options.tool!==null">-->
      <!--<span class="title-item right-border" @click="change(1)">{{options.tool[0]}}</span>-->
      <!--<span class="title-item" @click="change(2)">{{options.tool[1]}}</span>-->
      <!--</div>-->
      <div class="head-list">
        <span class="item1">序号</span>
        <span class="item2">{{options.head[0]}}</span>
        <span class="item3">{{options.head[1]}}</span>
        <span class="item3">{{options.head[2]}}</span>
      </div>
      <div class="list-box">
        <div class="item-list" v-for="item in options.list">
          <span class="item1">{{item.id}}</span>
          <span class="item2">{{item.name}}</span>
          <span class="item3" v-if="isChange===1">{{item.alarm}} / {{item.alarm2}}</span>
          <span class="item3" v-if="isChange===1">{{item.danger}} / {{item.danger2}}</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<style lang="scss" scoped>
// 图表列表详情
.detail-list {
    position: absolute;
    top: 25px;
    /*overflow: hidden;*/
    left: 20px;
    width: 312px;
    /*height: 70%;*/
    z-index: 1;
    .title-box {
        margin-bottom: 15px;
        .title-box__top {
            width: 50px;
            height: 30px;
            text-align: center;
            color: #ffffff;
            background-color: #85c0e9;
            border: none;
            margin-right: 15px;
        }
        i {
            color: #666666;
        }
    }
    .head-list {
        font-size: 0;
        height: 30px;
        margin: 0;
        background-color: transparent;
        border-bottom: 1px solid #ffffff;
        .title-item {
            font-size: 14px;
            display: inline-block;
            height: 30px;
            background-color: #85c0e9;
            width: calc(50% - 4px);
            color: #ffffff;
            line-height: 30px;
            text-align: center;
            cursor: pointer;
            &.right-border {
                border-right: 1px solid #ffffff;
                width: calc(50% - 5px);
            }
        }
        .item1 {
            font-size: 14px;
            height: 30px;
            line-height: 30px;
            color: #ffffff;
            width: 30px;
            border-right: 1px solid #85c0e9;
            background-color: #85c0e9;
            text-align: center;
            display: inline-block;
        }
        .item2 {
            font-size: 14px;
            height: 30px;
            line-height: 30px;
            color: #666666;
            width: 120px;
            background-color: #d7d7d7;
            text-align: center;
            display: inline-block;
            border-right: 1px solid #ffffff;
        }
        .item3 {
            font-size: 14px;
            width: 75px;
            height: 30px;
            line-height: 30px;
            color: #666666;
            background-color: #d7d7d7;
            text-align: center;
            display: inline-block;
            border-right: 1px solid #ffffff;
        }
    }
    .list-box {
        height: auto;
        width: 100%;
        overflow-y: auto;
        .item-list {
            margin: 0;
            font-size: 0;
            height: 30px;
            overflow: hidden;
            border-bottom: 1px solid #ffffff;
            > span {
                font-size: 14px;
                text-align: center;
                height: 30px;
                line-height: 30px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            &.echart-detail__current {
                > span {
                    background: #85c0e9;
                    color: #fff;
                }
            }

            .item1 {
                color: #ffffff;
                width: 30px;
                border-right: 1px solid #429ee3;
                background-color: #429ee3;
                display: inline-block;
            }
            .item2 {
                color: #666666;
                width: 120px;
                background-color: #f2f2f2;
                display: inline-block;
                border-right: 1px solid #ffffff;
            }
            .item3 {
                width: 75px;
                color: #666666;
                background-color: #f2f2f2;
                display: inline-block;
                border-right: 1px solid #ffffff;
            }
            &:nth-child(-n+3) {
                .item1 {
                    background-color: #ff7d7d;
                    border-right: 1px solid #ff7d7d;
                }
            }
            &.head {
                background-color: #d7d7d7;
            }
        }
    }
    &.small {
        width: 236px;
    }
    &.fourPlus {
        width: 372px;
        .head-list {
            .item3 {
                width: 105px;
            }
        }
        .item-list {
            .item3 {
                width: 105px;
            }
        }
    }
    .item-list {
        &.cursor--pointer {
            opacity: 0.8;
            &:hover {
                opacity: 1;
            }
        }
    }
}
</style>
<script>
import mixin from '../../utils/mixin'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      isChange: 1,
      showDetail: true
    }
  },
  props: {
    options: {
      type: Object,
      default: null
    },
    elmId: {
      type: String,
      default: ''
    },
    needClick: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  methods: {
    showList() {
      this.showDetail = !this.showDetail;
    },
    change(val) {
      this.isChange = val
    },
    clickEvent(item) {
      if(this.needClick === true) {
        console.log(this.elmId);
        this.$('.echart-detail__current').removeClass('echart-detail__current')
        this.$(`#echartDetail_${this.elmId}_${item.id}`).addClass('echart-detail__current')
        this.$emit('call:action', item)
      }
    },
    clickFirst() {
      if(this.options.list && this.options.list.length > 0) {
        this.clickEvent(this.options.list[0])
      }
    }
  },
  created() {},
  mounted() {}
}
</script>
