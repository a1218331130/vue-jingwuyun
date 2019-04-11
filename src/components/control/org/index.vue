<template>
<div class="control-box_div">
  <!-- 数据操作弹窗_人员信息 -->
  <handle-dialog ref="handleDialog" :dataType="dataType" :parentType='parentType' @call:change-update="handleCate"></handle-dialog>
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
    <!-- <el-tabs v-model="activeName" @tab-click="handleTabClick"> -->
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane v-for="item in tabs" :label="item.label" :name="item.name" :key="item.name">
        <span slot="label">{{item.label}}
          <span>({{item.count || 0}})</span>
        </span>
      </el-tab-pane>
    </el-tabs>
    <top-bar @call:change-type="toggleTypeList" :listType="listType" :unfoldState="unfoldT" :FocusType="filterObject.FocusType" @unfoldHandle="unfoldHandle" @handleDelete="handleDelete(FocusType=4)" @handleOut="handleOut(filterObject.FocusType)" @handleAdd="handleAdd(filterObject.FocusType)"></top-bar>
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
          <div :class="{'list-info-box_div':true,'list-info-box_div_approval':activeName === '待我审批'}">
            <el-row class="tool-list_box" v-if="activeName !== '待通过'">
              <el-col>
                <dl class="info-list-handle_dl" v-if="activeName === '全部'">
                  <dd class="color-blue" @click="handleRecord(item.id)">
                    <i class="iconfont icon-bianji1"></i>操作记录
                  </dd>
                  <dd class="color-orange" @click="handleUpdate(item.id,'details')">
                    <i class="iconfont icon-xiangqing"></i>查看详情
                  </dd>
                  <dd class="color-orange" v-if="item.zddxzt==='0' && item.sfzx === '0'" @click="handleUpdate(item.id,'edit')">
                    <i class="iconfont icon-bianji"></i>信息编辑
                  </dd>
                  <dd class="color-green" v-if="item.zddxzt === '4' || item.zddxzt === '5' || item.zddxzt === '6' || item.sfzx === '1'" @click="handleDel(item.id)">
                    <i class="iconfont icon-trash"></i>删除
                  </dd>
                  <dd class="color-orange" v-if="item.zddxzt==='0' && item.sfzx === '0'" @click="handleNotUse(item,'1','org')">
                    <i class="iconfont icon-close"></i>注销
                  </dd>
                  <dd class="color-orange" v-if="item.zddxzt==='0' && item.sfzx === '1'" @click="handleNotUse(item,'0','org')">
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
                    <div v-if="item.zdhymc" class="user-info-box_elrow">
                      <label>行业名称:</label>
                      <span>{{item.zdhymc}}</span>
                    </div>
                    <div v-if="item.zdhylbmc" class="user-info-box_elrow">
                      <label>行业类别:</label>
                      <span>{{item.zdhylbmc}}</span>
                    </div>
                    <div v-if="item.hydh" class="user-info-box_elrow">
                      <label>联系电话:</label>
                      <span>{{item.hydh}}</span>
                    </div>
                    <div v-if="item.yzwz" class="user-info-box_elrow">
                      <label>有证无证:</label>
                      <span>{{item.yzwz==='0'?'无':'有'}}</span>
                    </div>
                    <div v-if="item.ywtzz" class="user-info-box_elrow">
                      <label>有无特种证:</label>
                      <span>{{item.ywtzz==='0'?'无':'有'}}</span>
                    </div>
                    <div v-if="item.djrxm" class="user-info-box_elrow">
                      <label>登记人:</label>
                      <span>{{item.djrxm}}</span>
                    </div>
                    <div v-if="item.djsj" class="user-info-box_elrow">
                      <label>登记时间:</label>
                      <span>{{item.djsj}}</span>
                    </div>
                    <div v-if="item.djdwmc" class="user-info-box_elrow">
                      <label>登记单位:</label>
                      <span>{{item.djdwmc }}</span>
                    </div>
                    <div v-if="item.sfyyh" class="user-info-box_elrow">
                      <label>是否有隐患:</label>
                      <span>{{item.sfyyh === '0' ? '暂无' : '有隐患'}}</span>
                    </div>
                    <div v-if="item.sfpc" class="user-info-box_elrow">
                      <label>是否排查登记:</label>
                      <span>{{item.sfpc === '0' ? '未排查' : '已排查'}}</span>
                    </div>
                    <div v-if="item.pcsj" class="user-info-box_elrow">
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
                      <span>{{item.zddxztmc?item.zddxztmc:'未审批'}}</span>
                      <!--<span v-if="item.spzt==='0'">已审批</span>
                      <span v-if="item.spzt==='2'">新增待审批</span>
                      <span v-if="item.spzt==='1'">注销待审批</span>
                      <span v-if="item.spzt==='3'">未通过</span>
                      <span v-if="item.spzt==='4'">注销已审批</span>
                      <span v-if="item.spzt==='5'">重新管控待审批</span> -->
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
      width: calc(100% - 480px);
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
  import bus from '../../../utils/bus'
  import infoDialogEvents from '../../../utils/infoDialogEvents'
  import { DOWNLOAD_FILE_PATH } from '../../../config'
  import {
    FXPCGK_INDORG_DELETE,
    FXPCGK_INDORG_LIST,
    FXPCGK_INDORG_APPROVALLIST,
    FXPCGK_INDORG_TABCOUNT
    // FXPCGK_INDORG_UPDATE
  } from '../../../store/types'

  import { mapState } from 'vuex'
  import topBar from '../top-bar.vue'
  import pagination from '../../../widgets/pagination/pagination.vue'
  import handleDialog from './handle-dialog.vue'
  import recordDialog from '../record-dialog.vue'
  import sideRightBox from '../side-right-box.vue'
  import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'
  import dataImage from '../../../widgets/data-image/data-image'
  import dataOutdialog from './data-to-excel.vue'
  import approvalDialog from '../group/dialog/approval-dialog.vue'
  import reasonDialog from '../group/dialog/reason-dialog.vue'
  export default {
    mixins: [mixin, controlMixin, infoDialogEvents],
    components: {
      pagination,
      approvalDialog,
      reasonDialog,
      handleDialog,
      topBar,
      sideRightBox,
      rightToolbar,
      recordDialog,
      'data-image': dataImage,
      'data-out-dialog': dataOutdialog
    },
    props: ['dataType', 'titleName', 'parentType'],
    data() {
      return {
        reasonDialog: false,
        noteId: null,
        sfzx: null,
        dialogForm: false,
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
            title: '行业名称/行业类别',
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
          }]
        },
        activeName: '全部',
        tabs: [{
          label: '党政机关',
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
            //   prop: 'zdhymc',
            //   label: '行业单位名称'
            // }, {
            //   prop: 'zdhylbmc',
            //   label: '重点行业单位类型'
            // }, {
            prop: 'hydh',
            label: '重点行业单位电话'
          }, {
            prop: 'xxdz',
            label: '详细地址'
          }, {
            prop: 'jd',
            label: '经度'
          }, {
            prop: 'wd',
            label: '纬度'
          }, {
            prop: 'dwlxmc',
            label: '单位(企业)类型'
          }, {
            prop: 'dwxzmc',
            label: '单位(企业)现状'
          }, {
            prop: 'abbmfzrxm',
            label: '安保部门负责人姓名'
          }, {
            prop: 'yxsfzhm',
            label: '有效身份证件号码'
          }, {
            prop: 'lxdh',
            label: '负责人联系电话'
          }, {
            prop: 'dwfzrxm',
            label: '单位负责人姓名'
          }, {
            prop: 'dwfzrsfz',
            label: '负责人身份证号'
          }, {
            prop: 'fzrlxdh',
            label: '负责人联系电话'
          }, {
            prop: 'qtwt',
            label: '发现的其他问题'
          }, {
            prop: 'jcryxm',
            label: '检查人员'
          }, {
            prop: 'jcdwmc',
            label: '检查单位'
          }, {
            prop: 'jcrq',
            label: '检查日期'
          }, {
            prop: 'fddbr',
            label: '法定代表人'
            // }, {
            //   prop: 'cs',
            //   label: '处所'
          }, {
            prop: 'zbmj',
            label: '主办民警'
          }, {
            prop: 'sadwmc',
            label: '受案单位'
          }, {
            prop: 'mjlxfs',
            label: '民警联系方式'
          }, {
            prop: 'saje',
            label: '涉案金额'
          }, {
            prop: 'sjrs',
            label: '涉及人数'
          }, {
            prop: 'sajyqk',
            label: '涉案简要情况'
          }, {
            prop: 'stajfaqk',
            label: '涉医案件发案情况'
          }, {
            prop: 'fgbwldxm',
            label: '分管保卫领导姓名'
          }, {
            prop: 'fgbwlxdh',
            label: '分管保卫联系电话'
          }, {
            prop: 'bwbmfzrxm',
            label: '保卫部门负责人姓名'
          }, {
            prop: 'bwbmlxdh',
            label: '保卫部门联系电话'
          }, {
            prop: 'gzrysl',
            label: '工作人员数量'
          }, {
            prop: 'jglxmc',
            label: '机构类型'
            // }, {
            //   prop: 'ywtzz',
            //   label: '有无特种证'
          }, {
            prop: 'gsyyzzbh',
            label: '工商营业执照编号'
          }, {
            prop: 'yyzzfzsj',
            label: '营业执照发照时间'
          }, {
            prop: 'tzhyxkzbh',
            label: '特种行业许可证编号'
          }, {
            prop: 'hyxkzfzsj',
            label: '许可证发证时间'
          }, {
            prop: 'jyfzrxm',
            label: '经营负责人姓名'
          }, {
            prop: 'jyfzrsfz',
            label: '有效身份证件号码'
          }, {
            prop: 'fzjgs',
            label: '分支机构数'
          }, {
            prop: 'mdwds',
            label: '末端网点数'
          }, {
            prop: 'kdywys',
            label: '快递业务员数'
          }, {
            prop: 'czkdywys',
            label: '持证快递业务员数'
          }, {
            prop: 'frxm',
            label: '法人姓名'
          }, {
            prop: 'frsfz',
            label: '法人身份证号'
          }, {
            prop: 'frlxfs',
            label: '法人联系电话'
          }, {
            prop: 'gsyyzzbh',
            label: '工商营业执照编号'
          }, {
            prop: 'yyzzspsj',
            label: '营业执照审批时间'
          }, {
            prop: 'hyxzxkzbh',
            label: '行业行政许可证编号'
          }, {
            prop: 'xzxkspsj',
            label: '许可证审批时间'
          }, {
            prop: 'zafzrxm',
            label: '治安负责人姓名'
          }, {
            prop: 'zafzrsfz',
            label: '治安负责人身份证号'
          }, {
            prop: 'zafzrlxdh',
            label: '治安负责人联系电话'
          }, {
            prop: 'sjyzdhxpmc',
            label: '涉及易制毒化学品名称'
          }, {
            prop: 'aqzrdwmc',
            label: '安全责任单位'
          }, {
            prop: 'aqzrrxm',
            label: '安全责任人'
          }, {
            prop: 'dwlbmc',
            label: '单位类别'
          }, {
            prop: 'yyztmc',
            label: '运营状态'
          }, {
            prop: 'yydjmc',
            label: '医院等级'
          }, {
            prop: 'tysj',
            label: '停运时间'
          }, {
            prop: 'bwbm',
            label: '保卫部门（专干）'
          }, {
            prop: 'lxfs',
            label: '联系方式'
          }, {
            prop: 'gdwfzrxm',
            label: '单位负责人姓名'
          }, {
            prop: 'yxfszhm',
            label: '有效身份证件号码'
          }, {
            prop: 'bafwfzrxm',
            label: '保安服务负责人姓名'
          }]
        }],
        tdType: [{
          prop: 'zdhymc',
          label: '行业单位名称'
        }, {
          prop: 'zdhylbmc',
          label: '重点行业单位类型'
        }, {
          prop: 'hydh',
          label: '重点行业单位电话'
        }, {
          prop: 'xxdz',
          label: '详细地址'
        }, {
          prop: 'jd',
          label: '经度'
        }, {
          prop: 'wd',
          label: '纬度'
        }, {
          prop: 'lxfs',
          label: '联系方式'
        }, {
          prop: 'djrxm',
          label: '登记人'
        }, {
          prop: 'djsj',
          label: '登记时间'
        }, {
          prop: 'djdwmc',
          label: '登记单位'
        }]
      }
    },
    computed: {
      currentTab() {
        return this.tabs.find(d => d.name === this.activeName)
      },
      ...mapState(['dict', 'focusOrg', 'sysLabel', 'focusOrgAndCar', 'trajectory'])
    },
    methods: {
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
          url = FXPCGK_INDORG_LIST;
          res = 'fxpcgkIndorgList'
          this.filterObject.Flag = 0;
        } else if (this.activeName === '待我审批') {
          url = FXPCGK_INDORG_APPROVALLIST;
          res = 'fxpcgkIndorgApprovallist'
          this.filterObject.Flag = 0;
        }
        this.plugLoading = 'noLoading' // 外挂状态更改需制空
        currentTab.parentId = this.parentId
        bus.$emit('parmes', this.querObj)
        this.dispatch(url, this.querObj).then(d => {
          this.$emit('update-loading', false)
          this.updateRecord(currentTab, url, res)
          self.picUrl = DOWNLOAD_FILE_PATH
          self.tabs[self.filterObject.Flag].pageIndex = self.focusOrg[res].PageIndex
          console.log('name', currentTab.name)
          if (currentTab.name === '全部') {
            self.tabs[0].count = self.focusOrg[res].DataCount || 0
          } else {
            self.tabs[1].count = self.focusOrg[res].DataCount || 0
          }
        })
        this.dispatch(FXPCGK_INDORG_TABCOUNT, this.querObj).then(d => {
          this.tabs[0].count = this.focusOrg.fxpcgkIndorgTabcount.all
          this.tabs[1].count = this.focusOrg.fxpcgkIndorgTabcount.app
        })
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
          this.dispatch(FXPCGK_INDORG_APPROVALLIST, this.querObj).then(d => {
            this.list = this.focusOrg.fxpcgkIndorgApprovallist.PageData
            this.currentTab.count = this.focusOrg.fxpcgkIndorgApprovallist.DataCount
          })
        } else {
          this.dispatch(FXPCGK_INDORG_LIST, this.querObj).then(d => {
            this.list = this.focusOrg.fxpcgkIndorgList.PageData
            this.currentTab.count = this.focusOrg.fxpcgkIndorgList.DataCount
          })
        }
      },
      /**
       * [loadData 拉取列表]
       * @param  {[type]} updated [description]
       * @return {[type]}         [description]
       */
      loadData() {
        this.initSiberSearchContent()
        // console.log(this.screen.filter.Idnumber)
        // 清空多选
        this.daterange = this.screen.filter.daterange
        this.checkAll = false
        this.checkedSelects = []
        let self = this,
          currentTab = this.currentTab,
          url, res
        this.loading = true
        // 查询列表， 0： 重点人员， 1： 待我审批， 2： 待通过， 3： 待我签收， 4： 待他签收  [必填]
        switch (this.dataType) {
          case 'lyjq':
            url = FXPCGK_INDORG_LIST;
            res = 'fxpcgkIndorgList'
            break;
          default:
            url = FXPCGK_INDORG_LIST;
            res = 'fxpcgkIndorgList'
            break;
        }
        this.plugLoading = 'noLoading' // 外挂状态更改需制空
        currentTab.parentId = this.parentId
        this.dispatch(url, this.querObj).then(d => {
          this.$emit('update-loading', false)
          this.updateRecord(currentTab, url, res)
          self.picUrl = DOWNLOAD_FILE_PATH
          self.tabs[self.filterObject.Flag].pageIndex = self.focusOrg[res].PageIndex
          if (currentTab.name === '全部') {
            self.tabs[0].count = self.focusOrg[res].DataCount || 0
          }
        })
        this.dispatch(FXPCGK_INDORG_TABCOUNT, this.querObj).then(d => {
          this.tabs[0].count = this.focusOrg.fxpcgkIndorgTabcount.all
          this.tabs[1].count = this.focusOrg.fxpcgkIndorgTabcount.app
        })
      },
      /**
       * [updateRecord 更新列表内容]
       * 包含, 合计数, 列表内容, 加载中标志
       * @return {[type]} [description]
       */
      updateRecord(currentTab, url, res) {
        this.list = [...this.focusOrg[res].PageData];
      },
      reloadAppTab() {
        this.dialogApproval = false
        this.list = []
        this.dispatch(FXPCGK_INDORG_APPROVALLIST, this.querObj).then(d => {
          this.list = this.focusOrg.fxpcgkIndorgApprovallist.PageData
        })
        this.dispatch(FXPCGK_INDORG_TABCOUNT, this.querObj).then(d => {
          this.tabs[0].count = this.focusOrg.fxpcgkIndorgTabcount.all
          this.tabs[1].count = this.focusOrg.fxpcgkIndorgTabcount.app
        })
        this.dispatch(FXPCGK_INDORG_LIST, this.querObj)
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
       * [handleAdd 新增操作]
       * @param  {[type]} object [description]
       * @return {[type]}        [description]
       */
      handleAdd(type) {
        this.$refs.handleDialog.handleAdd(type)
      },
      /**
       * [handleUpdate 编辑操作]
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
          //   console.log('标签', this.sysLabel.GetSysLabelFocusLabels);
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
          this.$confirm('确定要删除该单位吗', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dispatch(FXPCGK_INDORG_DELETE, { ids: KeyId, zdhylb: this.filterObject.FocusType }).then(d => {
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
