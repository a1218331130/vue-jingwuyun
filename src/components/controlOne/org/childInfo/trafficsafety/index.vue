<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">交通安全管理基本信息</h3>
  </div>
  <div>
    <el-form-item label="类别" prop="zdcslx" label-width="147px" v-show="false">
      <el-input :maxlength="50" vv-model="value.zdcslx"></el-input>
    </el-form-item>
    <el-row :gutter="5" v-if="dataType === 'lkywyx'">
      <el-col :span="24">
        <el-form-item label="使用性质" prop="syxz" label-width="147px">
          <el-checkbox-group v-model="value.syxz">
            <el-checkbox :label="item.value" v-for="item in zdcslxArr['KWXSYXZ']" style="margin-left:15px;" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="号牌号码" prop="hphm" label-width="147px">
          <el-input :maxlength="50" vv-model="value.hphm"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="车辆所有人" prop="clsyr" label-width="147px">
          <el-input :maxlength="50" vv-model="value.clsyr"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5" v-if="dataType === 'zdjtwf'">
      <el-col :span="8">
        <el-form-item label="违法时间" prop="wfsj" label-width="147px">
          <el-date-picker :maxlength="50" v-model="value.wfsj" placeholder="请选择" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="号牌号码" prop="cphm" label-width="147px">
          <el-input v-model="value.cphm" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="驾驶人" prop="jdr" label-width="147px">
          <el-input v-model="value.jsr" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="违法地点" prop="wfdd" label-width="147px">
          <el-input v-model="value.wfdd" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>


      <el-col :span="24">
        <el-form-item label="违法行为" prop="wfxw" label-width="147px">
          <el-checkbox-group v-model="value.wfxw">
            <el-checkbox :label="item.value" v-for="item in zdcslxArr['JTWFXW']" style="margin-left:15px;" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="采取措施" prop="cqcs" label-width="147px">
          <el-checkbox-group v-model="value.cqcs">
            <el-checkbox :label="item.value" v-for="item in zdcslxArr['JTCQCS']" style="margin-left:15px;" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="治理办法" prop="zlbf" label-width="147px">
          <el-checkbox-group v-model="value.zlbf">
            <el-checkbox :label="item.value" v-for="item in zdcslxArr['JTZLBF']" style="margin-left:15px;" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5" v-if="dataType === 'zdldpc'">
      <el-col :span="8">
        <el-form-item label="路名" prop="lm" label-width="147px">
          <el-input v-model="value.lm" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="路号" prop="lh" label-width="147px">
          <el-input :maxlength="50" vv-model="value.lh"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="路段类型" prop="ldlx" label-width="147px">
          <el-select :maxlength="50" v-model="value.ldlx" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdcslxArr['ZDLDLX']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="道路类别" prop="dllb" label-width="147px">
          <el-select :maxlength="50" v-model="value.dllb" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdcslxArr['ZDDLLB']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="道路技术登记" prop="jsdj" label-width="147px">
          <el-select :maxlength="50" v-model="value.jsdj" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdcslxArr['DLJSDJ']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="行政区划" prop="xzqk" label-width="147px">
          <el-input v-model="value.xzqk" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="管辖交警大队名称" prop="gxjjddmc" label-width="147px">
          <el-input v-model="value.gxjjddmc" :maxlength="50"></el-input>
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
        if (this.dictLists.length <= 0) {
          this.queryDictType()
        }
      },
      queryDictType() {
        // 表单字典初始化
        this.getDict(['ZDCSBW', 'KWXSYXZ', 'JTWFXW', 'JTCQCS', 'JTZLBF', 'ZDLDLX', 'ZDDLLB', 'DLJSDJ']).then(res => {
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
