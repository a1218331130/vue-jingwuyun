<style lang="scss">
.tree-select {
    position: relative;
    display: inline-block;

    .el-input {
        cursor: pointer;
    }

    .el-autocomplete-suggestion {
        position: absolute;
        z-index: 2003;
        background-color: #fff;
    }

    &__wrap {
        max-height: 260px;
        overflow: auto;
        padding: 6px 0;
        box-sizing: border-box;
        background-color: #fff;
        .el-tree {
            border: none;
        }
    }
    &__btns {
        background-color: #fbfdff;
        border-top: 1px solid #e4e4e4;
        margin-top: 0;
        padding: 0 10px;
        height: 38px;
        line-height: 36px;
    }

    &__btns .el-color-dropdown__btn {
        background-color: #fff;
    }
}
.el-color-dropdown__link-btn,
.el-color-dropdown__link-btn:focus {
    outline: none;
}
</style>

<script>
import Popper from 'element-ui/src/utils/vue-popper'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import Emitter from 'element-ui/src/mixins/emitter'
import TreeSelectBtns from './tree-select-btns.vue'
export default {
  name: 'TreeSelect',
  componentName: 'TreeSelect',
  mixins: [Popper, Emitter],
  components: { TreeSelectBtns },
  directives: { Clickoutside },
  props: {
    tree: { // 树组件参数
      type: Object,
      default() {
        return {}
      }
    },
    input: { // 输入框组件参数
      type: Object,
      default() {
        return {}
      }
    },
    value: [Array, String, Number], // 默认选中树的key，需要配合tree设置 node-key
    formatter: { // 输入框显示文字格式函数
      type: Function,
      default(nodes) {
        return nodes.map(node => {
          return node.text
        }).join(', ')
      }
    },
    multiple: { // 是否允许多选
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isShowPopper: false,
      inputValue: '',
      checked: [],
      dropdownWidth: '',
      count: 0,
      checkedCount: 0,
      tips: '已选 0 条数据'
    }
  },
  methods: {
    updateCount() {
      // 更新合计
      let count = 0
      if(this.$refs.tree) {
        const id = this.tree['node-key'] || 'id',
          nodes = this.$refs.tree.getCheckedNodes()
        count = nodes.map(n => {
          return n[id]
        }).length
      }
      this.checkedCount = count
      this.tips = `已选 ${count} 条数据`
    },
    handleInputFocus() {
      this.isShowPopper = true
    },
    close() {
      this.isShowPopper = false
    },
    handleChange(isSilent) {
      if(this.$refs.tree) {
        const id = (this.tree.props && this.tree.props['node-key']) || this.tree['node-key'] || 'id',
          nodes = this.$refs.tree.getCheckedNodes()
        if(!isSilent) {
          if(this.multiple) {
            const keys = nodes.map(n => {
              return n[id]
            })
            this.$emit('input', keys)
            this.$emit('change', nodes)
          } else {
            this.$emit('input', nodes[0] ? nodes[0][id] : '')
            this.$emit('change', nodes[0] || null)
          }
        } else {
          this.$refs.tree.setCheckedKeys(this.value, true)
        }
        this.inputValue = this.formatter(nodes)
        this.checked = nodes
        this.updateCount()
      }
    },
    handleCurrentChange(data, isCheck) {
      if(!this.multiple) {
        if(isCheck) {
          this.clearChecked()
          this.$refs.tree.setCheckedKeys([data[this.tree['node-key'] || 'id']])
        }
      }
      this.handleConfirm()
    },
    handleConfirm() {
      this.handleChange()
      // this.close()
    },
    clearChecked() {
      if(this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([])
      }
    }
  },
  updated() {
    this.dropdownWidth = this.$refs.input.$refs.input.offsetWidth
    this.handleChange(true)
  },
  render(h) {
    return h('div', {
      'class': 'tree-select',
      directives: [{
        name: 'clickoutside',
        value: this.close
      }]
    }, [
      h('el-input', {
        props: {
          icon: 'caret-bottom',
          ...this.input,
          value: this.tips,
          readonly: true,
          'on-icon-click': this.handleInputFocus
        },
        ref: 'input',
        on: {
          focus: this.handleInputFocus
        }
      }),
      h('transition', {
        props: {
          name: 'el-zoom-in-top'
        }
      }, [
        h('div', {
          'class': 'el-autocomplete-suggestion',
          directives: [{
            name: 'show',
            value: this.isShowPopper
          }],
          style: {
            width: this.dropdownWidth + 'px'
          }
        }, [
          h('el-scrollbar', {
            props: {
              tag: 'div',
              'wrap-class': 'tree-select__wrap'
            }
          }, [
            h('el-tree', {
              props: {
                'check-strictly': !this.multiple,
                ...this.tree,
                'default-checked-keys': Array.isArray(this.value) ? this.value : [this.value]
              },
              on: {
                'check-change': this.handleCurrentChange
              },
              ref: 'tree'
            })
          ]),
          h('tree-select-btns')
        ])
      ])
    ])
  },
  created() {
    // this.$on('confirm', this.handleConfirm)
    this.$on('clear', this.clearChecked)
  }
}
</script>
