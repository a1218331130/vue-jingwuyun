/**
 * dossier-routers 档案管理路由
 */
export default [{
  path: '/dossier',
  component: resolve => require(['../components/dossier/index.vue'], resolve),
  children: [{
    path: '',
    component: resolve => require(['../components/dossier/welcome.vue'], resolve)
  }, {
    name: '人员档案',
    path: '/dossier/people',
    component: resolve => require(['../components/dossier/people/index.vue'], resolve)
  }, {
    name: '车辆档案',
    path: '/dossier/car',
    component: resolve => require(['../components/dossier/car/index.vue'], resolve)
  }]
}]
