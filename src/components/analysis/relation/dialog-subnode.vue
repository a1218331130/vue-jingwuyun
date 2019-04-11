<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="创建关系节点" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <div class="subnode" v-loading="loading">
    <el-form :model="form" label-width="100px" ref="form" :rules="rules">
      <div class="obj">
        <el-row>
          <el-col :span="8">
            <div class="obj__a">
              <div class="image">A对象</div>
              <el-input style="border-width:0 0 1px 0;" class="obj-input" v-model="form.objA" readonly placeholder=""></el-input>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="relation">
              <el-form-item label="" prop="relation" label-width="0px">
                <el-select v-model="form.relation" filterable placeholder="请选择关系">
                  <el-option v-for="item in analysisRelation.relationType" filterable :key="item.GXDM" :value="item.GXDM" :label="item.GXMC"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-input v-if="!(form.relation==='其它')" v-model="relationText" placeholder="请在下方对象关系"></el-input>
              <el-input v-if="form.relation==='其它'" v-model="form.otherRelation" placeholder="请输入对象关系"></el-input> -->
            </div>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="target">
              <div class="obj__b">
                <div class="image">B对象</div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="style">
        <el-row>
<el-col :span="12">
  <el-form-item label="对象类型" prop="bType">
    <el-select v-model="form.bType" filterable placeholder="请选择" style="width:100%" @change="typeChange">
      <el-option v-for="item in analysisRelation.relationNodeType" filterable :key="item.NODENAME" :value="item.NODENAME" :label="item.BZ"></el-option>
    </el-select>
  </el-form-item>
</el-col>
<!-- <el-col :span="12">
            <el-form-item label="关系" prop="relation">
              <el-select v-model="form.relation" filterable placeholder="请选择">
                <el-option v-for="item in analysisRelation.relationType" filterable :key="item.GXDM" :value="item.GXDM" :label="item.GXMC"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
<el-col :span="12">
  <el-form-item label="方向" prop="link">
    <el-radio-group v-model="form.link">
      <el-radio v-for="(item, i) in relationshipList" :key="i" :label="item.value">{{item.label}}</el-radio>
    </el-radio-group>
  </el-form-item>
</el-col>

          <el-col :span="12">
            <el-form-item :label="targetLabel" prop="target">
          <el-input v-model="form.target" :placeholder="targetPlaceholder"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对象描述" prop="targetName">
              <el-input v-model="form.targetName" placeholder="请输入描述"></el-input>
            </el-form-item>
          </el-col>
        
        </el-row>
      </div>
    </el-form>

  </div>

  <div slot="footer" class="dialog-footer">
    <el-button @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss">
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
        margin-top: 20px;
      }
      .relation {
        margin-top: 48px;
      }
      &__b {
        margin-top: 20px;
      }
    }
    .style {
      border: 1px solid rgb(255, 255, 255);
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { POST_RESULT_NODE_AND_RELATION } from '../../../store/types'

  import mixin from '../../../utils/mixin'
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        targetPlaceholder: '请输入对象值',
        targetLabel: '对象',
        form: {
          key: '',
          subKey: '',
          objA: '',
          rid: '',
          relation: '',
          relationText: '',
          bType: '',
          otherRelation: '',
          target: '',
          targetName: '',
          link: '1'
        },
        // radioList: ['团伙上级', '夫妻', '朋友', '情人', '亲属', '同事', '其它'],
        relationshipList: [
          // 'A - B',
          { label: 'A → B', value: '1' },
          { label: 'A ← B', value: '2' }
        ],
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
          },
          relation: {
            required: true,
            message: '请选择关系'
          }
        }
      }
    },
    props: ['dialog', 'parent'],
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
      typeChange(val) {
        let item = this.analysisRelation.relationNodeType.find(r => r.NODENAME === val);
        if (item) {
          this.targetLabel = item.BZ;
          this.targetPlaceholder = '请输入' + item.BZ;
        }
      },
      initDialog() {
        this.form.key = this.parent.key
        this.form.objA = this.parent.text
      },
      closeEvent(success) {
        if (success === true) {
          this.$emit('success', JSON.parse(JSON.stringify(this.form)))
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
          key: '',
          subKey: '',
          objA: '',
          rid: '',
          relation: '',
          relationText: '',
          bType: '',
          otherRelation: '',
          target: '',
          targetName: '',
          link: '1'
        }
        this.$refs.form.resetFields();
      },
      post() {
        this.dispatch(POST_RESULT_NODE_AND_RELATION, {
          a: { // a参数对象   -------即26.8中节点类型，且多一个id参数字段
            id: this.parent.key,
            ms: this.parent.text,
            value: this.parent.keyword,
            node: this.parent.mark.typeString,
            objtype: this.parent.mark.key
          },
          b: { // b参数对象   -------即26.8中节点类型，且多一个id参数字段
            ms: this.form.targetName,
            value: this.form.target,
            node: this.form.bType,
            objtype: this.analysisRelation.relationNodeType.find(d => d.NODENAME === this.form.bType).COL
          },
          type: this.form.link, // type，1：a--->b,2:a<----b
          gxdm: this.form.relation, // 关系代码
          gxms: this.relationText // 关系描述
        }).then(() => {
          this.form.relationText = this.relationText + ''
          this.form.rid = this.analysisRelation.postResultNodeAndRelationRes.rid
          this.form.subKey = this.analysisRelation.postResultNodeAndRelationRes.nodeid
          this.closeEvent(true)
        })
      }
    },
    watch: {},
    created() {},
    mounted() {}
  }

</script>
