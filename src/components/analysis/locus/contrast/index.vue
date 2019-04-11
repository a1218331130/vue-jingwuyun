<template>
<!-- 轨迹对比分析 -->
<!-- 本页套数据 -->
<div ref="wrapper" class="tel-list">
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <div class="tabs">
        <div :class="{'tabs__item':true,'current':currentTab===i}" v-for="(item,i) in tabs" :key="i" :title="item.keyVal" @click="currentTab=i" v-if="item.keyVal">
          <!--{{item.keyVal}}-->
          轨迹对比分析
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

  <div class="tabs-box" ref="tabBox">
    <div class="tabs-box__item" v-for="(item,i) in tabs" v-show="i===currentTab && item.keyVal">
      <searchBox v-model="flag">
        <div slot="formBox">
          <el-form :model="item.queryForm" :inline="true" label-position="right" label-width="90px" ref="formName">
            <el-row>
              <el-col :span="24">
                <el-form-item label="分析号码">
                  <span v-for="(val,i) in item.vals" v-show="val">
                    {{val}}[{{item.names[i]}}] <i @click.stop="removeItem(item,i)" v-show="val" class="iconfont icon-close"></i>
                    <i v-if="val">{{(i < item.vals.length-1?', ':'')}}</i>
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query" style="position:relative;left:10px;top:0">分析</el-button>
            <el-form-item label="时间段">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="timeOptions" @change="val=>updateTimeSlot(item.queryForm, val?val:'')" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <el-form-item label="误差时间" labelWidth="120px">
              <el-input-number v-model="item.queryForm.errorTime" size="small" :min="1" :max="1000" class="small"></el-input-number>分钟
            </el-form-item>
            <el-form-item label="资源列表">
              <el-select v-model="item.queryForm.resList" multiple placeholder="请选择" :style="{width: num + 'px'}">
                <el-option v-for=" item in resourceList " :label="item.label " :value="item.value " :key="item.value "></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </searchBox>
      <div class="app-content-box " v-loading="item.queryForm.firstLoading ">
        <!-- 结果列表 -->
        <div class="res-box " v-if="resBox===true " style="overflow:hidden ">
          <el-col style="width: 30% " class="res-box-list ">
            <div class="res-box-header ">
              对比结果列表
            </div>
            <div class="text item ">
              <el-table class="list-table" :data="item.contrastList " height="100% " border　@row-click="cellClick" style="cursor:pointer ">
                <el-table-column prop="dz" label="地址" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" label="证件号码" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col style="width: 70%" class="res-box-list" v-loading="item.queryForm.twoLoading ">
            <div class="res-box-header">
              轨迹详细信息
            </div>
            <div class="text item ">
              <el-table class="list-table" :data="item.secondList" border style="width: 100%;" height="100%">
                <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
                <el-table-column prop="xm" label="姓名" align="center" width="80"></el-table-column>
                <el-table-column prop="zjhm" label="证件号码" show-overflow-tooltip align="center" width="150"></el-table-column>
                <el-table-column prop="kssj" label="开始时间" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="jssj" label="结束时间" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="gjms" label="轨迹信息" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="gjlxdm" label="轨迹类型" align="center" width="100"></el-table-column>
              </el-table>
            </div>
          </el-col>
        </div>
      </div>
    </div>
  </div>

</div>
</template>
<style lang="scss" scoped>
  .tel-list {
    height: calc( 100vh - 61px);
  }

  .tabs-box {
    height: calc( 100vh - 100px);
    padding-bottom: 0;
  }

  .table-list {
    // max-height: calc(100vh - 261px);
  }

  .res-box-header {
    color: #ff8000;
    padding: 3px;
  }

  .app-content-box {
    height: calc(100vh - 324px);
    overflow-y: scroll;
    .text.item {
      height: calc(100vh - 351px);
      .list-table {
        height: 100%;
      }
    }
  }

</style>
<script>
  import { FETCH_ANALYZE_CONTRAST_LIST, FETCH_ANALYZE_CONTRAST_INFO } from '../../../../store/types'
  import locusMixin from '../locusMinxin'
  import searchBox from '../../search-tool'
  import list from '../detail.vue'
  import { clone } from '../../../../utils/util'
  import ElInput from '../../../../../node_modules/element-ui/packages/input/src/input';
  import dataImage from '../../../../widgets/data-image/data-image'
  export default {
    mixins: [locusMixin],
    components: {
      'data-image': dataImage,
      ElInput,
      searchBox,
      list
    },
    data() {
      return {
        commName: 'contrast',
        cupHeight: '',
        region: null,
        tableData: null,
        cyberBars: [],
        resBox: false,
        detailBox: false,
        flag: false,
        resourceList: [
          { label: '话单信息', value: 'hd' },
          { label: '航班信息', value: 'hb' },
          { label: '高铁信息', value: 'gt' },
          { label: '公安卡口信息', value: 'gakk' },
          { label: '出入境信息', value: 'crj' },
          { label: '旅业信息', value: 'ly' }
        ],
        mainGo: null,
        diagram: null,
        /**
         * [data 模型数据对象(最终结果)]
         * @type {Object}
         */
        goData: {
          /**
           * [nodeDataArray 节点数据]
           * @type {Array}
           */
          // [], //
          nodeDataArray: [],
          /**
           * [linkDataArray 连线数据]
           * @type {Array}
           */
          // [] //
          linkDataArray: []
        },
        singleTab: true,
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
      tabs: {
        handler(val) {
          this.$emit('on-change-tableData', 'contrast')
        },
        deep: true
      }
    },
    methods: {
      query() {
        // let target = this.tabs[this.currentTab]
        if (this.tabs[this.currentTab].queryForm.timeSlot.length < 2) {
          this.$alert('时间段不能为空', '温馨提示')
          return false
        }
        this.cupHeight = this.$refs.tabBox.offsetHeight
        // target.queryForm.firstLoading = true;
        this.fetchMainList()
        this.detailBox = false
      },
      /**
       * 分析按钮提交参数
       */
      fetchMainList() {
        let target = this.tabs[this.currentTab]
        // queryForm = this.delEmpey({
        //   zjhm: target.keyVal, //  身份证号码
        //   kssj: target.queryForm.timeSlot[0] || '',
        //   jssj: target.queryForm.timeSlot[1] || '',
        //   bdlx: target.queryForm.resList || 'hd', // 资源列表
        //   wcsj: target.queryForm.errorTime + '' || '1' // 误差时间
        // })
        //
        let queryForm = {
          kssj: target.queryForm.timeSlot[0] || '',
          jssj: target.queryForm.timeSlot[1] || '',
          zjhm: target.keyVal,
          wcsj: target.queryForm.errorTime,
          bdlx: target.queryForm.resList
        }
        if (queryForm.bdlx.length < 1) {
          this.$message({
            type: 'warning',
            message: '资源列表为必选项'
          })
          // 'error',
          return false
        }
        if (target.vals.length <= 1) {
          this.$message({
            type: 'warning',
            message: '至少选择两个分析号码'
          })
          // 'error',
          return false
        }
        this.resBox = true
        target.queryForm.firstLoading = true
        this.dispatch(FETCH_ANALYZE_CONTRAST_LIST, queryForm)
          .then(() => {
            let res = this.analysisLocus.contrastList
            target.contrastList = res
            target.queryForm.firstLoading = false
          })
      },
      // 表格选择
      cellClick(row, event, column) {
        let target = this.tabs[this.currentTab],
          queryForm = {
            kssj: target.queryForm.timeSlot[0].split('-').join('') || '',
            jssj: target.queryForm.timeSlot[1].split('-').join('') || '',
            zjhm: row.name,
            wcsj: row.cs,
            bdxx: row.dz,
            bdlx: row.bdlx,
            xxzjbh: row.xxzjbh
          }
        target.queryForm.twoLoading = true
        this.dispatch(FETCH_ANALYZE_CONTRAST_INFO, queryForm)
          .then(() => {
            let res = clone(this.analysisLocus.contrastInfo)
            target.secondList = res
            target.secondList.forEach(el => {
              switch (el.gjlxdm) {
                case 'hd':
                  el.gjlxdm = '话单'
                  break;
                case 'hb':
                  el.gjlxdm = '航班'
                  break;
                case 'gt':
                  el.gjlxdm = '高铁'
                  break;
                case 'gakk':
                  el.gjlxdm = '公安卡口'
                  break;
                case 'crj':
                  el.gjlxdm = '出入境'
                  break;
                case 'ly':
                  el.gjlxdm = '旅业'
                  break;
              }
            })
            target.queryForm.twoLoading = false
          })
      },
      // 移除号码
      removeItem(item, index) {
        if (item.names[index] === '手动输入') {
          this.removeCommTab({
            name: item.names[index],
            guid: item.guid[index],
            keyVal: item.vals[index]
          })
          return false
        }
        this.removeTab({ guid: item.guid[index] })
      }
    },
    created() {},
    mounted() {}
  }

</script>
