<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="移入数据池" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-form :model="form" :inline="true" label-width="100">
    <el-form-item prop="caseId" label="选择案件">
      <case-selector :width="350" :value="form.AjId" @update:value="updateCase"></case-selector>
    </el-form-item>
    <div class="clear"></div>
    <el-form-item label="内容">
      <div class="" v-for="item in form.AjglSjcSjModels">
        <div v-for="col in item.columns.filter(c=>c.isDefault===true)" style="display:inline-block; margin-right:10px;">
          {{col.label}}:{{item.data[col.prop]}}
        </div>
      </div>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="closeEvent">取 消</el-button>
    <el-button type="primary" @click="submit">移 入</el-button>
  </div>
</el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import { POST_DATA_POOL } from '../../store/types'
import mixin from '../../utils/mixin'
import caseSelector from '../case-selector/case-selector'

/**
 * @module PushDataPoolDialog
 * @desc 移入案件池模态窗
 *
 * @example <push-data-pool-dialog :dialog="dialog" :data="dataPool" :keyword="keyword @close="dialog=false"></push-data-pool-dialog>`
 */
export default {
  mixins: [mixin],
  components: {
    caseSelector
  },
  data() {
    return {
      form: {
        AjglSjcSjModels: [],
        AjId: '',
        Keyword: ''
      }
    }
  },
  /**
   * 接收参数
   * @prop {Boolean} dialog 是否显示窗口  @default false
   * @prop {Object} data 需移入池的数据对象
   * @prop {String} keyword data数据对象的关键字
   */
  props: ['dialog', 'data', 'keyword'],
  computed: {
    ...mapState(['seriesCase', 'caseInfo'])
  },
  methods: {
    initDialog() {
      this.form.AjglSjcSjModels = this.data
      this.form.AjId = ''
    },
    closeEvent() {
      this.form.AjId = ''
      /**
       * 关闭窗口
       * @event module:PushDataPoolDialog~close
       */
      this.$emit('close')
    },
    submit() {
      if(this.keyword instanceof Array && this.keyword.length > 0) {
        this.form.Keyword = this.keyword.join(',')
      } else {
        this.form.Keyword = this.keyword
      }

      if(this.form.AjId === '') {
        this.$alert('必需选择一个案件', '温馨提示')
      } else {
        this.dispatch(POST_DATA_POOL, this.form).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功',
            showClose: true
          })
          this.closeEvent()
        })
      }
    },
    updateCase(val) {
      this.form.AjId = val.caseId
    }
  },
  created() {},
  mounted() {}
}
</script>
