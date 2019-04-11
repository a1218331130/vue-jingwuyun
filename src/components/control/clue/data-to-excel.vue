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
  <form ref="postform" method="post" :action="rod+'fxpcgk/clue/toexcel'">
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
  import bus from '../../../utils/bus'
  import { clone } from '../../../utils/util'
  // import { FXPCGK_TOEXCEL } from'../../../../store/types'
  import {
    FWZX_PATH
  } from '../../../config'
  import { mapState } from 'vuex'
  export default {
    mixins: [mixin],
    components: { clone },
    data() {
      return {
        indeterminated: false,
        checkAll: false,
        downloading: false,
        checkt: false,
        a: '',
        b: '',
        querObj: null,
        formProp: [],
        form: { aprop: [], btitle: [] },
        formData: [],
        rod: FWZX_PATH
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
        this.formData = [{ prop: 'BT', label: '标题' },
          { prop: 'XXZLMC', label: '信息种类' },
          { prop: 'XXLYMC', label: '信息来源' },
          { prop: 'XXZSXMC', label: '信息真实性' },
          { prop: 'XXYJXMC', label: '信息预警性' },
          { prop: 'SJSJ', label: '涉及事件' },
          { prop: 'ZDZTMC', label: '针对主体' },
          { prop: 'SHXXRXM', label: '首获信息人' },
          { prop: 'SHDWMC', label: '首获单位' },
          { prop: 'FSDY', label: '发生地域' },
          { prop: 'XXSHSJ', label: '信息首获时间' },
          { prop: 'XXNR', label: '信息内容' },
          { prop: 'CPPGJG', label: '初步评估可能造成危害结果' },
          { prop: 'XXBQ', label: '信息标签' },
          { prop: 'SFSJSX', label: '发生时间上线' },
          { prop: 'SFSJXX', label: '发生时间下线' },
          { prop: 'SJBQ', label: '时间标签' },
          { prop: 'FSXZ', label: '发生详址' },
          { prop: 'GXDWMC', label: '管辖单位' },
          { prop: 'GXJZ', label: '管辖警种' },
          { prop: 'DJSJ', label: '登记时间' },
          { prop: 'XXKKXMC', label: '信息可靠性' },
          { prop: 'SFYYH', label: '是否有隐患' },
          { prop: 'SFZX', label: '是否注销' },
          { prop: 'CJRXM', label: '登记人' },
          { prop: 'CJDWMC', label: '登记单位' }
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
          // if (this.$refs.docDownForm) this.$refs.docDownForm.submit()
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
        window.location.href = 'http://10.146.14.66:8080/qingbaoyun-navigation/fxpcgk/clue/toexcel?a=' + sumform.aprop + '&b=' + sumform.btitle + '&type=' + this.type + '&title=' + this.title + '&token=' + this.userData.UserToken
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
