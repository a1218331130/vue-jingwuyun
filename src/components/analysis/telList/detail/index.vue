<template>
<!--通话详情分析-->
<!-- 本页吴杰套数据 -->
<div class="tel-list root" v-loading="loading" element-loading-text="拼命分析计算中……">
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <el-tabs v-model="elTab" v-if="tabs.length>0" :closable="true" @tab-remove="removeTab" @tab-click="updateCurrentTab">
        <el-tab-pane v-for="(item,i) in tabs" :name="`${item.keyVal}|${item.name}`" :key="i" :label="`${item.keyVal}[${item.name}]`"></el-tab-pane>
      </el-tabs>
      <span v-else>&nbsp</span>
    </el-col>
    <el-col :span="4" class="collap-col">
      <div class="collap-box pointer">
        <slot name="switchRightBarBtn"></slot>
      </div>
    </el-col>
  </el-row>

  <div class="tabs-box">
    <div class="tabs-box__item" v-for="(item,i) in tabs" v-show="i===currentTab" :key="i">
      <searchBox>
        <div slot="formBox">
          <el-form :model="item.queryForm" :inline="true" label-position="right" label-width="90px">
            <el-button type="primary" class="analysis primary-btn" native-type="submit" @click.prevent="query">分析</el-button>
            <el-form-item label="时间段">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm, val?val:'')" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <el-form-item label="通话时长">
              <el-select class="small" v-model="item.queryForm.timeLabel" placeholder="请选择">
                <el-option v-for="item in logicOps" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
              <el-input-number class="small" v-model="item.queryForm.timeLeght" size="small" :min="1" :max="1000"></el-input-number>
              (秒)
            </el-form-item>
            <!-- <el-form-item label="基站代码">
                 <el-input v-model="item.queryForm.stationCode" style="width:120px;" placeholder=""></el-input>
               </el-form-item>-->
            <!-- <el-form-item label="归属地">
                  <el-input v-model="item.queryForm.attribution" style="width:80px;" placeholder=""></el-input>
                </el-form-item> -->
            <el-form-item label="时段">
              <el-select v-model="item.queryForm.timeInterval3" placeholder="">
                <el-option v-for="item in timeInterval3" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="呼叫类型">
                  <el-select v-model="item.queryForm.callType" style="width:80px;" placeholder="">
                    <el-option v-for="item in callTypeList" :label="item.label" :value="item.value" :key="item"></el-option>
                  </el-select>
                </el-form-item> -->
            <el-form-item label="通话地点">
              <el-input v-model="item.queryForm.callArea" style="width:80px;" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="对方号码">
              <el-input v-model="item.queryForm.otherPhone" style="width:120px;" placeholder=""></el-input>
            </el-form-item>
          </el-form>
          <!-- <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query">分析</el-button> -->
        </div>
      </searchBox>
      <!-- 查询结果 -->
      <div class="app-content-box" v-if="resBox===true">
        <!-- :h="440" -->
        <list :list="item.mainList" :tab="tabList" v-if="!loading" :pagenav="pageInfo" v-height-fix="390"></list>

        <div class="app-toolbar footer">
          <pagination :count="pageInfo.count" :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}" @update:pagenav="pagenavChange"></pagination>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<style lang="scss" scoped>
  .root {
    height: calc(100vh - 60px);
  }

  .app-content-box {
    padding: 16px 10px;
    min-height: 75px;
  }

  .primary-btn {
    position: relative;
    top: 1px;
    left: 0;
  }

  .tabs-box {
    height: calc(100vh - 96px);
    .tel-list {
      height: calc(100vh - 380px);
      overflow-y: scroll;
    }
  }

</style>
<script>
  import { FETCH_TELLIST_DETAIL_LIST } from '../../../../store/types'
  import telListMixin from '../telListMixin'

  import searchBox from '../../search-tool'
  import list from '../list'
  import pagination from '../../../../widgets/pagination/pagination.vue'
  export default {
    mixins: [telListMixin],
    components: {
      searchBox,
      list,
      pagination
    },
    data() {
      return {
        pageInfo: { // 页面分页信息相关配置 默认限制每页十条
          count: 10,
          limit: 500,
          currentpage: 1
        },
        commName: 'detail',
        resBox: false,
        detailBox: false,
        tabList: [
          { label: '主叫号码', prop: 'zjhm' },
          { label: '对方姓名', prop: 'xm' },
          { label: '对方身份证号', prop: 'DFSFZHM' },
          { label: '对方号码', prop: 'dfhm' },
          { label: '对方职位', prop: 'zw' },
          { label: '对方号码归属地', prop: 'gsd' },
          { label: '通话地点', prop: 'thd' },
          { label: '通话地址', prop: 'thdd' },
          { label: '呼叫类型', prop: 'hjlx' },
          { label: '通话日期', prop: 'thrq' },
          { label: '通话时间', prop: 'thsj' },
          { label: '时长(秒)', prop: 'thsc' },
          { label: '星期', prop: 'xq' }
          // {label: '业务时间', prop: 'ywsj'}
        ]
      }
    },
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
      query() {
        this.fetchMainList()
        this.resBox = true
      },
      fetchMainList() {
        let target = this.tabs[this.currentTab];
        let queryForm = this.delEmpey({
          v_zjhm: target.keyVal, //  主叫号码   String  是
          v_dfhm: target.queryForm.otherPhone, // 对方号码   String  否
          v_gsd: target.queryForm.attribution, // 归属地  String  否
          v_jzdm: target.queryForm.stationCode, // 基站代码   String  否
          v_xqdm: '', // 小区代码   String  否
          v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 String 否
          v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 String 否
          v_kssj1: '', // 开始时间1（针对异常号码查看明细）  String  否
          v_jssj1: '', // 结束时间1（针对异常号码查看明细）  String  否
          v_sjd: '', // 时间段（针对规律分析查看明细）  String  否
          v_sjdlx: '', // 时间段类型（针对规律分析0小时，1天，2星期，3月，4年）  String  否
          v_sctj: target.queryForm.timeLabel, // 时长条件（>=,<=） String  否
          v_thsc: target.queryForm.timeLeght, // 时长 String 否
          v_hjlx: target.queryForm.callType, // 呼叫类型（主叫，被叫 ）  String  否
          v_thdd: target.queryForm.callArea, // 通话地点  String  否
          v_orderby: '', // 排序字段（默认按业务时间倒序）   String  否
          v_sd: target.queryForm.timeInterval3, // 时段 String  否
          v_dwmc: '', // 单位名称   String  否
          v_pageindex: this.pageInfo.currentpage, // 页码  String  否
          v_pagesize: this.pageInfo.limit, // 分布大小  String  否
          v_type: 0 // 0查询列表，100轨迹明细  Int  是
        })

        this.dispatch(FETCH_TELLIST_DETAIL_LIST, queryForm).then(() => {
          target.mainList = this.analysisTelList.detailList.THMXModelList.map(d => {
            return d
          })
          this.pageInfo.count = target.count = this.analysisTelList.detailList.TotalCount // 数据条数统计
        })
      }
    },
    created() {

    },
    mounted() {}
  }

</script>
