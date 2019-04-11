<!-- 概况(统计) -->
<template>
<div class="tactics">
  <el-row :gutter="10">
    <el-col :span="7" class="tactics__box-wrap">
      <div class="tactics__box">
        <div class="tactics__box__title">
          布控概况
        </div>
        <div class="tactics__box__content">

          <div v-if="surveillance.fetchGaik" class="control__top__right__group" v-for="elem in  datalist" :key="elem.BKMC">
            <div class="tablediv">
              <div class="tablediv__title">
                <img v-if="elem.BKMC==='布控总数'" src='/static/img/res/menu_62.png' />
                <img v-if="elem.BKMC==='布控人员'" src='/static/img/res/menu_35.png' />
                <img v-if="elem.BKMC==='布控车辆'" src='/static/img/res/menu_36.png' />
                <img v-if="elem.BKMC==='布控关键字'" src='/static/img/res/menu_65.png' />
              </div>
              <div class="tablediv__body">
                <span>{{elem.BKMC}}:</span>{{elem.BKNUM}}</div>
            </div>
          </div>
          <!-- <div class="control__top__right__group">
            <div class="tablediv">
              <div class="tablediv__title"><img src='/static/img/res/menu_62.png' /></div>
              <div class="tablediv__body"><span>布控总数:</span>122</div>
            </div>
          </div>
          <div class="control__top__right__group">
            <div class="tablediv">
              <div class="tablediv__title"><img src='/static/img/res/menu_35.png' /></div>
              <div class="tablediv__body"><span>布控人员:</span>34</div>
            </div>
          </div>
          <div class="control__top__right__group">
            <div class="tablediv">
              <div class="tablediv__title"><img src='/static/img/res/menu_36.png' /></div>
              <div class="tablediv__body"><span>布控车辆:</span>56</div>
            </div>
          </div>
          <div class="control__top__right__group">
            <div class="tablediv">
              <div class="tablediv__title"><img src='/static/img/res/menu_65.png' /></div>
              <div class="tablediv__body"><span>布控关键字:</span>32</div>
            </div>
          </div> -->

          <!-- <div class="control__top__right__group" v-for="(item, index) in warGeneral.list" :key="index">
            <div class="tablediv" v-for="(items, index) in item" :key="index">
              <div class="tablediv__title"><img :src="'/static/img/res/tactics_'+items.ZFLX+'.png'" /></div>
              <div class="tablediv__body"><span>{{items.ZFLB}}:</span>{{items.TOTAL}}</div>
            </div>
          </div> -->
        </div>
      </div>

    </el-col>
    <el-col :span="10" class="tactics__box-wrap">
      <div class="tactics__box">
        <div class="tactics__box__title">
          各县区布控分布
        </div>
        <div class="tactics__box__content rel">
          <!-- <div class="mapTitle">
            {{warGeneral}}
          </div> -->
          <!-- 地图数据详情 -->
          <!-- <echartsDetails :options="options"></echartsDetails> -->
          <echarts ref="mapCount" :option="mapTestOps" :mapdata="mapData" style="width:100%; height:100%"></echarts>
        </div>
      </div>
    </el-col>

    <el-col :span="7" class="tactics__box-wrap">
      <div class="tactics__box--half">
        <div class="tactics__box__title">
          布控状态分析
        </div>
        <div class="tactics__box__content">
          <echarts ref="ywzlCount" :option="pieTestOps" style="width:100%; height:100%;"></echarts>
        </div>
      </div>
      <div class="tactics__box--half">
        <div class="tactics__box__title">
          布控特征占比分析
        </div>
        <div class="tactics__box__content">
          <!-- <echarts :option="pieFeature" style="width:100%; height:100%;"></echarts> -->
          <echarts ref="tzCount" :option="pieMyOps" style="width:100%; height:100%;"></echarts>
        </div>
      </div>
    </el-col>
    <!-- <el-col :span="24" style="margin-top: 10px;">
      <div class="union-statistics__box" style="height:400px;">
        <div class="union-statistics__box__title">
          布控趋势分析
        </div>
        <div class="tactics__box__content rel">
          <div class="total_num">
            布控任务数:
            <span> {{countAll}} </span> 布控结果数:
            <span> {{countResult}} </span>
          </div>
          <echarts ref="ywCount" :option="lineTestOps" style="width:100%; height:100%;"></echarts>
        </div>
      </div>
    </el-col> -->
  </el-row>
</div>
</template>

<style lang="scss" scoped>
  .total_num {
    font-size: 16px;
    height: 16px;
    color: #999;
    line-height: 18px;
    position: absolute;
    top: 15px;
    left: 60px;
    span {
      font-size: 18px;
      color: #333;
    }
  }

  .tactics {
    padding: 10px;
    &__base-info {
      height: 160px;
      border-top: 1px solid #ccc;
      &__item {
        line-height: 160px;
      }
    }
    &__box {
      &,
      &-wrap {
        height: calc(100vh - 80px);
      }
      &+& {
        margin-top: 10px;
      }
      &--half {
        @extend .tactics__box;
        height: calc(50% - 5px);
      }
      &--small {
        @extend .tactics__box;
        height: calc(40% - 5px); // height: calc(100vh - 600px);
      }
      &--list {
        @extend .tactics__box;
        height: calc(50% - 5px);
        border-top-width: 1px;
      }
      &__title {
        background: #85c0e9;
        color: #fff;
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
      }
      &__content {
        background: #fff;
        height: 100%; // padding: 20px;
        overflow: hidden;
        border: 1px solid #ccc;
        .el-tabs {
          height: 100%;
          margin: 0;
          &__content {
            height: calc(100% - 42px);
            overflow: auto;
            position: relative;
          }
        }
        .mapTitle {
          width: 400px;
          color: #579fd2;
          border: 1px solid #579fd2;
          margin: 20px auto;
          padding: 5px 15px;
          text-align: center;
          border-radius: 30px;
        }
      }
      &__title+&__content {
        height: calc(100% - 40px);
        border-top: 0;
      }
      .General {
        font-size: 18px;
        padding: 20px 30px;
        text-indent: 36px;
        display: block;
        line-height: 1.5;
        color: #1fa4ea;
        text-align: left;
      }
      .control__top__right__group {
        display: flex;
        flex-direction: row;
        background: #7cbae8;
        margin-bottom: 10px;
        flex-basis: 78px;
        margin: 15px;
        border-radius: 20px;
        border: 1px solid #4da5e6;
        &:nth-child(2) {
          background: #67c1b9;
          border-color: #3fb1a6;
          .tablediv__body {
            color: #3fb1a6;
          }
        }
        &:nth-child(3) {
          background: #dea265;
          border-color: #e4923d;
          .tablediv__body {
            color: #e4923d;
          }
        }
        &:nth-child(4) {
          background: #E48A8F;
          border-color: #E48A8F;
          .tablediv__body {
            color: #E48A8F;
          }
        }
        &:nth-child(5) {
          background: #C0AEE4;
          border-color: #C0AEE4;
          .tablediv__body {
            color: #C0AEE4;
          }
        }
        .tablediv {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin: 15px;
          text-align: center;
          &__title {
            color: #fff;
            font-size: 14px;
            padding: 0 9px 9px;
            img {
              height: 70px;
            }
          }
          &__body {
            padding: 5px;
            font-size: 18px;
            font-weight: 900;
            background: #fff;
            flex: 1;
            color: #4da5e6;
            border-radius: 20px;
            span {
              font-size: 14px;
            }
          }
        }
      }
    }
    &__list {
      overflow: auto;
      &__item {
        padding: 5px 20px;
        border-bottom: 1px solid #e2e2e2;
        &__image {
          width: 50px;
          height: 50px;
          border: 5px solid #fff;
          border-radius: 100%;
          overflow: hidden;
          img {
            width: 100%;
            height: auto;
          }
        }
        &__title {
          color: #000;
          margin-top: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .el-tag {
            text-align: center;
            margin-right: 10px;
          }
        }
        &__desc {
          color: #999;
        }
        &__count {
          text-align: right;
          color: #ff9900;
          margin-top: 10px;
        }
        &__author {
          text-align: right;
          color: #999;
        }
      }
    }
  }

  .union-statistics {
    padding: 10px;
    &__box {
      height: calc(100vh - 150px);
      margin-bottom: 10px;
      position: relative;
      &-wrap {
        height: calc(100vh - 160px);
      }
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
      }
      &__title+&__content {
        height: calc(100% - 40px);
        border-top: 0;
      }
    }
    .person-box {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 2;
      &__item {
        text-align: center;
        width: 160px;
        margin-bottom: 10px;
        &__title {
          font-size: 14px;
          color: #fff;
          height: 35px;
          line-height: 35px;
        }
        &__value {
          background: #f2f2f2;
          font-size: 20px;
          color: #666;
          font-weight: bold;
          height: 50px;
          line-height: 50px;
          border: 1px solid #ccc;
          position: relative;
          &:before {
            content: '';
            width: 90%;
            border-bottom: 1px dashed #ccc;
            position: absolute;
            top: 5px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        &.blue {
          .person-box__item__title {
            background-color: #54aaff;
          }
        }
        &.orange {
          .person-box__item__title {
            background-color: #ff9933;
          }
        }
        &.green {
          .person-box__item__title {
            background-color: #66cc66;
          }
        }
      }
    }
  }

</style>

<script>
  import { mapState } from 'vuex'
  import { GET_CONTROL_MANAGE_ALL_PIC_LIST, FETCH_GAIK } from '../../../store/types'

  import mixin from '../../../utils/mixin'
  import { clone } from '../../../utils/util'

  import echarts from '../../../widgets/echarts'
  import chartsOps from '../../../utils/echartsOptions/all'
  import mapData from '../../../utils/echartsOptions/mapData'

  export default {
    mixins: [mixin, chartsOps, mapData],
    components: {
      echarts
    },
    data() {
      return {
        countAll: 0,
        countResult: 0,
        mapTestOps: null,
        pieMyOps: null,
        pieTestOps: null,
        pieFeature: null,
        lineTestOps: null,
        datalist: [],
        list: [],
        listZxdt: [{
          id: '1',
          title: '3-11特大案件 布控对象4415801196205303627 在 网鱼网吧 出现',
          applyTime: '2017-11-21 14:00:27'
        }, {
          id: '2',
          title: '丢失车辆 布控对象粤a75e3 在景秀小区出现',
          applyTime: '2017-11-21 11:20:04'
        }, {
          id: '3',
          title: '重点人员李鹏 布控对象440104198712055453 在长沙火车站出现',
          applyTime: '2017-11-20 19:00:21'
        }, {
          id: '4',
          title: '盗窃人员 布控对象43122619980319001X 在 长安酒店出现',
          applyTime: '2017-11-20 15:42:29'
        }, {
          id: '5',
          title: '3-11特大案件 布控对象4556619620536644 在 东陵网吧 出现',
          applyTime: '2017-11-19 16:45:12'
        }, {
          id: '6',
          title: '3-11特大案件 布控对象4388981196205303627 在 战狼网吧 出现',
          applyTime: '2017-11-18 19:50:10'
        }, {
          id: '7',
          title: '吸毒人员 布控对象李苏蜡 在方圆酒店出现',
          applyTime: '2017-11-18 16:45:02'
        }, {
          id: '8',
          title: '3-11特大案件 布控对象466811196205303627 在 方圆酒店 出现',
          applyTime: '2017-11-17 19:40:10'
        }, {
          id: '9',
          title: '重点人员 布控对象李苏蜡 在石原酒店出现',
          applyTime: '2017-11-16 21:52:00'
        }, {
          id: '10',
          title: '火车站肇事案 布控对象4541196205303627 在 网鱼网吧 出现',
          applyTime: '2017-11-15 22:52:08'
        }, {
          id: '11',
          title: '吸毒人员 布控对象李苏蜡 在东东酒店出现',
          applyTime: '2017-11-15 15:22:50'
        }, {
          id: '12',
          title: '12.11特大案件 布控对象433001196205303627 在 石原酒店 出现',
          applyTime: '2017-11-14 21:52:26'
        }, {
          id: '13',
          title: '重点人员 布控对象李苏蜡 在电源酒店出现',
          applyTime: '2017-11-13 15:54:02'
        }],
        controldata: []
      }
    },
    computed: {
      ...mapState(['controlManage', 'survey', 'surveillance'])
    },
    watch: {
      controldata(val) {
        // 饼图数据
        /**
         * [pieTestOps 布控任务总览]
         * @type {[type]}
         */
        this.pieTestOps = clone(this.echartsPieOptions.full)
        // 待审批、未开始、进行中、已结束、分享
        this.pieTestOps.legend.data = ['草稿数', '待审批', '进行中', '未开始', '已结束']
        this.pieTestOps.series[0].center = ['50%', '50%']
        this.pieTestOps.tooltip = {
          formatter: '{b}:<br />({c}条)<br />({d}%)'
        }
        this.pieTestOps.series[0].label.normal = {
          position: 'outside',
          formatter: '{b}:\n({c}条)\n({d}%)'
        }
        this.pieTestOps.series[0].labelLine = {
          show: true
        }
        // this.pieTestOps.series[0].data = [{ name: '待审批', value: 11 }, { name: '未开始', value: 21 }, {
        //   name: '进行中',
        //   value: 31
        // }, { name: '已结束', value: 41 }, { name: '分享', value: 51 }]
        /**
         * [pieTestOps 布控特征占比]
         * @type {[type]}
         */
        this.pieFeature = clone(this.echartsPieOptions.base)
        // 身份证、手机号码 、 邮箱、座机号码、QQ号码、微信账号、微博账号、车牌号、车辆识别号、环保标志号、档案编号
        this.pieFeature.legend.data = ['身份证', '手机号码', '姓名', '银行卡', '邮箱', '座机号码', '车牌号', '车辆识别号']
        // this.pieFeature.series[0].data = [{ name: '身份证', value: 11 }, { name: '手机号码', value: 21 }, {
        //   name: '邮箱',
        //   value: 31
        // }, { name: '座机号码', value: 41 }, { name: 'QQ号码', value: 51 }, { name: '微信账号', value: 31 }, { name: '微博账号', value: 41 }, { name: '车牌号', value: 51 }, { name: '车辆识别号', value: 41 }, { name: '环保标志号', value: 51 }, { name: '档案编号', value: 51 }]
        this.pieMyOps = clone(this.echartsPieOptions.full)
        this.pieMyOps.series[0].center = ['50%', '50%']
        this.pieMyOps.tooltip = {
          formatter: '{b}:<br />({c}次)<br />({d}%)'
        }
        this.pieMyOps.series[0].label.normal = {
          position: 'outside',
          formatter: '{b}:\n({c}次)\n({d}%)'
        }
        this.pieMyOps.series[0].labelLine = {
          show: true
        }
        this.pieMyOps.legend.data = ['姓名', '身份证', '手机号码', '手机IMEI码', '手机IMSI码', 'QQ', '微信', '车牌种类/车牌号']
        // 折线图数据
        this.lineTestOps = clone(this.echartsLineOptions.situation)
        this.lineTestOps.xAxis.data = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        var temps = [{
          name: '布控总任务数',
          type: 'line',
          sampling: 'average',
          itemStyle: {
            normal: {
              color: 'rgb(236,21,98)'
            }
          },
          data: []
        }, {
          name: '布控结果数',
          type: 'line',
          sampling: 'average',
          itemStyle: {
            normal: {
              color: 'rgb(253,139,69)'
            }
          },
          data: []
        }];
        this.lineTestOps.series = temps
        this.lineTestOps.legend.data = ['布控总任务数', '布控结果数']
        // this.lineTestOps.series[0].data = [25, 35, 66, 15, 12, 43, 5, 12, 15, 1, 4, 2, 2, 3, 4, 1, 6, 4, 5, 1, 1, 19, 4, 5, 9]
        // this.lineTestOps.series[1].data = [5, 13, 54, 18, 12, 43, 5, 12, 20, 7, 4, 2, 8, 3, 4, 5, 2, 1, 5, 6, 1, 15, 8, 5, 4]
        this.mapTestOps = clone(this.echartsMapOptions.base)
        this.dispatch(FETCH_GAIK, {}).then(() => {
          let data = this.surveillance.fetchGaik
          let controldatas = {
            area: data.area,
            bkdxlx: data.bkdxlx,
            rwzl: data.bkzt,
            tzzb: {},
            zrws: []
          }
          data.bktz.map(item => {
            switch (item.TZLX) {
              case '1':
                controldatas.tzzb.xm = item.COUNT;
                break;
              case '2':
                controldatas.tzzb.sfz = item.COUNT;
                break;
              case '3':
                controldatas.tzzb.sjhm = item.COUNT;
                break;
              case '4':
                controldatas.tzzb.IMEI = item.COUNT;
                break;
              case '5':
                controldatas.tzzb.IMSI = item.COUNT;
                break;
              case '6':
                controldatas.tzzb.QQ = item.COUNT;
                break;
              case '7':
                controldatas.tzzb.wx = item.COUNT;
                break;
              case '8':
                controldatas.tzzb.cph = item.COUNT;
                break;
              case '9':
                controldatas.tzzb.xb = item.COUNT;
                break;
            }
          })
          this.pieTestOps.series[0].data = [{ name: '草稿数', value: controldatas.rwzl.cgx }, { name: '待审批', value: controldatas.rwzl.dsp }, { name: '进行中', value: controldatas.rwzl.jxz }, { name: '未开始', value: controldatas.rwzl.wks }, { name: '已结束', value: controldatas.rwzl.yjs }]

          // this.pieMyOps.series[0].data = [11, 22, 11, 22, 11, 22, 11, 22]
          this.pieMyOps.series[0].data = [{ name: '姓名', value: controldatas.tzzb.xm }, { name: '身份证', value: controldatas.tzzb.sfz }, { name: '手机号码', value: controldatas.tzzb.sjhm }, { name: '手机IMEI码', value: controldatas.tzzb.IMEI }, { name: '手机IMSI码', value: controldatas.tzzb.IMSI }, { name: 'QQ', value: controldatas.tzzb.QQ }, { name: '微信', value: controldatas.tzzb.wx }, { name: '车牌种类/车牌号', value: controldatas.tzzb.cph }]
          // this.lineTestOps.series[0].data = controldatas.zrws.map(d => d.ZS)
          // this.lineTestOps.series[1].data = controldatas.zrws.map(d => d.BDJGS)
          // let countAll = 0
          // let countResult = 0
          // this.lineTestOps.series[0].data.forEach(d => {
          //   countAll += d
          // })
          // this.countAll = countAll
          // this.lineTestOps.series[1].data.forEach(d => {
          //   countResult += d
          // })
          // this.countResult = countResult
          // if (this.$refs.ywCount.action) this.$refs.ywCount.action()
          // if (this.$refs.ywzlCount.action) this.$refs.ywzlCount.action()
          // if (this.$refs.tzCount.action) this.$refs.tzCount.action()
          this.datalist = controldatas.bkdxlx
          let list = controldatas.area.map(c => {
            return {
              name: c.SSQYMC,
              value: c.COUNT
            }
          })
          this.mapTestOps.series[0].data = list
          if (this.$refs.mapCount.action) this.$refs.mapCount.action()
        })
      }
    },
    methods: {
      getData() {
        this.dispatch(FETCH_GAIK).then(() => {
          let data = this.surveillance.fetchGaik
          this.controldata = {
            area: data.area,
            bkdxlx: data.bkdxlx,
            rwzl: data.bkzt,
            tzzb: {},
            zrws: []
          }
          data.bktz.map(item => {
            switch (item.TZLX) {
              case '1':
                this.controldata.tzzb.xm = item.COUNT;
                break;
              case '2':
                this.controldata.tzzb.sfz = item.COUNT;
                break;
              case '3':
                this.controldata.tzzb.sjhm = item.COUNT;
                break;
              case '4':
                this.controldata.tzzb.IMEI = item.COUNT;
                break;
              case '5':
                this.controldata.tzzb.IMSI = item.COUNT;
                break;
              case '6':
                this.controldata.tzzb.QQ = item.COUNT;
                break;
              case '7':
                this.controldata.tzzb.wx = item.COUNT;
                break;
              case '8':
                this.controldata.tzzb.cph = item.COUNT;
                break;
              case '9':
                this.controldata.tzzb.xb = item.COUNT;
                break;
            }
          })
        })
      }
    },
    created() {},
    mounted() {
      this.controldata = '1'
      // this.getData()
      // this.dispatch(GET_CONTROL_MANAGE_ALL_PIC_LIST, {}).then(() => {
      //   this.controldata = this.controlManage.allPicList
      //   console.log(this.controlManage.allPicList, 'this.controldata 333333333333333')
      // })
      // // 饼图数据
      // /**
      //  * [pieTestOps 布控任务总览]
      //  * @type {[type]}
      //  */
      // this.pieTestOps = clone(this.echartsPieOptions.full)
      // // 待审批、未开始、进行中、已结束、分享
      // this.pieTestOps.legend.data = ['草稿数', '待审批', '进行中', '未开始']
      // this.pieTestOps.series[0].center = ['50%', '50%']
      // this.pieTestOps.tooltip = {
      //   formatter: '{b}:<br />({c}条)<br />({d}%)'
      // }
      // this.pieTestOps.series[0].label.normal = {
      //   position: 'outside',
      //   formatter: '{b}:\n({c}条)\n({d}%)'
      // }
      // this.pieTestOps.series[0].labelLine = {
      //   show: true
      // }
      // // this.pieTestOps.series[0].data = [{ name: '待审批', value: 11 }, { name: '未开始', value: 21 }, {
      // //   name: '进行中',
      // //   value: 31
      // // }, { name: '已结束', value: 41 }, { name: '分享', value: 51 }]
      // /**
      //  * [pieTestOps 布控特征占比]
      //  * @type {[type]}
      //  */
      // this.pieFeature = clone(this.echartsPieOptions.base)
      // // 身份证、手机号码 、 邮箱、座机号码、QQ号码、微信账号、微博账号、车牌号、车辆识别号、环保标志号、档案编号
      // this.pieFeature.legend.data = ['身份证', '手机号码', '姓名', '银行卡', '邮箱', '座机号码', '车牌号', '车辆识别号']
      // // this.pieFeature.series[0].data = [{ name: '身份证', value: 11 }, { name: '手机号码', value: 21 }, {
      // //   name: '邮箱',
      // //   value: 31
      // // }, { name: '座机号码', value: 41 }, { name: 'QQ号码', value: 51 }, { name: '微信账号', value: 31 }, { name: '微博账号', value: 41 }, { name: '车牌号', value: 51 }, { name: '车辆识别号', value: 41 }, { name: '环保标志号', value: 51 }, { name: '档案编号', value: 51 }]
      // this.pieMyOps = clone(this.echartsPieOptions.full)
      // this.pieMyOps.series[0].center = ['50%', '50%']
      // this.pieMyOps.tooltip = {
      //   formatter: '{b}:<br />({c}次)<br />({d}%)'
      // }
      // this.pieMyOps.series[0].label.normal = {
      //   position: 'outside',
      //   formatter: '{b}:\n({c}次)\n({d}%)'
      // }
      // this.pieMyOps.series[0].labelLine = {
      //   show: true
      // }
      // this.pieMyOps.legend.data = ['身份证', '手机号码', '姓名', '银行卡', '邮箱', '座机号码', '车牌号', '车辆识别号']
      // // 折线图数据
      // this.lineTestOps = clone(this.echartsLineOptions.situation)
      // this.lineTestOps.xAxis.data = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      // var temps = [{
      //   name: '布控总任务数',
      //   type: 'line',
      //   sampling: 'average',
      //   itemStyle: {
      //     normal: {
      //       color: 'rgb(236,21,98)'
      //     }
      //   },
      //   data: []
      // }, {
      //   name: '布控结果数',
      //   type: 'line',
      //   sampling: 'average',
      //   itemStyle: {
      //     normal: {
      //       color: 'rgb(253,139,69)'
      //     }
      //   },
      //   data: []
      // }];
      // this.lineTestOps.series = temps
      // this.lineTestOps.legend.data = ['布控总任务数', '布控结果数']
      // // this.lineTestOps.series[0].data = [25, 35, 66, 15, 12, 43, 5, 12, 15, 1, 4, 2, 2, 3, 4, 1, 6, 4, 5, 1, 1, 19, 4, 5, 9]
      // // this.lineTestOps.series[1].data = [5, 13, 54, 18, 12, 43, 5, 12, 20, 7, 4, 2, 8, 3, 4, 5, 2, 1, 5, 6, 1, 15, 8, 5, 4]
      // this.mapTestOps = clone(this.echartsMapOptions.base)
      // this.dispatch(GET_CONTROL_MANAGE_ALL_PIC_LIST, {}).then(() => {
      //   this.pieTestOps.series[0].data = [{ name: '草稿数', value: this.controlManage.allPicList.rwzl.cgx }, { name: '待审批', value: this.controlManage.allPicList.rwzl.dsp }, {
      //     name: '进行中',
      //     value: this.controlManage.allPicList.rwzl.jxz
      //   }, { name: '未开始', value: this.controlManage.allPicList.rwzl.wks }]
      //
      //   // this.pieMyOps.series[0].data = [11, 22, 11, 22, 11, 22, 11, 22]
      //   this.pieMyOps.series[0].data = [{ name: '身份证', value: this.controlManage.allPicList.tzzb.sfz }, { name: '手机号码', value: this.controlManage.allPicList.tzzb.sjhm }, {
      //     name: '姓名',
      //     value: this.controlManage.allPicList.tzzb.xm
      //   }, { name: '银行卡', value: this.controlManage.allPicList.tzzb.yhk }, { name: '邮箱', value: this.controlManage.allPicList.tzzb.yx }, { name: '座机号码', value: this.controlManage.allPicList.tzzb.zjhm }, {
      //     name: '车牌号',
      //     value: this.controlManage.allPicList
      //       .tzzb.cph
      //   }, {
      //     name: '车辆识别号',
      //     value: this.controlManage.allPicList
      //       .tzzb.clsbh
      //   }]
      //   this.lineTestOps.series[0].data = this.controlManage.allPicList.zrws.map(d => d.ZS)
      //   this.lineTestOps.series[1].data = this.controlManage.allPicList.zrws.map(d => d.BDJGS)
      //   let countAll = 0
      //   let countResult = 0
      //   this.lineTestOps.series[0].data.forEach(d => {
      //     countAll += d
      //   })
      //   this.countAll = countAll
      //   this.lineTestOps.series[1].data.forEach(d => {
      //     countResult += d
      //   })
      //   this.countResult = countResult
      //
      //   if(this.$refs.ywCount.action) this.$refs.ywCount.action()
      //   if(this.$refs.ywzlCount.action) this.$refs.ywzlCount.action()
      //   if(this.$refs.tzCount.action) this.$refs.tzCount.action()
      //
      //   console.log(this.controlManage.allPicList, 789999999999999999);
      //   this.datalist = this.controlManage.allPicList.bkdxlx
      //   let list = this.controlManage.allPicList.area.map(c => {
      //     return {
      //       name: c.SSQYMC,
      //       value: c.COUNT
      //     }
      //   })
      //   console.log(list, 123111111111);
      //   this.mapTestOps.series[0].data = list
      //   if(this.$refs.mapCount.action) this.$refs.mapCount.action()
      // })
      console.log(GET_CONTROL_MANAGE_ALL_PIC_LIST)
    }
  }

</script>
