<template>
<div>
  <tabs :tab="tab"></tabs>
  <div class="app-toolbar">
    <!-- <app-iframe url="/qingbaoyun-navigation/sys/org.html"></app-iframe> -->

    <!-- 查询条件 -->
    <el-form :inline="true" label-position="right" label-width="80px">
      <el-form-item prop="queryForm.keyword" label="关键字">
        <el-input v-model="queryForm.keyword" placeholder="请输入技能关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" native-type="submit" @click.prevent="query(queryForm.keyword)">查询</el-button>
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
<!-- <el-table-column prop="code" label="单位编号"></el-table-column> -->
<el-table-column align="center" prop="bt" label="标题" width="400"></el-table-column>
<!--<el-table-column prop="parentName" label="上级单位"></el-table-column>-->
<el-table-column align="center" prop="type" label="类型">
  <template scope="props">
          {{props.row.type==="0"?"通用模板":"单位模板"}}
        </template>
</el-table-column>
<el-table-column prop="cjrxm" label="创建人" align="center"></el-table-column>
<el-table-column prop="cjsj" label="创建时间" align="center"></el-table-column>
<el-table-column prop="xgrxm" label="修改人" align="center"></el-table-column>
<el-table-column prop="xgsj" label="修改时间" align="center"></el-table-column>
<el-table-column label="操作" width="220" align="center">
  <template scope="scope">
          <el-button type="primary" size="mini" icon="icon iconfont icon-brush" @click="edit(scope.row)">编辑
          </el-button>
          <el-button type="danger" size="mini" icon="icon iconfont icon-trash" @click="remove(scope.row)">删除
          </el-button>
        </template>
</el-table-column>
</el-table>
</div>
<!-- 分页栏 -->
<div class="app-toolbar">
  <pagination :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
</div>

<!-- 编辑模态窗 -->
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="editDialog" :title="dialogTitle" :modal-append-to-body="true" :append-to-body="true" size="large--fixed" :modal="true" :close-on-click-modal="false" :before-close="initData">
  <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px" style="padding-right:20px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="类型">
          <el-select v-model="editForm.type" placeholder="请选择类型">
            <el-option v-for="(item,index) in this.dictList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="org" label="单位">
          <el-select v-model="editForm.org" placeholder="请输入单位">
            <el-option v-for="(item,i) in orgTree" :key="i" :value="item.KeyId" :label="item.DeptName"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="bt" label="模板标题">
          <el-input v-model="editForm.bt" placeholder="请输入模板标题"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="nr" label="模板内容">
          <UE ref="processBusEditor" v-model="editForm.nr" :width="728" :height="300" :transcode="true"></UE>
        </el-form-item>
      </el-col>
      <!--<el-col :span="12">-->
      <!--<el-form-item prop="area" label="归属地区">-->
      <!--<el-select v-model="editForm.area" placeholder="请选择地区">-->
      <!--<el-option v-for="(item,i) in this.dictList['XZQHDM']" :key="i" :label="item.label"-->
      <!--:value="item.value"></el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="24">-->
      <!--<el-form-item prop="address" label="地址" placeholder="请输入单位地址">-->
      <!--<el-input v-model="editForm.address" :maxlength="50"></el-input>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="7">-->
      <!--<el-form-item prop="sort" label="排序号" placeholder="请输入排序号">-->
      <!--<el-input type="number" v-model="editForm.sort" :maxlength="2"></el-input>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
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
  import mixin from '../../../utils/mixin'
  import { mapState } from 'vuex'
  import {
    FETCH_QUERY_LIST,
    ADD_MOULD_INFO,
    UPDATE_MOULD_INFO,
    DELETE_MOULD_INFO
  } from '../../../store/types'

  import Tabs from '../../common/tabs.vue'
  import pagination from '../../../widgets/pagination/pagination'
  import { tableFill } from '../../../utils/util'
  import UE from '../../../widgets/UEeditor/editor'

  export default {
    mixins: [mixin],
    components: {
      Tabs,
      pagination,
      UE
    },
    data() {
      return {
        count: 0,
        list: [],
        id: '',
        // type: [{ label: '是', value: '1' }, { label: '否', value: '0' }],
        type: '',
        editDialog: false,
        dialogTitle: '',
        target: null,
        dictList: [{
          label: '通用模板',
          value: '0'
        }, {
          label: '单位模板',
          value: '1'
        }],
        orgList: [],
        pagenav: {
          limit: 15,
          currentpage: 1
        },
        queryForm: {
          keyword: ''
        },
        editForm: {
          type: '0',
          org: '',
          bt: '',
          nr: '',
          sfsc: '0'
        },
        rules: {
          bt: [{
            required: true,
            message: '请输入模板标题'
          }],
          nr: [{
            required: true,
            message: '模板内容不能为空'
          }]
        },
        orgTree: [],
        treeProps: {
          children: 'children',
          label: 'name',
          value: 'orgId'
        }
      }
    },
    computed: {
      ...mapState(['cooperative', 'orgs'])
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
      initData() {
        // this.YwdmOps
        this.id = ''
        this.editForm = { type: '0', org: '', bt: '', nr: '', sfsc: '0' }
        if (this.$refs.processBusEditor) this.$refs.processBusEditor.setContent('')
        if (this.$refs.editForm) this.$refs.editForm.resetFields()
        this.editDialog = false
      },
      reset() {},
      closeEvent() {
        // this.$refs.editForm.resetFields()
        this.editDialog = false
      },
      // 提交
      submit() {
        this.$refs.editForm.validate((valid) => {
          if (!this.editForm.nr) {
            this.$message({
              type: 'warning',
              message: '模板内容不能为空',
              showClose: true,
              duration: 1500
            })
            return
          }
          if (valid === true) {
            if (this.type === 'add') {
              this.dispatch(ADD_MOULD_INFO, {
                id: '',
                type: this.editForm.type,
                orgid: this.editForm.org,
                bt: this.editForm.bt,
                nr: this.editForm.nr,
                sfsc: '0'
              }).then(() => {
                this.$message({
                  type: 'success',
                  message: '保存成功',
                  showClose: true
                })
                this.queryForm.keyword = ''
                this.query()
                this.closeEvent()
              })
            } else if (this.type === 'edit') {
              this.dispatch(UPDATE_MOULD_INFO, {
                id: this.id,
                type: this.editForm.type,
                orgid: this.editForm.org,
                bt: this.editForm.bt,
                nr: this.editForm.nr,
                sfsc: '0'
              }).then(() => {
                this.$message({
                  type: 'success',
                  message: '保存成功',
                  showClose: true
                })
                this.queryForm.keyword = ''
                this.query()
                this.closeEvent()
              })
            }
          }
        })
      },
      // 查询
      query(val = '') {
        this.dispatch(FETCH_QUERY_LIST, {
          //          Keyword: this.queryForm.keyword,
          //          PageSize: this.pagenav.limit,
          //          PageIndex: this.pagenav.currentpage
          'Keyword': this.queryForm.keyword,
          'orgid': '',
          'PageIndex': this.pagenav.currentpage,
          'PageSize': this.pagenav.limit
        }).then(() => {
          this.count = this.cooperative.queryList.DataCount
          this.list = this.cooperative.queryList.PageData
        })
      },
      // 新增
      add() {
        this.type = 'add'
        this.initData()
        this.dialogTitle = '新增'
        this.target = null
        this.editDialog = true
      },
      // 编辑
      edit(item) {
        this.type = 'edit'
        this.id = item.id
        this.editDialog = true
        this.dialogTitle = '修改'
        this.editForm = {
          type: item.type,
          bt: item.bt,
          org: item.orgid,
          nr: item.nr
        }
        if (this.$refs.processBusEditor) this.$refs.processBusEditor.setContent(this.editForm.nr)
      },
      // 删除
      remove(item) {
        this.$confirm('确定要删除这些选项?', '温馨提示', {
          type: 'warning'
        }).then(() => {
          this.dispatch(DELETE_MOULD_INFO, { id: item.id }).then(() => {
            this.$message({
              type: 'success',
              message: '选项删除成功',
              showClose: true
            })
            this.queryForm.keyword = ''
            this.query()
          })
        })
      }
    },
    mounted() {
      this.query()
      this.orgTree = this.userOrgInfo.orgList
      tableFill(this.$, false, false, this.$(window).height() - 112)
      window.addEventListener('resize', (e) => {
        tableFill(this.$, false, false, this.$(window).height() - 112)
      })
    },
    activated() {
      this.tab = {
        label: this.$route.name,
        name: this.$route.path
      }
    },
    created() {
      // this.getDict(['JZLX', 'XZQHDM'], true).then(res => {
      //   this.dictList = res
      // })

      this.tab = {
        label: this.$route.name,
        name: this.$route.path
      }
    }
  }

</script>
