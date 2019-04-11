<template>
<div class="map-container">
  <div class="pgis-sidebar" :class="{'is-collapsed':collapsed}">
    <div class="pgis-sidebar-wrap">
      <div class="search-bar" @keyup.13="handleSearch">
        <el-input v-model="currentKeyword" placeholder="关键字" icon="search" :on-icon-click="handleSearch"></el-input>
      </div>

      <div class="poi-list-wrap">
        <ul class="poi-list" v-if="searchResult">
          <li v-for="(item, index) in searchResult.pois" @mouseenter="handleMouseEnter(item, index)" @mouseleave="handleMouseLeave(item, index)" @click="handleItemClick(item, index)" :class="{'is-selected':selected && item.id === selected.id}">
            <span class="num"><img :src="item.hover ? `static/num/blue${index}.png` :`static/num/red${index}.png`"></span>
            <div class="poi-name">{{item.name}}</div>
          </li>
        </ul>
        <div v-else>
          <p>找不到相关资源</p>
        </div>
        <div class="pager" v-if="searchResult">
          <el-pagination small layout="prev, pager, next" :current-page="currentPage" :total="searchResult.itemCount" @current-change="handlePageChange"></el-pagination>
        </div>
      </div>

    </div>
    <div v-show="showSidebar===true" class="pgis-sidebar-switch" @click="handleSwitch"></div>
  </div>

  <div class="map-tools" v-show="showTools===true">
    <el-popover popper-class="types-popper" v-model="showPopover" placement="bottom-end" trigger="hover" ref="drawTypes" :width="130">
      <div>
        <el-button class="draw-types" icon="drawCircle" size="small" @click="setDrawType('drawCircle')"></el-button>
        <el-button class="draw-types" icon="drawRect" size="small" @click="setDrawType('drawRect')"></el-button>
        <el-button class="draw-types" icon="drawPolygon" size="small" @click="setDrawType('drawPolygon')"></el-button>
      </div>
      <el-button type="primary" size="small" icon="search" slot="reference"></el-button>
    </el-popover>
    <el-button type="primary" size="small" icon="delete" @click="clearMap"></el-button>
  </div>
  <div class="map" ref="map" :style="mapStyle">
  </div>
</div>
</template>
<style lang="scss" scoped>
.map {
    width: 100%;
    height: calc(100vh - 396px);
    overflow: hidden;

    &-container {
        position: relative;
    }

    &-tools {
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 10;
    }
}

.draw-types {
    padding: 5px;
    border: none;
}
</style>
<style lang="scss">
@keyframes rlmainliimgMove {
    from {
        transform: rotateY(0deg);
        -ms-transform: rotateY(0deg);
        /* IE 9 */
        -moz-transform: rotateY(0deg);
        /* Firefox */
        -webkit-transform: rotateY(0deg);
        /* Safari 和 Chrome */
        -o-transform: rotateY(0deg);
        /* Opera */
    }
    to {
        transform: rotateY(360deg);
        -ms-transform: rotateY(360deg);
        /* IE 9 */
        -moz-transform: rotateY(360deg);
        /* Firefox */
        -webkit-transform: rotateY(360deg);
        /* Safari 和 Chrome */
        -o-transform: rotateY(360deg);
        /* Opera */
    }
}

.types-popper {
    min-width: 130px !important;
    padding: 3px;
}

.el-icon {
    &-drawCircle {
        background: url('../../assets/icon_b_02.png') no-repeat;
        width: 24px;
        height: 24px;
    }

    &-drawRect {
        background: url('../../assets/icon_c_02.png') no-repeat;
        width: 24px;
        height: 24px;
    }

    &-drawPolygon {
        background: url('../../assets/icon_d_02.png') no-repeat;
        width: 24px;
        height: 24px;
    }
}

.poi-tip {
    padding: 5px;
}

.pgis-sidebar {
    width: 300px;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: #fff;
    z-index: 10;
    border-right: 1px solid #999;
    transition: transform 0.3s;
}

.pgis-sidebar.is-collapsed {
    transform: translateX(-100%);
}

.pgis-sidebar-wrap {
    padding: 10px;
    overflow: hidden;
    height: calc(100% - 20px);
}

.pgis-sidebar-switch {
    width: 15px;
    height: 50px;
    position: absolute;
    right: -15px;
    top: 50%;
    z-index: 11;
    background: url("../../assets/icon_01.png") no-repeat 0 center;
    border-top: 1px solid #999;
    border-bottom: 1px solid #999;
    cursor: pointer;
    transform: translateY(-50%);
}

.is-collapsed .pgis-sidebar-switch {
    background-image: url("../../assets/icon_02.png");
}

.poi-list-wrap {
    margin-top: 5px;
    overflow: auto;
    height: calc(100% - 25px);
}

.poi-list {
    margin: 0;
    padding: 5px 0;
    list-style: none;
}

.poi-list li {
    clear: both;
    cursor: pointer;
    padding: 5px 0;
    min-height: 40px;
}
.poi-list li:hover {
    background: #eee;
}

.poi-list li.is-selected {
    background: #74b8eb;
    color: #fff;
}
.poi-list li:hover .num img {
    animation: rlmainliimgMove 2s linear 0s infinite normal;
    /* Firefox: */
    -moz-animation: rlmainliimgMove 2s linear 0s infinite normal;
    /* Safari 和 Chrome: */
    -webkit-animation: rlmainliimgMove 2s linear 0s infinite normal;
    /* Opera: */
    -o-animation: rlmainliimgMove 2s linear 0s infinite normal;
}

.poi-list .num {
    float: left;
    width: 21px;
    height: 32px;
}

.poi-list .num img {
    width: 21px;
    height: 32px;
}

.poi-name {
    margin-left: 35px;
}

.poi-list-wrap .pager {
    text-align: center;
}
</style>
<script>
import { EZ_POIS_SEARCH_S } from '../../config'
export default {
  props: {
    // 绘制图形的颜色
    drawColor: {
      type: String,
      default: '#b2e0f0'
    },
    // 搜索关键字
    keyword: {
      type: String,
      default: ''
    },
    // 搜索资源图层名称， 默认搜索全部图层
    // AJGL_SJJBXX_PT 案件， PGIS_CS_FWCS_DH_PG_BG 旅馆， JSAH_JTGL_JKKK_PT 卡口， PGIS_CS_YLCS_DH_PG_WB 网吧
    layer: {
      type: String,
      default: ''
    },
    defaultZoom: {
      type: Number,
      default: 10
    },
    showSidebar: {
      type: Boolean,
      default: true
    },
    showTools: {
      type: Boolean,
      default: true
    },
    mapStyle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      map: null,
      collapsed: true,
      drawType: null,
      showPopover: false,
      currentMarker: null,
      featureParams: {
        location: '',
        buffer: '',
        bounds: '',
        polyline: ''
      },
      markers: [],
      currentKeyword: this.keyword,
      searchResult: null,
      currentPage: 1,
      selected: null
    }
  },
  methods: {
    handleItemClick(item, index) {
      this.openInfo([item.x, item.y], this.markers[index])
      this.selected = item
    },
    handleSearch() {
      this.currentPage = 1
      this.selected = null
      this.search()
    },
    handlePageChange(page) {
      this.currentPage = page
      this.selected = null
      this.search()
    },
    handleSwitch() {
      this.collapsed = !this.collapsed
    },
    handleMouseEnter(item, index) {
      item.hover = true
      this.searchResult.pois.splice(index, 1, item)
      this.updateIcon(this.markers[index], index, true)
    },
    handleMouseLeave(item, index) {
      item.hover = false
      this.searchResult.pois.splice(index, 1, item)
      this.updateIcon(this.markers[index], index, false)
    },
    setFeatureParams(type, feature) {
      this.featureParams = {
        location: '',
        buffer: '',
        bounds: '',
        polyline: ''
      }
      switch(type) {
        case 'drawCircle':
          this.featureParams.location = feature.getCenter().getCoordinate().join(',')
          this.featureParams.buffer = feature.getRadius()
          break
        case 'drawRect':
          this.featureParams.bounds = feature.getBounds().toBBoxString()
          break
        case 'drawPolygon':
          this.featureParams.polygon = feature.coordString
          break
      }
    },
    setDrawType(type) {
      this.clearMap()
      this.drawType = type
      this.showPopover = false
      this.map.changeDragMode(type, feature => {
        feature.setFillColor(this.drawColor)
        feature.setStrokeColor(this.drawColor)
        feature.setFillOpacity(0.5)
        this.map.addOverlay(feature);
        this.setFeatureParams(type, feature)
        this.$emit('on-draw-complete', type, this.featureParams)
      })
    },
    clearMap() {
      this.map && this.map.clear()
      this.searchResult = null
      this.currentMarker = null
      this.markers = []
      this.$emit('on-clear')
    },
    search(options) {
      let params = Object.assign({
        group: '',
        type: 'FQ',
        keywords: this.currentKeyword,
        method: 'LIKE',
        scope: '_FULLTEXT',
        groupBy: '',
        bounds: '',
        polygon: '',
        location: '',
        buffer: '',
        //          layers: this.layer,
        filterCustom: this.layer ? `LAYERNAME:${this.layer}` : '',
        sortBy: '',
        pageIndex: this.currentPage - 1,
        pageSize: 10,
        timespan: (new Date()).getTime()
      }, this.featureParams, options || {})
      return this.$http.jsonp(EZ_POIS_SEARCH_S, {
        params: params
      }).then(res => {
        if(res.data && res.data.groups) {
          this.searchResult = res.data.groups[0]
          this.currentMarker && this.currentMarker.closeInfoWindow()
          this.currentMarker = null
          const pois = (this.searchResult || {}).pois || []
          this.renderMarker(pois)
        }
        return res
      }).catch(err => {
        this.$alert('PGIS服务端错误码：' + err.status, '提示')
      })
    },
    createMarker(index, poi) {
      const position = new window.EzCoord(poi.x, poi.y);
      const src = `/static/num/red${index % 10}.png`
      const icon = new window.EzIcon({
        src: src,
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        opacity: 1
      });
      const marker = new window.EzMarker(position, icon);
      marker.poi = poi
      this.markers.push(marker)
      this.map.addOverlay(marker);
    },
    updateIcon(marker, index, hover) {
      const src = hover ? `/static/num/blue${index % 10}.png` : `/static/num/red${index % 10}.png`
      const icon = new window.EzIcon({
        src: src,
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        opacity: 1
      });
      marker.setIcon(icon)
    },
    renderMarker(pois) {
      this.markers.forEach(marker => {
        this.map.removeOverlay(marker);
      })
      this.markers = []
      pois.forEach((poi, index) => {
        this.createMarker(index, poi)
      })
    },
    getMarkerAtPixel(e) {
      let pixel = e.pixel
      return this.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        if(feature instanceof window.EzMarker) {
          return feature
        }
      })
    },
    openInfo(coord, marker) {
      if(this.currentMarker) {
        this.currentMarker.closeInfoWindow()
      }
      let poi = marker.poi
      let html = `<div class="poi-tip">${poi.name}</div>`
      marker.openInfoWindow(html, new window.EzCoord(coord[0], coord[1]))
      this.currentMarker = marker
      this.$emit('update:currentMarker', marker)
    },
    setCenter() {

    }
  },
  mounted() {
    this.map = new window.EzMap(this.$refs.map)

    // 设置地图初始中心点及缩放级别
    let coord = new window.EzCoord(110.0007, 27.5716), // 怀化市局为中心 110.0007,27.5716, 怀化市政府中心 109.9972, 27.5729
      zoom = this.defaultZoom // 缩放级别
    this.map.centerAndZoom(coord, zoom) // 设置中心点

    this.$on('on-draw-complete', (type, params) => {
      this.currentPage = 1
      this.selected = null
      this.search()
      this.collapsed = false
    })
    this.map.addMapEventListener(window.Ez.Event.MAP_MOUSEMOVE, e => {
      let marker = this.getMarkerAtPixel(e)
      this.$refs.map.style.cursor = marker ? 'pointer' : 'default'
    })

    this.map.addMapEventListener(window.Ez.Event.MAP_CLICK, e => {
      let coord = e.coordinate;
      let marker = this.getMarkerAtPixel(e)
      marker && this.openInfo(coord, marker)
      this.$emit('on-updata-grid', coord)
    })
  }
}
</script>
