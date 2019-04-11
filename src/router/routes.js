// routes
import demoRoutes from './demo-routes' // demo 路由配置
import systemRoutes from './system-routes' // 管理面板 路由配置
import dossierRoutes from './dossier-routes' // 档案管理路由
import caseRoutes from './case-routes' // 案件管理路由
import analysisRoutes from './analysis-routers' // 分析工具
import tacticsRoutes from './tactics-routers' // 战法市场
import controlRouter from './control-router' // 对象管控
import unionRouter from './union-routers' // 合成作战
import manageRouter from './manage-router' // 布控管理
// import judgeRouter from './judge-routers' // 案件管理-列表-概况
import policyRouter from './policy-routers' // 警情决策
import talentPoolRouter from './talent-pool-routers' // 人才库
import notificationRouter from './notification-routers' // 通知通报
import processRouter from './process-routers' // 流程管理

// {
//   name: '第一类中心主页',
//   path: '/mainIndex/:id',
//   component: resolve => require(['../components/main-index.vue'], resolve)
// },
const routeIndex = [{
  name: '维护页',
  path: '/maintenance',
  component: resolve => require(['../components/maintenance.vue'], resolve)
}, {
  path: '/pgis',
  component: resolve => require(['../widgets/pgis/test.vue'], resolve)
}, {
  path: '/',
  component: resolve => require(['../components/video-wrap.vue'], resolve),
  children: [
    {
      path: '',
      redirect: 'xCenter'
    }, {
      name: 'xCenter',
      path: 'xCenter',
      component: resolve => require(['../components/x-center201711.vue'], resolve)
    }, {
      name: '登录页',
      path: 'login',
      component: resolve => require(['../components/login201711.vue'], resolve)
    }
  ]
}, {
  name: 'dashboard',
  path: '/dashboard',
  redirect: 'system'
}, {
  name: '外部系统独立页',
  path: '/external-single/:menuId',
  component: resolve => require(['../components/external.vue'], resolve)
}, {
  name: '外部系统',
  path: '/external',
  component: resolve => require(['../components/index.vue'], resolve)
}, {
  name: '第二类中心主页',
  path: '/mainIndex/:id',
  component: resolve => require(['../components/main-index3.vue'], resolve)
}, {
  name: 'search',
  path: '/search',
  component: resolve => require(['../components/search/search.vue'], resolve)
}, {
  name: 'search_zt',
  path: '/search/zt/:type',
  component: resolve => require(['../components/search/search-zt.vue'], resolve)
}, {
  name: 'searchResult',
  path: '/search/result',
  component: resolve => require(['../components/search/result.vue'], resolve)
}, {
  name: 'searchResult',
  path: '/search/result_db',
  component: resolve => require(['../components/search/result_db.vue'], resolve)
}, {
  name: '侦查智库',
  path: '/know',
  component: resolve => require(['../components/know/index.vue'], resolve)
}, {
  name: '情报导航',
  path: '/nav',
  component: resolve => require(['../components/nav/index.vue'], resolve)
}, {
  name: '我的常用',
  path: '/mynav',
  component: resolve => require(['../components/nav/myIndex.vue'], resolve)
}, {
  name: '问题反馈',
  path: '/question',
  component: resolve => require(['../components/question/index.vue'], resolve)
}, {
  name: 'IE浏览器',
  path: '/ie/message',
  component: resolve => require(['../components/ie-message.vue'], resolve)
}, {
  name: '风险管控',
  path: '/controlOne',
  component: resolve => require(['../components/controlOne/layout.vue'], resolve)
}]

export default routeIndex.concat(
  demoRoutes,
  systemRoutes,
  caseRoutes,
  dossierRoutes,
  analysisRoutes,
  tacticsRoutes,
  controlRouter,
  unionRouter,
  manageRouter,
  // judgeRouter,
  policyRouter,
  talentPoolRouter,
  notificationRouter,
  processRouter
)
