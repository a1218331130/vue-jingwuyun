<template>
<div v-if="checkRule(personPower[3].methods,true)" class="control-box_div">
  <!-- 数据操作弹窗_人员信息 -->
  <handle-dialog @call:change-update="handleCate"></handle-dialog>

  <!-- 数据操作弹窗_走访记录 -->
  <handle-visit-dialog @call:change-update="handleCate" :dialogVisit="dialogVisit" :object="object" :personPower="personPower" @close="dialogVisit=false"></handle-visit-dialog>

  <!-- 数据操作弹窗_加入研判 -->
  <judge-dialog @call:change-update="handleCate" :dialogStudy="dialogStudy" :object="object" @close="dialogStudy=false"></judge-dialog>

  <!-- 数据操作弹窗_管控流转 -->
  <controlFlow-dialog @call:change-update="handleCate" :dialogControlFlow="dialogControlFlow" :object="object" @close="dialogControlFlow=false">
  </controlFlow-dialog>

  <!-- 数据操作弹窗_流转记录 -->
  <record-dialog :dialogRecord="dialogRecord" :object="object" @close="dialogRecord=false">
  </record-dialog>
  <!-- 数据操作弹窗_审批  -->
  <approval-dialog @call:change-update="handleCate" :dialogApproval="dialogApproval" :object="object" @close="dialogApproval=false"></approval-dialog>

  <!-- 数据操作弹窗_签收  -->
  <sign-dialog @call:change-update="handleCate" :dialogSign="dialogSign" :keyId="keyId" @close="dialogSign=false"></sign-dialog>

  <!-- 数据操作弹窗_人员信息 -->
  <dialog-people-info @call:change-update="handleCate" :dialog="peopleInfoDialog" :data="object" @close="peopleInfoDialog=false"></dialog-people-info>

  <!-- 内容顶部操作栏 -->
  <div class="top-bar-tool_div">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane v-for="item in tabs" :label="item.label" :name="item.name" :key="item.name">
        <!--重点人员不显示数字-->
        <!--<span v-if="item.name!=='全部'" slot="label">{{item.label}}-->
        <!--<span>({{item.count || 0}})</span>-->
        <!--</span>-->
        <span slot="label">{{item.label}}
          <span>({{item.count || 0}})</span>
        </span>
      </el-tab-pane>
    </el-tabs>
    <top-bar v-if="checkRule(personPower[0].methods,true)" :unfoldState="unfoldT" :FocusType="filterObject.FocusType" @unfoldHandle="unfoldHandle"></top-bar>
  </div>

  <div class="app-toolbar" v-if="nullData===false">
    <!-- 列表操作 -->
    <div class="header-box_div">
      <el-checkbox v-model="checkAll" v-if="activeName !== '待通过'&& activeName !== '待我审核'&&activeName !== '待他签收'" @change="handleCheckAllChange">全选</el-checkbox>
      <dl class="header-handle_dl" v-if="activeName === '全部'">
        <!--<dd class="color-orange"><i class="iconfont icon-jingbao"></i>布控预警</dd>-->
        <dd v-if="checkRule(personPower[2].methods,true)" class="color-orange" @click="addStudy(FocusType=1)">
          <i class="iconfont icon-anjianyanpan"></i>加入研判
        </dd>
        <dd v-if="checkRule(personPower[2].methods,true)" class="color-green" @click="handleCancel(FocusType=1)">
          <i class="iconfont icon-xiaokongguanli "></i>取消管控
        </dd>
        <!-- <dd v-if="checkRule(personPower[2].methods,true)" class="color-green" @click="handleControlFlow(FocusType=1)">
          <i class="iconfont icon-Issued "></i>管控流转
        </dd> -->
        <dd v-if="checkRule(personPower[1].methods,true)" class="color-green" @click="handleDelete(FocusType=1)">
          <i class="iconfont icon-trash"></i>批量删除
        </dd>
      </dl>
      <dl class="header-handle_dl" v-if="activeName === '=待我审核'">
        <dd v-if="checkRule(personPower[2].methods,true)" class="color-green" @click="handleApproval()">
          <i class="iconfont icon-Issued "></i>批量审核
        </dd>
      </dl>
      <dl class="header-handle_dl" v-if="activeName === '待通过'">
        <!--<dd class="color-green" @click="handleConfirm('批量通过')"><i class="iconfont icon-Issued "></i>批量通过</dd>-->
      </dl>
      <dl class="header-handle_dl" v-if="activeName === '待我签收'">
        <dd v-if="checkRule(personPower[2].methods,true)" class="color-green" @click="handleSign()">
          <i class="iconfont icon-qianshou "></i>批量签收
        </dd>
      </dl>
    </div>
  </div>
  <div class="app-content-box" v-if="nullData===false" :class="{active:isShowTollBar}" v-loading.body="loading">
    <!-- 列表 -->
    <el-checkbox-group v-model="checkedSelects" @change="handleSelectChange">
      <ul class="checked-select-list">
        <li :key="item.KeyId" v-for="(item,i) in list">
          <!-- 多选框 -->
          <el-checkbox v-if="activeName !== '待通过'&& activeName !== '待我审核'&&activeName !== '待他签收'" :label="item.KeyId" :key="item.KeyId"></el-checkbox>
          <!-- 信息 -->
          <div class="list-info-box_div">
            <el-row class="tool-list_box" v-if="activeName !== '待通过'">
              <el-col>
                <dl class="info-list-handle_dl" v-if="activeName === '全部'">
                  <dd v-if="checkRule(personPower[2].methods,true)" class="color-orange" @click="handleUpdate(item.KeyId)">
                    <i class="iconfont icon-bianji1"></i>信息编辑
                  </dd>
                  <dd v-if="checkRule(personPower[2].methods,true)" class="color-orange" @click="addStudy(FocusType=1,item.KeyId,item.Sfz)">
                    <i class="iconfont icon-anjianyanpan"></i>加入研判
                  </dd>
                  <dd v-if="checkRule(personPower[4].methods,true)" class="color-blue" @click="handleVisit(item)">
                    <i class="iconfont icon-bianji "></i>走访记录
                    <span style="color: red"> {{item.VisitTimes}} </span>
                  </dd>
                  <dd v-if="checkRule(personPower[2].methods,true)" class="color-green" @click="handleCancel(FocusType=1,item.KeyId)">
                    <i class="iconfont icon-xiaokongguanli "></i>取消管控
                  </dd>
                  <dd v-if="checkRule(personPower[2].methods,true)" class="color-green" @click="handleControlFlow(FocusType=1,item.KeyId,item.RyName)">
                    <i class="iconfont icon-Issued "></i>管控流转
                  </dd>
                  <dd v-if="checkRule(personPower[2].methods,true)" class="color-green" @click="handleControlRecord(FocusType=1, item.FlowId)">
                    <i class="iconfont icon-Issued "></i>流转记录
                  </dd>
                  <dd v-if="checkRule(personPower[1].methods,true)" class="color-green" @click="handleDelete(FocusType=1,item.KeyId)">
                    <i class="iconfont icon-trash"></i>删除
                  </dd>
                </dl>
                <dl class="info-list-handle_dl" v-if="activeName === '待我审核'">
                  <dd v-if="checkRule(personPower[2].methods,true)" class="color-blue" @click="handleApproval(item)">
                    <i class="iconfont icon-qianshou "></i>审核
                  </dd>
                </dl>

                <dl class="info-list-handle_dl" v-if="activeName === '待通过'">
                </dl>
                <dl class="info-list-handle_dl" v-if="activeName === '待我签收'">
                  <dd v-if="checkRule(personPower[2].methods,true)" class="color-blue" @click="handleSign(item.KeyId)">
                    <i class="iconfont icon-qianshou "></i>签收
                  </dd>
                </dl>
              </el-col>
            </el-row>

            <el-row :gutter="15">
              <el-col :span="2" style="max-width: 90px">
                <div class="list-info-user-img_div">
                  <span class="people-tag">{{item.RyTypeName}}</span>
                  <data-image :idCard="item.Sfz"></data-image>
                  <!-- <img v-if="item.PhotosId!==null" :src="picUrl+item.PhotosId" />
                  <img v-if="item.PhotosId===null" src="/static/img/testPersonImg.jpg" /> -->
                </div>
                <div class="people-button_div" @click="showDossierFocus(FocusType=1,item.Sfz)">
                  查看档案
                </div>
              </el-col>
              <el-col :span="22">
                <el-row>
                  <el-col :span="6" class="name-box_elcol">
                    <span class="name-text">{{item.RyName}}</span>
                    <span class="people-label">
                      <span>{{item.LevelName}}</span>
                    </span>
                    <span class="info-source">
                      来源：
                      <span v-if="item.DataSrc==='1'">手工添加</span>
                      <span v-if="item.DataSrc==='2'">系统推送</span>
                    </span>
                  </el-col>
                  <el-col :span="18">
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="name-box_elcol">
                    <div class="user-info-box_elrow">
                      <label>身份证</label>
                      <span class="ID-card-text_span" @click="handlePeopleInfo(item.RyName,item.Sfz,contentType=1)">{{item.Sfz}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>管控状态</label>
                      <span v-if="item.CtrlStatus==='0'">正常在控</span>
                      <span v-if="item.CtrlStatus==='1'">失控</span>
                      <span v-if="item.CtrlStatus==='2'">其它</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>绰号</label>
                      <span>{{item.ByName}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>性别</label>
                      <span v-if="item.Sex!==''">
                        <em v-if="item.Sex==='1'">男</em>
                        <em v-if="item.Sex==='2'">女</em>
                        <em v-if="item.Sex==='3'">未知</em>
                      </span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>民族</label>
                      <span>{{item.NationName}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>籍贯</label>
                      <span>{{item.NativeName}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>管辖单位</label>
                      <span>{{item.CollectDeptName}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>创建人</label>
                      <span>{{item.CreatorName}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>户籍地</label>
                      <span>{{item.CensusAddr}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>经济状况</label>
                      <span>{{item.EconomicStatus}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>出生日期</label>
                      <span v-if="item.Birthday">{{item.Birthday|dateFormat}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>户籍地</label>
                      <span>{{item.CensusAddr}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>现居地</label>
                      <span>{{item.LivingAddr}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>最近走访时间</label>
                      <span v-if="item.LastVisitTime">{{item.LastVisitTime|dateFormat}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>注册时间</label>
                      <span v-if="item.CreatedTime">{{item.CreatedTime|dateFormat}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>体貌特征</label>
                      <span>{{item.PhyCharacter}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>管控事由</label>
                      <span>{{item.CtrlReason}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>备注</label>
                      <span>{{item.Note}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>最近活动记录</label>
                      <span>{{item.trajectory}}</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row class="user-info-box_elrow" style="line-height: 18px">
                  <el-col :span="24">
                    <label>标签</label>
                    <span class="label-box-list_dl" v-for="label in item.Labels">
                      {{label.LabelName}}
                      <span class="label-box-list-dl_after"></span>
                    </span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </li>
      </ul>
    </el-checkbox-group>
  </div>
  <div class="app-toolbar footer" v-if="nullData===false">
    <pagination :count="this.currentTab.count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
  </div>
  <div :class="{empty:true,'empty--tips':nullData===true}" v-show="nullData===true" v-loading.body="loading">
    <span v-if="nullData===true">暂无数据,请从左边菜单选择管控类型</span>
  </div>

  <!-- 右侧栏 -->
  <side-right-box :unfoldHandle="unfoldT" @unfoldState="this.unfoldT=this.unfoldT===false">
    <right-toolbar ref="rightBar" title="查询列表" :params="screen.filter" :options="screen.options" @packup="unfoldT = false" @update:params="searchSubmit" v-loading="dictLoading"></right-toolbar>
  </side-right-box>
</div>
</template>

<style scoped lang='scss'>
.control-box_div {}
</style>

<script>
import mixin from '../../../utils/mixin'
import controlMixin from '../controlMixin'
import '../../../utils/dateFormat'
import infoDialogEvents from '../../../utils/infoDialogEvents'
import { DOWNLOAD_FILE_PATH } from '../../../config'
import {
  FETCH_PERSONS_BY_COND,
  FETCH_AUDIT_PERSONS_BY_COND,
  FETCH_PENDING_PERSONS_BY_COND,
  FETCH_MY_SING_PERSONS_BY_COND,
  FETCH_HE_SING_PERSONS_BY_COND,
  GET_SYS_LABEL_FOCUS_LABELS
} from '../../../store/types'

import { mapState } from 'vuex'
import topBar from '../top-bar.vue'
import pagination from '../../../widgets/pagination/pagination.vue'
import handleDialog from './handle-dialog.vue'
import judgeDialog from './dialog/judge-dialog.vue'
import controlFlowDialog from './dialog/controlFlow-dialog.vue'
import signDialog from './dialog/sign-dialog.vue'
import recordDialog from './dialog/record-dialog.vue'
import approvalDialog from './dialog/approval-dialog.vue'
import handleVisitDialog from './handle-visit-dialog.vue'
import sideRightBox from '../side-right-box.vue'
import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'
import bus from '../../../utils/bus'
import dialogInfo from '../../../widgets/info-dialog/info-dialog'
import dataImage from '../../../widgets/data-image/data-image'
export default {
  mixins: [mixin, controlMixin, infoDialogEvents],
  components: {
    pagination,
    handleDialog,
    judgeDialog,
    controlFlowDialog,
    signDialog,
    approvalDialog,
    topBar,
    sideRightBox,
    rightToolbar,
    recordDialog,
    handleVisitDialog,
    'dialog-people-info': dialogInfo,
    'data-image': dataImage
  },
  data() {
    return {
      nullData: false,
      picUrl: '',
      plugLoading: null, // 刷新列表外挂 当plugLoading === null刷新
      parentId: null,
      list: [],
      updated: true,
      peopleTagText: '涉稳', // 人员特征标签
      unfoldT: false, // 当前侧栏窗体是否展开状态中继
      dialogVisit: false, // 信访弹窗
      dialogStudy: false, // 研判弹窗
      dialogApproval: false, // 审批弹窗
      dialogSign: false, // 签收弹窗
      dialogControlFlow: false, // 管控流转弹窗
      dialogRecord: false, // 流转记录弹窗
      checkAll: false,
      isShowTollBar: false,
      checkedSelects: [],
      object: {},
      keyId: '',
      trajectoryText: '',
      pagenav: {
        currentpage: 1,
        limit: 10
      },
      filterObject: {
        FocusType: '000001', // 人员类型 [必填]
        Flag: 0, // 查询列表， 0： 重点人员， 1： 待我审核， 2： 待通过， 3： 待我签收， 4： 待他签收  [必填]
        OrderField: '', // 排序字段
        BeginDate: '', // 检索开始时间
        EndDate: '', // 检索结束时间
        PageIndex: 1, // 分页 - 当前页码 [必填]
        PageSize: 10 // 分页 - 每页行数 [必填]
      },
      daterange: '',
      screen: { // 筛选列表数据配置
        filter: {
          keyword: '', // 关键字
          LevelArr: [], // 人员等级(字典),多选用逗号分隔
          CtrlStatusArr: [], // 控状态,多选用逗号分隔
          CollectDeptArr: [], // 采集单位,多选用逗号分隔
          NativeArr: [], // 人员籍贯,多选用逗号分隔
          NationArr: [], // 民族,多选用逗号分隔
          SexArr: [], // 性别，1男，2女,多选用逗号分隔
          LabelArr: [], // 标签名称,多选用逗号分隔
          AgeLevelArr: [], // 年龄段，1：18~25，2：26~30，3：31~40，4：41~50，5：50以上，多选用逗号分隔
          daterange: '' // 检索开始时间--检索结束时间
        },
        options: [{
          title: '关键字',
          prop: 'keyword',
          type: 'input'
        }, {
          title: '时间段',
          prop: 'daterange',
          type: 'daterange'
        }, {
          title: '人员等级',
          prop: 'LevelArr',
          type: 'checkbox',
          children: []
        }, {
          title: '管控状态',
          prop: 'CtrlStatusArr',
          type: 'checkbox',
          children: [
            { label: '正常在控', value: '0' },
            { label: '失控', value: '1' },
            { label: '其它', value: '2' }
          ]
        }, {
          title: '采集单位',
          prop: 'CollectDeptArr',
          props: {
            id: 'orgId',
            label: 'name',
            parentId: 'parentId',
            children: 'children'
          },
          type: 'treeSelect',
          children: []
        }, {
          // title: '籍贯',
          // prop: 'NativeArr',
          // type: 'treeSelect',
          // children: []
        }, {
          title: '民族',
          prop: 'NationArr',
          type: 'Mulitiselect',
          children: []
        }, {
          title: '性别',
          prop: 'SexArr',
          type: 'checkbox',
          children: [{
            label: '男',
            value: '1'
          }, {
            label: '女',
            value: '2'
          }]
        }, {
          title: '标签',
          prop: 'LabelArr',
          type: 'Mulitiselect',
          children: []
        }, {
          title: '年龄段',
          prop: 'AgeLevelArr',
          type: 'checkbox',
          children: []
        }]
      },
      activeName: '全部',
      tabs: [{
        label: '重点人员',
        name: '全部',
        count: 0,
        pageIndex: 1,
        parentId: ''
      }, {
        label: '待我审核',
        name: '待我审核',
        count: 0, // examineCount
        pageIndex: 1,
        parentId: ''
      }, {
        label: '待通过',
        name: '待通过',
        count: 0, // pendingCount
        pageIndex: 1,
        parentId: ''
      }, {
        label: '待我签收',
        name: '待我签收',
        count: 0, // mySignCount
        pageIndex: 1,
        parentId: ''
      }, {
        label: '待他签收',
        name: '待他签收',
        count: 0, // count.heSignCount
        pageIndex: 1,
        parentId: ''
      }]
    }
  },
  computed: {
    currentTab() {
      return this.tabs.find(d => d.name === this.activeName)
    },
    ...mapState(['dict', 'focusPerson', 'sysLabel', 'focusPersonAndCar', 'trajectory'])
  },
  methods: {
    /**
     * [loadData 拉取列表]
     * @param  {[type]} updated [description]
     * @return {[type]}         [description]
     */
    loadData() {
      // 清空多选
      this.daterange = this.screen.filter.daterange
      this.checkAll = false
      let self = this,
        currentTab = this.currentTab,
        url, res
      this.loading = true
      // 查询列表， 0： 重点人员， 1： 待我审核， 2： 待通过， 3： 待我签收， 4： 待他签收  [必填]
      switch(this.filterObject.Flag) {
        case '1':
          url = FETCH_AUDIT_PERSONS_BY_COND;
          res = 'fetchAuditPersonsByCond'
          break;
        case '2':
          url = FETCH_PENDING_PERSONS_BY_COND;
          res = 'fetchPendingPersonsByCond'
          break;
        case '3':
          url = FETCH_MY_SING_PERSONS_BY_COND;
          res = 'fetchMySingPersonsByCond'
          break;
        case '4':
          url = FETCH_HE_SING_PERSONS_BY_COND;
          res = 'fetchHeSingPersonsByCond'
          break;
        default:
          url = FETCH_PERSONS_BY_COND;
          res = 'fetchPersonsByCond'
          this.filterObject.Flag = 0;
          break;
      }
      // 加载列表
      if(self.focusPerson[res] === null || currentTab.parentId !== this.parentId || this.plugLoading === null) {
        this.plugLoading = 'noLoading' // 外挂状态更改需制空
        currentTab.parentId = this.parentId
        this.dispatch(url, {
          RyType: this.filterObject.FocusType, // 人员类型
          Flag: this.filterObject.Flag, // 查询列表，0：重点人员，1：待我审核，2：待通过，3：待我签收，4：签收
          OrderField: this.filterObject.OrderField, // 排序字段
          OrderType: this.filterObject.OrderType, // 排序方式
          BeginDate: this.filterObject.BeginDate, // 检索开始时间
          EndDate: this.filterObject.EndDate, // 检索结束时间
          PageIndex: this.filterObject.PageIndex, // 分页-当前页码
          PageSize: this.filterObject.PageSize, // 分页-每页行数
          Keyword: this.screen.filter.keyword, // 关键字
          Level: [...this.screen.filter.LevelArr].join(','), // 人员等级(字典),多选用逗号分隔
          CtrlStatus: [...this.screen.filter.CtrlStatusArr].join(','), // 管控状态,多选用逗号分隔
          CollectDept: [...this.screen.filter.CollectDeptArr].join(','), // 采集单位,多选用逗号分隔
          Native: [...this.screen.filter.NativeArr].join(','), // 人员籍贯,多选用逗号分隔
          Nation: [...this.screen.filter.NationArr].join(','), // 民族,多选用逗号分隔
          Sex: [...this.screen.filter.SexArr].join(','), // 性别，1男，2女,多选用逗号分隔
          Label: [...this.screen.filter.LabelArr].join(','), // 标签名称，,多选用逗号分隔
          AgeLevel: [...this.screen.filter.AgeLevelArr].join(',') // 年龄段，1：18~25，2：26~30，3：31~40，4：41~50，5：50以上，多选用逗号分隔
        }).then(d => {
          this.updateRecord(currentTab, url, res)
          if(self.focusPerson[res].PageData.length === 0) {
            this.nullData = true
          } else {
            this.nullData = false
          }
          self.picUrl = DOWNLOAD_FILE_PATH
          self.tabs[self.filterObject.Flag].pageIndex = self.focusPerson[res].PageIndex
          if(currentTab.name === '全部') {
            self.tabs[0].count = self.focusPerson[res].DataCount
          }
          self.tabs[1].count = self.focusPerson[res].Reseration1
          self.tabs[2].count = self.focusPerson[res].Reseration2
          self.tabs[3].count = self.focusPerson[res].Reseration3
          self.tabs[4].count = self.focusPerson[res].Reseration4
        })
      } else {
        this.updateRecord(currentTab, url, res)
        if(self.focusPerson[res].PageData.length === 0) {
          this.nullData = true
        } else {
          this.nullData = false
        }
        self.picUrl = DOWNLOAD_FILE_PATH
        self.tabs[self.filterObject.Flag].pageIndex = self.focusPerson[res].PageIndex
        if(currentTab.name === '全部') {
          self.tabs[0].count = self.focusPerson[res].DataCount
        }
        self.tabs[1].count = self.focusPerson[res].Reseration1
        self.tabs[2].count = self.focusPerson[res].Reseration2
        self.tabs[3].count = self.focusPerson[res].Reseration3
        self.tabs[4].count = self.focusPerson[res].Reseration4
        self.loading = false
      }
    },
    /**
     * [updateRecord 更新列表内容]
     * 包含, 合计数, 列表内容, 加载中标志
     * @return {[type]} [description]
     */
    updateRecord(currentTab, url, res) {
      // if (this.focusPerson[res].PageData.length > 0) {
      //   this.list = [...this.focusPerson[res].PageData];
      //   [...this.focusPerson[res].PageData].forEach(d => {
      //     this.$http.post(FWZX_BASE_PATH + '/call', {
      //       c: 0,
      //       token: this.userData.UserToken,
      //       data: JSON.stringify({ zjhm: d.Sfz }),
      //       id: 'topic/gjfx/recently'
      //     }, {
      //       url: null,
      //       params: {}, // url参数，如: /api/user/:id
      //       query: {}, // 查询参数 如: /api/user/list?a=3&b=5
      //       method: 'get',
      //       crossOrigin: false,
      //       emulateJSON: true, // 设置请求头Content-Type的值为application/x-www-form-urlencoded
      //       credentials: true, // 跨域发送请求带上cookie
      //       emulateHTTP: true // 用HTTP的POST方式PUT，PATCH，DELETE等请求，并设置请求头字段HTTP_Method_Override为原始请求方法。
      //     }).then((res) => {
      //       d['trajectory'] = res.body.data.zxgj || '暂无'
      //       this.list = JSON.parse(JSON.stringify(this.list))
      //       this.loading = false
      //     })
      //   })
      // } else {
      this.list = [...this.focusPerson[res].PageData];
      // }
    },
    /**
     * [handleVisit 走访记录操作]
     * @param  {[type]} object [description]
     * @return {[type]}        [description]
     */
    handleVisit(object) {
      this.object = object
      this.dialogVisit = true
    },
    /**
     * [handleUpdate 新增操作]
     * @param  {[type]} KeyId [description]
     * @return {[type]}       [description]
     */
    handleUpdate(KeyId) {
      bus.$emit('control.updateHandlePeople', KeyId)
    },
    /**
     * [handleTabClick 页签点击切换操作]
     * @param  {[type]} tab [description]
     * @param  {[Object]} e   [event]
     * @return {[type]}     [description]
     */
    handleTabClick(tab, e) {
      // 查询列表， 0： 重点人员， 1： 待我审核， 2： 待通过， 3： 待我签收， 4： 待他签收  [必填]
      // 点击状态切换时更改 Flag的值
      this.filterObject.Flag = tab.index
      if(tab.index === '0' || tab.index === '3') {
        this.isShowTollBar = false
      } else {
        this.isShowTollBar = true
      }
      // 刷新列表
      this.loadData()
    },

    /**
     * [GetSysDictByType 批量获取字典]
     */
    GetSysDictByType() {
      if(this.screen.options[9].children.length === 0) {
        /**
         * 采集单位
         */
        this.getRuleOrgTree('', true).then(d => {
          this.screen.options[4].children = d.map
        })
        /**
         * 人员籍贯
         */
        // this.getCascaderNative().then(d => {
        //   this.screen.options[5].children = d[1];
        // })
        /**
         *重点人员标签
         */
        this.dispatch(GET_SYS_LABEL_FOCUS_LABELS, { FocusType: 1 }, null, true).then(d => {
          this.screen.options[8].children = this.sysLabel.GetSysLabelFocusLabels.map(c => {
            return {
              label: c.LabelName,
              value: c.LabelName
            }
          })
        })
        this.getDict(['RYDJ', 'MZDM', 'NLD']).then(res => {
          this.screen.options[2].children = res['RYDJ'] // 人员等级
          this.screen.options[6].children = res['MZDM'] // 民族
          this.screen.options[9].children = res['NLD'] // 年龄段
        })
      }
    }
  },
  watch: {},
  mounted() {},
  created() {
    // 侧边栏字典加载
    this.GetSysDictByType()
  }
}
</script>
