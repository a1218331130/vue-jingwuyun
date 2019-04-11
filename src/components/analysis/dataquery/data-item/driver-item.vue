<template>
<div class="result-item" v-show="flag">
  <div class="result-item-flex">
    <div class="result-info">
      <div class="compact_title">驾驶证信息</div>
      <div class="info-base" style="position:relative" v-show="flag">
        <el-col :span="8" class="compact__item">
          <label v-html="'姓名'"></label>
          <span>{{personData.XM}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'身份证种类'"></label>
          <span>{{personData.SFZJZLMC}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'性别'"></label>
          <span>{{personData.XBMC}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'发证机关'"></label>
          <span>{{personData.FZJG}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'国籍'"></label>
          <span>{{personData.GJMC}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'驾驶证状态'"></label>
          <span>{{personData.JSZZTMC}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'准驾车型'"></label>
          <span>{{personData.ZJCXMC}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'联系电话'"></label>
          <span>{{personData.LXDH}}</span>
        </el-col>
        <el-col :span="12" class="compact__item">
          <label v-html="'出生日期'"></label>
          <span>{{personData.CSRQ}}</span>
        </el-col>
        <el-col :span="12" class="compact__item">
          <label v-html="'有效起始日期'"></label>
          <span>{{personData.JSZYXQSRQ}}</span>
        </el-col>
        <el-col :span="12" class="compact__item">
          <label v-html="'有效终止日期'"></label>
          <span>{{personData.JSZYXQSRQ}}</span>
        </el-col>
        <el-col :span="12" class="compact__item">
          <label v-html="'初次领证日期'"></label>
          <span>{{personData.CCLZRQ}}</span>
        </el-col>
        <!-- <el-col :span='12' class="compact__item">
          <label v-html="'身份证号码'"></label>
          <span>{{personData.SFZH}}</span>
        </el-col> -->
        <el-col :span="12" class="compact__item">
          <label v-html="'驾驶证号'"></label>
          <span>{{personData.JSZH}}</span>
        </el-col>
        <el-col :span="8" class="compact__item">
          <label v-html="'档案编号'"></label>
          <span>{{personData.DABH}}</span>
        </el-col>
        <el-col :span="24" class="compact__item">
          <label v-html="'现住址详址'"></label>
          <span>{{personData.XZZXZ}}</span>
        </el-col>
        <el-col :span="24" class="compact__item">
          <label v-html="'登记住址详址'"></label>
          <span>{{personData.DJZZXZ}}</span>
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
// listByPersonInfo fetchPersonList
import { FETCH_DRIVER_LIST } from '../../../../store/types'
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
        SFZJZLMC: data.SFZJZLMC || '', // 身份证件种类名称
        LXDH: data.LXDH || '', // 联系电话
        JSZYXQSRQ: data.JSZYXQSRQ || '', // 驾驶证有效起始日期
        CSRQ: data.CSRQ || '', // 出生日期
        XM: data.XM || '', // 姓名
        FZJG: data.FZJG || '', // 发证机关
        XBMC: data.XBMC || '', // 性别
        JSZH: data.JSZH || '', // 驾驶证号
        DABH: data.DABH || '', // 档案编号
        XZZXZ: data.XZZXZ || '', // 现住址详址
        CCCHSJ: data.CCCHSJ || '', //  初次查获时间
        DJZZXZ: data.DJZZXZ || '', // 登记住址详址
        JSZZTMC: data.JSZZTMC || '', // 驾驶证状态
        JSZYXZZRQ: data.JSZYXZZRQ || '', // 驾驶证有效终止日期
        GJMC: data.GJMC || '', // 国籍
        CCLZRQ: data.CCLZRQ || '', // 初次领证日期
        ZJCXMC: data.ZJCXMC || '' // 准驾车型
      }
      return res
    }
  },
  watch: {
    searchVal(val) {
      this.loading = true
      this.personData = this.handleData({})
      this.dispatch(FETCH_DRIVER_LIST, { 'sfzh': val })
        .then(() => {
          if(this.analysisDataQuery.driverList && this.analysisDataQuery.driverList.XM) {
            this.loading = false
            this.flag = true
            this.$emit('update-search-tip', false, false)
            this.personData = this.handleData(this.analysisDataQuery.driverList)
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
