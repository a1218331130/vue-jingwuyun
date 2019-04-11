<template>
<div class="tactics res-list">
  <div v-if="!resOnly" class="app-toolbar top-tool">
    <el-row>
      <el-col :span="18">
        <el-tabs v-show="report.length > 0" class="main-tabs" v-model="currentTab">
          <el-tab-pane :label="`战法结果(${count}条)`" name="res"></el-tab-pane>
          <el-tab-pane v-if="markArray.length > 0" label="PGIS展示" name="map"></el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="6">
        <div class="btn-box">
          <el-button-group v-if="showList===true && resModel === 'table'">
            <el-button type="" @click="listType=2" :class="{action:listType===2}" title="列表模式"><i class="iconfont icon-fold"></i></el-button>
            <el-button type="" @click="listType=1" :class="{action:listType===1}" title="紧凑模式"><i class="iconfont icon-card-list"></i></el-button>
          </el-button-group>

          <div v-show="report.length > 0" class="search-menu-button" @click="switchToolbar">
            <i :class="{'organ-button':true,'el-icon-d-arrow-right':showRightbar===true,'el-icon-d-arrow-left':showRightbar===false}"></i>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
  <div class="app-content" style="background-image:none;">
    <div v-if="showList!==true" class="pgis-bg">
      <pgisBG class="map-box__item" layer="PGIS_CS_FWCS_DH_PG_BG" ref="pgis" mapStyle="background:#fff; height:100%;" :defaultZoom="16" :showSidebar="false" :showTools="false"></pgisBG>
    </div>
    <div v-if="showList===true && currentTab==='res'" class="list-box">
      <div v-if="report.length > 0" :class="{item:true,  chart:item.type==='chart',half:item.half}" v-for="item in report">
        <echarts v-if="item.type==='chart'" class="chart-box__item" :option="item.data"></echarts>
        {{keyword, prop, 'propkeywordsssss'}}
        <el-table v-if="item.type==='table'&&item.list&&item.list.length>0" @cell-mouse-enter="cellMouseEnter" class="app-table" :data="item.list" :border="true">
          <el-table-column type="index" label="序号" align="center" width="50">
            <template scope="scope">
              {{scope.$index + 1}}
            </template>
</el-table-column>
<el-table-column v-if="column.display===true" v-for="column in item.coloum" :key="column.marking" :label="column.label" :prop="column.prop" :align="getColumnAlign(column)" :width="getColumnWidth(column)">
  <template scope="scope">
              <span :class="{'cursor--point': column.type!==null}" @click="colOnClickEvent(column.type, scope.row[column.prop],scope.row)">
                {{scope.row[column.prop]}}
              </span>
            </template>
</el-table-column>
</el-table>
</div>
</div>
<div v-if="showList===true && currentTab==='map'" class="map-box">
  <pgis class="map-box__item" layer="PGIS_CS_FWCS_DH_PG_BG" ref="pgis" mapStyle="background:#fff; height:100%;" :showSidebar="false" :showTools="false"></pgis>
</div>

<dialog-export :dialog="exportDialog" @close="exportDialog=false"></dialog-export>
<dialog-people-info :dialog="peopleInfoDialog" :data="infoDialogData" @close="peopleInfoDialog=false" @call:dialog="openInfoDialog"></dialog-people-info>
<dialog-car-info :dialog="carInfoDialog" :data="infoDialogData" @close="carInfoDialog=false" @call:dialog="openInfoDialog"></dialog-car-info>
<dialog-mobile-info :dialog="mobileInfoDialog" :data="infoDialogData" @close="mobileInfoDialog=false" @call:dialog="openInfoDialog"></dialog-mobile-info>
<share-dialog :dialog="dialogShare" :content="shareContent" @close="dialogShare=false"></share-dialog>

<details-dialog :title="title" :dialog="dialogDetails" @close="dialogDetails=false" :type="detailType" :keyword="detailKeyword" :tableList="dialogList"></details-dialog>
</div>
</div>
</template>
<style lang="scss" scoped>
  .el-loading-mask {
    display: none;
    &.action {
      display: block;
    }
  }

  .pgis-bg {
    position: relative;
    z-index: 1;
  }

  .tactics.res-list .app-content {
    .list-box {
      padding-bottom: 100px;
    }
    .item {
      // height: calc(100vh - 150px);
    }
    .item.chart+.item:not(.chart) {
      height: calc(100vh - 300px);
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { FETCH_TACTICS_RESULT, FETCH_TACTICS_GP_PAGE_LIST, FECTH_SAVE_TACTICS_LIST, FETCH_CASE_ID_AND_NAME } from '../../../store/types'

  import mixin from '../../../utils/mixin'
  import infoDialogEvents from '../../../utils/infoDialogEvents'

  import { clone, arrayGetRid } from '../../../utils/util'
  import columnsMap from '../../../utils/columnsMap'

  import sideRightBox from '../../control/side-right-box.vue'
  import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'
  import shareDialog from '../../../widgets/share-dialog/share-dialog.vue'
  import rightSide from '../../tactics/apply/rightSide'

  import detailsDialog from '../../tactics/apply/dialog-details.vue'
  import dialogExport from '../../search/dialog-export'
  import dialogInfo from '../../../widgets/info-dialog/info-dialog'
  import pagination from '../../../widgets/pagination/pagination'

  import echarts from '../../../widgets/echarts'
  import chartsOps from '../../../utils/echartsOptions/all'

  import pgis from '../../../widgets/location-selector/pgis.vue'
  import { EZ_POIS_SEARCH_S } from '../../../config'

  export default {
    mixins: [mixin, chartsOps, infoDialogEvents],
    components: {
      pgis,
      pgisBG: pgis,
      echarts,
      shareDialog,
      detailsDialog,
      pagination,
      'right-side': rightSide,
      'side-right-box': sideRightBox,
      'right-toolbar': rightToolbar,
      'dialog-export': dialogExport,
      'dialog-people-info': dialogInfo,
      'dialog-car-info': dialogInfo,
      'dialog-mobile-info': dialogInfo
    },
    data() {
      return {
        selectCase: '',
        caseList: [],
        dialogVisible: false,
        currentTab: 'res',
        dialogDetails: false,
        peopleInfoDialog: false,
        dialogShare: false,
        detailType: 'table',
        detailKeyword: '',
        shareContent: {
          text: '',
          value: null
        },
        title: '',
        showList: false,
        heightLightKey: '',
        resModel: 'chart',
        detail: {},
        exportDialog: false,
        showRightbar: false,
        listType: 1,
        tableList: [],
        dialogList: [],
        count: 0,
        pagenav: { limit: 20, currentpage: 1 },
        columns: [],
        report: [],
        markArray: [],
        columnsTitle: []
      }
    },
    props: {
      keyword: {
        type: String,
        default: ''
      },
      prop: {
        type: String,
        default: ''
      },
      query: {
        type: Object,
        default: null
      },
      data: {
        type: Object,
        default: null
      },
      resOnly: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapState(['tactics', 'survey', 'caseInfo'])
    },
    watch: {
      data: {
        handler(val) {
          this.handleData(val)
        },
        deep: true
      },
      query(newVal, oldVal) {
        this.fetchResultList();
      },
      pagenav: {
        handler() {
          if (!this.resOnly) {
            this.fetchList()
          }
        },
        deep: true
      },
      currentTab(val) {
        if (val === 'map' && this.markArray.length > 0) {
          let location = [],
            params = {
              group: '',
              type: 'FQ',
              keywords: '',
              method: 'FULL',
              scope: '_NAMES',
              filterCustom: 'PGIS_CS_FWCS_DH_PG_BG',
              pageIndex: 0,
              pageSize: 1,
              limit: 1,
              timespan: (new Date()).getTime()
            }
          this.markArray.forEach(d => {
            let query = clone(params)
            query.keywords = d.name
            this.$http.jsonp(EZ_POIS_SEARCH_S, {
              params: query
            }).then(res => {
              if (res.body.groups && res.body.groups[0]) {
                location.push({
                  name: `${d.name} (${d.value}次)`,
                  x: res.body.groups[0].pois[0].x,
                  y: res.body.groups[0].pois[0].y
                })
              }
              this.$nextTick(() => {
                this.$refs.pgis.renderMarker(location)
              })
              return res
            }).catch(err => {
              this.$alert('PGIS服务端错误码：' + err.status, '提示')
            })
          })
        }
      }
    },
    methods: {
      /**
       * [fetchList 拉取结果]
       */
      fetchList() {
        if (this.checkRule('zfsc/library/qdzf') === true) {
          let query = clone(this.query)
          this.report = []
          this.markArray = []
          query.PageIndex = this.pagenav.currentpage
          query.PageSize = this.pagenav.limit
          query.zfid = this.$route.query.id
          let tips = true
          let msgObj
          setTimeout(() => {
            if (tips) {
              msgObj = this.$message({ message: '此战法用时较长，请耐心等候...', type: 'warning', showClose: true, duration: 0 });
            }
          }, 10000)
          this.dispatch(FETCH_TACTICS_RESULT, query).then(() => {
            tips = false;
            msgObj && msgObj.close()
            if (!this.tactics.result.dataList) {
              this.$alert('经分析, 此条件无相关结果, 请修改战法应用条件后重新启动战法.', '温馨提示')
            } else {
              this.handleData(this.tactics.result)
            }
          }).catch(() => {
            tips = false;
            msgObj && msgObj.close()
          })
        }
      },
      handleData(data) {
        data.dataList.map(item => {
          if (item.coloum && item.coloum.length > 0) {
            if (item.label !== '查询语句') {
              this.columnsTitle.push({ label: item.label, prop: item.prop })
            }
          }
        })
        if (this.resModel === 'table') {
          let columns = [],
            firstItem = data.PageDate[0]
          for (let item in firstItem) {
            columns.push({
              label: columnsMap[item] || item,
              prop: item,
              type: null
            })
          }
          this.columns = data.columns
          this.count = data.DataCount
          this.tableList = data.PageDate
        }
        if (this.resModel === 'chart' && data.dataList) {
          let res = []
          data.dataList.forEach(d => {
            res.push(this.convert(d))
          })
          this.report = res
        }
        if (this.report.length > 0) {
          this.report.map(item => {
            if (item.type === 'table') {
              this.count = item.count
            }
          })
          this.$emit('update:leftbar', false)
        }
      },
      fetchItemPageList(target) {
        let query = clone(this.query)
        query['zfid'] = this.$route.query.id
        query['v_calsql'] = target.calsql
        query['PageIndex'] = target.pagenav.currentpage || 1
        query['PageSize'] = 20

        this.dispatch(FETCH_TACTICS_GP_PAGE_LIST, query).then(() => {
          console.log(this.tactics.gpPageList);
        })
      },
      updatePage(target, pagenav) {
        target.pagenav = pagenav
        this.fetchItemPageList(target)
      },
      /**
       * [convert 转换结果数据]
       * @param  {Object} data [description]
       * @return {Object}      [description]
       */
      convert(data) {
        let res = {
          type: '',
          half: data.position === 1,
          columns: [],
          count: 0,
          list: [],
          data: null
        }
        if (data.type === 'bar') {
          // 柱图
          res.type = 'chart'
          res.data = clone(this.echartsBarOptions.base)
          res.data['title']['text'] = data.title
          res.data.yAxis.data = data.name || []
          res.data.series[0].data = data.value || []
          res.data.xAxis = { type: 'value', boundaryGap: [0, 0.01] }
        } else if (data.type === 'line') {
          // 拆线图
          res.type = 'chart'
          res.data = clone(this.echartsLineOptions.situation)
          res.data['title']['text'] = data.title
          res.data.xAxis.data = data.name || []
          res.data.series[0].data = data.value || []
        } else if (data.type.indexOf('pie') !== -1) {
          // 饼图数据
          res.type = 'chart'
          res.data = clone(this.echartsPieOptions.tactics)
          res.data['title']['text'] = data.title
          if (data.name !== null && data.name.length > 0) {
            let seriesData = []
            data.name.forEach((n, i) => {
              seriesData.push({ value: data.value[i], name: n })
            })
            res.data.series[0].data = seriesData
          }
        } else if (data.type === 'table') {
          // 表格
          res.type = 'table'
          res.title = data.title
          res.calsql = data.v_calsql || null
          res.columns = data.coloum !== null ? [...data.coloum.filter(d => d.display === true)] : []
          res.list = data.list ? [...data.list] : []
          res.columns.forEach(c => {
            c['type'] = this.getColumnsType(c.marking)
          })
          res.pagenav = {
            currentpage: 1,
            limit: 20
          }
          res.count = data.count || 0
        }
        // 地图数据
        if (data.type.indexOf('.map') !== -1 && this.markArray.length === 0) {
          if (data.name !== null && data.name.length > 0) {
            this.markArray = data.name.map((n, i) => {
              return {
                name: n,
                value: data.value[i]
              }
            })
          }
        }
        return res
      },
      openDetails(val) {
        this.detailKeyword = val.callsql // '地址'
        this.dialogDetails = true
      },
      checkAll() {},
      share(item) {
        let content = ''
        this.columnsTitle.forEach(column => {
          content += `${column.label}: ${item[column.prop]} `
        })
        this.shareContent.value = item
        this.shareContent.text = content
        this.dialogShare = true
      },
      saveResult() {
        this.dialogVisible = true;
        this.dispatch(FETCH_CASE_ID_AND_NAME).then(() => {
          if (this.caseInfo.fetchCaseIdAndName.length > 0) {
            this.caseList = this.caseInfo.fetchCaseIdAndName;
          }
        })
      },
      selectChange(val) {
        this.selectCase = val;
      },
      remove(item) {
        this.$confirm('确定要删除此内容?', '温馨提示', {
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '选项删除成功',
            showClose: true
          })
          arrayGetRid(this.tableList, [item])
        })
      },
      switchToolbar() {
        this.showRightbar = this.showRightbar === false
      },
      getColumnWidth(column) {
        let res = ''
        if (this.report.length < 5) {
          return res
        }
        if (column.marking === 'DE00059') {
          // 姓名
          res = 80
        } else if (column.marking === 'DE00618') {
          // 身份证号码
          res = 170
        } else if (column.marking === 'DE00216') {
          // 手机号码
          res = 120
        } else if (column.label.indexOf('日期') !== -1 || column.label.indexOf('时间') !== -1) {
          res = 170
        } else if (column.label === '性别') {
          res = 80
        } else if (column.label === '民族') {
          res = 80
        } else if (column.label === '户籍区划代码') {
          // 户籍区划代码
          res = 120
        } else if (column.label.indexOf('次数') !== -1) {
          res = 80
        }
        return res
      },
      getColumnAlign(column) {
        let res = ''
        if (column.marking === 'DE00059') {
          // 姓名
          res = 'center'
        } else if (column.marking === 'DE00618') {
          // 身份证号码
          res = 'center'
        } else if (column.marking === 'DE00216') {
          // 手机号码
          res = 'center'
        } else if (column.label.indexOf('日期') !== -1 || column.label.indexOf('时间') !== -1) {
          res = 'center'
        } else if (column.label === '性别') {
          res = 'center'
        } else if (column.label === '民族') {
          res = 'center'
        } else if (column.label === '户籍区划代码') {
          // 户籍区划代码
          res = 'center'
        } else if (column.label.indexOf('次数') !== 0) {
          res = 'center'
        }
        return res
      },
      fetchResultList() {
        this.dispatch(FECTH_SAVE_TACTICS_LIST, this.query).then(() => {
          this.report = this.survey.fecthSaveTacticsListResult.dataList
          this.report.map(item => {
            item.type === 'table' ? this.count = item.count : this.count = 0;
          })
        })
      }
    },
    created() {},
    mounted() {
      this.showRightbar = true
    }
  }

</script>
