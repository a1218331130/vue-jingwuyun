<template>
<!--研判报告-->
<div class="people-dossier" ref="people-dossier-ref">
  <form :action="servicePath+'zhda/all/exportAllCase'" ref="sendData" method="post">
    <input type="hidden" name="zcdt" :value="exportWordParam.zcdt" >
    <input type="hidden" name="gxfx" :value="exportWordParam.gxfx" >
    <input type="hidden" name="ids" :value="exportWordParam.id">
    <input type="hidden" name="token" :value="userData.UserToken">
  </form>
  <!-- 案件信息 -->
  <el-row class="people-dossier-card" title="案件信息" v-if="checkUserRuleCase('ajgl/lawcase/infoda',caseId,true,cjrId)">
    <el-col :span="24">
      <basic-info :tranInfo="tranInfo" @call:exportWord="exportWord" :exportWordShow="true" ></basic-info>
    </el-col>
  </el-row>

  <!-- 受害人信息 -->
  <el-row class="people-dossier-card" title="涉案人信息" v-if="checkUserRuleCase('ajgl/personnel/listda',caseId,true,cjrId)">
    <el-col :span="24">
      <involved-case-people></involved-case-people>
    </el-col>
  </el-row>

  <!-- 嫌疑人信息 -->
  <el-row class="people-dossier-card" title="嫌疑人信息" v-if="checkUserRuleCase('ajgl/suspect/listda',caseId,true,cjrId)">
    <el-col :span="24">
      <kinshipS></kinshipS>
    </el-col>
  </el-row>

  <!-- 涉案物品 -->
  <el-row class="people-dossier-card" title="涉案物品" v-if="checkUserRuleCase('ajgl/article/listda',caseId,true,cjrId)">
    <el-col :span="24">
      <sawp></sawp>
    </el-col>
  </el-row>
  <!-- 涉案车辆 -->
  <el-row class="people-dossier-card" title="涉案车辆" v-if="checkUserRuleCase('ajgl/vehicle/listda',caseId,true,cjrId)">
    <el-col :span="24">
      <sacl></sacl>
    </el-col>
  </el-row>
  <!-- 侦查导图 -->
  <el-row class="people-dossier-card" title="侦查导图" v-if="checkUserRuleCase('ajgl/reconnaissancemap/list',caseId,true,cjrId)">
    <el-col :span="24" style="overflow: hidden">
      <zcdt :operation="operationFlag" @update:imageData = "updateImageData"></zcdt>
    </el-col>
  </el-row>
    <!-- 关系分析 -->
  <el-row class="people-dossier-card" title="关系分析" v-if="checkUserRuleCase('topic/gxfx/list',caseId,true,cjrId)">
    <el-col :span="24" style="overflow: hidden">
      <case-relation :operation="operationFlag" @update:relativeData = "updateRelativeData"></case-relation>
    </el-col>
  </el-row>
  <!-- 线索信息 -->
  <el-row class="people-dossier-card" title="线索信息" v-if="checkUserRuleCase('ajgl/clue/listda',caseId,true,cjrId)">
    <el-col :span="24">
      <clues></clues>
    </el-col>
  </el-row>

  <el-row class="people-dossier-card" title="串案信息" v-if="checkUserRuleCase('ajgl/oncase/listda',caseId,true,cjrId)">
    <el-col :span="24">
      <oncase></oncase>
    </el-col>
  </el-row>
  <div id="test"></div>
</div>
</template>
<style scoped lang="scss">
  .people-dossier {
    width: 100%;
    margin: 20px auto;
  }

  .people-dossier-card {
    background-color: #fff;
    padding: 0 10px 25px;
    margin-bottom: 12px;
  }

</style>

<script>
  import { mapState } from 'vuex'
  import { EXPORT_ALL_CASE } from '../../../store/types'
  import basicInfo from '../base/basic-info.vue'
  import kinship from './kinship.vue'
  import kinshipS from './certificate.vue'
  import involvedCasePeople from '../report/modules/involved-case-people.vue'
  import oncase from '../dossier/case-index.vue'
  import clues from '../dossier/clues-index.vue'
  import associationClues from '../report/modules/association-cluesTTT.vue'
  import sawp from '../report/modules/sawp.vue'
  import sacl from '../report/modules/sacl.vue'
  import zcdt from '../report/modules/zcdt.vue'
  import caseRelation from '../report/modules/case-relation.vue'
  import txjl from '../report/modules/txjl.vue'
  import jyjl from '../report/modules/jyjl.vue'
  import bus from '../../../utils/bus'
  import mixin from '../../../utils/mixin'
  import {
    // SERVICE_BASE_PATH,
    FWZX_PATH
    // JAVA_PATH
  } from '../../../config'
  export default {
    mixins: [mixin],
    components: {
      basicInfo,
      kinship,
      kinshipS,
      involvedCasePeople,
      oncase,
      clues,
      associationClues,
      sawp,
      sacl,
      zcdt,
      jyjl,
      txjl,
      caseRelation
    },
    data() {
      return {
        imageValue: '',
        operationFlag: 1,
        servicePath: FWZX_PATH,
        caseId: '',
        cjrId: '',
        exportWordParam: {
          id: '',
          zcdt: '',
          gxfx: ''
        },
        tranInfo: {
          print: false,
          exportSnapshot: false,
          tool: false
        },
        subData: [
          { title: '基础信息' },
          { title: '亲属人群' },
          { title: '证件信息' },
          { title: '通信方式' },
          { title: '虚拟账号' },
          { title: '轨迹分析' },
          { title: '通话规律分析' },
          { title: '财产信息' },
          { title: '社交关系' },
          { title: '案事件关联' },
          { title: '人事社保' },
          { title: '图片视频' },
          { title: '关联线索' },
          { title: '其它' }
        ]
      }
    },
    computed: {
      ...mapState(['caseInfo'])
    },
    methods: {
      updateRelativeData(val) {
        this.exportWordParam.gxfx = val
      },
      updateImageData(val) {
        this.exportWordParam.token = this.userData.UserToken;
        this.exportWordParam.zcdt = val
        this.updateRelativeData()
        this.$nextTick(() => {
          this.$refs.sendData.submit()
        })
        console.log(this.exportWordParam, 'exportWordParam')
      },
      exportWord() {
        this.exportWordParam.id = this.caseId;
        this.operationFlag++;
      }
    },
    mounted() {},
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.cjrId = this.$route.query.b // 初始化获取案件id
      bus.$emit('update:dossierSubTitle', this.subData)
      bus.$emit('update:dossierTitle', '人员档案')
      bus.$on('clickEvent:menuSubTitle', item => {
        // 点击侧栏导航回调
        //        console.log('当前点击项', item)
        let parentDom = this.$refs['people-dossier-ref']
        for (let iDom of parentDom.children) {
          if (item.title === iDom.title) {
            //            console.log('>>>> ', parentDom.parentNode, this.$refs, iDom.offsetTop)
            parentDom.parentNode.scrollTop = iDom.offsetTop - 20
          }
        }
        bus.$emit('update:dossierThisSubTitle', item.title)
      })
      // this.dispatch(EXPORT_ALL_CASE, this.caseId).then(_ => {
      //   console.log(this.caseInfo.exportAllCaseResult)
      // })
      console.log(EXPORT_ALL_CASE)
    }
  }

</script>
