<template>
<!-- 通话基站分析 -->
<!-- 已有地图, 春哥帮忙对接 -->
<div class="tel-list root" style="height: 100%" v-loading="tabLoading?!tabLoading:loading" element-loading-text="拼命分析计算中……">
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <div class="tabs">
        <div :class="{'tabs__item':true,'current':currentTab===i}" v-for="(item,i) in tabs" :key="i" :title="item.keyVal" @click="currentTab=i">
          <!--{{item.keyVal}}-->
          通话基站分析
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

  <div class="tabs-box" style="height: 100%">
    <div class="tabs-box__item" style="height: 100%" v-for="(item,i) in tabs" v-show="i===currentTab" :key="i">
      <searchBox>
        <div slot="formBox">
          <el-form :model="item.queryForm" :inline="true" label-position="right" label-width="90px">

            <el-row>
              <el-col :span="24">
                <el-form-item label="分析号码">
                  <span v-for="(val,i) in item.vals" :key="i">
                    {{val}}[{{item.names[i]}}] <i @click.stop="removeTab({guid:item.guid[i]})" class="iconfont icon-close"></i>
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
                <el-option v-for="(item,logicOpsIn) in logicOps" :label="item.label" :value="item.value" :key="logicOpsIn"></el-option>
              </el-select>
              <el-input-number v-model="item.queryForm.timeLeght" class="small" size="small" :min="1" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item label="通话次数">
              <el-select class="small" v-model="item.queryForm.callCountLabel" placeholder="请选择">
                <el-option v-for="(item,logicOpsIn) in logicOps" :label="item.label" :value="item.value" :key="logicOpsIn"></el-option>
              </el-select>
              <el-input-number class="small" v-model="item.queryForm.callCount" size="small" :min="1" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item label="基站周期">
              <el-select v-model="item.queryForm.cycle" style="width:80px;" :disabled="!item.queryForm.isTime" placeholder="">
                <el-option v-for="(item,cycleListIn) in cycleList" :label="item.label" :value="item.value" :key="cycleListIn"></el-option>
              </el-select>
              <el-radio-group v-model="item.queryForm.isTime" @change="item.queryForm.isTime?'':item.queryForm.cycle = 0">
                <el-radio class="radio" :label="true">时间</el-radio>
                <el-radio class="radio" :label="false">次数</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="对方号码">
              <el-input v-model="item.queryForm.otherPhone" style="width:130px;" placeholder=""></el-input>
            </el-form-item>
            <!-- <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query">分析</el-button> -->
          </el-form>
        </div>
      </searchBox>
      <div class="app-content-box" v-if="resBox===true" style="height: calc(100% - 330px);">
        <el-row style="height: 100%">
          <el-col :span="24" style="height: 100%">
            <div style="height: 100%">
<div class="tel-list-tab-box" v-loading="tabLoading" v-resizable>
                <el-switch v-model="showLine" on-text="连线吗" off-text="不连" style="position:absolute; top:10px; right:5px; z-index:2;"></el-switch>
                <el-tabs v-model="showTelTab" :active-name="item.vals[0]" @tab-click="tabListClick" element-loading-text="正在加载表格数据……" style="height: 100%">
                    <el-tab-pane :key="telIndex" v-for="(telItem,telIndex) in navList" :label="telItem.label" :name="telItem.label">
                          <el-table :data="telItem.list" border :height="tableHeight" v-if="tabList.length > 0" @expand="tableExpand" @selection-change="tableSelectChange">
                            <el-table-column type="expand">
                              <template scope="props">
                                <el-table :data="props.row.detailList" border height="auto" style="height:auto;" v-if="props.row.detailList.length > 0" @selection-change="tableSelectChange">
                                  <el-table-column type="selection" align="center" v-if="item.queryForm.cycle !== 0"></el-table-column>
                                  <el-table-column type="index" label="序号" align="center"></el-table-column>
                                  <el-table-column v-for="(itemT,indexT) in detailListTabList" :key="indexT" :min-width="itemT.prop==='thdd' ? 250:80" :prop="itemT.prop" :label="itemT.label" align="center"></el-table-column>
                                </el-table>
                              </template>
</el-table-column>
<el-table-column type="selection" align="center" v-if="item.queryForm.cycle === 0"></el-table-column>
<el-table-column type="index" label="序号" align="center"></el-table-column>
<el-table-column v-for="(itemT,indexT) in tabList" :key="indexT" :prop="itemT.prop" :min-width="itemT.prop==='thdd' ? 250:80" :label="itemT.label" align="center"></el-table-column>
</el-table>
</el-tab-pane>
</el-tabs>
</div>
<div style="width: 100%;height: 100%;">
  <pgis class="map-box__item" layer="" ref="pgis" mapStyle="height:100%;" :showSidebar="false" :showTools="false"></pgis>
</div>
</div>
</el-col>
</el-row>
</div>

</div>
</div>

</div>
</template>

<style lang="scss" scoped>
  .root {
    height: calc(100vh - 60px);
  }

  .el-table__expanded-cell {
    padding: 5px 12px;
  }

  .tel-list {
    .primary-btn {
      position: relative;
      top: 1px;
      left: 0;
    }
  }

  .tel-list-tab-box {
    position: absolute;
    background: #fff;
    width: 30%;
    min-width: 350px;
    height: 100%;
    z-index: 2;
    box-shadow: 3px 0 5px rgba(0, 0, 0, 0.49);
  }

  .el-tabs__content {
    height: 100%;
  }

</style>
<script>
  import { FETCH_TELLIST_STATION_LIST } from '../../../../store/types'
  import telListMixin from '../telListMixin'
  // import { clone } from '../../../../utils/util'
  import searchBox from '../../search-tool'
  import list from '../list'
  import pgis from '../../../../widgets/location-selector/pgis.vue'
  import Resizable from '../../../../utils/directives/resizable.js'
  const src = `/static/num/red.png`
  const icon = new window.EzIcon({
    src: src,
    anchor: [0.5, 1],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    opacity: 1
  })
  export default {
    directives: {
      Resizable
    },
    mixins: [telListMixin],
    components: {
      pgis,
      searchBox,
      list
    },
    data() {
      return {
        currItems: {},
        tabItemIndex: 0,
        tabLoading: true,
        showTelTab: '',
        singleTab: true,
        commName: 'station',
        resBox: false,
        showLine: false,
        lines: null,
        tabList: [],
        tabList1: [
          //          {label: '序号', prop: 'xh'},
          { label: '通话日期', prop: 'thrq' },
          { label: '通话地点', prop: 'thdd' },
          { label: '通话次数', prop: 'cs' },
          { label: '通话时长', prop: 'sc' }
        ],
        tabList2: [
          //          {label: '序号', prop: 'xh'},
          { label: '通话地点', prop: 'thdd' },
          { label: '通话次数', prop: 'cs' },
          { label: '通话时长', prop: 'sc' }
        ],
        detailListTabList: [],
        detailListTabList1: [
          { label: '通话地点', prop: 'thdd' },
          { label: '通话次数', prop: 'cs' },
          { label: '通话时长', prop: 'sc' }
        ],
        detailListTabList2: [
          { label: '通话日期', prop: 'thrq' },
          { label: '通话次数', prop: 'cs' },
          { label: '通话时长', prop: 'sc' }
        ],
        navList: []
      }
    },
    props: [],
    computed: {
      tableHeight() {
        return (document.documentElement.clientHeight - 380).toString()
      }
    },
    watch: {
      showLine(val) {
        if (val === true) {
          this.ployLine()
        } else {
          this.ployLine(true)
        }
      },
      tabs: {
        handler() {
          let target = this.tabs[this.currentTab]
          this.navList = []
          if (!target || !target.vals) return
          target.vals.forEach(d => {
            this.navList.push(target.tabList.filter(e => e.label === d)[0])
          })
        },
        deep: true
      }
    },
    methods: {
      query() {
        this.showLine = false;
        this.resetTabs();
        this.fetchMainList();
        this.$refs.pgis && this.$refs.pgis[0] && this.$refs.pgis[0].map && this.$refs.pgis[0].map.clear()
        this.resBox = true
      },
      resetTabs() {
        // 重新设置选项卡
        let target = this.tabs[this.currentTab];
        this.showTelTab = target.vals[0]; // 跳到第一个tab
        this.currItems = {}; // 清空但钱标记数据
        // 由于筛选条件已改变，将之前加载的数据清空
        target.tabList.forEach((trow, idx) => {
          trow.list = []; // 清空列表
          trow.pgisList = []; // 清空地图标记点
        })
      },
      fetchMainList() {
        let target = this.tabs[this.currentTab],
          queryForm = this.delEmpey({
            v_zjhm: this.showTelTab || target.vals[0], //  主叫号码   String  是  target.keyVal
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 String 否
            v_thsctj: target.queryForm.timeLabel, // 通话时长条件 String 否
            v_thsctjz: target.queryForm.timeLeght, // 通话时长条件值 String 否
            v_thcstj: target.queryForm.callCountLabel, // 通话次数条件 String 否
            v_thcstjz: target.queryForm.callCount, // 通话次数条件值  String 否
            v_dfhm: target.queryForm.otherPhone, // 对方号码 String 否
            v_rwid: '', // 任务ID String 否
            v_type: target.queryForm.cycle // 类型（0地点，1年，2月，3周，4天，5小时） Int 是
          })
        this.navList = []
        target.vals.forEach(d => {
          this.navList.push(target.tabList.filter(e => e.label === d)[0])
        })
        this.dispatch(FETCH_TELLIST_STATION_LIST, queryForm).then(() => {
          this.navList.forEach(trow => {
            if (trow.label === queryForm.v_zjhm) {
              if (queryForm.v_type === 0) {
                this.tabList = this.tabList2
              } else {
                this.tabList = this.tabList1
              }
              trow.list = this.analysisTelList.stationList.JZFXMainList.map(lm => {
                lm.detailList = []
                return lm
              })
            }
          })
          this.tabLoading = false
        })
      },
      tabListClick(tabItem) {
        // 切换当前标签
        this.tabItemIndex = tabItem.index
        let target = this.tabs[this.currentTab]
        target.tabList.forEach((trow, idx) => {
          if (trow.label === tabItem.label) {
            if (!(trow.list && trow.list.length > 0)) { // 无数据重新查询，查询之后由于是新标签页，地图也要重画
              this.tabLoading = true
              this.fetchMainList();
              this.currItems[this.tabItemIndex] = [];
              this.reDrawMap();
            } else if (this.currItems[this.tabItemIndex]) { // 如果列表已有选择值，重画坐标点
              this.reDrawMap();
            }
          }
        })
      },
      tableExpand(r, state) {
        let target = this.tabs[this.currentTab]
        if (state && r.detailList.length === 0) {
          if (target.queryForm.cycle === 0) { // 次数
            this.analysisTelList.stationList.JZFXDetailList.map(rd => {
              if (r.jd === rd.jd && r.wd === rd.wd) { // 通过经纬度匹配地点
                r.detailList.push(rd)
              }
            })
            this.detailListTabList = this.detailListTabList2
          } else {
            this.analysisTelList.stationList.JZFXDetailList.map(rd => {
              if (r.thrq === rd.thrq) { // 时间周期根据通话日期匹配数据
                r.detailList.push(rd)
              }
            })
            this.detailListTabList = this.detailListTabList1
          }
        }
      },
      /**
       * 勾选事件地图标点
       * @param sItem
       */
      tableSelectChange(items) {
        // console.log(items)
        let target = this.tabs[this.currentTab]
        // 先清空pgisList 的点
        target.tabList[parseInt(this.tabItemIndex)]['pgisList'] = []
        // 给当前tab 的划线一种随机颜色，如果有过则用原来的
        if (!target.tabList[parseInt(this.tabItemIndex)]['rgbColor']) {
          target.tabList[parseInt(this.tabItemIndex)]['rgbColor'] = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},0)`;
        }
        // 将选择的项加入pgisList中
        items.forEach((d, i) => {
          if (d.jd !== '' && d.wd !== '') {
            let coord = new window.EzCoord(d.jd, d.wd)
            target.tabList[parseInt(this.tabItemIndex)].pgisList.push({
              name: d.thdd,
              coord: coord,
              x: d.jd,
              y: d.wd
            })
          }
        })
        // 记录该选项卡已选的项，用作选项卡跳转时触发显示坐标
        this.currItems[this.tabItemIndex] = items;
        // 重新画图
        this.reDrawMap();
      },
      reDrawMap() {
        // 清除地图已渲染内容
        this.$refs.pgis[0] && this.$refs.pgis[0].map && this.$refs.pgis[0].map.clear()
        // 取出当前选项卡已选择的项
        let items = this.currItems[this.tabItemIndex];
        // 把坐标点画出来
        items.forEach((d, i) => {
          if (d.jd !== '' && d.wd !== '') {
            let coord = new window.EzCoord(d.jd, d.wd)
            this.$refs.pgis[0].map.addOverlay(new window.EzMarker(coord, icon))
            if (i === items.length - 1) {
              this.$refs.pgis[0].map.centerAndZoom(coord, 15)
            }
          }
        })
        // 触发轨迹线
        if (this.showLine) this.ployLine()
      },
      /**
       * [ployLine 通话轨迹PGIS连线]
       * @return {[type]} [description]
       */
      ployLine(clear = false) {
        let list = this.tabs[this.currentTab].tabList.filter(d => d.pgisList && d.pgisList.length > 0)
        // 画线
        if (clear === false) {
          if (list && list.length > 0) {
            list.forEach(d => {
              let positions = [];
              d.pgisList.forEach(c => {
                positions.push(c.coord)
              })
              let lines = new window.Polyline(positions)
              lines.setStrokeColor(d.rgbColor)
              this.$refs.pgis[0].map.addOverlay(lines)
            })
          }
        } else {
          this.$refs.pgis[0] && this.$refs.pgis[0].map && this.$refs.pgis[0].map.clear()
          let items = this.currItems[this.tabItemIndex];
          items.forEach((d, i) => {
            if (d.jd !== '' && d.wd !== '') {
              let coord = new window.EzCoord(d.jd, d.wd)
              this.$refs.pgis[0].map.addOverlay(new window.EzMarker(coord, icon))
              // 设置地图初始中心点及缩放级别
              // if (i === items.length - 1) {
              //   this.$refs.pgis[0].map.centerAndZoom(coord, 15)
              // }
            }
          })
        }
      }
    },
    created() {
      this.active = this.$route.path
    },
    mounted() {}
  }

</script>
