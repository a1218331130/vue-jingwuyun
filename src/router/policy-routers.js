/**
 * policy-routers 警情决策
 */
export default [{
  path: '/policy',
  component: resolve => require(['../components/index.vue'], resolve),
  children: [{
    path: '',
    redirect: 'survey'
  }, {
    name: '警情决策-概况',
    path: 'survey',
    component: resolve => require(['../components/policy/survey/index.vue'], resolve)
  }, {
    name: '警情决策-态势',
    path: 'trend',
    component: resolve => require(['../components/policy/trend/index.vue'], resolve)
  }]
}]
