<template>
<div class="pgis__wrapper" v-loading="loading">
  <div class="pgis__map" ref="map"></div>
  <div class="pgis__coord" v-show="mouseCoord" @click="enableMouseCoord">{{mouseCoord}}</div>
  <div class="pgis__tools">
    <el-checkbox-group class="pgis__group" size="small" v-model="currentLayers">
      <el-checkbox-button v-for="item in searchLayers" :key="item.code" :label="item.code">{{item.name}}
      </el-checkbox-button>
    </el-checkbox-group>
    <el-radio-group class="pgis__group" size="small" v-if="hasCaseCoord" v-model="currentRadius">
      <el-radio-button v-for="item in radius" :key="item" :label="item.toString()">{{item}}米
      </el-radio-button>
    </el-radio-group>
  </div>

</div>
</template>

<style lang="scss" scoped>
  .pgis {
    &__wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      font-size: 12px;
    }
    &__map {
      background: #fff;
      width: 100%;
      height: 100%;
    }
    &__coord {
      position: absolute;
      left: 0;
      bottom: 0;
      padding: 5px 10px;
      background: #fff;
      cursor: pointer;
    }
    &__tools {
      position: absolute;
      right: 10px;
      top: 10px;
    }
    &__group {
      display: inline-block;
      margin-left: 20px;
    }
  }

</style>
<style>
  .pgis__wrapper .el-loading-mask {
    background-color: rgba(255, 255, 255, .2);
  }

  .poi-tip {
    padding: 5px;
  }

  .pgis__wrapper .ol-overlay-container {
    transform: translateY(15px);
  }

  .pgis__wrapper .ez-popup-closer {
    display: none;
  }

</style>
<script>
  import { EZ_POIS_SEARCH_S } from '../../config'
  const { EzMap, Ez, EzCoord, EzMarker, EzIcon, Circle } = window
  const EZ_IMG_PATH = '/static/EzServerClient7/images/'
  const LAYER = {
    AJGL_SJJBXX_PT: '案件',
    PGIS_CS_FWCS_DH_PG_BG: '旅业',
    JSAH_JTGL_JKKK_PT: '卡口',
    PGIS_CS_YLCS_DH_PG_WB: '网吧',
    JSAH_VIDEO_PT: '视频'
  }

  /**
   * @module Pgis
   * @desc Pgis基础组件
   *
   * @example <pgis layers="PGIS_CS_FWCS_DH_PG_BG"></pgis>
   */
  export default {
    /**
     * 接收参数
     * @prop {Array} center 初始地图中心点经纬度坐标,@default [109.9787449836731, 27.555813789367676]
     * @prop {Number} zoom 地图初始缩放级别, 最大值 18,  @default 15
     * @prop {Boolean} showControl 是否显示PGIS自带的控制操作条
     * @prop {Object} caseInfo 案件信息对象
     * @prop {Object} radius 查询案件周边资源的半径数组 @default [100, 300, 500, 1000, 3000]
     * @prop {String} drawColor 画圈的颜色 @default '#b2e0f0'
     * @prop {Array} layers 查询周边资源的图层数组 AJGL_SJJBXX_PT 案件， PGIS_CS_FWCS_DH_PG_BG 旅馆， JSAH_JTGL_JKKK_PT 卡口， PGIS_CS_YLCS_DH_PG_WB 网吧 @default ['AJGL_SJJBXX_PT', 'PGIS_CS_FWCS_DH_PG_BG', 'JSAH_JTGL_JKKK_PT', 'PGIS_CS_YLCS_DH_PG_WB', 'JSAH_VIDEO_PT']
     *
     */
    props: {
      center: {
        type: Array,
        default () {
          return [109.9787449836731, 27.555813789367676]
        }
      },
      zoom: {
        type: Number,
        default: 15
      },
      //
      showControl: {
        type: Boolean,
        default: false
      },
      caseInfo: {
        type: Object
      },
      radius: {
        type: Array,
        default () {
          return [100, 300, 500, 1000, 3000]
        }
      },
      drawColor: {
        type: String,
        default: '#b2e0f0'
      },
      layers: {
        type: Array,
        default () {
          return ['AJGL_SJJBXX_PT', 'PGIS_CS_FWCS_DH_PG_BG', 'JSAH_JTGL_JKKK_PT', 'PGIS_CS_YLCS_DH_PG_WB', 'JSAH_VIDEO_PT']
        }
      }
    },
    data() {
      return {
        // 鼠标经过的坐标
        mouseCoord: null,
        // 禁止修改鼠标经过的坐标
        disableMouseCoord: false,
        // 当前查询周边的范围
        currentRadius: null,
        // 案件Marker 实例
        caseMarker: null,
        // 资源 Marker实例数组
        poiMarkers: [],
        // 当前圆圈实例
        circle: null,
        // 当前查询的图层
        currentLayers: this.layers.slice(),
        loading: false,
        // 显示popup的marker
        currentMarker: null
      }
    },
    computed: {
      searchLayers() {
        return this.layers.map(code => {
          return {
            code: code,
            name: LAYER[code]
          }
        })
      },
      hasCaseCoord() {
        if (!this.caseInfo) return
        const { x, y } = this.caseInfo
        return x && y
      }
    },
    watch: {
      currentRadius(val) {
        this.drawCircle(val)
        this.drawPois(val)
      },
      currentLayers(val) {
        this.drawPois(this.currentRadius)
        if (!val || (val && val.length === 0)) {
          this.loading = false
        }
      },
      currentMarker(marker, old) {
        if (old) {
          old.closeInfoWindow()
        }
        if (marker) {
          this.openInfoWindow(marker)
        }
      }
    },
    methods: {
      /**
       * 初始化地图
       */
      initMap() {
        this.map = new EzMap(this.$refs.map)
        this.showControl && this.map.showStandMapControl();
        this.center && this.map.centerAtLatlng(new EzCoord(this.center[0], this.center[1]))
        this.map.zoomTo(this.zoom)
        this.map.addMapEventListener(Ez.Event.MAP_MOUSEMOVE, this.showCoordTip)
        this.map.addMapEventListener(window.Ez.Event.MAP_MOUSEMOVE, this.proxyHandleMouseMove)
        this.map.addMapEventListener(Ez.Event.MAP_CLICK, this.proxyHandleMarkerClick)
      },
      /**
       * 在地图创建标记
       * @param iconSrc
       * @param coord
       * @returns {Window.EzMarker}
       */
      createMarker(iconSrc, coord) {
        const icon = new EzIcon({
          src: iconSrc
        })
        const marker = new EzMarker(coord, icon);
        this.map.addOverlay(marker)
        return marker
      },
      handleMarkerClick(e) {
        this.disableMouseCoord = true
        const marker = this.getMarkerAtPixel(e)
        if (marker && marker.poi) {
          /**
           * 地图marker点击
           * @event module:Pgis~on-poi-click
           * @param {Object} a 坐标对象
           * @param {Number} a.x
           * @param {Number} a.y
           */
          this.$emit('on-poi-click', marker.poi)
        }
        if (this.caseMarker === marker) {
          /**
           * 案件点击
           * @event module:Pgis~on-case-click
           * @param {Object} a 案件信息对象
           */
          this.$emit('on-case-click', this.caseInfo)
        }
      },
      handleMouseMove(e) {
        this.setCursor(e)
        const marker = this.getMarkerAtPixel(e);
        if (marker !== this.caseMarker) {
          this.currentMarker = marker
        }
      },
      /**
       * 恢复记录鼠标坐标位置
       */
      enableMouseCoord() {
        this.disableMouseCoord = false
      },
      /**
       * 显示鼠标所在坐标
       * @param  {Object} e 鼠标事件
       */
      showCoordTip(e) {
        if (!this.disableMouseCoord) {
          this.mouseCoord = e.coordinate.join(', ')
        }
      },
      /**
       * 设置鼠标cursor
       * @param  {Object} e 鼠标事件
       */
      setCursor(e) {
        let marker = this.getMarkerAtPixel(e)
        this.$refs.map.style.cursor = marker ? 'pointer' : 'default'
      },
      /**
       * 根据地图像素位置获取标记
       * @param  {Object} e 鼠标事件
       */
      getMarkerAtPixel(e) {
        let pixel = e.pixel
        return this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
          if (feature instanceof window.EzMarker) {
            return feature
          }
        })
      },
      /**
       * 显示案件标记
       */
      showCaseInfo() {
        if (!this.hasCaseCoord) return
        const { x, y } = this.caseInfo
        if (x & y) {
          const icon = `${EZ_IMG_PATH}case.png`
          this.caseMarker = this.createMarker(icon, new EzCoord(x, y))
        }
      },
      /**
       * 画圆圈
       */
      drawCircle() {
        if (!this.hasCaseCoord) return
        this.circle && this.map.removeOverlay(this.circle)
        const { x, y } = this.caseInfo
        const style = {
          fillColor: this.drawColor,
          strokeColor: this.drawColor,
          fillOpacity: 0.3
        }
        this.circle = new Circle(new EzCoord(x, y), this.currentRadius, style)
        this.map.addOverlay(this.circle)
      },
      /**
       * 查询资源
       * @param {String} layer
       * @param {Object} options
       */
      search(layer, options) {
        let params = Object.assign({
          group: '',
          type: 'FQ',
          keywords: '',
          method: 'LIKE',
          scope: '_FULLTEXT',
          groupBy: '',
          bounds: '',
          polygon: '',
          location: '',
          buffer: '',
          filterCustom: layer ? `LAYERNAME:${layer}` : '',
          sortBy: '',
          pageIndex: 0,
          pageSize: 10000,
          timespan: (new Date()).getTime()
        }, options || {})
        return this.$http.jsonp(EZ_POIS_SEARCH_S, {
          params: params
        }).catch(err => {
          this.$alert('PGIS服务端错误码：' + err.status, '提示')
        })
      },
      /**
       * 根据圆圈范围查询图层资源
       * @param  {Array} location [description]
       * @param  {Object} radius   [description]
       * @return {Promise|any}          {Promise<[T1,T2,T3,T4,T5,T6]>|Promise<[T1,T2,T3,T4,T5,T6,T7]>|Promise<[T1,T2,T3,T4,T5,T6,T7,T8,T9]>|Promise<[T1,T2,T3,T4]>|Promise<T[]>|Promise<[T1,T2,T3,T4,T5,T6,T7,T8,T9,T10]>|any}
       */
      searchByCircle(location, radius) {
        let promises = []
        this.currentLayers.forEach(layer => {
          const promise = this.search(layer, {
            location: location.join(','),
            buffer: radius
          })
          promises.push(promise)
        })
        return Promise.all(promises)
      },
      searchAll() {
        let promises = []
        this.currentLayers.forEach(layer => {
          const promise = this.search(layer)
          promises.push(promise)
        })
        return Promise.all(promises)
      },
      /**
       * 删除已创建的资源marker
       */
      removeAllPoiMarker() {
        this.poiMarkers.forEach(m => {
          this.map.removeOverlay(m)
        })
        this.poiMarkers = []
      },
      /**
       * 创建资源marker
       * @param {Object} pois
       */
      createPoiMakers(pois) {
        pois.forEach(poi => {
          const icon = `${EZ_IMG_PATH}${poi.layer}.png`
          let marker = this.createMarker(icon, new EzCoord(poi.x, poi.y))
          marker.poi = poi
          this.poiMarkers.push(marker)
        })
      },
      /**
       * 在地图上按资源画标记
       * @param {Object} radius
       */
      drawPois(radius) {
        this.loading = true
        if (this.hasCaseCoord) {
          const { x, y } = this.caseInfo
          this.searchByCircle([x, y], radius).then(resArray => {
            this.loading = false
            this.removeAllPoiMarker()
            resArray.forEach(res => {
              if (res.data && res.data.groups) {
                const pois = (res.data.groups[0] || {}).pois || []
                this.createPoiMakers(pois)
              }
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.searchAll().then(resArray => {
            this.loading = false
            this.removeAllPoiMarker()
            resArray.forEach(res => {
              if (res.data && res.data.groups) {
                const pois = (res.data.groups[0] || {}).pois || []
                this.createPoiMakers(pois)
              }
            })
          }).catch(() => {
            this.loading = false
          })
        }
      },
      openInfoWindow(marker) {
        const poi = marker.poi
        if (!poi) {
          return;
        }
        const html = `<div class="poi-tip">${poi.name}</div>`
        marker.openInfoWindow(html, new EzCoord(poi.x, poi.y))
      }
    },
    mounted() {
      this.initMap()
      this.showCaseInfo()
      this.currentRadius = this.radius[0]
    },
    created() {
      this.proxyHandleMouseMove = this.handleMouseMove.bind(this)
      this.proxyHandleMarkerClick = this.handleMarkerClick.bind(this)
    },
    beforeDestroy() {
      if (this.map) {
        this.map.removeMapEventListener(Ez.Event.MAP_MOUSEMOVE, this.showCoordTip)
        this.map.removeMapEventListener(window.Ez.Event.MAP_MOUSEMOVE, this.proxyHandleMouseMove)
        this.map.removeMapEventListener(Ez.Event.MAP_CLICK, this.proxyHandleMarkerClick)
      }
    }
  }

</script>
