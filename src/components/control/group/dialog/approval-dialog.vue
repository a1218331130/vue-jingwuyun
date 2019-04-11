<template>
<div>

  <el-dialog v-draggable="dialogDraggableOptions" title="审批" :visible.sync="dialogApproval" size="bigest" :modal-append-to-body="true" :append-to-body="true" @open="initDialog" :modal="false" :close-on-click-modal="false" :before-close="closeEvent">
    <div class="detail-box__title" style="margin-left:10px">{{this.title}}</div>
    <div class="detail-box__step-box">
      <el-row>
        <el-col :span="24">
          <el-steps v-if="list.length>0" :space="190" :active="list[list.length-1].handler===''?list.length-1:list.length" finish-status="success">
            <el-step v-for="item in list" :key="item.id" :title="item.title+'-'+(list[list.length-1].handler===''?'待处理':item.handler)" :description="item.sendTime"></el-step>
            <!-- <el-step title="评论"></el-step> -->
          </el-steps>
        </el-col>
      </el-row>
    </div>
    <div style="background: #fff;padding: 10px;">
      <el-form :model="approvalForm" :rules="rules" ref="approvalForm" label-width="100px">
        <div class="detail-box__title" v-if="formData.spzt">基本信息
          <el-tag type="warning" size="medium" v-if="formData.spzt==='2'">新增</el-tag>
          <el-tag type="success" size="medium" v-if="formData.spzt==='0'">已审批</el-tag>
          <el-tag type="danger" size="medium" v-if="formData.spzt==='1'">注销</el-tag>
          <el-tag type="warning" size="medium" v-if="formData.spzt==='5'">重新管控</el-tag>
        </div>
        <div class="detail-box__title" v-if="formData.zdcszt">基本信息
          <el-tag type="warning" size="medium" v-if="formData.zdcszt==='2'">注销</el-tag>
          <el-tag type="success" size="medium" v-if="formData.zdcszt==='0'">已审批</el-tag>
          <el-tag type="danger" size="medium" v-if="formData.zdcszt==='1'">新增</el-tag>
          <el-tag type="warning" size="medium" v-if="formData.zdcszt==='3'">重新管控</el-tag>
        </div>
        <div class="detail-box__title" v-if="formData.zddxzt">基本信息
          <el-tag type="warning" size="medium" v-if="formData.zddxzt==='2'">注销</el-tag>
          <el-tag type="success" size="medium" v-if="formData.zddxzt==='0'">已审批</el-tag>
          <el-tag type="danger" size="medium" v-if="formData.zddxzt==='1'">新增</el-tag>
          <el-tag type="warning" size="medium" v-if="formData.zddxzt==='3'">重新管控</el-tag>
        </div>
        <el-row :gutter="10" v-if="formData.sfz">
          <el-col :span="12" style="max-width: 90px">
            <el-form-item label="">
              <div>
                <data-image style="max-width: 90px;max-height:120px" :idCard="formData.sfz"></data-image>
                <!-- <img v-if="item.PhotosId!==null" :src="picUrl+item.PhotosId" />
                  <img v-if="item.PhotosId===null" src="/static/img/testPersonImg.jpg" /> -->
                <!-- <el-tag type="warning" size="medium" v-if="formData.spzt==='2'">新增重点人员</el-tag>
                <el-tag type="success" size="medium" v-if="formData.spzt==='0'">已审批</el-tag>
                <el-tag type="danger" size="medium" v-if="formData.spzt==='1'">注销重点人员</el-tag>
                <el-tag type="warning" size="medium" v-if="formData.spzt==='5'">重新管控重点人员</el-tag> -->
              </div>
              <!-- <el-button type="primary" @click="handleUpdate(formData.id,'look',false)">查看详情</el-button> -->
            </el-form-item>
          </el-col>


          <!--  这里的分类标签怎么处理样式  -->
          <!-- <el-col :span="12" style="margin-left:500px">
            <el-tag type="warning" v-if="formData.spzt==='2'">新增重点人员</el-tag>
            <el-tag type="warning" v-if="formData.spzt==='0'">已审批</el-tag>
            <el-tag type="danger" v-if="formData.spzt==='1'">注销重点人员</el-tag>
            <el-tag type="warning" v-if="formData.spzt==='5'">重新管控重点人员</el-tag>
          </el-col> -->
        </el-row>
        <!-- 重点人群 -->
        <el-row :gutter="10" v-if="formData.rqlbmc">
          <el-col :span="12">
            <el-form-item label="姓名">
              {{formData.xm}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号">
              {{formData.sfz}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话">
              {{formData.lxdh}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              {{formData.xbmc}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="民族">
              {{formData.mzmc}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人群类别">
              {{formData.rqlbmc}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国籍">
              {{formData.gjmc}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="政治面貌">
              {{formData.zzmmmc}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="宗教信仰">
              {{formData.zjxymc}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文化程度">
              {{formData.whcdmc}}
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="审批类型">
              <span v-if="formData.spzt==='2'" style="color:red">新增</span>
              <span v-if="formData.spzt==='1'" style="color:red">注销</span>
              <span v-if="formData.spzt==='5'" style="color:red">启用</span>
            </el-form-item>
          </el-col> -->
        </el-row>
        <!-- 重点场所 -->
        <el-row v-if="formData.zdcslxmc" :gutter="10">
          <el-col :span="12">
            <el-form-item label="场所名称">
              {{formData.csmc || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场所类别">
              {{formData.zdcslxmc || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场所经纬度" v-if="formData.csjd || formData.cdwd">
              {{formData.csjd}} - {{formData.cdwd}}
            </el-form-item>
            <el-form-item label="场所经纬度" v-else>
              无
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场所电话">
              {{formData.csdh || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址">
              {{formData.csdz || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场所负责人">
              {{formData.dwfzrxm || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任人职位">
              {{formData.aqzrrzwmc || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任人身份证">
              {{formData.dwfzrsfz || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安全责任单位">
              {{formData.aqzrdwmc || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安全责任人">
              {{formData.aqzrrxm || '无'}}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 重点行业 -->
        <el-row v-if="formData.zdhylbmc" :gutter="10">
          <el-col :span="12">
            <el-form-item label="行业名称">
              {{formData.zdhymc || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行业类别">
              {{formData.zdhylbmc || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场所经纬度" v-if="formData.csjd || formData.cdwd">
              {{formData.csjd}} - {{formData.cdwd}}
            </el-form-item>
            <el-form-item label="场所经纬度" v-else>
              无
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话">
              {{formData.hydh || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址">
              {{formData.xxdz || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              {{formData.bz || '无'}}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 重点车辆 -->
        <el-row v-if="formData.cllxmc" :gutter="10">
          <el-col :span="12">
            <el-form-item label="车牌号码">
              {{formData.cphm || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆类型">
              {{formData.cllxmc || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管辖单位">
              {{formData.gxdwmc || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              {{formData.bz || '无'}}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 无人机-生产厂家 -->
        <el-row v-if="formData.wrjlxmc === '生产厂家'" :gutter="10">
          <el-col :span="12">
            <el-form-item label="生产厂家名称">
              {{formData.sccjmc || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产厂家地址">
              {{formData.sccjdz || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工商登记日期">
              {{formData.gsdjsj || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人代表">
              {{formData.fadb || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式">
              {{formData.lxfw || '无'}}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 无人机-销售商 -->
        <el-row v-if="formData.wrjlxmc === '销售商'" :gutter="10">
          <el-col :span="12">
            <el-form-item label="销售商名称">
              {{formData.xssmc || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售商地址">
              {{formData.xxdz || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工商登记日期">
              {{formData.xgsj || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人代表">
              {{formData.fadb || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式">
              {{formData.lxfs || '无'}}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 无人机-培训机构 -->
        <el-row v-if="formData.wrjlxmc === '培训机构'" :gutter="10">
          <el-col :span="12">
            <el-form-item label="培训机构名称">
              {{formData.xssmc || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培训机构地址">
              {{formData.xxdz || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工商登记日期">
              {{formData.xgsj || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人代表">
              {{formData.fadb || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式">
              {{formData.lxfs || '无'}}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 无人机-爱好者 -->
        <el-row v-if="formData.wrjlxmc === '无人机爱好者'" :gutter="10">
          <el-col :span="12">
            <el-form-item label="姓名">
              {{formData.xssmc || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式">
              {{formData.lxfs || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件期限">
              {{formData.fasfz || '无'}}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 无人机-管理 -->
        <el-row v-if="formData.wrjlxmc === '无人机管理'" :gutter="10">
          <el-col :span="12">
            <el-form-item label="无人机品牌">
              {{formData.wrjpp || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="无人机型号">
              {{formData.wrjxh || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="持有人姓名">
              {{formData.xm || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在单位">
              {{formData.szdw || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话">
              {{formData.lxdh || '无'}}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 重点线索管理 -->
        <el-row v-if="formData.xxgl" :gutter="10">
          <el-col :span="12">
            <el-form-item label="标题">
              {{formData.bt || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="针对主体">
              {{formData.zdztmc || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="信息来源">
              {{formData.xxlymc || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="信息真实性">
              {{formData.xxzsxmc || '无'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="信息种类">
              {{formData.xxzlmc || '无'}}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 申请信息 -->
        <div class="detail-box__title">申请信息</div>
        <el-row>
          <el-col :span="24">
            <el-form-item label="申请人">
              {{formData.xgrxm||formData.cjrxm?formData.xgrxm||formData.cjrxm:'无'}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="申请时间">
              {{formData.xgsj||formData.cjsj?formData.xgsj||formData.cjsj:'无'}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="申请原因">
              {{formData.gkyy?formData.gkyy:'无'}}
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="申请理由">

          </el-form-item>
        </el-col>
      </el-row> -->
        <!-- <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="审批情况" prop="HandleOpinion">
            <el-radio-group v-model="approvalForm.HandleOpinion">
              <el-radio label="TY">同意</el-radio>
              <el-radio label="BTY">不同意</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="审批意见" prop="Note">
            <el-input type="textarea" :maxlength="500" placeholder="限制500个字符" v-model="approvalForm.Note"></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      </el-form>
    </div>

    <div class="detail-box__title" style="margin-left:15px">流程明细</div>
    <el-table @cell-mouse-enter="cellMouseEnter" style="margin:20px" :data="list" border>
      <el-table-column label="序号" prop="id" width="80"></el-table-column>
      <el-table-column label="步骤名称" prop="title" width="100"></el-table-column>
      <!--<el-table-column label="发送人" prop="sender" width="80"></el-table-column>-->
      <el-table-column label="发送时间" prop="sendTime" width="200"></el-table-column>
      <el-table-column label="处理人" prop="handler" width="80"></el-table-column>
      <el-table-column label="处理时间" prop="handleTime" width="200"></el-table-column>
      <el-table-column label="状态" prop="state" width="80"></el-table-column>
      <el-table-column label="意见" prop="opinion"></el-table-column>
    </el-table>

    <!-- <div slot="footer" class="dialog-footer">
    <el-button @click="closeEvent">取 消</el-button>
    <el-button type="primary" @click="submitForm('approvalForm')">确定</el-button>
  </div> -->
    <div v-if="showSign" :class="{'ctrl-box':true,'ctrl-box--m':showCtrl===true}" style="margin-top:50px">
      <el-button type="text" class="btn-switch" @click="switchCtrl"><i :class="{iconfont:true, 'icon-unfold1':showCtrl === true,  'icon-packup-2':showCtrl === false}"></i>
      </el-button>
      <div class="ctrl-box__content">
        <sign :lcid="formData.lcid" ref='sign' @close='submitForm'></sign>
      </div>
    </div>
  </el-dialog>
  <!-- <handle-dialog ref="handleDialog"></handle-dialog> -->
</div>
<!-- 数据操作弹窗_人员信息 -->
</template>

<style lang="scss" scoped>
  .el-dialog__body {
    padding: 0;
  }

  .detail-box {
    height: calc(65vh - 30px);
    padding: 0 15px;
    overflow-y: auto;
    &--m {
      height: calc(40vh - 30px);
    }
    &__step-box {
      width: 850px;
      margin: 0 auto 20px;
      overflow: hidden;
    }
    &__title {
      font-size: 16px;
      color: #46bdfd;
      height: 38px;
      line-height: 38px;
      margin-bottom: 10px;
      border-bottom: 2px solid #4db8ff;
      position: relative;
    }
  }

  .el-tab-pane {
    padding-top: 10px;
  }

  .ctrl-box {
    background: #F8F8F8;
    width: 100%;
    height: 1px;
    border-top: 1px solid #ccc;
    position: relative; // transition: 0.3s;
    &--m {
      height: calc(25vh - 30px);
    }
    &__content {
      width: 100%;
      height: 135%; // min-height: 215px;
      overflow: hidden;
    }
    .btn-switch {
      background: #fff;
      text-align: center;
      width: 80px;
      height: 30px;
      line-height: 30px;
      padding: 0;
      border: 1px solid #ccc;
      border-bottom: 0;
      border-radius: 5px 5px 0 0;
      cursor: pointer;
      opacity: 0.8;
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      &:hover {
        opacity: 1;
      }
      .iconfont {
        margin: 0;
      }
    }
  }

  .car-box {
    height: auto;
  }

  .person-box {
    height: auto;
  }

  .el-tabs {
    margin-bottom: 0;
  }

  .el-form-item .el-form-item {
    margin-bottom: 0;
    margin-top: 5px;
  } // element.style {
  //     margin-left: 0;
  // }
  .features-dispatchd {
    margin-left: -25px;
  }

</style>
<script>
  import mixin from '../../../../utils/mixin'
  import { clone } from '../../../../utils/util'
  import dataImage from '../../../../widgets/data-image/data-image'
  import { FXPCGK_INFO, GET_PROCESS_DETAIL, GET_PROCESS_INFO, FXPCGK_BASEPLACE_INFO, FXPCGK_INDORG_INFO, FXPCGK_CASECAR_INFO, UAV_MANUFACTURER_INFO, UAV_SELLER_INFO, UAV_TRAINING_INFO, UAV_HOBBYER_INFO, UAV_PRODUCTION_INFO, FXPCGK_CLUE_INFO } from '../../../../store/types'
  import { mapState } from 'vuex'
  import sign from './sign.vue'
  export default {
    mixins: [mixin],
    components: {
      sign,
      // handleDialog,
      'data-image': dataImage
    },
    data() {
      return {
        FocusType: 1,
        showCtrl: true,
        showSign: true,
        formData: {},
        list: [],
        dictList: [],
        title: '',
        approvalForm: {
          RyName: '',
          idcard: '',
          OwnerName: '',
          PlateNo: '',
          HandleOpinion: 'TY',
          Lczbid: '',
          Note: ''
        },
        rules: {
          HandleOpinion: [
            { required: true, message: '选择是否同意', trigger: 'change' }
          ],
          Note: [
            { required: true, message: '请输入审批意见', trigger: 'change' }
          ]
        }
      }
    },
    props: ['dialogApproval', 'object', 'size'],
    methods: {
      /**
       *初始化编辑窗口
       * @return {[type]} [description]
       */
      initDialog() {
        console.log(this.object, 'object');
        let lczbid = ''
        if (this.object.rqlbmc || this.object.Type === '5' || this.object.Type === '11' || this.object.Type === '12') {
          this.dispatch(FXPCGK_INFO, { id: this.object.id }).then(() => {
            this.formData = this.focusPerson.fxpcgkInfo
            lczbid = this.focusPerson.fxpcgkInfo.lcid
            this.getLcInfo(lczbid)
          })
        } else if (this.object.zdcslxmc || this.object.Type === '13' || this.object.Type === '14' || this.object.Type === '15') {
          this.dispatch(FXPCGK_BASEPLACE_INFO, { id: this.object.id }).then(() => {
            this.formData = this.focusPerson.fxpcgkBaseplaceInfo
            this.formData.lcid = this.focusPerson.fxpcgkBaseplaceInfo.zxlcid
            lczbid = this.focusPerson.fxpcgkBaseplaceInfo.zxlcid
            this.getLcInfo(lczbid)
          })
        } else if (this.object.zdhylbmc || this.object.Type === '16' || this.object.Type === '17' || this.object.Type === '18') {
          this.dispatch(FXPCGK_INDORG_INFO, { id: this.object.id, zdhylb: this.object.zdhylb }).then(() => {
            this.formData = this.focusOrg.fxpcgkIndorgInfo
            this.formData.lcid = this.focusOrg.fxpcgkIndorgInfo.zxlcid
            lczbid = this.focusOrg.fxpcgkIndorgInfo.zxlcid
            this.getLcInfo(lczbid)
          })
        } else if (this.object.cllxmc || this.object.Type === '19' || this.object.Type === '20' || this.object.Type === '21') {
          this.dispatch(FXPCGK_CASECAR_INFO, { id: this.object.id }).then(() => {
            this.formData = this.focusCar.fxpcgkCasecarInfo
            this.formData.lcid = this.focusCar.fxpcgkCasecarInfo.zxlcid
            lczbid = this.focusCar.fxpcgkCasecarInfo.zxlcid
            this.getLcInfo(lczbid)
          })
        } else if (this.object.wrjlxmc || this.object.Type) {
          if (this.object.wrjlxmc === '生产厂家' || this.object.Type === '22' || this.object.Type === '23' || this.object.Type === '24') {
            this.dispatch(UAV_MANUFACTURER_INFO, { id: this.object.id }).then(() => {
              this.formData = this.focusPerson.uavManufacturerInfo
              this.formData.lcid = this.focusPerson.uavManufacturerInfo.zxlcid
              lczbid = this.focusPerson.uavManufacturerInfo.zxlcid
              this.getLcInfo(lczbid)
            })
          } else if (this.object.wrjlxmc === '销售商' || this.object.Type === '25' || this.object.Type === '26' || this.object.Type === '27') {
            this.dispatch(UAV_SELLER_INFO, { id: this.object.id }).then(() => {
              this.formData = this.focusPerson.uavSellerInfo
              this.formData.lcid = this.focusPerson.uavSellerInfo.zxlcid
              lczbid = this.focusPerson.uavSellerInfo.zxlcid
              this.getLcInfo(lczbid)
            })
          } else if (this.object.wrjlxmc === '培训机构' || this.object.Type === '28' || this.object.Type === '29' || this.object.Type === '30') {
            this.dispatch(UAV_TRAINING_INFO, { id: this.object.id }).then(() => {
              this.formData = this.focusPerson.uavTrainingInfo
              this.formData.lcid = this.focusPerson.uavTrainingInfo.zxlcid
              lczbid = this.focusPerson.uavTrainingInfo.zxlcid
              this.getLcInfo(lczbid)
            })
          } else if (this.object.wrjlxmc === '无人机爱好者' || this.object.Type === '31' || this.object.Type === '32' || this.object.Type === '33') {
            this.dispatch(UAV_HOBBYER_INFO, { id: this.object.id }).then(() => {
              this.formData = this.focusPerson.uavHobbyerInfo
              this.formData.lcid = this.focusPerson.uavHobbyerInfo.zxlcid
              lczbid = this.focusPerson.uavHobbyerInfo.zxlcid
              this.getLcInfo(lczbid)
            })
          } else if (this.object.wrjlxmc === '无人机管理' || this.object.Type === '34' || this.object.Type === '35' || this.object.Type === '36') {
            this.dispatch(UAV_PRODUCTION_INFO, { id: this.object.id }).then(() => {
              this.formData = this.focusPerson.uavProductionInfo
              this.formData.lcid = this.focusPerson.uavProductionInfo.zxlcid
              lczbid = this.focusPerson.uavProductionInfo.zxlcid
              this.getLcInfo(lczbid)
            })
          }
        } else if (this.object.Type === '37' || this.object.Type === '38' || this.object.Type === '39') {
          this.dispatch(FXPCGK_CLUE_INFO, { id: this.object.id }).then(() => {
            this.formData = clone(this.focusPerson.fxpcgkClueInfo)
            this.$set(this.formData, 'xxgl', '线索管理')
            this.formData.lcid = this.focusPerson.fxpcgkClueInfo.zxlcid
            lczbid = this.focusPerson.fxpcgkClueInfo.zxlcid
            this.getLcInfo(lczbid)
          })
        } else {
          this.dispatch(FXPCGK_CLUE_INFO, { id: this.object.id }).then(() => {
            this.formData = clone(this.focusPerson.fxpcgkClueInfo)
            this.$set(this.formData, 'xxgl', '线索管理')
            this.formData.lcid = this.focusPerson.fxpcgkClueInfo.zxlcid
            lczbid = this.focusPerson.fxpcgkClueInfo.zxlcid
            this.getLcInfo(lczbid)
          })
        }
      },
      getLcInfo(lczbid) {
        this.dispatch(GET_PROCESS_INFO, { Lczbid: lczbid }).then(d => {
          this.title = this.processBus.GetProcessInfo.ApplyTitle
        })
        if (this.object.Sfz) {
          this.FocusType = 1
        } else {
          this.FocusType = 2
        }

        if (this.formData.lcid != null) {
          this.dispatch(GET_PROCESS_DETAIL, {
            Lczbid: this.formData.lcid
          }).then(() => {
            let i = 0;
            this.list = this.process.processDetail.map(d => {
              i++;
              return {
                id: i,
                title: d.FromNodeName,
                // sender: '我', 2017-10-14 xiehuan 不要发送人栏位了
                sendTime: d.SendTime,
                handler: d.HandlerName,
                handleTime: d.HandleTime,
                state: this.getGjState(d.State),
                opinion: d.HandleNote,
                ToNodeName: d.ToNodeName
              }
            })
            this.showSign = this.list[this.list.length - 1].state !== '同意' && this.list[this.list.length - 1].state !== '不同意'
          })
        }
      },
      getGjState(v) {
        return this.dictList.LC_CLZT.find(d => d.value === v).label
      },
      switchCtrl() {
        this.showCtrl = this.showCtrl === false
      },
      /**
       * 重置表单
       */
      reset() {
        if (this.$refs['approvalForm']) {
          this.$refs['approvalForm'].resetFields()
        }
      },
      /**
       * 编辑窗关闭事件
       * @return {[type]} [description]
       */
      closeEvent() {
        this.reset()
        this.$emit('close')
      },
      handleUpdate(id, activeName, disabled) {
        this.$refs.handleDialog.updatePeopleData(id, activeName, disabled)
        // bus.$emit('control.updateHandlePeople' + this.dataType, id)
      },
      submitForm(d) {
        this.$emit('call:change-update')
        this.closeEvent()
        // this.$confirm('确定审批吗?', '温馨提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   this.dispatch(POST_PROCESS_EXAMINE, {
        //     Lczbid: this.object.lcid,
        //     HandleOpinion: this.approvalForm.HandleOpinion,
        //     Note: this.approvalForm.Note
        //   }).then(d => {
        //     this.$message('已审批!')
        //     this.closeEvent()
        //     this.$emit('call:change-update')
        //   })
        // })
      }
    },
    watch: {},
    mounted() {},
    created() {
      this.getDict(['JJCD', 'LC_CLZT']).then(res => {
        this.dictList = res
      })
    },
    computed: {
      ...mapState(['process', 'focusPerson', 'processBus', 'focusOrg', 'focusCar'])
    }
  }

</script>
