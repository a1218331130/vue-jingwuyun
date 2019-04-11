/**
 * process-routers 流程管理路由
 */
export default [{
  path: '/system',
  component: resolve => require(['../components/index.vue'], resolve),
  children: [{
    name: '流程业务管理',
    path: '/system/processBus',
    component: resolve => require(['../components/process/process-bus.vue'], resolve)
  }, {
    name: '流程图管理',
    path: '/system/processFlowchart',
    component: resolve => require(['../components/process/process-flowchart.vue'], resolve)
  }]
}]
