<template>
  <div>
      <el-form ref="car" :model="car" label-width="100px" :inline="true" v-loading="editLoading">
         <el-card class="carControl firstCard">
             <div class="clearfix" slot="header">
                <span>单位信息</span>
             </div>
              <el-row>
                  <el-col :span="6">
                    <el-form-item prop="title" label="申请人">
                      <el-input v-model="userData.UserName" required="true" :disabled="true" style="width:250px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="title" label="申请单位">
                      <el-input v-model="userData.DeptName" required="true" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                  <el-col :span="6">
                    <el-form-item prop="title" label="申请时间">
                       <el-input v-model="userData.time" required="true" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                  <el-col :span="6">
                    <el-form-item prop="title" label="联系电话">
                      <el-input v-model="userData.PhoneNum" required="true" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
         </el-card>  
        <el-card class="carControl cars controlObject" v-loading="objLoading">
            <div class="clearfix" slot="header">
              <span>布控对象</span>
            </div>
            <el-row>
              <el-col :span="6">
                <span style="color:red;position: absolute;left: 20px;top: 5px;">*</span>
                <el-form-item prop="carNums" label="号牌号码">
                  <el-input v-model="car.cphm" placeholder="请输入号牌号码" required="true" :disabled="editFlag" icon="search" :on-icon-click="carChange"></el-input>
                  <i @click="getPersonInfo" class="iconfont icon-plus" style="color:blue;background-color:white;border-radius:2px;border:1px solid blue;width:36px;height:36px;"></i>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                 <el-form-item prop="title" label="车辆类型">
                    <el-select  v-model="car.jdccllx" :disabled="editFlag" placeholder="请选择" @change="carDic" clearable filterable>
                      <el-option v-for="item in cllxdm" :label="item.DictName" :value="item.DictName" :key="item.DictName" required="true"></el-option>
                    </el-select> 
                </el-form-item>
              </el-col>
            </el-row> 
            <div class="carObj" v-for="item in carObjList">
              <el-row>
                  <el-col :span="6">
                    <el-form-item label="号牌号码">
                      <el-input v-model="item.jdchphm" required="true" :disabled="true"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="车辆类型">
                      <el-input v-model="item.jdccllxdm" required="true" :disabled="true"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="车身颜色">
                      <el-input v-model="item.jdccsysdm" required="true" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
               <el-row>
                  <el-col :span="6">
                    <el-form-item label="车辆品牌">
                      <el-input v-model="item.clxh" required="true" :disabled="true"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="车辆识别号">
                      <el-input v-model="item.clsbdh" required="true" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                  <el-col :span="6">
                    <el-form-item label="发动机号">
                      <el-input v-model="item.jdcfdjddjxh" required="true" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="车主姓名">
                      <el-input v-model="item.jdcsyr" required="true" :disabled="true"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="联系电话">
                      <el-input v-model="item.lxdh" required="true" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <!-- <div class="imageDiv">
                  <div class="imageText">车辆图片</div>
                  <img src="/static/img/analysis/addressBook.png" alt="">
              </div> -->
            </div>
        </el-card>  
        <el-card class="carControl cars">
            <div class="clearfix" slot="header">
              <span>布控信息</span>
            </div>
             <el-row>
                  <el-col :span="6" style="position: relative">
                    <span style="color:red;position: absolute;left: 20px;top: 5px;">*</span>
                    <el-form-item prop="title" label="布控名称">
                      <el-input v-model="car.bkmc" placeholder="请输入布控名称" required="true" :disabled="editFlag"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="title" label="审批紧急程序">
                       <el-select  v-model="car.spjjcd" :disabled="editFlag" placeholder="请选择">
                        <el-option v-for="item in urgentArr" :label="item.label" :value="item.key" :key="item.key" required="true"></el-option>
                      </el-select> 
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" style="position: relative">
                    <span style="color:red;position: absolute;left: 0px;top: 5px;">*</span>
                    <el-form-item prop="title" label="布控开始时间">
                      <el-date-picker type="date" :disabled="editFlag" placeholder="请选择布控开始时间" v-model="car.kssj"></el-date-picker>
                    </el-form-item>
                </el-col>
                  <el-col :span="6" style="position: relative">
                    <span style="color:red;position: absolute;left: 0px;top: 5px;">*</span>
                    <el-form-item prop="title" label="布控结束时间">
                      <el-date-picker type="date" :disabled="editFlag" placeholder="请选择布控结束时间" v-model="car.jssj"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                  <el-col :span="24">
                    <el-form-item prop="title" label="简要概况">
                      <el-input v-model="car.jygk" placeholder="请输入简要概况" required="true" :disabled="editFlag" type="textarea" style="width:1200px" :rows="3"></el-input>
                    </el-form-item>
                  </el-col>
            </el-row>
             <el-row>
                  <el-col :span="24">
                    <el-form-item prop="title" label="添加附件">
                      <upload @upload:submit="uploadSubmit" 
                      :currentFiles="currentFiles">
                        <el-button slot="button" type="primary">上传附件</el-button>
                      </upload>
                    </el-form-item>
                  </el-col>
            </el-row>
             <el-row class="applyMessage" style="margin-left:100px" v-if="ifedit===true && car.wjmc!==null">
                <el-col :span="2" class="title">
                </el-col>
                <el-form-item prop="xtTitle" label=""> 
                  <span style="padding-right:20px">{{car.wjmc}}</span>
                  <span><i class="el-icon-close" style="font-size:12px;cursor: pointer;" @click="deleteId"></i></span>
                </el-form-item> 
            </el-row>
            <el-row>
              <!-- 通知本人 -->
              <el-col :span="6">
                <el-form-item label="通知本人">
                  <el-radio-group :disabled="editFlag" v-model="car.sftzbr">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-form-item label="选择通知人">
                <el-input v-model="notifPersonCount" readonly style="width:160px;" placeholder="点击选择通知人" icon="icon iconfont icon-plus" :on-icon-click="openNotifPersonDialog"></el-input> 
                <!-- <el-input v-model="notifUnitCount" readonly style="width:160px;" placeholder="点击选择通知单位" icon="icon iconfont icon-plus" :on-icon-click="openNotifUnitDialog"></el-input> -->
              </el-form-item>
          </el-row>
           <el-row>
              <el-form-item label="已选择通知人" v-if="notifPerson.length >0">
                  <el-row v-for="(item, index) in notifPerson" :key="index">
                    <el-col :span="24" style="width:120%">
                      <span style="display:inline-block;width:100px">{{item.tzrxm}}</span>
                      <el-form-item label="通知方式">
                          <el-checkbox key="2" v-model="item.sfyjtx">
                            邮件提醒
                            <el-input class="institution__input" :value="item.email" :disabled="item.email!==null" placeholder="请输入邮件"></el-input>
                          </el-checkbox>
                          <el-checkbox v-model="item.sfdxtx">
                            短信提醒
                            <el-input class="institution__input" :value="item.phone" :disabled="item.phone!==null" placeholder="请输入电话号码"></el-input>
                          </el-checkbox>
                            <i class="iconfont icon-close" style="margin-left:30px;" @click="del(index)"></i>
                      </el-form-item>
                    </el-col>
                  </el-row>
              </el-form-item>
          </el-row>
           <!-- <el-row>
                    <el-form-item label="已通知人">
                      张三丰
                     </el-form-item>
                      <label for="" style="color: #9c9c9c;line-height: 32px;padding: 0 4px 0 0;font-size: 14px;">邮箱：</label>
                      <el-input v-model="booleanFlag" placeholder="请输入申请单位" required="true" :disabled="editFlag" size="small"></el-input>
                      <label for="" style="color: #9c9c9c;line-height: 32px;padding: 0 4px 0 10px;font-size: 14px;">短信：</label>
                      <el-input v-model="booleanFlag" placeholder="请输入申请时间" required="true" :disabled="editFlag" size="small"></el-input>
            </el-row> -->
            <el-row class="bkfw">
                <el-col :span="24">
                <el-form-item label="布控范围">
                  <el-checkbox-button size="small" type="primary" @change="allSelect" label="湖南" style="float:left" v-model="allArea"></el-checkbox-button>
                  <el-checkbox-group v-model="cityCheck" style="margin-right:10px;float:left" @change="cityChange">
                    <el-checkbox-button :label="city" v-for="city in cities" :key="city"></el-checkbox-button>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
          </el-row>
        </el-card>
        <el-row class="footerBtn">
              <el-button type="default" @click="resetForm('编辑车辆布控')">
                取消
              </el-button>
              <el-button type="default" @click="saveCarMessage('2', '编辑车辆布控')">
                保存草稿
              </el-button>
              <el-button type="primary" @click="saveCarMessage('5', '编辑车辆布控')">
                提交
              </el-button>
              <!-- <el-button type="primary">
                确定
              </el-button>
              <el-button type="primary">
                续控
              </el-button>
              <el-button type="primary">
                撤控
              </el-button> -->
        </el-row>
     </el-form>
     <user-selector :dialog="chooseNotifPersonDialog" @update:value="updateNotifPerson" size="middle--user" @close="chooseNotifPersonDialog=false"></user-selector>
     <!-- 选择号码 -->
     <object-selector-dialog :dialog="personDialog" @input="objectSelector" type="car" v-model="personFeatures" @close="personDialog=false"></object-selector-dialog>
  </div>
</template>
<style>
  .footerBtn .el-button{
    padding: 10px 30px;
  }
  .bkfw .el-checkbox-button .el-checkbox-button__inner{
     border-left: 1px solid #bfcbd9;
  }
  .bkfw .el-checkbox-button{
     margin-right: 5px;
  }
  .carDetail .el-table th.is-leaf{
    background: #85C0e8;
  }
  .carDetail .el-table th.is-leaf .cell{
    background: #85C0e8;
  }
  .carControl .el-card__header{
    padding: 10px 20px;
    background: #85C0e8;
    color: white;
    font-weight: bold;
    font-size: 15px;
  }
  .carControl .el-input{
     width: 250px;
   }
</style>
<style lang="scss" scoped>
  .footerBtn{
    padding: 30px 0;
    text-align: center;
  }
  .carObj{
    border: 1px solid #d1dbe5;
    padding: 10px 0px;
    margin-bottom: 20px;
  }
   .cars{
      margin-top: 10px;
   }
   .controlObject{
      position: relative;
   }
   .controlObject .imageDiv{
      position: absolute;
      top: 60px;
      right: 20px;
   }
   .controlObject .imageDiv .imageText{
     color: #9c9c9c;
     float: left;
     background: #f8f8f8;
     border: 1px solid #bfcbd9;
     height: 110px;
     text-align: center;
     margin-right: 20px;
     width: 30px;
     font-size: 16px;
     padding-top: 20px;
   }
   .controlObject .imageDiv img{
      width: 300px;
      height: 130px;
   }
</style>
<script>
  // libraryResultSearch
  import { mapState } from 'vuex'
  import upload from '../../../widgets/upload/upload'
  import objectselectordialognew from '../../../widgets/object-selector-dialog/object-selector-dialogCar'
  // GET_SURVEILLANCE_TACTICS_RESULT_BY_ID,
  import { GET_CAR_INFO_LIST, GET_CAR_SAVE_CONTROL, GET_CAR_INFO_CONTROL, GET_SYS_DICT_BY_TYPE } from '../../../store/types'
  import mixin from '../../../utils/mixin'
  // import dateFormat from '../../../utils/dateFormat'
  import list from '../../tactics/apply/list'
  import sideRightBox from '../../control/side-right-box.vue'
  import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'
  import TopBar from '../../common/topbar/index.vue'
  // import dialogNotifPerson from './dialog-chooseNotifPerson'
  import userselector from '../../../widgets/user-selector/user-selector'
  export default {
    mixins: [mixin],
    components: {
      sideRightBox,
      rightToolbar,
      list,
      TopBar,
      upload,
      'user-selector': userselector,
      'object-selector-dialog': objectselectordialognew
    },
    data() {
      return {
        value2: '',
        cllxdm: [],
        currentFiles: [],
        indeterminate: true,
        ifedit: true,
        editList: '',
        notifType: ['系统消息'],
        cityCheck: ['怀化市'],
        allArea: [],
        cityArr: [],
        isSelectCity: false,
        noticeSelf: '1',
        cities: ['长沙市', '怀化市', '邵阳市', '娄底市', '湘西土家苗族自治州', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '株洲市', '湘潭市', '衡阳市', '岳阳市'],
        cities1: [
          {label: '长沙市', number: '430100'},
          {label: '怀化市', number: '431200'},
          {label: '邵阳市', number: '430500'},
          {label: '娄底市', number: '431300'},
          {label: '湘西土家苗族自治州', number: '433100'},
          {label: '常德市', number: '430700'},
          {label: '张家界市', number: '430800'},
          {label: '益阳市', number: '430900'},
          {label: '郴州市', number: '431000'},
          {label: '永州市', number: '431100'},
          {label: '株洲市', number: '430200'},
          {label: '湘潭市', number: '430300'},
          {label: '衡阳市', number: '430400'},
          {label: '岳阳市', number: '430600'}
        ],
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
        car: {
          id: '',
          tzxx: '',
          bkly: '',
          cphm: '',
          bkzt: '',
          bklx: '2',
          jdccllxdm: '',
          jdccllx: '',
          bkmc: '',
          kssj: '',
          jssj: '',
          spjjcd: 0,
          wjid: '',
          wjmc: '',
          jygk: '',
          sfxttxs: '系统消息',
          sftzbr: '1',
          sjfw: '431200',
          notifieds: [],
          properValues: []
        },
        tzr: {
          sfyjtx: '',
          tzrxm: '',
          email: '',
          phone: '',
          sfxttx: '',
          sfdxtx: ''
        },
        carObjList: [],
        objLoading: false,
        editLoading: false,
        editFlag: false,
        personFeatures: '',
        personDialog: false,
        chooseNotifPersonDialog: false,
        notifPerson: [],
        notifPersonCount: '',
        booleanFlag: '',
        controlForm: {

        },
        jjcx: '',
        title: '',
        data: null
      }
    },
    props: ['carId', 'carTitle'],
    computed: {
      ...mapState(['surveillance', 'users', 'dossier', 'dict'])
    },
    watch: {
      // 如果编辑的id发生改变则重新请求
      carId(val) {
        if(val) {
          this.getEditObj();
        }
      }
    },
    methods: {
      carDic(val) {
        this.car.jdccllx = val;
        this.getCarList('change');
        console.log(val, 'carDiccarDiccarDiccarDic');
      },
      // 删除文件id
      deleteId() {
        this.car.wjid = '';
        this.ifedit = false;
      },
      // 重置
      resetForm(title) {
        this.$emit('closeTabs', title)
      },
      cityChange(val) {
        this.isSelectCity = true;
        this.cityArr = val;
        if(this.cityArr.length === 14) {
          this.allArea = ['湖南'];
        }else {
          this.allArea = [];
        }
      },
      del(idx) {
        this.notifPerson.splice(idx, 1)
        this.notifPersonCount = '已选' + this.notifPerson.length + '人'
      },
      // 城市选择
      allSelect() {
        this.isSelectCity = true;
        if(this.cityCheck.length === this.cities.length) {
          this.cityCheck = [];
        }else {
          this.cityCheck = this.cities
        }
        this.cityArr = this.cityCheck;
      },
      getPersonInfo() {
        this.personDialog = true;
      },
      carChange() {
        this.getCarList('change');
      },
      objectSelector(val) {
        this.getCarList(val);
      },
      // 获取车辆信息
      getCarList(val) {
        console.log(val, '!null{{item.phone}}!null{{item.phone}}!null{{item.phone}}');
        this.objLoading = true;
        if(val !== 'change') {
          this.car.cphm = val.carNum;
          this.car.bkly = val.lylx;
        }else{
          this.car.bkly = '3';
        }
        this.dispatch(GET_CAR_INFO_LIST, {cphm: this.car.cphm, jdccllxdm: this.car.jdccllx}).then(() => {
          this.objLoading = false;
          if(this.surveillance.getCarInfoList.length === 0) {
            this.$message({
              message: '没有该车辆的相关信息',
              type: 'error'
            })
            this.carObjList = [];
          }else {
            this.carObjList = this.surveillance.getCarInfoList.map(d => {
              return {
                jdchphm: d.jdchphm,
                jdccllxdm: d.jdccllxdm,
                jdccllx: d.jdccllxdm,
                jdccsysdm: d.jdccsysdm,
                clsbdh: d.clsbdh,
                jdcfdjddjxh: d.jdcfdjddjxh,
                jdcsyr: d.jdcsyr,
                clxh: d.clxh
              }
            })
          }
          console.log(this.carObjList, 'this.carObjListthis.carObjListthis.carObjList');
        })
      },
      // 保存
      saveCarMessage(val, title) {
        if(this.car.cphm === '') {
          this.$message({
            message: '请输入号牌号码',
            type: 'error'
          });
          return;
        }else if(this.car.bkmc === '') {
          this.$message({
            message: '请输入布控名称',
            type: 'error'
          });
          return;
        }else if(this.car.kssj === '') {
          this.$message({
            message: '请输入开始时间',
            type: 'error'
          });
          return;
        }else if(this.car.jssj === '') {
          this.$message({
            message: '请输入结束时间',
            type: 'error'
          });
          return;
        }
        this.car.bkzt = val;
        this.car.kssj = this.dateFormat(new Date(this.car.kssj), 'yyyy-MM-dd')
        this.car.jssj = this.dateFormat(new Date(this.car.jssj), 'yyyy-MM-dd')
        // this.car.jssj = dateFormat(new Date(this.car.jssj), 'yyyy-MM-dd')
        let carDetail = {};
        let arr = [];
        if(this.isSelectCity) {
          for(var k = 0; k < this.cities1.length; k++) {
            for(var j = 0; j < this.cityArr.length; j++) {
              if(this.cities1[k].label === this.cityArr[j]) {
                arr.push(this.cities1[k].number);
              }
            }
          }
          this.car.sjfw = arr.join();
        }
        if(this.car.jdccllx === '') {
          this.car.tzxx = '空|' + this.car.cphm;
        }else{
          this.car.tzxx = this.car.jdccllx + '|' + this.car.cphm;
        }
        if(this.car.bkly !== '') {
          carDetail.lylx = '1';
        }else {
          carDetail.lylx = '2';
        }
        carDetail.tzxx = this.car.tzxx;
        carDetail.tzlx = '8';
        carDetail.dxlx = '2';
        this.car.properValues.push(carDetail);
        for(var i = 0; i < this.notifPerson.length; i++) {
          if(this.notifPerson[i].sfdxtx === true) {
            this.notifPerson[i].sfdxtx = '1'
          }else {
            this.notifPerson[i].sfdxtx = '0'
          }
          if(this.notifPerson[i].sfyjtx === true) {
            this.notifPerson[i].sfyjtx = '1'
          }else {
            this.notifPerson[i].sfyjtx = '0'
          }
        }
        this.car.notifieds = this.notifPerson;
        this.dispatch(GET_CAR_SAVE_CONTROL, this.car).then(() => {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$emit('closeTabs', title)
        })
      },
      uploadSubmit(f) {
        // 获取当前上传文件列表文件id
        console.log(f, 'this.f')
        if (f.Status === 1) { // 文件更新保存成功后提交
          this.ifedit = false;
          let _fileIdArray = []
          let _fileNameArray = []
          for (let ii in f.data.fileList) {
            let _thisFileii = f.data.fileList[ii]
            // let __fFileSuffix = _thisFileii.response ? _thisFileii.response.Data.Extend : _thisFileii.raw.type.split('/')[1]
            let __fFileId = _thisFileii.response ? _thisFileii.response.Data.ID : _thisFileii.url.split('?id=')[1]
            _fileIdArray.push(__fFileId)
            _fileNameArray.push(_thisFileii.name)
          }
          this.car.wjid = _fileIdArray.join()
          this.car.wjmc = _fileNameArray.join()
        }
      },
      formatTen(num) {
        return num > 9 ? (num + '') : ('0' + num);
      },
      openNotifPersonDialog() {
        this.chooseNotifPersonDialog = true
      },
      // 选择通知人
      updateNotifPerson(val) {
        this.notifPerson = [];
        let valObj = {};
        for(var i = 0; i < val.length; i++) {
          valObj = {
            tzrxm: val[i].label,
            email: val[i].email,
            phone: val[i].mobile,
            sfxttx: '1',
            sfdxtx: false,
            sfyjtx: false
          }
          this.notifPerson.push(valObj);
        }
        console.log(this.notifPerson, 'this.notifPersonthis.notifPersonthis.notifPerson');
        this.notifPersonCount = '已选' + this.notifPerson.length + '人'
      },
      chooseMessage(val) {
        if(val === '1') {
          return true;
        }else {
          return false;
        }
      },
      // 编辑
      getEditObj() {
        // this.loading = true;
        this.editLoading = true;
        this.dispatch(GET_CAR_INFO_CONTROL, {id: this.carId}).then(() => {
          var cityEdit = [];
          this.editLoading = false;
          this.editList = this.surveillance.getCarInfoControl;
          this.carObjList = this.editList.clxx;
          if(this.carObjList === null) {
            this.carObjList = [];
          }
          this.notifPersonCount = '已选' + this.editList.notifieds.length + '人';
          // this.notifPerson = this.editList.notifieds;
          this.notifPerson = this.editList.notifieds.map(d => {
            return {
              bkid: d.bkid,
              email: d.email,
              lylx: d.lylx,
              phone: d.phone,
              sfdxtx: this.chooseMessage(d.sfdxtx),
              sfxttx: d.sfxttx,
              sfyjtx: this.chooseMessage(d.sfyjtx),
              tzrxm: d.tzrxm
            }
          })
          cityEdit = this.editList.sjfw.split(',');
          for(var k = 0; k < this.cities1.length; k++) {
            for(var j = 0; j < cityEdit.length; j++) {
              if(this.cities1[k].number === cityEdit[j]) {
                this.cityCheck.push(this.cities1[k].label);
              }
            }
          }
          if(this.cityCheck.length === 14) {
            this.allArea = ['湖南'];
          }
          this.car = {
            id: this.editList.id,
            bkly: this.editList.bkly,
            bkzt: this.editList.bkzt,
            bklx: '2',
            sjfw: this.editList.sjfw,
            cphm: this.editList.properValues[0].tzxx.split('|')[1],
            jdccllx: this.editList.properValues[0].tzxx.split('|')[0],
            spjjcd: parseInt(this.editList.spjjcd),
            bkmc: this.editList.bkmc,
            kssj: this.editList.kssj,
            jssj: this.editList.jssj,
            sftzbr: this.editList.sftzbr,
            wjmc: this.editList.wjmc,
            wjid: this.editList.wjid,
            jygk: this.editList.jygk,
            notifieds: [],
            properValues: []
          }
          if(this.car.jdccllxdm === '空') {
            this.car.jdccllxdm = '暂无车辆类型'
          }
          if(this.car.jdccllx === '空') {
            this.car.jdccllx = ''
          }
          console.log(this.surveillance.getCarInfoControl, 'this.surveillance.getCarInfoControl');
        })
      }
    },
    created() {
      this.dispatch(GET_SYS_DICT_BY_TYPE, {DictType: 'JDCCLLXDM'}).then((d) => {
        this.cllxdm = this.dict.GetSysDictByType;
        console.log(this.cllxdm, 'this.cllxdmthis.cllxdmthis.cllxdm');
      })
      document.title = '策略布控结果-智慧警务'
      let time = new Date();
      this.getEditObj();
      this.userData.time = `${time.getFullYear()}-${this.formatTen(time.getMonth() + 1)}-${this.formatTen(time.getDate())} ${time.getHours()}:${this.formatTen(time.getMinutes())}:${this.formatTen(time.getSeconds())}`;
    },
    mounted() {}
  }

</script>
