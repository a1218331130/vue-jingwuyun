<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">重点场所基本信息</h3>
  </div>

  <div>
    <el-row :gutter="5">
      <!-- <el-col :span="8">
        <el-form-item label="重点场所类型" prop="zdcslx" label-width="147px">
          <el-select :maxlength="50" v-model="value.zdcslx" disabled filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in dictLists['ZDCSBW']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col> -->
      <el-col :span="12">
        <el-form-item label="路名" prop="lm" label-width="147px">
          <el-input :maxlength="50" :disabled="this.flag" v-model="value.lm"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="路号" prop="lh" label-width="147px">
          <el-input v-model="value.lh" :disabled="this.flag" :maxlength="200"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="路段类型" prop="ldlx" label-width="147px">
          <el-radio v-for="elem in dictLists['ZDLDLX']" :disabled="this.flag" :key="elem.key" v-model="value.ldlx" :label="elem.value">{{elem.label}}</el-radio>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="道路类别" prop="dllb" label-width="147px">
          <el-radio v-for="elem in dictLists['ZDDLLB']" :disabled="this.flag" :key="elem.key" v-model="value.dllb" :label="elem.value">{{elem.label}}</el-radio>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="道路技术登记" prop="jsdj" label-width="147px">
          <el-radio v-for="elem in dictLists['DLJSDJ']" :disabled="this.flag" :key="elem.key" v-model="value.jsdj" :label="elem.value">{{elem.label}}</el-radio>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="道路情况" prop="dlqk" label-width="147px">
          <el-input :maxlength="50" type="textarea" :disabled="this.flag" v-model="value.dlqk"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="治理进度" prop="zlqk" label-width="147px">
          <el-radio v-for="elem in dictLists['ZLJD']" :disabled="this.flag" :key="elem.key" v-model="value.zlqk" :label="elem.value">{{elem.label}}</el-radio>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="整改完成时间" prop="zgwcsj" label-width="147px">
          <el-date-picker v-model="value.zgwcsj" :disabled="this.flag" type="datetime" format="yyyy-MM-dd hh:mm:ss" placeholder="请选择时间" style="width:100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="行政区划" prop="xzhq" label-width="147px">
          <el-input :maxlength="100" :disabled="this.flag" v-model="value.xzhq"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="管辖交警大队" prop="gxjjddid" label-width="147px">
          <el-input :maxlength="100" :disabled="this.flag" v-model="value.gxjjddid"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="治理责任单位" prop="zlzrdwid" label-width="147px">
          <el-input :maxlength="100" :disabled="this.flag" v-model="value.zlzrdwid"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="施工企业名称" prop="sgqymc" label-width="147px">
          <el-input :maxlength="100" :disabled="this.flag" v-model="value.sgqymc"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="施工时间" prop="sgkssj" label-width="147px">
          <el-date-picker v-model="value.sgkssj" :disabled="this.flag" type="daterange" placeholder="请选择时间" style="width:100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="有关解释说明" prop="ygjxsm" label-width="147px">
          <el-input :maxlength="300" :disabled="this.flag" type="textarea" v-model="value.ygjxsm"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="治理后效果评估" prop="zlhxgpg" label-width="147px">
          <el-radio v-for="elem in dictLists['ZLXGPG']" :disabled="this.flag" :key="elem.key" v-model="value.zlhxgpg" :label="elem.value">{{elem.label}}</el-radio>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="治理后其他情况说明" prop="zlhxgqtqk" label-width="147px">
          <el-input :maxlength="300" :disabled="this.flag" type="textarea" v-model="value.zlhxgqtqk"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否提请政府挂牌督办" :disabled="this.flag" prop="sfzfgp" label-width="150px">
          <el-radio v-model="value.sfzfgp" label="1">是</el-radio>
          <el-radio v-model="value.sfzfgp" label="0">否</el-radio>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="政府挂牌督办级别" prop="zfgpjb" label-width="147px">
          <el-radio v-for="elem in dictLists['GPJB']" :disabled="this.flag" :key="elem.key" v-model="value.zfgpjb" :label="elem.value">{{elem.label}}</el-radio>
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
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      newinfo: null,
      dictLists: []
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
      this.getDict(['ZDCSBW', 'ZDLDLX', 'ZDDLLB', 'DLJSDJ', 'GPJB', 'ZLXGPG', 'ZLJD']).then(res => {
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
  props: ['value', 'form', 'dataType', 'flag'],
  mounted() {},
  created() {
    this.initDialog()
  }
}
</script>
