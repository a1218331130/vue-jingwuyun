<!-- 旧版, 弃用 -->
<template>
<div class="sidebar">
  <div class="wrap-box">
    <card-header title="战法应用条件"></card-header>
    <div class="wrap-box__content">
      <!-- :rules="rules"  -->
      <el-form v-if="form!==null && query.length>0" ref="queryForm" :model="form" label-width="110px">
        <el-form-item v-for="(item,i) in query" :key="i" :prop="item.column" :label="item.label">
          <!-- 输入框 -->
          <el-input v-if="item.type==='input'" v-model="form[item.column]"></el-input>
          <span>{{item}}</span>
          <!-- 日期选择 -->
          <el-date-picker v-if="item.type==='datetime'||item.type==='date'" :type="item.type" v-model="dates[item.column]" @change="val=>form[item.column]=val" :editable="false"></el-date-picker>

          <!-- 下拉菜单 -->
          <el-select v-if="item.type==='select' && dictList!==null" v-model="form[item.column]">
            <el-option v-for="(ops,i) in dictList[item.options]" :key="i" :label="ops.label" :value="ops.value"></el-option>
          </el-select>

          <el-select v-if="item.type==='xb' && dictList!==null" v-model="form[item.column]" style="width:190px;">
            <el-option v-for="(ops,i) in sex" :key="i" :label="ops.label" :value="ops.value"></el-option>
          </el-select>

          <hotel-selector v-if="item.type==='hotelSelector'" v-model="form[item.column] "></hotel-selector>

          <area-spc-selector v-if="item.type==='areaSelector'" v-model="form[item.column] "></area-spc-selector>

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
    <hr>
  </div>

  <div class="btn-box">
    <el-button type="primary" icon="search" @click="action">启动战法</el-button>
  </div>
</div>
</template>
<style lang="scss" scoped>
  .sidebar {
    height: calc(100% - 10px);
    position: relative;
    .wrap-box {
      margin: 10px 0;
      padding: 0 10px;
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
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      .el-button {
        background: #f9873b;
        width: 100%;
        height: 40px;
        border: 0;
      }
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { GET_TACTICS_QUERY } from '../../../store/types'

  import mixin from '../../../utils/mixin'
  // replaceAll
  import { clone } from '../../../utils/util'

  import cardHeader from '../../../widgets/card-header/card-header'
  import hotelSelector from '../../../widgets/hotel-selector/hotel-selector'
  import areaSpcSelector from '../../../widgets/area-spc-selector/area-spc-selector'

  export default {
    mixins: [mixin],
    components: {
      cardHeader,
      hotelSelector,
      areaSpcSelector
    },
    data() {
      return {
        test: '',
        dictList: null,
        fileList: [],
        dates: {},
        form: null,
        rules: {},
        query: [],
        sex: [{ label: '请选择', value: '' }, { label: '男', value: 1 }, { label: '女', value: 2 }]
      }
    },
    props: [],
    computed: {
      ...mapState(['tactics'])
    },
    methods: {
      setForm() {
        let res, dates
        if (this.query.length > 0) {
          res = {}
          dates = {}
          this.query.forEach(d => {
            res[d.column] = d.dataType === 'Array' ? [] : ''
            if (d.type === 'date') {
              dates[d.column] = ''
            } else {
              this.rules[d.column] = [{ required: true, message: `${d.label}不能为空`, trigger: 'blur' }]
            }
          })
        } else {
          dates = null
          res = null
        }
        this.dates = dates
        this.form = res
      },
      action() {
        if (this.checkRule('zfsc/library/qdzf') === true) {
          // this.$refs.queryForm.validate((valid) => {
          // if (valid === true) {
          let form = clone(this.form)
          this.query.forEach(d => {
            if (d.type === 'date') {
              // form[d.column] = form[d.column] !== '' ? form[d.column].split('T')[0] : ''
              form[d.column] = form[d.column].split('-').join('')
            }
          })
          this.$emit('call:list', form)
          // } else {
          //   return false
          // }
          // })
        }
      },
      perview(file) {},
      remove(file, fileList) {}
    },
    created() {

    },
    mounted() {
      if (this.checkRule('zfsc/library/zfyytj') === true) {
        this.dispatch(GET_TACTICS_QUERY, {
          'zfid': this.$route.query.id
        }).then(() => {
          this.query = this.tactics.query.map(d => {
            return {
              cate: d.LX, // 类型
              label: d.LABEL, // 中文名
              column: d.COL, // 后提交条件的参数key名
              dataType: d.CSLX, // 参数类型
              options: d.ZDLX,
              type: d.TYPE //
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
        })
      }
      console.log(this.query, 'leftSide query2017')
    }
  }

</script>
