<template>
<!--异常号码分析-->
<!-- 本页鹏跟进 -->
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
    <div class="tabs-box__item" v-for="(item,i) in tabs" :key="i" v-show="i===currentTab">
      <searchBox>
        <div slot="formBox">
          <el-form :model="item.queryForm" :inline="true" label-position="right" label-width="105px" ref="queryForm" :rules="rules">
            <el-button type="primary" class="analysis primary-btn" native-type="submit" @click.prevent="query">分析</el-button>
            <el-form-item label="时间段一">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm, val?val:'', 'timeSlotArr')" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <el-form-item label="时间段二">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr2" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm, val?val:'', 'timeSlotArr2')" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <el-form-item style="padding-left: 30px">
              <el-select v-model="item.queryForm.excepType" placeholder="请选择" class="middle">
                <el-option label="新增" :value="3"></el-option>
                <el-option label="消失" :value="4"></el-option>


                <!-- <el-option label="之后出现的号码" value="0"></el-option>
                  <el-option label="之后消失的号码" value="0"></el-option> -->

              </el-select>
              <el-input-number class="small" v-model="item.queryForm.callCount" size="small" :min="1" :max="1000"></el-input-number>
              次
              <span style="color:#9c9c9c;margin-left:10px;font-size:10px;position:absolute;left:0;top:25px" v-html="item.queryForm.excepType === 3?'新增，时间段一无通话记录，时间段二有通话记录':'消失，时间段一有通话记录，时间段二无通话记录'"></span>
            </el-form-item>
            <!-- <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query">分析</el-button> -->
          </el-form>
        </div>
      </searchBox>
      <div class="app-content-box">
        <!-- 结果详情 -->
        <el-row>
          <el-col :span="24">
            <div class="res-box" v-if="resBox===true && !loading">
              <el-tabs>
                <el-tab-pane label="异常号码">
<list :list="item.mainList" :tab="table.tabList" :canViewMap="false" v-height-fix="420" :H="420" @on:rowclick="tableClick"></list>

                  <div class="app-toolbar footer">
                    <pagination :count="pageInfo.count" :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}" @update:pagenav="pagenavChange"></pagination>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-col>
        </el-row>
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

  .tel-list {
    .primary-btn {
      position: relative;
      top: 1px;
      left: 0;
    }
  }

</style>
<script>
  import { FETCH_TELLIST_SUSPICIOUS_LIST } from '../../../../store/types'
  import telListMixin from '../telListMixin'
  import { clone } from '../../../../utils/util'
  import pagination from '../../../../widgets/pagination/pagination.vue'
  import searchBox from '../../search-tool'
  import list from '../list'
  import detailListDialog from '../detail-list-dialog.vue'
  export default {
    mixins: [telListMixin],
    components: {
      searchBox,
      list,
      detailListDialog,
      pagination
    },
    data() {
      return {
        detailDialog: false,
        detailQueryCondition: null,
        commName: 'exception',
        resBox: false,
        detailBox: false,
        table: {
          tabList: [
            { label: '对方姓名', prop: 'xm' },
            { label: '对方号码', prop: 'dfhm' },
            { label: '对方职位', prop: 'zw' },
            { label: '对方单位', prop: 'dwmc' },
            { label: '对方身份证号', prop: 'dfsfzhm' },
            { label: '对方号码归属地', prop: 'gsd' },
            { label: '通话时长', prop: 'thsc' },
            { label: '通话次数', prop: 'cs' }
            // {label: '身份类型代码', prop: 'sflxdm'},
            // {label: '身份类型对应的图片名称', prop: 'sflxtpmc'}
          ],
          resData: []
        },
        rules: {
          timeSlotArr: {
            required: 'true',
            message: '请输入时间段一'
          },
          timeSlotArr2: {
            required: 'true',
            message: '请输入时间段二'
          }
        },
        pageInfo: { // 页面分页信息相关配置 默认限制每页十条
          count: 10,
          limit: 500,
          currentpage: 1
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
      query() {
        this.table.resData = []
        if (!this.fetchMainList()) {
          this.resBox = true
          this.detailBox = true
        }
      },
      fetchMainList() {
        let target = this.tabs[this.currentTab],
          queryForm = this.delEmpey({
            v_zjhm: target.keyVal, //  主叫号码   String  是
            v_cxkssj: target.queryForm.timeSlotArr[0] || '', // 出现开始时间 String 是
            v_cxjssj: target.queryForm.timeSlotArr[1] || '', // 出现结束时间 String 是
            v_wcxkssj: target.queryForm.timeSlotArr2[0] || '', // 消失开始时间 String 是
            v_wcxjssj: target.queryForm.timeSlotArr2[1] || '', // 消失结束时间 String 是
            v_cs: target.queryForm.callCount, // 次数 String 否
            v_type: target.queryForm.excepType, // 类型（0消失，1新增） String 是
            v_dwmc: '', // 单位名称 String 否
            v_pageindex: this.pageInfo.currentpage, // 页码 String 否
            v_pagesize: this.pageInfo.limit // 分布大小 String 否
          })
        if (!queryForm.v_cxkssj || !queryForm.v_cxjssj || !queryForm.v_wcxkssj || !queryForm.v_wcxjssj) {
          this.$message({
            type: 'warning',
            message: '时间段不能为空',
            duration: 1500
          })
          return true
        }
        this.dispatch(FETCH_TELLIST_SUSPICIOUS_LIST, queryForm).then(() => {
          this.table.resData = this.analysisTelList.suspiciousList
          target.mainList = this.table.resData.KYDList
          this.pageInfo.count = target.count = this.table.resData.Result.totalcount
          // this.pageInfo.count = this.analysisTelList.relationList.totalcount // 数据条数统计
        })
      },
      showDetail() {
        this.detailBox = true
      },
      tableClick(rowObj) {
        this.detailDialog = true
        let _tempCloneTabs = clone(this.tabs[this.currentTab])
        let _currentQuery = Object.assign({}, clone(this.tabs[this.currentTab]))
        _currentQuery.queryForm.otherPhone = rowObj.row.dfhm
        _currentQuery.queryForm.attribution = rowObj.row.gsd
        _currentQuery.queryForm.timeSlot = _tempCloneTabs.queryForm.timeSlotArr
        _currentQuery.queryForm.v_cxkssj = ''
        _currentQuery.queryForm.v_cxjssj = ''
        _currentQuery.queryForm.v_wcxkssj = ''
        _currentQuery.queryForm.v_wcxjssj = ''
        this.detailQueryCondition = Object.assign({}, _currentQuery, {
          type: _tempCloneTabs.queryForm.excepType,
          kssj1: _tempCloneTabs.queryForm.timeSlotArr2[0], // 开始时间1（针对异常号码查看明细）  String  否
          jssj1: _tempCloneTabs.queryForm.timeSlotArr2[1] // 结束时间1（针对异常号码查看明细）  String  否
        })
        // console.log('this.detailQueryCondition>>>', this.detailQueryCondition)
      }
    },
    created() {
      this.active = this.$route.path
    },
    mounted() {}
  }

</script>
