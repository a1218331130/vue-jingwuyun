import { FETCH_BILL_BASIC_LIST } from '../../../store/types'
import { mapState } from 'vuex'
import baseListMixin from '../baseListMixin'

export default {
  mixins: [baseListMixin],
  components: {},
  data() {
    return {
      goOptions: {
        readOnly: false,
        allowZoom: true,
        layout: 'LayeredDigraphLayout'
      },
      miniModel: false,
      baseQueryForm: {
        chartName: 'chart1',
        targetBank: '',
        targetAccound: '',
        sourceAccound: '',
        type: '',
        modelType: '1',
        summay: '',
        cycle: 0,
        minAmount: '',
        timeInterval2: 30,
        maxAmount: '',
        method: ['1', '10'],
        netDot: '',
        commAccound: 2,
        commAccound2: 1,
        interval: 1,
        resData: [],
        detailData: [],
        chartData: {
          color: ['#3398DB'],
          tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
          grid: { left: '5%', bottom: '15%', containLabel: true },
          xAxis: [{ data: [], axisTick: { alignWithLabel: true } }],
          yAxis: [{ type: 'value' }],
          legend: {
            data: ['交易金额']
          },
          dataZoom: [{ type: 'inside' }],
          series: [{
            name: '交易金额',
            type: 'bar',
            smooth: 0.3,
            barWidth: '35%',
            data: []
          }]
        },
        rowGuid: '', // 详情页参数
        rowdfzh: '', // 详情页对方帐号
        rowMinrq: '',
        rowMaxrq: '',
        rowJywddm: '',
        rowJywdmc: '',
        pagenav: { // 页面分页信息相关配置
          count: 10,
          limit: 500,
          currentpage: 1
        },
        pageInfo: { // 详情页分页
          currentpage: 1,
          limit: 500,
          count: 0
        },
        chartData2: {
          title: {
            text: ''
          },
          tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
          legend: {
            data: ['交易次数']
          },
          grid: { left: '5%', bottom: '15%', containLabel: true },
          dataZoom: [{ type: 'inside' }],
          xAxis: {
            data: ['0000001', '0000002', '0000003', '0000004', '0000005', '0000006'],
            axisTick: { alignWithLabel: true }
            // axisLabel: { interval: 0, rotate: 40, height: 200 }
          },
          yAxis: [{ type: 'value' }],
          series: [{
            name: '交易次数',
            type: 'line',
            showSymbol: false,
            data: [0, 0, 0, 0, 0, 0],
            markPoint: { data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }] }
          }]
        },
        timeInterval: '',
        timeSlotArr: this.defaultDatePicker(),
        timeSlot: this.defaultDatePicker(),
        timeSlotArr2: this.defaultDatePicker(),
        timeSlot2: this.defaultDatePicker()
      },
      typeOps: [
        { label: '全部', value: '' }, { label: '转出', value: 0 }, { label: '转入', value: 1 }, { label: '现存', value: 2 }, { label: '现取', value: 3 }, { label: '其他收入', value: 4 }, { label: '其他支出', value: 5 }
      ],
      summayOps: [
        { label: '金额转出', value: 0 }, { label: '金额转入', value: 1 }, { label: '报销转入', value: 2 }
      ],
      timeOps: [{ label: '全部', value: '' },
        { label: '凌晨[00:00-06:00]', value: '00:00-06:00' }, { label: '早晨[06:00-08:00]', value: '06:00-08:00' }, { label: '上午[08:00-11:00]', value: '08:00-11:00' },
        { label: '中午[11:00-13:00]', value: '11:00-13:00' }, { label: '下午[13:00-18:00]', value: '13:00-18:00' }, { label: '晚上[18:00-22:00]', value: '18:00-22:00' },
        { label: '深夜[22:00-23:59]', value: '22:00-23:59' }
      ],
      cycleOps: [
        { label: '天', value: 0 }, { label: '周', value: 1 }, { label: '月', value: 2 }, { label: '年', value: 3 }
      ],
      resBox: false,
      mainBox: false,
      detailBox: false,
      timeInterval2: [
        { label: '10分钟前后', value: 10 },
        { label: '30分钟前后', value: 30 },
        { label: '1小时前后', value: 60 },
        { label: '2小时前后', value: 120 },
        { label: '5小时前后', value: 300 },
        { label: '1天前后', value: 1440 },
        { label: '2天前后', value: 2880 },
        { label: '5天前后', value: 7200 }
      ],
      table: {
        columnA: [{ label: '序号', prop: 'R' },
          { label: '姓名', prop: 'KHR' },
          { label: '账号', prop: 'ZZH' },
          { label: '交易卡号', prop: 'JYKH' },
          { label: '交易次数', prop: 'ZCS' },
          { label: '收入总额(元)', prop: 'SKZE' },
          { label: '支出总额(元)', prop: 'ZCZE' }
        ],
        columnB: [],
        columnC: [
          { label: '序号', prop: 'r' },
          { label: '主账号', prop: 'zzh' },
          { label: '交易卡号', prop: 'jykh' },
          { label: '主账号所属行', prop: 'zzhssh' },
          { label: '开户名', prop: 'khm' },
          { label: '对方账号', prop: 'dfzh' },
          { label: '对方账户所属行', prop: 'dfzhssh' },
          { label: '对方开户名', prop: 'dfkhm' },
          { label: '交易日期', prop: 'jyrq' },
          { label: '交易时间', prop: 'jysj' },
          { label: '即时余额', prop: 'jsye' },
          { label: '交易类型', prop: 'jylx' },
          { label: '摘要', prop: 'zy' },
          { label: '交易金额', prop: 'jyje' },
          { label: '交易网点', prop: 'jywdmc' },
          { label: '对方身份证号码', prop: 'dfsfzhm' },
          // { label: '身份类型代码', prop: 'sflxdm' },
          { label: '单位名称', prop: 'dwmc' }
        ],
        data: [],
        resData: [],
        selectAccound: [],
        detailData: []
      }
    }
  },
  computed: {
    ...mapState(['analysisBill'])
  },
  methods: {
    fetchBasicList(isComp = false, check = true) {
      if(isComp === true && check === true && this.currentTabItem.guid.length < 2) {
        this.$alert('必需选择一个以上不同的账号', '温馨提示');
        return false
      }
      let target = this.currentTabItem,
        queryForm = this.delEmpey({
          v_rwid: '', // 任务ID
          v_zzh: isComp === true ? target.vals.join(',') : target.keyVal, // 主账号 String 否
          v_zdid: isComp === true ? target.guid.join('|') : target.guid, // 账单id String 是
          v_edsx: target.queryForm.maxAmount, // 额度上限 Numeric 否
          v_edxx: target.queryForm.minAmount, // 额度下限 Numeric 否
          v_jywd: target.queryForm.netDot, // 交易网点 String 否
          v_zy: target.queryForm.summay, // 摘要 String 否
          v_dfzh: target.queryForm.targetAccound, // 对方账号 String 否
          v_jylx: target.queryForm.type, // 交易类型（0转入，1转出） String 是
          v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 格式 yyyy-mm-dd String 否
          v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 格式 yyyy-mm-dd String 否
          v_dfssh: target.queryForm.targetBank, // 对方所属行 String 否
          v_sd: target.queryForm.timeInterval // 时段 String 否
        })
      this.dispatch(FETCH_BILL_BASIC_LIST, queryForm).then(() => {
        this.table.data = this.analysisBill.basicList.JBZHFXList
      })
    }
  },
  watch: {}
}
