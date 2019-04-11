<!-- 概况(统计) -->
<template>
<div>
  <div class="echarts__box">
    <el-row>
      <el-col :span="24">
        <div class="echarts__box--half">
          <el-row :gutter="10" style="height:100%">
            <el-col :span="12" style="height:100%">
              <div class="chart__box">
                <div class="chart__box__title">
                  本年度受理数
                </div>
                <div class="chart__box__content">
                  <echarts :option="yearCountOps" style="width:100%; height:100%;"></echarts>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="echarts__box--half">
                <div class="tactics__box__title">
                  最新动态
                </div>
                <div class="tactics__box--listtwo">
                  <div class="tactics__box__content">
                    <div class="tactics__list">
                      <div class="tactics__list__item__two" v-for="item in listZxdt">
                        <el-row>
                          <el-col :span="18">
                            <div class="tactics__list__item__two__title">
                              {{item.title}}
                            </div>
                          </el-col>
                          <el-col :span="6">
                            <div class="tactics__list__item__two__time" nowrap="nowrap">
                              {{item.applyTime}}
                            </div>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="echarts__box--half" style="margin-top:10px">
          <el-row :gutter="10" style="height:100%">
            <el-col :span="12" style="height:100%">
              <div class="chart__box">
                <div class="chart__box__title">
                  各单位受理数
                </div>
                <div class="chart__box__content">
                  <echarts :option="resCountOps" style="width:100%; height:100%;"></echarts>
                </div>
              </div>
            </el-col>
            <el-col :span="12" style="height:100%">
              <div class="chart__box">
                <div class="chart__box__title">
                  各警种协同办公概况
                </div>
                <div class="chart__box__content">
                  <echarts :option="cateCountOps" style="width:100%; height:100%;"></echarts>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<style lang="scss" scoped>
.echarts__box {
    height: calc(100vh - 80px);
    padding: 10px;
    display: block;
    &--half {
        height: calc(50vh - 45px);
    }
}

.chart {
    padding: 0 10px;
    height: 100%;

    &__box {
        &,
        &-wrap {
            height: 100%;
            &--half {
                height: calc(50% - 15px);
                margin-top: 10px;
            }
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
        }
        &__title + &__content {
            height: calc(100% - 40px);
            border-top: 0;
        }
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
            height: calc(60% - 5px);
            border-top-width: 1px;
        }
        &--listtwo {
            @extend .tactics__box;
            height: calc(100% - 40px);
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
                }
            }
        }
        &__title + &__content {
            height: calc(100% - 40px);
            border-top: 0;
        }
    }

    &__list {
        height: 100%;
        overflow-y: auto;
        &__item {
            padding: 15px 30px;
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
                margin-bottom: 20px;
            }
            &__desc {
                color: #999;
            }
            &__count {
                text-align: right;
                color: #ff9900;
                margin-bottom: 20px;
            }
            &__author {
                text-align: right;
                color: #999;
            }
        }
        &__item__two {
            padding:: 5px 15px;
            border-bottom: 1px dashed #999;
            &__time {
                font-size: 12px;
                color: #666;
            }
        }
    }
}
</style>

<script>
import mixin from '../../../utils/mixin'
import { clone } from '../../../utils/util'

import echarts from '../../../widgets/echarts'
import chartsOps from '../../../utils/echartsOptions/all'

export default {
  mixins: [mixin, chartsOps],
  components: {
    echarts
  },
  data() {
    return {
      yearCountOps: null,
      cateCountOps: null,
      resCountOps: null,
      list: [],
      listZxdt: [{
        id: '1',
        title: '怀化市公安局陈林东向泉塘派出所申请协查',
        applyTime: '2017-11-21 14:00:27'
      }, {
        id: '2',
        title: '怀化市公安局李石瑞向技侦分局申请协查',
        applyTime: '2017-11-21 11:20:04'
      }, {
        id: '3',
        title: '怀化出入境卫东杰向经侦分局申请协查',
        applyTime: '2017-11-20 19:00:21'
      }, {
        id: '4',
        title: '怀化出入境陈总向怀化市公安局江坪分局刑事侦查大队申请协查',
        applyTime: '2017-11-20 15:42:29'
      }, {
        id: '5',
        title: '怀化市公安局陈林东向泉塘派出所申请协查',
        applyTime: '2017-11-19 16:45:12'
      }, {
        id: '6',
        title: '怀化市洪江区公安局河滨路派出所陈升向怀化市洪江区公安局法制室申请协查',
        applyTime: '2017-11-18 19:50:10'
      }, {
        id: '7',
        title: '怀化市公安局陈林东向技侦分局申请协查',
        applyTime: '2017-11-18 16:45:02'
      }, {
        id: '8',
        title: '怀化市洪江区公安局巡特警大队陈林东向技侦分局申请协查',
        applyTime: '2017-11-17 19:40:10'
      }, {
        id: '9',
        title: '怀化市洪江区公安局交通警察大队向洪江市公安局特警大队申请协查',
        applyTime: '2017-11-16 21:52:00'
      }, {
        id: '10',
        title: '怀化市洪江区公安局怀化市洪江区公安局刑侦中队陈林东向技侦分局申请协查',
        applyTime: '2017-11-15 22:52:08'
      }, {
        id: '11',
        title: '怀化市公安局陈林东向技侦分局申请协查',
        applyTime: '2017-11-15 15:22:50'
      }, {
        id: '12',
        title: '怀化市洪江区公安局指挥中心安琳向技侦分局申请协查',
        applyTime: '2017-11-14 21:52:26'
      }]
    }
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {
    // 年度柱图数据
    this.yearCountOps = clone(this.echartsBarOptions.horizontalType)
    this.yearCountOps.xAxis.data = []
    this.yearCountOps.legend.data = []
    for (let i = 1; i <= 12; i++) {
      this.yearCountOps.xAxis.data.push(i + '月')
    }
    this.yearCountOps.legend.data = ['受理数']
    this.yearCountOps.series[0].name = '受理数'
    this.yearCountOps.series[0].data = [32, 27, 36, 34, 28, 32, 27, 36, 34, 28, 32, 27]

    // 警种柱图数据
    this.cateCountOps = clone(this.echartsBarOptions.stack)
    this.cateCountOps.xAxis.data = ['情报', '网安', '法制', '技侦', '经侦', '治安', '刑侦', '出入境']
    this.cateCountOps.legend.data = ['受理数', '完成数']
    this.cateCountOps.series[0].name = '受理数'
    this.cateCountOps.series[0].data = [32, 27, 36, 24, 18, 32, 17, 36]
    this.cateCountOps.series[1] = clone(this.cateCountOps.series[0])
    this.cateCountOps.series[1].name = '完成数'
    this.cateCountOps.series[1].data = [22, 17, 36, 34, 28, 22, 27, 26]

    // 各单位申请柱图数据
    this.resCountOps = clone(this.echartsBarOptions.horizontalType)
    this.resCountOps.xAxis.data = ['鹤城分局法制大队', '市局网监与行动技术支队', '市局刑事侦查支队基础情报信息大队', '市局警令部情报中心', '洪江区公安局情报中心', '刑事侦查支队基础情报信息大队', '沃溪分局刑事侦查大队', '洪江区公安局网络安全保卫大队']
    this.resCountOps.legend.data = ['受理数']
    this.resCountOps.series[0].name = '受理数'
    this.resCountOps.series[0].data = [22, 17, 36, 34, 28, 22, 27, 26]
    this.resCountOps.xAxis.axisLabel = {
      interval: 0,
      rotate: '5'
    }
    // for (let i = 1; i < 13; i++) {
    //   this.listZxdt.push({
    //     id: i,
    //     title: (i % 2 === 0 ? '怀化出入境李杰' : '怀化市公安局陈林东') + '向技侦分局申请协查',
    //     applyTime: '2017-09-0' + i + ' 14:0' + i + ':27'
    //   })
    // }
  }
}
</script>
