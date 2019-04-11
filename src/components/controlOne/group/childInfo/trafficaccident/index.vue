<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">涉交通事故信访登记</h3>
  </div>

  <div>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label-width="153px" label="单位或地址" prop="dwhdz">
          <el-input :maxlength="50" v-model="value.dwhdz"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item label-width="153px" label="承办部门" prop="cbbm">
          <el-input :maxlength="50" v-model="value.cbbm"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="153px" label="工作阶段" prop="xfgzjd">
          <el-select placeholder="请选择" v-model="value.xfgzjd" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['XFGZJD']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label-width="153px" label="信访方式" prop="xffs">
          <el-select placeholder="请选择" v-model="value.xffs" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['XFFS']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="信访时间" prop="xfsj" label-width="153px">
          <el-date-picker v-model="value.xfsj" type="date" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="信访类型" label-width="153px" prop="xflx">
          <el-select placeholder="请选择" v-model="value.xflx" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['XFLX']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="办理结论" label-width="153px" prop="bljl">
          <el-select placeholder="请选择" v-model="value.bljl" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['BJJL']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="办结时间" label-width="153px" prop="bjsj">
          <el-date-picker v-model="value.bjsj" type="date" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否重访" label-width="153px" prop="sfcf">
          <el-select placeholder="请选择" v-model="value.sfcf" style="width: 100%">
            <el-option label="是" value="1" style="width: 100%"></el-option>
            <el-option label="否" value="0" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="3">
      <el-col :span="24">
        <el-form-item label="交通事故基本情况" label-width="153px" prop="jtsgjbqk">
          <el-input :maxlength="500" type="textarea" v-model="value.jtsgjbqk"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="3">
      <el-col :span="24">
        <el-form-item label="信访诉求" label-width="153px" prop="xfsq">
          <el-input :maxlength="500" type="textarea" v-model="value.xfsq"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="3">
      <el-col :span="24">
        <el-form-item label="信访事项调查情况结论" label-width="153px" prop="xftcqk">
          <el-input :maxlength="500" type="textarea" v-model="value.xftcqk"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="3">
      <el-col :span="24">
        <el-form-item label="目前采取的稳控措施" label-width="153px" prop="wkcs">
          <el-input :maxlength="500" type="textarea" v-model="value.wkcs"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :span="24">
        <el-form-item label="督办情况" label-width="153px" prop="dbqk">
          <el-checkbox-group v-model="value.dbqk">
            <el-checkbox :label="item.value" v-for="item in dictLists['DUBQK']" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
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
      this.getDict(['XFFS', 'XFLX', 'XFGZJD', 'BJJL', 'DUBQK']).then(res => {
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
