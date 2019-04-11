<template>
<el-dialog v-draggable="dialogDraggableOptions" title="详情" :visible.sync="dialog" :modal="true" @open="initDialog" :close-on-click-modal="false" :before-close="closeEvent">
  <div class="detail-box__title">基本信息</div>
  <el-form ref="editForm" :model="editForm" label-width="100px" v-if="this.des !== 'approvalAll'">
    <el-row>
      <el-col :span="12">
        <el-form-item label="姓名">
          <span>{{editForm.name}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="性别">
          <span>{{editForm.gender}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="证件号码">
          <span>{{editForm.zjhm}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="警号">
          <span>{{editForm.policeNum}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="手机号码">
          <span>{{editForm.cellphoneNum}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="单位名称">
          <span>{{editForm.dept}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="职位">
          <span>{{editForm.position}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="办公电话">
          <span>{{editForm.phoneNum}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="申请原因">
          <span>{{editForm.applyReason}}</span>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <div v-if="this.des === 'detail'">
    <div class="detail-box__title" style="margin-left:15px">流程明细</div>
    <el-table @cell-mouse-enter="cellMouseEnter" style="width:100%;" :data="editForm.list" border>
      <el-table-column label="流程步骤" prop="processName" align="center" width="100"></el-table-column>
      <el-table-column label="处理人" prop="handlePerson" align="center" width="80"></el-table-column>
      <el-table-column label="处理时间" prop="handleTime" align="center" width="200"></el-table-column>
      <el-table-column label="处理状态" align="center" width="80">
        <template scope="scope">
            <!-- <span>{{scope.row.handleResult && scope.row.handleResult === '0'?'不同意':'同意'}}</span> -->
            <span>{{scope.row.handleStatus}}</span>
          </template>
</el-table-column>
<el-table-column label="处理意见" prop="handleAdvice" align="center"></el-table-column>
</el-table>
</div>
<div v-if="this.des === 'approval' || this.des === 'approvalAll'">
  <el-form :model="approvalForm" label-width="100px" :rules="rules" ref="approvalForm">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="处理意见" prop="select">
          <el-select v-model="approvalForm.select" style="width:100%">
            <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label="审批意见" prop="reason">
          <el-input :rows="3" type="textarea" v-model="approvalForm.reason"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</div>

<div slot="footer" class="dialog-footer">
  <el-button type="" @click="closeEvent">关闭</el-button>
  <el-button type="" @click="submit" v-if="this.des === 'approval' || this.des === 'approvalAll'">确定</el-button> 

</div>
</el-dialog>
</template>
<style scoped>
  .app-toolbar .el-form-item {
    margin-bottom: 0;
  }

</style>
<script>
  import mixin from '../../../utils/mixin'
  import { mapState } from 'vuex'
  import { VIEW_DETAIL, POST_APPROVAL, APPROVAL_BATCH } from '../../../store/types'

  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        editForm: {
          name: '',
          gender: '',
          zjhm: '',
          policeNum: '',
          cellphoneNum: '',
          dept: '',
          position: '',
          phoneNum: '',
          applyReason: '',
          list: []
        },
        selectList: [{
          value: '1',
          label: '同意'
        }, {
          value: '0',
          label: '不同意'
        }],
        approvalForm: {
          select: '1',
          reason: ''
        },
        rules: {
          select: {
            required: 'true',
            message: '请选择'
          },
          reason: {
            required: 'true',
            message: '请输入审批意见'
          }
        }
      }
    },
    props: ['dialog', 'id', 'des', 'idString'],
    computed: {
      ...mapState(['blackList'])
    },
    watch: {},
    methods: {
      initDialog() {
        if (this.id) {
          this.dispatch(VIEW_DETAIL, { applyId: this.id }).then(() => {
            this.editForm = {
              name: this.blackList.viewDetail.name,
              gender: this.blackList.viewDetail.gender,
              zjhm: this.blackList.viewDetail.zjhm,
              policeNum: this.blackList.viewDetail.policeNum,
              cellphoneNum: this.blackList.viewDetail.cellphoneNum,
              dept: this.blackList.viewDetail.dept,
              position: this.blackList.viewDetail.position,
              phoneNum: this.blackList.viewDetail.phoneNum,
              applyReason: this.blackList.viewDetail.applyReason,
              list: this.blackList.viewDetail.processList
            }
          })
        }
      },
      reset() {
        if(this.des !== 'approvalAll') {
          this.$refs.editForm.resetFields()
        }
      },
      closeEvent(success = false) {
        this.reset()
        if (success === true) {
          this.$emit('success')
        } else {
          this.$emit('close')
        }
      },
      submit() {
        this.$refs.approvalForm.validate((valid) => {
          if (valid === true) {
            if(this.des === 'approvalAll') {
              this.dispatch(APPROVAL_BATCH, { applyIds: this.idString.join(','), handleAdvice: this.approvalForm.reason, handleResult: this.approvalForm.select }).then(() => {
                this.$message({
                  type: 'success',
                  message: '提交成功',
                  showClose: true
                });
                this.closeEvent(true);
              })
            } else {
              this.dispatch(POST_APPROVAL, { applyId: this.id, handleAdvice: this.approvalForm.reason, handleResult: this.approvalForm.select }).then(() => {
                this.$message({
                  type: 'success',
                  message: '提交成功',
                  showClose: true
                });
                this.closeEvent(true);
              })
            }
          }
        })
      }
    }
  }

</script>
