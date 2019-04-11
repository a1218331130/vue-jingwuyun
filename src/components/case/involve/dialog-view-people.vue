<template>
<div class="dialog-view-people">
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="嫌疑人" :modal-append-to-body="true" :append-to-body="true" size="large--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
    <el-form style="padding:10px 20px">
      <el-col :span="8">
        <data-image class="person-box__person__image" v-show="data.imageId === null" :idCard="data.idCard"></data-image>
        <img class=" person-box__person__image" v-show="data.imageId !==null " :src="data.imageURL" width="100px" alt="照片">
      </el-col>
      <el-col :span="8">
        <el-form-item label="姓名">
          {{data.name}}
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="绰号">
          {{data.nickname}}
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="证件号码">
          <span class="hover-menu" data-type="idCard">{{data.idCard}}</span>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="年龄">
          {{data.age}}
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="身高">
          {{data.stature}}
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="体貌特征">
          {{data.formTrait}}
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="体型">
          {{data.bodilyForm}}
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="作案特点">
          {{data.crimeTrait}}
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="作案原因">
          {{data.crimeCauseText}}
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="作案手段">
          {{data.crimeMeans}}
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="作案工具">
          {{data.crimeTool}}
        </el-form-item>
      </el-col>

      <!-- <el-col :span="8">
        <el-form-item label="信息来源">
          {{data.sourceData}}
        </el-form-item>
      </el-col> -->

      <!-- <el-col :span="24">
        <el-form-item label="上级成员">
          {{data.upPeople}}
        </el-form-item>
      </el-col> -->

      <el-col :span="24">
        <span class="edit-button iconfont icon-plus" @click="handlerEdir">笔录列表</span>
        <span class="edit-button iconfont icon-jingbao" @click="handlerControl">{{data.controlState==='1'?'布控结果 ':'申请布控'}}<i v-if="data.controlState==='1'" class="resCount">{{data.resCount}}</i></span>
        <span class="edit-button iconfont icon-jingbao" v-if="data.controlState==='1'" @click="handlerCancelControl">取消布控</span>
        <span class="edit-button iconfont" @click="openPersonCard(data.idCard)">人员卡片</span>

      </el-col>
      <!-- <el-col :span="12">
        <el-form-item label="车辆型号"
                      prop="carModel">
          {{form.carModel}}
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="车辆颜色"
                      prop="carColor">
          {{form.carColor}}
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="车辆特征"
                      prop="carFeature">
          {{form.carFeature}}
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="车主姓名"
                      prop="ownerName">
          {{form.ownerName}}
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="车主身份证"
                      prop="ownerIdCard">
          {{form.ownerIdCard}}
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="车主出生日期"
                      prop="ownerAge">
          {{form.ownerAge}}
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="车主现住址"
                      prop="ownerNowAddress">
          {{form.ownerNowAddress}}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="驾驶员姓名"
                      prop="name">
          {{form.name}}
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="驾驶员性别"
                      prop="sex">
          {{form.sex}}
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="驾驶员体貌特征"
                      prop="aspectFeature">
          {{form.aspectFeature}}
        </el-form-item>
      </el-col> -->
    </el-form>


    <div slot="footer" class="dialog-footer">
      <el-button type="" @click="closeEvent">关闭</el-button>
    </div>

  </el-dialog>
  <!-- 撤销布控弹窗 -->
  <el-dialog title="撤销布控" v-draggable="dialogDraggableOptions" :visible.sync="repealDialog" :modal-append-to-body="true" size="large--fixed" :modal="true" :close-on-click-modal="false" @open="repealInitDialog" :before-close="repealCloseEvent" v-loading="loading"
    element-loading-text="正在撤销布控中……">
    <el-form :model="repealForm" :rules="rules" label-width="100px" class="repealForm" ref="repealForm">
      <el-form-item label="撤控原因" prop="ckyy">
        <el-input type="textarea" v-model="repealForm.ckyy" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="" @click="repealCloseEvent">关闭</el-button>
      <el-button type="primary" @click="repealSubmit('repealForm')">确认</el-button>
    </div>
  </el-dialog>
</div>
</template>
<style scoped lang="scss">
  img {
    width: 150px;
  }

  .edit-button {
    // border: 1px solid #ccc;
    display: inline-block;
    font-size: 14px;
    padding: 5px;
    text-align: center;
    color: #fff;
    background-color: rgb(255, 153, 0);
    cursor: pointer;
    .resCount {
      color: red;
    }
  }

  .repealForm {
    padding-right: 20px;
  }

</style>
<script>
  import mixin from '../../../utils/mixin'
  import dataImage from '../../../widgets/data-image/data-image'
  import { REVOKE_APPROVAL } from '../../../store/types'

  export default {
    mixins: [mixin],
    components: {
      'dataImage': dataImage
    },
    data() {
      return {
        formDialog: false,
        repealDialog: false,
        repealForm: {
          ckyy: ''
        },
        rules: {
          ckyy: [
            { required: true, message: '请输入撤控原因', trigger: 'blur' },
            { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    props: ['dialog', 'data'],
    computed: {},
    methods: {
      openPersonCard(idCard) {
        this.$emit('view-people', { contentType: 1, keyId: idCard })
      },
      initDialog() {},
      // 撤销布控弹窗初始化
      repealInitDialog() {
        this.repealForm.ckyy = ''
      },
      // 撤销弹窗关闭事件
      repealCloseEvent() {
        this.repealDialog = false
      },
      closeEvent() {
        this.$emit('close')
      },
      handlerEdir() {
        this.$emit('on-goRecordList-info', this.data, 1)
      },
      handlerControl() {
        this.data.controlState === '1' ? this.$emit('on-view-control') : this.$emit('on-apply-control')
      },
      // 撤销布控确认按钮
      repealSubmit(repealForm) {
        this.$refs[repealForm].validate((valid) => {
          if (valid) {
            this.dispatch(REVOKE_APPROVAL, {
              id: this.data.controlId,
              ckyy: '',
              bkly: '3',
              ck_object: {
                id: '',
                lybid: this.data.id,
                ckyy: this.repealForm.ckyy
              }
            }).then(() => {
              this.repealDialog = false
              this.$message({
                message: '取消布控成功!',
                type: 'success'
              })
              this.$emit('update-draft-list')
            }).catch(() => {})
          }
        })
      },
      handlerCancelControl() {
        this.repealDialog = true
      }
    },
    created() {

    },
    mounted() {}
  }

</script>
}
</script>
