<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">培训机构信息</h3>
  </div>
  <el-row :gutter="5">
    <el-col :span="8">
      <el-form-item label="姓名" prop="xssmc" label-width="106px">
        <el-input :maxlength="50" v-model="value.xssmc"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="所属市州" prop="sssz" label-width="106px">
        <el-input :maxlength="50" v-model="value.sssz"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="拥有无人机情况" prop="gsdjsj" label-width="106px">
        <el-input :maxlength="50" v-model="value.gsdjsj" placeholder="拥有无人机情况（台数）"></el-input>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="5">
    <el-col :span="8">
      <el-form-item label="参训情况" prop="fadb" label-width="106px">
        <el-input :maxlength="50" v-model="value.fadb"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="证件期限" prop="fasfz" label-width="106px">
        <el-input :maxlength="50" v-model="value.fasfz"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="使用承诺情况" prop="lxfs" label-width="106px">
        <el-input :maxlength="50" v-model="value.lxfs" placeholder="无人机合法使用承诺情况"></el-input>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="5">
    <el-col :span="8">
      <el-form-item label="登记人" prop="djr" label-width="106px">
        <el-input :maxlength="50" v-model="value.djr"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="登记单位" prop="djdw" label-width="106px">
        <el-input :maxlength="50" v-model="value.djdw"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="登记时间" prop="djsj" label-width="106px">
        <el-date-picker v-model="value.djsj" type="datetime" style="width: 100%"></el-date-picker>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="5">
    <el-col :span="24">
      <el-form-item label="备注" prop="xxdz" label-width="106px">
        <el-input :maxlength="150" v-model="value.xxdz"></el-input>
      </el-form-item>
    </el-col>
  </el-row>

</div>

</div>
</template>
<style>
.addh3 {
  background: #eee;
  font-size: 14px;
  font-weight: normal;
  padding: 5px 0;
  margin: 0 -15px 15px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  text-align: center;
}
</style>
<script>
import mixin from '../../../../../utils/mixin'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      dictLists: [],
      newinfo: null
    }
  },
  methods: {
    initDialog() {
      // this.editForm = clone(this.dataForm)
      if(this.dictLists.length <= 0) {
        this.queryDictType()
      }
    },
    queryDictType() {
      //  表单字典初始化
      this.getDict(['HZZT']).then(res => {
        this.dictLists = res
      })
    }
  },
  watch: {
    newinfo: {
      handle() {
        this.$emit('updata:value', this.newinfo)
      },
      deep: true
    }
  },
  props: ['value', 'form'],
  mounted() {},
  created() {
    this.initDialog()
  }
}
</script>
