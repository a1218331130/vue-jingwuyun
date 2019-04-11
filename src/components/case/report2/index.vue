<template>
<!--研判报告-->
<div class="people-dossier" ref="people-dossier-ref" v-loading="initLoading" :element-loading-text="initLoadingText||'初始化...'">
  <!-- 无内容初始状态 -->
  <div class="empty empty--tips" v-if="!percentageNumShow&&!initLoading&&reportList.length <= 0">
    <span>暂无生成相关报告数据！</span>
    <a href="javascript:void(0)" @click="addReportDialog = true">点击生成研判报告</a>
  </div>
  <el-row :gutter="10" style="height: 100%;overflow:hidden;margin-left: 0;margin-right: 0;" v-if="!percentageNumShow&&!initLoading&&reportList.length > 0">
    <el-col :span="4" :class="{'trans':true,'is-west':!isWestReportList}" style="height: 100%;padding-left:0;padding-right: 5px;">
      <div style="height: 100%;background: #fff;border-right: 1px solid #E5E5E5;">
        <div class="report-local-box">
          <div class="title-box">
            <span>版本信息</span>
          </div>
          <ul class="report-list-box">
            <li :class="{'current-select':currentSelectR === rItem.id}" v-for="(rItem,rIndex) in reportList" @click="selectReport(rItem.id)" :key="rIndex">
              <div class="list-content-box">
                <dl>
                  <dt :title="rItem.bgmc"><span class="onetwothree">{{(rIndex+1)}}</span><span>{{rItem.bgmc}}</span></dt>
                  <dd :title="'描述：'+rItem.ms">
                    <span class="label-span">描&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;述：</span>
                    <span class="ms-text">{{rItem.ms}}</span>
                  </dd>
                  <dd>
                    <span class="label-span">生&nbsp;成&nbsp;人：</span>
                    <span class="ms-text">{{rItem.cjrxm}}</span>
                  </dd>
                  <dd style="color:#3498E0;">
                    <span class="label-span">生成时间：</span>
                    <span class="ms-text">{{rItem.cjsj}}</span>
                  </dd>
                </dl>
                <!--<a class="report-remove-btn" href="javascript:void(0)"
                     @click.stop="removeGetById(rItem.id,rItem.bgmc)">删除</a>-->
                <a href="javascript:void(0)" title="删除报告" @click.stop="removeGetById(rItem.id,rItem.bgmc)" class="report-remove-btn iconfont icon-trash icondelete"></a>
              </div>
            </li>
          </ul>

          <div :class="{'west-box':true, 'el-icon-d-arrow-left':isWestReportList,'el-icon-d-arrow-right':!isWestReportList}" @click.stop="switchWestReport">
          </div>
        </div>
        <el-button size="small" :class="{'generate-report':true,'cu-dang':true||(initLoadingContent&&!reportContent['xinfo'])}" @click="addReportDialog = true">生成新报告
        </el-button>
        <el-button v-if="false&&(!initLoadingContent||reportContent['xinfo'])" size="small" class="generate-report" style="float: right; margin-left: 0;font-weight: initial;" @click="exportSnapshot('report-content-ref')">导出当前报告
        </el-button>
        <!-- 研判报告快照 -->
        <html-to-image :height="snapshot.height" :printName="snapshot.name" :el="snapshot.el" :submit="snapshot.isTF" @generate="generateState"></html-to-image>
        <!-- 研判报告快照 -->
      </div>
    </el-col>
    <el-col :span="20" :class="{'is-west-con':!isWestReportList}" style="padding-top: 20px;height: 100%;overflow: auto;position: relative;padding-left:0;padding-right:0;" v-if="initLoadingContent&&!reportContent['xinfo']">
      <!-- loading -->
      <div class="el-loading-mask">
        <div class="el-loading-spinner">
          <svg viewBox="25 25 50 50" class="circular">
              <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
            </svg>
          <p class="el-loading-text">报告正在加载中...</p>
        </div>
      </div>
    </el-col>
    <el-col :span="20" :class="{'is-west-con':!isWestReportList}" style="height: 100%;overflow: auto;position: relative;background: #F5F5F5;padding-left:0;padding-right:0;" v-if="!initLoadingContent||reportContent['xinfo']">
      <div class="report-content" ref="report-content-ref" id="report-content-ref">
        <!-- 案件信息 -->
        <el-row class="people-dossier-card" title="基础信息" v-if="checkUserRuleCase('ajgl/lawcase/infobg',caseId,true,cjrId)">
          <el-col :span="24">
            <form :action="servicePath+'ajgl/rep/exportword'" ref="sendData" method="post">
              <input type="hidden" name="zcdt" :value="exportWordParam.zcdt" >
              <input type="hidden" name="gxfx" :value="exportWordParam.gxfx" >
              <input type="hidden" name="ids" :value="exportWordParam.id">
              <input type="hidden" name="token" :value="userData.UserToken">
            </form>
            <!-- 导出,快照,打印,编辑 -->
            <basic-info :reportData="reportContent['cbase']" :exportWordShow="true" @call:exportWord="exportWord" @call:exportSnapshot="exportSnapshot('report-content-ref')"></basic-info>
          </el-col>
        </el-row>

        <!-- 受害人信息 -->
        <el-row class="people-dossier-card" title="报案人/受害人/证人" v-if="checkUserRuleCase('ajgl/personnel/listbg',caseId,true,cjrId)">
          <el-col :span="24">
            <involved-case-people :reportData="reportContent['cpeople']"></involved-case-people>
          </el-col>
        </el-row>

        <!-- 嫌疑人相关信息 begin -->
        <!-- 嫌疑人相关信息 -->
        <el-row class="people-dossier-card" v-if="checkUserRuleCase('ajgl/suspect/list',caseId,true,cjrId) && checkUserRuleCase('ajgl/suspect/listall',caseId,true,cjrId)" v-for="(sus,index) in reportContent['xinfo']" :key="index">
          <el-col>
            <card-header :title="'嫌疑人【'+ sus.baseinfo.xm +'】'">
            <div slot="toggle">
              <el-button type="text" :class="{'iconfont':true,'icon-packup-2':sus.flag,'icon-unfold1':!sus.flag}" style="line-height: 26px;padding: 10px" @click="toggle(index)"></el-button>
            </div>
          </card-header>
          </el-col>
          <div v-show="!sus.flag">
          <el-col :span="24" v-if="checkUserRuleCase('ajgl/suspect/info',caseId,true,cjrId) || checkUserRuleCase('ajgl/family/list',caseId,true,cjrId)">
            <kinship :data="{baseinfo:sus.baseinfo,family:sus.family}" @update:submit='updateReport'></kinship>
          </el-col>

          <!-- 社会关系 -->
          <el-col :span="24" v-if="socialRelationListRuleT">
            <social-relation :theSuspect="sus.baseinfo" :data="[{title:'同户', type:'samehousehold',data:sus.samehousehold},
                  {title:'同航班', type:'flight',data:sus.flight},
                  {title:'同铁路', type:'railway',data:sus.railway},
                  {title:'同旅店', type:'hostel',data:sus.hostel},
                  {title:'同暂住', type:'cohabit',data:sus.cohabit},
                  {title:'同网吧', type:'cyberbar',data:sus.cyberbar},
                  {title:'同案', type:'samecase',data:sus.samecase}]">
              <!--<p slot="nullTip"
                         v-if="!(sus.flight.length > 0 || sus.railway.length > 0 || sus.hostel.length > 0 || sus.cohabit.length > 0 || sus.cyberbar.length > 0 || sus.samecase.length > 0 || sus.samehousehold.length > 0)">
                        暂无数据</p>-->
            </social-relation>
          </el-col>

          <!-- 房产信息 -->
          <el-col :span="24" v-if="checkUserRuleCase('ajgl/suspect/houselist',caseId,true,cjrId)">
            <assets-real-estate :theSuspect="sus.baseinfo" :data="sus.house"></assets-real-estate>
          </el-col>

          <!-- 车辆信息 [关联GP库，数据特殊处理]-->
          <el-col :span="24" v-if="checkUserRuleCase('ajgl/suspect/carlist',caseId,true,cjrId)">
            <assets-car :theSuspect="sus.baseinfo" :data="sus.car"></assets-car>
          </el-col>

          <!-- 高频通话 -->
          <el-col :span="24">
            <gpth-list :theSuspect="sus.baseinfo" :data="sus.gpth"></gpth-list>
          </el-col>

          <!-- 高频交易 -->
          <el-col :span="24">
            <gpjy-list :theSuspect="sus.baseinfo" :data="sus.gpjy"></gpjy-list>
          </el-col>
        </div>
        </el-row>

        <!-- 嫌疑人相关信息 end -->

        <!-- 团伙关系图 -->
        <el-row class="people-dossier-card" title="团伙关系图" v-if="isShow.relationFunTF && checkUserRuleCase('ajgl/suspect/list',caseId,true,cjrId)">
          <el-col :span="24" style="overflow: hidden">
            <relation :reportData="reportContent['xinfo']" @call:dataIsNull="relationFun"></relation>
          </el-col>
        </el-row>
        <!-- 涉案物品 -->
        <el-row class="people-dossier-card" title="涉案物品" v-if="checkUserRuleCase('ajgl/article/listbg',caseId,true,cjrId)">
          <el-col :span="24">
            <sawp :reportData="reportContent['carticle']"></sawp>
          </el-col>
        </el-row>
        <!-- 涉案车辆 -->
        <el-row class="people-dossier-card" title="涉案车辆" v-if="checkUserRuleCase('ajgl/vehicle/listbg',caseId,true,cjrId)">
          <el-col :span="24">
            <sacl :reportData="reportContent['ccar']"></sacl>
          </el-col>
        </el-row>
        <!-- 侦查导图 -->
        <el-row class="people-dossier-card" title="侦查导图" v-if="checkUserRuleCase('ajgl/reconnaissancemap/list',caseId,true,cjrId)">
          <el-col :span="24" style="overflow: hidden">
            <zcdt ref="zcdt" :operation="operationFlag" :gochartsFlag="gochartsFlag" :exportSnap="exportSnapshotFlag" :reportData="reportContent['cmap']" @update:imageData = "updateImageData"></zcdt>
          </el-col>
        </el-row>
        <!-- <el-row v-if="baseImage.length>0" v-for="item in baseImage">
          <img :src="item" alt="">
        </el-row> -->
      <!-- 关系分析 -->
  <!-- <el-row class="people-dossier-card" title="关系分析" v-if="checkUserRuleCase('topic/gxfx/list',caseId,true,cjrId)">
    <el-col :span="24" style="overflow: hidden">
      <case-relation :reportData="reportContent['tgxfx']" :operation="operationFlag" @update:relativeData = "updateRelativeData" :chartImgShow="caseChartImgShow" ></case-relation>
    </el-col>
  </el-row> -->
        <!-- 团伙同住信息 -->
        <el-row class="people-dossier-card" title="团伙同住信息" v-if="checkUserRuleCase('ajgl/suspect/ganglive',caseId,true,cjrId)">
          <el-col :span="24" style="overflow: hidden">
            <gangs-to-live :theSuspectList="reportContent['xinfo']" :reportData="[{title: '同旅店', type: 'hostel', data: reportContent['thostel']},{title: '同暂住', type: 'cohabit', data: reportContent['tcohabit']}]">
              <!-- <p slot="nullTip"
                         v-if="!((reportContent['thostel'] && reportContent['thostel'].length > 0) || (reportContent['tcohabit'] && reportContent['tcohabit'].length > 0))">
                        暂无数据</p>-->
            </gangs-to-live>
          </el-col>
        </el-row>
        <!-- 团伙同行信息 -->
        <el-row class="people-dossier-card" title="团伙同行信息" v-if="checkUserRuleCase('ajgl/suspect/gang',caseId,true,cjrId)">
          <el-col :span="24" style="overflow: hidden">
            <gangsCounterparts :theSuspectList="reportContent['xinfo']" :reportData="[{title: '同航班', type: 'flight', data: reportContent['tflight']},
                          {title: '同铁路', type: 'railway', data: reportContent['trailway']},
                          {title: '同网吧', type: 'cyberbar', data: reportContent['tcyber']}]">
              <!--<p slot="nullTip"
                         v-if="!((reportContent['tflight'] && reportContent['tflight'].length > 0) || (reportContent['trailway'] && reportContent['trailway'].length > 0) || (reportContent['tcyber'] && reportContent['tcyber'].length > 0))">
                        暂无数据</p>-->
            </gangsCounterparts>
          </el-col>
        </el-row>
        <!-- 团伙交易记录 -->
        <el-row class="people-dossier-card" title="团伙交易记录" v-if="checkUserRuleCase('Zdfx/GetDRJYMXList',caseId,true,cjrId)">
          <el-col :span="24">
            <jyjl :reportData="reportContent['tdeal']"></jyjl>
          </el-col>
        </el-row>
        <!-- 团伙通讯记录 -->
        <el-row class="people-dossier-card" title="团伙通讯记录" v-if="checkUserRuleCase('Hdfx/GetDRTHMXList',caseId,true,cjrId)">
          <el-col :span="24">
            <txjl :reportData="reportContent['tphone']"></txjl>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>

  <!-- 重新生成研判报告 -->
  <addReport :dialog="addReportDialog" @update:submit="addReportProgress" @close="addReportDialog = false"></addReport>

  <!-- 项目生成进度条 Progress -->
  <div class="el-loading-mask progress" v-if="percentageNumShow">
    <div class="el-loading-spinner" style="width: 80%;margin: auto 10%;">
      <el-progress :text-inside="true" :stroke-width="16" :percentage="percentageNum"></el-progress>
      <p class="el-loading-text">{{percentageNum === 100 ? '研判报告生成完成！' : '请耐心等待,研判报告生成中....'}}</p>
    </div>
  </div>
</div>
</template>
<style scoped lang="scss">
  .empty {
    transform: scale(1.5) translate(-34%, -50%);
  }

  .people-dossier {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .people-dossier-card {
    background-color: #fff;
    padding: 0 10px 25px;
    margin-bottom: 12px;
  }

  .trans {
    transition: width 1s ease;
    transition: display 1s ease;
  }

  .is-west {
    width: 0;
    margin-left: -1px;
    .generate-report.cu-dang,
    .report-list-box,
    .title-box {
      display: none;
    }
  }

  .is-west-con {
    width: calc(100% - 6px);
  }

  .report-local-box {
    height: calc(100% - 80px);
    margin: 0;
    background: #fff;
    position: relative;
    .title-box {
      height: 39px;
      background: #66A7E7;
      text-align: center;
      line-height: 42px;
      color: #fff;
      /* -webkit-writing-mode: vertical-lr; */
      /*-ms-writing-mode: tb-lr;*/
      /* writing-mode: vertical-lr; */
      span {
        color: #fff;
        font-size: 14px;
        user-select: none;
      }
    }
    .west-box {
      /* background: #75B0E9; */
      background: #F7FBFE;
      height: 80px;
      width: 15px;
      position: absolute;
      top: 50%;
      margin-top: -40px;
      right: -16px;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      box-shadow: 2px 1px 5px #949290;
      cursor: pointer;
      line-height: 80px;
      text-align: center;
      /*color: #fff;*/
      color: #666;
      z-index: 99;
      font-size: 12px;
      &:hover {
        /*background: #55A3F1;*/
        background: #F9F9F9;
      }
    }
    .report-list-box {
      float: left;
      width: 100%;
      height: calc(100% - 39px);
      list-style-type: none;
      overflow: auto;
      padding: 0;
      margin: 0;
      li {
        cursor: pointer;
        padding: 0;
        background: #E6E6E6;
        border-bottom: 5px solid #66A7E7;
        &:first-child {
          padding-top: 0;
        }
        &:hover {
          /*margin-right: 0;*/
          /*padding-right: 10%;*/
          .list-content-box {
            background: #fff;
            /*box-shadow: 0 0 5px #51BFB1;*/
            // border-bottom: 3px solid #E6E6E6;
            .report-remove-btn {
              display: inherit;
            }
          }
        }
        &.current-select {
          background: #fff;
          border-bottom-color: #E6E6E6;
          &:hover {
            box-shadow: none;
          }
          .list-content-box {
            background: #F6F6F6;
          }
        }
        .list-content-box {
          background: #fff;
          overflow: hidden;
          position: relative;
          padding: 2px;
          dl {
            margin: 0 2%;
            dt {
              font-weight: bold;
              color: #2A2A2A;
              border-bottom: 1px dashed #E7E7E7;
              padding: 0 3px;
              line-height: 28px;
              word-wrap: break-word;
              display: -webkit-box;
              overflow: hidden;
              text-overflow: ellipsis;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              height: 28px;
              margin-right: 12px;
            }
            dd {
              margin: 0;
              font-size: 12px;
              .label-span {
                width: 61px;
                float: left;
                color: #575757;
                text-align: justify;
                text-align-last: justify;
                position: relative;
                left: 1px;
              }
              .ms-text {
                word-wrap: break-word;
                display: -webkit-box;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                line-height: 1.5;
                min-height: 22px;
              }
            }
          }
          .report-remove-btn {
            /*display: none;*/
            position: absolute;
            right: 5px;
            top: 1px;
            color: #A8A8A8;
            font-size: 24px;
            &:hover {
              color: #55A3F1;
            }
          }
        }
      }
    }
  }

  .generate-report {
    margin: 8% 3% 0 6%;
    width: 44%;
    text-align: center;
    font-weight: bold;
    height: 38px;
    background: #66A7E7;
    color: #fff;
    border: none;
    &.cu-dang {
      width: 90%;
      letter-spacing: 3px;
    }
  }

  .report-content {
    padding: 7px 5px 0;
    background: #F5F5F5;
    width: calc(100% - 10px);
  }

  .onetwothree {
    display: inline-block;
    width: 20px;
    height: 15px;
    line-height: 15px;
    /* border: 1px solid #ccc; */
    text-align: left;
    vertical-align: middle;
    font-size: 12px;
    color: rgba(102, 102, 102, 0.61);
    font-weight: normal;
    position: relative;
    left: -3px;
    top: -1px;
    /* background: rgba(33, 150, 243, 0.07); */
    border-radius: 4px;
  }

</style>
<script>
  import basicInfo from '../base/basic-info.vue'
  import kinship from './modules/kinship.vue'
  import socialRelation from './modules/social-relation.vue'
  import cardHeader from './modules/card-header.vue'
  import gpjyList from './modules/gpjy-list.vue'
  import gpthList from './modules/gpth-list.vue'
  import assetsRealEstate from './modules/assets-real-estate.vue'
  import assetsCar from './modules/assets-car.vue'
  import gangsToLive from './modules/gangs-to-live.vue'
  import gangsCounterparts from './modules/gangs-counterparts.vue'
  import involvedCasePeople from './modules/involved-case-people.vue'
  import associationClues from './modules/association-cluesTTT.vue'
  import caseRelation from '../report/modules/case-relation.vue'
  import relation from './modules/relation.vue'
  import sawp from './modules/sawp.vue'
  import sacl from './modules/sacl.vue'
  import zcdt from '../report/modules/zcdt.vue'
  import txjl from './modules/txjl.vue'
  import jyjl from './modules/jyjl.vue'
  import addReport from './dialog/add-report-dialog.vue'
  import { mapState } from 'vuex'
  import reportMixin from './reportMixin'
  import htmlToImage from '../../../widgets/html-image/html-to-image.vue'
  import mixin from '../../../utils/mixin'
  import {
    // SERVICE_BASE_PATH,
    FWZX_PATH
    // JAVA_PATH
  } from '../../../config'

  export default {
    mixins: [reportMixin, mixin],
    components: {
      gpthList,
      gpjyList,
      htmlToImage,
      addReport,
      basicInfo,
      kinship,
      socialRelation,
      assetsRealEstate,
      assetsCar,
      gangsToLive,
      gangsCounterparts,
      involvedCasePeople,
      associationClues,
      relation,
      caseRelation,
      sawp,
      sacl,
      zcdt,
      jyjl,
      txjl,
      cardHeader
    },
    computed: {
      ...mapState(['suspectCasePeople', 'caseReportVersion'])
    },
    data() {
      return {
        servicePath: FWZX_PATH,
        exportWordParam: {
          id: '',
          zcdt: '',
          gxfx: ''
        },
        tranInfo: {
          print: false,
          exportSnapshot: false,
          tool: true
        },
        reportId: '',
        operationFlag: 1,
        isWestReportList: true,
        isShow: {
          relationFunTF: true
        }, // 当前栏目是否显示
        percentageNum: 0, // 进度条数值
        percentageNumShow: false,
        currentSelectR: null, // 当前选择的报告
        addReportDialog: false,
        caseId: '', // 案件ID
        cjrId: '',
        suspectPeople: [], // 嫌疑人相关信息
        subData: [],
        socialRelationListRuleT: false, // 社会关系列表默认权限 false
        baseImage: [],
        exportSnapshotFlag: false,
        gochartsFlag: true
      }
    },
    methods: {
      updateRelativeData(val) {
        this.exportWordParam.gxfx = val
      },
      updateImageData(val) {
        this.exportWordParam.token = this.userData.UserToken;
        this.exportWordParam.zcdt = val.strings
        this.updateRelativeData()
        this.baseImage = val.baseImage;
        this.$nextTick(() => {
          this.$refs.sendData.submit();
        })
      },
      exportWord() {
        this.exportWordParam.id = this.reportId;
        this.operationFlag++;
      },
      /**
       * 社会关系列表展示权限验证
       */
      socialRelationListRule() {
        this.socialRelationListRuleT = (this.checkUserRuleCase('ajgl/flight/list', this.caseId, true, this.cjrId) || this.checkUserRuleCase('ajgl/railway/list', this.caseId, true, this.cjrId) || this.checkUserRuleCase('ajgl/hostel/list', this.caseId,
            true, this.cjrId) || this.checkUserRuleCase(
            'ajgl/cohabit/list', this.caseId, true, this.cjrId) ||
          this.checkUserRuleCase('ajgl/cyberbar/list', this.caseId, true, this.cjrId) || this.checkUserRuleCase('ajgl/samecase/list', this.caseId, true, this.cjrId) || this.checkUserRuleCase('ajgl/samehousehold/list', this.caseId, true, this.cjrId))
      },
      /**
       * 当前选择的报告
       * @param RId 报告ID
       */
      selectReport(RId) {
        if (RId) {
          this.reportId = RId;
          this.currentSelectR = RId
          this.queryReportById(RId)
        }
      },
      /**
       * 报告生成进度
       * @param Num 0: 开始生成  1:生成成功  -1：失败
       */
      addReportProgress(Num) {
        switch (Num) {
          case 0:
            this.percentageNumShow = true
            this.addReportDialog = false
            this.livePercentage(parseInt((Math.random() * 100) + Math.random()))
            break;
          case 1:
            this.livePercentage(100, true, 20)
            break;
          case -1:
            this.$message({
              type: 'error',
              message: '研判报告生成失败！'
            })
            break;
          default:
        }
      },
      livePercentage(val, immediate, setIntervalTime) {
        let self = this
        if (immediate) {
          self.percentageNum = val
          clearTimer(self.percentageNum)
        } else {
          if (self.timer) {
            self.percentageNum = val
            clearTimer(self.percentageNum)
          } else {
            self.timer = setInterval(() => {
              let randomInt = setIntervalTime ? 1 : parseInt((Math.random() * 5) + 1),
                setVal = self.percentageNum + randomInt
              if (setVal < val) {
                self.percentageNum = setVal
              } else {
                setVal = val
                self.percentageNum = setVal
                clearTimer(setVal)
              }
            }, setIntervalTime || parseInt((Math.random() * 2) + 1) * 300)
          }
        }

        function clearTimer(cuN) {
          clearInterval(self.timer)
          self.timer = null
          if (cuN && cuN >= 100) {
            setTimeout(() => {
              self.$message({
                type: 'success',
                message: '研判报告生成成功！'
              })
              self.percentageNumShow = false
              let _addCaseRep = self.caseReportVersion.addCaseReportVersion
              self.reportList.unshift(_addCaseRep) // 新增的数据
              self.selectReport(_addCaseRep.id)
              self.queryReportList()
            }, parseInt(Math.random() * 100))
          }
        }
      },
      /**
       * 团伙关系图是否为空
       * @param T
       */
      relationFun(T) {
        this.isShow.relationFunTF = T
      },
      /**
       * 报告历史列表切换
       */
      switchWestReport() {
        this.isWestReportList = this.isWestReportList === false
      },
      toggle(val) {
        this.reportContent['xinfo'][val].flag = !this.reportContent['xinfo'][val].flag
      }
    },
    mounted() {},
    watch: {},
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.cjrId = this.$route.query.b // 初始化获取案件创建人id
      this.socialRelationListRule() // 初始化社会关系默认列表
      this.queryReportList() // 初始化当前案件研判报告历史列表
    }
  }

</script>
