import TreeGrid from './tree-grid.vue'
import TreeGridColumn from './tree-grid-column.vue'

TreeGrid.install = function (Vue) {
  Vue.component(TreeGrid.name, TreeGrid)
}
TreeGridColumn.install = function (Vue) {
  Vue.component(TreeGridColumn.name, TreeGridColumn)
}

export default {TreeGrid, TreeGridColumn}
