<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="用户授权" :modal-append-to-body="true" :append-to-body="true" size="small--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-form :model="editForm">
    <el-form-item label="" v-if="this.roles.sysRoleTree !== null">
      <el-checkbox-group v-model="editForm.roleIdList">
        <el-checkbox v-for="(item,i) in this.roles.sysRoleTree" :key="i" :label="item.roleId" style="display:block; margin-left:15px;">{{item.roleName}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.role-form {}
</style>
<script>
import { mapState } from 'vuex'
import { GET_SYS_ROLE_TREE, GET_SYS_USER_INFO, UPDATE_SYS_USER } from '../../../store/types'

import { clone } from '../../../utils/util'

import mixin from '../../../utils/mixin'

export default {
  mixins: [mixin],
  components: {},
  data: () => ({
    editForm: {
      face: '',
      zxid: '',
      username: '',
      password: '',
      code: '',
      gwbs: '',
      zwjb: '',
      loginauthorities: '',
      email: '',
      xm: '',
      gmsfhm: '',
      mobile: '',
      orgname: '',
      roleIdList: [],
      orgIdList: [],
      orgId: '',
      status: '1',
      sjqxkz: '4',
      dlrk: 'DLRK_4X',
      menuId: '',
      otherOrgList: []
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
    ...mapState(['users', 'roles'])
  },
  methods: {
    initDialog() {
      this.reset()
      if (this.id !== '') {
        this.dispatch(GET_SYS_USER_INFO, { userId: this.id }).then(() => {
          let resForm = clone(this.users.sysUserInfo)
          if (!resForm.roleIdList) {
            resForm.roleIdList = []
          }
          this.editForm = clone(resForm)
        })
      } else {
        this.addOrg()
      }
    },
    reset() {
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields()
      }
    },
    closeEvent() {
      this.reset()
      this.$emit('close')
    },
    submit() {
      // this.$refs.editForm.validate((valid) => {
      //   if (valid === true) {
      this.dispatch(UPDATE_SYS_USER, this.editForm).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功',
          showClose: true
        })
        this.$emit('success')
        this.$emit('close')
      })
      //   }
      // })
    }
  },
  mounted() {

  },
  created() {
    this.dispatch(GET_SYS_ROLE_TREE)
  }
}
</script>
