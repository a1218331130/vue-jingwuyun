<!-- 轨迹分析统计 -->
<template>
<div class="certificate">
  <!-- 标题 -->
  <card-header title="社会关系":tool="false&&socialRelationAddRule()" :add="true" @call:add="addSelectDialog = true">
    <div slot="toggle">
      <el-button type="text" :class="{'iconfont':true,'icon-packup-2':flag,'icon-unfold1':!flag}" style="line-height: 15px;padding: 10px" @click="toggle"></el-button>
    </div>
  </card-header>
<!-- 内容 -->
<el-row :gutter="15" class="kinship-box" v-show="flag">
  <el-col :span="24">
    <div class="top-bar-tool_div">
      <!--<slot name="nullTip"></slot>  v-if="tabItem.children.length > 0"-->
      <el-tabs v-model="tabItem.type" v-for="(tabItem,index) in tableData" :key="index" @tab-click="handleTabClick" style="margin-bottom: 0;">
        <el-tab-pane :name="tabItem.type">
          <span slot="label">{{tabItem.title}}
                  <span class="wrn_text">
                    (
                    <span :ref="'wrnTextRef_'+tabItem.type">{{tabItem.childrenCount}}</span>)
          </span>
          </span>

          <!-- flight / 同行航班 -->
          <flight-table v-if="tabItem.type === 'flight' && checkUserRuleCase('ajgl/flight/list', caseId,true,cjrId)" :tableData="tabItem.children" :addSwitch="hAdd['flight']" :theSuspect="suspect" @removeRow="changRow('flight','r')" @addRow="changRow('flight','a')"
            @close="hAdd['flight'] = false" @update:Data="updataData"></flight-table>
          <!-- railway / 同行铁路 -->
          <railway-table v-if="tabItem.type === 'railway' && checkUserRuleCase('ajgl/railway/list', caseId,true,cjrId)" :tableData="tabItem.children" :addSwitch="hAdd.railwayAdd" :theSuspect="suspect" @removeRow="changRow('railway','r')" @addRow="changRow('railway','a')"
            @close="hAdd.railwayAdd = false" @update:Data="updataData"></railway-table>

          <!-- hostel / 同旅店 -->
          <hostel-table v-if="tabItem.type === 'hostel' && checkUserRuleCase('ajgl/hostel/list', caseId,true,cjrId)" :tableData="tabItem.children" :addSwitch="hAdd.hostelAdd" :theSuspect="suspect" @removeRow="changRow('hostel','r')" @addRow="changRow('hostel','a')"
            @close="hAdd.hostelAdd = false" @update:Data="updataData"></hostel-table>

          <!-- cohabit / 同暂住 [关联GP库，数据特殊处理]-->
          <cohabit-table v-if="tabItem.type === 'cohabit' && checkUserRuleCase('ajgl/cohabit/list', caseId,true,cjrId)" :tableData="tabItem.children" :addSwitch="hAdd.cohabitAdd" :theSuspect="suspect" @removeRow="changRow('cohabit','r')" @addRow="changRow('cohabit','a')"
            @close="hAdd.cohabitAdd = false" @update:Data="updataData"></cohabit-table>

          <!-- cyberbar / 同网吧 -->
          <cyberbar-table v-if="tabItem.type === 'cyberbar' && checkUserRuleCase('ajgl/cyberbar/list', caseId,true,cjrId)" :tableData="tabItem.children" :addSwitch="hAdd.cyberbarAdd" :theSuspect="suspect" @removeRow="changRow('cyberbar','r')" @addRow="changRow('cyberbar','a')"
            @close="hAdd.cyberbarAdd = false" @update:Data="updataData"></cyberbar-table>

          <!-- samecase / 同案 [关联GP库，数据特殊处理]-->
          <samecase-table v-if="tabItem.type === 'samecase' && checkUserRuleCase('ajgl/samecase/list', caseId,true,cjrId)" :tableData="tabItem.children" :addSwitch="hAdd.samecaseAdd" :theSuspect="suspect" @removeRow="changRow('samecase','r')" @addRow="changRow('samecase','a')"
            @close="hAdd.samecaseAdd = false" @update:Data="updataData"></samecase-table>

          <!-- samehousehold / 同户 [关联GP库，数据特殊处理]-->
          <samehousehold-table v-if="tabItem.type === 'samehousehold' && checkUserRuleCase('ajgl/samehousehold/list', caseId,true,cjrId)" :tableData="tabItem.children" :addSwitch="hAdd.samehouseholdAdd" :theSuspect="suspect" @removeRow="changRow('samehousehold','r')"
            @addRow="changRow('samehousehold','a')" @close="hAdd.samehouseholdAdd = false" @update:Data="updataData"></samehousehold-table>

        </el-tab-pane>
      </el-tabs>
    </div>
  </el-col>
</el-row>

<!-- 选择添加的社会关系类型 -->
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="addSelectDialog" title="选择添加的社会关系类型" size="small" :close-on-click-modal="false" style="text-align: left;">

  <el-form ref="addSelectFormRef" :rules="addSelectFormRules" :model="addSelectForm" label-width="150px">
    <el-row :gutter="10" style="margin: 10px 20px 10px 0;">
      <el-col :span="24">
        <el-form-item label="添加社会关系类型" prop="activeName">
          <el-select placeholder="请选择" v-model="activeName" filterable style="width: 100%">
            <el-option :label="item.title" :value="item.type" :key="index" v-for="(item,index) in data"></el-option>
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

  .add-box-button {
    float: left;
    width: 65px;
    height: 28px;
    background-color: #f90;
    line-height: 28px;
    color: #fff;
    text-align: center;
    font-size: 14px;
    margin-left: 10px;
    cursor: pointer;
    .print-text {
      padding: 0;
      color: #fff;
      font-size: 14px;
      width: 100%;
      height: 100%;
    }
    .export-text {
      padding: 0;
      color: #fff;
      font-size: 14px;
      width: 100%;
      height: 100%;
    }
    &:hover {
      background-color: #ff9900;
    }
  }

</style>
<style>
  .certificate .el-tabs__nav {
    float: left;
  }

  .certificate span {
    margin-right: 5px;
  }

</style>

<script>
  import cardHeader from '../../base/card-header.vue'
  import reportMixin from '../reportMixin'

  import flightTable from './socialTemplate/flight-table.vue'
  import railwayTable from './socialTemplate/railway-table.vue'
  import hostelTable from './socialTemplate/hostel-table.vue'
  import cohabitTable from './socialTemplate/cohabit-table.vue'
  import cyberbarTable from './socialTemplate/cyberbar-table.vue'
  import samecaseTable from './socialTemplate/samecase-table.vue'
  import samehouseholdTable from './socialTemplate/samehousehold-table.vue'

  import { clone } from '../../../../utils/util'
  import mixin from '../../../../utils/mixin'
  export default {
    mixins: [mixin, reportMixin],
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
        flag: false,
        addSelectDialog: false, // 添加社会关系类型选择
        hAdd: { // 添加操作触开关
          flight: false,
          railway: false,
          hostel: false,
          cohabit: false,
          cyberbar: false,
          samecase: false,
          samehousehold: false
        },
        addSelectForm: {
          activeName: ''
        },
        addSelectFormRules: {
          name: [
            { required: true, message: '不能为空' }
          ]
        },
        caseId: '', // 案件ID
        cjrId: '', //
        suspect: '', // 嫌疑人信息
        activeName: '', // 当前选择栏目
        tableData: [] // 表格数据
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
        console.log('activeName', t)
        switch (t) {
          case 'flight': // 同航班
            this.hAdd.flight = true
            break;
          case 'railway': // 同铁路
            this.hAdd.railway = true
            break;
          case 'hostel': // 同旅店
            this.hAdd.hostel = true
            break;
          case 'cohabit': // 同暂住
            this.hAdd.cohabit = true
            break;
          case 'cyberbar': // 同网吧
            this.hAdd.cyberbar = true
            break;
          case 'samecase': // 同案
            this.hAdd.samecase = true
            break;
          case 'samehousehold': // 同户
            this.hAdd.samehousehold = true
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
       * 社会关系数据添加权限验证
       */
      socialRelationAddRule() {
        let _t = this.activeName
        let _rState = false
        switch (_t) {
          case 'flight': // 同航班
            _rState = this.checkUserRuleCase('ajgl/flight/save', this.caseId, true, this.cjrId)
            break;
          case 'railway': // 同铁路
            _rState = this.checkUserRuleCase('ajgl/railway/save', this.caseId, true, this.cjrId)
            break;
          case 'hostel': // 同旅店
            _rState = this.checkUserRuleCase('ajgl/hostel/save', this.caseId, true, this.cjrId)
            break;
          case 'cohabit': // 同暂住
            _rState = this.checkUserRuleCase('ajgl/cohabit/addtz', this.caseId, true, this.cjrId)
            break;
          case 'cyberbar': // 同网吧
            _rState = this.checkUserRuleCase('ajgl/cyberbar/save', this.caseId, true, this.cjrId)
            break;
          case 'samecase': // 同案
            _rState = this.checkUserRuleCase('ajgl/samecase/addxyr', this.caseId, true, this.cjrId)
            break;
          case 'samehousehold': // 同户
            _rState = this.checkUserRuleCase('ajgl/samehousehold/addth', this.caseId, true, this.cjrId)
            break;
        }
        return _rState
      },
      updataWatch(val) {
        if (val) {
          this.tableData = clone(val).map(rt => { // 替换数据集合
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
      },
      toggle() {
        this.flag = !this.flag
      }
    },
    watch: {},
    created() {
      console.log(this.data, 'data')
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.cjrId = this.$route.query.b // 初始化获取案件id
      if (this.data) {
        this.updataWatch(this.data)
      }
    }
  }

</script>
