<template>
<el-dialog v-draggable="dialogDraggableOptions" title="申请" :visible.sync="reasonDialog" @open="initDialog" :modal="true" :close-on-click-modal="false" :before-close="closeEvent">
  <el-form :model="form" ref="form" :rules="rules" label-width="100px">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label-width="106px" label="申请原因" prop="gkyy">
          <el-input type="textarea" :rows="5" v-model="form.gkyy" placeholder=""></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <!-- <form ref="docDownForm" method="post" :form="form" action="#/fwzx/fwzx/call?id=fxpcgk/zdqtry/toexcel" target="_blank">
    <input type="hidden" value="1111">
    <input type="submit" value="submit">
  </form> -->
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button @click="closeEvent">取 消</el-button>
    <el-button type="primary" @click="submitForm('form')">确定</el-button>
  </div>

</el-dialog>
</template>

<style scoped>


</style>
<script>
  import mixin from '../../../../utils/mixin'
  import { clone } from '../../../../utils/util'
  import {
    FXPCGK_UPDATE,
    FXPCGK_CASECAR_UPDATE,
    FXPCGK_BASEPLACE_UPDATE,
    FXPCGK_INDORG_UPDATE,
    UAV_HOBBYER_UPDATE,
    UAV_MANUFACTURER_UPDATE,
    UAV_SELLER_UPDATE,
    UAV_PRODUCTION_UPDATE,
    UAV_TRAINING_UPDATE,
    FXPCGK_CLUE_UPDATE
  } from '../../../../store/types'
  import { mapState } from 'vuex'
  export default {
    mixins: [mixin],
    components: { clone },
    data() {
      return {
        sfzx: '',
        item: {},
        type: '',
        reasonDialog: false,
        formProp: [],
        form: { gkyy: '', btitle: [] },
        rules: {
          gkyy: [
            { required: true, message: '输入管控原因', trigger: 'blur' }
          ]
        }
      }
    },
    // props: ['type', 'title'],
    methods: {
      /**
       *初始化编辑窗口
       * @return {[type]} [description]
       */
      initDialog() {},
      /**
       * 重置表单
       */
      reset() {
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      /**
       * [handleUpdate 注销操作]
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      handleNotUse(item, sfzx, type) {
        this.reasonDialog = true
        this.sfzx = sfzx
        this.item = item
        this.type = type
        console.log('123', this.type)
      },
      submitForm(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.type === 'sccj') {
              this.dispatch(UAV_MANUFACTURER_UPDATE, { id: this.item.id, sfzx: this.sfzx, sccjmc: this.item.sccjmc, wrjlx: this.item.wrjlx, gkyy: this.form.gkyy }).then(d => {
                this.form.gkyy = ''
                this.reasonDialog = false
                this.$message(this.sfzx === '1' ? '已提交注销审批申请' : '已提交重新管控审批申请')
                this.$emit('call:change-update')
              })
            } else if (this.type === 'wrjgl') {
              this.dispatch(UAV_PRODUCTION_UPDATE, { id: this.item.id, sfzx: this.sfzx, wrjpp: this.item.wrjpp, wrjlx: this.item.wrjlx, gkyy: this.form.gkyy }).then(d => {
                this.form.gkyy = ''
                this.reasonDialog = false
                this.$message(this.sfzx === '1' ? '已提交注销审批申请' : '已提交重新管控审批申请')
                this.$emit('call:change-update')
              })
            } else if (this.type === 'wrjahz') {
              this.dispatch(UAV_HOBBYER_UPDATE, { id: this.item.id, sfzx: this.sfzx, xssmc: this.item.xssmc, wrjlx: this.item.wrjlx, gkyy: this.form.gkyy }).then(d => {
                this.form.gkyy = ''
                this.reasonDialog = false
                this.$message(this.sfzx === '1' ? '已提交注销审批申请' : '已提交重新管控审批申请')
                this.$emit('call:change-update')
              })
            } else if (this.type === 'pxjg') {
              this.dispatch(UAV_TRAINING_UPDATE, { id: this.item.id, sfzx: this.sfzx, xssmc: this.item.xssmc, wrjlx: this.item.wrjlx, gkyy: this.form.gkyy }).then(d => {
                this.form.gkyy = ''
                this.reasonDialog = false
                this.$message(this.sfzx === '1' ? '已提交注销审批申请' : '已提交重新管控审批申请')
                this.$emit('call:change-update')
              })
            } else if (this.type === 'xss') {
              this.dispatch(UAV_SELLER_UPDATE, { id: this.item.id, sfzx: this.sfzx, xssmc: this.item.xssmc, wrjlx: this.item.wrjlx, gkyy: this.form.gkyy }).then(d => {
                this.form.gkyy = ''
                this.reasonDialog = false
                this.$message(this.sfzx === '1' ? '已提交注销审批申请' : '已提交重新管控审批申请')
                this.$emit('call:change-update')
              })
            } else if (this.type === 'clue') {
              this.dispatch(FXPCGK_CLUE_UPDATE, { id: this.item.id, sfzx: this.sfzx, bt: this.item.bt, gkyy: this.form.gkyy }).then(d => {
                this.form.gkyy = ''
                this.reasonDialog = false
                this.$message(this.sfzx === '1' ? '已提交注销审批申请' : '已提交重新管控审批申请')
                this.$emit('call:change-update')
              })
            } else if (this.type === 'car') {
              this.dispatch(FXPCGK_CASECAR_UPDATE, { id: this.item.id, sfzx: this.sfzx, cphm: this.item.cphm, cllx: this.item.cllx, gkyy: this.form.gkyy }).then(d => {
                this.form.gkyy = ''
                this.reasonDialog = false
                this.$message(this.sfzx === '1' ? '已提交注销审批申请' : '已提交重新管控审批申请')
                this.$emit('call:change-update')
              })
            } else if (this.type === 'industry') {
              this.dispatch(FXPCGK_BASEPLACE_UPDATE, { id: this.item.id, sfzx: this.sfzx, csmc: this.item.csmc, jqdj: this.item.jqdj, gkyy: this.form.gkyy }).then(d => {
                this.form.gkyy = ''
                this.reasonDialog = false
                this.$message(this.sfzx === '1' ? '已提交注销审批申请' : '已提交重新管控审批申请')
                this.$emit('call:change-update')
              })
            } else if (this.type === 'org') {
              this.dispatch(FXPCGK_INDORG_UPDATE, { id: this.item.id, sfzx: this.sfzx, zdhymc: this.item.zdhymc, zdhylb: this.item.zdhylb, gkyy: this.form.gkyy }).then(d => {
                this.form.gkyy = ''
                this.reasonDialog = false
                this.$message(this.sfzx === '1' ? '已提交注销审批申请' : '已提交重新管控审批申请')
                this.$emit('call:change-update')
              })
            } else {
              this.dispatch(FXPCGK_UPDATE, { id: this.item.id, sfzx: this.sfzx, xm: this.item.xm, sfz: this.item.sfz, gkyy: this.form.gkyy }).then(d => {
                this.form.gkyy = ''
                this.reasonDialog = false
                this.$message(this.sfzx === '1' ? '已提交注销审批申请' : '已提交重新管控审批申请')
                this.$emit('call:change-update')
              })
            }
          } else {
            return false
          }
        })
      },
      /**
       * 编辑窗关闭事件
       * @return {[type]} [description]
       */
      closeEvent() {
        this.reset()
        this.reasonDialog = false
      }
      //
    },
    watch: {},
    mounted() {},
    created() {},
    computed: {
      ...mapState(['focusPersonAndCar'])
    }
  }

</script>
