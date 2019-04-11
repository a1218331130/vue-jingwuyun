<template>
<el-layout class="app-layout" :fit="true">
  <!-- 头部导航 -->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar></top-bar>
  </el-region>
  <el-region class="app-center" slot="center" type="center" style="overflow: hidden;">
    <!-- 条件 -->
    <div class="search-condition">
      <el-row :gutter="10">
        <el-col :span="3"></el-col>
        <el-col :span="20" :offset="1">
          <el-alert
          style="position: absolute;
                z-index: 9999;
                width: 800px;
                top: 55px;
                left: 50%;
                margin-left: -400px;"
          :title="'请选择人员后进行时光轴分析'"
          type="info"
          :close-text="'知道了'"
          @close="alertFirstShow = false"
          v-show="form.cardNumber === '' && alertFirstShow">
          </el-alert>
          <el-form v-model="form" :inline="true" label-width="100px">
            <el-row>
              <el-col :span="5">
                <el-form-item prop="dateRange" label-width="100px">
                  <label class="hidden-md-and-down">时间范围:</label>
                  <el-date-picker style="width:200px"  type="daterange" v-model="form.dateRange" range-separator=" / " @change="val=>form.dateRangeVal=val" :picker-options="pickerOptions" placeholder="选择时间范围"
                  :disabled="form.cardNumber === ''"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item prop="keyword"  label-width="75px">
                  <label class="hidden-md-and-down">关键字:</label>
                  <el-input style="width:200px" size="small" v-model="form.keyword" placeholder="请输入关键字" :disabled="form.cardNumber === ''"></el-input>
                </el-form-item>
              </el-col>
              <!--
              <el-col :span="5">
              <el-form-item prop="area" label="区域类型" v-loading="dictLoading===true">
                  <tree-select v-if="areaTree.length>0" style="width:150px" :tree="{data:areaTree, 'node-key':'id','show-checkbox':true, 'check-strictly':false}" v-model="form.area"></tree-select>
                </el-form-item>
              </el-col> -->
              <el-col :span="7">
                <el-form-item prop="" label-width="50px">
                  <label class="hidden-md-and-down">筛选:</label>
                  <!-- <el-select v-model="value5" placeholder="" style="width:350px" multiple @change="selectChange">
                    <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select> -->
                  <el-checkbox-group v-model="checked" :min="1" size="small" style="display:inline-block;">
                    <!-- <el-checkbox v-for="elem in forchecked" :key="elem" :label="elem"></el-checkbox> -->
                    <el-checkbox-button v-for="elem in forchecked" :key="elem" :label="elem"></el-checkbox-button>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item>
                  <el-button style="border-radius: 5px;background:#0099de;width:75px;color:white" type="primary" @click="beginAnalysis">分析</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button style="border-radius: 5px;background:#0099de;width:120px;color:white" type="primary" @click="saveTimeLine">保存到管理</el-button>
              </el-col>
              <el-col :span="3">
                <el-button style="border-radius: 5px;background:#0099de;width:150px;color:white" type="primary" @click="timeLineManage">我的时光轴管理</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="2">
          <el-button-group style="position:absolute;right:60px;top:5px;">
            <el-button title="列表模式" :type="this.resBox === true?'primary':''" @click="showList"><i class="iconfont icon-card-list"></i>
            </el-button>
            <el-button title="时光轴模式" :type="this.linebox === true?'primary':''" @click="showLine"><i class="iconfont icon-fold"></i></el-button>
          </el-button-group>

          <span style="position:absolute;top:5px;border: 1px solid #ccc;padding: 2px;" class="unfold-button iconfont icon-fold" @click="handleRightSide"></span>
        </el-col>
      </el-row>
    </div>

    <div class="time-right" v-show="(linebox===true)&&(this.treeData.length>0)">
      <timeline-menu ref="timeLineMenu" :total="linePagenav.count" :current-count="timeLineCount"></timeline-menu>
    </div>
    <div class="app-content-box">
      <div class="res-box" v-if="(resBox===true)&&(this.tableData.length>0)" style="width:100%">
        <el-table @cell-mouse-enter="cellMouseEnter" @row-click="showDetail" :row-style="setRowStyle" v-loading="loading" :height="'100%'" :data="tableData" border stripe @selection-change="checkChange">
          <!-- <el-table-column align="center" label="操作" type="selection" prop="operation" width="130px">
          </el-table-column> -->
          <el-table-column align="center" type="selection"  width="80px">
</el-table-column>
<el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
<el-table-column align="center" label="姓名" prop="xm" width="130px"></el-table-column>
<el-table-column align="center" label="证件号" prop="zjhm" width="250px"></el-table-column>
<el-table-column align="center" label="类型" prop="gjlxms" width="130px"></el-table-column>
<el-table-column align="center" label="日期" prop="kssj" width="250px"></el-table-column>
<el-table-column align="left" label="摘要" prop="gjms"></el-table-column>
<!-- <el-table-column align="center" label="操作" :width="150">
            <template scope="scope">
               <el-button type="primary" size="mini" @click="saveTrace(scope.row)">保存</el-button>
            </template>
</el-table-column> -->
</el-table>
</div>

<section id="cd-timeline" class="cd-container" v-if="(linebox===true)&&(this.treeData.length>0)">
  <div class="linetop" v-if="linePagenav.currentpage === 1">
    <span class="linetop__title">轨迹跟踪</span>
  </div>
  <div v-if="linePagenav.currentpage !== 1">
    <span class="prev-timeline" @click="prevTimeline">
              上一页
              </span>
  </div>
  <div v-for="item in treeData" :key="item.year" style="margin-bottom: 48px;">
    <div class="title-year">
      <div class="timeline-left" @click="item.type=!item.type">
        <span class="timeline-time">{{item.year}}</span>
        <span class="el-icon-caret-bottom caret-l" :class="[ item.type ? 'el-icon-caret-top':'el-icon-caret-bottom']"></span>
      </div>
    </div>
    <div class="cd-timeline-block" v-for="(elem, idx) in item.data" :key="elem.object" v-if="item.type===true">
      <div class="cd-timeline-img cd-picture" :style="`background-color:${getLineColor(elem)}`">
        <!-- <img src="img/cd-icon-picture.svg" alt="Picture"> -->
        <i v-if="elem.事件==='网吧'" class="icon iconfont icon-wangba" style="font-size: 22px;color:white;position: relative;    left:4px;top:5px;"></i>
        <i v-if="elem.事件==='银行交易'" class="icon iconfont icon-zhangdan" style="font-size: 22px;color:white;position: relative;left:4px;top:5px;"></i>
        <i v-if="elem.事件==='旅业'" class="icon iconfont icon-jiudian" style="font-size: 22px;color:white;position: relative;left:4px;top:5px;"></i>
        <i v-if="elem.事件==='航班'" class="icon iconfont icon-hangkongyunshu" style="font-size: 22px;color:white;position: relative;left:4px;top:5px;"></i>
        <i v-if="elem.事件==='铁路'" class="icon iconfont icon-huoche" style="font-size: 22px;color:white;position: relative;left:4px;top:5px;"></i>
        <i v-if="elem.事件==='话单'" class="icon iconfont icon-dianhua" style="font-size: 22px;color:white;position: relative;left:4px;top:5px;"></i>
      </div>
      <div class="cd-timeline-content" :style="setLineStyle(elem, idx)">
        <div class="data-box" :style="`${getBoxStyle(elem, idx)}`">
          {{(elem.日期.split('年')[1].split('月')[0]+'/'+elem.日期.split('月')[1].split('日')[0])}}
        </div>
        <div class="data-box-right">
          <p style="font-weight:400;font-size:13px;margin-left:10px;color: #596C8A;">日期时间：{{elem.日期}}</p>
          <p :style="`color:${getLineColor(elem)};font-size:13px;margin-left:10px`">内容描述：{{elem.对象}}
            <span style="color:#555">{{elem.摘要}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="timeline-end" style="text-align: center;
      margin-top: 66px;
      color: #ccc;" v-if="(linebox===true)&&(this.treeData.length>0)">
  </div>
  <div class="more-timeline" v-if="Math.floor(linePagenav.count / linePagenav.limit)+1 !== linePagenav.currentpage && this.treeData.length>0" @click="nextPageLine()">下一页</div>
  <div class="more-timeline" v-if="Math.floor(linePagenav.count / linePagenav.limit)+1 === linePagenav.currentpage">END</div>
</section>

<div class="empty empty--tips" v-show="!((tableData.length > 0)||(treeData.length > 0))">
  <span>暂无无相关信息</span>
</div>
</div>
</div>


<side-right-box :unfoldHandle="showRightBar" class="side-bar-box" v-loading="loading">
  <div class="case-query-input">
    <p style="margin: 0 0 5px;
    color: #666;">请先选择人员再进行时光轴分析：</p>
    <el-input v-model="treeKeyword" style="width: 100%;" placeholder="输入关键词搜索" icon="icon iconfont icon-plus" :on-icon-click="addPerson">
      <!-- <el-button slot="append" @click="checkCase()" icon="icon iconfont icon-sousuo"></el-button> -->
    </el-input>
  </div>
  <!-- <el-tree ref="rightTree" :default-checked-keys="[0]" :filter-node-method="filterTree" :default-expanded-keys="[0]" class="cat-tree" :data="treeData" :show-checkbox="true" node-key="id" @check-change="rightTreeChange"></el-tree> -->
  <el-tree class="side-bar-tree" ref="rightTree" @node-click="treeClick" :data="tree" :show-checkbox="true" node-key="id" @check-change="rightTreeChange" :default-expanded-keys="[1]" :filter-node-method="filterTree"></el-tree>
  <el-table v-if="caseMen.length>0" border :data="caseMen" @cell-mouse-enter="cellMouseEnter" class="case-table">
    <el-table-column width="65px" align="center" label="姓名" prop="name"></el-table-column>
    <el-table-column align="center" label="证件号" prop="number"></el-table-column>
    <el-table-column align="center" width="40px" label="操作">
      <template scope='scope'>
            <el-button size="small" type="primary" icon="delete" @click="deleteChecked(scope.row)"></el-button>
          </template>
    </el-table-column>
  </el-table>
</side-right-box>
<div :class="{'el-loading-mask':true,'action':loading}">
  <div class="el-loading-spinner loader--circular"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div>
</div>
<div class="app-toolbar" v-if="(resBox===true)&&(this.tableData.length>0)">
  <pagination :count="pagenav.count" :pagenav="pagenav" @update:pagenav="handlePageChange"></pagination>
</div>
<my-timeline-dialog :dialog="timelineDialog" :queryCondition="myTimelineQuery" @close="timelineDialog = false"></my-timeline-dialog>

<el-dialog :visible.sync="dialogFlag" size="large" top="15%" title="时光轴管理" :close-on-click-modal="true" height="auto" v-loading="loading">
  <el-table @cell-mouse-enter="cellMouseEnter" @row-click="showDetail" v-loading="loading" height="500px" :data="manageData" border @selection-change="dialogCheckChange" ref="timeTable">
    <el-table-column align="center" type="selection" width="80px">
    </el-table-column>
    <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
    <el-table-column align="center" label="操作" width="100px">
      <template scope="scope">
        <el-button type="danger" @click="confirmFn(1,scope.row,scope.$index)">删除</el-button>
      </template>
    </el-table-column>
    <el-table-column align="center" label="姓名" prop="xm" width="130px"></el-table-column>
    <el-table-column align="center" label="证件号" prop="zjhm" width="250px"></el-table-column>
    <el-table-column align="center" label="类型" prop="gjlxms" width="130px"></el-table-column>
    <el-table-column align="center" label="日期" prop="kssj" width="250px"></el-table-column>
    <el-table-column align="left" label="摘要" prop="gjms"></el-table-column>
  </el-table>
  <div style="margin-top:10px;">
    <el-button type="danger" @click="confirmFn">批量删除</el-button>
    <el-button @click="resetData">重置</el-button>
  </div>
  <div slot="footer" class="dialag-footer">
    <el-button @click="saveCase">保存到案</el-button>
    <el-button @click="dialogFlag = false">取消</el-button>
  </div>
</el-dialog>
<el-dialog :visible.sync="caseFlag" size="small" top="30%" title="案件名称选择" :close-on-click-modal="true" height="auto">
  <div>
    <span>案件选择:</span>
    <el-select v-model="caseId" style="margin-top:10px;">
      <el-option v-for="item in caseList" :label="item.value" :value="item.key" :key="item.key"></el-option>
    </el-select>
  </div>
  <div style="margin-top:10px;">
    <span style="clear:left;">保存名称:</span>
    <el-input v-model="saveName" style="width:200px;" placeholder="输入保存名称"></el-input>
  </div>
  <div slot="footer" class="dialag-footer">
    <el-button @click="saveTimeToCase">保存</el-button>
    <el-button @click="dialogFlag = false">取消</el-button>
  </div>
</el-dialog>

</el-region>

</el-layout>
</template>

<style scoped lang='scss'>
  .time-box {
    height: calc(100vh - 60px);
    display: flex;
  }

  .time-left {
    flex-grow: 1;
    height: 100%;
    overflow-y: auto;
  }

  .time-right {
    -webkit-box-flex: 0;
    -ms-flex-positive: 0;
    flex-grow: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    width: 152px;
    margin-top: 10px;
    position: absolute;
    top: 55px;
    float: left;
    background: white;
    height: calc(94%);
    overflow: scroll;
    border-right: 1px solid #ccc;
    z-index: 5;
  }

  .res-box {
    height: calc(100vh - 200px);
  }

  .bill-list {
    height: 100%;
  }

  .tabs-box {
    display: flex;
    height: calc(100% - 37px);
    &__item {
      flex: 1;
      display: flex;
      flex-direction: column;
      .app-content-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        .res-box {
          flex: 1;
          overflow: auto;
        }
        .detail-box {
          flex: 1;
        }
      }
    }
  }

  .search-condition {
    width: 100%;
    background-color: rgb(255, 255, 255);
    height: 46px;
    padding-top: 10px;
    position: fixed;
    z-index: 2;
    border-bottom: 1px solid #ccc;
  }

  .side-right-box {
    top: 200px;
  }

  .time_Line_start {
    position: relative;
    left: 50%;
    top: 6vh;
    .start_br {
      width: 40px;
      height: 40px;
      line-height: 40px;
      color: #4ab7ff;
      text-align: center;
      border-radius: 50%;
      background-color: #f2f2f2;
      border: 1px solid #4ab7ff;
      position: absolute;
      top: 0;
      .iconfont {
        font-size: 25px;
      }
    }
  }

  .detail {
    position: relative;
    .detail-right {
      position: absolute;
    }
  }

  .cd-container {
    /* this class is used to give a max-width to the element it is applied to, and center it horizontally when it reaches that max-width */
    width: 90%;
    max-width: 1170px;
    margin: 0 auto;
  }

  .cd-container::after {
    /* clearfix */
    content: '';
    display: table;
    clear: both;
  }
  /* --------------------------------

Main components

-------------------------------- */

  #cd-timeline {
    position: relative;
    padding: 2em 0;
    margin-top: 1em;
    margin-bottom: 2em;
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
    float: right; // border-right: 1px solid #4ab7ff;
    // border-left: 1px solid #4ab7ff;
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
      width: 548px;
      border: 1px solid #4ab7ff;
      position: absolute;
      left: calc(-548px + 13px);
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
      right: calc(-548px + 13px);
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

  @media only screen and (min-width: 1170px) {
    /* inverse bounce effect on even content blocks */
    .cssanimations .cd-timeline-block:nth-child(even) .cd-timeline-content.bounce-in {
      -webkit-animation: cd-bounce-2-inverse 0.6s;
      -moz-animation: cd-bounce-2-inverse 0.6s;
      animation: cd-bounce-2-inverse 0.6s;
    }
  }

  .el-button-group {
    .el-button {
      display: inline-block;
      width: 38px;
      text-align: center;
      height: 28px;
      line-height: 28px;
      padding: 2px 0 2px 3px;
      color: #53a9ff;
      border: 1px solid #cccccc;
      &.action,
      &:hover {
        background-color: #53a9ff;
        color: #ffffff;
      }
      &.adormBox,
      &.adormBox:hover {
        height: 28px;
        width: 25px;
        padding: 0;
        background-color: #f2f2f2;
        color: #c3c3c3;
        text-align: center;
      }
      &.iconBox,
      &.iconBox:hover {
        background-color: #ffffff;
        color: #cccccc;
        width: 45px;
        text-align: center;
        margin-left: 5px;
      }
      i {
        font-size: 20px;
      }
    }
  }

  .app-toolbar {
    padding: 15px;
    background: #FFFFFF;
    border-width: 1px 0;
    border-style: solid;
    border-color: #ccc;
    position: fixed;
    width: 100%;
    bottom: 0;
    clear: both;
  }

  .empty {
    transform: scale(1.5) translateX(-80%) translateY(-50%);
  }

  .el-loading-mask {
    display: none;
    &.action {
      display: block;
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

  .app-content-box {
    margin-top: 60px;
    padding: 16px;
    height: calc(100vh - 60px - 57px - 33px);
    overflow: auto;
  }

  .case-query-input {}

  .analysis .side-bar-tree {
    overflow: scroll;
    flex-grow: 1;
    padding: 0 0 50px 0;
  }

  .analysis .case-table {
    width: 100%;
    min-height: 270px;
    overflow-y: scroll;
    padding: 0 0 50px 0;
  }

  .analysis .side-bar-box {
    width: 270px;
    top: 116px;
    bottom: 20px;
    display: flex;
    flex-flow: column nowrap;
    box-sizing: border-box;
  }

  .prev-timeline {
    top: -31px;
    position: relative;
    left: 50%;
    margin-left: -37px;
    background-color: #4ab7ff;
    color: #fff;
    border-radius: 20px;
    padding: 13px;
    width: 48px;
    line-height: 30px;
    height: 30px;
    cursor: pointer;
    text-align: center;
  }

  .more-timeline {
    position: absolute;
    left: 50%;
    margin-left: -37px;
    background-color: #4ab7ff;
    color: #fff;
    border-radius: 20px;
    padding: 13px;
    width: 48px;
    line-height: 30px;
    height: 30px;
    cursor: pointer;
    text-align: center;
  }

</style>
<style lang="scss" scoped>
  $--sm:768px !default;
  $--md:992px !default;
  $--lg:1200px !default;
  $--xl:1920px !default;
  $--breakpoints: ( 'sm': (min-width: $--sm), 'md': (min-width: $--md), 'lg': (min-width: $--lg), 'xl': (min-width: $--xl));
  $--breakpoints-spec:( 'sm-and-down': (max-width: $--md - 1), 'md-and-down':(max-width: $--lg - 1), 'lg-and-down': (max-width: $--xl - 1));
  @mixin res($key, $map: $--breakpoints) {
    @if map-has-key($map, $key) {
      @media only screen and #{inspect(map-get($map, $key))} {
        @content;
      }
    }
    @else {
      @warn "Undefeined points: `#{$map}`";
    }
  }

  .hidden {
    @each $break-point-name,
    $value in $--breakpoints-spec {
      &-#{$break-point-name} {
        @include res($break-point-name, $--breakpoints-spec) {
          display: none !important;
        }
      }
    }
  }

</style>
<style>
  .analysis .side-bar-tree .el-tree-node__content {
    height: 26px;
    line-height: 26px;
  }

</style>
<script>
  import { FETCH_CASE_ID_AND_NAME, DELETE_MANAGE_LIST, FETCH_ANALYSIS_TIMELINE, FETCH_CASE_LIST, FETCH_SUSPECT_CASE_PEOPLE_LIST, GET_TIMELINE_PERSON_TREE, ADD_TIMELINE, SAVE_TO_MANAGE_LIST, LOOK_TIMELINE_MANAGE, SAVE_TIMELINE_TO_CASE, GET_CASE_INFO } from '../../../store/types'
  import { mapState } from 'vuex'
  import TopBar from '../../common/topbar/index.vue'
  import searchBox from '../search-tool'
  import bus from '../../../utils/bus'
  // import mixin from '../../../utils/mixin'
  import baseMixin from '../baseMixin'
  import sideRightBox from '../../control/side-right-box.vue'
  import TreeSelect from '../../../widgets/tree-select'
  import TimelineMenu from './menu.vue'
  import { listToTree } from '../../../utils/listToTree'
  import pagination from '../../../widgets/pagination/pagination'
  import { arrayGetRid, clone } from '../../../utils/util'
  import MyTimelineDialog from './my-timeline'
  import '../../../utils/dateFormat'
  export default {
    mixins: [baseMixin],
    components: {
      pagination,
      TreeSelect,
      TopBar,
      searchBox,
      sideRightBox,
      TimelineMenu,
      MyTimelineDialog
    },
    data() {
      return {
        dialogFlag: false,
        caseName: '',
        caseId: '', // 选中的案件id
        caseList: '', // 案件列表
        saveName: '', // 保存名称
        caseFlag: false,
        query: {},
        checkedResult: [],
        dialogCheckedResult: [],
        timeLineLength: 0,
        dataPool: {}, // 建立一个数据池，通过接口请求到的分页数据会缓存到数据池中，供列表和时间轴共用
        manageList: [],
        alertFirstShow: true, // 首次进入有提示消息，但是可以关掉
        index: '',
        timeLine: [],
        addYourself: [],
        multipleSelection: [],
        defaultLimit: 50,
        pagenav: {
          count: 0,
          currentpage: 1,
          limit: this.defaultLimit
        },
        linePagenav: {
          count: 0,
          currentpage: 1,
          limit: this.defaultLimit
        },
        checked: ['铁路', '网吧', '旅业', '银行', '航班', '话单'],
        forchecked: ['铁路', '网吧', '旅业', '银行', '航班', '话单'],
        areaTree: [],
        value5: ['gt', 'wb', 'ly', 'yh', 'hk', 'hd'],
        option: [{
          value: 'gt',
          label: '铁路'
        }, {
          value: 'wb',
          label: '网吧'
        }, {
          value: 'ly',
          label: '旅业'
        }, {
          value: 'yh',
          label: '银行'
        }, {
          value: 'hk',
          label: '航空'
        }, {
          value: 'hd',
          label: '话单'
        }],
        showRightBar: false,
        treeKeyword: '',
        resBox: false,
        linebox: false,
        yearBox: true,
        form: {
          dateRange: ['2016-12-23T08:34:22.739Z', '2017-12-23T08:34:22.739Z'],
          dateRangeVal: '',
          keyword: '',
          area: [],
          cardNumber: ''
        },
        caseMen: [],
        // tableData: [],
        dialogData: [],
        treeData: [],
        yearData: '2017',
        tree: [{
          label: '案件',
          id: '1',
          count: 0,
          children: []
        }],
        colorMap: {
          ly: '#409eff',
          wb: '#ea612c',
          tl: '#67c23a',
          yh: '#e6a23c',
          hb: '#f56c6c',
          hd: '#037D24'
        },
        caseSelected: [],
        timelineDialog: false,
        myTimelineQuery: {}
      }
    },
    computed: {
      ...mapState(['analysisTimeline', 'analysisBill', 'caseInfo', 'suspectCasePeople']),
      tableData() {
        let tableData = this.dataPool[this.pagenav.currentpage] ? this.dataPool[this.pagenav.currentpage].map(d => {
          return {
            traceid: d.traceid,
            xm: d.对象,
            gjlxms: d.事件,
            kssj: d.日期,
            gjms: d.摘要,
            zjhm: d.身份证号码,
            gjlxdm: d.gjlx
          }
        }) : [];
        return tableData;
      },
      defaultKey() {
        let arr = ''
        this.tree[0].children.map((item, idx) => {
          if (item.idCard === this.$route.query.key) {
            arr = this.tree[0].children[idx].id
            return false
          }
        })
        return arr
      },
      manageData() {
        let tableData = this.dialogData ? this.dialogData.map(d => {
          return {
            id: d.ID,
            xm: d.对象,
            gjlxms: d.事件,
            kssj: d.日期,
            gjms: d.摘要,
            zjhm: d.身份证号码,
            gjlxdm: d.gjlx
          }
        }) : [];
        return tableData;
      },
      timeLineCount() {
        let start = (this.linePagenav.currentpage - 1) * this.linePagenav.limit + 1;
        let end = this.linePagenav.currentpage * this.linePagenav.limit;
        if (end > this.linePagenav.count) {
          end = this.linePagenav.count;
        }
        return start + '-' + end;
      }
    },
    props: {},
    methods: {
      getCaseInfo(caseId) {
        // 查询案件基础信息
        this.dispatch(GET_CASE_INFO, { data: { id: caseId } }).then(() => {
          console.log(this.caseInfo.Model.ajmc, 'this.caseInfo.GetCaseInfo')
          this.caseName = this.caseInfo.Model.ajmc
        })
        console.log(this.caseName, 'name1111111111111111111')
        return this.caseName
      },
      resetData() { // 重置数据
        this.$refs.timeTable.clearSelection()
      },
      saveCase() {
        if (this.dialogCheckedResult.length === 0) {
          this.$alert('请选择要保存的数据', '温馨提示')
          return
        }
        this.caseFlag = true;
      },
      confirmFn(isOne, row, idx) {
        this.$confirm('该操作将彻底删除该数据,是否继续操作?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          isOne === 1 ? this.deleteList(row, idx) : this.deleteMany()
        })
      },
      deleteList(row, idx) { // 删除时光轴管理数据
        let jsonData = {
          ids: row.id
        }
        this.dispatch(DELETE_MANAGE_LIST, jsonData).then(() => {
          let status = this.analysisTimeline.deleteManageListResult
          if (status === '删除成功') {
            this.$alert('删除成功', '温馨提示')
            this.dialogData.splice(idx, 1)
          }
        })
      },
      deleteMany() { // 批量删除
        if (this.dialogCheckedResult.length === 0) {
          this.$alert('请选择要删除的数组', '温馨提示')
          return
        }
        let jsonData = '';
        this.dialogCheckedResult.map((item, idx, arr) => {
          if (idx === 0) {
            jsonData = item.id
          } else {
            jsonData += ',' + item.id
          }
        })
        this.dispatch(DELETE_MANAGE_LIST, { ids: jsonData }).then(() => {
          let status = this.analysisTimeline.deleteManageListResult
          if (status === '删除成功') {
            this.$alert('删除成功', '温馨提示')
            this.timeLineManage();
          }
        })
      },
      fetchCaseId() { // 获取案件名称及id
        this.dispatch(FETCH_CASE_ID_AND_NAME).then(() => {
          this.caseList = this.caseInfo.fetchCaseIdAndName
          console.log(this.caseList, 'this.caseList11111111111111111111')
        })
      },
      saveTimeToCase() { // 保存到案件
        if (!this.caseId) {
          this.$alert('请选择案件', '温馨提示')
          return
        } else if (!this.saveName) {
          this.$alert('名称不能为空', '温馨提示')
          return
        }
        this.caseFlag = false;
        this.loading = true;
        let jsonData = {
          data: this.dialogCheckedResult,
          caseId: this.caseId,
          saveName: this.saveName
        }
        this.dispatch(SAVE_TIMELINE_TO_CASE, jsonData).then(() => {
          this.loading = false;
          this.saveName = '';
          let status = this.analysisTimeline.saveTimelineToCaseResult
          if (status === '保存成功') {
            this.$alert('保存成功', '温馨提示');
          } else {
            this.$alert('保存失败', '温馨提示')
          }
        })
      },
      saveTimeLine(val) { // 保存到我的管理
        if (this.checkedResult.length > 0) {
          this.dispatch(SAVE_TO_MANAGE_LIST, { data: this.checkedResult }).then(() => {
            let status = this.analysisTimeline.saveToManageListResult
            status === '保存成功' ? this.$alert('保存成功', '温馨提示') : this.$alert('保存失败', '温馨提示')
          })
        }
      },
      timeLineManage() { // 时光轴管理列表数据
        this.fetchCaseId();
        this.dispatch(LOOK_TIMELINE_MANAGE).then(() => {
          this.dialogData = this.analysisTimeline.lookTimelineManageResult
        })
        this.dialogFlag = true;
      },
      dialogCheckChange(val) {
        this.dialogCheckedResult = val
      },
      checkChange(val) {
        this.checkedResult = val;
      },
      openMyTimeline() {
        this.timelineDialog = true;
      },
      saveTrace(data) {
        let postData = {
          caseid: this.caseSelected.join(','),
          traceid: data.traceId,
          xm: data.object,
          zjhm: data.idnumber,
          gjlxdm: data.gjlx,
          gjlxms: data.thing,
          kssj: data.data,
          gjms: data.decs
        }
        this.dispatch(ADD_TIMELINE, postData).then(() => {
          if (this.analysisTimeline.addTimeline) {
            this.$message({ type: 'success', message: '保存成功' })
          }
        })
      },
      getBoxStyle(elem, idx) {
        let border = idx % 2 === 0 ? 'border-right' : 'border-left';
        let color = this.getLineColor(elem);
        return `${border}:1px solid ${color};color:${color}`;
      },
      setLineStyle(elem, index) {
        let color = this.getLineColor(elem);
        let styleLeft = `border-top-color: ${color};
                     border-left-color: ${color};
                     border-bottom-color: ${color};`;
        let styleRight = `border-top-color: ${color};
                     border-right-color: ${color};
                     border-bottom-color: ${color};`;
        return index % 2 === 0 ? styleRight : styleLeft;
      },
      getLineColor(elem) {
        return this.colorMap[elem.gjlx];
      },
      setRowStyle(row, rowIndex) {
        return `color:${this.colorMap[row.gjlx]};`
      },
      beginAnalysis() {
        this.resetDataPool();
        this.setQuery();
        // 如果是轴为当前项，则显示轴, 否则显示列表
        if (this.linebox === true && this.resBox === false) {
          this.showLine()
        } else {
          this.showList()
        }
      },
      setQuery() {
        if (this.form.cardNumber === '' && !(this.tableData.length > 0)) {
          if (!this.showRightBar) {
            this.showRightBar = true;
          }
          this.$message({ message: '请选择或手动输入一个对象重新进行时光轴分析', type: 'info' });
          return false
        }
        let dateRange = this.form.dateRangeVal.split('/').map(d => d.split('-').join(''))
        let type = this.getCheckedBoxxx()
        let area = this.form.area.join(',')
        this.query = {
          v_starttime: dateRange[0],
          v_endtime: dateRange[1],
          v_xzqh: area,
          v_zjhm: this.form.cardNumber,
          v_gjlx: type,
          v_gjz: this.form.keyword
        }
      },
      resetDataPool() {
        this.dataPool = {};
        this.pagenav.count = 0;
        this.pagenav.currentpage = 1;
        this.pagenav.limit = this.defaultLimit;
        this.linePagenav.count = 0;
        this.linePagenav.currentpage = 1;
        this.linePagenav.limit = this.defaultLimit;
      },
      setTreeData() {
        if (!this.dataPool[1]) {
          return []
        }
        let tempData = [];
        // let count = 1;
        // 在表格中可能会加载不连续的页，而轴视图只允许连续
        // while (this.dataPool[count]) {
        // tempData = tempData.concat(this.dataPool[count]);
        // count++;
        // }
        tempData = this.dataPool[this.linePagenav.currentpage];
        this.timeLineLength = tempData.length;
        this.$refs.timeLineMenu.createTimeLine([...tempData.map(d => d.日期)])
        let data = [...tempData.map(d => d.日期)]
        if (data.length > 0) {
          // 年月抽取, 数据去重
          let res = [],
            monthArr = Array.from(new Set(
              data.map(t => {
                let d = t.split(' ')[0].split('月')[0]
                let dateArr = d.split('年')
                if (!res.find(r => r.year === dateArr[0])) {
                  res.push({
                    type: true,
                    year: dateArr[0],
                    data: []
                  })
                }
                return `${dateArr[0]}-${dateArr[1]}`
              })
            ))
          // 分组
          monthArr.forEach(d => {
            let dateArr = d.split('-')
            // res.find(r => r.year === dateArr[0]).months.push(dateArr[1])
            res.find(r => r.year === dateArr[0]).data = [...tempData.filter(d => d.日期.split('年')[0] === dateArr[0])]
          })
          res[0].type = true
          this.treeData = res;
          this.$nextTick(() => {
            this.$('#cd-timeline').parent().scrollTop(0);
          })
        }
      },
      getDataInPool(tempPagenav) {
        // 如果请求数据超过总条数，不做任何操作。否则尝试从数据池拿数据
        if (this.dataPool[tempPagenav.currentpage]) {
          this.setTreeData();
          return false;
          // 否则请求数据，写入数据池
        } else {
          this.fetchList(tempPagenav)
        }
      },
      fetchList(tempPagenav) {
        let tips = true
        let msgObj
        setTimeout(() => {
          if (tips) {
            msgObj = this.$message({ message: '此分析用时较长，请耐心等候...', type: 'warning', showClose: true, duration: 0 });
          }
        }, 10000)
        this.dispatch(FETCH_ANALYSIS_TIMELINE, Object.assign({}, this.query, {
          PageIndex: tempPagenav.currentpage,
          PageSize: tempPagenav.limit
        })).then(() => {
          tips = false;
          msgObj && msgObj.close();
          this.$set(this.dataPool, tempPagenav.currentpage, clone(this.analysisTimeline.list.PageData));
          this.pagenav.count = this.linePagenav.count = this.analysisTimeline.list.DataCount;
          this.setTreeData();
        }).catch(() => {
          tips = false;
          msgObj && msgObj.close()
        });
        this.showRightBar = false
      },
      getCheckedBoxxx() {
        let checked = []
        this.checked.forEach(d => {
          if (d === '网吧') {
            checked.push('wb')
          } else if (d === '银行') {
            checked.push('yh')
          } else if (d === '航班') {
            checked.push('hb')
          } else if (d === '旅业') {
            checked.push('ly')
          } else if (d === '铁路') {
            checked.push('gt')
          } else if (d === '话单') {
            checked.push('hd')
          }
        })
        return checked.join(',')
      },
      showDetail() {},
      showList() {
        this.linebox = false
        this.resBox = true
        this.getDataInPool(this.pagenav)
      },
      showLine() {
        this.linebox = true
        this.resBox = false
        console.log(this.linePagenav, 'this.linePagenav')
        this.getDataInPool(this.linePagenav)
      },
      nextPageLine() {
        this.linePagenav.currentpage++;
        this.getDataInPool(this.linePagenav);
      },
      prevTimeline() {
        this.linePagenav.currentpage--;
        this.getDataInPool(this.linePagenav);
      },
      moreTimeline() {
        this.linePagenav.currentpage++;
        this.getDataInPool(this.linePagenav);
      },
      handlePageChange(page) {
        this.pagenav.currentpage = page.currentpage
        this.pagenav.limit = page.limit
        this.getDataInPool(this.pagenav)
      },
      getCaseTree() {
        this.dispatch(FETCH_CASE_LIST, { PageIndex: 1, PageSize: 500 }).then(() => {
          this.tree[0].children = this.caseInfo.PageData.filter(d => d.ajmc !== '').map(d => {
            return {
              type: 'case',
              label: d.ajmc,
              id: d.id,
              count: 0,
              children: []
            }
          })
        }).then(() => {
          this.tree[0].children.forEach(d => {
            this.dispatch(FETCH_SUSPECT_CASE_PEOPLE_LIST, {
              ajid: d.id,
              xm: '',
              sfz: '',
              PageIndex: 1,
              PageSize: 500
            }).then(() => {
              d.children = this.suspectCasePeople.PageData.map(d => {
                return {
                  id: d.id,
                  city: d.xzz,
                  name: d.xm,
                  label: d.xm ? d.xm : '123',
                  idCard: d.sfz,
                  // source: '怀化',
                  sex: d.xbmc,
                  mark: d.tjsm,
                  lybid: d.id,
                  lylx: '1'
                }
              })
            })
          })
        })
      },
      treeClick(data, node) {},
      rightTreeChange(a, checked, c) {
        this.caseMen = []
        let array = []
        let existIdCard
        let caseArr = [];
        // 选择节点
        this.$refs.rightTree.getCheckedNodes().forEach(d => {
          if (d.idCard) {
            // 在已选择数组中查找，如果已存在则提示，否则Push到数组
            existIdCard = this.caseMen.find(r => { return r.number === d.idCard })
            if (!existIdCard) {
              this.caseMen.push({
                name: d.name,
                number: d.idCard,
                id: d.id
              })
            }
          } else if (d.id === a.id && !a.PID && checked) {
            // 选择后判断身份证信息是否为空，若为空则做出提示
            this.$message({ type: 'warning', message: '此身份证信息为空' })
          } else if (d.PID && d.children) {
            caseArr.push(d.id);
            let distinct = new Set([...caseArr]);
            this.caseSelected = [...distinct];
          }
        })
        // let existTips = this.caseMen.find(r => { return r.number === a.idCard && checked })
        if (existIdCard && checked && existIdCard.number === a.idCard) {
          this.$message({ type: 'warning', message: `重复选择了身份证:${existIdCard.name}${existIdCard.number}` })
        }
        // 取消选择,找不到id，说明是取消操作
        if (!checked) {
          // 把其他相同身份证号的取消
          let sameIdCard = this.caseMen.find(r => { return r.number === a.idCard })
          if (sameIdCard) {
            this.$refs.rightTree.setChecked(sameIdCard.id, false)
          }
        }
        this.addYourself.forEach(d => {
          this.caseMen.push({
            name: d.name,
            number: d.number
          })
        })
        this.caseMen = this.getMyonlyArray(this.caseMen)
        this.caseMen.forEach(d => {
          array.push(d.number)
        })
        this.form.cardNumber = array.join(',')
      },
      // input
      addPerson(data) {
        if (this.treeKeyword === '' && (!(/\d{17}[\d|x]|\d{15}/).test(this.treeKeyword) || (this.treeKeyword.length !== 15 && this.treeKeyword.length !== 18))) {
          this.$alert('请输入正确的身份证', '温馨提示');
          return false
        } else {
          let array = []
          this.caseMen.forEach(d => {
            if (d.number === this.treeKeyword) {
              this.$alert('请勿输入重复的证件号码', '温馨提示');
              return false
            }
          })
          this.caseMen.push({
            name: '手动输入',
            number: this.treeKeyword
          })
          this.addYourself.push({
            name: '手动输入',
            number: this.treeKeyword
          })
          this.caseMen = this.getMyonlyArray(this.caseMen)
          this.addYourself = this.getMyonlyArray(this.addYourself)
          this.caseMen.forEach(d => {
            array.push(d.number)
          })
          this.form.cardNumber = array.join(',')
        }
      },
      deleteChecked(data) {
        this.caseMen = arrayGetRid(this.caseMen, [data])
        this.addYourself.splice(data, 1)
        // 手动加入的也要删除掉，并且更改form.cardNumber
        let deleteMyIndex, arr = [];
        this.caseMen.forEach((r, idx) => {
          if (r.number === data.number) {
            deleteMyIndex = idx;
          } else {
            arr.push(r);
          }
        })
        if (deleteMyIndex !== undefined) {
          this.caseMen.splice(deleteMyIndex, 1)
        }
        this.form.cardNumber = arr.join(',')
        this.$refs.rightTree.setChecked(data.id, false)
      },
      filterTree(value, data) {
        if (!value) {
          return true
        } else {
          return data.label.indexOf(value) !== -1
        }
      },
      getMyonlyArray(array) {
        let newArray = []
        for (let i = 0; i < array.length; i++) {
          let flag = true
          // let n = newArray.length
          for (let j = 0; j < newArray.length; j++) {
            if (array[i].number === newArray[j].number) {
              flag = false
            }
          }
          if (flag) {
            newArray.push(array[i])
          }
        }
        return newArray
      },
      handleRightSide() {
        this.showRightBar = !this.showRightBar
      },
      validSfzh(sfzh) { // 验证是否为身份证号
        let reg1 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/g;
        let reg2 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/g;
        if (!reg1.test(sfzh) && !reg2.test(sfzh)) {
          return false
        } else {
          return true
        }
      }
    },
    watch: {
      treeKeyword(v) {
        this.$refs.rightTree.filter(v)
      }
    },
    created() {
      if (this.$route.query.caseId) {
        this.dispatch(FETCH_SUSPECT_CASE_PEOPLE_LIST, {
          ajid: this.$route.query.caseId,
          xm: '',
          sfz: '',
          PageIndex: 1,
          PageSize: 500
        }).then(() => {
          this.tree[0].PID = '123'
          this.tree[0].children = this.suspectCasePeople.PageData.map(d => {
            return {
              PID: d.ajid,
              id: d.id,
              city: d.xzz,
              name: d.xm,
              label: d.xm ? d.xm : '123',
              idCard: d.sfz,
              sex: d.xbmc,
              mark: d.tjsm,
              lybid: d.id,
              lylx: '1'
            }
          })
          this.tree[0].children.map((item, idx) => {
            if (item.idCard === this.$route.query.key) {
              this.$refs.rightTree.setCheckedNodes([item.id])
              return false
            }
          })
          console.log('222222222222222222222')
        })
        return
      }
      this.dispatch(GET_TIMELINE_PERSON_TREE, {}).then(() => {
        this.tree[0].children = this.analysisTimeline.anjianList.filter(d => d.PID === '1').map(r => {
          return {
            label: r.VALUE,
            id: r.ID,
            PID: r.PID,
            value: r.VALUE,
            children: []
          }
        })
        this.tree[0].children.forEach(d => {
          d.children = this.analysisTimeline.anjianList.filter(r => r.PID === d.id).map(c => {
            return {
              idCard: c.ZJHM,
              label: c.VALUE,
              id: c.ID,
              name: c.VALUE
            }
          })
        })
      })
      this.getDict(['XZQHDM']).then(res => {
        let resAreaTree = listToTree(res['XZQHDM'].map(r => { return { id: r.value, parentId: r.parentId, label: r.label } }), '', 0, {
          id: 'id',
          parentId: 'parentId',
          children: 'children'
        })
        this.areaTree = resAreaTree
      })
    },
    mounted() {
      if (this.$route.query.caseId) {
        this.dispatch(FETCH_CASE_ID_AND_NAME).then(() => {
          this.caseList = this.caseInfo.fetchCaseIdAndName
          this.caseList.map(item => {
            if (item.key === this.$route.query.caseId) {
              this.tree[0].label = item.value;
              return false
            }
          })
        })
        console.log(33333333333333)
      }
      this.showRightBar = true
      let date = new Date()
      this.form.dateRangeVal = this.dateFormat(new Date((date.getTime() - (3600 * 24 * 365 * 1000))), 'yyyy-MM-dd') + '/' + this.dateFormat(new Date(date.toLocaleDateString()), 'yyyy-MM-dd')
      this.form.dateRange = [this.dateFormat(new Date((date.getTime() - (3600 * 24 * 365 * 1000))), 'yyyy-MM-dd'), this.dateFormat(new Date(date.toLocaleDateString()), 'yyyy-MM-dd')]
      bus.$on('call:timeline-month', data => {
        let index = null
        this.treeData.forEach(d => {
          if (d.year === data[0]) {
            d.type = true
            let target = d.data.find(c => {
              let dataArr = c.日期.split('年')[1].split('月')[0]
              if (data[1] === dataArr) {
                return true
              } else {
                return false
              }
            })
            this.index = index = d.data.indexOf(target)
          } else {
            d.type = false
          }
        })
        if (index !== null) {
          let $listBox = this.$('.app-content-box')
          let targetItemTop = $listBox.find('.cd-timeline-block').eq(index).offset().top - $listBox.offset().top + $listBox.scrollTop()
          $listBox.animate({
            scrollTop: targetItemTop
          }, 0)
        }
      })
      bus.$on('call:timeline-all', () => {
        this.treeData = []
        let data = [...this.analysisTimeline.list.Data.map(d => d.日期)]
        if (data.length > 0) {
          // 年月抽取, 数据去重
          let res = [],
            monthArr = Array.from(new Set(
              data.map(t => {
                let d = t.split(' ')[0].split('月')[0]
                let dateArr = d.split('年')
                if (!res.find(r => r.year === dateArr[0])) {
                  res.push({
                    type: false,
                    year: dateArr[0],
                    data: []
                  })
                }
                return `${dateArr[0]}-${dateArr[1]}`
              })
            ))
          // 分组
          monthArr.forEach(d => {
            let dateArr = d.split('-')
            // res.find(r => r.year === dateArr[0]).months.push(dateArr[1])
            res.find(r => r.year === dateArr[0]).data = [...this.analysisTimeline.list.Data.filter(d => d.日期.split('年')[0] === dateArr[0])]
          })
          res[0].type = true
          this.treeData = res
        } else {}
      })
      if (this.validSfzh(this.$route.query.key)) {
        this.form.cardNumber = this.$route.query.key
        this.beginAnalysis()
      }
      // if (this.$route.query.caseId) {
      //   this.caseList.map(item => {
      //     if (item.key === this.$route.query.caseId) {
      //       this.tree[0].label = item.value;
      //     }
      //   })
      // }
    }
  }

</script>
