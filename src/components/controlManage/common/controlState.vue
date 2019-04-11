<template>
  <div class="institution">
      <div class="institution__title">
        <span>布控状态</span>
      </div>
    <el-form ref="form" class="institution__form" :model="controlInfo" label-width="6.5rem" label-position="right" :rules="rule">
      <el-row v-if="controlStatus ==='10'">
        <el-col :span="6">
          <el-form-item label="续控截止时间" prop="jssj">
            <el-date-picker v-model="controlInfo.jssj" type="date" placeholder="请选择续控结束时间" class="institution__input"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item :label="controlStatus==='11'?'撤控原因':'续控原因'" prop="jygk">
          <el-input v-model="controlInfo.jygk" resize="none" style="width:630px;" type="textarea" :placeholder="controlStatus==='11'?'请输入撤控原因':'请输入续控原因'"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
      <div class="index__foot">
    <el-button class="qiutBtn" @click="controlQiut">取消</el-button>
    <el-button class="sureBtn" @click="submitone(1)">{{controlStatus==='11'?'撤控':'续控'}}</el-button>
  </div>
  </div>
</template>
<style lang="scss" scoped>
  p {
    margin: 0;
    padding: 0;
  }

  .index__foot {
    width: 330px;
    position: relative;
    left: 50%;
    margin-top: 50px;
    margin-left: -165px;
    .qiutBtn {
      float: left;
      width: 90px;
    }
    .draftBtn {
      position: absolute;
      width: 90px;
      left: 50%;
      margin-left: -45px;
    }
    .sureBtn {
      float: right;
      width: 90px;
      color: white;
      background-color: #85c2e7;
    }
  }

  .el-col-5 {
    width: 19.83333%;
  }

  .institution {
    &__title {
      height: 30px;
      width: 100%;
      background-color: #85c2e7;
      line-height: 30px;
      >span {
        margin-left: 10px;
        color: white;
      }
    }
    &__form {
      border: 1px solid #ccc;
      border-top: none;
      padding-top: 20px;
      overflow: hidden;
      padding-left: 20px;
      background-color: white;
    }
    &__area {
      float: left;
    }
    &__p {
      float: left;
    }
    &__p:nth-child(1) {
      width: 95px;
      text-align: right;
      position: relative;
      bottom: 10px;
      padding-right: 5px;
    }
    &__p:nth-child(2) {
      width: calc(100% - 110px);
      border-bottom: 1px solid #ccc;
    }
    &__input {
      width: 200px;
    }
    &__img {
      height: 190px;
      width: 74%;
      margin-left: 13%;
      >img {
        height: 100%;
        width: 100%;
      }
    }
  }

</style>
<script>
  import { GET_CARREVOKE_CONTROL, GET_CARRENEW_WARN_CONTROL } from '../../../store/types'
  import mixin from '../../../utils/mixin'
  import { mapState } from 'vuex'
  export default {
    mixins: [mixin],
    data() {
      return {
        controlInfo: {
          jygk: '',
          jssj: ''
        },
        rule: {
          jygk: { required: true, message: '请输原因', trigger: 'blur' },
          jssj: { required: true, message: '请选择开始时间' }
        }
      }
    },
    computed: {
      ...mapState(['surveillance'])
    },
    props: ['data', 'controlStatus'],
    watch: {
      'data.id': {
        handler: function() {
          this.controlInfo = {
            jygk: '',
            jssj: ''
          }
        },
        deep: true
      }
    },
    methods: {
      changeData() {},
      controlQiut() {
        this.$emit('quit-event')
      },
      submitone() {
        console.log(this.data, 'this.data 3333333333333333333')
        this.$refs.form.validate((valid) => {
          if (valid) {
            let flag = true
            let messages = '';
            let jsonData = {
              sqr: this.userData.UserId,
              sqdw: this.userData.DeptNo,
              bkid: this.data.id,
              sqly: this.controlInfo.jygk
            }
            console.log(this.controlStatus, jsonData, 'this.controlStatus 2222222222222')
            if (this.controlStatus === '11') {
              jsonData.sqlx = 3
              messages = '撤控提交成功'
              this.dispatch(GET_CARREVOKE_CONTROL, jsonData).then(() => {
                if (this.surveillance.getCarrevokeControl === '已提交撤控申请') {
                  this.$alert(messages, '温馨提示')
                  this.controlQiut();
                }
              })
            } else if (this.controlStatus === '10') {
              messages = '续控提交成功'
              this.controlInfo.jssj = this.formatDate(this.controlInfo.jssj)
              jsonData.jssj = this.controlInfo.jssj
              flag = this.formatTime(this.data.jssj, this.controlInfo.jssj)
              jsonData.sqlx = 2
              if (flag) {
                this.dispatch(GET_CARRENEW_WARN_CONTROL, jsonData).then(() => {
                  if (this.surveillance.getCarrenewWarnControl === '已提交续控申请') {
                    this.$alert(messages, '温馨提示')
                    this.controlQiut();
                  }
                })
              }
            }
          }
        })
      },
      formatDate(date) {
        if (typeof date === 'string') {
          return date
        } else {
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate();
          return year + '-' + this.formatTen(month) + '-' + this.formatTen(day)
        }
      },
      formatTime(kssj, jssj) {
        let flag = true;
        let date = new Date(kssj)
        let enddate = new Date(jssj)
        if (date > enddate) {
          flag = false;
          this.$alert('续控结束时间应该大于当前结束时间，请重新输入', '温馨提示');
          jssj = ''
        }
        return flag
      },
      formatTen(num) {
        return num > 9 ? (num + '') : ('0' + num);
      }
    },
    mounted() {
      this.changeData()
    }
  }

</script>
