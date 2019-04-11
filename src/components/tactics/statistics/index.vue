<!-- 概况(统计) -->
<template>
<div>
  <div class="tactics">
    <el-row :gutter="10">
      <el-col :span="7" class="tactics__box-wrap">
        <div class="tactics__box">
          <div class="tactics__box__title">
            战法概况
          </div>
          <div class="tactics__box__content">

            <div class="control__top__right__group">
              <div class="tablediv">
                <div class="tablediv__title"><img src='/static/img/res/menu_62.png' /></div>
                <div class="tablediv__body"><span>战法总数:</span>{{warGeneral.total}}</div>
              </div>
            </div>

            <div class="control__top__right__group" v-for="(item, index) in warGeneral.list" :key="index" >
              <div class="tablediv" v-for="(items, index) in item" :key="index">
                <div class="tablediv__title"><img :src="'/static/img/res/tactics_'+items.ZFLX+'.png'" /></div>
                <div class="tablediv__body"><span>{{items.ZFLB}}:</span>{{items.TOTAL}}</div>
              </div>
            </div>
          </div>
        </div>

      </el-col>
      <el-col :span="10" class="tactics__box-wrap">
        <div class="tactics__box">
          <div class="tactics__box__title">
            区域分布图
          </div>
          <div class="tactics__box__content rel">
            <!-- <div class="mapTitle">
              {{warGeneral}}
            </div> -->
            <!-- 地图数据详情 -->
            <!-- <echartsDetails :options="options"></echartsDetails> -->
            <echarts :option="mapTestOps" :mapdata="mapData" style="width:100%; height:100%"></echarts>
          </div>
        </div>
      </el-col>
      <el-col :span="7" class="tactics__box-wrap">
        <!--<div class="tactics__box&#45;&#45;small">-->
        <!--<div class="tactics__box__title">-->
        <!--单位使用排行-->
        <!--</div>-->
        <!--<div class="tactics__box__content">-->
        <!--<echarts :option="barTestOps" style="width:100%; height:100%;"></echarts>-->
        <!--</div>-->
        <!--</div>-->
        <div class="tactics__box--half">
          <div class="tactics__box__title">
            分类统计
          </div>
          <div class="tactics__box__content">
            <echarts :option="pieTestOps" style="width:100%; height:100%;"></echarts>
          </div>
        </div>
        <div class="tactics__box--list">
          <div class="tactics__box__content">
            <el-tabs>
              <el-tab-pane label="使用排行">
                <div class="tactics__list">
                  <div class="tactics__list__item" v-for="(item, key) in mostList">
                    <el-row>
                      <el-col :span="16">
                        <div class="tactics__list__item__title">
                          <el-tag type="primary">{{key+1}}</el-tag> {{item.title}}
                        </div>
                      </el-col>
                      <el-col :span="7">
                        <div class="tactics__list__item__count">
                          {{item.count}}次
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="点赞排行">
                <div class="tactics__list">
                  <div class="tactics__list__item" v-for="(item, key) in newList">
                    <el-row>
                      <el-col :span="16">
                        <div class="tactics__list__item__title">
                          <el-tag type="primary"> {{key+1}}</el-tag> {{item.title}}
                        </div>
                      </el-col>
                      <el-col :span="7">
                        <div class="tactics__list__item__count">
                          {{item.count}}次
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="单位排行">
                <div class="tactics__list">
                  <div class="tactics__list__item" v-for="(item, key) in dwList">
                    <el-row>
                      <el-col :span="16">
                        <div class="tactics__list__item__title">
                          <el-tag type="primary">{{key+1}}</el-tag> {{item.name}}
                        </div>
                      </el-col>
                      <el-col :span="7">
                        <div class="tactics__list__item__count">
                          {{item.value}}
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="个人排行">
                <div class="tactics__list">
                  <div class="tactics__list__item" v-for="(item, key) in CreateList">
                    <el-row>
                      <el-col :span="16">
                        <div class="tactics__list__item__title">
                          <el-tag type="primary">{{key+1}}</el-tag> {{item.title}}
                        </div>
                      </el-col>
                      <el-col :span="7">
                        <div class="tactics__list__item__count">
                          {{item.count}}次
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-tab-pane>

            </el-tabs>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<style lang="scss">
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
        & + & {
            margin-top: 10px;
        }
        &--half {
            @extend .tactics__box;
            height: calc(50% - 5px);
        }
        &--small {
            @extend .tactics__box;
            height: calc(40% - 5px);
            // height: calc(100vh - 600px);
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
            height: 100%;
            // padding: 20px;
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
        &__title + &__content {
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
              background:#67c1b9;
              border-color:#3fb1a6;
              .tablediv__body{
                color:#3fb1a6;
              }
            }
            &:nth-child(3) {
            background:#dea265;
             border-color:#e4923d;
              .tablediv__body{
                color:#e4923d;
              }
            }
            &:nth-child(4) {
            background:#E48A8F;
             border-color:#E48A8F;
              .tablediv__body{
                color:#E48A8F;
              }
            }
            &:nth-child(5) {
            background:#C0AEE4;
             border-color:#C0AEE4;
              .tablediv__body{
                color:#C0AEE4;
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
                span{
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
</style>
<script>
import mixin from '../../../utils/mixin'
import { mapState } from 'vuex'
import { clone } from '../../../utils/util'
import {
  FETCH_CLASSIFICATION_USAGE,
  FETCH_CLASSIFICATION_DISTRIBUTION,
  FETCH_CLASSIFICATION_MONTHLY_USAGE,
  FETCH_POINT_RANKING,
  FETCH_USE_RANKING,
  FETCH_COLLECT_RANKING,
  FETCH_UNIT_RANKING,
  FETCH_GENERAL_DESCRIPTION,
  SINGLE_CREATE_RANKING,
  SINGLE_USE_RANKING
} from '../../../store/types'
import echarts from '../../../widgets/echarts'
import chartsOps from '../../../utils/echartsOptions/all'
import mapData from '../../../utils/echartsOptions/mapData'
import echartsDetails from '../../../widgets/echarts/echart-details'
export default {
  mixins: [mixin, chartsOps, mapData],
  components: {
    echarts,
    echartsDetails
  },
  data() {
    return {
      pieTestOps: null,
      lineTestOps: null,
      mapTestOps: null,
      barTestOps: null,
      warGeneral: {
        total: '',
        list: []
      },
      usageList: [], // 实用排行榜
      distributionList: [], // 战法分布情况
      monthlyUsageList: [], // 战法分布情况
      mostList: [],
      newList: [],
      collectList: [],
      dwList: [],
      CreateList: [],
      UseList: [],
      isChange: 1,
      showDetail: true,
      options: {
        column: 'four',
        title: '区域战法分布图',
        head: ['名称', '次数', '同比增幅'],
        list: [{ id: 1, name: '卡口战法', alarm: '435', danger: '16%', order: '71' },
          { id: 2, name: '关系分析战法', alarm: '434', danger: '12%', order: '41' },
          { id: 3, name: '资金异动', alarm: '134', danger: '26%', order: '-91' },
          { id: 4, name: '情理战法', alarm: '834', danger: '32%', order: '14' },
          { id: 5, name: '话单异常战法', alarm: '1234', danger: '34%', order: '41' },
          { id: 6, name: '异常行为战法', alarm: '2234', danger: '1%', order: '-11' },
          { id: 7, name: '找人战法', alarm: '234', danger: '5%', order: '10' }
        ]
      }
    }
  },
  computed: {
    ...mapState(['survey'])
  },
  watch: {},
  methods: {},
  created() {
    this.dispatch(FETCH_POINT_RANKING, {}).then(() => {
      this.newList = this.survey.pointRanking.map(d => {
        return {
          title: d.ZFMC,
          count: d.DZCS
        }
      })
    })
    // 战法概况-战法使用排行
    this.dispatch(FETCH_USE_RANKING, {}).then(() => {
      this.mostList = this.survey.UseRanking.map(d => {
        return {
          title: d.ZFMC,
          count: d.SYCS
        }
      })
    })
    // 战法概况-获取战法收藏次数排行
    this.dispatch(FETCH_COLLECT_RANKING, {}).then(() => {
      this.collectList = this.survey.collectRanking.map(d => {
        return {
          title: d.ZFMC,
          count: d.SCCS
        }
      })
    })
    // 战法概况-战法单人创建排行
    this.dispatch(SINGLE_CREATE_RANKING, {}).then(() => {
      this.CreateList = this.survey.singleCreateRanking.map(d => {
        return {
          title: d.CJR,
          count: d.CNT
        }
      })
    })
    // 战法概况-战法单人使用排行
    this.dispatch(SINGLE_USE_RANKING, {}).then(() => {
      this.UseList = this.survey.singleUseRanking.map(d => {
        return {
          title: d.USERNAME,
          count: d.CNT
        }
      })
    })
  },
  mounted() {
    /**
     * [d 饼图数据]
     * [d 柱图数据]
     * @type {[type]}
     */
    this.dispatch(FETCH_CLASSIFICATION_USAGE, {}).then(d => {
      console.log(this.survey.classificationUsage)
      let listSum = 0
      let percen = 0
      let list = this.survey.classificationUsage.slice(0, 6).filter(c => c.SYCS !== 0).map(c => {
        percen += c.BL
        listSum += c.SYCS
        return {
          name: c.ZFLB,
          value: c.SYCS
        }
      })
      console.log(percen, listSum)
      console.log(list)
      if (percen < 100) {
        let sum = listSum / percen * 100
        let other = sum - listSum
        list.slice(0, 5).push({ name: '其它', value: other })
      }
      // 饼图数据
      this.pieTestOps = clone(this.echartsPieOptions.full)
      this.pieTestOps.series[0].center = ['50%', '50%']
      this.pieTestOps.tooltip = {
        formatter: '{b}:<br />({c})<br />({d}%)'
      }
      this.pieTestOps.series[0].label.normal = {
        position: 'outside',
        formatter: '{b}:\n({c})\n({d}%)'
      }
      this.pieTestOps.series[0].labelLine = {
        show: true
      }
      this.pieTestOps.legend.data = list.map(c => c['name'])
      console.log(this.pieTestOps.legend.data)
      this.pieTestOps.series[0].data = list

      //      // 柱图数据
      //      this.barTestOps = clone(this.echartsBarOptions.horizontal)
      //      this.barTestOps.yAxis.data = list.map(c => c['name'])
      //      this.barTestOps.series[0].data = list.map(c => c['value'])
      //      this.barTestOps.xAxis = {type: 'value', boundaryGap: [0, 0.01]}
    })
    /**
     * [d 战法概况]
     * @type {[type]}
     */
    this.dispatch(FETCH_GENERAL_DESCRIPTION, {}).then(() => {
      this.warGeneral.total = this.survey.GeneralDescription.TOTAL
      let res = []
      for(let i = 0; i < this.survey.GeneralDescription.ZFFL.length; i += 2) {
        res.push(this.survey.GeneralDescription.ZFFL.slice(i, i + 2))
      }
      this.warGeneral.list = res
    })
    /**
     * [d 柱图数据]
     * @type {[type]}
     */
    this.dispatch(FETCH_UNIT_RANKING, {}).then(() => {
      let list = this.survey.UnitRanking.map(d => {
        return {
          value: d.CNT,
          name: d.DWMC
        }
      })
      this.dwList = list
      // 柱图数据
      this.barTestOps = clone(this.echartsBarOptions.horizontal)
      this.barTestOps.yAxis.data = list.map(c => c['name'])
      this.barTestOps.series[0].data = list.map(c => c['value'])
      this.barTestOps.xAxis = { type: 'value', boundaryGap: [0, 0.01] }
      //      // 饼图数据
      //      this.barTestOps = clone(this.echartsPieOptions.base)
      //      this.barTestOps.series[0].center = ['50%', '50%']
      //      this.barTestOps.series[0].label.normal = {
      //        position: 'outside',
      //        formatter: '{b}{c}次'
      //      }
      //      this.barTestOps.series[0].labelLine = {
      //        show: true
      //      }
      //      this.barTestOps.legend.data = list.map(c => c['name'])
      //      this.barTestOps.series[0].data = list
    })
    /**
     * [d 折线图数据]
     * @type {[type]}
     */
    this.dispatch(FETCH_CLASSIFICATION_MONTHLY_USAGE, {}).then(() => {
      let nameList = [],
        valueList = []
      for (let i = 1; i <= 12; i++) {
        nameList.push(i + '月')
        valueList.push(0)
      }
      this.survey.classificationMonthlyUsage.forEach(d => {
        valueList[parseInt(d.YUEFEN) - 1] = d.CS
      })
      // 折线图数据
      this.lineTestOps = clone(this.echartsLineOptions.situation)
      this.lineTestOps.xAxis.data = nameList
      this.lineTestOps.series[0].data = valueList
    })
    this.dispatch(FETCH_CLASSIFICATION_DISTRIBUTION, {}).then(d => {
      let list = this.survey.classificationDistribution.map(c => {
        return {
          name: c.QYMC,
          value: c.SL
        }
      })
      // 地图数据
      this.mapTestOps = clone(this.echartsMapOptions.base)
      this.mapTestOps.series[0].data = list
    })
  }
}
</script>
