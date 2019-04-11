<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">销售商信息</h3>
  </div>

  <div>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label-width="106px" label="销售商名称" prop="xssmc">
          <el-input :maxlength="50" v-model="value.xssmc" style="width: 100%"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label-width="106px" label="所属市州" prop="sssz">
          <el-input :maxlength="50" v-model="value.sssz"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label-width="106px" label="工商登记时间" prop="gsdjsj">
          <el-date-picker v-model="value.gsdjsj" type="datetime" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label-width="106px" label="经营范围" prop="jyfw">
          <el-input :maxlength="50" v-model="value.jyfw"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label-width="106px" label="法人/责任人" prop="fadb">
          <el-input :maxlength="50" v-model="value.fadb"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label-width="106px" label="责任人身份证" prop="fasfz">
          <el-input :maxlength="50" v-model="value.fasfz" placeholder="法人/责任人身份证"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label-width="106px" label="联系方式" prop="lxfs">
          <el-input :maxlength="50" v-model="value.lxfs"></el-input>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="6" label="工作抓手" prop="Address">
        <el-input :maxlength="50" v-model="form.Address"></el-input>
      </el-col> -->
    </el-row>
    <el-col :span="8">
      <el-form-item label-width="106px" label="登记人" prop="djr">
        <el-input :maxlength="50" v-model="value.djr"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label-width="106px" label="登记单位" prop="djdw">
        <el-input :maxlength="50" v-model="value.djdw"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label-width="106px" label="登记时间" prop="djsj">
        <el-date-picker v-model="value.djsj" type="datetime" style="width: 100%"></el-date-picker>
      </el-form-item>
    </el-col>
    <el-row :gutter="5">

      <el-col :span="16">
        <el-form-item label-width="106px" label="销售商详细地址" prop="xxdz">
          <el-input :maxlength="50" v-model="value.xxdz"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label-width="106px" label="目前生成情况" prop="sczk">
          <el-input :maxlength="50" v-model="value.sczk" placeholder="截至目前生成情况（数量）"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label-width="106px" label="备注" prop="bz1">
          <el-input :maxlength="50" v-model="value.bz1"></el-input>
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
      this.getDict(['LXFSLX', 'GFX', 'ZFX', 'DFX', 'GKZT', 'GKCS']).then(res => {
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
