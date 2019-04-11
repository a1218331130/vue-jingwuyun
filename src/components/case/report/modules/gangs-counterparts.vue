<!-- 团伙同住信息 -->
<template>
  <div class="certificate">
    <!-- 标题 -->
    <card-header title="团伙同行信息"
                 :tool="socialRelationAddRule()"
                 :add="true"
                 @call:add="add(activeName)"
    ></card-header>
    <!-- 内容 -->
    <el-row :gutter="15" class="kinship-box">
      <el-col :span="24">
        <!--<time-line :data="timeLineData"></time-line>-->

        <div class="top-bar-tool_div">
          <el-tabs v-model="activeName" @tab-click="handleTabClick" style="margin-bottom: 0;">
            <el-tab-pane v-for="(tabItem,index) in tableData" :key="index" :name="tabItem.type">
              <span slot="label">{{tabItem.title}}<span class="wrn_text">(
                <span :ref="'wrnTextRef_'+tabItem.type">{{tabItem.childrenCount}}</span>)</span></span>
              <!-- flight / 同行航班 -->
              <flight-table v-if="tabItem.type === 'flight' && checkRuleCase('ajgl/flight/list', caseId)"
                            :tableData="tabItem.children"
                            :addSwitch="hAdd.flightAdd"
                            :theSuspectList="theSuspectList"
                            @removeRow="changRow('flight','r')"
                            @addRow="changRow('flight','a')"
                            @close="hAdd.flightAdd = false"></flight-table>
              <!-- railway / 同行铁路 -->
              <railway-table v-if="tabItem.type === 'railway' && checkRuleCase('ajgl/railway/list', caseId)"
                             :tableData="tabItem.children"
                             :addSwitch="hAdd.railwayAdd"
                             :theSuspectList="theSuspectList"
                             @removeRow="changRow('railway','r')"
                             @addRow="changRow('railway','a')"
                             @close="hAdd.railwayAdd = false"></railway-table>


              <!-- cyberbar / 同网吧 -->
              <cyberbar-table v-if="tabItem.type === 'cyberbar' && checkRuleCase('ajgl/cyberbar/list', caseId)"
                              :tableData="tabItem.children"
                              :addSwitch="hAdd.cyberbarAdd"
                              :theSuspectList="theSuspectList"
                              @removeRow="changRow('cyberbar','r')"
                              @addRow="changRow('cyberbar','a')"
                              @close="hAdd.cyberbarAdd = false"></cyberbar-table>
            </el-tab-pane>
          </el-tabs>
        </div>

      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .certificate .el-tabs__nav {
    float: right;
  }

  .certificate .el-tabs__nav {
    float: right;
  }

  .certificate span {
    margin-right: 5px;
  }

  .kinship-box {
    text-align: center;
  }

  .wrn_text {
    color: #fd8a8a;
  }

  .describe-text {
    white-space: normal;
  }

</style>


<script>
  import cardHeader from '../../base/card-header.vue'
  import flightTable from './socialTemplate/flight-table.vue'
  import railwayTable from './socialTemplate/railway-table.vue'
  import cyberbarTable from './socialTemplate/cyberbar-table.vue'
  import timeLine from './time-line.vue'
  import { mapState } from 'vuex'
  import mixin from '../../../../utils/mixin'
  import { clone } from '../../../../utils/util'
  import {
    FETCH_SUSPECT_CASE_PEOPLE_LIST,
    FETCH_FLIGHT_RELATE_LIST,
    FETCH_RAILWAY_RELATE_LIST,
    FETCH_CYBERBAR_RELATE_LIST,
    FETCH_GANG_LIST // 同伙同行
  } from '../../../../store/types'
  export default {
    mixins: [mixin],
    computed: {
      ...mapState(['involvedCasePeople', 'suspectCasePeople', 'flightRelate', 'railwayRelate', 'cyberbarRelate'])
    },
    components: {
      cardHeader,
      timeLine,
      flightTable,
      railwayTable,
      cyberbarTable
    },
    data() {
      return {
        theSuspectList: [], // 案件相关嫌疑人列表
        hAdd: { // 添加操作触开关
          flightAdd: false,
          railwayAdd: false,
          cyberbarAdd: false
        },
        tableData: [
          { title: '同航班', type: 'flight', data: [] },
          { title: '同铁路', type: 'railway', data: [] },
          { title: '同网吧', type: 'cyberbar', data: [] }
        ],
        activeName: '', // 当前选择栏目
        caseId: '',
        timeLineData: []
      }
    },
    methods: {
      handleTabClick(tab, event) {
        //        console.log(tab.name, event)
      },
      /**
       *  查询同行 时间轴列表
       */
      queryList() {
        if (this.checkRuleCase('ajgl/suspect/gang', this.caseId)) {
          this.dispatch(FETCH_GANG_LIST, {
            ajid: this.caseId
          })
        }
      },
      /**
       * 社会关系数据添加权限验证
       */
      socialRelationAddRule() {
        let _t = this.activeName
        let _rState = false
        switch (_t) {
          case 'flight': // 同航班
            _rState = this.checkRuleCase('ajgl/flight/save', this.caseId)
            break;
          case 'railway': // 同铁路
            _rState = this.checkRuleCase('ajgl/railway/save', this.caseId)
            break;
          case 'cyberbar': // 同网吧
            _rState = this.checkRuleCase('ajgl/cyberbar/save', this.caseId)
            break;
        }
        return _rState
      },
      /**
       * 添加数据
       * @param t 操作类型
       */
      add(t) {
        switch (t) {
          case 'flight': // 同航班
            this.hAdd.flightAdd = true
            break;
          case 'railway': // 同铁路
            this.hAdd.railwayAdd = true
            break;
          case 'cyberbar': // 同网吧
            this.hAdd.cyberbarAdd = true
            break;
        }
      },
      /**
       * 添加/删除数据调整条数
       * @param t
       */
      changRow(t, s) {
        console.log(t, s, 'tssafasdf')
        let _thisNum = parseInt(this.$refs['wrnTextRef_' + t][0].innerText)
        console.log(_thisNum, 'thisNum')
        if (s === 'a') {
          this.$refs['wrnTextRef_' + t][0].innerText = _thisNum + 1
        } else if (s === 'r') {
          this.$refs['wrnTextRef_' + t][0].innerText = _thisNum - 1
        }
      },
      /**
       * 数据接口匹配
       * @param d
       */
      dataListMatch(d) {
        return clone(d).map(rt => { // 替换数据集合
          // 遍历map子集
          let _children = rt.data || []
          return {
            title: rt.title,
            type: rt.type,
            childrenCount: _children.length,
            children: _children
          }
        })
      },
      /**
       * 获取案件相关所有嫌疑人列表
       */
      queryTheSuspectList() {
        console.log('get  suspectcasepeole ')
        if (this.checkRuleCase('ajgl/suspect/list', this.caseId)) {
          this.dispatch(FETCH_SUSPECT_CASE_PEOPLE_LIST, {
            ajid: this.caseId,
            PageIndex: 1,
            PageSize: 100000
          }).then(s => {
            console.log('suspectcasepeople', this.suspectCasePeople)
            this.theSuspectList = clone(this.suspectCasePeople.PageData).map(r => {
              return {
                id: r.id,
                name: r.xm
              }
            })
          })
        }
      },
      /**
       * 查询同行航班
       */
      queryListFlight() {
        if (this.checkRuleCase('ajgl/flight/list', this.caseId)) {
          this.dispatch(FETCH_FLIGHT_RELATE_LIST, {
            ajid: this.caseId,
            sfxyrtx: '1'
          }).then((row) => {
            this.tableData.map(rr => {
              if (rr.type === 'flight') {
                rr.children = clone(this.flightRelate.fetchFlightRelateList)
                rr.childrenCount = rr.children.length
              }
            })
          })
        }
      },
      /**
       * 查询同行铁路
       */
      queryListRailway() {
        if (this.checkRuleCase('ajgl/railway/list', this.caseId)) {
          this.dispatch(FETCH_RAILWAY_RELATE_LIST, {
            ajid: this.caseId,
            sfxyrtx: '1'
          }).then((row) => {
            this.tableData.map(rr => {
              if (rr.type === 'railway') {
                rr.children = clone(this.railwayRelate.fetchRailwayRelateList)
                rr.childrenCount = rr.children.length
              }
            })
          })
        }
      },
      /**
       * 查询同行网吧
       */
      queryListCyberbar() {
        if (this.checkRuleCase('ajgl/cyberbar/list', this.caseId)) {
          this.dispatch(FETCH_CYBERBAR_RELATE_LIST, {
            ajid: this.caseId,
            sfxyrtx: '1'
          }).then((row) => {
            this.tableData.map(rr => {
              if (rr.type === 'cyberbar') {
                rr.children = clone(this.cyberbarRelate.fetchCyberbarRelateList)
                rr.childrenCount = rr.children.length
              }
            })
          })
        }
      }
    },
    mounted() {},
    watch: {
      'involvedCasePeople.fetchGangList' (val) {
        this.timeLineData = [] // 数据重置
        let _tempMonths = [] // 临时月份处理
        if (val.flight) { // 航班
          val.flight.map(r => {
            let _flightContentList = {
              details: [{
                label: '姓名',
                value: r.xm
              }, {
                label: '证件号码',
                value: r.zjhm
              }, {
                label: '航空',
                value: r.hk
              }, {
                label: '订票时间',
                value: r.dpsj
              }, {
                label: '起落机场',
                value: r.qfdjc + '(' + r.qfdd + ')' + '-->' + r.lddjc + '(' + r.lddd + ')'
              }, {
                label: '起飞时间',
                value: r.qfsj
              }, {
                label: '到达时间',
                value: r.ddsj
              }]
            }
            // 存月份日期
            if (_tempMonths.time === r.tzrq) {
              _tempMonths.contentList.push(_flightContentList)
            } else {
              _tempMonths = [{
                time: r.tzrq,
                moreUrl: 'icon-feiji2',
                contentList: [_flightContentList]
              }]
            }
            // 存年份
            if (this.timeLineData.year === r.tznf) {
              this.timeLineData.month.push(_tempMonths)
            } else {
              this.timeLineData = [{
                type: true, // 是否展开显示
                year: r.tznf,
                month: _tempMonths
              }]
            }
          })
        } else if (val.railway) { // 地铁
          val.railway.map(r => {
            let _railwayContentList = {
              details: [{
                label: '姓名',
                value: r.xm
              }, {
                label: '证件号码',
                value: r.zjhm
              }, {
                label: '购票时间',
                value: r.spsj
              }, {
                label: '售票处/窗口/操作员',
                value: r.spc + '/' + r.ck + '/' + r.czy
              }, {
                label: '票种',
                value: r.pz
              }, {
                label: '票价',
                value: r.pj
              }, {
                label: '车次/车厢号/座位号/席别',
                value: r.cc + '/' + r.cxh + '/' + r.zwh + '/' + r.xb
              }, {
                label: '乘车区间',
                value: r.fz + '(' + r.ccsj + ')' + '-->' + r.dz + '(' + r.dzsj + ')'
              }]
            }
            // 存月份日期
            if (_tempMonths.time === r.tzrq) {
              _tempMonths.contentList.push(_railwayContentList)
            } else {
              _tempMonths = [{
                time: r.tzrq,
                moreUrl: 'icon-huoche',
                contentList: [_railwayContentList]
              }]
            }
            // 存年份
            if (this.timeLineData.year === r.tznf) {
              this.timeLineData.month.push(_tempMonths)
            } else {
              this.timeLineData = [{
                type: true, // 是否展开显示
                year: r.tznf,
                month: _tempMonths
              }]
            }
          })
        }
      }
    },
    created() {
      console.log('初始化...............')
      this.caseId = this.$route.query.a // 初始化获取案件id
      //      this.queryList()
      this.tableData = this.dataListMatch(this.tableData)
      this.activeName = this.tableData[0].type
      this.queryListFlight()
      this.queryListRailway()
      this.queryListCyberbar()
      this.queryTheSuspectList() // 初始化嫌疑人列表
    }
  }

</script>
