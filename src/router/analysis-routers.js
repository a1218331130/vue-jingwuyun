/**
 * analysis-routers分析工具
 */
export default [{
  // name: '分析工具首页',
  path: '/analysis',
  component: resolve => require(['../components/analysis/index.vue'], resolve),
  children: [{
    path: '',
    component: resolve => require(['../components/analysis/welcome.vue'], resolve)
  }, {
    name: '账单分析',
    path: 'bill',
    component: resolve => require(['../components/analysis/bill/index.vue'], resolve)
  }, {
    name: '话单分析',
    path: 'telList',
    component: resolve => require(['../components/analysis/telList/index.vue'], resolve)
  }, {
    // 文件导入对话框，暂不知入口，先写一个页面测试，未完成，不要删,lgs 20180507
    name: '文件导入',
    path: 'dataImport',
    component: resolve => require(['../components/analysis/dataImport/index.vue'], resolve)
  }, {
    name: '通讯录分析',
    path: 'address',
    component: resolve => require(['../components/analysis/addressBook/index.vue'], resolve)
  }, {
    name: '轨迹分析',
    path: 'locus',
    component: resolve => require(['../components/analysis/locus/index.vue'], resolve)
  }, {
    name: '时光轴',
    path: 'timeline',
    component: resolve => require(['../components/analysis/timeline/index-new.vue'], resolve)
  }, {
    name: '串并分析',
    path: 'parallel',
    component: resolve => require(['../components/analysis/parallel/index.vue'], resolve)
  }, {
    name: '关系分析',
    path: 'relation',
    component: resolve => require(['../components/analysis/relation/index.vue'], resolve)
  }, {
    name: '数据对比',
    path: 'data',
    component: resolve => require(['../components/analysis/data/index.vue'], resolve)
  }, {
    name: '数据对比',
    path: 'dataComparsion',
    component: resolve => require(['../components/analysis/data/dataComparsion/add.vue'], resolve)
  }, {
    name: '对比结果',
    path: 'comparisonResult',
    component: resolve => require(['../components/analysis/data/result/resultList.vue'], resolve)
  }, {
    name: '查看对比结果',
    path: 'viewComparisonResult',
    component: resolve => require(['../components/analysis/data/result/resultList1.vue'], resolve)
  }, {
    name: '车辆分析',
    path: 'car',
    component: resolve => require(['../components/analysis/car/index.vue'], resolve)
  }, {
    name: 'PGIS地图分析',
    path: 'pgis',
    component: resolve => require(['../components/analysis/pgis/index.vue'], resolve)
  }, {
    name: '高危人群',
    path: 'highrisk',
    component: resolve => require(['../components/analysis/highrisk/index.vue'], resolve)
  }, {
    name: '虚拟身份分析',
    path: 'virtual',
    component: resolve => require(['../components/analysis/virtual/index.vue'], resolve)
  }, {
    name: '图片比对',
    path: 'image',
    component: resolve => require(['../components/analysis/image/index.vue'], resolve)
  }, {
    name: '图片比对-支持参数',
    path: 'image/:fileId',
    component: resolve => require(['../components/analysis/image/index.vue'], resolve)
  }, {
    name: '视频分析',
    path: 'video',
    component: resolve => require(['../components/analysis/video/index.vue'], resolve)
  }, {
    name: '云知道-搜人',
    path: 'cloudknow/person',
    component: resolve => require(['../components/analysis/cloudknow/search-person/index.vue'], resolve)
  }, {
    name: '云知道-电话',
    path: 'cloudknow/phone',
    component: resolve => require(['../components/analysis/cloudknow/search-phone/index.vue'], resolve)
  }, {
    name: '云知道-qq查询',
    path: 'cloudknow/qq',
    component: resolve => require(['../components/analysis/cloudknow/search-qq/index.vue'], resolve)
  }, {
    name: '云知道-微博手机互查',
    path: 'cloudknow/wbtel',
    component: resolve => require(['../components/analysis/cloudknow/search-wbtel/index.vue'], resolve)
  }, {
    name: '云知道-qq手机互查',
    path: 'cloudknow/qqtel',
    component: resolve => require(['../components/analysis/cloudknow/search-qqtel/index.vue'], resolve)
  }, {
    name: '云知道-微信手机互查',
    path: 'cloudknow/wechat',
    component: resolve => require(['../components/analysis/cloudknow/search-wechat/index.vue'], resolve)
  }, {
    name: '研判工具-全国数据查询工具',
    path: 'dataquery',
    component: resolve => require(['../components/analysis/dataquery/index.vue'], resolve)
  }, {
    path: '*',
    component: resolve => require(['../components/404.vue'], resolve)
  }]
}]
