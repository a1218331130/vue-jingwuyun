/**
 * talent-pool-routers 人才库
 */
export default [{
  path: '/talentPool',
  component: resolve => require(['../components/index.vue'], resolve),
  children: [{
    path: '',
    redirect: 'statistics'
  }, {
    name: '人才库-概况',
    path: 'statistics',
    component: resolve => require(['../components/talentPool/statistics/index.vue'], resolve)
  }, {
    name: '人才库-列表',
    path: 'list',
    component: resolve => require(['../components/talentPool/list/index.vue'], resolve)
  }]
}, {
  name: '人才库-详细档案',
  path: '/talentPool/detail',
  component: resolve => require(['../components/talentPool/detail/index.vue'], resolve)
}]
