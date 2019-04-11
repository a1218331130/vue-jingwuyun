<template>
<!-- 轨迹基本分析 -->
<!-- 本页套数据 -->
<div class="tel-list" id="locusBasic">
  <el-row class="el-row analysis-topbar">
    <!-- <el-col :span="20">
      <div class="tabs">
        <div :class="{'tabs__item':true,'current':currentTab===i}" v-for="(item,i) in tabs" :title="item.keyVal" @click="currentTab=i" v-if="item.keyVal">
          {{item.keyVal}}
          <span v-show="item.name">[{{item.name}}]</span>
          <i class="iconfont icon-close" @click.stop="removeItem(item)"></i>
        </div>
      </div>
    </el-col> -->
    <el-col :span="20">
      <el-tabs v-model="activeTab" :closable="true" @tab-remove="removeItem" @tab-click="tabPaneChange">
        <el-tab-pane v-for="(item,i) in tabs" :name="`${item.keyVal}|${item.name}`" :key="i" :label="`${item.keyVal}[${item.name}]`">
        </el-tab-pane>
      </el-tabs>
    </el-col>
    <el-col :span="4" class="collap-col">
      <div class="collap-box pointer">
        <slot name="switchRightBarBtn"></slot>
      </div>
    </el-col>
  </el-row>

  <div class="tabs-box">
    <div class="tabs-box__item" v-for="(item,i) in tabs" v-show="i===currentTab && item.keyVal">
      <!--查询框-->
      <searchBox>
        <div slot="formBox">
          <el-form :model="item.queryForm" :inline="true" label-position="right" label-width="90px">
            <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query" style="position:relative;left:10px;top:0">分析</el-button>
            <el-form-item label="时间段">
              <!-- <el-date-picker type="daterange" v-model="item.queryForm.timeSlot" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm, val?val:'')" placeholder="请选择" format="yyyy-MM-dd"></el-date-picker> -->
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="timeOptions" @change="val=>updateTimeSlot(item.queryForm, val?val:'')" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <el-form-item label="同住次数">
              <el-input-number v-model="item.queryForm.cohabitCount" size="small" :min="1" :max="24" class="small"></el-input-number>
            </el-form-item>
            <!-- <el-form-item label="资源列表" v-if="activeName === 'time' || activeName === 'list'">
              <el-select v-model="item.queryForm.resList" multiple placeholder="请选择" :style="{width: num + 'px'}">
                <el-option v-for=" item in resourceList " :label="item.label " :value="item.value " :key="item.value "></el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="身份证号码">
              <el-input v-model="item.queryForm.addItem.keyVal" class="normal"></el-input>
            </el-form-item> -->
          </el-form>
        </div>
      </searchBox>

      <!--内容区-->
      <div class="app-content-box" v-show="item.queryForm.basicBox===true">
        <el-tabs class="basic-tabs" type="border-card" v-model="activeName" @tab-click="tabChange">
          <el-tab-pane label="基本统计" name="basic" v-loading="item.queryForm.staticLoading">
            <echarts :option="item.queryForm.barData" style="width:100%;height: 180px;"></echarts>
            <!--列表-->
            <el-collapse class="tablelist" v-model="activeNames" @change="showInfo" style="margin:40px 0">
              <!--同行人-->
              <el-collapse-item name="d0" v-loading="item.queryForm.loadingArr.d0">
                <template slot="title">
                  同行人 ({{item.queryForm.detailCountArr.tx}}条结果)
                </template>
<template>
                  <list :list="item.queryForm.tableData.d0" :tab="txList" :pagenav="item.queryForm.basicList.d0.pageInfo"></list>
                  <!--分页器-->
                  <div class="block">
                    <pagination :count="item.queryForm.basicList.d0.pageInfo.count" :pagenav="{limit: item.queryForm.basicList.d0.pageInfo.limit,currentpage:item.queryForm.basicList.d0.pageInfo.currentpage}" @update:pagenav="pageChange" style="text-align:right;margin-top:10px"></pagination>
                  </div>

                </template>
</el-collapse-item>
<!--同住人-->
<el-collapse-item name="d1" v-loading="item.queryForm.loadingArr.d1">
  <template slot="title">
                  同住人 ({{item.queryForm.detailCountArr.tz}}条结果)
                </template>
  <template>
                  <list :list="item.queryForm.tableData.d1" :tab="tzList" :pagenav="item.queryForm.basicList.d1.pageInfo"></list>
                  <!--分页器-->
                  <div class="block">
                    <pagination :count="item.queryForm.basicList.d1.pageInfo.count" :pagenav="{limit: item.queryForm.basicList.d1.pageInfo.limit,currentpage:item.queryForm.basicList.d1.pageInfo.currentpage}" @update:pagenav="pageChange" style="text-align:right;margin-top:10px"></pagination>
                  </div>

                </template>

</el-collapse-item>
<!--可能同居地-->
<el-collapse-item name="d2" v-loading="item.queryForm.loadingArr.d2">
  <template slot="title">
                  可能居住地 ({{item.queryForm.detailCountArr.jzd}}条结果)
                </template>
  <template>
                  <list :list="item.queryForm.tableData.d2" :tab="houseList" :pagenav="item.queryForm.basicList.d2.pageInfo"></list>
                  <!--分页器-->
                  <div class="block">
                    <pagination :count="item.queryForm.basicList.d2.pageInfo.count" :pagenav="{limit: item.queryForm.basicList.d2.pageInfo.limit,currentpage:item.queryForm.basicList.d2.pageInfo.currentpage}" @update:pagenav="pageChange" style="text-align:right;margin-top:10px"></pagination>
                  </div>

                </template>
</el-collapse-item>
<!--可能工作地点-->
<el-collapse-item name="d3" v-loading="item.queryForm.loadingArr.d3">
  <template slot="title">
                  可能工作地点 ({{item.queryForm.detailCountArr.work}}条结果)
                </template>
  <template>
                  <list :list="item.queryForm.tableData.d3" :tab="workList" :pagenav="item.queryForm.basicList.d3.pageInfo"></list>
                  <!--分页器-->
                  <div class="block">
                    <pagination :count="item.queryForm.basicList.d3.pageInfo.count" :pagenav="{limit: item.queryForm.basicList.d3.pageInfo.limit,currentpage:item.queryForm.basicList.d3.pageInfo.currentpage}" @update:pagenav="pageChange" style="text-align:right;margin-top:10px"></pagination>
                  </div>

                </template>
</el-collapse-item>
<!--常去城市-->
<el-collapse-item name="d4" v-loading="item.queryForm.loadingArr.d4">
  <template slot="title">
                  常去城市 ({{item.queryForm.detailCountArr.city}}条结果)
                </template>
  <template>
                  <list :list="item.queryForm.tableData.d4" :tab="cityList" :pagenav="item.queryForm.basicList.d4.pageInfo"></list>
                  <!--分页器-->
                  <div class="block">
                    <pagination :count="item.queryForm.basicList.d4.pageInfo.count" :pagenav="{limit: item.queryForm.basicList.d4.pageInfo.limit,currentpage:item.queryForm.basicList.d4.pageInfo.currentpage}" @update:pagenav="pageChange" style="text-align:right;margin-top:10px"></pagination>
                  </div>
                </template>
</el-collapse-item>
<!--常去酒店-->
<el-collapse-item name="d5" v-loading="item.queryForm.loadingArr.d5">
  <template slot="title">
                  常去酒店 ({{item.queryForm.detailCountArr.hotel}}条结果)
                </template>
  <template>
                  <list :list="item.queryForm.tableData.d5" :tab="hotelList" :pagenav="item.queryForm.basicList.d5.pageInfo"></list>
                  <!--分页器-->
                  <div class="block">
                    <pagination :count="item.queryForm.basicList.d5.pageInfo.count" :pagenav="{limit: item.queryForm.basicList.d5.pageInfo.limit,currentpage:item.queryForm.basicList.d5.pageInfo.currentpage}" @update:pagenav="pageChange" style="text-align:right;margin-top:10px"></pagination>
                  </div>
                </template>
</el-collapse-item>
</el-collapse>
</el-tab-pane>
<el-tab-pane label="轨迹时间轴" class="timeLine" name="time" v-loading="item.queryForm.twoLoading">
  <div class="time-wrapper" style="width:100%;overflow-x:hidden;overflow-y:scorll">
    <el-checkbox-group v-model="item.queryForm.resList" @change="fetchTimeData" size="small" style="display:inline-block;">
      <el-checkbox-button v-for="(elem,index) in resourceList" :key="index" :label="elem.value">{{elem.text}}</el-checkbox-button>
    </el-checkbox-group>
    <div class="time-data" style="text-align:center;line-height:180px;color:#999" v-show="item.queryForm.locusData.length === 0">
      暂无数据
    </div>
    <section id="cd-timeline" class="cd-container" v-show="item.queryForm.locusData.length !== 0">
      <div class="linetop">
        <span class="linetop__title">轨迹跟踪</span>
      </div>
      <div>
        <div class="cd-timeline-block" v-for="(elem,i) in item.queryForm.locusData" :key="i">
          <div class="cd-timeline-img cd-picture">
            <!-- <img src="img/cd-icon-picture.svg" alt="Picture"> -->
            <i v-if="elem.gjlxdm==='wb'" class="icon iconfont icon-wangba" style="font-size: 22px;color:white;position: relative;    left:4px;top:5px;"></i>
            <i v-if="elem.gjlxdm==='银行交易'" class="icon iconfont icon-zhangdan" style="font-size: 22px;color:white;position: relative;left:4px;top:5px;"></i>
            <i v-if="elem.gjlxdm==='ly'" class="icon iconfont icon-jiudian" style="font-size: 22px;color:white;position: relative;left:4px;top:5px;"></i>
            <i v-if="elem.gjlxdm==='hb'" class="icon iconfont icon-hangkongyunshu" style="font-size: 22px;color:white;position: relative;left:4px;top:5px;"></i>
            <i v-if="elem.gjlxdm==='tl'" class="icon iconfont icon-huoche" style="font-size: 22px;color:white;position: relative;left:4px;top:5px;"></i>
          </div>
          <div class="cd-timeline-content">
            <div class="data-box-right">
              <p style="font-weight:400;font-size:13px;margin-left:10px;color: #596C8A;">日期时间：{{elem.kssj}}</p>
              <p style="color:#4ab7ff;font-size:13px;margin-left:10px">内容描述：{{elem.xm}}
                <span style="color:#555">{{elem.gjms}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="timeline-end" style="text-align: center;margin-top: 66px;color: #ccc;">
      </div>
    </section>
  </div>
  <!-- <echarts style="width: 100%;height: 180px;"></echarts> -->
</el-tab-pane>
<el-tab-pane label="轨迹列表" name="list" v-loading="item.queryForm.threeLoading">
  <!--<list :list="item.queryForm.locusData" :tab="gjList" :pagenav="item.queryForm.pageInfo"></list> -->
  <el-table :data="item.queryForm.locusData" border stripe style="100%">
    <el-table-column type="index" label="序号" width="50" align="center">
      <template scope="scope">
        {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
      </template>
    </el-table-column>
    <el-table-column prop="zjhm" label="证件号码" width="200" align="center"></el-table-column>
    <el-table-column prop="xm" label="姓名" width="150" align="center"></el-table-column>
    <el-table-column prop="kssj" label="时间" width="260" align="center"></el-table-column>
    <el-table-column prop="gjms" label="轨迹描述" width="680" align="center"></el-table-column>
    <el-table-column prop="xxlyms" label="数据来源" width="320" align="center"></el-table-column>
  </el-table>
  <i :class="[showAlert ? 'el-icon-arrow-up' : 'el-icon-arrow-down','arrow-down']" @click="showAlert = !showAlert"></i>
  <transition name="el-zoom-in-top">
    <div class="alert" v-show="showAlert">
      <div class="alert-cont">
        <div class="alert-cont-group">
          <el-checkbox-group v-model="item.queryForm.resList" size="small" style="display:block;">
            <el-checkbox style="display:block; margin: 0px 0 5px" v-for="(elem,index) in resourceList" :key="index" :label="elem.value">{{elem.text}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="alert-cont-btn">
          <el-button style="border:0px;" @click="fetchTimeData">筛选</el-button>
          <el-button style="border:0px;" @click="reset">重置</el-button>
        </div>
      </div>
    </div>
  </transition>
</el-tab-pane>
<!--分页器-->
<div class="block" v-if="activeName === 'basic' || item.queryForm.locusData.length === 0 ? false : true">
  <pagination :count="item.queryForm.pageInfo.count" :pagenav="{limit: item.queryForm.pageInfo.limit,currentpage:item.queryForm.pageInfo.currentpage}" @update:pagenav="pagenavChange" style="text-align:right;margin-top:10px"></pagination>
</div>
</el-tabs>


</div>
</div>
</div>
</div>
</template>
<style lang="scss" scoped>
  .comm {
    .maker {
      background: #fff;
      height: calc(100vh - 205px);
    }
    .overview-box {
      width: 200px;
      height: 100px;
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }

  .tabs-box__item {
    .app-content-box {
      padding: 0;
      overflow: auto;
      height: calc(100vh - 205px);
    }
  }

  .el-tabs__content {
    padding: 0;
  }

  .res-box-list {
    height: 100%;
    border: 1px solid #b3c7e1;
  }

  .res-box-header {
    color: #ff8000;
    padding: 3px;
  }

  .el-tabs {
    margin-bottom: 0;
  }

  .cell {
    text-align: center;
  }

  .el-collapse-item__content {
    padding: 10px 0;
  }

  .arrow-down {
    position: absolute;
    top: 28px;
    right: 40px;
    color: #888
  }

  .alert {
    position: absolute;
    top: 55px;
    right: 25px;
    z-index: 99;
    &-cont {
      width: 130px;
      border: 1px solid #ddd;
      background-color: #fff;
      &-group {
        width: 130px;
        padding: 8px 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-bottom: 1px solid #ddd;
      }
    }
  }

</style>
<!-- 时光轴样式 -->
<style lang="scss" scoped>
  #cd-timeline {
    position: relative;
  }

  #cd-timeline .title-year {
    width: 82px;
    height: 29px;
    background-color: #4ab7ff;
    margin: 10px auto 13px;
    position: relative;
    right: 43px;
    border-radius: 20px 0 0 20px;
    color: white;
    .timeline-left {
      margin-left: 20px;
      color: #fff;
      height: 30px;
      line-height: 30px;
      .caret-l {
        margin-left: 10px;
      }
    }
  }

  #cd-timeline::before {
    /* this is the vertical line */
    content: '';
    position: absolute;
    top: 0;
    left: 18px;
    height: 100%;
    width: 4px;
    background: rgb(74, 183, 255);
  }

  @media only screen and (min-width: 1170px) {
    #cd-timeline {
      margin-bottom: 3em;
      margin-top: 31px;
    }
    #cd-timeline::before {
      left: 50%;
      margin-left: -2px;
    }
  }

  .cd-timeline-block {
    position: relative;
    width: 30px;
    height: 30px;
    margin: 22px auto;
  }

  .cd-timeline-block:after {
    content: "";
    display: table;
    clear: both;
  }

  .cd-timeline-block:first-child {
    // margin-top: 0;
  }

  .cd-timeline-block:last-child {
    // margin-bottom: 0;
  }

  .cd-timeline-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%; // box-shadow: 0 0 0 4px rgb(74, 183, 255), inset 0 2px 0 rgba(0, 0, 0, 0.08), 0 3px 0 4px rgba(0, 0, 0, 0.05);
    z-index: 1;
  }

  .cd-timeline-img img {
    display: block;
    width: 24px;
    height: 24px;
    position: relative;
    left: 50%;
    top: 50%;
    margin-left: -12px;
    margin-top: -12px;
  }

  .cd-timeline-img.cd-picture {
    background: #4ab7ff;
  }

  .cd-timeline-img.cd-movie {
    background: #c03b44;
  }

  .cd-timeline-img.cd-location {
    background: #f0ca45;
  }

  @media only screen and (min-width: 1170px) {
    .cd-timeline-img {
      width: 30px;
      height: 30px;
      left: 50%;
      margin-left: -14px;
      /* Force Hardware Acceleration in WebKit */
      -webkit-transform: translateZ(0);
      -webkit-backface-visibility: hidden;
    }
    .cssanimations .cd-timeline-img.is-hidden {
      visibility: hidden;
    }
    .cssanimations .cd-timeline-img.bounce-in {
      visibility: visible;
      -webkit-animation: cd-bounce-1 0.6s;
      -moz-animation: cd-bounce-1 0.6s;
      animation: cd-bounce-1 0.6s;
    }
  }

  .cd-timeline-content {
    position: relative; // margin-left: 60px;
    background: white;
    border-radius: 0.25em; // padding: 1em;
    box-shadow: 0 3px 0 #d7e4ed;
  }

  .cd-timeline-content .data-box {
    width: 70px;
    height: 70px;
    float: right;
    border-right: 1px solid #4ab7ff;
    border-left: 1px solid #4ab7ff;
    color: #4ab7ff;
    line-height: 70px;
    text-align: center;
  }

  .cd-timeline-content:after {
    content: "";
    display: table;
    clear: both;
  }

  .cd-timeline-content h2 {
    margin: 0;
    color: #303e49;
    font-size: 13px;
  }

  .cd-timeline-content .cd-date,
  .cd-timeline-content .cd-read-more,
  .cd-timeline-content p {
    font-size: 12px;
    font-size: 0.8125rem;
  }

  .cd-timeline-content .cd-date,
  .cd-timeline-content .cd-read-more {
    display: inline-block;
  }

  .cd-timeline-content p {
    margin: 0.1em 0;
    padding: 6px;
    line-height: 1.6;
    font-size: 13px;
  }

  .cd-timeline-content .cd-read-more {
    float: right;
    padding: 0.8em 1em;
    background: #acb7c0;
    color: white;
    border-radius: 0.25em;
  }

  .no-touch .cd-timeline-content .cd-read-more:hover {
    background-color: #bac4cb;
  }

  a.cd-read-more:hover {
    text-decoration: none;
    background-color: #424242;
  }

  .cd-timeline-content .cd-date {
    float: left;
    padding: 0.8em 0;
    opacity: 0.7;
  }

  .cd-timeline-content::before {
    content: '';
    position: absolute;
    top: 16px;
    right: 100%;
    height: 0;
    width: 0;
    border: 7px solid transparent;
    border-right: 7px solid white;
  }

  @media only screen and (min-width: 768px) {
    .cd-timeline-content h2 {
      font-size: 20px;
      font-size: 1.25rem;
    }
    .cd-timeline-content p {
      font-size: 16px;
      font-size: 1rem;
    }
    .cd-timeline-content .cd-date,
    .cd-timeline-content .cd-read-more {
      font-size: 14px;
      font-size: 0.875rem;
    }
  }

  @media only screen and (min-width: 1170px) {
    .cd-timeline-content {
      width: 500px;
      border: 1px solid #4ab7ff;
      position: absolute;
      left: calc(-500px + 13px);
      top: 50%;
      transform: translateY(-50%);
    }
    .cd-timeline-content::before {
      top: 24px;
      left: 100%;
      border-color: transparent; // border-left-color: #4ab7ff;
    }
    .cd-timeline-content .cd-read-more {
      float: left;
    }
    .cd-timeline-content .cd-date {
      position: absolute;
      width: 100%;
      left: 122%;
      top: 6px;
      font-size: 16px;
      font-size: 1rem;
    }
    .cd-timeline-block:nth-child(even) .cd-timeline-content {
      right: calc(-500px + 13px);
      left: inherit;
      top: 50%;
      transform: translateY(-50%);
    }
    .cd-timeline-block:nth-child(even) .cd-timeline-content .data-box {
      margin-right: 20px;
      float: left;
    }
    .cd-timeline-block:nth-child(even) .cd-timeline-content::before {
      top: 24px;
      left: auto;
      right: 100%;
      border-color: transparent; // border-right-color: #4ab7ff;
    }
    .cd-timeline-block:nth-child(even) .cd-timeline-content .cd-read-more {
      float: right;
    }
    .cd-timeline-block:nth-child(even) .cd-timeline-content .cd-date {
      left: auto;
      right: 122%;
      text-align: right;
    }
    .cssanimations {
      .cd-timeline-content {
        &.is-hidden {
          visibility: hidden;
        }
        &.bounce-in {
          visibility: visible;
          -webkit-animation: cd-bounce-2 0.6s;
          -moz-animation: cd-bounce-2 0.6s;
          animation: cd-bounce-2 0.6s;
        }
      }
    }
  }

  .linetop {
    margin: 0 auto;
    width: 135px;
    height: 36px;
    background-color: #ff5e06;
    position: relative;
    top: -31px;
    border-radius: 8px;
    &__title {
      display: inline-block;
      height: 36px;
      width: 135px;
      line-height: 36px;
      color: #fff;
      font-size: 14px;
      text-align: center;
    }
    &:before {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-10px);
      height: 0;
      width: 0;
      border: 20px solid transparent;
      border-top: 20px solid #ff5e06;
    }
    &:after {
      content: '';
      position: absolute;
      top: 120%;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      height: 12px;
      width: 12px;
      border-radius: 50%;
      background-color: #ff5e06;
      border-top: 2px solid white;
      border-bottom: 3px solid white;
      margin: 2px 0;
    }
  }

  .block {
    padding-top: 15px;
  }

</style>
<style lang="scss">
  #locusBasic {
    .basic-tabs.el-tabs--border-card>.el-tabs__content {
      height: calc(100vh - 290px);
    }
  }

  .el-table--hidden {
    visibility: visible;
  }

</style>
<script>
  // fetchAnalyzeBasicTimeData
  import {
    FETCH_LOCUS_BASE_ANALYZE,
    FETCH_LOCUS_BASE_ANALYZE_DETAIL,
    FETCH_ANALYZE_BASIC_TIME_DATA,
    // fetchDetailCount
    FETCH_DETAIL_COUNT
  } from '../../../../store/types'
  // import timeLine from '../../../dossier/people/modules/time_line.vue'
  import locusMixin from '../locusMinxin'
  import echarts from '../../../../widgets/echarts'
  import echartsDetails from '../../../../widgets/echarts/echart-details'
  import searchBox from '../../search-tool'
  // import timeLine from './timeLine'
  import { clone } from '../../../../utils/util'
  import chartsOps from '../../../../utils/echartsOptions/all'
  import list from '../list'
  import pagination from '../../../../widgets/pagination/pagination.vue'
  export default {
    mixins: [locusMixin, chartsOps],
    components: {
      searchBox,
      echarts,
      echartsDetails,
      list,
      pagination
    },
    data() {
      return {
        showAlert: false,
        activeTab: '',
        commName: 'basic',
        activeName: 'basic',
        tabName: 'd0',
        pageInfo: { // 页面分页信息相关配置 默认限制每页十条
          count: 10,
          limit: 10,
          currentpage: 1
        },
        activeNames: '1',
        currentPage3: 1,
        cohabit: 1,
        radarmax: 0,
        showInfoList: [],
        detailBox: false,
        table: {
          columns: [],
          data: []
        },
        total: 30,
        staticLoading: null, // 基本轨迹加载
        loadingArr: [false, false, false, false, false, false],
        checkList: ['hd', 'hb', 'gt', 'gakk', 'crj', 'ly'],
        resourceList: [
          { text: '话单信息', value: 'hd' },
          { text: '航班信息', value: 'hb' },
          { text: '高铁信息', value: 'gt' },
          { text: '公安卡口信息', value: 'gakk' },
          { text: '出入境信息', value: 'crj' },
          { text: '旅业信息', value: 'ly' }
        ],
        txList: [ // 同行人
          { prop: 'fxrxm', label: '姓名' },
          { prop: 'fxrzjhm', label: '证件号码' },
          { prop: 'xm', label: '同行人姓名' },
          { prop: 'zjhm', label: '同行人证件号码' },
          { prop: 'cfz', label: '出发站' },
          { prop: 'ddz', label: '到达站' },
          { prop: 'ttype', label: '出行方式' },
          { prop: 'txbh', label: '班次' }
        ],
        tzList: [ // 同住人
          { prop: 'fxrxm', label: '姓名' },
          { prop: 'fxrzjhm', label: '证件号码' },
          { prop: 'xm', label: '同住人姓名' },
          { prop: 'zjhm', label: '同住人证件号码' },
          { prop: 'lgbm', label: '旅馆编号' },
          { prop: 'ldmc', label: '旅馆名称' },
          { prop: 'rzfh', label: '房号' },
          { prop: 'rzsj', label: '入住时间' },
          { prop: 'tfsj', label: '退房时间' }
        ],
        houseList: [ // 可能居住地
          { prop: 'xm', label: '姓名' },
          { prop: 'zjhm', label: '证件号码' },
          { prop: 'thsj', label: '通话时间' },
          { prop: 'thdd', label: '通话地点' },
          { prop: 'thsc', label: '通话时长' }
        ],
        workList: [ // 可能工作地
          { prop: 'xm', label: '姓名' },
          { prop: 'zjhm', label: '证件号码' },
          { prop: 'thsj', label: '通话时间' },
          { prop: 'thdd', label: '通话地点' },
          { prop: 'thsc', label: '通话时长' }
        ],
        cityList: [ // 常去城市
          { prop: 'xm', label: '姓名' },
          { prop: 'zjhm', label: '证件号码' },
          { prop: 'dz', label: '到达站' },
          { prop: 'cnt', label: '次数' }
        ],
        hotelList: [ // 常去酒店
          { prop: 'xm', label: '姓名' },
          { prop: 'zjhm', label: '证件号码' },
          { prop: 'ldmc', label: '酒店名称' },
          { prop: 'lddz', label: '酒店地址' },
          { prop: 'cnt', label: '次数' }
        ],
        gjList: [ // 轨迹列表
          { prop: 'zjhm', label: '证件号码' },
          { prop: 'xm', label: '姓名' },
          { prop: 'kssj', label: '时间' },
          { prop: 'gjms', label: '轨迹描述' },
          { prop: 'xxlyms', label: '数据来源' }
        ],
        timeflag: false,
        locusData: [],
        timeOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date(),
                start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近30天', // '最近一个月',
            onClick(picker) {
              const end = new Date(),
                start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近60天', // '最近两个月',
            onClick(picker) {
              const end = new Date(),
                start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近90天', // '最近三个月',
            onClick(picker) {
              const end = new Date(),
                start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近半年',
            onClick(picker) {
              const end = new Date(),
                start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一年',
            onClick(picker) {
              const end = new Date(),
                start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    props: [],
    computed: {},
    watch: {
      tabs(val) {
        this.$emit('on-change-tableData', val)
        if (val.length > 0) {
          let item = val[val.length - 1]
          this.activeTab = `${item.keyVal}|${item.name}`
        }
      }
    },
    methods: {
      pagenavChange(obj) {
        let target = this.tabs[this.currentTab].queryForm
        target.pageInfo.limit = obj.limit
        target.pageInfo.currentpage = obj.currentpage
        this.fetchTimeData()
      },
      pageChange(obj) {
        let target = this.tabs[this.currentTab].queryForm,
          val = this.tabName[this.tabName.length - 1]
        target.basicList[val].pageInfo.limit = obj.limit
        target.basicList[val].pageInfo.currentpage = obj.currentpage
        this.pagequery(val)
      },
      // 查询
      query() {
        if (this.activeName === 'basic') {
          if (this.tabs[this.currentTab].queryForm.timeSlot.length < 2) {
            this.$alert('时间段不能为空', '温馨提示')
            return false
          }
          this.init()
          this.fetchMainList()
        } else {
          this.fetchTimeData()
        }
      },
      // 初始化
      init() {
        let target = this.tabs[this.currentTab]
        this.activeName = 'basic'
        this.timeflag = false
        target.queryForm.showInfoList = []
        target.queryForm.locusData = []
        target.queryForm.resList = this.checkList;
      },
      // 查询
      fetchMainList() {
        let target = this.tabs[this.currentTab],
          queryForm = this.delEmpey({
            zjhm: target.keyVal, //  身份证号码
            kssj: target.queryForm.timeSlot[0].split('-').join('') || '',
            jssj: target.queryForm.timeSlot[1].split('-').join('') || '',
            sjpy: target.queryForm.cohabitCount
          })
        target.queryForm.basicBox = true
        target.queryForm.staticLoading = true
        this.dispatch(FETCH_LOCUS_BASE_ANALYZE, queryForm).then(() => {
          // 获取数据（折线图）
          var listArr = [
            this.analysisLocus.baseAnalyze.total1,
            this.analysisLocus.baseAnalyze.total2,
            this.analysisLocus.baseAnalyze.total3,
            this.analysisLocus.baseAnalyze.total4,
            this.analysisLocus.baseAnalyze.total5,
            this.analysisLocus.baseAnalyze.total6
          ]
          target.queryForm.barData = clone(this.echartsBarOptions.stack)
          target.queryForm.barData.xAxis.data = ['话单信息', '航班信息', '高铁信息', '公安卡口信息', '出入境信息', '旅业信息']
          var AreaTemp = [{
            name: '次数',
            type: 'bar',
            barWidth: 150,
            stack: '月份',
            data: listArr
          }];
          target.queryForm.barData.grid = {
            left: '0',
            right: '0',
            bottom: '20',
            containLabel: true
          }
          target.queryForm.barData.series = AreaTemp
          this.staticLoading = false
          target.queryForm.staticLoading = false
        })
        // 查询总条数
        this.dispatch(FETCH_DETAIL_COUNT, queryForm).then(() => {
          target.queryForm.detailCountArr = this.analysisLocus.detailCount[0]
        })
      }, // 轨迹基本查询
      fetchTimeData() {
        this.showAlert = false
        let target = this.tabs[this.currentTab]
        if (Number(target.queryForm.resList.length) === 0) {
          target.queryForm.locusData = []
          return false
        } else {
          let queryForm = {
            'PageIndex': target.queryForm.pageInfo.currentpage,
            'PageSize': target.queryForm.pageInfo.limit,
            'kssj': target.queryForm.timeSlot[0].split('-').join('') || '',
            'jssj': target.queryForm.timeSlot[1].split('-').join('') || '',
            'zjhm': target.keyVal,
            'zylx': target.queryForm.resList.toString()
          }
          target.queryForm.twoLoading = true
          target.queryForm.threeLoading = true
          this.dispatch(FETCH_ANALYZE_BASIC_TIME_DATA, queryForm).then(() => {
            let res = this.analysisLocus.TimeData
            target.queryForm.locusData = res.PageData
            target.queryForm.pageInfo.count = res.DataCount
            this.timeflag = true
            target.queryForm.twoLoading = false
            target.queryForm.threeLoading = false
          })
        }
      },
      reset() {
        let target = this.tabs[this.currentTab]
        target.queryForm.resList = []
      },
      loadData(page = 1, limit = 10) {
        this.dispatch(null, { query: { page, limit, ...this.searchKeys } })
      },
      handlePageChange(page) {
        this.loadData(page, this.role.limit)
      },
      handleSizeChange(size) {
        this.loadData(1, size)
      },
      handleChange() {},
      handleCurrentChange(index) {},
      showInfo(obj) {
        this.tabName = obj
        let val = obj[obj.length - 1],
          target = this.tabs[this.currentTab],
          queryForm = this.delEmpey({
            zjhm: target.keyVal, //  身份证号码
            kssj: target.queryForm.timeSlot[0].split('-').join('') || '',
            jssj: target.queryForm.timeSlot[1].split('-').join('') || '',
            sjpy: target.queryForm.cohabitCount,
            PageIndex: 1, // target.queryForm.basicList[val].pageInfo.currentpage,
            PageSize: 10, // target.queryForm.basicList[val].pageInfo.limit,
            type: val
          })
        if (!val || target.queryForm.showInfoList.indexOf(val) !== -1 || val === '1') {
          return false
        }
        target.queryForm.loadingArr[val] = true
        this.dispatch(FETCH_LOCUS_BASE_ANALYZE_DETAIL, queryForm)
          .then(() => {
            let res = this.analysisLocus.baseAnalyzeDetail
            target.queryForm.tableData[val] = res.PageData
            target.queryForm.basicList[val].pageInfo.count = res.DataCount
            target.queryForm.loadingArr[val] = false
            target.queryForm.showInfoList.push(val)
          })
      },
      pagequery(val) {
        let target = this.tabs[this.currentTab],
          queryForm = this.delEmpey({
            zjhm: target.keyVal, //  身份证号码
            kssj: target.queryForm.timeSlot[0].split('-').join('') || '',
            jssj: target.queryForm.timeSlot[1].split('-').join('') || '',
            sjpy: target.queryForm.cohabitCount,
            PageIndex: target.queryForm.basicList[val].pageInfo.currentpage,
            PageSize: target.queryForm.basicList[val].pageInfo.limit,
            type: val
          })
        target.queryForm.loadingArr[val] = true
        this.dispatch(FETCH_LOCUS_BASE_ANALYZE_DETAIL, queryForm)
          .then(() => {
            let res = this.analysisLocus.baseAnalyzeDetail
            target.queryForm.tableData[val] = res.PageData
            target.queryForm.basicList[val].pageInfo.count = res.DataCount
            target.queryForm.loadingArr[val] = false
            target.queryForm.showInfoList.push(val)
          })
      },
      tabChange(tab, event) {
        let target = this.tabs[this.currentTab]
        if (tab.name !== 'basic' && !this.timeflag) {
          this.fetchTimeData()
        }
        if (tab.name === 'list' && target.queryForm.twoLoading === true) {
          target.queryForm.threeLoading = true
        } else {
          target.queryForm.threeLoading = false
        }
      },
      // 移除tab
      removeItem(item) {
        let arr = item.split('|')
        if (arr[1] === '手动输入') {
          this.tabs = this.tabs.filter(d => d.keyVal !== arr[0])
          return
        }
        this.removeTab(item)
      },
      // 标签页改变
      tabPaneChange(tab) {
        this.currentTab = parseInt(tab.index)
      }
    },
    created() {},
    mounted() {}
  }

</script>
