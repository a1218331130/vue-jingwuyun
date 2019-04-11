<template>
<div style="padding: 1% 5%">
  <!-- <el-form :model="approvalForm" label-width="100px" ref="approvalForm" :rules="rules">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label="撤销原因" prop="reason">
          <el-input type="textarea" v-model="approvalForm.reason"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form> -->
  <el-table class="table-content" height="172" :data="itemObj" @selection-change="handleSelectionChange">
    <el-table-column align="center" type="selection"></el-table-column>
    <el-table-column align="center" label="关键字">
      <template scope="scope">
        <span v-if="scope.row.dxlx === '1'">姓名:{{scope.row.name?scope.row.name:'无'}}&nbsp&nbsp 身份证号码:{{scope.row.idCard?scope.row.idCard:'无'}}</span>
        <span v-if="scope.row.dxlx === '2'">车牌号码:{{scope.row.carNum?scope.row.carNum:'无'}}</span>
        <span v-if="scope.row.dxlx === '3'">关键字:{{scope.row.gjz?scope.row.gjz:'无'}}</span>
      </template>
    </el-table-column>
    <el-table-column label="撤控原因">
      <template scope='scope'>
        <el-input v-model="scope.row.ckyy" placeholder=""></el-input>
      </template>
    </el-table-column>
  </el-table>
  <div class="text-center">
    <el-button @click=closeEvent>关闭</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</div>
</template>
<style lang="scss" scoped>
.table-content {
    margin-bottom: 10px;
}
</style>

<script>
import {
  REVOKE_APPROVAL
} from '../../../store/types';
import mixin from '../../../utils/mixin'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      approvalForm: {
        select: '',
        reason: ''
      },
      rules: {
        reason: {
          required: 'true',
          message: '请输入续控原因'
        }
      },
      resData: [],
      keyData: [{
        id: '',
        lybid: '',
        ckyy: '',
        gjz: ''
      }],
      flag: false
    }
  },
  props: ['ajid', 'itemInfo', 'person', 'car', 'tags'],
  methods: {
    submit() {
      // this.$refs.approvalForm.validate(valid => {
      //   if(valid) {
      //     this.dispatch(REVOKE_APPROVAL, {
      //       id: this.ajid,
      //       ckyy: this.approvalForm.reason
      //     }).then(() => {
      //       this.$message({
      //         type: 'success',
      //         message: '操作已成功提交',
      //         showClose: true
      //       })
      //       setTimeout(() => {
      //         window.location.reload()
      //       }, 500)
      //     })
      //   } else {
      //     return false
      //   }
      // })
      if(!this.resData.length) {
        this.$message({
          type: 'warning',
          message: '请选择撤销项',
          showClose: true
        })
        return
      }
      this.getApply()
      if(!this.flag) {
        this.dispatch(REVOKE_APPROVAL, {
          id: this.ajid,
          bkly: '1',
          ck_object: this.handleData(this.resData)
        }).then(() => {
          this.$message({
            type: 'success',
            message: '操作已成功提交',
            showClose: true
          })
          setTimeout(() => {
            window.location.reload()
          }, 500)
        })
      }
    },
    closeEvent() {
      this.$emit('close')
      this.approvalForm = {
        select: '',
        reason: ''
      }
      this.resetForm()
    },
    resetForm() {
      // this.$refs.approvalForm.resetFields()
    },
    handleSelectionChange(item) {
      this.resData = item
    },
    handleData(data) {
      let res = []
      data.forEach(d => {
        if(d.dxlx === '1') {
          res.push({
            lybid: d.lybid,
            id: d.nameId,
            ckyy: d.ckyy
          })
          res.push({
            lybid: d.lybid,
            id: d.cardId,
            ckyy: d.ckyy
          })
        } else {
          res.push({
            id: d.id,
            lybid: d.lybid,
            ckyy: d.ckyy
          })
        }
      })
      // res = data.map(d => {
      //   return {
      //     id: d.id,
      //     lybid: d.lybid,
      //     ckyy: d.ckyy
      //   }
      // })
      return res
    },
    getApply() {
      this.flag = false
      this.resData.forEach(d => {
        if(!d.ckyy) {
          this.$message({
            type: 'warning',
            message: '请填写撤销原因',
            showClose: true
          })
          this.flag = true
        }
      })
    }
  },
  watch: {
    // itemInfo(val) {
    //   let res = []
    //   res = val.filter(d => d.sfck !== '1').map(d => {
    //     return {
    //       id: d.id,
    //       lybid: d.lybid,
    //       ckyy: '',
    //       gjz: d.gjz
    //     }
    //   })
    //   this.keyData = res
    // }
  },
  computed: {
    itemObj() {
      let arr = []
      arr = this.person.concat(this.car).concat(this.tags).filter(d => d.sfck !== '1')
      return arr
    }
  },
  mounted() {},
  created() {}
}
</script>
