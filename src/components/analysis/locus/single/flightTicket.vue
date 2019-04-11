<template>
<!-- 个人航班同订票分析 -->
<!-- 本页套数据 -->
<div class="tel-list">
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <div class="tabs">
        <div :class="{'tabs__item':true,'current':currentTab===i}" v-for="(item,i) in tabs" @click="currentTab=i">
          {{item.keyVal}}
          <i class="iconfont icon-close" @click.stop="removeTab(item)"></i>
        </div>
      </div>
    </el-col>
    <el-col :span="4" class="collap-col">
      <div class="collap-box pointer">
        <slot name="switchRightBarBtn"></slot>
      </div>
    </el-col>
  </el-row>

  <div class="tabs-box">
    <div class="tabs-box__item" v-for="(item,i) in tabs" v-show="i===currentTab">
      <searchBox>
        <div slot="formBox">
          <el-form :model="item.queryForm" :inline="true" label-position="right" label-width="90px">
            <el-form-item label="时间区间">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm, val)" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <el-form-item label="同乘次数">
              <el-select v-model="item.queryForm.timeLabel" placeholder="请选择" class="small">
                <el-option v-for="item in logicOps" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
              <el-input-number v-model="item.queryForm.timeLeght" class="small" size="small" :min="1" :max="1000"></el-input-number>
            </el-form-item>
            <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query">分析</el-button>
          </el-form>
        </div>
      </searchBox>
      <div class="app-content-box">
        <!-- 结果列表 -->
        <div class="res-box" v-if="resBox===true">
          <h3>共同联系人分析</h3>
          <el-table @cell-mouse-enter="cellMouseEnter" :data="item.mainList" v-loading="loading" @row-click="showDetail">
            <el-table-column v-for="item in table.columns" :key="item.prop" :label="item.label" :prop="item.prop" align="center"></el-table-column>
          </el-table>
        </div>
      </div>

    </div>
  </div>

</div>
</template>
<style lang="scss" scoped>
.comm {
    .maker {
        background: #fff;
        height: calc(100vh - 205px);
    }
    .overview-box {
        width: 200px;
        height: 100px;
        position: absolute;
        bottom: 0;
        right: 0;
    }
}
</style>
<script>
import { FETCH_TELLIST_CONTACTS_LIST } from '../../../../store/types'
import locusMixin from '../locusMinxin'

import searchBox from '../../search-tool'
import list from '../detail.vue'
import { NgwGo } from '../../../../utils/ngw.go'
export default {
  mixins: [locusMixin],
  components: {
    searchBox,
    list
  },
  data() {
    return {
      commName: 'flightTicket',
      resBox: false,
      detailBox: false,
      table: {
        columns: [],
        data: []
      },
      mainGo: null,
      diagram: null,
      /**
       * [data 模型数据对象(最终结果)]
       * @type {Object}
       */
      goData: {
        /**
         * [nodeDataArray 节点数据]
         * @type {Array}
         */
        // [], //
        nodeDataArray: [],
        /**
         * [linkDataArray 连线数据]
         * @type {Array}
         */
        // [] //
        linkDataArray: []
      },
      testData: ['622588743697531', '622588523698521', '622587412587412']
    }
  },
  props: [],
  computed: {},
  methods: {
    /**
     * 初始化建模器(GOJS)
     * @return {[type]} [description]
     */
    /**
     * 初始化建模器(GOJS)
     * @return {[type]} [description]
     */
    initMaker() {
      let self = this;
      if (this.mainGo === null) {
        self.mainGo = new NgwGo({
          diagram: self.diagram,
          data: self.goData,
          readOnly: true,
          overview: 'overViewBox'
        })
      }
      self.mainGo.init()
    },
    query() {
      this.fetchMainList()
      this.resBox = true
      this.detailBox = false
    },
    fetchMainList() {
      let target = this.tabs[this.currentTab],
        queryForm = this.delEmpey({
          v_zjhm: target.IDcard, //  主叫号码   String  是
          v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 String 否
          v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 String 否
          v_gsd: '', // 归属地 String 否
          v_thsctj: target.queryForm.timeLabel, // 通话时长条件 String 否
          v_thsctjz: target.queryForm.timeLeght, // 通话时长条件值 String 否
          v_gtrs: target.queryForm.num, // 共同人数 Int 是
          v_rwid: '' // 任务ID String 否
        })

      this.dispatch(FETCH_TELLIST_CONTACTS_LIST, queryForm).then(() => {
        for (let item in this.analysisTelList.contactsList.DTMain[0]) {
          this.table.columns.push({
            prop: item,
            label: item
          })
        }
        target.mainList = this.analysisTelList.contactsList.DTMain
      })
    },
    showDetail() {
      this.detailBox = true
      this.initMaker()
    }
  },
  created() {},
  mounted() {
  }
}
</script>
