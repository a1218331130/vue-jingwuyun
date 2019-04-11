<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">肇事肇祸等严重精神障碍患者维稳安保登记</h3>
  </div>

  <div>

    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="是否录入全国重性精神病人系统" prop="sflrqgzx" label-width="206px">
          <el-select placeholder="请选择" v-model="value.sflrqgzx" filterable style="width: 100%">
            <el-option label="是" value="0" style="width: 100%"></el-option>
            <el-option label="否" value="1" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="监护人身份证号" prop="jhrsfzh" label-width="147px">
          <el-input :maxlength="50" v-model="value.jhrsfzh"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="监护人姓名" prop="jhrxm" label-width="147px">
          <el-input :maxlength="50" v-model="value.jhrxm"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="监护人电话" prop="jhrdh" label-width="147px">
          <el-input :maxlength="50" v-model="value.jhrdh"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="患者状态" prop="hzzt" label-width="147px">
          <el-select placeholder="请选择" v-model="value.hzzt" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['HZZT']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="监护情况" prop="jhqk" label-width="147px">
          <el-select placeholder="请选择" v-model="value.jhqk" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['JHQK']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="8">
        <el-form-item label="风险等级" prop="fxdj" label-width="147px">
          <el-select placeholder="请选择" v-model="value.fxdj" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['FXDJ']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col> -->
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="低保情况" prop="dbqk" label-width="147px">
          <el-select placeholder="请选择" v-model="value.dbqk" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['DBQK']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="医保情况" prop="ybqk" label-width="147px">
          <el-select placeholder="请选择" v-model="value.ybqk" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['YBQK']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="监护奖励经费" prop="jhjljf" label-width="147px">
          <el-select placeholder="请选择" v-model="value.jhjljf" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['JHJL']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="服药情况" prop="fyqk" label-width="147px">
          <el-select placeholder="请选择" v-model="value.fyqk" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['FYQK']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="最近三个月是否发病" prop="jqfb" label-width="147px">
          <el-select placeholder="请选择" v-model="value.jqfb" style="width: 100%">
            <el-option label="是" value="1" style="width: 100%"></el-option>
            <el-option label="否" value="0" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

    </el-row>
    <!-- <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="风险隐患描述" prop="fxyhms" label-width="147px">
          <el-input type="textarea" v-model="value.fxyhms"></el-input>
        </el-form-item>
      </el-col>
    </el-row> -->

    <!-- <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="登记民警" prop="djmj" label-width="147px">
          <el-input v-model="value.djrxm" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="登记单位" prop="djdw" label-width="147px">
          <el-input v-model="value.djdw" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="登记时间" prop="djsj" label-width="147px">
          <el-date-picker v-model="value.djsj" type="datetime" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="操作民警" prop="czmj" label-width="147px">
          <el-input v-model="value.czmj" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="操作单位" prop="xgdw" label-width="147px">
          <el-input v-model="value.czdw" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="操作时间" prop="xgsj" label-width="147px">
          <el-date-picker v-model="value.czsj" type="datetime" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row> -->
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
      this.getDict(['HZZT', 'JHQK', 'DBQK', 'YBQK', 'JHJL', 'FYQK', 'FYQK']).then(res => {
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
