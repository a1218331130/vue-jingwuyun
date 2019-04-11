<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">生产信息</h3>
  </div>
  <div>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="无人机品牌" prop="wrjpp" label-width="147px">
          <el-input v-model="value.wrjpp" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="无人机型号" prop="wrjxh" label-width="147px">
          <el-input v-model="value.wrjxh" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="所属市州" prop="sssz" label-width="147px">
          <area-selector v-model="value.sssz" :disabled="this.flag" :defaultArea="defaultArea"></area-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="持有人姓名" prop="xm" label-width="147px">
          <el-input v-model="value.xm"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="所在单位" prop="szdw" label-width="147px">
          <el-input v-model="value.szdw" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系电话" prop="lxdh" label-width="147px">
          <el-input v-model="value.lxdh" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="6" label="工作抓手" prop="Address">
        <el-input v-model="form.Address"></el-input>
      </el-col> -->
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="拥有无人机情况" prop="yywrjsl" label-width="147px">
          <el-input v-model="value.yywrjsl" :disabled="this.flag" placeholder="拥有无人机情况（台数）"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="参训情况" prop="cxqk" label-width="147px">
          <el-input v-model="value.cxqk" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="证件期限 " prop="zjqx" label-width="147px">
          <el-input v-model="value.zjqx" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="单位名称" prop="dwmc" label-width="147px">
          <el-input v-model="value.dwmc" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="责任人 " prop="zrr" label-width="147px">
          <el-input v-model="value.zrr" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系方式" prop="lxfs" label-width="147px">
          <el-input v-model="value.lxfs" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="使用承诺情况" prop="cnqk" label-width="147px">
          <el-input type="textarea" :maxlength="300" :disabled="this.flag" v-model="value.cnqk" placeholder="无人机合法使用承诺情况"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="单位使用承诺情况" prop="dwsycn" label-width="147px">
          <el-input type="textarea" :maxlength="300" :disabled="this.flag" v-model="value.dwsycn" placeholder="单位无人机合法使用承诺情况"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="管控原因" prop="gkyy" label-width="147px">
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
        // this.value = clone(this.dataForm)
        if (this.dictLists.length <= 0) {
          this.queryDictType()
        }
      },
      queryDictType() {
        //  表单字典初始化
        this.getDict(['FZXWFS']).then(res => {
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
