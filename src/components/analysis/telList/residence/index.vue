<template>
<!-- 居住地分析 -->
<!-- 本页吴杰套数据, 最后做 -->
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
    <div class="tabs-box__item" v-for="(item,i) in tabs" v-show="i===currentTab">
      <searchBox>
        <div slot="formBox">
          <el-form :model="item.queryForm" :inline="true" label-position="right" label-width="90px">
            <el-button type="primary" class="analysis primary-btn" native-type="submit" @click.prevent="query">分析</el-button>
            <el-form-item label="时间段">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm, val?val:'')" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <el-form-item label="时段">
              早上
              <el-input-number class="small" v-model="item.queryForm.timeM" size="small" :min="1" :max="12"></el-input-number>
              点前 . 晚上
              <el-input-number class="small" v-model="item.queryForm.timeN" size="small" :min="17" :max="23"></el-input-number>
              点后
            </el-form-item>
            <el-form-item label="出现次数">
              <el-input-number v-model="item.queryForm.degree" class="small" size="small" :min="1" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item label="时间间隔">
              <el-input-number v-model="item.queryForm.timeInterval" class="small" size="small" :min="1" :max="1000"></el-input-number>
              小时
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="item.queryForm.timeType" placeholder="">
                <el-option v-for="item in timeTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query">分析</el-button> -->
          </el-form>
        </div>
      </searchBox>
      <div class="app-content-box" v-if="resBox===true">
        <!-- 结果详情 -->
        <div class="list-box">
          <el-row class="list-box-row">
            <el-col class="list-box-row__col" :span="1">序号</el-col>
            <el-col class="list-box-row__col" :span="16">地址</el-col>
            <el-col class="list-box-row__col" :span="3">类型</el-col>
            <el-col class="list-box-row__col" :span="2">出现次数</el-col>
            <!--<el-col class="list-box-row__col" :span="2">地图</el-col>-->
            <el-col class="list-box-row__col" :span="2">查看明细</el-col>
          </el-row>
          <div class="list-box-con" v-for="(list,i) in item.mainList" :key="i">
            <!-- <el-row class="row-list">
              <el-col :span="24">{{list.area}}</el-col>
            </el-row> -->
            <el-row class="row-list__details" v-for="(item,itemIndex) in list.details" :key="itemIndex">
              <el-col class="details__col" :span="1">{{itemIndex + 1}}</el-col>
              <el-col class="details__col left" :span="16">{{item.area}}</el-col>
              <el-col class="details__col" :span="3">{{item.type}}</el-col>
              <el-col class="details__col" :span="2">{{item.num}}</el-col>
              <!--<el-col class="details__col pointer" :span="2"><i class="iconfont icon-ditu"></i>地图</el-col>-->
              <el-col class="details__col pointer" :span="2">
                <el-button type="text" @click="showDetail({type:item.typeCode, jzdm: item.jzdm,xqdm: item.xqdm})" title="详情" icon="icon iconfont icon-chakan">详情
                </el-button>
              </el-col>
            </el-row>
          </div>

        </div>
        <div class="app-toolbar footer">
          <pagination :count="pageInfo.count" :pagenav="pageInfo" @update:pagenav="mainPagenavChange"></pagination>
        </div>
      </div>

    </div>
  </div>

  <!-- 详情列表弹窗 -->
  <el-dialog v-draggable="dialogDraggableOptions" :title="'详单 - ' + dialogTile" :visible.sync="detailBox" size="info--fixed">
    <list :list="table.resData" :tab="table.tabList" :H="'450'"></list>
    <div class="app-toolbar footer">
      <pagination :count="detailPageInfo.count" :pagenav="detailPageInfo" @update:pagenav="pagenavChange"></pagination>
    </div>
  </el-dialog>
</div>
</template>
<style lang="scss" scoped>
  .root {
    height: calc(100vh - 60px);
  }

  .tel-list .app-content-box {
    height: calc(100vh - 280px);
    overflow: hidden;
  }

  .list-box {
    width: 100%;
    border: 1px solid #c9c9c9;
    border-bottom: none; // height: 80%;
    height: calc(100vh - 380px);
    overflow: auto;
    &-row {
      height: 38px;
      background-color: #97cbff;
      line-height: 38px;
      color: #ffffff;
      &__col {
        text-align: center;
        border-right: 1px solid #D7D7D7;
      }
    }
  }

  .row-list {
    margin-top: 10px;
    height: 38px;
    line-height: 38px;
    background-color: #ffffff;
    color: #2893e1;
    padding-left: 15px;
    border-bottom: 1px solid #c9c9c9;
    &__details {
      height: 38px;
      line-height: 38px;
      background-color: #ffffff;
      color: #7e7e7e;
      border-bottom: 1px solid #c9c9c9;
      .details__col {
        text-align: center;
        padding-left: 10px;
        &.left {
          padding-left: 0;
          text-align: left;
        }
        .iconfont {
          color: #00cc99;
          margin-right: 5px;
        }
      }
    }
  }

  .primary-btn {
    position: relative;
    top: 1px;
    left: 0;
  }

</style>
<script>
  import { FETCH_TELLIST_RESIDENCE_LIST, FETCH_TELLIST_RESIDENCE_DETAIL_LIST } from '../../../../store/types'
  import telListMixin from '../telListMixin'
  import pagination from '../../../../widgets/pagination/pagination.vue'
  import searchBox from '../../search-tool'
  import list from '../list'
  import { clone } from '../../../../utils/util'
  export default {
    mixins: [telListMixin],
    components: {
      searchBox,
      list,
      pagination
    },
    data() {
      return {
        dialogTile: '',
        domicileList: [],
        THType: ['当天早晚', '隔天早晚', '非工作时间'],
        commName: 'residence',
        resBox: false,
        pageSize: '',
        detailBox: false,
        detailPageInfo: { // 页面分页信息相关配置
          count: 10,
          limit: 500,
          currentpage: 1
        },
        pageInfo: { // 页面分页信息相关配置
          count: 10,
          limit: 500,
          currentpage: 1
        },
        table: {
          tabList: [
            { label: '主叫号码', prop: 'zjhm' },
            { label: '呼叫类型', prop: 'hjlx' },
            { label: '对方号码', prop: 'dfhm' },
            { label: '通话地点', prop: 'thd' },
            { label: '通话日期', prop: 'thrq' },
            { label: '通话时间', prop: 'thsj' },
            { label: '星期', prop: 'xq' },
            { label: '通话时长', prop: 'thsc' },
            { label: '对方姓名', prop: 'xm' },
            { label: '对方身份证号码', prop: 'dfsfzhm' },
            { label: '对方职位', prop: 'zw' },
            { label: '对方号码归属地', prop: 'gsd' },
            { label: '业务时间', prop: 'ywsj' }
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
        this.detailPageInfo.limit = obj.limit
        this.detailPageInfo.currentpage = obj.currentpage
        // this.aaa = obj.currentpage
        this.showDtail()
      },
      mainPagenavChange(obj) {
        this.pageInfo.limit = obj.limit
        this.pageInfo.currentpage = obj.currentpage
        // this.aaa = obj.currentpage
        this.query()
      },
      query() {
        this.fetchMainList()
        this.resBox = true
        this.detailBox = false
      },
      fetchMainList() {
        let target = this.tabs[this.currentTab],
          queryForm = this.delEmpey({
            v_zjhm: target.keyVal, //  主叫号码   String  是
            v_rwid: '', // 任务ID String 否
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 String 否
            v_cs: target.queryForm.degree, // 次数 Int 是
            v_jgsj: target.queryForm.timeInterval, // 间隔时间 Int 是
            v_type: target.queryForm.timeType, // 类型（0全部，1当天早晚，2隔天早晚，3非工作时间） Int 是
            v_beforetime: target.queryForm.timeM, // 早上几点前 Int 是
            v_aftertime: target.queryForm.timeN, // 晚上几点后 Int 是
            v_pageindex: this.pageInfo.currentpage, // 页码  String  否
            v_pagesize: this.pageInfo.limit // 分布大小  String  否
          })

        this.dispatch(FETCH_TELLIST_RESIDENCE_LIST, queryForm).then(() => {
          target.mainList = []
          let _arList = clone(this.analysisTelList.residenceList)
          let _areaListTemp = [] // 地点临时存储
          for (let ari in _arList) {
            let _arListTROW = _arList[ari]
            if (_arListTROW[0]) {
              _arListTROW.map((rlt, rIndex) => {
                let _thisRow = { // 当前行数据
                  area: rlt.thdd,
                  type: rlt.lx,
                  typeCode: rlt.lxdm,
                  jzdm: rlt.jzdm,
                  xqdm: rlt.xqdm,
                  num: rlt.cs
                }
                // 判断是否当前地点是否已记录
                if (_areaListTemp.includes(rlt.thdd)) {
                  target.mainList[_areaListTemp.indexOf(rlt.thdd)].csNum += rlt.cs // 追加统计地点总通话次数
                  let _tmlDetailsT = target.mainList[_areaListTemp.indexOf(rlt.thdd)].details
                  _tmlDetailsT.push(_thisRow) //  数据追加到相应的地点
                  _tmlDetailsT.sort((a, b) => { // 根据出现次数排序 由大到小
                    return b.num - a.num
                  })
                } else {
                  _areaListTemp.push(rlt.thdd)
                  target.mainList.push({
                    id: ari + 1,
                    area: rlt.thdd,
                    csNum: rlt.cs,
                    details: [_thisRow]
                  })
                }
              })
            }
          }
          target.mainList.sort((a, b) => { // 根据出现总次数排序 由大到小
            return b.csNum - a.csNum
          })
          this.pageInfo.count = target.count = target.mainList.length
        })
      },
      showDetail(par) {
        let target = this.tabs[this.currentTab]
        this.dispatch(FETCH_TELLIST_RESIDENCE_DETAIL_LIST, {
          v_zjhm: target.keyVal, //  主叫号码   String  是
          v_rwid: '', // 任务ID String 否
          v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 String 否
          v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 String 否
          v_cs: target.queryForm.degree, // 次数 Int 是
          v_jgsj: target.queryForm.timeInterval, // 间隔时间 Int 是
          v_type: parseInt(par.type || '0'), // 类型（0全部，1当天早晚，2隔天早晚，3非工作时间） Int 是
          v_beforetime: target.queryForm.timeM, // 早上几点前 Int 是
          v_aftertime: target.queryForm.timeN, // 晚上几点后 Int 是
          v_jzdm: parseInt(par.jzdm || '0'), // 基站代码 String 是
          v_xqdm: parseInt(par.xqdm || '0'), // 小区代码 String 是
          v_pageindex: this.detailPageInfo.currentpage, // 页码 String 否
          v_pagesize: this.detailPageInfo.limit // 分布大小 String 否
        }).then(() => {
          let _arList = clone(this.analysisTelList.residenceDetailList)
          this.table.resData = []
          let ii = 0
          for (let ari in _arList) {
            ii += 1
            let _arListTROW = _arList[ari]
            if (_arListTROW[0]) {
              this.detailBox = true
              _arListTROW.map((rlt, rIndex) => {
                this.dialogTile = this.THType[ii - 1] + ' ' + rlt.thd
                this.table.resData.push(rlt)
              })
            }
          }
          this.detailBox = true
          this.detailPageInfo.count = this.table.resData.length
        })
      }
    },
    created() {
      this.active = this.$route.path
    },
    mounted() {}
  }

</script>
