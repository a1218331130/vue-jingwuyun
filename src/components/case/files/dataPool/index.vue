<!-- 数据池 -->
<template>
<div style="width: 100%;height: 100%" v-loading="loadingV">
  <!-- 左侧树 -->
  <el-tree class="cat-tree dataPool" v-if="treeData.length>0" :data="treeData" node-key="treeData" :highlight-current="true" :indent="0" :default-expand-all="true" :render-content="treeRenderContent" style="border: none;"></el-tree>

  <!-- 右侧内容表格 -->
  <div class="list-wrap" v-if="tableList.length>0">
    <div class="list-box">
      <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" style="border: none" :show-header="false" :data="tableList" :border="false">
        <el-table-column class-name="compact" label="内容集">
          <template scope="scope">
              <div class="compact__wrap">
                <div class="compact__serial">
                  <el-tag type="primary">{{scope.$index + (50 * 0) + 1}}</el-tag>
                </div>
                <div class="compact__box">
                  <div class="compact__title">
                    采集时间: 2017-09-07 19:50
                  </div>

                  <div :class="{'compact__item':true,'compact__item--point':column.type!==null}"
                       v-for="column in columns" :key="column.id"
                       @click="colOnClickEvent(column.type,scope.row[column.prop],scope.row)">
                    <label v-html="column.label"></label>
                    <span v-html="scope.row[column.prop]"></span>
                  </div>
                </div>
              </div>
            </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="app-toolbar tool-pagination" style="border-color: rgb(238, 238, 238)">
      <pagination :count=" this.pageInfo.count" :pagenav="{limit: this.pageInfo.limit,currentpage: this.pageInfo.currentpage}"></pagination>
    </div>
  </div>

  <!-- 右侧无内容初始状态 -->
  <div class="empty empty--tips" v-show="!(tableList.length > 0)">
    <span v-if="treeData.length > 0">请从左边树菜单选择分类或要素</span>
    <span v-else>暂无相关要素数据</span>
  </div>

  <dialog-people-info :dialog="peopleInfoDialog" :data="detail" @close="peopleInfoDialog=false" @call:dialog="openDetailInfo"></dialog-people-info>
  <dialog-car-info :dialog="carInfoDialog" :data="detail" @close="carInfoDialog=false" @call:dialog="openDetailInfo"></dialog-car-info>
  <dialog-mobile-info :dialog="mobileInfoDialog" :data="detail" @close="mobileInfoDialog=false" @call:dialog="openDetailInfo"></dialog-mobile-info>
</div>
</template>

<style scoped lang='scss'>
.cat-tree {
    width: 220px;
    float: left;
}

.list-wrap {
    width: calc(100% - 225px);
    float: right;
    height: 100%;
    .list-box {
        height: calc(100% - 61px);
        overflow: auto;
    }
}

.empty {
    transform: scale(1.5) translateY(-50%);
}

.table-box {
    height: calc(100vh - 145px);
    overflow: auto;
}
</style>

<!-- 数据池树结构 -->
<style lang="scss">
.cat-tree.dataPool {
    .el-tree-node {
        .el-tree-node__content {
            height: 40px;
            line-height: 40px;
            .el-tree-node__expand-icon {
                margin-bottom: 3px;
            }
            .cat-tree__item {
                width: 176px;
            }
            .cat-tree__item__count {
                background: none;
            }
        }
        .el-tree-node__children {
            .el-tree-node__content {
                height: 30px;
                line-height: 30px;
                .el-tree-node__expand-icon {
                    margin-left: 36px;
                }
                .cat-tree__item {
                    .cat-tree__item__label {
                        padding-left: 14px;
                    }
                }
            }
        }
    }
}
</style>

<script>
import mixin from '../../../../utils/mixin'
import { mapState } from 'vuex'
import infoDialogEvents from '../../../../utils/infoDialogEvents'
import dialogInfo from '../../../../widgets/info-dialog/info-dialog'
import pagination from '../../../../widgets/pagination/pagination.vue'

import {
  FETCH_DATA_POOL_LIST,
  FETCH_DATA_POOL_BY_TABLE_LIST
} from '../../../../store/types'
export default {
  mixins: [mixin, infoDialogEvents],
  components: {
    'dialog-people-info': dialogInfo,
    'dialog-car-info': dialogInfo,
    'dialog-mobile-info': dialogInfo,
    pagination
  },
  computed: {
    ...mapState(['dataPool'])
  },
  data() {
    return {
      loadingV: false,
      caseId: null,
      treeData: [], // 初始化左侧菜单
      showTableData: true,
      pageInfo: { // 页面分页信息相关配置
        count: 10,
        limit: 10,
        currentpage: 1
      },
      peopleInfoDialog: false,
      carInfoDialog: false,
      mobileInfoDialog: false,
      currentItemId: null,
      tableList: [],
      pagenav: {
        currentpage: 1,
        limit: 10
      },
      columns: [
        //          {
        //            id: 2,
        //            allowPropertyEvent: true,
        //            label: '城市',
        //            prop: 'city',
        //            type: null
        //          }
      ],
      detail: {}
    }
  },
  props: {},
  methods: {
    /**
     * 查询关键字左侧树菜单
     */
    queryTreeMenu() {
      this.loadingV = true
      this.dispatch(FETCH_DATA_POOL_LIST, {
        AjId: this.caseId
      }).then(r => {
        this.loadingV = false
      })
    },
    /**
     * 查询关键字对应数据表查询 list
     * @param keywordId 关键字 id
     * @param tableId 对于表格 id
     */
    queryTableList(keywordId, tableId) {
      this.loadingV = true
      this.dispatch(FETCH_DATA_POOL_BY_TABLE_LIST, {
        PageIndex: this.pageInfo.currentpage,
        PageSize: this.pageInfo.limit,
        Model: {
          GjcID: keywordId, // 关键词ID
          TableID: tableId // 数据表ID
        }
      }).then(r => {
        this.loadingV = false
      })
    },
    openDetailInfo(val) {
      //        console.log('openDetailInfo', val)
    },
    treeClickEvents(data, node, store) {
      this.queryTableList(data.keywordId, data.id)
    },
    treeRenderContent(h, { data, node, store }) {
      let content = h('span', {
        class: { 'cat-tree__item': true, 'cat-tree__item__current': node.id === this.currentItemId },
        on: {
          click: () => {
            if (node.level > 1) { // 根基 无点击事件
              this.treeClickEvents(data, node, store)
            }
          }
        }
      }, [h('i', {
        // class: 'iconfont icon-note'
      }), h('span', {
        class: 'cat-tree__item__label'
      }, data.label), h('span', {
        class: 'cat-tree__item__count',
        style: {
          background: node.id === 1 ? 'transparent' : null
        }
      }, data.count)])
      return content
    }
  },
  watch: {
    'dataPool.fetchDataPoolList' (val) {
      // 左侧菜单树
      if (val) {
        this.treeData = val.map(r => {
          return {
            id: r.ID,
            label: r.Keyword,
            children: r.SjcTableModels.map(rc => {
              return {
                keywordId: r.ID, // 关键字ID
                id: rc.TableID, // 表ID
                label: rc.TableNameCn, // 中文表名
                labelEn: rc.TableName, // 英文表名
                count: rc.Total // 表数据总条数
              }
            })
          }
        })
      }
    },
    'dataPool.fetchDataPoolByTableList' (val) {
      // 内容表格列表数据
      if (val) {
        val.SearchDatas.map(r => {
          this.columns = r.TableInfo.Columns.map(rtc => {
            return {
              id: rtc.ID,
              allowPropertyEvent: false,
              label: rtc.FieldCn,
              prop: rtc.FieldEn,
              type: rtc.DataType
            }
          })
          this.tableList = r.Source
        })
      }
    }
  },
  mounted() {},
  created() {
    this.caseId = this.$route.query.a // 初始化获取案件id
    this.queryTreeMenu()
  }
}
</script>
