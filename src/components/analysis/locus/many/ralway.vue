<template>
<!--个人铁路分析 -->
<!-- 本页套数据 -->
<div class="tel-list">
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <div class="tabs">
        <div :class="{'tabs__item':true,'current':currentTab===i}" v-for="(item,i) in tabs" @click="currentTab=i">
          {{item.keyVal}}
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
            <el-form-item label="日期区间">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm, val)" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <el-form-item label="同乘规则">
              <el-select v-model="item.queryForm.takeRule" placeholder="请选择" class="small">
                <el-option v-for="item in takeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="同乘次数">
              >=
              <el-input-number class="small" v-model="item.queryForm.callCount" size="small" :min="1" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item label="车站条件">
              <el-select class="small" v-model="item.queryForm.stationRule" placeholder="请选择">
                <el-option v-for="item in stationList" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="前后时间偏移" labelWidth="120px">
              <el-input-number v-model="item.queryForm.num" size="small" :min="1" :max="1000" class="small"></el-input-number>
              分钟
            </el-form-item>
            <!--<el-form-item label="多人身份证" labelWidth="120px">-->
            <!--&lt;!&ndash;<el-input v-model="item.queryForm.drsfz"></el-input>&ndash;&gt;-->
            <!--如{{item.guid.join(', ')}}-->
            <!--</el-form-item>-->
            <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query">分析</el-button>
          </el-form>
        </div>
      </searchBox>
      <div class="app-content-box">
        <!-- 结果列表 -->
        <div class="res-box" v-if="resBox===true">
          <!--<h3>个人铁路分析</h3>-->
          <!-- <el-table @cell-mouse-enter="cellMouseEnter" :data="item.mainList" v-loading="loading"
                       @row-click="showDetail">
               <el-table-column v-for="item in table.columns" :key="item.prop" :label="item.label" :prop="item.prop"
                                align="center"></el-table-column>
             </el-table>-->
          <el-table v-loading="loading">
            <div class="app-content-box" v-if="resBox===true" v-for="wb in item.mainList">
              <ul>
                <li>
                  <div class="miniimg">
                    <data-image :idCard="wb.zjhm"></data-image>
                  </div>
                  <div class="list-right">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">姓名：</span>{{wb.xm}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">身份证：</span><a href="#">{{wb.zjhm}}</a></div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">分析人证件号码：</span>{{wb.fxrzjhm}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">车次：</span>{{wb.cc}}
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">

                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">乘车日期：</span>{{wb.ccrq}}</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">乘车时间：</span>{{wb.ccsj}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">出发站：</span>{{wb.fz}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">到达站：</span>{{wb.dz}}
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">票种：</span>{{wb.pz}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">席别：</span>{{wb.xb}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">车厢号：</span>{{wb.cxh}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">座位号：</span>{{wb.zwh}}
                        </div>
                      </el-col>
                    </el-row>
                    <!--<el-row :gutter="20">-->
                    <!--<el-col :span="24">-->
                    <!--<span class="tags">前科人员</span>-->
                    <!--<span class="tags">前科人员</span>-->
                    <!--<span class="tags">前科人员</span>-->
                    <!--</el-col>-->
                    <!--</el-row>-->
                  </div>
                </li>
              </ul>
            </div>
          </el-table>
        </div>
      </div>

    </div>
  </div>

</div>
</template>
<style lang="scss" scoped>
.comm {
    .maker {
        background: #fff;
        height: calc(100vh - 205px);
    }
    .overview-box {
        width: 200px;
        height: 100px;
        position: absolute;
        bottom: 0;
        right: 0;
    }
}
.app-content-box {
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
        li {
            list-style: none;
            margin: 0;
            padding: 12px;
            border: 1px solid #d7d7d7;
            border-bottom: 0;
            &:last-child {
                border-bottom: 1px solid #d7d7d7;
            }
            &:after {
                content: '';
                display: block;
                height: 0;
                clear: both;
            }
        }
    }
    .miniimg {
        width: 89px;
        height: 103px;
        background: #f2f2f2;
        padding: 2px;
        border: 1px solid #d7d7d7;
        float: left;
        img {
            position: relative;
            width: 100%;
            height: 100%;

        }
    }
    .list-right {
        float: left;
        width: calc(100% - 109px);
        line-height: 30px;
        .listtitle {
            color: #999;
            width: 130px;
            text-align: right;
            display: inline-block;
        }
    }
    .tags {
        position: relative;
        background: #ff8d42;
        display: inline-block;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        padding: 0 10px;
        color: #fff;
        margin-left: 25px;
        line-height: 22px;
        &:first-child {
            margin-left: 50px;
        }
        &:before {
            content: '';
            display: block;
            position: absolute;
            right: -11px;
            top: 0;
            border-top: 11px solid transparent;
            border-bottom: 11px solid transparent;
            border-left: 11px solid #ff8d42;
            border-right: 0;
        }
    }
    .content-right {}

}
</style>
<script>
import { FETCH_LOCUS_RAIL_LIST } from '../../../../store/types'
import locusMixin from '../locusMinxin'
import dataImage from '../../../../widgets/data-image/data-image'
import searchBox from '../../search-tool'
import list from '../detail.vue'
import { NgwGo } from '../../../../utils/ngw.go'
export default {
  mixins: [locusMixin],
  components: {
    searchBox,
    'data-image': dataImage,
    list
  },
  data() {
    return {
      commName: 'manyRalway',
      singleTab: true,
      resBox: false,
      detailBox: false,
      takeList: [{ value: 1, label: '同车次且同车厢' }, { value: 2, label: '同车次' }],
      stationList: [
        { value: 1, label: '出发地和目的地相同' }, { value: 2, label: '出发地相同' }, { value: 3, label: '目的地相同' }, {
          value: 4,
          label: '不限'
        }
      ],
      table: {
        columns: [
          { label: '分析人姓名', prop: 'fxrxm' },
          { label: '分析人证件号码', prop: 'fxrzjhm' },
          { label: '姓名', prop: 'XM' },
          { label: '证件号码', prop: 'ZJHM' },
          { label: '姓名', prop: 'XM' },
          { label: '乘车日期', prop: 'ccrq' },
          { label: '乘车时间', prop: 'ccsj' },
          { label: '车次', prop: 'cc' },
          { label: '出发站', prop: 'fz' },
          { label: '车厢号', prop: 'cxh' },
          { label: '席别', prop: 'xb' },
          { label: '座位号', prop: 'zwh' },
          { label: '票种', prop: 'pz' },
          { label: '到达站', prop: 'dz' }
        ],
        data: []
      },
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
      testData: ['622588743697531', '622588523698521', '622587412587412']
    }
  },
  props: [],
  computed: {},
  methods: {
    /**
     * 初始化建模器(GOJS)
     * @return {[type]} [description]
     */
    /**
     * 初始化建模器(GOJS)
     * @return {[type]} [description]
     */
    initMaker() {
      let self = this;
      if (this.mainGo === null) {
        self.mainGo = new NgwGo({
          diagram: self.diagram,
          data: self.goData,
          readOnly: true,
          overview: 'overViewBox'
        })
      }
      self.mainGo.init()
    },
    query() {
      this.fetchMainList()
      this.resBox = true
      this.detailBox = false
    },
    fetchMainList() {
      let target = this.tabs[this.currentTab]
      console.log('参数target', target)
      if (target.guid.length < 2) {
        this.$message({
          type: 'error',
          message: '必需选择一个以上不同的身份证',
          showClose: true
        })
        return false
      }
      this.dispatch(FETCH_LOCUS_RAIL_LIST, {
        PageIndex: 1,
        PageSize: 20,
        zjhm: target.guid.join(','),
        tztj: target.queryForm.stationRule,
        sjtj: target.queryForm.takeRule,
        kssj: target.queryForm.timeSlot[0].split('-').join('') || '',
        jssj: target.queryForm.timeSlot[1].split('-').join('') || '',
        txcs: target.queryForm.callCount,
        sjpy: target.queryForm.toTime
      }).then(() => {
        console.log('铁路返回值', this.analysisLocus.railList.PageData);
        //          let res = this.analysisLocus.hotelList.PageData
        //          for (let i in res) {
        //            console.log('性别', i)
        //            if (i.xb === '1') {
        //              i.xb = '男'
        //            } else if (i.xb === '1') {
        //              i.xb = '女'
        //            } else {
        //              i.xb = '未知'
        //            }
        //          }
        target.mainList = this.analysisLocus.railList.PageData
      })
    },
    showDetail() {
      this.detailBox = true
      this.initMaker()
    }
  },
  created() {},
  mounted() {}
}
</script>
