/**
 * control-routers 对象管控路由
 */
export default [{
  path: '/control',
  component: resolve => require(['../components/control/layout.vue'], resolve),
  meta: {
    keepAlive: true
  },
  children: [{
    path: '',
    component: resolve => require(['../components/control/index.vue'], resolve),
    children: [{
      path: '',
      // redirect: '/control/analysisPeople'
      component: resolve => require(['../components/control/home/index.vue'], resolve)
    }, {
      name: '人员管控-涉稳人员',
      path: '/control/people/Sw',
      component: resolve => require(['../components/control/people/index.vue'], resolve)
    }, {
      name: '人员管控-涉恐人员',
      path: '/control/people/Sk',
      component: resolve => require(['../components/control/people/index.vue'], resolve)
    }, {
      name: '人员管控-精神病人',
      path: '/control/people/Js',
      component: resolve => require(['../components/control/people/index.vue'], resolve)
    }, {
      name: '人员管控-涉毒人员',
      path: '/control/people/Sd',
      component: resolve => require(['../components/control/people/index.vue'], resolve)
    }, {
      name: '人员管控-前科人员',
      path: '/control/people/Qk',
      component: resolve => require(['../components/control/people/index.vue'], resolve)
    }, {
      name: '人员管控-涉抢涉爆人员',
      path: '/control/people/Sq',
      component: resolve => require(['../components/control/people/index.vue'], resolve)
    }, {
      name: '人员管控-重点上访人员',
      path: '/control/people/Sf',
      component: resolve => require(['../components/control/people/index.vue'], resolve)
    }, {
      name: '车辆管控-毒驾车辆',
      path: '/control/car/Dj',
      component: resolve => require(['../components/control/car/index.vue'], resolve)
    }, {
      name: '车辆管控-超员车辆',
      path: '/control/car/Cy',
      component: resolve => require(['../components/control/car/index.vue'], resolve)
    }, {
      name: '车辆管控-酒驾车辆',
      path: '/control/car/Jj',
      component: resolve => require(['../components/control/car/index.vue'], resolve)
    }, {
      name: '车辆管控-超速车辆',
      path: '/control/car/Cs',
      component: resolve => require(['../components/control/car/index.vue'], resolve)
    }, {
      name: '车辆管控-涉牌涉证车辆',
      path: '/control/car/Sp',
      component: resolve => require(['../components/control/car/index.vue'], resolve)
    }, {
      name: '车辆管控-超载车辆',
      path: '/control/car/Cz',
      component: resolve => require(['../components/control/car/index.vue'], resolve)
    }, {
      name: '车辆管控-疲劳驾驶车辆',
      path: '/control/car/Pl',
      component: resolve => require(['../components/control/car/index.vue'], resolve)
    }, {
      name: '关注人员',
      path: '/terrorism/casepeople',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '重点管控对象',
      path: '/terrorism/controls',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '出租车司机',
      path: '/petition/taxier',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '农电放映员',
      path: '/petition/screener',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '民办教师',
      path: '/petition/teacher',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '疫苗受害人',
      path: '/petition/vacciner',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '失独群体',
      path: '/petition/losser',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '企业改制',
      path: '/petition/reformesser',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '征地拆迁',
      path: '/petition/landesser',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '失踪儿童家庭群体',
      path: '/petition/misschilder',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '库区移民',
      path: '/petition/reservoirer',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '涉警上访人员',
      path: '/petition/policer',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '非正常上访',
      path: '/petition/abnormaler',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '涉交通事故',
      path: '/petition/trafficer',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '环境污染',
      path: '/petition/environmenter',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '涉众型经济犯罪群体',
      path: '/petition/economicer',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '执法办案区',
      path: '/control/risk/inside/zfbaq',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '公务用枪单位',
      path: '/control/risk/inside/gwyqdw',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '公安涉密信息',
      path: '/control/risk/inside/gasmxx',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '机关自身安全',
      path: '/control/risk/inside/jgzsaq',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '生产厂家',
      path: '/control/risk/aviation/sccj',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '销售商',
      path: '/control/risk/aviation/xss',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '培训机构',
      path: '/control/risk/aviation/pxjg',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '无人机爱好者',
      path: '/control/risk/aviation/wrjahz',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }, {
      name: '无人机管理',
      path: '/control/risk/aviation/wrjgl',
      component: resolve => require(['../components/control/group/index.vue'], resolve)
    }]
  }]
}]
