<!--战法左边条件筛选组件-->
<template>
<div :class="{tactics:true, sidebar:true, light:mode==='surveillance', shrink:showLeftBar===false}">
  <div class="wrap-box" v-show="showLeftBar===true">
    <card-header v-show="mode===''" title="战法应用条件"></card-header>
    <div v-show="mode==='surveillance'" class="top-title">战法应用条件</div>
    <div class="wrap-box__content">
      <!-- :rules="rules"  -->
      <el-form v-if="form!==null && query.length>0" ref="queryForm" :model="form" :rules="rules" label-width="110px">
        <el-form-item v-for="(item,i) in query" ref="formItem" :key="i" :prop="item.column" :label="item.label">
          <!-- 文本输入框 -->
          <el-input v-if="item.type==='input'" v-model="form[item.column]" style="width:190px;"></el-input>
          <!-- 数字输入框 -->
          <el-input-number v-if="item.type==='number'" v-model="form[item.column]" :min="item.standrd||0" size="small" style="width:100px;"></el-input-number>

          <!-- 日期选择 -->
          <el-date-picker v-if=" item.type==='datetime' ||item.type==='date' " :type="item.type " v-model="dates[item.column] " @change="val=>form[item.column]=val" :editable="false" style="width:190px;"></el-date-picker>

          <!-- 日期范围选择 -->
          <el-date-picker v-if="item.type==='daterange'" type="daterange" v-model="dates[item.column]" range-separator=" 至 " :editable="false" :picker-options="pickerOptions" @change="val=>updateDateSlot(item.column, val)" placeholder="选择日期范围" style="width:190px; font-size:12px;"></el-date-picker>

          <!-- 时间范围选择 -->
          <el-time-picker v-if="item.type==='timerange'" v-model="times[item.column+'_start']" :editable="true" @change="val=>updateTimeSlot(item.column,'start', val)" placeholder="开始" style="width:93px;"></el-time-picker>
          <el-time-picker v-if="item.type==='timerange'" v-model="times[item.column+'_end']" :editable="true" @change="val=>updateTimeSlot(item.column,'end', val)" placeholder="结束" style="width:93px;"></el-time-picker>

          <el-select v-if="item.type==='xb'" v-model="form[item.column]" style="width:190px;">
            <el-option v-for="(ops,i) in sex" :key="i" :label="ops.label" :value="ops.value"></el-option>
          </el-select>
          
          <!-- 下拉菜单 -->
          <el-select v-if="item.type==='select' && dictList!==null" v-model="form[item.column]" style="width:190px;">
            <el-option v-for="(ops,i) in dictList[item.options]" :key="i" :label="ops.label" :value="ops.value"></el-option>
          </el-select>

          <!-- 酒店选择 -->
          <hotel-selector v-if="item.type==='hotelSelector'" v-model="form[item.column]" @update:data="updateData"style="width:190px;"></hotel-selector>

          <!-- 区划选择 -->
          <area-spc-selector v-if="item.type==='areaSelector'" v-model="form[item.column]"@update:data="updateData" style="width:210px;"></area-spc-selector>

          <!-- 区划酒店选择 -->
          <area-hotel-selector v-if="item.type==='bbb'" v-model="form[item.column]"@update:data="updateData" style="width:190px;"></area-hotel-selector>

          <!-- 区域网吧选择-->
          <internet-bar-selector v-if="item.type==='internetBar'" v-model="form[item.column]"@update:data="updateData" style="width:190px;"></internet-bar-selector>

          <div class="" style="color:#ccc;">{{item.readme}}</div>
        </el-form-item>
      </el-form>
    </div>
    <!-- </div>
  <div class="wrap-box">
    <card-header title="附件上传"></card-header> -->
    <div class="wrap-box__content" style="display:none;">
      <el-upload action="" :auto-upload="false" :on-perview="perview()" :on-remove="remove()" :file-list="fileList" list-type="picture">
        <el-button type="primary">上传附件</el-button>
        <!-- <el-button class="btn--tel" type="">话单导入</el-button>
        <el-button class="btn--bill" type="">账单导入</el-button>
        <el-button class="btn--other" type="">其他附件</el-button> -->
      </el-upload>
    </div>
    <hr v-show="mode===''" />
  </div>
  <el-button v-show="mode==='surveillance'" type="default" icon="icon iconfont icon-praise_fill" @click="action('draft')" style="margin-left:80px;display:inline-block;">保存草稿</el-button>
  <el-button v-show="mode==='surveillance'" type="primary" icon="icon iconfont icon-praise_fill" @click="action" style="margin:10px auto; display:inline-block;">提交申请</el-button>

  <div v-if="hideButton===false" class="btn-box">
    <el-button v-show="showLeftBar===true" type="primary" icon="search" @click="action">启动战法</el-button>
    <div :class="{'app-side-bar__fold':true, 'el-icon-d-arrow-left':showLeftBar===true,'el-icon-d-arrow-right':showLeftBar===false,}" @click="switchLieftBar"></div>
  </div>
</div>
</template>
<style lang="scss" scoped>
  .sidebar {
    background: #1c7dc6;
    height: calc(100vh - 40px);
    position: relative;
    &.shrink {}
    .wrap-box {
      padding: 0 10px;
      .header-tool {
        color: #fff;
      }
      &__content {
        padding: 10px 0;
        .el-button--backup {
          text-align: center;
          padding: 0;
          border: 0;
          &:before {
            content: '';
            background: url('/static/img/sb_icons.jpg') no-repeat 0 0;
            width: 40px;
            height: 45px;
            display: block;
          }
          &.btn--tel {
            &:before {
              background-position: 0 0;
            }
          }
          &.btn--bill {
            &:before {
              background-position: -46px 0;
            }
          }
          &.btn--other {
            &:before {
              background-position: -87px 0;
            }
          }
          .el-form label {
            color: #fff;
          }
        }
      }
      hr {
        border-style: dashed;
      }
      .spc-date-range {
        width: 230px;
      }
    }
    .btn-box {
      text-align: center;
      width: 100%;
      height: 78px;
      position: absolute;
      bottom: 0;
      left: 0;
      .el-button {
        background: #ff8a3e;
        font-weight: bold;
        width: 80%;
        height: 35px;
        line-height: 35px;
        padding: 0;
        border: 1px solid #51a7e6;
        border-left-color: #fff;
        border-radius: 0;
      }
      .app-side-bar__fold {
        background: #3a91d2;
        color: #fff;
        height: 30px;
        line-height: 30px;
        opacity: 0.8;
        &:hover {
          color: #fff;
          opacity: 1;
        }
      }
    }
    &.light {
      .wrap-box {
        .header-tool {
          color: #666;
        }
      }
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { GET_TACTICS_QUERY, GET_SURVEILLANCE_TACTICS_QUERY } from '../../../store/types'

  import mixin from '../../../utils/mixin'
  import { clone } from '../../../utils/util'

  import cardHeader from '../../../widgets/card-header/card-header'
  import hotelSelector from '../../../widgets/hotel-selector/hotel-selector' // 酒店选择
  import areaSpcSelector from '../../../widgets/area-spc-selector/area-spc-selector' // 地域选择
  import areaHotelSelector from '../../../widgets/area-hotel-selector/area-hotel-selector' // 地域酒店选择
  import internetBarSelector from '../internet-bar-selector' // 网吧筛选

  export default {
    mixins: [mixin],
    components: {
      cardHeader,
      hotelSelector,
      areaSpcSelector,
      areaHotelSelector,
      internetBarSelector
    },
    data() {
      return {
        showLeftBar: true,
        hideX: false,
        dictList: null,
        fileList: [],
        dates: {},
        times: {},
        form: null,
        rules: {},
        query: [],
        sex: [{ label: '请选择', value: '' }, { label: '男', value: 1 }, { label: '女', value: 2 }]
      }
    },
    props: {
      isWestCollapsed: {
        type: Boolean,
        default: true
      },
      id: {
        type: String,
        default: ''
      },
      mode: {
        type: String,
        default: ''
      },
      hideButton: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapState(['tactics', 'surveillance'])
    },
    watch: {
      isWestCollapsed(val) {
        this.showLeftBar = val
      }
    },
    methods: {
      switchLieftBar() {
        // this.showLeftBar = !this.showLeftBar
        this.$emit('call:switch')
      },
      setForm() {
        let res, dates, times
        if (this.query.length > 0) {
          res = {}
          dates = {}
          times = {}
          this.query.forEach(d => {
            let nowDate = new Date(),
              subDate = new Date()
            res[d.column] = d.dataType === 'Array' ? [] : ''
            if (d.dataType !== 'Array' && d.defaultValue !== '') {
              res[d.column] = d.defaultValue
            }
            if (d.type === 'datetime' || d.type === 'date') {
              dates[d.column] = ''
            } else if (d.type === 'daterange') {
              dates[d.column] = [subDate.setDate(nowDate.getDate() - 30), nowDate]
              res[d.column] = `${this.dateFormat(subDate, 'yyyyMMdd')}T${this.dateFormat(nowDate, 'yyyyMMdd')}`
              // 日期段组件时间限制
              // || time.getTime() < (dates[d.column][0] - 3600 * 1000 * 24)
              this.pickerOptions['disabledDate'] = (time) => {
                return time.getTime() > Date.now()
              }
              this.pickerOptions.shortcuts = this.pickerOptions.shortcuts.splice(0, 2);
            } else if (d.type === 'timerange') {
              times[d.column] = ''
              if (d.defaultValue !== '') {
                // 时间范围, 默认值
                let soltArray = d.defaultValue.split('&'),
                  startArray = soltArray[0].split(':'),
                  endArray = soltArray[1].split(':')
                res[d.column] = d.defaultValue
                times[d.column + '_start'] = new Date(2017, 12, 25, parseInt(startArray[0]), parseInt(startArray[1]))
                times[d.column + '_end'] = new Date(2017, 12, 25, parseInt(endArray[0]), parseInt(endArray[1]))
              }
            }
            if (d.required === true) {
              this.rules[d.column] = [{ required: d.required, message: `${d.label}不能为空`, trigger: 'blur' }]
            }
          })
        } else {
          dates = null
          times = null
          res = null
        }
        this.dates = dates
        this.times = times
        this.form = clone(res)
      },
      updateData(val) {
        val.areamc ? this.form.areamc = val.areamc : ''
        val.hotelmc ? this.form.hotelmc = val.hotelmc : ''
        val.wbmc ? this.form.wbmc = val.wbmc : ''
      },
      action(val) {
        let type = '';
        if (this.checkRule('zfsc/library/qdzf') === true) {
          this.$refs.queryForm.validate((valid) => {
            if (valid === true) {
              let form = clone(this.form)
              this.query.forEach(d => {
                if (d.type === 'date') {
                  form[d.column] = form[d.column].split('-').join('')
                } else if (this.mode === 'internetBar') {
                  this.form.wbmc = this.form[d.column].wbmc
                } else if (this.mode === 'bbb') {
                  this.form.hotelmc = this.form[d.column].hotelmc
                }
              })
              if (val === 'draft') {
                type = 'draft'
              }
              let arr = [],
                jsonData = { name: '', value: '' };
              this.query.map(item => {
                if (item.column === 'v_bbb') {
                  jsonData.name = item.label
                  jsonData.value = this.form.areamc + this.form.hotelmc
                  arr.push(jsonData)
                  jsonData = { name: '', value: '' };
                } else if (item.column === 'v_xzqh') {
                  jsonData.name = item.label
                  if (!this.form.wbmc) {
                    this.form.wbmc = '';
                  }
                  jsonData.value = this.form.areamc + this.form.wbmc
                  arr.push(jsonData)
                  jsonData = { name: '', value: '' };
                } else if (item.column === 'v_xb') {
                  jsonData.name = item.label
                  let values = '女'
                  if (this.form.v_xb === 1) {
                    values = '男'
                  }
                  jsonData.value = values
                  arr.push(jsonData)
                  jsonData = { name: '', value: '' };
                } else {
                  jsonData.name = item.label
                  jsonData.value = this.form[item.column]
                  arr.push(jsonData)
                  jsonData = { name: '', value: '' };
                }
              })
              form.tj = arr;
              if (this.mode === 'surveillance') {
                this.$emit('call:list', { form: form, query: this.query, type: type })
              } else {
                this.$emit('call:list', form)
              }
            } else {
              return false
            }
          })
        }
      },
      updateDateSlot(column, val) {
        let startTime, endTime, timer;
        startTime = val.split(' 至 ')[0];
        endTime = val.split(' 至 ')[1];
        timer = this.query[0].standrd / 30;
        if ((new Date(endTime) - new Date(startTime)) / 3600 / 1000 / 24 > this.query[0].standrd) {
          this.$alert(`您选择的日期范围不合法,请选择 ${timer} 个月之间的日期`, '温馨提示');
          return false;
        }
        this.form[column] = val !== '' ? val.split(' 至 ').map(d => d.split('-').join('')).join('T') : []
      },
      updateTimeSlot(column, type, val) {
        let startTime = this.times[column + '_start'],
          endTime = this.times[column + '_end'],
          res = [!startTime ? '' : `${this.fillZero(startTime.getHours())}${this.fillZero(startTime.getMinutes())}${this.fillZero(startTime.getSeconds())}`, !endTime ? '' : `${this.fillZero(endTime.getHours())}${this.fillZero(endTime.getMinutes())}${this.fillZero(endTime.getSeconds())}`]
        this.form[column] = res.join('T')
      },
      fillZero(int) {
        let res = int + ''
        if (int < 10) {
          res = '0' + int
        }
        return res
      },
      perview(file) {},
      remove(file, fileList) {},
      getQueryForm() {
        if (this.mode === 'surveillance') {
          if (this.checkRule('bkyj/warn/zfyytj') === true) {
            this.dispatch(GET_SURVEILLANCE_TACTICS_QUERY, {
              'zfid': this.id || this.$route.query.id
            }).then(() => {
              this.handleRes(this.surveillance.tacticsQuery)
            })
          }
        } else {
          if (this.checkRule('zfsc/library/zfyytj') === true) {
            this.dispatch(GET_TACTICS_QUERY, {
              'zfid': this.id || this.$route.query.id
            }).then(() => {
              this.handleRes(this.tactics.query)
            })
          }
        }
      },
      handleRes(res) {
        this.query = res.map(d => {
          return {
            cate: d.LX || d.lx, // 类型
            label: d.LABEL || d.label, // 中文名
            column: d.COL || d.col, // 后提交条件的参数key名
            dataType: d.CSLX || d.cslx, // 参数类型
            options: d.ZDLX || d.zdlx,
            readme: d.README || d.readme,
            required: d.SFBT || d.sfbt,
            defaultValue: d.MRZ || d.mrz || '',
            type: d.TYPE || d.type,
            zfid: this.id || this.$route.query.id,
            calname: d.calname || '',
            zfgcmc: d.zfgcmc || '',
            cslx: d.cslx || '',
            px: d.px || '',
            standrd: d.STANDARD || d.standrd,
            csz: ''
          }
        })
        if (!this.query.find(d => d.options !== null)) {
          this.setForm()
        } else {
          this.getDict(this.query.filter(d => d.options !== null).map(d => d.options), true).then(res => {
            this.dictList = res
            this.setForm()
          })
        }
      }
    },
    created() {
      this.getQueryForm()
    },
    mounted() {}
  }

</script>
