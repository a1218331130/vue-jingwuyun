<!-- 卡口信息 -->
<template>
<div class="car-kinship ">
  <!-- 标题 -->
  <card-header :title="'卡口信息('+tableData.length+'条结果)'" @call:change-update="changeUpdate" :type=1 :carKey="carKey" :tableData="tableData" :expand="true" @on-update-expand="updateExpand"></card-header>

  <!-- 内容 -->

  <el-row :gutter="15" class="involved-box" v-show="expandMark">
    <el-col :span="24" v-loading="dossierLoading" class="involved-box-loading">

      <el-row class="car-box-wapper" v-for="(elem,index) in tableData" :key="index">
        <el-col :span="4" class="car-img">
          <!--  @click="handlePrimaryClick(data.clxx[0].pid,false,2)" -->
          <span class="avatar-pic"><img :src="elem.imageUrl" onerror="this.src='/static/img/default-car.jpg'" alt="" @click="changeImgUrl(elem.imageUrl)"></span>
        </el-col>
        <el-col :span="20" class="car-info-content">
          <div class="car-info-item" style="border:1px solid #e4e4e4;border-bottom:none">
            <div class="car-itme-label">车牌号码 :</div>
            <div class="car-item-content">{{elem.carNumber}}</div>
          </div>
          <div class="car-info-item" style="border:1px solid #e4e4e4;border-bottom:none">
            <div class="car-itme-label">图像类型 :</div>
            <div class="car-item-content">{{elem.imageType}}</div>
          </div>
          <div class="car-info-item" style="border:1px solid #e4e4e4;border-bottom:none">
            <div class="car-itme-label">车&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp道 :</div>
            <div class="car-item-content">{{elem.laneType}}</div>
          </div>
          <div class="car-info-item" style="border:1px solid #e4e4e4;">
            <div class="car-itme-label">卡口名 :</div>
            <div class="car-item-content">{{elem.placeName}}</div>
          </div>
          <div class="car-info-item" style="border:1px solid #e4e4e4;">
            <div class="car-itme-label">通过时间 :</div>
            <div class="car-item-content">{{elem.passTime}}</div>
          </div>
          <div class="car-info-item" style="border:1px solid #e4e4e4;">
            <div class="car-itme-label">车&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp速 :</div>
            <div class="car-item-content">{{elem.carSpeed}}</div>
          </div>
          <div class="car-info-item" style="border:1px solid #e4e4e4;">
            <div class="car-itme-label">车辆类型 :</div>
            <div class="car-item-content">{{elem.carType}}</div>
          </div>
          <div class="car-info-item" style="border:1px solid #e4e4e4;">
            <div class="car-itme-label">尾部车牌颜色 :</div>
            <div class="car-item-content">{{elem.rearPlateColor}}</div>
          </div>
          <div class="car-info-item" style="border:1px solid #e4e4e4;">
            <div class="car-itme-label">行驶方向 :</div>
            <div class="car-item-content">{{elem.direction}}</div>
          </div>
          <div class="car-info-item" style="border:1px solid #e4e4e4;">
            <div class="car-itme-label">号牌一致性 :</div>
            <div class="car-item-content">{{elem.plateCoincide}}</div>
          </div>
          <div class="car-info-item" style="border:1px solid #e4e4e4;">
            <div class="car-itme-label">车牌类型 :</div>
            <div class="car-item-content">{{elem.plateType}}</div>
          </div>
          <div class="car-info-item" style="border:1px solid #e4e4e4;">
            <div class="car-itme-label">车辆颜色 :</div>
            <div class="car-item-content">{{elem.carColor}}</div>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
  <!-- 弹窗查看大图 -->
  <el-dialog title="查看图片" :visible.sync="imgDialog" size="large">
    <div class="img-wrapper" style="text-align:center">
      <img class="car-big-img" :src="imgUrl" alt="" onerror="this.src='/static/img/default-car.jpg'">
    </div>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="imgDialog = false">取消</el-button> -->
      <el-button @click="imgDialog = false">确定</el-button>
    </span>
  </el-dialog>

</div>
</template>

<style lang="scss" scoped>
  .kinship-box {
    margin-top: 13px;
    padding: 0 8px;
  }

  .car-box-wapper {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
    .car-img {
      height: 134px;
      box-sizing: border-box;
      border: 1px solid #e4e4e4;
      border-right: none;
      .avatar-pic {
        box-sizing: border-box;
        width: 148px;
        img {
          width: 194px;
          height: 134px;
        }
      }
    }
    .car-info-content {
      .car-info-item {
        box-sizing: border-box;
        width: 243px;
        float: left;
        overflow: hidden;
        display: flex;
        height: 45px;
        line-height: 44px;
        text-align: center;
        .car-itme-label {
          color: #fff;
          box-sizing: border-box;
          background: #b4d6f1;
          width: 155px;
          border-right: 1px solid #e4e4e4;
        }
        .car-item-content {
          box-sizing: border-box;
          width: 230px;
        }
      }
    }
  }

  .car-big-img {
    width: 90%;
  }

  .involved-box {
    margin-top: 13px;
  }

  .involved-box-loading {
    min-height: 105px;
  }

</style>


<script>
  import dossierMixin from '../../dossierMixin'
  import cardHeader from './card-header.vue'
  import mixin from '../../../../utils/mixin'
  import { GET_KA_KO } from '../../../../store/types'
  import { mapState } from 'vuex'
  import bus from '../../../../utils/bus'
  export default {
    mixins: [mixin, dossierMixin],
    data() {
      return {
        dossierLoading: false,
        tableData: [],
        imgUrl: '',
        imgDialog: false
      }
    },
    props: ['carKey', 'zdyData', 'jdcfdjddjh'],
    components: {
      cardHeader
    },
    methods: {
      changeUpdate() {
        this.loadData()
      },
      loadData() {
        this.dossierLoading = true
        if (this.checkRule('jwy/vehicleFile/getkako', true) === true) {
          this.dispatch(GET_KA_KO, { cphm: this.carKey, jdcfdjddjh: this.jdcfdjddjh }).then(() => {
            this.tableData = this.conversionData(this.dossier.getKaKo)
            bus.$emit('allCarLoading')
            this.dossierLoading = false
          })
        } else {
          bus.$emit('allCarLoading')
          this.dossierLoading = false
        }
      },
      conversionData(dataList) { // 数据转换
        let res = dataList.map(data => {
          return {
            plateType: data.plate_type_name, // 车牌类型
            laneType: data.lane_type_name, // 车道
            carColor: data.vehicle_color_name, // 车辆颜色
            placeName: data.place_name, // 地点
            carSpeed: data.vehicle_speed, // 车速
            passTime: data.pass_time, // 通过时间
            carNumber: data.car_plate, // 车牌号码
            imageType: this.imageType(data.image_type), // 图像类型。取值：1-车辆大图  2-车牌彩色小图   3-车牌二值化图  4-驾驶员面部特征图  5-副驾驶面部特征图  6-车标
            imageUrl: data.image_url, // 图片
            carType: data.vehicle_type_name, // 车辆类型
            rearPlateColor: data.rear_plate_color_name, // 尾部车牌颜色
            direction: data.direction_name, // 行驶方向
            plateColor: data.plate_color_name, // 车牌颜色
            plateCoincide: data.plate_coincide_name // 号牌一致性
          }
        })
        return res
      },
      imageType(data) {
        let res = ''
        switch (data) {
          case '1':
            res = '车辆大图'
            break;
          case '2':
            res = '车牌彩色小图'
            break;
          case '3':
            res = '车牌二值化图'
            break;
          case '4':
            res = '驾驶员面部特征图'
            break;
          case '5':
            res = '副驾驶面部特征图'
            break;
          case '6':
            res = '车标'
            break;
        }
        return res
      },
      changeImgUrl(url) {
        this.imgUrl = url
        this.imgDialog = true
      }
    },
    created() {
      this.loadData()
    },
    computed: {
      ...mapState(['dossier'])
    },
    watch: {
      tableData(val) {
        bus.$emit('update:dossierSubTitleNumber', { 'title': '卡口信息', 'number': val.length })
      }
    }
  }

</script>
