<template>
<div class="control-box_div">
  <!-- 新增信息弹窗 -->
  <handle-dialog ref="handleDialog" :dataType="dataType" :parentType='parentType' @call:change-update="handleCate"></handle-dialog>
  <!-- 操作记录 -->
  <record-dialog ref="recordDialog"></record-dialog>
  <!-- 数据操作弹窗_人员信息 -->
  <dialog-people-info @call:change-update="handleCate" :dialog="peopleInfoDialog" :data="object" @close="peopleInfoDialog=false"></dialog-people-info>
  <!-- 数据导出弹窗  -->
  <data-out-dialog @call:change-update="handleCate" :dataOutdialog="dataOutdialog" :ids="checkedSelects" :title="tabs[0].label" :type="filterObject.FocusType" @close="dataOutdialog=false"></data-out-dialog>
  <!-- 注销申请信息 -->
  <reason-dialog ref="reasonDialog" @call:change-update="updateReason" :data="object" @close="reasonDialog=false"></reason-dialog>
  <!-- 审批  -->
  <approval-dialog @call:change-update="reloadAppTab" :dialogApproval="dialogApproval" :object="object" @close="dialogApproval=false"></approval-dialog>
  <!-- 内容顶部操作栏 -->
  <div class="top-bar-tool_div">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane v-for="item in tabs" :label="item.label" :name="item.name" :key="item.name">
        <span slot="label">{{item.label}}
          <span>({{item.count || 0}})</span>
        </span>
      </el-tab-pane>
    </el-tabs>
    <top-bar @call:change-type="toggleTypeList" :listType="listType" :unfoldState="unfoldT" :FocusType="filterObject.FocusType" @unfoldHandle="unfoldHandle" @handleDelete="handleDelete(FocusType=3)" @handleOut="handleOut(filterObject.FocusType)" @handleAdd="handleAdd(filterObject.FocusType)"></top-bar>
  </div>

  <div class="app-toolbar">
    <!-- 列表操作 -->
    <div class="header-box_div">
      <el-checkbox v-model="checkAll" v-if="listType===1&&activeName !== '待通过'&& activeName !== '待我审批'&&activeName !== '待他签收'" @change="handleCheckAllChange">全选
      </el-checkbox>
      <dl class="header-handle_dl" v-if="activeName === '全部'">
      </dl>
      <!-- <dl class="header-handle_dl" v-if="activeName === '待我审批'">
        <dd class="color-green" @click="handleApproval()">
          <i class="iconfont icon-Issued "></i>批量审批
        </dd>
      </dl> -->
      <dl class="header-handle_dl" v-if="activeName === '待通过'">
      </dl>
      <dl class="header-handle_dl" v-if="activeName === '待我签收'">
        <dd class="color-green" @click="handleSign()">
          <i class="iconfont icon-qianshou "></i>批量签收
        </dd>
      </dl>
    </div>
  </div>
  <div class="app-content-box" v-if="listType===1&&!nullData" :class="{active:isShowTollBar}" v-loading.body="loading">
    <!-- 列表 -->
    <el-checkbox-group v-show="listType===1" v-model="checkedSelects" @change="handleSelectChange">
      <ul class="checked-select-list">
        <li :key="item.id" v-for="(item,i) in list">
          <!-- 多选框 -->
          <el-checkbox v-if="activeName !== '待通过'&& activeName !== '待我审批'&&activeName !== '待他签收'" :label="item.id" :key="item.id">
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
                  <dd class="color-orange" @click="handleUpdate(item.id,'details')">
                    <i class="iconfont icon-xiangqing"></i>查看详情
                  </dd>
                  <dd class="color-orange" v-if="item.zdcszt==='0'" @click="handleUpdate(item.id,'edit')">
                    <i class="iconfont icon-bianji"></i>信息编辑
                  </dd>
                  <dd class="color-green" v-if="item.zdcszt === '4' || item.zdcszt === '5' || item.zdcszt === '6' || item.sfzx === '1'" @click="handleDel(item.id)">
                    <i class="iconfont icon-trash"></i>删除
                  </dd>
                  <dd class="color-orange" v-if="item.sfzx==='0'&&item.zdcszt==='0'" @click="handleNotUse(item,'1','industry')">
                    <i class="iconfont icon-close"></i>注销
                  </dd>
                  <dd class="color-orange" v-if="item.sfzx==='1'&&item.zdcszt==='0'" @click="handleNotUse(item,'0','industry')">
                    <i class="iconfont icon-jia"></i>重新管控
                  </dd>
                  <!-- <dd class="color-orange" @click="addStudy(FocusType=1,item.id,item.Sfz)">
                    <i class="iconfont icon-anjianyanpan"></i>加入研判
                  </dd> -->
                  <!-- <dd class="color-blue" v-if="item.sfzx==='0'" @click="handleVisit(item)">
                    <i class="iconfont icon-bianji "></i>走访记录
                    <span style="color: red"> {{item.VisitTimes}} </span>
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
              <el-col :span="24">
                <el-row>
                  <el-col :span="24" class="name-box_elcol">
                    <div v-if="item.csmc" class="user-info-box_elrow">
                      <label>场所名称:</label>
                      <span>{{item.csmc}}</span>
                    </div>
                    <div v-if="item.zdcslxmc" class="user-info-box_elrow">
                      <label>场所类别:</label>
                      <span>{{item.zdcslxmc}}</span>
                    </div>
                    <div v-if="item.csjd" class="user-info-box_elrow">
                      <label>场所经度:</label>
                      <span>{{item.csjd}}</span>
                    </div>
                    <div v-if="item.cdwd" class="user-info-box_elrow">
                      <label>场所纬度:</label>
                      <span>{{item.cdwd}}</span>
                    </div>
                    <!-- 旅游景区 -->
                    <div v-if="item.jqdjmc" class="user-info-box_elrow">
                      <label>景区等级:</label>
                      <span>{{item.jqdjmc}}</span>
                    </div>
                    <div v-if="item.jds" class="user-info-box_elrow">
                      <label>景点数:</label>
                      <span>{{item.jds}}</span>
                    </div>
                    <div v-if="item.rjdyks" class="user-info-box_elrow">
                      <label>日接待游客量:</label>
                      <span>{{item.rjdyks}}</span>
                    </div>
                    <div v-if="item.dwfzrxm" class="user-info-box_elrow">
                      <label>场所负责人:</label>
                      <span>{{item.dwfzrxm}}</span>
                    </div>
                    <div v-if="item.aqzrrzwmc" class="user-info-box_elrow">
                      <label>责任人职位:</label>
                      <span>{{item.aqzrrzwmc}}</span>
                    </div>
                    <div v-if="item.dwfzrsfz" class="user-info-box_elrow">
                      <label>有效身份证:</label>
                      <span>{{item.dwfzrsfz}}</span>
                    </div>
                    <div v-if="item.aqzrdwmc" class="user-info-box_elrow">
                      <label>安全责任单位:</label>
                      <span>{{item.aqzrdwmc}}</span>
                    </div>
                    <div v-if="item.aqzrrxm" class="user-info-box_elrow">
                      <label>安全责任人:</label>
                      <span>{{item.aqzrrxm}}</span>
                    </div>
                    <div v-if="item.aqzrrdh" class="user-info-box_elrow">
                      <label>安全责任人联系电话:</label>
                      <span>{{item.aqzrrdh}}</span>
                    </div>
                    <div v-if="item.jcrq" class="user-info-box_elrow">
                      <label>检查日期:</label>
                      <span>{{item.jcrq.substring(0,10)}}</span>
                    </div>
                    <div v-if="item.cjrxm" class="user-info-box_elrow">
                      <label>登记人:</label>
                      <span>{{item.cjrxm}}</span>
                    </div>
                    <div v-if="item.cjsj" class="user-info-box_elrow">
                      <label>登记时间:</label>
                      <span>{{item.cjsj}}</span>
                    </div>
                    <div v-if="item.cjdwmc" class="user-info-box_elrow">
                      <label>登记单位:</label>
                      <span>{{item.cjdwmc }}</span>
                    </div>
                    <!-- 交通违法 -->
                    <div v-if="item.jsr" class="user-info-box_elrow">
                      <label>驾驶人:</label>
                      <span>{{item.jsr }}</span>
                    </div>
                    <div v-if="item.cphm" class="user-info-box_elrow">
                      <label>车牌号码:</label>
                      <span>{{item.cphm }}</span>
                    </div>
                    <div v-if="item.wfdd" class="user-info-box_elrow">
                      <label>违法地点:</label>
                      <span>{{item.wfdd}}</span>
                    </div>
                    <div v-if="item.wfsj" class="user-info-box_elrow">
                      <label>违法时间:</label>
                      <span>{{item.wfsj}}</span>
                    </div>
                    <div v-if="item.wfxwmc" class="user-info-box_elrow">
                      <label>违法行为:</label>
                      <span>{{item.wfxwmc}}</span>
                    </div>
                    <div v-if="item.cqcsmc" class="user-info-box_elrow">
                      <label>采取行为:</label>
                      <span>{{item.cqcsmc}}</span>
                    </div>
                    <!-- 两客一校一危 -->
                    <div v-if="item.clsyr" class="user-info-box_elrow">
                      <label>车辆所有人:</label>
                      <span>{{item.clsyr}}</span>
                    </div>
                    <div v-if="item.hphm" class="user-info-box_elrow">
                      <label>车牌号码:</label>
                      <span>{{item.hphm}}</span>
                    </div>
                    <div v-if="item.syxzmc" class="user-info-box_elrow">
                      <label>使用性质:</label>
                      <span>{{item.syxzmc}}</span>
                    </div>
                    <!-- 网上重点目标 -->
                    <div v-if="item.yyzt" class="user-info-box_elrow">
                      <label>运营状态:</label>
                      <span>{{item.yyzt}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>是否有隐患:</label>
                      <span>{{item.sfyyh === '0' ? '暂无' : '有隐患'}}</span>
                    </div>
                    <div v-if="item.yhdjmc" class="user-info-box_elrow">
                      <label>隐患等级:</label>
                      <span>{{item.yhdjmc}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>是否排查登记:</label>
                      <span>{{item.sfpc === '0' ? '未排查' : '已排查'}}</span>
                    </div>
                    <div v-if="item.pcsj==='1'" class="user-info-box_elrow">
                      <label>排查时间:</label>
                      <span>{{item.pcsj}}</span>
                    </div>
                    <div v-if="item.sfzx" class="user-info-box_elrow">
                      <label>是否注销:</label>
                      <span>{{item.sfzx === '0' ? '正常' : '已注销'}}</span>
                    </div>
                    <div v-if="item.sfzx === '1'" class="user-info-box_elrow">
                      <label>注销时间:</label>
                      <span>{{item.zxsj}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>审批状态:</label>
                      <span>{{item.zdcsztmc?item.zdcsztmc:'未审核'}}</span>
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
<el-table-column align="center" :prop='item.prop' :label="item.label" v-for='(item, index) in tdType' :key='index'></el-table-column>
<el-table-column align="center" prop="sfyyh" label="是否有隐患">
  <template scope="scope">
          <span>{{scope.row.sfyyh === '0' ? '无' : '有隐患'}}</span>
        </template>
</el-table-column>
<el-table-column align="center" prop="sfpc" label="是否排查登记">
  <template scope="scope">
          <span>{{scope.row.sfpc === '0' ? '无' : '已排查'}}</span>
        </template>
</el-table-column>
<el-table-column align="center" prop="pcsj" label="排查时间"></el-table-column>
<el-table-column align="center" prop="sfzx" label="是否注销" width="60px">
  <template scope="scope">
          <span>{{scope.row.sfzx === '0' ? '正常' : '已注销'}}</span>
        </template>
</el-table-column>
<el-table-column align="center" prop="zxsj" label="注销时间"></el-table-column>
<el-table-column v-if="activeName === '全部'" prop="id" label="操作" width="200px">
  <template scope="scope">
          <el-button type="text" size="small" @click="handleRecord(scope.row.id)">
            <i class="iconfont icon-bianji1" title="记录"></i>
          </el-button>
          <el-button type="text" size="small" @click="handleUpdate(scope.row.id,'details')">
            <i class="iconfont icon-xiangqing" title="详情"></i>
          </el-button>
          <el-button type="text" size="small" v-if="scope.row.zdcszt==='0'" @click="handleUpdate(scope.row.id,'edit')">
            <i class="iconfont icon-bianji" title="编辑"></i>
          </el-button>
          <el-button type="text" size="small" v-if="scope.row.zdcszt === '4' || scope.row.zdcszt === '5' || scope.row.zdcszt === '6' || scope.row.sfzx === '1'" @click="handleDel(scope.row.id)">
            <i class="iconfont icon-trash" title="删除"></i>
          </el-button>
          <el-button type="text" size="small" v-if="scope.row.sfzx==='0' && scope.row.zdcszt==='0'" @click="handleNotUse(scope.row,'1','industry')">
            <i class="iconfont icon-close" title="注销"></i>
          </el-button>
          <el-button type="text" size="small" v-if="scope.row.sfzx==='1' && scope.row.zdcszt==='0'" @click="handleNotUse(scope.row,'0','industry')">
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
<side-right-box :unfoldHandle="unfoldT" @unfoldState="this.unfoldT===false" style="position:fixed; top:100px; height:calc(100% - 100px); z-index:5">
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
  import controlMixin from '../controlMixin'
  import '../../../utils/dateFormat'
  import infoDialogEvents from '../../../utils/infoDialogEvents'
  // import seller from '../../control/air/baseInfo/seller/index'
  import { DOWNLOAD_FILE_PATH } from '../../../config'
  import {
    FXPCGK_BASEPLACE_DELETE,
    FXPCGK_BASEPLACE_APPROVALLIST,
    FXPCGK_BASEPLACE_TABCOUNT,
    FXPCGK_BASEPLACE_LIST
    // FXPCGK_BASEPLACE_UPDATE
  } from '../../../store/types'

  import { mapState } from 'vuex'
  import topBar from '../top-bar.vue'
  import pagination from '../../../widgets/pagination/pagination.vue'
  import handleDialog from './handle-dialog.vue'
  import recordDialog from './record-dialog.vue'
  import sideRightBox from '../side-right-box.vue'
  import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'
  import bus from '../../../utils/bus'
  import approvalDialog from '../group/dialog/approval-dialog.vue'
  import reasonDialog from '../group/dialog/reason-dialog.vue'
  import dialogInfo from '../../../widgets/info-dialog/info-dialog'
  import dataImage from '../../../widgets/data-image/data-image'
  import dataOutdialog from './data-to-excel.vue'
  export default {
    mixins: [mixin, controlMixin, infoDialogEvents],
    components: {
      pagination,
      handleDialog,
      topBar,
      sideRightBox,
      rightToolbar,
      approvalDialog,
      reasonDialog,
      'dialog-people-info': dialogInfo,
      'data-image': dataImage,
      recordDialog,
      'data-out-dialog': dataOutdialog
    },
    props: ['dataType', 'titleName', 'parentType'],
    data() {
      return {
        listType: 1,
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
        reasonDialog: false, // 注销弹窗
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
          Flag: 0, // 查询列表， 0： 重点人员， 1： 待我审批， 2： 待通过， 3： 待我签收， 4： 待他签收  [必填]
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
            Place: '', // 场所类型
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
            title: '场所名称/场所类别',
            prop: 'Place',
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
          }]
        },
        activeName: '全部',
        tabs: [{
          label: '旅游景区',
          name: '全部',
          count: 0,
          pageIndex: 1,
          parentId: ''
        }, {
          label: '待我审批',
          name: '待我审批',
          count: 0, // examineCount
          pageIndex: 1,
          parentId: ''
        }],
        tdtemplate: [{
          dataTdtype: 'lyjq',
          content: [{
            prop: 'csmc',
            label: '场所名称'
          }, {
            prop: 'csdh',
            label: '场所电话'
          }, {
            prop: 'zdcslxmc',
            label: '重点场所类型'
          }, {
            prop: 'dwfzrdh',
            label: '联系电话'
          }, {
            prop: 'bz',
            label: '备注'
          }, {
            prop: 'aqzrrzwmc',
            label: '责任人职位'
          }, {
            prop: 'dwfzrsfz',
            label: '有效身份证件号码'
          }, {
            prop: 'dwfzrxm',
            label: '场所负责人'
          }, {
            prop: 'csdz',
            label: '详细地址'
          }, {
            prop: 'aqrl',
            label: '安全容量'
          }, {
            prop: 'mz',
            label: '面积'
          }, {
            prop: 'rymd',
            label: '人员密度'
          }, {
            prop: 'jcjbhdqk',
            label: '经常举办活动情况'
          }, {
            prop: 'jds',
            label: '景点数'
          }, {
            prop: 'rjdyks',
            label: '日接待游客数量'
          }, {
            prop: 'cslxmc',
            label: '场所类型'
          }, {
            prop: 'gm',
            label: '规模'
          }, {
            prop: 'dwzrr',
            label: '单位责任人'
          }, {
            prop: 'zrrdh',
            label: '责任人电话'
          }, {
            prop: 'zrrzwmc',
            label: '责任人职务'
          }, {
            prop: 'qtrs',
            label: '群体人数'
          }, {
            prop: 'zylyd',
            label: '主要来源地'
          }, {
            prop: 'cyqk',
            label: '从业情况'
          }, {
            prop: 'syhgldw',
            label: '使用或管理单位'
          }, {
            prop: 'jcnf',
            label: '建成年份'
          }, {
            prop: 'jzmz',
            label: '建筑面积（㎡）'
          }, {
            prop: 'jzcs1',
            label: '建筑层数（地上）'
          }, {
            prop: 'jzcs2',
            label: '建筑层数（地下）'
          }, {
            prop: 'jzgd',
            label: '建筑高度（m）'
          }, {
            prop: 'sygnmc',
            label: '使用功能'
          }, {
            prop: 'jzytmc',
            label: '建筑用途'
          }, {
            prop: 'jcyxm',
            label: '检查人员'
          }, {
            prop: 'jcdwmc',
            label: '检查单位'
          }, {
            prop: 'jcsj',
            label: '检查时间'
          }, {
            prop: 'cscs',
            label: '场所层数'
          }, {
            prop: 'yymz',
            label: '营业面积'
          }, {
            prop: 'trsysj',
            label: '投入使用时间'
          }, {
            prop: 'jcryjh',
            label: '检查人员警号'
          }, {
            prop: 'jcryxm',
            label: '检查人员姓名'
          }, {
            prop: 'hs',
            label: '户数'
          }, {
            prop: 'czrk',
            label: '常住人口'
          }, {
            prop: 'yyzz',
            label: '工商营业执照编号'
          }, {
            prop: 'spsj',
            label: '审批时间'
          }, {
            prop: 'jbsj',
            label: '举办时间'
          }, {
            prop: 'cyrs',
            label: '参与人员数量'
          }, {
            prop: 'xklx',
            label: '许可类型'
          }, {
            prop: 'spjg',
            label: '审批机构'
          }, {
            prop: 'yyzt',
            label: '运营状态'
          }, {
            prop: 'tysj',
            label: '停运时间'
          }, {
            prop: 'ym',
            label: '域名'
          }, {
            prop: 'mc',
            label: '名称'
          }, {
            prop: 'lxmc',
            label: '服务类型'
          }, {
            prop: 'kbzxm',
            label: '开办者姓名'
          }, {
            prop: 'lxfs',
            label: '联系方式'
          }, {
            prop: 'fwsmc',
            label: '服务商名称'
          }, {
            prop: 'wzkbdmc',
            label: '网站开办地'
          }, {
            prop: 'wzjrdz',
            label: '网站接入地址'
          }, {
            prop: 'qymc',
            label: '企业名称'
          }, {
            prop: 'szqx',
            label: '市州区县'
          }, {
            prop: 'jfwldz',
            label: '机房物理地址'
          }, {
            prop: 'ptkbdmc',
            label: '平台（网站）开办地'
          }, {
            prop: 'ptjrd',
            label: '平台（网站）接入地'
          }, {
            prop: 'dwzrrjh',
            label: '单位责任人警号'
          }, {
            prop: 'dwzrrxm',
            label: '单位责任人姓名'
          }, {
            prop: 'dwmc',
            label: '单位名称'
          }, {
            prop: 'syxzmc',
            label: '使用性质'
          }, {
            prop: 'hphm',
            label: '号牌号码'
          }, {
            prop: 'clsyr',
            label: '车辆所有人'
          }, {
            prop: 'wfsj',
            label: '违法时间'
          }, {
            prop: 'wfdd',
            label: '违法地点'
          }, {
            prop: 'jsr',
            label: '驾驶人'
          }, {
            prop: 'cphm',
            label: '号牌号码'
          }, {
            prop: 'wfxwmc',
            label: '违法行为'
          }, {
            prop: 'cqcsmc',
            label: '采取措施'
          }, {
            prop: 'zlbfmc',
            label: '治理办法'
          }, {
            prop: 'lm',
            label: '路名'
          }, {
            prop: 'lh',
            label: '路号'
          }, {
            prop: 'ldlxmc',
            label: '路段类型'
          }, {
            prop: 'dllbmc',
            label: '道路类别'
          }, {
            prop: 'jsdjmc',
            label: '道路技术登记'
          }, {
            prop: 'zlqkmc',
            label: '治理进度'
          }, {
            prop: 'zlhxgpgmc',
            label: '治理后效果评估'
          }, {
            prop: 'zfgpjbmc',
            label: '政府挂牌督办级别'
          }, {
            prop: 'xzqk',
            label: '行政区划'
          }, {
            prop: 'gxjjddmc',
            label: '管辖交警大队名称'
          }, {
            prop: 'gxjjddid',
            label: '管辖交警大队ID'
          }]
        }],
        tdType: [{
          prop: 'csmc',
          label: '场所名称'
        }, {
          prop: 'csdh',
          label: '场所电话'
        }, {
          prop: 'csjd',
          label: '经度'
        }, {
          prop: 'cdwd',
          label: '纬度'
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
       * [getTabletdData 获取表格数据]
       */
      getTabletdData() {
        this.tdtemplate.map(d => {
          if (d.dataTdtype === this.dataType) {
            // this.tdType = [...d.content]
          }
        })
      },
      /**
       * [searchDtat 搜索更新数据]
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
          url = FXPCGK_BASEPLACE_LIST;
          res = 'fxpcgkBaseplaceList'
          this.filterObject.Flag = 0;
        } else if (this.activeName === '待我审批') {
          url = FXPCGK_BASEPLACE_APPROVALLIST;
          res = 'fxpcgkBaseplaceApprovallist'
          this.filterObject.Flag = 0;
        }
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
            self.tabs[1].count = self.focusCar[res].DataCount || 0
          }
        })
        this.dispatch(FXPCGK_BASEPLACE_TABCOUNT, this.querObj).then(d => {
          this.tabs[0].count = this.focusPerson.fxpcgkBaseplaceTabcount.all
          this.tabs[1].count = this.focusPerson.fxpcgkBaseplaceTabcount.app
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
          currentTab = this.currentTab
        this.loading = true
        this.plugLoading = 'noLoading' // 外挂状态更改需制空
        currentTab.parentId = this.parentId
        this.dispatch(FXPCGK_BASEPLACE_LIST, this.querObj).then(d => {
          this.$emit('update-loading', false)
          this.updateRecord(currentTab, FXPCGK_BASEPLACE_LIST, 'fxpcgkBaseplaceList')
          self.picUrl = DOWNLOAD_FILE_PATH
          self.tabs[self.filterObject.Flag].pageIndex = self.focusPerson.fxpcgkBaseplaceList.PageIndex
          if (currentTab.name === '全部') {
            self.tabs[0].count = self.focusPerson.fxpcgkBaseplaceList.DataCount || 0
          }
        })
        this.dispatch(FXPCGK_BASEPLACE_TABCOUNT, this.querObj).then(d => {
          this.tabs[0].count = this.focusPerson.fxpcgkBaseplaceTabcount.all
          this.tabs[1].count = this.focusPerson.fxpcgkBaseplaceTabcount.app
        })
      },
      reloadAppTab() {
        this.dialogApproval = false
        this.list = []
        this.dispatch(FXPCGK_BASEPLACE_APPROVALLIST, this.querObj).then(d => {
          this.list = this.focusPerson.fxpcgkBaseplaceApprovallist.PageData
        })
        this.dispatch(FXPCGK_BASEPLACE_TABCOUNT, this.querObj).then(d => {
          this.tabs[0].count = this.focusPerson.fxpcgkBaseplaceTabcount.all
          this.tabs[1].count = this.focusPerson.fxpcgkBaseplaceTabcount.app
        })
        this.dispatch(FXPCGK_BASEPLACE_LIST, this.querObj)
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
       * [tabClick 审批及列表切换]
       * @param  {[type]} tab [description]
       * @param  {[Object]} e   [event]
       * @return {[type]}     [description]
       */
      tabClick(tab, e) {
        this.list = []
        // 查询列表， 0： 重点人员， 1： 待我审批， 2： 待通过， 3： 待签收， 4： 待他签收  [必填]
        // 点击状态切换时更改 Flag的值
        if (tab.name === '待我审批') {
          this.dispatch(FXPCGK_BASEPLACE_APPROVALLIST, this.querObj).then(d => {
            this.list = this.focusPerson.fxpcgkBaseplaceApprovallist.PageData
            this.currentTab.count = this.focusPerson.fxpcgkBaseplaceApprovallist.DataCount
          })
        } else {
          this.dispatch(FXPCGK_BASEPLACE_LIST, this.querObj).then(d => {
            this.list = this.focusPerson.fxpcgkBaseplaceList.PageData
            this.currentTab.count = this.focusPerson.fxpcgkBaseplaceList.DataCount
          })
        }
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
       * @return {[type]}    [description]
       */
      handleNotUse(item, sfzx, type) {
        this.$refs.reasonDialog.handleNotUse(item, sfzx, type)
      },
      /**
       * [handleUpdate 新增操作]
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      handleUpdate(id, btnType) {
        this.$refs.handleDialog.updatePeopleData(id, this.filterObject.FocusType, btnType)
      },
      /**
       * [handleOut 数据导出]
       * @return {[type]} [description]
       */
      handleOut(FocusType) {
        this.dataOutdialog = true
      },
      /**
       * [handleTabClick 页签点击切换操作]
       * @param  {[type]} tab [description]
       * @param  {[Object]} e   [event]
       * @return {[type]}     [description]
       */
      handleTabClick(tab, e) {
        // 查询列表， 0： 重点人员， 1： 待我审批， 2： 待通过， 3： 待我签收， 4： 待他签收  [必填]
        // 点击状态切换时更改 Flag的值
        this.filterObject.Flag = tab.index
        if (tab.index === '0' || tab.index === '3') {
          this.isShowTollBar = false
        } else {
          this.isShowTollBar = true
        }
        // 刷新列表
        this.loadData()
      },
      /**
       * [handleAdd 新增操作]
       * @param  {[type]} object [description]
       * @return {[type]}        [description]
       */
      handleAdd(type) {
        this.$refs.handleDialog.handleAdd(type)
      },
      toggleTypeList(type) {
        this.listType = type;
      },
      /**
       * [GetSysDictByType 批量获取字典]
       */
      GetSysDictByType() {
        if (this.screen.options[0].children.length === 0) {
          /**
           * 采集单位
           */
          this.getRuleOrgTree('', true).then(d => {
            this.screen.options[0].children = d.map
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
          // this.dispatch(GET_SYS_LABEL_FOCUS_LABELS, { FocusType: 1 }, null, true).then(d => {
          //   this.screen.options[8].children = this.sysLabel.GetSysLabelFocusLabels.map(c => {
          //     return {
          //       label: c.LabelName,
          //       value: c.LabelName
          //     }
          //   })
          // })
          // this.getDict(['FXDJ']).then(res => {
          //   this.screen.options[8].children = res['FXDJ'] // 风险等级
          // })
        }
      },
      pagenavChange(obj) {
        // 分页切换操作
        this.pagenav = obj
        // 刷新列表
        this.loadData()
      },
      handleDel(KeyId) {
        if (KeyId) {
          this.$confirm('确定要删除该场所', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dispatch(FXPCGK_BASEPLACE_DELETE, { ids: KeyId, zdcslx: this.filterObject.FocusType }).then(d => {
              this.$message('删除成功!')
              this.handleCate()
            })
          }).catch(() => {});
        }
      },
      selectionChange(val) {
        // table内checkbox
        this.checkedSelects = val.map(value => value['id'])
      }
    },
    watch: {
      dataType() {
        this.switchCate()
        this.getTabletdData()
      },
      titleName() {
        this.tabs[0].label = this.titleName
      }
    },
    mounted() {},
    created() {
      // 侧边栏字典加载
      // this.GetSysDictByType()
    }
  }

</script>
