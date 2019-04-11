<template>
<el-layout class="app-layout result-item" :fit="true">

  <!-- 通顶 -->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar>
      <div slot="search">
        <span class="sub-title">单库搜索</span>
      </div>
    </top-bar>
  </el-region>

  <!-- 侧边栏(分类树) -->
  <el-region :class="{'app-west': true, 'app-west--mini':miniWest }" slot="west" type="west" :zoom="false" :fixed="false">
    <cat-tree id="catTree" ref="catTree" class="cat-tree" :query="treeQuery" @update:keywords="updateKeywords" @update:value="updateCat" @on-match-keyword="colOnClickEvent"></cat-tree>
    <!-- <el-tree :data="treeData" :default-expanded-keys="[1]" node-key="id" :indent="0" :render-content="renderContent" :filter-node-method="filterNode" :highlight-current="true"></el-tree> -->
    <!-- 回顶部 -->
    <div style="position:fixed;left:0;bottom:0;bottom:0;height:100%;width:10px" @dblclick="backTop()">

    </div>
  </el-region>

  <!-- 内容区 -->
  <el-region class="app-center" slot="center" type="center" v-loading="loadingFlag">
    <div class="cate__arrow" @click="miniSlider">
      <i :class="['iconfont', miniWest? 'icon-enter':'icon-return']"></i>
    </div>
    <div class="search-wrap">
      <!-- 页签栏 -->
      <div v-if="this.treeRes!==null">
        <el-row>
          <el-col :span="19">
            <div class="tabs">
              <div :class="{'tabs__item':true,'current':currentTab===i}" v-for="(item,i) in tabs" @click="changeTab(i)" :key="i" :title="item.keyword">
                {{item.keyword}}
                <i class="iconfont icon-close" v-if="tabs.length>1" @click="removeTab(item)"></i>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
          </el-col>
        </el-row>
      </div>
      <div class="formSearch" >
        <div v-if="conditionData.length>0" style="clear:both;border-bottom:1px solid #ccc;">
          <div :class="{'formInfo':true,'formClass': miniTop}" v-if="conditionData.length> 0">
            <el-form style="margin-top:10px;" :model="searchForm">
              <el-row>
                    <label class="formInfo_label">全文搜索:</label>
                    <el-input placeholder="请输入搜索内容" size="small" v-model="keywordAll" style="width:300px;"></el-input>
              </el-row>
              <el-col :span="8" class="formInfo_col" v-if="item.is_defualt === '1'" :key="index"  v-for="(item, index) in conditionData">
                  <label class="formInfo_label">{{item.sjxzwmc}}:</label>
                  <el-input v-if="item.datatype!=='DATE'" placeholder="输入对应的关键字" size="small" v-model="searchForm[item.escolumnsname]" class="formInfo_item"></el-input>
                  <el-date-picker type="date" size="small" style="height:28px;" class="formInfo_date" v-if="item.datatype === 'DATE'" v-model="searchForm[item.escolumnsname]" placeholder="输入对应的日期"></el-date-picker>
              </el-col>
            </el-form>
          </div>
          <div class="gaoSearch">
            <!-- <span @click="clearData" style="display:block;color: #73b8fd;cursor: pointer;margin-bottom:10px;">重置</span> -->
            <el-button class="gaoSearch_search" type="info" icon="search" @click="searchSubmit(1)">
              搜索
            </el-button>
            <el-button class="gaoSearch_search" type="info"   @click="clearData">
              重置
            </el-button>
            <span class="gaoSearch_gaoji" @click="searchGaoji">高级搜索>></span>
          </div>
        </div>
        <div class="cate__top" @click="miniTop = !miniTop">
            <i :class="['iconfont', !miniTop? 'icon-packup-2':'icon-unfold1','miniClass']"></i>
        </div>
        <div style="clear:both"></div>
      </div>
      
  <!-- 工具栏 -->
  <div class="app-toolbar app-toolbar--search clearfix rel">
    <!-- <div class="app-toolbar app-toolbar--search clearfix rel" v-if="treeRes!==null"> -->
    <el-row v-if="resList.length >0">
      <el-col class="query-box" :span="12">
        <div class="query-box__item" :title="heightLightKeys.join(',')">
              <label class="query-box__item__name">条件</label> {{heightLightKeys.join(',')}}
            </div>
        <div class="query-box__item" :title="treeRes.label">
          <label class="query-box__item__name">资源</label> {{treeRes.label}}
        </div>
        <div class="query-box__item" v-if="count">
          <label class="query-box__item__name">命中</label> {{count}}条
        </div>
        <div class="query-box__item" v-if="useMilliesecond!==null">
          <label class="query-box__item__name">时间</label> {{useMilliesecond / 1000}}秒
        </div>
      </el-col>
      <!-- <el-col :class="{'ctrl-box':true,'ctrl-box--mini':miniModel}" :span="miniModel?13:17"> -->
      <el-col :class="{'ctrl-box':true,'ctrl-box--mini':miniModel}" :span="12">
        <!-- <el-input placeholder="输入关键字进行二次检索" v-model="secondKeys" :on-icon-click="secondSearch" icon="search" size="small" style="width: 200px"></el-input> -->
        <el-button type="" :title="miniModel?'快照':''" @click="screenshotState=true">
          <i class="iconfont icon-image"></i>
          <span v-show="!miniModel">快照</span>
        </el-button>
        <!-- <el-button type="" @click="exportSelected" :title="miniModel?'数据导出':''">
          <i class="iconfont icon-daochu"></i>
          <span v-show="!miniModel">导出当前页</span>
        </el-button> -->

        <!-- <el-button type="" @click="openSortDialog" :title="miniModel?'排序':''" v-if="type===1">
                <i class="iconfont icon-paixu"></i>
                <span v-show="!miniModel">排序</span>
              </el-button> -->
        <!-- <el-button type="" @click.prevent.stop="tempDialog=true" ref="cusBox" :title="miniModel?'添加临时储存':''">
                <i class="iconfont icon-folder-open"></i>
                <span v-show="!miniModel">临时储存</span>
                <span>{{temp.length}}</span>
              </el-button> -->

        <!-- 列表模式切换 -->
        <!-- <el-button-group>
                <el-button type="" @click="listType=1" :class="{action:listType===1}" title="紧凑模式">
                  <i class="iconfont icon-fold"></i>
                </el-button>
                <el-button v-if="type!==2" type="" @click="listType=2" :class="{action:listType===2}" title="列表模式">
                  <i class="iconfont icon-card-list"></i>
                </el-button>

              </el-button-group> -->
      </el-col>
    </el-row>
  </div>

      <!-- 内容区 -->
      <div class="app-content">
        <!-- 列表 -->
        <el-table v-if="listType===1" id="searchResTable" class="app-table" :show-header="false" :data="resList" :border="true" style="width:100%;" :height="tableHeights" :row-class-name="rowClassName" @selection-change="updateTableSelection">
          <el-table-column class-name="compact user-bg" label="内容集">
            <template scope="scope">
              <div :class="{compact__wrap:true}">
                <div class="compact__serial">
                  <el-tag type="primary">{{scope.$index + 1}}</el-tag>
                </div>
                <div class="compact__box">
                  <div class="compact__title">
                    采集时间: {{getAcqTime(scope.row)}} {{getColumns(scope,0)[0].tableName}}

                    <!-- <el-button type="text" size="small" @click="addTemp($event,scope.row, scope.$index)" title="添加到临时储存">
                      <i class="iconfont icon-save"></i>
                    </el-button> -->

                    <el-button type="text" size="small" @click="pushDataPool(scope.row)" title="移入案件池">
                      <i class="iconfont icon-data-cloud"></i>
                    </el-button>
                  </div>

                  <!-- 内容 列表 -->
                  <div class="compact__item img__item" style="float: left">
                    <img :key="index" v-for="(column,index) in filterOnlyIdCardData(scope.row,getColumns(scope.row,0))" v-if="column.type === 'idCard'" onerror="this.src='/static/img/default_person.jpg'" :title="`证件号码: ${scope.row[column.prop]}`" :data-src="`{personImagePath}${scope.row[column.prop]}`" :src="`${personImagePath}${scope.row[column.prop]}`" height="80" @click="colOnClickEvent(column.type,scope.row[column.prop],scope.row)">
                  </div>
                  <div :class="{'compact__item':true,'compact__item--point':column.type!==null && scope.row.HasQx==='True','table':true}" v-for="column in getColumns(scope.row,1)" v-if="scope.row[column.prop]!==''" :key="column.id" @click="colOnClickEvent(column.type,scope.row[column.prop],scope.row)">
                    <label v-html="column.label" :title="column.label"></label>
                    <span v-html="heightLightElms(scope.row[column.prop], heightLightKeys)" :title="scope.row[column.prop]"></span>
                  </div>
                  <!-- 收起及显示按钮 -->
                  <div class="show-btn" style="display:inline-block;line-height:16px;position:absolute;bottom:0;right:0;cursor:pointer" @click="showMore(scope.$index)">
                    <el-button type="text" size="mini" v-html="resList[scope.$index].flag?'收起':'显示全部'" style="color:#9c9c9c;font-size:14px">
                    </el-button>
                    <i :class="{'iconfont':true, 'icon-packup-2':resList[scope.$index].flag,'icon-unfold1':!resList[scope.$index].flag}" style="position:relative;top:2px;color:#1e8ffd"></i>
                  </div>
                </div>
              </div>
            </template>
</el-table-column>
</el-table>

<!-- 表格模式 -->
<div class="search__table-box" v-if="listType===2">
  <div v-for="(scope,index) in resList" :class="{compact__wrap:true, 'compact__wrap--table':true,'dataTable':true}">
    <div class="compact__box">
      <div class="compact__title">
        <el-tag class="tag-index" type="primary" style="text-align:center;">{{index + 1}}
        </el-tag>
        采集时间: {{getAcqTime(scope)}} {{getColumns(scope,0)[0].tableName}}
        <!-- <el-button type="text" size="small" @click="addTemp($event,scope, index)" title="添加到临时储存">
          <i class="iconfont icon-save"></i>
        </el-button> -->

        <el-button type="text" size="small" @click="pushDataPool(scope)" title="移入案件池">
          <i class="iconfont icon-data-cloud"></i>
        </el-button>
      </div>

      <table class="res-table user-bg" border="1" cellspacing="0">
        <tr v-for="tr in getColumns(scope,2)">
          <template v-for="(column,ci) in tr">
                    <td class="res-table__label">{{column.label}}</td>
                    <td :class="{'res-table__value':true,'res-table__value--point':column.type!==null && scope.HasQx==='True'}" v-html="heightLightElms(scope[column.prop], heightLightKeys)" @click="colOnClickEvent(column.type,scope[column.prop],scope)"></td>
                  </template>
        </tr>
        <tr>
          <td class="res-table__label">相关人</td>
          <td colspan="7" class="res-table__value">
            <img class="res-table__value__img" :key="i" v-for="(column,i) in getColumns(scope,0)" v-if="isIdCardNumber(column.type, scope[column.prop])" onerror="this.src='/static/img/default_person.jpg'" :data-src="`${personImagePath}${scope[column.prop]}`" :src="`${personImagePath}${scope[column.prop]}`"
              style="" @click="colOnClickEvent(column.type,scope[column.prop],scope)">
          </td>
        </tr>
      </table>
      <!-- 收起及显示按钮 -->
      <div class="show-btn" style="display:inline-block;line-height:16px;position:absolute;bottom:20px;right:0;cursor:pointer" @click="showMore(index)">
        <el-button type="text" size="mini" style="color:#9c9c9c;font-size:14px">
          {{resList[index].flag?'收起':'显示全部'}}{{test}}
        </el-button>
        <i :class="{'iconfont':true, 'icon-packup-2':resList[index].flag,'icon-unfold1':!resList[index].flag}" style="position:relative;top:2px;color:#1e8ffd"></i>
      </div>

    </div>
  </div>
</div>

<!-- 右侧栏 -->
<side-right-box style="width:220px; height:calc(100% - 185px); top:152px;" :unfoldHandle="showRightBar">
  <right-bar class="cat-tree" :data="rightData" @update:value="val=>updateCat(val,true)"></right-bar>
</side-right-box>

<div :class="{empty:true,'empty--tips':this.treeRes===null}" v-show="showTips===true">
  <span v-if="this.treeRes===null">请从左边树菜单选择地区或要素</span>
</div>

<i ref="cusIcon" class="cus-save-icon iconfont icon-save"></i>

<!-- 数据导出  -->
<form ref="postform" method="post" :action="trunk+'Search/ExportData'">
  <!-- userData.UserToken -->
  <input type="hidden" name="token" :value="userData.UserToken" />
  <input type="hidden" name="data" :value="exportData" />
  <input type="hidden" name="id" value="Search/ExportData" />
</form>


<dialog-push-data-pool :dialog="pushDataPoolDialog" :data="dataPool" :keyword="heightLightKeys" @close="pushDataPoolDialog=false"></dialog-push-data-pool>
<dialog-export :dialog="exportDialog" @close="exportDialog=false"></dialog-export>
<dialog-sort :dialog="sortDialog" :columns="columns" @close="sortDialog=false" @update:value="updateSort"></dialog-sort>
<dialog-temp ref="dialogTemp" :dialog="tempDialog" :data="temp" @close="tempDialog=false" @on-item-click="handleTempClick"></dialog-temp>
<!-- 人员信息弹窗 -->
<dialog-people-info :dialog="peopleInfoDialog" :data="infoDialogData" @close="peopleInfoDialog=false" @call:dialog="openInfoDialog"></dialog-people-info>
<dialog-car-info :dialog="carInfoDialog" :data="infoDialogData" @close="carInfoDialog=false" @call:dialog="openInfoDialog"></dialog-car-info>
<dialog-mobile-info :dialog="mobileInfoDialog" :data="infoDialogData" @close="mobileInfoDialog=false" @call:dialog="openInfoDialog"></dialog-mobile-info>

<dialog-link :dialog="linkDialog" @close="linkDialog=false"></dialog-link>

<dialog-share :dialog="shareDialog" :content="shareContent" :features="{name: '检索结果', type: '5'}" @close="shareDialog=false"></dialog-share>
</div>
</div>

<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="searchDialog" title="高级搜索" :modal-append-to-body="true" :append-to-body="true" size="large" :modal="true" :close-on-click-modal="false" :before-close="()=>{searchDialog = false}">
  <div v-if="conditionData.length>0">
    <el-form class="gaojiSearch" :model="searchForms">
      <el-col :span="8" class="gaojiSearch_col" :key="index" v-for="(item, index) in conditionData">
        <span class="gaojiSearch_label">{{item.sjxzwmc}}:</span>
        <el-input size="small" v-if="item.datatype !== 'DATE'" placeholder="请输入对应的关键字" class="gaojiSearch_input" v-model="searchForms[item.escolumnsname]"></el-input>
        <el-date-picker size="small" style="height:28px;" class="formInfo_date" type="date" v-if="item.datatype === 'DATE'" v-model="searchForms[item.escolumnsname]" placeholder="输入对应的日期"></el-date-picker>
      </el-col>
    </el-form>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="searchDialog = false">取消</el-button>
    <el-button type="primary" @click="makeSure()">确定</el-button>
  </span>
</el-dialog>

<!-- 快照 -->
<screenshot :submit="screenshotState" @generate="screenshotState = false"></screenshot>

<div :class="{'el-loading-mask':true,'action':maskLoading}">
  <div class="el-loading-spinner loader--circular">
    <svg viewBox="25 25 50 50" class="circular">
            <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
          </svg>
  </div>
</div>
</el-region>

</el-layout>
</template>

<style lang="scss" scoped>
  .empty {
    top: 70%
  }

  .formInfo_date {
    width: 200px;
  }

  .formSearch {
    position: relative; // border-bottom: 1px solid #ccc;
  }

  .formClass {
    height: 120px; // height: 120px;
  }

  .formInfo {
    width: 80%;
    float: left; // height: 120px; // border-bottom: 1px solid #ccc;
    overflow: hidden; // paddng-left: 20px;
    padding-bottom: 5px;
    min-height: 120px;
    &_item {
      width: 200px;
      float: left;
      height: 28px;
    }
    &_label {
      float: left;
      margin-right: 10px;
      text-align: right;
      line-height: 28px;
      color: #afa5a5;
      width: 170px;
    }
    &_col {
      margin-top: 10px;
    }
  }

  .gaoSearch {
    width: 20%;
    position: absolute; // bottom: 25px;
    top: 50px;
    left: 81%;
    &_search {
      width: 80px; // color: white;
      // background-color: #73b8fd;
    }
    &_gaoji {
      margin-left: 10px;
      color: #73b8fd;
      cursor: pointer;
    }
  }

  .gaojiSearch {
    &_label {
      width: 207px;
      text-align: right;
      margin-right: 10px;
      float: left;
      line-height: 36px;
      color: #afa5a5;
    }
    &_input {
      width: 200px;
    }
    &_col {
      margin-top: 10px;
    }
  }

  .app-north {
    position: relative;
    z-index: 998;
  }

  .app-west {
    width: 280px;
    height: 100%;
    border-right: 1px solid #d7d7d7;
    overflow-y: hidden;
    &--mini {
      width: 0;
    }
    .scrollTop-icon {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 40px;
      height: 40px; // color: #d3e71f;
      color: #fff;
      text-align: center;
      background: rgba(250, 250, 250, .3);
      cursor: pointer;
      .iconfont.icon-zhiding {
        font-size: 32px;
        line-height: 40px;
      }
    }
  }

  .app-west {
    background: url("../../assets/side-bar_bottombg.png") no-repeat left bottom, rgba(21, 116, 197, 0.2);
    position: relative;
    &--collapsed {
      overflow-y: inherit;
    }
  }

  .app-center {
    overflow: hidden;
  }

  .search-wrap {}

  .el-loading-mask {
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: none;
    z-index: 995;
    &.action {
      display: block;
    }
  }

  .miniClass {
    text-align: center;
  }

  .cate__top {
    text-align: center;
    position: absolute;
    width: 40px;
    height: 15px;
    bottom: -17px;
    left: 50%;
    margin-left: -20px; // bottom: -15px;
    z-index: 1;
    border: 1px solid #ccc;
    border-top: none; // margin-bottom: -15px;
    color: #999;
    cursor: pointer;
    opacity: 0.7;
    &:hover {
      background: #f9f9f9;
      box-shadow: 1px 0 3px rgba(0, 0, 0, .2);
      opacity: 1;
    }
  }

  .cate__arrow {
    position: absolute;
    width: 15px;
    height: 40px;
    background: #fff;
    top: 50%;
    margin-top: -20px;
    z-index: 3;
    border-right: 1px solid #ccc;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    line-height: 40px;
    color: #999;
    cursor: pointer;
    opacity: 0.7;
    &:hover {
      background: #f9f9f9;
      box-shadow: 1px 0 3px rgba(0, 0, 0, .2);
      opacity: 1;
    }
  }

  .empty {
    background: #fff;
    transform: scale(1.5) translateY(-50%);
  }

  .compact__item {
    label {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .compact__item img {
    cursor: pointer;
    margin-right: 5px;
  }

  .compact__wrap.compact__wrap--grid {
    .compact__box {
      >.table {
        box-sizing: border-box;
        border-right: 1px solid #ddd;
      }
      >.compact__item {
        display: inline-block;
      }
      >.compact__item.img__item {
        margin-right: 20px;
      }
    }
  }

</style>
<style lang="scss" scoped>
  .clone-icon {
    transition: all 0.5s;
  }
  /*新增修改添加*/

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
    padding: 0;
    height: calc(100vh - 140px);
    overflow: hidden;
  }

  .el-select>.el-input {
    width: 75px;
  }

</style>
<!-- 调整样式 -->
<style lang="scss" scoped>
  .compact:hover {
    background-color: #deeffa;
  }

  .compact__box {
    line-height: 30px;
    width: 100%;
    .compact__item,
    .compact__item--point,
    .compact__objitem--point {
      margin-right: 46px;
      line-height: 30px;
    }
  }

  .compact {
    .compact__serial {
      position: relative;
      top: -5px;
    }
  }

  .compact__item label {
    color: #9c9c9c;
  }

  .compact__wrap--grid {
    .compact__title {
      background: #e3f2fa;
    }
    .compact__item {
      margin-right: 0;
    }
  }

</style>

<script>
  import { mapState } from 'vuex'
  import { GET_TABLE_INFO, SEARCH_NEXT_PAGE } from '../../store/types'
  import { save, get } from '../../utils/storage'
  import {
    FWZX_PATH
  } from '../../config'

  import TopBar from '../common/topbar/index.vue'
  import mixin from '../../utils/mixin'
  import infoDialogEvents from '../../utils/infoDialogEvents'
  import { arrayGetRid, clone, fitSize, tableFill } from '../../utils/util'
  import '../../utils/dateFormat'

  import screenshot from '../../widgets/html-image/html-to-image'
  import pagination from '../../widgets/pagination/pagination'

  import catTree from './cat-tree'
  import sideRightBox from '../control/side-right-box.vue'
  import rightBar from './right-bar.vue'

  import dialogShare from '../../widgets/share-dialog/share-dialog.vue'
  import dialogPushDataPool from '../../widgets/push-data-pool-dialog/push-data-pool-dialog'
  import dialogExport from './dialog-export'
  import dialogSort from './dialog-sort'
  import dialogTemp from './dialog-temp'
  import dialogInfo from '../../widgets/info-dialog/info-dialog'
  import dialogLink from './dialog-link'

  export default {
    mixins: [mixin, infoDialogEvents],
    components: {
      TopBar,
      pagination,
      catTree,
      sideRightBox,
      rightBar,
      dialogShare,
      dialogPushDataPool,
      dialogExport,
      dialogSort,
      dialogTemp,
      'dialog-people-info': dialogInfo,
      'dialog-car-info': dialogInfo,
      'dialog-mobile-info': dialogInfo,
      dialogLink,
      screenshot
    },
    data() {
      return {
        labels: '',
        loadingFlag: false,
        keywordAll: '',
        searchForms: {},
        searchForm: {},
        conditionData: [],
        currentItemId: '',
        mlbh: '',
        test: '',
        secondKeys: '',
        secondFlag: false,
        scrollCount: 0,
        useMilliesecond: null,
        exportTabID: '',
        trunk: FWZX_PATH, // 总线
        exportIDs: [],
        miniWest: false,
        miniTop: false,
        maskLoading: false,
        showTips: true,
        searchDialog: false,
        type: 1,
        showRightBar: false,
        tableHeight: 0,
        miniModel: false,
        shareDialog: false,
        pushDataPoolDialog: false,
        exportDialog: false,
        sortDialog: false,
        tempDialog: false,
        linkDialog: false,
        selectedRows: [],
        shareContent: {
          text: '',
          value: null
        },
        inputValue: '',
        detail: null,
        dataPool: [],
        listType: 2,
        secondKey: '',
        treeQuery: {},
        queryForm: {
          cateName: '',
          cateId: ''
        },
        treeRes: null,
        count: 0,
        hitCount: 0,
        pagenav: {
          currentPage: 0,
          size: 20
        },
        currentTabeId: '',
        nextQuery: null,
        rightData: [],
        isFirst: false,
        columns: [],
        columnsMap: {},
        list: [],
        temp: [],
        currentTab: 0,
        tabs: [],
        sortQuery: null,
        heightLightKeys: '',
        screenshotState: false, // 截屏
        selectOption: [
          { label: '全部', value: 0 }
        ],
        searchWhere: {},
        selectValue: 0,
        flag: false,
        exportData: '',
        treeData: [{
          label: '人员',
          id: '1',
          children: []
        }, {
          label: '活动',
          id: '2',
          children: []
        }, {
          label: '案事件',
          id: '3',
          children: []
        }, {
          label: '物品',
          id: '4',
          children: []
        }, {
          label: '组织',
          id: '5',
          children: []
        }, {
          label: '地址',
          id: '6',
          children: []
        }, {
          label: '其他',
          id: '7',
          children: []
        }]
      }
    },
    computed: {
      isAll() {
        let res = false,
          len = this.list.length
        if (len < this.pagenav.size || len === this.count || len > this.count) {
          res = true
        }
        return res
      },
      tableHeights() {
        return document.body.clientHeight - 133
      },
      queryData() {
        return get('ngw_search_searchWhere_' + this.$route.query.key)
      },
      resList() {
        let res = [...this.list]
        // 排序
        if (this.sortQuery !== null && this.type === 1) {
          res.sort((a, b) => {
            let itemA = a[this.sortQuery.column] || '',
              dateA = new Date(itemA),
              itemB = b[this.sortQuery.column],
              dateB = new Date(itemB),
              isDateTime = dateA.getFullYear() === parseInt(itemA.substr(0, 4))
            if (this.sortQuery.type === 'desc') {
              return isDateTime === true ? dateB - dateA : itemB - itemA
            } else {
              return isDateTime === true ? dateA - dateB : itemA - itemB
            }
          })
        }
        this.exportIDs = res.map(d => {
          for (let i in d) {
            if (i.indexOf('xxzjbh') !== -1) {
              return d[i]
            }
          }
        })
        return res
      },
      ...mapState(['search'])
    },
    watch: {
      // pagenav: {
      //   handler: function(val, oldVal) {
      //     if (val.currentPage === 1) {
      //       this.nextQuery = {
      //         TableName: this.treeRes.id, // 指定表名
      //         RowIndex: 0, // 开始行数下标（把当前行数提交回来就可以）
      //         TypeId: this.queryData.TypeId, // 要素类型，选择的要素ID
      //         SearchType: this.queryData.SearchType, // 检索类型，全部 = 0,要素 = 1, 找人专题 = 2,案件专题 = 3,车辆专题 = 4,旅业专题 = 5,高危专题 = 6
      //         SearchWhere: this.queryData.SearchWhere, // 查询条件
      //         ScrollID: null
      //       }
      //     }
      //     // this.fetchList()
      //   },
      //   deep: true
      // },
      '$route' (to, from) {
        this.$router.go(0)
      },
      scrollCount(oldVal, newVal) {
        let obj = this.$('.dataTable')
        console.log(obj.eq(obj.length - 1).offset().top - this.$('.search__table-box').height(), obj.eq(obj.length - 1).offset().top, this.$('.search__table-box').height(), 'top 222222222222222222222')
        if (this.isAll === false && obj.eq(obj.length - 1).offset().top - this.$('.search__table-box').height() < 220) {
          if (this.loading === false) {
            this.scollFn()
          }
        }
      }
    },
    methods: {
      clearData() {
        this.searchForm = {}
        this.keywordAll = ''
      },
      makeSure() { // 高级搜索条件确定
        Object.keys(this.searchForms).map(item => {
          this.conditionData.map((item1) => {
            if (item1.escolumnsname === item && this.searchForms[item]) {
              item1.is_defualt = '1'
              this.searchForm[item] = this.searchForms[item]
              return false
            }
          })
        })
        this.searchDialog = false;
      },
      searchSubmit(val) { // 搜索内容
        this.heightLightKeys = []
        this.loadingFlag = true;
        let jsonData = {}
        if (val === 1) {
          jsonData = this.searchForm
        } else {
          jsonData = this.searchForms
        }
        let searchWhere = []
        let flag = false
        Object.keys(jsonData).map(item => {
          this.conditionData.map((item1) => {
            if (item1.escolumnsname === item && jsonData[item]) {
              let jsons = {
                escolumnsname: item,
                escolumnsvalue: jsonData[item],
                datatype: item1.datatype
              }
              if (item1.datatype === 'DATE') {
                jsons.escolumnsvalue = this.dateFormat(new Date(jsonData[item]), 'yyyy-MM-dd')
              }
              this.heightLightKeys.push(jsons.escolumnsvalue)
              flag = true
              searchWhere.push(jsons)
              return false
            }
          })
        })
        if (this.keywordAll && val === 1) { flag = true }
        let keyword = val === 2 ? '' : this.keywordAll,
          mlbh = this.mlbh,
          establename = this.search.getTableInfo[0].esindexname,
          from = this.pagenav.currentPage * 20,
          size = this.pagenav.size;
        if (!flag) {
          this.$alert('请填写要查询的条件', '温馨提示')
          this.loadingFlag = false;
          return
        }
        if (keyword) {
          this.heightLightKeys.splice(0, 0, keyword)
        }
        this.list = []
        this.searchWhere = { keyword, searchWhere, mlbh, establename, from, size }
        this.dispatch(SEARCH_NEXT_PAGE, { keyword, searchWhere, mlbh, establename, from, size }).then(() => {
          this.loadingFlag = false;
          if (this.search.searchNextPage.esReturn.hits.hits.length > 0 && this.search.searchNextPage.esReturn) {
            this.useMilliesecond = this.search.searchNextPage.esReturn.took;
            this.handlerData(this.conditionData, this.search.searchNextPage.esReturn.hits.hits)
            this.search.searchNextPage.esReturn.hits.hits.map(item => {
              this.list.push(item._source)
            })
            this.count = this.search.searchNextPage.esReturn.hits.total
            this.showTips = false;
          } else {
            this.showTips = true;
            this.count = null;
            this.list = []
          }
          this.searchDialog = false;
        })
        this.searchDialog = false;
      },
      scollFn() {
        this.pagenav.currentPage++;
        this.loadingFlag = true;
        this.searchWhere.from = this.pagenav.currentPage * 20
        this.dispatch(SEARCH_NEXT_PAGE, this.searchWhere).then(() => {
          this.loadingFlag = false;
          if (this.search.searchNextPage.esReturn.hits.hits.length > 0 && this.search.searchNextPage.esReturn) {
            this.handlerData(this.conditionData, this.search.searchNextPage.esReturn.hits.hits)
            this.search.searchNextPage.esReturn.hits.hits.map(item => {
              this.list.push(item._source)
              this.count = this.search.searchNextPage.esReturn.hits.total
            })
            this.showTips = false;
          } else {
            this.showTips = true;
          }
          this.searchDialog = false;
        })
      },
      searchGaoji() { // 高级搜索dialog弹框状态
        this.searchForms = this.searchForm
        this.searchDialog = true;
      },
      secondSearch() {
        this.secondFlag = true;
        let pagenav = { currentPage: 1, size: 20 }
        this.fetchList(pagenav)
      },
      isIdCardNumber(type, num) {
        return type === 'idCard' && num && num.length >= 15
      },
      /**
       * [fetchList 拉取搜索结果列表]
       */
      handlerData(columnsData, listData) {
        this.columns = this.search.getTableInfo[0].showColumns.map(c => {
          return {
            id: c.ID,
            label: c.sjxzwmc,
            prop: c.escolumnsname,
            tableId: this.search.getTableInfo[0].esindexname,
            tableName: this.search.getTableInfo[0].mlm,
            collectTime: this.search.getTableInfo[0].dwindexname + '_xdh_cjsj',
            type: this.getColumnsType(c.sjybsf),
            order: this.search.getTableInfo[0].xh || 99,
            disabled: c.is_db === '0',
            isDefault: c.is_defualt === '1'
          }
        })
        this.exportTabID = this.search.getTableInfo[0].esindexname
        // let arr = []
        // listData.map(item => {
        //   let arr1 = []
        //   columnsData.map(item1 => {
        //     if (item._source[item1.escolumnsname]) {
        //       let jsons = {
        //         name: item1.sjxzwmc,
        //         value: item._source[item1.escolumnsname]
        //       }
        //       arr1.push(jsons)
        //     }
        //   })
        //   arr.push(arr1)
        // })
        // console.log(arr, 'arr 8888888888888')
      },
      fetchList(pagenav) {
        // let mlbh = this.mlbh
        // console.log(pagenav, 'pagenav222222222222')
        // this.dispatch(GET_TABLE_INFO, { mlbh }).then(() => {
        //   console.log(this.search.getTableInfo, 'this.search.getTableInfo 22222222')
        // })
      },
      fetchItemList() {
        this.dispatch(GET_TABLE_INFO, { mlbh: this.mlbh }).then(() => {
          this.conditionData = this.search.getTableInfo[0].showColumns
          this.miniTop = true
          this.loadingFlag = false;
        })
      },
      updateKeywords(val) {
        this.heightLightKeys = [...val]
      },
      /**
       * [updateCat 左侧树菜单点击事件]
       * @param  {[type]} val [description]
       */
      updateCat(val, formRightbar, options) { // 左侧菜单树点击事件
        if (!val.data.mlbh) {
          return
        }
        this.searchForms = {}
        this.searchForm = {}
        this.mlbh = val.data.mlbh
        this.loadingFlag = true;
        this.count = null;
        this.treeRes = {
          authority: true,
          columns: null,
          count: null,
          id: val.data.esindexname,
          label: val.data.label,
          parentId: val.data.ywfldm,
          sx: val.data.sx
        }
        this.searchWhere = {}
        this.fetchItemList();
        this.list = []
      },
      /**
       * [addTemp 添加临时储存]
       * @param {[type]} e    [description]
       * @param {[type]} item [description]
       */
      addTemp(e, item, index) {
        //        let cusIcon, cusBox
        if (this.temp.find(d => d.id === item._id && index === d.index - 1)) {
          // this.$alert('该条数据已存在临时储存, 无需重复添加.', '温馨提示');
        } else {
          // 添加本地储存小动画
          let $target = this.$(e.target),
            offset = $target.offset(),
            $icon = $target.clone().addClass('clone-icon').css({
              position: 'absolute',
              left: offset.left,
              top: offset.top,
              zIndex: 999
            }).appendTo(document.body)
          let toOffset = this.$(this.$refs.cusBox.$el).offset()
          $icon.css({
            top: toOffset.top,
            left: toOffset.left
          })
          setTimeout(() => {
            $icon.remove()
          }, 500)
          let $mainBox = this.$('#searchResTable .el-table__body-wrapper')
          let newList = clone(this.list)
          // 跟新之前保存的相同表的列表数据
          this.temp.forEach(n => {
            if (n.tableId === this.treeRes.id) {
              n.list = newList
            }
          })
          this.temp.push({
            tableName: this.treeRes.label,
            tableId: this.treeRes.id,
            id: item._id,
            index: index + 1,
            item: item,
            treeParams: this.$refs.catTree.currentItem,
            list: newList,
            columns: clone(this.columns),
            scrollTop: $mainBox.scrollTop(),
            keyword: this.tabs[this.currentTab].keyword,
            count: this.count,
            nextQuery: clone(this.nextQuery)
          })
        }
        this.$message('添加成功')
      },
      /**
       * [handleTempClick 恢复临时储存]
       * @param  {[type]} item [description]
       * @return {[type]}      [description]
       */
      handleTempClick(item) {
        this.$('.dataTable').css('background', 'transparent').find('td').css('background', 'transparent')
        this.$('.dataTable').eq(item.index - 1).css('background', '#b0daf1').find('td').css('background', '#b0daf1')
        this.$('.search__table-box').scrollTop(this.$('.search__table-box').scrollTop() + this.$('.dataTable').eq(item.index - 1).offset().top - 100)
        this.$refs.catTree.currentItemId = item.tableId
        this.list = item.list
        this.columns = item.columns
        this.tabs[this.currentTab].keyword = item.keyword
        this.tabs[this.currentTab].pagenav.currentPage = item.page
        this.count = item.count;
        // this.treeRes.label = item.tableName
        this.nextQuery = item.nextQuery
        this.$nextTick(() => {
          let $mainBox = this.$('#searchResTable .el-table__body-wrapper')
          $mainBox.scrollTop(item.scrollTop)
        })
      },
      rowClassName(row, index) {
        let item = this.temp.find(item => {
          return item.id === row._id
        })
        return item ? 'temp_tr' : ''
      },
      /**
       * [updateSort 排序更新事件]
       * @param  {[type]} obj [description]
       */
      updateSort(obj) {
        this.sortQuery = obj
        this.sortDialog = false
      },
      openSortDialog() {
        this.sortDialog = true
      },
      /**
       * [changeTab 页签切换事件]
       * @param  {[type]} i [description]
       */
      changeTab(i) {
        let tab = this.tabs[i]
        this.currentTab = i
        this.treeQuery = clone(tab.treeQuery)
        this.nextQuery = clone(tab.nextQuery)
        this.list = [...tab.list]
        // this.pagenav = clone(tab.pagenav)
      },
      /**
       * [addKey 增加关键字(暂弃用)]
       */
      addKey() {
        if (!this.tabs.find(k => k.keyword === this.secondKey)) {
          this.tabs.push({
            keyword: this.secondKey
          })
          this.changeTab(this.tabs.length - 1)
        }
      },
      /**
       * [addTab 添加面签(聚类历史)]
       */
      addTab(pagenav) {
        let obj = {
          keyword: this.treeQuery.SearchWhere.map(d => d.Keyword).join('_'),
          treeQuery: clone(this.treeQuery),
          nextQuery: clone(this.nextQuery),
          list: [],
          pagenav: pagenav
        }
        this.tabs.push(obj)

        this.currentTab = this.tabs.length - 1
        // this.changeTab(this.tabs.length - 1)
      },
      /**
       * [removeTab 移除页签]
       * @param  {[type]} v [description]
       * @return {[type]}   [description]
       */
      removeTab(v) {
        if (this.tabs.length > 1) {
          arrayGetRid(this.tabs, [v])
          this.changeTab(this.tabs.length - 1)
        }
      },
      /**
       * [fitEvent 页面尺寸变更时相应操作]
       */
      fitEvent() {
        let res = fitSize(1380, [620, 720], [350, 730]) // 480
        this.miniModel = res.mini
        // this.tableHeight = res.height

        // tableFill(this.$, '.app-content', false, this.$(window).height() - 60 - 30)
        this.tableHeight = tableFill(this.$, '.app-content', this.$('#searchResTable'), this.$(window).height() - 60 - 10)
      },
      /**
       * [switchToolbar 切换右侧栏显示隐藏状态]
       */
      switchToolbar() {
        this.showRightBar = this.showRightBar === false
      },
      getAcqTime(item) {
        let columns = (!item.ngw_table_sign ? this.columns : this.columnsMap[item.ngw_table_sign])
        if (columns && columns[0]) {
          return item[columns[0].collectTime]
        } else {
          return ''
        }
      },
      pushDataPool(data) {
        let columns = !data.ngw_table_sign ? this.columns : this.columnsMap[data.ngw_table_sign]
        this.dataPool = []
        let ids = ''
        Object.keys(data).map((item, idx) => {
          if (item.indexOf('xxzjbh') !== -1) {
            ids = data[item]
            return false
          }
        })
        // this.conditionData.map(item => {
        //   item.
        // })
        // this.heightLightKeys
        this.dataPool.push({
          TableID: columns[0].tableId,
          SjID: ids,
          columns: columns,
          data: data
        })
        this.pushDataPoolDialog = true
      },
      updateTableSelection(val) {
        this.selectedRows = val
      },
      /**
       * [exportSingle 导出单条数据]
       * @return {[type]} [description]
       */
      exportSingle(id) {
        alert('单条ID: ' + id)
      },
      /**
       * [exportSelected 导出已选数据]
       * @return {[type]} [description]
       */
      exportSelected() {
        // this.$message('此处正在施工中……123')
        this.$confirm('请确认导出数据吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            'Ids': this.exportIDs,
            'Tables': [{ 'ID': this.exportTabID }],
            'token': this.userData.UserToken
          }
          this.exportData = JSON.stringify(data)
          this.$message({
            type: 'warning',
            message: '正在下载请稍等',
            showClose: true
          })
          this.$nextTick(() => {
            this.$refs['postform'].submit()
          })
        }).catch(() => {})
        // if (this.selectedRows.length === 0) {
        //   this.$alert('最少选择一行数据进行导出', '温馨提示')
        // } else {
        //   alert('已选: ' + this.selectedRows.filter(d => d['_id'] !== '***').map(d => d['_id']).join(','))
        // }
      },
      /**
       * [share 分享内容]
       * @param  {[type]} item [description]
       * @return {[type]}      [description]
       */
      share(item) {
        let content = '';
        (!item.ngw_table_sign ? this.columns : this.columnsMap[item.ngw_table_sign]).forEach(column => {
          if (item[column.prop]) {
            content += `[${column.label}]: ${item[column.prop]} `
          }
        })
        this.shareContent.value = item
        this.shareContent.text = content
        this.shareDialog = true
      },
      // 菜单收缩
      miniSlider() {
        this.miniWest = !this.miniWest
      },
      filterOnlyIdCardData(data, columns) {
        let res = []
        columns.forEach(column => {
          if (this.isIdCardNumber(column.type, data[column.prop]) && !res.find(c => data[c.prop] === data[column.prop])) res.push(column)
        })
        return res
      },
      // 搜索栏
      searchWord() {
        if (this.checkRule('Search/SearchNextPage') === false) {
          return false
        }

        let keyword = this.inputValue,
          subKeyword

        // 除空格
        if (keyword.indexOf(' ') !== -1) {
          subKeyword = keyword.split(' ').join('')
        } else {
          subKeyword = keyword
        }
        if (subKeyword === '') {
          this.$alert('请先输入关键字', '温馨提示');
        } else if ((/[\u4e00-\u9fa5]/).test(subKeyword) && keyword.length <= 1) {
          this.$alert('请输入两个以上包含中文的字符', '温馨提示');
        } else if (!(/[\u4e00-\u9fa5]/).test(subKeyword) && keyword.length <= 4) {
          this.$alert('请输入至少5个非中文字符', '温馨提示');
        } else {
          let formData = {
            SearchWhere: [{
              Keyword: this.inputValue,
              KeywordType: 0,
              Name: this.selectValue === 0 ? '全部' : '要素',
              SearchType: this.selectValue
            }],
            TypeId: 0,
            SearchType: 0,
            TableIDs: [],
            FlTypeIDs: []
          }
          // 查询对象存入本地储存, 方便跨页取数据
          save('ngw_search_searchWhere_' + this.inputValue, formData)
          save('ngw_search_catTreeData', null)
          this.$router.push({
            path: '/search/result',
            query: { key: this.inputValue, type: this.selectValue }
          })
        }
      },
      // 置顶
      backTop() {
        this.$('.app-west')[0].scrollTop = 0
      },
      // 展开和收起
      showMore(i) {
        this.$set(this.resList[i], 'flag', !this.resList[i].flag)
        if (this.resList[i].flag) {
          this.test = ' '
        } else {
          this.test = '  '
        }
        this.resList.push(null)
        this.resList.pop()
      },
      getColumns(scope, mode = 0) {
        let columns,
          columnsRes = []
        if (!scope.ngw_table_sign) {
          columns = this.columns
        } else {
          columns = this.columnsMap[scope.ngw_table_sign]
        }
        if (mode === 0) {
          columnsRes = columns.filter(d => scope[d.prop] !== '')
        }
        if (mode === 1) {
          columnsRes = columns.filter(d => scope[d.prop] !== '' && (scope.flag ? true : d.isDefault === true))
        }
        if (mode === 2) {
          let j = 0
          columns = columns.filter(d => scope[d.prop] !== '' && (scope.flag ? true : d.isDefault === true))
          columns.forEach((d, i) => {
            if (!columnsRes[j]) columnsRes.push([])
            columnsRes[j].push(columns[i])
            if ((i + 1) % 4 === 0) {
              j++
            }
          })
        }
        return columnsRes
      },
      renderContent(h, { data, node, store }) {
        let content = h('span', {
          class: {
            'cat-tree__item': true, 'cat-tree__item__current': data.id === this.currentItemId, 'tree-root': node.level === 1
          },
          on: {
            click: () => {
              this.clickEvents(data, node, store)
            }
          }
        }, [h('i', {
          // class: 'iconfont icon-note'
        }), h('span', {
          class: 'cat-tree__item__label',
          attrs: { title: data.label }
        }, data.label)])
        return content
      },
      clickEvents(data, node, store) {
        if (data.id === '1') return false
        if (node.isLeaf === true) {
          if (data.authority === false) {
            this.$alert('你没有权限查询该表数据, 请联系管理员开通.', '温馨提示');
          } else if (this.currentItemId === data.id) {
            return false
          } else {
            this.currentItemId = data.id
          }
        } else {
          return false
        }
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      }
    },
    updated() {},
    created() {
      window.addEventListener('resize', (e) => {
        this.fitEvent()
      })
    },
    mounted() {
      // 定义页面标题
      document.title = '单库搜索-智慧警务'
      let self = this
      // 滚动加载更多数据
      window.onmousewheel = function() {
        if (self.listType === 2) {
          self.scrollCount = self.$('.search__table-box').scrollTop();
        } else {
          self.scrollCount = self.$('#searchResTable').scrollTop();
          console.log(self.scrollCount, 'scrollCount 3333333333333333')
        }
      }
      this.$refs.dialogTemp.$on('remove', index => {
        this.temp.splice(index, 1)
      })
    }
  }

</script>
