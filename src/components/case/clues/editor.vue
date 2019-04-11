<template>
<div>
  <el-dialog class="title-icon-edit" v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="dialogMode==='edit'?'修改':'新增'" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false"
    @open="initDialog" :before-close="closeEvent">
    <!-- <div class="el-dialog__body__scroll-wrap"> -->
    <el-form v-if="editForm!==null" ref="knowEditForm" :rules="rulForm" :model="editForm" label-width="100px">
      <!-- id 插槽 -->
      <input v-model="editForm.id" type="hidden"></input>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="标题" prop="title">
            <el-input placeholder="请输入标题" v-model="editForm.title" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="线索时间" prop="date">
            <el-date-picker v-model="editForm.date" type="datetime" style="width: 100%" placeholder="请输入线索时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="提供单位" prop="org">
            <el-select placeholder="请选择提供单位" v-model="editForm.org" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in unitList"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="提供人" prop="provider">
            <el-input placeholder="请输入提供人" v-model="editForm.provider" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <!--  <el-col :span="24">
              <el-form-item label="发现人证件号码" prop="providerCard">
                <el-input placeholder="请输入发现人证件号码" v-model="editForm.providerCard" :maxlength="50"></el-input>
              </el-form-item>
            </el-col>-->
        <el-col :span="24">
          <el-form-item label="线索类型" prop="type">
            <el-select placeholder="请选择线索类型" v-model="editForm.type" style="width: 100%">
              <el-option :label="item.label" :value="item.value" v-for="(item,index) in cluesTpye" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">

        <el-col :span="24">
          <el-form-item label="附件">
            <div class="wrap-box__content">
              <input type="hidden" v-model="editForm.fileId" />
              <upload :isFormalSubmit="isFormalSubmit" @upload:submit="uploadSubmit" :currentFiles="currentFiles">
                <el-button slot="button" type="primary">上传附件</el-button>
              </upload>

            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="线索描述" prop="desc">
            <el-input type="textarea" placeholder="请输入线索描述" :autosize="{minRows: 12, maxRows: 50}" v-model="editForm.desc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- </div> -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<style scoped>

</style>
<script>
import { mapState } from 'vuex'
import { GET_SYS_DICT_BY_TYPE, GET_DEPT_DICTS_LIST } from '../../../store/types'
import mixin from '../../../utils/mixin'
import upload from '../../../widgets/upload/upload.vue'
export default {
  mixins: [mixin],
  components: {
    upload
  },
  data() {
    return {
      unitList: [],
      org: '',
      editForm: null,
      isFormalSubmit: false,
      cluesTpye: [],
      currentFiles: [], // 当前文件集合
      rulForm: {
        title: [
          { required: true, message: '请输入线索标题' }
        ],
        type: [
          { required: true, message: '请输入线索类型' }
        ]
        //          desc: [
        //            {required: true, message: '请输入线索描述'}
        //          ]
      }
    }
  },
  props: ['dialog', 'type', 'editmode'],
  computed: {
    dialogMode() {
      return this.editmode || 'add'
    },
    ...mapState(['caseClues', 'dict'])
  },
  methods: {
    /**
     *初始化编辑窗口
     * @return {[type]} [description]
     */
    initDialog() {
      this.reset()
      // 初始化选项值
      this.queryCluesTypeList();
      this.editForm = {
        id: '', // 线索id
        title: '', // 线索标题
        date: '', // 线索日期
        org: '', // 线索单位
        provider: '', // 线索发现人
        type: '', // 线索类型代码
        fileId: '', // 附件路径
        fileName: '', // 附件名称
        desc: '' // 线索描述
      }
      // 填充表单基本数据
      if(this.dialogMode === 'edit') {
        // 修改
        let _thisInfo = this.caseClues.Model
        this.editForm = {
          id: _thisInfo.id, // 线索ID
          title: _thisInfo.xsbt, // 线索标题
          date: _thisInfo.xssj, // 线索日期
          org: _thisInfo.dw, // 线索单位
          provider: _thisInfo.fxr, // 线索发现人
          type: _thisInfo.xslx, // 线索类型代码
          fileName: _thisInfo.fjmc, // 附件名称
          fileId: _thisInfo.fjlj, // 附件路径
          desc: _thisInfo.xsms // 线索描述
        }
        let _fId = _thisInfo.fjlj ? _thisInfo.fjlj.split(',') : _thisInfo.fjlj
        let _fName = _thisInfo.fjmc ? _thisInfo.fjmc.split(',') : _thisInfo.fjmc

        // 附件列表数据回填
        this.currentFiles = [] // 上传文件列表 重置
        for(let fi in _fId) {
          this.currentFiles.push({
            name: _fName[fi],
            id: _fId[fi]
          })
        }
      }
    },
    queryCluesTypeList() {
      // 取字典表填充选项
      this.dispatch(GET_SYS_DICT_BY_TYPE, {
        DictType: 'XSLY' // 线索类型
      }).then(_ => {
        this.cluesTpye = this.dict.GetSysDictByType.map(d => {
          return {
            label: d.DictName,
            value: d.Code
          }
        })
      })
      // 取字典表填充选项
      this.dispatch(GET_DEPT_DICTS_LIST).then(_ => { // 所属单位选择
        this.unitList = this.dict.GetDeptDictsList.map(d => {
          return {
            label: d.DictName,
            value: d.KeyId
          }
        })
      })
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
     */
    submit() {
      this.$refs['knowEditForm'].validate(v => {
        if(v) {
          this.isFormalSubmit = true
          this.$emit('form:submit', this.editForm)
        } else {
          return false
        }
      })
    },
    uploadSubmit(f) {
      // 获取当前上传文件列表文件id
      if(f.Status === 1) { // 文件更新保存成功后提交
        let _fileIdArray = [],
          _fileNameArray = []
        for(let ii in f.data.fileList) {
          let __fFileId = f.data.fileList[ii].response ? f.data.fileList[ii].response.Data.ID : f.data.fileList[ii].url.split('?id=')[1]
          _fileIdArray.push(__fFileId)
          _fileNameArray.push(f.data.fileList[ii].name)
        }
        this.editForm.fileId = _fileIdArray.join()
        this.editForm.fileName = _fileNameArray.join()
      }
      this.isFormalSubmit = false
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
      this.currentFiles = [] // 上传文件列表 重置
      if(this.$refs['knowEditForm']) {
        this.$refs['knowEditForm'].resetFields()
      }
    }
  },
  created() {
    this.getRuleOrgTree('', true).then(d => {
      this.orgTree = d.map
      this.orgList = d.list
    })
  },
  mounted() {}
}
</script>
