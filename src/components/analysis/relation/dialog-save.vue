<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="保存到档案" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <div class="subnode" v-loading="loading">
    <el-form :model="form" label-width="100px" ref="form" :rules="rules">
      <el-form-item label="标题" prop="bt">
          <el-input v-model="form.bt" />
      </el-form-item>
      <el-form-item label="说明" prop="sm">
        <el-input type="textarea" v-model="form.sm" placeholder="关系图说明(300个字符内)" :maxlength="300" :rows="4"></el-input>
      </el-form-item> 
        <el-row>
          <el-col :span="12">
            <el-form-item label="案件" prop="ajid">
              <case-selector ref="caseSelector" :otherOptionEnabled="false" :width="170" @update:value="updateCase"></case-selector>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="changeFont" label="显示到报告" prop="sfxs">
               <el-radio-group v-model="form.sfxs">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>

  </div>

  <div slot="footer" class="dialog-footer">
    <el-button @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>

</el-dialog>
</template>
<style lang="scss">


</style>
<script>
  import { mapState } from 'vuex'
  import caseSelector from '../../../widgets/case-selector/case-selector'
  import mixin from '../../../utils/mixin'
  import { POST_RELATION_TO_CASE } from '../../../store/types'
  import { clone } from '../../../utils/util'
  export default {
    mixins: [mixin],
    components: {
      caseSelector
    },
    data() {
      return {
        form: {
          bt: '', // 标题
          sm: '', // 说明
          ajid: '', // 案件id
          ajmc: '', // 案件名称
          data: '', // 关系图数据
          sfxs: '0', // 是否显示到报告（下拉框1是0否）
          bgid: '', // 报告id
          by1: '', // 备用
          by2: '',
          by3: ''
        },
        rules: {
          bt: {
            required: true,
            message: '请输入标题'
          },
          ajid: {
            required: true,
            message: '请选择案件'
          }
        }
      }
    },
    props: ['dialog', 'graphObj', 'graphOptions'],
    computed: {
      ...mapState(['analysisRelation'])
    },
    methods: {
      updateCase(val) {
        console.log(val)
        this.form.ajid = val.caseId
        this.form.ajmc = val.caseName
      },
      // 下面的没用
      initDialog() {
        this.form = {
          bt: '', // 标题
          sm: '', // 说明
          ajid: '', // 案件id
          ajmc: '', // 案件名称
          data: '', // 关系图数据
          sfxs: '0', // 是否显示到报告（下拉框1是0否）
          bgid: '', // 报告id
          by1: '', // 备用
          by2: '',
          by3: ''
        }
        if (this.$refs.caseSelector) this.$refs.caseSelector.caseId = ''
        console.log(this.$refs)
        if (this.$refs.form) {
          this.$refs.form.resetFields();
        }
      },
      closeEvent(success) {
        if (success === true) {
          this.$emit('success')
        } else {
          this.$emit('close')
        }
        this.reset()
      },
      reset() {
        for (var i in this.form) {
          this.form[i] = '';
        }
        this.form.sfxs = '0';
      },
      submit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let postData = clone(this.form);
            this.graphOptions.readOnly = true;
            let options = { ...this.graphOptions };
            options['contextMenuElm'] = '';
            options['overview'] = '';
            postData.data = JSON.stringify({
              options: options,
              nodeObj: this.graphObj
            });
            this.dispatch(POST_RELATION_TO_CASE, postData).then(() => {
              this.closeEvent(true)
            }).catch(() => {});
          } else {
            return false
          }
        })
      }
    },
    watch: {},
    created() {},
    mounted() {}
  }

</script>
