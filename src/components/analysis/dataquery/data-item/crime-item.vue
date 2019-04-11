<template>
<div class="result-item" v-show="flag">
  <div class="result-item-flex">
    <div class="result-info clear">
      <div class="compact_title">违法犯罪人员信息</div>
      <div class="info-base" style="position:relative" v-if="flag">
        <el-col :span="5" class="compact__item img">
          <img :src="`${personImagePath}${personData[0].SFZH}`" onerror="this.src='/static/img/default_person.jpg'" alt="">
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'姓名'"></label>
          <span>{{personData[0].XM}}</span>
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'曾用名'"></label>
          <span>{{personData[0].CYM}}</span>
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'性别'"></label>
          <span>{{personData[0].XB}}</span>
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'民族'"></label>
          <span>{{personData[0].MZ}}</span>
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'身高'"></label>
          <span>{{personData[0].SG}}</span>
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'足长'"></label>
          <span>{{personData[0].ZC}}</span>
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'姓名拼音'"></label>
          <span>{{personData[0].XMPY}}</span>
        </el-col>
        <el-col :span="11" class="compact__item">
          <label v-html="'出生日期'"></label>
          <span>{{personData[0].CSRQ}}</span>
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'专长'"></label>
          <span>{{personData[0].ZHUANC}}</span>
        </el-col>
        <!-- <el-col :span="6" class="compact__item">
          <label v-html="'身份'"></label>
          <span>{{personData[0].SF}}</span>
        </el-col> -->
        <el-col :span="13" class="compact__item">
          <label v-html="'身份证号码'"></label>
          <span class="hover-menu" data-type="idCard">{{personData[0].SFZH}}</span>
        </el-col>
        <el-col :span="11" class="compact__item">
          <label v-html="'文化程度'"></label>
          <span>{{personData[0].WHCD}}</span>
        </el-col>
        <el-col :span="13" class="compact__item">
          <label v-html="'居住地区划名称'"></label>
          <span>{{personData[0].JZDQHMC}}</span>
        </el-col>
        <el-col :span="24" class="compact__item">
          <label v-html="'户籍地详址'"></label>
          <span>{{personData[0].HJDXZ}}</span>
        </el-col>
        <el-col :span="24" class="compact__item">
          <label v-html="'居住地详址'"></label>
          <span>{{personData[0].JZDXZ}}</span>
        </el-col>
        <!-- <el-col :span="6" class="compact__item">
          <label v-html="'入所原因'"></label>
          <span>{{personData[0].RSYY}}</span>
        </el-col>
        <el-col :span="6" class="compact__item">
          <label v-html="'出所原因'"></label>
          <span>{{personData[0].CSYY}}</span>
        </el-col> -->
        <!-- 案件详情 -->
        <div class="caseInfo clear" v-for="(elem,i) in personData" :key="i" v-show="i<showCount">
          <el-col :span="11" class="compact__item">
            <label v-html="'案件类别'"></label>
            <span>{{elem.AJLB}}</span>
          </el-col>
          <el-col :span="11" class="compact__item">
            <label v-html="'案件类别名称'"></label>
            <span>{{elem.AJLBMC}}</span>
          </el-col>
          <el-col :span="11" class="compact__item">
            <label v-html="'入库时间'"></label>
            <span>{{elem.RKSJ}}</span>
          </el-col>
          <el-col :span="13" class="compact__item">
            <label v-html="'案件编号'"></label>
            <span class="hover-menu" data-type="case">{{elem.AJBH}}</span>
          </el-col>
          <el-col :span="24" class="compact__item">
            <label v-html="'简要案情'"></label>
            <span>{{elem.JYAQ}}</span>
          </el-col>
          <div class="showMore" v-show="i===showCount-1&&personData.length>1" @click="showMore">
            <i :class="{'iconfont':true, 'icon-unfold1':!showflag,'icon-packup-2':showflag}"></i> {{showflag?'收起':'更多'}}
          </div>
        </div>

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
    min-height: 400px;
    font-size: 16px;
    overflow: hidden;
    padding-bottom: 30px;
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
      .caseInfo {
        float: left;
        background: #F4F4F4;
        width: 100%;
        position: relative;
        margin-bottom: 10px;
        .showMore {
          position: absolute;
          right: 0;
          bottom: -20px;
          font-size: 14px;
          cursor: pointer;
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
  // fetchCriminalList
  import { FETCH_CRIMINAL_LIST } from '../../../../store/types'
  import mixin from '../../../../utils/mixin'
  export default {
    components: {},
    mixins: [mixin],
    data() {
      return {
        personData: [], // 信息数据
        flag: false,
        tipWord: '暂无数据',
        // : 1, // 默认展开条数
        showflag: false // 展示更多标志
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
      // 展示更多
      showMore() {
        this.showflag = !this.showflag
        console.log(this.showCount, 'showCount')
      },
      // 设置personData默认值
      handleData(data) {
        let res = {
          CSYY: data.CSYYMC || data.cssyymc || '', // 出所原因
          JZDQH: data.JZDQH || data.jzdqh || '', // 居住地区划
          JZDQHMC: data.JZDQHMC || data.jzdqhmc || '', // 居住地区划名称
          CYM: data.CYM || data.cym || '', // 曾用名
          XP: data.XP || data.xp || '', // 相片
          SF: data.SFMC || data.sfmc || '', // 身份
          MZ: data.MZMC || data.mzmc || '', // 民族
          SG: data.SG || data.sg || '', // 身高
          ZHUANC: data.ZHUANCMC || data.zhuancmc || '', // 专长
          RKSJ: data.RKSJ || data.rksj || '', // 入库时间
          RSYY: data.RSYYMC || data.rsyymc || '', // 人所原因
          AJLB: data.AJLB || data.ajlb || '', // 案件类别
          AJLBMC: data.AJLBMC || data.ajlbmc || '', // 案件类别
          ZC: data.ZCMC || data.zcmc || '', // 足长
          CSRQ: data.CSRQ || data.csrq || '', // 出生日期
          XMPY: data.XMPY || data.xmpy || '', // 姓名拼音
          AJBH: data.AJBH || data.ajbh || '', // 案件编号
          XM: data.XM || data.xm || '', // 姓名
          XB: data.XBMC || data.xbmc || '', // 性别
          SFZH: data.SFZH || data.sfzh || '', //  户籍地详址
          HJDXZ: data.HJDXZ || data.hjdxz || '', // 户口所在地
          JYAQ: data.JYAQ || data.jyaq || '', // 简要案情
          WHCD: data.WHCDMC || data.whcdmc || '', // 文化程度
          JZDXZ: data.JZDXZ || data.jzdxz || '' // 居住地详址
        }
        return res
      }
    },
    watch: {
      searchVal(val) {
        this.loading = true
        this.personData = this.handleData({})
        this.dispatch(FETCH_CRIMINAL_LIST, { 'sfzh': val })
          .then(() => {
            if (this.analysisDataQuery.criminalList.length !== 0) {
              this.loading = false
              this.flag = true
              this.$emit('update-search-tip', false, false)
              this.personData = this.analysisDataQuery.criminalList.map(d => {
                let res = this.handleData(d)
                return res
              })
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
      // : 1, // 默认展开条数
      showCount() {
        if (this.showflag) {
          return this.personData.length
        } else {
          return 1
        }
      },
      ...mapState(['analysisDataQuery'])
    },
    mounted() {},
    created() {}
  }

</script>
