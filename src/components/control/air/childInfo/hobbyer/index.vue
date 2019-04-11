<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">无人机爱好者信息</h3>
  </div>
  <div>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="姓名" prop="xssmc" label-width="106px">
          <el-input v-model="value.xssmc" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="所属市州" prop="sssz" label-width="106px">
          <area-selector v-model="value.sssz" :disabled="this.flag" :defaultArea="defaultArea"></area-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系方式" prop="lxfs" label-width="106px">
          <el-input v-model="value.lxfs" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="拥有无人机情况" prop="gsdjsj" label-width="106px">
          <el-input v-model="value.gsdjsj" :disabled="this.flag" placeholder="拥有无人机情况（台数）"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="参训情况" prop="fadb" label-width="106px">
          <el-input v-model="value.fadb" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="证件期限" prop="fasfz" label-width="106px">
          <el-input v-model="value.fasfz" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="使用承诺情况" prop="sycn" label-width="106px">
          <el-input type="textarea" :maxlength="300" :disabled="this.flag" v-model="value.sycn" placeholder="无人机合法使用承诺情况"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="备注" prop="xxdz" label-width="106px">
          <el-input type="textarea" :maxlength="300" :disabled="this.flag" placeholder="限制输入300个字符" v-model="value.xxdz"></el-input>
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
    props: ['value', 'form', 'defaultArea', 'flag'],
    mounted() {},
    created() {
      this.initDialog()
    }
  }

</script>
