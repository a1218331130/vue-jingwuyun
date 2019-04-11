const urlToType = {
  'Sw': '000002', //  涉稳
  'Sk': '000001', // 涉恐
  'Js': '000004', // 精神病
  'Sd': '000005', // 涉毒
  'Qk': '000006', // 前科
  'Sq': '000007', // 涉抢涉爆
  'Sf': '000003', // 重点人员

  'Dj': '100002', // 毒驾
  'Cy': '100005', // 超员
  'Jj': '100001', // 酒驾
  'Cs': '100003', // 超速
  'Sp': '100006', // 涉牌涉证
  'Cz': '100004', // 超载
  'Pl': '100007', // 疲劳驾驶
  'lkyc': '100008', // 两客一车
  'wbcl': '100009', // 危爆车辆
  'wzcl': '100010', // 违章车辆
  'wnjcl': '100011', // 未年检车辆

  'freeder': 'RQ001001', // 民运分子
  'religious': 'RQ001002', // 宗教民族领域
  'cult': 'RQ001003', // 法轮功等邪教群体
  'ideology': 'RQ001004', // 意识形态高校文化领域
  'otherpolit': 'RQ001005', // 关注人员

  'casepeople': 'RQ002001', // 关注人员
  'controls': 'RQ002002', // 重点管控对象
  'taxier': 'RQ003001', // 出租车司机
  'screener': 'RQ003002', // 农电放映员
  'teacher': 'RQ003003', // 民办教师
  'vacciner': 'RQ003004', // 疫苗受害人
  'losser': 'RQ003005', // 失独群体
  'reformesser': 'RQ003006', // 企业改制
  'landesser': 'RQ003007', // 征地拆迁
  'misschilder': 'RQ003008', // 失踪儿童家庭群体
  'reservoirer': 'RQ003009', // 库区移民
  'policer': 'RQ003010', // 涉警上访人员
  'abnormaler': 'RQ003011', // 非正常上访
  'trafficer': 'RQ003012', // 涉交通事故
  'environmenter': 'RQ003013', // 环境污染
  'economicer': 'RQ003014', // 涉众型经济犯罪群体
  'vietnamwarer': 'RQ004001', // 对越参战退役人员
  'slodtojober': 'RQ004002', // 下岗转业志愿兵
  'vaofcadrer': 'RQ004003', // 企业军转干部
  'aidvietnamer': 'RQ004004', // 抗美援越退役军人
  'disabler': 'RQ004005', // 伤残军人
  'railwayer': 'RQ004006', // 铁道兵退役人员
  'overtimer': 'RQ004007', // 超期服役退役人员
  'militialer': 'RQ004008', // 三线民兵
  'petitioner': 'RQ004009', // 涉军上访人员
  'others': 'RQ004010', // 其他涉军群体
  'drugers': 'RQ005001', // 社会面吸毒人员
  'uncontrol': 'RQ005002', // 脱管失控吸毒人员
  'extreme': 'RQ006001', // 个人极端行为
  'spritis': 'RQ006002', // 重性精神障碍患者
  'murder': 'RQ006003', // 命案逃犯

  'zazd': 'RQ003014', // 治安重点案事件
  'jzzd': 'RQ003014', // 经侦重点案事件
  'xzzd': 'RQ003014', // 刑侦重点案事件
  'dhce': 'RQ003014', // 打黑除恶重点案事件

  'sccj': 'WRJ001', // 生产厂商
  'xss': 'WRJ002', // 销售商
  'pxjg': 'WRJ003', // 培训机构
  'wrjahz': 'WRJ004', // 生产信息
  'wrjgl': 'WRJ005', // 爱好者

  'lyjq': 'ZDCS01', // 旅游景区
  'gtz': 'ZDCS02', // 高铁站
  'gj': 'ZDCS03', // 公交
  'ctky': 'ZDCS04', // 长途客运
  'dtzd': 'ZDCS05', // 地铁站点
  'jc': 'ZDCS06', // 机场
  'rymjcs': 'ZDCS07', // 大型广场人员密集场所
  'ryjjcs': 'ZDCS08', // 关注人员聚集场所
  'gcjz': 'ZDCS09', // 高层建筑
  'dxsnsc': 'ZDCS10', // 大型室内市场
  'nctz': 'ZDCS11', // 农村团寨
  'jgcs': 'ZDCS12', // 监管场所
  'sdyqss': 'ZDCS13', // 水电油气设施
  'jtzdld': 'ZDCS01', // 交通重点路段
  'dxsczb': 'ZDCS14', // 大型商场及金银珠宝店
  'dxhd': 'ZDCS15', // 大型活动
  'wszdmb': 'WSZD01', // 网上重点目标
  'wsyqgl': 'WSZD02', // 机制落实情况
  'jzlsqk': 'WSZD02', // 机制落实情况
  'lkywyx': 'JTAQGL01', // 两客一危一校
  'zdjtwf': 'JTAQGL02', // 重点交通违法
  'zdldpc': 'JTAQGL03', // 重点路段排查
  'jtglxf': 'JTAQGL01', // 交通管理信访
  'jds': 'JGCS01', // 戒毒所
  'kss': 'JGCS02', // 看守所
  'jls': 'JGCS03', // 拘留所

  'dzjg': 'ZDHYDW01', // 党政机关
  'school': 'ZDHYDW02', // 中小学及幼儿园
  'yy': 'ZDHYDW03', // 医院
  'lg': 'ZDHYDW04', // 旅馆
  'wb': 'ZDHYDW05', // 网吧
  'yhbz': 'ZDHYDW06', // 烟花爆竹生产、燃放、销售单位
  'mbqy': 'ZDHYDW07', // 民爆物品生产、储存、销售等企业
  'sqsc': 'ZDHYDW08', // 涉枪生产、使用、销售等单位
  'yzbdw': 'ZDHYDW09', // 易制爆单位
  'yzddw': 'ZDHYDW10', // 易制毒单位
  'wljdy': 'ZDHYDW11', // 物流寄递业
  'bpzydw': 'ZDHYDW12', // 爆破作业单位
  'wxhxwp': 'ZDHYDW13', // 剧毒危险化学物品
  'fsxwp': 'ZDHYDW14', // 放射性物品
  'yhjrjg': 'ZDHYDW15', // 银行业金融机构
  'bafwgs': 'ZDHYDW16', // 保安服务公司
  'jjfzwsdw': 'ZDHYDW17' // 经济犯罪涉稳单位
  // 'zfbaq':  // 执法办案区
  // 'gwyqdw':  // 公务用枪单位
  // 'gasmxx':  // 公安涉密信息
  // 'jgzsaq':  // 机关自身安全

}
import '../../utils/dateFormat'
import {
  FXPCGK_DELETE,
  REMOVE_REVOKED_FOCUS,
  FXPCGK_CASECAR_DELETE,
  FXPCGK_BASEPLACE_DELETE,
  FXPCGK_INDORG_DELETE,
  FXPCGK_CLUE_DELETE
  // DELETE_FOCUS_PERSON,
  // DELETE_FOCUS_CAR
} from '../../store/types'
export default {
  components: {},
  data() {
    return {
      personPower: [
        { methods: 'FocusObject/AddFocusPersonSw' }, // 添加重点人员
        { methods: 'FocusObject/DeleteFocusPersonSw' }, // 删除重点人员
        { methods: 'FocusObject/EditFocusPersonSw' }, // 修改重点人员
        { methods: 'FocusObject/GetPersonsByCondSw' }, // 获取重点人员列表
        { methods: 'FocusObject/GetPersonVisitInfoSw' }, // 重点人员列表[走访记录]
        { methods: 'FocusObject/EditPersonVisitSw' }, // 重点人员列表[走访记录修改[包含删除]]
        { methods: 'FocusObject/AddPersonVisitSw' } // 获取重点人员列表[走访记录添加]
      ],
      carPower: [
        { methods: 'fxpcgk/casecar/save' }, // 添加重点人员
        { methods: 'fxpcgk/casecar/delete' }, // 删除重点人员
        { methods: 'fxpcgk/casecar/update' }, // 修改重点人员
        { methods: 'fxpcgk/casecar/list' } // 获取重点人员列表
      ],
      pagenav: {
        currentpage: 1,
        limit: 10
      },
      isChangeListType: false,
      showRightBar: false, // 当前侧栏窗体是否展开状态中继
      arr: []
    }
  },
  computed: {},
  watch: {
    $route(v) {
      this.FocusType()
    },
    pagenav: {
      handler() {
        this.screen.filter.PageIndex = this.pagenav.currentpage
        this.screen.filter.PageSize = this.pagenav.limit
        this.parentId = ''
        this.loadData()
      },
      deep: true
    }
  },
  methods: {
    /**
     * [handleRecord 操作记录]
     * @param  {[type]} id [description]
     * @return {[type]}       [description]
     */
    handleRecord(id) {
      this.$refs.recordDialog.showRecord(id)
    },
    /**
     * [changeAlias 人权限别名更改]
     * @param  {[type]} list [description]
     * @return {[type]}      [description]
     */
    changePersonAlias(d) {
      let name = 'Sw';
      if(d) {
        name = d;
      }
      this.personPower.forEach(d => {
        d.methods = d.methods.substring(0, d.methods.length - 2) + name
      })
    },
    /**
     * [changeAlias 车限别名更改]
     * @param  {[type]} list [description]
     * @return {[type]}      [description]
     */

    changeCarAlias(d) {
      let name = 'Cs';
      if(d) {
        name = d;
      }
      this.carPower.forEach(d => {
        d.methods = d.methods.substring(0, d.methods.length - 2) + name
      })
    },
    /**
     * [searchSubmit 查询/搜索]
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    searchSubmit(obj) {
      this.screen.filter = obj
      // let daterange = obj.daterange
      // if (this.screen.filter.BeginDate !== '') {
      //   this.screen.filter.BeginDate = this.dateFormat(obj.BeginDate, 'yyyy-MM-dd hh:mm:ss');
      //   this.screen.filter.EndDate = this.dateFormat(obj.EndDate, 'yyyy-MM-dd hh:mm:ss');
      // }
      // 重置当前页签
      this.plugLoading = null
      // 页数 总数初始化
      this.filterObject.PageIndex = 1
      this.filterObject.PageSize = 10
      // 加载列表
      this.searchDtat()
      // 重置筛选表单
      // if(this.$refs.rightBar) this.$refs.rightBar.reset()
      this.unfoldT = false
    },
    /**
     * [handleCate() 执行操作后列表更新]
     * @type {[type]}
     */
    handleCate() {
      // 重置所有页签
      this.tabs.forEach(d => {
        d.parentId = ''
      })
      // 页数 总数初始化
      this.tabs[0].page = 1
      this.tabs[0].count = 0
      // 重置筛选表单
      if(this.$refs.rightBar) this.$refs.rightBar.reset()
      // 加载列表
      this.loadData()
    },
    /**
     * [switchCate 管控分类切换(左侧栏)]
     * 可作为列表初始化方法使用
     * @return {[type]} [description]
     */
    switchCate() {
      let url = this.$route.path.split('/')
      this.parentId = url[url.length - 1]
      // 人员车辆权限别名更改
      this.changePersonAlias(this.parentId)
      this.changeCarAlias(this.parentId)
      // 重置所有页签
      this.tabs.forEach(d => {
        d.parentId = ''
      })
      // 重置第一页签
      this.activeName = this.tabs[0].name
      this.tabs[0].page = 1
      this.tabs[0].count = 0
      this.filterObject.Flag = 0

      // 清除现有列表
      this.peopleList = []

      // 人员类型切换
      // this.filterObject.FocusType = urlToType[this.parentId]
      if(this.dataType) this.filterObject.FocusType = urlToType[this.dataType]
      // 重置筛选表单
      if(this.$refs.rightBar) this.$refs.rightBar.reset()

      // 加载列表
      this.loadData()
    },
    /**
     * [switchCarType 切换车辆类型]
     * @return {[type]} [description]
     */
    switchCarType() {
      this.filterObject.FocusType = urlToType[this.dataType]
      this.loadData()
    },
    /**
     * [initsiberSearchContent 初始化搜索条件]
     */
    initSiberSearchContent() {
      if(this.filterObject.FocusType.indexOf('RQ0') !== -1) {
        this.screen.filter = {
          XingMing: '', // 姓名
          Idnumber: '', // 身份证号
          LevelArr: '', // 风险等级(字典)
          IfDanger: '', // 是否隐患,多选用逗号分隔
          CollectDeptArr: [], // 登记单位,多选用逗号分隔
          IfInvestigation: '', // 是否排查，1是，0否,多选用逗号分隔
          IfCancellation: '', // 是否注销，1是，0否,多选用逗号分隔
          BeginDate: '', // 检索开始时间--检索结束时间
          EndDate: ''
        }
        this.screen.options = [{
          title: '登记单位',
          prop: 'CollectDeptArr',
          props: {
            id: 'orgId',
            label: 'name',
            parentId: 'parentId',
            children: 'children'
          },
          type: 'treeSelect',
          children: []
        }, {
          title: '身份证',
          prop: 'Idnumber',
          type: 'input'
        }, {
          title: '姓名',
          prop: 'XingMing',
          type: 'input'
        }, {
          title: '开始时间',
          prop: 'BeginDate',
          type: 'datetime'
        }, {
          title: '结束时间',
          prop: 'EndDate',
          type: 'datetime'
        }, {
          title: '是否有隐患',
          prop: 'IfDanger',
          type: 'radio',
          children: [{
            label: '是',
            value: '1'
          }, {
            label: '否',
            value: '0'
          }]
        }, {
          title: '是否排查',
          prop: 'IfInvestigation',
          type: 'radio',
          children: [{
            label: '是',
            value: '1'
          }, {
            label: '否',
            value: '0'
          }]
        }, {
          title: '是否注销',
          prop: 'IfCancellation',
          type: 'radio',
          children: [{
            label: '是',
            value: '1'
          }, {
            label: '否',
            value: '0'
          }]
        }, {
          title: '风险等级',
          prop: 'LevelArr',
          type: 'select',
          children: []
        }]
        this.querObj = {
          rqlb: this.filterObject.FocusType, // 人员类型
          PageIndex: this.pagenav.currentpage, // 分页-当前页码
          PageSize: this.pagenav.limit * this.listType, // 分页-每页行数
          xm: this.screen.filter.XingMing, // 姓名
          sfz: this.screen.filter.Idnumber, // 身份证
          sfzx: this.screen.filter.IfCancellation, // 是否注销
          sfyyh: this.screen.filter.IfDanger, // 是否有隐患
          sfpcdj: this.screen.filter.IfInvestigation, // 是否排查登记
          fxdj: this.screen.filter.LevelArr, // 风险登级
          djsjsx: this.screen.filter.BeginDate !== '' ? this.dateFormat(new Date(this.screen.filter.BeginDate), 'yyyy-MM-dd hh:mm:ss') : '', // 排查登记开始时间,
          djsjxx: this.screen.filter.EndDate !== '' ? this.dateFormat(new Date(this.screen.filter.EndDate), 'yyyy-MM-dd hh:mm:ss') : '', // 排查登记结束时间
          pcdjrdw: '' // 排查登记单位
        }
      } else if(this.filterObject.FocusType.indexOf('ZDHYDW') !== -1) {
        this.screen.filter = {
          XingMing: '', // 姓名
          Idnumber: '', // 身份证号
          LevelArr: '', // 风险等级(字典)
          IfDanger: '', // 是否隐患,多选用逗号分隔
          CollectDeptArr: [], // 登记单位,多选用逗号分隔
          IfInvestigation: '', // 是否排查，1是，0否,多选用逗号分隔
          IfCancellation: '', // 是否注销，1是，0否,多选用逗号分隔
          BeginDate: '', // 检索开始时间--检索结束时间
          EndDate: ''
        }
        this.screen.options = [{
          title: '登记单位',
          prop: 'CollectDeptArr',
          props: {
            id: 'orgId',
            label: 'name',
            parentId: 'parentId',
            children: 'children'
          },
          type: 'treeSelect',
          children: []
        }, {
          title: '行业名称/行业类型',
          prop: 'Idnumber',
          type: 'input'
        }, {
          title: '开始时间',
          prop: 'BeginDate',
          type: 'datetime'
        }, {
          title: '结束时间',
          prop: 'EndDate',
          type: 'datetime'
        }, {
          title: '是否有隐患',
          prop: 'IfDanger',
          type: 'radio',
          children: [{
            label: '是',
            value: '1'
          }, {
            label: '否',
            value: '0'
          }]
        }, {
          title: '是否排查',
          prop: 'IfInvestigation',
          type: 'radio',
          children: [{
            label: '是',
            value: '1'
          }, {
            label: '否',
            value: '0'
          }]
        }, {
          title: '是否注销',
          prop: 'IfCancellation',
          type: 'radio',
          children: [{
            label: '是',
            value: '1'
          }, {
            label: '否',
            value: '0'
          }]
          // }, {
          //   title: '风险等级',
          //   prop: 'LevelArr',
          //   type: 'select',
          //   children: []
        }]
        this.querObj = {
          keyword: this.screen.filter.Idnumber,
          zdhylb: this.filterObject.FocusType, // 行业单位类型
          PageIndex: this.pagenav.currentpage, // 分页-当前页码
          PageSize: this.pagenav.limit * this.listType, // 分页-每页行数
          sfzx: this.screen.filter.IfCancellation, // 是否注销
          sfyyh: this.screen.filter.IfDanger, // 是否有隐患
          sfpc: this.screen.filter.IfInvestigation, // 是否排查登记
          // fxdj: this.screen.filter.LevelArr, // 风险登级
          djsjsx: this.screen.filter.BeginDate !== '' ? this.dateFormat(new Date(this.screen.filter.BeginDate), 'yyyy-MM-dd hh:mm:ss') : '', // 排查登记开始时间,
          djsjxx: this.screen.filter.EndDate !== '' ? this.dateFormat(new Date(this.screen.filter.EndDate), 'yyyy-MM-dd hh:mm:ss') : '', // 排查登记结束时间
          pcdw: '' // 排查登记单位
        }
      } else if(this.filterObject.FocusType.indexOf('1000') !== -1) {
        this.screen.filter = {
          XingMing: '', // 姓名
          Idnumber: '', // 身份证号
          LevelArr: '', // 风险等级(字典)
          IfDanger: '', // 是否隐患,多选用逗号分隔
          CollectDeptArr: [], // 登记单位,多选用逗号分隔
          IfInvestigation: '', // 是否排查，1是，0否,多选用逗号分隔
          IfCancellation: '', // 是否注销，1是，0否,多选用逗号分隔
          BeginDate: '', // 检索开始时间--检索结束时间
          EndDate: '',
          jingdu: '',
          weidu: ''
        }
        this.screen.options = [{
          title: '登记单位',
          prop: 'CollectDeptArr',
          props: {
            id: 'orgId',
            label: 'name',
            parentId: 'parentId',
            children: 'children'
          },
          type: 'treeSelect',
          children: []
        }, {
          title: '车牌',
          prop: 'Idnumber',
          type: 'input'
        }, {
          title: '开始时间',
          prop: 'BeginDate',
          type: 'datetime'
        }, {
          title: '结束时间',
          prop: 'EndDate',
          type: 'datetime'
        }, {
          title: '是否有隐患',
          prop: 'IfDanger',
          type: 'radio',
          children: [{
            label: '是',
            value: '1'
          }, {
            label: '否',
            value: '0'
          }]
        }, {
          title: '是否排查',
          prop: 'IfInvestigation',
          type: 'radio',
          children: [{
            label: '是',
            value: '1'
          }, {
            label: '否',
            value: '0'
          }]
        }, {
          title: '是否注销',
          prop: 'IfCancellation',
          type: 'radio',
          children: [{
            label: '是',
            value: '1'
          }, {
            label: '否',
            value: '0'
          }]
          // }, {
          //   title: '风险等级',
          //   prop: 'LevelArr',
          //   type: 'select',
          //   children: []
        }]
        this.querObj = {
          keyword: this.screen.filter.Idnumber,
          cllx: this.filterObject.FocusType, // 行业单位类型
          PageIndex: this.pagenav.currentpage, // 分页-当前页码
          PageSize: this.pagenav.limit * this.listType, // 分页-每页行数
          sfzx: this.screen.filter.IfCancellation, // 是否注销
          sfyyh: this.screen.filter.IfDanger, // 是否有隐患
          sfpc: this.screen.filter.IfInvestigation, // 是否排查登记
          // fxdj: this.screen.filter.LevelArr, // 风险登级
          djsjsx: this.screen.filter.BeginDate !== '' ? this.dateFormat(new Date(this.screen.filter.BeginDate), 'yyyy-MM-dd hh:mm:ss') : '', // 排查登记开始时间,
          djsjxx: this.screen.filter.EndDate !== '' ? this.dateFormat(new Date(this.screen.filter.EndDate), 'yyyy-MM-dd hh:mm:ss') : '', // 排查登记结束时间
          pcdw: '' // 排查登记单位
        }
      } else if(this.filterObject.FocusType.indexOf('ZDCS') !== -1) {
        this.screen.filter = {
          XingMing: '', // 姓名
          Idnumber: '', // 身份证号
          LevelArr: '', // 风险等级(字典)
          IfDanger: '', // 是否隐患,多选用逗号分隔
          CollectDeptArr: [], // 登记单位,多选用逗号分隔
          IfInvestigation: '', // 是否排查，1是，0否,多选用逗号分隔
          IfCancellation: '', // 是否注销，1是，0否,多选用逗号分隔
          BeginDate: '', // 检索开始时间--检索结束时间
          EndDate: '',
          jingdu: '',
          weidu: ''
        }
        this.screen.options = [{
          title: '登记单位',
          prop: 'CollectDeptArr',
          props: {
            id: 'orgId',
            label: 'name',
            parentId: 'parentId',
            children: 'children'
          },
          type: 'treeSelect',
          children: []
        }, {
          title: '场所名称/场所类别',
          prop: 'Idnumber',
          type: 'input'
        }, {
          title: '开始时间',
          prop: 'BeginDate',
          type: 'datetime'
        }, {
          title: '结束时间',
          prop: 'EndDate',
          type: 'datetime'
        }, {
          title: '是否有隐患',
          prop: 'IfDanger',
          type: 'radio',
          children: [{
            label: '是',
            value: '1'
          }, {
            label: '否',
            value: '0'
          }]
        }, {
          title: '是否排查',
          prop: 'IfInvestigation',
          type: 'radio',
          children: [{
            label: '是',
            value: '1'
          }, {
            label: '否',
            value: '0'
          }]
        }, {
          title: '是否注销',
          prop: 'IfCancellation',
          type: 'radio',
          children: [{
            label: '是',
            value: '1'
          }, {
            label: '否',
            value: '0'
          }]
          // }, {
          //   title: '风险等级',
          //   prop: 'LevelArr',
          //   type: 'select',
          //   children: []
        }]
        this.querObj = {
          keyword: this.screen.filter.Idnumber,
          zdcslx: this.filterObject.FocusType, // 行业单位类型
          PageIndex: this.pagenav.currentpage, // 分页-当前页码
          PageSize: this.pagenav.limit * this.listType, // 分页-每页行数
          sfzx: this.screen.filter.IfCancellation, // 是否注销
          sfyyh: this.screen.filter.IfDanger, // 是否有隐患
          sfpc: this.screen.filter.IfInvestigation, // 是否排查登记
          // fxdj: this.screen.filter.LevelArr, // 风险登级
          djsjsx: this.screen.filter.BeginDate !== '' ? this.dateFormat(new Date(this.screen.filter.BeginDate), 'yyyy-MM-dd hh:mm:ss') : '', // 排查登记开始时间,
          djsjxx: this.screen.filter.EndDate !== '' ? this.dateFormat(new Date(this.screen.filter.EndDate), 'yyyy-MM-dd hh:mm:ss') : '', // 排查登记结束时间
          pcdw: '' // 排查登记单位
        }
      } else {
        this.screen.filter = {
          XingMing: '', // 姓名
          Idnumber: '', // 身份证号
          LevelArr: '', // 风险等级(字典)
          IfDanger: '', // 是否隐患,多选用逗号分隔
          CollectDeptArr: [], // 登记单位,多选用逗号分隔
          IfInvestigation: '', // 是否排查，1是，0否,多选用逗号分隔
          IfCancellation: '', // 是否注销，1是，0否,多选用逗号分隔
          BeginDate: '', // 检索开始时间--检索结束时间
          EndDate: ''
        }
        this.screen.options = [{
          title: '登记单位',
          prop: 'CollectDeptArr',
          props: {
            id: 'orgId',
            label: 'name',
            parentId: 'parentId',
            children: 'children'
          },
          type: 'treeSelect',
          children: []
        }, {
          title: '关键词',
          prop: 'Idnumber',
          type: 'input'
        }, {
          title: '开始时间',
          prop: 'BeginDate',
          type: 'datetime'
        }, {
          title: '结束时间',
          prop: 'EndDate',
          type: 'datetime'
        }, {
          title: '是否有隐患',
          prop: 'IfDanger',
          type: 'radio',
          children: [{
            label: '是',
            value: '1'
          }, {
            label: '否',
            value: '0'
          }]
        }, {
          title: '是否排查',
          prop: 'IfInvestigation',
          type: 'radio',
          children: [{
            label: '是',
            value: '1'
          }, {
            label: '否',
            value: '0'
          }]
        }, {
          title: '是否注销',
          prop: 'IfCancellation',
          type: 'radio',
          children: [{
            label: '是',
            value: '1'
          }, {
            label: '否',
            value: '0'
          }]
        }]
        this.querObj = {
          keyword: this.screen.filter.Idnumber, // 关键词
          zdcslx: this.filterObject.FocusType, // 场所类型
          PageIndex: this.pagenav.currentpage, // 分页-当前页码
          PageSize: this.pagenav.limit * this.listType, // 分页-每页行数
          sfzx: this.screen.filter.IfCancellation, // 是否注销
          sfyyh: this.screen.filter.IfDanger, // 是否有隐患
          sfpcdj: this.screen.filter.IfInvestigation, // 是否排查登记
          fxdj: this.screen.filter.LevelArr, // 风险登级
          djsjsx: this.screen.filter.BeginDate !== '' ? this.dateFormat(new Date(this.screen.filter.BeginDate), 'yyyy-MM-dd hh:mm:ss') : '', // 排查登记开始时间,
          djsjxx: this.screen.filter.EndDate !== '' ? this.dateFormat(new Date(this.screen.filter.EndDate), 'yyyy-MM-dd hh:mm:ss') : '', // 排查登记结束时间
          pcdjrdw: this.screen.filter.CollectDeptArr.join(',') // 排查登记单位
        }
      }
    },
    /**
     * [initsiberSearchContent 获取搜索条件]
     */
    siberSearchContent() {
      if(this.filterObject.FocusType === 'RQ003001') {
        this.querObj = {
          zdhylb: this.filterObject.FocusType, // 行业单位类型
          zdcslx: this.filterObject.FocusType, // 场所类型
          rqlb: this.filterObject.FocusType, // 人员类型
          cllx: this.filterObject.FocusType, // 车辆类型
          PageIndex: this.pagenav.currentpage, // 分页-当前页码
          PageSize: this.pagenav.limit * this.listType, // 分页-每页行数
          // xm: this.screen.filter.XingMing, // 姓名
          keyword: this.screen.filter.Idnumber, // 身份证
          sfzx: this.screen.filter.IfCancellation, // 是否注销
          sfyyh: this.screen.filter.IfDanger, // 是否有隐患
          sfpcdj: this.screen.filter.IfInvestigation, // 是否排查登记
          fxdj: this.screen.filter.LevelArr, // 风险登级
          djsjsx: this.screen.filter.BeginDate !== '' ? this.dateFormat(new Date(this.screen.filter.BeginDate), 'yyyy-MM-dd hh:mm:ss') : '', // 排查登记开始时间,
          djsjxx: this.screen.filter.EndDate !== '' ? this.dateFormat(new Date(this.screen.filter.EndDate), 'yyyy-MM-dd hh:mm:ss') : '', // 排查登记结束时间
          pcdjrdw: this.screen.filter.CollectDeptArr.join(',') // 排查登记单位
        }
      } else {
        this.querObj = {
          zdhylb: this.filterObject.FocusType, // 行业单位类型
          zdcslx: this.filterObject.FocusType, // 场所类型
          rqlb: this.filterObject.FocusType, // 人员类型
          cllx: this.filterObject.FocusType, // 车辆类型
          PageIndex: this.pagenav.currentpage, // 分页-当前页码
          PageSize: this.pagenav.limit * this.listType, // 分页-每页行数
          xm: this.screen.filter.XingMing, // 姓名
          keyword: this.screen.filter.Idnumber, // 身份证
          sfzx: this.screen.filter.IfCancellation, // 是否注销
          sfyyh: this.screen.filter.IfDanger, // 是否有隐患
          sfpcdj: this.screen.filter.IfInvestigation, // 是否排查登记
          fxdj: this.screen.filter.LevelArr, // 风险登级
          djsjsx: this.screen.filter.BeginDate !== '' ? this.dateFormat(new Date(this.screen.filter.BeginDate), 'yyyy-MM-dd hh:mm:ss') : '', // 排查登记开始时间,
          djsjxx: this.screen.filter.EndDate !== '' ? this.dateFormat(new Date(this.screen.filter.EndDate), 'yyyy-MM-dd hh:mm:ss') : '', // 排查登记结束时间
          pcdjrdw: this.screen.filter.CollectDeptArr.join(',') // 排查登记单位
        }
      }
    },
    /**
     * [handleCheckAllChange 全选事件]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    handleCheckAllChange(e) {
      let checkIdList = []
      if(e.target.checked) {
        this.list.forEach(d => {
          checkIdList.push(d.id)
        })
      } else {
        checkIdList = []
      }
      this.checkedSelects = checkIdList
    },
    /**
     * [handleCheckSingleChange 单选事件]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    handleCheckSingleChange(e, item) {
      if(!e.target.checked) {
        this.checkedSelects.forEach((m, i) => {
          if(m === item.id) {
            this.checkedSelects.splice(i, 1)
          }
        })
      }
    },
    /**
     * [handleSelectChange 列表元素多选框选中事件]
     * @param  {[type]} v [description]
     * @return {[type]}   [description]
     */
    handleSelectChange(v) {
      let checkedCount = v.length
      this.checkAll = checkedCount === this.list.length
    },

    /**
     * [unfoldHandle 外部操作更新窗体状态]
     * @param  {[type]} s [description]
     * @return {[type]}   [description]
     */
    unfoldHandle(s) {
      this.GetSysDictByType()
      this.unfoldT = s
    },
    /**
     * [handleCancel 取消管控]
     * @param  {[FocusType]} FocusType [重点对象类型，1：人员，2：车辆]
     * @param {[KeyIds]}  KeyId  [重点对象唯一ID，多个用逗号分隔]
     */
    handleCancel(FocusType, KeyId) {
      if(KeyId) {
        this.$confirm('确定要取消管控', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dispatch(REMOVE_REVOKED_FOCUS, { KeyIds: KeyId, FocusType: FocusType }).then(d => {
            this.$message('取消管控成功!')
            this.handleCate()
          })
        }).catch(() => {});
      } else if(this.checkedSelects.length > 0) {
        this.$confirm('确定要批量取消管控?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dispatch(REMOVE_REVOKED_FOCUS, { KeyIds: this.checkedSelects.join(','), FocusType: FocusType }).then(d => {
            this.$message('取消管控成功!')
            this.handleCate()
          }).catch(() => {});
        })
      } else {
        this.$message({ message: '请选择至少一条已注销的数据!', type: 'warning' })
      }
    },
    /**
     * [handleCancel 删除重点人员，车辆, 场所, 行业 ]
     * @param  {[FocusType]} FocusType [重点对象类型，1：人员，2：车辆，3：场所]
     * @param {[KeyIds]}  KeyId  [重点对象唯一ID，多个用逗号分隔]
     */
    handleDelete(FocusType, KeyId) {
      this.arr = []
      if(FocusType === 1) {
        if(KeyId) {
          this.$confirm('确定要删除该人员', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dispatch(FXPCGK_DELETE, { ids: KeyId, zdcslx: this.filterObject.FocusType }).then(d => {
              this.$message('删除成功!')
              this.handleCate()
            })
          }).catch(() => {});
        } else if(this.checkedSelects.length > 0) {
          this.$confirm('确定要批量删除?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.list.filter(d => { if(d.sfzx === '1') this.arr.push(d.id) })
            if(this.arr.sort().toString() === this.checkedSelects.sort().toString()) {
              this.dispatch(FXPCGK_DELETE, { ids: this.checkedSelects.join(','), zdcslx: this.filterObject.FocusType }).then(d => {
                this.$message('删除成功!')
                this.handleCate()
              }).catch(() => {});
            } else {
              this.$message('勾选项有未注销项,请重新勾选! ^^')
              return false
            }
          })
        } else {
          this.$message({ message: '请选择至少一条已注销的数据!', type: 'warning' })
        }
      } else if(FocusType === 2) {
        if(KeyId) {
          this.$confirm('确定要删除', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dispatch(FXPCGK_CASECAR_DELETE, { ids: KeyId, zdcslx: this.filterObject.FocusType }).then(d => {
              this.$message('删除成功!')
              this.handleCate()
            })
          }).catch(() => {});
        } else if(this.checkedSelects.length > 0) {
          this.$confirm('确定要批量删除?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.list.filter(d => { if(d.sfzx === '1') this.arr.push(d.id) })
            if(this.arr.sort().toString() === this.checkedSelects.sort().toString()) {
              this.dispatch(FXPCGK_CASECAR_DELETE, { ids: this.checkedSelects.join(','), zdcslx: this.filterObject.FocusType }).then(d => {
                this.$message('删除成功!')
                this.handleCate()
              }).catch(() => {});
            } else {
              this.$message('勾选项有未注销项,请重新勾选! ^^')
              return false
            }
          })
        } else {
          this.$message({ message: '请选择至少一条已注销的数据!', type: 'warning' })
        }
      } else if(FocusType === 3) {
        if(KeyId) {
          this.$confirm('确定要删除', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dispatch(FXPCGK_BASEPLACE_DELETE, { ids: KeyId, zdcslx: this.filterObject.FocusType }).then(d => {
              this.$message('删除成功!')
              this.handleCate()
            })
          }).catch(() => {});
        } else if(this.checkedSelects.length > 0) {
          this.$confirm('确定要批量删除?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.list.filter(d => { if(d.sfzx === '1') this.arr.push(d.id) })
            if(this.arr.sort().toString() === this.checkedSelects.sort().toString()) {
              this.dispatch(FXPCGK_BASEPLACE_DELETE, { ids: this.checkedSelects.join(','), zdcslx: this.filterObject.FocusType }).then(d => {
                this.$message('删除成功!')
                this.handleCate()
              }).catch(() => {});
            } else {
              this.$message('勾选项有未注销项,请重新勾选! ^^')
              return false
            }
          })
        } else {
          this.$message({ message: '请选择至少一条已注销的数据!', type: 'warning' })
        }
      } else if(FocusType === 4) {
        if(KeyId) {
          this.$confirm('确定要删除', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dispatch(FXPCGK_INDORG_DELETE, { ids: KeyId, zdhylb: this.filterObject.FocusType }).then(d => {
              this.$message('删除成功!')
              this.handleCate()
            })
          }).catch(() => {});
        } else if(this.checkedSelects.length > 0) {
          this.$confirm('确定要批量删除?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.list.filter(d => { if(d.sfzx === '1') this.arr.push(d.id) })
            if(this.arr.sort().toString() === this.checkedSelects.sort().toString()) {
              this.dispatch(FXPCGK_INDORG_DELETE, { ids: this.checkedSelects.join(','), zdcslx: this.filterObject.FocusType }).then(d => {
                this.$message('删除成功!')
                this.handleCate()
              }).catch(() => {});
            } else {
              this.$message('勾选项有未注销项,请重新勾选! ^^')
              return false
            }
          })
        } else {
          this.$message({ message: '请选择至少一条已注销的数据!', type: 'warning' })
        }
      } else if(FocusType === 6) {
        if(KeyId) {
          this.$confirm('确定要删除', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dispatch(FXPCGK_CLUE_DELETE, { ids: KeyId, zdhylb: this.filterObject.FocusType }).then(d => {
              this.$message('删除成功!')
              this.handleCate()
            })
          }).catch(() => {});
        } else if(this.checkedSelects.length > 0) {
          this.$confirm('确定要批量删除?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.list.filter(d => { if(d.sfzx === '1') this.arr.push(d.id) })
            if(this.arr.sort().toString() === this.checkedSelects.sort().toString()) {
              this.dispatch(FXPCGK_CLUE_DELETE, { ids: this.checkedSelects.join(','), zdhylb: this.filterObject.FocusType }).then(d => {
                this.$message('删除成功!')
                this.handleCate()
              }).catch(() => {});
            } else {
              this.$message('勾选项有未注销项,请重新勾选! ^^')
              return false
            }
          })
        } else {
          this.$message({ message: '请选择至少一条已注销的数据!', type: 'warning' })
        }
      }
    },
    /**
     * [addStudy 加入研判]
     * @param  {[FocusType]} FocusType [重点对象类型，1：人员，2：车辆]
     * @param {[KeyIds]}  KeyId  [重点对象唯一ID，多个用逗号分隔]
     */
    addStudy(FocusType, KeyId, FocusId) {
      if(KeyId) {
        this.object = {
          KeyId: KeyId,
          FocusType: FocusType,
          FocusId: FocusId
        }
        this.dialogStudy = true
      } else if(this.checkedSelects.length > 0) {
        // 加入研判[多选]
        this.object = {
          KeyId: this.checkedSelects.join(','),
          FocusType: FocusType
        }
        this.dialogStudy = true
      } else {
        this.$message({ message: '请选择至少一条已注销的数据!', type: 'warning' })
      }
    },
    /**
     * [showDossierPeople 查看档案]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    showDossierFocus(FocusType, KeyId, clxh = '', fdjh = '') {
      let Focuslink
      if(FocusType === 1) {
        Focuslink = '/dossier/people?key=' + KeyId
      } else {
        Focuslink = '/dossier/car?key=' + KeyId + '|' + fdjh + '|' + clxh
      }
      const url = ['http://', location.host, location.pathname, '#', Focuslink].join('');
      window.open(url);
      // this.$router.push('/dossier/people')
    },
    /**
     * [handleControlFlow 管控流转]
     * @param  {[type]} keyId [description]
     * @return {[type]}       [description]
     */
    handleControlFlow(FocusType, keyId, RyName) {
      if(keyId) {
        this.object = {
          KeyId: keyId,
          FocusType: FocusType,
          FocusName: RyName
        }
        this.dialogControlFlow = true
      } else if(this.checkedSelects.length > 0) {
        this.object = {
          KeyId: this.checkedSelects.join(','),
          FocusType: FocusType
        }
        this.dialogControlFlow = true
      } else {
        this.$message({ message: '请选择至少一条已注销的数据!', type: 'warning' })
      }
    },
    /**
     * [handleControlRecord 打开流转记录窗口]
     * @param  {[FocusType]} FocusType [重点对象类型，1：人员，2：车辆]
     * @param {[KeyId]}  id  [重点对象唯一ID]
     */
    handleControlRecord(FocusType, KeyId) {
      this.object = {
        KeyId: KeyId,
        FocusType: FocusType
      }
      this.dialogRecord = true
    },
    /**
     * [handleApproval 审批[车辆人员区别未确定]]
     * @param  {[type]} object [description]
     * @return {[type]}        [description]
     */
    handleApproval(object) {
      this.object = object
      this.dialogApproval = true
    },
    /**
     * [handleSign 待我签收]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    handleSign(id) {
      if(id) {
        this.keyId = id
        this.dialogSign = true
      } else if(this.checkedSelects.length > 0) {
        // 待我签收[多选]
        this.keyId = this.checkedSelects.join(',')
        this.dialogSign = true
      } else {
        this.$message({ message: '请选择至少一条已注销的数据!', type: 'warning' })
      }
    },
    /**
     * [handlePeopleInfo 查看个人/车辆基本信息]
     * @param  {[type]} keyId [description]
     * @return {[type]}       [description]
     */
    handlePeopleInfo(fucusName, keyId, contentType) {
      this.object = {
        contentType: contentType,
        fucusName: fucusName,
        keyId: keyId
      }
      this.peopleInfoDialog = true
    }
  },
  mounted() {},
  created() {}
}
