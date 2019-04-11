<template>
  <!-- 个人航班同离岗分析 -->
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
              <el-form-item label="时间区间">
                <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / "
                                :editable="false" :picker-options="pickerOptions"
                                @change="val=>updateTimeSlot(item.queryForm, val)" placeholder="请选择"></el-date-picker>
              </el-form-item>
              <el-form-item label="同乘次数">
                <!--<el-select v-model="item.queryForm.timeLabel" placeholder="请选择" class="small">-->
                <!--<el-option v-for="item in logicOps" :label="item.label" :value="item.value" :key="item.value"></el-option>-->
                <!--</el-select>-->
                >=
                <el-input-number v-model="item.queryForm.timeLeght" class="small" size="small" :min="1"
                                 :max="1000"></el-input-number>
              </el-form-item>
              <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query">分析</el-button>
            </el-form>
          </div>
        </searchBox>
        <div class="app-content-box">
          <!-- 结果列表 -->
          <div class="res-box" v-if="resBox===true">
            <!--<h3>航班同订票分析</h3>-->
           <!-- <el-table @cell-mouse-enter="cellMouseEnter" :data="item.mainList" v-loading="loading"
                      @row-click="showDetail">
              <el-table-column v-for="item in table.columns" :key="item.prop" :label="item.label" :prop="item.prop"
                               align="center"></el-table-column>
            </el-table>-->
            <div class="app-content-box" v-if="resBox===true" v-for="hb in item.mainList">
              <ul>
                <li>
                  <div class="miniimg">
                    <data-image :idCard="hb.zjhm"></data-image>
                  </div>
                  <div class="list-right">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">姓名：</span>{{hb.xm === null ? '暂无数据' : hb.xm}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">身份证：</span><a href="#">{{hb.zjhm}}</a></div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">分析人证件号码：</span>{{hb.fxrzjhm}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">性别：</span>{{hb.xb}}
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">航班号：</span>{{hb.hbh}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">航班日期：</span>{{hb.hb_rq}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">离岗日期：</span>{{hb.lg_rq}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">进岗日期：</span>{{hb.jg_rq}}
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">始发地：</span>{{hb.qfhzsz}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">目的地：</span>{{hb.dahzsz}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">旅客座位：</span>{{hb.lkzw}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">分析人姓名：</span>{{hb.fxrxm}}
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
  import {FETCH_LOCUS_FLIGHT_LIST} from '../../../../store/types'
  import locusMixin from '../locusMinxin'
  import dataImage from '../../../../widgets/data-image/data-image'
  import searchBox from '../../search-tool'
  import list from '../detail.vue'
  import {NgwGo} from '../../../../utils/ngw.go'
  export default {
    mixins: [locusMixin],
    components: {
      searchBox,
      'data-image': dataImage,
      list
    },
    data() {
      return {
        commName: 'flightDeparture',
        resBox: false,
        detailBox: false,
        table: {
          columns: [
            {label: '分析人姓名', prop: 'fxrxm'},
            {label: '分析人证件号码', prop: 'fxrzjhm'},
            {label: '姓名', prop: 'XM'},
            {label: '证件号码', prop: 'zjhm'},
            {label: '姓名', prop: 'XM'},
            {label: '性别', prop: 'xb'},
            {label: '航班号', prop: 'hbh'},
            {label: '航班日期', prop: 'hb_rq'},
            {label: '离岗日期', prop: 'lg_rq'},
            {label: '进岗日期', prop: 'jg_rq'},
            {label: '始发地', prop: 'qfhzsz'},
            {label: '目的地', prop: 'dahzsz'},
            {label: '旅客座位', prop: 'dahzsz'}],
          data: []
        },
        mainGo: null,
        diagram: null
      }
    },
    props: [],
    computed: {},
    methods: {
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
        this.dispatch(FETCH_LOCUS_FLIGHT_LIST, {
          PageIndex: 1,
          PageSize: 20,
          zjhm: target.guid,
          tztj: target.queryForm.stationRule,
          sjtj: target.queryForm.takeRule,
          kssj: target.queryForm.timeSlot[0].split('-').join('') || '',
          jssj: target.queryForm.timeSlot[1].split('-').join('') || '',
          txcs: target.queryForm.callCount
//        sjpy: target.queryForm.toTime
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
    created() {
    },
    mounted() {
    }
  }
</script>
