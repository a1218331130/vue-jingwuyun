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
  <form ref="postform" method="post" :action="rod+'fxpcgk/casecar/toexcel'">
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
        formProp: [],
        form: { aprop: [], btitle: [] },
        formData: [{ prop: 'XM', label: '姓名' },
          { prop: 'SFZ', label: '身份证' },
          { prop: 'LXDH', label: '联系电话' },
          { prop: 'MZMC', label: '民族' },
          { prop: 'XBMC', label: '性别' },
          { prop: 'RQLBMC', label: '人群类别' },
          { prop: 'GJMC', label: '国籍' },
          { prop: 'ZZMMMC', label: '政治面貌' },
          { prop: 'ZJXYMC', label: '宗教信仰' },
          { prop: 'CSRQ', label: '出生日期' },
          { prop: 'CYM', label: '曾用名' },
          { prop: 'BMCH', label: '别名绰号' },
          { prop: 'WWXM', label: '外文姓名' },
          { prop: 'SFZYMC', label: '身份/职业' },
          { prop: 'WHCDMC', label: '文化程度' },
          { prop: 'BYSJ', label: '毕业时间' },
          { prop: 'BYYX', label: '毕业院校' },
          { prop: 'FFCS', label: '服务场所' },
          { prop: 'FCSDZ', label: '场所地址' },
          { prop: 'ZWZWMC', label: '职务/职位' },
          { prop: 'ZYJJLY', label: '主要经济来源' },
          { prop: 'JSZZQK', label: '接受资助情况' },
          { prop: 'ZWXX', label: '指纹信息' },
          { prop: 'DNAXX', label: 'DNA信息' },
          { prop: 'TMTZ', label: '体貌特征' },
          { prop: 'TCSH', label: '特长嗜好' },
          { prop: 'JWZS', label: '境外住所' },
          { prop: 'HZDQHMC', label: '户籍地区划' },
          { prop: 'HZDXZ', label: '户籍地详址' },
          { prop: 'XZZHQMC', label: '现住址区划' },
          { prop: 'XZZXZ', label: '现住址详址' },
          { prop: 'ZPXX', label: '照片信息' },
          { prop: 'FXDJMC', label: '风险等级' },
          // { prop:'SFYYH', label:'是否有隐患' },
          // { prop:'SFPCDJ', label:'是否排查' },
          // { prop:'PCDJSJ', label:'排查时间' },
          // { prop:'SFZX', label:'是否注销' },
          // { prop:'ZXSJ', label:'注销时间' },
          // { prop:'ZXR', label:'注销人' },
          { prop: 'GHLXDH', label: '联系电话(固话)' },
          { prop: 'ZJLXMC', label: '证件类型' },
          { prop: 'LXFS', label: '联系方式' },
          { prop: 'RYDJMC', label: '人员等级' },
          // { prop:'SJLY', label:'数据来源' },
          // { prop:'PCR', label:'排查人ID' },
          { prop: 'CJRDWMC', label: '登记单位' },
          { prop: 'CJRXM', label: '登记人' },
          { prop: 't.CJSJ', label: '登记时间' },
          // { prop:'BKZT', label:'布控状态 0未布控  1待审核  2进行中' },
          // { prop:'BKID', label:'布控ID' },
          // { prop:'CJJH', label:'创建人 登记人 警号' },
          // { prop:'PCDW', label:'排查单位 ID' },
          // { prop:'XGDW', label:'修改单位 ID' },
          // { prop:'SPSJ', label:'审批时间' },
          // { prop:'SPYJ', label:'审批意见' },
          // { prop:'LCID', label:'流程ID' },
          // { prop:'SPZT', label:'审批状态' },
          // { prop:'SPR', label:'审批人' },
          { prop: 'GKYY', label: '管控原因' }
        ]
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
        this.formData = [{ prop: 'CPHM', label: '车牌号' },
          { prop: 'FDJH', label: '发动机号' },
          { prop: 'SFZH', label: '身份证号' },
          { prop: 'CZXM', label: '车主姓名' },
          { prop: 'GLDWMC', label: '发证机关' },
          { prop: 'CLSBM', label: '车辆识别代码' },
          { prop: 'SYXZMC', label: '使用性质' },
          { prop: 'PP', label: '品牌' },
          { prop: 'CXMC', label: '车型' },
          { prop: 'CZSJ', label: '注册时间' },
          { prop: 'FZSJ', label: '发证时间' },
          { prop: 'GSQY', label: '归属企业' },
          { prop: 'CLDJMC', label: '车辆管控等级' },
          { prop: 'GKSY', label: '管控事由' },
          { prop: 'BZ', label: '备注' },
          { prop: 'CJDWMC', label: '采集单位' },
          { prop: 'HDZRS', label: '核定载人数' },
          { prop: 'CLXH', label: '车辆型号' },
          { prop: 'CLYSMC', label: '车辆颜色' },
          { prop: 'CLTZ', label: '车辆特征' },
          { prop: 'GXDWMC', label: '管辖单位' },
          // { prop: 'SFYYH', label: '是否有隐患' },
          // { prop: 'SFPC', label: '是否排查' },
          { prop: 'DJRXM', label: '登记人' },
          { prop: 'DJDWMC', label: '登记单位' },
          { prop: 'DJSJ', label: '登记时间' },
          { prop: 'SFZX', label: '是否注销' }
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
        window.location.href = 'http://10.146.14.66:8080/qingbaoyun-navigation/fxpcgk/casecar/toexcel?a=' + sumform.aprop + '&b=' + sumform.btitle + '&type=' + this.type + '&title=' + this.title + '&token=' + this.userData.UserToken
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
