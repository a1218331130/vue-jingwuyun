import Vue from 'vue'
import Panel from './panel'
import Layout from './layout'
import TreeGrid from './tree-grid'
import TreeSelect from './tree-select'
Vue.use(Panel)
Vue.use(Layout.Layout)
Vue.use(Layout.Region)
Vue.use(TreeGrid.TreeGrid)
Vue.use(TreeGrid.TreeGridColumn)
Vue.use(TreeSelect)
export default {
  Panel,
  Layout,
  TreeGrid,
  TreeSelect
}
