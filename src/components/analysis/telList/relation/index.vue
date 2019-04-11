<template>
<!-- 关联分析 -->
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
          <el-form :model="item.queryForm" :inline="true" label-position="right" label-width="90px" style="display:flex">
            <el-button type="primary" class="analysis primary-btn" @click="queryFX">分析</el-button>
            <div class="">
              <el-form-item label="时间段">
                <el-date-picker type="daterange" v-model="item.queryForm.timeSlot" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm, val?val:'')" placeholder="请选择"></el-date-picker>
              </el-form-item>
              <el-form-item label="通话时长">
                <el-select v-model="item.queryForm.timeLabel" class="small" placeholder="请选择">
                  <el-option v-for="item in logicOps" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
                <el-input-number class="small" v-model="item.queryForm.timeLeght" size="small" :min="1" :max="1000"></el-input-number>
                (秒)
              </el-form-item>
              <el-form-item label="归属地">
                <el-input v-model="item.queryForm.attribution" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="时段">
                <el-select v-model="item.queryForm.timeInterval3" placeholder="">
                  <el-option v-for="item in timeInterval3" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="时间间隔">
                <el-select v-model="item.queryForm.timeInterval2" style="width:120px;" placeholder="">
                  <el-option v-for="item in timeInterval2" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="次数">
                <el-input-number class="small" v-model="item.queryForm.numberOf" size="small" :min="1" :max="1000"></el-input-number>
                (次)
              </el-form-item>
              <el-form-item label="呼叫类型">
                <el-select v-model="item.queryForm.callType" style="width:120px;" placeholder="">
                  <el-option v-for="item in callTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="通话地点">
                <el-input v-model="item.queryForm.callArea" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="对方号码">
                <el-input v-model="item.queryForm.otherPhone" placeholder=""></el-input>
              </el-form-item>
            </div>
            <!-- <el-button type="primary" class="analysis" native-type="submit" @click="queryFX">分析</el-button> -->
          </el-form>
        </div>
      </searchBox>
      <div class="app-content-box">
        <!-- 结果详情 -->
        <el-row>
          <el-col :span="24">
            <div class="res-box" v-if="resBox===true && !loading">
<list :list="item.mainList" :canViewMap="false" :tab="table.tabList" :pagenav="pageInfo" @on:rowclick="rowClick"  H="410"></list>


              <div class="app-toolbar footer">
                <pagination :count="pageInfo.count" :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}" @update:pagenav="pagenavChange"></pagination>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

    </div>
  </div>

  <!-- 详单查询 -->
  <detail-relation-list-dialog :dialog="detailDialog" :queryCondition="detailQueryCondition" @close="detailDialog = false"></detail-relation-list-dialog>
</div>
</template>
<style lang="scss" scoped>
  .tel-list.root {
    height: calc(100vh - 60px);
    .tel-list {
      height: calc(100vh - 390px);
      overflow: scroll;
    }
  }

  .primary-btn {
    position: relative;
    top: 1px;
    left: 0;
  }

</style>
<script>
  import {
    //    FETCH_TELLIST_RELATION_DETAIL_LIST,
    FETCH_TELLIST_RELATION_LIST
  } from '../../../../store/types'
  import telListMixin from '../telListMixin'
  // import dateFormat from '../../../../utils/dateFormat'
  import searchBox from '../../search-tool'
  import list from '../list'
  import pagination from '../../../../widgets/pagination/pagination.vue'
  import { clone } from '../../../../utils/util'
  import detailRelationListDialog from '../detail-relation-list-dialog.vue'
  export default {
    mixins: [telListMixin],
    components: {
      detailRelationListDialog,
      searchBox,
      list,
      pagination
    },
    data() {
      return {
        detailDialog: false,
        detailQueryCondition: null,
        pageInfo: { // 页面分页信息相关配置 默认限制每页十条
          count: 10,
          limit: 500,
          currentpage: 1
        },
        commName: 'relation',
        resBox: false,
        detailBox: false,
        table: { // 表格数据
          tabList: [
            //            {label: '通话日期', prop: 'rid'},    // 序号
            //            {label: '通话日期', prop: 'guid'},   // 话单GUID
            // { label: '业务时间', prop: 'ywsj' }, // 业务时间
            { label: '主叫号码', prop: 'zjhm' }, // 对方单位
            { label: '次数', prop: 'cs' }, // 主叫号码
            { label: '呼叫类型', prop: 'hjlx' }, // 呼叫类型
            { label: '对方号码', prop: 'dfhm' }, // 对方号码
            { label: '通话地', prop: 'thd' }, // 通话地
            { label: '通话日期', prop: 'thrq' }, // 通话日期
            { label: '通话时间', prop: 'thsj' }, // 通话时间
            { label: '星期', prop: 'xq' }, // 星期
            { label: '通话时长', prop: 'thsc' }, // 通话时长
            // { label: '基站代码', prop: 'jzdm' }, // 基站代码
            { label: '对方姓名', prop: 'xm' }, // 对方姓名
            { label: '对方职位', prop: 'zw' }, // 对方职位
            // { label: '小区代码', prop: 'xqdm' }, // 小区代码
            { label: '对方号码归属地', prop: 'gsd' }, // 对方号码归属地
            { label: '通话地点', prop: 'thdd' }, // 详细的通话地点
            // { label: '创建时间', prop: 'cjsj' }, // 创建时间
            // { label: '排序编号', prop: 'pxbh' }, // 排序编号
            { label: '对方身份证号码', prop: 'dfsfzhm' }, // 对方身份证号码
            { label: '备注', prop: 'by6' }, // 备用字段(这里是话单的备注信息)
            //            {label: '身份类型代码', prop: 'sflxdm'},   // 身份类型代码
            // { label: '身份类型', prop: 'sflxtpmc' }, // 身份类型
            { label: '对方单位', prop: 'dwmc' } // 与之关联的交易次数
          ],
          resData: []
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
        this.queryFX()
      },
      queryFX() {
        this.table.resData = []
        this.fetchMainList()
        this.resBox = true
        this.detailBox = false
      },
      fetchMainList() {
        let target = this.tabs[this.currentTab],
          queryForm = this.delEmpey({
            v_zjhm: target.keyVal, //  主叫号码   String  是
            v_dfhm: target.queryForm.otherPhone, // 对方号码 String 否
            v_gsd: target.queryForm.attribution, // 归属地 String 否
            v_jzdm: '', // 基站代码  String 否
            v_xqdm: '', // 小区代码  String 否
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 String 否
            v_kssj1: '', // 开始时间1（针对异常号码查看明细） String 否
            v_jssj1: '', // 结束时间1（针对异常号码查看明细） String 否
            v_sjd: '', // 时间段（针对规律分析查看明细） String 否
            v_sjdlx: '', // 时间段类型（针对规律分析0小时，1天，2星期，3月，4年） Int 否
            v_sctj: target.queryForm.timeLabel, // 时长条件（>=,<=） String  否
            v_thsc: target.queryForm.timeLeght, // 时长 String 否
            v_hjlx: target.queryForm.callType, // 呼叫类型（主叫，被叫 ） String 否
            v_thdd: target.queryForm.callArea, // 通话地点 String 否
            v_orderby: '', // 排序字段（默认按业务时间倒序）  String 否
            v_sd: target.queryForm.timeInterval3, // 时段 String 否
            v_dwmc: '', // 单位名称  String 否
            v_pageindex: this.pageInfo.currentpage, // 页码 String 否
            v_pagesize: this.pageInfo.limit, // 分布大小 String 否
            v_type: '1', // 1返回列表及统计，2返回统计及空表 Int 是
            v_cs: target.queryForm.numberOf, // 次数 Int  否
            v_timeframe: target.queryForm.timeInterval2, // 时间间隔 Int 否
            v_zdid: '' // 关联账号 String 否
          })

        this.dispatch(FETCH_TELLIST_RELATION_LIST, queryForm).then(() => {
          this.table.resData = this.analysisTelList.relationList.GLFXList.map(rGLFX => {
            return rGLFX
          })
          target.mainList = this.table.resData
          this.pageInfo.count = this.analysisTelList.relationList.totalcount // 数据条数统计
        })
      },
      transformTime(date) {
        let year = date.getFullYear(),
          month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1),
          day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate(),
          hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours(),
          minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes(),
          second = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      },
      showDetail() {},
      rowClick(rowObj) {
        this.detailDialog = true
        let _currentQuery = Object.assign({}, clone(this.tabs[this.currentTab])),
          target = this.tabs[this.currentTab]
        this.detailQueryCondition = Object.assign({}, _currentQuery)
        let timeM = target.queryForm.timeInterval2 * 60000,
          workTime = new Date(rowObj.row.ywsj).getTime()

        // console.log(new Date(workTime).getFullYear(), timeM, 'timeM');
        this.detailQueryCondition.queryForm.timeSlot[0] = this.transformTime(new Date(workTime - timeM))
        this.detailQueryCondition.queryForm.timeSlot[1] = this.transformTime(new Date(workTime + timeM))
      }
    },
    created() {
      this.active = this.$route.path
    },
    mounted() {}
  }

</script>
