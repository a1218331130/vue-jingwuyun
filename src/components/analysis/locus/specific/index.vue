<template>
<!-- 特定轨迹分析 -->
<!-- 本页套数据 -->
<div class="tel-list">
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <div class="tabs">
        <div :class="{'tabs__item':true,'current':currentTab===i}" v-for="(item,i) in tabs" :key="i" :title="item.keyVal" @click="currentTab=i" v-if="item.keyVal">
          <!--{{item.keyVal}}-->
          特定轨迹分析
          <i class="iconfont icon-close" @click.stop="removeTab(item,i)"></i>
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
    <div class="tabs-box__item" v-for="(item,i) in tabs" v-show="i===currentTab && item.keyVal">
      <searchBox>
        <div slot="formBox">
          <el-form :model="item.queryForm" :inline="true" label-position="right" label-width="90px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="分析号码">
                  <span v-for="(val,i) in item.vals" v-show="val">
                    {{val}}[{{item.names[i]}}] <i @click.stop="removeItem(item,i)" v-show="val" class="iconfont icon-close"></i>
                    <i v-if="val">{{(i < item.vals.length-1?', ':'')}}</i>
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query" style="position:relative;left:10px;top:0">分析</el-button>
            <el-form-item label="时间段">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="timeOptions" @change="val=>updateTimeSlot(item.queryForm, val?val:'')" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <el-form-item label="详细地址">
              <el-autocomplete class="inline-input" v-model="keywords" :fetch-suggestions="querySearch" placeholder="请输入详细地址" :trigger-on-focus="false" @select="handleSelect">
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="方圆" prop="number">
              <el-input class="distance" type="number" v-model="item.queryForm.distance" auto-complete="off"></el-input>
              <span class="distance-m">米</span>
              <!-- <el-input-number v-model="item.queryForm.distance" size="small" :min="1" :max="1000" class="small"></el-input-number> -->
            </el-form-item>
            <el-form-item label="停留">
              <el-input-number v-model="item.queryForm.stayTime" size="small" :min="1" :max="1000" class="small"></el-input-number>
              <span class="distance-m">次</span>
            </el-form-item>
            <el-form-item label="资源列表" style="margin-left:57px">
              <el-select v-model="item.queryForm.resList" multiple placeholder="请选择" :style="{width: num + 'px'}">
                <el-option v-for="item in resourceList" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </searchBox>
      <div class="res-content-box" v-loading="loading">
        <!-- 结果列表 -->
        <div class="res-box" style="width: 100%; height: 100%;">
          <!-- 结果列表 -->
          <div style="width: 35%" class="res-box-list info">
            <!-- <div class="res-box-header">
                行为轨迹信息
                <el-switch v-model="item.queryForm.radio" @change="ployLine" style="float:right" on-text="连线" off-text="不连"></el-switch>
              </div> -->
            <div class="grid-content bg-purple">
              <el-table :data="item.specificList" border style="width: 100%;cursor:pointer" @row-click="handleShowMap">
                <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
                <el-table-column prop="xm" label="姓名" align="center" width="100"></el-table-column>
                <el-table-column prop="zjhm" label="证件号" align="center"></el-table-column>
                <el-table-column prop="kssj" label="时间" align="center"></el-table-column>
              </el-table>
            </div>
          </div>
          <div style="width: 65%;height: 100%;" class="res-box-list map">
            <pgis :Location="clickLocation" class="map-box__item" layer="PGIS_CS_FWCS_DH_PG_BG" ref="specificPgis" mapStyle="height:100%;" :showSidebar="false" :showTools="false" @update:currentMarker="updateMarker"></pgis>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
  .res-content-box {
    height: calc(100vh - 246px);
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

  .app-content-box {
    padding: 0;
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

  .res-box-list {
    box-sizing: border-box;
    display: inline-block;
    height: 100%;
    border: 1px solid #b3c7e1;
  }

  .res-box-header {
    color: #ff8000;
    padding: 3px;
  }

  .grid-content {
    height: 100%;
    border: 1px solid #bfcbd9;
    overflow-y: scroll;
  }

  .tel-list {
    overflow: hidden;
    height: 100%;
  }

  .res-box {
    .res-box-content {
      height: 100%;
    }
  }

  el-col {
    height: 100%;
  }

  .tabs-box {
    height: 100%;
  }

  .tabs-box__item {
    height: 100%;
  }

  .res-box {
    height: 100%;
    display: flex;
  }

  .map {
    box-sizing: border-box;
    overflow: hidden;
    &-container {
      height: 100%;
    }
  }

  .el-input.distance {
    width: 80%;
  }

  .el-form-item {
    span.distance-m {
      display: inline-block;
      margin-left: 5px;
      color: #9c9c9c;
    }
  }

</style>
<!-- 隐藏地图侧边栏 -->
<style lang="scss">
  .pgis-sidebar {
    display: none;
  }

</style>
<script>
  import { FETCH_ANALYZE_SPECIFIC_INFO } from '../../../../store/types'
  import { EZ_POIS_SEARCH_S } from '../../../../config'
  import { clone } from '../../../../utils/util'
  import locusMixin from '../locusMinxin'
  import searchBox from '../../search-tool'
  import list from '../detail.vue'
  //  import { NgwGo } from '../../../../utils/ngw.go'
  import ElInput from '../../../../../node_modules/element-ui/packages/input/src/input';
  import dataImage from '../../../../widgets/data-image/data-image'
  import pgis from '../../../../widgets/location-selector/pgis.vue'

  const src = `/static/num/red.png`
  const srcBlue = `/static/num/blue.png`
  const icon = new window.EzIcon({
    src: src,
    anchor: [0.5, 1],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    opacity: 1
  })
  const iconBlue = new window.EzIcon({
    src: srcBlue,
    anchor: [0.5, 1],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    opacity: 1
  })
  export default {
    mixins: [locusMixin],
    components: {
      'data-image': dataImage,
      ElInput,
      searchBox,
      list,
      pgis
    },
    data() {
      return {
        radio: false,
        tableData: [],
        singleTab: true,
        map: null,
        roomScopeList: [
          { value: '', label: '全部' },
          { value: '1', label: '同楼层' },
          { value: '2', label: '同房间' },
          { value: '3', label: '房间左右' }
        ],
        commName: 'specific',
        region: null,
        cyberBars: [],
        resBox: false,
        detailBox: false,
        resourceList: [
          { label: '话单信息', value: 'hd' },
          { label: '航班信息', value: 'hb' },
          { label: '高铁信息', value: 'gt' },
          { label: '公安卡口信息', value: 'gakk' },
          { label: '出入境信息', value: 'crj' },
          { label: '旅业信息', value: 'ly' }
        ],
        keywords: '',
        marker: null,
        clickLocation: {},
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
    computed: {},
    watch: {
      keywords(val) {
        if (val === '') {
          this.tabs[this.currentTab].queryForm.address = ''
        }
      },
      tabs: {
        handler(val) {
          this.$emit('on-change-tableData', 'specific')
        },
        deep: true
      }
    },
    methods: {
      query() {
        let target = this.tabs[this.currentTab];
        if (target.queryForm.timeSlot.length < 2) {
          this.$alert('时间段不能为空', '温馨提示')
          return false
        } else if (!target.queryForm.jd || !target.queryForm.wd || !target.queryForm.address) {
          this.$message({
            type: 'warning',
            message: '详细地址为必填项'
          })
          return false
        } else if (target.queryForm.resList.length === 0) {
          this.$message({
            type: 'warning',
            message: '资源列表必填项'
          })
          return false
        }
        // 清空地图
        if (this.$refs.specificPgis) {
          this.$refs.specificPgis[0].clearMap()
        }
        this.fetchMainList()
      },
      /**
       * 分析按钮提交参数
       */
      fetchMainList() {
        let target = this.tabs[this.currentTab],
          queryForm = {
            zjhm: target.keyVal, // 证件号码
            kssj: target.queryForm.timeSlot[0] || '', // 开始时间
            jssj: target.queryForm.timeSlot[1] || '', // 结束时间
            jd: target.queryForm.jd + '', // 经度
            wd: target.queryForm.wd + '', // 纬度
            jlfw: +target.queryForm.distance, // 距离范围(米)Int
            zylx: target.queryForm.resList.toString(), //  资源类型 String
            tddd: target.queryForm.address, //  特定地址 String
            cs: +target.queryForm.stayTime //  次数Int
          }
        this.loading = true
        this.resBox = true
        this.detailBox = false
        this.dispatch(FETCH_ANALYZE_SPECIFIC_INFO, queryForm)
          .then(() => {
            let res = clone(this.analysisLocus.specificInfo)
            target.specificList = res
            if (!res || res.length === 0) return
            res.forEach(d => {
              let position = new window.EzCoord(d.jd, d.wd)
              this.$refs.specificPgis[0].map.addOverlay(new window.EzMarker(position, icon))
              target.queryForm.secondList.push(position)
            })
            this.$refs.specificPgis[0].map.centerAndZoom(target.queryForm.secondList[0], 15)
          })
      },
      // 轨迹画线：
      ployLine() {
        let target = this.tabs[this.currentTab]
        if (target.queryForm.radio && target.queryForm.secondList) {
          // if (target.queryForm.secondList.length < 2 || !this.$refs.specificPgis[0]) {
          //   return false
          // }
          target.queryForm.lines = new window.Polyline(target.queryForm.secondList)
          target.queryForm.lines.setStrokeColor('rgb(255,0,0)')
          this.$refs.specificPgis[0].map.addOverlay(target.queryForm.lines)
        } else if (target.queryForm.lines) {
          this.$refs.specificPgis[0].map.removeOverlay(target.queryForm.lines)
        }
      },
      // 获取详细地址：
      createMark(val) {
        let target = this.tabs[this.currentTab]
        let params = {
          group: '',
          type: 'FQ',
          keywords: val,
          method: 'FULL',
          scope: '_NAMES',
          filterCustom: '',
          pageIndex: 0,
          pageSize: 20,
          limit: 20,
          timespan: (new Date()).getTime()
        }
        let query = clone(params)
        target.secondList = []
        if (query.filterCustom !== null) {
          this.$http.jsonp(EZ_POIS_SEARCH_S, {
            params: query
          }).then(res => {
            if (res.body.groups && res.body.groups[0]) {
              res.body.groups[0].pois.map(d => {
                let item = {
                  'value': d.name,
                  'jd': d.x,
                  'wd': d.y
                }
                target.secondList.push(item)
              })
            }
          }).catch(err => {
            this.$alert('PGIS服务端错误码：' + err.status, '提示')
          })
        }
      },
      // 输入提示框
      querySearch(queryString, cd) {
        this.createMark(queryString)
        setTimeout(() => {
          let list = this.tabs[this.currentTab].secondList
          cd(list)
        }, 200)
      },
      // 地址选择项
      handleSelect(item) {
        if (item.jd !== '' && item.wd !== '') {
          this.$refs.specificPgis[0].clearMap()
        }
        let target = this.tabs[this.currentTab],
          position
        target.queryForm.jd = item.jd
        target.queryForm.wd = item.wd
        target.queryForm.address = item.value
        position = new window.EzCoord(item.jd, item.wd)
        this.$refs.specificPgis[0].map.addOverlay(new window.EzMarker(position, iconBlue))
      },
      updateMarker(val) {
        this.targetAreaName = val.poi.label || null
        // this.targetAreaCode = val.poi.code || null
      },
      // 点击查看
      handleShowMap(row, event, column) {
        let coord = new window.EzCoord(row.jd, row.wd)
        this.$refs.specificPgis[0].renderMarker([{ x: row.jd, y: row.wd }])
        this.$refs.specificPgis[0].map.centerAndZoom(coord, 15)
        this.marker = new window.EzMarker(coord)
        this.marker.poi = { name: row.gjms.substring(19).split(';').join(''), label: row.gjms.substring(19).split(';').join('') }
        let transMarker = clone(row);
        transMarker.marker = this.marker;
        transMarker.coord = coord;
        this.$refs.specificPgis[0].map.addOverlay(this.marker);
        this.clickLocation = transMarker
      },
      // 移除号码
      removeItem(item, index) {
        if (item.names[index] === '手动输入') {
          this.removeCommTab({
            name: item.names[index],
            guid: item.guid[index],
            keyVal: item.vals[index]
          })
          return false
        }
        this.removeTab({ guid: item.guid[index] })
      }
    },
    created() {},
    mounted() {}
  }

</script>
