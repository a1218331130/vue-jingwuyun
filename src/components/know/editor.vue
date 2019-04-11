<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="dialogMode==='edit'?'修改':'新增'" :modal-append-to-body="true" :append-to-body="true" size="middle" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <!-- <div class="el-dialog__body__scroll-wrap"> -->
  <el-form v-if="editForm!==null" ref="knowEditForm" :model="editForm" :rules="rules" label-width="100px">
    <el-row v-if="knowCateTree">
      <el-col :span="12">
        <el-form-item label="所属模块" prop="BelongModule">
          <el-select v-model="editForm.BelongModule" style="width:270px;" placeholder="请选择">
            <el-option v-for="item in knowCateTree" :key="item.KeyId" :label="item.Name" :value="item.KeyId"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所属分类" v-show="editForm.BelongModule" prop="BelongTypeArray">
          <el-cascader :options="belongModuleChildren" style="width:270px;" v-model="editForm.BelongTypeArray" :props="defaultPropsCascader" :show-all-levels="false"></el-cascader>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-else>
      <el-col :span="24">
        <i class="el-icon-loading"></i>
      </el-col>
    </el-row>
    <el-form-item label="标题" prop="Title">
      <el-input placeholder="输入标题" v-model="editForm.Title" :maxlength="30"></el-input>
    </el-form-item>
    <el-form-item label="关键词" prop="Keyword">
      <el-input placeholder="输入关键词, 可用 / 或 空格 隔开多个不同关键词" v-model="editForm.Keyword" :maxlength="30"></el-input>
    </el-form-item>
    <el-form-item label="摘要" prop="Summary">
      <el-input type="textarea" placeholder="输入摘要" v-model="editForm.Summary" :maxlength="100"></el-input>
    </el-form-item>
    <!-- <el-form-item label="自定义字段" prop="Summary">

        </el-form-item> -->
    <!-- <el-form-item label="Word导入">
        </el-form-item> -->
    <el-form-item label="内容" prop="Content">
      <quill-editor :options="editorOptions" v-model="Content1"></quill-editor>
    </el-form-item>
    <el-form-item label="附件信息">
      <upload :isFormalSubmit="isFormalSubmit" :source="attachmentSource" @upload:submit="uploadSubmit" :currentFiles="files">
        <el-button slot="button" type="primary">上传附件</el-button>
      </upload>
      <!-- <el-upload class="upload-box--drag" action="url" multiple :auto-upload="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处, 或 <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          只能上传word/excel/pdf/jpg文件, 且不超过 100MB
        </div>
      </el-upload> -->
    </el-form-item>
  </el-form>
  <!-- </div> -->
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button @click="reset">重置</el-button>
    <el-button type="primary" @click="submit">确 定</el-button>
  </div>
</el-dialog>
</template>
<style scoped>
</style>
<script>
import { mapState } from 'vuex'
import { GET_STRATEGY_BY_ID, EDIT_STRATEGY_MSG, ADD_STRATEGY_MSG } from '../../store/types'
import { quillEditor } from 'vue-quill-editor'
import mixin from '../../utils/mixin'
import upload from '../../widgets/upload/upload.vue'
import { clone, getTopNexus } from '../../utils/util'
import { listToTree } from '../../utils/listToTree'
import editor from '../../utils/editorOptions'

export default {
  mixins: [mixin, editor],
  components: {
    quillEditor,
    upload
  },
  data() {
    return {
      files: [],
      isFormalSubmit: false,
      attachmentSource: {
        id: '',
        table: ''
      },
      editForm: {
        KeyId: '',
        BelongModule: '',
        BelongType: [],
        BelongTypeArray: [],
        Title: '',
        Summary: '',
        Content: '',
        Keyword: '',
        FileDetail: [],
        CustomFields: [],
        IsPublic: 0,
        IsEnable: 0
      },
      Content1: '',
      defaultPropsCascader: {
        value: 'KeyId',
        label: 'Name',
        children: 'Children'
      },
      rules: {
        BelongModule: [{
          required: true,
          message: '必需选择所属模块'
        }],
        BelongTypeArray: [{
          type: 'array',
          required: true,
          message: '必需选择所属分类'
        }],
        Title: [{
          required: true,
          message: '标题不能为空'
        }],
        Summary: [{
          required: true,
          message: '摘要不能为空'
        }],
        Content1: [{
          required: true,
          message: '内容不能为空'
        }]
      }
    }
  },
  props: ['dialog', 'id', 'editmode'],
  computed: {
    dialogMode() {
      return this.editmode || 'add'
    },
    belongModuleChildren() {
      let res
      if (this.editForm.BelongModule) {
        res = this.knowCateTree.find(k => k.KeyId === this.editForm.BelongModule).Children
      } else {
        res = []
      }
      return res
    },
    knowCateTree() {
      let res
      if (this.knowCate.Model) {
        this.knowCate.Model.forEach((d, i) => {
          if (d.Children && d.Children.length === 0) {
            delete d.Children
          }
        })
        res = listToTree(this.knowCate.Model, '', 0, {
          id: 'KeyId',
          parentId: 'ParentId',
          children: 'Children'
        })
      } else {
        res = []
      }
      return res
    },
    ...mapState(['know', 'knowCate'])
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
        this.getDetail(this.id)
      } else {
        // (默认)新增
        this.files = []
        this.editForm = {
          KeyId: '',
          BelongModule: '',
          BelongType: [],
          BelongTypeArray: [],
          Title: '',
          Summary: '',
          Content: '',
          Keyword: '',
          FileDetail: [],
          CustomFields: [],
          IsPublic: 0,
          IsEnable: 0
        }
        this.Content1 = '';
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
     * 获取文章内容
     * @param  {String} [id=''] [description]
     * @return {[type]}         [description]
     */
    getDetail(id = '') {
      this.dispatch(GET_STRATEGY_BY_ID, {
        KeyId: id
      }).then(() => {
        this.editForm = clone(this.know.detail)

        this.files = this.editForm.FileDetail.map(f => { return { name: f.Name, id: f.ID } })

        this.Content1 = decodeURI(this.editForm.Content);
        this.editForm.BelongTypeArray = getTopNexus(this.knowCate.Model, this.editForm.BelongType, {
          id: 'KeyId',
          children: 'Children',
          parentId: 'ParentId'
        })
      })
    },
    /**
     * 提交编辑文章表单事件
     * @return {[type]} [description]
     */
    submit() {
      // 表单验证
      this.$refs['knowEditForm'].validate((valid) => {
        if (valid === true) {
          this.editForm.BelongType = this.editForm.BelongTypeArray[this.editForm.BelongTypeArray.length - 1]
          // 提交编辑表单
          this.editForm.Content = encodeURI(this.Content1);
          this.dispatch((this.dialogMode === 'edit' ? EDIT_STRATEGY_MSG : ADD_STRATEGY_MSG), this.editForm).then(() => {
            this.$message({
              type: 'success',
              message: '知识已提交成功',
              showClose: true
            })
            //   this.reload()
            this.$emit('success')
            this.closeEvent()
          }).catch(e => {
            console.log(e)
          })
        }
      })
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
      this.Content1 = ''
      this.editForm.FileDetail = []
      this.files = []
    },
    /**
     * 上传回调
     */
    uploadSubmit(file) {
      if (!file.data.fileList) {

      } else {
        this.editForm.FileDetail = file.data.fileList.map(d => {
          return { ID: d.response.Data.ID }
        })
      }
    }
  },
  created() {

  },
  mounted() {}
}
</script>
