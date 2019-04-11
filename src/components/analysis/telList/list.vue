<template>
<!--列表-->
<div ref="telList" class="tel-list">
<el-table @cell-mouse-enter="onMouseOverMap" @cell-mouse-leave="onMouseLeaveMap" class="app-table" border stripe :data="list" @row-dblclick="rowClick" :height="tableHeight" style="width:100%;">

    <!--<el-table-column type="selection" width="55"></el-table-column>-->
    <el-table-column type="index" label="序号" align="center" v-if="tab.length > 0" :width="tab.length > 0?'50':'auto'" sortable>
      <template scope="scope">
        {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
      </template>
</el-table-column>
<el-table-column v-if="canViewMap && tab.length > 0" type="index" label="地图" align="center" :width="tab.length > 0?'50':'auto'">
  <template scope="scope">
        <div class="view-map" @click="viewMap(scope.row)">
        查看
        </div>
      </template>
</el-table-column>
<el-table-column v-if="showOperationColumn && tab.length > 0" type="index" label="操作" align="center" :width="tab.length > 0?'50':'auto'">
  <template scope="scope">
        <div class="operation-text" @click="e => rowClick(scope.row, e)" v-if="showDetailBtn">
        详情
        </div>
      </template>
</el-table-column>

<!-- <el-table-column v-for="(item,i) in tab" :key="i" :prop="item.prop" :label="item.label" align="center" :width="(item.label.length * 20)"></el-table-column> -->
<el-table-column v-for="(item,i) in tab" :key="i" :prop="item.prop" :label="item.label" :min-width="getColumnWidth(item)" align="center" sortable :sort-method="sortMethod(item.prop)"></el-table-column>
</el-table>
<div v-if="canViewMap" class="map-tips" :style="mapShowStyle">{{mapShowMsg}}</div>
</div>
</template>
<style lang="scss" scoped>
  .tel-list {}

  .view-map {
    text-decoration: underline;
    cursor: pointer;
  }

  .operation-text {
    text-decoration: underline;
    cursor: pointer;
  }

  .map-tips {
    position: absolute;
    z-index: 9999;
    background-color: #fff;
    border: 1px solid #ccc;
    color: #888;
    padding: 5px;
    display: none;
  }

</style>
<script>
  import mixin from '../../../utils/mixin'

  import bus from '../../../utils/bus'
  import getColumnWidth from './getColumnWidth'
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        mapShowStyle: '',
        mapShowMsg: ''
      }
    },
    props: {
      isInDialog: {
        type: Boolean,
        default: false
      },
      canViewMap: {
        type: Boolean,
        default: true
      },
      showDetailBtn: {
        type: Boolean,
        default: false
      },
      pagenav: {
        type: Object,
        default: () => {
          return {
            count: 10,
            limit: 10,
            currentpage: 1
          }
        }
      },
      list: {
        type: Array,
        default: () => {
          return []
        }
      },
      tab: {
        type: Array,
        default: () => {
          return []
        }
      },
      H: {
        type: String,
        default: ''
      }
    },
    computed: {
      tableHeight() {
        let offset = this.H ? parseInt(this.H) : 390;
        let height = document.documentElement.clientHeight - parseFloat(offset)
        let computeHeight = (height < 200 ? 200 : height).toString();
        return computeHeight;
      },
      showOperationColumn() {
        return this.showDetailBtn;
      }
    },
    methods: {
      getColumnWidth,
      onMouseOverMap(row, column, cell, event) {
        let offset = this.isInDialog ? parseInt(document.documentElement.clientHeight * 0.15) : 0;
        let isViewMapCell = this.$(cell).find('.view-map').length !== 0;
        if (isViewMapCell) {
          this.mapShowMsg = row.jd ? ('经度:' + row.jd + ',纬度:' + row.wd) : '没有相关数据';
          this.mapShowStyle = `display:block;top:${event.clientY - offset}px;left:${event.clientX + 20}px`;
        } else {
          this.onMouseLeaveMap();
          this.cellMouseEnter(row, column, cell, event);
        }
      },
      onMouseLeaveMap(row, column, cell, event) {
        this.mapShowStyle = `display:none`;
      },
      sortMethod(columnName) {
        let weekSort = (a, b) => {
          let weekMap = {
            '星期一': 0,
            '星期二': 1,
            '星期三': 2,
            '星期四': 3,
            '星期五': 4,
            '星期六': 5,
            '星期日': 6
          };
          return weekMap[a[columnName]] < weekMap[b[columnName]];
        }
        let defaultSort = (a, b) => {
          return a[columnName] < b[columnName];
        }
        if (columnName === 'xq') {
          return weekSort;
        } else {
          return defaultSort;
        }
      },
      rowClick(row, e) {
        this.$emit('on:rowclick', { row: row, e: e })
      },
      viewMap(val) {
        let jd = val.jd,
          wd = val.wd;
        if (!jd || !wd) {
          this.$message({ type: 'warning', message: '没有经纬度数据，无法加载地图信息' })
        } else {
          bus.$emit('tel-map-open', { pos: { jd: jd, wd: wd } })
        }
      },
      // 表格宽度
      handleResize() {
        let tabW = this.$refs.telList ? this.refs.telList : 0
        console.log(tabW, 'tabW')
      }
    },
    created() {
      // let oTelList = this.$refs.telList;
      // if (oTelList) {
      //   oTelList.style.height = this.tableHeight + 10 + 'px'
      // }
      // console.log(oTelList, this.tableHeight)
    },
    mounted() {}
  }

</script>
