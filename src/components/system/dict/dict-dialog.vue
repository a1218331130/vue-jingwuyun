<template>
<el-dialog v-draggable="dialogDraggableOptions" title="字典修改" :rules="rules" :visible.sync="dialogVisible" @open="initDialog" :before-close="cancel">
  <el-form :model="formData" label-width="100px">
    <el-form-item label="字典代码">
      <el-input v-model="formData.zddm" :disabled="disabledInput" :maxlength="10"></el-input>
    </el-form-item>
    <el-form-item label="字典名称">
      <el-input v-model="formData.zdmc" :maxlength="10"></el-input>
    </el-form-item>
    <el-form-item label="父级代码">
      <el-input v-model="formData.fjdm" :maxlength="10"></el-input>
    </el-form-item>
    <el-form-item label="字典类型">
      <!--<el-input v-model="formData.ms"></el-input>-->
      <el-select ref="typeselect" v-model="formData.zdlx" :disabled="formData.sfxz==='0'" @change="msvalue()" filterable clearable placeholder="请选择">
        <el-option v-for="item in dict.FetchDictType" :key="item.key" :label="item.value" :value="item.key">
          <span style="float: left">{{item.value}}</span>
          <span style="float: right;font-size: 12px">{{item.key}}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否新增类型">
      <el-switch on-text="是" off-text="否" on-value="0" off-value="1" v-model="formData.sfxz"></el-switch>
    </el-form-item>
    <el-form-item label="新增字典类型代码">
      <el-input v-model="formData.zdlxdm" :disabled="formData.sfxz!=='0'" :maxlength="20"></el-input>
    </el-form-item>
    <el-form-item label="新增字典类型描述">
      <el-input v-model="formData.msmc" :disabled="formData.sfxz!=='0'" :maxlength="20"></el-input>
    </el-form-item>
    <el-form-item label="字典顺序">
      <el-input v-model="formData.sx" :maxlength="2"></el-input>
    </el-form-item>
    <el-form-item label="是否显示">
      <el-switch on-text="是" off-text="否" on-value="0" off-value="1" v-model="formData.sfxs"></el-switch>
    </el-form-item>
    <el-form-item label="备注">
      <el-input type="textarea" v-model="formData.by1" :maxlength="300"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancel">取消</el-button>
    <el-button type="primary" @click="submit">确认</el-button>
  </div>
</el-dialog>
</template>
<style scoped>

</style>
<script>
import { mapState } from 'vuex'
import mixin from '../../../utils/mixin'
import { ADD_DICT_INFO, GET_DICT_INFO, UPDATE_DICT_INFO } from '../../../store/types'
export default {
  data() {
    return {
      ms: '',
      isNewType: true,
      formData: {},
      disabledInput: false,
      rules: {
        zddm: [
          { required: true }
        ]
      }
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    handleType: { // todo:弹窗操作类型，默认为新增
      type: String,
      default: 'add'
    },
    handleObjId: { // todo:upadate Dict Object
      type: String,
      default: ''
    }
  },
  mixins: [mixin],
  computed: {
    ...mapState(['dict'])
  },
  methods: {
    /**
     *  取消操作按钮,关闭弹窗
     */
    cancel() {
      this.formData = {}
      this.$emit('cancel')
    },
    /**
     *  根据id查询单条字典信息
     */
    getInfo(dId) {
      this.dispatch(GET_DICT_INFO, { data: { id: dId } })
    },
    /**
     * 初始化窗体
     */
    initDialog() {
      if(this.handleType === 'update') { // 更新字典获取字典详情
        this.disabledInput = true
        this.getInfo(this.handleObjId)
      } else {
        this.disabledInput = false
        this.formData = {
          zddm: '',
          zdmc: '',
          fjdm: '',
          zdlxdm: '',
          msmc: '',
          zdlx: '',
          sx: '',
          sfxs: '1',
          sfxz: '1',
          by1: ''
        }
      }
    },
    /**
     * 提交表单
     */
    submit() {
      if(this.handleType === 'update') {
        this.dispatch(UPDATE_DICT_INFO, {
          data: {
            id: this.formData.id,
            zddm: this.formData.zddm,
            zdmc: this.formData.zdmc,
            fjdm: this.formData.fjdm,
            zdlx: this.formData.sfxz === '1' ? this.formData.zdlx : this.formData.zdlxdm,
            ms: this.formData.sfxz === '1' ? this.$refs.typeselect.selectedLabel : this.formData.msmc,
            sx: this.formData.sx,
            sfxs: this.formData.sfxs,
            by1: this.formData.by1
          }
        }).then(d => {
          this.$message({
            message: '更新成功！',
            type: 'success'
          })
          this.$emit('reflash')
          this.cancel()
        })
      }
      if(this.handleType === 'add') {
        this.dispatch(ADD_DICT_INFO, {
          data: {
            zddm: this.formData.zddm,
            zdmc: this.formData.zdmc,
            fjdm: this.formData.fjdm,
            zdlx: this.formData.sfxz === '1' ? this.formData.zdlx : this.formData.zdlxdm,
            ms: this.formData.sfxz === '1' ? this.$refs.typeselect.selectedLabel : this.formData.msmc,
            sx: this.formData.sx,
            sfxs: this.formData.sfxs,
            by1: this.formData.by1
          }
        }).then(d => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$emit('reflash')
          this.cancel()
        })
      }
    },
    msvalue() {
      console.log('this', this.$refs.typeselect.selectedLabel)
    }
  },
  watch: {
    'dict.Model' (val) {
      let dictModel = val
      this.formData = {
        id: dictModel.id,
        fjdm: dictModel.fjdm,
        zdmc: dictModel.zdmc,
        zddm: dictModel.zddm,
        zdlx: dictModel.zdlx,
        by1: dictModel.by1,
        ms: dictModel.ms,
        sx: dictModel.sx,
        zdjb: dictModel.zdjb,
        sfxs: dictModel.sfxs,
        sfsc: dictModel.sfsc,
        sfxz: '1',
        py: dictModel.py
      }
    }
  }
}
</script>
