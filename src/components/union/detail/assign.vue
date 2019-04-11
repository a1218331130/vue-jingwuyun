<!-- 签收 -->
<template>
<el-form label-width="80px" class="form-box">
  <el-row>
    <el-col :span="12">
      <el-form-item label="指派给">
        <el-select v-model="form.assigner" filterable placeholder="可通过关键字搜索">
          <el-option v-for="item in userOps" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="指派原因">
        <el-input type="textarea" v-model="form.content" placeholder=""></el-input>
      </el-form-item>
    </el-col>
  </el-row>
  <div class="text-center">
    <el-button type="primary" @click="close">返回</el-button>
    <el-button type="primary" @click="submit">提交</el-button>
  </div>
</el-form>
</template>
<style lang="scss"  scoped>
.form-box {
    padding: 15px;
}
</style>
<script>
import { mapState } from 'vuex'
import { POST_UNION_ASSIGN, FETCH_SYS_USERS_BY_ORGID } from '../../../store/types'

import mixin from '../../../utils/mixin'
import { getLoginUser } from '../../../utils/storage'

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      userOps: [],
      form: {
        assigner: '',
        content: ''
      }
    }
  },
  props: ['assistId', 'processId'],
  computed: {
    ...mapState(['users'])
  },
  methods: {
    submit() {
      if (this.checkRule('Xtbg/Assign') === true) {
        if (this.form.content === '') {
          this.$alert('必需填写评论内容', '温馨提示');
        } else {
          this.dispatch(POST_UNION_ASSIGN, {
            XcId: this.assistId,
            Lczbid: this.processId,
            Assignment: this.form.content,
            Assigner: this.form.assigner
          }).then(() => {
            this.$alert('该项已成功指派给' + this.userOps.find(d => d.value === this.form.assigner).label, '操作成功', {
              confirmButtonText: '确定',
              callback: action => {
                window.location.reload()
              }
            });
          })
        }
      }
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
  mounted() {

  }
}
</script>
