<template>
<div class="control-box_div">
  <!-- 添加布控 -->
  <dialog-form :rad="rad" :url="uu" :type="'people'" :peopleObj="fkname" @call:change-update="loadData" :dialog="formDialog" @close="formDialog=false" :hiddenBtn="true"></dialog-form>
  <!-- 查看布控结果  -->
  <contrast-results :dialog="ContrastDialog" @close="ContrastDialog=false" :ID="id" :title="caseName"></contrast-results>
  <!-- 人员信息 -->
  <handle-dialog ref="handleDialog" @call:change-update="handleCate"></handle-dialog>
  <!-- 操作记录 -->
  <record-dialogcz ref="recordDialog"></record-dialogcz>
  <!-- 走访记录 -->
  <handle-visit-dialog @call:change-update="handleCate" :dialogVisit="dialogVisit" :object="object" :personPower="personPower" @close="dialogVisit=false"></handle-visit-dialog>

  <!-- 加入研判 -->
  <judge-dialog @call:change-update="handleCate" :dialogStudy="dialogStudy" :object="object" @close="dialogStudy=false"></judge-dialog>

  <!-- 管控流转 -->
  <controlFlow-dialog @call:change-update="handleCate" :dialogControlFlow="dialogControlFlow" :object="object" @close="dialogControlFlow=false">
  </controlFlow-dialog>

  <!-- 流转记录 -->
  <record-dialog :dialogRecord="dialogRecord" :object="object" @close="dialogRecord=false"></record-dialog>
  <!-- 审批  -->
  <approval-dialog @call:change-update="reloadAppTab" :dialogApproval="dialogApproval" :object="object" @close="dialogApproval=false"></approval-dialog>

  <!-- 图像布控  -->
  <phoneControl-dialog @call:change-update="handleCate" :phoneControl="phoneControl" :object="object" @close="phoneControl=false"></phoneControl-dialog>

  <!-- 签收  -->
  <sign-dialog @call:change-update="handleCate" :dialogSign="dialogSign" :keyId="keyId" @close="dialogSign=false"></sign-dialog>

  <!-- 数据导出弹窗  -->
  <data-out-dialog @call:change-update="handleCate" :dataOutdialog="dataOutdialog" :ids="checkedSelects" :title="tabs[0].label" :type="filterObject.FocusType" @close="dataOutdialog=false"></data-out-dialog>

  <!-- 人员信息 -->
  <dialog-people-info @call:change-update="peopleInfoDialog=false" :dialog="peopleInfoDialog" :data="object" @close="peopleInfoDialog=false"></dialog-people-info>

  <!-- 注销申请信息 -->
  <reason-dialog ref="reasonDialog" @call:change-update="updateReason" :data="object" @close="reasonDialog=false"></reason-dialog>

  <!-- 内容顶部操作栏 -->
  <div class="top-bar-tool_div">
    <el-tabs v-model="activeName" @tab-click="tabClick" style="float:left;">
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
    <top-bar v-if="filterObject.FocusType !== ''" @call:change-type="toggleTypeList" :listType="listType" :unfoldState="unfoldT" :FocusType="filterObject.FocusType" @unfoldHandle="unfoldHandle" @handleOut="handleOut(filterObject.FocusType)" @handleDelete="handleDelete(FocusType=1)"
      @handleAdd="handleAdd(filterObject.FocusType)"></top-bar>
  </div>
  <div class="app-toolbar">
    <!-- 列表操作 -->
    <div class="header-box_div">
      <el-checkbox v-model="checkAll" v-if="listType===1&&activeName !== '待通过'&& activeName !== '待我审批'&&activeName !== '待他签收'" @change="handleCheckAllChange">全选
      </el-checkbox>
      <dl class="header-handle_dl" v-if="activeName === '全部'">
        <!--<dd class="color-orange"><i class="iconfont icon-jingbao"></i>布控预警</dd>-->
        <!-- <dd class="color-orange" @click="addStudy(FocusType=1)">
          <i class="iconfont icon-anjianyanpan"></i>加入研判
        </dd>
        <dd class="color-green" @click="handleCancel(FocusType=1)">
          <i class="iconfont icon-xiaokongguanli "></i>取消管控
        </dd> -->
        <!-- <dd v-if="checkRule(personPower[2].methods,true)" class="color-green" @click="handleControlFlow(FocusType=1)">
              <i class="iconfont icon-Issued "></i>管控流转
            </dd> -->
        <!-- <dd class="color-green" @click="handleDelete(FocusType=1)">
          <i class="iconfont icon-trash"></i>批量删除
        </dd> -->
      </dl>
      <!-- <dl class="header-handle_dl" v-if="activeName === '待我审批'">
        <dd class="color-green" @click="handleApproval()">
          <i class="iconfont icon-Issued "></i>批量审批
        </dd>
      </dl> -->
      <dl class="header-handle_dl" v-if="activeName === '待通过'">
        <!--<dd class="color-green" @click="handleConfirm('批量通过')"><i class="iconfont icon-Issued "></i>批量通过</dd>-->
      </dl>
      <dl class="header-handle_dl" v-if="activeName === '待签收'">
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
          <el-checkbox v-if="activeName !== '待通过'&& activeName !== '待我审批'&&activeName !== '待他签收'" :label="item.id" :key="item.id" @change="handleCheckSingleChange($event,item)">
            <span name="label"></span>
          </el-checkbox>
          <!-- 信息 -->
          <div :class="{'list-info-box_div':true,'list-info-box_div_approval':activeName === '待我审批'}">
            <el-row class="tool-list_box" v-if="activeName !== '待通过'">
              <el-col>
                <dl class="info-list-handle_dl" v-if="activeName === '全部'">
                  <dd class="color-blue" @click="handleRecord(item.id)">
                    <!-- <dd class="color-blue" v-if="item.sfzx==='0'&&(!item.spzt||item.spzt==='0')" @click="handleRecord(item.id)"> -->
                    <i class="iconfont icon-bianji1"></i>操作记录
                  </dd>
                  <dd class="color-orange" @click="handleUpdate(item.id,'look',true)">
                    <i class="iconfont icon-xiangqing"></i>查看详情
                  </dd>
                  <dd v-if="(!item.spzt||item.spzt==='0'||item.spzt==='3')" class="color-orange" @click="handleUpdate(item.id,'update',false)">
                    <i class="iconfont icon-bianji"></i>信息编辑
                  </dd>
                  <dd class="color-green" v-if="(item.spzt==='4'&&item.sfzx!=='0')||item.spzt==='3'" @click="handleDelete(FocusType=1,item.id)">
                    <i class="iconfont icon-trash"></i>删除
                  </dd>
                  <dd class="color-orange" v-if="item.sfzx==='0'&&item.spzt==='0'" @click="handleNotUse(item,1)">
                    <i class="iconfont icon-close"></i>注销
                  </dd>
                  <dd class="color-orange" v-if="item.sfzx==='1'&&item.spzt==='4'" @click="handleNotUse(item,0)">
                    <i class="iconfont icon-jia"></i>重新管控
                  </dd>
                  <dd v-if="item.sfzx==='0'&&(!item.spzt||item.spzt==='0')" class="color-orange" @click="newEdit(item)">
                    <i class="iconfont icon-yonghuquntiliebiao"></i>{{item.bkzt==='0'?'申请布控':'取消布控'}}
                  </dd>
                  <dd v-if="item.bkzt!=='0'" class="color-orange" @click="ResultByBK(item)">
                    <i class="iconfont icon-guiji"></i>布控结果
                    <span style="color: red"> {{item.bkjgs||0}} </span>
                  </dd>
                  <dd v-if="item.sfzx==='0'&&item.sfz&&(item.sfz.length===18||item.zpxx)&&(!item.spzt||item.spzt==='0')" class="color-orange" @click="peopleControl(item)">
                    <i class="iconfont icon-tupian"></i>人脸布控
                  </dd>
                  <dd class="color-blue" v-if="item.sfzx==='0'&&(!item.spzt||item.spzt==='0')" @click="handleVisit(item)">
                    <i class="iconfont icon-bianji"></i>走访记录
                    <span style="color: red"> {{item.VisitTimes}} </span>
                  </dd>
                  <dd v-if="item.sfzx==='0'&&(!item.spzt||item.spzt==='0')" class="color-orange" @click="handleUpdate(item.id,'change',true)">
                    <i class="iconfont icon-bianji1"></i>管控流转
                  </dd>
                  <!-- <dd class="color-orange" @click="addStudy(FocusType=1,item.id,item.Sfz)">
                    <i class="iconfont icon-anjianyanpan"></i>加入研判
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
                <dl class="info-list-handle_dl" v-if="activeName === '待签收'">
                  <dd class="color-blue" @click="handleSign(item.id)">
                    <i class="iconfont icon-qianshou "></i>签收
                  </dd>
                </dl>
              </el-col>
            </el-row>

            <el-row :gutter="15">
              <el-col :span="2" style="max-width: 90px">
                <div class="list-info-user-img_div">
                  <span class="people-tag">{{item.RyTypeName}}</span>

                  <data-image :idCard="item.sfz"></data-image>
                  <!-- <img v-if="item.PhotosId!==null" :src="picUrl+item.PhotosId" />
                      <img v-if="item.PhotosId===null" src="/static/img/testPersonImg.jpg" /> -->
                </div>
                <div class="people-button_div" @click="showDossierFocus(FocusType=1,item.sfz)">
                  查看档案
                </div>
              </el-col>
              <el-col :span="22">
                <el-row>
                  <el-col :span="6" class="name-box_elcol">
                    <span class="name-text">{{item.xm}}</span>
                    <span v-if="item.fxdj==='FXDJ000'" class="people-label">
                      <span>{{'无风险'}}</span>
                    </span>
                    <span v-if="item.fxdj==='FXDJ001'" class="people-label">
                      <span>{{'一级'}}</span>
                    </span>
                    <span v-if="item.fxdj==='FXDJ002'" class="people-label">
                      <span>{{'二级'}}</span>
                    </span>
                    <span v-if="item.fxdj==='FXDJ003'" class="people-label">
                      <span>{{'三级'}}</span>
                    </span>
                    <span v-if="item.fxdj==='FXDJ004'" class="people-label">
                      <span>{{'四级'}}</span>
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
                </el-row>
                <el-row>
                  <el-col :span="24" class="name-box_elcol">
                    <div v-if="item.sfz" class="user-info-box_elrow">
                      <label>身份证:</label>
                      <span class="ID-card-text_span" @click="handlePeopleInfo(item.RyName,item.sfz,contentType=1)">{{item.sfz}}</span>
                    </div>
                    <!-- <div class="user-info-box_elrow">
                          <label>管控状态</label>
                          <span v-if="item.CtrlStatus==='0'">正常在控</span>
                          <span v-if="item.CtrlStatus==='1'">失控</span>
                          <span v-if="item.CtrlStatus==='2'">其它</span>
                        </div> -->
                    <div v-if="item.cym" class="user-info-box_elrow">
                      <label>曾用名:</label>
                      <span>{{item.cym}}</span>
                    </div>
                    <div v-if="item.cym" class="user-info-box_elrow">
                      <label>别名绰号:</label>
                      <span>{{item.bmch}}</span>
                    </div>
                    <div v-if="item.xb" class="user-info-box_elrow">
                      <label>性别:</label>
                      <span v-if="item.xb!==''">
                        <span v-if="item.xb==='1'">男</span>
                        <span v-if="item.xb==='2'">女</span>
                        <span v-if="item.xb==='3'">未知</span>
                      </span>
                    </div>
                    <div v-if="item.lxdh" class="user-info-box_elrow">
                      <label>联系电话(手机):</label>
                      <span>{{item.lxdh}}</span>
                    </div>
                    <div v-if="item.mzmc" class="user-info-box_elrow">
                      <label>民族:</label>
                      <span>{{item.mzmc}}</span>
                    </div>
                    <div v-if="item.rqlbmc" class="user-info-box_elrow">
                      <label>人群类别:</label>
                      <span>{{item.rqlbmc}}</span>
                    </div>
                    <div v-if="item.gjmc" class="user-info-box_elrow">
                      <label>国籍:</label>
                      <span>{{item.gjmc}}</span>
                    </div>
                    <div v-if="item.zzmmmc" class="user-info-box_elrow">
                      <label>政治面貌:</label>
                      <span>{{item.zzmmmc}}</span>
                    </div>
                    <div v-if="item.zjxymc" class="user-info-box_elrow">
                      <label>宗教信仰:</label>
                      <span>{{item.zjxymc}}</span>
                    </div>
                    <div v-if="item.csrq" class="user-info-box_elrow">
                      <label>出生日期:</label>
                      <span>{{item.csrq.substring(0,10)}}</span>
                    </div>
                    <div v-if="item.sfzy" class="user-info-box_elrow">
                      <label>身份/职业:</label>
                      <span>{{item.sfzy}}</span>
                    </div>
                    <div v-if="item.whcdmc" class="user-info-box_elrow">
                      <label>文化程度:</label>
                      <span>{{item.whcdmc}}</span>
                    </div>
                    <div v-if="item.bysj" class="user-info-box_elrow">
                      <label>毕业时间:</label>
                      <span>{{item.bysj.substring(0,10)}}</span>
                    </div>
                    <div v-if="item.byyx" class="user-info-box_elrow">
                      <label>毕业院校:</label>
                      <span>{{item.byyx}}</span>
                    </div>
                    <div v-if="item.ffcs" class="user-info-box_elrow">
                      <label>服务场所:</label>
                      <span>{{item.ffcs}}</span>
                    </div>
                    <div v-if="item.fcsdz" class="user-info-box_elrow">
                      <label>场所地址:</label>
                      <span>{{item.fcsdz}}</span>
                    </div>
                    <div v-if="item.zwzwmc" class="user-info-box_elrow">
                      <label>职务/职位:</label>
                      <span>{{item.zwzwmc}}</span>
                    </div>
                    <div v-if="item.zyjjly" class="user-info-box_elrow">
                      <label>主要经济来源:</label>
                      <span>{{item.zyjjly}}</span>
                    </div>
                    <div v-if="item.jszzqk" class="user-info-box_elrow">
                      <label>接受资助情况:</label>
                      <span>{{item.jszzqk}}</span>
                    </div>
                    <div v-if="item.jszzqk" class="user-info-box_elrow">
                      <label>接受资助情况:</label>
                      <span>{{item.jszzqk}}</span>
                    </div>
                    <div v-if="item.zwxx" class="user-info-box_elrow">
                      <label>指纹信息:</label>
                      <span>{{item.zwxx}}</span>
                    </div>
                    <div v-if="item.dnaxx" class="user-info-box_elrow">
                      <label>DNA信息:</label>
                      <span>{{item.dnaxx}}</span>
                    </div>
                    <div v-if="item.tmtz" class="user-info-box_elrow">
                      <label>体貌特征:</label>
                      <span>{{item.tmtz}}</span>
                    </div>
                    <div v-if="item.tcsh" class="user-info-box_elrow">
                      <label>特长嗜好:</label>
                      <span>{{item.tcsh}}</span>
                    </div>
                    <div v-if="item.jwzs" class="user-info-box_elrow">
                      <label>境外住所:</label>
                      <span>{{item.jwzs}}</span>
                    </div>
                    <div v-if="item.hzdqhmc" class="user-info-box_elrow">
                      <label>户籍地区划:</label>
                      <span>{{item.hzdqhmc}}</span>
                    </div>
                    <div v-if="item.hzdxz" class="user-info-box_elrow">
                      <label>户籍地详址:</label>
                      <span>{{item.hzdxz}}</span>
                    </div>
                    <div v-if="item.xzzhqmc" class="user-info-box_elrow">
                      <label>现住址区划:</label>
                      <span>{{item.xzzhqmc}}</span>
                    </div>
                    <div v-if="item.xzzxz" class="user-info-box_elrow">
                      <label>现住址详址:</label>
                      <span>{{item.xzzxz}}</span>
                    </div>
                    <div v-if="item.fxdjmc" class="user-info-box_elrow">
                      <label>风险等级:</label>
                      <span>{{item.fxdjmc}}</span>
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
                      <span v-if="item.sfzx">{{item.sfzx === '0' ? '正常' : '已注销'}}</span>
                    </div>
                    <div v-if="item.zxsj" class="user-info-box_elrow">
                      <label>注销时间:</label>
                      <span>{{item.zxsj}}</span>
                    </div>
                    <div class="user-info-box_elrow">
                      <label>审批状态:</label>
                      <span v-if="!item.spzt">未审核</span>
                      <span v-if="item.spzt==='0'">已审批</span>
                      <span v-if="item.spzt==='2'">新增待审批</span>
                      <span v-if="item.spzt==='1'">注销待审批</span>
                      <span v-if="item.spzt==='3'">未通过</span>
                      <span v-if="item.spzt==='4'">注销已审批</span>
                      <span v-if="item.spzt==='5'">重新管控待审批</span>
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
    <el-table class="app-table table-judge" @cell-mouse-enter="cellMouseEnter" v-loading.body="loading" :data="list" :border="true" @selection-change="selectionChange">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column type="index" align="center" width="50px" label="序号">
        <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
</el-table-column>
<el-table-column prop="xm" label="姓名" width="100" align="center"></el-table-column>
<el-table-column prop="sfz" width="160" label="身份证" align="center">
  <template scope="scope">
          <span class="ID-card-text_span" @click="handlePeopleInfo(scope.row.RyName,scope.row.sfz,contentType=1)">{{scope.row.sfz}}</span>
        </template>
</el-table-column>
<el-table-column prop="xbmc" width="70" label="性别" align="center"></el-table-column>
<el-table-column prop="gjmc" width="100" label="国籍" align="center"></el-table-column>
<el-table-column prop="cjsj" width="100" label="登记时间" align="center"></el-table-column>
<el-table-column prop="cjrxm" width="100" label="登记人姓名" align="center"></el-table-column>
<el-table-column prop="cjrdwmc" width="100" label="登记单位" align="center"></el-table-column>
<el-table-column label="是否排查" align="center">
  <template scope="scope">
          {{scope.row.sfpcdj === '1'? '已排查':'未排查'}}
        </template>
</el-table-column>
<el-table-column label="注销标识" align="center">
  <template scope="scope">
        {{scope.row.sfzx === '1'? '已注销':'正常'}}
        </template>

</el-table-column>
<el-table-column prop="zxsj" label="注销时间" align="center"></el-table-column>
<el-table-column v-if="activeName === '全部'" prop="id" label="操作" width="300">
  <template scope="scope">
        <el-button type="text" size="small" @click="handleRecord(scope.row.id)">
          <i class="iconfont icon-bianji1" title="记录"></i>
        </el-button>
        <el-button type="text" size="small" @click="handleUpdate(scope.row.id,'look',true)">
          <i class="iconfont icon-xiangqing" title="详情"></i>
        </el-button>
        <el-button type="text" size="small" v-if="(!scope.row.spzt||scope.row.spzt==='0'||scope.row.spzt==='3')" @click="handleUpdate(scope.row.id,'update',false)">
          <i class="iconfont icon-bianji" title="编辑"></i>
        </el-button>
        <el-button type="text" size="small" v-if="(scope.row.spzt==='4'&&scope.row.sfzx!=='0')||scope.row.spzt==='3'" @click="handleDelete(FocusType=1,scope.row.id)">
          <i class="iconfont icon-trash" title="删除"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='0' && scope.row.spzt==='0'" @click="handleNotUse(scope.row,1)">
          <i class="iconfont icon-close" title="注销"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='1'&&scope.row.spzt==='4'" @click="handleNotUse(scope.row,0)">
          <i class="iconfont icon-jia" title="管控"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='0'&&(!scope.row.spzt||scope.row.spzt==='0')" @click="newEdit(scope.row)">
          <i class="iconfont icon-yonghuquntiliebiao" :title="scope.row.bkzt==='0'?'申请布控':'取消布控'"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.bkzt!=='0'" @click="ResultByBK(scope.row)">
          <i class="iconfont icon-guiji" title="布控结果"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='0'&&(!scope.row.spzt||scope.row.spzt==='0')" @click="handleVisit(scope.row)">
          <i class="iconfont icon-bianji" title="走访记录"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='0'&&scope.row.sfz&&(scope.row.sfz.length===18||scope.row.zpxx)&&(!scope.row.spzt||scope.row.spzt==='0')" @click="peopleControl(scope.row)">
          <i class="iconfont icon-tupian" title="人脸布控"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='0'&&(!scope.row.spzt||scope.row.spzt==='0')" @click="handleUpdate(scope.row.id,'change',true)">
          <i class="iconfont icon-bianji1" title="管控流转"></i>
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
      width: calc(100% - 260px);
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
  import controlMixin from '../controlMixin'
  import contrastResults from '../../controlManage/supervise/contrastResults.vue'
  import '../../../utils/dateFormat'
  import infoDialogEvents from '../../../utils/infoDialogEvents'
  import { DOWNLOAD_FILE_PATH } from '../../../config'
  import {
    FETCH_AUDIT_PERSONS_BY_COND,
    FETCH_PENDING_PERSONS_BY_COND,
    FETCH_MY_SING_PERSONS_BY_COND,
    FETCH_HE_SING_PERSONS_BY_COND,
    // FXPCGK_UPDATE,
    FXPCGK_TABCOUNT,
    REVOKE_APPROVAL,
    FXPCGK_APPROVAL_LIST,
    // GET_SYS_LABEL_FOCUS_LABELS,
    FXPCGK_LIST
  } from '../../../store/types'

  import { mapState } from 'vuex'
  import topBar from '../top-bar.vue'
  import pagination from '../../../widgets/pagination/pagination.vue'
  import handleDialog from './handle-dialog.vue'
  import judgeDialog from './dialog/judge-dialog.vue'
  import controlFlowDialog from './dialog/controlFlow-dialog.vue'
  import signDialog from './dialog/sign-dialog.vue'
  import dataOutdialog from './dialog/data-to-excel.vue'
  import reasonDialog from './dialog/reason-dialog.vue'
  import recordDialog from './dialog/record-dialog.vue'
  import recordDialogcz from '../record-dialog.vue'
  import approvalDialog from './dialog/approval-dialog.vue'
  import phoneControlDialog from './dialog/phoneControl-dialog.vue'
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
      reasonDialog,
      judgeDialog,
      controlFlowDialog,
      signDialog,
      approvalDialog,
      phoneControlDialog,
      topBar,
      sideRightBox,
      rightToolbar,
      recordDialog,
      recordDialogcz,
      contrastResults,
      handleVisitDialog,
      'dialog-people-info': dialogInfo,
      'data-image': dataImage,
      'dialog-form': dialogForm,
      'data-out-dialog': dataOutdialog
    },
    props: ['dataType', 'titleName'],
    data() {
      return {
        formDialog: false, // 布控弹窗
        reasonDialog: false,
        rad: 0,
        uu: '',
        fkname: '', // 风控人员名称
        listType: 1,
        ContrastDialog: false, // 查看布控
        dataOutdialog: false, // 数据导出
        id: '',
        caseName: '',
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
        phoneControl: false, // 图像弹窗
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
          limit: 50
        },
        querObj: {},
        filterObject: {
          FocusType: '', // 人员类型 [必填]
          Flag: 0, // 查询列表， 0： 重点人员， 1： 待我审批， 2： 待通过， 3： 待签收， 4： 待他签收  [必填]
          OrderField: '', // 排序字段
          BeginDate: '', // 检索开始时间
          EndDate: '', // 检索结束时间
          PageIndex: 1, // 分页 - 当前页码 [必填]
          PageSize: 20 // 分页 - 每页行数 [必填]
        },
        daterange: '',
        screen: { // 筛选列表数据配置
          filter: {
            // XingMing: '', // 姓名
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
            // }, {
            //   title: '姓名',
            //   prop: 'XingMing',
            //   type: 'input'
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
          label: '民运分子',
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
          //   label: '待通过',
          //   name: '待通过',
          //   count: 0, // pendingCount
          //   pageIndex: 1,
          //   parentId: ''
          // }, {
          //   label: '待签收',
          //   name: '待签收',
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
      ...mapState(['dict', 'focusPerson', 'sysLabel', 'focusPersonAndCar', 'trajectory'])
    },
    methods: {
      /**
       * [newEdit 申请布控]
       */
      newEdit(item) {
        this.$confirm('确定要' + (item.bkzt === '0' ? '布控' : '取消布控') + '该人员吗', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (item.bkzt === '0') {
            this.fkname = item
            this.fkname.lybid = item.id
            this.fkname.lylx = '3'
            this.formDialog = true
            this.rad = Math.random() * 100
          } else {
            this.repealForm.id = item.bkid
            this.repealForm.lybid = item.id
            this.repealDialog = true
            // this.dispatch(REVOKE_APPROVAL, { id: item.bkid, ckyy: '', bkly: '2', lybid: item.id }).then(() => {
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
        this.id = item.bkid
        this.caseName = item.xm
        this.ContrastDialog = true
      },
      /**
       * [searchDtat 搜索更新列表]
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
        if (currentTab.name === '全部') {
          url = FXPCGK_LIST;
          res = 'fxpcgkList'
          this.filterObject.Flag = 0;
        } else {
          url = FXPCGK_APPROVAL_LIST;
          res = 'fxpcgkApprovalList'
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
        this.dispatch(FXPCGK_TABCOUNT, this.querObj).then(d => {
          this.tabs[0].count = this.focusPerson.fxpcgkTabcount.all
          this.tabs[1].count = this.focusPerson.fxpcgkTabcount.app
        })
      },
      /**
       * [loadData 拉取列表]
       * @param  {[type]} updated [description]
       * @return {[type]}         [description]
       */
      loadData() {
        this.$emit('update-loading', true) // 修改父组件loading
        this.initSiberSearchContent()
        // 清空多选
        this.daterange = this.screen.filter.daterange
        this.checkAll = false
        this.checkedSelects = []
        let self = this,
          currentTab = this.currentTab,
          url, res
        this.loading = true
        // 查询列表， 0： 重点人员， 1： 待我审批， 2： 待通过， 3： 待签收， 4： 待他签收  [必填]
        switch (this.filterObject.Flag) {
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
            url = FXPCGK_LIST;
            res = 'fxpcgkList'
            this.filterObject.Flag = 0;
            break;
        }
        this.dispatch(FXPCGK_TABCOUNT, this.querObj).then(d => {
          this.tabs[0].count = this.focusPerson.fxpcgkTabcount.all
          this.tabs[1].count = this.focusPerson.fxpcgkTabcount.app
        })
        // 加载列表
        // todo:此if判断影响了分页数据 暂时注释 后面有问题请整理后调整
        //        if (self.focusPerson[res] === null || currentTab.parentId !== this.parentId || this.plugLoading === null) {
        let isTrue = true
        if (isTrue) { // 判断都通过
          this.plugLoading = 'noLoading' // 外挂状态更改需制空
          currentTab.parentId = this.parentId
          this.dispatch(url, this.querObj).then(d => {
            this.$emit('update-loading', false) // 修改父组件loading
            this.updateRecord(currentTab, url, res)
            self.picUrl = DOWNLOAD_FILE_PATH
            self.tabs[self.filterObject.Flag].pageIndex = self.focusPerson[res].PageIndex
            if (currentTab.name === '全部') {
              self.tabs[0].count = self.focusPerson[res].DataCount || 0
            }
            self.loading = false
          })
        } else {
          this.updateRecord(currentTab, url, res)
          self.picUrl = DOWNLOAD_FILE_PATH
          self.tabs[self.filterObject.Flag].pageIndex = self.focusPerson[res].PageIndex
          if (currentTab.name === '全部') {
            self.tabs[0].count = self.focusPerson[res].DataCount || 0
          }
          self.loading = false
        }
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
       * [handleAdd 新增操作]
       * @param  {[type]} object [description]
       * @return {[type]}        [description]
       */
      handleAdd(type) {
        this.$refs.handleDialog.handleAdd(type)
      },
      /**
       * [handleNotUse 注销操作]
       * @param  {[type]} id [description]
       * @return {[type]}       [description]
       */
      handleNotUse(item, sfzx) {
        this.$refs.reasonDialog.handleNotUse(item, sfzx)
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
       * [handleUpdate 新增操作]
       * @param  {[type]} id [description]
       * @return {[type]}       [description]
       */
      handleUpdate(id, activeName, disabled) {
        this.$refs.handleDialog.updatePeopleData(id, activeName, disabled)
        // bus.$emit('control.updateHandlePeople' + this.dataType, id)
      },
      /**
       * [tabClick 审批及列表切换]
       * @param  {[type]} tab [description]
       * @param  {[Object]} e   [event]
       * @return {[type]}     [description]
       */
      tabClick(tab, e) {
        // 查询列表， 0： 重点人员， 1： 待我审批， 2： 待通过， 3： 待签收， 4： 待他签收  [必填]
        // 点击状态切换时更改 Flag的值
        if (tab.name === '待我审批') {
          this.dispatch(FXPCGK_APPROVAL_LIST, this.querObj).then(d => {
            this.list = this.focusPerson.fxpcgkApprovalList.PageData
            this.currentTab.count = this.focusPerson.fxpcgkApprovalList.DataCount
          })
        } else {
          this.dispatch(FXPCGK_LIST, this.querObj).then(d => {
            this.list = this.focusPerson.fxpcgkList.PageData
            console.log('list', this.list)
            this.currentTab.count = this.focusPerson.fxpcgkList.DataCount
          })
        }
      },
      reloadAppTab() {
        this.dialogApproval = false
        this.list = []
        this.dispatch(FXPCGK_APPROVAL_LIST, this.querObj).then(d => {
          this.list = this.focusPerson.fxpcgkApprovalList.PageData
        })
        this.dispatch(FXPCGK_TABCOUNT, this.querObj).then(d => {
          this.tabs[0].count = this.focusPerson.fxpcgkTabcount.all
          this.tabs[1].count = this.focusPerson.fxpcgkTabcount.app
        })
        this.dispatch(FXPCGK_LIST, this.querObj)
      },
      toggleTypeList: function(type) {
        this.listType = type;
      },
      /**
       * [GetSysDictByType 批量获取字典]
       */
      GetSysDictByType() {
        if (this.screen.options[8].children.length === 0) {
          this.getRuleOrgTree('', true).then(d => {
            this.screen.options[0].children = d.map
          })
          this.getDict(['FXDJ']).then(res => {
            this.screen.options[8].children = res['FXDJ'] // 风险等级
          })
        }
      },
      /**
       * [handleOut 数据导出]
       * @return {[type]} [description]
       */
      handleOut(FocusType) {
        // console.log(FocusType, '数据导出');
        this.dataOutdialog = true
      },
      pagenavChange(obj) {
        // 分页切换操作
        this.pagenav = obj
        // 刷新列表
        this.loadData()
      },
      selectionChange(val) {
        // table内checkbox
        this.checkedSelects = val.map(value => value['id'])
      },
      repealCloseEvent() {
        this.repealDialog = false
      },
      repealInitDialog() {
        this.repealForm.ckyy = ''
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
              this.handleCate()
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
        this.switchCate()
      },
      titleName() {
        this.tabs[0].label = this.titleName
      }
    },
    mounted() {
      this.loadData()
    },
    created() {}
  }

</script>
