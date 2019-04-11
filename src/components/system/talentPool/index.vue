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
<el-table-column align="center" prop="Jnmc" label="技能名称" width="120px"></el-table-column>
<!--<el-table-column prop="parentName" label="上级单位"></el-table-column>-->
<el-table-column align="center" prop="Jmms" label="技能描述"></el-table-column>
<el-table-column prop="UseFlag" label="是否应用" align="center" width="80"></el-table-column>
<el-table-column label="操作" width="150">
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
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="editDialog" :title="dialogTitle" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="name" label="技能名称" placeholder="请输入技能名称">
          <el-input v-model="editForm.name" :maxlength="20"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="code" label="评分范围" placeholder="请输入评分范围">
          <el-input type="number" v-model="editForm.code" :maxlength="2"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="maybetype" label="是否应用">
          <el-select v-model="editForm.maybetype" placeholder="是否应用">
            <el-option v-for="(item,i) in this.type" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="parent" label="技能描述" placeholder="请输入技能描述">
          <el-input v-model="editForm.parent" :maxlength="20"></el-input>
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
    GET_TALENT_POOL_SKILL_LIST,
    GET_SYS_SKILL_INFO,
    ADD_SKILL,
    UPDATE_SKILL,
    DELETE_SKILL
  } from '../../../store/types'

  import Tabs from '../../common/tabs.vue'
  // import AppIframe from '../common/app-iframe.vue'
  import pagination from '../../../widgets/pagination/pagination'
  import { tableFill } from '../../../utils/util'
  //  import {listToTree} from '../../../utils/listToTree'

  export default {
    mixins: [mixin],
    components: {
      Tabs,
      pagination
    },
    data() {
      return {
        count: 0,
        list: [],
        type: [{ label: '是', value: '1' }, { label: '否', value: '0' }],
        editDialog: false,
        dialogTitle: '',
        target: null,
        dictList: [],
        pagenav: {
          limit: 20,
          currentpage: 1
        },
        queryForm: {
          keyword: ''
        },
        editForm: {
          name: '',
          code: '100',
          type: '',
          maybetype: '',
          area: '',
          parent: '',
          address: '',
          sort: '99'
        },
        rules: {
          name: [{
            required: true,
            message: '请输入技能名称'
          }],
          code: [{
            required: true,
            message: '请输入评分范围"'
          }],
          type: [{
            required: false,
            message: '是否启用'
          }],
          area: [{
            required: true,
            message: '请选择归属地区'
          }],
          parent: [{
            required: true,
            message: '请输入技能描述'
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
      ...mapState(['talentPoolSkill'])
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
        if (this.target !== null) {
          this.dispatch(GET_SYS_SKILL_INFO, { KeyId: this.target.KeyId }).then(() => {
            // this.editForm = {
            //   name: this.talentPoolSkill.sysSkillInfo.name,
            //   code: this.talentPoolSkill.sysSkillInfo.orgId,
            //   type: this.talentPoolSkill.sysSkillInfo.jzlx,
            //   area: this.talentPoolSkill.sysSkillInfo.ssqydm,
            //   //              parent: this.talentPoolSkill.sysSkillInfo.parentId !== '-1' ? getTopNexus(this.talentPoolSkill.sysOrgTree, this.talentPoolSkill.sysOrgInfo.parentId, {
            //   //                id: 'orgId',
            //   //                children: 'children'
            //   //                parentId: 'parentId'
            //   //              }) : [this.talentPoolSkill.sysSkillInfo.parentId],
            //   address: this.talentPoolSkill.sysSkillInfo.address,
            //   sort: this.talentPoolSkill.sysSkillInfo.orderNum
            // }
          })
        }
      },
      reset() {},
      closeEvent() {
        this.$refs.editForm.resetFields()
        this.editDialog = false
      },
      submit() {
        this.$refs.editForm.validate((valid) => {
          if (valid === true) {
            console.log(this.editForm.maybetype)
            //   if (this.editForm.maybetype === '是') {
            //     this.editForm.maybetype = '1'
            //   } else {
            //     this.editForm.maybetype = '0'
            //   }
            console.log(this.target)
            if (this.target !== null) {
              this.dispatch(UPDATE_SKILL, {
                KeyId: this.target.KeyId,
                Jnmc: this.editForm.name,
                Jmms: this.editForm.parent,
                Pffw: this.editForm.code,
                UseFlag: this.editForm.maybetype
              }).then(() => {
                this.$message({
                  type: 'success',
                  message: '保存成功',
                  showClose: true
                })
                this.query()
                this.closeEvent()
              })
            } else {
              this.dispatch(ADD_SKILL, {
                Jnmc: this.editForm.name,
                Jmms: this.editForm.parent,
                Pffw: this.editForm.code,
                UseFlag: this.editForm.maybetype
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
          }
        })
      },
      query(val = '') {
        this.dispatch(GET_TALENT_POOL_SKILL_LIST, {
          //          Keyword: this.queryForm.keyword,
          //          PageSize: this.pagenav.limit,
          //          PageIndex: this.pagenav.currentpage
          Jnmc: val,
          BeginDate: '1990-01-01',
          EndDate: '2099-01-01',
          PageIndex: 1,
          PageSize: 10
        }).then(() => {
          console.log(this.talentPoolSkill.sysSkillList)
          this.count = this.talentPoolSkill.sysSkillList.DataCount
          this.list = this.talentPoolSkill.sysSkillList.PageData
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
          this.dispatch(DELETE_SKILL, { KeyId: [items.KeyId].join(',') }).then(() => {
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
      this.query()

      //      this.dispatch(GET_SYS_ORG_TREE).then(() => {
      //        this.orgTree = listToTree(this.orgs.sysOrgTree, '-1', 0, {
      //          id: 'orgId',
      //          parentId: 'parentId',
      //          children: 'children'
      //        })
      //      })

      tableFill(this.$, false, false, this.$(window).height() - 75)
      window.addEventListener('resize', (e) => {
        tableFill(this.$, false, false, this.$(window).height() - 75)
      })
    },
    activated() {
      this.tab = {
        label: this.$route.name,
        name: this.$route.path
      }
    },
    created() {
      this.getDict(['JZLX', 'XZQHDM'], true).then(res => {
        this.dictList = res
      })

      this.tab = {
        label: this.$route.name,
        name: this.$route.path
      }
    }
  }

</script>
