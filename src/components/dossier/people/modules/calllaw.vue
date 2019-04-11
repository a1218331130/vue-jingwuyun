<!-- 通话规律统计 -->
<template>
<div>
  <!-- 标题 -->
  <card-header :title="'通话规律分析'+title+'('+chartOptions.series.length+'条结果)'" :expand="true" :tableData="chartOptions.series" @on-update-expand="updateExpand"></card-header>
  <!-- 内容 -->

  <el-row :gutter="15" class="kinship-box" v-loading="dossierLoading" v-show="expandMark">
    <div v-if="chartOptions.series.length > 0">
      <el-col :span="24">
        <div class="char-box" style="height: 500px;width: 100%" v-if="!loading">
          <!-- type != 5 -->
          <echarts ref="chart_thgl" id="chart_thgl" :option="chartOptions" style="width:100%; height:100%;"></echarts>
        </div>
        <!-- type = 5 -->
        <!-- <table class="a-ca-table">
             <thead>
             <tr class="a-ca-t-worker">
               <th class="a-ca-header-title">
                 <div class="a-ca-ht-div">
                   <table>
                     <thead>
                     <tr class="a-ca-ht-div">
                       <th></th>
                       <th>时段</th>
                     </tr>
                     <tr class="a-ca-ht-worker">
                       <th>日期</th>
                       <th></th>
                     </tr>
                     </thead>
                   </table>
                 </div>
               </th>
               <th v-for="item in date">{{item}}</th>
             </tr>
             </thead>
             <tbody>
             <tr v-for="items in time">
               <td v-for="key in items">
                 <div :class="[key!=null?'a-ca-by-div':'']">{{key}}</div>
               </td>
             </tr>
             </tbody>
           </table>-->
      </el-col>
      <el-col :span="24">
        <div style="border-bottom:1px solid #e5e5e5; margin: 15px 0; "></div>
      </el-col>
      <el-col :span="24">
        <div class="teldata_box">
          <el-row :gutter="15" class="margin-t">
            <el-col :span="4" class="teldata_title">
              <span> 通话次数最多时段：</span>
            </el-col>
            <el-col :span="20">
              <el-tag class="margin-r" type="primary" v-for="(item,index) in thcs" v-if="index < 8" :key="item.da">
                {{item.da}}
              </el-tag>
            </el-col>
          </el-row>
          <el-row :gutter="15" class="margin-t">
            <el-col :span="4" class="teldata_title">
              <span> 通话次数最多号码：</span>
            </el-col>
            <el-col :span="20">
              <el-tag type="primary" class="margin-r" v-for="(item,index) in datameuber" v-if="index < 20" :key="item.dfhm">{{item.dfhm}}
              </el-tag>
            </el-col>
          </el-row>
          <el-row :gutter="15" class="margin-t">
            <el-col :span="4" class="teldata_title">
              <span>最常使用基站：</span>
            </el-col>
            <el-col :span="20">
              <el-tag class="margin-r" type="primary" v-for="(item,index) in thjz" v-if="index < 10" :key="item.thdd">{{item.thdd}}
              </el-tag>
            </el-col>
            <!--<el-col :span="3">&nbsp;</el-col>
              <el-col :span="21">
                <el-row v-if="thjz.JZDList1&&thjz.JZDList1.length > 0">
                  <el-col :span="3" class="teldata_title">
                    <span>  当天早晚：</span>
                  </el-col>
                  <el-col :span="21">
                    <el-tag class="margin-r" type="primary" v-for="(item,index) in thjz.JZDList1" v-if="index < 10"
                            :key="item.thdd">{{item.thdd}}
                    </el-tag>
                  </el-col>
                </el-row>
                <el-row v-if="thjz.JZDList2&&thjz.JZDList2.length > 0">
                  <el-col :span="3" class="teldata_title">
                    <span>  隔天早晚：</span>
                  </el-col>
                  <el-col :span="21">
                    <el-tag class="margin-r" type="primary" v-for="(item,index) in thjz.JZDList2" v-if="index < 10"
                            :key="item.thdd">{{item.thdd}}
                    </el-tag>
                  </el-col>
                </el-row>
                <el-row v-if="thjz.JZDList3&&thjz.JZDList3.length > 0">
                  <el-col :span="3" class="teldata_title">
                    <span>  非工作时间：</span>
                  </el-col>
                  <el-col :span="21">
                    <el-tag class="margin-r" type="primary" v-for="(item,index) in thjz.JZDList3" v-if="index < 10"
                            :key="item.thdd">{{item.thdd}}
                    </el-tag>

                  </el-col>
                </el-row>
              </el-col>-->
          </el-row>
        </div>
      </el-col>
    </div>
    <div v-else>
      <el-col :span="24">
        <div class="empty "></div>
      </el-col>
    </div>
  </el-row>

</div>
</template>

<style lang="scss" scoped>
.kinship-box {
    min-height: 113px;
    margin-top: 13px;
    .a-ca-head-title {
        border-right: 1px solid #87bde9;
        background-color: #fff;
        padding: 0;
    }
    .margin-t {
        margin-top: 13px;
    }
    .margin-r {
        margin-right: 5px;
        margin-bottom: 5px;
    }
    table.a-ca-table .a-ca-t-worker > th:nth-child(2) {
        display: none;
        background: #000;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
        width: 100%;
        th {
            background-color: #b4d6f1;
            color: #fff;
            padding: 0 5px;
            text-align: center;
            font-weight: normal;
            border: 1px solid #87bde9;
            .a-ca-ht-div th {
                border: 0 solid #87bde9;
            }
        }
        td {
            padding: 5px;
        }
    }
    .a-ca-table {
        border: 1px solid #87bde9;
        width: 100%;
        border-bottom: 10px solid #87bde9;
        tbody tr {
            &:nth-child(even) {
                background-color: #F2F2F2;
            }
            td {
                border: 1px solid #87bde9;
                text-align: center;
                color: #55ade3;
                padding: 0;
                &:first-child {
                    color: #666;
                    padding: 10px 0;
                    .a-ca-by-div {
                        background-color: transparent;
                    }
                }
                &:last-child {
                    color: #87bdea;
                    padding: 10px 0;
                    .a-ca-by-div {
                        background-color: transparent;
                    }
                }
                .a-ca-by-div {
                    background-color: #ffd8b0;
                    padding: 10px 0;
                    margin: -10px 0;
                }
            }
        }
    }
    .a-ca-ht-div {}
    .a-ca-t-week {
        border-bottom: 1px solid #87bde9;
        border-top: 1px solid #87bde9;
    }
}

.teldata_box {
    background: #f2f2f2;
    padding: 10px;
    border: 1px solid #d7d7d7;
    .teldata_title {
        text-align: right;
        color: #999999;
    }
}
</style>


<script>
import cardHeader from './card-header.vue'
import dossierMixin from '../../dossierMixin'
import {
  FETCH_TELLIST_LAW_LIST,
  FETCH_TELLIST_FREQUENCY_LIST,
  GET_GPJZ
} from '../../../../store/types'
import { mapState } from 'vuex'
import echarts from '../../../../widgets/echarts'
import bus from '../../../../utils/bus'
export default {
  mixins: [dossierMixin],
  components: {
    cardHeader,
    echarts
  },
  data() {
    return {
      title: '',
      chartOptions: {
        grid: {
          left: '3%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          data: []
        },
        yAxis: {
          name: '通话次数',
          type: 'value'
        },
        tooltip: {
          show: true,
          trigger: 'axis'
        },
        series: []
      },
      dossierLoading: true,
      date: [],
      time: [],
      datameuber: [],
      thcs: [],
      thjz: []
    }
  },
  props: ['telNum', 'caseKey'],
  computed: {
    ...mapState(['analysisTelList', 'dossier'])
  },
  watch: {
    telNum(val) {
      if(val) {
        this.loadData()
      } else {
        this.dossierLoading = false
      }
    },
    'chartOptions.series' (val) {
      console.log(val, '通话规律分析');
      bus.$emit('update:dossierSubTitleNumber', { 'title': '通话规律分析', 'number': val.length }) // 左侧菜单列表
    }
  },
  methods: {
    loadData() {
      if(this.telNum !== null && this.telNum !== '') {
        let _sj = this.defaultDatePicker()
        if(this.checkRule('Hdfx/GetTHGLList', true)) {
          this.title = '【' + _sj[0] + '至' + _sj[1] + '】'
          this.dispatchDossier(FETCH_TELLIST_LAW_LIST, {
            v_kssj: _sj[0],
            v_jssj: _sj[1],
            v_zjhm: this.telNum,
            v_tjlx: '0' // （0小时，1天，2星期，3月，4年,5小时天）
          }).then(() => {
            let _atlDTMain = this.analysisTelList.lawList.DTMain //  主干类目数据
            let _lineOptServiceData = {}
            let _tellList = [] // 统计数据
            _atlDTMain.map(adtR => {
              this.chartOptions.xAxis.data.push(adtR['da']) // 追加当前数据的 XAxis label Data
              for(let adt in adtR) {
                if(adt !== 'da') {
                  // TODO:根据数据动态X轴坐标
                  if(_tellList.includes(adt)) { // 归集号码类别
                    _lineOptServiceData[adt][this.chartOptions.xAxis.data.indexOf(adtR['da'])] = adtR[adt] // 替换对应节点数据的值
                    this.chartOptions.series[_tellList.indexOf(adt)].data = _lineOptServiceData[adt]
                  } else {
                    _tellList.push(adt)
                    _lineOptServiceData[adt] = [adtR[adt]]
                    this.chartOptions.series.push({
                      name: adt,
                      type: 'line',
                      data: _lineOptServiceData[adt]
                    })
                  }
                  this.thcs.push({
                    num: adtR[adt],
                    da: adtR['da']
                  })
                }
              }
            })
            this.thcs.sort((a, b) => b.num - a.num)
            let chartElm = this.$refs['chart_thgl'] || this.$('#chart_thgl')[0]
            if(chartElm) {
              if(Array.isArray(chartElm)) {
                chartElm[0].action()
              } else {
                chartElm.action()
              }
            }
            this.dossierLoading = false
          })
          //            this.dispatchDossier(FETCH_TELLIST_LAW_LIST, {
          //             v_kssj: _sj[0],
          //             v_jssj: _sj[1],
          //             v_zjhm: this.telNum,
          //             v_tjlx: '5'
          //             }).then(() => {
          //             for (var key in this.analysisTelList.lawList.DTMain[0]) {
          //             if (!isNaN(key)) {
          //             this.date.push(key)
          //             }
          //             }
          //             this.date = this.date.sort()
          //             this.date.unshift('日期\\时段')
          //             this.date.push('合计')
          //             // console.log(this.date)
          //             this.analysisTelList.lawList.DTMain.map(item => {
          //             // this.time.push(item)
          //             let arry = []
          //             this.date.map(items => {
          //             for (var keys in item) {
          //             if (items === keys) {
          //             arry.push(item[keys])
          //             }
          //             }
          //             })
          //             this.time.push(arry)
          //             // console.log(this.time)
          //             })
          //             })
        }
        if(this.checkRule('Hdfx/GetTHPLList', true)) {
          // 通话频率
          this.dispatchDossier(FETCH_TELLIST_FREQUENCY_LIST, {
            v_kssj: _sj[0],
            v_jssj: _sj[1],
            v_zjhm: this.telNum,
            v_tjlx: '0'
          }).then(() => {
            this.datameuber = this.analysisTelList.frequencyList
          })
        }
        if(this.checkRule('jwy/pesonnelfiles/getgpjz', true)) {
          // 基站
          this.dispatchDossier(GET_GPJZ, {
            kssj: _sj[0],
            jssj: _sj[1],
            idcard: this.caseKey,
            cs: 1
          }).then(() => {
            this.thjz = this.dossier.getGpjz
          })
        }
      } else {
        this.dossierLoading = false
      }
    }
  },
  created() {
    this.loadData()
  },
  mounted() {}
}
</script>
