<!-- 签收 -->
<template>
<el-form label-width="80px" class="form-box">
  <el-row class="form">
    <el-col :span="12">
      <el-form-item label="审核人">
        <el-select v-model="form.approveMan" filterable :disabled="form.isApprove==='0'" placeholder="可通过关键字搜索">
          <el-option v-for="item in userOps" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="侦查结果">
        <el-input type="textarea" v-model="form.remark" placeholder=""></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="结果附件">
        <upload :isFormalSubmit="isFormalSubmit" :source="attachmentSource" @upload:submit="uploadSubmit" :currentFiles="files">
          <el-button slot="button" type="primary">上传附件</el-button>
        </upload>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="内容是否需要审核" label-width="140px">
        <el-radio-group v-model="form.isApprove">
          <el-radio key="1" label="1">是</el-radio>
          <el-radio key="0" label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-col>
  </el-row>
  <div class="text-center">
    <el-button type="primary" @click="close">返回</el-button>
    <el-button type="primary" @click="submit">提交</el-button>
  </div>
</el-form>
</template>
<style lang="scss" scoped>
.form-box {
    height: 100%;
    .form {
        height: calc(100% - 30px);
        padding: 15px;
        overflow-y: auto;
        position: relative;
    }
    .btn-box {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>
<script>
import { mapState } from 'vuex'
import { POST_UNION_FEEDBACK, FETCH_SYS_USERS_BY_ORGID } from '../../../store/types'

import mixin from '../../../utils/mixin'
import { getLoginUser } from '../../../utils/storage'
import upload from '../../../widgets/upload/upload.vue'

export default {
  mixins: [mixin],
  components: {
    upload
  },
  data() {
    return {
      userOps: [],
      files: [],
      isFormalSubmit: false,
      attachmentSource: {
        id: '',
        table: ''
      },
      form: {
        isApprove: '0',
        approveMan: '',
        remark: '',
        files: []
      }
    }
  },
  computed: {
    ...mapState(['users'])
  },
  props: ['assistId', 'processId'],
  methods: {
    submit() {
      if (this.checkRule('Xtbg/Feedback') === true) {
        this.dispatch(POST_UNION_FEEDBACK, {
          XcId: this.assistId,
          Lczbid: this.processId,
          Feedback: this.form.remark,
          IsApprove: this.form.isApprove,
          FileInfos: this.form.files,
          ApproveMan: ''
        }).then(() => {
          this.$alert('操作已成功提交', '操作成功', {
            confirmButtonText: '确定',
            callback: action => {
              window.location.reload()
            }
          });
        })
      }
    },
    uploadSubmit(file) {
      // this.form.files = file.data.fileList
      this.form.files = file.data.fileList.map(d => {
        return { ID: d.response.Data.ID }
      })
    },
    close() {
      this.$emit('close')
    }
  },
  created() {
    this.dispatch(FETCH_SYS_USERS_BY_ORGID, {
      orgId: getLoginUser().UserData.DeptNo
    }).then(() => {
      this.userOps = this.users.sysUserFromOrgid.map(d => {
        return {
          label: d.xm,
          value: d.userId
        }
      })
    })
  },
  mounted() {}
}
</script>
