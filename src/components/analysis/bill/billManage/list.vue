<template>
<!--列表-->
<div class="tel-list" v-if="list.length!==0">
<el-table @cell-mouse-enter="cellMouseEnter" class="app-table" border stripe :data="list" @row-dblclick="rowClick" :height="tableHeight" style="width:100%;">
  <!--<el-table-column type="selection" width="55"></el-table-column>-->
  <el-table-column type="index" label="序号" align="center" v-if="tab.length > 0" :width="tab.length > 0?'50':'auto'" sortable>
    <template scope="scope">
        {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
      </template>
</el-table-column>
<el-table-column label="编辑" align="center" :width="tab.length > 0?'50':'auto'">
  <template scope="scope">
        <div @click="rightMenu(scope.row.guid+'_'+scope.row.zzh+'_'+parseInt(scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)))">操作</div>
      </template>
</el-table-column>
<!-- <el-table-column v-for="(item,i) in tab" :key="i" :prop="item.prop" :label="item.label" align="center" :width="(item.label.length * 20)"></el-table-column> -->
<el-table-column v-for="(item,i) in tab" :key="i" :fit="true" :prop="item.prop"  :label="item.label" align="center" sortable :min-width="getColumnWidth(item)"></el-table-column>

</el-table>
<contextMenu :menuData="menuDatas" v-show="contextStatus" @changeMenuStatus="changeStatus" @deleteSplit="dataSplit"></contextMenu>
<!-- <div v-show="contextStatus" id="rightMenu" class="tel-list-rightMenu" @click.stop="()=>{}">
  <span @click.stop="deleteOne()" class="tel-list-rightMenu-delete">删除</span>
  <span class="tel-list-develop" @click.stop="()=>{}">更多功能开发中...</span>
</div> -->
</div>
</template>
<style lang="scss" scoped>


</style>

<script>
  import mixin from '../../../../utils/mixin'
  import contextMenu from '../../common/contextMenu'
  import { mapState } from 'vuex'
  import getColumnWidth from '../getColumnWidth'
  export default {
    mixins: [mixin],
    components: { contextMenu },
    data() {
      return {
        contextStatus: false,
        counts: '',
        menuDatas: {
          menu: [{
            name: '删除',
            method: 'deleteOne',
            sendData: {
              v_guid: '',
              v_zzh: '',
              v_type: ''
            }
          }],
          types: 'billManage',
          id: 'billList',
          clientY: '',
          clientX: ''
        }
      }
    },
    props: {
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
        let offset = this.H || 200;
        let height = document.documentElement.clientHeight - parseFloat(offset)
        return (height < 100 ? 100 : height).toString()
      },
      ...mapState(['analysisBill'])
    },
    methods: {
      getColumnWidth,
      rowClick(row, e) {
        this.$emit('on:rowclick', { row: row, e: e })
      },
      rightMenu(val) {
        event.preventDefault();
        this.contextStatus = true;
        this.menuDatas.clientY = event.clientY;
        this.menuDatas.clientX = event.clientX;
        let arr = [];
        arr = val.split('_');
        this.menuDatas.menu[0].sendData.v_zzh = arr[1];
        this.menuDatas.menu[0].sendData.v_type = 2;
        this.menuDatas.menu[0].sendData.v_guid = arr[0];
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
