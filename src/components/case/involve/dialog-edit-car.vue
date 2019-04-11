<template>
<el-dialog class="title-icon-edit" v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="(isdetail?'':(data===null?'新增':'编辑'))+'车辆'" :modal-append-to-body="true" :append-to-body="true" :size="dialogLevel === 2?'bigest':'middle--fixed'" :modal="dialogLevel === 2?false:true"
  :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-form ref="peopleFormRef" :rules="peopleFormRules" :model="form" label-width="130px">
    <!-- 车辆id 插槽 -->
    <input v-model="form.id" type="hidden"></input>
    <!-- 编辑物品 -->
    <el-row v-if="!isdetail" class="form-box" :gutter="5">
      <el-row>
        <el-col :span="12">
          <el-form-item label="车辆图片" prop="carImageId">
            <input type="hidden" v-model="form.carImageId" />
            <upload uploadType="picture" :isSinglePic="true" :isFormalSubmit="isFormalSubmit" @upload:submit="uploadSubmit" :currentFiles="currentFiles"></upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车牌号" prop="plateNumber">
            <el-input v-model="form.plateNumber" placeholder="车牌号(10个字符内)" :maxlength="10" @blur="hanldCarNumber(form.plateNumber)"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="驾驶员姓名" prop="name">
            <el-input v-model="form.name" placeholder="驾驶员姓名(50个字符内)" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="涉案描述" prop="pilotDescribe">
            <el-input v-model="form.pilotDescribe" placeholder="涉案描述(100个字符内)" :maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆描述" prop="carDescribe">
            <el-input v-model="form.carDescribe" placeholder="车辆描述(100个字符内)" :maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="涉案类型" prop="involvedType">
            <el-select v-model="form.involvedType" style="width:100%;">
              <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in involvedTypeList"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆颜色" prop="carColor">
            <el-select v-model="form.carColor" style="width:100%;">
              <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in carColorList"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机动车状态" prop="detainState">
            <el-select v-model="form.detainState" style="width:100%;">
              <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in detainStateList"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="驾驶员性别" prop="sex">
            <el-radio-group v-model="form.sex">
              <el-radio label="0">未知</el-radio>
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="驾驶员体貌特征" prop="aspectFeature">
            <el-input type="textarea" v-model="form.aspectFeature" placeholder="描述限制50个字符" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="车辆特征" prop="carFeature">
            <el-input type="textarea" v-model="form.carFeature" placeholder="描述限制50个字符" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-row>
    <!-- 车辆信息 -->
    <el-row v-else class="form-box" :gutter="5">

      <el-row>
        <el-col :span="12">
          <img :src="form.carImageUrl" v-if="form.carImageUrl">
          <img src="/static/img/car.jpg" v-if="!form.carImageUrl">
        </el-col>
        <el-col :span="12">
          <el-form-item label="车牌号" prop="plateNumber">
            <span class="hover-menu" data-type="car">{{form.plateNumber}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="涉案类型" prop="involvedType">
            {{form.involvedType}}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="扣押情况" prop="detainState">
            {{form.detainState}}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="车辆描述" prop="carDescribe">
            {{form.carDescribe}}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="车辆型号" prop="carModel">
            {{form.carModel}}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="车辆颜色" prop="carColor">
            {{form.carColor}}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="车辆特征" prop="carFeature">
            {{form.carFeature}}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="车主姓名" prop="ownerName">
            {{form.ownerName}}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="车主身份证" prop="ownerIdCard">
            {{form.ownerIdCard}}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="车主出生日期" prop="ownerAge">
            {{form.ownerAge}}
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="车主现住址" prop="ownerNowAddress">
            {{form.ownerNowAddress}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="驾驶员姓名" prop="name">
            {{form.name}}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="驾驶员性别" prop="sex">
            {{form.sex}}
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="驾驶员体貌特征" prop="aspectFeature">
            {{form.aspectFeature}}
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="涉案描述" prop="pilotDescribe">
            {{form.pilotDescribe}}
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <span class="edit-button iconfont icon-jingbao" @click="control">{{form.controlState === "1"?'布控结果 ':'申请布控'}}<i class="resCount" v-if="form.controlState==='1'">{{form.controlCount}}</i></span>
          <span class="edit-button iconfont icon-jingbao" v-if="form.controlState ==='1'" @click="cancelControl">取消布控</span>
        </el-col>
      </el-row>
    </el-row>
  </el-form>

  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit" v-if="!isdetail" :disabled="loading">确定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
  .form-box {
    position: relative;
    img {
      width: auto;
      height: 150px;
      max-width: 100%;
    }
    .edit-button {
      // border: 1px solid #ccc;
      display: inline-block;
      font-size: 14px;
      padding: 5px;
      text-align: center;
      color: #fff;
      background-color: rgb(255, 153, 0);
      cursor: pointer;
      .resCount {
        color: red;
      }
    }
  }

</style>
<script>
  import { DOWNLOAD_FILE_PATH } from '../../../config'
  import { mapState } from 'vuex'
  import { GET_SYS_DICT_BY_TYPE, CAR_INFO_SB } from '../../../store/types'
  import mixin from '../../../utils/mixin'
  import upload from '../../../widgets/upload/upload.vue'
  import { clone } from '../../../utils/util'
  export default {
    mixins: [mixin],
    components: {
      upload
    },
    data() {
      return {
        // 图片上传
        isFormalSubmit: false,
        currentFiles: [], // 当前文件集合
        // 表单验证
        peopleFormRules: {
          plateNumber: [{ required: true, message: '车牌号不能为空' }],
          involvedType: [{ required: true, message: '涉案类型不能为空' }],
          detainState: [{ required: true, message: '扣押情况不能为空' }],
          sex: [{ required: true, message: '驾驶员性别不能为空' }]
        },
        model: {
          id: '',
          plateNumber: '',
          name: '',
          pilotDescribe: '',
          carDescribe: '',
          involvedType: '',
          detainState: '',
          carColor: '',
          sex: '0',
          aspectFeature: '',
          carFeature: '',
          carImageUrl: '', // 车辆图片路径
          carModel: '', // 车辆型号
          ownerName: '', // 车主姓名
          ownerIdCard: '', // 车主身份证号
          ownerAge: '', // 车主年龄
          ownerNowAddress: '', // 车主现住址
          ownerLicenceType: '', // 车主驾照类型
          ownerLicenceNumber: '' // 车主驾照编号
        },
        form: {
          id: '',
          plateNumber: '',
          name: '',
          pilotDescribe: '',
          carDescribe: '',
          involvedType: '',
          detainState: '',
          carColor: '',
          sex: '0',
          aspectFeature: '',
          carFeature: '',
          carImageUrl: '', // 车辆图片路径
          carModel: '', // 车辆型号
          ownerName: '', // 车主姓名
          ownerIdCard: '', // 车主身份证号
          ownerAge: '', // 车主年龄
          ownerNowAddress: '', // 车主现住址
          ownerLicenceType: '', // 车主驾照类型
          ownerLicenceNumber: '' // 车主驾照编号
        },
        involvedTypeList: {}, // 涉案类型选项
        carColorList: {}, // 车辆颜色选项
        detainStateList: {} // 扣押情况选项
      }
    },
    props: ['dialog', 'data', 'isdetail', 'dialogLevel', 'mode'],
    computed: {
      ...mapState(['dict', 'dossier'])
    },
    methods: {
      initDialog() {
        this.reset()
        if (this.mode === 'add' && !this.isdetail) {
          this.form = clone(this.model);
        } else if (this.data !== null && this.mode === 'edit') {
          this.form = clone(this.data)
          if (this.form.carImageId) {
            this.form.carImageUrl = DOWNLOAD_FILE_PATH + this.form.carImageId
            this.currentFiles = [{ name: '车辆图片', id: this.form.carImageId }]
          }
        } else if (this.mode === 'add' && this.isdetail) {
          console.log(this.data, 'data')
          this.form = clone(this.data)
        }
      },
      queryCluesTypeList() {
        // 取字典表填充选项
        this.dispatch(GET_SYS_DICT_BY_TYPE, {
          DictType: 'SACLLX' // 涉案类型
        }).then(_ => {
          this.involvedTypeList = this.dict.GetSysDictByType.map(d => {
            return {
              label: d.DictName,
              value: d.Code
            }
          })
        })
        this.dispatch(GET_SYS_DICT_BY_TYPE, {
          DictType: 'JDCZTDM' // 机动车状态选项
        }).then(_ => {
          this.detainStateList = this.dict.GetSysDictByType.map(d => {
            return {
              label: d.DictName,
              value: d.Code
            }
          })
        })
        this.dispatch(GET_SYS_DICT_BY_TYPE, {
          DictType: 'JDCCSYSDM' // 机动车颜色选项
        }).then(_ => {
          this.carColorList = this.dict.GetSysDictByType.map(d => {
            return {
              label: d.DictName,
              value: d.Code
            }
          })
        })
      },
      closeEvent() {
        this.$emit('close')
        this.currentFiles = []
        this.isFormalSubmit = false
      },
      submit() {
        if (this.isdetail) {
          this.closeEvent()
        } else {
          let cT = /^[京津沪渝冀豫云辽黑湘皖鲁新苏赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
          if (!cT.test(this.form.plateNumber)) {
            this.$message({
              type: 'warning',
              message: '请输入正确的车牌号',
              showClose: true
            }, 3000)
            return
          }
          this.$refs['peopleFormRef'].validate(vt => {
            if (vt) {
              // 翻译涉案类型选择文本
              this.form.involvedTypeText = ''
              for (let iu in this.involvedTypeList) {
                if (this.involvedTypeList[iu].value === this.form.involvedType) {
                  this.form.involvedTypeText = this.involvedTypeList[iu].label
                }
              }
              this.isFormalSubmit = true // 附加保存到正式目录
              this.$emit('update', this.form)
            } else {
              return false
            }
          })
        }
      },
      /**
       * 重置表单
       */
      reset() {
        if (this.$refs['peopleFormRef']) {
          this.$refs['peopleFormRef'].resetFields()
          this.currentFiles = []
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
          this.form.carImageId = _fileIdArray.join()
        }
      },
      control() {
        this.form.controlState === '1' ? this.$emit('on-view-result') : this.$emit('on-control')
      },
      cancelControl() {
        this.$emit('on-cancel-control')
      },
      hanldCarNumber(item) {
        let cT = /^[京津沪渝冀豫云辽黑湘皖鲁新苏赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
        if (!cT.test(item)) {
          this.$message({
            type: 'warning',
            message: '请输入正确的车牌号',
            showClose: true
          }, 3000)
        } else {
          console.log(CAR_INFO_SB)
          // this.dispatch(CAR_INFO_SB, { cphm: item }).then(() => {
          //   jdccsysdm character varying(100), --车身颜色
          //   console.log(this.dossier.CarInfoSB, 'this.dossier.CarInfoSB')
          // })
        }
      }
    },
    created() {},
    mounted() {
      // 初始化选项
      this.queryCluesTypeList()
    }
  }

</script>
