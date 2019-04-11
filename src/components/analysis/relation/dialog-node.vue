<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="创建节点" :modal-append-to-body="true" :append-to-body="true" size="add-node-dialog" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <div class="subnode" v-loading="loading">
    <el-form :model="form" label-width="120px" ref="form" :rules="rules">
       <!-- <div class="obj__a">
          <div class="image">新对象</div>
          <el-input v-model="form.targetName" placeholder="请输入对象描述" style="200px;"></el-input>
        </div>
      </div> -->
            <el-form-item label="对象类型" prop="bType">
              <el-select v-model="form.bType" filterable placeholder="请选择" value-key="TYPE" style="width:100%" @change="typeChange">
                <el-option v-for="item in analysisRelation.resultObjectTypeList" filterable :key="item.TYPE" :value="item.NODE" :label="item.NAME"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="targetLabel" prop="target">
              <el-input v-model="form.target" :placeholder="targetPlaceholder"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="targetName">
            <el-input v-model="form.targetName" placeholder="请输入对象描述"></el-input>
            </el-form-item>
    </el-form>

  </div>

  <div slot="footer" class="dialog-footer">
    <el-button @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss">
  .el-dialog--add-node-dialog {
    width: 400px;
  }

  .subnode {
    .obj {
      position: relative;
      border: 1px solid rgb(255, 255, 255);
      width: 559px;
      height: 150px;
      .image {
        margin: 0 auto;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        color: rgb(255, 255, 255);
        text-align: center;
        line-height: 70px;
        background-color: #6FB6EA;
      }
      .el-input {
        input {
          text-align: center;
          border-width: 0 0 1px 0;
        }
      }
      &__a {
        width: 200px;
        margin: 20px auto 0;
      }
    }
    .style {
      border: 1px solid rgb(255, 255, 255);
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { POST_RESULT_NODE } from '../../../store/types'

  import mixin from '../../../utils/mixin'
  import { clone } from '../../../utils/util'
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        targetPlaceholder: '请输入对象值',
        targetLabel: '对象值',
        form: {
          guid: '',
          bType: '',
          target: '',
          targetName: ''
        },
        rules: {
          target: {
            required: true,
            message: '请输入值'
          },
          targetName: {
            required: true,
            message: '请输入对象描述'
          },
          bType: {
            required: true,
            message: '请选择对象类型'
          }
        }
      }
    },
    props: ['dialog'],
    computed: {
      ...mapState(['analysisRelation'])
    },
    methods: {
      typeChange(val) {
        let typeObj = this.analysisRelation.resultObjectTypeList.find(d => d.NODE === val);
        if (typeObj) {
          let name = typeObj.NAME;
          this.targetLabel = name;
          this.targetPlaceholder = '请输入' + name;
        }
      },
      initDialog() {
        this.loading = false;
      },
      closeEvent(success) {
        if (success === true) {
          this.$emit('success', clone(this.form))
        } else {
          this.$emit('close')
        }
        this.reset()
      },
      submit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.post()
          } else {
            return false
          }
        })
      },
      reset() {
        this.form = {
          guid: '',
          bType: '',
          target: '',
          targetName: ''
        }
        this.$refs.form.resetFields();
      },
      post() {
        this.dispatch(POST_RESULT_NODE, {
          ms: this.form.targetName,
          value: this.form.target,
          node: this.form.bType,
          objtype: this.analysisRelation.resultObjectTypeList.find(d => d.NODE === this.form.bType).KEY
        }).then(() => {
          this.form.guid = this.analysisRelation.postResultNodeRes;
          this.closeEvent(true)
        }).catch((e) => {
          this.$message({ type: 'warning', message: `新增节点失败!信息：${JSON.stringify(e)}` })
          this.$emit('close');
          this.reset();
        })
      },
      setTestData() {
        if (this.form.target === '') {
          this.form.target = '411328199201031331'
          this.form.targetName = '谷谷谷'
          this.form.bType = 't_zt_ryjbqk'
        } else if (this.form.target === '433029196803113643') {
          this.form.target = ''
          this.form.targetName = ''
          this.form.bType = ''
        } else if (this.form.target === '441581199608287978') {
          this.form.target = '433029196803113643'
          this.form.targetName = '潘德良'
          this.form.bType = 't_zt_ryjbqk'
        } else {
          this.form.target = '441581199608287978'
          this.form.targetName = '南南南'
          this.form.bType = 't_zt_ryjbqk'
        }
      }
    },
    watch: {},
    created() {},
    mounted() {}
  }

</script>
