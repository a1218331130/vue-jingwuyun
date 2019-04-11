<template>
  <div>
    <el-input
      placeholder="输入关键字查询"
      v-model="filterText"
      v-if="searchOf"
    >
    </el-input>
    <el-tree
      class="filter-tree"
      :data="treeData"
      :load="loadNode"
      lazy
      :props="defaultProps"
      :filter-node-method="filterNode"
      :highlight-current="true"
      ref="treeList"
      @current-change="currentChange"
    >
    </el-tree>
  </div>
</template>
<style scoped>
  .filter-tree {
    margin-top: 15px;
    border: none;
  }
</style>
<script>
  /**
   *  【树状结构单选组件】 组件调用方法
   *   <tree-on :treeData="dictData" :defaultProps="defaultProps" @onSelectNode="onSelectNode"></tree-on>
   *   dictData：tree 数据  结构 数组对象[{},{}]
   *   defaultProps: tree 数据配置选项 {}
   *   onSelectNode: tree 当前选中节点变化回调方法  响应数据为：当前选中节点 Node 对象
   */
  export default {
    data() {
      return {
        filterText: '',
        onSelectNode: ''
      }
    },
    props: {
      treeData: Array,
      loadNode: {
        type: Function,
        default: (node, resolve) => {
          return resolve([])
        }
      },
      searchOf: {
        type: Boolean,
        default: true
      }, // 是否显示筛选框，默认为true
      defaultProps: {
        id: 'id',
        label: 'label',
        children: 'children'
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      currentChange(data, node) {
        this.onSelectNode = node
      }
    },
    watch: {
      filterText(val) {
        this.$refs.treeList.filter(val)
      },
      onSelectNode(val) {
        // todo:返回当前选择节点数据
        this.$emit('onSelectNode', val)
      }
    }
  }
</script>
