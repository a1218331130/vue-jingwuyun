<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="单位管理" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
    <el-row>
      <el-col :span="24">
        <el-form-item prop="name" label="单位名称" placeholder="请输入单位名称">
          <el-input v-model="editForm.name" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="13">
        <el-form-item prop="code" label="单位编号" placeholder="请输入单位编号">
          <el-input v-model="editForm.code" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="type" label="警种">
          <el-select v-model="editForm.type" placeholder="请选择警种">
            <el-option v-for="(item,i) in this.dictList['JZLX']" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="parent" label="上级单位" placeholder="请选择上级单位">
          <el-cascader :options="orgTree" v-model="editForm.parent" filterable :props="treeProps" change-on-select></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="area" label="归属地区">
          <!-- 旧式级联 -->
          <area-selector v-model="editForm.area" :defaultArea="defaultArea"></area-selector>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="address" label="单位地址" placeholder="请输入单位地址">
          <el-input v-model="editForm.address" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="center" label="所属中心" placeholder="请选择中心">
          <el-select v-model="editForm.center" placeholder="请选择中心">
            <el-option v-for="(item,i) in this.dictList['SLZX']" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
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
</template>
<style lang="scss" scoped>
.user-form {}
</style>
<script>
import { mapState } from 'vuex'
import { GET_SYS_ORG_INFO, ADD_SYS_ORG, UPDATE_SYS_ORG } from '../../../store/types'

import mixin from '../../../utils/mixin'
import areaSelector from '../../../widgets/area-selector/area-selector'
import { getTopNexus } from '../../../utils/util'

export default {
  mixins: [mixin],
  components: { areaSelector },
  data: () => ({
    dictList: [],
    defaultArea: ['', '', ''],
    editForm: {
      name: '',
      code: '',
      type: '',
      area: ['', '', ''],
      parent: [],
      address: '',
      sort: '99',
      center: '1'
    },
    rules: {
      name: [{
        required: true,
        message: '请输入单位名称'
      }],
      code: [{
        required: true,
        message: '请输入单位编号'
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
  }),
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
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
  methods: {
    initDialog() {
      this.dictList.length === 0 && this.getDict(['JZLX', 'XZQHDM', 'SLZX'], true).then(res => {
        this.dictList = res
      })
      this.reset()
      if(this.id !== '') {
        this.dispatch(GET_SYS_ORG_INFO, { orgId: this.id }).then(() => {
          this.editForm = {
            name: this.orgs.sysOrgInfo.name,
            code: this.orgs.sysOrgInfo.orgId,
            type: this.orgs.sysOrgInfo.jzlx,
            area: [this.orgs.sysOrgInfo.sssfdm, this.orgs.sysOrgInfo.sscsdm, this.orgs.sysOrgInfo.ssqydm],
            parent: getTopNexus(this.orgList, this.orgs.sysOrgInfo.parentId, {
              id: 'orgId',
              children: 'children',
              parentId: 'parentId'
            }),
            address: this.orgs.sysOrgInfo.address,
            center: this.orgs.sysOrgInfo.slzx,
            sort: this.orgs.sysOrgInfo.orderNum
          }
          this.defaultArea = this.editForm.area
        })
      } else {
        this.editForm.parent = [this.userOrgInfo.mainOrgId]
        this.defaultArea = [this.userOrgInfo.mainOrg.SSSFDM, this.userOrgInfo.mainOrg.SSCSDM, ''] // this.userOrgInfo.mainOrg.SSQYDM
      }
    },
    reset() {
      if(this.$refs.editForm) {
        this.$refs.editForm.resetFields()
      }
    },
    closeEvent() {
      this.$refs.editForm.resetFields()
      this.$emit('close')
    },
    submit() {
      this.$refs.editForm.validate((valid) => {
        if(valid === true) {
          if(this.editForm.area[0] === '' || this.editForm.area[1] === '') { //  && this.editForm.area[2] === ''
            this.$alert('必需选择归属地区', '温馨提示');
          } else {
            this.dispatch(this.id !== '' ? UPDATE_SYS_ORG : ADD_SYS_ORG, {
              name: this.editForm.name,
              orgId: this.editForm.code,
              code: this.editForm.code,
              jzlx: this.editForm.type,
              // ssqydm: this.editForm.area,
              parentId: this.editForm.parent[this.editForm.parent.length - 1],
              address: this.editForm.address,
              orderNum: this.editForm.sort,
              slzx: this.editForm.center,
              sscsdm: this.editForm.area[1] || '', // 所属城市代码（字典XZQHDM）
              // sscsmc: '', // 所属城市名称
              ssqydm: this.editForm.area[2] || '', // 所属区域代码（字典XZQHDM）
              // ssqymc: '', // 所属区域名称
              sssfdm: this.editForm.area[0] || '' // 所属省份代码（字典XZQHDM）
              // sssfmc: '' // 所属省份名称
            }).then(() => {
              this.$message({
                type: 'success',
                message: '保存成功',
                showClose: true
              })
              this.$emit('success')
            })
          }
        }
      })
    }
  },
  mounted() {

  },
  created() {
    this.getRuleOrgTree('', true).then(d => {
      this.orgTree = d.map
      this.orgList = d.list
    })
  }
}
</script>
