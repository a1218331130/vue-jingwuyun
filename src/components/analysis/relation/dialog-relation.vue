<template>
<el-dialog v-draggable="dialogDraggableOptions"
           :visible.sync="dialog"
           title="创建关系"
           :modal-append-to-body="true"
           :append-to-body="true"
           size="middle--fixed"
           :modal="true"
           :close-on-click-modal="false"
           @open="initDialog"
           :before-close="closeEvent">
  <div class="subnode"
       v-loading="loading">
    <el-form v-if="data!==null"
             :model="form"
             ref="form"
             :rules="rules">
      <div class="obj">
        <el-row>
          <el-col :span="8">
            <div class="obj__a">
              <div class="image">
                <img :src="data.objA.source"  v-if="typeMap[data.objA.type]==='user'" onerror="this.src='/static/img/default_person.jpg'">
                <span :class="`iconfont ${typeToFont[data.objA.type]} font-head`"  v-if="typeMap[data.objA.type]!=='user'"></span>
              </div>
              <el-input style="border-width:0 0 1px 0;"
                        class="obj-input"
                        v-model="data.objA.text"
                        readonly
                        placeholder=""></el-input>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="relation">
              <el-form-item label=""
                            prop="relation">
                <el-select v-model="form.relation"
                           filterable
                           placeholder="请选择关系">
                  <el-option v-for="item in analysisRelation.relationType"
                             filterable
                             :key="item.GXDM"
                             :value="item.GXDM"
                             :label="item.GXMC"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="target">
              <div class="obj__b">
                <div class="image">
                          <img :src="data.objB.source" v-if="typeMap[data.objB.type]==='user'" 
    onerror="this.src='/static/img/default_person.jpg'"
>
                <span :class="`iconfont ${typeToFont[data.objB.type]} font-head`"  v-if="typeMap[data.objB.type]!=='user'"></span>
                </div>
                <el-input style="border-width:0 0 1px 0;"
                          class="obj-input"
                          v-model="data.objB.text"
                          readonly
                          placeholder=""></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>

  </div>

  <div slot="footer"
       class="dialog-footer">
    <el-button @click="closeEvent">取消</el-button>
    <el-button type="primary"
               @click="submit">确定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
  .font-head {
    font-size: 40px;
    line-height: 70px;
  }

</style>
<style lang="scss">
  .subnode {
    .obj {
      position: relative;
      border: 1px solid rgb(255, 255, 255);
      width: 559px;
      height: 150px;
      .image {
        text-align: center;
        width: 70px;
        height: 70px;
        margin: 0 auto;
        border: 3px solid #6FB6EA;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: auto;
        }
      }
      .el-input {
        input {
          text-align: center;
          border-width: 0 0 1px 0;
        }
      }
      &__a {
        margin-top: 20px;
      }
      .relation {
        margin-top: 48px;
      }
      &__b {
        margin-top: 20px;
      }
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { POST_RESULT_RELATION } from '../../../store/types'

  import mixin from '../../../utils/mixin'
  import { typeMap, typeToFont } from './nodeDefaultHead'
  let defaultHeadImg = '/static/img/default_person.jpg'

  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        typeMap,
        typeToFont,
        form: {
          relation: ''
        },
        rules: {
          relation: {
            required: true,
            message: '请选择关系'
          }
        }
      }
    },
    props: ['dialog', 'data'],
    computed: {
      relationText() {
        let res,
          target = this.analysisRelation.relationType ? this.analysisRelation.relationType.find(d => d.GXDM === this.form.relation) : null
        if (target) {
          res = target.GXMC
        } else {
          res = ''
        }
        return res
      },
      ...mapState(['analysisRelation'])
    },
    methods: {
      initDialog() {
        if (!this.data.objA.source) {
          this.data.objA.source = defaultHeadImg;
        }
        if (!this.data.objB.source) {
          this.data.objB.source = defaultHeadImg;
        }
      },
      closeEvent(success) {
        if (success === true) {
          this.$emit('success', { data: this.data, relation: this.relationText, rid: this.analysisRelation.postResultRelationRes })
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
          relation: ''
        }
        this.$refs.form.resetFields();
        this.loading = false;
      },
      post() {
        let data = this.data
        this.dispatch(POST_RESULT_RELATION, {
          a: { // a参数对象   -------即26.8中节点类型，且多一个id参数字段
            id: data.objA.key,
            ms: data.objA.text,
            value: data.objA.keyword,
            node: data.objA.mark.typeString,
            objtype: data.objA.mark.key
          },
          b: { // b参数对象   -------即26.8中节点类型，且多一个id参数字段
            id: data.objB.key,
            ms: data.objB.text,
            value: data.objB.keyword,
            node: data.objB.mark.typeString,
            objtype: data.objB.mark.key
          },
          type: '1', // type，1：a--->b,2:a<----b
          gxdm: this.form.relation, // 关系代码
          gxms: this.relationText // 关系描述
        }).then(() => {
          this.closeEvent(true)
        }).catch((e) => {
          this.$message({ type: 'warning', message: `新增关系失败!信息:${JSON.stringify(e)}` })
          this.$emit('close');
          this.reset();
        })
      }
    },
    watch: {},
    created() {},
    mounted() {}
  }

</script>
