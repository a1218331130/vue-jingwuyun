<template>
  <div>
    <quill-editor class="editor"
      :options="editorOptions"
      v-model="editorFrom.content"></quill-editor>
    <el-form :model="editorFrom" :rules="rules">
      <el-form-item prop="content">
        <el-input v-model="editorFrom.content"  style="display: none"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<style>
  .editor .ql-editor{
    min-height: 300px;
  }
</style>
<script>
  import {quillEditor} from 'vue-quill-editor'
  import editorOptions from '../../utils/editorOptions'
  export default {
    mixins: [editorOptions],
    components: {quillEditor},
    data() {
      return {
        editorFrom: {
          content: ''
        },
        rules: {
          content: [{required: true, message: '请输入内容', trigger: 'change'}]
        }
      }
    }
  }
</script>
