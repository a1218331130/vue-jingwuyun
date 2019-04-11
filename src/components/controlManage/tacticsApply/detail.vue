<template>
<el-layout class="app-layout" :fit="true" v-loading="loading">
  <!-- 头部导航 -->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar></top-bar>
  </el-region>

  <el-region class="app-center" slot="center" type="center" style="overflow:hidden">
    <div class="app-toolbar">
      <el-row>
        <el-col :span="12">
          <span v-if="surveillance.surveillanceContent" style="font-size: 17px;">{{surveillance.surveillanceContent.clmc}}的布控结果23：</span>
        </el-col>
        <el-col :span="12" class="text-right">
          <span title="筛选条件" class="iconfont icon-fold" style="float: right; padding: 6px 0 7px 15px; cursor: pointer;" @click="switchRightBar"></span>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <el-row>
        <!-- <el-col :span="24" v-if="surveillance.surveillanceContent"><span style="font-size: 23px;">{{}}</span></el-col> -->
        <el-col :span="24" v-if="surveillance.surveillanceContent">
          <span class="inline">{{surveillance.surveillanceContent.jygk}}</span>
        </el-col>
        <el-col :span="4" v-if="surveillance.surveillanceContent">
          <span class="inline">布控时间：{{surveillance.surveillanceContent.bksj}}</span>
        </el-col>
        <el-col :span="4" v-if="surveillance.surveillanceContent">
          <span class="inline">布控频率：{{clpl}}</span>
        </el-col>
        <el-col :span="4" v-if="surveillance.surveillanceContent">
          <span class="inline">执行次数：{{surveillance.surveillanceContent.zxcs}}</span>
        </el-col>
        <span v-if="surveillance.surveillanceContent">
          <el-col :span="4" v-if="elem.csz" v-for="(elem,index) in surveillance.surveillanceContent.zftj" :key="index">
            <span class="inline">{{elem.label}} : {{elem.csz}}</span>
          </el-col>
        </span>
        <el-col :span="24" v-if="surveillance.surveillanceContent">
          <span class="inline">{{surveillance.surveillanceContent.content}}</span>
        </el-col>
      </el-row>
    </div>
    <list ref="res" :keyword="filter.keyword" :prop="filter.prop" :data="data" :resOnly="true" @update:title="val=>title=val" @update:leftbar="val=>isWestCollapsed=val" style="height: calc(100vh - 190px)"></list>

    <!-- 右侧栏 -->
    <side-right-box style="height: calc(100% - 100px);
    right: 0px;
    top: 98px;" :unfoldHandle="showRightBar">
      <!-- v-if="filterOptions[1].children.length>0" -->
      <right-toolbar title="查询列表" :params="filter" :options="filterOptions" @packup="this.showRightBar = false" @update:params="searchSubmit"></right-toolbar>
    </side-right-box>

  </el-region>

</el-layout>
</template>
<style lang="scss" scoped>
  .app-toolbar {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
  }

  .content {
    background: white;
    padding: 7px 7px 7px 15px;
    border-bottom: 1px solid #ccc;
    color: #9A9494;
  }

  .inline {
    // color: rgb(177, 172, 172);
    color: #9A9494;
  }

</style>
<script>
  // libraryResultSearch
  import { mapState } from 'vuex'
  // GET_SURVEILLANCE_TACTICS_RESULT_BY_ID,
  import { GET_SURVEILLANCE_TACTICS_RESULT_BY_ID, GET_SURVEILLANCE_CONTENT, GET_LIBRARY_CONDITION, LIBRARY_RESULT_SEARCH } from '../../../store/types'
  import mixin from '../../../utils/mixin'
  import { clone } from '../../../utils/util'
  import list from '../../tactics/apply/list'
  import sideRightBox from '../../control/side-right-box.vue'
  import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'
  import TopBar from '../../common/topbar/index.vue'

  export default {
    mixins: [mixin],
    components: {
      sideRightBox,
      rightToolbar,
      list,
      TopBar
    },
    data() {
      return {
        title: '',
        isWestCollapsed: true,
        isEastCollapsed: false,
        data: null,
        showRightBar: false,
        columns: [],
        filter: {
          keyword: '',
          prop: ''
        },
        filterOptions: [{
          title: '时间段',
          prop: 'time',
          type: 'daterange',
          dateLimit: true
        }]
        // filterOptions: [{
        //   title: '关键字',
        //   prop: 'keyword',
        //   type: 'input'
        // }, {
        //   title: '搜索字段',
        //   prop: 'prop',
        //   type: 'select',
        //   children: []
        // }]
      }
    },
    props: [],
    computed: {
      keyId() {
        return this.$route.params.id || null
      },
      lastRunTime() {
        return this.$route.params.lastRunTime || null
      },
      clpl() {
        switch (this.surveillance.surveillanceContent.clpl) {
          case '1':
            return '1小时'
          case '2':
            return '6小时'
          case '3':
            return '12小时'
          case '4':
            return '一天'
          case '5':
            return '一周'
        }
      },
      ...mapState(['surveillance'])
    },
    watch: {
      // columns(val) {
      //   this.filterOptions[1].children = val
      // }
    },
    methods: {
      getData() {
        this.dispatch(GET_SURVEILLANCE_TACTICS_RESULT_BY_ID, {
          clid: this.keyId, // 策略id
          // zfid: '60E9C7AAC44B8CF7E053455C920AD5E8',
          clsj: this.lastRunTime // 策略时间
        }).then(() => {
          this.data = clone(this.surveillance.result)
          this.data.List = this.data.dataList.find(d => d.mode === 'list')
          if (this.data.List) {
            // 表头
            if (this.data.List.coloum) {
              this.columns = this.data.List.coloum.filter(c => c.display === true).map(c => {
                return {
                  label: c.label,
                  value: c.prop
                }
              })
              this.filter.prop = this.columns[0].prop
              // this.filterOptions[1].children = [...this.columns]
              this.$nextTick(() => {
                this.$refs.res.showList = true
              })
            }
          }
        })
        this.dispatch(GET_SURVEILLANCE_CONTENT, {
          clid: this.keyId
        }).then(() => {
          console.log(this.surveillance.surveillanceContent, '6666');
        })
      },
      // getResultLIst() {
      //   let queryForm = {
      //     clid: this.keyId, // 策略id
      //     clsj: this.lastRunTime // 策略时间
      //   }
      //   this.getListData(queryForm)
      //   this.dispatch(GET_SURVEILLANCE_CONTENT, {
      //     clid: this.keyId
      //   }).then(() => {})
      // },
      getListData(obj) {
        this.dispatch(LIBRARY_RESULT_SEARCH, obj).then(() => {
          // libraryResultSearch
          if (this.surveillance.libraryResultSearch.dataList[0].count === 0) {
            this.$message({
              type: 'warning',
              message: '无搜索结果'
            })
            return
          }
          this.data = clone(this.surveillance.libraryResultSearch)
          this.data.List = this.data.dataList.find(d => d.mode === 'list')
          if (this.data.List) {
            // 表头
            //
            this.columns = this.data.List.coloum.filter(c => c.display === true).map(c => {
              return {
                label: c.label,
                value: c.prop
              }
            })
            this.filter.prop = this.columns[0].prop
            // this.filterOptions[1].children = [...this.columns]
          }
          this.$nextTick(() => {
            this.$refs.res.showList = true
          })
        })
      },
      switchRightBar() {
        this.showRightBar = !this.showRightBar
      },
      // 搜索结果按钮
      // searchSubmit(filterObj) {
      //   console.log(filterObj, 'filterObj')
      //   this.filter = filterObj
      // },
      searchSubmit(filterObj) {
        let res = {}
        for (let key in filterObj) {
          if (filterObj[key] && key !== 'time') {
            res[key] = filterObj[key]
          }
        }
        if (filterObj.time && filterObj.time.length !== 0 && filterObj.time[0]) {
          res.kssj = filterObj.time[0].split('T')[0]
          res.jssj = filterObj.time[1].split('T')[0]
        }
        if (JSON.stringify(res) === '{}') {
          this.$message({
            type: 'warning',
            message: '请选择搜索条件'
          })
          return
        }
        // clid: this.keyId, // 策略id
        // clsj: this.lastRunTime // 策略时间
        res.clid = this.keyId
        res.clsj = this.lastRunTime
        this.getListData(res)
      },
      // 获取搜索条件
      getSearchCondition() {
        this.dispatch(GET_LIBRARY_CONDITION, { clid: this.keyId })
          .then(d => {
            // this.filterOptions = clone(this.sureillance.libraryCondition)
            let res = clone(this.surveillance.libraryCondition)
            if (res.length === 0) return
            this.filterOptions = this.filterOptions.concat(res.map(d => {
              if (d.children) {
                return {
                  title: d.LABEL,
                  prop: d.COL,
                  type: d.TYPE,
                  children: d.CHILDREN
                }
              } else {
                return {
                  title: d.LABEL,
                  prop: d.COL,
                  type: d.TYPE
                }
              }
            }))
            // this.filterOptions.push({
            //   title: '时间段',
            //   prop: 'time',
            //   type: 'daterange',
            //   dateLimit: true
            // })
          })
      }
    },
    created() {
      document.title = '策略布控结果-智慧警务'
      this.getData()
      this.getSearchCondition()
      // this.getResultLIst()
      // this.getData()
    },
    mounted() {}
  }

</script>
