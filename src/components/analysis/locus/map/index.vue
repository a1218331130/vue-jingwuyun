<template>
<!-- 地图展示 -->
<!-- 本页套数据 -->
<div class="tel-list">
  <!-- <div id="mapContainer"></div> -->
   <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <el-tabs v-model="activeTab" :closable="true" @tab-remove="removeItem" @tab-click="tabPaneChange">
        <el-tab-pane v-for="(item,i) in tabs" :name="`${item.keyVal}|${item.name}`" :key="i" :label="`${item.keyVal}[${item.name}]`">
        </el-tab-pane>
      </el-tabs>
    </el-col>
    <el-col :span="4" class="collap-col">
      <div class="collap-box pointer">
        <slot name="switchRightBarBtn"></slot>
      </div>
    </el-col>
  </el-row> 
   <div class="tabs-box" ref="wrapper" style="height: 100%; overflow: hidden">
    <div class="tabs-box__item" v-for="(item,i) in tabs" v-if="i===currentTab && item.keyVal" style="height: 110px"> 
       <searchBox ref="searchBox">
        <div slot="formBox">
          <el-form :model="item.queryForm" :inline="true" label-position="right" label-width="90px">
            <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query" style="position:relative;left:10px;top:0">分析</el-button>
            <el-form-item label="时间段">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="timeOptions" @change="val=>updateTimeSlot(item.queryForm, val?val:'')" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <el-form-item label="资源列表">
              <el-select v-model="item.queryForm.resList" multiple placeholder="请选择" :style="{width: num + 'px'}">
                <el-option v-for="item in resourceList" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </searchBox> 
    </div>
    <div class="app-content-box" ref="content" v-loading="loadingMap">
      <div class="res-box">
        <div class="res-box-list info">  
                <!-- v-if="item.mainList.length === 0"  v-model="item.queryForm.radio" -->
            <div v-if="mapList.length === 0" style="text-align: center;color: #868686;">暂无数据</div> 
            <div v-if="mapList.length !== 0">
               <div class="res-box-header">
                行为轨迹信息
                 <el-switch @change="ployLine" style="float:right" on-text="连线" off-text="不连"></el-switch> 
               </div> 
               <div style="height:650px;overflow-y: scroll;">
                 <div class="res-box-item" v-for="(table,k) in mapList" :key="k" @click.stop="handleSelect(table)">
                   <div class="time">
                    <span>{{k+1}}</span> 
                    <span>{{table.sj}}</span>
                  </div>
                   <div class="desc">{{table.gjms.substring(19)}}</div>  
                </div> 
              </div> 
            </div> 
          </div>

          <div class="res-box-list map" style="width: 65%; height: 100%;">
             <div id="mapContainer" style="height:100%"></div>
          </div>
      </div>
    </div>  
  </div> 
</div>
</template>
<style>
  .tk-main{
    height: 100%;
  }
</style>
<style lang="scss" scoped>
  
	.main-iframe{
		  height:100%;
	    width: 100%;
	    /* position: absolute;
	    z-index: -1;
	    left: 0;
	    top: 0; */
	}

  .app-content-box {
    overflow: hidden;
    padding: 0;
  }

  .res-box-header {
    color: #ff8000;
    padding: 3px;
  }

  .res-box-item {
    cursor: pointer;
    padding: 0 8px;
    border-bottom: 1px solid #ddd;
    .time {
      height: 30px;
      display: flex;
      align-items: center;
      span:nth-child(1) {
        min-width: 20px;
        padding: 0 1px;
        height: 20px;
        background-color: #ff4949;
        color: #fff;
        text-align: center;
        line-height: 20px;
      }
      span:nth-child(2) {
        color: #20a0ff;
        margin-left: 5px;
      }
    }
    .desc {
      margin-left: 22px;
      margin-bottom: 5px;
    }
  }

  .radio {
    float: right;
    margin-right: 5px;
  }

  .tabs-box__item {
    height: 100%;
  }

  .res-box {
    display: flex;
    height: 100%;
  }

  .info {
    width: 35%;
    border-right: 1px solid #999;
  }

  .map {
    box-sizing: border-box;
    overflow: hidden;
    &-container {
      height: 100%;
    }
  }

  .res-box-list {
    display: inline-block;
  }

  .map-container {
    height: 100%;
  }

  .tel-list {
    height: 90%;
  }

  .el-tabs {
    margin-bottom: 0;
  }

  .app-content-box {
    height: calc(100% - 57px * 2);
  }

</style>
<style lang="scss">
  .app-content-box {
    .map-list {
      .el-table__body-wrapper {
        // height: calc(100vh - 300px);
        overflow-x: hidden;
        overflow-y: auto;
      }
    }
  }

</style>
<script>
  import { FETCH_ANALYZE_MAP_DATA } from '../../../../store/types'
  import timeLine from '../../../dossier/people/modules/time_line.vue'
  import locusMixin from '../locusMinxin'
  import echarts from '../../../../widgets/echarts'
  import echartsDetails from '../../../../widgets/echarts/echart-details'
  import searchBox from '../../search-tool'
  import list from '../detail.vue'
  import { clone } from '../../../../utils/util'
  import { mapState } from 'vuex'
  import chartsOps from '../../../../utils/echartsOptions/all'
  import pgisOps from '../../../../utils/pgisOptions/pgis'
  import pgis from '../../../../widgets/location-selector/pgis.vue'
  import ElButton from '../../../../../node_modules/element-ui/packages/button/src/button'
  // import TKMap from 'TKMap'
  // const srcBlue = `/static/num/blue.png`
  // const iconBlue = new window.EzIcon({
  //   src: srcBlue,
  //   anchor: [0.5, 1],
  //   anchorXUnits: 'fraction',
  //   anchorYUnits: 'fraction',
  //   opacity: 1
  // })
  export default {
    mixins: [locusMixin, chartsOps, timeLine, pgisOps],
    components: {
      ElButton,
      'time-line': timeLine,
      searchBox,
      echarts,
      echartsDetails,
      list,
      pgis
    },
    data() {
      return {
        linePoints: [],
        marksPoints: [],
        mapList: [],
        activeTab: '',
        tableData: null,
        radio: false,
        commName: 'mapShow',
        currentPage3: 1,
        cohabit: 1,
        map: null,
        loadingMap: false,
        showInfoList: [],
        detailBox: false,
        defaultZoom: {
          type: Number,
          default: 10
        },
        number: 1,
        xinxiData: {
          jd: '',
          wd: ''
        },
        table: {
          columns: [],
          data: []
        },
        resourceList: [
          { label: '话单信息', value: 'hd' },
          { label: '航班信息', value: 'hb' },
          { label: '高铁信息', value: 'gt' },
          { label: '公安卡口信息', value: 'gakk' },
          { label: '出入境信息', value: 'crj' },
          { label: '旅业信息', value: 'ly' }
        ],
        total: 30,
        mainGo: null,
        diagram: null,
        pieTestOps: null,
        radarOptions: null,
        pieTestOpsAge: null,
        pieTestOpsGrade: null,
        lineTestOpsArea: null,
        lineTestOps: null,
        mapTestOps: null,
        barTestOps: null,
        isChange: true,
        address: [{ x: 109.9972, y: 27.5729 }],
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
    computed: {
      ...mapState(['pgisMap'])
    },
    watch: {
      showLine(val) {
        if (val === true) {
          this.ployLine()
        } else {
          this.ployLine(true)
        }
      },
      tabs(val, oldVal) {
        this.$emit('on-change-tableData', val)
        if (val.length > 0) {
          let item = val[val.length - 1]
          this.activeTab = `${item.keyVal}|${item.name}`
          if (val.length && !val[this.currentTab].mainList.length && this.$refs.locusPgis && this.$refs.locusPgis.length) {
            this.$refs.locusPgis[0].clearMap()
            let coord = new window.EzCoord(110.0007, 27.5716)
            this.$refs.locusPgis[0].map.centerAndZoom(coord, 10)
          }
        }
      }
    },
    methods: {
      // numbers(val, i) {
      //   if (i === 0) {
      //     this.xinxiData.jd = val[i].jd
      //     this.xinxiData.wd = val[i].wd
      //     this.number = 1
      //   } else {
      //     if (this.xinxiData.jd !== val[i].jd || this.xinxiData.wd !== val[i].wd) {
      //       this.xinxiData.jd = val[i].jd
      //       this.xinxiData.wd = val[i].wd
      //       this.number = this.number + 1
      //     }
      //   }
      //   return this.number
      // },
      // query12
      query() {
        if (this.tabs[this.currentTab].queryForm.timeSlot.length < 2) {
          this.$alert('时间段不能为空', '温馨提示')
          return false
        } else if (this.tabs[this.currentTab].queryForm.resList.length === 0) {
          this.$alert('请选择资源列表', '温馨提示')
          return false
        }
        // 清空地图
        this.clearAll();
        this.$nextTick(() => {
          this.fetchMainList()
          this.tabs[this.currentTab].queryForm.radio = true
        })
      },
      // entrpy(obj) {
      //   console.log(obj);
      //   var html = '<table><tr><td>名称：</td><td>' + obj.MC + '</td></tr>';
      //   html += '<tr><td>地址：</td><td>' + obj.DZ + '</td></tr></table>';
      //   return html;
      // },
      // entrpy() {
      // },
      fetchMainList() {
        this.loadingMap = true;
        let target = this.tabs[this.currentTab],
          queryForm = {
            zjhm: target.keyVal,
            kssj: target.queryForm.timeSlot[0] || '',
            jssj: target.queryForm.timeSlot[1] || '',
            zylx: target.queryForm.resList
          }
        target.secondList = []
        this.dispatch(FETCH_ANALYZE_MAP_DATA, queryForm)
          .then(() => {
            let res = []
            if (this.analysisLocus.mapData.length > 1000) {
              res = clone(this.analysisLocus.mapData).slice(0, 1000)
            } else {
              res = clone(this.analysisLocus.mapData)
            }
            this.mapList = res
            // target.mainList = res
            this.loadingMap = false
            if(this.mapList.length === 0) {
              return;
            }
            // console.log(this.mapList, 'resres');
            this.mapList.forEach((item) => {
              let addmarks = {
                x: parseFloat(item.jd),
                y: parseFloat(item.wd),
                z: 241.4652898650172
              }
              this.marksPoints.push(addmarks);
              this.linePoints.push(parseFloat(item.jd));
              this.linePoints.push(parseFloat(item.wd));
              this.linePoints.push(241.4652898650172);
            });
            console.log(this.marksPoints, 'linePointslinePoints');
            this.addMarker(this.marksPoints[0].x, this.marksPoints[0].y, this.marksPoints[0].z);
            this.moveTo(this.marksPoints[0].x, this.marksPoints[0].y);
            this.addPolyline(this.linePoints);
            // this.addMarkers(this.marksPoints, true);
            // console.log(this.loadingMap, 'this.loadingMap');
            // if (!res || res.length === 0) return
            // let jsonData = { jd: '', wd: '' }
            // let num = 0;
            // res.forEach((d, idx) => {
            //   if (idx !== 0) {
            //     if (jsonData.jd !== d.jd || jsonData.wd !== d.wd) {
            //       jsonData.jd = d.jd;
            //       jsonData.wd = d.wd;
            //       num++
            //     }
            //   } else {
            //     jsonData.jd = d.jd;
            //     jsonData.wd = d.wd;
            //   }
            //   let position = new window.EzCoord(d.jd, d.wd)
            //   const srcRed = `/static/num/red${num % 10 - 1}.png`
            //   const iconRed = new window.EzIcon({
            //     src: srcRed,
            //     anchor: [0.5, 1],
            //     anchorXUnits: 'fraction',
            //     anchorYUnits: 'fraction',
            //     opacity: 1
            //   })
              // this.$refs.locusPgis[0].map.addOverlay(new window.EzMarker(position, iconRed))
              // target.secondList.push(position)
            // })
            // this.$refs.locusPgis[0].map.centerAndZoom(target.secondList[0], 15)
            // this.ployLine()
          })
      },
      showDetail() {
        //        this.detailBox = true
        //        this.initMaker()
      },
      loadData(page = 1, limit = 10) {
        this.dispatch(null, { query: { page, limit, ...this.searchKeys } })
      },
      handlePageChange(page) {
        this.loadData(page, this.role.limit)
      },
      handleSizeChange(size) {
        this.loadData(1, size)
      },
      handleChange() {},
      handleCurrentChange(index) {},
      // 点击表格
      handleSelect(item) {
      // parseFloat(item.jd), parseFloat(item.wd), parseFloat(241.4652898650172)
        this.addMarker(parseFloat(item.jd), parseFloat(item.wd), parseFloat(241.4652898650172));
        this.moveTo(parseFloat(item.jd), parseFloat(item.wd));
      },
      // 轨迹画线：
      ployLine() {
        let target = this.tabs[this.currentTab]
        if (target.queryForm.radio && target.secondList) {
          if (target.secondList.length < 2 || !this.$refs.locusPgis[0]) {
            return
          }
          target.queryForm.lines = new window.Polyline(target.secondList)
          target.queryForm.lines.setStrokeColor('rgb(255,0,0)')
          this.$refs.locusPgis[0].map.addOverlay(target.queryForm.lines)
        } else if (target.queryForm.lines) {
          this.$refs.locusPgis[0].map.removeOverlay(target.queryForm.lines)
        }
      },
      // 创建新的tab
      // createItem() {
      //   let regex1 = /\d{17}[0-9Xx]{1}$/,
      //     regex2 = /\d{14}[0-9Xx]{1}$/,
      //     target = this.tabs[this.currentTab].queryForm.addItem
      //   if (target.keyVal) {
      //     if (regex1.test(target.keyVal) || regex2.test(target.keyVal)) {
      //       if (this.tabs[this.currentTab].flag) {
      //         this.tabs[this.currentTab].keyVal = target.keyVal
      //       }
      //       this.tabs[this.currentTab].oldVal = clone(this.tabs[this.currentTab].keyVal)
      //       this.tabs[this.currentTab].keyVal = target.keyVal
      //       this.tabs[this.currentTab].name = target.name
      //       this.tabs[this.currentTab].flag = true
      //     } else {
      //       this.$message({
      //         type: 'error',
      //         message: '请输入正确的身份证号码',
      //         showClose: true
      //       })
      //       return true
      //     }
      //   }
      // },
      // 移除tab
      removeItem(item) {
        let arr = item.split('|')
        if (arr[1] === '手动输入') {
          this.tabs = this.tabs.filter(d => d.keyVal !== arr[0])
          return
        }
        this.removeTab(item)
      },
      resetMap() {
        let target = this.tabs[this.currentTab]
        target.secondList = []
        if (this.$refs.locusPgis) {
          this.$refs.locusPgis[0].clearMap()
          if (target.mainList.length) {
            let jsonData = {
              jd: '',
              wd: ''
            }
            let num = 0;
            target.mainList.forEach((d, idx) => {
              if (idx !== 0) {
                if (jsonData.jd !== d.jd || jsonData.wd !== d.wd) {
                  jsonData.jd = d.jd;
                  jsonData.wd = d.wd;
                  num++
                }
              } else {
                jsonData.jd = d.jd;
                jsonData.wd = d.wd;
              }
              let position = new window.EzCoord(d.jd, d.wd)
              const srcRed = `/static/num/red${num % 10 - 1}.png`
              const iconRed = new window.EzIcon({
                src: srcRed,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                opacity: 1
              })
              this.$refs.locusPgis[0].map.addOverlay(new window.EzMarker(position, iconRed))
              target.secondList.push(position)
            })
            this.$refs.locusPgis[0].map.centerAndZoom(target.secondList[0], 15)
          } else {
            let coord = new window.EzCoord(110.0007, 27.5716) // 怀化市局为中心 110.0007,27.5716, 怀化市政府中心 109.9972, 27.5729
            this.$refs.locusPgis[0].map.centerAndZoom(coord, 10) // 设置中心点
          }
        }
      },
      // 标签页改变
      tabPaneChange(tab) {
        // let target = this.tabs[tab.index]
        this.currentTab = parseInt(tab.index)
        this.resetMap()
      }
    },
    created() {
    },
    mounted() {
      this.pgisInit('mapContainer');
      // const s = document.createElement('script');
      // s.type = 'text/javascript';
      // s.src = 'http://10.146.90.6:8885/tk-webmap/mapapi.js';
      // document.body.appendChild(s);
      // let map = new TKMap('mapContainer');
      // map.initMap();
      // this.$refs.mapContainer.initMaker()
    }
  }

</script>
