<template>
<div class="result-item" v-show="flag">
  <div class="result-item-flex">
    <div class="result-info">
      <div class="compact_title">车辆信息</div>
      <div class="info-base" style="position:relative" v-show="flag">
        <div class="compact__item img" v-if="personData.CLPP">
          <!-- <img :src="'data:image/png;base64,'+personData.XP" onerror="this.src='/static/img/default_person.jpg'" alt=""> -->
          <img :src="getCarImage(personData.CLPP)" onerror="this.src='/static/img/default-car.jpg'" alt="">
        </div>
        <el-col :span="5" class="compact__item">
          <label v-html="'车辆品牌'"></label>
          <span>{{personData.CLPP}}</span>
        </el-col>
        <el-col :span="5" class="compact__item">
          <label v-html="'机动车所有人'"></label>
          <span>{{personData.JDCSYR}}</span>
        </el-col>
        <el-col :span="5" class="compact__item">
          <label v-html="'号牌号码'"></label>
          <span>{{personData.HPHM}}</span>
        </el-col>
        <el-col :span="5" class="compact__item">
          <label v-html="'排量'"></label>
          <span>{{personData.PL}}</span>
        </el-col>
        <el-col :span="5" class="compact__item">
          <label v-html="'载重量'"></label>
          <span>{{personData.ZZL}}</span>
        </el-col>
        <el-col :span="5" class="compact__item">
          <label v-html="'核定载重量'"></label>
          <span>{{personData.HDZZL}}</span>
        </el-col>
        <el-col :span="5" class="compact__item">
          <label v-html="'号牌种类'"></label>
          <span>{{personData.HPZL}}</span>
        </el-col>
        <el-col :span="5" class="compact__item">
          <label v-html="'发证机关'"></label>
          <span>{{personData.FZJG}}</span>
        </el-col>
        <el-col :span="5" class="compact__item">
          <label v-html="'发动机型号'"></label>
          <span>{{personData.FDJXH}}</span>
        </el-col>
        <!-- <el-col :span="6" class="compact__item">
          <label v-html="'登记住址详址'"></label>
          <span>{{personData.DJZZXZ}}</span>
        </el-col> -->
        <el-col :span="5" class="compact__item">
          <label v-html="'功率'"></label>
          <span>{{personData.GL}}</span>
        </el-col>
        <el-col :span="5" class="compact__item">
          <label v-html="'车辆颜色'"></label>
          <span>{{personData.CLYS}}</span>
        </el-col>
        <el-col :span="5" class="compact__item">
          <label v-html="'登记住址详址'"></label>
          <span>{{personData.DJZZXZ}}</span>
        </el-col>
        <el-col :span="12" class="compact__item">
          <label v-html="'暂住地址详址'"></label>
          <span>{{personData.ZZDZXZ}}</span>
        </el-col>
      </div>
      <!-- 暂无数据提示 -->
      <div class="empty empty--tips" v-show="!flag" v-loading="loading">
        <span>{{tipWord}}</span>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<style scoped lang='scss'>
.result-item {
    margin-top: 10px;
    background: transparents;
    &-flex {
        // display: flex;
        flex-direction: col;
        align-items: stretch;
    }
}
.result-info {
    // width: calc(100% - 80px);
    position: relative;
    margin-left: 10px;
    background: #fff;
    box-shadow: 0 0 3px #ccc;
    color: #666;
    min-height: 210px;
    font-size: 16px;
    .compact_title {
        background: #85c0e9;
        color: #fff;
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
    }
    .info-base {
        padding: 10px;
        overflow: hidden;
        img {
            width: 160px;
            height: 138px;
            padding: 10px;
            vertical-align: top;
            float: left;
        }
        .compact__item {
            margin-right: 0;
            line-height: 39px;
            &.img {
                width: 200px;
                float: left;
                margin-right: 0;
            }
            label {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }
    }
}
.more {
    padding: 0 4px;
    background: #999;
    color: #fff;
    border-radius: 2px;
    font-weight: 400;
    cursor: pointer;
}
</style>

<script>
import { mapState } from 'vuex'
// fetchCarList
import { FETCH_CAR_LIST } from '../../../../store/types'
import mixin from '../../../../utils/mixin'
export default {
  components: {},
  mixins: [mixin],
  data() {
    return {
      personData: {}, // 信息数据
      flag: false,
      tipWord: '暂无数据'
    }
  },
  props: {
    searchVal: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  methods: {
    // 设置personData默认值
    handleData(data) {
      let res = {
        PL: data.PL || '', // 排量
        CLPP: data.CLPP1 || '', // 车辆品牌
        JDCSYR: data.JDCSYR || '', // 机动车所有人
        ZZL: data.ZZL || '', // 载重量
        HDZZL: data.HDZZL || '', // 核定载重量
        HPHM: data.HPHM || '', // 号牌号码
        HPZL: data.HPZL || '', // 号牌种类
        DJZZXZ: data.DJZZXZ || '', // 登记住址详址
        GL: data.GL || '', // 功率
        CSYS: data.CSYS || '', // 车辆颜色
        ZZDZXZ: data.ZZDZXZ || '', //  暂住地址详址
        FDJXH: data.FDJXH || ''
      }
      return res
    }
  },
  watch: {
    searchVal(val) {
      this.personData = this.handleData({})
      this.dispatch(FETCH_CAR_LIST, { 'hphm': val })
        .then(() => {
          if(this.analysisDataQuery.carList && this.analysisDataQuery.carList.HPHM) {
            this.$emit('update-search-tip', false, false)
            this.flag = true
            this.personData = this.handleData(this.analysisDataQuery.carList)
          } else {
            this.flag = false
            this.$emit('update-search-tip', false, true)
          }
        }).catch(d => {
          this.flag = false
          this.tipWord = d.Data
        })
    }
  },
  computed: {
    ...mapState(['analysisDataQuery'])
  },
  mounted() {},
  created() {}
}
</script>
