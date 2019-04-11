<!-- 轨迹分析统计 -->
<template>
  <div class="certificate">
    <!-- 标题 -->
    <card-header title="社会关系"
                 :tool="socialRelationAddRule()"
                 :add="true"
                 @call:add="add(activeName)"
    ></card-header>
    <!-- 内容 -->
    <el-row :gutter="15" class="kinship-box">
      <el-col :span="24">

        <div class="top-bar-tool_div">
          <el-tabs v-model="activeName" @tab-click="handleTabClick" style="margin-bottom: 0;">
            <el-tab-pane v-for="(tabItem,index) in tableData" :key="index" :name="tabItem.type">
              <span slot="label">{{tabItem.title}}<span class="wrn_text">(
                <span :ref="'wrnTextRef_'+tabItem.type">{{tabItem.childrenCount}}</span>)</span></span>
              <!-- flight / 同行航班 -->
              <flight-table v-if="tabItem.type === 'flight' && checkRuleCase('ajgl/flight/list', caseId)"
                            :tableData="tabItem.children"
                            :addSwitch="hAdd.flightAdd"
                            :theSuspect="suspect"
                            @removeRow="changRow('flight','r')"
                            @addRow="changRow('flight','a')"
                            @close="hAdd.flightAdd = false"></flight-table>
              <!-- railway / 同行铁路 -->
              <railway-table v-if="tabItem.type === 'railway' && checkRuleCase('ajgl/railway/list', caseId)"
                             :tableData="tabItem.children"
                             :addSwitch="hAdd.railwayAdd"
                             :theSuspect="suspect"
                             @removeRow="changRow('railway','r')"
                             @addRow="changRow('railway','a')"
                             @close="hAdd.railwayAdd = false"></railway-table>

              <!-- hostel / 同旅店 -->
              <hostel-table v-if="tabItem.type === 'hostel' && checkRuleCase('ajgl/hostel/list', caseId)"
                            :tableData="tabItem.children"
                            :addSwitch="hAdd.hostelAdd"
                            :theSuspect="suspect"
                            @removeRow="changRow('hostel','r')"
                            @addRow="changRow('hostel','a')"
                            @close="hAdd.hostelAdd = false"></hostel-table>

              <!-- cohabit / 同暂住 [关联GP库，数据特殊处理]-->
              <cohabit-table v-if="tabItem.type === 'cohabit' && checkRuleCase('ajgl/cohabit/list', caseId)"
                             :tableData="tabItem.children"
                             :addSwitch="hAdd.cohabitAdd"
                             :theSuspect="suspect"
                             @removeRow="changRow('cohabit','r')"
                             @addRow="changRow('cohabit','a')"
                             @close="hAdd.cohabitAdd = false"></cohabit-table>

              <!-- cyberbar / 同网吧 -->
              <cyberbar-table v-if="tabItem.type === 'cyberbar' && checkRuleCase('ajgl/cyberbar/list', caseId)"
                              :tableData="tabItem.children"
                              :addSwitch="hAdd.cyberbarAdd"
                              :theSuspect="suspect"
                              @removeRow="changRow('cyberbar','r')"
                              @addRow="changRow('cyberbar','a')"
                              @close="hAdd.cyberbarAdd = false"></cyberbar-table>

              <!-- samecase / 同案 [关联GP库，数据特殊处理]-->
              <samecase-table v-if="tabItem.type === 'samecase' && checkRuleCase('ajgl/samecase/list', caseId)"
                              :tableData="tabItem.children"
                              :addSwitch="hAdd.samecaseAdd"
                              :theSuspect="suspect"
                              @removeRow="changRow('samecase','r')"
                              @addRow="changRow('samecase','a')"
                              @close="hAdd.samecaseAdd = false"></samecase-table>

              <!-- samehousehold / 同户 [关联GP库，数据特殊处理]-->
              <samehousehold-table
                v-if="tabItem.type === 'samehousehold' && checkRuleCase('ajgl/samehousehold/list', caseId)"
                :tableData="tabItem.children"
                :addSwitch="hAdd.samehouseholdAdd"
                :theSuspect="suspect"
                @removeRow="changRow('samehousehold','r')"
                @addRow="changRow('samehousehold','a')"
                @close="hAdd.samehouseholdAdd = false"></samehousehold-table>

            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
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
<style>
  .certificate .el-tabs__nav {
    float: right;
  }

  .certificate span {
    margin-right: 5px;
  }
</style>

<script>
  import cardHeader from '../../base/card-header.vue'

  import flightTable from './socialTemplate/flight-table.vue'
  import railwayTable from './socialTemplate/railway-table.vue'
  import hostelTable from './socialTemplate/hostel-table.vue'
  import cohabitTable from './socialTemplate/cohabit-table.vue'
  import cyberbarTable from './socialTemplate/cyberbar-table.vue'
  import samecaseTable from './socialTemplate/samecase-table.vue'
  import samehouseholdTable from './socialTemplate/samehousehold-table.vue'

  import {clone} from '../../../../utils/util'
  import mixin from '../../../../utils/mixin'
  export default {
    mixins: [mixin],
    components: {
      cardHeader,

      flightTable,
      railwayTable,
      hostelTable,
      cohabitTable,
      cyberbarTable,
      samecaseTable,
      samehouseholdTable
    },
    props: ['data', 'theSuspect'],
    data() {
      return {
        hAdd: { // 添加操作触开关
          flightAdd: false,
          railwayAdd: false,
          hostelAdd: false,
          cohabitAdd: false,
          cyberbarAdd: false,
          samecaseAdd: false,
          samehouseholdAdd: false
        },
        caseId: '', // 案件ID
        suspect: '', // 嫌疑人信息
        activeName: '', // 当前选择栏目
        tableData: []  // 表格数据
      }
    },
    methods: {
      handleTabClick(tab, event) {
//        console.log(tab.name, event)
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
          case 'hostel': // 同旅店
            this.hAdd.hostelAdd = true
            break;
          case 'cohabit': // 同暂住
            this.hAdd.cohabitAdd = true
            break;
          case 'cyberbar': // 同网吧
            this.hAdd.cyberbarAdd = true
            break;
          case 'samecase': // 同案
            this.hAdd.samecaseAdd = true
            break;
          case 'samehousehold': // 同户
            this.hAdd.samehouseholdAdd = true
            break;
        }
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
          case 'hostel': // 同旅店
            _rState = this.checkRuleCase('ajgl/hostel/save', this.caseId)
            break;
          case 'cohabit': // 同暂住
            _rState = this.checkRuleCase('ajgl/cohabit/addtz', this.caseId)
            break;
          case 'cyberbar': // 同网吧
            _rState = this.checkRuleCase('ajgl/cyberbar/save', this.caseId)
            break;
          case 'samecase': // 同案
            _rState = this.checkRuleCase('ajgl/samecase/addxyr', this.caseId)
            break;
          case 'samehousehold': // 同户
            _rState = this.checkRuleCase('ajgl/samehousehold/addth', this.caseId)
            break;
        }
        return _rState
      }
    },
    watch: {},
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      if (this.data) {
        this.tableData = clone(this.data).map(rt => { // 替换数据集合
          // 遍历map子集
          let _children = rt.data || []
          return {
            title: rt.title,
            type: rt.type,
            childrenCount: _children.length,
            children: _children
          }
        })
        this.activeName = this.tableData[0].type
        this.suspect = clone(this.theSuspect)
      }
    }
  }
</script>
