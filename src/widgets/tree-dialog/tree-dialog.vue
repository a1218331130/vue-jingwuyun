<template>
  <div class="tree-dialog">
    <el-button @click="handleClick" :loading="isLoading" class="tree-dialog-btn">
      <slot>选择</slot>
    </el-button>
    <!-- <div class="treeBox">
      <span class="tree-dialog-tags">{{dictName}}</span>
      <i class="el-icon-menu" @click="handleClick"></i>
    </div> -->
    <div class="tree-dialog-tags-box" v-if="checkedNodes.length > 0 && !onlyShowCount">
      <div :class="showAllTags===true?'tree-dialog-tags--long':'tree-dialog-tags'">
        <el-tag v-for="item in checkedNodes.filter(c=>c.id!==''&&c.label!=='')" type="primary"
                :key="item[defaultProps.id]">{{item[defaultProps.label]}}
        </el-tag>
      </div>
      <div class="tree-dialog-more" @click="switchTagsMode">
        <i :class="showAllTags===true?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
        <span>{{showAllTags === true ? '收起' : '查看全部'}}</span>
      </div>
    </div>
    <span class="tree-dialog-tags-box--empty" v-else-if="checkedNodes.length > 0 && onlyShowCount">已选择<b>{{checkedNodes.length}}</b>个菜单</span>
    <span class="tree-dialog-tags-box--empty" v-else>暂未选择任何数据</span>

    <el-dialog :visible.sync="dialogVisible" :size="dialogSize" :modal="false" :title="title"
               :modal-append-to-body="true" :append-to-body="true" class="tree-dialog-dialog" @open="initDialog">
      <el-input v-model="keyword" placeholder="关键字筛选"></el-input>
      <el-tree :data="data" :props="defaultProps" show-checkbox :node-key="defaultProps.id" ref="tree"
               :expand-on-click-node="false" :default-checked-keys="defaultNodes" :check-strictly="true"
               :filter-node-method="filterNode" class="tree-dialog-tree" :render-content="renderContent"></el-tree>
      <div slot="footer">
        <el-button type="primary" @click="handleOK">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
  .tree-dialog-tags-box {
    .tree-dialog-tags {
      max-height: 100px;
      overflow: hidden;
      .el-tag {
        margin: 0 5px;
      }
      &--long {
        max-height: 200px;
        overflow-y: auto;
      }
    }
    .tree-dialog-more {
      font-size: 12px;
      text-align: center;
      margin-top: 5px;
      transition: .2s;
      border: 1px solid #eaeefb;
      border-radius: 0 0 4px 4px;
      position: relative;
      cursor: pointer;
      span {
        display: none;
      }
      &:hover {
        background: #eaeefb;
        color: #20a0ff;
        span {
          display: inline;
        }
      }
    }
    &--empty {
      text-align: center;
      margin: 10px 0
    }
  }

  .float-right {
    float: right;
    margin-right: 20px;
  }
</style>
<style>
  .tree-dialog .el-tree.tree-dialog-tree {
    max-height: 250px;
    overflow: auto;
  }

  .el-dialog__body .el-tree {
    min-height: 100px;
  }

  /*.treeBox {
    overflow: hidden;
    position: relative;
    width: calc(100% - 50px);
    white-space: nowrap;
    text-overflow: ellipsis;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    color: #1f2d3d;
    font-size: inherit;
    height: 36px;
    line-height: 36px;
    outline: 0;
    padding: 0px 40px 0px 10px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  }*/

  .el-dialog--tiny {
    min-width: 400px;
    width: 50%;
  }

  .el-icon-menu {
    position: absolute;
    top: 11px;
    right: 10px;
  }
</style>
<script>
  export default {
    data: function () {
      return {
        dialogVisible: false,
        isLoading: false,
        keyword: '',
        checkedNodes: [],
        showAllTags: false
        // ,
        // dictName: ''
      }
    },
    props: {
      title: {
        type: String,
        default: '请选择'
      },
      onlyShowCount: {
        type: Boolean,
        default: false
      },
      data: Array,
      value: Array,
      defaultProps: {
        children: 'children',
        label: 'label',
        id: 'id'
      }
    },
    computed: {
      dialogSize() {
        return this.dialogsize || 'tiny'
      },
      checkedKeys() {
        return this.checkedNodes.map(item => item.id);
      },
      defaultNodes() {
        return this.value.map(item => item[this.defaultProps.id]);
      }
    },
    watch: {
      value() {
        this.checkedNodes = this.value;
      },
      keyword(val) {
        if (this.data && this.data.length > 0) {
          this.$refs.tree.filter(val)
        }
        this.$refs.tree.filter(val)
      }
    },
    methods: {
      initDialog() {
        this.showAllTags = false
      },
      filterNode(value, data) {
        if (!value) {
          return true
        } else {
          return data.label.indexOf(value) !== -1
        }
      },
      checkAll(store, data, rev) {
        let self = this,
          id = data[self.defaultProps.id],
          targets = data[self.defaultProps.children].map(c => c[self.defaultProps.id]),
          checker,
          checkedKeys = this.$refs.tree.getCheckedKeys()
        targets.push(id)
        checker = checkedKeys.filter(c => {
          return targets.find(d => {
            return d === c
          })
        })

        if (rev === true) {
          // 反选
          targets.forEach(t => {
            let c = checker.find(d => {
              return d !== t
            })
            if (!c) {
              this.$refs.tree.setChecked(t, true)
            } else {
              this.$refs.tree.setChecked(c, false)
            }
          })
        } else {
          // 全选
          this.$refs.tree.setChecked(id, checker.length !== targets.length, true)
        }
      },
      renderContent(h, {
        node,
        data,
        store
      }) {
        var self = this,
          nodeContent,
          buttonBox = '',
          buttonAll = ''
        //   buttonRev = ''
        if (node.isLeaf === false) {
          buttonAll = h('el-button', {
            props: {
              size: 'mini'
            },
            on: {
              click() {
                self.checkAll(store, data)
              }
            }
          }, '全选')

          //   buttonRev = h('el-button', {
          //     props: {
          //       size: 'mini'
          //     },
          //     on: {
          //       click() {
          //         self.checkAll(store, data, true)
          //       }
          //     }
          //   }, '反选')
          buttonBox = h('span', {
            class: 'float-right'
          }, [buttonAll])
        }
        nodeContent = h('span', {
          key: data[self.defaultProps.id]
        }, [node.label, buttonBox])
        return nodeContent;
      },
      switchTagsMode() {
        this.showAllTags = this.showAllTags === false || false
      },
      handleClick() {
        this.isLoading = true;
        this.dialogVisible = true;
        console.log('this.dialogVisible====', this.dialogVisible);
        if (this.dialogVisible) {
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
        }
      },
      handleOK() {
        this.checkedNodes = this.$refs.tree.getCheckedNodes();
        // const dictNameList = this.checkedNodes.map(item => item.dictName);
        // this.dictName = dictNameList.join(',');
        this.$emit('check-change', this.checkedNodes);
        this.dialogVisible = false;
      }
    },
    mounted: function () {
    }
  }
</script>
