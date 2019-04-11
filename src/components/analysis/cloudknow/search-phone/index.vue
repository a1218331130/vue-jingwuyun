<template>
<el-layout class="app-layout" :fit="true" style="overflow: hidden;min-height:600px">
  <!-- 通顶 -->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar>
      <div slot="search">
        <span class="sub-title">云知道</span>
        <div class="search-input" @keyup.13="search()" v-show="type!=='3'">
          <el-input v-model="inputValue" style="width:446px">
            <el-button slot="append" icon="search" @click="search()" class="search-btn" style="width:72px;padding-right:15px;"></el-button>
          </el-input>
        </div>
        <!-- 关系类型：搜索框 -->
        <div class="search-input" @keyup.13="relativeSearch()" v-show="type==='3'">
          <div class="relative-search">
            <input class="frist-keyword" v-model="relativeFirstKey">
            </input>
            <div class="relative-icon iconfont icon-hudong"></div>
            <input class="second-keyword" v-model="relativeSecondKey">
            </input>
            <div class="search-btn" @click="relativeSearch()">
              <i class="iconfont icon-sousuo"></i>
            </div>
          </div>
        </div>
      </div>
    </top-bar>
  </el-region>
  <!-- 内容 -->
  <el-region class="app-center" slot="center" type="center" style="overflow: hidden">
    <div style="height:calc(100vh - 60px)">
      <!-- tab栏 -->
      <el-tabs class="search-type" v-model="type">
        <el-tab-pane v-for="item in tabs" :key="item.value" :label="item.label" :name="item.value.toString()"></el-tab-pane>
      </el-tabs>

      <!-- 查询信息栏 -->
      <el-row class="search-function">
        <el-col :span="18">
          <!-- 搜索 -->
          <div class="result-summary" v-show="type==='1'">
          </div>
          <!-- 可能认识的人 -->
          <div class="result-summary" v-show="type==='2'">
            <span class="search-key" v-show="profile.account!==''">
              {{profile.account}} / 归属地 : {{addressFormat(profile.location)}}
            </span>
            <span class="search-type">
              可能认识的人
            </span>
          </div>
          <!-- 共同认识的人 -->
          <div class="result-summary" v-show="type==='3'">
            <span class="search-key" v-show="firstNumber.account!==''">
              {{firstNumber.account + '('+addressFormat(firstNumber.location)+')'}} 和 {{secondNumber.account + '('+addressFormat(firstNumber.location)+')'}}
            </span>
            <span class="search-type">
              共同认识的人
            </span>
          </div>
        </el-col>
        <!-- <el-col :span="18">

        </el-col> -->
        <!-- 二次搜索框 -->
        <el-col :span="6">
          <div class="search-tools" @keyup.13="secondSearch">
            <el-input placeholder="输入关键字进行二次检索" v-model="secondKey" :on-icon-click="secondSearch" icon="search" size="small" style="width: 200px"></el-input>
            <!-- <el-button size="small" @click="screenshotState=true"><i class="iconfont icon-image"></i>快照</el-button> -->
            <!-- <el-button size="small"><i class="iconfont icon-paixu"></i>排序</el-button> -->
            <!-- <el-button size="small"><i class="iconfont icon-folder-open"></i> 临时存储 0</el-button> -->
          </div>
        </el-col>
      </el-row>

      <!-- 查询内容区 -->
      <div class="result-list" ref="list">
        <!-- 搜索列表 -->
        <xdh-scroll :on-reach-bottom="handleReachBottom" :distance-to-edge="-150" :height="listHeight" :total="total" :personList="searchList" v-show="type==='1'">
          <search-content v-for="(item,i) in searchList" :key="i" :dataList="item"></search-content>
        </xdh-scroll>
        <!-- 可能认识人的列表 -->
        <xdh-scroll :on-reach-bottom="handleReachBottom" :distance-to-edge="-150" :height="listHeight" :total="total" :personList="knowList" v-show="type==='2'">
          <search-content v-for="(item,i) in knowList" :key="i" :dataList="item"></search-content>
        </xdh-scroll>
        <!-- 关系列表 -->
        <xdh-scroll :on-reach-bottom="handleReachBottom" :distance-to-edge="-150" :height="listHeight" :total="total" :personList="relativeList" v-show="type==='3'">
          <search-content v-for="(item,i) in relativeList" :key="i" :dataList="item"></search-content>
        </xdh-scroll>
        <!-- 结果为空 -->
        <div class="empty empty--tips" v-if="total===0">
          <span>暂无符合“{{keyword}}”的数据，请更换关键字搜索。</span>
        </div>
        <!-- 加载动画 -->
        <div :class="{'el-loading-mask':true,'action':loading}" v-show="loading">
          <div class="el-loading-spinner loader--circular">
            <svg viewBox="25 25 50 50" class="circular">
                <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
              </svg>
          </div>
        </div>
      </div>
    </div>
  </el-region>
</el-layout>
</template>

<style lang="scss" scoped>
.search-input {
    display: inline-block;
    vertical-align: top;
    padding-top: 10px;
    padding-left: 20px;
    .relative-search {
        display: flex;
        & > div,
        & > input {
            height: 40px;
            line-height: 40px;
            position: relative;
            border: none;
            outline: none;
            padding: 0 10px;
            box-sizing: border-box;
            &.search-btn {
                width: 72px;
                padding: 0 15px;
                background: #3699e2;
                border-top-right-radius: 2px;
                border-bottom-right-radius: 2px;
                cursor: pointer;
                .iconfont {
                    font-size: 23px;
                    color: #fff;
                    position: relative;
                    top: 3px;
                    left: 8px;
                }
            }
            &.frist-keyword,
            &.second-keyword {
                width: 170px;
                background: #fff;
            }
            &.relative-icon {
                width: 34px;
                background: #fff;
                &.iconfont {
                    font-size: 20px;
                }
            }
            &.frist-keyword {
                border-top-left-radius: 2px;
                border-bottom-left-radius: 2px;
            }
        }
    }
}

.search-type {
    margin-bottom: 0;
    font-size: 20px;
    color: #666;
}

.search-function {
    background: #fff;
    border-bottom: 1px solid #ccc;
}

.result-summary {
    padding-left: 15px;
    height: 40px;
    line-height: 40px;
    .search-key {
        font-size: 20px;
        font-weight: 700;
        color: #666;
    }
    // .keyword {
    //     margin-right: 0;
    //     .iconfont {
    //         visibility: hidden;
    //         color: #8391a5;
    //     }
    //     &:hover {
    //         .iconfont {
    //             visibility: visible;
    //         }
    //     }
    // }
}

// .result-summary span {
//     color: orangered;
//     margin-right: 20px;
// }

.search-tools {
    text-align: right;
    padding-right: 15px;
    padding-top: 4px;
}

.search-tools .el-input {
    margin-right: 10px;
}

.search-tools .iconfont {
    font-size: 14px;
}

.result-list {
    padding: 0;
    height: calc(100vh - 100px);
    overflow: hidden;
}
</style>
<style lang="scss" scoped>
.el-form--inline .el-form-item__label {
    padding-right: 4px;
}

.result-wd .el-form-item__label {
    font-size: 12px;
}

.result-wd .el-form-item__content {
    font-size: 12px;
}
.el-form-item__content {
    line-height: 30px;
}

.el-form-item__content span {
    line-height: 30px;
    color: #333;
}
.el-input__inner {
    height: 36px;
}
.el-tabs__item {
    width: 120px;
    text-align: center;
}
.el-tab-pane {
    width: 120px;
}

.el-form-item__label {
    padding: 0;
    line-height: 30px;
}
// 隔行变色
.result-item.changeColor {
    background-color: #f4f9fd;
}
.result-list {
    padding: 4px;
}
.result-item:last-child {
    margin-bottom: 10px;
}
</style>

<script>
// import { mapState } from 'vuex'
import TopBar from '../../../common/topbar/index.vue'
import XdhScroll from '../../../../widgets/xdh-scroll'
import mixin from '../../../../utils/mixin'
import searchContent from './item/search-item.vue'

export default {
  components: {
    TopBar,
    XdhScroll,
    searchContent
  },
  mixins: [mixin],
  data() {
    return {
      type: '1', // 默认搜索类型
      secondKey: '', // 二次搜索关键词
      listHeight: 500, // 默认列表高度
      inputValue: '', // 输入值
      keyword: '', // 搜索词
      tabs: [{ label: '搜索', value: '1' }, { label: '认识的人', value: '2' }, { label: '关系', value: '3' }], // tab类型
      searchList: [], // 结果列表
      knowList: [], // 可能认识的人列表
      relativeList: [], // 关系列表
      firstNumber: { // 关系类型：第一个人信息
        account: '',
        name: [''],
        location: '',
        score: 0
      },
      secondNumber: { // 关系类型：第二个人信息
        account: '',
        name: [''],
        location: '',
        score: 0
      },
      relativeFirstKey: '', // 关系类型：第一个关键词
      relativeSecondKey: '', // 关系类型：第二个关键词
      profile: { // 可能认识的人类型： 第一人信息
        account: '',
        name: [''],
        location: '',
        score: 0
      },
      testData: {
        'status': 200,
        'qtime': 42,
        'totalrows': 110,
        'profile': {
          'account': '13813900000',
          'name': ['王**', '山*'],
          'location': '/中国/江苏/南京',
          'score': 0
        },
        'mayknow': [{
          'account': '13813930000',
          'name': ['李**'],
          'location': '/中国/江苏/南京',
          'score': 100
        }, {
          'account': '13505170000',
          'name': ['尚**'],
          'location': '/中国/江苏/南京',
          'score': 85
        }, {
          'account': '******',
          'name': ['******', '******'],
          'location': '******',
          'score': 65
        }]
      },
      relativeData: {
        'status': 200,
        'qtime': 106,
        'totalrows': 28,
        'source': {
          'account': '13813900000',
          'name': ['王**'],
          'location': '/中国/江苏/南京',
          'score': 0
        },
        'target': {
          'account': '13813900000',
          'name': ['许*'],
          'location': '/中国/江苏/南京',
          'score': 0
        },
        'mayknows': [{
          'account': '13776600000',
          'name': ['盛**'],
          'location': '/中国/江苏/南京',
          'score': 46
        }, {
          'account': '18652900000',
          'name': ['卢**'],
          'location': '/中国/江苏/南京',
          'score': 54
        }, {
          'account': '***',
          'name': ['***'],
          'location': '',
          'score': 0
        }]
      }
    }
  },
  props: {},
  methods: {
    // 滚动加载功能
    handleReachBottom() {
      console.log(123)
    },
    // 重置屏幕尺寸
    handleResize() {
      if(this.$refs.list) {
        let rect = this.$refs.list.getBoundingClientRect()
        this.listHeight = rect.height - 60
      }
    },
    // 搜索功能
    search() {
      this.loading = true
      setTimeout(() => {
        this.profile = this.testData.profile
        this.knowList = this.testData.mayknow
        this.loading = false
      }, 2000)
    },
    // 二次搜索功能
    secondSearch() {
      console.log(this.secondKey, '456')
    },
    // 地址格式化
    addressFormat(val) {
      if(!val) return
      let res = val.split('/').slice(1).join('-')
      return res
    },
    // 关系类型搜索
    relativeSearch() {
      if(!this.relativeDecide()) return
      this.loading = true
      setTimeout(() => {
        this.firstNumber = this.relativeData.source
        this.secondNumber = this.relativeData.target
        this.relativeList = this.relativeData.mayknows
        this.loading = false
      }, 2000)
    },
    // 关系类型搜索判断
    relativeDecide() {
      if(!this.relativeFirstKey || !this.relativeSecondKey) {
        this.$message({
          type: 'warning',
          message: '需输入两个号码才能进行搜索!',
          duration: 2000
        })
        return false
      }
      let pN = /^1[3|4|5|8][0-9]\d{8}$/
      if(!pN.test(this.relativeFirstKey)) {
        this.$message({
          type: 'warning',
          message: '第一个号码不正确',
          duration: 2000
        })
        return false
      }
      if(!pN.test(this.relativeSecondKey)) {
        this.$message({
          type: 'warning',
          message: '第二个号码不正确',
          duration: 2000
        })
        return false
      }
      return true
    }
  },
  watch: {},
  computed: {
    total() {
      let res
      switch(this.type) {
        case '1':
          res = this.searchList.length
          break
        case '2':
          res = this.knowList.length
          break
        case '3':
          res = this.relativeList.length
          break
        default:
          res = 0
      }
      return res
    }
  },
  mounted() {
    this.handleResize()
    window.addEventListener('resize', () => {
      this.handleResize()
    })
  },
  created() {
    window.addEventListener('resize', this.handleResize.bind(this))
  }
}
</script>
