<template>
<el-dialog v-draggable="dialogDraggableOptions" title="详情" :visible.sync="dialog" :close-on-click-modal="false" size="detail--fixed" @open="initDialog" :before-close="closeEvent">
  <div class="tactics__detail" v-loading="detailLoading">
    <div class="sidebar" v-if="addressList.length > 0">
      <div v-if="baseInfo!==null" class="base-info">
        <div class="base-info__img-box">
          <data-image class="base-info__img-box__img" :idCard="baseInfo.SFZH"></data-image>
          <div class="base-info__name">{{baseInfo.XM}}</div>
        </div>

        <div class="base-info__info-box">
          <div class="base-info__info-box__item">
            <div class="base-info__info-box__item__label">身份证号:</div>
            <div class="base-info__info-box__item__value">{{baseInfo.SFZH || '未知'}}</div>
          </div>
          <div class="base-info__info-box__item">
            <el-row>
              <el-col :span="19" style="display: flex;">
                <div class="base-info__info-box__item__label">出生日期:</div>
                <div class="base-info__info-box__item__value">{{baseInfo.CSRQ || '未知'}}</div>
              </el-col>
              <el-col :span="5" style="display: flex;">
                <div class="base-info__info-box__item__label">性别:</div>
                <div class="base-info__info-box__item__value">{{baseInfo.XBMC || '未知'}}</div>
              </el-col>
            </el-row>
          </div>
          <div class="base-info__info-box__item">
            <el-row style="width: 100%;">
              <el-col :span="12" style="display: flex;">
                <div class="base-info__info-box__item__label">婚姻状况:</div>
                <div class="base-info__info-box__item__value">{{baseInfo.HYZK || '未知'}}</div>
              </el-col>
              <el-col :span="12" style="display: flex;">
                <div class="base-info__info-box__item__label">民族:</div>
                <div class="base-info__info-box__item__value">{{baseInfo.MZMC || '未知'}}</div>
              </el-col>
            </el-row>
          </div>
          <div class="base-info__info-box__item">
          </div>
          <div class="base-info__info-box__item">
            <div class="base-info__info-box__item__label">户籍地址:</div>
            <div class="base-info__info-box__item__value">{{baseInfo.ZZXZ || '未知'}}</div>
          </div>
        </div>
      </div>
      <div></div>
      <el-table @cell-mouse-enter="cellMouseEnter" @row-dblclick="rowClick" :data="tableList" border style="width:100%;" :hightlight-current-row="true" :max-height="320">
          <el-table-column :label="titleName" prop="label"></el-table-column>
          <el-table-column label="次数" align="center" prop="count" :sortable ="true" :resizable ="true" width="60"></el-table-column>
      </el-table>
      <div class="sidebar__list__title">
        <i class="iconfont icon-coordinates_fill"></i>{{targetAreaName}}
      </div>
      
  <div class="sidebar__list" height="190">
    <div class="sidebar__list__item" v-for="item in viewList" >
      <span class="blue">{{startTimeLabel}}: </span>{{item.start_time || '暂无'}}<br/>
      <span class="orange">{{endTimeLabel}}: </span>{{item.end_time || '暂无'}}
    </div>
  </div>
  </div>
    <div class="map-box">
       <div id="mapContainer" style="height:100%"></div>
      <!-- <pgis :clickLocation="clickLocation" class="map-box__item" layer="PGIS_CS_FWCS_DH_PG_BG" ref="pgis" mapStyle="height:100%;" :showSidebar="false" :showTools="false" @update:currentMarker="updateMarker"></pgis> -->
    </div>
    <el-table v-if="displayType==='table'" :data="list" :stripe="true" :show-header=true>
      <el-table-column v-for="column in columns" :key="column.prop" :label="column.label" :prop="column.prop"></el-table-column>
    </el-table>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
  .el-dialog__body {
    padding: 0;
  }

  .tactics__detail {
    height: 100%;
    position: relative;
    .table-box {
      position: absolute;
      bottom: 0;
      right: 0;
    }
    .map {
      width: 100%;
    }
  }

  .sidebar {
    background: #fff;
    font-size: 12px;
    width: 210px;
    height: calc(100% - 8px);
    border-right: 1px solid #ccc;
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    .base-info {
      &__name {
        background: #fff;
        text-align: center;
        width: 100%;
        height: 18px;
        line-height: 18px;
        border-top: 1px solid #ccc;
        position: absolute;
        bottom: 0;
        left: 0;
      }
      &__img-box {
        width: 79px;
        height: 99px;
        margin: 5px auto;
        border: 1px solid #ccc;
        position: relative;
        &__img {
          width: 100%;
          height: 100%;
        }
      }
      &__info-box {
        padding: 5px 10px;
        border-top: 1px solid #ccc;
        &__item {
          line-height: 18px;
          margin-bottom: 5px;
          display: flex;
          &:nth-last-child(1) {
            margin-bottom: 0;
          }
          &__label {
            color: #666;
            white-space: nowrap;
            margin-right: 5px; // width: 100px;
          }
          &__value {
            color: #000;
          }
          &.half {
            width: 50%;
          }
        }
      }
    }
    &__list {
      height: calc(100% - 572px);
      overflow: auto;
      &__title {
        background: #10abfe;
        color: #fff;
        padding: 0 10px;
        height: 25px;
        line-height: 25px;
        i {
          margin-right: 5px;
        }
      }
      &__item {
        color: #000;
        padding: 10px;
        border-bottom: 1px dashed #ccc; // cursor: pointer;
        span {
          margin-right: 5px;
        } // &.current,
        // &:hover {
        //     background: #1c7dc6;
        //     color: #fff;
        // }
      }
    }
    &__listElse {
      height: calc(100% - 572px);
      overflow: auto;
      &__title {
        background: #10abfe;
        color: #fff;
        padding: 0 10px;
        height: 25px;
        line-height: 25px;
        i {
          margin-right: 5px;
        }
      }
      &__item {
        color: #000;
        padding: 10px;
        border-bottom: 1px dashed #ccc; // cursor: pointer;
        span {
          margin-right: 5px;
        }
      }
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { FETCH_TACTICS_RESULT_DETAIL, GET_PERSON_INFO_FROM_MAIN_DATA } from '../../../store/types'
  import { EZ_POIS_SEARCH_S } from '../../../config'
  import pgisOps from '../../../utils/pgisOptions/pgis'
  import mixin from '../../../utils/mixin'

  import { clone } from '../../../utils/util'
  import dataImage from '../../../widgets/data-image/data-image'
  import pagination from '../../../widgets/pagination/pagination'
  // import pgis from '../../../widgets/location-selector/pgis.vue'

  export default {
    mixins: [mixin, pgisOps],
    components: { dataImage, pagination },
    data() {
      return {
        detailLoading: false,
        displayType: 'table',
        addressColumns: [],
        addressList: [],
        targetAreaName: '',
        targetAreaCode: '',
        baseInfo: null,
        clickLocation: {},
        titleName: '网吧名称',
        report: '',
        columns: [],
        list: [],
        count: 0,
        pagenav: {
          currentpage: 1,
          limit: 10
        },
        tableList: [],
        marker: null
      }
    },
    props: ['dialog', 'type', 'keyword', 'title'],
    computed: {
      viewList() {
        let res = []
        if (this.list.length > 0 && (this.targetAreaCode !== null || this.targetAreaName !== null)) {
          res = [...this.list.filter(d => this.targetAreaCode !== null ? d.area_code === this.targetAreaCode : d.name === this.targetAreaName)]
        }
        return res
      },
      startTimeLabel() {
        let res = ''
        if (this.addressList.length > 0) {
          switch (this.addressList[0].cat) {
            case 'case':
              res = '案发时间'
              break;
            case 'hotel':
              res = '入住'
              break;
            case 'netbar':
              res = '上网'
              break;
            case 'bayonet':
              res = '进入'
              break;
            default:
              res = ''
          }
        }
        return res
      },
      endTimeLabel() {
        let res = ''
        if (this.addressList.length > 0) {
          switch (this.addressList[0].cat) {
            case 'case':
              res = ''
              break;
            case 'hotel':
              res = '离店'
              break;
            case 'netbar':
              res = '下网'
              break;
            case 'bayonet':
              res = '离开'
              break;
            default:
              res = ''
          }
        }
        return res
      },
      ...mapState(['tactics', 'baseData'])
    },
    watch: {},
    methods: {
      initDialog() {
        this.baseInfo = null
        this.targetAreaName = ''
        this.targetAreaCode = ''
        this.addressColumns = []
        this.addressList = []
        this.list = []

        this.detailLoading = true
        this.displayType = this.type + ''
        this.dispatch(FETCH_TACTICS_RESULT_DETAIL, {
          detail: true,
          sql: this.keyword,
          PageIndex: 1,
          PageSize: 10
        }).then(() => {
          // this.baseInfo = this.tactics.resultDetail.dataList[1].list[0]
          if (!this.tactics.resultDetail.dataList) {
            this.detailLoading = false
            return
          }
          let targetIdCard = this.tactics.resultDetail.dataList.find(d => d.title === '人员信息').text
          if (targetIdCard) {
            this.dispatch(GET_PERSON_INFO_FROM_MAIN_DATA, {
              sfzh: targetIdCard || ''
            }).then(() => {
              this.baseInfo = this.baseData.personInfo.xp;
              console.log(this.baseInfo);
              if (this.baseInfo === undefined) {
                this.baseInfo = null;
              }
            })
          }
          let checkInList = this.tactics.resultDetail.dataList.find(d => d.mode === 'list')
          if (checkInList) {
            this.columns = checkInList.coloum
            this.list = checkInList.list
          }
          let report = this.tactics.resultDetail.dataList.find(d => d.mode === 'report')
          if (report) {
            this.report = report.list[0].ms
          }
          let mapData = this.tactics.resultDetail.dataList.find(d => d.mode === 'map')
          if (mapData) {
            let addressColumn = mapData.coloum.find(d => d.prop === 'address')
            if (!addressColumn) {
              this.$alert('map数据缺少address字段, 请联系管理员处理.', '温馨提示');
            } else {
              this.displayType = 'map'
              this.addressColumns = [...mapData.coloum]
              if (mapData.list && mapData.list.length > 0) {
                mapData.list[0].cat === 'hotel' ? this.titleName = '酒店名称' : this.titleName = '网吧名称';
              }
              this.addressList = [...mapData.list]
              this.createMark()
            }
          }
          this.detailLoading = false
        })
      },
      closeEvent() {
        this.$emit('close')
      },
      getQueryType(type) {
        let res
        // AJGL_SJJBXX_PT 案件， PGIS_CS_FWCS_DH_PG_BG 旅馆， JSAH_JTGL_JKKK_PT 卡口， PGIS_CS_YLCS_DH_PG_WB 网吧
        switch (type) {
          case 'case':
            res = 'AJGL_SJJBXX_PT'
            break;
          case 'hotel':
            res = 'PGIS_CS_FWCS_DH_PG_BG'
            break;
          case 'netbar':
            res = 'PGIS_CS_YLCS_DH_PG_WB'
            break;
          case 'bayonet':
            res = 'JSAH_JTGL_JKKK_PT'
            break;
          default:
            res = null
        }
        return res
      },
      createMark() {
        let location = [],
          params = {
            group: '',
            type: 'FQ',
            keywords: '',
            method: 'FULL',
            scope: '_NAMES',
            filterCustom: '',
            pageIndex: 0,
            pageSize: 1,
            limit: 1,
            timespan: (new Date()).getTime()
          }

        this.addressList.forEach(d => {
          let query = clone(params)
          query.keywords = d.address || d.name
          query.filterCustom = this.getQueryType(d.cat)
          if (query.filterCustom !== null) {
            this.$http.jsonp(EZ_POIS_SEARCH_S, {
              params: query
            }).then(res => {
              if (res.body.groups && res.body.groups[0]) {
                location.push({
                  name: `${d.name} (${d.cnt}次)`,
                  label: d.name,
                  count: d.cnt,
                  code: d.area_code,
                  address: d.address,
                  x: res.body.groups[0].pois[0].x,
                  y: res.body.groups[0].pois[0].y
                })
              }
              this.$nextTick(() => {
                this.$refs.pgis.renderMarker(location, false)
              })
            }).catch(err => {
              this.$alert('PGIS服务端错误码：' + err.status, '提示')
            })
          }
        })
        this.tableList = location
      },
      updateMarker(val) {
        this.targetAreaName = val.poi.label || null
        this.targetAreaCode = val.poi.code || null
      },
      rowClick(row, event) {
        let coord = new window.EzCoord(row.x, row.y)
        this.marker = new window.EzMarker(coord)
        this.marker.poi = { name: row.name, label: row.label, code: row.code }
        let transMarker = clone(row);
        transMarker.marker = this.marker;
        transMarker.coord = coord;
        this.$refs.pgis.map.addOverlay(this.marker);
        this.clickLocation = transMarker
      }
    },
    mounted() {
      this.pgisInit('mapContainer');
    }
  }

</script>
