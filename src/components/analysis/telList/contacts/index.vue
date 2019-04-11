<template>
<!-- 共同联系人分析 -->
<!-- 本页吴杰套数据 -->
<div class="tel-list root" v-loading="loading" element-loading-text="拼命分析计算中……">
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <div class="tabs">
        <div :class="{'tabs__item':true,'current':currentTab===i}" v-for="(item,i) in tabs" :key="i" :title="item.keyVal" @click="currentTab=i">
          <!--{{item.keyVal}}-->
          共同联系人分析
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
    <div class="tabs-box__item" v-for="(item,i) in tabs" :key="i" v-show="i===currentTab">
      <searchBox >
        <div slot="formBox">
          <el-form :model="item.queryForm" :inline="true" label-position="right" label-width="90px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="分析号码">
                  <span v-for="(val,i) in item.vals" :key="i">
                    <span>{{val}}</span>[{{item.names[i]}}] <i @click.stop="removeTab({guid:item.guid[i]})" class="iconfont icon-close"></i>
                     {{(i < item.vals.length - 1 ? ', ' : '')}} </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-button type="primary" class="analysis primary-btn" native-type="submit" @click.prevent="query">分析</el-button>
            <el-form-item label="时间段">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm, val?val:'')" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <el-form-item label="通话时长">
              <el-select v-model="item.queryForm.timeLabel" placeholder="请选择" class="small">
                <el-option v-for="item in logicOps" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
              <el-input-number v-model="item.queryForm.timeLeght" class="small" size="small" :min="1" :max="1000"></el-input-number>
              (秒)
            </el-form-item>
            <!-- <el-form-item label="通话次数">
              <el-select class="small" v-model="item.queryForm.callCountLabel" placeholder="请选择">
                <el-option v-for="item in logicOps" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
              <el-input-number class="small" v-model="item.queryForm.callCount" size="small" :min="1" :max="1000"></el-input-number>
            </el-form-item> -->
            <el-form-item label="归属地">
              <el-input v-model="item.queryForm.attribution" placeholder="请输入归属地"></el-input>
            </el-form-item>
            <el-form-item label="共同人数">
              <el-input-number v-model="item.queryForm.peopleNum" size="small" :min="2" :max="item.vals.length" class="small"></el-input-number>
            </el-form-item>
            <!-- <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query">分析</el-button> -->
          </el-form>
        </div>
      </searchBox>
      <div class="app-content-box">
        <!-- 结果列表 -->
        <el-collapse v-model="activeNames" v-show="resBox===true && !loading" @change="collapseChange">
          <el-collapse-item title="结果列表" name="table">
        <div class="res-box" v-if="resBox===true && !loading">
          <h3>共同联系人分析</h3>
<list :list="table.resData" :canViewMap="false" :tab="table.tabList" :pagenav="pageInfo"></list>

          <div class="app-toolbar footer">
            <pagination :count="pageInfo.count" :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}" @update:pagenav="pagenavChange"></pagination>
          </div>
        </div>
          </el-collapse-item>
            <el-collapse-item title="结果关系图" name="chart">
        <el-tabs v-show="detailBox===true && !loading" :style="fullScreenStyle">
          <el-tab-pane label="共同联系人分析">
            <div class="spc-tab-right-box">
              <el-button @click="toggleFullScreen(chartIsFullScreen)"  >
<i v-if="chartIsFullScreen" class="iconfont icon-min"></i>
<i v-else class="iconfont icon-max"></i>

              {{chartIsFullScreen ? '缩小': '全屏'}}</el-button>
              <el-button @click="setLayout('GridLayout','telListContactsOverlappGoBox')">
<i class="icon iconfont icon-guanlian1"></i>

              网格</el-button>
              <el-button @click="setLayout('LayeredDigraphLayout','telListContactsOverlappGoBox')">
<i class="icon iconfont icon-data-slice"></i>

              分层</el-button>
              <el-button @click="setLayout('CircularLayout','telListContactsOverlappGoBox')">
<i class="icon iconfont icon-fenleijishougongtongbu"></i>

              圆形</el-button>
              <el-button @click="setLayout('ForceDirectedLayout','telListContactsOverlappGoBox')">
<i class="icon iconfont icon-hudong"></i>

              反牵引力</el-button>
              <el-button @click="setLayout('TreeLayout','telListContactsOverlappGoBox')">
<i class="icon iconfont icon-ranking"></i>

              树形</el-button>
            </div>
            <gocharts ref="telListContactsOverlappGoBox" boxId="telListContactsOverlappGoBox" :data="goData" @link-click="linkClickEvent" :options="goOptions" :style="chartStyle"></gocharts>
          </el-tab-pane>
        </el-tabs>
          </el-collapse-item>
          </el-collapse>
      </div>

    </div>
  </div>

  <!-- 详单查询 -->
  <detail-list-dialog :dialog="detailDialog" :queryCondition="detailQueryCondition" @close="detailDialog = false"></detail-list-dialog>
</div>
</template>
<style lang="scss" scoped>
  .root {
    height: calc(100vh - 60px);
  }

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

  .primary-btn {
    position: relative;
    top: 1px;
    left: 0;
  }

</style>
<script>
  import { FETCH_TELLIST_CONTACTS_LIST } from '../../../../store/types'
  import telListMixin from '../telListMixin'

  import searchBox from '../../search-tool'
  import list from '../list'
  import gocharts from '../../../../widgets/gocharts/gocharts'
  import { clone } from '../../../../utils/util'
  import detailListDialog from '../detail-list-dialog.vue'
  import pagination from '../../../../widgets/pagination/pagination.vue'
  export default {
    mixins: [telListMixin],
    components: {
      detailListDialog,
      searchBox,
      list,
      gocharts,
      pagination
    },
    data() {
      return {
        activeNames: ['table', 'chart'],
        detailDialog: false,
        detailQueryCondition: null,
        pageInfo: { // 页面分页信息相关配置
          count: 10,
          limit: 500,
          currentpage: 1
        },
        singleTab: true,
        commName: 'contacts',
        resBox: false,
        detailBox: false,
        table: { // 表格数据
          tabList: [
            { label: '联系号码', prop: '联系号码' }
          ],
          resData: []
        },
        chartDataList: [],
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
        }
      }
    },
    props: [],
    computed: {},
    methods: {
      /**
       * 分页操作
       */
      pagenavChange(obj) {
        // 分页切换操作
        this.pageInfo.limit = obj.limit
        this.pageInfo.currentpage = obj.currentpage
        this.query()
      },
      /**
       * 初始化建模器(GOJS)
       * @return {[type]} [description]
       */
      initMaker() {
        //        let _charD = {
        //          nodeDataArray: [],
        //          linkDataArray: []
        //        }
        //        this.suspectCasePeople.PageData.map(r => {
        //          _charD.nodeDataArray.push({
        //            key: r.id,
        //            category: 'main',
        //            name: r.xm,
        //            text: r.xm
        //          })
        //          _charD.linkDataArray.push({
        //            from: r.xyrsj ? r.xyrsj : '0',
        //            to: r.id,
        //            curviness: '0'
        //          })
        //        })
        //        this.chartDataList = [_charD]
      },
      query() {
        if (this.currentTabItem.vals.length < 2) {
          this.$alert('必需选择一个以上不同的手机号码', '温馨提示');
          return false
        }
        this.table.resData = []
        this.fetchMainList()
        this.resBox = true
        this.detailBox = true
      },
      fetchMainList() {
        let target = this.currentTabItem,
          queryForm = this.delEmpey({
            v_zjhm: target.vals.join(','), //  主叫号码   String  是
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 String 否
            v_gsd: '', // 归属地 String 否
            v_thsctj: target.queryForm.timeLabel, // 通话时长条件 String 否
            v_thsctjz: target.queryForm.timeLeght, // 通话时长条件值 String 否
            v_gtrs: target.queryForm.peopleNum, // 共同人数 Int 是
            v_rwid: '' // 任务ID String 否
          })

        this.dispatch(FETCH_TELLIST_CONTACTS_LIST, queryForm).then(() => {
          // 列表
          let _tempTabList = this.table.tabList.map(rt => {
            return rt.prop
          })
          this.table.resData = this.analysisTelList.contactsList.DTMain.map(rDTM => {
            for (let tabV in rDTM) {
              if (!_tempTabList.includes(tabV)) {
                _tempTabList.push(tabV)
                this.table.tabList.push({
                  label: tabV,
                  prop: tabV
                })
              }
            }
            return rDTM
          })
          this.pageInfo.count = this.table.resData.length
          // GO数据
          this.goData.nodeDataArray = this.analysisTelList.contactsList.GTLXRRYList.map(d => {
            return {
              key: d.id,
              category: 'tel',
              loc: '0 0',
              name: '节点',
              text: d.value,
              isToLink: false,
              color: '#666'
            }
          })
          this.goData.linkDataArray = this.analysisTelList.contactsList.GTLXRGXList.map(d => {
            return {
              from: d.object1,
              to: d.object2,
              text: d.beizhu,
              visible: true
            }
          })
          this.$refs.telListContactsOverlappGoBox[0].initMaker()
        })
      },
      showDetail(row, e, column) {
        // console.log('showDetail>>', row, e, column)
        this.detailBox = true
        this.initMaker()
      },
      /**
       * 关系图连线点击
       * @param reObj
       */
      linkClickEvent(reObj) {
        let _clickObj = reObj.targetObj.data
        //  图表点击查询话单详情 （1 - 4 类型）
        this.detailDialog = true
        // 查询条件
        let _currentQuery = Object.assign({}, clone(this.tabs[this.currentTab]))
        _currentQuery.keyVal = _clickObj.from
        _currentQuery.queryForm.otherPhone = _clickObj.to
        //  详单列表查询
        this.detailQueryCondition = Object.assign({}, _currentQuery)
      },
      collapseChange(val) {
        console.log(val)
      }
    },
    created() {},
    mounted() {}
  }

</script>
