<!-- 交叉频率分析 -->
<template>
<div class="bill-list" v-loading="loading" element-loading-text="拼命分析计算中……">
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <div class="tabs">
        <div :class="{'tabs__item':true,'current':currentTab===i}" 
        v-for="(item,i) in tabs" :key="i" title="交叉频率分析" @click="currentTab=i">
          交叉频率分析
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
    <div class="tabs-box__item" 
    v-for="(item,i) in tabs" :key="i"
    v-show="i===currentTab">
      <searchBox>
        <div slot="formBox">
          <!-- 条件 -->
          <el-form :model="item.queryForm" :inline="true" label-width="105px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="分析账号">
                  <span v-for="(val,i) in item.vals" :key="i">
                    {{val}}[{{item.names[i]}}] <i @click.stop="removeTab({guid:item.guid[i]})" class="iconfont icon-close"></i> {{(i
                    < item.vals.length-1? ', ': '')}} </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-button type="primary" class="primary-btn" native-type="submit" @click.prevent="query">分析</el-button>
            <el-form-item prop="dateTime" label="时间段">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm, val)" placeholder="请选择"></el-date-picker>
            </el-form-item>

            <el-form-item prop="targetBank" label="对方开户行">
              <el-input v-model="item.queryForm.targetBank" placeholder=""></el-input>
            </el-form-item>

            <!-- <el-form-item>
              <el-button type="primary" native-type="submit" @click.prevent="query">分析</el-button>
            </el-form-item> -->
          </el-form>
        </div>
      </searchBox>

      <div class="app-content-box">
        <!-- 结果列表 -->
         <el-collapse v-model="activeNames" v-show="resBox===true && !loading" @change="collapseChange">
          <el-collapse-item title="结果列表" name="table">
        <div class="res-box" v-if="resBox===true">
          <el-table @cell-mouse-enter="cellMouseEnter" :height="tableHeight" :data="table.data" border style="width:100%;">
            <el-table-column sortable v-for="item in table.columnB" stripe border :key="item.prop" :label="item.label" :prop="item.prop"></el-table-column>
          </el-table>
        </div>
         </el-collapse-item>
            <el-collapse-item title="结果关系图" name="chart">
        <!-- 结果详情 -->
        <!-- v-if="detailBox===true" -->
        <el-tabs v-show="detailBox===true" :style="fullScreenStyle">
          <el-tab-pane label="关系图">
<div class="spc-tab-right-box">
  <el-button @click="toggleFullScreen(chartIsFullScreen)">
    <i v-if="chartIsFullScreen" class="iconfont icon-min"></i>
    <i v-else class="iconfont icon-max"></i> {{chartIsFullScreen ? '缩小': '全屏'}}</el-button>
  <el-button @click="setLayout('GridLayout','billOverlappGoBox')">
    <i class="icon iconfont icon-guanlian1"></i> 网格

  </el-button>
  <el-button @click="setLayout('LayeredDigraphLayout','billOverlappGoBox')">
    <i class="icon iconfont icon-data-slice"></i> 分层

  </el-button>
  <el-button @click="setLayout('CircularLayout','billOverlappGoBox')">
    <i class="icon iconfont icon-fenleijishougongtongbu"></i> 圆形

  </el-button>
  <el-button @click="setLayout('ForceDirectedLayout','billOverlappGoBox')">
    <i class="icon iconfont icon-hudong"></i> 反牵引力

  </el-button>
  <el-button @click="setLayout('TreeLayout','billOverlappGoBox')">
    <i class="icon iconfont icon-ranking"></i> 树形

  </el-button>
</div>

            <gocharts ref="billOverlappGoBox" boxId="billOverlappGoBox" :data="goData" :options="goOptions" @link-click="linkClickEvent" :style="chartStyle"></gocharts>
          </el-tab-pane>
        </el-tabs>
          </el-collapse-item>
          </el-collapse>
      </div>
      <detail-list-dialog :dialog="detailDialog" :detailQueryURL="detailQueryURL" :detailQueryResult="detailQueryResult" :queryCondition="detailQueryCondition" @close="detailDialog = false"></detail-list-dialog>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
  .res-box {}

  .primary-btn {
    position: relative;
    top: 1px;
    left: 0;
    background: #54a8e7;
  }

</style>

<script>
  import { FETCH_BILL_OVERLAPPING_LIST, FETCH_BILL_OVERLAPPING_DETAIL_LIST } from '../../../../store/types'
  import billMixin from '../billMixin'
  import { clone } from '../../../../utils/util'
  import gocharts from '../../../../widgets/gocharts/gocharts'
  import searchBox from '../../search-tool'
  import detailListDialog from '../detail-list-dialog.vue'
  export default {
    mixins: [billMixin],
    components: {
      detailListDialog,
      gocharts,
      searchBox
    },
    data() {
      return {
        activeNames: ['table', 'chart'],
        goOptions: {
          readOnly: false,
          allowZoom: true,
          layout: 'LayeredDigraphLayout'
        },
        commName: 'overlapping',
        singleTab: true,
        detailQueryCondition: null,
        detailDialog: false,
        detailQueryURL: 'FETCH_BILL_OVERLAPPING_DETAIL_LIST',
        detailQueryResult: [
          { label: '序号', prop: 'r' },
          { label: '主账号', prop: 'zzh' },
          { label: '对方账号', prop: 'dfzh' },
          { label: '对方开户名', prop: 'dfkhm' },
          { label: '交易日期', prop: 'jyrq' },
          { label: '交易时间', prop: 'jysj' },
          { label: '交易类型', prop: 'jylx' },
          { label: '交易金额', prop: 'jyje' },
          { label: '交易网点', prop: 'jywdmc' },
          { label: '对方账号所属行', prop: 'dfzhssh' },
          // { label: '账单信息Guid', prop: 'guid' },
          { label: '备注信息', prop: 'bz' },
          { label: '对方账户身份证号', prop: 'dfsfzhm' },
          // { label: '身份类型代码', prop: 'sflxdm' },
          { label: '身份类型', prop: 'sflxtpmc' },
          { label: '单位名称', prop: 'dwmc' }
        ]
      }
    },
    computed: {
      tableHeight() {
        let offset = 420;
        let height = document.documentElement.clientHeight - parseFloat(offset)
        console.log(height)
        return (height < 200 ? 200 : height).toString()
      }
    },
    methods: {
      query() {
        if (this.currentTabItem.guid.length < 2) {
          this.$alert('必需选择一个以上不同的账号', '温馨提示');
          return false
        }
        this.fetchMainList()
        this.resBox = true
        this.detailBox = true
      },
      fetchMainList() {
        let target = this.currentTabItem,
          queryForm = this.delEmpey({
            v_rwid: '', // 分析任务id String 否
            v_zzh: target.vals.join(','), // 主账号(48979498796194694,6225689454) String 否
            v_zdid: target.guid.join('|'), // 'zd0000000000001|zd0000000000002' 账单id（用|隔开） String 是
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 格式 yyyy-mm-dd String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 格式 yyyy-mm-dd String 否
            v_dfssh: target.queryForm.targetBank // 对方所属行 String 否
          })
        this.dispatch(FETCH_BILL_OVERLAPPING_LIST, queryForm).then(() => {
          // 列表数据
          this.table.columnB = []
          for (let column in this.analysisBill.overlappingList.DTMain[0]) {
            if (column === 'dfzh') {
              this.table.columnB.push({ label: '对方账户', prop: column })
            } else {
              this.table.columnB.push({ label: column, prop: column })
            }
          }
          this.table.data = this.analysisBill.overlappingList.DTMain

          // GO数据
          this.goData.nodeDataArray = this.analysisBill.overlappingList.JCPDSTList.map(d => {
            return {
              key: d.id,
              category: 'bankcard',
              loc: '0 0',
              name: '节点',
              text: d.value + (!d.name ? '' : `[${d.name}]`),
              isToLink: false
            }
          })
          this.goData.linkDataArray = this.analysisBill.overlappingList.JCPDGXList.map(d => {
            return {
              from: d.dfzh,
              to: d.fxdx,
              curviness: 0,
              text: d.jyje + '元（' + d.jycs + '次）',
              visible: true
            }
          })
          this.$refs.billOverlappGoBox[0].initMaker()
        })
      },
      showDetail() {
        let target = this.currentTabItem,
          queryForm = this.delEmpey({
            v_zh1: '', // 主账号 String 是
            v_zh2: '', // 主账号 String 是
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 格式 yyyy-mm-dd String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 格式 yyyy-mm-dd String 否
            v_jylx: '', // 交易类型 String 否
            v_lx: '', // 交易类型（“JC”） String 是
            v_dfssh: target.queryForm.targetBank, // 对方所属行 String 否
            v_pageIndex: '', // 当前页码 Numeric 否
            v_pageSize: '' // 每页显示记录数 Numeric 否
          })
        this.dispatch(FETCH_BILL_OVERLAPPING_DETAIL_LIST, queryForm).then(() => {})
      },
      /**
       * 关系图连线点击
       * @param reObj
       */
      linkClickEvent(reObj) {
        let _clickObj = reObj.targetObj.data
        //  图表点击查询账单详情 （1 - 4 类型）
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
    }
  }

</script>
