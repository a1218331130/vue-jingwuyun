<template>
<div>
  <el-dialog class="title-icon-edit" v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="dialogMode==='edit'?'修改办案人员':'新增办案人员'" :modal-append-to-body="true" :append-to-body="true" :size="dialogLevel === 2?'bigest':'middle--fixed'" :modal="dialogLevel === 2?false:true"
    :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
    <div v-loading="dictLoading||sumTLoading" :element-loading-text="sumTLoadingText">
      <el-form v-if="editForm !== null" ref="knowEditForm" :rules="knowEditFormRules" :model="editForm" label-width="110px">
        <el-row :gutter="10" style="margin-left: -40px;">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <span v-if="dialogMode === 'edit'">
                {{editForm.name}}
              </span>
              <el-select v-else v-model="editForm.name" @change="selectUserInfo" @clear="clearUserInfo" filterable remote clearable :remote-method="nameRemoteScreen" :loading="selectQueryLoading" style="width: 100%" placeholder="输入姓名关键字搜索">
                <el-option style="height: auto" v-for="(item,ik) in userList" :key="ik" :label="item.name" :value="item.userId">
                  <div class="select-option_div">
                    <b>{{item.name}}</b><br/>
                    <span style="font-size: 12px;line-height: 1">{{item.num}}<br/></span>
                    <span style="font-size: 12px;line-height: 1">{{item.unitText}}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="警号" prop="num">
              <span v-if="dialogMode === 'edit'">
                {{editForm.num}}
              </span>
              <el-select v-else v-model="editForm.num" @change="selectUserInfo" @clear="clearUserInfo" filterable remote clearable :remote-method="numRemoteScreen" :loading="selectQueryLoading" :disabled="dialogMode === 'edit'" style="width: 100%" placeholder="输入警号搜索">
                <el-option style="height: auto" v-for="(item,ik) in userList" :key="ik" :label="item.num" :value="item.userId">
                  <div class="select-option_div">
                    <b>{{item.num}}</b><br/>
                    <span style="font-size: 12px;line-height: 1">{{item.name}}<br/></span>
                    <span style="font-size: 12px;line-height: 1">{{item.unitText}}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="editForm.mobile">
            <el-form-item label="联系方式" prop="mobile">
              {{editForm.mobile}}
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="editForm.unitText">
            <el-form-item label="所属单位" prop="unitText">
              {{editForm.unitText}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-left: -40px;">
          <el-col :span="12">
            <el-form-item label="岗位" prop="work">
              <el-select placeholder="请选择岗位" v-model="editForm.work" style="width: 100%">
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in workList"></el-option>
                <el-option v-if="this.editmode==='edit' && editFormWork === '4'" label="主办人" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可权限调整" prop="adjustPer">
              <el-switch v-model="editForm.adjustPer" on-value="1" on-text="是" off-value="0" off-text="否"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="职责" prop="duty">
              <el-input type="textarea" placeholder="请输入职责(20个字符内)" :maxlength="20" v-model="editForm.duty"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="el-dialog__footer">
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </div>
    </div>

  </el-dialog>
</div>
</template>
<style scoped lang="scss">
.select-option_div {}
</style>
<script>
import { mapState } from 'vuex'
import mixin from '../../../utils/mixin'
import { GET_SYS_DICT_BY_TYPE, GET_DEPT_DICTS_LIST, FETCH_USER_LIST_BY_KEYWORD } from '../../../store/types'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      editFormWork: '',
      sumTLoading: false,
      sumTLoadingText: '正在加载中',
      currentTableListUser: [], // 当前列表存在的用户
      knowEditFormRules: {
        name: [
          { required: true, message: '姓名不能为空' }
        ],
        num: [
          { required: true, message: '警号不能为空' }
        ],
        work: [
          { required: true, message: '岗位不能为空' }
        ]
      },
      selectQueryLoading: false, // 远程搜索loading
      userList: [],
      editForm: {},
      unitList: {}, // 所属单位选择
      workList: {}, // 岗位选择
      isResponsiblePerson: true // 是否已经有负责人 默认否
    }
  },
  props: ['dialog', 'type', 'editmode', 'dialogLevel', 'currentTabelList'],
  computed: {
    dialogMode() {
      return this.editmode || 'add'
    },
    ...mapState(['peopleCase', 'dict', 'users'])
  },
  methods: {
    /**
     *初始化编辑窗口
     * @return {[type]} [description]
     */
    initDialog() {
      // 初始化选项
      this.judgmentIsRP()
      this.queryCluesTypeList()
      this.reset()
      this.editFormWork = ''
      this.editForm = {
        id: '',
        name: '',
        num: '',
        unit: '',
        unitText: '',
        duty: '',
        mobile: '',
        work: '',
        adjustPer: '0' // 1:是 0: 否
      }
      // 填充表单基本数据
      if(this.dialogMode === 'edit') {
        let _thisInfo = this.peopleCase.Model
        this.editForm = {
          id: _thisInfo.id,
          name: _thisInfo.mc,
          num: _thisInfo.jh,
          unit: _thisInfo.orgid,
          unitText: _thisInfo.ssdwmc,
          duty: _thisInfo.zz,
          mobile: _thisInfo.zw,
          userId: _thisInfo.userId,
          work: _thisInfo.gwdm,
          adjustPer: _thisInfo.sfxg
        }
        this.editFormWork = _thisInfo.gwdm
      }
      this.currentUserListSX()
    },
    queryCluesTypeList() {
      // 取字典表填充选项
      this.dispatch(GET_DEPT_DICTS_LIST).then(_ => { // 所属单位选择
        if(this.dict.GetDeptDictsList) {
          this.unitList = this.dict.GetDeptDictsList.map(d => {
            return {
              label: d.DictName,
              value: d.KeyId
            }
          })
        }
      })
      this.dispatch(GET_SYS_DICT_BY_TYPE, {
        DictType: 'BARYGW' // 岗位选择
      }).then(_ => {
        this.workList = this.dict.GetSysDictByType.filter(r => !(this.isResponsiblePerson && r.Code === '4')).map(d => {
          return {
            label: d.DictName,
            value: d.Code
          }
        })
      })
    },
    /**
     * 判断列表是否存在负责人
     */
    judgmentIsRP() {
      this.isResponsiblePerson = false
      if(this.peopleCase.PageData) {
        this.peopleCase.PageData.map(r => {
          if(r.gwdm === '4') {
            this.isResponsiblePerson = true
          }
        })
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
      this.sumTLoading = true
      this.$refs['knowEditForm'].validate(vt => {
        if(vt) {
          this.sumTLoadingText = '正在提交中...'
          // 翻译单位选择文本
          this.editForm.unitText = ''
          for(let iu in this.unitList) {
            if(this.unitList[iu].value === this.editForm.unit) {
              this.editForm.unitText = this.unitList[iu].label
            }
          }
          // 翻译岗位选择文本
          this.editForm.workText = ''
          for(let iu in this.workList) {
            if(this.workList[iu].value === this.editForm.work) {
              this.editForm.workText = this.workList[iu].label
            }
          }
          this.$emit('form:submit', this.editForm, this.dialogMode)
          this.sumTLoading = false
        } else {
          this.sumTLoading = false
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
      if(this.$refs['knowEditForm']) {
        this.$refs['knowEditForm'].resetFields()
      }
      this.editForm = {
        id: '',
        name: '',
        num: '',
        unit: '',
        unitText: '',
        duty: '',
        mobile: '',
        userId: '',
        work: '',
        adjustPer: '0'
      }
    },
    /**
     * 根据关键条件查询民警信息列表
     */
    queryPoliceInfo(condition, callback = () => {}) {
      this.dispatch(FETCH_USER_LIST_BY_KEYWORD, condition).then(d => {
        callback()
      })
    },
    /**
     * 姓名远程筛选
     * @param keyword
     */
    nameRemoteScreen(keyword) {
      if(keyword !== '' && this.dialogMode !== 'edit') {
        this.selectQueryLoading = false
        this.queryPoliceInfo({
          name: keyword
        }, () => {
          this.userList = this.users.fetchUserListByKeyword.filter(rf => !this.currentTableListUser.includes(rf.userId)).map(r => {
            return {
              userId: r.userId,
              name: r.xm, // 姓名
              num: r.code, // 警号
              unit: r.orgId, // 单位id
              mobile: r.mobile, // 职位
              unitText: r.orgname // 单位名称
            }
          })
          this.selectQueryLoading = false
        })
      } else {
        this.userList = []
      }
    },
    /**
     * 警员编号远程筛选
     * @param keyword
     */
    numRemoteScreen(keyword) {
      if(keyword !== '' && this.dialogMode !== 'edit') {
        this.selectQueryLoading = true
        this.queryPoliceInfo({
          jh: keyword
        }, () => {
          this.userList = this.users.fetchUserListByKeyword.filter(rf => !this.currentTableListUser.includes(rf.userId)).map(r => {
            return {
              userId: r.userId,
              name: r.xm, // 姓名
              num: r.code, // 警号
              unit: r.orgId, // 单位id
              mobile: r.mobile, // 职位
              unitText: r.orgname // 单位名称
            }
          })
          this.selectQueryLoading = false
        })
      } else {
        this.userList = []
      }
    },
    /**
     * 填充关联信息
     * @param item
     */
    selectUserInfo(item) {
      this.userList.map(ri => {
        if(ri.userId === item) {
          let _te = this.editForm
          this.editForm = Object.assign(_te, ri)
        }
      })
    },
    /**
     * 初始化当前已加入办案人员的用户
     */
    currentUserListSX() {
      if(this.currentTabelList) {
        this.currentTabelList.map(r => {
          this.currentTableListUser.push(r.userId)
        })
      }
    },
    /**
     * 清除表单关联信息
     */
    clearUserInfo() {
      this.reset()
    }
  },
  created() {

  },
  mounted() {}
}
</script>
