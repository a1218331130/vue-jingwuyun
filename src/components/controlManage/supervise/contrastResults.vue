<template>
<div class="contrast-result-dialog">
  <el-dialog v-draggable="dialogDraggableOptions" class="result-dialog" :title="titleName" size="large" :visible.sync="dialog" @open="initDialog" :before-close="closeEvent">
    <div style="width: 100%;" v-loading="loading">

      <el-row>
        <!-- 左侧树 -->
        <!-- <div class="left-tree"> -->
        <el-col :span="4">
          <el-tree class="cat-treethis" :data="treeData" node-key="label" :highlight-current="true" :indent="0" :default-expand-all="true" :render-content="treeRenderContent" style="border: none;" @node-click="handleNodeClick"></el-tree>
        </el-col>
        <!-- </div> -->
        <!-- 右侧内容表格 -->
        <el-col :span="20" class="right-table-content">
          <div class="list-wrap" v-show="tableList.length>0" style="width:99.4%">
            <div class="list-box">
              <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" id="constrastRusTable" style="border: none" :show-header="false" :data="tableList" :border="false">
                <el-table-column class-name="compact" label="内容集">
                  <template scope="scope">
                    <div class="compact__wrap compact__wrap--grid">
                      <div class="compact__serial">
                        <el-tag type="primary">{{scope.$index+ 1+(pageInfo.currentpage-1)*pageInfo.limit}}</el-tag>
                      </div>
                      <div class="compact__box">
                        <div class="compact__title">
                          <!-- 采集时间:  -->
                          {{getAcqTime(scope.row)}} {{(!scope.row.ngw_table_sign ? columns : columnsMap[scope.row.ngw_table_sign])[0].tableName || ''}}
                        </div>
                        <div :class="{'compact__item':true,'compact__item--point':column.type!==null}" v-for="column in (!scope.row.ngw_table_sign ? columns : columnsMap[scope.row.ngw_table_sign])" v-if="scope.row[column.prop]!==''" :key="column.id" @click="colOnClickEvent(column.type,scope.row[column.prop],scope.row)">
                          <label v-html="column.label"></label>
                          <span v-html="scope.row[column.prop]"></span>
                        </div>
                      </div>
                    </div>
                  </template>
</el-table-column>
</el-table>
</div>
</div>

<div class="app-toolbar tool-pagination" style="border-color: rgb(238, 238, 238)" v-if="(this.pageInfo.count!==0)">
  <pagination :count="this.pageInfo.count" :pagenav="{limit: this.pageInfo.limit,currentpage: this.pageInfo.currentpage}" @update:pagenav="updatePage"></pagination>
</div>
<!-- 右侧无内容初始状态 -->
<div class="empty empty--tips" v-show="!(tableList.length > 0)">
  <span v-if="treeData.length > 0">{{noMessageMark}}</span>
  <span v-else>暂无相关要素数据</span>
</div>

</el-col>
</el-row>
</div>
</el-dialog>
<dialog-people-info :dialog="peopleInfoDialog" :data="infoDialogData" :modalAppendToBody="false" @close="peopleInfoDialog=false" @call:dialog="openInfoDialog"></dialog-people-info>
<dialog-car-info :dialog="carInfoDialog" :data="infoDialogData" :modalAppendToBody="false" @close="carInfoDialog=false" @call:dialog="openInfoDialog"></dialog-car-info>
<dialog-mobile-info :dialog="mobileInfoDialog" :data="infoDialogData" :modalAppendToBody="false" @close="mobileInfoDialog=false" @call:dialog="openInfoDialog"></dialog-mobile-info>
</div>
</template>
<style lang="scss" scoped>
  .cat-treethis {
    width: 250px;
    float: left;
    height: 500px;
    padding: 16px;
    margin-bottom: 10px;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .left-tree {}

  .list-wrap {
    // width: calc(100% - 252px);
    // calc(100% - 225px);
    float: right; // margin-bottom: 10px;
    .list-box {
      background-color: #fff;
      .compact__title {
        line-height: 28px;
      }
    }
  }

  .empty {
    transform: scale(1.5) translateY(-50%) translateX(-36%);
  }

  .table-box {
    // height: calc(100vh - 245px);
  }

  .app-table {
    height: 470px;
    padding-left: 10px;
  }

  .app-toolbar .tool-pagination {
    padding: 6px 8px;
    background: #FFFFFF;
    border-width: 1px 0;
    border-style: solid;
    border-color: #ccc;
    position: relative;
    clear: both;
  }

  .right-table-content {
    height: 470px;
    position: relative;
  }

</style>
<style lang="scss">
  .contrast-result-dialog {
    .result-dialog {
      .el-table__body-wrapper {
        overflow-x: hidden;
        overflow-y: scroll;
        padding-left: 5px;
        height: 450px !important;
      } // 树结构样式
      .el-tree-node {
        >.el-tree-node__children {
          position: relative;
          left: 10px;
        }
        &.is-current {
          >.el-tree-node__content {
            >.cat-treethis__item {
              >.cat-treethis__item__count {
                background-color: #d1dbe5;
              }
            }
          }
        }
        .is-current {
          >.el-tree-node__content {
            >.cat-treethis__item {
              >.cat-treethis__item__count {
                background-color: #d1dbe5;
              }
            }
          }
        }
      } // 树结构样式
      .el-tree-node {
        >.el-tree-node__content {
          .cat-treethis__item {
            .cat-treethis__item__count {
              right: -1px;
            }
          }
        }
        >.el-tree-node__children {
          .el-tree-node {
            >.el-tree-node__content {
              .cat-treethis__item__count {
                right: 8px;
              }
            }
            >.el-tree-node__children {
              .el-tree-node {
                >.el-tree-node__content {
                  .cat-treethis__item__count {
                    right: 18px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

</style>
<script>
  // import Vue from 'vue'
  import mixin from '../../../utils/mixin'
  import { mapState } from 'vuex'
  // import { getOnlyArray } from '../../../utils/util'
  import { clone } from '../../../utils/util'
  import infoDialogEvents from '../../../utils/infoDialogEvents'
  import dialogInfo from '../../../widgets/info-dialog/info-dialog'
  import pagination from '../../../widgets/pagination/pagination.vue'

  import {
    //    FETCH_DATA_POOL_LIST,
    //    FETCH_DATA_POOL_BY_TABLE_LIST
    FETCH_GET_TZJG_LIST,
    FETCH_FEATURE_LIST,
    FETCH_FEATURE_COUNT
  } from '../../../store/types'
  export default {
    mixins: [mixin, infoDialogEvents],
    components: {
      'dialog-people-info': dialogInfo,
      'dialog-car-info': dialogInfo,
      'dialog-mobile-info': dialogInfo,
      pagination
    },
    computed: {
      // resList() {
      //   let res = [...this.list]
      //   // 排序
      //   if (this.sortQuery !== null && this.type === 1) {
      //     res.sort((a, b) => {
      //       let itemA = a[this.sortQuery.column],
      //         dateA = new Date(itemA),
      //         itemB = b[this.sortQuery.column],
      //         dateB = new Date(itemB),
      //         isDateTime = dateA.getFullYear() === parseInt(itemA.substr(0, 4))
      //       if (this.sortQuery.type === 'desc') {
      //         return isDateTime === true ? dateB - dateA : itemB - itemA
      //       } else {
      //         return isDateTime === true ? dateA - dateB : itemA - itemB
      //       }
      //     })
      //   }
      //   return res
      // },
      ...mapState(['dataPool', 'controlManage'])
    },
    data() {
      return {
        resLoading: false,
        titleName: '',
        loading: false,
        hitNumber: 0,
        caseId: null,
        treeData: [], // 初始化左侧菜单
        // treeData:[{
        //   label:'人'
        // }],
        showTableData: true,
        pageInfo: { // 页面分页信息相关配置
          count: 0,
          limit: 10,
          currentpage: 1
        },
        currentItemId: null,
        tableList: [],
        pagenav: {
          // currentpage: 1,
          // limit: 10
        },
        list: [],
        recordArr: [],
        recordData: {},
        columnsMap: {},
        heightLightKeys: '',
        noMessageMark: '请从左边树菜单选择要素',
        columns: [],
        idinfo: {
          TableId: '',
          TzId: ''
        }
        // detail: {
        //   id: 1,
        //   city: '长沙',
        //   name: '李明钟',
        //   idCard: '440104198005065314',
        //   mobile: '13585466875',
        //   sex: '男',
        //   birthday: '1980-05-06',
        //   nation: '汉',
        //   // native: '湖南省怀化市鹤城区',
        //   // residence: '湖南省怀化市鹤城区',
        //   domicile: '湖南省怀化市鹤城区坨院街道',
        //   plateNo: '湘N A56R7',
        //   service: '不详'
        // }
      }
    },
    props: ['dialog', 'ID', 'title'],
    methods: {
      initDialog() {
        this.loadData(this.ID)
        this.tableList = []
        this.recordArr = []
        this.recordData = {}
        this.loading = false
        this.noMessageMark = '请从左边树菜单选择分类或要素'
        this.treeData = []
      },
      closeEvent() {
        this.$emit('close')
        this.$emit('call:change-update')
        this.tableList = []
        this.hitNumber = 0
        this.pageInfo.count = 0
      },
      getTargetName(val) {
        let res
        switch (val) {
          case '1':
            res = '人'
            break;
          case '2':
            res = '车'
            break;
          case '3':
            res = '关键字'
            break;
          default:
            res = ''
        }
        return res
      },
      getFeaturesName(val) {
        let res
        switch (val) {
          case '1':
            res = '姓名'
            break;
          case '2':
            res = '身份证'
            break;
          case '3':
            res = '手机'
            break;
          case '8':
            res = '车牌号'
            break;
          default:
            res = ''
        }
        return res
      },
      /**
       * 查询关键字左侧树菜单
       */
      //      todo:注释
      //      queryTreeMenu() {
      //        this.dispatch(FETCH_DATA_POOL_LIST, {
      //          AjId: this.caseId
      //        })
      //      },
      /**
       * 查询关键字对应数据表查询 list
       * @param keywordId 关键字 id
       * @param tableId 对于表格 id
       */
      //      todo:注释
      //      queryTableList(keywordId, tableId) {
      //        this.dispatch(FETCH_DATA_POOL_BY_TABLE_LIST, {
      //          PageIndex: this.pageInfo.currentpage,
      //          PageSize: this.pageInfo.limit,
      //          Model: {
      //            GjcID: keywordId, // 关键词ID
      //            TableID: tableId // 数据表ID
      //          }
      //        })
      //      }，
      //     todo：loadData试一下接口
      updatePage(data) {
        this.tableList = []
        this.loadList(this.idinfo.TableId, this.idinfo.TzId, data)
        this.pageInfo.limit = data.limit
        this.pageInfo.currentpage = data.currentpage
      },
      handleData(item) {
        if (item) {
          let res = item.map(d => {
            return {
              class: '2',
              count: d.bkcnt,
              id: d.id,
              bkid: d.bkid,
              label: d.gjz,
              lybid: d.lybid,
              children: []
            }
          })
          return res
        } else {
          return []
        }
      },
      // 加载特征树
      loadData(val) {
        this.dispatch(FETCH_FEATURE_LIST, {
          bkid: val,
          qqly: '1'
        }).then(d => {
          let array = []
          array = this.controlManage.list.map(d => d.dxjgs)
          this.hitNumber = 0
          array.forEach(d => {
            this.hitNumber += parseInt(d)
          })
          this.titleName = '截至本日布控任务：' + this.title + '的布控结果' + '        命中' + this.hitNumber + '条'
          this.treeData = clone(this.controlManage.list.map(d => {
            return {
              class: '1',
              count: d.dxjgs,
              dxid: d.dxid,
              dxjgs: d.dxjgs,
              dxlx: d.dxlx,
              label: d.dxmc,
              children: this.handleData(d.dxtz_obj)
            }
          }))
          this.treeData = this.treeData.filter(d => d.children.length !== 0)
        })
      },
      //      todo:右边信息列表
      loadList(bid, tzid, pageInfo) {
        this.idinfo = {
          TableId: bid,
          TzId: tzid
        }
        this.dispatch(FETCH_GET_TZJG_LIST, {
          PageIndex: pageInfo.currentpage,
          PageSize: pageInfo.limit,
          TableId: bid,
          TzId: tzid
        }).then(() => {
          this.tableList = []
          this.handleArrayData()
        })
      },
      countList(tzid) {
        this.idinfo = {}
        this.columnsMap = {}
        this.list = []
        this.tableList = []
        this.dispatch(FETCH_FEATURE_COUNT, {
          TzId: tzid
        }).then(() => {
          if (!(this.controlManage.count.length > 0)) {
            this.noMessageMark = '无此布控信息的查询结果'
            return false
          }
          this.pageInfo.count = this.controlManage.count[0].Total
          this.loadList(this.controlManage.count[0].TableID, tzid, this.pageInfo)
        })
      },
      handleArrayData() {
        this.tableList = []
        this.columnsMap = {}
        this.list = []
        let data = this.controlManage.tzList.SearchDatas.filter(d => d.HasQx === true && d.Source !== null && d.TableInfo.Columns !== null && d.TableInfo.Columns.length > 0)
        data.forEach((d, i) => {
          this.columnsMap[d.TableInfo.ID] = d.TableInfo.Columns.map(c => {
            return {
              id: c.ID,
              label: c.FieldCn,
              prop: c.FieldEn,
              tableId: d.TableInfo.ID,
              tableName: d.TableInfo.ZyName,
              type: this.getColumnsType(c.Ybsf)
            }
          })
          // 多表原理, 在源数据中插入特殊字段, 纪录该条数据所属表信息
          d.Source.forEach(s => {
            s['ngw_table_sign'] = d.TableInfo.ID
          })

          this.list = [...this.list, ...d.Source]

          this.tableList = this.list
          this.pageInfo.count = this.controlManage.tzList.Total
          // 更新历史
          // this.tabs[this.currentTab].list = [...this.list]
        })
      },
      treeClickEvents(data, node, store) {
        this.pageInfo = { // 页面分页信息相关配置
          count: 0,
          limit: 10,
          currentpage: 1
        }
        if (data.keyId) {
          this.countList(data.keyId)
        } else {
          return false
        }
      },
      treeRenderContent(h, { data, node, store }) {
        let content = h('span', {
          class: { 'cat-treethis__item': true, 'cat-treethis__item__current': node.id === this.currentItemId },
          on: {
            click: () => {
              this.treeClickEvents(data, node, store)
            }
          }
        }, [h('i', {}), h('span', {
          class: 'cat-treethis__item__label'
        }, data.label), h('span', {
          class: 'cat-treethis__item__count'
        }, data.count)])
        return content
      },
      getAcqTime(item) {
        let columns = (!item.ngw_table_sign ? this.columns : this.columnsMap[item.ngw_table_sign])
        return item[columns[0].collectTime]
      },
      // 点击树结构：
      handleNodeClick(node, index, even) {
        if (node.class === '2' && !node.flag) {
          node.flag = true
          this.recordArr.push(node.id)
          this.dispatch(FETCH_FEATURE_COUNT, {
            TzId: node.id
          }).then(() => {
            if (this.controlManage.count.length > 0) {
              this.controlManage.count.forEach(d => {
                node.children.push({
                  label: d.TableNameCn,
                  id: node.id,
                  TableID: d.TableID,
                  TableName: d.TableName,
                  count: d.Total,
                  class: '3',
                  flag: true
                })
              })
            } else {
              this.tableList = []
              this.noMessageMark = '暂无数据'
            }
          })
        } else if (node.class === '3') {
          this.loadList(node.TableID, node.id, this.pageInfo)
        }
      }
    },
    watch: {},
    mounted() {},
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
    }
  }

</script>
