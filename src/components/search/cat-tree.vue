<template>
<div class="sidebar--tree">
  <!-- <el-row class="cate">
    <el-col :span="24" class="cate__keyword">
      <el-input v-model="keyword" placeholder="输入关键字进行搜索" icon="search"></el-input>
    </el-col> -->
  <!--<el-col :span="12" :class="'cate__button'+(type===1 ? '&#45;&#45;action' : '')">-->
  <!--<span class="cate__button__span" @click="type=1">按地区</span>-->
  <!--</el-col>-->
  <!--<el-col :span="12" @click="typeChange" :class="'cate__button'+(type===2 ? '&#45;&#45;action' : '')">-->
  <!--<span class="cate__button__span" @click="type=2">按要素</span>-->
  <!--</el-col>-->
  <!-- </el-row> -->
  <el-tree ref="cateTree" v-if="tree.length > 0" :data="tree" node-key="id" :highlight-current="true" :indent="0" :render-content="renderContent" :default-expanded-keys="tree[0]?this.$route.query.type === 'dbcheck'?[tree[0].id]:[tree[0].children[0].id]:[]" :filter-node-method="filterNode"></el-tree>
  <!-- :render-content="renderContent"query -->

  <loader-bar :action="(loadingCat===true&&type===1)||(loadingElm===true&&type===2)"></loader-bar>

</div>
</template>

<style lang="scss" scoped>
  .cate {
    background: #c6e3f7;
    padding: 8px 10px;
    text-align: center;
    &__keyword {
      margin-bottom: 10px;
    }
    &__button {
      background: #fff;
      color: #666;
      height: 24px;
      line-height: 24px;
      border: 1px solid #74b8eb;
      cursor: pointer;
      &__span {
        display: block;
        width: 100%;
        height: 100%;
      }
      &--action {
        @extend .cate__button;
        background: #74b8eb;
        color: #fff;
      }
    }
  }

  .loader--bar {
    background: rgba(255, 255, 255, .8);
    height: calc(100% - 80px);
    top: 80px;
  }

</style>
<!-- 左侧栏树结构样式 -->
<style lang="scss">
  // .sidebar--tree .el-tree {
  //     &::-webkit-scrollbar {
  //         // background: transparent;
  //         width: 8px;
  //         height: 8px;
  //
  //         &-track {
  //             background: red;
  //         }
  //
  //         &-thumb {
  //             background: red; //$borderColor;
  //             border-radius: 8px;
  //         }
  //     }
  // }
  .cat-tree .el-tree.el-tree--highlight-current>.el-tree-node>.el-tree-node__content {
    background: #0179ba;
    height: 50px;
    color: #fff;
    border: 1px solid #0181c5;
    box-sizing: border-box;
    background: url("../../assets/arrow_03.gif") no-repeat 96% center rgba(1, 121, 186, 1);
    .el-tree-node__expand-icon {
      display: none;
    }
    .cat-tree__item__count {
      color: #d3e71f;
      background: transparent;
      position: static;
      transform: translateY(17%);
      padding-left: 30px;
    }
    .tree-root {
      width: 190px;
      font-size: 17px;
      font-weight: 700;
      right: 60px;
    }
  }

  .cat-tree {
    .el-tree-node__content {
      height: 40px;
      color: #ffffff;
      .el-tree-node__expand-icon {
        background: transparent;
        height: 40px;
        line-height: 40px;
        padding-left: 25px;
        left: -16px;
        position: relative;
        border-bottom: 0 solid #115497;
        &:before {
          content: '';
          display: block;
          background: #1770c5;
          width: 9px;
          height: 9px;
          border-radius: 9px;
          border: 1px solid #b4daf5;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 18px;
          z-index: 3;
        }
        &:after {
          content: '';
          display: block;
          background: #b4daf5;
          height: 100%;
          width: 1px;
          position: absolute;
          left: 23px;
          top: 0;
        }
      }
    }
  }

  .cat-tree .cat-tree__item {
    width: 220px;
  }

  .cat-tree__item__current {
    background: #ff6600;
  }

  .cat-tree .el-tree.el-tree--highlight-current>.el-tree-node.is-expanded {
    >.el-tree-node__content {
      background: url("../../assets/arrow_down.gif") no-repeat 96% center rgba(1, 121, 186, 1);
    }
    >.el-tree-node__children {
      box-shadow: inset 0 5px 5px rgba(0, 0, 0, .3);
      >.el-tree-node.is-expanded {
        >.el-tree-node__content {
          background: url("../../assets/arrow_down.gif") no-repeat 96% center rgba(1, 121, 186, 0.5);
        }
        >.el-tree-node__children {
          box-shadow: inset 0 5px 5px rgba(0, 0, 0, .2);
          .el-tree-node.is-current {
            .el-tree-node__content {}
          }
          .cat-tree__item.cat-tree__item__current {
            span.cat-tree__item__label {
              text-indent: 8px;
            }
            span.cat-tree__item__count {
              color: #C0E72D;
            }
          }
        }
      }
      >.el-tree-node {
        >.el-tree-node__content {
          background: url("../../assets/arrow_03.gif") no-repeat 96% center rgba(1, 121, 186, 0.5);
        }
      }
    }
  }

  .cat-tree .el-tree.el-tree--highlight-current>.el-tree-node {
    >.el-tree-node__children {
      >.el-tree-node {
        >.el-tree-node__content {
          font-size: 16px;
          >.cat-tree__item {
            position: static;
            transform: translateY(-121%);
            padding-left: 32px;
            height: 24px;
            >.cat-tree__item__count {
              position: static;
              transform: translateY(16%);
              padding-left: 10px;
            }
          }
        }
        >.el-tree-node__children {
          .el-tree-node {
            .el-tree-node__content {
              height: 40px;
              font-size: 15px;
              .cat-tree__item {
                height: 30px;
                .cat-tree__item__label {
                  height: 30px;
                  line-height: 30px;
                  max-width: 190px;
                }
              }
            }
          }
        }
      }
      >.el-tree-node {
        >.el-tree-node__content {
          background: url("../../assets/arrow_03.gif") no-repeat 96% center rgba(1, 121, 186, 0.5);
        }
      }
    }
  }

  .cat-tree .el-tree .el-tree-node .el-tree-node__content .cat-tree__item.tree-root {
    background: url("../../assets/root-img.gif") no-repeat 10px center;
    >.cat-tree__item__label {
      transform: translateX(20px);
    }
  }

  .cat-tree .el-tree-node__content .el-tree-node__expand-icon.is-leaf {
    &:before {
      background: transparent;
      height: 30px;
      line-height: 30px;
      padding-left: 25px;
      position: absolute;
      left: 0;
      border: none;
      background-image: none;
    }
    &:after {
      content: '';
      display: block;
      background: #b4daf5;
      height: 100%;
      width: 1px;
      position: absolute;
      left: 13px;
      top: 0;
    }
  }

  .cat-tree__item__count {
    background: transparent;
    color: #d3e71f;
    font-size: 12px;
    text-align: center;
    height: 15px;
    line-height: 15px;
    padding: 0 5px;
    display: inline-block;
    position: absolute;
    top: 50%;
    right: 6px;
    transform: translateY(-50%);
  }

  .el-tree-node:nth-last-child(1)>.el-tree-node__content {
    .el-tree-node__expand-icon.is-leaf {
      background-image: none;
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  //  import { SEARCH_ELM_TREE, SYNC_SEARCH } from '../../store/types'
  import { SYNC_SEARCH, GET_TABLE_LIST_TREE } from '../../store/types'
  import mixin from '../../utils/mixin'
  import { clone } from '../../utils/util'
  import { get } from '../../utils/storage'
  // import { listToTree } from '../../utils/listToTree'
  import loaderBar from '../../widgets/loader/loader-bar.vue'
  import socketIO from '../../utils/socket-io'

  // 取聚类树
  //  function getElmTree (self, elmQuery) {
  //    elmQuery.IsSearchAggregations = true
  //    self.dispatch(SEARCH_ELM_TREE, elmQuery).then(() => {
  //      if (!self.search.searchElmTree.Aggregations) return
  //      self.elmTree = self.search.searchElmTree.Aggregations.map(c => {
  //        return {
  //          label: c.Name,
  //          id: c.ID,
  //          children: c.AggsBuckets.map((cc, i) => {
  //            return {
  //              type: c.ID,
  //              label: cc.Key,
  //              id: c.ID + '_' + i,
  //              count: cc.Total
  //            }
  //          })
  //        }
  //      })
  //      self.loadingElm = false
  //    })
  //  }
  //
  //  function updateCateTree (self, data) {
  //    let total = 0
  //    self.cateTree[0].children = data.map(d => {
  //      total += d.Total
  //      return {
  //        label: d.TableInfo.ZyName,
  //        id: d.TableInfo.ID,
  //        columns: d.TableInfo.Columns,
  //        count: d.Total,
  //        parent: d.TableInfo.FlName,
  //        parentId: d.TableInfo.FlID,
  //        authority: d.HasQx
  //      }
  //    })
  //    self.cateTree[0].count = total
  //    self.loadingCat = false
  //  }
  function objectArrSort(keyNames) {
    let k1 = keyNames.split(',')[0]
    let k2 = keyNames.split(',')[1]
    return function(objectN, objectM) {
      let valN = objectN[k1].toString() + objectN[k2].toString()
      let valM = objectM[k1].toString() + objectM[k2].toString()
      if (valN === valM) return 0
      if (valN > valM) return 1
      return -1
    }
  }

  function addCateTreeItem(self, items, time) {
    let root = self.cateTree[0].children
    // var arrCat = '';
    items.forEach(item => {
      let hasItem = false
      // alert(item.Total);
      if (item.Total > 0) {
        root.forEach(n => {
          if (n.id === item.TableInfo.YsYjfldm) {
            hasItem = true
            if (!n.children) {
              n.children = []
            }
            n.children.push({
              label: item.TableInfo.ZyName,
              id: item.TableInfo.ID,
              columns: item.TableInfo.Columns,
              count: item.Total,
              parent: item.TableInfo.YsYjfldmMc,
              parentId: item.TableInfo.YsYjfldm,
              authority: item.HasQx,
              time: time,
              sx: item.TableInfo.Sx
            })
            n.count += item.Total
          }
        })
        if (!hasItem) {
          // if(arrCat.indexOf(item.TableInfo.YsYjfldmMc) > 0) {
          //   return;
          // }
          // arrCat = arrCat + item.TableInfo.YsYjfldmMc;
          // console.log(arrCat, 'arrCatarrCatarrCatarrCat');
          root.push({
            label: item.TableInfo.YsYjfldmMc,
            id: item.TableInfo.YsYjfldm,
            count: item.Total,
            sx: item.TableInfo.YwflSx,
            children: [{
              label: item.TableInfo.ZyName,
              id: item.TableInfo.ID,
              columns: item.TableInfo.Columns,
              count: item.Total,
              parent: item.TableInfo.YsYjfldmMc,
              parentId: item.TableInfo.YsYjfldm,
              authority: item.HasQx,
              time: time,
              sx: item.TableInfo.Sx
            }]
          })
        }
        self.cateTree[0].count += item.Total
      }
    })
    root.sort(objectArrSort('sx,label'))
    root.forEach(n => {
      n.children.sort(objectArrSort('sx,label'))
    })
  }

  export default {
    mixins: [mixin, socketIO],
    components: {
      'loader-bar': loaderBar
    },
    data() {
      return {
        loadingCat: false,
        loadingElm: false,
        keyword: '',
        type: 1,
        num: 0,
        transLabel: null,
        currentItemId: null,
        currentItem: null,
        elmTree: [],
        cateTree: [{
          label: '怀化市',
          id: '1',
          count: 0,
          children: []
        }],
        cateQuery: null,
        elmQuery: null,
        loaded: false
      }
    },
    props: ['query'],
    computed: {
      tree() {
        return this.type === 2 ? this.elmTree : this.cateTree
      },
      ...mapState(['search', 'socketConnect'])
    },
    watch: {
      query: {
        handler() {
          this.waitForSocket()
        },
        deep: true
      },
      type() {
        this.keyword = ''
      },
      keyword(val) {
        this.$refs.cateTree.filter(val, '1111111111111')
      }
    },
    methods: {
      waitForSocket() {
        if (this.socketConnect.socketConnected) {
          this.fetchTree();
        } else {
          setTimeout(() => {
            this.waitForSocket()
          }, 100)
        }
      },
      fetchTree() {
        this.elmQuery = clone(this.query)
        if (this.query !== null) {
          let cateQuery = clone(this.query),
            staticData = get('ngw_search_catTreeData_' + this.$route.query.key)
          cateQuery.NotifyID = new Date().getTime().toString()
          this.loadingCat = true
          this.loadingElm = true
          // 取表树
          cateQuery.IsSearchAggregations = false
          this.cateQuery = cateQuery
          if (!staticData) {
            this.dispatch(SYNC_SEARCH, cateQuery).then(() => {
              this.$emit('update:keywords', [...this.search.SyncSearch.Words])
              const searchWord = this.search.SyncSearch.SearchWord
              if (searchWord) {
                this.$emit('on-match-keyword', searchWord.KeywordType, searchWord.Word, { HasQx: true })
              }
            })
          } else {
            staticData.forEach(d => {
              addCateTreeItem(this, [d], 0)
            })
            this.loadingCat = false
          }
        }
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      typeChange() {},
      clickEvents(data, node, store) {
        if (data.id === '1') return false
        let staticData = get('ngw_search_catTreeData')
        if (node.isLeaf === true) {
          if (data.authority === false) {
            this.$alert('你没有权限查询该表数据, 请联系管理员开通.', '温馨提示');
          } else if (this.currentItemId === data.id) {
            return false
          } else {
            this.currentItemId = data.id
            this.currentItem = {
              data: data,
              limit: !staticData ? (this.search.SyncSearch ? this.search.SyncSearch.PageSize : 20) : staticData.PageSize,
              type: this.type
            }
            this.$emit('update:value', this.currentItem)
          }
        } else {
          return false
        }
      },
      triggerLoad(data, time) {
        if (this.loaded || !data) return
        if (data.authority !== false) {
          this.currentItem = {
            data: data,
            limit: 20,
            type: this.type,
            time: time,
            fromTrigger: true
          }
          this.$emit('update:value', this.currentItem)
          this.loaded = true
        }
      },
      renderContent(h, { data, node, store }) {
        let content = h('span', {
          class: {
            'cat-tree__item': true, 'cat-tree__item__current': data.id === this.currentItemId, 'tree-root': node.level === 1
          },
          on: {
            click: () => {
              this.clickEvents(data, node, store)
            }
          }
        }, [h('i', {
          // class: 'iconfont icon-note'
        }), h('span', {
          class: 'cat-tree__item__label',
          attrs: { title: data.label }
        }, data.label), h('span', {
          class: 'cat-tree__item__count'
        }, data.count)])
        return content
      },
      setSocketListener(fn) {
        if (this.socketConnect.socketConnected) {
          fn();
        } else {
          setTimeout(() => {
            this.setSocketListener(fn);
          }, 100);
        }
      }
    },
    created() {},
    mounted() {
      if (this.$route.query.type === 'dbcheck') {
        this.dispatch(GET_TABLE_LIST_TREE).then(() => {
          this.cateTree = [{ label: '怀化市', id: '1', children: [] }]
          this.cateTree[0].children = [{
            label: '人员',
            id: '2',
            children: []
          }, {
            label: '活动',
            id: '3',
            children: []
          }, {
            label: '案事件',
            id: '4',
            children: []
          }, {
            label: '物品',
            id: '5',
            children: []
          }, {
            label: '组织',
            id: '6',
            children: []
          }, {
            label: '地址',
            id: '7',
            children: []
          }, {
            label: '其他',
            id: '8',
            children: []
          }]
          let count = 0;
          this.search.getTableListTree.map((item, idx) => {
            this.cateTree[0].children.map((item1, idx1) => {
              if (item.sjlxfl === item1.label) {
                item1.children = item.tableList.filter(item2 => {
                  return item2.sfjs !== '0'
                });
                item1.count = item1.children.length
                count += item1.children.length
              }
            })
          })
          this.cateTree[0].count = count
          this.cateTree[0].children.map((item, idx) => {
            if (item.children.length <= 0) {
              this.cateTree[0].children.splice(idx--, 1)
            }
          })
          this.cateTree[0].children.map(item => {
            item.children.map(item1 => {
              item1.id = item1.mlbh;
              item1.label = item1.mlm
            })
          })
          // this.currentItemId = this.cateTree[0].children[0].children[0].id
          // this.$emit('update:value', { data: this.cateTree[0].children[0].children[0], limit: 20, type: 1 })
        })
      } else {
        this.setSocketListener(() => {
          this.$connect.on('SearchProcess', (res) => {
            if (this.cateQuery && this.cateQuery.NotifyID === res.SearchEntity.NotifyID && res.Total > 0) {
              this.loadingCat = false;
              addCateTreeItem(this, res.SearchDatas, res.UseMilliesecond);
              this.currentItemId = this.tree[0].children[0].children[0].id
              setTimeout(() => {
                this.triggerLoad(this.tree[0].children[0].children[0], this.tree[0].children[0].children[0].time)
              }, 1000)
            }
          });
          this.$connect.on('SearchProcessed', (res) => {
            if (this.cateQuery && this.cateQuery.NotifyID === res.SearchEntity.NotifyID) {
              this.loadingCat = false
            }
          })
        })
      }
    }
  }

</script>
