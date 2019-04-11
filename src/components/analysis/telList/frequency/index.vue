<template>
<!--通话频率分析-->
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
            <el-form-item label="归属地">
              <el-input v-model="item.queryForm.attribution" style="width:80px;" placeholder=""></el-input>
            </el-form-item>
            <!-- <el-form-item label="通话地点">
                  <el-input v-model="item.queryForm.callArea" style="width:80px;" placeholder=""></el-input>
                </el-form-item> -->
            <!-- <el-form-item label="时段">
                  <el-select v-model="item.queryForm.callTime" style="width:80px;" placeholder="">
                    <el-option v-for="item in timeInterval" :label="item.label" :value="item.value" :key="item.value"></el-option>
                  </el-select>
                </el-form-item> -->
            <el-form-item label="对方号码">
              <el-input v-model="item.queryForm.otherPhone" style="width:120px;" placeholder=""></el-input>
            </el-form-item>
            <!-- <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query">分析</el-button> -->
          </el-form>
        </div>
      </searchBox>
      <div class="app-content-box" v-if="resBox===true">
        <list :canViewMap="false" :list="item.mainList" :tab="tabList" v-if="!loading" @on:rowclick="tableClick" v-height-fix="390"></list>
        <div class="app-toolbar footer">
          <pagination :count="pageInfo.count" :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}" @update:pagenav="pagenavChange"></pagination>
        </div>
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

  .law-box {
    width: 100%;
    min-height: 300px;
    .title {
      height: 30px;
      line-height: 30px;
    }
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
  import { FETCH_TELLIST_FREQUENCY_LIST } from '../../../../store/types'
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
        commName: 'frequency',
        resBox: false,
        pageInfo: { // 页面分页信息相关配置
          count: 10,
          limit: 500,
          currentpage: 1
        },
        tabList: [
          { label: '主叫号码', prop: 'zjhm' },
          { label: '对方号码', prop: 'dfhm' },
          { label: '对方号码归属地', prop: 'gsd' },
          { label: '对方姓名', prop: 'xm' },
          { label: '对方身份证号码', prop: 'dfsfzhm' },
          { label: '对方单位', prop: 'dwmc' },
          { label: '对方职位', prop: 'zw' },
          { label: '总时长', prop: 'thzsc' },
          { label: '次数', prop: 'thcs' },
          { label: '首次', prop: 'sclx' },
          { label: '最后', prop: 'zhlx' },
          { label: '天数', prop: 'ts' },
          { label: '私密', prop: 'smlx' },
          { label: '工时', prop: 'gzlx' },
          { label: '饭时', prop: 'fslx' },
          { label: '凌晨', prop: 'lddwd' }
        ]
      }
    },
    props: [],
    methods: {
      query() {
        this.fetchMainList()
        this.resBox = true
      },
      /**
       * 分页操作
       */
      pagenavChange(obj) {
        // 分页切换操作
        this.pageInfo.limit = obj.limit
        this.pageInfo.currentpage = obj.currentpage
        this.query()
      },
      fetchMainList() {
        let target = this.tabs[this.currentTab],
          queryForm = this.delEmpey({
            v_zjhm: target.keyVal, //  主叫号码   String  是
            v_dfhm: target.queryForm.otherPhone, // 对方号码 String 否
            v_dwmc: '', // 单位名称  String 否
            v_gsd: target.queryForm.attribution, // 归属地 String 否
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 String 否
            v_sctj: target.queryForm.timeLabel, // 时长条件（>=,<=） String  否
            v_thsc: target.queryForm.timeLeght, // 时长 String 否
            v_thcstj: target.queryForm.callCountLabel, // 通话次数条件 String 否
            v_thcstjz: target.queryForm.callCount, // 通话次数条件值  String 否
            v_rwid: '', // 任务ID String 否
            v_orderby: '', // 排序字段（默认按业务时间倒序）  String 否
            v_pageindex: this.pageInfo.currentpage, // 页码  String  否
            v_pagesize: this.pageInfo.limit // 分布大小  String  否
          })

        this.dispatch(FETCH_TELLIST_FREQUENCY_LIST, queryForm).then(() => {
          target.mainList = this.analysisTelList.frequencyList.THPLList.map(d => {
            return d
          })
          let flag = false;
          for (let key in target.mainList[0]) {
            if (key === 'thzsc') {
              flag = true;
              break;
            }
          }
          if (flag) {
            target.mainList.map(item => {
              let time = item.thzsc
              if (time >= 0 && time < 60) {
                time = time + '秒'
              } else if (time > 60 && time < 3600) {
                time = `${parseInt(time / 60)}分${time % 60}秒`
              } else if (time >= 3600) {
                time = `${parseInt(time / 3600)}小时${parseInt((time % 3600) / 60)}分${(time % 3600) % 60}秒`
              }
              item.thzsc = time
            })
          }
          this.pageInfo.count = target.count = this.analysisTelList.frequencyList.Result.totalcount
        })
      },
      tableClick(rowObj) {
        this.detailDialog = true
        let _currentQuery = Object.assign({}, clone(this.tabs[this.currentTab]))
        _currentQuery.queryForm.otherPhone = rowObj.row.dfhm
        this.detailQueryCondition = Object.assign({}, _currentQuery)
      }
    },
    created() {},
    mounted() {}
  }

</script>
