<!-- 团伙同住信息 -->
<template>
  <div class="certificate">
    <!-- 标题 -->
    <card-header title="团伙同住信息"
                 :tool="socialRelationAddRule()"
                 :add="true"
                 @call:add="add(activeName)"
    ></card-header>
    <!-- 内容 -->
    <el-row :gutter="15" class="kinship-box">
      <el-col :span="24">
        <!--时间轴展示-->
        <!--<time-line :data="timeLineData"></time-line>-->

        <div class="top-bar-tool_div">
          <el-tabs v-model="activeName" @tab-click="handleTabClick" style="margin-bottom: 0;">
            <el-tab-pane v-for="(tabItem,index) in tableData" :key="index" :name="tabItem.type">
              <span slot="label">{{tabItem.title}}<span class="wrn_text">(
                <span :ref="'wrnTextRef_'+tabItem.type">{{tabItem.childrenCount}}</span>)</span></span>
              <!-- hostel / 同旅店 -->
              <hostel-table v-if="tabItem.type === 'hostel' && checkRuleCase('ajgl/hostel/list', caseId)"
                            :tableData="tabItem.children"
                            :addSwitch="hAdd.hostelAdd"
                            :theSuspectList="theSuspectList"
                            @removeRow="changRow('hostel','r')"
                            @addRow="changRow('hostel','a')"
                            @close="hAdd.hostelAdd = false"></hostel-table>

              <!-- cohabit / 同暂住 [关联GP库，数据特殊处理]-->
              <cohabit-table v-if="tabItem.type === 'cohabit' && checkRuleCase('ajgl/cohabit/list', caseId)"
                             :tableData="tabItem.children"
                             :addSwitch="hAdd.cohabitAdd"
                             :theSuspectList="theSuspectList"
                             @removeRow="changRow('cohabit','r')"
                             @addRow="changRow('cohabit','a')"
                             @close="hAdd.cohabitAdd = false"></cohabit-table>
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
  import hostelTable from './socialTemplate/hostel-table.vue'
  import cohabitTable from './socialTemplate/cohabit-table.vue'
  import timeLine from './time-line.vue'
  import { mapState } from 'vuex'
  import { clone } from '../../../../utils/util'
  import mixin from '../../../../utils/mixin'
  import reportMixin from '../reportMixin'
  import {
    FETCH_GANGLIVE_LIST,
    FETCH_HOSTEL_RELATE_LIST,
    FETCH_COHABIT_RELATE_LIST,
    FETCH_SUSPECT_CASE_PEOPLE_LIST
  } from '../../../../store/types'
  export default {
    mixins: [mixin, reportMixin],
    computed: {
      ...mapState(['involvedCasePeople', 'hostelRelate', 'cohabitRelate', 'suspectCasePeople'])
    },
    components: {
      cardHeader,
      timeLine,
      hostelTable,
      cohabitTable
    },
    data() {
      return {
        theSuspectList: [], // 案件相关嫌疑人列表
        hAdd: { // 添加操作触开关
          hostelAdd: false,
          cohabitAdd: false
        },
        caseId: '',
        tableData: [
          { title: '同旅店', type: 'hostel', data: [] },
          { title: '同暂住', type: 'cohabit', data: [] }
        ],
        activeName: '', // 当前选择栏目
        timeLineData: []
      }
    },
    methods: {
      /**
       *  查询团伙同住 时间轴列表
       */
      queryList() {
        if (this.checkRuleCase('ajgl/suspect/ganglive', this.caseId) === true) {
          this.dispatch(FETCH_GANGLIVE_LIST, {
            ajid: this.caseId
          })
        }
      },
      /**
       * 查询同住旅店团伙
       */
      queryListHostel() {
        if (this.checkRuleCase('ajgl/hostel/list', this.caseId)) {
          this.dispatch(FETCH_HOSTEL_RELATE_LIST, {
            ajid: this.caseId,
            sfxyrtz: '1'
          }).then((row) => {
            this.tableData.map(rr => {
              if (rr.type === 'hostel') {
                rr.children = clone(this.hostelRelate.fetchHostelRelateList)
                rr.childrenCount = rr.children.length
              }
            })
          })
        }
      },
      /**
       * 查询同暂住团伙
       */
      queryListCohabit() {
        if (this.checkRuleCase('ajgl/cohabit/list', this.caseId)) {
          this.dispatch(FETCH_COHABIT_RELATE_LIST, {
            ajid: this.caseId,
            sfxyrtz: '1'
          }).then((row) => {
            this.tableData.map(rr => {
              if (rr.type === 'cohabit') {
                rr.children = clone(this.cohabitRelate.fetchCohabitRelateList)
                rr.childrenCount = rr.children.length
              }
            })
          })
        }
      },
      handleTabClick(tab, event) {
        //        console.log(tab.name, event)
      },

      /**
       * 添加数据
       * @param t 操作类型
       */
      add(t) {
        switch (t) {
          case 'hostel': // 同旅店
            this.hAdd.hostelAdd = true
            break;
          case 'cohabit': // 同暂住
            this.hAdd.cohabitAdd = true
            break;
        }
      },
      /**
       * 社会关系数据添加权限验证
       */
      socialRelationAddRule() {
        let _t = this.activeName
        let _rState = false
        switch (_t) {
          case 'hostel': // 同旅店
            _rState = this.checkRuleCase('ajgl/hostel/save', this.caseId)
            break;
          case 'cohabit': // 同暂住
            _rState = this.checkRuleCase('ajgl/cohabit/addtz', this.caseId)
            break;
        }
        return _rState
      },
      /**
       * 添加/删除数据调整条数
       * @param t
       */
      changRow(t, s) {
        let _thisNum = parseInt(this.$refs['wrnTextRef_' + t][0].innerText)
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
        if (this.checkRuleCase('ajgl/suspect/list', this.caseId)) {
          this.dispatch(FETCH_SUSPECT_CASE_PEOPLE_LIST, {
            ajid: this.caseId,
            PageIndex: 1,
            PageSize: 100000
          }).then(s => {
            this.theSuspectList = clone(this.suspectCasePeople.PageData).map(r => {
              return {
                id: r.id,
                name: r.xm
              }
            })
          })
        }
      }
    },
    mounted() {},
    watch: {
      'involvedCasePeople.fetchGangliveList' (val) {
        if (val) {
          let _tempMonths = []
          val.map(r => {
            // 存转换内容
            let _contentList = {
              details: [{
                label: '同住人',
                value: r.xm + ' / ' + r.xyrxm
              }, {
                label: '入住房号',
                value: r.rzfh
              }, {
                label: '入住时间',
                value: r.rzsj
              }, {
                label: '旅馆名称',
                value: r.lgmc
              }, {
                label: '旅馆地址',
                value: r.lgdz
              }, {
                label: '旅馆编码',
                value: r.lgbm
              }, {
                label: '退房时间',
                value: r.tfsj
              }]
            }
            // 存月份日期
            if (_tempMonths.time === r.tzrq) {
              _tempMonths.contentList.push(_contentList)
            } else {
              _tempMonths = [{
                time: r.tzrq,
                moreUrl: 'icon-city',
                contentList: [_contentList]
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
        } else {
          this.timeLineData = []
        }
      }
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      //      this.queryList()
      this.tableData = this.dataListMatch(this.tableData)
      this.activeName = this.tableData[0].type
      this.queryListHostel() // 初始化团伙同住旅店
      this.queryListCohabit() // 初始化团伙同暂住
      this.queryTheSuspectList() // 初始化嫌疑人列表
    }
  }

</script>
