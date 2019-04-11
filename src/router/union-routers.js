/**
 * union-routers 合成作战
 */
export default [{
  path: '/union',
  component: resolve => require(['../components/index.vue'], resolve),
  children: [{
    name: '合成作战-概况1',
    path: 'applyStatistics',
    component: resolve => require(['../components/union/applyStatistics/index.vue'], resolve)
  }, {
    name: '合成作战-概况2',
    path: 'acceptStatistics',
    component: resolve => require(['../components/union/acceptStatistics/index.vue'], resolve)
  }, {
    name: '合成作战-统计-督导',
    path: 'supervise-:model',
    component: resolve => require(['../components/union/statistics/index.vue'], resolve)
  }, {
    name: '合成作战-统计-个人',
    path: 'statistics',
    component: resolve => require(['../components/union/statistics/index.vue'], resolve)
  }, {
    name: '合成作战-申请',
    path: 'myApply',
    component: resolve => require(['../components/union/apply/index.vue'], resolve)
  }, {
    name: '合成作战-受理',
    path: 'myAccept',
    component: resolve => require(['../components/union/accept/index.vue'], resolve)
  }, {
    name: '合成作战-审批',
    path: 'myExamine',
    component: resolve => require(['../components/union/examine/index.vue'], resolve)
  }, {
    name: '合成作战-部门模板',
    path: 'template',
    component: resolve => require(['../components/union/template/index.vue'], resolve)
  }, {
    name: '合成作战-协同申请',
    path: 'apply',
    component: resolve => require(['../components/union/unionApply/index.vue'], resolve)
  }, {
    name: '合成作战-协同列表',
    path: 'list',
    component: resolve => require(['../components/union/unionsList/index.vue'], resolve)
  }, {
    name: '合成作战-流程帮助',
    path: 'process',
    component: resolve => require(['../components/union/unionProcess/index.vue'], resolve)
  }]
}]
