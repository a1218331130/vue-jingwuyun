<template>
<!-- 个人旅店分析 -->
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
            <el-form-item label="同住规则1">
              <el-select v-model="item.queryForm.liveRule1" placeholder="请选择" class="small">
                <el-option v-for="item in liveRule1List" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="同楼层">-->
            <!--<el-checkbox v-model="item.queryForm.floor"></el-checkbox>-->
            <!--</el-form-item>-->
            <el-form-item label="同住规则2">
              <el-select v-model="item.queryForm.liveRule2" placeholder="请选择" class="small">
                <el-option v-for="item in liveRule2List" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="前后时间偏移" labelWidth="120px">
              <el-input-number v-model="item.queryForm.toTime" size="small" :min="1" :max="60" class="small"></el-input-number>
              分钟
            </el-form-item>
            <!--<el-form-item label="多人身份证" labelWidth="120px">-->
            <!--&lt;!&ndash; el-input v-model="item.queryForm.drsfz"></el-input &ndash;&gt;-->
            <!--{{item.guid.join(', ')}}-->
            <!--</el-form-item>-->
            <!--<el-form-item label="交叉时间">-->
            <!--<el-checkbox v-model="floor"></el-checkbox>-->
            <!--</el-form-item>-->
            <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query">分析</el-button>
          </el-form>
        </div>
      </searchBox>
      <div class="app-content-box">
        <!-- 结果列表 -->
        <div class="res-box" v-if="resBox===true">
          <!--<h3>个人旅店分析</h3>-->
          <!--<el-table @cell-mouse-enter="cellMouseEnter" :data="item.mainList" v-loading="loading"-->
          <!--@row-click="showDetail">-->
          <!--<el-table-column v-for="item in table.columns" :key="item.prop" :label="item.label" :prop="item.prop"-->
          <!--align="center"></el-table-column>-->
          <!--</el-table>-->
          <el-table v-loading="loading">
            <div class="app-content-box" v-if="resBox===true" v-for="ld in item.mainList">
              <ul>
                <li>
                  <div class="miniimg">
                    <data-image :idCard="ld.zjhm"></data-image>
                  </div>
                  <div class="list-right">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">姓名：</span>{{ld.xm}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">身份证：</span><a href="#">{{ld.zjhm}}</a></div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">性别：</span>{{ld.xb === '2' ? ld.xb === '1' ? '未知': '女' : '男'}}
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">

                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">旅店名称：</span>{{ld.lgmc}}</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">旅店地址：</span>{{ld.lgdz}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">入住房号：</span>{{ld.rzfh}}
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">入住时间：</span>{{ld.rzsj}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">退房时间：</span>{{ld.tfsj}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">分析人证件号码：</span>{{ld.fxrzjhm}}
                        </div>
                      </el-col>
                      <el-col :span="16">
                        <div class="listbox">
                          <span class="listtitle">旅客编号：</span>{{ld.lkbh}}
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
import { FETCH_LOCUS_HOTEL_LIST } from '../../../../store/types'
import locusMixin from '../locusMinxin'
import dataImage from '../../../../widgets/data-image/data-image'
import searchBox from '../../search-tool'
import list from '../detail.vue'
import { NgwGo } from '../../../../utils/ngw.go'
export default {
  mixins: [locusMixin],
  components: {
    'data-image': dataImage,
    searchBox,
    list
  },
  data() {
    return {
      commName: 'manyHotel',
      singleTab: true,
      resBox: false,
      detailBox: false,
      floor: true,
      table: {
        columns: [
          { label: '分析人姓名', prop: 'fxrxm' },
          { label: '分析人证件号码', prop: 'fxrzjhm' },
          { label: '旅店名称', prop: 'lgmc' },
          { label: '旅馆编码', prop: 'lgbm' },
          { label: '姓名', prop: 'xm' },
          { label: '入住时间', prop: 'rzsj' },
          { label: '退房时间', prop: 'tfsj' },
          { label: '性别', prop: 'xb' },
          { label: '证件号码', prop: 'zjhm' },
          { label: '入住房号', prop: 'rzfh' }
        ],
        data: []
      },
      liveRule1List: [{ label: '同旅馆且同房间', value: '1' }, { label: '同旅馆', value: '2' }],
      liveRule2List: [{ label: '同入住', value: '1' }, { label: '同离开', value: '2' }, { label: '同入住且同离开', value: '3' }],
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
    /**
     * [generateGraph 模拟数据]
     * @return {[type]} [description]
     */
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
      this.dispatch(FETCH_LOCUS_HOTEL_LIST, {
        PageIndex: 1,
        PageSize: 20,
        zjhm: target.guid.join(','),
        tztj: target.queryForm.liveRule1,
        sjtj: target.queryForm.liveRule2,
        kssj: target.queryForm.timeSlot[0].split('-').join('') || '',
        jssj: target.queryForm.timeSlot[1].split('-').join('') || '',
        txcs: target.queryForm.callCount,
        sjpy: target.queryForm.toTime
      }).then(() => {
        console.log('旅店返回值', this.analysisLocus.hotelList.PageData);
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
        target.mainList = this.analysisLocus.hotelList.PageData
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
