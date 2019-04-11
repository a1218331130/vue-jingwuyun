<template>
  <div class="institution">
      <div class="institution__title">
        <span>布控对象</span>
      </div>
       <el-form ref="car" :model="car" label-width="100px" :inline="true" class="institution__form">
        <el-row v-if="carObjList.length===0">
          <el-col :span="6">
            <el-form-item prop="carNums" label="号牌号码">
              <el-input v-model="hphm" placeholder="请输入号牌号码" required="true" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="title" label="车辆类型">
              <el-input v-model="hpzl" required="true" placeholder="请输入车辆类型" :disabled="true"></el-input>
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
        </el-form>
  </div>
</template>
<style lang="scss" scoped>
  p {
    margin: 0;
    padding: 0;
  }
  .carObj{
    border: 1px solid #d1dbe5;
    padding: 10px 0px;
    margin-bottom: 20px;
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
  import { mapState } from 'vuex'
  // import { GET_PEOPLE_KEYS, GET_PERSON_INFO_FROM_MAIN_DATA } from '../../../store/types'
  export default {
    mixins: [mixin],
    components: {
    },
    data() {
      return {
        carObjList: [],
        hphm: '',
        hpzl: '',
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
        }
      }
    },
    computed: {
      ...mapState(['surveillance', 'dict', 'baseData'])
    },
    props: ['flag', 'rules', 'data', 'status'],
    watch: {
      data(val) {
        if(val) {
          this.carObjList = val.clxx;
          if(this.carObjList === null) {
            this.carObjList = [];
          }
          if(this.carObjList.length === 0) {
            this.hphm = val.properValues[0].tzxx.split('|')[1];
            this.hpzl = val.properValues[0].tzxx.split('|')[0];
            if(this.hpzl === '空') {
              this.hpzl = '暂无车辆类型'
            }
          }
        }
      }
    },
    methods: {
    },
    created() {},
    mounted() {
      this.carObjList = this.data.clxx;
      if(this.carObjList === null) {
        this.carObjList = [];
      }
      if(this.carObjList.length === 0) {
        this.hphm = this.data.properValues[0].tzxx.split('|')[1];
        this.hpzl = this.data.properValues[0].tzxx.split('|')[0];
        if(this.hpzl === '空') {
          this.hpzl = '暂无车辆类型'
        }
      }
      console.log(this.data, 'datadatadatadatadatadatadatadata');
    }
  }

</script>
