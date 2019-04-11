<template>
<!--通话规律分析-->
<!-- 本页图表 剩余【小时天 5类型】展示 建能来对接 -->
<div class="tel-list root" v-loading="loading" element-loading-text="拼命分析计算中……">
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <el-tabs v-model="elTab" v-if="tabs.length>0" :closable="true" @tab-remove="removeTab" @tab-click="updateCurrentTab">
        <el-tab-pane v-for="(item,i) in tabs" :name="`${item.keyVal}|${item.name}`" :key="i" :label="`${item.keyVal}[${item.name}]`"></el-tab-pane>
      </el-tabs>
      <span v-else>&nbsp</span>
    </el-col>
    <el-col :span="4" class="collap-col">
      <div class="collap-box pointer">
        <slot name="switchRightBarBtn"></slot>
      </div>
    </el-col>
  </el-row>

  <div class="tabs-box">
    <div class="tabs-box__item" v-for="(item,i) in tabs" v-show="i===currentTab" :key="i">
      <searchBox>
        <div slot="formBox">
          <el-form :model="item.queryForm" :inline="true" label-position="right" label-width="90px">
            <el-button type="primary" class="analysis primary-btn" native-type="submit" @click.prevent="query">分析</el-button>
            <el-form-item label="时间段">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm, val?val:'')" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <el-form-item label="通话时长">
              <el-select class="small" v-model="item.queryForm.timeLabel" placeholder="请选择">
                <el-option v-for="item in logicOps" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
              <el-input-number class="small" v-model="item.queryForm.timeLeght" size="small" :min="1" :max="1000"></el-input-number>
              (秒)
            </el-form-item>
            <el-form-item label="归属地">
              <el-input v-model="item.queryForm.attribution" style="width:80px;" placeholder="请输入归属地"></el-input>
            </el-form-item>
            <el-form-item label="呼叫类型">
              <el-select v-model="item.queryForm.callType" style="width:80px;" placeholder="">
                <el-option v-for="item in callTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="通话地点">
              <el-input v-model="item.queryForm.callArea" style="width:80px;" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="对方号码">
              <el-input style="width:120px;" v-model="item.queryForm.otherPhone" placeholder=""></el-input>
            </el-form-item>
          </el-form>
          <!-- <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query">分析</el-button> -->
        </div>
      </searchBox>
      <div class="app-content-box" v-if="resBox===true">
        <div class="lawBox">
          <el-tabs class="" type="card" v-model="item.tabModel" @tab-click="lawTabChange(item.tabModel)">
            <el-tab-pane :label="tabI.label" :name="tabI.value + ''" v-for="(tabI, tabIndex) in item.chartData" :key="tabIndex">
              <div class="char-box" style="width: 100%" v-if="!loading">
                <!-- type != 5 -->
                <echarts :ref="'chart_' + tabI.value" :option="tabI.chartOptions" :events="eventEchart" v-if="item.tabModel+'' !== '5'" style="width:100%; height:100%;"></echarts>

                <!-- type=5 小时天 (ps 注意判断条件 添加 表格部分DOM v-if="item.tabModel+'' === '5'")-->
                <div class="tal__table" v-if="item.tabModel+'' === '5'">
                  <el-col :span="24">
                    <table class="a-ca-table">
                      <thead>
                        <tr class="a-ca-t-worker">
                          <th class="a-ca-header-title">
                            <div class="a-ca-ht-div">
                              <table>
                                <thead>
                                  <tr class="a-ca-ht-div">
                                    <th></th>
                                    <th>时段</th>
                                  </tr>
                                  <tr class="a-ca-ht-worker">
                                    <th>日期</th>
                                    <th></th>
                                  </tr>
                                </thead>
                              </table>
                            </div>
                          </th>
                          <th v-for="(item,i) in date" :key="i">{{item}}</th>
                        </tr>
                      </thead>
                      <tbody style="max-height: 500px;">
                        <tr v-for="(items,x) in (item.chartData[0].chartOptions)" :key="x">
                          <td v-for="(key,y) in items" :key="y">
                            <div :class="[key.cs!=null?'a-ca-by-div':'']" @click="chartClick(key.time)">{{key.cs}}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </el-col>
                  <el-col :span="24">
                    <div style="border-bottom:1px solid #e5e5e5; margin: 15px 0; "></div>
                  </el-col>

                </div>
              </div>

            </el-tab-pane>
          </el-tabs>
        </div>

      </div>

    </div>
  </div>

  <!-- 详单查询 -->
  <detail-list-dialog :dialog="detailDialog" :queryCondition="detailQueryCondition" @close="detailDialog = false"></detail-list-dialog>
</div>
</template>
<style lang="scss" scoped>
  .tel-list.root {
    height: calc(100vh - 60px);
    .primary-btn {
      position: relative;
      top: 1px;
      left: 0;
    }
    .tal__table {
      margin-top: 15px;
      height: 100%;
      overflow: auto;
    }
    .a-ca-head-title {
      border-right: 1px solid #87bde9;
      background-color: #fff;
      padding: 0;
    }
    .margin-r {
      margin-right: 5px;
    }
    table.a-ca-table .a-ca-t-worker>th:nth-child(2) {
      display: none;
      background: #000;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
      width: 100%;
      th {
        background-color: #b4d6f1;
        color: #fff;
        padding: 0 5px;
        text-align: center;
        font-weight: normal;
        border: 1px solid #87bde9;
        .a-ca-ht-div th {
          border: 0 solid #87bde9;
        }
      }
      td {
        padding: 5px;
      }
    }
    .a-ca-table {
      border: 1px solid #87bde9;
      width: 100%;
      border-bottom: 10px solid #87bde9;
      tbody tr {
        &:nth-child(even) {
          background-color: #F2F2F2;
        }
        td {
          border: 1px solid #87bde9;
          text-align: center;
          color: #55ade3;
          padding: 0;
          &:first-child {
            color: #666;
            padding: 10px 0;
            .a-ca-by-div {
              background-color: transparent;
            }
          }
          &:last-child {
            color: #87bdea;
            padding: 10px 0;
            .a-ca-by-div {
              background-color: transparent;
            }
          }
          .a-ca-by-div {
            background-color: #ffd8b0;
            padding: 10px 0;
            margin: -10px 0;
            cursor: pointer;
          }
        }
      }
    }
    .a-ca-ht-div {}
    .a-ca-t-week {
      border-bottom: 1px solid #87bde9;
      border-top: 1px solid #87bde9;
    }
  }

  .teldata_box {
    background: #f2f2f2;
    padding: 10px;
    border: 1px solid #d7d7d7;
    .teldata_title {
      text-align: right;
      color: #999999;
    }
  }

  .char-box {
    height: calc(100vh - 318px);
  }

</style>
<script>
  import { FETCH_TELLIST_LAW_LIST } from '../../../../store/types'
  import telListMixin from '../telListMixin'

  import searchBox from '../../search-tool'
  import list from '../list'
  import { clone } from '../../../../utils/util'

  import echarts from '../../../../widgets/echarts'
  import detailListDialog from '../detail-list-dialog.vue'
  export default {
    mixins: [telListMixin],
    components: {
      searchBox,
      list,
      echarts,
      detailListDialog
    },
    data() {
      return {
        detailDialog: false,
        detailQueryCondition: null,
        date: [],
        timeTabType: '',
        commName: 'law',
        resBox: false,
        tabList: [
          { label: '对方姓名', prop: 'otherName' },
          { label: '对方号码', prop: 'otherPhone' },
          { label: '对方职位', prop: 'otherUnit' },
          { label: '归属地', prop: 'attribution' },
          { label: '通话地点', prop: 'placeCall' },
          { label: '呼叫类型', prop: 'callType' },
          { label: '通话日期', prop: 'callDate' },
          { label: '通话时间', prop: 'callTime' },
          { label: '时长(秒)', prop: 'timeLeght' },
          { label: '星期', prop: 'week' },
          { label: '通话地址', prop: 'callArea' }
        ],
        lineOpsList: {},
        // TODO: 根据动态X轴label 的统计类型集 对照 this.timeInterval 0:小时,2:天, 2:星期, 3:月, 4:年
        isDynamiceXAxis: ['0', '1', '2', '3', '4'],
        // TODO: 折线图默认配置项
        lineOps: {
          grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: []
          },
          yAxis: {
            name: '通话次数',
            type: 'value'
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            formatter: `{b}时<br/>号码:{a}</br/>通话次数:{c}`
          },
          seriesDataTemp: [], // 数据占位临时保存
          series: []
        },
        eventEchart: [{ // 点击事件绑定
          on: 'click',
          method: this.chartClick
        }]
      }
    },
    props: [],
    computed: {},
    methods: {
      /**
       * 初始化标签页 图表基础数据
       */
      initTabs() {
        let _queryTypeTemp = this.timeInterval
        let _osdt = 0 // 数据缺失占位  默认为0  【0:折线缺失还是会连接，null: 缺失部分不连接 空位】
        for (let qtt in _queryTypeTemp) {
          let _qttCode = _queryTypeTemp[qtt].value
          if (_qttCode !== 5 && _qttCode !== '5') {
            // TODO: 维护部分固定的X 轴 Label
            let _qtXLLabel = _queryTypeTemp[qtt].label // 维护X轴 标题
            let _qtXLD = [] // 维护X轴 label data
            let _optSeriesDataTemp = [] // server data 临时数据填充
            if (_qttCode === 0 || _qttCode === '0') { // 小时
              for (let h = 0; h < 24; h++) {
                _qtXLD.push(('0' + h).slice(-2))
                // 判断是否动态X,是则固定以null 填充 方便后续操作剔除
                _optSeriesDataTemp.push(_osdt)
              }
            }
            if (_qttCode === 1 || _qttCode === '1') { // 天
              _qtXLLabel = '日'
              for (let h = 1; h < 32; h++) {
                _qtXLD.push(('0' + h).slice(-2))
                // 判断是否动态X,是则固定以null 填充 方便后续操作剔除
                _optSeriesDataTemp.push(_osdt)
              }
            }
            if (_qttCode === 2 || _qttCode === '2') { // 星期
              _qtXLD = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
              for (let h = 1; h < 8; h++) {
                // 判断是否动态X,是则固定以null 填充 方便后续操作剔除
                _optSeriesDataTemp.push(_osdt)
              }
            }
            if (_qttCode === 3 || _qttCode === '3') { // 月
              for (let h = 1; h < 13; h++) {
                _qtXLD.push(('0' + h).slice(-2))
                // 判断是否动态X,是则固定以null 填充 方便后续操作剔除
                _optSeriesDataTemp.push(_osdt)
              }
            }
            _queryTypeTemp[qtt].chartOptions = clone(this.lineOps)
            _queryTypeTemp[qtt].chartOptions.xAxis.name = _qtXLLabel // 维护X轴 标题
            _queryTypeTemp[qtt].chartOptions.xAxis.data = _qtXLD // 维护X轴label
            _queryTypeTemp[qtt].chartOptions.seriesDataTemp = _optSeriesDataTemp // server data 数据填充临时保存
          }
        }
      },
      query() {
        // 查询获取
        this.resBox = true
        this.tabs[this.currentTab].tabModel = '5'
        this.timeTabType = this.timeInterval[0].value
        this.fetchMainList(this.timeInterval[0].value)
      },
      fetchMainList(timeType) {
        timeType = parseInt(timeType)
        let target = this.tabs[this.currentTab],
          queryForm = this.delEmpey({
            v_zjhm: target.keyVal, //  主叫号码   String  是
            v_dfhm: target.queryForm.otherPhone, // 对方号码 String 否
            v_dwmc: '', // 单位名称 String 否
            v_gsd: target.queryForm.attribution, // 归属地 String 否
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 String 否
            v_sctj: target.queryForm.timeLabel, // 时长条件（>=,<=） String  否
            v_thsc: target.queryForm.timeLeght, // 时长 String 否
            v_hjlx: target.queryForm.callType, // 呼叫类型（主叫，被叫 ） String 否
            v_thdd: target.queryForm.callArea, // 通话地点 String 否
            v_rwid: '', // 任务ID String 否
            v_tjlx: timeType // target.queryForm.callTime // 统计类型（0小时，1天，2星期，3月，4年,5小时天） String 是
          })

        target.chartData = clone(this.timeInterval)
        this.dispatch(FETCH_TELLIST_LAW_LIST, queryForm).then(() => {
          let _atlDTMain = this.analysisTelList.lawList.DTMain //  主干类目数据
          // TODO:固定维护X轴坐标默认, 动态维护 添加到 isDynamiceXAxis:根据数据动态X轴坐标
          if (parseInt(timeType) < 5) {
            let currentChart = clone(this.timeInterval.find(d => d.value === timeType))
            let _currentOpt = currentChart.chartOptions // 当前操作Line Option
            let _tellList = [] // 统计数据
            let _lineOptServiceData = this.isDynamiceXAxis.includes(timeType + '') ? [] : _currentOpt.seriesDataTemp // 默认 S-Data
            let _lineXAxisDataTemp = []
            _atlDTMain.map(adtR => {
              _lineXAxisDataTemp.push(adtR['da']) // 追加当前数据的 XAxis label Data
              for (let adt in adtR) {
                if (adt !== 'da') {
                  // TODO:根据数据动态X轴坐标
                  if (this.isDynamiceXAxis.includes(timeType + '')) {
                    _lineOptServiceData.push(adtR[adt]) // 追加当前数据的series Data
                  } else {
                    _lineOptServiceData[_currentOpt.xAxis.data.indexOf(adtR['da'])] = adtR[adt] // 替换对应节点数据的值
                  }
                  if (_tellList.includes(adt)) { // 归集号码类别
                    _currentOpt.series[_tellList.indexOf(adt)].data = _lineOptServiceData
                  } else {
                    _tellList.push(adt)
                    _currentOpt.series.push({
                      name: adt,
                      type: 'line',
                      data: _lineOptServiceData
                    })
                  }
                }
              }
            })
            // TODO:根据数据动态X轴坐标
            if (this.isDynamiceXAxis.includes(timeType + '')) {
              _currentOpt.xAxis.data = _lineXAxisDataTemp
              // todo:过滤值为null的 [暂时可以不执行]
              //              _currentOpt.series = clone(_currentOpt.series).map(lsd => {
              //                lsd.data = clone(lsd.data).filter(df => df !== null)
              //                return lsd
              //              })
            }

            target.chartData.forEach((d, ci) => {
              if (d.value === currentChart.value) {
                this.$set(target.chartData, ci, currentChart)
              }
            })

            let chartElm = this.$refs['chart_' + currentChart.value]
            if (chartElm) {
              if (Array.isArray(chartElm)) {
                chartElm[0].action()
              } else {
                chartElm.action()
              }
            }
          } else if (parseInt(timeType) === 5) { // todo:小时天的操作
            // target.mainList = this.analysisTelList.lawList
            this.date = []
            target.chartData[0].chartOptions = []
            for (var key in _atlDTMain[0]) {
              if (!isNaN(key)) {
                this.date.push(key)
              }
            }
            this.date = this.date.sort()
            this.date.unshift('日期\\时段')
            this.date.push('合计')
            _atlDTMain.map(item => {
              let time = item[this.date[0]]
              let specificDate = item[this.date[0]].split('-').join('')
              let arry = []
              this.date.map(items => {
                for (var keys in item) {
                  if (items === keys) {
                    if (keys === '日期\\时段') {
                      arry.push({
                        cs: item[keys],
                        time: {
                          kssj: specificDate,
                          jssj: specificDate
                        }
                      })
                    } else {
                      arry.push({
                        cs: item[keys],
                        time: {
                          kssj: time,
                          jssj: time,
                          hour: keys
                        }
                      })
                    }
                  }
                }
              })
              target.chartData[0].chartOptions.push(arry)
            })
          }
        })
      },
      /**
       * 切换选项卡
       */
      lawTabChange(type) {
        this.timeTabType = type
        this.fetchMainList(type)
      },
      /**
       * 图表点击事件
       * @param p
       */
      chartClick(p) {
        //  图表点击查询话单详情 （1 - 4 类型）
        this.detailDialog = true
        // 查询条件
        let _currentQuery = Object.assign({}, clone(this.tabs[this.currentTab]), {
          sjdlx: this.timeTabType
        })
        if (parseInt(this.timeTabType) < 5) { // TODO:[1 - 4类型]
          _currentQuery.sjd = p.name
        } else if (parseInt(this.timeTabType) === 5) { // TODO:[5 类型]
          _currentQuery.sjdlx = '0'
          _currentQuery.queryForm.timeSlot = [p.kssj, p.jssj] //  对应数据自行填充
          _currentQuery.sjd = p.hour === '合计' ? undefined : p.hour;
        }
        //  详单列表查询
        this.detailQueryCondition = Object.assign({}, _currentQuery)
      }
    },
    created() {
      this.active = this.$route.path

      this.initTabs()
    },
    mounted() {}
  }

</script>
