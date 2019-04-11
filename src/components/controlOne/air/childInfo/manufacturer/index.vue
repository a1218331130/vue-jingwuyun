<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">无人机生产信息</h3>
  </div>
  <div>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="生产厂家名称" prop="sccjmc" label-width="106px">
          <el-input v-model="value.sccjmc" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="所属市州" prop="sssz" label-width="106px">
          <area-selector v-model="value.sssz" :disabled="this.flag" :defaultArea="defaultArea"></area-selector>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="工商登记日期" prop="gsdjsj" label-width="106px">
          <el-date-picker v-model="value.gsdjsj" :disabled="this.flag" type="date" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="经营范围" prop="jyfw" label-width="106px">
          <el-input v-model="value.jyfw" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="目前生产情况" prop="sczk" label-width="106px">
          <el-input v-model="value.sczk" :disabled="this.flag" :maxlength="50" placeholder="截至目前生产情况（数量）"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="法人/责任人" prop="fadb" label-width="106px">
          <el-input v-model="value.fadb" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="责任人身份证" prop="fasfz" label-width="106px">
          <el-input v-model="value.fasfz" :disabled="this.flag" :maxlength="18" placeholder="法人/责任人身份证" style="width: 100%"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系方式" prop="lxfw" label-width="106px">
          <el-input v-model="value.lxfw" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="详细地址" prop="sccjdz" label-width="106px">
          <el-input v-model="value.sccjdz" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="bz1" label-width="106px">
          <el-input type="textarea" :maxlength="300" :disabled="this.flag" v-model="value.bz1"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="管控原因" prop="gkyy" label-width="106px">
          <el-input type="textarea" :maxlength="300" :disabled="this.flag" v-model="value.gkyy"></el-input>
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
    components: {
      areaSelector
    },
    data() {
      return {
        dictLists: [],
        // defaultArea: [],
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
        // this.getDict(['LXFSLX']).then(res => {
        // this.dictLists = res
        // console.log('字典', this.dictLists);
        // })
      }
    },
    watch: {
      newinfo: {
        handle() {
          if (this.value) {
            this.$emit('updata:value', this.newinfo)
          }
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
