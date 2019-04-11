<template>
<div class="people-dossier" ref="dossier-list-ref" id="dossier-list-ref">
  <form :action="rod+'jwy/pesonnelfiles/exportword'" ref="sendData" method="post">
    <input type="hidden" name="zjhm" :value="exportWordId">
    <input type="hidden" name="token" :value="userData.UserToken">
  </form>
  <!-- 人员基础信息 -->
  <el-row class="people-dossier-card user-bg" :title="subData[0].title">
    <el-col :span="24">
      <!-- <basic-info :caseKey="dossierKey"></basic-info> -->
      <basic-info :caseKey="dossierKey" @call:exportWord="exportWord" :exportWordShow="true" ></basic-info>
    </el-col>
  </el-row>

  <!-- 亲属人群 -->
  <el-row class="people-dossier-card user-bg" :title="subData[1].title" v-show="this.checkRule('jwy/pesonnelfiles/getpersonfamilyinfo', true) === true">
    <el-col :span="24">
      <kinship :caseKey="dossierKey" :zdyData="zdyData"></kinship>
    </el-col>
  </el-row>

  <!-- 证件信息 -->
  <el-row class="people-dossier-card user-bg" :title="subData[2].title" v-show="this.checkRule('jwy/pesonnelfiles/getPersonCertificateInfo') === true">
    <el-col :span="24">
      <certificate :caseKey="dossierKey" :zdyData="zdyData"></certificate>
    </el-col>
  </el-row>

  <!-- 通讯方式 -->
  <el-row class="people-dossier-card user-bg" :title="subData[3].title" v-show="this.checkRule('jwy/pesonnelfiles/getPersonCommunicationInfo') === true">
    <el-col :span="24">
      <communication-mode :caseKey="dossierKey" :zdyData="zdyData" @call:telList="telListChange"></communication-mode>
    </el-col>
  </el-row>

  <!-- 虚拟账号 -->
  <el-row class="people-dossier-card user-bg" :title="subData[4].title" v-show="this.checkRule('jwy/pesonnelfiles/getVirtualInfo') === true">
    <el-col :span="24">
      <virtual-account :caseKey="dossierKey" :zdyData="zdyData">
      </virtual-account>
    </el-col>
  </el-row>

  <!-- 轨迹规律 -->
  <el-row class="people-dossier-card user-bg" :title="subData[5].title" v-show="this.checkRule('gjfx/sjz/list', true) === true && this.checkRule('topic/gjfx/listgl', true) === true">
    <el-col :span="24">
      <trajectory :caseKey="dossierKey" :zdyData="zdyData"></trajectory>
    </el-col>
  </el-row>
  
  <!-- 关系分析 -->
  <el-row class="people-dossier-card user-bg" :title="subData[6].title">
    <el-col :span="24">
      <!-- <trajectory :caseKey="dossierKey" :zdyData="zdyData"></trajectory> -->
      <!-- <relation></relation> -->
      <cardHeader :title="'关系分析('+relationList.length+'条结果)'" :tableData="relationList" :expand="true" @on-update-expand="updateExpand" ></cardHeader>
      <div v-show="expandMark">
        <div v-loading="loading" v-if="relationList.length > 0">
          <el-table :data="relationList" border >
          <el-table-column label="序号" width="50" align="center" type="index">
            <template scope="scope">
              {{scope.$index + 1}}
            </template>
</el-table-column>
<el-table-column v-for="(item, index) in columnTab" align="center" :key="index" :label="item.label" :prop="item.prop"></el-table-column>
</el-table>
<el-row :gutter="15" v-show="relationList.length >= 0" style="border-top:1px solid #d7d7d7; padding: 0;">
  <el-col :span="24">
    <div class="card-sub-title" @click="displayDetail">查看详情</div>
  </el-col>
</el-row>
</div>
<div v-loading='expandMark' v-else style="position: relative">
  <div class="empty_h">
    <div class="empty "></div>
  </div>
</div>
</div>
</el-col>
</el-row>

<!-- 通话规律分析 -->
<el-row class="people-dossier-card user-bg" :title="subData[7].title" v-if="this.checkRule('Hdfx/GetTHGLList', true) === true && this.checkRule('Hdfx/GetTHPLList', true) === true && this.checkRule('Hdfx/GetJZFXList', true) === true">
  <el-col :span="24">
    <call-law :telNum="telNum" :caseKey="dossierKey"></call-law>
  </el-col>
</el-row>

<!-- 财产信息 -->
<el-row class="people-dossier-card user-bg" :title="subData[8].title" v-show="this.checkRule('jwy/pesonnelfiles/getpropertyinfo') === true">
  <el-col :span="24">
    <property :caseKey="dossierKey" :zdyData="zdyData"></property>
  </el-col>
</el-row>

<!-- 社交关系 -->
<el-row class="people-dossier-card user-bg" :title="subData[9].title" v-show="this.checkRule('jwy/pesonnelfiles/getsocialrelationshipsinfo') === true">
  <el-col :span="24">
    <social-connection :caseKey="dossierKey" :zdyData="zdyData"></social-connection>
  </el-col>
</el-row>

<!-- 案事件关联 -->
<el-row class="people-dossier-card user-bg" :title="subData[10].title" v-show="this.checkRule('jwy/pesonnelfiles/getassociatedcuesinfo') === true">
  <el-col :span="24">
    <caseevent-Management :caseKey="dossierKey" :zdyData="zdyData"></caseevent-Management>
  </el-col>
</el-row>

<!-- 人事社保 -->
<el-row class="people-dossier-card user-bg" :title="subData[11].title" v-show="this.checkRule('jwy/pesonnelfiles/getsocialsecurityinfo') === true">
  <el-col :span="24">
    <social-security :caseKey="dossierKey" :zdyData="zdyData"></social-security>
  </el-col>
</el-row>

<!-- 图片视频 -->
<el-row class="people-dossier-card user-bg" :title="subData[12].title" v-show="this.checkRule('jwy/pesonnelfiles/getpicandvideoinfo') === true">
  <el-col :span="24">
    <picture-video :caseKey="dossierKey"></picture-video>
  </el-col>
</el-row>

<!-- 关联线索 -->
<!--<el-row class="people-dossier-card" :title="subData[12].title">-->
<!--<el-col :span="24">-->
<!--<related-clues :caseKey="dossierKey" :zdyData="zdyData"></related-clues>-->
<!--</el-col>-->
<!--</el-row>-->

<!-- 其它 -->
<!-- <el-row class="people-dossier-card" v-show="this.checkRule('Search/SearchAggrNextPage') === true">
    <el-col :span="24">
      <association-clues :caseKey="dossierKey"></association-clues>
    </el-col>
  </el-row> -->

<!-- 自定义相关追加节点 -->
<el-row class="people-dossier-card user-bg" v-if="checkRule('Search/SyncSearch') === true" title="相关信息">
  <el-col :span="24">
    <div class="header-tool" style="border-bottom:2px solid #46BDFD">
      <span class="d-sub-title iconfont icon-iconziti23" style="color:#46BDFD;font-size: 14px;line-height: 45px">相关信息</span>
    </div>
    <!-- :title="socketTable.TableInfo.ZyName"  -->
    <div class="dossier-content" style="padding:0 20px">
      <search :flag='true' v-for="(socketTable,socketTableIndex) in socketTableList" :key="socketTableIndex" :keyword="dossierKey" :searchWhere="searchWhere" :table="socketTable"></search>
    </div>
  </el-col>
</el-row>

</div>
</template>
<style scoped lang="scss">
  .people-dossier-card {
    background-color: #fff;
    padding: 0 10px 25px;
    margin-bottom: 12px;
    .dossier-content {
      .d-sub-title {
         ::before {
          content: '';
        }
      }
    }
  }

  .card-sub-title {
    color: #46bbfb;
    float: right;
    padding: 15px 0;
    cursor: pointer;
  }

  .empty_h {
    height: 113px;
  }

</style>

<script>
  import { SYNC_SEARCH, FETCH_RESULT_FROM_OBJECT } from '../../../store/types'
  import { FWZX_PATH } from '../../../config'
  import basicInfo from './modules/basic-info'
  import kinship from './modules/kinship'
  import certificate from './modules/certificate'
  import communicationMode from './modules/communication-mode'
  import virtualAccount from './modules/virtual-account'
  import trajectory from './modules/trajectory2'
  import callLaw from './modules/calllaw'
  import property from './modules/property'
  import socialConnection from './modules/social-connection'
  import caseeventManagement from './modules/caseevent-management'
  import socialSecurity from './modules/social-security'
  import pictureVideo from './modules/picture-video'
  import search from './modules/search'
  import relation from './modules/relation'
  import cardHeader from './modules/card-header.vue'
  // import relatedClues from './modules/related-clues'
  // import associationClues from './modules/association-cluesTTT'
  import bus from '../../../utils/bus'
  import dossierMixin from '../dossierMixin'
  import { mapState } from 'vuex'
  export default {
    mixins: [dossierMixin],
    components: {
      basicInfo,
      kinship,
      certificate,
      communicationMode,
      virtualAccount,
      trajectory,
      callLaw,
      property,
      socialConnection,
      caseeventManagement,
      socialSecurity,
      pictureVideo,
      search,
      relation,
      cardHeader
      //    relatedClues,
      // associationClues
    },
    computed: {
      ...mapState(['users', 'dossier', 'analysisRelation'])
    },
    data() {
      return {
        rod: FWZX_PATH,
        zdyData: [],
        mz: '',
        telNum: '',
        guid: '',
        idCard: '',
        searchWhere: [{
          Keyword: '',
          KeywordType: '0',
          Name: '',
          SearchType: 0
        }],
        exportWordId: '',
        relationList: [],
        columnTab: [
          { label: '名称', prop: 'ms' },
          { label: '关系类型', prop: 'type' },
          { label: '身份证号码/车牌号/手机号', prop: 'zjhm' }
        ],
        loading: true
      }
    },
    methods: {
      /**
       * 初始化人员档案
       */
      initList() {
        this.subData = [
          { title: '基础信息', number: 0 },
          { title: '亲属人群', number: 0 },
          { title: '证件信息', number: 0 },
          { title: '通信方式', number: 0 },
          { title: '虚拟账号', number: 0 },
          { title: '轨迹规律', number: 0 },
          { title: '关系分析', number: 0 },
          { title: '通话规律分析', number: 0 },
          { title: '财产信息', number: 0 },
          { title: '社交关系', number: 0 },
          { title: '案事件关联', number: 0 },
          { title: '人事社保', number: 0 },
          { title: '图片视频', number: 0 },
          { title: '相关信息', number: 0 }
        ]
        bus.$emit('update:dossierSubTitle', this.subData) // 左侧菜单列表
        bus.$emit('update:dossierTitle', '人员档案') // 头部标题
        bus.$on('clickEvent:menuSubTitle', item => { // 点击侧栏导航回调
          this.menuChangeClick(item.title)
        })
        this.loadData()
      },
      loadData() {},
      /**
       * 获取通讯号码
       * @param val
       */
      telListChange(val) {
        this.telNum = val
      },
      exportWord() {
        this.exportWordId = this.$route.query.key;
        this.$nextTick(() => {
          this.$refs.sendData.submit()
        })
      },
      displayDetail() {
        window.open('/#' + `analysis/relation?key=${this.idCard}`)
      }
    },
    mounted() {
      this.parentNodeScroll('dossier-list-ref') // 页面滚动监控
      this.updateRollDict('dossier-list-ref') // 页面滚动监控
      this.dossierSocketAppend(this.guid) // 档案列表Socket追加栏目
      this.idCard = this.$route.query.key;
      bus.$emit('update:idCard', this.idCard)
      this.dispatch(FETCH_RESULT_FROM_OBJECT, {
        type: 4,
        keyword: this.idCard
      }, undefined, undefined, undefined, undefined, { autoCancelLoading: false }).then(() => {
        let relax = this.analysisRelation.ListForResultFromObject.relationList;
        relax.map(item => {
          let jsonPage = {}
          jsonPage.type = item.type[0]
          jsonPage.ms = item.endNode.ms || item.endNode.NAME + '(省略' + item.endNode.NUM + '条)'
          jsonPage.zjhm = item.endNode.zjhm || item.endNode.bjhm || item.endNode.jdchphm
          this.relationList.push(jsonPage)
        })
        this.loading = false;
        this.expandMark = true;
      })
    },
    created() {
      this.initList()

      // 初始化用户专属GUID
      this.guid = Date.parse(new Date()) + '_' + this.users.UserLogin.UserData.UserId

      // 优先读取检索接口, 跳开JAVA阻塞
      if (this.checkRule('Search/SyncSearch') === true) {
        this.searchWhere[0].Keyword = this.dossierKey
        this.dispatch(SYNC_SEARCH, {
          SearchWhere: this.searchWhere,
          TypeId: 0,
          SearchType: 0,
          TableIDs: [],
          FlTypeIDs: [],
          NotifyID: this.guid,
          IsSearchAggregations: false
        })
      }
    },
    watch: {
      socketTableList(val) {
        let number = 0
        val.forEach(d => {
          number += d.Total
        })
        bus.$emit('update:dossierSubTitleNumber', { 'title': '相关信息', 'number': number })
      },
      relationList(val) {
        bus.$emit('update:dossierSubTitleNumber', { 'title': '关系分析', 'number': val.length })
      }
    }
  }

</script>
