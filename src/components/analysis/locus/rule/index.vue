<template>
<!-- 轨迹规律分析 -->
<!-- 本页套数据 -->
<div class="tel-list" v-loading="loading">
  <el-row class="el-row analysis-topbar">
    <!-- <el-col :span="20">
      <div class="tabs">
        <div :class="{'tabs__item':true,'current':currentTab===i}" v-for="(item,i) in tabs" :title="item.keyVal" @click="currentTab=i" v-if="item.keyVal">
          {{item.keyVal}}
          <span v-show="item.name"></span>[{{item.name}}]
          <i class="iconfont icon-close" @click.stop="removeItem(item)"></i>
        </div>
      </div>
    </el-col> -->
    <el-col :span="20">
      <el-tabs v-model="activeTab" :closable="true" @tab-remove="removeItem" @tab-click="tabPaneChange">
        <el-tab-pane v-for="(item,i) in tabs" :name="`${item.keyVal}|${item.name}`" :key="i" :label="`${item.keyVal}[${item.name}]`"></el-tab-pane>
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
            <el-form-item label="日期区间">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="timeOptions" @change="val=>updateTimeSlot(item.queryForm, val?val:'')" placeholder="请选择"></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </searchBox>
      <div class="app-content-box" v-if="item.queryForm.resBox === true">
        <!-- 结果列表 -->
        <div class="res-box">
          <!--轨迹规律统计-->
          <!--  v-loading="item.queryForm.staticLoading" -->
          <el-tabs class="res-box-content">
            <el-tab-pane label="轨迹规律统计">
              <!-- <list :list="null" :tab="ruleList" :pagenav="pageInfo"></list> item.mainList-->
              <el-table :data="item.ruleList" height="240" border @row-dblclick="rowClick">
                <el-table-column type="index" label="序号" align="center" width="50px"></el-table-column>
                <el-table-column label="查看明细" align="center" width="70px">
                  <template scope="scope">
                    <!-- <i class="el-icon-search" @click="view(scope.row)"></i> -->
                    <el-button type="text" @click="view(scope.row)">查看</el-button>
                  </template>
</el-table-column>
<el-table-column prop="jsddmc" label="地址" align="center"></el-table-column>
<el-table-column prop="tlcs" label="停留次数" align="center" width="70px"></el-table-column>
<el-table-column prop="sclx" label="首次" align="center" width="150px"></el-table-column>
<el-table-column prop="zhlx" label="最后" align="center" width="150px"></el-table-column>
<el-table-column prop="ts" label="天数" align="center" width="50px"></el-table-column>
<el-table-column prop="smlx" label="私密" align="center" width="50px"></el-table-column>
<el-table-column prop="gzlx" label="工作" align="center" width="50px"></el-table-column>
<el-table-column prop="fslx" label="饭时" align="center" width="50px"></el-table-column>
<el-table-column prop="jdh" label="21点后" align="center" width="70px"></el-table-column>
<el-table-column prop="crjlx" label="出入境" align="center" width="60px"></el-table-column>
<el-table-column prop="thlx" label="通话" align="center" width="50px"></el-table-column>
<el-table-column prop="zjlx" label="资金往来" align="center" width="80px"></el-table-column>
<el-table-column prop="wblx" label="上网" align="center" width="50px"></el-table-column>
<el-table-column prop="gtlx" label="高铁" align="center" width="50px"></el-table-column>
<el-table-column prop="hblx" label="航班" align="center" width="50px"></el-table-column>
<el-table-column prop="lylx" label="旅业" align="center" width="50px"></el-table-column>
<el-table-column prop="zjwl" label="自驾" align="center" width="50px"></el-table-column>
</el-table-column>
</el-table>

<!-- 弹窗 -->
<el-dialog v-draggable="dialogDraggableOptions" title="详情信息" :visible.sync="dialogTabVisible" size="large">
  <el-table :data="item.secondList" v-loading="item.queryForm.dialogLoading" border max-height="400">
    <el-table-column property="xm" label="姓名" align="center" width="80"></el-table-column>
    <el-table-column property="zjhm" label="身份证号码" align="center" width="180"></el-table-column>
    <el-table-column label="轨迹描述" align="center" width="400">
      <template scope="scope">
                      <!-- <i class="el-icon-search" @click="view(scope.row)"></i> -->
                      <el-tooltip :content="scope.row.gjms" placement="top" effect="dark" v-if="scope.row.gjms !== null">
                        <el-button type="text">{{scope.row.gjms}}</el-button>
                      </el-tooltip>
                    </template>
    </el-table-column>
    <el-table-column property="kssj" label="开始时间" align="center" width="180"></el-table-column>
    <el-table-column property="jssj" label="结束时间" align="center"></el-table-column>
    <el-table-column property="ksddmc" label="出发地" align="center"></el-table-column>
    <el-table-column property="jsddmc" label="目的地" align="center"></el-table-column>
    <!-- <el-table-column property="ksqh" label="区划" align="center"></el-table-column>
                  <el-table-column property="jsqh" label="结束区划" align="center"></el-table-column> -->
    <el-table-column property="gjlxms" label="轨迹类型" align="center" width="80"></el-table-column>
    <el-table-column property="xxlyms" label="信息来源" align="center"></el-table-column>
  </el-table>
</el-dialog>

</el-tab-pane>
</el-tabs>
<!--停留次数-->
<el-tabs class="res-box-list" type="border-card">
  <el-tab-pane label="停留次数">
    <el-tabs v-model="activeName" type="card" @tab-click="tabChange" style="padding: 0">
      <el-tab-pane class="pgis-wrapper" v-for="(tab,i) in item.queryForm.timeInterval" :key="tab.label" :label="tab.label === '年'?'':tab.label" :name="i+''" v-loading="tab.loading">
        <echarts :option="tab.echartOption" style="width:100%;height: calc(100vh - 600px)"></echarts>
        <div class="pgis-text" v-show="tab.echartOption === null">
          暂无数据
        </div>
      </el-tab-pane>
      <!--<el-tab-pane label="天">-->
      <!--按天-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="星期">-->
      <!--按星期-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="月">-->
      <!--按月-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="年">-->
      <!--按年-->
      <!--</el-tab-pane>-->
    </el-tabs>
  </el-tab-pane>
</el-tabs>
</div>
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

  .app-content-box {
    padding: 0;
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      li {
        list-style: none;
        margin: 0;
        padding: 12px;
        border: 1px solid #d7d7d7;
        border-bottom: 0;
        &:last-child {
          border-bottom: 1px solid #d7d7d7;
        }
        &:after {
          content: '';
          display: block;
          height: 0;
          clear: both;
        }
      }
    }
    .miniimg {
      width: 89px;
      height: 103px;
      background: #f2f2f2;
      padding: 2px;
      border: 1px solid #d7d7d7;
      float: left;
      img {
        position: relative;
        width: 100%;
        height: 100%;
      }
    }
    .list-right {
      float: left;
      width: calc(100% - 109px);
      line-height: 30px;
      .listtitle {
        color: #999;
        width: 130px;
        text-align: right;
        display: inline-block;
      }
    }
    .tags {
      position: relative;
      background: #ff8d42;
      display: inline-block;
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
      padding: 0 10px;
      color: #fff;
      margin-left: 25px;
      line-height: 22px;
      &:first-child {
        margin-left: 50px;
      }
      &:before {
        content: '';
        display: block;
        position: absolute;
        right: -11px;
        top: 0;
        border-top: 11px solid transparent;
        border-bottom: 11px solid transparent;
        border-left: 11px solid #ff8d42;
        border-right: 0;
      }
    }
    .content-right {}
  }

  .el-tabs {
    margin-bottom: 0;
  }

  .el-tabs--border-card {
    .el-tabs__content {
      padding: 0;
    }
  }

  .pgis-wrapper {
    position: relative;
  }

  .pgis-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%, -50%);
    color: #666;
  }

</style>
<script>
  // , FETCH_ANALYZE_RULE_DETAIL_LIST, FETCH_ANALYZE_RULE_GRAPH_DATA
  import { FETCH_ANALYZE_RULE_LIST, FETCH_ANALYZE_RULE_DETAIL_LIST, FETCH_ANALYZE_RULE_GRAPH_DATA } from '../../../../store/types'
  import locusMixin from '../locusMinxin'
  import dataImage from '../../../../widgets/data-image/data-image'
  import searchBox from '../../search-tool'
  import list from '../list'
  import { NgwGo } from '../../../../utils/ngw.go'
  import echarts from '../../../../widgets/echarts'
  import echartsDetails from '../../../../widgets/echarts/echart-details'
  import chartsOps from '../../../../utils/echartsOptions/all'
  import { clone } from '../../../../utils/util'

  export default {
    mixins: [locusMixin, chartsOps],
    components: {
      'data-image': dataImage,
      searchBox,
      list,
      echarts,
      echartsDetails
    },
    data() {
      return {
        activeTab: '',
        tableData: [{}, {}, {}, {}, {}, {}],
        commName: 'rule',
        pageInfo: { // 页面分页信息相关配置 默认限制每页十条
          count: 10,
          limit: 10,
          currentpage: 1
        },
        ruleList: [ // 轨迹规律统计
          { prop: 'fxrzjhm', label: '查看明细' },
          { prop: 'jsddmc', label: '地址' },
          { prop: 'tlcc', label: '停留次数' },
          { prop: 'sclx', label: '首次' },
          { prop: 'zhlx', label: '最后' },
          { prop: 'ts', label: '天数' },
          { prop: 'smlx', label: '私密' },
          { prop: 'gzlx', label: '工作' },
          { prop: 'fslx', label: '饭时' },
          { prop: 'jdh', label: '21点后' },
          { prop: 'crjlx', label: '出入境' },
          { prop: 'thlx', label: '通话' },
          { prop: 'wblx', label: '上网' },
          { prop: 'gtlx', label: '高铁' },
          { prop: 'hblx', label: '航班' },
          { prop: 'lylx', label: '旅业' },
          { prop: 'zjwl', label: '资金往来' },
          { prop: 'zjwl', label: '自驾' }
        ],
        resBox: false,
        loadingFlag: [false, false, false, false, false],
        detailBox: false,
        floor: true,
        mainGo: null,
        diagram: null,
        dialogTabVisible: false,
        activeName: '0',
        /**
         * [data 模型数据对象(最终结果)]
         * @type {Object}
         */
        goData: {
          /**
           * [nodeDataArray 节点数据]
           * @type {Array}
           */
          // [], //
          nodeDataArray: [],
          /**
           * [linkDataArray 连线数据]
           * @type {Array}
           */
          // [] //
          linkDataArray: []
        },
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
      /**
       * 初始化建模器(GOJS)
       * @return {[type]} [description]
       */
      /**
       * 初始化建模器(GOJS)
       * @return {[type]} [description]
       */
      initMaker() {
        let self = this;
        if (this.mainGo === null) {
          self.mainGo = new NgwGo({
            diagram: self.diagram,
            data: self.goData,
            readOnly: true,
            overview: 'overViewBox'
          })
        }
        self.mainGo.init()
      },
      /**
       * [generateGraph 模拟数据]
       * @return {[type]} [description]
       */
      query() {
        if (this.tabs[this.currentTab].queryForm.timeSlot.length < 2) {
          this.$alert('时间段不能为空', '温馨提示')
          return false
        }
        this.loadingFlag = [false, false, false, false, false]
        this.activeName = '0'
        this.fetchMainList()
        // this.fetchGraph()
      },
      // 查询规律分析列表
      fetchMainList() {
        let target = this.tabs[this.currentTab],
          queryData = {
            zjhm: target.keyVal || '',
            kssj: target.queryForm.timeSlot[0] || '',
            jssj: target.queryForm.timeSlot[1] || ''
          }
        target.queryForm.resBox = true
        target.queryForm.staticLoading = true
        target.queryForm.timeInterval[0].loading = true
        this.dispatch(FETCH_ANALYZE_RULE_LIST, queryData)
          .then(() => {
            let res = this.analysisLocus.ruleList
            target.ruleList = res
            target.queryForm.staticLoading = false
            target.queryForm.graph = res[0]
            if (res.length > 0) {
              this.fetchGraph('0')
            } else {
              target.queryForm.timeInterval[0].loading = false
            }
          })
      },
      showDetail() {
        this.detailBox = true
        this.initMaker()
      },

      // 标签页改变：
      tabChange(tab, event) {
        console.log(tab);
        // 如果已经加载过就直接结束
        if (this.loadingFlag[tab.index]) {
          return
        }
        // let target = this.tabs[this.currentTab]
        this.fetchGraph(tab.index)
      },

      // 轨迹规律分析-图形数据查询
      fetchGraph(val) {
        if (!this.tabs[this.currentTab].queryForm.graph) return
        let target = this.tabs[this.currentTab]
        let queryForm = {
            kssj: target.queryForm.timeSlot[0] || '',
            jssj: target.queryForm.timeSlot[1] || '',
            zjhm: target.keyVal,
            sjlx: val || '0'
          },
          index = val || 0
        target.queryForm.timeInterval[index].loading = true
        this.dispatch(FETCH_ANALYZE_RULE_GRAPH_DATA, queryForm)
          .then(() => {
            let res = this.analysisLocus.ruleGraphData,
              arrX = [],
              _arrX = [],
              arrY = []
            switch (val) {
              case '0':
                arrX = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
                _arrX = arrX
                break
              case '1':
                arrX = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
                _arrX = arrX

                break
              case '2':
                arrX = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
                _arrX = arrX

                break
              case '3':
                arrX = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                _arrX = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                break
            }
            if (res.length === 0) {
              target.queryForm.timeInterval[index].echartOption = null
              target.queryForm.timeInterval[index].loading = false
              this.loadingFlag[index] = true
              return
            }
            target.queryForm.timeInterval[index].echartOption = clone(this.echartsBarOptions.stack)
            // 获取X轴和Y轴的数据
            _arrX.forEach(d => {
              arrY.push(0)
            })
            res.forEach(d => {
              let x = _arrX.indexOf(d.da),
                y = d[target.keyVal]
              if (x >= 0) {
                arrY[x] = y
              }
              // arrY.push(y)
            })
            target.queryForm.timeInterval[index].echartOption.xAxis.data = arrX
            let AreaTemp = [{
              name: '出行次数',
              type: 'line',
              barWidth: 150,
              stack: '月份',
              data: arrY
            }];
            target.queryForm.timeInterval[index].echartOption.series = AreaTemp
            target.queryForm.timeInterval[index].loading = false
            this.loadingFlag[index] = true
          })
      },

      // 表格查看详情按钮
      view(obj) {
        this.dialogTabVisible = true
        let target = this.tabs[this.currentTab],
          queryForm = {
            kssj: obj.sclx.split(' ')[0] || target.queryForm.timeSlot[0] || '',
            jssj: obj.zhlx.split(' ')[0] || target.queryForm.timeSlot[1] || '',
            cxdd: obj.jsddmc || '',
            zjhm: target.keyVal || ''
          }
        target.queryForm.dialogLoading = true
        this.dispatch(FETCH_ANALYZE_RULE_DETAIL_LIST, queryForm)
          .then(() => {
            let res = this.analysisLocus.detailList
            target.secondList = res
            target.queryForm.dialogLoading = false
          })
      },
      // 点击表格：
      rowClick(obj) {
        this.activeName = '0'
        this.tabs[this.currentTab].queryForm.graph = obj
        this.fetchGraph()
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
