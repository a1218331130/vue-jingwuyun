<template>
  <div class="institution">
      <div class="institution__title">
        <span>布控信息</span>
      </div>
    <el-form ref="form" class="institution__form" :model="controlInfo" label-width="6.5rem" label-position="right" :rules="rules">
      <el-row>
        <el-col :span="6">
          <el-form-item label="布控名称" prop="bkmc">
            <el-input :disabled="status===3"  v-model="controlInfo.bkmc" class="institution__input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item  label="审批紧急程度">
            <el-select v-model="controlInfo.spjjcd" :disabled="status===3">
              <el-option v-for="item in urgentArr" :label="item.label" :value="item.key" :key="item.key" required="true"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="布控开始时间" prop="kssj">
            <el-date-picker :disabled="status===3" v-model="controlInfo.kssj" type="date" :picker-options="pickerOPtions" placeholder="请选择开始时间" class="institution__input"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="布控结束时间" prop="jssj">
            <el-date-picker :disabled="status===3" v-model="controlInfo.jssj" type="date" :picker-options="pickerOPtions2" placeholder="请选择结束时间" class="institution__input"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="简要概括" prop="jygk">
          <el-input :disabled="status===3" v-model="controlInfo.jygk" resize="none" style="width:630px;" type="textarea" placeholder="请输入布控情况"></el-input>
        </el-form-item>
      </el-row>
      <el-row v-if="status !==3">
        <el-col :span="6">
          <el-form-item label="附件信息" >
            <upload :isFormalSubmit="isFormalSubmit" :source="attachmentSource" @upload:submit="uploadSubmit" :currentFiles="controlInfo.currentFiles">
              <el-button slot="button" type="primary">上传附件</el-button>
            </upload>
            <p v-if="status === 2 && wjmcArr.length>0" v-for="(item,index) in wjmcArr">
              {{item.name}}
              <i class="iconfont icon-close" style="margin-left:30px;" @click="delWj(index)"></i>
              </p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="status === 3">
        <el-form-item label="附件信息" >
          <div v-if="data.wjmc">
            <p  v-for="(item, idx) in data.wjmc.split(',')"><a :href="'/jwy/DownFile.ashx?id='+data.wjid.split(',')[idx]">{{item}}</a></p>
          </div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="通知本人">
            <el-radio :disabled="status===3" v-model="controlInfo.sftzbr" label="1">是</el-radio>
            <el-radio :disabled="status===3" v-model="controlInfo.sftzbr" label="0">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="选择通知人" v-if="status!==3">
            <el-input v-model="notifPersonCount" readonly style="width:160px;" placeholder="点击选择通知人" icon="icon iconfont icon-plus" :on-icon-click="openNotifPersonDialog"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
          <el-form-item label="已选择通知人" v-if="noticePerson.length >0">
            <el-row v-for="(item, index) in noticePerson" :key="index">
              <el-col :span="5">
                <span>{{item.label}}</span>
              </el-col>
              <el-col :span="19">
                <el-form-item label="通知方式" v-if="status!==3">
                    <el-checkbox :disabled="status===3" :checked="item.mailFlag" @change="item.mailFlag = !item.mailFlag" key="2" >
                      邮件提醒
                      <el-input :disabled="item.mailFlags?true:!item.mailFlag||status ===3" v-model="item.mail" class="institution__input" placeholder="请输入邮箱"></el-input>
                    </el-checkbox>
                    <el-checkbox :disabled="status===3" :checked="item.messageFlag"  @change="item.messageFlag = !item.messageFlag" key="3">
                      短信提醒
                      <el-input :disabled="item.messageFlags?true:!item.messageFlag||status ===3" v-model="item.message" class="institution__input" placeholder="请输入手机号码"></el-input>
                      </el-checkbox>
                      <i v-if="status!==3" class="iconfont icon-close" style="margin-left:30px;" @click="del(index)"></i>
                </el-form-item>
                <el-form-item v-if="status ===3">
                      邮件提醒:
                      <el-input :disabled="true" v-model="item.mail" class="institution__input" placeholder="请输入邮箱"></el-input>
                      短信提醒:
                      <el-input :disabled="true" v-model="item.message" class="institution__input" placeholder="请输入手机号码"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
        </el-form-item>
      </el-row>
      <el-row v-if="status !==3">
        <el-form-item label="布控范围">
          <el-checkbox-button :disabled="status ===3" class="institution__area"  label="430000" v-model="allArea" style="margin-right:20px;" @change="areaChange">湖南</el-checkbox-button>
          <el-checkbox-group class="institution__area" v-model="controlInfo.sjfw">
            <el-checkbox-button :label="item.number" :key="index" @change="allChange" v-for="(item, index) in area">{{item.label}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-row v-if="status === 3">
        <el-form-item label="布控范围">
            <el-button :disabled="true" v-for="(item, index) in areaPush" :key="index">{{item}}</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  <user-selector :dialog="chooseNotifPersonDialog" @update:value="updateNotifPerson" size="middle--user" @close="chooseNotifPersonDialog=false"></user-selector>

  </div>
</template>
<style lang="scss" scoped>
  p {
    margin: 0;
    padding: 0;
  }

  .el-col-5 {
    width: 19.83333%;
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
    &__area {
      float: left;
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
  import upload from '../../../widgets/upload/upload.vue'
  import userselector from '../../../widgets/user-selector/user-selector'
  import bus from '../../../utils/bus'
  export default {
    components: {
      upload,
      'user-selector': userselector
    },
    data() {
      return {
        urgentArr: [{
          key: 0,
          label: '平急24小时'
        }, {
          key: 1,
          label: '加急6小时'
        }, {
          key: 2,
          label: '特急4小时'
        }, {
          key: 3,
          label: '特急2小时'
        }],
        isFormalSubmit: false,
        chooseNotifPersonDialog: false,
        dataFlag: false,
        notifPersonCount: '',
        arrtest: [1, 2, 3, 4, 5, 6],
        attachmentSource: {
          id: '',
          table: ''
        },
        noticePerson: [],
        allArea: [],
        controlInfo: {
          id: '',
          bkmc: '',
          spjjcd: '',
          kssj: '',
          jssj: '',
          jygk: '',
          sftzbr: '1',
          currentFiles: [],
          visitAccessory: '',
          FileNames: '',
          sjfw: ['431200']
        },
        wjmcArr: [],
        pickerOPtions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        pickerOPtions2: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        area: [{ label: '长沙市', number: '430100' }, { label: '怀化市', number: '431200' }, { label: '邵阳市', number: '430500' }, { label: '娄底市', number: '431300' }, { label: '湘西土家苗族自治州', number: '433100' }, { label: '常德市', number: '430700' }, { label: '张家界市', number: '430800' }, { label: '益阳市', number: '430900' }, { label: '郴州市', number: '431000' }, { label: '永州市', number: '431100' }, { label: '株洲市', number: '430200' }, { label: '湘潭市', number: '430300' }, { label: '衡阳市', number: '430400' }, { label: '岳阳市', number: '430600' }],
        areaPush: []
      }
    },
    computed: {},
    props: ['flag', 'rules', 'data', 'status'],
    watch: {
      flag(newVal, oldVal) {
        this.getInfo()
      },
      'data.id': {
        handler: function(newVal, oldVal) {
          if (newVal) {
            this.controlInfo = {
              id: '',
              bkmc: '',
              spjjcd: '',
              kssj: '',
              jssj: '',
              jygk: '',
              sftzbr: '1',
              currentFiles: [],
              visitAccessory: '',
              FileNames: '',
              sjfw: ['431200']
            }
            this.noticePerson = [];
            this.pushData()
          }
        },
        deep: true
      }
    },
    methods: {
      areaChange(event) {
        if (this.allArea.length === 0) {
          this.controlInfo.sjfw = []
        } else {
          this.area.map(item => {
            this.controlInfo.sjfw.push(item.number)
          })
        }
      },
      allChange() {
        if (this.controlInfo.sjfw.length > 13) {
          this.allArea = ['430000']
        } else {
          this.allArea = []
        }
      },
      del(idx) {
        this.noticePerson.splice(idx, 1)
        this.notifPersonCount = '已选择' + this.noticePerson.length + '人'
      },
      delWj(idx) {
        this.wjmcArr.splice(idx, 1)
      },
      changeFlag(index, val) {
        this.noticePerson[index].mailFlag = !this.noticePerson[index].mailFlag
      },
      openNotifPersonDialog() {
        this.chooseNotifPersonDialog = true;
      },
      updateNotifPerson(val) {
        val.map(item => {
          this.$set(item, 'messageFlag', false)
          this.$set(item, 'mailFlag', false)
          this.$set(item, 'messageFlags', Boolean(item.mobile))
          this.$set(item, 'mailFlags', Boolean(item.email))
          this.$set(item, 'message', item.mobile)
          this.$set(item, 'mail', item.email)
        })
        this.noticePerson = [...this.noticePerson, ...val]
        this.notifPersonCount = '已选择' + this.noticePerson.length + '人'
      },
      formatTen(num) {
        return num > 9 ? (num + '') : ('0' + num);
      },
      formatDate(date) {
        if (typeof date === 'string') {
          return date
        } else {
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate();
          return year + '-' + this.formatTen(month) + '-' + this.formatTen(day)
        }
      },
      uploadSubmit(f) {
        // 获取当前上传文件列表文件id
        if (f.Status === 1) { // 文件更新保存成功后提交
          let _fileIdArray = [],
            _fileNameArray = []
          for (let ii in f.data.fileList) {
            let __fFileId = f.data.fileList[ii].response ? f.data.fileList[ii].response.Data.ID : f.data.fileList[ii].url.split('?id=')[1]
            _fileIdArray.push(__fFileId)
            _fileNameArray.push(f.data.fileList[ii].name)
          }
          this.controlInfo.visitAccessory = _fileIdArray.join()
          this.controlInfo.FileNames = _fileNameArray.join('|')
        }
        this.iscontrolInfoalSubmit = false
        this.geteEnclosure()
      },
      // 上传附件
      geteEnclosure() {
        let _fId = this.controlInfo.visitAccessory ? this.controlInfo.visitAccessory.split(',') : this.controlInfo.visitAccessory
        let _fName = this.controlInfo.FileNames ? this.controlInfo.FileNames.split('|') : this.controlInfo.FileNames
        // 附件列表数据回填
        this.controlInfo.currentFiles = [] // 上传文件列表 重置
        for (let fi in _fId) {
          this.controlInfo.currentFiles.push({
            name: _fName[fi],
            id: _fId[fi]
          })
        }
      },
      formatTime(obj) {
        let flag = true
        let date = new Date(obj.kssj)
        let enddate = new Date(obj.jssj)
        if (date > enddate) {
          flag = false;
          this.$alert('布控开始时间应该小于结束时间，请重新输入', '温馨提示');
          obj.kssj = '';
          obj.jssj = ''
        }
        return flag
      },
      getInfo() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let flag = this.formatTime(this.controlInfo);
            if (!flag) {
              this.dataFlag = false;
            } else {
              this.dataFlag = true
            }
            this.controlInfo.kssj = this.formatDate(this.controlInfo.kssj);
            this.controlInfo.jssj = this.formatDate(this.controlInfo.jssj);
            this.controlInfo.noticePerson = this.noticePerson;
            this.wjmcArr.map(item => {
              this.controlInfo.currentFiles.push(item)
            })
            if (!parseInt(this.controlInfo.spjjcd) && this.controlInfo.spjjcd) {
              this.controlInfo.spjjcd = this.controlInfo.spjjcd.key
            }
            this.$emit('update:flag', this.dataFlag);
            this.$emit('update:data', this.controlInfo);
          } else {
            this.dataFlag = false;
            this.$emit('update:flag', this.dataFlag);
          }
        })
      },
      pushData() {
        this.controlInfo = {
          id: this.data.id,
          bkmc: this.data.bkmc,
          spjjcd: this.urgentArr[this.data.spjjcd],
          kssj: this.data.kssj,
          jssj: this.data.jssj,
          jygk: this.data.jygk,
          sftzbr: this.data.sftzbr,
          sjfw: this.data.sjfw.split(',')
        }
        this.controlInfo.currentFiles = []
        this.data.notifieds.map(item => {
          let jsonData = {
            label: item.tzrxm,
            mail: item.email,
            message: item.phone,
            mailFlag: Boolean(item.email),
            messageFlag: Boolean(item.phone),
            mailFlags: false,
            messageFlags: false
          }
          this.noticePerson.push(jsonData)
          this.notifPersonCount = '已选择' + this.noticePerson.length + '人'
        })
        this.wjmcArr = []
        if (this.data.wjmc) {
          let arr1 = this.data.wjid.split(',')
          this.data.wjmc.split(',').map((item, index) => {
            let jsonData = {
              name: item,
              id: arr1[index]
            }
            this.wjmcArr.push(jsonData)
          })
        }
        this.areaPush = []
        this.data.sjfw.split(',').map(item => {
          this.area.map(item1 => {
            if (item1.number === item) {
              this.areaPush.push(item1.label)
            }
          })
        })
      }
    },
    mounted() {
      bus.$on('update-bkmc', d => {
        this.controlInfo.bkmc = d + '的布控'
      })
      if (this.status !== 1) {
        this.pushData()
      }
    }
  }

</script>
