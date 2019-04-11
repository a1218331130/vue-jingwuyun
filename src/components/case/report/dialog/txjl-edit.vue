<template>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="title||'添加'"
             size="large--fixed" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent"
             style="text-align: left;">
    <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="140px">
      <el-row :gutter="10" style="margin: 10px 20px 10px 0;">


        <el-col :span="12">
          <el-form-item label="主叫号码" prop="zjhm">
            <el-input v-model="editForm.zjhm" placeholder="输入主叫号码" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主叫号码姓名" prop="zjxm">
            <el-input v-model="editForm.zjxm" placeholder="输入主叫号码姓名" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主叫身份证号码" prop="zjsfzhm">
            <el-input v-model="editForm.zjsfzhm" placeholder="输入主叫号码身份证" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="呼叫类型" prop="hjlxdm">
            <el-select placeholder="请选择" v-model="editForm.hjlxdm" filterable style="width: 100%">
              <el-option label="主叫" value="0" key="0" style="width: 100%"></el-option>
              <el-option label="被叫" value="1" key="1" style="width: 100%"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="被叫号码" prop="dfhm">
            <el-input v-model="editForm.dfhm" placeholder="输入被叫号码" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="被叫姓名" prop="dfxm">
            <el-input v-model="editForm.dfxm" placeholder="输入被叫姓名" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="被叫身份证号码" prop="dfsfzhm">
            <el-input v-model="editForm.dfsfzhm" placeholder="输入被叫身份证号码" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="通话位置所在地" prop="thd">
            <el-input v-model="editForm.thd" placeholder="输入通话位置所在地" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="通话时间" prop="thsj">
            <el-date-picker v-model="editForm.thsj" :editable="false" type="datetime" style="width: 100%"
                            placeholder="请选择" :picker-options="disabledDateFun"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="通话时长" prop="thsc">
            <el-input v-model="editForm.thsc" placeholder="输入通话时长" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="基站代码" prop="jzdm">
            <el-input v-model="editForm.jzdm" placeholder="输入基站代码" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="小区代码" prop="xqdm">
            <el-input v-model="editForm.xqdm" placeholder="输入小区代码" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对方号码归属地" prop="gsd">
            <el-input v-model="editForm.gsd" placeholder="输入对方号码归属地" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="通话地点" prop="thdd">
            <el-input v-model="editForm.thdd" placeholder="输入通话地点" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="通话地代码" prop="thddm">
            <el-input v-model="editForm.thddm" placeholder="输入通话地代码" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经度" prop="jd">
            <el-input v-model="editForm.jd" placeholder="输入经度" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纬度" prop="wd">
            <el-input v-model="editForm.wd" placeholder="输入纬度" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职位" prop="zw">
            <el-input v-model="editForm.zw" placeholder="输入职位" :maxlength="25"></el-input>
          </el-form-item>
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
  export default {
    mixins: [mixin],
    components: {},
    props: ['dialog', 'title', 'dataForm'],
    computed: {},
    data() {
      return {
        editForm: {}, // 表单数据对象
        // 表单验证
        editFormRules: {
          zjhm: [
            {required: true, message: '不能为空'}
          ], // 主机号码
          zjxm: [
            {required: true, message: '不能为空'}
          ], // 主机号码姓名
          zjsfzhm: [
            {required: true, message: '不能为空'}
          ], // 主叫身份证号码
//          hjlx: [
//            {required: true, message: '不能为空'}
//          ], // 呼叫类型  下拉，0主叫1被叫
          dfhm: [
            {required: true, message: '不能为空'}
          ], // 对方号码
          thd: [
            {required: true, message: '不能为空'}
          ], // 通话位置所在地
          thsj: [
            {required: true, message: '不能为空'}
          ], // 通话时间
          thsc: [
            {required: true, message: '不能为空'}
          ], // 通话时长
          jzdm: [
            {required: true, message: '不能为空'}
          ], // 基站代码
          xqdm: [
            {required: true, message: '不能为空'}
          ], // 小区代码
          gsd: [
            {required: true, message: '不能为空'}
          ], // 对方号码归属地
          thdd: [
            {required: true, message: '不能为空'}
          ], // 通话地点
          jd: [
            {required: true, message: '不能为空'}
          ], // 经度
          wd: [
            {required: true, message: '不能为空'}
          ], // 纬度
          zw: [
            {required: true, message: '不能为空'}
          ], // 职位
          thddm: [
            {required: true, message: '不能为空'}
          ], // 通话地代码
          hjlxdm: [
            {required: true, message: '不能为空'}
          ], // 呼叫类型代码0，1
          dfsfzhm: [
            {required: true, message: '不能为空'}
          ], // 对方身份证号码
          dfxm: [
            {required: true, message: '不能为空'}
          ] // 对方姓名
        },
        disabledDateFun: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        dictLists: [] // 字典集合
      }
    },
    methods: {
      /**
       * 弹窗初始化
       */
      initDialog() {
        if (this.$refs['editFormRef']) this.$refs['editFormRef'].resetFields() // 重置表单
        this.editForm = {
          id: '',
          zjhm: '', // 主机号码
          zjxm: '', // 主机号码姓名
          zjsfzhm: '', // 主叫身份证号码
          hjlx: '', // 呼叫类型  下拉，0主叫1被叫
          dfhm: '', // 对方号码
          thd: '', // 通话位置所在地
          thsj: '', // 通话时间
          thsc: '', // 通话时长
          jzdm: '', // 基站代码
          xqdm: '', // 小区代码
          gsd: '', // 对方号码归属地
          thdd: '', // 通话地点
          jd: '', // 经度
          wd: '', // 纬度
          zw: '', // 职位
          thddm: '', // 通话地代码
          hjlxdm: '', // 呼叫类型代码0，1
          dfsfzhm: '', // 对方身份证号码
          dfxm: '' // 对方姓名
        }
        if (this.dataForm) {
          this.editForm = this.dataForm
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
            this.editForm.hjlx = this.editForm.hjlxdm === '0' ? '主叫' : this.editForm.hjlxdm === '1' ? '被叫' : '未知'
            this.$emit('update:submit', this.editForm)
            this.isFormalSubmit = true
          } else {
            return false
          }
        })
      },
      queryDictType() {
        //  表单字典初始化
        this.getDict(['JYLX']).then(res => {
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
