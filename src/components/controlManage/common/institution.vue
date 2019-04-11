<template>
  <div class="institution">
      <div class="institution__title">
        <span>单位信息</span>
      </div>
    <el-form class="institution__form" label-width="6.5rem" label-position="right" v-model="formInfo" :rules="rules">
      <el-row>
      <el-col :span="6">
        <el-form-item label="申请人">
          <el-input :disabled="true" v-model="formInfo.cjrxm" class="institution__input"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="申请单位">
          <el-input :disabled="true" v-model="formInfo.cjdwmc"  class="institution__input"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="申请时间">
          <el-input :disabled="true" v-model="formInfo.cjsj" class="institution__input"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="联系电话">
          <el-input :disabled="true" v-model="formInfo.lxdh" placeholder="请输入联系电话" class="institution__input"></el-input>
        </el-form-item>
      </el-col>
      
  </el-row>

    </el-form>
  </div>
</template>
<style lang="scss" scoped>
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
    &__input {
      width: 200px;
    }
  }

</style>
<script>
  import mixin from '../../../utils/mixin'
  import { mapState } from 'vuex'
  export default {
    mixins: [mixin],
    computed: {
      ...mapState(['users'])
    },
    data() {
      return {
        formInfo: {
          cjr: '',
          cjrxm: '',
          cjdw: '',
          cjdwmc: '',
          cjsj: '',
          lxdh: ''
        }
      }
    },
    props: ['flag', 'rules', 'data', 'status'],
    watch: {
      flag(newVal, oldVal) {
        if (this.status !== 1) {
          this.getInfo();
        } else {
          this.$emit('update:data', this.formInfo)
        }
      },
      'data.id': {
        handler() {
          if (this.status === 1) {
            this.getInfo();
          } else {
            this.formInfo = {
              cjr: this.data.cjr,
              cjrxm: this.data.cjrxm,
              cjdwmc: this.data.cjdwmc,
              cjdw: this.data.cjdw,
              cjsj: this.data.cjsj,
              lxdh: this.data.lxdh
            }
          }
        },
        deep: true
      }
    },
    methods: {
      formatTen(num) {
        return num > 9 ? (num + '') : ('0' + num);
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
      getInfo() {
        let time = new Date();
        this.formInfo = {
          cjr: this.userData.UserId,
          cjrxm: this.userData.UserName,
          cjdwmc: this.userData.DeptName,
          cjdw: this.userData.DeptNo,
          cjsj: `${time.getFullYear()}-${this.formatTen(time.getMonth() + 1)}-${this.formatTen(time.getDate())} ${time.getHours()}:${this.formatTen(time.getMinutes())}:${this.formatTen(time.getSeconds())}`,
          lxdh: this.userData.PhoneNum
        }
        this.$emit('update:data', this.formInfo)
      }
    },
    mounted() {
      if (this.status === 1) {
        this.getInfo();
      } else {
        this.formInfo = {
          cjr: this.data.cjr,
          cjrxm: this.data.cjrxm,
          cjdwmc: this.data.cjdwmc,
          cjdw: this.data.cjdw,
          cjsj: this.data.cjsj,
          lxdh: this.data.lxdh
        }
      }
    }
  }

</script>
