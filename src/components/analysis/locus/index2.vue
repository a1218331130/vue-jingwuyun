<template>
<analysis-box @call:showMiniModel="showMiniModel">
  <div slot="sunWest">
    <sidebar @call:comm="commChange" :miniModel="miniModel"></sidebar>
  </div>

  <div slot="sunCenter" class="sunCenter">
    <!--活动规律-->
    <!-- <detail v-show="currentComm==='detail'" :currentComm="currentComm" :deliveryNumber="deliveryNumber"  @update:current-tab="deliveryNumber=null">
         <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
       </detail>-->
    <activityRule v-show="currentComm==='activityRule'" ref="activityRule" :currentComm="currentComm" :deliveryNumber="deliveryNumber"  @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </activityRule>
    <!--旅店-->
    <hotel v-show="currentComm==='hotel'" ref="hotel" :currentComm="currentComm" :deliveryNumber="deliveryNumber"  @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </hotel>
    <!--网吧-->
    <cyberBar v-show="currentComm==='cyberBar'" ref="cyberBar" :currentComm="currentComm" :deliveryNumber="deliveryNumber"  @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </cyberBar>
    <!--铁路-->
    <ralway v-show="currentComm==='ralway'" ref="ralway" :currentComm="currentComm" :deliveryNumber="deliveryNumber"  @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </ralway>
    <!--航班同离港-->
    <flight-departure v-show="currentComm==='flightDeparture'" ref="flightDeparture" :currentComm="currentComm" :deliveryNumber="deliveryNumber"  @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </flight-departure>
    <!--航班同订票-->
    <flight-ticket v-show="currentComm==='flightTicket'" ref="flightTicket" :currentComm="currentComm" :deliveryNumber="deliveryNumber"  @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </flight-ticket>
    <!--多人旅店-->
    <manyHotel v-show="currentComm==='manyHotel'" ref="manyHotel" :currentComm="currentComm" :deliveryNumber="deliveryNumber"  @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </manyHotel>
    <!--多人网吧-->
    <manyCyberBar v-show="currentComm==='manyCyberBar'" ref="manyCyberBar" :currentComm="currentComm" :deliveryNumber="deliveryNumber"  @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </manyCyberBar>
    <!--多人铁路-->
    <manyRalway v-show="currentComm==='manyRalway'" ref="manyRalway" :currentComm="currentComm" :deliveryNumber="deliveryNumber"  @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </manyRalway>
    <!--多人航班同离港-->
    <manyFlightDeparture v-show="currentComm==='manyFlightDeparture'" ref="manyFlightDeparture" :currentComm="currentComm" :deliveryNumber="deliveryNumber"  @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </manyFlightDeparture>
    <!--多人航班同订票-->
    <manyFlightTicket v-show="currentComm==='manyFlightTicket'" ref="manyFlightTicket" :currentComm="currentComm" :deliveryNumber="deliveryNumber"  @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </manyFlightTicket>
    <!--多时空-->
    <multi v-show="currentComm==='multi'" ref="multi" :currentComm="currentComm" :deliveryNumber="deliveryNumber"  @update:current-tab="deliveryNumber=null">
    </multi>

    <!-- 侧边栏(右工具按钮) -->
    <side-right-box :unfoldHandle="showRightBar">
      <!--<el-tree :data="treeData" show-checkbox node-key="id" :default-apanded-key="[2,3]" :default-cheched-keys="[5]"-->
      <!--:props="defaultProps">-->
      <!--</el-tree>-->
      <!--<el-tree ref="rightTree" class="cat-tree" :show-checkbox="true" :data="treeData" node-key="id" @node-click="rightTreeChange"></el-tree>-->

      <el-tree ref="rightTree" class="cat-tree" :data="treeData" :show-checkbox="true" node-key="id" @check-change="rightTreeChange"></el-tree>
    </side-right-box>

    <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="caseDialog" title="选择案件" :modal-append-to-body="true" :append-to-body="true" size="small--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
      <el-form :inline="true" label-width="100">
        <el-form-item prop="caseId" label="选择案件">
          <case-selector :width="170" @update:value="val=>this.caseId=val.caseId"></case-selector>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="choseCase" :disabled="this.caseId===''">确认</el-button>
      </div>
    </el-dialog>
  </div>

</analysis-box>
</template>

<style scoped lang='scss'>
.sunCenter {
    overflow: hidden;
    .side-box {
        top: 97px;
        height: calc(100% - 130px);
        z-index: 999;
    }
    .el-tree {
        border: none;
    }
}
</style>

<script>
import { mapState } from 'vuex'
import analysisBox from '../layout'
import activityRule from './single/activityRule.vue'
import cyberBar from './single/cyberBar.vue'
import flightDeparture from './single/flightDeparture.vue'
import flightTicket from './single/flightTicket.vue'
import hotel from './single/hotel.vue'
import ralway from './single/ralway.vue'
import manyCyberBar from './many/cyberBar.vue'
import manyFlightDeparture from './many/flightDeparture.vue'
import manyFlightTicket from './many/flightTicket.vue'
import manyHotel from './many/hotel.vue'
import manyRalway from './many/ralway.vue'
import multi from './trail/multi.vue'
import sidebar from './sidebar'
//  import {getOnlyArray} from '../../../utils/util'
//  import detail from './detail'
import sideRightBox from '../../../widgets/right-toolbar/side-right-box.vue'
import caseSelector from '../../../widgets/case-selector/case-selector'
import { FETCH_SUSPECT_CASE_PEOPLE_LIST } from '../../../store/types'
// import { FETCH_SUSPECT_CASE_PEOPLE_LIST } from '../../../store/types'
import baseMixin from '../baseMixin'
export default {
  mixins: [baseMixin],
  components: {
    analysisBox,
    sidebar,
    sideRightBox,
    caseSelector,
    activityRule,
    cyberBar,
    flightDeparture,
    flightTicket,
    hotel,
    manyCyberBar,
    manyFlightDeparture,
    manyFlightTicket,
    manyHotel,
    manyRalway,
    multi,
    ralway
  },
  data() {
    return {
      currentComm: 'activityRule', // activityRule
      miniModel: false,
      unfoldT: false,
      treeData: [],
      defaultProps: [],
      showRightBar: false, // 当前侧栏窗体是否展开状态中继
      comm: null,
      caseDialog: false,
      caseId: '',
      switchRightBarBtn: false
    }
  },
  props: {},
  computed: {
    ...mapState(['analysisLocus', 'suspectCasePeople', 'analysisTelList'])
  },
  watch: {
    currentComm(val) {
      // if (val === 'multi') {
      //   this.showRightBar = false
      // } else if (this.treeData.length === 0) {
      //   this.fetchNumberTree()
      // }
    }
  },
  methods: {
    initDialog() {
      this.caseId = ''
    },
    closeEvent() {
      if (this.caseId === '') {
        this.$message({
          type: 'error',
          message: '必需选择一个案件进行分析入口',
          showClose: true
        })
        // this.currentComm = ''
        // this.caseDialog = false
      } else {
        this.fetchNumberTree()
        this.caseDialog = false
      }
    },
    choseCase() {
      this.closeEvent()
    },
    fetchNumberTree() {
      console.log(this.caseId, this.showRightBar);
      if (this.caseId === '' && this.currentComm !== 'multi') {
        this.caseDialog = true
      } else {
        let ress = []
        ress.push({
          id: '2',
          label: '测试',
          children: []
        })
        /**
         * 请求获取右侧树
         */
        this.dispatch(FETCH_SUSPECT_CASE_PEOPLE_LIST, { ajid: this.caseId, PageIndex: 1, PageSize: 500 }).then(d => {
          let scp = []
          this.suspectCasePeople.PageData.map(d => {
            if (d.sfz !== '' && d.sfz !== null) {
              scp.push({
                id: d.id,
                guid: d.sfz,
                label: d.xm
              })
            }
          })
          console.log('嫌疑人', scp)
          this.treeData = scp
          this.loading = false
        })
        //          this.dispatch(FETCH_TELLIST_TREE, {ajid: this.caseId}).then(d => {
        //            let res = [],
        //              names = getOnlyArray(this.suspectCasePeople.tree.map(d => d.XM))
        //            console.log('names的数据', names)
        //            if (names.length !== 0) {
        //              names.forEach((n, i) => {
        //                res.push({
        //                  id: i,
        //                  label: n,
        //                  children: []
        //                })
        //              })
        //            } else {
        //              res.push(
        //                {
        //                  id: '2',
        //                  label: '测试',
        //                  children: []
        //                }
        //              )
        //            }
        //          })
        //          console.log('这是树的节点数据', ress)
        //          this.treeData = ress
        //          this.loading = false
      }
    },
    showMiniModel() {
      this.miniModel = !this.miniModel
    },
    unfoldHandle(s) {
      // 外部操作更新窗体状态
      this.unfoldT = !this.unfoldT
    }
  },
  mounted() {},
  created() {
    this.fetchNumberTree()
  }
}
</script>
