<template>
<div class="control-box_div">
  <!-- 新增弹窗 -->
  <handle-dialog ref="handleDialog" :dataType="dataType" @call:change-update="handleCate"></handle-dialog>
  <!-- 操作记录 -->
  <record-dialog ref="recordDialog"></record-dialog>
  <!-- 数据导出弹窗  -->
  <data-out-dialog @call:change-update="handleCate" :dataOutdialog="dataOutdialog" :ids="checkedSelects" :title="tabs[0].label" :type="filterObject.FocusType" @close="dataOutdialog=false"></data-out-dialog>
  <!-- 审批  -->
  <approval-dialog @call:change-update="reloadAppTab" :dialogApproval="dialogApproval" :object="object" @close="dialogApproval=false"></approval-dialog>
  <!-- 注销申请信息 -->
  <reason-dialog ref="reasonDialog" @call:change-update="updateReason" :data="object" @close="reasonDialog=false"></reason-dialog>
  <!-- 内容顶部操作栏 -->
  <div class="top-bar-tool_div">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane v-for="item in tabs" :label="item.label" :name="item.name" :key="item.name">
        <span slot="label">{{item.label}}
          <span>({{item.count || 0}})</span>
        </span>
      </el-tab-pane>
    </el-tabs>
    <top-bar @call:change-type="toggleTypeList" :listType="listType" :unfoldState="unfoldT" :FocusType="filterObject.FocusType" @unfoldHandle="unfoldHandle" @handleDelete="handleDelete(FocusType=6)" @handleOut="handleOut(filterObject.FocusType)" @handleAdd="handleAdd(filterObject.FocusType)"></top-bar>
  </div>

  <div class="app-toolbar">
    <!-- 列表操作 -->
    <div class="header-box_div">
      <el-checkbox v-model="checkAll" v-if="listType === 1 && activeName !== '待我审批'" @change="handleCheckAllChange">全选
      </el-checkbox>
      <!-- todo by 寇永明 -->
      <!-- <dl class="header-handle_dl" v-if="activeName === '全部'"></dl>
      <dl class="header-handle_dl" v-if="activeName === '待我审批'">
        <dd class="color-green" @click="handleApproval()">
          <i class="iconfont icon-Issued "></i>批量审批
        </dd>
      </dl>
      <dl class="header-handle_dl" v-if="activeName === '待通过'">
      </dl>
      <dl class="header-handle_dl" v-if="activeName === '待我签收'">
        <dd class="color-green" @click="handleSign()">
          <i class="iconfont icon-qianshou "></i>批量签收
        </dd>
      </dl> -->
    </div>
  </div>
  <div class="app-content-box" v-if="listType===1&&!nullData" :class="{active:isShowTollBar}" v-loading.body="loading">
    <!-- 列表 -->
    <el-checkbox-group v-show="listType===1" v-model="checkedSelects" @change="handleSelectChange">
      <ul class="checked-select-list">
        <li :key="item.id" v-for="(item,i) in list">
          <!-- 多选框 -->
          <el-checkbox v-if="activeName !== '待我审批'" :label="item.id" :key="item.id">
            <span name="label"></span>
          </el-checkbox>
          <!-- 信息 -->
          <div class="list-info-box_div">
            <el-row class="tool-list_box" v-if="activeName !== '待通过'">
              <el-col>
                <dl class="info-list-handle_dl" v-if="activeName === '全部'">
                  <dd class="color-blue" @click="handleRecord(item.id)">
                    <i class="iconfont icon-bianji1"></i>操作记录
                  </dd>
                  <dd class="color-orange" v-if="item.sfzx==='0'" @click="handleUpdate(item.id,'details')">
                    <i class="iconfont icon-xiangqing"></i>查看详情
                  </dd>
                  <dd class="color-orange" v-if="item.sfzx==='0'" @click="handleUpdate(item.id,'edit')">
                    <i class="iconfont icon-bianji"></i>信息编辑
                  </dd>
                  <dd class="color-green" @click="handleDelete(FocusType=6,item.id)" v-if="item.zddxzt === '4' || item.zddxzt === '5' || item.zddxzt === '6' || item.sfzx === '1'">
                    <i class="iconfont icon-trash"></i>删除
                  </dd>
                  <dd class="color-orange" v-if="item.sfzx==='0'&&item.zddxzt==='0'" @click="handleNotUse(item,'1','clue')">
                    <i class="iconfont icon-close"></i>注销
                  </dd>
                  <dd class="color-orange" v-if="item.sfzx==='1'&&item.zddxzt==='0'" @click="handleNotUse(item,'0','clue')">
                    <i class="iconfont icon-jia"></i>重新管控
                  </dd>
                  <!-- <dd class="color-orange" @click="addStudy(FocusType=1,item.id,item.Sfz)">
                    <i class="iconfont icon-anjianyanpan"></i>加入研判
                  </dd> -->
                  <!-- <dd class="color-blue" v-if="item.sfzx==='0'" @click="handleVisit(item)">
                    <i class="iconfont icon-bianji "></i>走访记录
                    <span style="color: red"> {{item.VisitTimes}} </span>
                  </dd> -->
                  <!-- <dd class="color-green" @click="handleCancel(FocusType=1,item.id)">
                    <i class="iconfont icon-xiaokongguanli "></i>取消管控
                  </dd>
                  <dd class="color-green" @click="handleControlFlow(FocusType=1,item.id,item.RyName)">
                    <i class="iconfont icon-Issued "></i>管控流转
                  </dd>
                  <dd class="color-green" @click="handleControlRecord(FocusType=1, item.id)">
                    <i class="iconfont icon-Issued "></i>流转记录
                  </dd> -->
                </dl>
                <dl class="info-list-handle_dl" v-if="activeName === '待我审批'">
                  <dd class="color-blue" @click="handleApproval(item)">
                    <i class="iconfont icon-qianshou "></i>审批
                  </dd>
                </dl>
                <dl class="info-list-handle_dl" v-if="activeName === '待通过'">
                </dl>
                <dl class="info-list-handle_dl" v-if="activeName === '待我签收'">
                  <dd class="color-blue" @click="handleSign(item.id)">
                    <i class="iconfont icon-qianshou "></i>签收
                  </dd>
                </dl>
              </el-col>
            </el-row>

            <el-row :gutter="15">
              <!-- <el-col :span="2"
                      style="max-width: 90px">
                <div class="list-info-user-img_div">
                  <span class="people-tag">{{item.RyTypeName}}</span>
                  <data-image :idCard="item.sfz"></data-image>
                  <img v-if="item.PhotosId!==null" :src="picUrl+item.PhotosId" />
                      <img v-if="item.PhotosId===null" src="/static/img/testPersonImg.jpg" />
                </div>
                <div class="people-button_div" @click="showDossierFocus(FocusType=1,item.sfz)">
                  查看档案
                </div>
              </el-col> -->
              <el-col :span="22">
                <!-- <el-row>
                  <el-col :span="6"
                          class="name-box_elcol">
                    <span class="name-text">{{item.bt}}</span>
                    <span class="people-label">
                      <span>{{item.rydjmc}}</span>
                    </span>
                    <span class="info-source">
                      来源：
                      <span v-if="item.sjly==='0'">手工添加</span>
                      <span v-if="item.sjly==='手工添加'">手工添加</span>
                      <span v-if="item.sjly==='1'">系统推送</span>
                    </span>
                  </el-col>
                  <el-col :span="18">
                  </el-col>
                </el-row> -->
                <el-row>
                  <el-col :span="24" class="name-box_elcol">
                    <!-- <div v-if="item.sfz" class="user-info-box_elrow">
                      <label>身份证:</label>
                      <span class="ID-card-text_span" @click="handlePeopleInfo(item.RyName,item.sfz,contentType=1)">{{item.sfz}}</span>
                    </div> -->
                    <!-- <div class="user-info-box_elrow">
                          <label>管控状态</label>
                          <span v-if="item.CtrlStatus==='0'">正常在控</span>
                          <span v-if="item.CtrlStatus==='1'">失控</span>
                          <span v-if="item.CtrlStatus==='2'">其它</span>
                        </div> -->
                    <div v-if="item.bt" class="user-info-box_elrow">
                      <label>标题:</label>
                      <span>{{item.bt}}</span>
                    </div>
                    <div v-if="item.xxzl" class="user-info-box_elrow">
                      <label>信息种类:</label>
                      <span>{{item.xxzl}}</span>
                    </div>
                    <div v-if="item.zdztmc" class="user-info-box_elrow">
                      <label>针对主体:</label>
                      <span>{{item.zdztmc}}</span>
                    </div>
                    <div v-if="item.xxbq" class="user-info-box_elrow">
                      <label>信息标签:</label>
                      <span>{{item.xxbq}}</span>
                    </div>
                    <div v-if="item.xxlymc" class="user-info-box_elrow">
                      <label>信息来源:</label>
                      <span>{{item.xxlymc}}</span>
                    </div>
                    <div v-if="item.xxnr" class="user-info-box_elrow">
                      <label>信息内容:</label>
                      <span>{{item.xxnr}}</span>
                    </div>
                    <div v-if="item.shxxrxm" class="user-info-box_elrow">
                      <label>首获信息人:</label>
                      <span>{{item.shxxrxm}}</span>
                    </div>
                    <div v-if="item.shdwmc" class="user-info-box_elrow">
                      <label>首获单位:</label>
                      <span>{{item.shdwmc}}</span>
                    </div>
                    <div v-if="item.xxshsj" class="user-info-box_elrow">
                      <label>信息首获时间:</label>
                      <span>{{item.xxshsj}}</span>
                    </div>
                    <div v-if="item.xxkkxmc" class="user-info-box_elrow">
                      <label>信息可靠性:</label>
                      <span>{{item.xxkkxmc}}</span>
                    </div>
                    <div v-if="item.xxzsxmc" class="user-info-box_elrow">
                      <label>信息真实性:</label>
                      <span>{{item.xxzsxmc}}</span>
                    </div>
                    <div v-if="item.xxyjxmc" class="user-info-box_elrow">
                      <label>信息预警性:</label>
                      <span>{{item.xxyjxmc}}</span>
                    </div>
                    <div v-if="item.fsdy" class="user-info-box_elrow">
                      <label>发生地域:</label>
                      <span>{{item.fsdy}}</span>
                    </div>
                    <div v-if="item.fssjsx" class="user-info-box_elrow">
                      <label>发生时间上线:</label>
                      <span>{{item.fssjsx}}</span>
                    </div>
                    <div v-if="item.fssjxx" class="user-info-box_elrow">
                      <label>发生时间下线:</label>
                      <span>{{item.fssjxx}}</span>
                    </div>
                    <div v-if="item.sjbq" class="user-info-box_elrow">
                      <label>时间标签:</label>
                      <span>{{item.sjbq}}</span>
                    </div>
                    <div v-if="item.fsxz" class="user-info-box_elrow">
                      <label>发生详址:</label>
                      <span>{{item.fsxz}}</span>
                    </div>
                    <div v-if="item.cppgjg" class="user-info-box_elrow">
                      <label>评估危害结果:</label>
                      <span>{{item.cppgjg}}</span>
                    </div>
                    <div v-if="item.cjrxm" class="user-info-box_elrow">
                      <label>登记人姓名:</label>
                      <span>{{item.cjrxm}}</span>
                    </div>
                    <div v-if="item.cjsj" class="user-info-box_elrow">
                      <label>登记时间:</label>
                      <span>{{item.cjsj}}</span>
                    </div>
                    <div v-if="item.cjrdwmc" class="user-info-box_elrow">
                      <label>登记单位:</label>
                      <span>{{item.cjrdwmc}}</span>
                    </div>
                    <!-- <div v-if="item.sfyyh"
                         class="user-info-box_elrow">
                      <label>是否有隐患:</label>
                      <span>{{item.sfyyh === '0' ? '暂无' : '有隐患'}}</span>
                    </div> -->
                    <div v-if="item.sfpcdj" class="user-info-box_elrow">
                      <label>是否排查登记:</label>
                      <span>{{item.sfpcdj === '0' ? '未排查' : '已排查'}}</span>
                    </div>
                    <div v-if="item.pcdjsj" class="user-info-box_elrow">
                      <label>排查时间:</label>
                      <span>{{item.pcdjsj}}</span>
                    </div>
                    <div v-if="item.sfzx" class="user-info-box_elrow">
                      <label>是否注销:</label>
                      <span>{{item.sfzx === '0' ? '正常' : '已注销'}}</span>
                    </div>
                    <div v-if="item.zxsj" class="user-info-box_elrow">
                      <label>注销时间:</label>
                      <span>{{item.zxsj}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>审批状态:</label>
                      <span>{{item.zddxztmc?item.zddxztmc:'未审批'}}</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row class="user-info-box_elrow" style="line-height: 18px">
                  <el-col :span="24">
                    <label>管控原因:</label>
                    <span class="label-box-list_dl">
                      {{item.gkyy}}
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
  <div v-show="listType===2" v-loading.body="loading">
    <el-table @cell-mouse-enter="cellMouseEnter" v-loading.body="loading" :data="list" :border="true" @selection-change="selectionChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" width="50px" label="序号">
        <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
</el-table-column>
<el-table-column prop="bt" label="标题"></el-table-column>
<el-table-column prop="zdzt" label="针对主体">
</el-table-column>
<el-table-column prop="xxzl" width="160" label="信息种类"></el-table-column>
<el-table-column prop="xxly" width="70" label="信息来源"></el-table-column>
<el-table-column prop="xxzsx" label="信息真实性"></el-table-column>
<el-table-column prop="xxyjx" label="信息预警性"></el-table-column>
<el-table-column prop="cjdw" label="登记单位"></el-table-column>
<el-table-column prop="fsxz" label="发生详址"></el-table-column>
<el-table-column v-if="activeName === '全部'" prop="id" label="操作" width="200px">
  <template scope="scope">
        <el-button type="text" size="small" @click="handleRecord(scope.row.id)">
          <i class="iconfont icon-bianji1" title="记录"></i>
        </el-button>
        <el-button type="text" size="small" @click="handleUpdate(scope.row.id,'details')">
          <i class="iconfont icon-xiangqing" title="详情"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.zddxzt==='0' && scope.row.sfzx === '0'" @click="handleUpdate(scope.row.id,'edit')">
          <i class="iconfont icon-bianji" title="编辑"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.zddxzt === '4' || scope.row.zddxzt === '5' || scope.row.zddxzt === '6' || scope.row.sfzx === '1'" @click="handleDel(scope.row.id)">
          <i class="iconfont icon-trash" title="删除"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='0' && scope.row.zddxzt==='0'" @click="handleNotUse(scope.row,'1','industry')">
          <i class="iconfont icon-close" title="注销"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='1' && scope.row.zddxzt==='0'" @click="handleNotUse(scope.row,'0','industry')">
          <i class="iconfont icon-jia" title="管控"></i>
        </el-button>
      </template>
</el-table-column>
<el-table-column v-else prop="id" label="操作" width="200px">
  <template scope="scope">
        <el-button type="text" size="small" @click="handleApproval(scope.row)">
          <i class="iconfont icon-biji" title="审批"></i>
        </el-button>
      </template>
</el-table-column>
</el-table>
</div>

<div class="app-toolbar footer">
  <pagination :count="currentTab.count||0" :pagenav="pagenav" @update:pagenav="pagenavChange"></pagination>
</div>
<!-- 右侧栏 -->
<side-right-box :unfoldHandle="unfoldT" @unfoldState="this.unfoldT=this.unfoldT===false" style="position:fixed; top:100px; height:calc(100% - 100px); z-index:5">
  <right-toolbar ref="rightBar" title="查询列表" :params="screen.filter" :options="screen.options" @packup="unfoldT = false" @update:params="searchSubmit" v-loading="dictLoading"></right-toolbar>
</side-right-box>
</div>
</template>

<style scoped lang='scss'>
  .control-box_div {
    .ID-card-text_span {
      color: #54A8E7;
      cursor: pointer;
    }
    .top-bar-tool_div {
      padding-left: 40px;
      position: fixed;
      width: calc(100% - 230px);
      height: 39px;
      z-index: 4;
    }
    .app-toolbar {
      padding-top: 46px;
      &.footer {
        padding-top: 15px;
      }
    }
  }

</style>

<script>
  import mixin from '../../../utils/mixin'
  import bus from '../../../utils/bus'
  import controlMixin from '../controlMixin'
  import '../../../utils/dateFormat'
  import infoDialogEvents from '../../../utils/infoDialogEvents'
  import approvalDialog from '../group/dialog/approval-dialog.vue'
  import reasonDialog from '../group/dialog/reason-dialog.vue'
  import { DOWNLOAD_FILE_PATH } from '../../../config'
  import {
    FXPCGK_CLUE_LIST,
    FXPCGK_CLUE_APPROVALLIST,
    FXPCGK_CLUE_TABCOUNT
    // GET_SYS_LABEL_FOCUS_LABELS,
  } from '../../../store/types'

  import { mapState } from 'vuex'
  import topBar from '../top-bar.vue'
  import pagination from '../../../widgets/pagination/pagination.vue'
  import handleDialog from './handle-dialog.vue'
  import sideRightBox from '../side-right-box.vue'
  import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'
  // import bus from '../../../utils/bus'
  import dialogInfo from '../../../widgets/info-dialog/info-dialog'
  import dataImage from '../../../widgets/data-image/data-image'
  import dataOutdialog from './data-to-excel.vue'
  import recordDialog from '../record-dialog.vue'
  export default {
    mixins: [mixin, controlMixin, infoDialogEvents],
    components: {
      recordDialog,
      pagination,
      handleDialog,
      topBar,
      sideRightBox,
      rightToolbar,
      approvalDialog,
      reasonDialog,
      'dialog-people-info': dialogInfo,
      'data-image': dataImage,
      'data-out-dialog': dataOutdialog
    },
    props: ['dataType', 'titleName'],
    data() {
      return {
        reasonDialog: false,
        listType: 1, // 默认打开列表方式
        nullData: false,
        dataOutdialog: false,
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
          limit: 20
        },
        querObj: {},
        filterObject: {
          FocusType: '000001', // 人员类型 [必填]
          Flag: 0, // 查询列表， 0： 重点人员， 1： 待我审核， 2： 待通过， 3： 待我签收， 4： 待他签收  [必填]
          OrderField: '', // 排序字段
          BeginDate: '', // 检索开始时间
          EndDate: '', // 检索结束时间
          PageIndex: 1, // 分页 - 当前页码 [必填]
          PageSize: 20 // 分页 - 每页行数 [必填]
        },
        daterange: '',
        screen: { // 筛选列表数据配置
          filter: {
            XingMing: '', // 姓名
            Idnumber: '', // 身份证号
            LevelArr: '', // 风险等级(字典)
            IfDanger: '', // 是否隐患,多选用逗号分隔
            CollectDeptArr: [], // 采集单位,多选用逗号分隔
            IfInvestigation: '', // 是否排查，1是，0否,多选用逗号分隔
            IfCancellation: '', // 是否注销，1是，0否,多选用逗号分隔
            BeginDate: '', // 检索开始时间--检索结束时间
            EndDate: ''
          },
          options: [{
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
            title: '身份证号',
            prop: 'Idnumber',
            type: 'input'
          }, {
            title: '姓名',
            prop: 'XingMing',
            type: 'input'
          }, {
            title: '开始时间',
            prop: 'BeginDate',
            type: 'datetime'
          }, {
            title: '结束时间',
            prop: 'EndDate',
            type: 'datetime'
          }, {
            title: '是否有隐患',
            prop: 'IfDanger',
            type: 'radio',
            children: [{
              label: '是',
              value: '1'
            }, {
              label: '否',
              value: '0'
            }]
          }, {
            title: '是否排查',
            prop: 'IfInvestigation',
            type: 'radio',
            children: [{
              label: '是',
              value: '1'
            }, {
              label: '否',
              value: '0'
            }]
          }, {
            title: '是否注销',
            prop: 'IfCancellation',
            type: 'radio',
            children: [{
              label: '是',
              value: '1'
            }, {
              label: '否',
              value: '0'
            }]
          }, {
            title: '风险等级',
            prop: 'LevelArr',
            type: 'select',
            children: []
          }]
        },
        activeName: '全部',
        tabs: [{
          label: '重点线索',
          name: '全部',
          count: 0,
          pageIndex: 1,
          parentId: ''
        }, {
          label: '待我审批',
          name: '待我审批',
          count: 0,
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
       * [searchDtat 更新搜索列表]
       * @param  {[type]} updated [description]
       * @return {[type]}         [description]
       */
      searchDtat() {
        this.siberSearchContent()
        // 清空多选
        this.daterange = this.screen.filter.daterange
        this.checkAll = false
        this.checkedSelects = []
        let self = this,
          currentTab = this.currentTab,
          url, res
        this.loading = true
        if (this.activeName === '全部') {
          url = FXPCGK_CLUE_LIST;
          res = 'fxpcgkClueList'
          this.filterObject.Flag = 0;
        } else if (this.activeName === '待我审批') {
          url = FXPCGK_CLUE_APPROVALLIST;
          res = 'fxpcgkClueApprovallist'
          this.filterObject.Flag = 0;
        }
        // 加载列表
        this.plugLoading = 'noLoading' // 外挂状态更改需制空
        currentTab.parentId = this.parentId
        bus.$emit('parmes', this.querObj)
        this.dispatch(url, this.querObj).then(d => {
          this.$emit('update-loading', false)
          this.updateRecord(currentTab, url, res)
          self.picUrl = DOWNLOAD_FILE_PATH
          self.tabs[self.filterObject.Flag].pageIndex = self.focusPerson[res].PageIndex
          if (currentTab.name === '全部') {
            self.tabs[0].count = self.focusPerson[res].DataCount || 0
          } else {
            self.tabs[1].count = self.focusPerson[res].DataCount || 0
          }
        })
        this.dispatch(FXPCGK_CLUE_TABCOUNT, this.querObj).then(d => {
          this.tabs[0].count = this.focusPerson['fxpcgkClueTabcount'].all
          this.tabs[1].count = this.focusPerson['fxpcgkClueTabcount'].app
        })
      },
      /**
       * [loadData 拉取列表]
       * @param  {[type]} updated [description]
       * @return {[type]}         [description]
       */
      loadData() {
        this.initSiberSearchContent()
        // 清空多选
        this.daterange = this.screen.filter.daterange
        this.checkAll = false
        this.checkedSelects = []
        let self = this,
          currentTab = this.currentTab,
          url, res, url1, res1
        this.loading = true
        // 查询列表， 0： 重点人员， 1： 待我审核， 2： 待通过， 3： 待我签收， 4： 待他签收  [必填]
        url = FXPCGK_CLUE_LIST;
        url1 = FXPCGK_CLUE_TABCOUNT
        res = 'fxpcgkClueList'
        res1 = 'fxpcgkClueTabcount'
        this.filterObject.Flag = 0;
        let isTrue = true
        if (isTrue) { // 判断都通过
          this.plugLoading = 'noLoading' // 外挂状态更改需制空
          currentTab.parentId = this.parentId
          this.dispatch(url, this.querObj).then(d => {
            this.updateRecord(currentTab, url, res)
            if (self.focusPerson[res].PageData.length === 0) {
              this.nullData = true
            } else {
              this.nullData = false
            }
            self.picUrl = DOWNLOAD_FILE_PATH
            self.tabs[self.filterObject.Flag].pageIndex = self.focusPerson[res].PageIndex
            if (currentTab.name === '全部') {
              self.tabs[0].count = self.focusPerson[res].DataCount || 0
            }
          })
          this.dispatch(url1, this.querObj).then(d => {
            this.tabs[0].count = this.focusPerson[res1].all
            this.tabs[1].count = this.focusPerson[res1].app
          })
        }
      },
      reloadAppTab() {
        this.dialogApproval = false
        this.list = []
        this.dispatch(FXPCGK_CLUE_APPROVALLIST, this.querObj).then(d => {
          this.list = this.focusPerson.fxpcgkClueApprovallist.PageData
        })
        this.dispatch(FXPCGK_CLUE_TABCOUNT, this.querObj).then(d => {
          this.tabs[0].count = this.focusPerson.fxpcgkBaseplaceTabcount.all
          this.tabs[1].count = this.focusPerson.fxpcgkBaseplaceTabcount.app
        })
        this.dispatch(FXPCGK_CLUE_LIST, this.querObj)
      },
      /**
       * [updateRecord 更新列表内容]
       * 包含, 合计数, 列表内容, 加载中标志
       * @return {[type]} [description]
       */
      updateRecord(currentTab, url, res) {
        this.list = [...this.focusPerson[res].PageData];
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
       * [updateReason 注销重新管控后刷新]
       * @return {[type]} [description]
       */
      updateReason() {
        this.reasonDialog = false
        this.handleCate()
      },
      /**
       * [handleNotUse 注销操作]
       * @param  {[type]} id [description]
       * @return {[type]}       [description]
       */
      handleNotUse(item, sfzx, type) {
        this.$refs.reasonDialog.handleNotUse(item, sfzx, type)
      },
      /**
       * [handleUpdate 新增操作]
       * @param  {[type]} id [description]
       * @return {[type]}       [description]
       */
      handleUpdate(id, btnType) {
        this.$refs.handleDialog.updatePeopleData(id, btnType)
      },
      /**
       * [handleAdd 新增操作]
       * @param  {[type]} object [description]
       * @return {[type]}        [description]
       */
      handleAdd(type) {
        this.$refs.handleDialog.handleAdd(type)
      },
      /**
       * [tabClick 审批及列表切换]
       * @param {[type]} tab [description]
       * @param {[Object]} e [event]
       * @return {[type]} [description]
       */
      tabClick(tab, e) {
        this.list = []
        if (tab.name === '待我审批') {
          this.dispatch(FXPCGK_CLUE_APPROVALLIST, this.querObj).then(d => {
            this.list = this.focusPerson.fxpcgkClueApprovallist.PageData
            this.currentTab.count = this.focusPerson.fxpcgkClueApprovallist.DataCount
          })
        } else {
          this.dispatch(FXPCGK_CLUE_LIST, this.querObj).then(d => {
            this.list = this.focusPerson.fxpcgkClueList.PageData
            this.currentTab.count = this.focusPerson.fxpcgkClueList.DataCount
          })
        }
      },
      toggleTypeList: function(type) {
        this.listType = type;
      },
      /**
       * [GetSysDictByType 批量获取字典]
       */
      GetSysDictByType() {
        /**
         * 采集单位
         */
        this.getRuleOrgTree('', true).then(d => {
          this.screen.options[0].children = d.map
        })
      },
      pagenavChange(obj) {
        // 分页切换操作
        this.pagenav = obj
        // 刷新列表
        this.loadData()
      },
      /**
       * [handleOut 数据导出]
       * @return {[type]} [description]
       */
      handleOut(FocusType) {
        this.dataOutdialog = true
      },
      selectionChange(val) {
        this.checkedSelects = val.map(value => value['id'])
      }
    },
    watch: {
      dataType() {
        this.switchCate()
      },
      titleName() {
        this.tabs[0].label = this.titleName
      }
    },
    mounted() {},
    created() {
      // 侧边栏字典加载
      // this.GetSysDictByType()
      this.loadData()
    }
  }

</script>
