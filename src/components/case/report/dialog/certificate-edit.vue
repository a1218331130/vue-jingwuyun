<template>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="title||'家庭成员'"
             size="large--fixed" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
    <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="90px">
      <el-row :gutter="10" style="margin: 10px 20px 10px 0;">
        <el-col :span="8">
          <el-form-item label="头像">
            <input type="hidden" v-model="editForm.imageId"/>
            <upload uploadType="picture" :isSinglePic="true" :isFormalSubmit="isFormalSubmit"
                    @upload:submit="uploadSubmit" :currentFiles="currentFiles"></upload>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="editForm.name" placeholder="输入姓名" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关系" prop="relative">
            <el-select placeholder="请选择与嫌疑人关系" v-model="editForm.relative" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index"
                         v-for="(item,index) in dictLists['SARYGXDM']" style="width: 100%"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="证件号码" prop="IDCard">
            <el-input v-model="editForm.IDCard" placeholder="输入证件号码" :maxlength="18"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="editForm.sex">
              <el-radio label="0">未知</el-radio>
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出生日期" prop="dateBirth">
            <el-date-picker v-model="editForm.dateBirth" :editable="false" type="date" style="width: 100%"
                            placeholder="请选择" :picker-options="disabledDateFun"
                            format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="现住址" prop="Address">
            <el-input type="textarea" v-model="editForm.Address" placeholder="输入现住地址(100字符内)" :maxlength="100"
                      :rows="3"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">

        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="" @click="closeEvent">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
</style>

<script>
  import mixin from '../../../../utils/mixin'
  import upload from '../../../../widgets/upload/upload.vue'
  export default {
    mixins: [mixin],
    components: {
      upload
    },
    props: ['dialog', 'title', 'dataForm'],
    computed: {},
    data() {
      return {
        editForm: {
          id: '',
          imageId: '', // 头像
          name: '', // 姓名
          relative: '', // 关系
          IDCard: '', // 证件号码
          sex: '0', // 性别
          dateBirth: '', // 出生日期
          Address: '' //  现住址
        }, // 表单数据对象
        // 表单验证
        editFormRules: {
          name: [
            {required: true, message: '姓名不能为空'}
          ],
//          sex: [
//            {required: true, message: '性别不能为空'}
//          ],
          IDCard: [
            {required: true, message: '证件号码不能为空'}
          ],
          relative: [
            {required: true, message: '人员关系不能为空'}
          ]
        },
        disabledDateFun: { // 出生日期选择范围
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        dictLists: [], // 字典集合
        isFormalSubmit: false, // 头像文件
        currentFiles: [] // 当前文件集合
      }
    },
    methods: {
      /**
       * 弹窗初始化
       */
      initDialog() {
        if (this.$refs['editFormRef']) this.$refs['editFormRef'].resetFields() // 重置表单
        if (this.dataForm) {
          let _DF = this.dataForm
          this.editForm = {
            id: _DF.id,
            imageId: _DF.useIconId, // 头像
            name: _DF.name, // 姓名
            relative: _DF.relative, // 关系
            IDCard: _DF.IDCard, // 证件号码
            sex: _DF.sex, // 性别
            dateBirth: _DF.dateBirth, // 出生日期
            Address: _DF.Address, //  现住址
            sourceCode: _DF.sourceCode, //  来源代码
            source: _DF.source //  来源
          }

          this.currentFiles = this.editForm.imageId ? [{name: '用户头像', id: this.editForm.imageId}] : [] // 编辑头像回填
        } else {
          this.editForm = {
            id: '',
            imageId: '', // 头像
            name: '', // 姓名
            relative: '', // 关系
            IDCard: '', // 证件号码
            sex: '0', // 性别
            dateBirth: '', // 出生日期
            Address: '',
            sourceCode: '', //  来源代码
            source: '' //  来源 //  现住址
          }
          this.currentFiles = []
        }
      },
      /**
       * 关闭弹窗触发
       */
      closeEvent() {
        this.$emit('close')
      },
      submit() {
        this.$refs['editFormRef'].validate(vt => {
          if (vt) {
            // 确认提交
            if (this.currentFiles.length <= 0) {
              this.editForm.imageId = '' // 重置上传文件id
            }
            this.$emit('update:submit', this.editForm)
            this.isFormalSubmit = true
          } else {
            return false
          }
        })
      },
      uploadSubmit(f) {
        // 获取当前上传文件列表文件id
        if (f.Status === 1) { // 文件更新保存成功后提交
          let _fileIdArray = []
          for (let ii in f.data.fileList) {
            _fileIdArray.push(f.data.fileList[ii].response.Data.ID)
            this.currentFiles.push({
              name: f.data.fileList[ii].name,
              id: f.data.fileList[ii].response.Data.ID
            })
          }
          this.editForm.imageId = _fileIdArray.join()
        }
      },
      queryDictType() {
        //  表单字典初始化
        this.getDict(['SARYGXDM']).then(res => {
          this.dictLists = res
        })
      }
    },
    watch: {},
    mounted() {
      this.queryDictType()
    },
    created() {
    }
  }
</script>
