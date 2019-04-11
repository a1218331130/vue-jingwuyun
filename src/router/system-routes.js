/**
 * system-routers 系统管理面板路由
 */
export default [{
  path: '/system',
  component: resolve => require(['../components/index.vue'], resolve),
  children: [{
    path: '',
    component: resolve => require(['../components/welcome.vue'], resolve)
  }, {
    name: '通知通告',
    path: '/system/notice',
    component: resolve => require(['../components/system/notice.vue'], resolve)
  }, {
    name: '知识模板',
    path: '/system/knowTemplate',
    component: resolve => require(['../components/system/knowTemplate.vue'], resolve)
  }, {
    name: '知识分类',
    path: '/system/knowCate',
    component: resolve => require(['../components/system/knowCate.vue'], resolve)
  }, {
    name: '服务总线',
    path: '/system/serviceBus',
    component: resolve => require(['../components/system/service-bus.vue'], resolve)
  }, {
    name: '菜单管理',
    path: '/system/menus',
    component: resolve => require(['../components/system/menus/index.vue'], resolve)
  }, {
    name: '菜单树管理',
    path: '/system/menuTree',
    component: resolve => require(['../components/system/menus/menuTree.vue'], resolve)
  }, {
    name: '系统日志',
    path: '/system/log',
    component: resolve => require(['../components/system/log.vue'], resolve)
  }, {
    name: '操作系统日志',
    path: '/system/handleLog',
    component: resolve => require(['../components/system/handleLog.vue'], resolve)
  }, {
    name: '单位管理',
    path: '/system/org',
    component: resolve => require(['../components/system/org/index.vue'], resolve)
  }, {
    name: '角色管理',
    path: '/system/role',
    component: resolve => require(['../components/system/role.vue'], resolve)
  }, {
    name: '文件上传',
    path: '/system/oss',
    component: resolve => require(['../components/system/oss.vue'], resolve)
  }, {
    name: '参数管理',
    path: '/system/config',
    component: resolve => require(['../components/system/config.vue'], resolve)
  }, {
    name: '定时任务',
    path: '/system/schedule',
    component: resolve => require(['../components/system/schedule.vue'], resolve)
  }, {
    name: '用户管理',
    path: '/system/user',
    component: resolve => require(['../components/system/user/index.vue'], resolve)
  }, {
    name: '红名单管理',
    path: '/system/redList',
    component: resolve => require(['../components/system/redList/index.vue'], resolve)
  }, {
    name: '白名单管理',
    path: '/system/waiteList',
    component: resolve => require(['../components/system/waiteList/index.vue'], resolve)
  }, {
    name: '黑名单管理',
    path: '/system/blackList',
    component: resolve => require(['../components/system/blackList/index.vue'], resolve)
  }, {
    name: 'SQL监控',
    path: '/system/sql',
    component: resolve => require(['../components/system/sql.vue'], resolve)
  }, {
    name: '系统字典',
    path: '/system/dict',
    component: resolve => require(['../components/system/dict/index.vue'], resolve)
  }, {
    name: '直通车管理',
    path: '/system/nav',
    component: resolve => require(['../components/system/nav.vue'], resolve)
  }, {
    name: '技能管理',
    path: '/system/talentPool',
    component: resolve => require(['../components/system/talentPool/index.vue'], resolve)
  }, {
    name: '协同办公协作模板',
    path: '/system/cooperative',
    component: resolve => require(['../components/system/cooperative/index.vue'], resolve)
  }, {
    name: '功能简介管理',
    path: '/system/brief',
    component: resolve => require(['../components/system/brief/index.vue'], resolve)
  }, {
    name: '版本更新',
    path: '/system/version',
    component: resolve => require(['../components/system/version/index.vue'], resolve)
  }]
}]
