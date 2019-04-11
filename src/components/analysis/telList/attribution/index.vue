<template>
<!-- 通话归属地分析 -->
<!-- 本页吴杰套数据 -->
<div class="tel-list root" v-loading="loading" element-loading-text="拼命分析计算中……">
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <div class="tabs">
        <div :class="{'tabs__item':true,'current':currentTab===i}" v-for="(item,i) in tabs" :title="item.keyVal" @click="currentTab=i">
          <!--{{item.keyVal}}-->
          通话归属地分析
          <i class="iconfont icon-close" @click.stop="removeTab(item)"></i>
        </div>
      </div>
    </el-col>
    <el-col :span="4" class="collap-col">
      <div class="collap-box pointer">
        <slot name="switchRightBarBtn"></slot>
      </div>
    </el-col>
  </el-row>

  <div class="tabs-box">
    <div class="tabs-box__item" v-for="(item,i) in tabs" v-show="i===currentTab">
      <searchBox>
        <div slot="formBox">
          <el-form :model="item.queryForm" :inline="true" label-position="right" label-width="90px">

            <el-row>
              <el-col :span="24">
                <el-form-item label="分析号码">
                  <span v-for="(val,i) in item.vals">
                    <span>{{val}}</span>[{{item.names[i]}}] <i @click.stop="removeTab({guid:item.guid[i]})" class="iconfont icon-close"></i> {{(i
                    < item.vals.length-1? ', ': '')}} </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-button type="primary" class="analysis primary-btn" native-type="submit" @click.prevent="query">分析</el-button>
            <el-form-item label="时间段">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm, val?val:'')" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <el-form-item label="通话时长">
              <el-select class="small" v-model="item.queryForm.timeLabel" style="" placeholder="请选择">
                <el-option v-for="item in logicOps" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
              <el-input-number class="small" v-model="item.queryForm.timeLeght" size="small" :min="1" :max="1000"></el-input-number>
              (秒)
            </el-form-item>
            <el-form-item label="通话次数">
              <el-select class="small" v-model="item.queryForm.callCountLabel" placeholder="请选择">
                <el-option v-for="item in logicOps" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
              <el-input-number class="small" v-model="item.queryForm.callCount" size="small" :min="1" :max="1000"></el-input-number>
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
              <el-input v-model="item.queryForm.otherPhone" style=" width:120px;" placeholder=""></el-input>
            </el-form-item>
            <!-- <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query">分析</el-button> -->
          </el-form>
        </div>
      </searchBox>
      <div class="app-content-box" v-if="resBox===true && !loading">
        <!-- 结果详情 -->
        <div class="lawBox">
          <div class="char-box" style="width: 100%">
            <echarts :ref="'chart_line'" :option="item.chartData" :events="eventEchart" style="width:100%; height:100%;" v-if="item.chartData.series.length > 0"></echarts>
            <p class="n-tip" v-else>暂无数据！</p>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- 详单查询 -->
  <detail-list-dialog :dialog="detailDialog" :queryCondition="detailQueryCondition" @close="detailDialog = false"></detail-list-dialog>
</div>
</template>
<style lang="scss" scoped>
  .root {
    height: calc(100vh - 60px);
  }

  .n-tip {
    text-align: center;
    line-height: 60px;
    font-size: 32px;
    color: #ccc;
  }

  .primary-btn {
    position: relative;
    top: 1px;
    left: 0;
  }

  .char-box {
    height: calc(100vh - 318px);
  }

</style>
<script>
  import { FETCH_TELLIST_ATTRIBUTION_LIST } from '../../../../store/types'
  import telListMixin from '../telListMixin'
  import { clone } from '../../../../utils/util'

  import searchBox from '../../search-tool'
  import echarts from '../../../../widgets/echarts'
  import detailListDialog from '../detail-list-dialog.vue'
  export default {
    mixins: [telListMixin],
    components: {
      searchBox,
      echarts,
      detailListDialog
    },
    data() {
      return {
        detailDialog: false,
        detailQueryCondition: null,
        singleTab: true,
        commName: 'attribution',
        resBox: false,
        table: {
          columnA: [
            { label: '号码', prop: 'zjhm' },
            { label: '出现次数', prop: 'thcs' },
            { label: '地址', prop: 'gsd' }
          ],
          columnB: [
            { label: '序号', prop: 'id' },
            { label: '地图', prop: 'map' },
            { label: '对方姓名', prop: 'otherName' },
            { label: '对方职位', prop: 'otherUnit' },
            { label: '归属地', prop: 'attribution' },
            { label: '通话地', prop: 'placeCall' },
            { label: '呼叫类型', prop: 'callType' },
            { label: '通话日期', prop: 'callDate' },
            { label: '通话时间', prop: 'callTime' },
            { label: '通话时长(秒)', prop: 'timeLeght' },
            { label: '星期', prop: 'week' },
            { label: '通话地点', prop: 'callArea' }
          ],
          data: [],
          resData: []
        },
        // TODO: 折线图默认配置项
        lineOps: {
          legend: {
            data: []
          },
          grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            name: '归属地',
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
            trigger: 'axis'
          },
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
       * 分页操作
       */
      pagenavChange(obj) {
        // 分页切换操作
        this.pageInfo.limit = obj.limit
        this.pageInfo.currentpage = obj.currentpage
        this.query()
      },
      query() {
        this.fetchMainList()
        this.resBox = true
      },
      fetchMainList() {
        let target = this.tabs[this.currentTab],
          queryForm = this.delEmpey({
            v_zjhm: target.vals.toString(), //  主叫号码   String  是
            v_dfhm: target.queryForm.otherPhone, // 对方号码 String 否
            v_dwmc: '', // 单位名称  String 否
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 String 否
            v_sctj: target.queryForm.timeLabel, // 时长条件（>=,<=） String  否
            v_thsc: target.queryForm.timeLeght, // 时长 String 否
            v_thcstj: target.queryForm.callCountLabel, // 通话次数条件 String 否
            v_thcstjz: target.queryForm.callCount, // 通话次数条件值  String 否
            v_hjlx: target.queryForm.callType, // 呼叫类型（主叫，被叫 ） String 否
            v_thdd: target.queryForm.callArea, // 通话地点 String 否
            v_rwid: '' // 任务ID String 否
          })
        target.chartData = clone(this.lineOps) // 初始化重置图表数据

        this.dispatch(FETCH_TELLIST_ATTRIBUTION_LIST, queryForm).then(() => {
          let _lineOptSeriesType = []
          this.analysisTelList.attributionList.DTMain.map(DTM => {
            // X 轴坐标
            if (!target.chartData.xAxis.data.includes(DTM.gsd)) {
              target.chartData.xAxis.data.push(DTM.gsd)
            }
            let _currentXIndex = target.chartData.xAxis.data.indexOf(DTM.gsd) // 当前X索引 即数据索引
            // 对应折线系列数据
            for (let dk in DTM) {
              if (dk !== 'gsd') {
                if (_lineOptSeriesType.includes(dk)) {
                  target.chartData.series.map(cds => {
                    if (cds.name === dk) {
                      cds.data[_currentXIndex] = DTM[dk]
                    }
                  })
                } else {
                  _lineOptSeriesType.push(dk)
                  target.chartData.series.push({
                    name: dk,
                    type: 'line',
                    data: [DTM[dk]]
                  })
                  target.chartData.legend.data.push(dk)
                }
              }
            }
          })
          let chartElm = this.$refs['chart_line']
          if (chartElm) {
            if (Array.isArray(chartElm)) {
              chartElm[0].action()
            } else {
              chartElm.action()
            }
          }
        })
      },
      /**
       * 图表点击事件
       * @param p
       */
      chartClick(p) {
        //  图表点击查询话单详情 （1 - 4 类型）
        this.detailDialog = true
        let _currentQuery = clone(this.tabs[this.currentTab])
        // 查询条件
        _currentQuery.keyVal = p.seriesName // 当前查询的电话号码
        _currentQuery.queryForm.attribution = p.name // 归属地
        //  详单列表查询
        this.detailQueryCondition = Object.assign({}, _currentQuery)
      }
    },
    created() {
      this.active = this.$route.path
    },
    mounted() {}
  }

</script>
