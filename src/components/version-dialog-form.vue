<template>
<el-dialog v-draggable="dialogDraggableOptions" title="版本更新" :visible.sync="dialog" :modal="false" :close-on-click-modal="false" :before-close="closeEvent">
   <el-form ref="editForm" :model="editForm" label-width="100px" class="version">
    <el-row>
      <!-- <el-col :span="12">
        <el-form-item label="版本类型">
           <span>{{editForm.versionType}}</span>
           <el-input v-model="editForm.versionType" :disabled="true"></el-input>
        </el-form-item>
      </el-col> -->
      <el-col :span="12">
        <el-form-item label="版本号">
           <el-input v-model="editForm.versionNum" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="12">
        <el-form-item label="发布人">
           <el-input v-model="editForm.createUsername" :disabled="true"></el-input>
        </el-form-item>
      </el-col> -->
      <el-col :span="12">
        <el-form-item label="发布时间">
           <el-input v-model="editForm.createTime" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="更新内容">
          <el-input v-model="editForm.updateContent" type="textarea" :rows="6" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>  
  <!-- :description="版本类型" -->
  <!-- <el-steps :space="100" :active="5" direction="vertical" style="margin-left:100px" class="version">
     <el-step title="版本类型" :description="editForm.versionType"></el-step>
     <el-step title="版本号" :description="editForm.versionNum"></el-step>
     <el-step title="发布人" :description="editForm.createUsername"></el-step>
     <el-step title="发布时间" :description="editForm.createTime"></el-step>
     <el-step title="更新内容" :description="editForm.updateContent"></el-step>
  </el-steps> -->
  <div slot="footer" class="dialog-footer">
    <!-- <el-button type="" @click="closeEvent">取消</el-button> -->
    <el-button type="primary" @click="closeEvent(true)">关闭</el-button>
  </div>
</el-dialog>
</template>
<style>
 .version .el-input.is-disabled .el-input__inner{
    background-color: white;
    border-color: white; 
     color: #666
 }
.version .el-textarea.is-disabled .el-textarea__inner{
    background-color: white;
    border-color: white; 
     color: #666
 }
.version .el-input__inner{
  border: 1px solid white;
}
.version .el-textarea__inner{
  border: 1px solid white;
}
 .version .el-step__description.is-finish{
    width: 350px;
    word-wrap: break-word;
    word-break: normal;
 }
</style>
<style scoped>
  .app-toolbar .el-form-item {
    margin-bottom: 0;
  }

</style>
<script>
  import mixin from '../utils/mixin'
  import { mapState } from 'vuex'
  import { LOOK_VERSION, UPDATE_READ_STATUS } from '../store/types'
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        editForm: {
        },
        versionId: ''
      }
    },
    props: ['dialog', 'id'],
    computed: {
      ...mapState(['version'])
    },
    watch: {},
    created() {
      this.dispatch(LOOK_VERSION).then(() => {
        if(this.version.lookVersion.acceptUserid === null) {
          return;
        }
        this.editForm = this.version.lookVersion.versionEntity;
        this.versionId = this.version.lookVersion.id;
        console.log(this.editForm, 'versionListsversionListsversionLists');
      })
    },
    methods: {
      closeEvent(success = false) {
        if (success === true) {
          this.$emit('close')
        } else {
          this.$emit('close')
        }
        this.dispatch(UPDATE_READ_STATUS, {id: this.versionId}).then(() => {
          // this.editForm = this.version.lookVersion.versionEntity;
          // console.log(this.editForm, 'versionListsversionListsversionLists');
        })
      }
    }
  }

</script>
