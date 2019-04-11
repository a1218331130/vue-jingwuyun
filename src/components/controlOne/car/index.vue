<template>
<div v-if="checkRule(carPower[3].methods,true)" class="control-box_div">
  <!-- 添加布控 -->
  <dialog-form :rad="rad" :url="uu" :type="'car'" :peopleObj="fkname" @call:change-update="loadData" :dialog="formDialog" @close="formDialog=false"></dialog-form>
  <!-- 查看布控结果  -->
  <contrast-results :dialog="ContrastDialog" @close="ContrastDialog=false" :ID="id" :title="caseName"></contrast-results>
  <!-- 数据操作弹窗_人员信息 -->
  <handle-dialog :dataType="dataType" ref="handleDialog" @call:change-update="handleCate"></handle-dialog>
  <!-- 操作记录 -->
  <record-dialogcz ref="recordDialog"></record-dialogcz>
  <!-- 数据操作弹窗_走访记录 -->
  <handle-visit-dialog :dialogVisit="dialogVisit" :object="object" @close="dialogVisit=false"></handle-visit-dialog>
  <!-- 数据操作弹窗_加入研判 -->
  <judge-dialog @call:change-update="handleCate" :dialogStudy="dialogStudy" :object="object" @close="dialogStudy=false"></judge-dialog>
  <!-- 数据操作弹窗_管控流转 -->
  <controlFlow-dialog @call:change-update="handleCate" :dialogControlFlow="dialogControlFlow" :object="object" @close="dialogControlFlow=false">
  </controlFlow-dialog>
  <!-- 数据操作弹窗_流转记录 -->
  <record-dialog :dialogRecord="dialogRecord" :object="object" @close="dialogRecord=false"></record-dialog>
  <!-- 数据操作弹窗_审批  -->
  <approval-dialog @call:change-update="reloadAppTab" :dialogApproval="dialogApproval" :object="object" @close="dialogApproval=false"></approval-dialog>
  <!-- 数据操作弹窗_签收  -->
  <sign-dialog @call:change-update="handleCate" :dialogSign="dialogSign" :keyId="keyId" @close="dialogSign=false"></sign-dialog>
  <!-- 数据操作弹窗_人员信息 -->
  <dialog-people-info :dialog="peopleInfoDialog" @close="peopleInfoDialog=false" :data="object"></dialog-people-info>
  <!-- 图像布控  -->
  <phoneControl-dialog @call:change-update="handleCate" :phoneControl="phoneControl" :object="object" @close="phoneControl=false"></phoneControl-dialog>
  <!-- 数据导出弹窗  -->
  <data-out-dialog @call:change-update="handleCate" :dataOutdialog="dataOutdialog" :ids="checkedSelects" :title="tabs[0].label" :type="filterObject.FocusType" @close="dataOutdialog=false"></data-out-dialog>
  <!-- 注销申请信息 -->
  <reason-dialog ref="reasonDialog" @call:change-update="updateReason" :data="object" @close="reasonDialog=false"></reason-dialog>
  <!-- 内容顶部操作栏 -->
  <div class="top-bar-tool_div">
    <!-- <el-tabs v-model="activeName" @tab-click="handleTabClick"> -->
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane v-for="(item,idx) in tabs" :label="item.label" :name="item.name" :key="idx">
        <span slot="label">{{item.label}}
          <span>({{item.count || 0}})</span>
        </span>
      </el-tab-pane>
    </el-tabs>  
    <top-bar v-if="filterObject.FocusType !== ''" @call:change-type="toggleTypeList" :listType="listType" :unfoldState="unfoldT" :FocusType="filterObject.FocusType" @unfoldHandle="unfoldHandle" @handleOut="handleOut(filterObject.FocusType)" @handleDelete="handleDelete(FocusType=2)"@handleAdd="handleAdd(filterObject.FocusType)"></top-bar>
  </div>

  <div class="app-toolbar">
    <!-- 列表操作 -->
    <div class="header-box_div">
      <el-checkbox v-model="checkAll" v-if="listType===1&&activeName !== '待通过'&& activeName !== '待我审批'&&activeName !== '待他签收'" @change="handleCheckAllChange">全选
      </el-checkbox>
      <dl class="header-handle_dl" v-if="activeName === '全部'">
        <!--<dd class="color-orange"><i class="iconfont icon-jingbao"></i>布控预警</dd>-->
        <!-- <dd v-if="checkRule(carPower[2].methods,true)" class="color-orange" @click="addStudy(FocusType=2)">
          <i class="iconfont icon-anjianyanpan"></i>加入研判
        </dd>
        <dd v-if="checkRule(carPower[2].methods,true)" class="color-green" @click="handleCancel(FocusType=2)">
          <i class="iconfont icon-xiaokongguanli "></i>取消管控
        </dd>
        <dd v-if="checkRule(carPower[2].methods,true)" class="color-green" @click="handleControlFlow(FocusType=2)">
          <i class="iconfont icon-Issued "></i>管控流转
        </dd>
        <dd v-if="checkRule(carPower[1].methods,true)" class="color-green" @click="handleDelete(FocusType=2)">
          <i class="iconfont icon-trash"></i>批量删除
        </dd> -->
      </dl>
      <dl class="header-handle_dl" v-if="activeName === '=待我审核'">
        <dd v-if="checkRule(carPower[2].methods,true)" class="color-green" @click="handleApproval()">
          <i class="iconfont icon-Issued "></i>批量审核
        </dd>
      </dl>
      <dl class="header-handle_dl" v-if="activeName === '待通过'">
        <!--<dd class="color-green" @click="handleConfirm('批量通过')"><i class="iconfont icon-Issued "></i>批量通过</dd>-->
      </dl>
      <dl class="header-handle_dl" v-if="activeName === '待我签收'">
        <dd v-if="checkRule(carPower[2].methods,true)" class="color-green" @click="handleSign()">
          <i class="iconfont icon-qianshou "></i>批量签收
        </dd>
      </dl>
    </div>
  </div>
  <div class="app-content-box" v-if="listType===1&&!nullData" :class="{active:isShowTollBar}" v-loading.body="loading">
    <!-- 列表 -->
    <el-checkbox-group v-show="listType===1" v-model="checkedSelects" @change="handleSelectChange">
      <ul class="checked-select-list">

        <li :key="item.KeyId" v-for="(item,i) in list">
          <!-- 多选框 -->
          <el-checkbox v-if="activeName !== '待通过'&& activeName !== '待我审批'&&activeName !== '待他签收'" :label="item.id" :key="item.id">
            <span name="label"></span>
          </el-checkbox>
          <!-- 信息 -->
          <div :class="{'list-info-box_div':true,'list-info-box_div_approval':activeName === '待我审批'}">
            <el-row class="tool-list_box">
              <el-row class="tool-list_box" v-if="activeName !== '待通过'">
                <el-col>
                  <dl class="info-list-handle_dl" v-if="activeName === '全部'">
                    <dd class="color-blue" @click="handleRecord(item.id)">
                      <i class="iconfont icon-bianji1"></i>操作记录
                    </dd>
                    <dd class="color-orange" @click="handleUpdate(item.id,'details')">
                      <i class="iconfont icon-chaxun"></i>查看详情
                    </dd>
                    <dd v-if="checkRule(carPower[2].methods,true)&&item.sfzx==='0'" class="color-orange" @click="handleUpdate(item.id,'edit')">
                      <i class="iconfont icon-bianji1"></i>信息编辑
                    </dd>
                    <dd v-if="item.zddxzt === '4' || item.zddxzt === '5' || item.zddxzt === '6' || item.sfzx === '1'" class="color-green" @click="handleDelete(FocusType=2,item.id)">
                      <i class="iconfont icon-trash"></i>删除
                    </dd>
                    <dd class="color-orange" v-if="item.zddxzt==='0' && item.sfzx === '0'" @click="handleNotUse(item,'1','car')">
                      <i class="iconfont icon-close"></i>注销
                    </dd>
                    <dd class="color-orange" v-if="item.zddxzt==='0' && item.sfzx === '1'" @click="handleNotUse(item,'0','car')">
                      <i class="iconfont icon-jia"></i>重新管控
                    </dd>
                    <dd class="color-orange" v-if="item.sfzx==='0'" @click="newEdit(item)">
                      <i class="iconfont icon-yonghuquntiliebiao"></i>{{item.gkzt==='0'?'申请布控':'取消布控'}}
                    </dd>
                    <dd v-if="item.gkzt!=='0'&&item.sfzx==='0'" class="color-orange" @click="ResultByBK(item)">
                      <i class="iconfont icon-guiji"></i>布控结果
                      <span style="color: red"> {{item.bkjgs||0}} </span>
                    </dd>
                    <dd v-if="item.sfzx==='0'&&item.clxp" class="color-orange" @click="peopleControl(item)">
                      <i class="iconfont icon-tupian"></i>图像布控
                    </dd>
                    <!-- <dd v-if="checkRule(carPower[2].methods,true)" class="color-orange" @click="addStudy(FocusType=2,item.KeyId,item.cphm)">
                      <i class="iconfont icon-anjianyanpan"></i>加入研判
                    </dd>
                    <dd v-if="checkRule(carPower[3].methods,true)" class="color-blue" @click="handleVisit(item)">
                      <i class="iconfont icon-bianji "></i>违章记录
                    </dd>
                    <dd v-if="checkRule(carPower[2].methods,true)" class="color-green" @click="handleCancel(FocusType=2,item.KeyId)">
                      <i class="iconfont icon-xiaokongguanli "></i>取消管控
                    </dd>
                    <dd v-if="checkRule(carPower[2].methods,true)" class="color-green" @click="handleControlFlow(FocusType=2,item.KeyId,item.cphm)">
                      <i class="iconfont icon-Issued "></i>管控流转
                    </dd>
                    <dd v-if="checkRule(carPower[3].methods,true)" class="color-green" @click="handleControlRecord(FocusType=2, item.KeyId)">
                      <i class="iconfont icon-Issued "></i>流转记录
                      <span style="color: red"> {{item.VisitTimes}} </span>
                    </dd> -->
                  </dl>
                  <dl class="info-list-handle_dl" v-if="activeName === '待我审核'">
                    <dd v-if="checkRule(carPower[2].methods,true)" class="color-blue" @click="handleApproval(item)">
                      <i class="iconfont icon-qianshou "></i>审核
                    </dd>
                  </dl>

                  <dl class="info-list-handle_dl" v-if="activeName === '待我审批'">
                    <dd class="color-blue" @click="handleApproval(item)">
                      <i class="iconfont icon-qianshou "></i>审批
                    </dd>
                  </dl>

                  <dl class="info-list-handle_dl" v-if="activeName === '待通过'">
                  </dl>
                  <dl class="info-list-handle_dl" v-if="activeName === '待我签收'">
                    <dd v-if="checkRule(carPower[2].methods,true)" class="color-blue" @click="handleSign(item.KeyId)">
                      <i class="iconfont icon-qianshou "></i>签收
                    </dd>
                  </dl>
                </el-col>
              </el-row>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="2" style="max-width: 90px;height:90px">
                <div class="list-info-user-img_div">
                  <span class="people-tag">{{item.cllxmc}}</span>
                  <img v-if="item.clxp!==null" :src="picUrl+item.clxp" onerror="this.src='/static/img/default-car.jpg'" />
                  <img v-if="!item.clxp" src='/static/img/default-car.jpg' />
                </div>
                <div class="people-button_div" @click="showDossierFocus(FocusType=2,item.cphm,item.clxh,item.fdjh)">
                  查看档案
                </div>
              </el-col>
              <el-col :span="22">
                <el-row>
                  <el-col :span="6" class="name-box_elcol">
                    <span class="name-text">{{item.cphm}}</span>
                    <span class="people-label">
                      <span v-if="item.cldj==='1'">一级</span>
                      <span v-if="item.cldj==='2'">二级</span>
                      <span v-if="item.cldj==='3'">三级</span>
                      <span v-if="item.cldj==='4'">四级</span>
                    </span>
                    <span class="info-source">
                      来源：
                      <span v-if="item.DataSrc===1">手工添加</span>
                      <span v-if="item.DataSrc===2">系统推送</span>
                    </span>
                  </el-col>
                  <el-col :span="18">
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="name-box_elcol">
                    <div v-if="item.cphm" class="user-info-box_elrow">
                      <label>车牌</label>
                      <span class="ID-card-text_span" @click="handlePeopleInfo(item.czxm,item.cphm,contentType=2)">{{item.cphm}}</span>
                    </div>
                    <div v-if="item.czxm" class="user-info-box_elrow">
                      <label>车主</label>
                      <span class="ID-card-text_span">{{item.czxm}}</span>
                    </div>
                    <div v-if="item.sfzh" class="user-info-box_elrow">
                      <label>身份证</label>
                      <span class="ID-card-text_span" @click="peopleInfoDialog = true">{{item.sfzh}}</span>
                    </div>
                    <!-- <div class="user-info-box_elrow">
                      <label>归属企业</label>
                      <span>{{item.gsqy}}</span>
                    </div> -->
                    <div v-if="item.gxdwmc" class="user-info-box_elrow">
                      <label>管辖单位</label>
                      <span>{{item.gxdwmc}}</span>
                    </div>
                    <div v-if="item.clsbm" class="user-info-box_elrow">
                      <label>车辆识别码</label>
                      <span>{{item.clsbm}}</span>
                    </div>
                    <div v-if="item.syxzmc" class="user-info-box_elrow">
                      <label>使用性质</label>
                      <span>{{item.syxzmc}}</span>
                    </div>

                    <div v-if="item.pp" class="user-info-box_elrow">
                      <label>品牌型号</label>
                      <span>{{item.pp}}</span>
                    </div>
                    <div v-if="item.czsj" class="user-info-box_elrow">
                      <label>注册日期</label>
                      <span>{{item.czsj}}</span>
                    </div>
                    <div v-if="item.gldwmc" class="user-info-box_elrow">
                      <label>发证机关</label>
                      <span>{{item.gldwmc}}</span>
                    </div>
                    <div v-if="item.fzsj" class="user-info-box_elrow">
                      <label>发证日期</label>
                      <span>{{item.fzsj}}</span>
                    </div>
                    <div v-if="item.cllxmc" class="user-info-box_elrow">
                      <label>车辆类型</label>
                      <span>{{item.cllxmc}}</span>
                    </div>
                    <div v-if="item.gksy" class="user-info-box_elrow">
                      <label>管控事由</label>
                      <span>{{item.gksy}}</span>
                    </div>
                    <div v-if="item.bz" class="user-info-box_elrow">
                      <label>备注</label>
                      <span>{{item.bz}}</span>
                    </div>
                    <div v-if="item.cjrxm" class="user-info-box_elrow">
                      <label>登记人:</label>
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
                    <div v-if="item.sfyyh" class="user-info-box_elrow">
                      <label>是否有隐患:</label>
                      <span>{{item.sfyyh === '0' ? '暂无' : '有隐患'}}</span>
                    </div>
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
  <div v-show="listType===2" v-loading.body="loading">
    <el-table @cell-mouse-enter="cellMouseEnter" v-loading.body="loading" :data="list" :border="true" @selection-change="selectionChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" width="50px" label="序号">
        <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
</el-table-column>
<el-table-column prop="cldj" label="管控等级" align="center" width="120px"></el-table-column>
<el-table-column prop="cphm" label="车牌号" align="center"></el-table-column>
<el-table-column prop="czxm" label="车主姓名" align="center"></el-table-column>
<el-table-column prop="gxdwmc" label="管辖单位" align="center"></el-table-column>
<el-table-column prop="djsj" label="登记时间" align="center"></el-table-column>
<el-table-column prop="sfzx" label="是否注销" align="center" width="120px">
  <template scope="scope">
          <span>{{scope.row.sfzx === '0' ? '正常' : '已注销'}}</span>
        </template>
</el-table-column>
<el-table-column prop="zxsj" label="注销时间" align="center"></el-table-column>
<el-table-column v-if="activeName === '全部'" prop="id" label="操作" width="250px">
  <template scope="scope">
        <el-button type="text" size="small" @click="handleRecord(scope.row.id)">
          <i class="iconfont icon-bianji1" title="记录"></i>
        </el-button>
        <el-button type="text" size="small" @click="handleUpdate(scope.row.id,'details')">
          <i class="iconfont icon-xiangqing" title="详情"></i>
        </el-button>
        <el-button type="text" size="small" v-if="checkRule(carPower[2].methods,true) && scope.row.sfzx==='0'" @click="handleUpdate(scope.row.id,'edit')">
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
        <el-button type="text" size="small" v-if="scope.row.sfzx==='0'" @click="newEdit(scope.row)">
          <i class="iconfont icon-yonghuquntiliebiao" :title="scope.row.gkzt==='0'?'申请布控':'取消布控'"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='0' && scope.row.gkzt !=='0'" @click="ResultByBK(scope.row)">
          <i class="iconfont icon-guiji" title="布控结果"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='0' && scope.row.clxp" @click="peopleControl(scope.row)">
          <i class="iconfont icon-tupian" title="图像布控"></i>
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
  <pagination :count="this.currentTab.count" :pagenav="pagenav" @update:pagenav="pagenavChange"></pagination>
</div>
<!-- 右侧栏 -->
<side-right-box :unfoldHandle="unfoldT" @unfoldState="this.unfoldT===false">
  <right-toolbar ref="rightBar" title="查询列表" :params="screen.filter" :options="screen.options" @packup="unfoldT = false" @update:params="searchSubmit" v-loading="dictLoading"></right-toolbar>
</side-right-box>
<!-- 撤销布控弹窗 -->
<el-dialog title="撤销布控" v-draggable="dialogDraggableOptions" :visible.sync="repealDialog" :modal-append-to-body="true" size="large--fixed" :modal="true" :close-on-click-modal="false" @open="repealInitDialog" :before-close="repealCloseEvent" v-loading="loading"
  element-loading-text="正在撤销布控中……">
  <el-form :model="repealForm" :rules="rules" label-width="100px" class="repealForm" ref="repealForm">
    <el-form-item label="撤控原因" prop="ckyy">
      <el-input type="textarea" v-model="repealForm.ckyy" placeholder=""></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="repealCloseEvent">关闭</el-button>
    <el-button type="primary" @click="repealSubmit('repealForm')">确认</el-button>
  </div>
</el-dialog>
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
  import dialogForm from '../../controlManage/apply/dialog-form'
  import mixin from '../../../utils/mixin'
  import bus from '../../../utils/bus'
  import controlMixin from '../controlMixin'
  import contrastResults from '../../controlManage/supervise/contrastResults.vue'
  import infoDialogEvents from '../../../utils/infoDialogEvents'
  import { DOWNLOAD_FILE_PATH } from '../../../config'
  import {
    FETCH_AUDIT_CARS_BY_COND,
    FETCH_PENDING_CARS_BY_COND,
    FETCH_MY_SING_CARS_BY_COND,
    FETCH_HE_SING_CARS_BY_COND,
    FXPCGK_CASECAR_LIST,
    REVOKE_APPROVAL,
    FXPCGK_CASECAR_DELETE,
    FXPCGK_CASECAR_APPROVALLIST, // 审批列表
    FXPCGK_CASECAR_TABCOUNT // 列表条数接口
  } from '../../../store/types'

  import '../../../utils/dateFormat'
  import { mapState } from 'vuex'
  import topBar from '../top-bar.vue'
  import pagination from '../../../widgets/pagination/pagination.vue'
  import handleDialog from './handle-dialog.vue'
  import dataOutdialog from './data-to-excel.vue'
  import judgeDialog from '../people/dialog/judge-dialog.vue'
  import controlFlowDialog from '../people/dialog/controlFlow-dialog.vue'
  import signDialog from '../people/dialog/sign-dialog.vue'
  import recordDialog from '../people/dialog/record-dialog.vue'
  import recordDialogcz from '../record-dialog.vue'
  import reasonDialog from '../group/dialog/reason-dialog.vue'
  import approvalDialog from '../group/dialog/approval-dialog.vue'
  import handleVisitDialog from './handle-visit-dialog.vue'
  import sideRightBox from '../side-right-box.vue'
  import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'
  import phoneControlDialog from '../group/dialog/phoneControl-dialog.vue'
  import dialogInfo from '../../../widgets/info-dialog/info-dialog'
  export default {
    mixins: [mixin, controlMixin, infoDialogEvents],
    components: {
      pagination,
      handleDialog,
      judgeDialog,
      recordDialogcz,
      controlFlowDialog,
      signDialog,
      reasonDialog,
      approvalDialog,
      topBar,
      sideRightBox,
      rightToolbar,
      phoneControlDialog,
      recordDialog,
      contrastResults,
      handleVisitDialog,
      'dialog-people-info': dialogInfo,
      'dialog-form': dialogForm,
      'data-out-dialog': dataOutdialog
    },
    props: ['dataType', 'titleName'],
    data() {
      return {
        formDialog: false, // 布控弹窗
        dataOutdialog: false, // 数据导出弹窗
        uu: '',
        rad: '0',
        id: '',
        nullData: false,
        caseName: '',
        listType: 1,
        fkname: '', // 风控车辆名称
        picUrl: '',
        phoneControl: false, // 图像弹窗
        plugLoading: null, // 刷新列表外挂 当plugLoading === null刷新
        parentId: null,
        list: [],
        ContrastDialog: false,
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
        peopleInfoDialogData: {
          id: 1,
          contentType: 1,
          name: '',
          idCard: ''
        }, // 人员信息弹窗
        checkAll: false,
        isShowTollBar: false,
        checkedSelects: [],
        object: {},
        keyId: '',
        pagenav: {
          currentpage: 1,
          limit: 10
        },
        filterObject: {
          FocusType: '100002', // 车辆类型 [必填]
          Flag: 0, // 查询列表，0：重点车辆，1：待我审核，2：待通过，3：待他签收，4：待我签收 [必填]
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
            CtrlStatusArr: [], // 管控状态,多选用逗号分隔
            LevelArr: [], // 管控等级(字典),多选用逗号分隔
            CarModelsArr: [], // 车型（字典）,多选用逗号分隔
            CollectDeptArr: [], // 管控单位,多选用逗号分隔
            LabelArr: [], // 车辆标签,多选用逗号分隔
            pp: '', // 车辆品牌,多选用逗号分隔
            daterange: '' // 检索开始时间--检索结束时间
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
          label: '毒驾车辆',
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
          // }, {
          //   label: '待我审核',
          //   name: '待我审核',
          //   count: 0, // examineCount
          //   pageIndex: 1,
          //   parentId: ''
          // }, {
          //   label: '待通过',
          //   name: '待通过',
          //   count: 0, // pendingCount
          //   pageIndex: 1,
          //   parentId: ''
          // }, {
          //   label: '待我签收',
          //   name: '待我签收',
          //   count: 0, // mySignCount
          //   pageIndex: 1,
          //   parentId: ''
          // }, {
          //   label: '待他签收',
          //   name: '待他签收',
          //   count: 0, // count.heSignCount
          //   pageIndex: 1,
          //   parentId: ''
        }],
        repealDialog: false,
        repealForm: {
          ckyy: '',
          id: '',
          lybid: ''
        },
        rules: {
          ckyy: [
            { required: true, message: '请输入撤控原因', trigger: 'blur' },
            { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      currentTab() {
        return this.tabs.find(d => d.name === this.activeName)
      },
      ...mapState(['dict', 'focusCar', 'sysLabel', 'focusPersonAndCar'])
    },
    methods: {
      /**
       * [newEdit 申请布控]revokeApproval
       */
      newEdit(item) {
        this.$confirm('确定要' + (item.gkzt === '0' ? '布控' : '取消布控') + '该车辆吗', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (item.gkzt === '0') {
            this.fkname = item
            this.fkname.lybid = item.id
            this.fkname.lylx = '3'
            this.formDialog = true
            this.rad = Math.random() * 100
          } else {
            this.repealForm.lybid = item.id
            this.repealForm.id = item.lcid
            this.repealDialog = true
            // this.dispatch(REVOKE_APPROVAL, { id: item.controlId, ckyy: '', bkly: '2', lybid: item.id }).then(() => {
            //   this.$message('取消布控成功!')
            //   this.handleCate()
            // })
          }
        }).catch(() => {});
      },
      /**
       * [ResultByBK 查看布控结果]
       * @param {[type]} item [description]
       */
      ResultByBK(item) {
        this.id = item.lcid
        this.caseName = item.cphm
        this.ContrastDialog = true
      },
      /**
       * [peopleControl 图像布控]
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      peopleControl(object) {
        this.object = object
        this.phoneControl = true
      },
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
        let self = this,
          currentTab = this.currentTab,
          url, res
        this.loading = true
        if (this.activeName === '全部') {
          url = FXPCGK_CASECAR_LIST;
          res = 'fxpcgkCasecarList'
          this.filterObject.Flag = 0;
        } else if (this.activeName === '待我审批') {
          url = FXPCGK_CASECAR_APPROVALLIST;
          res = 'fxpcgkCasecarApprovallist'
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
          self.tabs[self.filterObject.Flag].pageIndex = self.focusCar[res].PageIndex
          if (currentTab.name === '全部') {
            self.tabs[0].count = self.focusCar[res].DataCount || 0
          } else {
            self.tabs[1].count = self.focusCar[res].DataCount || 0
          }
          self.loading = false
        })
        this.dispatch(FXPCGK_CASECAR_TABCOUNT, this.querObj).then(d => {
          this.tabs[0].count = this.focusCar.fxpcgkCasecarTabcount.all
          this.tabs[1].count = this.focusCar.fxpcgkCasecarTabcount.app
        })
      },
      /**
       * [loadData 拉取列表]
       * @param  {[type]} updated [description]
       * @return {[type]}         [description]
       */
      loadData() {
        // 清空多选
        this.initSiberSearchContent()
        this.daterange = this.screen.filter.daterange
        this.checkAll = false
        let self = this,
          currentTab = this.currentTab,
          url, res
        this.loading = true

        // 查询列表， 0： 重点人员， 1： 待我审核， 2： 待通过， 3： 待我签收， 4： 待他签收  [必填]
        switch (this.filterObject.Flag) {
          case '1':
            url = FETCH_AUDIT_CARS_BY_COND;
            res = 'fetchAuditCarsByCond'
            break;
          case '2':
            url = FETCH_PENDING_CARS_BY_COND;
            res = 'fetchPendingCarsByCond'
            break;
          case '3':
            url = FETCH_MY_SING_CARS_BY_COND;
            res = 'fetchMySingCarsByCond'
            break;
          case '4':
            url = FETCH_HE_SING_CARS_BY_COND;
            res = 'fetchHeSingCarsByCond'
            break;
          default:
            url = FXPCGK_CASECAR_LIST;
            res = 'fxpcgkCasecarList'
            this.filterObject.Flag = 0;
            break;
        }
        this.dispatch(FXPCGK_CASECAR_TABCOUNT, this.querObj).then(d => {
          this.tabs[0].count = this.focusCar.fxpcgkCasecarTabcount.all
          this.tabs[1].count = this.focusCar.fxpcgkCasecarTabcount.app
        })
        // 加载列表
        // if (self.focusCar[res] === null || currentTab.parentId !== this.parentId || this.plugLoading === null) {
        this.plugLoading = 'noLoading' // 外挂状态更改需制空
        currentTab.parentId = this.parentId

        this.dispatch(url, this.querObj).then(d => {
          this.$emit('update-loading', false)
          this.updateRecord(currentTab, url, res)
          self.picUrl = DOWNLOAD_FILE_PATH
          self.list = self.focusCar[res].PageData
          self.tabs[self.filterObject.Flag].pageIndex = self.focusCar[res].PageIndex
          if (currentTab.name === '全部') {
            self.tabs[0].count = self.focusCar[res].DataCount || 0
          }
          self.loading = false
        })
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
       * [handleOut 数据导出]
       * @return {[type]} [description]
       */
      handleOut(FocusType) {
        this.dataOutdialog = true
      },
      /**
       * [handleDel 删除]
       * @param  {[type]} type  [description]
       * @param  {[type]} KeyId [description]
       * @return {[type]}       [description]
       */
      handleDel(type, KeyId) {
        if (KeyId) {
          this.$confirm('确定要删除该车辆', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dispatch(FXPCGK_CASECAR_DELETE, { ids: KeyId }).then(d => {
              this.$message('删除成功!')
              this.handleCate()
            })
          }).catch(() => {});
        } else if (this.checkedSelects.length > 0) {
          this.$confirm('确定要批量删除?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dispatch(FXPCGK_CASECAR_DELETE, { ids: this.checkedSelects.join(',') }).then(d => {
              this.$message('删除成功!')
              this.handleCate()
            }).catch(() => {});
          })
        } else {
          this.$message({ message: '请选择至少一条操作数据!', type: 'warning' })
        }
      },
      selectionChange(val) {
        // table内checkbox
        this.checkedSelects = val.map(value => value['id'])
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
       * [updateRecord 更新列表内容]
       * 包含, 合计数, 列表内容, 加载中标志
       * @return {[type]} [description]
       */
      updateRecord(currentTab, url, res) {
        // if (this.focusCar[res].PageData.length > 0) {
        //   this.list = [...this.focusCar[res].PageData];
        //   [...this.focusCar[res].PageData].forEach(d => {
        //     this.$http.post(FWZX_BASE_PATH + '/call', {
        //       c: 0,
        //       token: this.userData.UserToken,
        //       data: JSON.stringify({ cphm: d.cphm }),
        //       id: 'topic/gjfx/gjcar'
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
        this.list = [...this.focusCar[res].PageData];
        // }
      },
      pagenavChange(obj) {
        // 分页切换操作
        this.pagenav = obj
        // 刷新列表
        this.loadData()
      },
      toggleTypeList(type) {
        this.listType = type
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
      handleUpdate(id, btnType) {
        this.$refs.handleDialog.updateCarData(id, btnType)
      },
      /**
       * [++++++++handleTabClick 页签点击切换操作]
       * @param  {[type]} tab [description]
       * @param  {[Object]} e   [event]
       * @return {[type]}     [description]
       */
      handleTabClick(tab, e) {
        // 查询列表， 0： 重点人员， 1： 待我审核， 2： 待通过， 3： 待我签收， 4： 待他签收  [必填]
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
          this.dispatch(FXPCGK_CASECAR_APPROVALLIST, this.querObj).then(d => {
            this.list = this.focusCar.fxpcgkCasecarApprovallist.PageData
            this.currentTab.count = this.focusCar.fxpcgkCasecarApprovallist.DataCount
          })
        } else {
          this.dispatch(FXPCGK_CASECAR_LIST, this.querObj).then(d => {
            this.list = this.focusCar.fxpcgkCasecarList.PageData
            this.currentTab.count = this.focusCar.fxpcgkCasecarList.DataCount
          })
        }
      },
      reloadAppTab() {
        this.dialogApproval = false
        this.list = []
        this.dispatch(FXPCGK_CASECAR_APPROVALLIST, this.querObj).then(d => {
          this.list = this.focusCar.fxpcgkCasecarApprovallist.PageData
        })
        this.dispatch(FXPCGK_CASECAR_TABCOUNT, this.querObj).then(d => {
          this.tabs[0].count = this.focusCar.fxpcgkCasecarTabcount.all
          this.tabs[1].count = this.focusCar.fxpcgkCasecarTabcount.app
        })
        this.dispatch(FXPCGK_CASECAR_LIST, this.querObj)
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
            console.log(d.map, 'map')
            this.screen.options[0].children = d.map
          })
          // /**
          //  * 管控单位
          //  */
          // this.getRuleOrgTree('', true).then(d => {
          //   this.screen.options[4].children = d.map
          // })
          // /**
          //  *重点车辆标签
          //  */
          // this.dispatch(GET_SYS_LABEL_FOCUS_LABELS, { FocusType: 2 }, null, true).then(d => {
          //   this.screen.options[5].children = this.sysLabel.GetSysLabelFocusLabels.map(c => {
          //     return {
          //       label: c.LabelName,
          //       value: c.KeyId
          //     }
          //   })
          // })
          // this.getDict(['ZDGKDJ', 'JDCCX']).then(res => {
          //   this.screen.options[2].children = res['ZDGKDJ'] // 车辆管控等级
          //   this.screen.options[7].children = res['JDCCX'] // 车型
          // })
        }
      },
      repealInitDialog() {
        this.repealForm.ckyy = ''
      },
      repealCloseEvent() {
        this.repealDialog = false
      },
      // 撤销布控确认按钮
      repealSubmit(repealForm) {
        this.$refs[repealForm].validate((valid) => {
          if (valid) {
            this.dispatch(REVOKE_APPROVAL, {
              id: this.repealForm.id,
              bkly: '2',
              ck_object: {
                id: '',
                lybid: this.repealForm.lybid,
                ckyy: this.repealForm.ckyy
              }
            }).then(() => {
              this.repealDialog = false
              this.loadData()
              this.$message({
                message: '取消布控成功!',
                type: 'success'
              })
            }).catch(() => {})
          }
        })
      }
    },
    watch: {
      dataType() {
        // this.switchCate()
        this.switchCarType()
      },
      titleName() {
        this.tabs[0].label = this.titleName
      }
    },
    created() {
      if (this.unfoldT) {
        this.GetSysDictByType()
      }
      this.loadData()
    },
    mounted() {}
  }

</script>
