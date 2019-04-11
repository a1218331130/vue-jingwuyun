<template>
<!-- 同住详查 -->
<!-- 本页套数据 -->
<div class="tel-list" v-loading="loading">
  <el-row class="el-row analysis-topbar">
    <!-- <el-col :span="20">
      <div class="tabs">
        <div :class="{'tabs__item':true,'current':currentTab===i}" v-for="(item,i) in tabs" :title="item.keyVal" @click="currentTab=i" v-if="item.keyVal">
          {{item.keyVal}}
          <span v-show="item.name">[{{item.name}}]</span>
          <i class="iconfont icon-close" @click.stop="removeItem(item)"></i>
        </div>
      </div>
    </el-col> -->
    <el-col :span="20">
      <el-tabs v-model="activeTab" :closable="true" @tab-remove="removeItem" @tab-click="tabPaneChange">
        <el-tab-pane v-for="(item,i) in tabs" :name="`${item.keyVal}|${item.name}`" :key="i" :label="`${item.keyVal}[${item.name}]`" @click="currentTab=i"></el-tab-pane>
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
            <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query" style="position:relative;left:10px;top:-4px">分析</el-button>
            <el-form-item label="时间段">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="timeOptions" @change="val=>updateTimeSlot(item.queryForm, val?val:'')" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <el-form-item label="房间范围">
              <el-select v-model="item.queryForm.roomRange" placeholder="请选择" style="width: 100px;">
                <el-option v-for="item in roomScopeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关联类型">
              <el-select v-model="item.queryForm.relevanceType" placeholder="请选择" style="width: 150px;">
                <el-option v-for="item in relTypeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-input-number v-model="item.queryForm.cohabitTime" size="small" :min="1" :max="24" class="small" style="margin-top: 4px;"></el-input-number>
            <span class="text">小时</span>
            <el-form-item label="同住次数">
              <el-input-number v-model="item.queryForm.cohabitCount" size="small" :min="1" :max="24" class="small"></el-input-number>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="item.queryForm.xm" size="small" class="normal"></el-input>
            </el-form-item>
            <el-form-item label="身份证号码">
              <el-input v-model="item.queryForm.sfzhm" size="small" class="normal"></el-input>
            </el-form-item>
            <!-- <el-form-item label="身份证号码">
              <el-input v-model="item.queryForm.addItem.keyVal" class="normal"></el-input>
            </el-form-item> -->
          </el-form>
        </div>
      </searchBox>

      <!--内容区-->
      <div class="app-content-box">
        <el-table :data="cohabitList" style="width:100%" border :row-class-name="tableRowClassName">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="xm" label="姓名" align="center" width="80px"></el-table-column>
          <el-table-column prop="zjhm" label="身份证号" align="center" width="190px"></el-table-column>
          <el-table-column prop="rzfh" label="入住房号" align="center" width="70px"></el-table-column>
          <el-table-column prop="ldmc" label="旅馆名称" align="center"></el-table-column>
          <el-table-column prop="rzsj" label="入住时间" align="center" width="170"></el-table-column>
          <el-table-column prop="tfsj" label="退房时间" align="center" width="170"></el-table-column>
          <el-table-column prop="hjd_dzmc" label="户籍地" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</div>
</template>
<style lang="scss" scoped>
  .tel-list {
    height: calc(100vh - 60px);
    overflow: hidden;
  }

  .app-content-box {
    padding: 0;
    height: calc(100vh - 250px);
    overflow-y: scroll;
  }

  .text {
    color: #666666;
  }

  .el-table--enable-row-transition {
    .el-table__body {
      td.el-table__expanded-cell {
        padding: 0;
      }
    }
  }

  .tabs-box {
    padding-bottom: 50px;
  } // 添加修改：
  .el-tabs {
    margin-bottom: 0;
  }

</style>
<style lang="scss">
  .el-form.demo-table-expand.el-form--label-left.el-form--inline {
    margin: 10px 0;
  }

  .el-table .info-row td {
    background: #c9e5f5;
  }

</style>
<script>
  import { FETCH_ANALYZE_COHABIT_LIST } from '../../../../store/types'
  import locusMixin from '../locusMinxin'
  // import echarts from '../../../../widgets/echarts'
  // import echartsDetails from '../../../../widgets/echarts/echart-details'
  import searchBox from '../../search-tool'
  import list from '../detail.vue'
  export default {
    mixins: [locusMixin],
    components: {
      searchBox,
      list
    },
    data() {
      return {
        activeTab: '',
        commName: 'cohabit',
        value: null,
        show: true,
        currentPage3: 1,
        cohabit: 1,
        radarmax: 0,
        resBox: false,
        relTypeData: [{
          value: '1',
          label: '入住时间前后'
        }, {
          value: '2',
          label: '退房时间前后'
        }, {
          value: '3',
          label: '住房时间交叉'
        }], // 关系类型
        roomScopeList: [{
          value: '1',
          label: '同旅店'
        }, {
          value: '2',
          label: '同楼层'
        }, {
          value: '3',
          label: '同房间'
        }], // 房间范围
        showInfoList: [],
        detailBox: false,
        table: {
          columns: [],
          data: []
        },
        cohabitList: [],
        total: 30,
        mainGo: null,
        diagram: null,
        pieTestOps: null,
        radarOptions: null,
        pieTestOpsAge: null,
        pieTestOpsGrade: null,
        lineTestOpsArea: null,
        lineTestOps: null,
        mapTestOps: null,
        barTestOps: null,
        isChange: true,
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
        let reg1 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/g;
        let reg2 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/g;
        if (this.tabs[this.currentTab].queryForm.timeSlot.length < 2 || this.tabs[this.currentTab].queryForm.timeSlot[0] === 'NaN-aN-aN') {
          this.$alert('时间段不能为空', '温馨提示')
          return false
        }
        if (this.tabs[this.currentTab].queryForm.sfzhm === '' || this.tabs[this.currentTab].queryForm.sfzhm === undefined) {
          this.tabs[this.currentTab].queryForm.sfzhm = '';
        } else {
          if (!reg1.test(this.tabs[this.currentTab].queryForm.sfzhm) && !reg2.test(this.tabs[this.currentTab].queryForm.sfzhm)) {
            this.$alert('输入合法的身份证号', '温馨提示');
            return false;
          }
        }
        console.log('136', this.tabs[this.currentTab])
        this.fetchMainList();
        this.resBox = true;
      },
      fetchMainList() {
        this.cohabitList = []
        let target = this.tabs[this.currentTab],
          queryForm = {
            zjhm: target.keyVal, //  身份证号码
            kssj: target.queryForm.timeSlot[0].split('-').join('') || '', // 开始时间
            jssj: target.queryForm.timeSlot[1].split('-').join('') || '', // 结束时间
            fjfw: target.queryForm.roomRange, // 房间范围
            gllx: target.queryForm.relevanceType, // 关联类型
            sjpy: target.queryForm.cohabitTime, // 同住时间
            txcs: target.queryForm.cohabitCount, // 同住次数
            tzrxm: target.queryForm.xm, // 同住人姓名
            tzrzjhm: target.queryForm.sfzhm // 同住人身份证号码
          }
        this.dispatch(FETCH_ANALYZE_COHABIT_LIST, queryForm).then(() => {
          this.cohabitList = this.analysisLocus.cohabitList
        })
      },
      loadData(page = 1, limit = 10) {
        this.dispatch(null, { query: { page, limit, ...this.searchKeys } })
      },
      handlePageChange(page) {
        this.loadData(page, this.role.limit)
      },
      handleSizeChange(size) {
        this.loadData(1, size)
      },
      handleChange() {},
      handleCurrentChange(index) {},
      // 创建新的tab
      // createItem() {
      //   let regex1 = /\d{17}[0-9Xx]{1}$/,
      //     regex2 = /\d{14}[0-9Xx]{1}$/,
      //     target = this.tabs[this.currentTab].queryForm.addItem
      //   if (target.keyVal) {
      //     if (regex1.test(target.keyVal) || regex2.test(target.keyVal)) {
      //       if (this.tabs[this.currentTab].flag) {
      //         this.tabs[this.currentTab].keyVal = target.keyVal
      //       }
      //       this.tabs[this.currentTab].oldVal = clone(this.tabs[this.currentTab].keyVal)
      //       this.tabs[this.currentTab].keyVal = target.keyVal
      //       this.tabs[this.currentTab].name = target.name
      //       this.tabs[this.currentTab].flag = true
      //     } else {
      //       this.$message({
      //         type: 'error',
      //         message: '请输入正确的身份证号码',
      //         showClose: true
      //       })
      //       return true
      //     }
      //   }
      // // },
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
