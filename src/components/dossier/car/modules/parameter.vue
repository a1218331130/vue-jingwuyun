<!-- 参数配置 -->
<template>
<div>
  <!-- 标题 -->
  <card-header :title="'参数配置('+tableData.length+'条结果)'" :expand="true" :tableData="tableData" @on-update-expand="updateExpand"></card-header>
  <!-- 内容 -->
  <div class="content-box" v-show="expandMark">
    <el-row :gutter="15" class="parameter-box" v-loading="dossierLoading" v-if="carData !== null ">
      <el-col :span="24">
        <el-row>
          <el-col :span="12" class="info-text-box">
            <label>发动机型号</label>
            <span class="lable-text-input">{{carData.jdcfdjddjxh || '暂无'}}</span>
          </el-col>
          <el-col :span="12" class="info-text-box">
            <label>发动机（电动机)功率</label>
            <span class="lable-text-input">{{carData.jdcfdjddjgl || '暂无'}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="info-text-box">
            <label>发动机排量</label>
            <span class="lable-text-input">{{carData.jdcfdjpl || '暂无'}}</span>
          </el-col>
          <el-col :span="12" class="info-text-box">
            <label>核定载质量</label>
            <span class="lable-text-input">{{carData.jdchdzzl || '暂无'}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="info-text-box">
            <label>后轴钢板弹簧片数</label>
            <span class="lable-text-input">{{carData.jdchzgbthps || '暂无'}}</span>
          </el-col>
          <el-col :span="12" class="info-text-box">
            <label>轴数</label>
            <span class="lable-text-input">{{carData.jdczs || '暂无'}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="info-text-box">
            <label>前轮距</label>
            <span class="lable-text-input">{{carData.jdcqlj || '暂无'}}</span>
          </el-col>
          <el-col :span="12" class="info-text-box">
            <label>后轮距</label>
            <span class="lable-text-input">{{carData.jdchlj || '暂无'}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="info-text-box">
            <label>机动车轮胎规格</label>
            <span class="lable-text-input">{{carData.jdcltgg || '暂无'}}</span>
          </el-col>
          <el-col :span="12" class="info-text-box">
            <label>长X宽X高</label>
            <span class="lable-text-input">{{carData.jdcwkcd}}x{{carData.jdcwkkd}}x{{carData.jdcwkgd}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="info-text-box">
            <label>机动车轮胎数</label>
            <span class="lable-text-input">{{carData.jdclts || '暂无'}}</span>
          </el-col>
          <el-col :span="12" class="info-text-box">
            <label>总质量</label>
            <span class="lable-text-input">{{carData.jdczzl || '暂无'}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="info-text-box">
            <label>机动车整备质量</label>
            <span class="lable-text-input">{{carData.jdczbzl || '暂无'}}</span>
          </el-col>
          <el-col :span="12" class="info-text-box">
            <label>准牵引总质量</label>
            <span class="lable-text-input">{{carData.jdczqyzzl || '暂无'}}</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="contact-box" v-loading="dossierLoading" v-else>
      <el-col :span="24">
        <div class="empty"></div>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<style lang="scss" scoped>
  .parameter-box {
    margin-top: 13px;
  }

  .info-text-box {
    label {
      text-align: center;
      height: 35px;
      line-height: 35px;
      width: 200px;
      display: inline-block;
      background: #e4f0fa;
    }
  }

  .contact-box {
    height: 105px;
  }

</style>


<script>
  import dossierMixin from '../../dossierMixin'
  import cardHeader from './card-header.vue'
  import mixin from '../../../../utils/mixin'
  import { CAR_INFO_SB } from '../../../../store/types'
  import { mapState } from 'vuex'
  import bus from '../../../../utils/bus'
  export default {
    mixins: [mixin, dossierMixin],
    data() {
      return {
        dossierLoading: false,
        carData: {},
        tableData: []
      }
    },
    props: ['carKey', 'jdcfdjddjh'],
    components: {
      cardHeader
    },
    watch: {
      tableData(val) {
        bus.$emit('update:dossierSubTitleNumber', { 'title': '参数配置', 'number': val.length })
      }
    },
    methods: {
      loadData() {
        this.dossierLoading = true
        if (this.checkRule('Car/GetCarInfo', true) === true) {
          this.dispatch(CAR_INFO_SB, { cphm: this.carKey, jdcfdjddjh: this.jdcfdjddjh }).then(() => {
            this.carData = this.dossier.CarInfoSB[0]
            console.log(this.carData, 'this.carData')
            if (this.carData) this.tableData.push(this.carData)
            bus.$emit('allCarLoading')
            this.dossierLoading = false
          })
        } else {
          bus.$emit('allCarLoading')
          this.dossierLoading = false
        }
      }
    },
    created() {
      this.loadData()
    },
    computed: {
      ...mapState(['dossier'])
    }
  }

</script>
