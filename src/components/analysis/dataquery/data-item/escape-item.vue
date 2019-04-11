<template>
<div class="result-item" v-show="flag">
  <div class="result-item-flex">
    <div class="result-info">
      <div class="compact_title">在逃人员信息</div>
      <div class="info-base" style="position:relative" v-show="flag">
        <el-col :span="8" class="compact__item">
          <label v-html="'姓名'"></label>
          <span>{{personData.XM}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'性别'"></label>
          <span>{{personData.XB}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'身高'"></label>
          <span>{{personData.SG}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'档案编号'"></label>
          <span>{{personData.AJLB}}</span>
        </el-col>
        <el-col :span="12" class="compact__item">
          <label v-html="'联系人电话'"></label>
          <span>{{personData.LXRDH}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'督捕级别'"></label>
          <span>{{personData.DBJB}}</span>
        </el-col>
        <el-col :span="12" class="compact__item">
          <label v-html="'出生日期'"></label>
          <span>{{personData.CSRQ}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'汉语口音'"></label>
          <span>{{personData.HYKY}}</span>
        </el-col>
        <el-col :span="12" class="compact__item">
          <label v-html="'身份证号码'"></label>
          <span class="hover-menu" data-type="idCard">{{personData.SFZH}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'案件类别'"></label>
          <span>{{personData.AJLB}}</span>
        </el-col>
        <el-col :span="12" class="compact__item">
          <label v-html="'现住省市县'"></label>
          <span>{{personData.XZSSXQ}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'国内通缉编号'"></label>
          <span>{{personData.GNTJBH}}</span>
        </el-col>
        <el-col :span="14" class="compact__item">
          <label v-html="'人员编号'"></label>
          <span>{{personData.RYBH}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'立案省市县区'"></label>
          <span>{{personData.LASSXQ}}</span>
        </el-col>
        <el-col :span="14" class="compact__item">
          <label v-html="'案件编号'"></label>
          <span class="hover-menu" data-type="case">{{personData.AJBH}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'户籍地省市县区'"></label>
          <span>{{personData.HJDSSXQ}}</span>
        </el-col>
        <el-col :span="12" class="compact__item">
          <label v-html="'立案单位名称'"></label>
          <span>{{personData.LADWMC}}</span>
        </el-col>
        <el-col :span="12" class="compact__item">
          <label v-html="'逃跑日期'"></label>
          <span>{{personData.TPRQ}}</span>
        </el-col>
        <el-col :span="24" class="compact__item">
          <label v-html="'现住详细地址'"></label>
          <span>{{personData.XZXXDZ}}</span>
        </el-col>
        <el-col :span="24" class="compact__item">
          <label v-html="'简要案情'"></label>
          <span>{{personData.JYAQ}}</span>
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
    position: relative; // width: calc(100% - 80px);
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
  // fetchEscapeList
  import { FETCH_ESCAPE_LIST } from '../../../../store/types'
  import mixin from '../../../../utils/mixin'
  export default {
    components: {},
    mixins: [mixin],
    data() {
      return {
        flag: false,
        personData: {}, // 信息数据
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
          LXRDH: data.LXRDH || '', // 联系人电话
          DBJB: data.DBJB || '', // 督捕级别
          SG: data.SG || '', // 身高
          XZXXDZ: data.XZXXDZ || '', // 现住详细地址
          AJLB: data.AJLB || '', // 案件类别
          XZSSXQ: data.XZSSXQ || '', // 现住省市县
          CSRQ: data.CSRQ || '', // 出生日期
          AJBH: data.AJBH || '', // 案件编号
          XM: data.XM || '', // 姓名
          XB: data.XB || '', // 性别
          RYBH: data.RYBH || '', //  人员编号
          LASSXQ: data.LASSXQ || '', // 立案省市县区
          GNTJBH: data.GNTJBH || '', // 国内通缉编号
          HJDSSXQ: data.HJDSSXQ || '', // 户籍地省市县取区
          SFZH: data.SFZH || '', // 身份证号
          LADWMC: data.LADWMC || '', // 立案单位名称
          TPRQ: data.TPRQ || '', // 逃跑日期
          JYAQ: data.JYAQ || '', // 简要案情
          HYKY: data.HYKY || '' // 汉语口音
        }
        return res
      }
    },
    watch: {
      searchVal(val) {
        this.loading = true
        this.personData = this.handleData({})
        this.dispatch(FETCH_ESCAPE_LIST, { 'sfzh': val })
          .then(() => {
            if (this.analysisDataQuery.escapeList && this.analysisDataQuery.escapeList.XM) {
              this.loading = false
              this.flag = true
              this.$emit('update-search-tip', false, false)
              this.personData = this.handleData(this.analysisDataQuery.escapeList)
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
