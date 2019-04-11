import { mapState } from 'vuex'
import baseListMixin from '../baseListMixin'

export default {
  mixins: [baseListMixin],
  data() {
    return {
      loadingFlag: [false, false, false, false, false],
      activeName: '0',
      baseQueryForm: {
        pageInfo: {
          count: 10,
          limit: 10,
          currentpage: 1
        },
        addItem: {
          keyVal: '',
          name: '',
          flag: false
        },
        xm: '',
        secondList: [],
        threeList: [],
        locusData: [],
        mapMainList: [],
        graph: '',
        subKey: '',
        startTime: '',
        endTime: '',
        jd: '',
        wd: '',
        radio: false,
        lines: '', // 地图画线
        timeSlotArr2: [
          this.dateFormat(new Date(), 'yyyy-MM-dd'),
          this.dateFormat(new Date(), 'yyyy-MM-dd')
        ],
        timeSlot: [],
        address: '',
        cohabitCount: '1',
        resList: [],
        errorTime: '12',
        roomRange: '1',
        roomNumber: '',
        personRange: '1',
        personType: '',
        person: '',
        relevanceType: '1',
        starting: '',
        bourn: '',
        togetherType: '1',
        seatRow: '3',
        firstLoading: false,
        twoLoading: false,
        threeLoading: false,
        name: '',
        ID: '',
        location: '',
        distance: 1000,
        cohabitTime: '1',
        stayTime: '',
        resBox: false,
        basicBox: false,
        detailCountArr: {
          city: 0,
          hotel: 0,
          jzd: 0,
          tx: 0,
          tz: 0,
          work: 0
        },
        cohabitBox: false,
        contrastBox: false,
        mapBox: false,
        ruleBox: false,
        specificBox: false,
        togetherBox: false,
        ruleLoading: false,
        basicLoading: false,
        cohabitLoading: false,
        contrastLoading: false,
        mapLoading: false,
        specificLoading: false,
        togetherLoading: false,
        barData: null,
        dialogLoading: null,
        timeInterval: [{
          label: '小时',
          value: 0,
          echartOption: null,
          loading: false
        }, {
          label: '天',
          value: 1,
          echartOption: null,
          loading: false
        }, {
          label: '星期',
          value: 2,
          echartOption: null,
          loading: false
        }, {
          label: '月',
          value: 3,
          echartOption: null,
          loading: false
        }, {
          label: '年',
          value: 4,
          echartOption: null,
          loading: false
        }],
        tableData: {
          d0: null,
          d1: null,
          d2: null,
          d3: null,
          d4: null,
          d5: null
        },
        loadingArr: {
          d0: false,
          d1: false,
          d2: false,
          d3: false,
          d4: false,
          d5: false
        },
        showInfoList: [],
        mainList: {
          d0: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d1: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d2: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d3: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d4: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d5: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          }
        },
        basicList: {
          d0: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d1: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d2: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d3: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d4: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d5: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          }
        },
        togetherList: {
          d0: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d1: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d2: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d3: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d4: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d5: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          }
        },
        cohabitList: {
          d0: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d1: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d2: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d3: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d4: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d5: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          }
        },
        contrastList: {
          d0: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d1: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d2: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d3: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d4: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d5: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          }
        },
        ruleList: {
          d0: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d1: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d2: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d3: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d4: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d5: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          }
        },
        specificList: {
          d0: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d1: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d2: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d3: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d4: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d5: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          }
        },
        mapList: {
          d0: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d1: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d2: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d3: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d4: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          },
          d5: {
            tabData: 'null',
            pageInfo: {
              count: 10,
              limit: 10,
              currentpage: 1
            }
          }
        },
        callTypeList: [
          {
            label: '全部',
            value: ''
          }, {
            label: '主叫',
            value: '主叫'
          }, {
            label: '被叫',
            value: '被叫'
          }
        ],
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
        timeLabelList: []
      }
    }
  },
  methods: {},
  computed: {
    ...mapState(['analysisLocus']),
    num() {
      if(this.tabs[this.currentTab].queryForm.resList.length === 0) {
        return 110;
      } else {
        return this.tabs[this.currentTab].queryForm.resList.length * 95 + 35
      }
    }
  }
}
