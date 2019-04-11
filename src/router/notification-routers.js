/**
 * notification-routers 通知通报
 */
export default [{
  path: '/notification',
  component: resolve => require(['../components/index.vue'], resolve),
  children: [{
    path: '',
    redirect: 'list'
  }, {
    name: '通知通报-列表',
    path: 'list',
    component: resolve => require(['../components/notification/list/index.vue'], resolve)
  }, {
    name: '通知通报-已发',
    path: 'send',
    component: resolve => require(['../components/notification/send/index.vue'], resolve)
  }, {
    name: '通知通报-草稿',
    path: 'draft',
    component: resolve => require(['../components/notification/draft/index.vue'], resolve)
  }, {
    name: '通知通报-详情',
    path: 'detail',
    component: resolve => require(['../components/notification/detail/index.vue'], resolve)
  }]
}]
