<template>
<div>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="dialogMode==='edit'?'修改':'新增'" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
    <!-- <div class="el-dialog__body__scroll-wrap"> -->
    <el-form v-if="editForm!==null" ref="knowEditForm" :rules="knowEditFormRules" :model="editForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="案件编号" prop="CaseNumber">
            {{dialogMode === 'edit' ? editForm.CaseNumber : ''}}
            <el-autocomplete v-if="dialogMode !== 'edit'" v-model="editForm.CaseNumber" :fetch-suggestions="fetchCaseInfoByNumber" :trigger-on-focus="false" placeholder="根据案件编号(7个字符开始搜索)" style="width: 100%" :props="{value:'CaseNumber',label:'CaseName'}" @select="selelctCaseInfoAuto"
              :maxlength="50">
            </el-autocomplete>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="案件名称">
            {{dialogMode === 'edit' ? editForm.CaseName : ''}}
            <el-input v-if="dialogMode !== 'edit'" placeholder="请输入案件名称" :disabled="true" v-model="editForm.CaseName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="简要案情">
            {{dialogMode === 'edit' ? editForm.BriefCase : ''}}
            <el-input v-if="dialogMode !== 'edit'" type="textarea" placeholder="简要案情" :rows="3" :disabled="true" v-model="editForm.BriefCase"></el-input>
          </el-form-item>
        </el-col>


      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="关联描述" prop="means">
            <el-input type="textarea" placeholder="请输入串案描述(200个字符内)" :rows="5" :maxlength="200" v-model="editForm.means"></el-input>
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
import mixin from '../../../utils/mixin'
import { clone } from '../../../utils/util'
import {
  FETCH_CASE_INFO_BY_NUMBER
} from '../../../store/types'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      editForm: {},
      knowEditFormRules: { // 表单验证
        CaseNumber: [
          { required: true, message: '案件编号不能为空' }
        ]
      }
    }
  },
  props: ['dialog', 'data', 'editmode'],
  computed: {
    dialogMode() {
      return this.editmode || 'add'
    },
    ...mapState(['seriesCase', 'caseInfo'])
  },
  methods: {
    /**
     *初始化编辑窗口
     */
    initDialog() {
      this.reset()
      this.editForm = {
        id: '',
        CaseNumber: '',
        CaseName: '',
        means: ''
      }
      // 填充表单基本数据
      if(this.editmode === 'edit') {
        // 修改
        let _thisInfo = this.seriesCase.Model
        this.editForm = {
          id: _thisInfo.id,
          CaseNumber: _thisInfo.ajbh,
          CaseName: _thisInfo.ajmc,
          means: _thisInfo.ms,
          BriefCase: _thisInfo.jyaq
        }
      } else if(this.data) {
        this.editForm = {
          id: '',
          CaseNumber: this.data.asjbh,
          CaseName: this.data.ajmc,
          means: '',
          BriefCase: this.data.jyaq,
          CaseType: this.data.CaseType,
          CaseTime: this.data.asjfssj,
          CaseOrg: this.data.ladw_gajgjgdm
        }
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
     */
    submit() {
      this.$refs['knowEditForm'].validate(v => {
        if(v) {
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
      let _caseN = this.editForm.CaseNumber
      if(this.$refs['knowEditForm']) {
        this.$refs['knowEditForm'].resetFields()
      }
      this.editForm.CaseNumber = _caseN
    },
    /**
     * 通过案件编号远程搜索案件信息
     * @param keyWord
     * @param callback
     */
    fetchCaseInfoByNumber(keyWord, callback) {
      if(keyWord.length >= 7) {
        this.dispatch(FETCH_CASE_INFO_BY_NUMBER, {
          ajbh: keyWord
        }).then(_ => {
          if(this.caseInfo.FetchCaseInfoByNumber.ajList) {
            callback(this.caseInfo.FetchCaseInfoByNumber.ajList.map(rowC => {
              // rowC.larq;  //立案日期
              return {
                CaseNumber: rowC.asjbh, // 案件编号
                CaseName: rowC.ajmc, // 案件名称
                BriefCase: rowC.jyaq, // 基本案情
                CaseType: rowC.ajlbdm, // 案件类别
                CaseTime: rowC.ajkssj, // 案件开始时间
                CaseOrg: rowC.sldwdm // 管辖单位
              }
            }))
          }
        })
      } else {
        this.reset()
        callback([]) // 初始化进程
      }
    },
    /**
     * 选中的研判案件项目
     * @param item
     */
    selelctCaseInfoAuto(item) {
      // this.querySelectForm = item
      this.editForm = clone(item) // Object.assign(this.editForm, item)
    }
  },
  created() {

  },
  mounted() {}
}
</script>
