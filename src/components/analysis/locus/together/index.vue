<template>
<!-- 同行详查 -->
<!-- 本页套数据 -->
<div class="tel-list locus-together-list" v-loading="loading">
  <el-row class="el-row analysis-topbar">
    <!-- <el-col :span="20">
      <div class="tabs">
        <div :class="{'tabs__item':true,'current':currentTab===i}" v-for="(item,i) in tabs" :title="item.keyVal" @click="currentTab=i" v-if="item.keyVal">
          {{item.keyVal}}[{{item.name}}]
          <i class="iconfont icon-close" @click.stop="removeItem(item)"></i>
        </div>
      </div>
    </el-col> -->
    <el-col :span="20">
      <el-tabs v-model="activeTab" :closable="true" @tab-remove="removeItem" @tab-click="tabPaneChange">
        <el-tab-pane v-for="(item,i) in tabs" :name="`${item.keyVal}|${item.name}`" :key="i" :label="`${item.keyVal}[${item.name}]`"></el-tab-pane>
      </el-tabs>
    </el-col>
    <el-col :span="4" class="collap-col">
      <div class="collap-box pointer">
        <slot name="switchRightBarBtn"></slot>
      </div>
    </el-col>
  </el-row>

  <div class="tabs-box">
    <div class="tabs-box__item" v-for="(item,i) in tabs" v-show="i===currentTab && item.keyVal">
      <!--查询框-->
      <searchBox>
        <div slot="formBox">
          <el-form :model="item.queryForm" :inline="true" label-position="right" label-width="90px">
            <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query" style="position:relative;left:10px;top:0">分析</el-button>
            <el-form-item label="时间段">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="timeOptions" @change="val=>updateTimeSlot(item.queryForm, val?val:'')" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="出发地">
              <el-input v-model="item.queryForm.starting" style="width: 130px;"></el-input>
            </el-form-item>
            <el-form-item label="目的地">
              <el-input v-model="item.queryForm.bourn" style="width: 130px;"></el-input>
            </el-form-item> -->
            <el-form-item label="同行类型">
              <el-select v-model="item.queryForm.togetherType" placeholder="请选择" style="width: 150px;">
                <el-option v-for="item in relTypeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出行时间前后">
              <el-input-number v-model="item.queryForm.seatRow" size="small" :min="1" class="small"></el-input-number>
              天
            </el-form-item>
            <el-form-item label="行程范围">
              <el-select v-model="item.queryForm.personRange" placeholder="请选择" style="width: 150px;">
                <el-option v-for="item in roomScopeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="item.queryForm.name" style="width: 150px;"></el-input>
            </el-form-item>
            <el-form-item label="身份证号码">
              <el-input v-model="item.queryForm.ID" size="small" class="normal"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </searchBox>

      <!--内容区-->
      <div class="app-content-box">
        <el-table :data="togetherList" style="width:100%" border :row-class-name="tableRowClassName">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="xm" label="姓名" align="center"></el-table-column>
          <el-table-column prop="zjhm" label="身份证号" align="center" width="170"></el-table-column>
          <el-table-column prop="ksrq" label="出发时间" align="center" width="170"></el-table-column>
          <el-table-column prop="jssj" label="到达时间" align="center" width="170"></el-table-column>
          <el-table-column prop="cfz" label="出发站" align="center"></el-table-column>
          <el-table-column prop="ddz" label="到达站" align="center"></el-table-column>
          <el-table-column prop="ttype" label="出行方式" align="center"></el-table-column>
          <el-table-column prop="txbh" label="班次" align="center"></el-table-column>
          <el-table-column prop="zwh" label="座位号" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</div>
</template>
<style lang="scss" scoped>
  .app-content-box {
    padding: 0;
    height: calc(100vh - 200px);
    .el-table__expanded-cell {
      padding: 0 0 0 40px;
    }
  }

  .el-table__expanded-cell {
    padding: 0 !important;
  }

  .el-table__expanded-cell {
    background: #ebf5fc;
    padding: 10px 0;
  } // 添加修改：
  .el-tabs {
    margin-bottom: 0;
  }

</style>
<style lang="scss">
  .locus-together-list .el-form-item__label {
    width: 100px !important;
  }

  .el-table .info-row td {
    background: #c9e5f5;
  }

</style>
<script>
  import { FETCH_ANALYZE_TOGETHER_LIST } from '../../../../store/types'
  import timeLine from '../../../dossier/people/modules/time_line.vue'
  import locusMixin from '../locusMinxin'
  import echarts from '../../../../widgets/echarts'
  import echartsDetails from '../../../../widgets/echarts/echart-details'
  import searchBox from '../../search-tool'
  import list from '../detail.vue'
  import chartsOps from '../../../../utils/echartsOptions/all'
  export default {
    mixins: [locusMixin, chartsOps, timeLine],
    components: {
      'time-line': timeLine,
      searchBox,
      echarts,
      echartsDetails,
      list
    },
    data() {
      return {
        activeTab: '',
        commName: 'together',
        currentPage3: 1,
        show: true,
        cohabit: 1,
        radarmax: 0,
        togetherList: [],
        infoList: [
          { title: '同行人', tabData: null },
          { title: '同住人', tabData: null },
          { title: '可能居住地', tabData: null },
          { title: '可能工作地点', tabData: null },
          { title: '常去城市', tabData: null },
          { title: '常去酒店', tabData: null }
        ],
        relTypeData: [
          { value: '1', label: '同车次' },
          { value: '2', label: '同车次且同车厢' },
          { value: '3', label: '出行时间前后' }
        ],
        roomScopeList: [
          { value: '1', label: '出发地和目的地相同' },
          { value: '2', label: '出发地相同' },
          { value: '3', label: '目的地相同' },
          { value: '4', label: '不限' }
        ],
        detailBox: false,
        table: {
          columns: [],
          data: []
        },
        timeOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date(),
                start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近30天', // '最近一个月',
            onClick(picker) {
              const end = new Date(),
                start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近60天', // '最近两个月',
            onClick(picker) {
              const end = new Date(),
                start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近90天', // '最近三个月',
            onClick(picker) {
              const end = new Date(),
                start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近半年',
            onClick(picker) {
              const end = new Date(),
                start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一年',
            onClick(picker) {
              const end = new Date(),
                start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    props: [],
    computed: {},
    watch: {
      tabs(val) {
        this.$emit('on-change-tableData', val)
        if (val.length > 0) {
          let item = val[val.length - 1]
          this.activeTab = `${item.keyVal}|${item.name}`
        }
      }
    },
    methods: {
      tableRowClassName(row, index) {
        let target = this.tabs[this.currentTab]
        if (row.zjhm === target.keyVal) {
          return 'info-row'
        }
        return ''
      },
      query() {
        this.fetchMainList()
      },
      fetchMainList() {
        let reg1 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/g;
        let reg2 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/g;
        if (this.tabs[this.currentTab].queryForm.timeSlot.length < 2) {
          this.$alert('时间段不能为空', '温馨提示')
          return false
        }
        if (this.tabs[this.currentTab].queryForm.ID === '' || this.tabs[this.currentTab].queryForm.ID === undefined) {
          this.tabs[this.currentTab].queryForm.ID = '';
        } else {
          if (!reg1.test(this.tabs[this.currentTab].queryForm.ID) && !reg2.test(this.tabs[this.currentTab].queryForm.ID)) {
            this.$alert('输入合法的身份证号', '温馨提示');
            return false;
          }
        }
        let target = this.tabs[this.currentTab],
          queryForm = {
            zjhm: target.keyVal, //  身份证号码
            kssj: target.queryForm.timeSlot[0].split('-').join('') || '', // 开始时间
            jssj: target.queryForm.timeSlot[1].split('-').join('') || '', // 结束时间
            gxrxm: target.queryForm.name || '', // 关系人姓名
            txlx: target.queryForm.togetherType || '', // 同行类型
            xcfw: target.queryForm.personRange || '', // 车站范围
            zwpy: target.queryForm.seatRow + '' || '', // 座位偏移
            gxrzjhm: target.queryForm.ID || '' // 证件号码
          }
        this.dispatch(FETCH_ANALYZE_TOGETHER_LIST, queryForm).then(() => {
          this.togetherList = this.analysisLocus.togetherList
        })
      },
      // 移除tab
      removeItem(item) {
        let arr = item.split('|')
        if (arr[1] === '手动输入') {
          this.tabs = this.tabs.filter(d => d.keyVal !== arr[0])
          return
        }
        this.removeTab(item)
      },
      // 标签页改变
      tabPaneChange(tab) {
        this.currentTab = parseInt(tab.index)
      }
    },
    created() {},
    mounted() {}
  }

</script>
