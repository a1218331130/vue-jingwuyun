<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">线索信息</h3>
  </div>
  <div>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="标题" prop="bt">
          <el-input :maxlength="50" v-model="value.bt" :disabled="this.flag"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="针对主体" prop="zdzt">
          <el-select v-model="value.zdzt" :disabled="this.flag" filterable :maxlength="50" placeholder="请选择" style="width: 100%">
            <el-option v-for="(item,index) in dictLists['ZDZT']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="信息标签" prop="xxbq">
          <el-input v-model="value.xxbq" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="信息种类" prop="xxzl">
          <el-select v-model="value.xxzl" :disabled="this.flag" filterable :maxlength="50" placeholder="请选择" style="width: 100%">
            <el-option v-for="(item,index) in dictLists['XXZL']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="信息来源" prop="xxly">
          <el-select v-model="value.xxly" :disabled="this.flag" filterable :maxlength="50" placeholder="请选择" style="width: 100%">
            <el-option v-for="(item,index) in dictLists['GLXSLY']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="信息内容" prop="xxnr">
          <el-input type="textarea" v-model="value.xxnr" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="首获单位" prop="shdw">
          <el-cascader :maxlength="50" :disabled="this.flag" :show-all-cldjs="false" :filterable="true" v-model="value.shdw" :options="CollectDeptList" :clearable="true" :show-all-levels="false" @change="changUserList2(value.shdw)" :props="{children:'children',value:'orgId',label:'name'}"
            :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="首获信息人" prop="shxxr">
          <el-select v-model="value.shxxr" :disabled="this.flag" filterable @change="changUser2()" style="width: 100%">
            <el-option style="height: auto" v-for="item in userList2" :key="item.userId" :label="item.xm" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="信息首获时间" prop="xxshsj">
          <el-date-picker v-model="value.xxshsj" :disabled="this.flag" type="datetime" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">

      <el-col :span="8">
        <el-form-item label="信息可靠性" prop="xxkkx">
          <el-select v-model="value.xxkkx" :disabled="this.flag" filterable :maxlength="50" placeholder="请选择" style="width: 100%">
            <el-option v-for="(item,index) in dictLists['XXKKX']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="信息真实性" prop="xxzsx">
          <el-select v-model="value.xxzsx" :disabled="this.flag" filterable :maxlength="50" placeholder="请选择" style="width: 100%">
            <el-option v-for="(item,index) in dictLists['XXKKX']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="信息预警性" prop="xxyjx">
          <el-select v-model="value.xxyjx" :disabled="this.flag" filterable :maxlength="50" placeholder="请选择" style="width: 100%">
            <el-option v-for="(item,index) in dictLists['XXYJX']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="发生地域" prop="fsdy">
          <el-input v-model="value.fsdy" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发生时间段" prop="fssj">
          <el-date-picker v-model="value.fssj" :disabled="this.flag" type="daterange" style="width: 100%" placeholder="请选择时间段"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="时间标签" prop="sjbq">
          <el-input v-model="value.sjbq" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="发生详址" prop="fsxz">
          <el-input v-model="value.fsxz" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="评估危害结果" prop="cppgjg">
          <el-input v-model="value.cppgjg" :disabled="this.flag" :maxlength="50" type="textarea" placeholder="初步评估可能造成危害结果"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="管控原因" prop="cppgjg">
          <el-input v-model="value.gkyy" :disabled="this.flag" :maxlength="300" type="textarea"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="管辖单位" prop="gxdw">
          <el-cascader :maxlength="50" :disabled="this.flag" :show-all-cldjs="false" :filterable="true" v-model="value.gxdw" :options="CollectDeptList" :clearable="true" :props="{children:'children',value:'orgId',label:'name'}" :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="管辖警种" prop="gxjz">
          <el-select v-model="value.gxjz" :disabled="this.flag" filterable :maxlength="50" placeholder="请选择警种" style="width: 100%">
            <el-option v-for="(item,index) in dictLists['JZLX']" :key="item.label" :label="item.label" :value="item.value"></el-option>
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
  // import { clone } from '../../../../../utils/util'
  import {
    GET_SYS_ORG_TREE,
    FETCH_SYS_USERS_BY_ORGID
  } from '../../../../../store/types'
  import { clone } from '../../../../../utils/util'
  import { mapState } from 'vuex'
  import { listToTree } from '../../../../../utils/listToTree'
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        dictLists: [],
        userList2: [],
        CollectDeptList: [],
        IsSelectOrg2: '',
        newinfo: null
      }
    },
    methods: {
      initDialog() {
        // this.value = clone(this.value)
        // this.editForm = clone(this.dataForm)
        if (this.dictLists.length <= 0) {
          this.queryDictType()
        }
        if (this.CollectDeptList.length <= 0) {
          this.GetSysOrgDictTree('430000000000')
        }
      },
      /**
       * 修改单位下拉列表
       * @return {[type]} [description]
       */
      changUserList2(value) {
        this.IsSelectOrg2 = value
        if (value && value.length !== 0 && value !== '') {
          this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: value[value.length - 1] }).then(d => {
            this.userList2 = clone(this.users.sysUserFromOrgid)
            this.value.shxxr = ''
          })
        } else {
          this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: '431200000000' }).then(d => {
            this.userList2 = clone(this.users.sysUserFromOrgid)
            this.value.shxxr = ''
          })
        }
      },
      changUser2() {
        if (this.value.shdw && this.value.shdw.length !== 0 && this.value.shdw) {
          this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.shdw[this.value.shdw.length - 1] }).then(d => {
            this.userList2 = clone(this.users.sysUserFromOrgid)
            if (this.userList2 && this.userList2.length !== 0 && this.value.shxxr) {
              this.value.xklxfs = this.userList2.find(d => d.userId === this.value.shxxr).mobile || ''
            }
          })
        }
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
        this.getDict(['JZLX', 'ZDZT', 'GLXSLY', 'XXKKX', 'XXYJX', 'XXZL']).then(res => {
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
    computed: {
      ...mapState(['orgs', 'users'])
    },
    mounted() {
      this.initDialog()
    },
    created() {}
  }

</script>
