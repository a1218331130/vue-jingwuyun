<template>
<div style="min-height:300px; position:relative;" v-loading="loading">
  <div  class="info-box">
    <div class="right-bar__title" v-if="data !==null">节点信息【{{this.keyword}}】</div>
    <el-form v-if=" type === 'person' && data !==null">
      <data-image class="base-info__img" :idCard="data.SFZH"></data-image>
      <el-form-item label="姓名">{{data.XM}}</el-form-item>
      <el-form-item label="性别">{{data.XBMC}}</el-form-item>
      <el-form-item label="民族">{{data.MZMC}}</el-form-item>
      <el-form-item label="身份证号">
        <span class="cursor--pointer" @click="openInfoDialog(1, data.SFZH, null)">{{data.SFZH}}</span>
      </el-form-item>
      <el-form-item label="出生日期">{{data.CSRQ}}</el-form-item>
      <el-form-item label="身高(CM)">{{data.SG||'暂无'}}</el-form-item>
      <el-form-item label="地址">{{data.ZZXZ}}</el-form-item>
    </el-form>
    <el-form v-if="type === 'car' && data !==null">
      <img class="base-info__img car-pic" :src="getCarImage(data.brand,data.clxh)" onerror="this.src='/static/img/default-car.jpg'"/>
      <el-form-item label="颜色">{{data.color}}</el-form-item>
      <el-form-item label="排量">{{data.displacement||'暂无'}}</el-form-item>
      <el-form-item label="品牌">{{data.brand}}</el-form-item>
      <el-form-item label="登记时间">{{data.registerTime}}</el-form-item>
      <el-form-item label="所有人">{{data.carOwner}}</el-form-item>
      <el-form-item label="身份证">
        <span class="cursor--pointer" @click="openInfoDialog(1, data.idCard, null)">{{data.idCard}}</span>
      </el-form-item>
    </el-form>
    <el-form v-if="type === 'tel' && data !==null">
      <el-form-item label="手机号码"><span class="hover-menu" data-type="mobile">{{data.phone}}</span></el-form-item>
      <el-form-item label="归属地">{{data.ascription}}</el-form-item>
      <el-form-item label="省份">{{data.province}}</el-form-item>
      <el-form-item label="号码类型">{{data.telType}}</el-form-item>
      <el-form-item label="可能机主"></el-form-item>
      <div v-show="data.ownerList.length>0" v-for="(item,idx) in data.ownerList" :key="idx" class="list__item">
        <span class="cursor--pointer" @click="openInfoDialog(1, item.idCard, null)">{{item.idCard}}</span>
        <span>{{item.name}}</span>
      </div>
    </el-form>
    <el-form style="overflow: scroll;height: 600px;" v-if="type === 'line' && lineDataList">
      <el-form-item v-for="(item,i) in lineDataList" :key="i" v-if="Number(item.is_xs)":label="item.sjxzwmc">{{item.value}}</el-form-item>
    </el-form>
  </div> 
  <div v-if="type === 'line' ? false : data === null && !nodeClicked" class="tips">
    选择一个节点查看详细信息
  </div>
  <div v-if="type === 'line' ? false : data === null && nodeClicked" class="tips">
    暂未查询到信息
  </div>
  <div v-if="HasData" class="tips">
    暂未查询到信息
  </div>

  <!-- <div class="info-box">
    <div class="right-bar__title">标签</div>
  </div> -->
    <dialog-people-info :dialog="peopleInfoDialog" :data="infoDialogData" @close="peopleInfoDialog=false" @call:dialog="openInfoDialog" :showModal="false"></dialog-people-info>
</div>
</template>
<style lang="scss" scoped>
  .tips {
    color: #fff;
    text-align: center;
    width: 100%;
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
  }

  .relation-box .right-bar .base-info__img {
    &.car-pic {
      width: 95px;
      height: 80px;
      top: 40px;
    }
  }

</style>
<style media="screen">
  .relation-box .el-loading-mask {
    background: transparent;
  }

</style>
<script>
  import mixin from '../../../utils/mixin'
  import { mapState } from 'vuex'
  import { GET_PERSON_INFO_FROM_MAIN_DATA, CAR_INFO, GET_NUMBET_DETAIL, FETCH_CASE_RELADETAIL } from '../../../store/types'
  import infoDialogEvents from '../../../utils/infoDialogEvents'
  import dialogInfo from '../../../widgets/info-dialog/info-dialog'
  import dataImage from '../../../widgets/data-image/data-image'
  export default {
    mixins: [mixin, infoDialogEvents],
    components: {
      dataImage,
      'dialog-people-info': dialogInfo
    },
    data: () => ({
      keyword: '',
      type: 1,
      data: null,
      nodeClicked: false,
      HasData: false,
      lineDataList: []
    }),
    computed: {
      ...mapState(['baseData', 'dossier', 'analysisTelList', 'analysisRelation'])
    },
    methods: {
      getLineData(obj) {
        this.data = null;
        this.lineDataList = [];
        this.dispatch(FETCH_CASE_RELADETAIL, { zobj: obj.from, zobjtype: obj.startNodeType, cobj: obj.to, cobjtype: obj.endNodeType }).then(d => {
          this.type = 'line';
          if (this.analysisRelation.caseReladetail.column.length > 0) {
            this.HasData = false;
            this.lineDataList = this.analysisRelation.caseReladetail.column;
            this.lineDataList.forEach(d => {
              Object.keys(this.analysisRelation.caseReladetail.result).forEach(el => {
                if (d.sjxmc === el) {
                  d.value = this.analysisRelation.caseReladetail.result[el];
                }
              })
            })
          } else {
            this.HasData = true;
          }
        })
      },
      getData(keyword, type) {
        this.type = type;
        this.keyword = keyword;
        this.nodeClicked = true;
        console.log('node-type', type)
        switch (type) {
          case 'person':
            this.getPersonData(keyword, type);
            break;
          case 'car':
            this.getCarData(keyword, type);
            break;
          case 'tel':
            this.getPhoneData(keyword, type);
            break;
        }
      },
      getPersonData(keyword, type) {
        if (!keyword || keyword.length < 15) {
          this.data = null
          return false
        }
        this.keyword = keyword
        this.data = null
        this.dispatch(GET_PERSON_INFO_FROM_MAIN_DATA, { sfzh: keyword + '' }).then(d => {
          if (this.baseData.personInfo) {
            this.data = this.baseData.personInfo.xp
          } else {
            this.data = null
          }
        })
      },
      getCarData(keyword, type) {
        this.data = null;
        this.dispatch(CAR_INFO, { cphm: this.keyword }).then(d => {
          if (!this.dossier.CarInfo) {
            this.data = {
              carNum: this.data.keyId, // 车牌号码
              city: '', // 所在城市
              brand: '', // 品牌
              color: '', // 颜色
              registerTime: '', // 登记时间
              displacement: '', // 排量
              state: '', // 状态
              carOwner: '', // 车主
              idCard: '', // 车主身份证
              native: '', // 户籍地
              clxh: '' // 车辆型号
            }
          } else {
            this.data = {
              carNum: this.dossier.CarInfo.jdchphm, // 车牌号码
              brand: this.dossier.CarInfo.zwppmc, // 品牌
              color: this.dossier.CarInfo.jdccsysdm, // 颜色
              registerTime: this.dossier.CarInfo.ccdjrq, // 登记时间
              displacement: this.dossier.CarInfo.jdcfdjpl, // 排量
              state: '正在使用', // 状态
              carOwner: this.dossier.CarInfo.jdcsyrxm, // 车主
              idCard: this.dossier.CarInfo.jdcsyrsfzh, // 车主身份证
              nature: this.dossier.CarInfo.xdh_mc_jdcsyxzdm, // 使用性质
              clxh: this.dossier.CarInfo.clxh // 车辆型号
            }
          }
          this.loading = false
        })
      },
      getPhoneData(keyword, type) {
        this.dispatch(GET_NUMBET_DETAIL, { dhhm: this.keyword }).then(d => {
          if (this.analysisTelList.numbetDetail === null) {
            this.data = {
              phone: this.keyword, // 电话号码
              province: '', // 省份
              ascription: '', // 归属地
              telType: '' // 号码类型
            }
            this.data.ownerList = [] // 可能机主列表
          } else {
            let province = this.analysisTelList.numbetDetail.gsdxx.telarea.split(' ')
            this.data = {
              phone: this.keyword, // 电话号码
              province: province[0], // 省份
              ascription: this.analysisTelList.numbetDetail.gsdxx.telarea, // 归属地
              telType: this.analysisTelList.numbetDetail.gsdxx.teltype // 号码类型
            }
            this.data.ownerList = this.analysisTelList.numbetDetail.zjhmlist.map(d => {
              return {
                name: d.xm,
                idCard: d.zjhm,
                source: d.tablename // d.tableInfoList[0].tablename
              }
            })
          }
        })
      },
      clear() {
        this.data = null
        this.nodeClicked = false;
        this.HasData = false;
        this.type = 1;
      }
    }
  }

</script>
