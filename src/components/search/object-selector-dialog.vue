<template>
<el-layout class="app-layout" :fit="true">

  <!-- 通顶 -->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar></top-bar>
  </el-region>

  <!-- 侧边栏(分类树) -->
  <el-region :class="{'app-west': true}" slot="west" type="west" :zoom="false" :fixed="false">
    <cat-tree ref="catTree" class="cat-tree" :query="treeQuery" @update:keywords="updateKeywords" @update:value="updateCat"></cat-tree>
  </el-region>

  <!-- 内容区 -->
  <el-region class="app-center" slot="center" type="center">

    <!-- <div class="el-loading-mask">
      <div class="el-loading-spinner"></div>
    </div> -->

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
            <!-- <el-input v-model="secondKey" placeholder="搜索" icon="search" style="margin:3px 0;" @click="addKey"></el-input> -->
          </el-col>
        </el-row>
      </div>

      <!-- 工具栏 -->
      <div class="app-toolbar app-toolbar--search clearfix rel" v-if="this.treeRes!==null">
        <el-row>
          <el-col class="query-box" :span="miniModel?11:7">
            <div class="query-box__item">
              <label class="query-box__item__name">条件</label>{{count}}
            </div>
            <div class="query-box__item">
              <label class="query-box__item__name">命中</label>{{count}}
            </div>
            <div class="query-box__item">
              <label class="query-box__item__name">资源</label>{{this.treeRes.label}}
            </div>
          </el-col>
          <el-col :class="{'ctrl-box':true,'ctrl-box--mini':miniModel}" :span="miniModel?13:17">
            <el-button type="" :title="miniModel?'快照':''" @click="screenshotState=true">
              <i class="iconfont icon-image"></i>
              <span v-show="!miniModel">快照</span>
            </el-button>
            <el-button type="" @click="exportDialog=true" :title="miniModel?'数据导出':''">
              <i class="iconfont icon-export"></i>
              <span v-show="!miniModel">数据导出</span>
            </el-button>
            <!-- <el-button type="" :title="miniModel?'移入案件池':''">
              <i class="iconfont icon-move"></i>
              <span v-show="!miniModel">移入案件池</span>
            </el-button> -->
            <el-button type="" :title="miniModel?'数据对比':''">
              <i class="iconfont icon-copy"></i>
              <span v-show="!miniModel">数据对比</span>
            </el-button>
            <el-button type="" @click="linkDialog=true" :title="miniModel?'检索链路':''">
              <i class="iconfont icon-link"></i>
              <span v-show="!miniModel">检索链路</span>
            </el-button>
            <el-button type="" @click="openSortDialog" :title="miniModel?'排序':''" v-if="type===1">
              <i class="iconfont icon-paixu"></i>
              <span v-show="!miniModel">排序</span>
            </el-button>
            <el-button type="" @click="tempDialog=true" ref="cusBox" :title="miniModel?'添加临时储存':''">
              <i class="iconfont icon-folder-open"></i>
              <span v-show="!miniModel">临时储存</span>
              <span>{{temp.length}}</span>
            </el-button>

            <!-- 列表模式切换 -->
            <el-button-group>
              <el-button v-if="type!==2" type="" @click="listType=2" :class="{action:listType===2}" title="列表模式">
                <i class="iconfont icon-fold"></i>
              </el-button>
              <el-button type="" @click="listType=1" :class="{action:listType===1}" title="紧凑模式">
                <i class="iconfont icon-card-list"></i>
              </el-button>
              <el-button :class="{action:showRightBar===true}" v-show="type!==2" type="" title="筛选" @click="switchToolbar">
                <i class="iconfont icon-sousuo"></i>
              </el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </div>

      <!-- 内容区 -->
      <div class="app-content">
        <!-- 列表 -->
        <!-- v-loading.body="loading" -->
        <el-table @cell-mouse-enter="listType===2?cellMouseEnter:()=>{}" id="searchResTable" class="app-table" :show-header="listType===2" :data="resList" :border="true" style="width:100%;" :height="tableHeight">
          <!-- <el-table-column type="selection" :class-name="listType===1?'compact':''" label="选择"></el-table-column> -->
          <el-table-column v-if="listType===2" type="index" label="序号" width="80">
            <template scope="scope">{{scope.$index+1}}</template>
</el-table-column>

<el-table-column v-if="listType===2" v-for="column in columns" :prop="column.prop" :label="column.label" :key="column.id">
  <template scope="scope">
                <span v-html="heightLightElms(scope.row[column.prop] ,heightLightKeys)"></span>
              </template>
</el-table-column>

<el-table-column v-if="listType===2" label="操作">
  <template scope="scope">
                <el-button type="text" size="small">
                  <i class="iconfont icon-share" title="分享"></i>
                </el-button>
                <el-button type="text" size="small" @click="addTemp($event,scope.row)" title="添加到临时储存">
                  <i class="iconfont icon-save"></i>
                </el-button>
                <el-button type="text" size="small" @click="exportDialog=true" title="导出数据">
                  <i class="iconfont icon-export"></i>
                </el-button>
              </template>
</el-table-column>

<el-table-column v-if="listType===1" class-name="compact" label="内容集">
  <template scope="scope">
                <div class="compact__wrap">
                  <div class="compact__serial">
                    <el-tag type="primary">{{scope.$index+1}}</el-tag>
                  </div>
                  <div class="compact__box">
                    <div class="compact__title">
                      采集时间: {{getAcqTime(scope.row)}}
                      <!-- <el-button type="text" size="small">
                        <i class="iconfont icon-share" title="分享"></i>
                      </el-button> -->

                      <!-- <el-button type="text" size="small" @click="addTemp($event,scope.row)" title="添加到临时储存">
                        <i class="iconfont icon-save"></i>
                      </el-button> -->
                      <el-button type="text" size="small" @click="pushDataPoll(scope.row['_id'], !scope.row.ngw_table_sign ? columns : columnsMap[scope.row.ngw_table_sign])" title="移入案件池">
                        <i class="iconfont icon-export"></i>
                      </el-button>
                      <!-- <el-button type="text" size="small" @click="exportDialog=true" title="导出数据">
                        <i class="iconfont icon-export"></i>
                      </el-button> -->
                    </div>

                    <!-- 内容 -->
                    <div :class="{'compact__item':true,'compact__item--point':column.type!==null}"
                       v-for="column in (!scope.row.ngw_table_sign ? columns : columnsMap[scope.row.ngw_table_sign])"
                       v-if="scope.row[column.prop]!==''"
                       :key="column.id"
                       @click="colOnClickEvent(column.type,scope.row[column.prop],scope.row)"
                     >
                      <label v-html="column.label"></label>
                      <span v-html="heightLightElms(scope.row[column.prop], heightLightKeys)"></span>
                    </div>

                  </div>
                </div>
              </template>
</el-table-column>
</el-table>

<!-- 右侧栏 -->
<side-right-box style="width:220px; height:calc(100% - 185px); top:152px;" :unfoldHandle="showRightBar">
  <right-bar class="cat-tree" :data="rightData" @update:value="val=>updateCat(val,true)"></right-bar>
</side-right-box>

<div :class="{empty:true,'empty--tips':this.treeRes===null}" v-show="showTips===true">
  <span v-if="this.treeRes===null">请从左边树菜单选择地区或要素</span>
</div>

<i ref="cusIcon" class="cus-save-icon iconfont icon-save"></i>

<dialog-push-data-pool :data="poolData" :dialog="pushDataPoolDialog" @close="pushDataPoolDialog=false"></dialog-push-data-pool>
<dialog-export :dialog="exportDialog" @close="exportDialog=false"></dialog-export>
<dialog-sort :dialog="sortDialog" :columns="columns" @close="sortDialog=false" @update:value="updateSort"></dialog-sort>
<dialog-temp :dialog="tempDialog" :data="temp" @close="tempDialog=false"></dialog-temp>

<dialog-people-info :dialog="peopleInfoDialog" :data="infoDialogData" @close="peopleInfoDialog=false" @call:dialog="openInfoDialog"></dialog-people-info>
<dialog-car-info :dialog="carInfoDialog" :data="infoDialogData" @close="carInfoDialog=false" @call:dialog="openInfoDialog"></dialog-car-info>
<dialog-mobile-info :dialog="mobileInfoDialog" :data="infoDialogData" @close="mobileInfoDialog=false" @call:dialog="openInfoDialog"></dialog-mobile-info>

<dialog-link :dialog="linkDialog" @close="linkDialog=false"></dialog-link>
</div>

<!-- 分页, 弃用, 采用滚动加载 -->
<!-- <div class="app-toolbar" v-if="list.length > 0">
                    <pagination :count="count" :pagenav="pagenav" mode="prev, pager, next, jumper" @update:pagenav="val => this.pagenav = val"></pagination>
                  </div> -->
</div>

<!-- 快照 -->
<screenshot :submit="screenshotState" @generate="screenshotState = false"></screenshot>

<div :class="{'el-loading-mask':true,'action':maskLoading}">
  <div class="el-loading-spinner loader--circular"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div>
</div>
</el-region>

<el-region class="app-south" slot="south" :zoom="false" :fixed="false" type="south">
  <!-- <span>技术支持：珠海市新德汇信息技术有限公司</span> -->
</el-region>
</el-layout>
</template>

<style lang="scss" scoped>
  .app-north {
    position: relative;
    z-index: 998;
  }

  .app-west {
    background: #fff;
    width: 220px;
    border-right: 1px solid #d7d7d7;
  }

  .app-center {
    overflow: hidden;
  }

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

  .empty {
    background: #fff;
    transform: scale(1.5) translateY(-50%);
  }

</style>

<script>
  import { mapState } from 'vuex'
  import { SEARCH_RESULT, SEARCH_AGGR_RESULT, SEARCH_AGGR_TREE_RESULT } from '../../store/types'
  import { get } from '../../utils/storage'

  import { setStyle } from '../../../node_modules/element-ui/src/utils/dom'
  import TopBar from '../common/topbar/index.vue'
  import mixin from '../../utils/mixin'
  import infoDialogEvents from '../../utils/infoDialogEvents'
  import { arrayGetRid, clone, fitSize, tableFill } from '../../utils/util'
  // import '../../utils/heightLightElms'

  import screenshot from '../../widgets/html-image/html-to-image'
  import pagination from '../../widgets/pagination/pagination'

  import catTree from './cat-tree'
  import sideRightBox from '../control/side-right-box.vue'
  import rightBar from './right-bar.vue'

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
      'cat-tree': catTree,
      'side-right-box': sideRightBox,
      'right-bar': rightBar,
      'dialog-push-data-pool': dialogPushDataPool,
      'dialog-export': dialogExport,
      'dialog-sort': dialogSort,
      'dialog-temp': dialogTemp,
      'dialog-people-info': dialogInfo,
      'dialog-car-info': dialogInfo,
      'dialog-mobile-info': dialogInfo,
      'dialog-link': dialogLink,
      screenshot
    },
    data() {
      return {
        maskLoading: false,
        showTips: true,
        type: 1,
        showRightBar: false,
        tableHeight: 0,
        miniModel: false,
        pushDataPoolDialog: false,
        exportDialog: false,
        sortDialog: false,
        tempDialog: false,
        linkDialog: false,
        detail: null,
        poolData: [],
        listType: 1,
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
          currentpage: 1,
          limit: null
        },
        // isAll: false,
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
        screenshotState: false // 截屏
      }
    },
    computed: {
      isAll() {
        let res = false,
          len = this.list.length
        if (len < this.tabs[this.currentTab].pagenav.limit || len === this.count || len > this.count) {
          res = true
        }
        return res
      },
      queryData() {
        return get('ngw_search_searcWhere')
      },
      resList() {
        let res = [...this.list]
        // 排序
        if (this.sortQuery !== null && this.type === 1) {
          res.sort((a, b) => {
            if (this.sortQuery.type === 'aes') {
              return a[this.sortQuery.column] - b[this.sortQuery.column]
            } else {
              return b[this.sortQuery.column] - a[this.sortQuery.column]
            }
          })
        }
        return res
      },
      ...mapState(['search'])
    },
    watch: {
      pagenav: {
        handler: function(val, oldVal) {
          if (val.currentpage === 1) {
            this.nextQuery = {
              TableName: this.treeRes.id, // 指定表名
              RowIndex: 0, // 开始行数下标（把当前行数提交回来就可以）
              TypeId: this.queryData.TypeId, // 要素类型，选择的要素ID
              SearchType: this.queryData.SearchType, // 检索类型，全部 = 0,要素 = 1, 找人专题 = 2,案件专题 = 3,车辆专题 = 4,旅业专题 = 5,高危专题 = 6
              SearchWhere: this.queryData.SearchWhere, // 查询条件
              ScrollID: null
            }
          }
          // this.fetchList()
        },
        deep: true
      }
    },
    methods: {
      pushDataPoll(dataId, columns) {
        this.poolData.push({
          'TableID': dataId, // 数据的表ID
          'SjID': columns[0].tableId // 数据ID
        })
        this.pushDataPoolDialog = true
      },
      /**
       * [fetchList 拉取搜索结果列表]
       */
      fetchList(pagenav) {
        this.showRightBar = false
        this.showTips = false
        this.maskLoading = true
        // 默认:单表查询条件
        let currentTab = this.tabs[this.currentTab],
          currentpage = pagenav ? pagenav.currentpage : currentTab.pagenav.currentpage,
          rowIndex = (pagenav ? pagenav.limit : currentTab.pagenav.limit) * (currentpage - 1),
          queryAPI = SEARCH_RESULT,
          queryObj,
          aggregatObj

        if (currentpage === 1) {
          this.nextQuery = {
            TableName: this.currentTabeId, // 指定表名
            RowIndex: rowIndex, // 开始行数下标（把当前行数提交回来就可以）
            TypeId: this.queryData.TypeId, // 要素类型，选择的要素ID
            SearchType: this.queryData.SearchType, // 检索类型，全部 = 0,要素 = 1, 找人专题 = 2,案件专题 = 3,车辆专题 = 4,旅业专题 = 5,高危专题 = 6
            SearchWhere: this.queryData.SearchWhere, // 查询条件
            ScrollID: null,
            IsSearchAggregations: false // 是否需要聚类(默认false)
          }
        }
        queryObj = this.nextQuery

        // type:2, 多表查询条件
        if (this.type === 2) {
          queryAPI = SEARCH_AGGR_RESULT
          if (currentpage === 1) {
            this.treeQuery = queryObj
            queryObj.IsSearchAggregations = true // 多表查询, 直接更新聚类, 用于左侧栏
            this.treeQuery.ScrollID = null
            this.treeQuery.SearchWhere.push({
              Keyword: this.treeRes.label,
              KeywordType: 0,
              Name: 'type_' + this.treeRes.type + '_' + 'keyword_' + this.treeRes.label,
              SearchType: this.treeRes.type
            })

            // 添加历史
            this.addTab(pagenav || currentTab.pagenav)
          }
          // this.treeQuery.RowIndex = rowIndex
          // queryObj = this.treeQuery
        } else {
          if (this.currentTabeId !== this.treeRes.id) {
            queryObj.SearchWhere.push({
              Keyword: this.treeRes.label,
              KeywordType: 0,
              Name: 'type_' + this.treeRes.type + '_' + 'keyword_' + this.treeRes.label,
              SearchType: this.treeRes.type
            })
          }
        }

        // 读取接口
        this.dispatch(queryAPI, queryObj).then(() => {
          if (this.type === 2) {
            this.nextQuery = clone(this.search.searchAggrResult.SearchEntity)
            this.handleArrayData()
          } else {
            this.nextQuery = clone(this.search.searchResult.SearchNextPage)
            this.handleSingleData()
          }

          this.fitEvent()
          this.maskLoading = false
        })

        // 单表第一页时, 单独获取一次聚类, 用于右侧栏
        if (this.type === 1 && currentpage === 1) {
          this.rightData = []
          aggregatObj = queryObj
          aggregatObj.IsSearchAggregations = true
          this.dispatch(SEARCH_AGGR_TREE_RESULT, aggregatObj).then(() => {
            this.rightData = this.search.searchAggrTreeResult.Aggregations
          })
        }
      },
      /**
       * [handleSingleData 单表结果数据整理]
       */
      handleSingleData() {
        if (this.tabs[this.currentTab].pagenav.currentpage === 1) {
          this.isFirst = true
          this.list = []
        }
        this.hitCount = this.search.searchResult.Total
        this.columns = this.search.searchResult.TableInfo.Columns.map(c => {
          return {
            id: c.ID,
            label: c.FieldCn,
            prop: c.FieldEn,
            tableId: this.search.searchResult.TableInfo.ID,
            tableName: this.search.searchResult.TableInfo.ZyName,
            type: this.getColumnsType(c.Ybsf)
          }
        })
        // d.Source['ngw_table_sign'] = d.TableInfo.ID
        this.list = [...this.list, ...this.search.searchResult.Source]

        // 更新历史
        this.tabs[this.currentTab].list = [...this.list]
      },
      /**
       * [handleArrayData 多表数据聚合]
       */
      handleArrayData() {
        if (this.tabs[this.currentTab].pagenav.currentpage === 1) {
          this.isFirst = true
          this.columnsMap = {}
          this.list = []
        }
        let data = this.search.searchAggrResult.SearchDatas.filter(d => d.HasQx === true && d.Source !== null && d.TableInfo
          .Columns !== null && d.TableInfo.Columns.length > 0)
        data.forEach((d, i) => {
          this.columnsMap[d.TableInfo.ID] = d.TableInfo.Columns.map(c => {
            return {
              id: c.ID,
              label: c.FieldCn,
              prop: c.FieldEn,
              tableId: d.TableInfo.ID,
              tableName: d.TableInfo.ZyName,
              type: this.getColumnsType(c.Ybsf)
            }
          })

          // 多表原理, 在源数据中插入特殊字段, 纪录该条数据所属表信息
          d.Source.forEach(s => {
            s['ngw_table_sign'] = d.TableInfo.ID
          })

          this.list = [...this.list, ...d.Source]

          // 更新历史
          this.tabs[this.currentTab].list = [...this.list]
        })
      },
      updateKeywords(val) {
        this.heightLightKeys = val
      },
      /**
       * [updateCat 左侧树菜单点击事件]
       * @param  {[type]} val [description]
       */
      updateCat(val, formRightbar) {
        let pagenav = this.tabs[this.currentTab].pagenav
        this.list = []
        this.treeRes = val.data
        this.count = this.treeRes.count

        if (!formRightbar) {
          // 左栏事件
          this.type = val.type
          if (this.type === 2) {
            this.listType = 1
          }
          pagenav = {
            limit: val.limit || 20,
            currentpage: 1
          }
          if (this.type === 1) {
            this.currentTabeId = val.data.id
          }
        } else {
          // 右栏事件
          this.type = 1
          pagenav = {
            limit: pagenav.limit,
            currentpage: 1
          }
        }
        this.fetchList(pagenav)
      },
      /**
       * [addTemp 添加临时储存]
       * @param {[type]} e    [description]
       * @param {[type]} item [description]
       */
      addTemp(e, item) {
        // let cusIcon, cusBox
        if (this.temp.find(d => d.id === item.id)) {
          this.$alert('该条数据已存在临时储存, 无需重复添加.', '温馨提示');
        } else {
          // 添加本地储存小动画
          // cusIcon = this.$refs.cusIcon
          // cusBox = this.$refs.cusBox
          // setStyle(cusIcon, 'display', 'none')
          // setStyle(cusIcon, 'left', e.clientX + 'px')
          // setStyle(cusIcon, 'top', e.clientY + 'px')
          // setStyle(cusIcon, 'display', 'block')
          //
          // setStyle(cusIcon, 'left', cusBox.$el.offsetLeft + 'px')
          // setStyle(cusIcon, 'top', cusBox.$el.offsetTop + 90 + 'px')
          this.temp.push(item)
        }
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
        let res = fitSize(1585, [620, 720], [350, 730]) // 480
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
        let columns = (!item.ngw_table_sign ? this.columns : this.columnsMap[item.ngw_table_sign]),
          column = columns.find(c => {
            return c.prop.indexOf('xdh_cjsj') !== -1
          }).prop
        return item[column]
      }
    },
    updated() {},
    created() {
      window.addEventListener('resize', (e) => {
        this.fitEvent()
      })
    },
    mounted() {
      // this.loading = true
      this.treeQuery = get('ngw_search_searcWhere')
      this.heightLightKeys = this.$route.query.key
      this.fitEvent()
      // 初始化页签
      this.tabs.push({
        keyword: this.treeQuery.SearchWhere.map(d => d.Keyword).join('_'),
        treeQuery: null,
        nextQuery: null,
        list: [],
        pagenav: { limit: 0, currentpage: 1 }
      })

      // 定义页面标题
      document.title = this.heightLightKeys + ' 的搜索结果-智慧警务'

      // 滚动加载更多数据
      let self = this,
        $mainBox = this.$('#searchResTable .el-table__body-wrapper'),
        $listBox = $mainBox.find('.el-table__body')

      $mainBox.on('scroll', function() {
        if (self.isAll === false && $listBox.height() - $mainBox.scrollTop() - 0 <= $mainBox.height()) {
          if (self.loading === false) {
            self.tabs[self.currentTab].pagenav.currentpage++;
            self.fetchList()
          }
        }
      })
    }
  }

</script>
