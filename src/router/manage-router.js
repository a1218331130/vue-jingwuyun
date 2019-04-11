/**
 * controlManage-routers布控管理
 */
export default [{
  path: '/controlManage',
  component: resolve => require(['../components/index.vue'], resolve),
  children: [{
    path: '',
    redirect: 'statistics'
  }, {
    name: '布控管理-图表',
    path: 'statistics',
    component: resolve => require(['../components/controlManage/statistics/index.vue'], resolve)
  }, {
    name: '布控管理-申请',
    path: 'apply',
    component: resolve => require(['../components/controlManage/apply/index.vue'], resolve)
  }, {
    name: '策略布控-列表',
    path: 'tacticsApply',
    component: resolve => require(['../components/controlManage/tacticsApply/index.vue'], resolve)
  }, {
    name: '布控管理-审批',
    path: 'examine',
    component: resolve => require(['../components/controlManage/examine/index.vue'], resolve)
  }, {
    name: '预警管理-列表',
    path: 'warningManage',
    component: resolve => require(['../components/controlManage/warningManage/index.vue'], resolve)
  }, {
    name: '车辆布控-列表',
    path: 'carControl',
    component: resolve => require(['../components/controlManage/carControl/index.vue'], resolve)
  }]
}, {
  name: '策略布控-详情',
  path: '/controlManage/tacticsApplyDetail/:id/:lastRunTime',
  component: resolve => require(['../components/controlManage/tacticsApply/detail.vue'], resolve)
}]
//  {
//    name: '车辆布控-列表',
//    path: 'carControl',
//    component: resolve => require(['../components/controlManage/carControl/index.vue'], resolve)
//  },
