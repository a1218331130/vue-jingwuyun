<template>
  <!-- 个人活动规律分析 -->
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
              <el-form-item label="时间区间 ">
                <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / "
                                :editable="false" :picker-options="pickerOptions"
                                @change="val=>updateTimeSlot(item.queryForm, val)" placeholder="请选择"></el-date-picker>
              </el-form-item>
              <el-button type="primary" style="height: 36px" native-type="submit" @click.prevent="query">分析</el-button>
            </el-form>
          </div>
        </searchBox>
        <div class="app-content-box">
          <div>
            <!-- 内容 -->
            <div class="card-sub-title" style="padding-top: 15px;">交通工具</div>
            <el-row :gutter="15" style="border-top:1px solid #d7d7d7; padding: 0;" class="kinship-box">
              <el-col :span="24">
                <ul class="gjfx_ul" v-for="item in trail.zgs">
                  <!-- <ul class="gjfx_ul">
                     <li v-for="item in trail">
                     <div class="gj_bg " :class="item.bg"><i class="iconfont  " :class="item.icon"
                     style="font-size:35px;"></i>
                     </div>
                     {{item.name}} <span>{{item.number}}</span>
                     </li>-->
                  <li v-if="item.gjlx ==='QB'">
                    <div class="gj_bg gj_bg1"><i class="iconfont icon-hangkongyunshu" style="font-size:35px;"></i>
                    </div>
                    全部 <span>{{item.tjsl}}</span>
                  </li>
                  <li v-if="item.gjlx ==='LY'">
                    <div class="gj_bg gj_bg2"><i class="iconfont icon-jiudian" style="font-size:35px;"></i>
                    </div>
                    旅店 <span>{{item.tjsl}}</span>
                  </li>
                  <li v-if="item.gjlx ==='WB'">
                    <div class="gj_bg gj_bg3"><i class="iconfont icon-web" style="font-size:35px;"></i>
                    </div>
                    网吧 <span>{{item.tjsl}}</span>
                  </li>
                  <li v-if="item.gjlx ==='TL'">
                    <div class="gj_bg gj_bg4"><i class="iconfont icon-huoche" style="font-size:35px;"></i>
                    </div>
                    铁路 <span>{{item.tjsl}}</span>
                  </li>
                  <li v-if="item.gjlx ==='HB'">
                    <div class="gj_bg gj_bg5"><i class="iconfont icon-hangkongyunshu" style="font-size:35px;"></i>
                    </div>
                    航班 <span>{{item.tjsl}}</span>
                  </li>
                  <li v-if="item.gjlx ==='YL'">
                    <div class="gj_bg gj_bg6"><i class="iconfont icon-youlun" style="font-size:35px;"></i>
                    </div>
                    游轮 <span>{{item.tjsl}}</span>
                  </li>

                </ul>
              </el-col>
            </el-row>
            <div class="card-sub-title" style="padding: 15px; ">统计分析</div>
            <el-row :gutter="0" style="border-top:1px solid #d7d7d7; padding: 0;">
              <el-col :span="12" style="border-right:1px solid #d7d7d7">
                <div>
                  <echarts :option="radarOptions" style="width:100%; height:480px;"></echarts>
                </div>
              </el-col>
              <el-col :span="12">
                <el-row :gutter="0">
                  <el-col :span="24">
                    <echarts :option="barTestOpsArea" style="width:100%;height: 400px;"></echarts>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-col :span="24" style="border-top:1px solid #d7d7d7; padding: 15px 15px;">
              <el-row :gutter="15" class="qy_box">
                <el-col :span="3" class="qy_title">
                  <div class="iconfont icon-coordinates_fill"></div>
                  活动区域
                </el-col>
                <el-col :span="9" class="qy_body">
                  <ul class="qu_ul">
                    <!--<ul class="qu_ul" v-for="(itemcs,i) in trail.cs">-->
                    <!--<li v-if="itemcs.gjlx ==='QY'">i. {{itemcs.csmc}} <span>{{itemcs.tjsl}}次</span></li>-->
                    <li>1. 长沙市 <span>23次</span></li>
                    <li>2. 怀化市 <span>11次</span></li>
                    <li>3. 湘潭市 <span>5次</span></li>
                    <li>4. 衡阳市 <span>2次</span></li>
                    <li>5. 张家界市 <span>1次</span></li>
                    <li>5. 张家界市 <span>1次</span></li>
                    <li>5. 张家界市 <span>1次</span></li>
                  </ul>
                </el-col>
                <el-col :span="3" class="qy_title">
                  <div class="iconfont icon-city"></div>
                  常住酒店
                </el-col>
                <el-col :span="9" class="qy_body">
                  <ul class="qu_ul" v-for="(itemcs,i) in hotelArr">
                    <li v-if="itemcs.gjlx ==='LY'">
                      {{i + 1}}.{{itemcs.csmc === null ? (itemcs.csbh + '(酒店编号)' ) : itemcs.csmc}} <span>{{itemcs.tjsl}}次</span>
                    </li>
                  </ul>
                </el-col>
              </el-row>
              <el-row :gutter="15" class="qy_box">
                <el-col :span="3" class="qy_title">
                  <div class="iconfont icon-city"></div>
                  常去网吧
                </el-col>
                <el-col :span="9" class="qy_body">
                  <ul class="qu_ul" v-for="(itemcs,i) in netArr">
                    <li v-if="itemcs.gjlx ==='WB'">
                      {{i + 1}}.{{itemcs.csmc === null ? (itemcs.csbh + '(网吧编号)' ) : itemcs.csmc}} <span>{{itemcs.tjsl}}次</span>
                    </li>
                  </ul>
                </el-col>
              </el-row>
            </el-col>


            <!-- <el-row :gutter="15" style="border-top:1px solid #d7d7d7; padding: 0;">
               <el-col :span="24">
                 <div class="card-sub-title" style="padding: 15px 0;">时光轨迹</div>
               </el-col>
               <el-col :span="24" v-loading="dossierLoading">
                 <time-line :timeLine="timeLine"></time-line>
               </el-col>
             </el-row>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .kinship-box {
    text-align: center;
    margin-top: 13px;
  }

  .gjfx_ul li {
    list-style: none;
    margin: 0 0 15px;
    padding: 0;
    float: left;
    width: 10%;
    text-align: center;
    .gj_bg {
      width: 67px;
      height: 67px;
      line-height: 86px;
      margin: 0 auto;
      border-radius: 5px;
      color: #fff;

      &.gj_bg1 {
        background: #69ca94;
      }
      &.gj_bg2 {
        background: #7fb5d8;
      }
      &.gj_bg3 {
        background: burlywood;
      }
      &.gj_bg4 {
        background: bisque;
      }
      &.gj_bg5 {
        background: burlywood;
      }
      &.gj_bg6 {
        background: #7fb5d8;
      }
    }
    span {
      margin-top: 5px;
      display: inline-block;
      color: #fd6d6d;
    }
  }

  .card-sub-title {
    color: #46bbfb;
  }

  .qy_box {
    border: 1px solid #e5e5e5;
    height: auto;
    overflow: hidden;
    margin-bottom: 10px;
    .qy_title {
      background: #75c8ff;
      text-align: center;
      color: #fff;
      padding: 15px 0;
      .iconfont {
        font-size: 38px;
      }
    }
    .qy_body {
      background: #fafafa;
    }
    .qu_ul {
      padding: 0 10px;
      margin: 5px;
      li {
        color: #666;
        list-style: none;
        display: inline-block;
        width: 49%;
        margin-bottom: 7px;
        &:first-child {
          margin-bottom: 0;
        }
        span {
          color: #75c8ff;
          margin-right: 25px;
          float: right;
        }
      }
    }
  }

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

  .tactics__box {
    margin: 0;
    height: 455px;
    padding: 10px;
    padding-bottom: 0px;
    &__title {
      background: #85c0e9;
      color: #fff;
      padding: 0 20px;
      height: 40px;
      line-height: 40px;
    }
    &__content {
      background: #fff;
      height: 100%;
      overflow: hidden;
      border: 1px solid #ccc;
      &-echars {
        height: 100%;
      }
    }
    &__title + &__content {
      height: calc(100% - 40px);
      border-top: 0;
    }
  }
</style>
<script>
  import {FETCH_LOCUS} from '../../../../store/types'
  import timeLine from '../../../dossier/people/modules/time_line.vue'
  import locusMixin from '../locusMinxin'
  import echarts from '../../../../widgets/echarts'
  import echartsDetails from '../../../../widgets/echarts/echart-details'
  import searchBox from '../../search-tool'
  import list from '../detail.vue'
  import {clone} from '../../../../utils/util'
  import chartsOps from '../../../../utils/echartsOptions/all'
  export default {
    mixins: [locusMixin, chartsOps, timeLine],
    components: {
      singleTab: true,
      'time-line': timeLine,
      searchBox,
      echarts,
      echartsDetails,
      list
    },
    data() {
      return {
        radarmax: 0,
        netArr: [],
        hotelArr: [],
        trail: {
          zgs: [{
            gjlx: 'QB', tjsl: 0
          }, {
            gjlx: 'WB', tjsl: 0
          }, {
            gjlx: 'TL', tjsl: 0
          }, {
            gjlx: 'LY', tjsl: 0
          }, {
            gjlx: 'HB', tjsl: 0
          }, {
            gjlx: 'YL', tjsl: 0
          }]
        },
        commName: 'activityRule',
        resBox: true,
        detailBox: false,
        table: {
          columns: [],
          data: []
        },
        total: 30,
        mainGo: null,
        diagram: null,
        pieTestOps: null,
        radarOptions: null,
        pieTestOpsAge: null,
        pieTestOpsGrade: null,
        lineTestOps: null,
        mapTestOps: null,
        barTestOps: null,
        isChange: true,
//        showDetail: true,
        options: {
          column: 'three',
          title: '活动规律分布图',
          tool: null,
          head: ['名称', '数量', ''],
          // 沅陵县、鹤城区、洪江市、中方县、辰溪县、溆浦县、会同县、麻阳苗族自治县、新晃侗族自治县、芷江侗族自治县、靖州苗族侗族自治县、通道侗族自治县
          list: [{id: 1, name: '沅陵县', value: '435'},
            {id: 2, name: '鹤城区', value: '434'},
            {id: 3, name: '洪江市', value: '134'},
            {id: 4, name: '中方县', value: '834'},
            {id: 5, name: '辰溪县', value: '1234'},
            {id: 6, name: '溆浦县', value: '2234'},
            {id: 7, name: '会同县', value: '234'}
          ]
        }
      }
    },
    props: [],
    computed: {},
    methods: {
      query() {
        console.log('这是tab', this.currentTabItem)
        this.fetchMainList()
//      this.resBox = true
//      this.detailBox = false
      },
      fetchMainList() {
        let target = this.tabs[this.currentTab]
        this.dispatch(FETCH_LOCUS, {
          zjhm: target.guid,
          kssj: target.queryForm.timeSlot[0].split('-').join('') || '',
          jssj: target.queryForm.timeSlot[1].split('-').join('') || ''
        }).then(() => {
          console.log('list', this.analysisLocus.list)
//          this.trail = this.analysisLocus.list
          this.netArr = this.analysisLocus.list.cs.filter(r => r.gjlx.includes('WB'))// 网吧次数数据
          this.hotelArr = this.analysisLocus.list.cs.filter(r => r.gjlx.includes('LY'))// 旅店次数数据
          let rardarArr = [0, 0, 0, 0, 0]
          this.analysisLocus.list.zgs.forEach(d => {
            if (d.gjlx === 'QB') {
              this.trail.zgs[0].tjsl = d.tjsl
            }
            if (d.gjlx === 'WB') {
              this.trail.zgs[1].tjsl = d.tjsl
              rardarArr[0] = d.tjsl
            }
            if (d.gjlx === 'TL') {
              this.trail.zgs[2].tjsl = d.tjsl
              rardarArr[1] = d.tjsl
            }
            if (d.gjlx === 'LY') {
              this.trail.zgs[3].tjsl = d.tjsl
              rardarArr[2] = d.tjsl
            }
            if (d.gjlx === 'HB') {
              this.trail.zgs[4].tjsl = d.tjsl
              rardarArr[3] = d.tjsl
            }
            if (d.gjlx === 'YL') {
              this.trail.zgs[5].tjsl = d.tjsl
              rardarArr[4] = d.tjsl
            }
          })
          this.radarmax = rardarArr.map(d => d).sort((a, b) => {
            return b - a
          })[0] + 1
          this.radarOptions = clone(this.echartsRadarOptions.base)
          // 诈骗案、盗窃案、抢夺案、抢劫案、敲诈案、故意杀人 data: [
          this.radarOptions.radar[0].indicator = [
            {text: '旅店', max: this.radarmax},
            {text: '网吧', max: this.radarmax},
            {text: '铁路', max: this.radarmax},
            {text: '航班', max: this.radarmax},
            {text: '其他', max: this.radarmax}
          ]
          this.radarOptions.series[0].data[0] = rardarArr
        })
      },
      showDetail() {
//        this.detailBox = true
//        this.initMaker()
      }
    },
    created() {
    },
    mounted() {
      this.radarOptions = clone(this.echartsRadarOptions.base)
      // 诈骗案、盗窃案、抢夺案、抢劫案、敲诈案、故意杀人 data: [
      this.radarOptions.radar[0].indicator = [
        {text: '旅店', max: 1000},
        {text: '网吧', max: 1000},
        {text: '铁路', max: 1000},
        {text: '航班', max: 1000},
        {text: '其他', max: 1000}
      ]
      this.radarOptions.series[0].data[0] = [88, 800, 777, 940, 670]
      this.barTestOpsArea = clone(this.echartsBarOptions.base)
      this.barTestOpsArea.xAxis.data = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      // this.barTestOpsArea.legend.data = ['人员数量', '人员类型增量']
      var AreaTemp = [{
        name: '出行次数',
        type: 'bar',
        barWidth: 15,
        stack: '月份',
        data: [320, 270, 360, 340, 280, 55, 320, 270, 360, 340, 280, 55]
      }];
      this.barTestOpsArea.series = AreaTemp
    }
  }
</script>
