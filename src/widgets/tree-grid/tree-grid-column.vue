
<script>

  export default {
    name: 'TreeGridColumn',
    props: {
      prop: String, // 绑定数据字段名称
      label: String, // 列的标题
      width: String // 列宽度
    },
    render(h) {
      return h('div')
    },
    created() {
      let _self = this
      /**
       * 渲染列函数
       * @param h
       * @param node 节点数据
       * @param width 列宽度
       * @returns {*}
       */
      this.renderCell = function (h, {node}, width) {
        // 有作用域插槽，按插槽模板渲染
        if (_self.$scopedSlots.default) {
          return h('span', {
            'class': 'tree-grid__column',
            style: {
              width: width
            }
          }, [h('span', null, _self.$scopedSlots.default({node}))])
          // 如果制定字段名称，读取字段的数据渲染
        } else if (_self.prop) {
          return h('span', {
            'class': 'tree-grid__column',
            style: {
              width: width
            }
          }, [h('span', null, node.data[_self.prop] || '')])
        }
      }
      // 在父组件记录列组件实例
      this.$parent.columns.push(this)
    }
  }
</script>
