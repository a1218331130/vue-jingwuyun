<template>
<div class="result-item" v-show="flag">
  <div class="result-item-flex">
    <div class="result-info">
      <div class="compact_title">吸贩毒人员信息</div>
      <div class="info-base" style="position:relative" v-show="flag">
        <el-col :span="8" class="compact__item">
          <label v-html="'姓名'"></label>
          <span>{{personData.XM}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'性别'"></label>
          <span>{{personData.XBMC}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'民族'"></label>
          <span>{{personData.MZ}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'实际居住地'"></label>
          <span>{{personData.SJJZDMC}}</span>
        </el-col>
        <el-col :span="12" class="compact__item">
          <label v-html="'身份证号码'"></label>
          <span>{{personData.SFZH}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'出生日期'"></label>
          <span>{{personData.CSRQ}}</span>
        </el-col>
        <el-col :span="12" class="compact__item">
          <label v-html="'户籍所在地地址'"></label>
          <span>{{personData.HJSZDMC}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'违法犯罪事实'"></label>
          <span>{{personData.WFFZSS}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'查获地点'"></label>
          <span>{{personData.CHDD}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'查获单位'"></label>
          <span>{{personData.CHDW}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'别名绰号'"></label>
          <span>{{personData.BMCH}}</span>
        </el-col>
        <el-col :span="12" class="compact__item">
          <label v-html="'初次查获时间'"></label>
          <span>{{personData.CCCHSJ}}</span>
        </el-col>
        <el-col :span="24" class="compact__item">
          <label v-html="'市级居住地详址'"></label>
          <span>{{personData.SJJZDXXDZ}}</span>
        </el-col>
        <el-col :span="24" class="compact__item">
          <label v-html="'户籍所在地详细地址'"></label>
          <span>{{personData.HJSZDXXDZ}}</span>
        </el-col>
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
    position: relative;
    // width: calc(100% - 80px);
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
            width: 90px;
            padding: 10px;
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
// fetchDrugList
import { FETCH_DRUG_LIST } from '../../../../store/types'
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
        SJJZDMC: data.SJJZDMC || '', // 实际居住地
        HJSZDXXDZ: data.HJSZDXXDZ || '', // 户籍所在地详细地址
        WFFZSS: data.WFFZSS || '', // 违法犯罪事实
        CHDD: data.CHDD || '', // 查获地点
        SF: data.SF || '', // 身份
        MZ: data.MZ || '', // 民族
        CSRQ: data.CSRQ || '', // 出生日期
        CHDW: data.CHDW || '', // 查获单位
        BMCH: data.BMCH || '', // 别名绰号
        XM: data.XM || '', // 姓名
        XBMC: data.XBMC || '', // 性别
        CCCHSJ: data.CCCHSJ || '', //  初次查获时间
        SJJZDXXDZ: data.SJJZDXXDZ || '', // 市级居住地详址
        SFZH: data.SFZH || '', // 身份证号
        WHCD: data.WHCD || '', // 文化程度
        HJSZDMC: data.HJSZDMC || '' // 户籍所在地详细地址HJSZDMC
      }
      return res
    }
  },
  watch: {
    searchVal(val) {
      this.personData = this.handleData({})
      this.loading = true
      this.dispatch(FETCH_DRUG_LIST, { 'sfzh': val })
        .then(() => {
          if(this.analysisDataQuery.drugList && this.analysisDataQuery.drugList.XM) {
            this.flag = true
            this.loading = false
            this.$emit('update-search-tip', false, false)
            this.personData = this.handleData(this.analysisDataQuery.drugList)
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
