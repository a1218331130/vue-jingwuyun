<template>
  <div>
    <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="dialogMode==='edit'?'修改办案人员':'新增办案人员'" :modal-append-to-body="true" :append-to-body="true"
               size="large--fixed"
               :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
      <!-- <div class="el-dialog__body__scroll-wrap"> -->
      <el-form v-if="editForm!==null" ref="knowEditForm" :model="editForm" label-width="110px">
        <el-row :gutter="0">
          <el-col :span="8">
            <el-form-item label="警号">
              <el-input v-model="editForm.CaseNumber" placeholder="输入警号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名">
              <el-input v-model="editForm.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属单位">
              <el-input v-model="editForm.unit" placeholder="请输入单位"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="8">
            <el-form-item label="职务">
              <el-input placeholder="请输入职务" v-model="editForm.post"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="权限">
              <el-select placeholder="请选择权限" v-model="editForm.power">
                <el-option label="主侦" value="0" key="1"></el-option>
                <el-option label="配侦" value="1" key="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- </div> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <!--<el-button @click="reset">重置</el-button>-->
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<style scoped>
  .el-date-editor--date {
    width: 142px;
  }

  .import-btn {
    position: absolute;
    top: -40px;
    right: 10px;
    background-color: #5babe6;
    border: none;
    height: 25px;
    color: #ffffff;
    border-radius: 25px;
    padding: 0 10px;
    text-align: center;
  }
  /*.el-dialog--large--fixed{*/
  /*overflow-x:hidden;*/
  /*}*/
  /*.el-dialog__body {*/
  /*padding: 15px;*/
  /*max-height: calc(75vh - 150px);*/
  /*overflow: hidden;*/
  /*width: calc(100% - 30px);*/
  /*}*/

  .kinship-box {
    margin-top: 10px;
  }

  .el-tabs {
    margin: 0 auto;
    width: calc(100% - 30px);
  }

  .title-box {
    height: 28px;
    width: calc(100% - 0px);
    line-height: 28px;
    text-align: center;
    color: #666666;
    border-top: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
    background-color: #f6f6f6;
  }

</style>
<script>
  import mixin from '../../../utils/mixin'
  import { clone } from '../../../utils/util'
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        sunEditDialog: true,
        tableData: [{
          id: '1',
          alarm: '342342342',
          name: '李警官',
          unit: '长沙市xxx公安局',
          post: '中队长',
          power: '主侦'
        }, {
          id: '2',
          alarm: '342342342',
          name: '张警官',
          unit: '长沙市xxx公安局',
          post: '中队长',
          power: '配侦'
        }],
        model: {
          CaseNumber: '',
          CaseName: '',
          BigTypeName: '',
          CaseDetails: '',
          means: '，',
          area: '',
          unit: '',
          post: '',
          power: '',
          CaseStatus: '',
          CaseStatusCode: 1,
          CreatedTime: '2017-07-21',
          sectionTime: '2017-01-01-2017-08-21'
        },
        editForm: {
          CaseNumber: '',
          CaseName: '',
          BigTypeName: '',
          CaseDetails: '',
          means: '，',
          area: '',
          unit: '',
          post: '',
          power: '',
          CaseStatus: '',
          CaseStatusCode: 1,
          CreatedTime: '2017-07-21',
          sectionTime: '2017-01-01-2017-08-21'
        },
        page: {
          start: '',
          end: ''
        },
        options: {}
      }
    },
    props: ['dialog', 'type', 'data', 'editmode'],
    computed: {
      dialogMode() {
        return this.editmode || 'add'
      }
    },
    methods: {
      /**
       * 初始化编辑窗口
       * @return {[type]} [description]
       */
      initDialog() {
        // 填充表单基本数据
        if (this.dialogMode === 'edit' && this.id !== '') {
          // 修改
          // this.getDetail(this.id)
          this.editForm = clone(this.data)
        } else {
          this.editForm = clone(this.model)
          // (默认)新增
        }
      },
      /**
       * 编辑窗关闭事件
       * @return {[type]} [description]
       */
      closeEvent() {
        this.reset()
        this.$emit('close')
        // this.dialog = false
      },
      /**
       * 提交编辑文章表单事件
       * @return {[type]} [description]
       */
      submit() {
        // 表单验证
        this.$emit('submit:people', this.editForm)
      },
      /**
       * 编辑模态窗取消按钮事件
       * @return {[type]} [description]
       */
      cancel() {
        this.closeEvent()
      },
      /**
       * 重置表单
       */
      reset() {
        if (this.$refs['knowEditForm']) {
          this.$refs['knowEditForm'].resetFields()
        }
      }
    },
    created() {

    },
    mounted() {}
  }

</script>
