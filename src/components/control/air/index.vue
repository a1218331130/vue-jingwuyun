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
    <top-bar v-if="filterObject.FocusType !== ''" @call:change-type="toggleTypeList" :listType="listType" :unfoldState="unfoldT" :FocusType="filterObject.FocusType" @unfoldHandle="unfoldHandle" @handleOut="handleOut(filterObject.FocusType)" @handleDelete="handleDelete(null)"
      @handleAdd="handleAdd(filterObject.FocusType)"></top-bar>
  </div>

  <div class="app-toolbar">
    <!-- 列表操作 -->
    <div class="header-box_div">
      <el-checkbox v-model="checkAll" v-if="listType === 1 && activeName !== '待我审批'" @change="handleCheckAllChange">全选
      </el-checkbox>
      <dl class="header-handle_dl" v-if="activeName === '全部'"></dl>
      <dl class="header-handle_dl" v-if="activeName === '待我审核'">
        <dd class="color-green" @click="handleApproval(item)">
          <i class="iconfont icon-Issued "></i>审核
        </dd>
      </dl>
      <dl class="header-handle_dl" v-if="activeName === '待通过'"></dl>
      <dl class="header-handle_dl" v-if="activeName === '待我签收'">
        <dd class="color-green" @click="handleSign()">
          <i class="iconfont icon-qianshou "></i>批量签收
        </dd>
      </dl>
    </div>
  </div>
  <div class="app-content-box" v-if="listType === 1 && !nullData" :class="{active:isShowTollBar}" v-loading.body="loading">
    <!-- 列表 -->
    <el-checkbox-group v-show="listType===1" v-model="checkedSelects" @change="handleSelectChange">
      <ul class="checked-select-list">
        <li :key="item.id" v-for="(item,i) in list">
          <!-- 多选框 -->
          <el-checkbox v-if="activeName !== '待我审批'" :label="item.id" :key="item.id" @change="handleCheckSingleChange($event,item)">
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
                    <i class="iconfont icon-bianji1"></i>查看详情
                  </dd>
                  <dd class="color-orange" v-if="item.zddxzt==='0'&&item.sfsc==='0'&&item.sfzx==='0'" @click="handleUpdate(item.id,'edit')">
                    <i class="iconfont icon-bianji1"></i>信息编辑
                  </dd>
                  <dd class="color-orange" v-if="item.sfzx==='0'&&item.zddxzt==='0'" @click="handleNotUse(item,'1',dataType)">
                    <i class="iconfont icon-close"></i>注销
                  </dd>
                  <dd class="color-orange" v-if="item.sfzx==='1'&&item.zddxzt==='0'" @click="handleNotUse(item,'0',dataType)">
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
                  <dd class="color-green" v-if="item.zddxzt === '4' || item.zddxzt === '5' || item.zddxzt === '6' || item.sfzx === '1'" @click="handleDelete(item.id)">
                    <i class="iconfont icon-trash"></i>删除
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
                  <dd class="color-blue" @click="handleSign(item.id)">
                    <i class="iconfont icon-qianshou "></i>签收
                  </dd>
                </dl>
              </el-col>
            </el-row>

            <el-row :gutter="15">
              <el-col :span="22">
                <el-row>
                  <el-col :span="24" class="name-box_elcol">
                    <div v-if="item.sccjmc" class="user-info-box_elrow">
                      <label>生产厂家名称:</label>
                      <span>{{item.sccjmc}}</span>
                    </div>
                    <div v-if="item.sccjdz" class="user-info-box_elrow">
                      <label>生产厂家地址:</label>
                      <span>{{item.sccjdz}}</span>
                    </div>
                    <div v-if="item.sczk" class="user-info-box_elrow">
                      <label>目前生产情况:</label>
                      <span>{{item.sczk}}</span>
                    </div>
                    <div v-if="item.zjxymc" class="user-info-box_elrow">
                      <label>销售商名称:</label>
                      <span>{{item.zjxymc}}</span>
                    </div>
                    <div v-if="item.xssmc&&dataType==='xss'" class="user-info-box_elrow">
                      <label>销售商名称:</label>
                      <span>{{item.xssmc}}</span>
                    </div>
                    <div v-if="item.xssmc&&dataType==='pxjg'" class="user-info-box_elrow">
                      <label>培训机构名称:</label>
                      <span>{{item.xssmc}}</span>
                    </div>
                    <div v-if="item.xssmc&&dataType==='wrjahz'" class="user-info-box_elrow">
                      <label>姓名:</label>
                      <span>{{item.xssmc}}</span>
                    </div>
                    <div v-if="item.fadb&&dataType==='wrjahz'" class="user-info-box_elrow">
                      <label>参训情况:</label>
                      <span>{{item.fadb}}</span>
                    </div>
                    <div v-if="item.fasfz&&dataType==='wrjahz'" class="user-info-box_elrow">
                      <label>证件期限:</label>
                      <span>{{item.fasfz}}</span>
                    </div>
                    <div v-if="item.gsdjsj&&dataType==='wrjahz'" class="user-info-box_elrow">
                      <label>拥有无人机情况:</label>
                      <span>{{item.gsdjsj}}</span>
                    </div>
                    <div v-if="item.lxfs&&dataType==='wrjahz'" class="user-info-box_elrow">
                      <label>使用承诺情况:</label>
                      <span>{{item.lxfs}}</span>
                    </div>
                    <div v-if="item.wrjpp" class="user-info-box_elrow">
                      <label>无人机品牌:</label>
                      <span>{{item.wrjpp}}</span>
                    </div>
                    <div v-if="item.wrjxh" class="user-info-box_elrow">
                      <label>无人机型号:</label>
                      <span>{{item.wrjxh}}</span>
                    </div>
                    <div v-if="item.szdw" class="user-info-box_elrow">
                      <label>所在单位:</label>
                      <span>{{item.szdw}}</span>
                    </div>
                    <div v-if="item.xm" class="user-info-box_elrow">
                      <label>姓名:</label>
                      <span>{{item.xm}}</span>
                    </div>
                    <div v-if="item.lxdh" class="user-info-box_elrow">
                      <label>联系电话:</label>
                      <span>{{item.lxdh}}</span>
                    </div>
                    <div v-if="item.ssszmc" class="user-info-box_elrow">
                      <label>所属市州:</label>
                      <span>{{item.ssszmc}}</span>
                    </div>
                    <div v-if="item.yywrjsl" class="user-info-box_elrow">
                      <label>拥有无人机情况（台数）:</label>
                      <span>{{item.yywrjsl}}</span>
                    </div>
                    <div v-if="item.cxqk" class="user-info-box_elrow">
                      <label>参训情况:</label>
                      <span>{{item.cxqk}}</span>
                    </div>
                    <div v-if="item.zjqx" class="user-info-box_elrow">
                      <label>证件期限:</label>
                      <span>{{item.zjqx}}</span>
                    </div>
                    <div v-if="item.cnqk" class="user-info-box_elrow">
                      <label>无人机合法使用承诺情况:</label>
                      <span>{{item.cnqk}}</span>
                    </div>
                    <div v-if="item.dwsycn" class="user-info-box_elrow">
                      <label>单位无人机合法使用承诺情况:</label>
                      <span>{{item.dwsycn}}</span>
                    </div>
                    <div v-if="item.gsdjsj" class="user-info-box_elrow">
                      <label>工商登记时间:</label>
                      <span>{{item.gsdjsj}}</span>
                    </div>
                    <div v-if="item.fadb" class="user-info-box_elrow">
                      <label>法人代表:</label>
                      <span>{{item.fadb}}</span>
                    </div>
                    <div v-if="item.fasfz" class="user-info-box_elrow">
                      <label>法人身份证:</label>
                      <span>{{item.fasfz}}</span>
                    </div>
                    <div v-if="item.lxfw" class="user-info-box_elrow">
                      <label>联系方式:</label>
                      <span>{{item.lxfw}}</span>
                    </div>
                    <div v-if="item.xxdz" class="user-info-box_elrow">
                      <label>详细地址:</label>
                      <span>{{item.xxdz}}</span>
                    </div>
                    <div v-if="item.jyfw" class="user-info-box_elrow">
                      <label>经营范围:</label>
                      <span>{{item.jyfw}}</span>
                    </div>
                    <div v-if="item.sqfw" class="user-info-box_elrow">
                      <label>授权范围:</label>
                      <span>{{item.sqfw}}</span>
                    </div>
                    <div v-if="item.sqqk" class="user-info-box_elrow">
                      <label>授权情况:</label>
                      <span>{{item.sqqk}}</span>
                    </div>
                    <div v-if="item.sczk" class="user-info-box_elrow">
                      <label>截至目前生成情况（数量）:</label>
                      <span>{{item.sczk}}</span>
                    </div>
                    <div v-if="item.bz1" class="user-info-box_elrow">
                      <label>备注:</label>
                      <span>{{item.bz1}}</span>
                    </div>
                    <div v-if="item.whcdmc" class="user-info-box_elrow">
                      <label>生产厂家地址:</label>
                      <span>{{item.whcdmc}}</span>
                    </div>
                    <div v-if="item.cjrxm" class="user-info-box_elrow">
                      <label>登记人:</label>
                      <span>{{item.cjrxm}}</span>
                    </div>
                    <div v-if="item.djsj" class="user-info-box_elrow">
                      <label>登记时间:</label>
                      <span>{{item.djsj}}</span>
                    </div>
                    <div v-if="item.cjrdwmc" class="user-info-box_elrow">
                      <label>登记单位:</label>
                      <span>{{item.cjrdwmc}}</span>
                    </div>
                    <!-- <div v-if="item.sfyyh" class="user-info-box_elrow">
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
                    </div> -->
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

  <div v-show="listType===2&&dataType==='sccj'" v-loading.body="loading">
    <el-table @cell-mouse-enter="cellMouseEnter" v-loading.body="loading" :data="list" :border="true" @selection-change="selectionChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" width="50px" label="序号">
        <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
</el-table-column>
<el-table-column prop="sccjmc" label="生产厂家名称"></el-table-column>
<el-table-column prop="sccjdz" width="160" label="生产厂家地址"></el-table-column>
<el-table-column prop="ssszmc" width="70" label="所属市州"></el-table-column>
<el-table-column prop="fadb" label="法人代表"></el-table-column>
<el-table-column prop="lxfw" label="联系方式"></el-table-column>
<el-table-column prop="djr" label="登记人姓名"></el-table-column>
<el-table-column prop="djdw" label="登记单位"></el-table-column>
<!-- <el-table-column width="70"
                       label="是否排查">
        <template scope="scope">
          {{scope.row.sfpcdj === '1'? '已排查':'未排查'}}
</template>
      </el-table-column>-->
<el-table-column width="70" label="注销标识">
  <template scope="scope">
        {{scope.row.sfzx === '1'? '已注销':'正常'}}
        </template>

</el-table-column>
<el-table-column prop="zxsj" label="注销时间"></el-table-column>
<el-table-column v-if="activeName === '全部'" prop="id" label="操作" width="200px">
  <template scope="scope">
        <el-button type="text" size="small" @click="handleRecord(scope.row.id)">
          <i class="iconfont icon-chakan" title="记录"></i>
        </el-button>
        <el-button type="text" size="small" @click="handleUpdate(scope.row.id,'details')">
          <i class="iconfont icon-class" title="详情"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.zddxzt==='0' && scope.row.sfzx === '0'" @click="handleUpdate(scope.row.id,'edit')">
          <i class="iconfont icon-bianji1" title="编辑"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.zddxzt === '4' || scope.row.zddxzt === '5' || scope.row.zddxzt === '6' || scope.row.sfzx === '1'" @click="handleDel(scope.row.id)">
          <i class="iconfont icon-trash" title="删除"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='0' && scope.row.zddxzt==='0'" @click="handleNotUse(scope.row,'1','industry')">
          <i class="iconfont icon-brush_fill" title="注销"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='1' && scope.row.zddxzt==='0'" @click="handleNotUse(scope.row,'0','industry')">
          <i class="iconfont icon-brush" title="管控"></i>
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

<div v-show="listType===2&&dataType==='xss'" v-loading.body="loading">
  <el-table class="app-table table-judge" @cell-mouse-enter="cellMouseEnter" v-loading.body="loading" :data="list" :border="true" @selection-change="selectionChange">
    <el-table-column type="selection" align="center"></el-table-column>
    <el-table-column type="index" align="center" width="50px" label="序号">
      <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
    </el-table-column>
    <el-table-column prop="xssmc" label="销售商名称"></el-table-column>
    <el-table-column prop="ssszmc" width="160" label="所属市州">
    </el-table-column>
    <el-table-column prop="gsdjsj" width="70" label="工商登记时间"></el-table-column>
    <el-table-column prop="fadb" label="法人代表"></el-table-column>
    <el-table-column prop="lxfs" label="联系方式"></el-table-column>
    <el-table-column prop="xxdz" label="销售商详细地址"></el-table-column>
    <el-table-column prop="jyfw" label="经营范围"></el-table-column>
    <el-table-column prop="sczk" label="截至目前生成情况（数量）"></el-table-column>
    <el-table-column prop="bz1" label="备注"></el-table-column>
    <el-table-column prop="djr" label="登记人姓名"></el-table-column>
    <el-table-column prop="djdw" label="登记单位"></el-table-column>
    <!-- <el-table-column width="70" label="是否排查">
      <template scope="scope">
{{scope.row.sfpcdj === '1'? '已排查':'未排查'}}
</template>
    </el-table-column> -->
    <el-table-column width="70" label="注销标识">
      <template scope="scope">
        {{scope.row.sfzx === '1'? '已注销':'正常'}}
        </template>

    </el-table-column>
    <el-table-column prop="zxsj" label="注销时间"></el-table-column>
    <el-table-column v-if="activeName === '全部'" prop="id" label="操作" width="200px">
      <template scope="scope">
        <el-button type="text" size="small" @click="handleRecord(scope.row.id)">
          <i class="iconfont icon-chakan" title="记录"></i>
        </el-button>
        <el-button type="text" size="small" @click="handleUpdate(scope.row.id,'details')">
          <i class="iconfont icon-class" title="详情"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.zddxzt==='0' && scope.row.sfzx === '0'" @click="handleUpdate(scope.row.id,'edit')">
          <i class="iconfont icon-bianji1" title="编辑"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.zddxzt === '4' || scope.row.zddxzt === '5' || scope.row.zddxzt === '6' || scope.row.sfzx === '1'" @click="handleDel(scope.row.id)">
          <i class="iconfont icon-trash" title="删除"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='0' && scope.row.zddxzt==='0'" @click="handleNotUse(scope.row,'1','industry')">
          <i class="iconfont icon-brush_fill" title="注销"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='1' && scope.row.zddxzt==='0'" @click="handleNotUse(scope.row,'0','industry')">
          <i class="iconfont icon-brush" title="管控"></i>
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

<div v-show="listType===2&&dataType==='pxjg'" v-loading.body="loading">
  <el-table class="app-table table-judge" @cell-mouse-enter="cellMouseEnter" v-loading.body="loading" :data="list" :border="true" @selection-change="selectionChange">
    <el-table-column type="selection" align="center"></el-table-column>
    <el-table-column type="index" align="center" width="50px" label="序号">
      <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
    </el-table-column>
    <el-table-column prop="xssmc" label="培训机构名称 "></el-table-column>
    <el-table-column prop="ssszmc" width="160" label="所属市州">
    </el-table-column>
    <el-table-column prop="gsdjsj" width="70" label="工商登记时间"></el-table-column>
    <el-table-column prop="fadb" label="法人代表"></el-table-column>
    <el-table-column prop="lxfs" label="联系方式"></el-table-column>
    <el-table-column prop="xxdz" label="培训机构详细地址 "></el-table-column>
    <el-table-column prop="sqfw" label="授权范围 "></el-table-column>
    <el-table-column prop="sqqk" label="授权情况 "></el-table-column>
    <el-table-column prop="bz1" label="备注"></el-table-column>
    <el-table-column prop="djr" label="登记人姓名"></el-table-column>
    <el-table-column prop="djdw" label="登记单位"></el-table-column>
    <!-- <el-table-column width="70" label="是否排查">
      <template scope="scope">
{{scope.row.sfpcdj === '1'? '已排查':'未排查'}}
</template>
    </el-table-column> -->
    <el-table-column width="70" label="注销标识">
      <template scope="scope">
        {{scope.row.sfzx === '1'? '已注销':'正常'}}
        </template>

    </el-table-column>
    <el-table-column prop="zxsj" label="注销时间"></el-table-column>
    <el-table-column v-if="activeName === '全部'" prop="id" label="操作" width="200px">
      <template scope="scope">
        <el-button type="text" size="small" @click="handleRecord(scope.row.id)">
          <i class="iconfont icon-chakan" title="记录"></i>
        </el-button>
        <el-button type="text" size="small" @click="handleUpdate(scope.row.id,'details')">
          <i class="iconfont icon-class" title="详情"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.zddxzt==='0' && scope.row.sfzx === '0'" @click="handleUpdate(scope.row.id,'edit')">
          <i class="iconfont icon-bianji1" title="编辑"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.zddxzt === '4' || scope.row.zddxzt === '5' || scope.row.zddxzt === '6' || scope.row.sfzx === '1'" @click="handleDel(scope.row.id)">
          <i class="iconfont icon-trash" title="删除"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='0' && scope.row.zddxzt==='0'" @click="handleNotUse(scope.row,'1','industry')">
          <i class="iconfont icon-brush_fill" title="注销"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='1' && scope.row.zddxzt==='0'" @click="handleNotUse(scope.row,'0','industry')">
          <i class="iconfont icon-brush" title="管控"></i>
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

<div v-show="listType===2&&dataType==='wrjgl'" v-loading.body="loading">
  <el-table class="app-table table-judge" @cell-mouse-enter="cellMouseEnter" v-loading.body="loading" :data="list" :border="true" @selection-change="selectionChange">
    <el-table-column type="selection" align="center"></el-table-column>
    <el-table-column type="index" align="center" width="50px" label="序号">
      <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
    </el-table-column>
    <el-table-column prop="wrjpp" label="无人机品牌 "></el-table-column>
    <el-table-column prop="wrjxh" width="160" label="无人机型号">
    </el-table-column>
    <el-table-column prop="szdw" width="70" label="所在单位"></el-table-column>
    <el-table-column prop="xm" label="姓名"></el-table-column>
    <el-table-column prop="lxdh" label="联系电话"></el-table-column>
    <el-table-column prop="ssszmc" label="所属市州 "></el-table-column>
    <el-table-column prop="yywrjsl" label="拥有无人机情况（台数） "></el-table-column>
    <el-table-column prop="cxqk" label="参训情况 "></el-table-column>
    <el-table-column prop="zjqx" label="证件期限 "></el-table-column>
    <el-table-column prop="cnqk" label="无人机合法使用承诺情况 "></el-table-column>
    <el-table-column prop="dwsycn" label="单位无人机合法使用承诺情况 "></el-table-column>
    <el-table-column prop="bz1" label="备注"></el-table-column>
    <el-table-column prop="djr" label="登记人姓名"></el-table-column>
    <el-table-column prop="djdw" label="登记单位"></el-table-column>
    <!-- <el-table-column width="70" label="是否排查">
      <template scope="scope">
{{scope.row.sfpcdj === '1'? '已排查':'未排查'}}
</template>
    </el-table-column> -->
    <el-table-column width="70" label="注销标识">
      <template scope="scope">
        {{scope.row.sfzx === '1'? '已注销':'正常'}}
        </template>

    </el-table-column>
    <el-table-column prop="zxsj" label="注销时间"></el-table-column>
    <el-table-column v-if="activeName === '全部'" prop="id" label="操作" width="200px">
      <template scope="scope">
        <el-button type="text" size="small" @click="handleRecord(scope.row.id)">
          <i class="iconfont icon-chakan" title="记录"></i>
        </el-button>
        <el-button type="text" size="small" @click="handleUpdate(scope.row.id,'details')">
          <i class="iconfont icon-class" title="详情"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.zddxzt==='0' && scope.row.sfzx === '0'" @click="handleUpdate(scope.row.id,'edit')">
          <i class="iconfont icon-bianji1" title="编辑"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.zddxzt === '4' || scope.row.zddxzt === '5' || scope.row.zddxzt === '6' || scope.row.sfzx === '1'" @click="handleDel(scope.row.id)">
          <i class="iconfont icon-trash" title="删除"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='0' && scope.row.zddxzt==='0'" @click="handleNotUse(scope.row,'1','industry')">
          <i class="iconfont icon-brush_fill" title="注销"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='1' && scope.row.zddxzt==='0'" @click="handleNotUse(scope.row,'0','industry')">
          <i class="iconfont icon-brush" title="管控"></i>
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

<div v-show="listType===2&&dataType==='wrjahz'" v-loading.body="loading">
  <el-table class="app-table table-judge" @cell-mouse-enter="cellMouseEnter" v-loading.body="loading" :data="list" :border="true" @selection-change="selectionChange">
    <el-table-column type="selection" align="center"></el-table-column>
    <el-table-column type="index" align="center" width="50px" label="序号">
      <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
    </el-table-column>
    <el-table-column prop="xssmc" label="姓名 "></el-table-column>
    <el-table-column prop="ssszmc" width="160" label="所属市州">
    </el-table-column>
    <el-table-column prop="gsdjsj" width="70" label="拥有无人机情况（台数）"></el-table-column>
    <el-table-column prop="fadb" label="参训情况"></el-table-column>
    <el-table-column prop="fasfz" label="证件期限"></el-table-column>
    <el-table-column prop="lxfs" label="无人机合法使用承诺情况 "></el-table-column>
    <el-table-column prop="xxdz" label="备注 "></el-table-column>
    <el-table-column prop="djr" label="登记人姓名"></el-table-column>
    <el-table-column prop="djdw" label="登记单位"></el-table-column>
    <!-- <el-table-column width="70" label="是否排查">
      <template scope="scope">
{{scope.row.sfpcdj === '1'? '已排查':'未排查'}}
</template>
    </el-table-column> -->
    <el-table-column width="70" label="注销标识">
      <template scope="scope">
        {{scope.row.sfzx === '1'? '已注销':'正常'}}
        </template>

    </el-table-column>
    <el-table-column prop="zxsj" label="注销时间"></el-table-column>
    <el-table-column v-if="activeName === '全部'" prop="id" label="操作" width="200px">
      <template scope="scope">
        <el-button type="text" size="small" @click="handleRecord(scope.row.id)">
          <i class="iconfont icon-chakan" title="记录"></i>
        </el-button>
        <el-button type="text" size="small" @click="handleUpdate(scope.row.id,'details')">
          <i class="iconfont icon-class" title="详情"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.zddxzt==='0' && scope.row.sfzx === '0'" @click="handleUpdate(scope.row.id,'edit')">
          <i class="iconfont icon-bianji1" title="编辑"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.zddxzt === '4' || scope.row.zddxzt === '5' || scope.row.zddxzt === '6' || scope.row.sfzx === '1'" @click="handleDel(scope.row.id)">
          <i class="iconfont icon-trash" title="删除"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='0' && scope.row.zddxzt==='0'" @click="handleNotUse(scope.row,'1','industry')">
          <i class="iconfont icon-brush_fill" title="注销"></i>
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.sfzx==='1' && scope.row.zddxzt==='0'" @click="handleNotUse(scope.row,'0','industry')">
          <i class="iconfont icon-brush" title="管控"></i>
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
  import bus from '../../../utils/bus'
  import controlMixin from '../controlMixin'
  import '../../../utils/dateFormat'
  import infoDialogEvents from '../../../utils/infoDialogEvents'
  // import seller from '../../control/air/baseInfo/seller/index'
  import { DOWNLOAD_FILE_PATH } from '../../../config'
  import {
    UAV_MANUFACTURER_LIST,
    UAV_SELLER_LIST,
    UAV_PRODUCTION_LIST,
    UAV_HOBBYER_LIST,
    UAV_TRAINING_LIST,
    UAV_HOBBYER_DELETE,
    UAV_MANUFACTURER_DELETE,
    UAV_SELLER_DELETE,
    UAV_PRODUCTION_DELETE,
    UAV_TRAINING_DELETE,
    UAV_MANUFACTURER_APPROVALLIST,
    UAV_SELLER_APPROVALLIST,
    UAV_TRAINING_APPROVALLIST,
    UAV_HOBBYER_APPROVALLIST,
    UAV_PRODUCTION_APPROVALLIST,
    UAV_MANUFACTURER_TABCOUNT,
    UAV_SELLER_TABCOUNT,
    UAV_TRAINING_TABCOUNT,
    UAV_HOBBYER_TABCOUNT,
    UAV_PRODUCTION_TABCOUNT
  } from '../../../store/types'

  import { mapState } from 'vuex'
  import topBar from '../top-bar.vue'
  import pagination from '../../../widgets/pagination/pagination.vue'
  import handleDialog from './handle-dialog.vue'
  import sideRightBox from '../side-right-box.vue'
  import recordDialog from '../record-dialog.vue'
  import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'
  import approvalDialog from '../group/dialog/approval-dialog.vue'
  import dialogInfo from '../../../widgets/info-dialog/info-dialog'
  import dataImage from '../../../widgets/data-image/data-image'
  import dataOutdialog from './data-to-excel.vue'
  import reasonDialog from '../group/dialog/reason-dialog.vue'
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
    props: ['dataType', 'titleName'],
    data() {
      return {
        arr: [],
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
          label: '生产厂家',
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
       * [searchDtat 搜索查询列表]
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
          url, res, url1, res1
        this.loading = true
        if (currentTab.name === '全部') {
          switch (this.dataType) {
            case 'xss':
              url = UAV_SELLER_LIST
              url1 = UAV_SELLER_TABCOUNT
              res = 'uavSellerList'
              res1 = 'uavSellerTabcount'
              break;
            case 'pxjg':
              url = UAV_TRAINING_LIST
              url1 = UAV_TRAINING_TABCOUNT
              res = 'uavTrainingList'
              res1 = 'uavTrainingTabcount'
              break;
            case 'wrjahz':
              url = UAV_HOBBYER_LIST
              url1 = UAV_HOBBYER_TABCOUNT
              res = 'uavHobbyerList'
              res1 = 'uavHobbyerTabcount'
              break;
            case 'wrjgl':
              url = UAV_PRODUCTION_LIST
              url1 = UAV_PRODUCTION_TABCOUNT
              res = 'uavProductionList'
              res1 = 'uavProductionTabcount'
              break;
            case 'sccj':
              url = UAV_MANUFACTURER_LIST
              url1 = UAV_MANUFACTURER_TABCOUNT
              res = 'uavManufacturerList'
              res1 = 'uavManufacturerTabcount'
              this.filterObject.Flag = 0
              break;
          }
        } else {
          switch (this.dataType) {
            case 'xss':
              url = UAV_SELLER_APPROVALLIST
              url1 = UAV_SELLER_TABCOUNT
              res = 'uavSellerApprovallist'
              res1 = 'uavSellerTabcount'
              break;
            case 'pxjg':
              url = UAV_TRAINING_APPROVALLIST
              url1 = UAV_TRAINING_TABCOUNT
              res = 'uavTrainingApprovallist'
              res1 = 'uavTrainingTabcount'
              break;
            case 'wrjahz':
              url = UAV_HOBBYER_APPROVALLIST
              url1 = UAV_HOBBYER_TABCOUNT
              res = 'uavHobbyerApprovallist'
              res1 = 'uavHobbyerTabcount'
              break;
            case 'wrjgl':
              url = UAV_PRODUCTION_APPROVALLIST
              url1 = UAV_PRODUCTION_TABCOUNT
              res = 'uavProductionApprovallist'
              res1 = 'uavProductionTabcount'
              break;
            case 'sccj':
              url = UAV_MANUFACTURER_APPROVALLIST
              url1 = UAV_MANUFACTURER_TABCOUNT
              res = 'uavManufacturerApprovallist'
              res1 = 'uavManufacturerTabcount'
              this.filterObject.Flag = 0;
              break;
          }
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
            self.tabs[1].count = self.focusPerson[res].DataCount || 0
          }
        })
        this.dispatch(url1, this.querObj).then(d => {
          this.tabs[0].count = this.focusPerson[res1].all
          this.tabs[1].count = this.focusPerson[res1].app
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
        switch (this.dataType) {
          case 'xss':
            url = UAV_SELLER_LIST
            url1 = UAV_SELLER_TABCOUNT
            res = 'uavSellerList'
            res1 = 'uavSellerTabcount'
            break;
          case 'pxjg':
            url = UAV_TRAINING_LIST
            url1 = UAV_TRAINING_TABCOUNT
            res = 'uavTrainingList'
            res1 = 'uavTrainingTabcount'
            break;
          case 'wrjahz':
            url = UAV_HOBBYER_LIST
            url1 = UAV_HOBBYER_TABCOUNT
            res = 'uavHobbyerList'
            res1 = 'uavHobbyerTabcount'
            break;
          case 'wrjgl':
            url = UAV_PRODUCTION_LIST
            url1 = UAV_PRODUCTION_TABCOUNT
            res = 'uavProductionList'
            res1 = 'uavProductionTabcount'
            break;
          case 'sccj':
            url = UAV_MANUFACTURER_LIST
            url1 = UAV_MANUFACTURER_TABCOUNT
            res = 'uavManufacturerList'
            res1 = 'uavManufacturerTabcount'
            break;
        }
        // 加载列表
        this.plugLoading = 'noLoading' // 外挂状态更改需制空
        currentTab.parentId = this.parentId
        this.dispatch(url, this.querObj).then(d => {
          this.$emit('update-loading', false)
          this.updateRecord(currentTab, url, res)
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
      },
      reloadAppTab() {
        let url, url1, url2, res, res1
        switch (this.dataType) {
          case 'xss':
            url = UAV_SELLER_APPROVALLIST
            url1 = UAV_SELLER_TABCOUNT
            url2 = UAV_SELLER_LIST
            res = 'uavSellerApprovallist'
            res1 = 'uavSellerTabcount'
            break;
          case 'pxjg':
            url = UAV_TRAINING_APPROVALLIST
            url1 = UAV_TRAINING_TABCOUNT
            url2 = UAV_TRAINING_LIST
            res = 'uavTrainingApprovallist'
            res1 = 'uavTrainingTabcount'
            break;
          case 'wrjahz':
            url = UAV_HOBBYER_APPROVALLIST
            url1 = UAV_HOBBYER_TABCOUNT
            url2 = UAV_HOBBYER_LIST
            res = 'uavHobbyerApprovallist'
            res1 = 'uavHobbyerTabcount'
            break;
          case 'wrjgl':
            url = UAV_PRODUCTION_APPROVALLIST
            url1 = UAV_PRODUCTION_TABCOUNT
            url2 = UAV_PRODUCTION_LIST
            res = 'uavProductionApprovallist'
            res1 = 'uavProductionTabcount'
            break;
          case 'sccj':
            url = UAV_MANUFACTURER_APPROVALLIST
            url1 = UAV_MANUFACTURER_TABCOUNT
            url2 = UAV_MANUFACTURER_LIST
            res = 'uavManufacturerApprovallist'
            res1 = 'uavManufacturerTabcount'
            break;
        }
        this.dialogApproval = false
        this.list = []
        this.dispatch(url, this.querObj).then(d => {
          this.list = this.focusPerson[res].PageData
        })
        this.dispatch(url1, this.querObj).then(d => {
          this.tabs[0].count = this.focusPerson[res1].all
          this.tabs[1].count = this.focusPerson[res1].app
        })
        this.dispatch(url2, this.querObj)
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
       * @param  {[type]} id
       * @param  {[type]} sfzx
       * @return {[type]}    [description]
       */
      handleNotUse(item, sfzx, type) {
        this.$refs.reasonDialog.handleNotUse(item, sfzx, type)
      },
      /**
       * [handleUpdate 编辑操作]
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
          switch (this.dataType) {
            case 'sccj':
              this.dispatch(UAV_MANUFACTURER_APPROVALLIST, this.querObj).then(d => {
                this.list = this.focusPerson.uavManufacturerApprovallist.PageData
                this.currentTab.count = this.focusPerson.uavManufacturerApprovallist.DataCount
              })
              break
            case 'xss':
              this.dispatch(UAV_SELLER_APPROVALLIST, this.querObj).then(d => {
                this.list = this.focusPerson.uavSellerApprovallist.PageData
                this.currentTab.count = this.focusPerson.uavSellerApprovallist.DataCount
              })
              break
            case 'pxjg':
              this.dispatch(UAV_TRAINING_APPROVALLIST, this.querObj).then(d => {
                this.list = this.focusPerson.uavTrainingApprovallist.PageData
                this.currentTab.count = this.focusPerson.uavTrainingApprovallist.DataCount
              })
              break
            case 'wrjahz':
              this.dispatch(UAV_HOBBYER_APPROVALLIST, this.querObj).then(d => {
                this.list = this.focusPerson.uavHobbyerApprovallist.PageData
                this.currentTab.count = this.focusPerson.uavHobbyerApprovallist.DataCount
              })
              break
            case 'wrjgl':
              this.dispatch(UAV_PRODUCTION_APPROVALLIST, this.querObj).then(d => {
                this.list = this.focusPerson.uavProductionApprovallist.PageData
                this.currentTab.count = this.focusPerson.uavProductionApprovallist.DataCount
              })
              break
          }
        } else {
          switch (tab.label) {
            case '生产厂家':
              this.dispatch(UAV_MANUFACTURER_LIST, this.querObj).then(d => {
                this.list = this.focusPerson.uavManufacturerList.PageData
                this.currentTab.count = this.focusPerson.uavManufacturerList.DataCount
              })
              break
            case '销售商':
              this.dispatch(UAV_SELLER_LIST, this.querObj).then(d => {
                this.list = this.focusPerson.uavSellerList.PageData
                this.currentTab.count = this.focusPerson.uavSellerList.DataCount
              })
              break
            case '培训机构':
              this.dispatch(UAV_TRAINING_LIST, this.querObj).then(d => {
                this.list = this.focusPerson.uavTrainingList.PageData
                this.currentTab.count = this.focusPerson.uavTrainingList.DataCount
              })
              break
            case '无人机爱好者':
              this.dispatch(UAV_HOBBYER_LIST, this.querObj).then(d => {
                this.list = this.focusPerson.uavHobbyerList.PageData
                this.currentTab.count = this.focusPerson.uavHobbyerList.DataCount
              })
              break
            case '无人机管理':
              this.dispatch(UAV_PRODUCTION_LIST, this.querObj).then(d => {
                this.list = this.focusPerson.uavProductionList.PageData
                this.currentTab.count = this.focusPerson.uavProductionList.DataCount
              })
              break
          }
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
       * [handleDelete 删除]
       * @param  {[type]} type  [类型]
       * @param  {[type]} KeyId [数据ID]
       * @return {[type]}       [description]
       */
      handleDelete(KeyId) {
        this.arr = []
        if (this.dataType === 'sccj') {
          if (KeyId) {
            this.$confirm('确定要删除该信息', '温馨提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.dispatch(UAV_MANUFACTURER_DELETE, { ids: KeyId, zdcslx: this.filterObject.FocusType }).then(d => {
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
              this.list.filter(d => { if (d.sfzx === '1') this.arr.push(d.id) })
              if (this.arr.sort().toString() === this.checkedSelects.sort().toString()) {
                this.dispatch(UAV_MANUFACTURER_DELETE, { ids: this.checkedSelects.join(','), zdcslx: this.filterObject.FocusType }).then(d => {
                  this.$message('删除成功!')
                  this.handleCate()
                }).catch(() => {});
              } else {
                this.$message('勾选项有未注销项,请重新勾选! ^^')
                return false
              }
            })
          } else {
            this.$message({ message: '请选择至少一条操作数据!', type: 'warning' })
          }
        } else if (this.dataType === 'xss') {
          if (KeyId) {
            this.$confirm('确定要删除该信息', '温馨提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.dispatch(UAV_SELLER_DELETE, { ids: KeyId, zdcslx: this.filterObject.FocusType }).then(d => {
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
              this.list.filter(d => { if (d.sfzx === '1') this.arr.push(d.id) })
              if (this.arr.sort().toString() === this.checkedSelects.sort().toString()) {
                this.dispatch(UAV_SELLER_DELETE, { ids: this.checkedSelects.join(','), zdcslx: this.filterObject.FocusType }).then(d => {
                  this.$message('删除成功!')
                  this.handleCate()
                }).catch(() => {});
              } else {
                this.$message('勾选项有未注销项,请重新勾选! ^^')
                return false
              }
            })
          } else {
            this.$message({ message: '请选择至少一条操作数据!', type: 'warning' })
          }
        } else if (this.dataType === 'pxjg') {
          if (KeyId) {
            this.$confirm('确定要删除该信息', '温馨提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.dispatch(UAV_TRAINING_DELETE, { ids: KeyId, zdcslx: this.filterObject.FocusType }).then(d => {
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
              this.list.filter(d => { if (d.sfzx === '1') this.arr.push(d.id) })
              if (this.arr.sort().toString() === this.checkedSelects.sort().toString()) {
                this.dispatch(UAV_TRAINING_DELETE, { ids: this.checkedSelects.join(','), zdcslx: this.filterObject.FocusType }).then(d => {
                  this.$message('删除成功!')
                  this.handleCate()
                }).catch(() => {});
              } else {
                this.$message('勾选项有未注销项,请重新勾选! ^^')
                return false
              }
            })
          } else {
            this.$message({ message: '请选择至少一条操作数据!', type: 'warning' })
          }
        } else if (this.dataType === 'wrjgl') {
          if (KeyId) {
            this.$confirm('确定要删除该信息', '温馨提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.dispatch(UAV_PRODUCTION_DELETE, { ids: KeyId, zdcslx: this.filterObject.FocusType }).then(d => {
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
              this.list.filter(d => { if (d.sfzx === '1') this.arr.push(d.id) })
              if (this.arr.sort().toString() === this.checkedSelects.sort().toString()) {
                this.dispatch(UAV_PRODUCTION_DELETE, { ids: this.checkedSelects.join(','), zdcslx: this.filterObject.FocusType }).then(d => {
                  this.$message('删除成功!')
                  this.handleCate()
                }).catch(() => {});
              } else {
                this.$message('勾选项有未注销项,请重新勾选! ^^')
                return false
              }
            })
          } else {
            this.$message({ message: '请选择至少一条操作数据!', type: 'warning' })
          }
        } else if (this.dataType === 'wrjahz') {
          if (KeyId) {
            this.$confirm('确定要删除该信息', '温馨提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.dispatch(UAV_HOBBYER_DELETE, { ids: KeyId, zdcslx: this.filterObject.FocusType }).then(d => {
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
              this.list.filter(d => { if (d.sfzx === '1') this.arr.push(d.id) })
              if (this.arr.sort().toString() === this.checkedSelects.sort().toString()) {
                this.dispatch(UAV_HOBBYER_DELETE, { ids: this.checkedSelects.join(','), zdcslx: this.filterObject.FocusType }).then(d => {
                  this.$message('删除成功!')
                  this.handleCate()
                }).catch(() => {});
              } else {
                this.$message('勾选项有未注销项,请重新勾选! ^^')
                return false
              }
            })
          } else {
            this.$message({ message: '请选择至少一条操作数据!', type: 'warning' })
          }
        }
      },
      /**
       * [handleOut 数据导出]
       * @return {[type]} [description]
       */
      handleOut(FocusType) {
        this.dataOutdialog = true
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
