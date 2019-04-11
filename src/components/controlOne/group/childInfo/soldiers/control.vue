<template>
<div style="height:100%">
  <div>
    <h3>管控责任信息</h3>
  </div>

  <div>
    <el-row :gutter="8">
      <el-col :span="12">
        <el-form-item label="警种责任民警" prop="jzzrmj" label-width="206px">
          <el-input v-model="value.jzzrmj" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系方式 " prop="jzlxfs" label-width="206px">
          <el-input v-model="value.jzlxfs" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="警种部门名称 " prop="jzbmmc" label-width="206px">
          <el-input v-model="value.jzbmmc" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="警种部门领导" prop="jzbmld" label-width="206px">
          <el-input v-model="value.jzbmld" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="警种部门领导电话" prop="jzbmlddh" label-width="206px">
          <el-input v-model="value.jzbmlddh" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="派出所责任民警" prop="pcszrmj" label-width="206px">
          <el-input v-model="value.pcszrmj" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="派出所责任民警电话" prop="pcszrmjdh" label-width="206px">
          <el-input v-model="value.pcszrmjdh" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="责任派出所名称" prop="pcsmc" label-width="206px">
          <el-date-picker v-model="value.pcsmc" type="datetime" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="派出所责任民警" prop="pcszrmj" label-width="206px">
          <el-input v-model="value.pcszrmj" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="派出所领导" prop="pcsld" label-width="206px">
          <el-input v-model="value.pcsld" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="派出所领导电话" prop="pcslddh" label-width="206px">
          <el-date-picker v-model="value.pcslddh" type="datetime" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
  </div>

</div>
</template>
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
      //  this.getDict([]).then(res => {
      //  this.dictLists = res
      //  console.log('字典', this.dictLists);
      //  })
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
