<template>
<div class="group_add_from">
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="dialogMode==='edit'?'修改':'新增'" :modal-append-to-body="true" :append-to-body="true" size="bigest" :modal="false" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
    <!-- <div class="el-dialog__body__scroll-wrap"> -->
    <el-form v-if="editForm!==null" ref="knowEditForm" :rules="rulForm" :model="editForm" label-width="110px">
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="联通方式类型" prop="lxfslx">
            <el-select placeholder="请选择" v-model="editForm.lxfslx" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['LXFSLX']" style="width: 100%"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="lxfs">
            <el-input v-model="editForm.lxfs" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="bz">
            <el-input v-model="editForm.bz" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="地址" prop="dz">
            <el-input v-model="editForm.dz" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="登记人姓名" prop="cjrxm">
            <el-input v-model="editForm.cjrxm" :maxlength="50" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="登记人单位" prop="cjdwmc">
            <el-input v-model="editForm.cjdwmc" :maxlength="50" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="登记时间" prop="cjsj">
            <el-date-picker v-model="editForm.cjsj" type="datetime" style="width: 100%" :disabled="true"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作人姓名" prop="xgrxm">
            <el-input v-model="editForm.xgrxm" :maxlength="50" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作单位" prop="xgdwmc">
            <el-input v-model="editForm.xgdwmc" :maxlength="50" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作时间" prop="xgsj">
            <el-date-picker v-model="editForm.xgsj" type="datetime" style="width: 100%" :disabled="true"></el-date-picker>
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
//  import {mapState} from 'vuex'
import mixin from '../../../../../utils/mixin'
import { clone } from '../../../../../utils/util'
import { mapState } from 'vuex'
import upload from '../../../../../widgets/upload/upload.vue'
export default {
  mixins: [mixin],
  components: {
    upload
  },
  data() {
    return {
      dictLists: [],
      org: '',
      editForm: {},
      isFormalSubmit: false,
      cluesTpye: [],
      currentFiles: [], // 当前文件集合
      rulForm: {
        lxfslx: [
          { required: true, message: '不能为空' }
        ],
        lxfs: [
          { required: true, message: '不能为空' }
        ]
      }
    }
  },
  props: ['dialog', 'type', 'editmode', 'dataForm'],
  computed: {
    dialogMode() {
      return this.editmode || 'add'
    },
    ...mapState(['users'])
  },
  methods: {
    /**
     *初始化编辑窗口
     * @return {[type]} [description]
     */
    initDialog() {
      // this.reset()
      this.editForm = {}
      if(this.dialogMode === 'add') {
        this.editForm = clone(this.dataForm)
        this.editForm.cjrxm = this.users.UserLogin.UserData.UserName
        this.editForm.cjdwmc = this.users.UserLogin.UserData.DeptName
        this.editForm.cjsj = this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        this.editForm.xgrxm = this.users.UserLogin.UserData.UserName
        this.editForm.xgdwmc = this.users.UserLogin.UserData.DeptName
        this.editForm.xgsj = this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        this.reset()
      }
      if(this.dialogMode === 'edit') {
        this.editForm = clone(this.dataForm)
        // this.editForm.cjrxm = this.users.UserLogin.UserData.UserName
        // this.editForm.cjdwmc = this.users.UserLogin.UserData.DeptName
        // this.editForm.cjsj = this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        this.editForm.xgrxm = this.users.UserLogin.UserData.UserName
        this.editForm.xgdwmc = this.users.UserLogin.UserData.DeptName
        this.editForm.xgr = this.users.UserLogin.UserData.LoginName
        this.editForm.xgdw = this.users.UserLogin.UserData.DeptNo
        this.editForm.xgsj = this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
      }
      if(this.dictLists.length <= 0) {
        this.queryDictType()
      }
    },
    queryDictType() {
      //  表单字典初始化
      this.getDict(['LXFSLX']).then(res => {
        this.dictLists = res
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
