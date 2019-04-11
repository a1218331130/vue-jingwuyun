<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">涉警访风险隐患排查登记</h3>
  </div>

  <div>
    <el-row :gutter="3">
      <el-col :span="24">
        <el-form-item label="基本诉求" prop="jbsq" label-width="147px">
          <el-input type="textarea" placeholder="请输入简要案情" :autosize="{minRows: 2, maxRows: 50}" v-model="value.jbsq"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="3">
      <el-col :span="24">
        <el-form-item label="办理情况" prop="blqk" label-width="147px">
          <el-input type="textarea" placeholder="请输入办理情况" :autosize="{minRows: 2, maxRows: 50}" v-model="value.blqk"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :span="24">
        <el-form-item label-width="147px" label="涉稳动向" class="checkArr">
          <el-checkbox-group style="padding:5px 5px">
            <el-row :gutter="8">
              <el-col :span="12">
                <el-form-item label="是否受过刑事处罚" prop="xscf" label-width="147px">
                  <el-radio-group v-model="value.xscf">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否受过行政处罚" prop="xzcf" label-width="147px">
                  <el-radio-group v-model="value.xzcf">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="8">
              <el-col :span="24">
                <el-form-item label="过激访地点" prop="gjfdd" label-width="147px">
                  <el-checkbox-group v-model="value.gjfdd" style="margin-bottom:0px">
                    <el-checkbox :label="item.value" v-for="item in dictLists['GJFDD']" :key="item.value" style="margin-left:15px">{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="8">
              <el-col :span="24">
                <el-form-item label="过激访行为" prop="gjfxw" label-width="147px">
                  <el-checkbox-group v-model="value.gjfxw" style="margin-bottom:0px">
                    <el-checkbox :label="item.value" v-for="item in dictLists['GJFXW']" :key="item.value" style="margin-left:15px">{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="8">
              <el-col :span="12">
                <el-form-item label="性格是否偏执" prop="xgpz" label-width="147px">
                  <el-radio-group v-model="value.xgpz">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否有固定收入来源" prop="gdsr" label-width="147px">
                  <el-radio-group v-model="value.gdsr">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :span="24">
        <el-form-item label-width="147px" label="风险隐患级别" class="checkArr">
          <el-checkbox-group style="padding:5px 5px">
            <el-row :gutter="8">
              <el-col :span="24">

              </el-col>
            </el-row>
            <el-row>
              <el-form-item label-width="5px" label="" prop="fxjb">
                <el-radio-group v-model="value.fxjb" @change="fxdjchange">


                  <el-col :span="24" class="sjdj">
                    <el-radio label="YHJB001" key="YHJB001" class="labelradio" style="">一级</el-radio>
                    <el-row :gutter="8">
                      <el-col :span="24">
                        <el-form-item label-width="187px" label="一级" prop="yjnr">
                          <el-checkbox-group v-model="value.yjnr">
                            <el-checkbox :disabled="value.fxjb !== 'YHJB001'" :label="item.value" v-for="item in dictLists['YHJB001']" style="margin-left:15px;width:80%;" :key="item.value">{{item.label}}</el-checkbox>
                          </el-checkbox-group>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="8">
                      <el-col :span="24">
                        <el-form-item label-width="187px" label="一级内容备注" prop="yjbz" class="">
                          <el-input :disabled="value.fxjb !== 'YHJB001'" :maxlength="50" v-model="value.yjbz"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>

                  <el-col :span="24" class="sjdj">
                    <el-radio label="YHJB002" class="labelradio" key="YHJB002">二级</el-radio>
                    <el-row :gutter="8">
                      <el-col :span="24">
                        <el-form-item label-width="187px" label="二级" prop="rjnr">
                          <el-checkbox-group v-model="value.rjnr">
                            <el-checkbox :disabled="value.fxjb !== 'YHJB002'" :label="item.value" v-for="item in dictLists['YHJB002']" style="margin-left:15px;width:80%; " :key="item.value">{{item.label}}</el-checkbox>
                          </el-checkbox-group>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="8">
                      <el-col :span="24">
                        <el-form-item label-width="187px" label="二级内容备注" prop="rjbz1">
                          <el-input :disabled="value.fxjb !== 'YHJB002'" :maxlength="50" v-model="value.rjbz1" placeholder="一年内进京上访2次的备注"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="8">
                      <el-col :span="24">
                        <el-form-item label-width="187px" label="二级内容备注" prop="rjbz2">
                          <el-input :disabled="value.fxjb !== 'YHJB002'" :maxlength="50" v-model="value.rjbz2" placeholder="一年内进京上访3次的备注"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>

                  <el-col :span="24" class="sjdj">
                    <el-radio label="YHJB003" class="labelradio" key="YHJB003">三级</el-radio>
                    <el-row :gutter="8">
                      <el-col :span="24">
                        <el-form-item label-width="187px" label="三级" prop="sjnr">
                          <el-checkbox-group v-model="value.sjnr">
                            <el-checkbox :disabled="value.fxjb !== 'YHJB003'" :label="item.value" v-for="item in dictLists['YHJB001']" style="margin-left:15px;width:80%; " :key="item.value">{{item.label}}</el-checkbox>
                          </el-checkbox-group>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="8">
                      <el-col :span="24">
                        <el-form-item label-width="187px" label="三级内容备注" prop="sjbz1" class="">
                          <el-input :disabled="value.fxjb !== 'YHJB003'" :maxlength="50" v-model="value.sjbz1" placeholder="一年内进京上访1次的备注"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="8">
                      <el-col :span="24">
                        <el-form-item label-width="187px" label="三级内容备注" prop="sjbz2" class="">
                          <el-input :disabled="value.fxjb !== 'YHJB003'" :maxlength="50" v-model="value.sjbz2" placeholder="一年内进京上访1次的备注"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-radio-group>
              </el-form-item>
            </el-row>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :span="8">
        <el-form-item label="是否在控" prop="sfzk" label-width="147px">
          <el-radio-group v-model="value.sfzk">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :span="12">
        <el-form-item label-width="147px" label="化解责任单位" prop="hjzrdw">
          <el-cascader :maxlength="50" :show-all-cldjs="false" :filterable="true" v-model="value.hjzrdw" :options="CollectDeptList" :clearable="true" :props="{children:'children',value:'orgId',label:'name'}" :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="147px" label="警种部门" prop="hjzrbm">
          <!-- <el-input :maxlength="50" v-model="value.hjzrbm"></el-input> -->
          <el-select :maxlength="50" v-model="value.hjzrbm" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in dictLists['JZBM']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :span="12">
        <el-form-item label-width="147px" label="稳控责任单位" prop="wkzrdw">
          <el-cascader :maxlength="50" :show-all-cldjs="false" :filterable="true" v-model="value.wkzrdw" :options="CollectDeptList" :clearable="true" :props="{children:'children',value:'orgId',label:'name'}" :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="147px" label="警种部门" prop="wkzrbm">
          <!-- <el-input :maxlength="50" v-model="value.wkzrbm"></el-input> -->
          <el-select :maxlength="50" v-model="value.wkzrbm" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in dictLists['JZBM']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :span="12">
        <el-form-item label-width="147px" label="稳控责任领导及职务" prop="wkzrld">
          <el-input :maxlength="50" v-model="value.wkzrld"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="147px" label="稳控责任民警及职务" prop="wkzrmj">
          <el-input :maxlength="50" v-model="value.wkzrmj"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :span="24">
        <el-form-item label="撤管" prop="sfcg" label-width="147px">
          <el-radio-group v-model="value.sfcg">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
          <span style="color:#c00">(符合以下情形之一的撤管：1、被列管对象死亡的；2、列管后1年内未到省进京上访的。)</span>
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

.checkArr .sjdj {
  position: relative;
  border-bottom: 1px solid #ddd;
  margin-bottom: 5px
}

.checkArr .sjdj .labelradio {
  position: absolute;
  top: 50%;
  margin-left: 15px;
  z-index: 9;
  transform: translateY(-50%)
}

.checkArr+.el-form-item__content {}
</style>
<script>
import mixin from '../../../../../utils/mixin'
import { listToTree } from '../../../../../utils/listToTree'
import ElRadio from '../../../../../../node_modules/element-ui/packages/radio/src/radio'
import { GET_SYS_ORG_TREE } from '../../../../../store/types'
import { mapState } from 'vuex'
export default {
  mixins: [mixin],
  components: { ElRadio, listToTree },
  data() {
    return {
      dictLists: [],
      newinfo: null,
      CollectDeptList: []
    }
  },
  computed: {
    ...mapState(['orgs'])
  },
  methods: {
    fxdjchange() {
      if(this.value.fxjb === 'YHJB001') {
        this.value.rjnr = []
        this.value.rjbz1 = ''
        this.value.rjbz2 = ''
        this.value.sjnr = []
        this.value.sjbz1 = ''
        this.value.sjbz2 = ''
      } else if(this.value.fxjb === 'YHJB002') {
        this.value.yjnr = []
        this.value.yjbz = ''
        this.value.sjnr = []
        this.value.sjbz1 = ''
        this.value.sjbz2 = ''
      } else {
        this.value.yjnr = []
        this.value.yjbz = ''
        this.value.rjnr = []
        this.value.rjbz1 = ''
        this.value.rjbz2 = ''
      }
    },
    initDialog() {
      // this.editForm = clone(this.dataForm)
      if(this.dictLists.length <= 0) {
        this.queryDictType()
      }
      this.GetSysOrgDictTree('430000000000')
    },
    GetSysOrgDictTree(keyId) { // GetSysOrgList GetSysOrgTree
      this.dispatch(GET_SYS_ORG_TREE, {
        isAll: '1',
        orgId: keyId
      }).then(() => {
        this.CollectDeptList = listToTree(this.orgs.sysOrgTree, keyId, 0, {
          id: 'orgId',
          parentId: 'parentId',
          children: 'children'
        });
      })
    },
    queryDictType() {
      //  表单字典初始化
      this.getDict(['GJFDD', 'GJFXW', 'YHJB', 'YHJB001', 'YHJB002', 'YHJB003', 'JZBM']).then(res => {
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
