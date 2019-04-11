/**
 * system-routers 案件管理路由
 */
export default [{
  path: '/case',
  component: resolve => require(['../components/case/index.vue'], resolve),
  children: [{
    path: '',
    redirect: 'judge'
    // component: resolve => require(['../components/case/welcome.vue'], resolve)
  }, {
    name: '基础信息管理',
    path: 'base',
    component: resolve => require(['../components/case/base/index.vue'], resolve),
    meta: {
      keepAlive: true
    }
  }, {
    name: '资料夹',
    path: 'files',
    component: resolve => require(['../components/case/files/index.vue'], resolve),
    meta: {
      keepAlive: true
    }
  }, {
    name: '侦查导图',
    path: 'brainmap',
    component: resolve => require(['../components/case/brainMap/index.vue'], resolve),
    meta: {
      keepAlive: true
    }
  }, {
    name: '线索信息',
    path: 'clues',
    component: resolve => require(['../components/case/clues/index.vue'], resolve),
    meta: {
      keepAlive: true
    }
  }, {
    name: '智能推送',
    path: 'push',
    component: resolve => require(['../components/case/push/index.vue'], resolve),
    meta: {
      keepAlive: true
    }
  }, {
    name: '研判档案',
    path: 'dossier',
    component: resolve => require(['../components/case/dossier/index.vue'], resolve),
    meta: {
      keepAlive: true
    }
  }, {
    name: '研判报告',
    path: 'report',
    component: resolve => require(['../components/case/report2/index.vue'], resolve),
    meta: {
      keepAlive: true
    }
  }, {
    name: '办案人员',
    path: 'casePersonnel',
    component: resolve => require(['../components/case/casePersonnel/index.vue'], resolve),
    meta: {
      keepAlive: true
    }
  }, {
    name: '串案管理',
    path: 'onCase',
    component: resolve => require(['../components/case/onCase/index.vue'], resolve),
    meta: {
      keepAlive: true
    }
  }]
}, {
  path: '/case/judge',
  component: resolve => require(['../components/judge/index.vue'], resolve),
  children: [{
    path: '',
    redirect: 'statistics',
    meta: {
      keepAlive: true
    }
  }, {
    name: '案件管理',
    path: 'statistics',
    component: resolve => require(['../components/judge/statistics/index.vue'], resolve),
    meta: {
      keepAlive: true
    }
  }, {
    name: '案件管理-列表',
    path: 'list',
    component: resolve => require(['../components/judge/list/index.vue'], resolve),
    meta: {
      keepAlive: true
    }
  }]
}]
