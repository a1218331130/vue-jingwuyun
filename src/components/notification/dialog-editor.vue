<template>
<div>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="dialogMode==='edit'?'修改':'新增'" :modal-append-to-body="true" :append-to-body="true" size="large--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
    <!-- <div class="el-dialog__body__scroll-wrap"> -->
    <div class="form-box">
      <el-form :model="editForm" :inline="true" :rules="rules" ref="editForm" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题" prop="Title">
              <el-input v-model="editForm.Title" auto-complete="off" style="width:630px;" :maxlength="50" placeholder="请输入通知标题"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发送类型" prop="NoticeType">
              <el-radio-group v-model="editForm.NoticeType">
                <el-radio v-for="(item,i) in sendOps" :key="i" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="接收类型" prop="editPostType">
              <el-radio-group v-model="editPostType" @change="typeChange">
                <el-radio v-for="(item,i) in interOps" :key="i" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="紧急程度">
              <el-radio class="radio" v-model="editForm.Emergency" label="1">普通</el-radio>
              <el-radio class="radio" v-model="editForm.Emergency" label="2">紧急</el-radio>
              <el-radio class="radio" v-model="editForm.Emergency" label="3">非常紧急</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item v-show="editPostType==='1'" prop="deptList" label="接收单位">
              <tree-select :tree="{data:treeData, 'node-key':'orgId', props:{label:'name',id:'orgId'}, 'show-checkbox':true, 'check-strictly':true}" v-model="editForm.RcvDeptList"></tree-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item v-show="editPostType==='1'" prop="roleList" label="接收职务" label-width="80px">
              <el-select v-if="dictList!==null" v-model="editForm.RcvRoleList" placeholder="选择职务">
                <el-option v-for="(item,i) in dictList['ZJ']" :key="i" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="人员类型" v-show="editPostType === '2'">
              <el-radio-group v-model="peopleType" @change="typeChange">
                <el-radio v-for="(item,i) in peopleOps" :key="i" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item v-show="peopleType==='2'&& editPostType==='2'" prop="userList" label="接收用户">
              <el-input v-model="notifPersonCount" readonly style="width:150px;" placeholder="点击选择通知人" icon="icon iconfont icon-plus" :on-icon-click="
                openNotifPersonDialog"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="24">
            <el-form-item label="内容" prop="Content">
              <UE ref="notificationEditor" v-model="editForm.Content" :width="660" :height="300"></UE>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件上传">
              <upload :isFormalSubmit="isFormalSubmit" :source="attachmentSource" @upload:submit="uploadSubmit" :currentFiles="fileList">
                <el-button slot="button" type="primary">上传附件</el-button>
              </upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>


    <!-- </div> -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button @click="save">保存草稿</el-button>
      <el-button type="primary" @click="submit">发 送</el-button>
    </div>
  </el-dialog>
</div>
</template>
<style lang="scss" scoped>
.form-box {
    padding: 0 10px;
}

.el-scrollbar {
    width: 300px;
}

.tree-select {
    width: 344px;
}
</style>
<script>
import { mapState } from 'vuex'
import { FETCH_MESSAGE_BY_ID, GET_SYS_ROLE_TREE, EDIT_MESSAGE, ADD_MESSAGE } from '../../store/types'

import mixin from '../../utils/mixin'
import { getOnlyArray, clone } from '../../utils/util'

import UE from '../../widgets/UEeditor/editor'
import upload from '../../widgets/upload/upload'
import TreeSelect from '../../widgets/tree-select'
export default {
  mixins: [mixin],
  components: {
    TreeSelect,
    upload,
    UE
  },
  data() {
    return {
      notifPersonCount: '',
      dialogMode: '',
      checked: [],
      treeData: [],
      defaultProps: {
        children: 'SonModels',
        label: 'DictName',
        id: 'KeyId'
      },
      sendOps: [{ label: '通知通报', value: '1' }, { label: '进度汇报', value: '2' }, { label: '行政通告', value: '3' }, { label: '案件监察', value: '4' }, { label: '党务文化', value: '5' }, { label: '重点工作', value: '6' }],
      interOps: [{ label: '按单位', value: '1' }, { label: '按人员', value: '2' }],
      peopleOps: [{ label: '全部人员', value: '1' }, { label: '指定人员', value: '2' }],
      peopleType: '1',
      isIndeteminate: true,
      dialogVisible: false,
      dialogDetailVisible: false,
      tab: null,
      dictList: null,
      fileList: [],
      isFormalSubmit: false,
      attachmentSource: {
        id: '',
        table: ''
      },
      editData: null,
      editPostType: '1',
      editForm: {
        KeyId: '',
        Title: '',
        Content: '',
        Emergency: '1',
        FileDetail: [],
        RcvDeptList: [],
        RcvRoleList: '',
        RcvUserList: [],
        JSLX: '1', // 接收类型：0：全部人员；1：按职务；2：指定人员
        TempFlag: '0', // 是否草稿，0：否，1：是
        NoticeType: '1' // 类型，1：通知通报，2：进度汇报，3：行政通告，4：案件监察，5：党务文化，6：重点工作
      },
      rules: {
        Title: [{
          required: true,
          message: '请输入通知通告名称',
          trigger: 'blur'
        }],
        Content: [{
          required: true,
          message: '请输入通知通告内容',
          trigger: 'blur'
        }]
      }
    }
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    },
    RcvUserList: {
      type: Array,
      default: []
    }
  },
  watch: {
    RcvUserList(val) {
      this.editForm.RcvUserList = val;
      let count = this.editForm.RcvUserList.length;
      this.notifPersonCount = count === 0 ? '' : '已选' + count + '人'
    }
  },
  computed: {
    ...mapState(['sysDictionary', 'users', 'message', 'roles'])
  },
  methods: {
    /**
     *初始化编辑窗口
     * @return {[type]} [description]
     */
    initDialog() {
      // this.dialogMode
      if(this.data !== null) {
        this.dispatch(FETCH_MESSAGE_BY_ID, { KeyId: this.data.key }).then(() => {
          // let editData = clone(this.message.Model)
          this.editPostType = '1'
          this.editForm = clone(this.message.Model)
          this.editForm.RcvUserList = []
          this.editForm.RcvDeptList = []
          this.editForm.RcvRoleList = this.editForm.RcvRoleList.map(d => d.DeptId).join(',')
          this.fileList = this.editForm.FileDetail.map(d => {
            return { name: d.Name, id: d.ID }
          });
          if(this.$refs.notificationEditor) this.$refs.notificationEditor.setContent(this.editForm.Content)
        })
      } else {
        this.editPostType = '1'
        this.editForm = {
          KeyId: '',
          Title: '',
          Content: '',
          Emergency: '1',
          FileDetail: [],
          RcvDeptList: [],
          RcvRoleList: '',
          RcvUserList: [],
          JSLX: '1', // 接收类型：0：全部人员；1：按职务；2：指定人员
          TempFlag: '0', // 是否草稿，0：否，1：是
          NoticeType: '1' // 类型，1：通知通报，2：进度汇报，3：行政通告，4：案件监察，5：党务文化，6：重点工作
        }
        this.fileList = []
        this.$refs.notificationEditor.setContent(this.editForm.Content)
      }
    },
    /**
     * 编辑窗关闭事件
     * @return {[type]} [description]
     */
    closeEvent() {
      this.editForm.fileList = []
      this.reset()
      this.$emit('close')
      // this.dialog = false
    },
    /**
     * 提交编辑文章表单事件
     * @return {[type]} [description]
     */
    submit(isTemp) {
      let postData = clone(this.editForm)
      if(isTemp === true) {
        postData.TempFlag = '1'
        postData.JSLX = this.editPostType // 接收类型
      } else {
        postData.TempFlag = '0'
        postData.JSLX = this.editPostType // 接收类型
      }

      if(this.editPostType === '2') {
        postData.RcvDeptList = [...getOnlyArray(postData.RcvUserList.map(d => { return d.orgId })).map(d => { return { DeptId: d } })]
        postData.RcvUserList = postData.RcvUserList.map(d => { return { UserId: d.userId } })
      } else {
        postData.RcvDeptList = postData.RcvDeptList.map(d => { return { DeptId: d } })
        postData.RcvRoleList = postData.RcvRoleList !== '' ? [{ RoleId: postData.RcvRoleList }] : []
      }
      // 表单验证 EDIT_MESSAGE, ADD_MESSAGE
      this.dispatch(this.editForm.KeyId === '' ? ADD_MESSAGE : EDIT_MESSAGE, postData).then(() => {
        if(isTemp === true) {
          this.$message({
            type: 'success',
            message: '保存草稿成功',
            showClose: true
          })
          this.$emit('rectlist')
        } else {
          this.$message({
            type: 'success',
            message: '消息发送成功',
            showClose: true
          })
          this.$emit('rectlist')
          this.closeEvent()
        }
      })
    },
    save() {
      this.submit(true)
      this.closeEvent()
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
      if(this.$refs['editForm']) {
        this.$refs['editForm'].resetFields()
      }
      if(this.$refs.notificationEditor) this.$refs.notificationEditor.setContent()
    },
    typeChange() {
      this.editForm.RcvDeptList = []
      this.editForm.RcvRoleList = ''
      this.editForm.RcvUserList = []
    },
    openNotifPersonDialog() {
      this.$emit('openNotifPersonDialog');
    },
    uploadSubmit(file) {
      if(!file.data.fileList) {

      } else {
        this.editForm.FileDetail.push({
          ID: file.data.res.Data.ID
        })
      }
    }
  },
  created() {
    this.dispatch(GET_SYS_ROLE_TREE)
    this.getRuleOrgTree().then(d => {
      this.treeData = d
    })
  },
  mounted() {
    this.getDict(['ZJ'], true).then(res => {
      this.dictList = res
    })
  }
}
</script>
