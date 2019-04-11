/**
 * Demo 组件路由配置, 正式发布可以删除
 */
export default [
  {
    path: '/echarts',
    component: resolve => require(['../components/demo/echarts.vue'], resolve)
  }, {
    path: '/gojs',
    component: resolve => require(['../components/demo/gojs.vue'], resolve)
  }, {
    path: '/gojs2',
    component: resolve => require(['../components/demo/gojs2.vue'], resolve)
  }, {
    path: '/upload',
    component: resolve => require(['../components/demo/upload.vue'], resolve)
  }, {
    path: '/editor',
    component: resolve => require(['../components/demo/editor.vue'], resolve)
  }, {
    path: '/tree',
    component: resolve => require(['../components/demo/tree.vue'], resolve)
  }, {
    path: '/basic',
    component: resolve => require(['../components/demo/basic.vue'], resolve)
  }
]
