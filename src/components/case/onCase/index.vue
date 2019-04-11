<template>
<div v-if="caseId!==null" style="height: 100%;">
  <div class="app-toolbar" style="border: none">
    <span class="" style="color: #46BDFD;font-size: 16px">串案管理</span>
    <div class="app-search__buttons" v-if="checkUserRuleCase('ajgl/oncase/save',caseId,true,cjrId)">
      <!-- <el-button type="primary" size="small" icon="plus" @click="add()">新增</el-button> -->
      <el-button type="primary" size="small" icon="plus" @click="dialogObjectSelector=true">手动串案</el-button>
      <el-button type="primary" size="small" icon="icon iconfont icon-fenxi" style="background-color:#FF9900" @click="autoDialog=true">自动串案</el-button>
    </div>
  </div>
  <div class="app-content-box">
    <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" border stripe :data="baseInfo">
      <el-table-column type="index" label="序号" align="center" width="100">
        <template scope="scope">
          {{scope.$index + 1 + pageInfo.limit * (pageInfo.currentpage - 1)}}
        </template>
      </el-table-column>
      <el-table-column prop="caseName" label="案件名称"></el-table-column>
      <el-table-column prop="BriefCase" label="简要案情" width="600"></el-table-column>
      <el-table-column prop="type" label="案件类别"></el-table-column>
      <el-table-column prop="area" label="案发地点"></el-table-column>
      <el-table-column prop="time" label="案件开始时间"></el-table-column>
      <el-table-column prop="org" label="管辖单位"></el-table-column>
      <el-table-column prop="descrit" label="描述"></el-table-column>
      <el-table-column prop="source" label="来源">
        <template scope="scope">
          <!-- {{ {1:'自动串并', 2:'手动添加'}[scope.row.ly] || '-'}} -->
          {{scope.row.source==='1'?'自动串并':(scope.row.source==='2'?'手动添加':'-')}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template scope="scope">
          <el-button v-if="scope.row.source!=='1' && checkUserRuleCase('ajgl/oncase/update',caseId,true,cjrId)" type="primary" size="mini" @click="edit(scope.row)" icon="icon iconfont icon-brush">编辑
          </el-button>
          <el-button v-if="checkUserRuleCase('ajgl/oncase/delete',caseId,true,cjrId)" type="danger" size="mini" @click="remove(scope.row.id,scope.$index)" icon="icon iconfont icon-trash">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="app-toolbar footer">
    <pagination :count="pageInfo.count" :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}" @update:pagenav="pagenavChange"></pagination>
  </div>
  <!-- 编辑模态窗 large/tiny-->
  <editor :dialog="editDialog" :data="caseData" :editmode="editMode" @close="editDialog=false" @form:submit="submit"></editor>

  <dialog-auto :dialog="autoDialog" :caseId="caseId" @close="autoDialogClose"></dialog-auto>
  <object-selector-dialog :dialog="dialogObjectSelector" mode="caseOnly" @close="dialogObjectSelector=false" @call:addObject="add"></object-selector-dialog>
</div>
<div v-else class="empty">
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
import { FETCH_SERIES_CASE_LIST, GET_SERIES_CASE_INFO, ADD_SERIES_CASE, UPDATE_SERIES_CASE, REMOVE_SERIES_CASE } from '../../../store/types'

import dialogAuto from './dialog-auto'
import objectSelectorDialog from '../../../widgets/object-selector-dialog/object-searcher-dialog'
import pagination from '../../../widgets/pagination/pagination'
import editor from './editor.vue'

export default {
  mixins: [mixin],
  components: {
    pagination,
    editor,
    dialogAuto,
    objectSelectorDialog
  },
  data() {
    return {
      autoDialog: false,
      dialogObjectSelector: false,
      editMode: 'add',
      targetId: '',
      editDialog: false,
      active: '',
      queryForm: {},
      formdate: {},
      baseInfo: [],
      caseId: '',
      cjrId: '',
      caseData: null,
      pageInfo: { // 页面分页信息相关配置
        count: 10,
        limit: 10,
        currentpage: 1
      }
    }
  },
  props: [],
  computed: {
    ...mapState(['seriesCase'])
  },
  methods: {
    queryList() {
      if(this.checkUserRuleCase('ajgl/oncase/list', this.caseId, true, this.cjrId)) {
        this.dispatch(FETCH_SERIES_CASE_LIST, {
          ajid: this.caseId,
          PageIndex: this.pageInfo.currentpage,
          PageSize: this.pageInfo.limit
        })
      }
    },
    getQueryInfo(rowId, callback = () => {}) {
      // 查询单条信息
      this.dispatch(GET_SERIES_CASE_INFO, {
        id: rowId
      }).then(() => {
        callback()
      })
    },
    /**
     * 新增按钮事件
     */
    add(res) {
      this.targetId = ''
      this.editMode = 'add'
      this.editDialog = true
      this.caseData = res.data
      // if(!res) {
      //   this.targetId = ''
      //   this.editMode = 'add'
      //   this.editDialog = true
      // } else {
      //   // 新手动串案
      //   this.submit(res.data)
      // }
    },
    edit(row) {
      // 编辑串案案件信息
      this.getQueryInfo(row.id, () => {
        this.caseData = null
        this.editMode = 'edit'
        this.editDialog = true
      })
    },
    remove(rowId, rowIndex) {
      // 删除
      this.$confirm('确定要删除此项?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.dispatch(REMOVE_SERIES_CASE, {
          id: rowId
        }, rowIndex).then(() => {
          this.$message({
            type: 'success',
            message: '删除串联案件成功！'
          })
          this.queryList()
        })
      }).catch(() => {});
    },
    submit(form) {
      // 表单数据提交
      let submitType = ADD_SERIES_CASE
      let dataDetail
      if(form.asjbh) {
        dataDetail = {
          ajbh: form.asjbh,
          ajmc: form.ajmc,
          jyaq: form.jyaq,
          ajlx: form.CaseType,
          afsj: form.asjfssj,
          gxdw: form.ladw_gajgjgdm,
          ms: form.sy_jyaq,
          ly: '2'
        }
        this.objectSelectorDialog = false
      } else {
        dataDetail = {
          ajbh: form.CaseNumber,
          ajmc: form.CaseName,
          jyaq: form.BriefCase,
          ajlx: form.CaseType,
          afsj: form.CaseTime,
          gxdw: form.CaseOrg,
          ms: form.means,
          ly: '2'
        }
      }
      if(!form.id === false) { // 判断表单id是否为空，非空可判断为更新提交
        submitType = UPDATE_SERIES_CASE
        dataDetail.id = form.id
      } else {
        dataDetail.ajid = this.caseId // 新增数据赋值当前案件id
      }
      this.dispatch(submitType, dataDetail).then(() => {
        this.editDialog = false
        if(submitType === UPDATE_SERIES_CASE) {
          this.queryList()
        } else {
          // 添加数据，更新当前显示页面
          this.pageInfo.currentpage = this.pageInfo.count % this.pageInfo.limit === 0 ? this.pageInfo.currentpage + 1 : Math.ceil(this.pageInfo.count / this.pageInfo.limit)
          this.queryList()
          this.$message('新增串案成功')
        }
      })
    },
    pagenavChange(obj) {
      // 分页切换操作
      this.pageInfo.limit = obj.limit
      this.pageInfo.currentpage = obj.currentpage
      this.queryList()
    },
    autoDialogClose(val) {
      if(val === true) {
        this.pageInfo.currentpage = 1
        this.queryList()
      }
      this.autoDialog = false
    }
  },
  watch: {
    'seriesCase.PageData' (val) {
      this.baseInfo = val.map(d => {
        return {
          id: d.id,
          caseName: d.ajmc,
          BriefCase: d.jyaq,
          area: d.afdd,
          type: d.ajlxmc,
          org: d.gxdwmc,
          descrit: d.ms,
          CaseStatusCode: 1,
          time: d.afsj,
          source: d.ly
        }
      })
      this.pageInfo.count = this.seriesCase.DataCount
    }
  },
  created() {
    this.caseId = this.$route.query.a || null // 初始化获取案件id
    this.cjrId = this.$route.query.b || '' // 初始化获取案件id
    this.queryList()
  },
  mounted() {}
}
</script>
