<template>
<el-dialog v-draggable="dialogDraggableOptions" :title="dialogMode===true?'重点车辆编辑':'重点车辆注册'" :visible.sync="dialogVisible" size="bigest" @open="start">
  <el-form :model="form" label-width="120px" ref="form" :rules="rules" v-loading="dictLoading" style="background:#ebf5fc;padding-right:15px;padding-top:10px;padding-bottom:10px;margin-top:-15px;">
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="照片" prop="PhotosId">
          <div class="wrap-box__content">
            <input type="hidden" v-model="form.PhotosId" />
            <upload uploadType="picture" :isSinglePic="true" :disabled="flag" :isFormalSubmit="isFormalSubmit" @upload:submit="uploadSubmit" :currentFiles="currentFiles"></upload>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号" prop="cphm">
              <el-input placeholder="如 湘N12345" @blur="GetCarInfo()" :maxlength="50" :disabled="flag" v-model="form.cphm"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管控状态" prop="gkzt">
              <el-select placeholder="请选择管控状态" :disabled="flag" :maxlength="50" v-model="form.gkzt" style="width: 100%">
                <el-option v-for="item in gkzt" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆类型" prop="cllx">
              <el-select v-model="form.cllx" filterable disabled placeholder="请选择车辆类型" :maxlength="50" style="width: 100%">
                <el-option v-for="item in cllx" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管控等级" prop="cldj">
              <el-select v-model="form.cldj" filterable placeholder="请选择管控等级" :disabled="flag" :maxlength="50" style="width: 100%">
                <el-option v-for="item in cldj" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车主姓名" prop="czxm">
              <el-input placeholder="请输入车主姓名" :disabled="flag || ISAutoRewirte" :maxlength="50" v-model="form.czxm"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车主证件号" prop="sfzh">
              <el-input placeholder="请输入车主证件号" :disabled="flag || ISAutoRewirte" :maxlength="50" v-model="form.sfzh"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="车辆识别代码" prop="clsbm">
          <el-input :disabled="flag || (ISAutoRewirte&&form.clsbm!==null)" placeholder="请输入车辆识别代码" :maxlength="50" v-model="form.clsbm"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发动机号" prop="fdjh">
          <el-input :disabled="flag || (ISAutoRewirte&&form.clsbm!==null)" placeholder="请输入发动机号" :maxlength="50" v-model="form.fdjh"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="核定载人数" prop="hdzrs">
          <el-input-number :disabled="flag || (ISAutoRewirte&&form.clsbm!==null)" placeholder="请输入核定载人数" :min="1" :max="100000" style="width:100%" v-model="form.hdzrs"></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="品牌" prop="pp">
          <el-input :disabled="flag || (ISAutoRewirte&&form.clsbm!==null)" placeholder="请输入品牌" :maxlength="50" v-model="form.pp"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车辆型号" prop="clxh">
          <el-input :disabled="flag || (ISAutoRewirte&&form.clsbm!==null)" placeholder="请输入车辆型号" :maxlength="50" v-model="form.clxh"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车辆颜色" prop="clys">
          <el-select :disabled="flag" v-model="form.clys" filterable :maxlength="50" placeholder="请选择车辆颜色" style="width: 100%">
            <el-option v-for="(item,index) in dictList['JDCCSYSDM']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="使用性质" prop="syxz">
          <el-select :disabled="flag" v-model="form.syxz" filterable :maxlength="50" placeholder="请选择使用性质" style="width: 100%">
            <el-option v-for="item in dictList['JDCSYXZDM']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="注册时间" prop="czsj">
          <el-date-picker :disabled="flag || (ISAutoRewirte&&form.clsbm!==null)" style="width:100%" v-model="form.czsj" :maxlength="50" placeholder="注册时间"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="车型" prop="cx">
          <el-select v-model="form.cx" filterable :maxlength="50" placeholder="请选择车型" :disabled="flag" style="width: 100%">
            <el-option v-for="item in CarModel" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车辆特征" prop="cltz">
          <el-input placeholder="请输入车辆特征" :maxlength="50" v-model="form.cltz" :disabled="flag"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发证时间" prop="fzsj">
          <el-date-picker type="date" :disabled="flag" placeholder="请选择发证时间" :maxlength="50" v-model="form.fzsj" style="width:100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="采集单位" prop="cjdw">
          <el-cascader :disabled="flag" :maxlength="50" :show-all-cldjs="false" :filterable="true" v-model="form.cjdw" :options="CollectDeptList" :clearable="true" :props="{children:'children',value:'orgId',label:'name'}" :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="管辖单位" prop="gxdw">
          <el-cascader :disabled="flag" :maxlength="50" :show-all-cldjs="false" :filterable="true" v-model="form.gxdw" :options="CollectDeptList" :clearable="true" :props="{children:'children',value:'orgId',label:'name'}" :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发证机关" prop="gldw">
          <el-cascader :disabled="flag" :maxlength="50" :show-all-cldjs="false" :filterable="true" v-model="form.gldw" :options="CollectDeptList" :clearable="true" :props="{children:'children',value:'orgId',label:'name'}" :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="管控原因" prop="gkyy">
          <el-input placeholder="限制500个字符" :disabled="flag" :rows="3" :maxlength="500" type="textarea" v-model="form.gkyy"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="备注" prop="bz">
          <el-input placeholder="限制500个字符" :rows="3" :maxlength="500" type="textarea" :disabled="flag" v-model="form.bz"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>
  <div v-if="!flag" slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取消</el-button>
    <!-- <el-button @click="reset('form')">重置</el-button> -->
    <el-button type="primary" @click="submitForm('form')">确定</el-button>
  </div>
</el-dialog>
</template>

<style scoped>


</style>
<script>
  import { getTopNexus, clone } from '../../../utils/util'
  import { listToTree } from '../../../utils/listToTree'
  import upload from '../../../widgets/upload/upload.vue'
  import mixin from '../../../utils/mixin'
  import {
    FXPCGK_CASECAR_SAVE,
    FXPCGK_CASECAR_UPDATE,
    GET_FOCUS_CAR_BY_ID,
    FXPCGK_CASECAR_INFO,
    CAR_INFO,
    GET_SYS_ORG_TREE
  } from '../../../store/types'
  import { mapState } from 'vuex'
  import bus from '../../../utils/bus'
  export default {
    mixins: [mixin],
    components: {
      upload
    },
    data() {
      var validatepass = (rule, value, callback) => {
        var reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
        if (reg.test(value) === false) {
          callback(new Error('车牌号格式不正确'))
        } else {
          callback()
        }
      };
      return {
        flag: false,
        isFormalSubmit: false,
        formItem: {},
        filesObj: {},
        CollectDeptList: [],
        ruleDeptList: [],
        currentFiles: [], // 当前文件集合
        FocusType: '',
        dialogMode: false,
        dialogVisible: false,
        gkzt: [
          { label: '正常在控', value: '0' },
          { label: '取消管控', value: '1' },
          { label: '失控', value: '2' }
        ], // 管控状态，0：正常在控，1：取消管控，2：失控
        syxz: [], // 使用性质
        CarModel: [], // 车型（字典）
        oldCollectDept: [], // 管辖单位[原始列表]
        CollectDept: [], // 管辖单位[树列表]
        pp: [], // 品牌（字典）暂改输入框
        cldj: [], // 车辆管控等级（字典）
        cllx: [], // 管控车辆类型（字典）
        dictList: [],
        form: {},
        ISAutoRewirte: false,
        rules: {
          gxdw: [
            { type: 'array', required: true, message: '请选择管辖单位', trigger: 'blur' }
          ],
          CollectDept: [
            { required: true, message: '请选择采集单位', trigger: 'blur' }
          ],
          cphm: [
            { required: true, message: '请输入车牌号', trigger: 'blur' },
            { validator: validatepass, trigger: 'blur' }
          ],
          cllx: [
            { required: true, message: '选择管控车辆类型', trigger: 'blur' }
          ],
          clxh: [
            { required: true, message: '添加车辆型号', trigger: 'blur' }
          ],
          cldj: [
            { required: true, message: '选择车辆管控等级', trigger: 'blur' }
          ],
          hdzrs: [
            { type: 'number', message: '请输入数量', trigger: 'blur' }
          ],
          fdjh: [
            { required: true, message: '输入发动机号', trigger: 'blur' }
          ]
        }
      }
    },
    props: {
      dataType: {
        type: String,
        default: ''
      }
    },
    methods: {
      GetSysOrgDictTree(keyId) { // GetSysOrgList GetSysOrgTree
        this.dispatch(GET_SYS_ORG_TREE, {
          isAll: '1',
          orgId: keyId
        }).then(() => {
          this.CollectDeptList = listToTree(this.orgs.sysOrgTree, keyId, 0, {
            id: 'orgId',
            parentId: 'parentId',
            children: 'children'
          });
        })
      },
      updateCarData(id, btnType) {
        if (btnType === 'details') {
          this.flag = true
        } else {
          this.flag = false
        }
        this.reset()
        if (id) {
          this.dispatch(FXPCGK_CASECAR_INFO, { id: id }).then(d => {
            this.form = clone(this.focusCar.fxpcgkCasecarInfo)
            this.form.hdzrs = parseInt(this.form.hdzrs)
            this.form.cjdw = (this.form.cjdw || '').split(',')
            this.form.gxdw = (this.form.gxdw || '').split(',')
            this.form.gldw = (this.form.gldw || '').split(',')
            this.dialogVisible = true
          })
        }
      },
      GetCarInfo() {
        if (this.form.cphm !== '' && this.form.cphm.search(/^[u4e00-\u9fa5\]{1}[A-Z]{1}[A-Z_0-9]{5}$/) === -1) {
          /**
           * [cphm 获取重点车辆基本信息]
           * @type {[type]}
           */
          this.dispatch(CAR_INFO, { cphm: this.form.cphm }).then(d => {
            if (this.dossier.CarInfo !== null) {
              this.form.fdjh = this.dossier.CarInfo.jdcfdjddjh
              this.form.sfzh = this.dossier.CarInfo.jdcsyrsfzh
              this.form.czxm = this.dossier.CarInfo.jdcsyrxm
              this.form.czsj = this.dossier.CarInfo.ccdjrq
              this.form.clsbm = this.dossier.CarInfo.clsbdh
              this.form.fzsj = this.dossier.CarInfo.jdcxsz_hfrq
              this.form.hdzrs = this.dossier.CarInfo.jdchdzkrs
              this.form.syxz = this.dossier.CarInfo.jdcsyxzdm
              this.form.cx = this.dossier.CarInfo.jdccllxdm
              this.form.pp = this.dossier.CarInfo.zwppmc
              this.form.cx = this.dossier.CarInfo.cx
              this.form.cltz = this.dossier.CarInfo.cltz
              this.form.clys = this.dossier.CarInfo.clys
              this.form.clxh = this.dossier.CarInfo.clxh
              this.ISAutoRewirte = true
              // this.form = {
              //   cphm: this.dossier.CarInfo.jdchphm,
              //   fdjh: this.dossier.CarInfo.jdcfdjddjh, // 发动机号
              //   sfzh: this.dossier.CarInfo.jdcsyrsfzh, // 车主身份证号
              //   czxm: this.dossier.CarInfo.jdcsyrxm, // 车主姓名
              //   czsj: this.dossier.CarInfo.ccdjrq, // 注册时间
              //   clsbm: this.dossier.CarInfo.clsbdh, // 车辆识别代码
              //   fzsj: this.dossier.CarInfo.jdcxsz_hfrq, // 发证时间
              //   hdzrs: this.dossier.CarInfo.jdchdzkrs, // 核定载人数
              //   syxz: this.dossier.CarInfo.jdcsyxzdm, // 使用性质
              //   CarModel: this.dossier.CarInfo.jdccllxdm, // 车型
              //   pp: this.dossier.CarInfo.zwppmc, // 品牌
              //   cx: this.cx, // 车辆型号
              //   cltz: this.cltz, // 车辆特征
              //   clys: this.clys, // 车身颜色
              //   gldw: this.gldw // 发证机关
              // }
            }
          })
        } else {
          this.ISAutoRewirte = false
        }
      },
      start() {
        /**
         * 获取字典列表
         */
        if (this.syxz.length === 0) {
          /**
           * [getCascaderDict 获取单位列表]
           *
           * @return {[d[0]]} [原始数据列表]
           * @return {[d[1]]} [树列表]
           */
          /**
           * [d 管辖单位列表]
           * @type {[type]}
           */
          this.ruleDeptList = this.users.UserLogin.UserData.UserDept.map(c => {
            return {
              label: c.DeptName,
              value: c.KeyId,
              code: c.ParentId
            }
          })
          /**
           * [res 系统通用字典]
           * @type {[type]}
           */
          this.getDict(['ZDGKDJ', 'ZDCLLX', 'JDCCX', 'JDCSYXZDM', 'JDCCSYSDM']).then(res => {
            this.cldj = res['ZDGKDJ'] // 车辆管控等级
            this.cllx = res['ZDCLLX'] // 重点车辆类型
            this.CarModel = res['JDCCX'] // 车型
            this.syxz = res['JDCSYXZDM'] // 使用性质
            this.dictList = res
          })
        }
        this.form.CollectDept = this.userOrgInfo.mainOrg.DeptNo
        this.currentFiles = [];
      },
      /**
       * 重置表单
       */
      reset() {
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
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
          this.form.PhotosId = _fileIdArray.join()
        }
      },
      /**
       * [handleAdd 新增]
       * @return {[type]} [description]
       */
      handleAdd(type) {
        this.reset()
        this.FocusType = type
        this.dialogMode = false
        this.form = {
          cphm: '', // 车牌号
          fdjh: '', // 发动机号
          sfzh: '', // 车主身份证号
          czxm: '', // 车主姓名
          czsj: '', // 注册时间
          clsbm: '', // 车辆识别代码
          fzsj: '', // 发证时间
          BelongCompany: '', // 归属企业
          gkyy: '', // 管控事由
          bz: '', // 备注
          hdzrs: '', // 核定载人数
          PhotosId: '', // 车辆照片，多个用逗号分隔
          gkzt: '0', // 管控状态
          syxz: '', // 使用性质
          CarModel: '', // 车型
          cjdw: [], // 采集单位
          GxDept: [], // 管辖单位
          gxdw: [], // 管辖单位[选中列表]
          pp: '', // 品牌
          cldj: '3', // 车辆管控等级
          cllxName: '', // 车辆类型名称
          cldjName: '', // 车辆等级名称
          cllx: this.FocusType, // 管控车辆类型
          cx: this.cx, // 车辆型号
          cltz: this.cltz, // 车辆特征
          clys: this.clys, // 车身颜色
          gldw: [] // 发证机关
        }
        this.dialogVisible = true
      },
      submitForm(d) {
        this.$refs[d].validate(v => {
          if (v) {
            /**
             * [附件上传 description]
             * @param  {[type]} this [description]
             * @return {[type]}      [description]
             */
            // 确认提交[附件]
            if (this.currentFiles.length <= 0) {
              this.form.PhotosId = '' // 重置上传文件id
            }
            let submitObj = clone(this.form)
            try {
              submitObj.czsj = this.dateFormat(this.form.czsj, 'yyyy-MM-dd hh:mm:ss') // 注册时间
              submitObj.fzsj = this.dateFormat(this.form.fzsj, 'yyyy-MM-dd hh:mm:ss') // 发证时间
            } catch (e) {
              console.log('时间转换失败' + e);
            }
            submitObj.cjdw = this.form.cjdw.join(',') // 采集单位
            submitObj.gxdw = this.form.gxdw.join(',') // 管辖单位
            submitObj.gldw = this.form.gldw.join(',') // 发证机关
            if (this.form.id) {
              this.dispatch(FXPCGK_CASECAR_UPDATE, submitObj).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            } else {
              this.dispatch(FXPCGK_CASECAR_SAVE, {
                cphm: this.form.cphm, // 车牌号
                fdjh: this.form.fdjh, // 发动机号
                sfzh: this.form.sfzh, // 车主身份证号
                czxm: this.form.czxm, // 车主姓名
                czsj: submitObj.czsj, // 注册时间
                clsbm: this.form.clsbm, // 车辆识别代码
                fzsj: submitObj.fzsj, // 发证时间
                gsqy: this.form.gkqy, // 归属企业
                gkyy: this.form.gkyy, // 管控原因
                bz: this.form.bz, // 备注
                hdzrs: this.form.hdzrs, // 核定载人数
                clxp: this.form.PhotosId, // 车辆照片，多个用逗号分隔
                clxh: this.form.clxh, // 车辆照片，多个用逗号分隔
                gkzt: this.form.gkzt, // 管控状态
                syxz: this.form.syxz, // 使用性质
                cjdw: submitObj.cjdw, // 采集单位
                gxdw: submitObj.gxdw, // 管辖单位[选中列表]
                pp: this.form.pp, // 品牌
                cldj: this.form.cldj, // 车辆管控等级
                cllx: this.form.cllx, // 管控车辆类型
                cx: this.form.cx, // 车辆型号
                cltz: this.form.cltz, // 车辆特征
                clys: this.form.clys, // 车身颜色
                gldw: submitObj.gldw // 发证机关
              }).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            }
          } else {
            return false
          }
        })
      }
    },
    watch: {},
    mounted() {},
    created() {
      this.GetSysOrgDictTree('430000000000')
      bus.$on('add', d => {
        this.flag = d
      })
      bus.$on('control.addHandle', data => {
        this.reset()
        this.FocusType = data
        this.dialogMode = false
        this.form = {
          cphm: '', // 车牌号
          fdjh: '', // 发动机号
          sfzh: '', // 车主身份证号
          czxm: '', // 车主姓名
          czsj: '', // 注册时间
          clsbm: '', // 车辆识别代码
          fzsj: '', // 发证时间
          BelongCompany: '', // 归属企业
          gkyy: '', // 管控原因
          bz: '', // 备注
          hdzrs: '', // 核定载人数
          PhotosId: '', // 车辆照片，多个用逗号分隔
          gkzt: '0', // 管控状态
          syxz: '', // 使用性质
          CarModel: '', // 车型
          cjdw: [], // 采集单位
          GxDept: [], // 管辖单位
          gxdw: [], // 管辖单位[选中列表]
          pp: '', // 品牌
          cldj: '3', // 车辆管控等级
          cllxName: '', // 车辆类型名称
          cldjName: '', // 车辆等级名称
          cllx: this.FocusType, // 管控车辆类型
          cx: this.cx, // 车辆型号
          cltz: this.cltz, // 车辆特征
          clys: this.clys, // 车身颜色
          gldw: [] // 发证机关
        }
        this.dialogVisible = true
      })
      bus.$on('control.updateHandleCar', data => {
        this.dialogMode = true
        this.dispatch(GET_FOCUS_CAR_BY_ID, {
          KeyId: data
        }).then(d => {
          this.form = { ...this.focusCar.Model }
          if (this.form.PhotosId !== null && this.form.PhotosId !== '') {
            this.currentFiles = [{
              name: this.form.RyName,
              id: this.form.PhotosId
            }]
          } else {
            this.currentFiles = []
          }
          this.form.gxdw = getTopNexus(this.orgs.orgByCurryOrg, this.form.GxDept, {
            id: 'orgId',
            children: 'children',
            parentId: 'parentId'
          });
        }).catch(r => {
          this.currentFiles = []
        })
        this.dialogVisible = true
      })
    },
    computed: {
      ...mapState(['dict', 'focusCar', 'dossier',
        'users', 'orgs'
      ])
    }
  }

</script>
