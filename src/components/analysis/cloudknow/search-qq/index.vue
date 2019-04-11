<template>
<el-layout class="app-layout" :fit="true" style="overflow: hidden;min-height:600px">
  <!-- 通顶 -->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar>
      <div slot="search">
        <span class="sub-title">云知道</span>
        <div class="search-input" @keyup.13="search()">
          <el-input v-model="inputValue" style="width:446px">
            <el-button slot="append" icon="search" @click="search()" class="search-btn" style="width:72px;padding-right:15px;"></el-button>
          </el-input>
        </div>
      </div>
    </top-bar>
  </el-region>
  <!-- 内容 -->
  <el-region class="app-center" slot="center" type="center" style="overflow: hidden">
    <div style="height:calc(100vh - 100px)">
      <!-- 查询信息栏 -->
      <el-row class="search-function">
        <el-col :span="12">
          <div class="result-summary">
            关键字：
            <!-- <span>{{secondKeys === ""?keyword:secondKeys}}</span> -->
            <span>
              <span class="keyword">夏文律<i class="iconfont icon-close" title="移除"></i></span>
            </span>
            命中：
            <span>{{total}}</span>
            用时：
            <span>{{queryTime?queryTime+'秒':''}}</span>
          </div>
        </el-col>
      </el-row>
      <!-- 查询内容区 -->
      <div class="result-list" ref="list">
        <xdh-scroll :on-reach-bottom="handleReachBottom" :distance-to-edge="-150" :height="listHeight" :total="total" :personList="['123']">
          <el-row>
            <!-- <el-col class="result-list-content" :span="12" v-for="(elem,i) in resultList" :key="i"> -->
            <qq-item :itemData="resultList" v-if="false"></qq-item>
            <group-item :itemData="groupList" v-if="total!==0"></group-item>
            <!-- </el-col> -->
          </el-row>
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
}

.search-type {
    margin: 0 15px;
}

.search-function {
    background: #fff;
    border-bottom: 1px solid #ccc;
}

.result-summary {
    padding-left: 15px;
    height: 40px;
    line-height: 40px;
    .keyword {
        margin-right: 0;
        .iconfont {
            visibility: hidden;
            color: #8391a5;
        }
        &:hover {
            .iconfont {
                visibility: visible;
            }
        }
    }
}

.result-summary span {
    color: orangered;
    margin-right: 20px;
}

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
    .result-list-content {
        &:nth-child(even) {
            &:after {
                content: '';
                height: 0;
                line-height: 0;
                display: block;
                visibility: hidden;
                clear: both;
            }
        }
    }
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
</style>

<script>
// import { mapState } from 'vuex'
import TopBar from '../../../common/topbar/index.vue'
import XdhScroll from '../../../../widgets/xdh-scroll'
import mixin from '../../../../utils/mixin'
import qqItem from './item/qq-item.vue'
import groupItem from './item/group-item.vue'

export default {
  components: {
    TopBar,
    XdhScroll,
    qqItem,
    groupItem
  },
  mixins: [mixin],
  data() {
    return {
      listHeight: 500,
      inputValue: '', // 查询关键字
      keyword: '', // 关键字
      total: 0, // 结果条数
      resultList: [], // 结果列表
      groupList: [], // 结果列表
      queryTime: '', // 查询耗时
      searchList: {
        status: 200,
        qtime: 21,
        totalrows: 1,
        result: {
          profile: {
            qq: '2***3',
            nickname: '***',
            realname: '-',
            gender: '男',
            telephone: '',
            mobile: '',
            birthday: '1988/11/11',
            contry: '中国',
            province: '江苏省',
            city: '南京市',
            faceimg: '',
            idcard: '440804198906180645',
            email: '***@126.com',
            weibo: ''
          },
          marknames: [
            {
              markname: '***',
              marker: {
                qq: '6***1',
                nickname: ''
              },
              marktime: '2014/05/18'
            }
          ],
          friends: [
            {
              qq: '7***3',
              nickname: '***',
              markname: '',
              updatetime: '2009/04/27'
            }
          ],
          groups: [
            {
              groupnumber: '2***6',
              groupname: '***',
              groupcard: '***',
              updatetime: '2013/01/22'
            }
          ]
        }
      }, // qq查询列表
      groupTest: {
        'status': 200,
        'qtime': 229,
        'totalrows': 1,
        'result': {
          'profile': {
            'groupnumber': '1***2',
            'name': 'M***',
            'category': '',
            'flag': '普通群',
            'bulletin': '***',
            'fingermemo': '***',
            'groupsize': '100',
            'membernum': '5',
            'createtime': '2011/02/17',
            'owner': {
              'qq': '3***3',
              'nickname': '***'
            }
          },
          'members': [
            {
              'qq': '2***9',
              'groupcard': '***',
              'gender': '',
              'telephone': '',
              'email': '',
              'notes': ''
            }
          ]
        }
      }
    }
  },
  props: {},
  methods: {
    handleReachBottom() {
      console.log(this.listHeight, 'listHeight')
    },
    handleResize() {
      if(this.$refs.list) {
        let rect = this.$refs.list.getBoundingClientRect()
        this.listHeight = rect.height - 60
      }
    },
    search() {
      this.loading = true
      setTimeout(() => {
        this.resultList = this.searchList.result
        this.groupList = this.groupTest.result
        this.total = this.searchList.totalrows
        this.queryTime = this.searchList.qtime
        this.loading = false
      }, 1500)
    }
  },
  watch: {},
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
