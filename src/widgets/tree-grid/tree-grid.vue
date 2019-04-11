<style>
  .tree-grid__header {
    display: block;
  }

  .tree-grid .el-tree-node__expand-icon,
  .tree-grid .el-checkbox,
  .tree-grid__table,
  .tree-grid__column,
  .tree-grid__header-column {
    display: inline-block;
  }

  .tree-grid__header {
    background-color: #eef1f6;
    border: 1px solid #dfe6ec;
    border-bottom: none;
    height: 40px;
    overflow: hidden;;
  }

  .tree-grid__header-column {
    height: 40px;
    line-height: 40px;
    font-weight: bold;
    color: #1f2d3d;
    border-right: 1px solid #dfe6ec;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: keep-all;
    border-collapse: collapse;
  }

  .tree-grid__header-column:last-child {
    border-right: none;
    width: 20px;
  }

  .tree-grid__header-column span {
    padding: 0 18px;
  }

  .tree-grid .el-tree-node__content {
    border-bottom: 1px solid #dfe6ec;
    height: 40px;
    line-height: 40px;
  }

  .tree-grid__column > span {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: keep-all;
    line-height: 24px;
    padding-left: 15px;
    padding-right: 15px;
  }

  .tree-grid__column:first-child > span {
    padding-left: 0 !important;
  }

  .tree-grid__column {
    border-right: 1px solid #dfe6ec;
  }

  .tree-grid__column:last-child {
    border-right: none;
  }

  .tree-grid .el-tree {
    border-bottom: none;
  }
</style>

<script>
  const BORDER_WIDTH = 1
  const ARROW_WIDTH = 25
  const CHECKBOX_WIDTH = 26
  export default {
    name: 'TreeGrid',
    props: {
      tree: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        columns: []
      }
    },
    methods: {
      getTableWidth() {
        // 判断是否有checkbox
        if (this.tree && !!this.tree['show-checkbox']) {
          return `calc(100% - ${CHECKBOX_WIDTH + ARROW_WIDTH}px)`
        } else {
          return `calc(100% - ${ARROW_WIDTH}px)`
        }
      },
      getColumnsWidth(level) {
        // 没有设置宽度的列总数
        const noWidthCount = this.columns.filter(n => !n.width).length
        // 已分配了多少像素宽度
        let assignedWidthPx = 0
        // 已分配了百分比宽度
        let assignedWidthPercent = 0

        // 当前层级缩进的宽度
        let indent = (level - 1) * (this.tree.indent || 16)

        // 计算已分配了多少宽度
        this.columns.forEach(n => {
          if (n.width) {
            if (typeof n.width === 'number' || n.width.includes('px')) {
              assignedWidthPx += (Number.parseInt(n.width) + BORDER_WIDTH)
            } else if (n.width.includes('%')) {
              assignedWidthPercent += (Number.parseInt(n.width) + BORDER_WIDTH)
            }
          }
        })
        // 计算每列应该展示的宽度
        return this.columns.map((column, index) => {
          // 如果属性指定了宽度
          if (column.width) {
            // 第一列需要减去树层级缩进的宽度
            if (index === 0) {
              return `calc(${column.width} - ${indent}px )`
            } else {
              return column.width
            }
          } else {
            // 如果列没有制定宽度，没宽度的列平均分配剩余的宽度，第一列需要减去树层级缩进的宽度
            if (index === 0) {
              return `calc((100% - ${assignedWidthPercent}% - ${(assignedWidthPx - indent)}px) / ${noWidthCount} -  ${indent}px)`
            } else {
              return `calc((100% - ${assignedWidthPercent}% - ${(assignedWidthPx - indent)}px) / ${noWidthCount})`
            }
          }
        })
      },
      getHeaderWidth() {
        // 没有设置宽度的列总数
        const noWidthCount = this.columns.filter(n => !n.width).length
        // 已分配了多少像素宽度
        let assignedWidthPx = 0
        // 已分配了百分比宽度
        let assignedWidthPercent = 0
        // 计算已分配了多少宽度
        this.columns.forEach(n => {
          if (n.width) {
            if (typeof n.width === 'number' || n.width.includes('px')) {
              assignedWidthPx += (Number.parseInt(n.width) + BORDER_WIDTH)
            } else if (n.width.includes('%')) {
              assignedWidthPercent += (Number.parseInt(n.width) + BORDER_WIDTH)
            }
          }
        })
        // 是否有checkbox的偏移值
        let diff = CHECKBOX_WIDTH
        // 有checkbox，加上checkbox占用得宽度
        if (this.tree && !!this.tree['show-checkbox']) {
          assignedWidthPx += (CHECKBOX_WIDTH + ARROW_WIDTH)
        } else {
          assignedWidthPx += ARROW_WIDTH
          diff = 0
        }
        // 计算每列应该展示的宽度
        return this.columns.map((column, index) => {
          // 有制定宽度
          if (column.width) {
            if (index === 0) {
              // 第一列需要加上箭头和checkbox占用的宽度
              return `calc(${column.width} + ${diff + ARROW_WIDTH}px)`
            } else {
              // 最后一列需要减去每列的边框线宽度
              if (index === this.columns.length - 1) {
                return `calc(${column.width} - ${this.columns.length}px)`
              } else {
                return `calc(${column.width})`
              }
            }
          } else {
            if (index === 0) {
              // 第一列需要加上箭头和checkbox占用的宽度
              return `calc((100% - ${assignedWidthPercent}% - ${(assignedWidthPx)}px) / ${noWidthCount} + ${diff + ARROW_WIDTH}px)`
            } else {
              if (index === this.columns.length - 1) {
                // 最后一列需要减去每列的边框线宽度
                return `calc((100% - ${assignedWidthPercent}% - ${(assignedWidthPx)}px) / ${noWidthCount} - ${this.columns.length}px)`
              } else {
                return `calc((100% - ${assignedWidthPercent}% - ${(assignedWidthPx)}px) / ${noWidthCount})`
              }
            }
          }
        })
      },
      renderContent(h, {node}) {
        let widthArray = this.getColumnsWidth(node.level)
        const columns = this.columns.map((column, index) => {
          return column.renderCell.call(this._renderProxy, h, {node}, widthArray[index])
        })
        return h('span', {
          'class': 'tree-grid__table',
          style: {
            width: this.getTableWidth(node.level)
          }
        }, columns)
      },
      renderHeader(h) {
        let widthArray = this.getHeaderWidth(1)
        const headers = this.columns.map((column, index) => {
          return h('span', {
            'class': 'tree-grid__header-column',
            style: {
              width: widthArray[index]
            }
          }, [h('span', null, column.label || '')])
        })
        return h('div', {
          'class': 'tree-grid__header'
        }, headers)
      }
    },
    render(h) {
      return h('div', {
        'class': 'tree-grid'
      }, [
        this.renderHeader(h),
        h('el-tree', {
          props: {
            ...this.tree,
            'render-content': (h, data) => this.renderContent(h, data)
          },
          ref: 'tree'
        }),
        h('div', {
          'class': 'hidden-columns'
        }, this.$slots.default)
      ])
    }
  }
</script>
