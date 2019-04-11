<template>
<el-dialog class="title-icon-edit" v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="单位管理" :modal-append-to-body="true" :append-to-body="true" size="large--fixed" :modal="true" @open="initDialog" :before-close="closeEvent">
  <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
    <el-row>
      <el-col :span="24">
        <el-form-item prop="id" label="ID" placeholder="请输入ID">
          <el-input v-model="editForm.id" :disabled="id!==''" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="bt" label="标题" placeholder="请输入标题">
          <el-input v-model="editForm.bt" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="gnms" label="功能描述" placeholder="请输入功能描述">
          <UE ref="processBusEditor" v-model="editForm.gnms" :height="300" :transcode="true"></UE>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="ssmk" label="所属模块" placeholder="请输入所属模块">
          <el-input v-model="editForm.ssmk" :maxlength="30"></el-input>
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
import { SYS_BRIEF_INFO, SYS_BRIEF_SAVE, SYS_BRIEF_UPDATE } from '../../../store/types'
import UE from '../../../widgets/UEeditor/editor'
import mixin from '../../../utils/mixin'
import areaSelector from '../../../widgets/area-selector/area-selector'
import { clone } from '../../../utils/util'

export default {
  mixins: [mixin],
  components: { areaSelector, UE },
  data: () => ({
    dictList: [],
    defaultArea: ['', '', ''],
    editForm: {
      id: '',
      bt: '',
      gnms: '',
      ssmk: ''
    },
    rules: {
      bt: [{
        required: true,
        message: '请输入标题'
      }],
      gnms: [{
        required: true,
        message: '请输入功能描述'
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
    ...mapState(['brief'])
  },
  methods: {
    initDialog() {
      this.reset()
      if(this.id !== '') {
        this.dispatch(SYS_BRIEF_INFO, { id: this.id }).then(() => {
          this.editForm = clone(this.brief.sysBriefInfo)
        })
      } else {
        if(this.$refs.editForm) {
          this.$refs.editForm.resetFields()
        }
        // this.editForm = {
        //   id: '',
        //   bt: '',
        //   gnms: '',
        //   ssmk: ''
        // }
      }
    },
    reset() {
      if(this.$refs.editForm) {
        // this.$refs.editForm.resetFields()
      }
    },
    closeEvent() {
      // this.$refs.editForm.resetFields()
      this.$emit('close')
    },
    submit() {
      this.$refs.editForm.validate((valid) => {
        if(valid === true) {
          this.dispatch(this.id !== '' ? SYS_BRIEF_UPDATE : SYS_BRIEF_SAVE, this.editForm).then(() => {
            this.$message({
              type: 'success',
              message: '保存成功',
              showClose: true
            })
            this.$emit('success')
          })
        }
      })
    }
  },
  mounted() {},
  created() {}
}
</script>
