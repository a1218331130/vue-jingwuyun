<template>
<el-layout class="app-layout" :fit="true" style="overflow: hidden">

  <!-- 通顶 -->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar>
      <div slot="search">
        <span class="sub-title">智慧搜索</span>
        <div class="search-input" @keyup.13="search(type, true)">
          <el-input v-model="inputValue" style="width:446px">
            <el-button slot="append" icon="search" @click="search(type, true)" class="search-btn" style="width:72px;padding-right:15px;"></el-button>
          </el-input>
        </div>

      </div>
    </top-bar>
  </el-region>
  <!-- 内容区 -->
  <el-region class="app-center" slot="center" type="center" style="overflow: hidden">
    <div style="height:calc(100vh - 60px)">
      <el-tabs class="search-type" v-model="type">
        <el-tab-pane v-for="item in tabs" :key="item.value" :label="item.label" :name="item.value.toString()"></el-tab-pane>
      </el-tabs>
      <!-- 人员 -->
      <el-row class="search-function" v-if="type === '1'">
        <el-col :span="12">
          <div class="result-summary">
            关键字：
            <!-- <span>{{secondKeys === ""?keyword:secondKeys}}</span> -->
            <span>
              <span class="keyword" v-for="(elem,index) in personSearchResult.keyWords" :key="index">{{elem}}<i class="iconfont icon-close" title="移除" @click="removeKeyWord(index)"></i></span>
            </span>
            命中：
            <span>{{personSearchResult.total}}</span>
            用时：
            <span>{{personSearchResult.speed/1000}}秒</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="search-tools" @keyup.13="secondSearch">
            <el-button size="small" @click="screenshotState=true"><i class="iconfont icon-image"></i>快照</el-button>
            <el-input placeholder="输入关键字进行二次检索" v-model="personSearchResult.secondKey" :on-icon-click="secondSearch" icon="search" size="small" style="width: 200px"></el-input>
            <!-- <el-button size="small"><i class="iconfont icon-paixu"></i>排序</el-button> -->
            <!-- <el-button size="small"><i class="iconfont icon-folder-open"></i> 临时存储 0</el-button> -->
          </div>
        </el-col>
      </el-row>
      <!-- 车辆 -->
      <el-row class="search-function" v-if="type === '2'">
        <el-col :span="12">
          <div class="result-summary">
            关键字：
            <!-- <span>{{secondKeys === ""?keyword:secondKeys}}</span> -->
            <span>
              <span class="keyword" v-for="(elem,index) in carSearchResult.keyWords" :key="index">{{elem}}<i class="iconfont icon-close" title="移除" @click="removeKeyWord(index)"></i></span>
            </span>
            命中：
            <span>{{carSearchResult.total}}</span>
            用时：
            <span>{{carSearchResult.speed/1000}}秒</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="search-tools" @keyup.13="secondSearch">
            <el-button size="small" @click="screenshotState=true"><i class="iconfont icon-image"></i>快照</el-button>
            <el-input placeholder="输入关键字进行二次检索" v-model="carSearchResult.secondKey" :on-icon-click="secondSearch" icon="search" size="small" style="width: 200px"></el-input>
            <!-- <el-button size="small"><i class="iconfont icon-paixu"></i>排序</el-button> -->
            <!-- <el-button size="small"><i class="iconfont icon-folder-open"></i> 临时存储 0</el-button> -->
          </div>
        </el-col>
      </el-row>
      <!-- 案件 -->
      <el-row class="search-function" v-if="type === '3'">
        <el-col :span="12">
          <div class="result-summary">
            关键字：
            <!-- <span>{{secondKeys === ""?keyword:secondKeys}}</span> -->
            <span>
              <span class="keyword" v-for="(elem,index) in caseSearchResult.keyWords" :key="index">{{elem}}<i class="iconfont icon-close" title="移除" @click="removeKeyWord(index)"></i></span>
            </span>
            命中：
            <span>{{caseSearchResult.total}}</span>
            用时：
            <span>{{caseSearchResult.speed/1000}}秒</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="search-tools" @keyup.13="secondSearch">
            <el-button size="small" @click="screenshotState=true"><i class="iconfont icon-image"></i>快照</el-button>
            <el-input placeholder="输入关键字进行二次检索" v-model="caseSearchResult.secondKey" :on-icon-click="secondSearch" icon="search" size="small" style="width: 200px"></el-input>
            <!-- <el-button size="small"><i class="iconfont icon-paixu"></i>排序</el-button> -->
            <!-- <el-button size="small"><i class="iconfont icon-folder-open"></i> 临时存储 0</el-button> -->
          </div>
        </el-col>
      </el-row>

      <div class="result-list" ref="list">
        <xdh-scroll v-show="type==='1'" :on-reach-bottom="handleReachBottom" :distance-to-edge="-150" :height="listHeight" :total="personSearchResult.total" :personList="personSearchResult.list">
          <result-item v-for="(item, index) in personSearchResult.list" :key="index" :data="item" :keyWords="keyWords" @on-primary-click="openPersonDialog" :index="index" :class="{'changeColor':index%2===0}"></result-item>
        </xdh-scroll>
        <xdh-scroll v-show="type==='2'" :on-reach-bottom="handleReachBottom" :distance-to-edge="-150" :height="listHeight" :total="carSearchResult.total" :carList="carSearchResult.list">
          <result-item-car v-for="(item, index) in carSearchResult.list" :key="index" :data="item" :keyWords="keyWords" @on-primary-click="openCarDialog" @on-person-click="openPersonDialog" :index="index" :class="{'changeColor':index%2===0}"></result-item-car>
        </xdh-scroll>
        <xdh-scroll v-show="type==='3'" :on-reach-bottom="handleReachBottom" :distance-to-edge="-150" :height="listHeight" :total="caseSearchResult.total" :caseList="caseSearchResult.list">
          <result-item-case v-for="(item, index) in caseSearchResult.list" :key="index" :data="item" :keyWords="keyWords" @on-person-click="openPersonDialog" @on-case-click="openCaseDialog" :index="index" :class="{'changeColor':index%2===0}"></result-item-case>
        </xdh-scroll>

        <div class="empty empty--tips" v-if="!loading&&total===0">
          <span>暂无符合“{{this[this.currentResult].secondKeys}}”的数据，请更换关键字搜索。</span>
        </div>

        <div :class="{'el-loading-mask':true,'action':loading}" v-show="loading">
          <div class="el-loading-spinner loader--circular">
            <svg viewBox="25 25 50 50" class="circular">
                <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
              </svg>
          </div>
        </div>
      </div>

      <dialog-people-info :dialog="peopleInfoDialog" :data="infoDialogData" @close="peopleInfoDialog=false" @call:dialog="openInfoDialog"></dialog-people-info>
      <dialog-car-info :dialog="carInfoDialog" :data="infoDialogData" @close="carInfoDialog=false" @call:dialog="openInfoDialog"></dialog-car-info>
      <!-- <dialog-case-info :dialog="caseInf" :data="infoDialogData" @close="peopleInfoDialog=false" @call:dialog="openInfoDialog"></dialog-case-info> -->
      <!-- 快照 -->
      <screen-shot :submit="screenshotState" @generate="screenshotState = false"></screen-shot>
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
    height: calc(100vh - 140px);
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
  } // 隔行变色
  .result-item.changeColor {
    background-color: #f4f9fd;
  }

</style>
<script>
  import { mapState } from 'vuex'
  import TopBar from '../common/topbar/index.vue'
  import { SEARCH_ZT } from '../../store/types'
  import mixin from '../../utils/mixin'
  import ResultItem from './zt/result-item.vue'
  import ResultItemCar from './zt/result-item-car.vue'
  import ResultItemCase from './zt/result-item-case.vue'
  import XdhScroll from '../../widgets/xdh-scroll'
  import DialogInfo from '../../widgets/info-dialog/info-dialog'
  import infoDialogEvents from '../../utils/infoDialogEvents'
  import screenshot from '../../widgets/html-image/html-to-image' // 快照
  // 把数据字段数组转换成字典形式，方面查找
  function getColumnMap(columns) {
    let dict = {}
    columns.forEach((item, index) => {
      dict[item.ColumnNameEn] = { name: item.ColumnNameCn, mark: item.Ybsf, IsDefault: item.IsDefault }
    })
    return dict
  }

  function dataParser(self, data) {
    let result = [];
    if (!data) return result
    if (!data.Source || !data.TableInfo) return result
    const columns = data.TableInfo.Columns || []
    if (columns.length === 0) return result
    const columnMap = getColumnMap(columns)
    return data.Source.map(item => {
      let resultItem = { info: [], ext: [], czxx: [], qkryxx: [], xyrxx: [], primary: '', time: '', index: 0 }
      let keyArray = Object.keys(item).sort((a, b) => {
        const r1 = columns.findIndex(c => c.ColumnNameEn === a) || -1
        const r2 = columns.findIndex(c => c.ColumnNameEn === b) || -1
        return r1 - r2
      })
      keyArray.forEach(key => {
        switch (key) {
          case 's_clxx':
            resultItem.clxx = item[key]
            resultItem.clxx.forEach(clxxItem => {
              clxxItem.info = []
              let clKeyArray = Object.keys(clxxItem).sort((a, b) => {
                const r1 = columns.findIndex(c => c.ColumnNameEn === a) || -1
                const r2 = columns.findIndex(c => c.ColumnNameEn === b) || -1
                return r1 - r2
              })
              clKeyArray.forEach(key2 => {
                switch (key2) {
                  case data.TableInfo.IDName:
                    if (columnMap[key2] && columnMap[key2].name) {
                      clxxItem.info.push({
                        key: key2,
                        name: columnMap[key2].name,
                        value: clxxItem[key2],
                        mark: self.getColumnsType(columnMap[key].mark),
                        isDefault: columnMap[key].IsDefault === '1'
                      })
                      resultItem.primary = clxxItem[key2]
                    }
                    break
                  default:
                    if (columnMap[key2] && columnMap[key2].name) {
                      clxxItem.info.push({
                        key: key2,
                        name: columnMap[key2].name,
                        value: clxxItem[key2],
                        mark: self.getColumnsType(columnMap[key2].mark),
                        isDefault: columnMap[key2].IsDefault === '1'
                      })
                    }
                    break
                }
              })
            })
            break
          case 's_qkryxx':
            resultItem.qkryxx = item[key]
            break
          case 's_xyrxx':
            resultItem.xyrxx = item[key]
            break
          case 's_wd':
            resultItem.ext = item[key]
            break
          case 's_czxx': // 车主信息
            resultItem.czxx = item[key]
            break
          case 'xdh_cjsj':
            resultItem.time = item[key]
            break
          case data.TableInfo.IDName:
            if (columnMap[key] && columnMap[key].name) {
              resultItem.info.push({
                key: key,
                name: columnMap[key].name,
                value: item[key],
                mark: self.getColumnsType(columnMap[key].mark),
                isDefault: columnMap[key].IsDefault === '1'
              })
              resultItem.primary = item[key]
            }
            break
          default:
            if (columnMap[key] && columnMap[key].name) {
              resultItem.info.push({
                key: key,
                name: columnMap[key].name,
                value: item[key],
                mark: self.getColumnsType(columnMap[key].mark),
                isDefault: columnMap[key].IsDefault === '1'
              })
            }
            break
        }
      })
      return resultItem
    })
  }
  export default {
    components: {
      TopBar,
      ResultItem,
      XdhScroll,
      DialogPeopleInfo: DialogInfo,
      ResultItemCar,
      ResultItemCase,
      DialogCarInfo: DialogInfo,
      DialogCaseInfo: DialogInfo,
      screenShot: screenshot
    },
    mixins: [mixin, infoDialogEvents],
    data() {
      return {
        tabs: [{ label: '人员', value: '1' }, { label: '车辆', value: '2' }, { label: '案件', value: '3' }],
        currentTab: '1',
        searchResult: [],
        personSearchResult: { list: [], scrollId: null, keyWord: '', secondKey: '', keyWords: [], secondKeys: '', total: 0, speed: 0 },
        carSearchResult: { list: [], scrollId: null, keyWord: '', secondKey: '', keyWords: [], secondKeys: '', total: 0, speed: 0 },
        caseSearchResult: { list: [], scrollId: null, keyWord: '', secondKey: '', keyWords: [], secondKeys: '', total: 0, speed: 0 },
        type: null,
        keyword: '',
        inputValue: '',
        secondKey: '',
        secondKeys: '',
        keyWords: [],
        listHeight: 500,
        loading: false,
        scrollId: '',
        loadArr: { 1: false, 2: false, 3: false },
        screenshotState: false // 截屏
      }
    },
    computed: {
      currentResult() {
        let res
        switch (this.type) {
          case '1':
            res = 'personSearchResult'
            break;
          case '2':
            res = 'carSearchResult'
            break;
          case '3':
            res = 'caseSearchResult'
            break;
          default:
            res = ''
        }
        return res
      },
      ...mapState({
        searchZt: state => state.search.searchZt
      }),
      total() {
        if (this.searchZt) {
          return this.searchZt.Total || 0
        }
        return 0
      },
      speed() {
        if (this.searchZt) {
          return this.searchZt.UseMilliesecond || 0
        }
        return 0
      }
    },
    watch: {
      type(val) {
        this.$router.push(`/search/zt/${this.type}?key=${encodeURIComponent(this[this.currentResult].keyWord)}`)
        if (this[this.currentResult].keyWord) {
          this.inputValue = this[this.currentResult].keyWord
        }
        if (this[this.currentResult].list.length === 0) this.search(val)
      },
      'personSearchResult.list' (val) {
        if (this.searchZt) {
          this.personSearchResult.total = this.searchZt.Total
          this.personSearchResult.speed = this.searchZt.UseMilliesecond
        } else {
          this.personSearchResult.total = 0
          this.personSearchResult.speed = 0
        }
      },
      'carSearchResult.list' (val) {
        if (this.searchZt) {
          this.carSearchResult.total = this.searchZt.Total
          this.carSearchResult.speed = this.searchZt.UseMilliesecond
        } else {
          this.carSearchResult.total = 0
          this.carSearchResult.speed = 0
        }
      },
      'caseSearchResult.list' (val) {
        if (this.searchZt) {
          this.caseSearchResult.total = this.searchZt.Total
          this.caseSearchResult.speed = this.searchZt.UseMilliesecond
        } else {
          this.caseSearchResult.total = 0
          this.caseSearchResult.speed = 0
        }
      }
    },
    methods: {
      search(type, isClick) {
        if (isClick) {
          this[this.currentResult] = { list: [], scrollId: null, keyWord: '', secondKey: '', keyWords: [], total: 0, speed: 0 }
          // this.carSearchResult = { list: [], scrollId: null, keyWord: '', secondKey: '', keyWords: [], total: 0, speed: 0 }
          // this.caseSearchResult = { list: [], scrollId: null, keyWord: '', secondKey: '', keyWords: [], total: 0, speed: 0 }
          if (!this.inputValue) {
            this.$alert('请先输入关键字', '温馨提示');
          } else
          if ((/[\u4e00-\u9fa5]/).test(this.inputValue) && this.inputValue.length <= 1) {
            this.$alert('请输入两个以上包含中文的字符', '温馨提示');
          } else if (!(/[\u4e00-\u9fa5]/).test(this.inputValue) && this.inputValue.length <= 4) {
            this.$alert('请输入至少5个非中文字符', '温馨提示');
          } else {
            this[this.currentResult].keyWord = this.inputValue
            this[this.currentResult].secondKey = ''
            this.$router.push(`/search/zt/${type}?key=${encodeURIComponent(this[this.currentResult].keyWord)}`)
            this.refresh()
          }
        } else {
          console.log('done')
          this.secondKey = ''
          this[this.currentResult].keyWord = this.keyword
          this.$router.push(`/search/zt/${type}?key=${encodeURIComponent(this.keyword)}`)
          this.refresh()
        }
      },
      secondSearch() {
        this.refresh(this[this.currentResult].secondKey)
      },
      refresh(secondKey) {
        this.type = this.$route.params.type
        // this.inputValue = this[this.currentResult].keyword = decodeURIComponent(this.$route.query.key || '')
        const data = {
          SearchWhere: [{ Keyword: this[this.currentResult].keyWord, KeywordType: 0, Name: '全部', SearchType: 0 }],
          Ztlx: this.type,
          RowIndex: this[this.currentResult].list.length
        }
        if (secondKey) {
          // 防止重复搜索
          if (this[this.currentResult].keyWords.indexOf(secondKey) !== -1) {
            return
          }
          this[this.currentResult].keyWords.push(secondKey)
          this[this.currentResult].secondKeys = this[this.currentResult].keyWords.join('  |  ')
          // data.SearchWhere.push({ Keyword: secondKey, KeywordType: 0, Name: '全部', SearchType: 0 })\
          let key = this[this.currentResult].keyWords.map(d => {
            return {
              Keyword: d,
              KeywordType: 0,
              Name: '全部',
              SearchType: 0
            }
          })
          data.SearchWhere = key
        } else {
          this[this.currentResult].secondKeys = ''
          this[this.currentResult].keyWords = []
          this[this.currentResult].keyWords.push(this[this.currentResult].keyWord)
        }
        this.dispatch(SEARCH_ZT, data).then(() => {
          this[this.currentResult].list = [].concat(dataParser(this, this.searchZt))
          this[this.currentResult].scrollId = this.searchZt.SearchZtEntity.ScrollID
        })
      },
      handleReachBottom() {
        if (this[this.currentResult].total >= this[this.currentResult].list.length) {
          return new Promise(resolve => {
            const data = {
              SearchWhere: [{ Keyword: this[this.currentResult].keyWord, KeywordType: 0, Name: '全部', SearchType: 0 }],
              Ztlx: this.type,
              ScrollID: this[this.currentResult].scrollId,
              RowIndex: this[this.currentResult].list.length
            }
            this.loading = true
            this.dispatch(SEARCH_ZT, data).then(() => {
              this[this.currentResult].list = this[this.currentResult].list.concat(dataParser(this, this.searchZt))
              if (this.searchZt.SearchZtEntity) {
                this[this.currentResult].scrollId = this.searchZt.SearchZtEntity.ScrollID
              }
              this.loading = false
              resolve()
            }).catch(e => {
              this.loading = false
            })
          })
        }
      },
      handleResize() {
        const rect = this.$refs.list.getBoundingClientRect()
        this.listHeight = rect.height
      },
      typeEvent(type, item) {
        if (item.HasQx !== 'False') {
          switch (type) {
            case 'name':
              return 1
            case 'idCard':
              return 1
            case 'SFZH':
              return 1
            case 'plateNum':
            case 'CPHM':
              return 2
            case 'caseNum':
            case 'AJBH':
              return 4
            case 'tel':
              return 3
            case 'LXDH':
              return 3
            case 'bankAccount':
              this.$alert('链接银行账号详情', '测试提示')
              break
            case 'qq':
              this.$alert('链接QQ号码相关内容', '测试提示')
              break
            case 'email':
              this.$alert('链接电子邮箱相关内容', '测试提示')
              break
            default:
              return false
          }
        }
      },
      openPersonDialog(item, type) {
        if (!item) return
        if (type) {
          this.infoDialogData = {
            contentType: type,
            keyId: item
          }
        } else {
          this.infoDialogData = {
            contentType: this.typeEvent(item.mark, item) || (item.sfzhm ? 1 : 2),
            keyId: item.value || item.sfzhm
          }
        }
        this.peopleInfoDialog = true
      },
      openCarDialog(item, type) {
        if (!item) return
        if (type) {
          this.infoDialogData = {
            contentType: type,
            keyId: item
          }
        } else {
          this.infoDialogData = {
            contentType: this.typeEvent(item.mark, item),
            keyId: item.value
          }
        }
        this.carInfoDialog = true
      },
      openCaseDialog(id) {
        if (!id) return
        this.infoDialogData = {
          contentType: 4,
          keyId: id
        }
        this.peopleInfoDialog = true
      },
      // 移除关键字
      removeKeyWord(index) {
        if (this[this.currentResult].keyWords.length === 1) {
          this.$message({
            type: 'warning',
            message: '至少保留一个关键字'
          })
          return
        }
        this[this.currentResult].secondKey = ''
        this[this.currentResult].keyWords.splice(index, 1)
        const data = {
          SearchWhere: [{ Keyword: this[this.currentResult].keyWord, KeywordType: 0, Name: '全部', SearchType: 0 }],
          Ztlx: this.type
        }
        let key = this[this.currentResult].keyWords.map(d => {
          return {
            Keyword: d,
            KeywordType: 0,
            Name: '全部',
            SearchType: 0
          }
        })
        data.SearchWhere = key
        this.dispatch(SEARCH_ZT, data).then(() => {
          this[this.currentResult].list = [].concat(dataParser(this, this.searchZt))
          this[this.currentResult].scrollId = this.searchZt.SearchZtEntity.ScrollID
        })
      }
    },
    mounted() {
      document.title = (this.$route.query.key || '') + ' 的搜索结果-智慧警务'
      this.handleResize()
      setTimeout(() => {
        this.handleResize()
      }, 100)
      this.keyWords.push(this.keyword)
    },
    created() {
      this.inputValue = this.keyword = decodeURIComponent(this.$route.query.key || '')
      this.personSearchResult.keyWord = this.keyword
      this.caseSearchResult.keyWord = this.keyword
      this.carSearchResult.keyWord = this.keyword
      this.type = this.$route.params.type
      window.addEventListener('resize', this.handleResize.bind(this))
    }
  }

</script>
