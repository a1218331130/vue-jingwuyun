<!-- 概况(统计) -->
<template>
  <div>
    <div class="pool">
      <el-row :gutter="10">
        <el-col :span="6" class="pool__box-wrap" style="margin-bottom:10px" :xs="12">

          <div class="echarts-div_box">
            <div class="tactics__box">
              <div class="tactics__box__title">
                湖南省公安机关警务人才库汇总
              </div>
              <div class="tactics__box__content">
                <el-row style="height: 100%">
                  <el-col :span="24" style="height: calc(70% - 5px);margin-bottom: 5px;">
                    <echarts :option="mapTestOps" mapdata="provinceMapData"
                             style="width:100%; height:100%;"></echarts>
                  </el-col>
                  <el-col :span="24" style="height: calc(25% - 5px);margin-bottom: 5px;" class="info-box">
                    <div class="info-box__frist">湖南省公安机关警务人才库共 <span>3550人</span></div>
                    <div class="info-box__second">二级人才库共 <span>3550人</span></div>
                    <div class="info-box__third">三级人才库共 <span>3550人</span></div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>

        </el-col>

        <el-col :span="9" class="pool__box-wrap" :xs="12">
          <el-row style="height: 100%">
            <el-col :span="24" style="height: calc(50% - 5px);margin-bottom: 5px;">
              <div class="echarts-div_box">
                <div class="tactics__box">
                  <div class="tactics__box__title">
                    湖南省公安机关警务人才库区域分布图
                  </div>
                  <div class="tactics__box__content">
                    <echarts :option="barTestOpsArea" style="width:100%; height:calc(100% - 35px);"></echarts>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="24" style="height: calc(50% - 5px);margin-top: 5px;">
              <div class="echarts-div_box">
                <div class="tactics__box">
                  <div class="tactics__box__title">
                    湖南省公安机关警务人才库岗位分布图
                  </div>
                  <div class="tactics__box__content">
                    <echarts :option="pieTestOpsFull" style="width:100%; height:calc(100% - 35px);"></echarts>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="9" class="pool__box-wrap" :xs="24">

          <el-row style="height: 100%; " :gutter="10">

            <el-col :span="24" style="height: calc(50% - 5px);margin-bottom:10px; " :xs="12">
              <div class="echarts-div_box">
                <div class="tactics__box">
                  <div class="tactics__box__title">
                    湖南省公安机关警务人才库能力分布图
                  </div>
                  <div class="tactics__box__content">
                    <echarts :option="pieTestOps" style="width:100%; height:calc(100% - 35px);"></echarts>
                  </div>
                </div>
              </div>
            </el-col>

            <el-col :span="24" style="height: calc(50% - 5px);;" :xs="12">
              <div class="echarts-div_box">
                <div class="tactics__box">
                  <div class="tactics__box__title">
                    湖南省公安机关警务人才库擅长领域分布图
                  </div>
                  <div class="tactics__box__content">
                    <echarts :option="barTestOpsField" style="width:100%; height:calc(100% - 35px);"></echarts>
                  </div>
                </div>
              </div>
            </el-col>

          </el-row>

        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .info-box {
    text-align: center;
    color: #666;
    font-size: 14px;
    span {
      color: #ff9900;
    }
    &__frist {
    }
    &__second {
      width: 200px;
      margin: 20px auto 0;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 30px;
      border: 1px solid #0c76fd;
    }
    &__third {
      width: 200px;
      margin: 10px auto 0;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 30px;
      border: 1px solid #0c76fd;
    }
  }

  .pool {
    padding: 10px 10px 0px 10px;
    &__base-info {
      height: 160px;
      border-top: 1px solid #ccc;
      &__item {
        line-height: 160px;
      }
    }

    &__box {
      background: #fff;
      border: 1px solid #ccc;
      &,
      &-wrap {
        height: calc(100vh - 80px);
      }
      & + & {
        margin-top: 10px;
      }
      &--half {
        @extend .pool__box;
        height: calc(50% - 5px);
      }
      &--small {
        @extend .pool__box;
        height: calc(40% - 5px);
        // height: calc(100vh - 600px);
      }
      &--list {
        @extend .pool__box;
        height: calc(60% - 5px);
        border-top-width: 1px;
      }
      &__title {
        text-align: center;
        color: #0c77fb;
        width: 90%;
        margin: 20px auto;
        position: relative;
        span {
          background: #fff;
          height: 28px;
          line-height: 28px;
          padding: 0 20px;
          border: 1px solid #0c77fb;
          border-radius: 15px;
          display: inline-block;
          position: relative;
          z-index: 2;
        }
        &:before {
          content: '';
          background: #0c77fb;
          width: 100%;
          height: 1px;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          z-index: 1;
        }
      }
      &__content {
        height: 100%;
        // padding: 20px;
        overflow: hidden;
        .el-tabs {
          height: 100%;
          margin: 0;
          &__content {
            height: calc(100% - 72px);
            overflow: auto;
          }
        }
      }
      &__title + &__content {
        height: calc(100% - 72px);
        border-top: 0;
      }
    }

    &__list {
      overflow: auto;
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
    }
  }
</style>

<script>
  import mixin from '../../../utils/mixin'
  import {clone} from '../../../utils/util'
  import echarts from '../../../widgets/echarts'
  import chartsOps from '../../../utils/echartsOptions/all'
  export default {
    mixins: [mixin, chartsOps],
    components: {
      echarts
    },
    data() {
      return {
        pieTestOps: null,
        pieTestOpsFull: null,
        barTestOpsField: null,
        barTestOpsArea: null,
        lineTestOps: null,
        mapTestOps: null,
        list: []
      }
    },
    computed: {},
    watch: {},
    methods: {},
    created() {

    },
    mounted() {
      // 饼图数据[能力分布图]
      // 指挥协调 审讯 文书制作  情报研判  调查取证 两化应用 学习写作
      this.pieTestOps = clone(this.echartsPieOptions.base)
      this.pieTestOps.series[0].label.normal = {
        position: 'outside',
        formatter: '{b}{d}%'
      }
      this.pieTestOps.series[0].labelLine = {
        show: true
      }
      this.pieTestOps.legend.data = ['指挥协调', '审讯', '文书制作', '情报研判', '调查取证', '两化应用', '学习写作']
      this.pieTestOps.series[0].data = [{name: '指挥协调', value: 11}, {name: '审讯', value: 21}, {
        name: '文书制作',
        value: 31
      }, {name: '情报研判', value: 41}, {name: '调查取证', value: 51}, {name: '两化应用', value: 61}, {name: '学习写作', value: 71}]
      // 饼图数据[能力分布图]
      // 总警监 副警监 警监 警督 警司 警员
      this.pieTestOpsFull = clone(this.echartsPieOptions.full)
      this.pieTestOpsFull.series[0].minAngle = '60'
      this.pieTestOpsFull.legend.data = ['总警监', '副警监', '警监', '警督', '警司', '警员']
      this.pieTestOpsFull.series[0].data = [{name: '总警监', value: 11}, {name: '副警监', value: 21}, {
        name: '警监',
        value: 31
      }, {name: '警督', value: 41}, {name: '警司', value: 51}, {name: '警员', value: 61}]
      // 柱图数据
      // 擅长领域分布图
      // 电子取证 话单分析 财务分析 心理测谎 司法会计 情报研判
      this.barTestOpsField = clone(this.echartsBarOptions.horizontalType)
      this.barTestOpsField.xAxis.data = ['电子取证', '话单分析', '财务分析', '心理测谎', '司法会计', '情报研判']
      // this.barTestOpsField.legend.data = ['人员数量', '人员类型增量']
      this.barTestOpsField.xAxis.axisLabel.interval = 0
      var temp = [{
        name: '涉稳人员',
        type: 'bar',
        barWidth: 20,
        stack: '月份',
        data: [320, 270, 360, 340, 280, 800]
      }];
      this.barTestOpsField.series = temp
      // 区域分布图
      // 株洲市 张家界市 长沙市 衡阳市 湘潭市 邵阳市 岳阳市 益阳市  郴州市 永州市 娄底市 常德市  湘西土家族苗族自治州
      this.barTestOpsArea = clone(this.echartsBarOptions.base)
      this.barTestOpsArea.xAxis.data = ['株洲市', '张家界市', '长沙市', '衡阳市', '湘潭市', '邵阳市', '岳阳市', '益阳市', '郴州市', '永州市', '娄底市', '常德市', '怀化市', '湘西土家族苗族自治州']
      // this.barTestOpsArea.legend.data = ['人员数量', '人员类型增量']
      this.barTestOpsArea.xAxis.axisLabel.rotate = '45'
      var AreaTemp = [{
        name: '涉稳人员',
        type: 'bar',
        barWidth: 15,
        stack: '月份',
        data: [320, 270, 360, 340, 280, 800, 320, 270, 360, 340, 280, 800, 700, 500]
      }];
      this.barTestOpsArea.series = AreaTemp
      // 地图数据
      this.mapTestOps = clone(this.echartsMapOptions.base)
      this.mapTestOps.visualMap.show = false
      // 株洲市 张家界市 长沙市 衡阳市 湘潭市 邵阳市 岳阳市 益阳市  郴州市 永州市 娄底市 常德市 怀化市 湘西土家族苗族自治州
      this.mapTestOps.series[0].mapType = 'provinceMapData'
      this.mapTestOps.series[0].data = [{name: '株洲市', value: 9}, {name: '张家界市', value: 12}, {
        name: '长沙市',
        value: 80
      }, {name: '衡阳市', value: 12}, {name: '湘潭市', value: 14}, {name: '邵阳市', value: 15}, {name: '岳阳市', value: 16}, {
        name: '益阳市',
        value: 18
      }, {name: '郴州市', value: 18}, {name: '永州市', value: 19}, {name: '娄底市', value: 21}, {
        name: '常德市',
        value: 23
      }, {
        name: '怀化市',
        value: 23
      }, {
        name: '湘西土家族苗族自治州',
        value: 23
      }]
      console.log(this.mapTestOps)
      // 列表数据
      for (let i = 1; i <= 8; i++) {
        this.list.push({
          id: i,
          title: '话单账号异常行为战法',
          count: parseInt(2936 / i),
          author: '张三',
          org: '湖南省怀化市公安情报中心'
        })
      }
    }
  }
</script>
