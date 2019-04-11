<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">网上阵地基本信息</h3>
  </div>
  <div>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="网上重点目标类型" prop="zdcslx" label-width="147px">
          <el-select :maxlength="50" v-model="value.zdcslx" disabled filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdcslxArr['ZDCSBW']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="运营状态" prop="yyzt" label-width="147px">
          <el-input :maxlength="50" v-model="value.yyzt"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="停运时间" prop="tysj" label-width="147px">
          <el-date-picker :maxlength="50" v-model="value.tysj" placeholder="请选择" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="域名" prop="ym" label-width="147px">
          <el-input :maxlength="50" v-model="value.ym"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="名称" prop="mc" label-width="147px">
          <el-input v-model="value.mc" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="类型" prop="lx" label-width="147px">
          <el-input v-model="value.lx" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>

    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="开办者姓名" prop="kbzxm" label-width="147px">
          <el-input v-model="value.kbzxm" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系方式" prop="lxfs" label-width="147px">
          <el-input :maxlength="50" v-model="value.lxfs"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="服务商名称" prop="fwsmc" label-width="147px">
          <el-input v-model="value.fwsmc" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="网站开办地" prop="wzkbd" label-width="147px">
          <el-input v-model="value.wzkbd" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="网站接入地址" prop="wzjrdz" label-width="147px">
          <el-input v-model="value.wzjrdz" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="企业名称" prop="qymc" label-width="147px">
          <el-input v-model="value.qymc" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="市州区县" prop="szqx" label-width="147px">
          <el-input v-model="value.szqx" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="机房物理地址" prop="jfwldz" label-width="147px">
          <el-input v-model="value.jfwldz" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="平台(网站)开办地" prop="ptkbd" label-width="147px">
          <el-input v-model="value.ptkbd" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="平台(网站)接入地" prop="ptjrd" label-width="147px">
          <el-input v-model="value.ptjrd" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5" v-if="dataType === 'jzlsqk'">
      <el-col :span="8">
        <el-form-item label="单位责任人警号" prop="dwzrrjh" label-width="147px">
          <el-input v-model="value.dwzrrjh" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="单位责任人姓名" prop="dwzrrxm" label-width="147px">
          <el-input v-model="value.dwzrrxm" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="单位名称" prop="dwmc" label-width="147px">
          <el-input v-model="value.dwmc" :maxlength="50"></el-input>
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
      newinfo: null,
      zdcslxArr: []
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
      // 表单字典初始化
      this.getDict(['ZDCSBW', 'JQDJ', 'ZRRZW', 'ZRRZW', 'CSLX', 'SYGN', 'JZYT']).then(res => {
        this.zdcslxArr = res
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
  props: ['value', 'form', 'dataType'],
  mounted() {},
  created() {
    this.initDialog()
  }
}
</script>
