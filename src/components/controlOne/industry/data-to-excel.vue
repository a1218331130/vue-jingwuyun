<template>
<el-dialog v-draggable="dialogDraggableOptions" title="数据导出" v-loading="downloading" :visible.sync="dataOutdialog" @open="initDialog" :modal="true" :close-on-click-modal="false" :before-close="closeEvent">
  <el-form :model="form" ref="form" label-width="100px">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label-width="106px" label="">
          <el-checkbox :indeterminate="indeterminated" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox :indeterminate="indeterminated" v-model="checkt" @change="checkChange">反选</el-checkbox>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label-width="106px" label="选择数据内容" prop="aprop">
          <el-checkbox-group v-model="form.aprop" @change="changeVal">
            <el-checkbox :label="item.prop" v-for="item in formData" :key="item.prop">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <!-- <form ref="docDownForm" method="post" :form="form" action="#/fwzx/fwzx/call?id=fxpcgk/zdqtry/toexcel" target="_blank">
    <input type="hidden" value="1111">
    <input type="submit" value="submit">
  </form> -->
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button @click="closeEvent">取 消</el-button>
    <el-button type="primary" @click="submitForm('form')">确定</el-button>
  </div>
  <form ref="postform" method="post" :action="rod+'fxpcgk/baseplace/toexcel'">
    <input type="hidden" name="token" :value="userData.UserToken" />
    <input type="hidden" name="a" :value="a" />
    <input type="hidden" name="b" :value="b" />
    <input type="hidden" name="type" :value="type" />
    <input type="hidden" name="title" :value="title" />
    <input type="hidden" name="ids" :value="this.ids.join(',')" />
    <input type="hidden" name="query" :value="querObj" />
    <!-- <input type="submit" value="submit"> -->
  </form>
</el-dialog>
</template>

<style scoped>


</style>
<script>
  import mixin from '../../../utils/mixin'
  import { clone } from '../../../utils/util'
  import bus from '../../../utils/bus'
  // import { FXPCGK_TOEXCEL } from'../../../../store/types'
  import {
    FWZX_PATH
  } from '../../../config'
  import { mapState } from 'vuex'
  export default {
    mixins: [mixin],
    components: { clone, FWZX_PATH },
    data() {
      return {
        indeterminated: false,
        checkAll: false,
        downloading: false,
        checkt: false,
        rod: FWZX_PATH,
        a: '',
        b: '',
        querObj: null,
        // type:'',
        formProp: [],
        form: { aprop: [], btitle: [] },
        formData: []
      }
    },
    props: ['dataOutdialog', 'type', 'title', 'ids'],
    methods: {
      /**
       *初始化编辑窗口
       * @return {[type]} [description]
       */
      initDialog() {
        this.checkAll = false
        this.checkt = false
        this.formProp = []
        this.formData = [{ prop: 'zdcslxmc', label: '重点场所类型' },
          { prop: 'aqzrdwmc', label: '安全责任单位' },
          { prop: 'aqzrrxm', label: '安全责任人' },
          { prop: 'aqzrrzwmc', label: '责任人职位' },
          { prop: 'aqzrrdh', label: '安全责任人 联系电话' },
          { prop: 'dwfzrxm', label: '单位负责人姓名' },
          { prop: 'dwfzrsfz', label: '有效身份证件号码' },
          { prop: 'dwfzrdh', label: '联系电话' },
          { prop: 'CSMC', label: '场所名称' },
          { prop: 'CSDH', label: '场所电话' },
          { prop: 'CSDZ', label: '详细地址' },
          { prop: 'CSJD', label: '经度' },
          { prop: 'CDWD', label: '纬度' },
          { prop: 'BZ', label: '备注' },
          { prop: 'SFYYH', label: '是否有隐患' },
          { prop: 'YHDJMC', label: '隐患等级' }
        ]
        this.form = { aprop: [], btitle: [] }
        // this.form.KeyId = this.keyId
        this.formData.forEach(d => {
          this.formProp.push(d.prop)
        })
      },
      /**
       * 重置表单
       */
      reset() {
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      /**
       * 编辑窗关闭事件
       * @return {[type]} [description]
       */
      closeEvent() {
        this.reset()
        this.$emit('close')
      },
      //
      changeVal(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.form.aprop.length
        if (checkedCount === 0) {
          this.checkAll = false
          this.checkt = false
        }
        this.indeterminated = checkedCount > 0 && checkedCount < this.formProp.length
      },
      //
      handleCheckAllChange(event) {
        this.form.aprop = event.target.checked ? this.formProp : []
        if (this.form.aprop.length === 0) {
          this.checkt = false
        } else {
          this.checkt = true
        }
        this.indeterminated = false
      },
      checkChange() {
        let tem = []
        this.formProp.forEach(d => {
          if (this.form.aprop.indexOf(d) === -1) {
            tem.push(d)
          }
        })
        this.form.aprop = tem
        if (this.form.aprop.length === 0) {
          this.checkAll = false
          this.checkt = false
        }
      },
      //
      submitForm(d) {
        if (this.form.aprop && this.form.aprop.length !== 0) {
          this.form.aprop.forEach(e => {
            this.formData.forEach(d => {
              if (e === d.prop) {
                this.form.btitle.push(d.label)
              }
            })
          })
          this.sumform = clone(this.form)
          this.a = this.sumform.aprop.join(',')
          this.b = this.sumform.btitle.join(',')
          // if(this.$refs.docDownForm) this.$refs.docDownForm.submit()
          // this.jumpTo('http://localhost:8080/qingbaoyun-navigation/fxpcgk/zdqtry/toexcel?a=' + sumform.aprop +'&b=' + sumform.btitle)
          this.downloading = true
          this.$confirm('确定要导出数据吗', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$refs['postform'].submit(function(e) {});
          })
          // this.$nextTick(
          //   this.jumpUrl(sumform)
          // )
          this.downloading = false
          this.closeEvent()
        } else {
          this.$message('请至少选择一项！')
        }
        // this.dispatch(FXPCGK_TOEXCEL, sumform).then(d => {
        //   this.$message('提交成功！')
        //   this.closeEvent()
        //   this.$emit('call:change-update')
        // })
      },
      jumpUrl(sumform) {
        window.location.href = 'http://10.146.14.66:8080/qingbaoyun-navigation/fxpcgk/baseplace/toexcel?a=' + sumform.aprop + '&b=' + sumform.btitle + '&type=' + this.type + '&title=' + this.title + '&token=' + this.userData.UserToken
      }
    },
    watch: {},
    mounted() {},
    created() {
      bus.$on('parmes', d => {
        this.querObj = JSON.stringify(d)
      })
    },
    computed: {
      ...mapState(['focusPersonAndCar'])
    }
  }

</script>
