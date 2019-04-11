<template>
  <div class="institution">
      <div class="institution__title">
        <span>布控对象</span>
      </div>
    <el-form ref="form" :model="objInfo" label-width="6.5rem" label-position="right" class="institution__form" :rules="rules" v-loading="loading">
      <el-row>
        <el-col :span="21">
          <el-row>
            <div>
              <p class="institution__p" >基本信息</p>
              <p class="institution__p" ></p>
            </div>
            <div style="clear:left;">
              <el-row>
              <el-col :span="7">
                <el-form-item label="身份证" prop="idCard">
                  <el-input v-model="objInfo.idCard" :disabled="objInfoFlag||status===3||status === 2" icon="search" :on-icon-click="checkIdcard" :minlength="18" :maxlength="18"class="institution__input" placeholder="请输入身份证"></el-input>
                  <i v-if="status === 1" @click="getPersonInfo" class="iconfont icon-plus" style="z-index:9999;color:blue;background-color:white;border-radius:2px;border:1px solid blue;width:36px;height:36px;"></i>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="姓名" prop ="xm">
                  <el-input @blur="xmBlur" v-model="objInfo.xm" :disabled="objInfoFlag||status===3||status === 2" class="institution__input" placeholder="请输入姓名"></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="7" style="">
                <el-form-item  label="性别">
                  <el-radio v-model="objInfo.sex" :disabled="objInfoFlag||status===3||status === 2" label="男">男</el-radio>
                  <el-radio v-model="objInfo.sex" :disabled="objInfoFlag||status===3||status === 2" label="女">女</el-radio>
                </el-form-item>
              </el-col> -->
              </el-row>
              <el-row>
              <el-col :span="7">
                <el-form-item v-if="objInfo.bkly === '2'" label="人员类型">
                  <el-input class="institution__input" v-model="objInfo.rylx" :disabled="true"  placeholder="请输入人员类型"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item v-if="objInfo.bkly === '1'" label="案件名称">
                  <el-input class="institution__input" v-model="objInfo.ajmc" :disabled="true" placeholder="请输入案件名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item v-if="objInfo.bkly === '1'" label="案件编号">
                  <el-input class="institution__input" v-model="objInfo.ajbh" :disabled="true" placeholder="请输入案件编号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item v-if="objInfo.bkly === '1'" label="简要案情">
                  <el-input type="textarea" style="width:400px;" v-model="objInfo.jyaq" :disabled="true" placeholder="请输入简要案情"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            </div>
          </el-row>

          <el-row>
            <div>
              <p class="institution__p" >虚拟信息</p>
              <p class="institution__p" ></p>
            </div>
            <div style="clear:left;">
              <el-col>
                <el-form-item label="QQ 号">
                  <el-input icon="delete" :key="index" :disabled="status === 3" v-for="(item, index) in objInfo.QQ" v-model="objInfo.QQ[index]" class="institution__input institution__margin" placeholder="请输入QQ号码"></el-input>
                  <span v-if="status !== 3" style="color:#85c2e7;cursor:pointer;" @click="add('QQ')" >添加</span>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="微信号">
                  <el-input icon="delete" :key="index" :disabled="status === 3" v-for="(item, index) in objInfo.weixin" v-model="objInfo.weixin[index]"  class="institution__input institution__margin" placeholder="请输入微信号码" :on-icon-click="iconClickWeixin"></el-input>
                  <span v-if="status !== 3" style="color:#85c2e7;cursor:pointer;" @click="add('weixin')">添加</span>
                </el-form-item>
              </el-col>
            </div>
          </el-row>

          <el-row>
            <div>
              <p class="institution__p" >人脸图片</p>
              <p class="institution__p" ></p>
            </div>
            <div style="clear:left;">
              <el-col :span="7">
                <el-form-item label="预警阀值" prop="yjfz">
                  <el-input  v-model="objInfo.yjfz" :disabled="status === 3" class="institution__input" placeholder="请输阀值"></el-input>
                </el-form-item>
              </el-col>
            </div>
          </el-row>

        </el-col>

        <el-col :span="3">
          <div class="institution__img">
            <img :src="objPic" alt="">
          </div>
        </el-col>
      </el-row>

      <el-row>
        <div>
          <p class="institution__p">电话号码</p>
          <p class="institution__p"></p>
        </div>
        <div style="clear:left;" v-for="(item, index) in objInfo.phone">
          <el-col :span="6">
            <el-form-item label="电话号码">
              <el-input :disabled="item.phoneFlag ||status === 3"  v-model="item.phone" class="institution__input" placeholder="请输入电话号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="IMEI码">
              <el-input :disabled="item.IMEIFlag||status === 3" v-model="item.IMEI" class="institution__input" placeholder="请输入IMEI码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="IMSI码">
              <el-input :disabled="item.IMSIFlag||status === 3" v-model="item.IMSI" class="institution__input" placeholder="请输入IMSI码"></el-input>
              <i v-if="!item.phoneFlag&&objInfo.phone.length>1 && status!==3" class="iconfont icon-close" style="margin-left:30px;margin-right:30px;" @click="del(index)"></i>
            <span v-if="index === objInfo.phone.length -1 && status !== 3" style="color:#85c2e7;cursor:pointer;" @click="addPhone" >添加</span>
            </el-form-item>
          </el-col>
        </div>
      </el-row>
      
    </el-form>
    <object-selector-dialog :dialog="personDialog" @input="objectSelector" type="person" v-model="personFeatures" @close="personDialog=false"></object-selector-dialog>
  </div>
</template>
<style lang="scss" scoped>
  p {
    margin: 0;
    padding: 0;
  }

  .institution {
    &__title {
      height: 30px;
      width: 100%;
      background-color: #85c2e7;
      line-height: 30px;
      >span {
        margin-left: 10px;
        color: white;
      }
    }
    &__form {
      border: 1px solid #ccc;
      border-top: none;
      padding-top: 20px;
      overflow: hidden;
      padding-left: 20px;
      background-color: white;
    }
    &__p {
      float: left;
    }
    &__p:nth-child(1) {
      width: 95px;
      text-align: right;
      position: relative;
      bottom: 10px;
      padding-right: 5px;
    }
    &__p:nth-child(2) {
      width: calc(100% - 110px);
      border-bottom: 1px solid #ccc;
    }
    &__input {
      width: 200px;
    }
    &__margin {
      margin-right: 10px;
    }
    &__img {
      height: 190px;
      width: 74%;
      margin-left: 13%;
      >img {
        height: 100%;
        width: 100%;
      }
    }
  }

</style>
<script>
  import mixin from '../../../utils/mixin'
  import bus from '../../../utils/bus'
  import { mapState } from 'vuex'
  import { GET_PEOPLE_KEYS, GET_PERSON_INFO_FROM_MAIN_DATA, GET_PERSON_COMMUNICATION_INFO } from '../../../store/types'
  import objectselectordialognew from '../../../widgets/object-selector-dialog/object-selector-dialogNew'
  export default {
    mixins: [mixin],
    components: {
      'object-selector-dialog': objectselectordialognew
    },
    data() {
      return {
        personDialog: false,
        dataFlag: false,
        objInfoFlag: false,
        loading: false,
        personFeatures: '',
        objPic: null,
        objInfo: {
          bkly: '3',
          idCard: '',
          xm: '',
          QQ: [''],
          weixin: [''],
          yjfz: '80',
          phone: [{}],
          IMSI: '',
          rylx: '',
          ajmc: '',
          ajbh: '',
          jyaq: '',
          lybid: '',
          properValues: []
        }
      }
    },
    computed: {
      ...mapState(['surveillance', 'dict', 'baseData', 'dossier'])
    },
    props: ['flag', 'rules', 'data', 'status'],
    watch: {
      flag(newVal, oldVal) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.dataFlag = true;
            this.$emit('update:flag', this.dataFlag);
            this.$emit('update:data', this.objInfo);
          } else {
            this.dataFlag = false;
            this.$emit('update:flag', this.dataFlag);
          }
        })
      },
      'data.id': {
        handler: function(newVal, oldVal) {
          this.objInfo = {
            bkly: '3',
            idCard: '',
            xm: '',
            QQ: [''],
            weixin: [''],
            yjfz: '80',
            phone: [{}],
            IMSI: '',
            rylx: '',
            ajmc: '',
            ajbh: '',
            jyaq: '',
            bklyid: '',
            lybid: '',
            properValues: []
          }
          if (this.status !== 1) {
            this.pushData();
          }
        },
        deep: true
      }
    },
    methods: {
      add(type) {
        let flag = true;
        let obj = this.objInfo[type]
        obj.map(item => {
          if (item === '') {
            flag = false
            return
          }
        })
        if (flag) {
          this.objInfo[type].push('');
        } else {
          this.$message({ type: 'warning', message: '当前输入框未填完，不能添加' })
        }
      },
      del(idx) {
        this.objInfo.phone.splice(idx, 1)
      },
      xmBlur() {
        bus.$emit('update-bkmc', this.objInfo.xm)
      },
      checkIdcard() {
        this.dispatch(GET_PERSON_INFO_FROM_MAIN_DATA, {
          sfzh: this.objInfo.idCard
        }).then(() => {
          let data = this.baseData.personInfo.xp
          this.objInfo.xm = data.XM;
          this.objPic = this.personImagePath + this.objInfo.idCard
          bus.$emit('update-bkmc', this.objInfo.xm)
        })
        this.dispatch(GET_PERSON_COMMUNICATION_INFO, { idcard: this.objInfo.idCard }).then(() => {
          this.objInfo.phone = []
          this.dossier.getPersonCommunicationInfo.map((item) => {
            if (item.TXLX === '手机') {
              this.objInfo.phone.splice(0, 0, { phone: item.TXHM, phoneFlag: true, IMEIFlag: true, IMSIFlag: true, IMEI: '', IMSI: '' })
            }
          })
        })
      },
      getPersonInfo() {
        this.personDialog = true;
      },
      iconClickQQ(event) {
        let obj = this.$(event.target).parents('.institution__margin')
        let idx = obj.index()
        if (this.objInfo.QQ.length <= 1) {
          this.$message({ type: 'warning', message: '已经是最后一个了，不能再删除了' })
          return;
        }
        this.objInfo.QQ.splice(idx, 1)
      },
      iconClickWeixin(event) {
        let obj = this.$(event.target).parents('.institution__margin')
        let idx = obj.index()
        if (this.objInfo.weixin.length <= 1) {
          this.$message({ type: 'warning', message: '已经是最后一个了，不能再删除了' })
          return;
        }
        this.objInfo.weixin.splice(idx, 1)
      },
      addPhone() {
        let phoneArr = this.objInfo.phone
        if (phoneArr[phoneArr.length - 1].phone) {
          phoneArr.push({})
        } else {
          this.$message({ type: 'warning', message: '当前输入框未填完，不能添加' })
        }
      },
      objectSelector(val) {
        this.objInfo.idCard = val.sfz;
        this.objInfo.xm = val.xm
        bus.$emit('update-bkmc', this.objInfo.xm)
        this.objInfo.bkly = val.lylx
        if (val.lylx === '2') {
          this.objInfo.rylx = val.rqlbmc
        } else if (val.lylx === '1') {
          this.objInfo.ajmc = val.obj.ajmc
          this.objInfo.jyaq = val.obj.jyaq ? val.obj.jyaq : '无案情简介'
          this.objInfo.ajbh = val.obj.ajbh
        }
        this.objInfoFlag = true;
        this.loading = true
        this.dispatch(GET_PEOPLE_KEYS, { people_info: [val] }).then(() => {
          this.objInfo.bklyid = this.surveillance.getPeopleKeysResult[0].lybid
          let num = 0
          this.objInfo.properValues = this.surveillance.getPeopleKeysResult[0].properValues
          this.surveillance.getPeopleKeysResult[0].properValues.map(item => {
            if (item.tzlx === '3') {
              if (num === 0) { this.objInfo.phone = [] }
              this.objInfo.phone.splice(0, 0, { phone: item.tzxx, lybid: item.lybid ? item.lybid : '', lylx: item.lylx ? item.lylx : '', dxlx: item.dxlx, phoneFlag: true, IMEIFlag: false, IMSIFlag: false, IMEI: '', IMSI: '' })
              num++
            } else if (item.tzlx === '6') {
              this.objInfo.QQ.push(item.tzxx)
            } else if (item.tzlx === '7') {
              this.objInfo.weixin.push(item.tzxx)
            }
          })
          let pictureInfo = this.surveillance.getPeopleKeysResult[0].pictures[0]
          this.objPic = this.personImagePath + this.objInfo.idCard
          if (pictureInfo.yjfz) {
            this.objInfo.yjfz = pictureInfo.yjfz
          }
          this.loading = false;
        })
      },
      pushData() {
        this.objInfo.bkly = this.data.bkly
        if (this.data.ajxx) {
          this.objInfo.ajmc = this.data.ajxx.ajztmc
          this.objInfo.ajbh = this.data.ajxx.ajbh
          this.objInfo.jyaq = this.data.ajxx.jyaq
        }
        if (this.data.dxtype) {
          this.objInfo.rylx = this.data.dxtype.RQLBMC
        }
        let IMEIArr = [];
        let IMSIArr = [];
        this.data.properValues.map(item => {
          if (item.tzlx === '1') {
            this.objInfo.xm = item.tzxx
          } else if (item.tzlx === '2') {
            this.objInfo.idCard = item.tzxx
            this.objPic = this.personImagePath + this.objInfo.idCard
          } else if (item.tzlx === '3') {
            let phoneArr = this.objInfo.phone
            if (phoneArr[phoneArr.length - 1].phone) {
              this.objInfo.phone.push({ phone: item.tzxx, lybid: item.lybid ? item.lybid : '', lylx: item.lylx ? item.lylx : '', dxlx: item.dxlx, phoneFlag: false, IMEIFlag: false, IMSIFlag: false, IMEI: '', IMSI: '' })
            } else {
              this.objInfo.phone[0] = ({ phone: item.tzxx, lybid: item.lybid ? item.lybid : '', lylx: item.lylx ? item.lylx : '', dxlx: item.dxlx, phoneFlag: false, IMEIFlag: false, IMSIFlag: false, IMEI: '', IMSI: '' })
            }
          } else if (item.tzlx === '4') { // IMEI
            IMEIArr.push({ phone: item.gldx, IMEI: item.tzxx })
          } else if (item.tzlx === '5') { // IMSI
            IMSIArr.push({ phone: item.gldx, IMSI: item.tzxx })
          } else if (item.tzlx === '6') { // QQ
            if (!this.objInfo.QQ[0]) {
              this.objInfo.QQ[0] = item.tzxx
            } else {
              this.objInfo.QQ.push(item.tzxx)
            }
          } else if (item.tzlx === '7') { // weixin
            if (!this.objInfo.weixin[0]) {
              this.objInfo.weixin[0] = item.tzxx
            } else {
              this.objInfo.weixin.push(item.tzxx)
            }
          } else if (item.tzlx === '8') { // 车牌号
            console.log(item.tzlx, item.tzxx, 'item.tzxx 333333')
          }
        })
        IMEIArr.map(item => {
          this.objInfo.phone.map(item1 => {
            if (item.phone === item1.phone) {
              item1.IMEI = item.IMEI
            }
          })
        })
        IMSIArr.map(item => {
          this.objInfo.phone.map(item1 => {
            if (item.phone === item1.phone) {
              item1.IMSI = item.IMSI
            }
          })
        })
        this.objInfo.bklyid = this.data.bklyid
        this.objInfo.properValues = this.data.properValues
      }
    },
    created() {},
    mounted() {
      if (this.status !== 1) {
        this.pushData();
      }
    }
  }

</script>
