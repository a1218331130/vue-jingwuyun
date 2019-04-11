<template>
<!-- 碰面分析 -->
<!-- 本页吴杰套数据 -->
<div class="tel-list root" v-loading="loading" element-loading-text="拼命分析计算中……">
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <div class="tabs">
        <div :class="{'tabs__item':true,'current':currentTab===i}" v-for="(item,i) in tabs" :title="item.keyVal" @click="currentTab=i">
          <!--{{item.keyVal}}-->
          碰面分析
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
            <el-form-item label="误差时间">
              <el-select v-model="item.queryForm.diffTime" style="width:80px;" placeholder="">
                <el-option label="15" value="15"></el-option>
                <el-option label="30" value="30"></el-option>
                <el-option label="60" value="60"></el-option>
                <el-option label="90" value="90"></el-option>
                <el-option label="120" value="120"></el-option>
              </el-select>
              (分钟)
            </el-form-item>
            <el-form-item label="误差距离">
              <el-select v-model="item.queryForm.diffDistance" style="width:80px;" placeholder="">
                <el-option label="100" value="100"></el-option>
                <el-option label="300" value="300"></el-option>
                <el-option label="500" value="500"></el-option>
                <el-option label="1000" value="1000"></el-option>
              </el-select>
              (米)
            </el-form-item>
            <el-form-item label="次数">
              <el-input-number v-model="item.queryForm.callCount" class="small" size="small" :min="2" :max="1000"></el-input-number>
            </el-form-item>
            <!-- <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query">分析</el-button> -->
          </el-form>
        </div>
      </searchBox>
      <div class="app-content-box" v-show="resBox===true && !loading">
        <!-- :pagenav="pageInfo" -->
        <list :list="item.mainList" :showDetailBtn="true" :canViewMap="false" :tab="table.tabList" @on:rowclick="tableClick" v-height-fix="390" H="390"></list>
        <div class="app-toolbar footer">
          <pagination :count="pageInfo.count" :pagenav="pageInfo" @update:pagenav="pagenavChange"></pagination>
        </div>
      </div>

    </div>
  </div>

  <!-- 详单查询 -->
  <detail-meeting-list-dialog :dialog="detailDialog" :queryCondition="detailQueryCondition" @close="detailDialog = false"></detail-meeting-list-dialog>
</div>
</template>
<style lang="scss" scoped>
  .tel-list.root {
    height: calc(100vh - 60px);
    .primary-btn {
      position: relative;
      top: 1px;
      left: 0;
    }
    .tel-list {
      height: calc(100vh - 390px);
      overflow: scroll;
    }
  }

  .app-content-box {
    height: calc(100vh - 240px);
  }

</style>
<script>
  import { FETCH_TELLIST_MEETING_LIST } from '../../../../store/types'
  import telListMixin from '../telListMixin'
  import pagination from '../../../../widgets/pagination/pagination.vue'
  import searchBox from '../../search-tool'
  import list from '../list'
  import { clone } from '../../../../utils/util'
  import detailMeetingListDialog from '../detail-meeting-list-dialog.vue'
  export default {
    mixins: [telListMixin],
    components: {
      detailMeetingListDialog,
      searchBox,
      list,
      pagination
    },
    data() {
      return {
        detailDialog: false,
        aaa: '',
        detailQueryCondition: null,
        pageInfo: { // 页面分页信息相关配置
          count: 10,
          limit: 500,
          currentpage: 1
        },
        singleTab: true,
        commName: 'meeting',
        resBox: false,
        detailBox: false,
        table: { // 表格数据
          tabList: [],
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
        // this.pageInfo.limit = obj.limit
        this.pageInfo.currentpage = obj.currentpage
        // this.aaa = obj.currentpage
        this.query()
      },
      query() {
        if (this.currentTabItem.vals.length < 2) {
          this.$alert('必需选择一个以上不同的手机号码', '温馨提示');
          return false
        }
        this.table.resData = []
        this.fetchMainList()
        this.resBox = true
      },
      fetchMainList() {
        let target = this.currentTabItem,
          queryForm = this.delEmpey({
            v_hdid: target.vals.join(','), // 手机号码(多个手机号码用’,’隔开) String 是
            v_kssj: target.queryForm.timeSlot[0] || new Date(), // 开始时间 String 否
            v_jssj: target.queryForm.timeSlot[1] || new Date(), // 结束时间 String 否
            v_wcsj: target.queryForm.diffTime, // 误差时间(单位分钟) Int 是
            v_wcjl: target.queryForm.diffDistance, // 误差距离 Int 是
            v_cs: target.queryForm.callCount, // 次数 Int 是
            v_pageindex: this.pageInfo.currentpage, // 页码  String  否
            v_pagesize: this.pageInfo.limit // 分布大小  String  否
          })
        target.mainList = []
        target.data = []
        this.table.tabList = []
        this.dispatch(FETCH_TELLIST_MEETING_LIST, queryForm).then(() => {
          // 列表
          let _tempTabList = ['序号', '纬度', '经度', '基站代码', '小区代码']
          this.pageInfo.count = this.analysisTelList.meetingList.PMFXZT.totalcount
          this.table.resData = this.analysisTelList.meetingList.DTMain.map(rDTM => {
            let jd = rDTM['经度'];
            let wd = rDTM['纬度'];
            target.data.push({ jd: jd, wd: wd })
            for (let tabV in rDTM) {
              if (!_tempTabList.includes(tabV) && tabV !== 'zjhm' && tabV !== 'GROUP') {
                _tempTabList.push(tabV)
                this.table.tabList.push({
                  label: tabV,
                  prop: tabV
                })
              }
            }
            return rDTM
          })
          target.mainList = this.table.resData
        })
      },
      tableClick(rowObj) {
        this.detailDialog = true
        let _currentQuery = Object.assign({}, clone(this.tabs[this.currentTab]))
        this.detailQueryCondition = Object.assign({}, _currentQuery, {
          keyVal: _currentQuery.vals.join(','), // 手机号码(多个手机号码用’,’隔开)
          pmsj: rowObj.row['时间'], // 碰面时间
          xqdm: rowObj.row['小区代码'], // 小区代码
          jzdm: rowObj.row['基站代码'], // 基站代码
          jd: rowObj.row['经度'],
          wd: rowObj.row['纬度']
        })
      }
    },
    created() {
      this.active = this.$route.path
    },
    mounted() {}
  }

</script>
