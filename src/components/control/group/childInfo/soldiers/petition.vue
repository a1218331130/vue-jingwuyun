<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">涉军人员上访信息</h3>
  </div>

  <div>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="是否涉军访人员" prop="sfsjfry" label-width="190px">
          <el-select placeholder="请选择" v-model="value.sfsjfry" style="width: 100%">
            <el-option label="是" value="1" style="width: 100%"></el-option>
            <el-option label="否" value="0" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="诉求是否解决" prop="sqsfjj" label-width="190px">
          <el-select placeholder="请选择" v-model="value.sqsfjj" style="width: 100%">
            <el-option label="是" value="1" style="width: 100%"></el-option>
            <el-option label="否" value="0" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否已经息访" prop="sfyxf" label-width="190px">
          <el-select placeholder="请选择" v-model="value.sfyxf" style="width: 100%">
            <el-option label="是" value="1" style="width: 100%"></el-option>
            <el-option label="否" value="0" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="上访类型" prop="sflx" label-width="190px">
          <el-select placeholder="请选择" v-model="value.sflx" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['SFLX']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="近2年是否有上访" prop="sfsfjl" label-width="190px">
          <el-select placeholder="请选择" v-model="value.sfsfjl" style="width: 100%">
            <el-option label="是" value="1" style="width: 100%"></el-option>
            <el-option label="否" value="0" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="上访选择交通方式特点" prop="sfjtgj" label-width="190px">
          <el-select placeholder="请选择" v-model="value.sfjtgj" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['JTFS']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="是否存在历史暴力拒绝劝返" prop="bljjqf" label-width="190px">
          <el-select placeholder="请选择" v-model="value.bljjqf" style="width: 100%">
            <el-option label="是" value="1" style="width: 100%"></el-option>
            <el-option label="否" value="0" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label=" 暴力拒绝劝返方式" prop="bljjfs" label-width="190px">
          <el-select placeholder="请选择" v-model="value.bljjfs" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['BLJJFS']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="近期是否有到省赴京上访风险" prop="jqsffx" label-width="190px">
          <el-select placeholder="请选择" v-model="value.jqsffx" style="width: 100%">
            <el-option label="是" value="1" style="width: 100%"></el-option>
            <el-option label="否" value="0" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="3">
      <el-col :span="24">
        <el-form-item label="上访原因" prop="sfyy" label-width="190px">
          <el-input type="textarea" placeholder="请输入上访原因" :autosize="{minRows: 3, maxRows: 50}" v-model="value.sfyy"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="3">
      <el-col :span="24">
        <el-form-item label="上访诉求" prop="sfsq" label-width="190px">
          <el-input type="textarea" placeholder="请输入上访诉求" :autosize="{minRows: 3, maxRows: 50}" v-model="value.sfsq"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label-width="190px" label="涉稳动向" class="checkArr">
          <el-checkbox-group style="padding:5px 5px">
            <el-row :gutter="5">
              <el-col :span="24">
                <el-form-item label-width="47px" label="挑头" prop="swdxtt" class="">
                  <el-checkbox-group v-model="value.swdxtt">
                    <el-checkbox :label="item.value" v-for="item in dictLists['SWTT']" style="margin-left:15px;width:80%;  white-space: initial; vertical-align: top;" :key="item.value">{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="24">
                <el-form-item label-width="47px" label="活跃" prop="swdxhy" class="">
                  <el-checkbox-group v-model="value.swdxhy">
                    <el-checkbox :label="item.value" v-for="item in dictLists['SWHY']" style="margin-left:15px;width:80%;  white-space: initial; vertical-align: top;" :key="item.value">{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="24">
                <el-form-item label-width="47px" label="关注" prop="swdxgz" class="">
                  <el-checkbox-group v-model="value.swdxgz" style="margin-bottom:0px;">
                    <el-checkbox :label="item.value" v-for="item in dictLists['SWGZ']" style="margin-left:15px;width:80%;  white-space: initial; vertical-align: top;" :key="item.value">{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
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
      this.getDict(['SFLX', 'JTFS', 'BLJJFS', 'SWTT', 'SWHY', 'SWGZ']).then(res => {
        this.dictLists = res
      })
    }
  },
  watch: {
    value: {
      handle() {
        this.$emit('updata:value', this.value)
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
