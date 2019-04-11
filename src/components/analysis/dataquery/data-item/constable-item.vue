<template>
<div class="result-item" v-show="flag">
  <div class="result-item-flex">
    <div class="result-info">
      <div class="compact_title">警员信息</div>
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
          <label v-html="'民族'"></label>
          <span>{{personData.MZ}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'警号'"></label>
          <span>{{personData.JH}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'单位代码'"></label>
          <span>{{personData.DWDM}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'籍贯'"></label>
          <span>{{personData.JG}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'出生日期'"></label>
          <span>{{personData.CSRQ}}</span>
        </el-col>
        <el-col :span="12" class="compact__item">
          <label v-html="'身份证号'"></label>
          <span class="hover-menu" data-type="idCard">{{personData.SFZH}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'户籍地'"></label>
          <span>{{personData.HJD}}</span>
        </el-col>

        <el-col :span="8" class="compact__item">
          <label v-html="'人员类别状态'"></label>
          <span>{{personData.RYLBZT}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'健康状况'"></label>
          <span>{{personData.JKZK}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'参加公安工作日期'"></label>
          <span>{{personData.CJGAGZRQ}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'参加工作日期'"></label>
          <span>{{personData.CJGZRQ}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'政治面貌'"></label>
          <span>{{personData.ZZMM}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'婚姻状况'"></label>
          <span>{{personData.HYZK}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'爱好'"></label>
          <span>{{personData.AH}}</span>
        </el-col>
        <el-col :span="24" class="compact__item">
          <label v-html="'户籍地详址'"></label>
          <span>{{personData.HJDXZ}}</span>
        </el-col>
        <el-col :span="24" class="compact__item">
          <label v-html="'工作单位'"></label>
          <span>{{personData.GZDW}}</span>
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
  // fetchPoliceList
  import { FETCH_POLICE_LIST } from '../../../../store/types'
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
          MZ: data.MZ || '', // 民族
          HJD: data.HJD || '', // 户籍地
          RYLBZT: data.RYLBZT || '', // 人员类别状态
          CJGAGZRQ: data.CJGAGZRQ || '', // 参加公安工作日期
          JKZK: data.JKZK || '', // 健康状况
          CJGZRQ: data.CJGZRQ || '', // 参加工作日期
          DWDM: data.DWDM || '', // 单位代码
          ZC: data.ZC || '', // 专长
          CSRQ: data.CSRQ || '', // 出生日期
          ZZMM: data.ZZMM || '', // 政治面貌
          XM: data.XM || '', // 姓名
          HYZK: data.HYZK || '', // 婚姻状况
          XB: data.XB || '', // 性别
          AH: data.AH || '', // 爱好
          GZDW: data.GZDW || '', // 工作单位
          SFZH: data.SFZH || '', //  身份证号
          HJDXZ: data.HJDXZ || '', // 户籍地详址
          JG: data.JG || '', // 籍贯
          JH: data.JH || '' // 警号
        }
        return res
      }
    },
    watch: {
      searchVal(val) {
        this.loading = true
        this.personData = this.handleData({})
        this.dispatch(FETCH_POLICE_LIST, { 'sfzh': val })
          .then(() => {
            if (this.analysisDataQuery.policeList && this.analysisDataQuery.policeList.XM) {
              this.flag = true
              this.loading = false
              this.$emit('update-search-tip', false, false)
              this.personData = this.handleData(this.analysisDataQuery.policeList)
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
