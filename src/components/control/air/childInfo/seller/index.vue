<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">销售商信息</h3>
  </div>
  <div>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label-width="106px" label="销售商名称" prop="xssmc">
          <el-input v-model="value.xssmc" :disabled="this.flag" style="width: 100%"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="所属市州" prop="sssz" label-width="106px">
          <area-selector v-model="value.sssz" :disabled="this.flag" :defaultArea="defaultArea"></area-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label-width="106px" label="工商登记时间" prop="gsdjsj">
          <el-date-picker v-model="value.gsdjsj" :disabled="this.flag" type="date" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label-width="106px" label="经营范围" prop="jyfw">
          <el-input v-model="value.jyfw" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label-width="106px" label="目前生成情况" prop="sczk">
          <el-input v-model="value.sczk" :disabled="this.flag" placeholder="截至目前生成情况（数量）"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label-width="106px" label="法人/责任人" prop="fadb">
          <el-input v-model="value.fadb" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label-width="106px" label="责任人身份证" prop="fasfz">
          <el-input v-model="value.fasfz" :disabled="this.flag" placeholder="法人/责任人身份证"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label-width="106px" label="联系方式" prop="lxfs">
          <el-input v-model="value.lxfs" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="6" label="工作抓手" prop="Address">
        <el-input v-model="form.Address"></el-input>
      </el-col> -->
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label-width="106px" label="销售商地址" prop="xxdz">
          <el-input v-model="value.xxdz" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label-width="106px" label="备注" prop="bz1">
          <el-input type="textarea" :maxlength="300" :disabled="this.flag" v-model="value.bz1"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="管控原因" prop="gkyy" label-width="106px">
          <el-input type="textarea" :disabled="this.flag" :maxlength="300" v-model="value.gkyy"></el-input>
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
  import areaSelector from '../../../../../widgets/area-selector/area-selector'
  export default {
    mixins: [mixin],
    components: { areaSelector },
    data() {
      return {
        dictLists: [],
        newinfo: null
      }
    },
    methods: {
      initDialog() {
        // this.editForm = clone(this.dataForm)
        if (this.dictLists.length <= 0) {
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
    props: ['value', 'form', 'defaultArea', 'flag'],
    mounted() {},
    created() {
      this.initDialog()
    }
  }

</script>
