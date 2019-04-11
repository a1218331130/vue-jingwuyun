export default {
  components: {},
  data() {
    return {
      table: { // 各类表格数据
        aqyh: [ // 安全隐患
          { label: '排查类型', prop: 'pclx' },
          { label: '风险等级', prop: 'fxdjmc' },
          { label: '登记时间', prop: 'cjsj' },
          { label: '登记人姓名', prop: 'cjrxm' },
          { label: '登记单位', prop: 'cjdwmc' }
          // { label: '风险隐患点', prop: 'fxyhd' },
          // { label: '风险值', prop: 'fxz' },
          // { label: '隐患性质', prop: 'yhxz' },
          // { label: '风险隐患描述', prop: 'fxyhms' }
        ],
        gxr: [ // 关系人
          { label: '证件类型', prop: 'zjlxmc' },
          { label: '证件号码', prop: 'zjhm' },
          { label: '中文姓名', prop: 'zwxm' },
          { label: '关系', prop: 'gxmc' },
          { label: '联系电话', prop: 'lxdh' },
          { label: '是否有固定职业', prop: 'sfygdzy' },
          { label: '现住地详址', prop: 'xzdxz' }
        ],
        hdgj: [ // 活动轨迹
          { label: '活动发生起始时间', prop: 'qssj' },
          { label: '活动发生结束时间', prop: 'jssj' },
          { label: '信息类别', prop: 'dtxxlbmc' },
          { label: '活动发生区域', prop: 'hdfsqy' },
          { label: '活动发生场所', prop: 'hdfscs' },
          { label: '活动发生详址', prop: 'hdfsxz' },
          { label: '数据来源', prop: 'sjlx' }
        ],
        xsxx: [ // 线索
          { label: '信息种类', prop: 'xxzl' },
          { label: '信息来源', prop: 'xxly' },
          { label: '信息真实性', prop: 'xxzsx' },
          { label: '信息预警性', prop: 'xxyjx' },
          { label: '涉及事件', prop: 'sjsj' },
          { label: '登记时间', prop: 'cjsj' }
        ],
        jtqk: [ // 家庭情况
          { label: '姓名', prop: 'xm' },
          { label: '身份证号', prop: 'sfzh' },
          { label: '性别', prop: 'xbmc' },
          { label: '户籍地详址', prop: 'hjdxz' },
          { label: '现住地详址', prop: 'xzdxz' },
          // { label: '出生日期', prop: 'csrq' },
          { label: '联系电话', prop: 'lxdh' },
          { label: '与房主关系', prop: 'gx' },
          { label: '数据来源', prop: 'sjlx' }
        ],
        grcl: [ // 个人车辆
          { label: '号牌号码', prop: 'hphm' },
          { label: '车辆类型', prop: 'cllxmc' },
          { label: '使用性质', prop: 'clsyxzmc' },
          { label: '车辆所有权', prop: 'clsyqmc' },
          { label: '车辆品牌', prop: 'clpp' },
          { label: '车辆所有者', prop: 'clsyz' },
          { label: '车辆颜色', prop: 'csysmc' },
          { label: '数据来源', prop: 'sjlx' }
        ],
        shll: [ // 社会履历
          { label: '开始时间', prop: 'kssj' },
          { label: '结束时间', prop: 'jssj' },
          { label: '学习服务处所', prop: 'xxfwcs' },
          { label: '职务', prop: 'zw' },
          { label: '登记时间', prop: 'cjsj' }
        ],
        ltgj: [ // 联通工具
          { label: '联系方式类型', prop: 'lxfslxmc' },
          { label: '联系方式', prop: 'lxfs' },
          { label: '地址', prop: 'dz' },
          { label: '备注', prop: 'bz' },
          { label: '数据来源', prop: 'sjlx' }
        ],
        jrzh: [ // 金融账户
          { label: '帐号类型', prop: 'zhlx' },
          { label: '开户行', prop: 'khh' },
          { label: '帐号', prop: 'zh' },
          { label: '数据来源', prop: 'sjlx' }
        ],
        swzc: [ // 实物资产
          { label: '资产类别', prop: 'zclb' },
          { label: '资产名称', prop: 'zcmc' },
          { label: '资产地址', prop: 'zcdz' },
          { label: '登记时间', prop: 'cjsj' }
        ],
        wxzc: [ // 无形资产
          { label: '资产名称', prop: 'zcmc' },
          { label: '证书编号', prop: 'zsbh' },
          { label: '简要描述', prop: 'jyms' },
          { label: '登记时间', prop: 'cjsj' }
        ],
        wfwg: [ // 违法违规
          { label: '违法时间', prop: 'wfsj' },
          { label: '违法地点', prop: 'wfdd' },
          { label: '简要情况', prop: 'jyqk' },
          { label: '证据情况', prop: 'zjqk' },
          { label: '登记时间', prop: 'cjsj' }
        ],
        cfcf: [ // 处罚处分
          { label: '处罚时间', prop: 'cfsj' },
          { label: '处罚单位', prop: 'cfdw' },
          { label: '处罚情况', prop: 'cfqk' },
          { label: '处罚原因', prop: 'cfyy' },
          { label: '登记时间', prop: 'cjsj' }
        ],
        lssf: [ // 历史上访
          { label: '历史上访事件', prop: 'cfsj' },
          { label: '前往省市', prop: 'cfdw' },
          { label: '具体上访地点', prop: 'cfqk' },
          { label: '处置情况', prop: 'cfyy' }
        ],
        fknr: [ // 反馈内容
          { label: '在京情况', prop: 'cfsj' },
          { label: '联通方式', prop: 'cfdw' },
          { label: '赴京意图', prop: 'cfqk' },
          { label: '同行人身份证号', prop: 'cfyy' },
          { label: '同行人员', prop: 'cjsj' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  methods: {},
  mounted() {},
  created() {}
}
