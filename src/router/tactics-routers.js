/**
 * tactics-routers 战法市场
 */
export default [{
  path: '/tactics',
  component: resolve => require(['../components/index.vue'], resolve),
  children: [{
    path: '',
    redirect: 'statistics'
  }, {
    name: '战法市场-概况',
    path: 'statistics',
    component: resolve => require(['../components/tactics/statistics/index.vue'], resolve)
  }, {
    name: '战法市场-战法库',
    path: 'warehouse',
    component: resolve => require(['../components/tactics/warehouse/index.vue'], resolve)
  }, {
    name: '战法市场-收藏列表',
    path: 'collectionList',
    component: resolve => require(['../components/tactics/warehouse/collectionList.vue'], resolve)
  }, {
    name: '战法市场-战法贡献排行榜',
    path: 'ranking',
    component: resolve => require(['../components/tactics/ranking/index.vue'], resolve)
  }]
}, {
  name: '战法市场-应用-新',
  path: '/tactics/apply-new',
  component: resolve => require(['../components/tactics/apply20171121/index.vue'], resolve)
}, {
  name: '战法市场-应用',
  path: '/tactics/apply',
  component: resolve => require(['../components/tactics/apply/index.vue'], resolve)
}]
