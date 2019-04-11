<template>
<div style="height: 100%;">
  <div class="app-toolbar" style="border: none">
    <span class="" style="color: #46BDFD;font-size: 16px">线索信息</span>
    <div class="app-search__buttons" v-if="checkUserRuleCase('ajgl/clue/save',caseId,true,cjrId)">
      <el-button type="primary" size="small" icon="plus" @click="add()">新增</el-button>
    </div>
  </div>
  <div class="app-content-box">
    <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" border stripe :data="pertionnelInfo">
      <el-table-column type="index" label="序号" width="100">
        <template scope="scope">
          {{scope.$index + 1 + pageInfo.limit * (pageInfo.currentpage - 1)}}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="typeName" label="线索类型"></el-table-column>
      <el-table-column prop="date" label="线索时间"></el-table-column>
      <el-table-column prop="orgName" label="提供单位"></el-table-column>
      <el-table-column prop="provider" label="提供人"></el-table-column>
      <el-table-column prop="desc" class-name="text-left" label="线索描述"></el-table-column>
      <el-table-column prop="fileUrl" class-name="text-left" label="附件">
        <template scope="scope">
          <a v-for="(item, index) in scope.row.fileUrl" :href="item" :download="scope.row.fileName[index]">{{scope.row.fileName[index]}}<br></a>
        </template>
      </el-table-column>
      <el-table-column prop="res" label="信息来源"></el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button type="primary" v-if="checkUserRuleCase('ajgl/clue/update',caseId,true,cjrId)" size="mini" @click="edit(scope.row)" icon="icon iconfont icon-brush">编辑
          </el-button>
          <el-button type="danger" v-if="checkUserRuleCase('ajgl/clue/delete',caseId,true,cjrId)" size="mini" @click="remove(scope.row.id,scope.$index)" icon="icon iconfont icon-trash">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="app-toolbar footer">
    <pagination :count="pageInfo.count" :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}" @update:pagenav="pagenavChange"></pagination>
  </div>
  <!-- 编辑模态窗 large/tiny-->
  <editor :dialog="editDialog" :editmode="editMode" @close="editDialog=false" @form:submit="submit"></editor>
</div>
</template>
<style scoped>
.app-content-box {
  height: calc(100% - 139px);
  background: #fff;
  margin-top: 3px;
}
</style>
<script>
import { mapState } from 'vuex'
import mixin from '../../../utils/mixin'
import {
  GET_CASE_CLUES_INFO,
  ADD_CASE_CLUES,
  UPDATE_CASE_CLUES,
  REMOVE_CASE_CLUES,
  FETCH_CASE_CLUES_LIST
} from '../../../store/types'
import pagination from '../../../widgets/pagination/pagination'
import editor from './editor.vue'

import { DOWNLOAD_FILE_PATH } from '../../../config'

export default {
  mixins: [mixin],
  components: {
    pagination,
    editor
  },
  data() {
    return {
      editMode: 'add',
      targetId: '',
      editDialog: false,
      active: '',
      pageSize: 10,
      queryForm: {},
      pertionnelInfo: [],
      caseId: '',
      cjrId: '',
      pageInfo: { // 页面分页信息相关配置
        count: 10,
        limit: 10,
        currentpage: 1
      }
    }
  },
  computed: {
    ...mapState(['caseClues'])
  },
  methods: {
    dataMatch(singleData) {
      // 数据字段匹配
      let _item = {
        id: singleData.id, // 线索ID
        num: singleData.id, // 线索编号
        title: singleData.xsbt, // 线索标题
        type: singleData.xslx, // 线索类型代码
        date: singleData.xssj, // 线索日期
        org: singleData.dw, // 线索单位
        orgName: singleData.dwmc, // 线索单位
        provider: singleData.fxr, // 线索发现人
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
      for(let itf in _item.fileUrl) {
        __fileUrl.push(DOWNLOAD_FILE_PATH + _item.fileUrl[itf])
        __fileName.push(_item.fileName[itf])
      }
      _item.fileName = __fileName
      _item.fileUrl = __fileUrl

      return _item
    },
    queryList() {
      if(this.checkUserRuleCase('ajgl/clue/list', this.caseId, true, this.cjrId)) {
        // 查询列表
        this.dispatch(FETCH_CASE_CLUES_LIST, {
          data: {
            ajid: this.caseId,
            PageIndex: this.pageInfo.currentpage,
            PageSize: this.pageInfo.limit
          }
        })
      }
    },
    getQueryInfo(rowId, callback = () => {}) {
      // 查询单条信息
      this.dispatch(GET_CASE_CLUES_INFO, {
        id: rowId
      }).then(() => {
        callback()
      })
    },
    /**
     * 新增按钮事件
     */
    add() {
      this.targetId = ''
      this.editMode = 'add'
      this.editDialog = true
    },
    edit(row) {
      // 编辑单条信息
      this.getQueryInfo(row.id, () => {
        this.editMode = 'edit'
        this.editDialog = true
      })
    },
    remove(rowId, rowIndex) {
      this.$confirm('确定要删除此项?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.dispatch(REMOVE_CASE_CLUES, {
          data: {
            ids: rowId
          }
        }, rowIndex).then(() => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          this.queryList()
        })
      })
    },
    submit(form) {
      // 表单数据提交
      let submitType = ADD_CASE_CLUES
      let dataDetail = {
        xsbt: form.title, // 线索标题
        xslx: form.type, // 线索类型代码
        xssj: form.date, // 线索日期
        dw: form.org, // 线索单位this.editForm.parent[this.editForm.parent.length - 1],
        fxr: form.provider, // 线索发现人
        fjmc: form.fileName, // 附件名称
        fjlj: form.fileId, // 附件路径
        xsms: form.desc // 线索描述
      }
      if(form.id !== '') { // 判断表单id是否为空，非空可判断为更新提交
        submitType = UPDATE_CASE_CLUES
        dataDetail.id = form.id
      } else {
        dataDetail.ajid = this.caseId // 新增数据赋值当前案件id
      }
      this.dispatch(submitType, {
        data: dataDetail
      }).then(() => {
        this.editDialog = false
        if(submitType === UPDATE_CASE_CLUES) {
          this.queryList()
        } else {
          // 添加数据，更新当前显示页面
          this.pageInfo.currentpage = this.pageInfo.count % this.pageInfo.limit === 0 ? this.pageInfo.currentpage + 1 : Math.ceil(this.pageInfo.count / this.pageInfo.limit)
          this.queryList()
        }
        this.$message({
          type: 'success',
          message: '操作成功！'
        })
      })
    },
    pagenavChange(obj) {
      // 分页切换操作
      this.pageInfo.limit = obj.limit
      this.pageInfo.currentpage = obj.currentpage
      this.queryList()
    }
  },
  watch: {
    'caseClues.PageData' (val) {
      // 列表数据结构传递
      this.pertionnelInfo = val.map(d => {
        return this.dataMatch(d)
      })
      this.pageInfo.count = this.caseClues.DataCount
    }
  },
  created() {
    this.caseId = this.$route.query.a // 初始化获取案件id
    this.cjrId = this.$route.query.b // 初始化获取案件id
    this.queryList()
  },
  mounted() {}
}
</script>
