<template>
<el-dialog v-draggable="dialogDraggableOptions" class="no-padding" :visible.sync="dialog" title="批量检索结果列表" :modal-append-to-body="true" :append-to-body="true" size="large--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <div class="wrap">

    <el-progress :percentage="percentage" :stroke-width="18" :text-inside="true" :status="percentage===100?'success':''" style="margin:10px;"></el-progress>

    <el-table @cell-mouse-enter="cellMouseEnter" :data="list" v-loading.body="loading" height="460">
      <el-table-column label="序号" prop="id" align="center" width="45">
        <template scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="关键字" class-name="text-left" prop="keyword"></el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template scope="scope">
          <span v-if="scope.row.active==='loading'"><i class="el-icon-loading"></i> 加载中...</span>
          <span v-if="scope.row.active===false">检索失败</span>
          <el-button v-if="scope.row.active===true" type="primary" size="mini" icon="icon iconfont icon-sousuo" title="点击打开结果集页面" @click="callResource(scope.row)">
            {{scope.row.resultEntity.Total || scope.row.resultEntity.Total === 0 ? scope.row.resultEntity.Total : scope.row.resultEntity.ResultTotal}} 条结果
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div slot="footer" class="dialog-footer">
    <el-button @click="closeEvent">返回上一步</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.el-dialog__body {
    padding: 0;
}

.wrap {
    height: 500px;
    overflow: auto;
}
</style>
<script>
import mixin from '../../utils/mixin'

import { mapState } from 'vuex'
import { FETCH_SEARCH_PL, GET_SEARCH_HIS_LOG } from '../../store/types' // , GET_BATCH_DETAIL
import { save } from '../../utils/storage'

// import { addClass, removeClass, arrayGetRid } from '../../utils/util'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      count: 0,
      baseList: [],
      catchList: [],
      percentage: 0,
      timer: null
    }
  },
  props: ['dialog', 'params', 'cats'],
  computed: {
    list() {
      let resList = [...this.baseList]
      resList.filter(d => d.active === 'loading').forEach(d => {
        let catchItem = this.catchList.find(c => c.keyword === d.keyword)
        if(!catchItem) {

        } else {
          resList[resList.indexOf(d)] = catchItem
        }
      })
      return [...resList]
    },
    ...mapState(['search'])
  },
  methods: {
    initDialog() {
      // 重置
      this.count = 0
      this.percentage = 0
      this.baseList = []
      this.catchList = []
      if(this.params.flag) {
        // 重新请求结果列表
        this.dispatch(GET_SEARCH_HIS_LOG, { PljsID: this.params.ID, PageIndex: 1, PageSize: 500 })
          .then(() => {
            let baseList = []
            this.count = this.search.searchHisLog.DataCount
            console.log('重新获取结果', this.search.searchHisLog)
            this.search.searchHisLog.PageData.forEach(d => {
              if(d.SearchState !== '0') {
                baseList.push({
                  active: true,
                  keyword: d.Keyword,
                  resultEntity: d // 结果
                })
                this.catchList.push({
                  active: true,
                  keyword: d.Keyword,
                  resultEntity: d // 结果
                })
                this.percentage = parseInt((this.catchList.length / this.count) * 100)
              } else {
                baseList.push({
                  active: 'loading',
                  keyword: d.Keyword,
                  resultEntity: null // 结果
                })
              }
            })
            this.baseList = baseList
          })
      } else {
        this.action()
      }
    },
    action(longData = false) {
      // 请求结果列表(进度容器)
      this.dispatch(FETCH_SEARCH_PL, {
        FjId: this.params.FjId,
        ColumnsIsSearch: this.params.ColumnsIsSearch,
        // FlTypeIDs: this.cats,
        YjYsTypeIDs: this.cats,
        SjdrFileType: this.params.SjdrFileType,
        SheetName: this.params.SheetName,
        IsHeadInStartRow: this.params.IsHeadInStartRow,
        BeginRow: this.params.BeginRow,
        IsSearch: longData,
        SeparatorType: this.params.SeparatorType
      }).then(() => {
        if(this.search.searchPlList.IsSearchStart === false) {
          this.$confirm('当前关键词检索条数过大(' + this.search.searchPlList.Total + '条), 点击确认继续, 可能将花费较长时间, 请耐心等待', '温馨提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.action(true)
          }).catch(() => {
            this.closeEvent()
          });
        } else {
          let baseList = []
          this.count = this.search.searchPlList.Total
          console.log('first', this.search.searchPlList)
          this.search.searchPlList.Keywords.forEach(d => {
            baseList.push({
              active: 'loading',
              keyword: d,
              resultEntity: null // 结果
            })
          })
          this.baseList = baseList
        }
      })
    },
    closeEvent() {
      clearInterval(this.timer)
      // this.$connect.off('SearchPlProcess')
      this.$emit('close')
    },
    callResource(data) {
      console.log(data, 'data')
      if(this.params.flag) {
        console.log(123)
        let resultEntity = JSON.parse(data.resultEntity.SearchResultEntity)

        save('ngw_search_searcWhere_' + data.keyword, resultEntity.SearchEntity)
        save('ngw_search_catTreeData_' + data.keyword, resultEntity.SearchDatas.filter(d => d.Total !== 0))
      } else {
        data.resultEntity.SearchDatas = data.resultEntity.SearchDatas.filter(d => d.Total !== 0)
        save('ngw_search_searcWhere_' + data.keyword, data.resultEntity.SearchEntity.SearchWhere)
        save('ngw_search_catTreeData_' + data.keyword, data.resultEntity.SearchDatas)
      }
      this.jumpTo('/search/result?key=' + data.keyword, true)
    }
  },
  created() {
    // 开始监听SOCKET(更新进度)
    this.$connect.on('SearchPlProcess', (data) => {
      console.log('收到 SearchPlProcess 推送, 开始回调处理', data);
      if(data.ID === this.params.FjId && this.catchList.length < this.count) {
        this.catchList.push({
          active: data.Error === '',
          keyword: data.Error === '' ? data.Keyword : '检索失败',
          resultEntity: data.Error === '' ? data.SearchResultEntity : null // 结果
        })
        console.log('socket进行中...')
        // 动态进度条
        this.percentage = parseInt((this.catchList.length / this.count) * 100)
      } else {

      }
      console.log('SearchPlProcess 回调处理完成');
    })
  },
  mounted() {}
}
</script>
