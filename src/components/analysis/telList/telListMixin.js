import {mapState} from 'vuex'
import baseListMixin from '../baseListMixin'

export default {
  mixins: [baseListMixin],
  data() {
    return {
      goOptions: {
        layout: 'CircularLayout', // 'GridLayout': 网格 'LayeredDigraphLayout': 分层, 'CircularLayout': 圆形, 'ForceDirectedLayout': 反牵引力, 'TreeLayout': 树形
        readOnly: false, // 只读
        allowZoom: true, // 允许缩放
        overview: '', // 预测图
        contextMenuElm: '',
        linkNodeClickEvent: (e, node) => {
        }
      },
      baseQueryForm: {
        attribution: '',
        otherPhone: '',
        placeCall: '',
        callType: '',
        callDate: '',
        tabList: [],
        callTime: 0,
        timeInterval2: 30,
        timeInterval3: '',
        numberOf: 1,
        timeType: 0,
        timeSlotArr: this.defaultDatePicker(),
        timeSlot: this.defaultDatePicker(),
        timeSlotArr2: this.defaultDatePicker(),
        timeSlot2: this.defaultDatePicker(),
        timeLeght: '',
        timeLabel: '>=',
        callCountLabel: '>=',
        callCount: '',
        callArea: '',
        stationCode: '',
        timeM: 8,
        timeN: 18,
        degree: 5,
        timeInterval: 4,
        diffTime: '15',
        diffDistance: '300',
        excepType: 3,
        peopleNum: 2,
        cycle: 0,
        isTime: false // 基站分析通话查询类型
      },
      callTypeList: [{
        label: '全部',
        value: ''
      }, {
        label: '主叫',
        value: '主叫'
      }, {
        label: '被叫',
        value: '被叫'
      }],
      timeTypeList: [{
        label: '全部',
        value: 0
      }, {
        label: '当天早晚',
        value: 1
      }, {
        label: '隔天早晚',
        value: 2
      }, {
        label: '非工作时间',
        value: 3
      }],
      cycleList: [{ // 1年，2月，3周，4天，5小时
        label: '地点',
        value: 0
      }, {
        label: '年',
        value: 1
      }, {
        label: '月',
        value: 2
      }, {
        label: '周',
        value: 3
      }, {
        label: '天',
        value: 4
      }, {
        label: '小时',
        value: 5
      }],
      timeLabelList: [],
      timeInterval: [{
        label: '小时天',
        value: 5,
        chartOptions: null
      }, {
        label: '小时',
        value: 0,
        chartOptions: null
      }, {
        label: '天',
        value: 1,
        chartOptions: null
      }, {
        label: '星期',
        value: 2,
        chartOptions: null
      }, {
        label: '月',
        value: 3,
        chartOptions: null
      }, {
        label: '年',
        value: 4,
        chartOptions: null
      }],
      timeInterval2: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '10分钟前后',
          value: 10
        },
        {
          label: '30分钟前后',
          value: 30
        },
        {
          label: '1小时前后',
          value: 60
        },
        {
          label: '2小时前后',
          value: 120
        },
        {
          label: '5小时前后',
          value: 300
        },
        {
          label: '1天前后',
          value: 1440
        },
        {
          label: '2天前后',
          value: 2880
        },
        {
          label: '5天前后',
          value: 7200
        }
      ],
      timeInterval3: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '凌晨[00:00-06:00]',
          value: '00:00-06:00'
        },
        {
          label: '早晨[06:00-08:00]',
          value: '06:00-08:00'
        },
        {
          label: '上午[08:00-11:00]',
          value: '08:00-11:00'
        },
        {
          label: '中午[11:00-13:00]',
          value: '11:00-13:00'
        },
        {
          label: '下午[13:00-18:00]',
          value: '13:00-18:00'
        },
        {
          label: '晚上[18:00-22:00]',
          value: '18:00-22:00'
        },
        {
          label: '深夜[22:00-23:59]',
          value: '22:00-23:59'
        }
      ]
    }
  },
  computed: {
    ...mapState(['analysisTelList'])
  }
}
