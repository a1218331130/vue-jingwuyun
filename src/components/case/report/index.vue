<template>
<!--研判报告-->
<div class="people-dossier" ref="people-dossier-ref">
  <el-row :gutter="10" style="height: 100%;overflow:hidden;">
    <el-col :span="0" v-if="false" style="height: 100%;background: #fff;padding: 0">
      <ul class="report-list-box">
        <li class="current-select">
          <div class="list-content-box">
            <dl>
              <dt>张三的案件报告</dt>
              <dd>生成操作人：admin</dd>
              <dd>生成时间：2017年12月22日17:42:48</dd>
            </dl>
          </div>
        </li>
        <li>
          <div class="list-content-box">
            <dl>
              <dt>张三的案件报告</dt>
              <dd>生成操作人：admin</dd>
              <dd>生成时间：2017年12月22日17:42:48</dd>
            </dl>
          </div>
        </li>
      </ul>
      <el-button size="small" class="generate-report">生成研判报告</el-button>
    </el-col>
    <el-col :span="24" style="padding-top: 20px;height: 100%;overflow: auto;">
      <!-- 案件信息 -->
      <el-row class="people-dossier-card" title="案件信息" v-if="checkUserRuleCase('ajgl/lawcase/infobg',caseId,true,cjrId)">
        <el-col :span="24">
          <basic-info></basic-info>
        </el-col>
      </el-row>

      <!-- 受害人信息 -->
      <el-row class="people-dossier-card" title="涉案人信息" v-if="checkUserRuleCase('ajgl/personnel/listbg',caseId,true,cjrId)">
        <el-col :span="24">
          <involved-case-people></involved-case-people>
        </el-col>
      </el-row>

      <!-- 嫌疑人相关信息 begin -->
      <!-- 嫌疑人信息 -->
      <el-row class="people-dossier-card" v-if="checkUserRuleCase('ajgl/suspect/listall',caseId,true,cjrId)&&suspectPeopleLoading">
        <el-col :span="24" v-loading.fullsreen.lock="suspectPeopleLoading" element-loading-text="拼命分析中……" style="height: 100px">
        </el-col>
      </el-row>
      <!-- 嫌疑人相关信息 -->
      <el-row class="people-dossier-card" v-if="checkUserRuleCase('ajgl/suspect/list',caseId,true,cjrId) && checkUserRuleCase('ajgl/suspect/listall',caseId,true,cjrId)" v-for="(sus,index) in suspectPeople" :key="index">

        <el-col :span="24" v-if="checkUserRuleCase('ajgl/suspect/info', caseId) || checkUserRuleCase('ajgl/family/list',caseId,true,cjrId)">
          <kinship :data="{baseinfo:sus.baseinfo,family:sus.family}"></kinship>
        </el-col>

        <!-- 社会关系 -->
        <el-col :span="24" v-if="socialRelationListRuleT">
          <social-relation :theSuspect="sus.baseinfo" :data="[{title:'同航班', type:'flight',data:sus.flight},
            {title:'同铁路', type:'railway',data:sus.railway},
            {title:'同旅店', type:'hostel',data:sus.hostel},
            {title:'同暂住', type:'cohabit',data:sus.cohabit},
            {title:'同网吧', type:'cyberbar',data:sus.cyberbar},
            {title:'同案', type:'samecase',data:sus.samecase},
            {title:'同户', type:'samehousehold',data:sus.samehousehold}]"></social-relation>
        </el-col>

        <!-- 房产信息 -->
        <el-col :span="24" v-if="checkUserRuleCase('ajgl/suspect/houselist', caseId,true,cjrId)">
          <assets-real-estate :theSuspect="sus.baseinfo" :data="sus.house"></assets-real-estate>
        </el-col>

        <!-- 车辆信息 [关联GP库，数据特殊处理]-->
        <el-col :span="24" v-if="checkUserRuleCase('ajgl/suspect/carlist', caseId,true,cjrId)">
          <assets-car :theSuspect="sus.baseinfo" :data="sus.car"></assets-car>
        </el-col>

      </el-row>

      <!-- 嫌疑人相关信息 end -->

      <!-- 团伙关系图 -->
      <!-- <el-row class="people-dossier-card" title="团伙关系图" v-if="checkUserRuleCase('ajgl/suspect/list',caseId,true,cjrId)">
        <el-col :span="24" style="overflow: hidden">
          <relation></relation>
        </el-col>
      </el-row> -->
      <!-- 涉案物品 -->
      <el-row class="people-dossier-card" title="涉案物品" v-if="checkUserRuleCase('ajgl/article/listbg',caseId,true,cjrId)">
        <el-col :span="24">
          <sawp></sawp>
        </el-col>
      </el-row>
      <!-- 涉案车辆 -->
      <el-row class="people-dossier-card" title="涉案车辆" v-if="checkUserRuleCase('ajgl/vehicle/listbg',caseId,true,cjrId)">
        <el-col :span="24">
          <sacl></sacl>
        </el-col>
      </el-row>
      <!-- 侦查导图 -->
      <el-row class="people-dossier-card" title="侦查导图" v-if="checkUserRuleCase('ajgl/reconnaissancemap/list',caseId,true,cjrId)">
        <el-col :span="24" style="overflow: hidden">
          <zcdt></zcdt>
        </el-col>
      </el-row>
      <!-- 团伙同住信息 -->
      <el-row class="people-dossier-card" title="团伙同住信息" v-if="checkUserRuleCase('ajgl/suspect/ganglive',caseId,true,cjrId)">
        <el-col :span="24" style="overflow: hidden">
          <gangs-to-live></gangs-to-live>
        </el-col>
      </el-row>
      <!-- 团伙同行信息 -->
      <el-row class="people-dossier-card" title="团伙同行信息" v-if="checkUserRuleCase('ajgl/suspect/gang',caseId,true,cjrId)">
        <el-col :span="24" style="overflow: hidden">
          <gangsCounterparts></gangsCounterparts>
        </el-col>
      </el-row>
      <!-- 团伙交易记录 -->
      <el-row class="people-dossier-card" title="团伙交易记录" v-if="checkUserRuleCase('Zdfx/GetDRJYMXList',caseId,true,cjrId)">
        <el-col :span="24">
          <jyjl></jyjl>
        </el-col>
      </el-row>
      <!-- 团伙通讯记录 -->
      <el-row class="people-dossier-card" title="团伙通讯记录" v-if="checkUserRuleCase('Hdfx/GetDRTHMXList',caseId,true,cjrId)">
        <el-col :span="24">
          <txjl></txjl>
        </el-col>
      </el-row>

    </el-col>
  </el-row>
</div>
</template>
<style scoped lang="scss">
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

  .report-list-box {
    height: calc(100% - 130px);
    margin-bottom: 30px;
    list-style-type: none;
    overflow: auto;
    padding: 0;
    li {
      cursor: pointer;
      margin: 5% 10%;
      &:hover {
        margin-right: 0;
        padding-right: 10%;
        /*background: #F5F5F5;*/
        .list-content-box {
          box-shadow: 0 0 5px #51BFB1;
        }
      }
      &.current-select {
        margin-right: 0;
        padding-right: 10%;
        background: #F5F5F5;
        border: 1px solid #209082;
        border-right: none;
        &:hover {
          box-shadow: none;
        }
        .list-content-box {
          /*box-shadow: 0 0 5px #51BFB1;*/
          border: none;
        }
      }
      .list-content-box {
        border: 1px solid #209082;
        overflow: hidden;
        dl {
          margin: 5% 8%;
          dt {
            font-weight: bold;
          }
          dd {
            margin: 0;
          }
        }
      }
    }
  }

  .generate-report {
    margin-left: 15%;
    width: 70%;
    text-align: center;
  }

</style>

<script>
  import basicInfo from '../base/basic-info.vue'
  import kinship from './modules/kinship.vue'
  import socialRelation from './modules/social-relation.vue'

  import assetsRealEstate from './modules/assets-real-estate.vue'
  import assetsCar from './modules/assets-car.vue'
  import gangsToLive from './modules/gangs-to-live.vue'
  import gangsCounterparts from './modules/gangs-counterparts.vue'
  import involvedCasePeople from './modules/involved-case-people.vue'
  import associationClues from './modules/association-cluesTTT.vue'
  import relation from './modules/relation.vue'
  import sawp from './modules/sawp.vue'
  import sacl from './modules/sacl.vue'
  import zcdt from './modules/zcdt.vue'
  import txjl from './modules/txjl.vue'
  import jyjl from './modules/jyjl.vue'

  import { mapState } from 'vuex'
  import mixin from '../../../utils/mixin'
  import {
    FETCH_SUSPECT_CASE_PEOPLE_LIST_ALL
  } from '../../../store/types'
  export default {
    mixins: [mixin],
    components: {
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
      sawp,
      sacl,
      zcdt,
      jyjl,
      txjl
    },
    computed: {
      ...mapState(['suspectCasePeople'])
    },
    data() {
      return {
        caseId: '', // 案件ID
        cjrId: '',
        suspectPeopleLoading: true,
        suspectPeople: [], // 嫌疑人相关信息
        subData: [],
        socialRelationListRuleT: false // 社会关系列表默认权限 false
      }
    },
    methods: {
      /**
       *  查询嫌疑人超级列表
       */
      queryListAll() {
        if (this.checkUserRuleCase('ajgl/suspect/listall', this.caseId, true, this.cjrId)) {
          this.suspectPeopleLoading = true
          this.dispatch(FETCH_SUSPECT_CASE_PEOPLE_LIST_ALL, {
            ajid: this.caseId
          }).then(r => {
            this.suspectPeopleLoading = false
          })
        }
      },
      /**
       * 社会关系列表展示权限验证
       */
      socialRelationListRule() {
        this.socialRelationListRuleT = true
        // this.socialRelationListRuleT = (this.checkUserRuleCase('ajgl/flight/list', this.caseId, true, this.cjrId) || this.checkUserRuleCase('ajgl/railway/list', this.caseId, true, this.cjrId) || this.checkUserRuleCase('ajgl/hostel/list', this.caseId,
        //   true, this.cjrId) || this.checkUserRuleCase(
        //   'ajgl/cohabit/list', this.caseId, true, this.cjrId) || this.checkUserRuleCase('ajgl/cyberbar/list', this.caseId, true, this.cjrId) || this.checkUserRuleCase('ajgl/samecase/list', this.caseId, true, this.cjrId) || this.checkUserRuleCase(
        //   'ajgl/samehousehold/list', this.caseId, true, this.cjrId))
      }
    },
    mounted() {},
    watch: {
      'suspectCasePeople.FetchSuspectCasePeopleListAll' (val) {
        if (val) {
          this.suspectPeople = val
        } else {
          this.suspectPeople = []
        }
      }
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.cjrId = this.$route.query.b // 初始化获取案件创建人id
      this.queryListAll()
      this.socialRelationListRule() // 初始化社会关系默认列表
    }
  }

</script>
