<!-- 慧搜 -->
<template>
<page-container :style="'background-image:url('+imageBg+')'">
  <main-page-header></main-page-header>
  <div class="search-bg">
    <img class="search-bg__item--stara" :src="imageStar">
    <img class="search-bg__item--starb" :src="imageStar">
  </div>
  <el-row>
    <el-col class="search-box" :span="14" :offset="5">
      <img class="search-box__logo" :src="imageLogo">
      <div class="search-box__dist">
        <img :class="'search-box__dist__item--pointer ' + 'r' + hoverType" :src="imagePointer">
        <img class="search-box__dist__item--grain" :src="imageGrain">
        <img class="search-box__dist__item--cb" :src="imageCb">
        <img class="search-box__dist__item--cr" :src="imageCr">
      </div>
      <div class="search-box__types" @mouseleave="hoverType=type">
        <span :class="'search-box__types__item'+(type===item.value?'--action':'')" v-show="!!item.name" v-for="item in types" @click="changeType(item.value)" @mouseenter="hoverType=item.value">{{item.name}}</span>
      </div>

      <el-row>
        <el-col :span="24" style="height:30px;">
          <el-tabs ref="searchType" v-if="tabs && tabs.length > 0" v-model="currentTab" @tab-click="tabOnClickEvent">
            <el-tab-pane v-for="t in tabs" :label="t.name" :name="t.value.toString()" :key="t.value"></el-tab-pane>
          </el-tabs>

          <loader-bar v-if="checkRule('Search/GetYs',true)===true" class="loader-tabs" :action="!tabs || tabs.length === 0"></loader-bar>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="23">
          <form v-on:submit.prevent>
            <el-input v-if="type!==3" class="search-box__input" size="large" v-model="keyword" :placeholder="type===2 ? '点击上传数据文件 (Excel, txt, Csv, DataAccess)' : '请输入搜索内容'" :readonly="needSearchMask===true" :icon="(type===2)?'icon iconfont icon-zhiding cursor--pointer':''">

              <div class="" slot="append">
                <el-button class="search-box__button" native-type="submit" icon="icon iconfont icon-sousuo" @click="submit">搜索
                </el-button>
                <div v-if="needSearchMask===true" class="search-box__mask" @click="keywordOnClickEvent"></div>
              </div>
            </el-input>
            <el-input v-if="type===3" class="search-box__input" size="large" v-model="keyword" placeholder="点击上传图片 (jpg, png)" :readonly="true" icon="icon iconfont icon-zhiding cursor--pointer">
              <div class="" slot="append">
                <!-- <el-button class="search-box__button" native-type="submit" icon="icon iconfont icon-sousuo" @click="submit">搜索
                </el-button> -->
                <div v-if="needSearchMask===true" class="search-box__mask" @click="keywordOnClickEvent"></div>
              </div>
            </el-input>
          </form>
          <input v-if="fileInput===true" type="file" ref="searchUploadBtn" class="hide" accept=".csv,.mdb,.accdb,text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="fileChange">
          <input v-if="fileInput===true" type="file" ref="photoUploadBtn" class="hide" accept=".jpg,.png" @change="photoFileChange">
        </el-col>
        <el-col class="button-box" :span="1">
          <el-button class="search-btn" type="text" v-if="checkRule('Search/GetSearchHisLog',true)===true" @click="historyDialog=true">
            检索记录
          </el-button>
          <el-button class="search-btn" type="text" v-if="checkRule('Search/GetYjYslxs',true)===true" @click="rangeDialog=true">检索范围
          </el-button>
        </el-col>
      </el-row>

      <!-- <div class="search-box__senior-box">
                <span>高级搜索</span>
              </div> -->

      <div class="search-tips" v-if="checkRule('Search/GetSearchNodes',true)===true">
        <ul v-if="this.search.searchNodes && this.search.searchNodes.length>0">
          <li v-for="item in this.search.searchNodes" :key="item.ID">{{item.Context}}</li>
        </ul>
        <loader-bar :action="!this.search.searchNodes || this.search.searchNodes.length===0"></loader-bar>
      </div>
    </el-col>

    <dialog-history :dialog="historyDialog" @close="historyDialog=false" @update:keyword="updateFormHistory" @call:resource="val=>openResourceDialog(val,true)"></dialog-history>

    <dialog-range :dialog="rangeDialog" @close="rangeDialog=false" @update:range="updateRang"></dialog-range>

    <dialog-special :dialog="specialDialog" v-if="specialType!==null" :type="specialType" @close="specialDialog=false" @update:special="updateKeyword"></dialog-special>

    <dialog-batch :dialog="batchDialog" :title="fileInfo.title" :file="fileInfo.file" :cats="cats" @close="resetFileInput" @call:rang="rangeDialog=true" @call:resource="openResourceDialog"></dialog-batch>

    <dialog-batch-resource :dialog="batchResourceDialog" :params="batchParams" :cats="cats" :title="fileInfo.title" @close="resetFileInput"></dialog-batch-resource>
  </el-row>

</page-container>
</template>
<style lang="scss" scoped>
  body {
    position: static;
    padding-right: 0;
    overflow: hidden;
  }

  .header-box {
    position: relative;
    z-index: 3;
  }

  .loader-tabs {
    transform: scale(.5);
  }

</style>
<script>
  import mixin from '../../utils/mixin'
  import { mapState } from 'vuex'
  import { GET_SEARCH_ELM_LIST, GET_SEARCH_NODES, GET_SEARCH_SPECIAL, FETCH_USER_MENU } from '../../store/types'
  import { save } from '../../utils/storage'

  // 资源
  import imageBg from '../../assets/search/bg.jpg'
  import imageStar from '../../assets/search/star.png'
  import imageLogo from '../../assets/search/logo.png'
  import imagePointer from '../../assets/search/pointer.png'

  import imageGrain from '../../assets/search/grain.png'
  import imageCb from '../../assets/search/cb.png'
  import imageCr from '../../assets/search/cr.png'

  // 组件
  import PageContainer from '../common/page-container.vue'
  import MainPageHeader from '../common/mainheader/main-page-header.vue'
  import PageFooter from '../common/page-footer.vue'

  import loaderBar from '../../widgets/loader/loader-bar.vue'

  import dialogHistory from './dialog-history'
  import dialogRange from './dialog-range'

  import dialogSpecial from './dialog-special'

  import importDialog from '../../widgets/import-dialog/import-dialog'

  import dialogBatch from './dialog-batch'
  import dialogBatchResource from './dialog-batch-resource'
  import { UPLOAD_PATH } from '../../config'

  export default {
    mixins: [mixin],
    components: {
      importDialog,
      PageContainer,
      MainPageHeader,
      PageFooter,
      'dialog-history': dialogHistory,
      'dialog-range': dialogRange,
      'dialog-special': dialogSpecial,
      'dialog-batch': dialogBatch,
      'dialog-batch-resource': dialogBatchResource,
      'loader-bar': loaderBar
    },
    data: function() {
      return {
        historyDialog: false,
        rangeDialog: false,
        specialDialog: false,
        batchDialog: false,
        batchResourceDialog: false,
        imageBg: imageBg,
        imageStar: imageStar,
        imageLogo: imageLogo,
        imagePointer: imagePointer,
        imageGrain: imageGrain,
        imageCb: imageCb,
        imageCr: imageCr,
        fileInput: true,
        currentTab: 0,
        cats: [],
        type: 0,
        commonSearchType: 0,
        hoverType: 0,
        keyword: '',
        types: [{
          name: '通用',
          value: 0,
          children: []
        }, {
          name: '以图搜图',
          value: 1,
          children: []
        }, {
          name: '单库检索',
          value: 2,
          children: [{
            name: '单库检索',
            value: 0
          }]
        }, {
          name: '批量检索',
          value: 3,
          children: [{
            name: '批量检索',
            value: 0
          }]
        }, {
          name: '',
          value: 4
        }],
        searchWhere: [],
        fileInfo: {
          name: '',
          title: '',
          type: '',
          file: null
        },
        fileTypes: ['csv', 'mdb', 'accdb', 'txt', 'xls', 'xlsx'],
        photoFileType: ['jpg', 'png'],
        batchParams: null
      }
    },
    computed: {
      tabs() {
        let res, data = this.types.find(t => t.value === this.type)
        if (!data.children) {
          res = []
        } else {
          res = data.children
        }
        return res
      },
      specialType() {
        let res
        if (this.type === 1 && this.types[1].children.length > 0) {
          res = this.types[1].children.find(d => d.value === parseInt(this.currentTab))
        } else {
          res = null
        }
        return res
      },
      needSearchMask() {
        let res
        if (this.type === 1) {
          return false
        }
        if (this.type === 3) {
          return true
        }
        if (this.specialType !== null) {
          if (this.specialType.value === 1 || this.specialType.value === 2 || this.specialType.value === 5) {
            res = true
          } else {
            res = false
          }
        } else if (this.type === 2) {
          res = true
        } else {
          res = false
        }
        return res
      },
      searchType() {
        let res
        if (this.type === 0) {
          if (parseInt(this.currentTab) === 0) {
            // 全部
            res = 0
          } else {
            // 要素
            res = 1
          }
        } else {
          // 专题
          res = 2
        }
        return res
      },
      ...mapState(['search', 'users'])
    },
    watch: {
      type(val, oldVal) {
        if (oldVal === 0 || oldVal === 1 && val !== 2 && val !== 3) {
          this.searchWhere = []
          this.currentTab = this.tabs[0].value + ''
          this.commonSearchType = 0
          return
        }
        this.keyword = ''
        this.searchWhere = []
        this.currentTab = this.tabs[0].value + ''
      }
    },
    methods: {
      changeType(target) {
        this.keyword = ''
        if (this.checkRule('Search/SearchNextPage') === false) {
          return false
        }
        if (this.checkRule('ajgl/reconnaissancemap/save')) {
          if (target >= 4 || target === this.type) {
            return false
          } else if (target === 1) {
            this.dispatch(FETCH_USER_MENU, { CurMenuId: this.$route.query.menuId }).then(() => {
              this.users.userMenu.map(item => {
                if (item.MenuName === '图片') {
                  window.open(item.AbsoluteUrl + '&token=' + this.userData.UserToken)
                  return false
                }
              })
            })
          } else if (target === 2) {
            window.open('/#/search/result_db?type=dbcheck')
          } else {
            this.type = target
            this.currentTab = this.types[target].children[0].value
          }
        }
      },
      fileChange(elm) {
        let file = elm.target.files[0],
          fileTypeArr = file.name.split('.'),
          fileType = fileTypeArr[fileTypeArr.length - 1]
        if (file.size > 1024 * 1024 * 1000) {
          this.$alert('文件不能大于100MB', '温馨提示');
        } else if (!this.fileTypes.find(d => d === fileType)) {
          this.$alert('只支持 CSV/EXCEL/TXT/ACCESS 文件', '温馨提示');
        } else {
          this.fileInfo = {
            name: file.name,
            title: `批量检索-${file.name}`,
            type: fileType,
            file: file
          }
          this.batchDialog = true
        }
      },
      photoFileChange(elm) {
        let file = elm.target.files[0],
          fileTypeArr = file.name.split('.'),
          fileType = fileTypeArr[fileTypeArr.length - 1]
        if (file.size > 1024 * 1024 * 1000) {
          this.$alert('文件不能大于100MB', '温馨提示');
        } else if (!this.photoFileType.find(d => d === fileType)) {
          this.$alert('只支持 jpg/png 文件', '温馨提示');
        } else {
          let formData = new FormData()
          formData.append('file', file)
          formData.append('data', JSON.stringify({ token: this.userData.UserToken }))
          this.$http.post(UPLOAD_PATH, formData).then((res) => {
            if (res.body && res.body.Data) {
              const fileId = res.body.Data.ID || '',
                fileMd5 = res.body.Data.FileMd5 || ''
              this.$router.push(`/analysis/image/${fileId}|${fileMd5}`)
            }
          })
        }
      },
      updateRang(val) {
        this.cats = val
        this.rangeDialog = false
      },
      keywordOnClickEvent() {
        if (this.type === 1) {
          this.tabOnClickEvent({
            name: this.tabs.find(t => t.value === parseInt(this.currentTab)).value
          })
        } else if (this.type === 2) {
          // 批量, 上传
          this.$refs.searchUploadBtn.click()
        } else if (this.type === 3) {
          this.$refs.photoUploadBtn.click()
        } else {
          return true
        }
      },
      tabOnClickEvent(tab) {
        if (this.checkRule('Search/SearchNextPage') === false) {
          return false
        }
        if (this.type === 0) {
          this.commonSearchType = tab.name
        }
        if (this.type === 1) {
          //        if (this.needSearchMask === true) {
          //          this.specialDialog = true
          //        }
        }
      },
      /**
       * [updateKeyword 专题条件]
       * @param  {[type]} obj [description]
       * @return {[type]}     [description]
       */
      updateKeyword(obj) {
        let text = '',
          array = []

        Object.keys(obj).forEach((d, i) => {
          if (obj[d].value !== '') {
            array.push(obj[d])
            text += obj[d].value + ' '
          }
        })
        this.searchWhere = array.map(d => {
          return {
            Keyword: (d.value instanceof Array) ? d.value.join('') : d.value,
            KeywordType: d.valueType,
            Name: d.name,
            SearchType: d.searchType
          }
        })
        this.keyword = text
        this.specialDialog = false
      },
      updateFormHistory(val, flag) {
        let resData = JSON.parse(val.SearchEntityJson),
          data = resData.SearchWhere[0],
          type = 0

        if (resData.Ztlx) {
          // 专题
          type = 1
        } else {
          // 通用
          type = parseInt(data.SearchType)
        }
        this.type = type
        this.$nextTick(() => {
          this.hoverType = type
          if (resData.Ztlx) {
            // 专题
            this.currentTab = resData.Ztlx + ''
          } else {
            // 通用
            this.currentTab = data.KeywordType.toString()
          }
          // this.hoverType = data.SearchType
          // // SearchType
          let res = JSON.parse(val.SearchEntityJson)
          this.keyword = val.Keyword
          // this.type = val.SearchType
          // this.searchType = res.SearchType
          this.searchWhere = res.SearchWhere
          if (flag) {
            this.historyDialog = false
          } else {
            this.submit()
          }
          //
        })
      },
      /**
       * [structureSearchWhere 构建查询对象]
       * @return {[type]} [description]
       */
      structureSearchWhere() {
        // 查询条件，检索关键字(8.1.7)的集合
        let res = []
        if (this.searchType === 0 || this.searchType === 1) {
          // 全部/要素
          res.push({
            Keyword: this.keyword, // 关键字
            KeywordType: 0, // 关键字类型 0:文本, 1:时间段, 2:年龄段
            Name: this.searchType === 0 ? '全部' : '要素',
            SearchType: parseInt(this.currentTab)
          })
        } else {
          // 专题
          res = this.searchWhere
        }
        return res
      },
      openResourceDialog(obj, isRecord = false) {
        if (isRecord === true) {} else {}
        this.batchParams = obj.params
        this.batchResourceDialog = true
      },
      /**
       * [submit 提交查询]
       * @return {[type]} [description]
       */
      submit() {
        if (this.checkRule('Search/SearchNextPage') === false) {
          return false
        }

        let keyword = this.keyword,
          subKeyword

        // 除空格
        if (keyword.indexOf(' ') !== -1) {
          subKeyword = keyword.split(' ').join('')
        } else {
          subKeyword = keyword
        }
        if (subKeyword === '') {
          this.$alert('请先输入关键字', '温馨提示');
        } else if ((/[\u4e00-\u9fa5]/).test(subKeyword) && keyword.length <= 1) {
          this.$alert('请输入两个以上包含中文的字符', '温馨提示');
        } else if (!(/[\u4e00-\u9fa5]/).test(subKeyword) && keyword.length <= 4) {
          this.$alert('请输入至少5个非中文字符', '温馨提示');
        } else {
          let formData = {
            SearchWhere: this.structureSearchWhere(), // 查询条件，检索关键字(8.1.7)的集合
            TypeId: 0, // parseInt(this.currentTab), // 要素类型，选择的要素ID
            SearchType: 0, // this.searchType, // 检索类型，全部 = 0,要素 = 1, 专题 = 2
            TableIDs: [], // 指定的表ID集合
            YjYsTypeIDs: this.cats.map(d => d.ID) // 分类集合，选择的行业分类ID
          }
          // console.log(formData);
          // this.$router.push({
          //   name: 'searchResult',
          //   params: { formData: formData }
          // })
          //
          // 查询对象存入本地储存, 方便跨页取数据

          save('ngw_search_searchWhere_' + this.keyword, formData)
          save('ngw_search_catTreeData', null)
          if (this.type === 1) {
            // this.$router.push(`/search/zt/${this.currentTab}?key=${encodeURIComponent(this.keyword)}`)
            this.jumpTo(`/search/zt/${this.currentTab}?key=${encodeURIComponent(this.keyword)}`, true)
          } else {
            this.jumpTo('/search/result?key=' + encodeURIComponent(this.keyword) +
              '&type=' + formData.SearchWhere[0].SearchType, true)
          }
        }
      },
      resetFileInput() {
        this.batchDialog = false
        this.batchResourceDialog = false
        this.fileInput = false
        setTimeout(() => {
          this.fileInput = true
        }, 300)
      },
      reloadPage() {
        window.location.reload()
        // batchResourceDialog=false
      }
    },
    created() {
      document.title = '慧搜-智慧警务'
      this.checkRule('Search/SearchNextPage')

      // if (this.checkRule('Search/GetZts', true) === true) {
      //   // 获取专题集合
      //   this.dispatch(GET_SEARCH_SPECIAL).then(() => {
      //     this.types[1].children = this.search.searchSpecial.map(d => {
      //       return {
      //         name: d.Name,
      //         value: parseInt(d.ID)
      //       }
      //     })
      //   })
      // }

      if (this.checkRule('Search/GetZts', true) === true) {
        // 获取要素集合
        this.dispatch(GET_SEARCH_SPECIAL).then(() => {
          // alert(12);
          if (this.search.searchSpecial && this.search.searchSpecial.length > 0) {
            this.types[0].children = [
              ...[{
                value: 0,
                name: '全部'
              }],
              ...this.search.searchSpecial.map(d => {
                return {
                  value: parseInt(d.ID),
                  name: d.Name
                }
              })
            ]
          }
        })
      }

      if (this.checkRule('Search/GetSearchNodes', true) === true) {
        // 获取页底说明内容
        this.dispatch(GET_SEARCH_NODES).then(() => {})
      }
      console.log(GET_SEARCH_ELM_LIST)
    }
  }

</script>
