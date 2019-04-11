<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">涉军人员信息</h3>
  </div>

  <div>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="年龄" prop="nl" label-width="190px">
          <el-input v-model="value.nl" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="人员类别标签" prop="rylbbq" label-width="190px">
          <el-select placeholder="请选择" v-model="value.rylbbq" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['SJRYLB']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="原入伍类型" prop="yrwlx" label-width="190px">
          <el-select placeholder="请选择" v-model="value.yrwlx" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['YRWLX']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="原入伍年份" prop="yrwnf" label-width="190px">
          <el-date-picker v-model="value.yrwnf" type="year" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="退役年份" prop="tynf" label-width="190px">
          <el-date-picker v-model="value.tynf" type="year" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="原部队番号" prop="ybdfh" label-width="190px">
          <el-input v-model="value.ybdfh" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否参战人员" prop="sfcz" label-width="190px">
          <el-select placeholder="请选择" v-model="value.sfcz" style="width: 100%">
            <el-option label="是" value="1" style="width: 100%"></el-option>
            <el-option label="否" value="0" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="军" prop="jun" label-width="190px">
          <el-input v-model="value.jun" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="师" prop="shi" label-width="190px">
          <el-input v-model="value.shi" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="旅" prop="lv" label-width="190px">
          <el-input v-model="value.lv" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="团" prop="tuan" label-width="190px">
          <el-input v-model="value.tuan" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="伤病残退役人员类别" prop="sctylb" label-width="190px">
          <el-select placeholder="请选择" v-model="value.sctylb" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['TYLB']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否“五包一”对象" prop="sfwby" label-width="190px">
          <el-select placeholder="请选择" v-model="value.sfwby" style="width: 100%">
            <el-option label="是" value="1" style="width: 100%"></el-option>
            <el-option label="否" value="0" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否骨干成员" prop="sfgg" label-width="190px">
          <el-select placeholder="请选择" v-model="value.sfgg" style="width: 100%">
            <el-option label="是" value="1" style="width: 100%"></el-option>
            <el-option label="否" value="0" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="骨干成员类别" prop="ggcylb" label-width="190px">
          <el-select placeholder="请选择" v-model="value.ggcylb" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['GGCYLB']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="骨干组织人类别" prop="ggzzrlb" label-width="190px">
          <el-select placeholder="请选择" v-model="value.ggzzrlb" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['GGZZRLB']" style="width: 100%"></el-option>
          </el-select>
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
      this.getDict(['SJRYLB', 'YRWLX', 'TYLB', 'GGCYLB', 'GGZZRLB']).then(res => {
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
