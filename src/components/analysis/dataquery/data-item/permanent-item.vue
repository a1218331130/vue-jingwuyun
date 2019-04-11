<template>
<div class="result-item" v-show="flag">
  <div class="result-item-flex">
    <div class="result-info">
      <div class="compact_title">常住人口信息</div>
      <div class="info-base" style="position:relative" v-show="flag">
        <el-col :span="5" class="compact__item img" v-if="personData.SFZH">
          <!-- <img :src="'data:image/png;base64,'+personData.XP" onerror="this.src='/static/img/default_person.jpg'" alt=""> -->
          <img :src="`${personImagePath}${personData.SFZH}`" onerror="this.src='/static/img/default_person.jpg'" alt="">
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'姓名'"></label>
          <span>{{personData.XM}}</span>
        </el-col>
        <el-col :span="12" class="compact__item">
          <label v-html="'身份证号码'"></label>
          <span class="hover-menu" data-type="idCard">{{personData.SFZH}}</span>
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'曾用名'"></label>
          <span>{{personData.CYM}}</span>
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'性别'"></label>
          <span>{{personData.XBMC}}</span>
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'民族'"></label>
          <span>{{personData.MZMC}}</span>
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'户口所在地'"></label>
          <span>{{personData.HKSZD}}</span>
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'婚姻状况'"></label>
          <span>{{personData.HYZK}}</span>
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'身高'"></label>
          <span>{{personData.SG}}</span>
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'出生地'"></label>
          <span>{{personData.CSD}}</span>
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'出生地籍贯'"></label>
          <span>{{personData.CSDJG}}</span>
        </el-col>
        <el-col :span="11" class="compact__item">
          <label v-html="'文化程度'"></label>
          <span>{{personData.WHCD}}</span>
        </el-col>
        <!-- <el-col :span="11" class="compact__item">
          <label v-html="'籍贯省市县'"></label>
          <span>{{personData.JGSSX}}</span>
        </el-col> -->
        <el-col :span="11" class="compact__item">
          <label v-html="'出生日期'"></label>
          <span>{{personData.CSRQ}}</span>
        </el-col>
        <el-col :span="11" class="compact__item">
          <label v-html="'住址省市县区'"></label>
          <span>{{personData.ZZSSXQ}}</span>
        </el-col>
        <el-col :span="11" class="compact__item">
          <label v-html="'职业'"></label>
          <span>{{personData.ZY}}</span>
        </el-col>
        <el-col :span="11" class="compact__item">
          <label v-html="'人口状态'"></label>
          <span>{{personData.RKZT}}</span>
        </el-col>
        <el-col :span="111" class="compact__item">
          <label v-html="'服务处所'"></label>
          <span>{{personData.FWCS}}</span>
        </el-col>
        <el-col :span="24" class="compact__item">
          <label v-html="'出生地详址'"></label>
          <span>{{personData.CSDXZ}}</span>
        </el-col>
        <el-col :span="24" class="compact__item">
          <label v-html="'住址详址'"></label>
          <span>{{personData.ZZXZ}}</span>
        </el-col>
        <!-- 无字典 -->
        <!-- <div class="compact__item" v-if="personData.BYQK">
            <label v-html="'兵役情况'"></label>
            <span>{{personData.BYQK}}</span>
          </div> -->
      </div>
      <!-- 暂无数据提示 -->
      <div class="empty empty--tips" v-if="!flag" v-loading="loading">
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
      flex-direction: row;
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
    min-height: 430px;
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
      img {
        width: 104px;
        height: 130px;
        padding-right: 10px;
        vertical-align: top;
        float: left;
      }
      .compact__item {
        margin-right: 0;
        line-height: 34px;
        &.img {
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
  // listByPersonInfo fetchPersonList
  import { FETCH_PERSON_LIST } from '../../../../store/types'
  import mixin from '../../../../utils/mixin'

  export default {
    components: {},
    mixins: [mixin],
    data() {
      return {
        flag: false,
        personData: {},
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
          CSDXZ: data.CSDXZ || '', // 出生地详址
          CYM: data.CYM || '', // 曾用名
          XP: data.XP || '', // 相片
          BYQK: data.BYQK || '', // 兵役情况
          ZZXZ: data.ZZXZ || '', // 住址详址
          MZMC: data.MZMC || '', // 民族
          SG: data.SG || '', // 身高
          FWCS: data.FWCS || '', // 服务处所
          ZZSSXQ: data.ZZSSXQ || '', // 住址省市县区
          CSRQ: data.CSRQ || '', // 出生日期
          HYZK: data.HYZK || '', // 婚姻状况
          XM: data.XM || '', // 姓名
          RKZT: data.RKZT || '', // 人口状态
          XBMC: data.XBMC || '', // 性别名称
          CSD: data.CSD || '', // 出生地
          JGSSX: data.JGSSX || '', // 籍贯省市县
          CSDJG: data.CSDJG || '', // 出生地籍贯
          SFZH: data.SFZH || '', //  身份证号
          HKSZD: data.HKSZD || '', // 户口所在地
          ZY: data.ZY || '', // 职业
          WHCD: data.WHCD || '' // 文化程度
        }
        return res
      }
    },
    watch: {
      searchVal(val) {
        this.loading = true
        this.personData = this.handleData({})
        this.dispatch(FETCH_PERSON_LIST, { 'sfzh': val })
          .then(() => {
            if (this.analysisDataQuery.personList) {
              this.loading = false
              this.flag = true
              this.$emit('update-search-tip', false, false)
              this.personData = this.handleData(this.analysisDataQuery.personList.xp)
            } else {
              this.loading = false
              this.flag = false
              this.$emit('update-search-tip', false, true)
            }
          }).catch(d => {
            this.loading = false
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
