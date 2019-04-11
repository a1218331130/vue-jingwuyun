<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">网上阵地基本信息</h3>
  </div>

  <div>
    <el-row :gutter="5" v-if="dataType === 'wszdmb'">
      <el-col :span="8">
        <el-form-item label="网上重点目标类型" prop="zdcslx" label-width="147px">
          <el-select :maxlength="50" v-model="value.zdcslx" disabled filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdcslxArr['ZDCSBW']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="运营状态" prop="yyzt" label-width="147px">
          <el-input :maxlength="50" :disabled="this.flag" v-model="value.yyzt"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="停运时间" prop="tysj" label-width="147px">
          <el-date-picker :maxlength="50" :disabled="this.flag" v-model="value.tysj" placeholder="请选择" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="域名" prop="ym" label-width="147px">
          <el-input :maxlength="50" :disabled="this.flag" v-model="value.ym"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="名称" prop="mc" label-width="147px">
          <el-input v-model="value.mc" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="服务类型" prop="lx" label-width="147px">
          <el-select :maxlength="50" :disabled="this.flag" v-model="value.lx" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdcslxArr['WZFWLX']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="开办者姓名" prop="kbzxm" label-width="147px">
          <el-input v-model="value.kbzxm" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系方式" prop="aqzrrdh" label-width="147px">
          <el-input :maxlength="50" :disabled="this.flag" v-model="value.aqzrrdh"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="服务商名称" prop="fwsmc" label-width="147px">
          <el-input v-model="value.fwsmc" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="8">
        <el-form-item label="网站开办地" prop="wzkbd" label-width="147px">
          <el-input v-model="value.wzkbd" :maxlength="50"></el-input>
        </el-form-item>
      </el-col> -->
      <el-col :span="8">
        <el-form-item label="网站接入地址" prop="wzjrdz" label-width="147px">
          <el-input v-model="value.wzjrdz" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="企业名称" prop="qymc" label-width="147px">
          <el-input v-model="value.qymc" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="8">
        <el-form-item label="市州区县" prop="szqx" label-width="147px">
          <el-input v-model="value.szqx" :maxlength="50"></el-input>
        </el-form-item>
      </el-col> -->
      <el-col :span="8">
        <el-form-item label="机房物理地址" prop="jfwldz" label-width="147px">
          <el-input v-model="value.jfwldz" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="8">
        <el-form-item label="平台(网站)开办地" prop="ptkbd" label-width="147px">
          <el-input v-model="value.ptkbd" :maxlength="50"></el-input>
        </el-form-item>
      </el-col> -->
      <el-col :span="24">
        <el-form-item label="平台(网站)开办地" prop="ptkbd" label-width="147px">
          <area-selector :disabled="value.ptkbd!==null || this.flag" v-model="value.ptkbd" :defaultArea="defaultArea"></area-selector>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="平台(网站)接入地" prop="ptjrd" label-width="147px">
          <el-input v-model="value.ptjrd" :disabled="this.flag" :maxlength="150"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5" v-if="dataType === 'jzlsqk'">
      <!-- <el-col :span="8">
        <el-form-item label="网上重点目标类型" prop="zdcslx" label-width="147px">
          <el-select :maxlength="50" v-model="value.zdcslx" disabled filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdcslxArr['ZDCSBW']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col> -->
      <!-- <el-col :span="8">
        <el-form-item label="单位名称" prop="dwmc" label-width="147px">
          <el-input v-model="value.dwmc" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="单位责任人姓名" prop="dwzrrxm" label-width="147px">
          <el-input v-model="value.dwzrrxm" :maxlength="50"></el-input>
        </el-form-item>
      </el-col> -->
      <el-col :span="8">
        <el-form-item label="单位" prop="aqzrdwid">
          <el-cascader :maxlength="50" :disabled="this.flag" :show-all-cldjs="false" :filterable="true" v-model="value.aqzrdwid" :options="CollectDeptList" :clearable="true" :show-all-levels="false" @change="changUserList(value.aqzrdwid)" :props="{children:'children',value:'orgId',label:'name'}"
            :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="责任人" prop="aqzrrjh">
          <el-select v-model="value.aqzrrjh" :disabled="this.flag" filterable @change="changUser()" style="width: 100%">
            <el-option style="height: auto" v-for="item in userList" :key="item.userId" :label="item.xm" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系方式" prop="aqzrrdh" label-width="106px">
          <el-input :maxlength="50" :disabled="this.flag" v-model="value.aqzrrdh"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="管控原因" prop="gkyy" label-width="106px">
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
import { mapState } from 'vuex'
import { clone } from '../../../../../utils/util'
import { listToTree } from '../../../../../utils/listToTree'
import { GET_SYS_ORG_TREE, FETCH_SYS_USERS_BY_ORGID } from '../../../../../store/types'
import areaSelector from '../../../../../widgets/area-selector/area-selector'
export default {
  mixins: [mixin],
  components: { areaSelector },
  data() {
    return {
      dictLists: [],
      newinfo: null,
      zdcslxArr: [],
      currentTableListUser: [], // 当前列表存在的用户
      userList: [],
      IsSelectOrg: '',
      CollectDeptList: []
    }
  },
  methods: {
    initDialog() {
      // this.editForm = clone(this.dataForm)
      if(this.dictLists.length <= 0) {
        this.queryDictType()
      }
      this.GetSysOrgDictTree('430000000000')
    },
    changUser() {
      if(this.value.aqzrdwid && this.value.aqzrdwid.length !== 0 && this.value.aqzrdwid) {
        this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.aqzrdwid[this.value.aqzrdwid.length - 1] }).then(d => {
          this.userList = clone(this.users.sysUserFromOrgid)
          if(this.userList && this.userList.length !== 0 && this.value.aqzrrjh) {
            this.value.aqzrrdh = this.userList.find(d => d.userId === this.value.aqzrrjh).mobile || ''
          }
        })
      }
    },
    /**
     * 修改单位下拉列表
     * @return {[type]} [description]
     */
    changUserList(value) {
      this.IsSelectOrg = value
      if(value && value.length !== 0 && value !== '') {
        this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: value[value.length - 1] }).then(d => {
          this.userList = clone(this.users.sysUserFromOrgid)
          this.value.aqzrrjh = ''
        })
      } else {
        this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: '431200000000' }).then(d => {
          this.userList = clone(this.users.sysUserFromOrgid)
          this.value.aqzrrjh = ''
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
      // 表单字典初始化
      this.getDict(['ZDCSBW', 'WZFWLX']).then(res => {
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
  props: ['value', 'form', 'dataType', 'defaultArea', 'flag'],
  mounted() {},
  computed: {
    ...mapState(['users', 'orgs'])
  },
  created() {
    this.initDialog()
  }
}
</script>
