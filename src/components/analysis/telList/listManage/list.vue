<template>
<!--列表-->
<div class="tel-list" v-if= "list.length!==0">
<el-table @cell-mouse-enter="onMouseOverMap" @cell-mouse-leave="onMouseLeaveMap" class="app-table" border stripe :data="list" @row-dblclick="rowClick" :height="tableHeight" style="width:100%;">

    <!--<el-table-column type="selection" width="55"></el-table-column>-->
    <el-table-column type="index" label="序号" align="center" v-if="tab.length > 0" :width="tab.length > 0?'50':'auto'" sortable>
      <template scope="scope">
        {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
      </template>
</el-table-column>
<el-table-column v-if="canViewMap && tab.length > 0" type="index" label="地图" align="center" :width="tab.length > 0?'50':'auto'">
  <template scope="scope">
        <span class="view-map" @click="viewMap(scope.row.jd,scope.row.wd)">查看</span>
      </template>
</el-table-column>
<el-table-column label="编辑" align="center" :width="tab.length > 0?'50':'auto'">
  <template scope="scope">
    <div @click="rightMenu(scope.row.guid+'_'+scope.row.zzh+'_'+parseInt(scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)))">操作</div>
      </template>
</el-table-column>
<!-- <el-table-column v-for="(item,i) in tab" :key="i" :prop="item.prop" :label="item.label" align="center" :width="(item.label.length * 20)"></el-table-column> -->
<el-table-column v-for="(item,i) in tab" :key="i" :prop="item.prop" :min-width="getColumnWidth(item)" :fit="true" :label="item.label" align="center" sortable :sort-method="sortMethod(item.prop)"></el-table-column>

</el-table>
<div v-if="canViewMap" class="map-tips" :style="mapShowStyle">{{mapShowMsg}}</div>
<!-- 地图查看 -->
<map-view-dialog :dialog="addressDialog" :data="mapData" @close="addressDialog = false" :size="'large--fixed'"></map-view-dialog>
<contextMenu :menuData="menuDatas" v-show="contextStatus" @changeMenuStatus="changeStatus" @deleteSplit="dataSplit"></contextMenu>
</div>
</template>
<style lang="scss" scoped>
  .tel-list {}

  .view-map {
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
  import contextMenu from '../../common/contextMenu'
  import mixin from '../../../../utils/mixin'
  import mapViewDialog from './../map-view-dialog'
  import { mapState } from 'vuex'
  import getColumnWidth from '../getColumnWidth'
  export default {
    mixins: [mixin],
    components: {
      mapViewDialog,
      contextMenu
    },
    data() {
      return {
        mapShowStyle: '',
        mapShowMsg: '',
        addressDialog: false,
        mapData: {
          pos: {
            jd: '109.90821838',
            wd: '27.40741539'
          }
        },
        menuDatas: {
          menu: [{
            name: '删除',
            method: 'deleteOne',
            sendData: {
              V_GUID: '',
              V_SJHM: '',
              V_TYPE: ''
            }
          }],
          types: 'listManage',
          id: 'listList',
          clientY: '',
          clientX: ''
        },
        contextStatus: false
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
        let offset = 200;
        let height = document.documentElement.clientHeight - parseFloat(offset)
        return (height < 200 ? 200 : height).toString()
      },
      ...mapState(['analysisTelList'])
    },
    methods: {
      getColumnWidth,
      onMouseOverMap(row, column, cell, event) {
        let offset = this.isInDialog ? parseInt(document.documentElement.clientHeight * 0.15) : 0;
        let isViewMapCell = this.$(cell).find('.view-map').length !== 0;
        if (isViewMapCell) {
          this.mapShowMsg = row.jd ? ('经度:' +
            row.jd + ',纬度:' + row.wd) : '没有相关数据';
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
          let weekMap = { '星期一': 0, '星期二': 1, '星期三': 2, '星期四': 3, '星期五': 4, '星期六': 5, '星期日': 6 };
          return weekMap[a[columnName]] <
            weekMap[b[columnName]];
        }
        let defaultSort = (a, b) => {
          return a[columnName] <
            b[columnName];
        }
        if (columnName === 'xq') { return weekSort; } else { return defaultSort; }
      },
      rowClick(row, e) {
        this.$emit('on:rowclick', { row: row, e: e })
      },
      viewMap(jd, wd) {
        if (!jd || !wd) {
          this.$message({ type: 'warning', message: '没有经纬度数据，无法加载地图信息' })
        } else {
          this.mapData.pos.jd = jd;
          this.mapData.pos.wd = wd;
          this.addressDialog = true;
        }
      },
      rightMenu(val) {
        event.preventDefault();
        this.contextStatus = true;
        this.menuDatas.clientY = event.clientY;
        this.menuDatas.clientX = event.clientX;
        let arr = [];
        arr = val.split('_');
        this.menuDatas.menu[0].sendData.V_SJHM = arr[1];
        this.menuDatas.menu[0].sendData.V_TYPE = 2;
        this.menuDatas.menu[0].sendData.V_GUID = arr[0];
        this.counts = arr[2];
      },
      changeStatus() {
        this.contextStatus = false;
      },
      dataSplit() {
        this.list.splice(this.counts - 1, 1);
      }
    },
    created() {},
    mounted() {}
  }

</script>
