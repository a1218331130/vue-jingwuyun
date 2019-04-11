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
            <el-row v-if="carObjList.length===0">
              <el-col :span="6">
                <el-form-item prop="carNums" label="号牌号码">
                  <el-input v-model="hphm" placeholder="请输入号牌号码" required="true" :disabled="editFlag"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="title" label="车辆类型">
                  <el-input v-model="hpzl" required="true" placeholder="请输入车辆类型" :disabled="editFlag"></el-input>
                </el-form-item>
              </el-col>
            </el-row>  
            <div class="carObj" v-for="item in carObjList" v-if="carObjList.length>0">
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
                    <el-form-item prop="title" label="附件下载">
                      <!-- <upload @upload:submit="uploadSubmit">
                        <el-button slot="button" type="primary">上传附件</el-button>
                      </upload> -->
                      <a :href="uploadId">{{car.wjmc}}</a>
                    </el-form-item>
                  </el-col>
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
                <el-input :disabled="editFlag" v-model="notifPersonCount" readonly style="width:160px;" placeholder="点击选择通知人"></el-input>
              </el-form-item>
          </el-row>
           <el-row>
              <el-form-item label="已选择通知人" v-if="notifPerson.length >0">
                  <el-row v-for="(item, index) in notifPerson" :key="index">
                    <el-col :span="24" style="width:120%">
                      <span style="display:inline-block;width:100px">{{item.tzrxm}}</span>
                      <el-form-item label="通知方式">
                          <el-checkbox key="2" v-model="item.sfyjtx"  :disabled="editFlag">
                            邮件提醒
                            <el-input class="institution__input" :value="item.email" :disabled="editFlag" placeholder="请输入邮件"></el-input>
                          </el-checkbox>
                          <el-checkbox v-model="item.sfdxtx" :disabled="editFlag">
                            短信提醒
                            <el-input class="institution__input" :value="item.phone" :disabled="editFlag" placeholder="请输入电话号码"></el-input>
                          </el-checkbox>
                      </el-form-item>
                    </el-col>
                  </el-row>
              </el-form-item>
          </el-row>
            <el-row class="bkfw">
                <el-col :span="24">
                <el-form-item label="布控范围">
                  <!-- <el-checkbox-button size="small" type="primary" label="湖南" style="float:left" v-model="allArea" :disabled="true"></el-checkbox-button> -->
                  <el-checkbox-group style="margin-right:10px;float:left">
                    <el-checkbox-button :label="city" v-for="city in cityCheck" :key="city" :disabled="true"></el-checkbox-button>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
          </el-row>
        </el-card>
         <el-card class="carControl cars carDetail">
            <div class="clearfix" slot="header">
              <span>审批流程明细</span>
            </div>
            <div v-for="(list,iIndex) in checkList" :key='iIndex'>
              <div class="results"><span style="font-size:14px">{{list.trajectory.SQZT}}</span></div>
              <div class="resultsAll" v-if="list.sqlx!=='1'">
                <div class="results" v-if="list.sqlx!=='3'"><span>续控截止
                  时间：</span><span style="font-size:14px">{{list.jssj | dateFormat }}</span></div>
                <div class="results"><span>{{list.sqlx === '2' ? '续控原因：' : '撤控原因：'}}</span><span style="font-size:14px">{{list.sqly}}</span></div>
              </div>
              <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" border :stripe="true" :data="list.trajectory.lcgj">
                  <el-table-column align="center" label="流程步骤" prop="CJDMC"></el-table-column>
                  <el-table-column align="center" label="处理人" prop="CLRMC"></el-table-column>
                <el-table-column align="center" label="处理时间" prop="CLSJ"></el-table-column>
                <el-table-column align="center" label="处理状态" prop="CLZT"></el-table-column>
                <el-table-column align="center" label="意见" prop="CLYJ"></el-table-column>
                </el-table>
              </div>
        </el-card>
        <el-card class="carControl cars">
            <div class="clearfix" slot="header">
              <span>布控状态</span>
            </div>
            <!-- <el-row>
                 <el-form-item prop="title" label="续控截止时间">
                   <el-date-picker type="date" v-model="xu.jssj" placeholder="请输入续控截止时间"></el-date-picker>
                </el-form-item>
            </el-row> -->
             <el-row>
                  <el-col :span="24">
                    <span style="color:red;position: absolute;left: 25px;top: 5px;">*</span>
                    <el-form-item prop="title" label="撤控原因">
                      <el-input v-model="xu.sqly" placeholder="请输入续控原因" required="true" type="textarea" style="width:1200px" :rows="3"></el-input>
                    </el-form-item>
                  </el-col>
            </el-row>
        </el-card>  
        <el-row class="footerBtn">
              <el-button type="default" @click="resetForm('查看详情')">
                取消
              </el-button>
              <el-button type="primary" @click="ceKong('撤控')">
                撤控
              </el-button>
        </el-row>
     </el-form>
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
  // GET_SURVEILLANCE_TACTICS_RESULT_BY_ID,
  import { GET_CAR_INFO_CONTROL, GET_CARRESULT_LIST_BY_BKID_CONTROL, GET_CARREVOKE_CONTROL } from '../../../store/types'
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
      'user-selector': userselector
    },
    data() {
      return {
        uploadId: '',
        checkList: [],
        xu: {
          bkid: '',
          sqlx: '3',
          sqly: '',
          sqr: '',
          sqdw: ''
        },
        indeterminate: true,
        ifedit: true,
        editList: '',
        notifType: ['系统消息'],
        cityCheck: [],
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
          tzxx: '',
          bkly: '',
          cphm: '',
          bkzt: '',
          bklx: '2',
          jdccllxdm: '',
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
        carObjList: [],
        objLoading: false,
        editLoading: false,
        editFlag: false,
        notifPerson: [],
        notifPersonCount: '',
        title: '',
        hphm: '',
        hpzl: ''
      }
    },
    props: ['carId', 'carTitle'],
    computed: {
      ...mapState(['surveillance', 'users', 'dossier'])
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
      ceKong(title) {
        this.xu.bkid = this.carId;
        this.xu.sqr = this.userData.UserId;
        this.xu.sqdw = this.userData.DeptNo;
        if(this.xu.sqly === '' || this.xu.sqly === undefined) {
          this.$message({
            type: 'error',
            message: '撤控原因不能为空'
          });
          return;
        }
        this.dispatch(GET_CARREVOKE_CONTROL, this.xu).then(() => {
          this.$message({
            type: 'success',
            message: '撤控成功'
          });
          this.$emit('closeTabs', title)
        })
      },
      // 重置
      resetForm(title) {
        this.$emit('closeTabs', title)
      },
      formatTen(num) {
        return num > 9 ? (num + '') : ('0' + num);
      },
      chooseMessage(val) {
        if(val === '1') {
          return true;
        }else {
          return false;
        }
      },
      // 查看
      getEditObj() {
        // this.loading = true;
        this.cityCheck = [];
        this.dispatch(GET_CARRESULT_LIST_BY_BKID_CONTROL, {id: this.carId}).then(() => {
        })
        this.editLoading = true;
        this.editFlag = true;
        this.dispatch(GET_CAR_INFO_CONTROL, {id: this.carId}).then(() => {
          var cityEdit = [];
          this.editLoading = false;
          this.editList = this.surveillance.getCarInfoControl;
          this.carObjList = this.editList.clxx;
          if(this.carObjList === null) {
            this.carObjList = [];
          }
          if(this.carObjList.length === 0) {
            this.hphm = this.editList.properValues[0].tzxx.split('|')[1];
            this.hpzl = this.editList.properValues[0].tzxx.split('|')[0];
            if(this.hpzl === '空') {
              this.hpzl = '暂无车辆类型'
            }
          }
          this.checkList = this.editList.flowPaths;
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
          // var ipList = location.href.split('/');
          // var myIp = ipList[2]
          this.uploadId = '/jwy/DownFile.ashx?id=' + this.editList.wjid;
          this.car = {
            bkly: this.editList.bkly,
            bkzt: this.editList.bkzt,
            bklx: '2',
            sjfw: this.editList.sjfw,
            cphm: '',
            jdccllxdm: '',
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
          console.log(this.notifPerson, 'viewControlviewControlviewControlviewControlviewControl');
        })
      }
    },
    created() {
      document.title = '策略布控结果-智慧警务'
      let time = new Date();
      this.getEditObj();
      console.log(this.userData, 'this.userDatathis.userDatathis.userDatathis.userData');
      this.userData.time = `${time.getFullYear()}-${this.formatTen(time.getMonth() + 1)}-${this.formatTen(time.getDate())} ${time.getHours()}:${this.formatTen(time.getMinutes())}:${this.formatTen(time.getSeconds())}`;
    },
    mounted() {}
  }

</script>
