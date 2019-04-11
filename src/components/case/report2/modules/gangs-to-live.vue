<!-- 团伙同住信息 -->
<template>
<div class="certificate">
  <!-- 标题 -->
  <card-header title="团伙同住信息" :tool="false&&socialRelationAddRule()" :add="true" @call:add="addSelectDialog = true">
    <div slot="toggle">
      <el-button type="text" :class="{'iconfont':true,'icon-packup-2':flag,'icon-unfold1':!flag}" style="line-height: 15px;padding: 10px" @click="toggle"></el-button>
    </div>
  </card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="kinship-box" v-show="flag">
    <el-col :span="24">
      <!--时间轴展示-->
      <!--<time-line :data="timeLineData"></time-line>-->

      <div class="top-bar-tool_div">
        <!--<slot name="nullTip"></slot>-->

        <el-tabs v-model="tabItem.type" v-for="(tabItem,index) in tableData" :key="index" @tab-click="handleTabClick" style="margin-bottom: 0;">
          <el-tab-pane :name="tabItem.type">
            <span slot="label">{{tabItem.title}}
              <span class="wrn_text">(
                <span :ref="'wrnTextRef_'+tabItem.type">{{tabItem.childrenCount}}</span>)</span>
            </span>
            <!-- hostel / 同旅店 -->
            <hostel-table v-if="tabItem.type === 'hostel' && checkUserRuleCase('ajgl/hostel/list', caseId,true,cjrId)" :tableData="tabItem.children" :addSwitch="hAdd.hostelAdd" :theSuspectList="theSuspectListLoc" :theSuspect="theSuspectListLoc" @removeRow="changRow('hostel','r')"
              @addRow="changRow('hostel','a')" @close="hAdd.hostelAdd = false"@update:Data ="updataData"></hostel-table>

            <!-- cohabit / 同暂住 [关联GP库，数据特殊处理]-->
            <cohabit-table v-if="tabItem.type === 'cohabit' && checkUserRuleCase('ajgl/cohabit/list', caseId,true,cjrId)" :tableData="tabItem.children" :addSwitch="hAdd.cohabitAdd" :theSuspect="theSuspectListLoc" :theSuspectList="theSuspectListLoc" @removeRow="changRow('cohabit','r')"
              @addRow="changRow('cohabit','a')" @close="hAdd.cohabitAdd = false"@update:Data ="updataData"></cohabit-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-col>
  </el-row>

  <!-- 选择添加的团伙同住类型 -->
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="addSelectDialog" title="选择添加的团伙同住类型" size="small" :close-on-click-modal="false" style="text-align: left;">

    <el-form ref="addSelectFormRef" :rules="addSelectFormRules" :model="addSelectForm" label-width="150px">
      <el-row :gutter="10" style="margin: 10px 20px 10px 0;">
        <el-col :span="24">
          <el-form-item label="添加团伙同住类型" prop="activeName">
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
  import hostelTable from './socialTemplate2/hostel-table.vue'
  import cohabitTable from './socialTemplate2/cohabit-table.vue'
  import timeLine from './time-line.vue'
  import reportMixin from '../reportMixin'
  //  import {mapState} from 'vuex'
  import { clone } from '../../../../utils/util'
  import mixin from '../../../../utils/mixin'
  export default {
    mixins: [mixin, reportMixin],
    computed: {},
    components: {
      cardHeader,
      timeLine,
      hostelTable,
      cohabitTable
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
        addSelectDialog: false, // 添加团伙同住类型选择
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
          hostelAdd: false,
          cohabitAdd: false
        },
        caseId: '',
        cjrId: '',
        tableData: [
          { title: '同旅店', type: 'hostel', data: [] },
          { title: '同暂住', type: 'cohabit', data: [] }
        ],
        activeName: '', // 当前选择栏目
        timeLineData: []
      }
    },
    methods: {
      toggle() {
        this.flag = !this.flag
      },
      dataModel(val) {
        // 数据显示转换
        let _tempTab = val
        if (this.reportData) { // 判断是否显示报告数据
          _tempTab = this.reportData
        }
        this.tableData.map(rr => {
          if (rr.type === 'cohabit') {
            rr.children = clone(_tempTab['tcohabit'])
            rr.childrenCount = rr.children.length
          }
          if (rr.type === 'hostel') {
            rr.children = clone(_tempTab['thostel'])
            rr.childrenCount = rr.children.length
          }
        })
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
        this.addSelectDialog = false
      },
      /**
       * 团伙同住数据添加权限验证
       */
      socialRelationAddRule() {
        let _t = this.activeName
        let _rState = false
        switch (_t) {
          case 'hostel': // 同旅店
            _rState = this.checkUserRuleCase('ajgl/hostel/save', this.caseId)
            break;
          case 'cohabit': // 同暂住
            _rState = this.checkUserRuleCase('ajgl/cohabit/addtz', this.caseId)
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
        this.theSuspectListLoc = this.theSuspectList.map(r => {
          return {
            id: r.baseinfo.id,
            name: r.baseinfo.xm
          }
        })
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
