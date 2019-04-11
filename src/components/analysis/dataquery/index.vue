<template>
<el-layout class="app-layout" :fit="true" style="overflow: hidden;min-height:600px">
  <!-- 通顶 -->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar>
      <div slot="search">
        <span class="sub-title">数据查询</span>
        <div class="search-input" @keyup.13="search()">
          <el-input v-model="inputValue" style="width:446px">
            <el-select v-model="selectVal" slot="prepend" placeholder="请选择">
              <el-option v-for="(ele,i) in selectArr" :key="i" :label="ele.label" :value="ele.value"></el-option>
            </el-select>
            <el-button slot="append" icon="search" @click="search()" class="search-btn" style="width:72px;padding-right:15px;"></el-button>
          </el-input>
        </div>
      </div>
    </top-bar>
  </el-region>
  <!-- 内容 -->
  <el-region class="app-center" slot="center" type="center" style="overflow: hidden">
    <div style="height:calc(100vh - 100px)">
      <!-- 查询信息栏 -->
      <!-- <el-row class="search-function">
        <el-col :span="12">
          <div class="result-summary">
            关键字：
            <span>
              <span class="keyword">夏文律<i class="iconfont icon-close" title="移除"></i></span>
            </span>
            命中：
            <span>{{total}}</span>
            用时：
            <span>{{queryTime?queryTime+'秒':''}}</span>
          </div>
        </el-col>
      </el-row> -->
      <!-- 查询内容区 -->
      <div class="result-list" ref="list">
        <div class="result-info">
          <div class="person" v-show="showType==='1'">
            <el-col class="result-list-content" :span="12">
              <permanent-item ref="permanent" :searchVal="searchPerson" @update-search-tip="changeTipWord"></permanent-item>
            </el-col>
            <el-col class="result-list-content" :span="12">
              <driver-item ref="driver" :searchVal="searchPerson" @update-search-tip="changeTipWord"></driver-item>
            </el-col>
            <el-col class="result-list-content" :span="12">
              <constable-item ref="constable" :searchVal="searchPerson" @update-search-tip="changeTipWord"></constable-item>
            </el-col>
            <el-col class="result-list-content" :span="12">
              <drug-item ref="drug" :searchVal="searchPerson" @update-search-tip="changeTipWord"></drug-item>
            </el-col>
            <el-col class="result-list-content" :span="12">
              <escape-item ref="escape" :searchVal="searchPerson" @update-search-tip="changeTipWord"></escape-item>
            </el-col>
            <el-col class="result-list-content" :span="12">
              <crime-item ref="crime" :searchVal="searchPerson" @update-search-tip="changeTipWord"></crime-item>
            </el-col>
          </div>
          <div class="car" v-show="showType==='2'">
            <car-item :searchVal="searchCar" @update-search-tip="changeTipWord"></car-item>
          </div>
        </div>
        <!-- 结果为空 -->
        <div class="empty empty--tips" v-if="!showType">
          <span>请输入关键字进行搜索</span>
        </div>
        <div class="empty empty--tips" v-if="searchTip">
          <span>暂无符合“{{inputValue}}”的数据，请更换关键字搜索。</span>
        </div>
        <!-- 加载动画 -->
        <div :class="{'el-loading-mask':true,'action':loading}" v-show="loading">
          <div class="el-loading-spinner loader--circular">
            <svg viewBox="25 25 50 50" class="circular">
                <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
              </svg>
          </div>
        </div>
      </div>
    </div>
  </el-region>
</el-layout>
</template>

<style lang="scss" scoped>
.search-input {
    display: inline-block;
    vertical-align: top;
    padding-top: 10px;
    padding-left: 20px;
}

.search-type {
    margin: 0 15px;
}

.search-function {
    background: #fff;
    border-bottom: 1px solid #ccc;
}

.result-summary {
    padding-left: 15px;
    height: 40px;
    line-height: 40px;
    .keyword {
        margin-right: 0;
        .iconfont {
            visibility: hidden;
            color: #8391a5;
        }
        &:hover {
            .iconfont {
                visibility: visible;
            }
        }
    }
}

.result-summary span {
    color: orangered;
    margin-right: 20px;
}

.search-tools {
    text-align: right;
    padding-right: 15px;
    padding-top: 4px;
}

.search-tools .el-input {
    margin-right: 10px;
}

.search-tools .iconfont {
    font-size: 14px;
}

.result-list {
    padding-right: 10px;
    height: calc(100vh - 60px);
    overflow: auto;
    .person {
        overflow: hidden;
        padding-bottom: 10px;
    }
}
.result-list-content {
    &:after {
        content: '';
        height: 0;
        line-height: 0;
        display: block;
        visibility: hidden;
        clear: both;
    }
    &:nth-child(even) {
        &:after {
            content: '';
            height: 0;
            line-height: 0;
            display: block;
            visibility: hidden;
            clear: both;
        }
    }
}
</style>
<style lang="scss" scoped>
.el-form--inline .el-form-item__label {
    padding-right: 4px;
}

.result-wd .el-form-item__label {
    font-size: 12px;
}

.result-wd .el-form-item__content {
    font-size: 12px;
}
.el-form-item__content {
    line-height: 30px;
}

.el-form-item__content span {
    line-height: 30px;
    color: #333;
}
.el-input__inner {
    height: 36px;
}
.el-tabs__item {
    width: 120px;
    text-align: center;
}
.el-tab-pane {
    width: 120px;
}

.el-form-item__label {
    padding: 0;
    line-height: 30px;
}
// 隔行变色
.result-item.changeColor {
    background-color: #f4f9fd;
}
</style>

<script>
// import { mapState } from 'vuex'
import TopBar from '../../common/topbar/index.vue'
import XdhScroll from '../../../widgets/xdh-scroll'
import mixin from '../../../utils/mixin'
import permanentItem from './data-item/permanent-item.vue' // 常住人口
import constableItem from './data-item/constable-item.vue' // 警员信息
import crimeItem from './data-item/crime-item.vue' // 违法犯罪信息
import drugItem from './data-item/drug-item.vue' // 吸毒贩毒信息
import driverItem from './data-item/driver-item.vue' // 驾驶证信息
import escapeItem from './data-item/escape-item.vue' // 在逃人员信息
import carItem from './data-item/car-item.vue' // 车辆信息

export default {
  components: {
    TopBar,
    XdhScroll,
    permanentItem,
    constableItem,
    crimeItem,
    drugItem,
    driverItem,
    escapeItem,
    carItem
  },
  mixins: [mixin],
  data() {
    return {
      inputValue: '', // 查询关键字
      keyword: '', // 关键字
      showType: '',
      selectArr: [{
        label: '身份证号',
        value: '1'
      }, {
        label: '车牌号码',
        value: '2'
      }], // 选择类型
      selectVal: '1', // 选择值
      searchPerson: '', // 人员搜索值
      searchCar: '', // 车辆搜索值
      searchTip: false // 搜索结果提示
    }
  },
  props: {},
  methods: {
    handleResize() {
      if(this.$refs.list) {
        let rect = this.$refs.list.getBoundingClientRect()
        this.listHeight = rect.height
      }
    },
    search() {
      if(this.selectVal === '1') { // 身份号码搜索
        // 判断是否重复搜索
        if(this.searchPerson === this.inputValue.trim()) {
          this.$message({
            type: 'warning',
            message: '请不要重复搜索',
            showClose: true
          })
          return
        }
        // 身份证正则
        let cP = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[0-9|X|x]$/ // 18位正则
        let cN = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}/ // 15位正则
        if(!(cP.test(this.inputValue.trim()) || cN.test(this.inputValue.trim()))) {
          this.$message({
            type: 'warning',
            message: '请输入正确的身份号码',
            showClose: true
          })
          return
        }
        this.searchPerson = this.inputValue.trim()
      } else { // 车牌号码搜索
        // 判断是否重复搜索
        if(this.searchCar === this.inputValue.trim()) {
          this.$message({
            type: 'warning',
            message: '请不要重复搜索',
            showClose: true
          })
          return
        }
        let cT = /^[京津沪渝冀豫云辽黑湘皖鲁新苏赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
        if(!cT.test(this.inputValue.trim())) {
          this.$message({
            type: 'warning',
            message: '请输入正确的车牌号码',
            showClose: true
          })
          return
        }
        this.searchCar = this.inputValue.trim()
      }
      this.loading = true
      this.searchTip = true
      this.showType = this.selectVal
      // setTimeout(() => {
      //
      // }, 1500)
    },
    changeTipWord(val, tipVal) {
      if(!tipVal) {
        this.searchTip = tipVal
      }
      if(!val) {
        setTimeout(() => {
          this.loading = false
        }, 700)
      }
    }
  },
  watch: {},
  computed: {},
  mounted() {
    this.handleResize()
    window.addEventListener('resize', () => {
      this.handleResize()
    })
  },
  created() {
    window.addEventListener('resize', this.handleResize.bind(this))
  }
}
</script>
