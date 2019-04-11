<template>
<div>
  <tabs :tab="tab"></tabs>
  <div class="app-toolbar">
    <!-- <app-iframe url="/qingbaoyun-navigation/sys/org.html"></app-iframe> -->

    <!-- 查询条件 -->
    <el-form :inline="true" label-position="right" label-width="80px">
      <el-form-item prop="keyword" label="关键字">
        <el-input v-model="queryForm.keyword" placeholder="请输入单位名称关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" native-type="submit" @click.prevent="query">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="queryForm.isAll">展示下级单位</el-checkbox>
      </el-form-item>
      <el-form-item>
        <breifPopover contentId="dfe80fe9da9b40f7899cc8fd4ab18" style="padding-top:0px"></breifPopover>
      </el-form-item>
    </el-form>
    <div class="app-search__buttons">
      <el-button type="primary" icon="plus" @click="add">新增</el-button>
    </div>
  </div>
  <!-- 查询结果 -->
  <div class="app-content-box">
    <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading.body="loading" border :stripe="true" :data="list">
      <el-table-column type="index" label="序号" align="center" width="80">
        <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="单位名称"></el-table-column>
      <el-table-column prop="parentName" label="上级单位"></el-table-column>
      <el-table-column prop="address" label="单位地址"></el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button type="primary" size="mini" icon="icon iconfont icon-brush" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" icon="icon iconfont icon-trash" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 分页栏 -->
  <div class="app-toolbar">
    <pagination :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
  </div>

  <!-- 编辑模态窗 -->
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="editDialog" :title="dialogTitle" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
    <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="name" label="单位名称" placeholder="请输入单位名称">
            <el-input v-model="editForm.name" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="code" label="单位编号" placeholder="请输入单位编号">
            <el-input v-model="editForm.code" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="type" label="警种">
            <el-select v-model="editForm.type" placeholder="请选择警种">
              <el-option v-for="(item,i) in this.dictList['JZLX']" :key="i" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="parent" label="上级单位" placeholder="请选择上级单位">
            <el-cascader :options="orgTree" v-model="editForm.parent" :props="treeProps" change-on-select></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="area" label="归属地区">
            <el-select :readonly="editForm.parent.length>0" v-model="editForm.area" placeholder="请选择地区">
              <el-option v-for="(item,i) in areaOps" :key="i" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="address" label="地址" placeholder="请输入单位地址">
            <el-input v-model="editForm.address" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="sort" label="排序号" placeholder="请输入排序号">
            <el-input type="number" v-model="editForm.sort" :maxlength="2"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="" @click="closeEvent">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<style scoped>
.app-toolbar .el-form-item {
  margin-bottom: 0;
}
</style>
<script>
import mixin from '../../utils/mixin'
import { mapState } from 'vuex'
import { GET_SYS_ORG_LIST, GET_SYS_ORG_INFO, ADD_SYS_ORG, UPDATE_SYS_ORG, DELETE_SYS_ORG } from '../../store/types'
import breifPopover from '../../widgets/brief-popover/brief-popover.vue'
import Tabs from '../common/tabs.vue'
// import AppIframe from '../common/app-iframe.vue'
import pagination from '../../widgets/pagination/pagination'
import { getTopNexus, tableFill } from '../../utils/util'

export default {
  mixins: [mixin],
  components: {
    Tabs,
    breifPopover,
    pagination
  },
  data() {
    return {
      count: 0,
      list: [],
      editDialog: false,
      dialogTitle: '',
      target: null,
      dictList: [],
      pagenav: {
        limit: 20,
        currentpage: 1
      },
      queryForm: {
        keyword: '',
        isAll: ''
      },
      editForm: {
        name: '',
        code: '',
        type: '',
        area: '',
        parent: [],
        address: '',
        sort: '99'
      },
      rules: {
        name: [{
          required: true,
          message: '请输入单位名称'
        }],
        code: [{
          required: true,
          message: '单位编号'
        }],
        // type: [{
        //   required: true,
        //   message: '请选择警种'
        // }],
        area: [{
          required: true,
          message: '请选择归属地区'
        }],
        parent: [{
          required: true,
          message: '请选择上级单位'
        }]
      },
      orgTree: [],
      orgList: [],
      treeProps: {
        children: 'children',
        label: 'name',
        value: 'orgId'
      }
    }
  },
  computed: {
    areaOps() {
      let res = [],
        orgId
      if(this.editForm.parent.length > 0) {
        orgId = this.editForm.parent[this.editForm.parent.length - 1]
        res = this.dictList['XZQHDM'].filter(d => d.parentId === this.orgList.find(o => o.orgId === orgId).sscsdm)
      }
      return res
    },
    ...mapState(['orgs'])
  },
  watch: {
    pagenav: {
      handler() {
        this.query()
      },
      deep: true
    }
  },
  methods: {
    initDialog() {
      if(this.target !== null) {
        this.dispatch(GET_SYS_ORG_INFO, { orgId: this.target.orgId }).then(() => {
          this.editForm = {
            name: this.orgs.sysOrgInfo.name,
            code: this.orgs.sysOrgInfo.orgId,
            type: this.orgs.sysOrgInfo.jzlx,
            area: this.orgs.sysOrgInfo.ssqydm,
            parent: this.orgs.sysOrgInfo.parentId !== '-1' ? getTopNexus(this.orgs.sysOrgTree, this.orgs.sysOrgInfo.parentId, {
              id: 'orgId',
              children: 'children',
              parentId: 'parentId'
            }) : [this.orgs.sysOrgInfo.parentId],
            address: this.orgs.sysOrgInfo.address,
            sort: this.orgs.sysOrgInfo.orderNum
          }
        })
      } else {
        this.editForm.parent = [this.userOrgInfo.mainOrgId]
      }
    },
    reset() {},
    closeEvent() {
      this.$refs.editForm.resetFields()
      this.editDialog = false
    },
    submit() {
      this.$refs.editForm.validate((valid) => {
        if(valid === true) {
          this.dispatch(this.target !== null ? UPDATE_SYS_ORG : ADD_SYS_ORG, {
            name: this.editForm.name,
            orgId: this.editForm.code,
            code: this.editForm.code,
            jzlx: this.editForm.type,
            ssqydm: this.editForm.area,
            parentId: this.editForm.parent[this.editForm.parent.length - 1],
            address: this.editForm.address,
            orderNum: this.editForm.sort
          }).then(() => {
            this.$message({
              type: 'success',
              message: '保存成功',
              showClose: true
            })
            this.query()
            this.closeEvent()
          })
        }
      })
    },
    query() {
      this.dispatch(GET_SYS_ORG_LIST, {
        Keyword: this.queryForm.keyword,
        isAll: this.queryForm.isAll === true ? '1' : '0',
        PageSize: this.pagenav.limit,
        PageIndex: this.pagenav.currentpage
      }).then(() => {
        this.count = this.orgs.sysOrgList.DataCount
        this.list = this.orgs.sysOrgList.PageData
      })
    },
    add() {
      this.dialogTitle = '新增'
      this.target = null
      this.editDialog = true
    },
    edit(item) {
      this.dialogTitle = '修改'
      this.target = item
      this.editDialog = true
    },
    remove(items) {
      this.$confirm('确定要删除这些选项?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.dispatch(DELETE_SYS_ORG, { orgIds: [items.orgId].join(',') }).then(() => {
          this.$message({
            type: 'success',
            message: '选项删除成功',
            showClose: true
          })
          this.query()
        })
      })
    }
  },
  mounted() {
    this.$nextTick(() => {

      this.getRuleOrgTree('', true).then(d => {
        this.orgTree = d.map
        this.orgList = d.list
      })
      this.getDict(['JZLX', 'XZQHDM'], true).then(res => {
        this.dictList = res
      })

      this.tab = {
        label: this.$route.name,
        name: this.$route.path
      }
      this.query()

      tableFill(this.$, false, false, this.$(window).height() - 112)
      window.addEventListener('resize', (e) => {
        tableFill(this.$, false, false, this.$(window).height() - 112)
      })
    })
  },
  created() {

  }
}
</script>
