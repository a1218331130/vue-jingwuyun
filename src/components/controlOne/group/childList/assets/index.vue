<template>
<div style="height: 100%;">


  <tableList ref='tablelist' title="实物资产信息列表" :tab="table.swzc" :list="pertionnelInfo" :pagenav="pageInfo" :edit="checkRule('fxpcgk/assets/update',basePeople)" :countLength="pageInfo.count" :readonly="readonly" :isEnd="isEnd" :remove="checkRule('fxpcgk/assets/delete',basePeople)"
    @on:add="add" @on:edit="edit" @on:remove="remove" @on:pagenav="pagenavChange"></tableList>


  <!-- 编辑模态窗 large/tiny-->
  <editor :dialog="editDialog" :dataForm="dataForm" :editmode="editMode" @close="editDialog=false" @form:submit="submit"></editor>
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
import { clone } from '../../../../../utils/util'
import { mapState } from 'vuex'
import mixin from '../../../../../utils/mixin'
import tableListMixin from '../../../tableListMixin'
import {
  // FXPCGK_RELATIONER_LIST,
  FXPCGK_ASSETS_INFO,
  FXPCGK_ASSETS_SAVE,
  FXPCGK_ASSETS_UPDATE,
  FXPCGK_ASSETS_DELETE,
  FXPCGK_ASSETS_LIST
} from '../../../../../store/types'
import pagination from '../../../../../widgets/pagination/pagination'
import editor from './editor.vue'
import tableList from '../tableList.vue'

export default {
  mixins: [mixin, tableListMixin],
  components: {
    pagination,
    editor,
    tableList
  },
  data() {
    return {
      editMode: 'add',
      dataForm: {
        id: '',
        fjid: '',
        sfsc: '',
        zclb: '',
        zcmc: '',
        zcdz: '',
        xgr: '',
        xgsj: '',
        cjr: '',
        cjsj: '',
        xgrxm: '',
        xgdw: '',
        xgdwmc: '',
        cjdw: '',
        cjdwmc: '',
        cjrxm: ''
      },
      targetId: '',
      editDialog: false,
      active: '',
      isEnd: false,
      pageSize: 10,
      queryForm: {},
      pertionnelInfo: [],
      gxrdata: [],
      basePeople: '',
      pageInfo: { // 页面分页信息相关配置
        count: 0,
        limit: 10,
        currentpage: 1
      },
      pageInfo2: { // 页面分页信息相关配置
        count: 0,
        limit: 10,
        currentpage: 1
      }
    }
  },
  props: ['mainId', 'readonly', 'IDcard'],
  computed: {
    ...mapState(['focusPerson'])
  },
  methods: {
    queryList() {
      if(this.mainId) {
        // 查询列表
        this.dispatch(FXPCGK_ASSETS_LIST, {
          fjid: this.mainId,
          sfz: this.IDcard,
          PageIndex: this.pageInfo.currentpage,
          PageSize: this.pageInfo.limit
        }).then(() => {
          this.pertionnelInfo = this.focusPerson.fxpcgkAssetsList.PageData
          this.pageInfo.count = this.focusPerson.fxpcgkAssetsList.DataCount
          this.isEnd = true
        })
        // this.dispatch(FXPCGK_RELATIONER_LIST, {
        //   fjid: this.mainId,
        //   PageIndex: this.pageInfo2.currentpage,
        //   PageSize: this.pageInfo2.limit
        // }).then(() => {
        //   this.gxrdata = this.focusPerson.fxpcgkRelationerList.PageData
        //   this.pageInfo2.count = this.focusPerson.fxpcgkRelationerList.DataCount
        // })
      }
    },
    /**
     * 查询单条信息
     */
    getQueryInfo(rowId, callback = () => {}) {
      this.dispatch(FXPCGK_ASSETS_INFO, {
        id: rowId
      }).then(() => {
        callback(this.focusPerson.fxpcgkAssetsInfo)
      })
    },
    /**
     * 新增按钮事件
     */
    add() {
      this.targetId = ''
      this.$refs['tablelist'].reset(this.dataForm)
      this.dataForm.fjid = this.mainId
      this.editMode = 'add'
      this.editDialog = true
    },
    edit(row) {
      // 编辑单条信息
      this.getQueryInfo(row.id, (val) => {
        this.dataForm = clone(val)
        this.editMode = 'edit'
        this.editDialog = true
      })
    },
    remove(obj) {
      this.$confirm('确定要删除此项?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.dispatch(FXPCGK_ASSETS_DELETE, {
          ids: obj.row.id
        }, obj.index).then(() => {
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
      let submitType = FXPCGK_ASSETS_SAVE
      if(form.id !== '') { // 判断表单id是否为空，非空可判断为更新提交
        submitType = FXPCGK_ASSETS_UPDATE
      }
      this.dispatch(submitType,
        form
      ).then(() => {
        this.editDialog = false
        this.$message({
          type: 'success',
          message: '操作成功！'

        })
        this.queryList()
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
      this.pertionnelInfo = val
      this.pageInfo.count = this.caseClues.DataCount
    },
    mainId(val) {
      this.queryList()
    }
  },
  created() {},
  mounted() {
    this.queryList()
  }
}
</script>
