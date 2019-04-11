<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="修改用户密码" style="text-align: left" :modal-append-to-body="false" :append-to-body="true" size="middle-fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-form ref="passForm" :rules="rules" :model="form" label-width="110px">
    <el-form-item prop="oldPass" label="原密码">
      <el-input type="password" v-model="form.oldPass"></el-input>
    </el-form-item>
    <el-form-item prop="newPass" label="新密码">
      <el-input type="password" v-model="form.newPass"></el-input>
    </el-form-item>
    <el-form-item prop="confirmPass" label="确认新密码">
      <el-input type="password" v-model="form.confirmPass"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">确认</el-button>
  </div>
</el-dialog>
</template>

<script>
import { UPDATE_PASSWORD } from '../../store/types'
import mixin from '../../utils/mixin'

/**
 * @module DialogPassEditor
 * @desc 修改密码模态窗
 *
 * @example <dialog-pass-editor :dialog="dialog" @close="dialog=false"></dialog-pass-editor>
 */
export default {
  mixins: [mixin],
  data() {
    let validatePass = (rule, value, callback) => {
      if(value === '') {
        callback(new Error('确认新密码不能为空'))
      } else if(value !== this.form.newPass) {
        callback(new Error('新密码与确认密码不一致'))
      } else {
        callback()
      }
    }
    return {
      form: {
        oldPass: '',
        newPass: '',
        confirmPass: ''
      },
      rules: {
        oldPass: [{ required: true, message: '原密码不能为空' }],
        newPass: [{ required: true, message: '新密码不能为空' }],
        confirmPass: [{ validator: validatePass, trigger: 'blur' }]
      }
    }
  },
  /**
   * 接收参数
   * @prop {Boolean} defaultArea 是否显示窗口 @default false
   */
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    initDialog() {},
    closeEvent() {
      this.reset()
      /**
       * 关闭窗口事件
       * @event module:DialogPassEditor~close
       */
      this.$emit('close')
    },
    submit() {
      this.$refs.passForm.validate((valid) => {
        if(valid === true) {
          // 提交
          this.dispatch(UPDATE_PASSWORD, {
            password: this.form.oldPass,
            newPassword: this.form.confirmPass
          }).then(() => {
            this.$alert('密码修改成功, 请返回登录页重新登录!', '操作成功', {
              confirmButtonText: '确定',
              callback: action => {
                this.$router.push('/login')
              }
            })
          })
        } else {
          return false
        }
      })
    },
    reset() {
      this.$refs.passForm.resetFields()
    }
  }
}
</script>
