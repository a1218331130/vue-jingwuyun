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
  <form ref="postform" method="post" :action="rod+'fxpcgk/zdqtry/toexcel'">
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
  import mixin from '../../../../utils/mixin'
  import bus from '../../../../utils/bus'
  import { clone } from '../../../../utils/util'
  // import { FXPCGK_TOEXCEL } from'../../../../store/types'
  import {
    FWZX_PATH
  } from '../../../../config'
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
        ],
        workform: [{ prop: 'GKJB', label: '管控级别' },
          { prop: 'WHPG', label: '危害评估' },
          { prop: 'GKCS', label: '管控措施' },
          { prop: 'GZZS', label: '工作抓手' },
          { prop: 'ZKDWMC', label: '主控单位' },
          { prop: 'ZKZRMJXM', label: '责任民警' },
          { prop: 'ZKLXFS', label: '联系方式' },
          { prop: 'XKDWMC', label: '协控单位' },
          { prop: 'XKZRMJXM', label: '责任民警' },
          { prop: 'XKLXFS', label: '联系方式' }
        ],
        policeform: [{ prop: 'JBSQ', label: '基本诉求' },
          { prop: 'BLQK', label: '办理情况' },
          { prop: 'XSCF', label: '是否受过刑事处罚' },
          { prop: 'XZCF', label: '是否受过行政处罚' },
          // { prop:'GJFDD', label:'过激访地点' },
          // { prop:'GJFXW', label:'过激访行为' },
          { prop: 'XGPZ', label: '性格是否偏执' },
          { prop: 'GDSR', label: '是否有固定收入来源' },
          { prop: 'SFZK', label: '是否在控' },
          { prop: 'HJZRDWMC', label: '化解责任单位' },
          { prop: 'HJZRBMMC', label: '化解责任警种部门' },
          { prop: 'WKZRDWMC', label: '稳控责任单位' },
          { prop: 'WKZRBMMC', label: '稳控责任警种部门' },
          { prop: 'WKZRLD', label: '稳控责任领导及职务' },
          { prop: 'WKZRMJ', label: '稳控责任民警及职务' },
          { prop: 'SFCG', label: '是否撤管' }
        ],
        unnormalform: [{ prop: 'GKQKMC', label: '管控情况' },
          { prop: 'GKDJMC', label: '管控等级' },
          { prop: 'ZRRXM', label: '责任人' },
          { prop: 'ZRDWMC', label: '责任单位' },
          { prop: 'ZRRLXFS', label: '责任人联系方式' },
          { prop: 'LGSY', label: '列管事由' },
          { prop: 'GKCS', label: '管控措施' }
        ],
        trafficform: [{ prop: 'DWHDZ', label: '单位或地址' },
          { prop: 'XFFSMC', label: '信访方式' },
          { prop: 'XFSJ', label: '信访时间' },
          { prop: 'XFLXMC', label: '信访类型' },
          { prop: 'CBBM', label: '承办部门' },
          { prop: 'XFGZJDMC', label: '信访工作阶段' },
          { prop: 'BLJLMC', label: '办理结论' },
          { prop: 'BJSJ', label: '办结时间' },
          { prop: 'SFCF', label: '是否重访' },
          { prop: 'JTSGJBQK', label: '交通事故基本情况' },
          { prop: 'XFSQ', label: '信访诉求' },
          { prop: 'XFTCQK', label: '信访事项调查情况结论' },
          // { prop:'DBQK', label:'督办情况（多选，字典）' },
          { prop: 'WKCS', label: '目前采取的稳控措施' }
        ],
        economicform: [{ prop: 'JCJZDZ', label: '经常居住地址' },
          { prop: 'AJLBMC', label: '案件类别' },
          { prop: 'BADWMC', label: '办案单位' },
          { prop: 'ZBMJXM', label: '主办民警' },
          { prop: 'ZBMJDH', label: '主办民警电话' },
          { prop: 'SSAJ', label: '所涉案件' },
          { prop: 'SAJYQK', label: '涉案简要情况' }
        ],
        soldiersfrom: [{ prop: 'SFYY', label: '上访原因' },
          { prop: 'SFSQ', label: '上访诉求' }
        ],
        drugform: [{ prop: 'GKDWMC', label: '管控单位' },
          { prop: 'ZRMJXM', label: '责任民警' },
          { prop: 'LXFS', label: '联系方式' },
          { prop: 'XKDWMC', label: '协控单位' },
          { prop: 'XKZRMJXM', label: '协控责任民警' },
          { prop: 'XKLXFS', label: '联系方式' },
          { prop: 'PGYJMC', label: '评估依据' }
        ],
        extform: [{ prop: 'WKFSMC', label: '稳控方式' },
          { prop: 'SFSSZB', label: '是否实施准备' },
          { prop: 'SKYYMC', label: '失控原因' },
          { prop: 'ZKZTMC', label: '在控状态' }
        ],
        spiform: [{ prop: 'JHRSFZH', label: '监护人身份证号' },
          { prop: 'JHRXM', label: '监护人姓名' },
          { prop: 'JHRDH', label: '监护人电话' },
          { prop: 'SFLRQGZX', label: '是否录入全国重性精神病人系统' },
          { prop: 'HZZTMC', label: '患者状态' },
          { prop: 'JHQKMC', label: '监护情况' },
          { prop: 'DBQKMC', label: '低保情况' },
          { prop: 'YBQKMC', label: '医保情况' },
          { prop: 'JHJLJFMC', label: '监护奖励' },
          { prop: 'FYQKMC', label: '服药情况' },
          { prop: 'JQFB', label: '最近三个月是否发病' }
        ],
        masterform: [
          { prop: 'AJMC', label: '案件名称' },
          { prop: 'AJLB', label: '案件类别' },
          { prop: 'LADW', label: '立案单位' },
          { prop: 'JYAQ', label: '简要案情' },
          { prop: 'ZHZTMC', label: '抓获状态' }
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
        this.formData = [{ prop: 'XM', label: '姓名' },
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
          { prop: 'GHLXDH', label: '联系电话(固话)' },
          { prop: 'ZJLXMC', label: '证件类型' },
          { prop: 'LXFS', label: '联系方式' },
          { prop: 'RYDJMC', label: '人员等级' },
          { prop: 'CJRDWMC', label: '登记单位' },
          { prop: 'CJRXM', label: '登记人' },
          { prop: 't.CJSJ', label: '登记时间' },
          { prop: 'GKYY', label: '管控原因' }
        ]
        this.form = { aprop: [], btitle: [] }
        // this.form.KeyId = this.keyId
        this.formData.forEach(d => {
          this.formProp.push(d.prop)
        })
        if (this.type === 'RQ003010') {
          this.policeform.forEach(d => {
            this.formData.push(d)
            this.formProp.push(d.prop)
          })
        } else if (this.type === 'RQ003011') {
          this.unnormalform.forEach(d => {
            this.formData.push(d)
            this.formProp.push(d.prop)
          })
        } else if (this.type === 'RQ003012') {
          this.trafficform.forEach(d => {
            this.formData.push(d)
            this.formProp.push(d.prop)
          })
        } else if (this.type === 'RQ003014') {
          this.economicform.forEach(d => {
            this.formData.push(d)
            this.formProp.push(d.prop)
          })
        } else if (this.type === 'RQ004009') {
          this.soldiersfrom.forEach(d => {
            this.formData.push(d)
            this.formProp.push(d.prop)
          })
        } else if (this.type === 'RQ005001' || this.type === 'RQ005002') {
          this.drugform.forEach(d => {
            this.formData.push(d)
            this.formProp.push(d.prop)
          })
        } else if (this.type === 'RQ006001') {
          this.extform.forEach(d => {
            this.formData.push(d)
            this.formProp.push(d.prop)
          })
        } else if (this.type === 'RQ006002') {
          this.spiform.forEach(d => {
            this.formData.push(d)
            this.formProp.push(d.prop)
          })
        } else if (this.type === 'RQ006003') {
          this.masterform.forEach(d => {
            this.formData.push(d)
            this.formProp.push(d.prop)
          })
        } else {
          this.workform.forEach(d => {
            this.formData.push(d)
            this.formProp.push(d.prop)
          })
        }
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
        window.location.href = 'http://10.146.92.42:8888/qingbaoyun-navigation/fxpcgk/zdqtry/toexcel?a=' + sumform.aprop + '&b=' + sumform.btitle + '&type=' + this.type + '&title=' + this.title + '&token=' + this.userData.UserToken
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
