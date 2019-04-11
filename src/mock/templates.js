/*
 ex:
 export const handleName = function (Mock, url, query){
 // return {code:0, data:[], message:''}
 }
 */

/**
 * 登录
 * @param  {[type]} Mock  [description]
 * @param  {[type]} url   [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export const handleLogin = function(Mock, url, query) {
  return {
    'Status': 1,
    'Data': {
      'UserData': {
        'UserId': '1',
        'UserName': '美丽湾',
        'LoginName': 'admin',
        'Password': '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
        'DataLevel': null,
        'Post': 'A001',
        'PostName': '刑事侦查',
        'PosLevel': 'B001',
        'PosLevelName': '普通民警',
        'DeptNo': '441900000000',
        'DeptName': '东莞市公安局',
        'AreaCode': '43',
        'AreaName': '湖南',
        'UserDept': [],
        'UserRole': [{
          'RoleId': '1',
          'RoleName': '管理员',
          'Remark': '1',
          'Creator': '1',
          'CreatedTime': '2017-04-13 19:31:31'
        }],
        'UserMenu': [{ 'MenuId': '1A33C56FB2C0414EBB240C58AF1EC12A' }, { 'MenuId': '36A282991FC34DC9863CF59207D93AF2' }, { 'MenuId': '5845A4FB425E4E3ABC80E05A21D53F4E' }, { 'MenuId': '6B11DCE573E94A77833232A15A2ADB79' }, { 'MenuId': '6DB3E70D179648609E1286426FF98AF1' }, { 'MenuId': '7C6AFBF9A78B4EA6AFE403C3B2C4E969' }, { 'MenuId': '82C25B816A944C238B7493DAC3B077F7' }, { 'MenuId': 'BDA6D8D43ED841D69A8D2C42D689A71C' }, { 'MenuId': '369A1258786449A4806B8FEFDE681196' }, { 'MenuId': '455CEBC0F86242F8992F7D721EB81CB9' }, { 'MenuId': '9F32DB7F2E4F4669B8F0F9DF91DFB4B5' }, { 'MenuId': 'C1905025B07048E5A051B79FCB83E366' }, { 'MenuId': 'D572AF92ED9340EE992286CDF71607DA' }, { 'MenuId': 'DFD034A88B094AC08D6ECB262289609D' }, { 'MenuId': '2CA5DA8F608F4488B500F4789051CCDF' }, { 'MenuId': '4799A332BDA54FF38856C6E260964087' }, { 'MenuId': '90B3AE560AA944EDA856B1526986847B' }, { 'MenuId': 'CB4AD7B39B0A4BE08B91E8D9E1AD98AE' }, { 'MenuId': 'CE44B8C05E774438A6BE573A5CB6C87A' }, { 'MenuId': 'D3EF53C7B4D84EC0A384E6A7C75D546A' }, { 'MenuId': '47e936d92c8946429eddd5332d8f0556' }, { 'MenuId': '5752C6F94F5A4006A8E5B74F7C6389B7' }, { 'MenuId': '71597D8FCA704091BDB926B852D56787' }, { 'MenuId': '867942C569AF4C649A8923E62E9EEAA1' }, { 'MenuId': 'AFB3D88213BF4A6FBB1F60AF2D570A0E' }, { 'MenuId': 'E6E5FD48121848F3B28F51A96FF2DC7C' }, { 'MenuId': 'c0c5769cfc684a55b188f62d978b68ce' }, { 'MenuId': '1FFC8F1C450C4610B9FF4F3CB6B3B0F2' }, { 'MenuId': '25456393E90A46A280ADEDCC14F7C59F' }, { 'MenuId': '342772DB4FCD4A968705F28D719114AF' }, { 'MenuId': '38402CD964A14DF28F368BB8EC18F5A4' }, { 'MenuId': '44D95EC33F014EFAAE0BB7791433C9BE' }, { 'MenuId': '4900F8BB125D4B72BA6119DCA88B006B' }, { 'MenuId': '7619AE06F5F24B768FA9534F2074482D' }, { 'MenuId': 'B29CB989508C45AF9ABFB8AF5101157A' }, { 'MenuId': 'C9A1E2840B5749219C90F1F2FD133A6A' }, { 'MenuId': 'e9dec79070514e768868c61eedc0644e' }, { 'MenuId': '3bda973f3fb54926b35262afd919d333' }, { 'MenuId': '551F5B784E3546F6B58232D7A94D52D8' }, { 'MenuId': '82941c9e058d4343a364042a7b9113d8' }, { 'MenuId': '85ABD7EE3EFD4BE1A3E298EBBA9BF940' }, { 'MenuId': '8BA5FD35507849DF9BD86B3183D2A073' }, { 'MenuId': '915602E6FF334272A38F29AB979D6C9C' }, { 'MenuId': 'D70B0713C2FA4626A1903BE26E5AA0BE' }, { 'MenuId': 'E04A8DC224B74A17B49CF11037454E63' }, { 'MenuId': 'c93cf22e1dd94fc9a48fa3370f6e2df9' }, { 'MenuId': 'd62927064b1e4104b5795615e2c71dd5' }, { 'MenuId': '05DB9B36737945F29DB3351F090769C9' }, { 'MenuId': '05FDBE59643C42498B58585EEA6F5507' }, { 'MenuId': '076BB19CD16B4D619D332B62C8D00C4F' }, { 'MenuId': '76310141279F4A6C89A85F61968413CA' }, { 'MenuId': '8AD80D608FE84ED1A03AB59C90103BBC' }, { 'MenuId': '8B9A6BFE1A71407DAF26F729B67CDFFE' }, { 'MenuId': '934588E66D9A415594CF79D4FDDD012C' }, { 'MenuId': '94204173EF3142F09002E91561AD56CA' }, { 'MenuId': 'C9F6D1FED8A54F74B9FF853444A12B2D' }, { 'MenuId': 'DC8BC20FAECB4270A047A825BB9B7E80' }, { 'MenuId': '3F95BA3849004CD89D2AC5F15B7B2A7D' }, { 'MenuId': '45680A13D29B477E93C234D3418653B8' }, { 'MenuId': '7E7B3242184444DD8EE3E50A583C5031' }, { 'MenuId': '8989F0423BC147AA8272C34D1FF1FF0B' }, { 'MenuId': 'A0D77AC3616E4CD5891D9ABDCD645EF3' }, { 'MenuId': 'BD2175BA0FB04FB2B4C7991901A45783' }, { 'MenuId': 'D75F1FC0719C4396AA80CEE0137C966E' }, { 'MenuId': 'F632E5893C0E4011B11335112D60E321' }],
        'UserSfz': '443251199102012995',
        'UserCode': '000001',
        'Email': 'root@renren.io',
        'PhoneNum': '13612345678',
        'FacePicId': null,
        'UserState': '1',
        'CreateTime': '2017-04-13 19:31:31',
        'UpdateTime': null,
        'Creator': null,
        'Updator': null,
        'LastLoginTime': '2017-08-10 14:12:58',
        'UserToken': 'B717BA75854B41DFBEDD3586386C41BE',
        'LoginWay': '3',
        'JumpType': 'DLRK_4X',
        'JumpUrl': '/xCenter',
        'MenuId': 'D572AF92ED9340EE992286CDF71607DA'
      },
      'ErrorStr': ''
    }
  }
}

/**
 * 获取菜单树
 * @param  {[type]} Mock  [description]
 * @param  {[type]} url   [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export const handleFetchMenuTree = function(Mock, url, query) {
  return {
    status: 1,
    data: [{
      text: '系统管理',
      path: '/dashboard',
      icon: 'iconfont icon-pc',
      children: [{
        text: '通知通告',
        path: '/dashboard'
      }, {
        text: '系统消息',
        path: '/dashboard/systemNew'
      }, {
        text: '服务总线管理',
        path: '/dashboard/serviceBus'
      }, {
        text: '知识模板',
        path: '/dashboard/knowTemplate'
      }, {
        text: '菜单管理',
        path: '/system/menus'
      }, {
        text: '系统日志',
        path: '/system/log'
      }]
    }, {
      text: 'UI组件库',
      path: '/ui',
      icon: 'el-icon-menu',
      children: [{
        text: '基础组件',
        path: '/ui/basic'
      }, {
        text: '表单相关',
        path: '/ui/form'
      }, {
        text: '数据相关',
        path: '/ui/data'
      }, {
        text: '消息通知',
        path: '/ui/notice'
      }, {
        text: '导航菜单',
        path: '/ui/navigation'
      }, {
        text: '其他',
        path: '/ui/other'
      }]
    }, {
      text: '数据图表',
      path: '/charts',
      icon: 'el-icon-picture',
      children: [{
        text: 'ECharts',
        path: '/echarts'
      }, {
        text: 'GoJS',
        path: '/gojs'
      }]
    }]
  }
}

/**
 * 获取用户菜单
 * @param  {[type]} Mock  [description]
 * @param  {[type]} url   [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export const handleGetUserMenu = function(Mock, url, query) {
  if (query.data.includes('3F95BA3849004CD89D2AC5F15B7B2A7D')) {
    return Mock.mock({
      status: 1,
      'data|10': [{
        'MenuId': '94204173EF3142F09002E91561AD56CA',
        'UpMenuId': '3F95BA3849004CD89D2AC5F15B7B2A7D',
        'UpMenuName': '@ctitle',
        'MenuName': '@ctitle',
        'RequestUrl': null,
        'RequestParams': null,
        'MenuType': 1,
        'MenuIcon': null,
        'OrderSeq': 1,
        'IsDefault': null,
        'SystemId': null,
        'OpenType': '3',
        'SubMenus': [],
        'HasAuthority': '1'
      }]
    })
  } else {
    return Mock.mock({
      'status': 1,
      'data|10': [{
        'MenuId': '@guid',
        'UpMenuId': 'D572AF92ED9340EE992286CDF71607DA',
        'UpMenuName': '@ctitle',
        'MenuName': '@ctitle',
        'RequestUrl': '/mainIndex',
        'RequestParams': null,
        'MenuType': 0,
        'MenuIcon': '/static/img/qbzh.png',
        'OrderSeq': 1,
        'IsDefault': null,
        'SystemId': null,
        'OpenType': '3',
        'SubMenus|10': [{
          'MenuId': '@guid',
          'UpMenuId': '3F95BA3849004CD89D2AC5F15B7B2A7D',
          'UpMenuName': '@ctitle',
          'MenuName': '@ctitle',
          'RequestUrl': '/dashboard/null',
          'RequestParams': null,
          'MenuType': 1,
          'MenuIcon': null,
          'OrderSeq': 2,
          'IsDefault': null,
          'SystemId': null,
          'OpenType': '3',
          'SubMenus': [],
          'HasAuthority': '1'
        }]
      }]
    })
  }
}

/**
 * 获取组织字典
 * @param  {[type]} Mock  [description]
 * @param  {[type]} url   [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export const handleGetDeptDicts = function(Mock, url, query) {
  return Mock.mock({
    status: 1,
    'data|10': [{
      'ParentCode': '-1',
      'DictName': '@ctitle',
      'Code': '441900000000',
      'DictType': '@title',
      'Temp1': null,
      'Temp2': null,
      'Temp3': null,
      'ReMark': null,
      'Order': 0,
      'DictLevel': 0,
      'IsShow': null,
      'SonModels|10': [{
        'ParentCode': '441900000000',
        'DictName': '@title',
        'Code': '@integer(10000,90000)',
        'DictType': '@title',
        'Temp1': null,
        'Temp2': null,
        'Temp3': null,
        'ReMark': null,
        'Order': 0,
        'DictLevel': 0,
        'IsShow': null
      }]
    }]
  })
}

/**
 * 获取权限列表
 * @param  {[type]} Mock  [description]
 * @param  {[type]} url   [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export const handleGetRoleDicts = function(Mock, url, query) {
  return Mock.mock({
    status: 1,
    'data|10': [{
      'ParentCode': null,
      'DictName': '@ctitle',
      'Code': null,
      'DictType': '@ctitle',
      'Temp1': null,
      'Temp2': null,
      'Temp3': null,
      'ReMark': '1',
      'Order': 0,
      'DictLevel': 0,
      'IsShow': null,
      'SonModels': null,
      'KeyId': '@guid',
      'CreatedTime': '0001-01-01 00:00:00',
      'UpdatedTime': '0001-01-01 00:00:00'
    }]
  })
}

/**
 * 获取系统菜单
 * @param  {[type]} Mock  [description]
 * @param  {[type]} url   [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export const sysMenu = function(Mock, url, query) {
  let data = Mock.mock({
    status: 1,
    'data|200': [{
      'appId': '@guid',
      'icon': 'fa fa-cog',
      'isDefault': true,
      'list': null,
      'menuId|+1': 1,
      'name': '@ctitle',
      'open': null,
      'orderNum': 0,
      'parentId': '@integer(0,10)',
      'parentName': null,
      'perms': null,
      'pkValue': '1',
      'type': '@integer(0,2)',
      'url': '@url'
    }]
  })
  data.data.forEach(item => {
    item.menuId = item.menuId.toString();
    item.parentId = item.parentId.toString();
  })
  return data;
}

/**
 * 获取人员档案列表
 * @param  {[type]} Mock  [description]
 * @param  {[type]} url   [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export const handleFetchPeopleList = function(Mock, url, query) {
  return Mock.mock({
    status: 1,
    'data|10': [{
      'id|+1': 1,
      'name': '@cname()',
      'sex': '男',
      'birthday': '@date()',
      'idCard': '@id()',
      'tel': '13612345678',
      'area': '@county(true)',
      'zip': '@zip()',
      'faceId': null,
      'createTime': '@date()',
      'updateTime': '@date()',
      'creator': '@cname()',
      'updator': '@cname()'
    }]
  })
}

/**
 * 获取人员档案详情
 * @param  {[type]} Mock  [description]
 * @param  {[type]} url   [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export const handleGetPeopleInfo = function(Mock, url, query) {
  return Mock.mock({
    'Status': 1,
    'Data': {
      'UserData': {
        'id': 1,
        'name': '@cname()',
        'sex': '男',
        'birthday': '@date()',
        'idCard': '@id()',
        'tel': '13612345678',
        'area': '@county(true)',
        'zip': '@zip()',
        'faceId': null,
        'createTime': '@date()',
        'updateTime': '@date()',
        'creator': '@cname()',
        'updator': '@cname()'
      },
      'ErrorStr': ''
    }
  })
}

/**
 * 获取案件档案列表
 * @param  {[type]} Mock  [description]
 * @param  {[type]} url   [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export const handleFetchCaseList = function(Mock, url, query) {
  return Mock.mock({
    status: 1,
    'data|10': [{
      'id|+1': 1,
      'title': '@cname()',
      'type': '1', // 类型
      'nature': '1', // 性质
      'status': '1', // 案件状态
      'summary': '', // 简要案情
      'remarks': '', // 备注说明
      'createTime': '@date()', // 创建时间
      'creatorOrg': '', // 录入单位
      'creator': '@cname()' // 创建人
    }]
  })
}

/**
 * 获取案件档案详情
 * @param  {[type]} Mock  [description]
 * @param  {[type]} url   [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export const handleGetCaseInfo = function(Mock, url, query) {
  return Mock.mock({
    'Status': 1,
    'Data': {
      'UserData': {
        'id': 1,
        'title': '@cname()',
        'type': '1', // 类型
        'nature': '1', // 性质
        'status': '1', // 案件状态
        'summary': '', // 简要案情
        'remarks': '', // 备注说明
        'createTime': '@date()', // 创建时间
        'creatorOrg': '', // 录入单位
        'creator': '@cname()' // 创建人
      },
      'ErrorStr': ''
    }
  })
}
