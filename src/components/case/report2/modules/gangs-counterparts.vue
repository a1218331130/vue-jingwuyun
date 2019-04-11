<!-- 团伙同住信息 -->
<template>
<div class="certificate">
  <!-- 标题 -->
  <card-header title="团伙同行信息" :tool="false&&socialRelationAddRule()" :add="true" @call:add="addSelectDialog = true">
    <div slot="toggle">
      <el-button type="text" :class="{'iconfont':true,'icon-packup-2':flag,'icon-unfold1':!flag}" style="line-height: 15px;padding: 10px" @click="toggle"></el-button>
    </div>
  </card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="kinship-box" v-show="flag">
    <el-col :span="24">
      <!--<time-line :data="timeLineData"></time-line>-->

      <div class="top-bar-tool_div">
        <!--<slot name="nullTip"></slot>-->

        <el-tabs v-model="tabItem.type" v-for="(tabItem,index) in tableData" :key="index" @tab-click="handleTabClick" style="margin-bottom: 0;">
          <el-tab-pane :name="tabItem.type">
            <span slot="label">{{tabItem.title}}
              <span class="wrn_text">(
                <span :ref="'wrnTextRef_'+tabItem.type">{{tabItem.childrenCount}}</span>)</span>
            </span>
            <!-- flight / 同行航班 -->
            <flight-table v-if="tabItem.type === 'flight' && checkUserRuleCase('ajgl/flight/list', caseId,true,cjrId)" :tableData="tabItem.children" :addSwitch="hAdd.flightAdd" :theSuspectList="theSuspectListLoc" @removeRow="changRow('flight','r')" @addRow="changRow('flight','a')"
              @close="hAdd.flightAdd = false" @update:Data ="updataData" ></flight-table>
            <!-- railway / 同行铁路 -->
            <railway-table v-if="tabItem.type === 'railway' && checkUserRuleCase('ajgl/railway/list', caseId,true,cjrId)" :tableData="tabItem.children" :addSwitch="hAdd.railwayAdd" :theSuspectList="theSuspectListLoc" @removeRow="changRow('railway','r')" @addRow="changRow('railway','a')"
              @close="hAdd.railwayAdd = false" @update:Data ="updataData"></railway-table>


            <!-- cyberbar / 同网吧 -->
            <cyberbar-table v-if="tabItem.type === 'cyberbar' && checkUserRuleCase('ajgl/cyberbar/list', caseId,true,cjrId)" :tableData="tabItem.children" :addSwitch="hAdd.cyberbarAdd" :theSuspectList="theSuspectListLoc" @removeRow="changRow('cyberbar','r')" @addRow="changRow('cyberbar','a')"
              @close="hAdd.cyberbarAdd = false" @update:Data ="updataData"></cyberbar-table>
          </el-tab-pane>
        </el-tabs>
      </div>

    </el-col>
  </el-row>

  <!-- 选择添加的团伙同行类型 -->
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="addSelectDialog" title="选择添加的团伙同行类型" size="small" :close-on-click-modal="false" style="text-align: left;">

    <el-form ref="addSelectFormRef" :rules="addSelectFormRules" :model="addSelectForm" label-width="150px">
      <el-row :gutter="10" style="margin: 10px 20px 10px 0;">
        <el-col :span="24">
          <el-form-item label="添加团伙同行类型" prop="activeName">
            <el-select placeholder="请选择" v-model="activeName" filterable style="width: 100%">
              <el-option :label="item.title" :value="item.type" :key="index" v-for="(item,index) in tableData"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="" @click="addSelectDialog = false">取消</el-button>
      <el-button type="primary" @click="add(activeName)">确定</el-button>
    </div>
  </el-dialog>
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
    padding-left: 2rem;
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
  import reportMixin from '../reportMixin'
  import flightTable from './socialTemplate2/flight-table.vue'
  import railwayTable from './socialTemplate2/railway-table.vue'
  import cyberbarTable from './socialTemplate2/cyberbar-table.vue'
  import timeLine from './time-line.vue'
  //  import {mapState} from 'vuex'
  import mixin from '../../../../utils/mixin'
  import { clone } from '../../../../utils/util'

  export default {
    mixins: [mixin, reportMixin],
    computed: {},
    components: {
      cardHeader,
      timeLine,
      flightTable,
      railwayTable,
      cyberbarTable
    },
    props: {
      reportData: {
        type: Array,
        default: () => {
          return null
        }
      },
      theSuspectList: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        flag: false,
        addSelectDialog: false, // 添加团伙同行类型选择
        addSelectForm: {
          activeName: ''
        },
        addSelectFormRules: {
          name: [
            { required: true, message: '不能为空' }
          ]
        },
        theSuspectListLoc: [], // 案件相关嫌疑人列表
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
        cjrId: '',
        timeLineData: []
      }
    },
    methods: {
      dataModel(val) {
        // 数据显示转换
        let _tempTab = val
        if (this.reportData) { // 判断是否显示报告数据
          _tempTab = this.reportData
        }
        this.tableData.map(rr => {
          if (rr.type === 'flight') {
            rr.children = clone(_tempTab['tflight'])
            rr.childrenCount = rr.children.length
          }
          if (rr.type === 'railway') {
            rr.children = clone(_tempTab['trailway'])
            rr.childrenCount = rr.children.length
          }
          if (rr.type === 'cyberbar') {
            rr.children = clone(_tempTab['tcyber'])
            rr.childrenCount = rr.children.length
          }
        })
      },
      handleTabClick(tab, event) {
        //        console.log(tab.name, event)
      },
      /**
       * 团伙同行数据添加权限验证
       */
      socialRelationAddRule() {
        let _t = this.activeName
        let _rState = false
        switch (_t) {
          case 'flight': // 同航班
            _rState = this.checkUserRuleCase('ajgl/flight/save', this.caseId)
            break;
          case 'railway': // 同铁路
            _rState = this.checkUserRuleCase('ajgl/railway/save', this.caseId)
            break;
          case 'cyberbar': // 同网吧
            _rState = this.checkUserRuleCase('ajgl/cyberbar/save', this.caseId)
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
        this.addSelectDialog = false
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
        this.theSuspectListLoc = this.theSuspectList.map(r => {
          return {
            id: r.baseinfo.id,
            name: r.baseinfo.xm
          }
        })
      },
      toggle() {
        this.flag = !this.flag
      }
    },
    mounted() {},
    watch: {},
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.cjrId = this.$route.query.b // 初始化获取案件id
      this.tableData = this.dataListMatch(this.reportData)
      this.activeName = this.tableData[0].type
      this.queryTheSuspectList() // 初始化嫌疑人列表
    }
  }

</script>
