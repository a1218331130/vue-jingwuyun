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

  <form ref="postform" method="post" :action="rod+'uav/'+sUrl+'/toexcel'">
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
        sUrl: '',
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
        if (this.type === 'WRJ001004') {
          this.sUrl = 'hobbyer'
          this.formData = [{ prop: 'XSSMC', label: '姓名' },
            { prop: 'SSSZMC', label: '所属市州' },
            { prop: 'GSDJSJ', label: '拥有无人机情况（台数）' },
            { prop: 'FADB', label: '参训情况' },
            { prop: 'FASFZ', label: '证件期限' },
            { prop: 'LXFS', label: '联系方式' },
            { prop: 'SYCN', label: '无人机合法使用承诺情况' },
            { prop: 'XXDZ', label: '备注' },
            { prop: 'DJRXM', label: '登记人' },
            { prop: 'DJDWMC', label: '登记单位' },
            { prop: 'DJSJ', label: '登记时间' },
            { prop: 'SFPC', label: '是否排查' },
            { prop: 'PCSJ', label: '排查时间' },
            { prop: 'SFYYH', label: '是否有隐患' },
            { prop: 'SFZX', label: '是否注销' }
          ]
        } else if (this.type === 'WRJ001003') {
          this.sUrl = 'training'
          this.formData = [{ prop: 'XSSMC', label: '培训机构名称' },
            { prop: 'SSSZMC', label: '所属市州' },
            { prop: 'GSDJSJ', label: '工商登记时间' },
            { prop: 'FADB', label: '法人/责任人' },
            { prop: 'FASFZ', label: '法人/责任人身份证' },
            { prop: 'LXFS', label: '联系方式' },
            { prop: 'XXDZ', label: '培训机构详细地址' },
            { prop: 'SQFW', label: '授权范围' },
            { prop: 'SQQK', label: '授权情况' },
            { prop: 'BZ1', label: '备注' },
            { prop: 'DJRXM', label: '登记人' },
            { prop: 'DJDWMC', label: '登记单位' },
            { prop: 'DJSJ', label: '登记时间' },
            { prop: 'SFPC', label: '是否排查' },
            { prop: 'SFYYH', label: '是否有隐患' },
            { prop: 'SFZX', label: '是否注销' }
          ]
        } else if (this.type === 'WRJ001005') {
          this.sUrl = 'production'
          this.formData = [{ prop: 'WRJPP', label: '无人机品牌' },
            { prop: 'WRJXH', label: '无人机型号' },
            { prop: 'SZDW', label: '所在单位' },
            { prop: 'XM', label: '姓名' },
            { prop: 'LXDH', label: '联系电话' },
            { prop: 'SSSZMC', label: '所属市州' },
            { prop: 'YYWRJSL', label: '拥有无人机情况（台数）' },
            { prop: 'CXQK', label: '参训情况' },
            { prop: 'ZJQX', label: '证件期限' },
            { prop: 'CNQK', label: '无人机合法使用承诺情况' },
            { prop: 'DWMC', label: '单位名称' },
            { prop: 'ZRR', label: '责任人' },
            { prop: 'LXFS', label: '联系方式' },
            { prop: 'DWSYCN', label: '单位无人机合法使用承诺情况' },
            { prop: 'DJRXM', label: '登记人' },
            { prop: 'DJDWMC', label: '登记单位' },
            { prop: 'DJSJ', label: '登记时间' },
            { prop: 'BZ1', label: '备注' },
            { prop: 'SFYYH', label: '是否有隐患' },
            { prop: 'SFZX', label: '是否注销' }
          ]
        } else if (this.type === 'WRJ001001') {
          this.sUrl = 'manufacturer'
          this.formData = [{ prop: 'SCCJMC', label: '生产厂家名称' },
            { prop: 'SCCJDZ', label: '生产厂家地址' },
            { prop: 'SSSZMC', label: '所属市州' },
            { prop: 'GSDJSJ', label: '工商登记时间' },
            { prop: 'FADB', label: '法人/责任人' },
            { prop: 'FASFZ', label: '法人/责任人身份证' },
            { prop: 'LXFW', label: '联系方式' },
            { prop: 'JYFW', label: '经营范围' },
            { prop: 'SCZK', label: '截至目前生产状况（数量）' },
            { prop: 'BZ1', label: '备注' },
            { prop: 'DJRXM', label: '登记人' },
            { prop: 'DJSJ', label: '登记时间' },
            { prop: 'DJDWMC', label: '登记单位' },
            { prop: 'SFYYH', label: '是否有隐患' },
            { prop: 'SFZX', label: '是否注销' }
          ]
        } else {
          this.sUrl = 'seller'
          this.formData = [{ prop: 'XSSMC', label: '销售商名称' },
            { prop: 'SSSZMC', label: '所属市州' },
            { prop: 'GSDJSJ', label: '工商登记时间' },
            { prop: 'FADB', label: '法人/责任人' },
            { prop: 'FASFZ', label: '法人/责任人身份证' },
            { prop: 'LXFS', label: '联系方式' },
            { prop: 'XXDZ', label: '销售商详细地址' },
            { prop: 'JYFW', label: '经营范围' },
            { prop: 'SCZK', label: '截至目前生成情况（数量）' },
            { prop: 'BZ1', label: '备注' },
            { prop: 'DJRXM', label: '登记人' },
            { prop: 'DJDWMC', label: '登记单位' },
            { prop: 'DJSJ', label: '登记时间' },
            { prop: 'SFYYH', label: '是否有隐患' },
            { prop: 'SFZX', label: '是否注销' }
          ]
        }
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
            this.$refs['postform'].submit(function(e) {
              this.downloading = false
            });
          })
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
        window.location.href = 'http://10.146.14.66:8080/qingbaoyun-navigation/uav/' + this.sUrl + '/toexcel?a=' + sumform.aprop + '&b=' + sumform.btitle + '&type=' + this.type + '&title=' + this.title + '&token=' + this.userData.UserToken
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
