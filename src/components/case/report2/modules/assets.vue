<!-- 资产情况 -->
<template>
  <div>
    <!-- 标题 -->
    <card-header title="房产信息"></card-header>
    <!-- 内容 -->

    <el-row :gutter="10" class="certificate-box">
      <el-col :span="24">
        <el-table
          :data="houseData"
          border
        >
          <el-table-column type="index" label="序号" width="70"></el-table-column>
          <el-table-column prop="houseNumber" label="房产证号"></el-table-column>
          <el-table-column prop="erea" label="地址"></el-table-column>
          <el-table-column prop="size" label="住房面积"></el-table-column>
          <el-table-column prop="value" label="市场价值"></el-table-column>
          <el-table-column prop="houseUse" label="房屋用途"></el-table-column>
          <el-table-column prop="houseType" label="房屋类型"></el-table-column>
        </el-table>
      </el-col>
    </el-row>


    <!-- 标题 -->
    <card-header title="车辆信息"></card-header>
    <!-- 内容 -->

    <el-row :gutter="10" class="certificate-box">
      <el-col :span="24">
        <el-table
          :data="carData"
          border
        >
          <el-table-column type="index" label="序号" width="70"></el-table-column>
          <el-table-column prop="name" label="车主"></el-table-column>
          <el-table-column prop="address" label="车主住址"></el-table-column>
          <el-table-column prop="carLicence" label="车牌号码"></el-table-column>
          <el-table-column prop="brand" label="中文品牌"></el-table-column>
          <el-table-column prop="carModel" label="车辆型号"></el-table-column>
          <el-table-column prop="carColor" label="车身颜色"></el-table-column>
          <el-table-column prop="carState" label="机动车状态代码"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
  .certificate-box {
    margin-top: 13px;
  }

  .sun-title {
    height: 30px;
    line-height: 30px;
    color: #46BDFD;
  }
</style>

<script>
  import cardHeader from '../../base/card-header.vue'
  export default{
    components: {
      cardHeader
    },
    props: ['data'],
    data() {
      return {
        houseData: [], // 房产信息
        carData: [] // 车辆信息
      }
    },
    watch: {
      data(val) {
        if (val.house) { // 房产信息
          this.houseData = val.house.map(r => {
            return {
              id: r.xxzjbh,
              houseNumber: r.yt_jyqk, // 房产证号
              erea: r.fwdz_jyqk, // 地址
              size: r.jzmj_mjpfm, // 面积
              value: r.cjzj_je, // 价格
              houseUse: r.yt_jyqk, // 用途
              houseType: r.yt_jyqk // 房屋类型
            }
          })
        }
        if (val.car) { // 车辆信息
          this.carData = val.car.map(r => {
            return {
              id: r.id,
              name: r.xm, // 车主
              address: r.xzz_dzmc, // 车主住址
              carLicence: r.jdchphm, // 车牌号码
              brand: r.zwppmc, // 中文品牌
              carModel: r.clxh, // 车辆型号
              carColor: r.jdccsysdm, // 车身颜色
              carState: r.jdcztdm // 机动车状态代码
            }
          })
        }
      }
    }
  }
</script>
