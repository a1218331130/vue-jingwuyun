<template>
  <div>
    <card-header title="线索信息"></card-header>

    <div>
      <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" border stripe :data="pertionnelInfo">
        <el-table-column type="index" label="序号"></el-table-column>
        <!--<el-table-column prop="num" label="编号" width="300"></el-table-column>-->

        <el-table-column prop="title" label="标题" width="160"></el-table-column>


        <el-table-column prop="typeName" label="线索类型" width="160"></el-table-column>

        <el-table-column prop="desc" label="线索描述" min-width="220"></el-table-column>

        <el-table-column prop="fileUrl" class-name="text-left" label="附件">
          <template scope="scope">
            <a v-for="(item, index) in scope.row.fileUrl" :href="item"
               :download="scope.row.fileName[index]">{{scope.row.fileName[index]}}<br></a>
          </template>
        </el-table-column>

        <el-table-column prop="res" label="信息来源"></el-table-column>


      </el-table>
    </div>

  </div>
</template>
<style scoped>
  .app-content-box {
    padding: 0;
  }
</style>
<script>
  import {mapState} from 'vuex'
  import mixin from '../../../utils/mixin'
  import {
    FETCH_CASE_CLUES_LIST
  } from '../../../store/types'

  import {DOWNLOAD_FILE_PATH} from '../../../config'

  import cardHeader from '../report/modules/card-header.vue'

  export default {
    mixins: [mixin],
    components: {
      cardHeader
    },
    computed: {
      ...mapState(['caseClues'])
    },
    data() {
      return {
        caseId: '',
        pertionnelInfo: []
      }
    },
    methods: {
      dataMatch(singleData) {
        // 数据字段匹配
        let _item = {
          id: singleData.id, // 线索ID
          num: singleData.id, // 线索编号
          title: singleData.xsbt, // 线索标题
          type: singleData.xslx, // 线索类型代码
          typeName: singleData.xslxmc, // 线索类型名称
          fileName: singleData.fjmc, // 附件名称
          fileUrl: singleData.fjlj, // 附件路径
          desc: singleData.xsms, // 线索描述
          res: singleData.sjly // 数据来源
        }
        // 附件路径  附件名称 转换
        _item.fileName = _item.fileName ? _item.fileName.split(',') : ''
        _item.fileUrl = _item.fileUrl ? _item.fileUrl.split(',') : ''
        let __fileUrl = [],
          __fileName = []
        for (let itf in _item.fileUrl) {
          __fileUrl.push(DOWNLOAD_FILE_PATH + _item.fileUrl[itf])
          __fileName.push(_item.fileName[itf])
        }
        _item.fileName = __fileName
        _item.fileUrl = __fileUrl

        return _item
      },
      queryList() {
        if (this.checkRuleCase('ajgl/clue/listda', this.caseId)) {
          // 查询列表
          this.dispatch(FETCH_CASE_CLUES_LIST, {
            data: {
              ajid: this.caseId,
              PageIndex: 1,
              PageSize: 10000
            }
          })
        }
      }
    },
    watch: {
      'caseClues.PageData' (val) {
        // 列表数据结构传递
        this.pertionnelInfo = val.map(d => {
          return this.dataMatch(d)
        })
      }
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.queryList()
    }
  }
</script>
