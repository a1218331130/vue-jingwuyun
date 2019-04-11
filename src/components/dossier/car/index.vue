<template>
<div class="car-dossier" ref="dossier-list-ref" id="dossier-list-ref">

  <!-- 车辆基础信息 -->
  <el-row class="car-dossier-card user-bg" :title="subData[0].title">
    <el-col :span="24">
      <car-info :carKey="dossierKey" :jdcfdjddjh="fdjhm"></car-info>
    </el-col>
  </el-row>

  <!-- 车主信息 -->
  <el-row class="car-dossier-card user-bg" :title="subData[1].title" v-show="this.checkRule('jwy/vehicleFile/getCheZhuInfo', true) === true">
    <el-col :span="24">
      <kin-ship :carKey="dossierKey" :zdyData="zdyData" :jdcfdjddjh="fdjhm"></kin-ship>
    </el-col>
  </el-row>


  <!-- 违法信息 -->
  <el-row class="car-dossier-card user-bg" :title="subData[2].title" v-show="this.checkRule('jwy/vehicleFile/getAreaList', true) === true">
    <el-col :span="24">
      <peccancy :carKey="dossierKey" :jdcfdjddjh="fdjhm"></peccancy>
    </el-col>
  </el-row>
  <!-- 主要活动区域 -->
  <!-- <el-row class="car-dossier-card user-bg" :title="subData[3].title" v-show="this.checkRule('jwy/vehicleFile/getAreaList', true) === true">
    <el-col :span="24">
      <zone-action :carKey="dossierKey"></zone-action>
    </el-col>
  </el-row> -->

  <!-- 卡口信息 -->
  <el-row class="car-dossier-card user-bg" :title="subData[3].title" v-show="this.checkRule('jwy/vehicleFile/getkako', true) === true">
    <el-col :span="24">
      <bayonet-info :carKey="dossierKey" :jdcfdjddjh="fdjhm"></bayonet-info>
    </el-col>
  </el-row>

  <!--&lt;!&ndash; 证件信息 &ndash;&gt;-->
  <!--<el-row class="car-dossier-card" :title="subData[5].title">-->
  <!--<el-col :span="24">-->
  <!--<certificates></certificates>-->
  <!--</el-col>-->
  <!--</el-row>-->

  <!-- 牌曾挂车 -->
  <el-row class="car-dossier-card user-bg" :title="subData[4].title" v-show="this.checkRule('jwy/vehicleFile/getCCGPList', true) === true">
    <el-col :span="24">
      <brand-history :carKey="dossierKey"></brand-history>
    </el-col>
  </el-row>

  <!-- 车曾挂牌 -->
  <el-row class="car-dossier-card user-bg" :title="subData[5].title" v-show="this.checkRule('jwy/vehicleFile/getPCGCList', true) === true">
    <el-col :span="24">
      <car-history :carKey="dossierKey" :jdcfdjddjh="fdjhm" :clxh="clxh"></car-history>
    </el-col>
  </el-row>

  <!-- 涉案信息 -->
  <el-row class="car-dossier-card user-bg" :title="subData[6].title" v-show="this.checkRule('jwy/vehicleFile/getSheAnInfo', true) === true">
    <el-col :span="24">
      <involved :carKey="dossierKey" :clxh="clxh"></involved>
    </el-col>
  </el-row>


  <!--&lt;!&ndash; 违章记录 &ndash;&gt;-->
  <!--<el-row class="car-dossier-card" :title="subData[10].title">-->
  <!--<el-col :span="24">-->
  <!--<violation-record :carKey="dossierKey"></violation-record>-->
  <!--</el-col>-->
  <!--</el-row>-->

  <!-- 参数配置 -->
  <el-row class="car-dossier-card user-bg" :title="subData[7].title" v-show="this.checkRule('Car/GetCarInfo', true) === true">
    <el-col :span="24">
      <parameter :carKey="dossierKey" :jdcfdjddjh="fdjhm"></parameter>
    </el-col>
  </el-row>

  <!-- 轨迹规律统计 -->
  <el-row class="car-dossier-card user-bg" :title="subData[8].title">
    <el-col :span="24">
      <trajectory></trajectory>
    </el-col>
  </el-row>

  <!-- 关联线索 -->
  <!-- <el-row class="car-dossier-card" :title="subData[8].title" v-show="this.checkRule('Search/SearchAggrNextPage', true) === true">
    <el-col :span="24">
      <association-clues :carKey="dossierKey"></association-clues>
    </el-col>
  </el-row> -->

  <!-- 相关信息 -->
  <el-row class="car-dossier-card user-bg" v-if="checkRule('Search/SyncSearch') === true" title="相关信息">
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

  <!-- 自定义相关追加节点 -->
  <!-- <el-row class="car-dossier-card user-bg" v-if="checkRule('Search/SyncSearch') === true" :title="socketTable.TableInfo.ZyName" v-for="(socketTable,socketTableIndex) in socketTableList" :key="socketTableIndex">
    <el-col :span="24">
      <search :keyword="dossierKey" :searchWhere="searchWhere" :table="socketTable"></search>
    </el-col>
  </el-row> -->

</div>
</template>
<style scoped lang="scss">
  .car-dossier {
    width: 100%;
    margin: 20px auto;
  }

  .car-dossier-card {
    background-color: #fff;
    padding: 0 10px 25px;
    margin-bottom: 12px;
  }

</style>

<script>
  import { SYNC_SEARCH } from '../../../store/types'

  import bus from '../../../utils/bus'
  import carInfo from './modules/car-info.vue'
  import kinShip from './modules/kinship.vue'
  import contact from './modules/contact.vue'
  import addRessPage from './modules/add-ress-page.vue'
  import zoneAction from './modules/zone-action.vue'
  import certificates from './modules/certificates.vue'
  import brandHistory from './modules/brand-history.vue'
  import carHistory from './modules/car-history.vue'
  import involved from './modules/involved.vue'
  import associationClues from './modules/association-clues.vue'
  import violationRecord from './modules/violation-record.vue'
  import parameter from './modules/parameter.vue'
  import trajectory from './modules/trajectory.vue'
  import peccancy from './modules/peccancy.vue'
  import bayonetInfo from './modules/bayonet-info.vue'

  import search from '../people/modules/search'

  // import { CUSTOM_ARCHIVES } from '../../../store/types'
  import dossierMixin from '../dossierMixin'
  import { mapState } from 'vuex'
  export default {
    mixins: [dossierMixin],
    components: {
      carInfo,
      kinShip,
      contact,
      addRessPage,
      zoneAction,
      certificates,
      brandHistory,
      carHistory,
      involved,
      associationClues,
      violationRecord,
      parameter,
      trajectory,
      search,
      peccancy,
      bayonetInfo // 卡口信息
    },
    computed: {
      ...mapState(['users', 'dossier'])
    },
    data() {
      return {
        rollDict: [],
        thisDOM: 'dossier-list-ref',
        zdyData: [],
        guid: '',
        number: 0,
        searchWhere: [{
          Keyword: '',
          KeywordType: '0',
          Name: '',
          SearchType: 0
        }]
      }
    },
    watch: {
      // socketTableList(val) {
      //   this.subData.push({
      //     title: val[this.number].TableInfo.ZyName
      //   })
      //   this.number++;
      //   bus.$emit('update:dossierSubTitle', this.subData) // 左侧菜单列表
      // }
      socketTableList(val) {
        let number = 0
        val.forEach(d => {
          number += d.Total
        })
        bus.$emit('update:dossierSubTitleNumber', { 'title': '相关信息', 'number': number })
      }
    },
    methods: {
      /**
       * 初始化档案
       */
      initList() {
        this.subData = [
          { title: '基础信息', number: 0 },
          { title: '车主信息', number: 0 },
          { title: '违法信息', number: 0 }, // { title: '主要活动区域', number: 0 },
          { title: '卡口信息', number: 0 },
          { title: '牌曾挂车', number: 0 },
          { title: '车曾挂牌', number: 0 },
          { title: '涉案信息', number: 0 },
          { title: '参数配置', number: 0 },
          { title: '轨迹规律统计', number: 0 },
          { title: '相关信息', number: 0 }
        ]
        bus.$emit('update:dossierSubTitle', this.subData) // 左侧菜单列表
        bus.$emit('update:dossierTitle', '车辆档案') // 头部标题
        bus.$on('clickEvent:menuSubTitle', item => { // 点击侧栏导航回调
          this.menuChangeClick(item.title)
        })
        this.loadData()
      },
      loadData() {}
    },
    mounted() {
      this.parentNodeScroll('dossier-list-ref') // 页面滚动监控
      this.updateRollDict('dossier-list-ref') // 页面滚动监控
      this.dossierSocketAppend(this.guid) // 档案列表Socket追加栏目
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
    }
  }

</script>
