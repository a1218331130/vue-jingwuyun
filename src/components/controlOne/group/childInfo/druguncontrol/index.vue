<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">脱管失控吸毒人员信息</h3>
  </div>

  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="脱管失控原因" prop="tgskyy" label-width="106px">
          <el-checkbox-group v-model="value.tgskyy">
            <el-checkbox :label="item.value" v-for="item in dictLists['TGSKYY']" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="处置情况" prop="czqk" label-width="106px">
          <el-checkbox-group v-model="value.czqk">
            <el-checkbox :label="item.value" v-for="item in dictLists['CZQK']" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="管控现状" prop="gkxz" label-width="106px">
          <el-checkbox-group v-model="value.gkxz">
            <el-checkbox :label="item.value" v-for="item in dictLists['GKXZ']" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="主控单位" prop="gkdw">
          <el-cascader :maxlength="50" :show-all-cldjs="false" :filterable="true" v-model="value.gkdw" :options="CollectDeptList" :clearable="true" :show-all-levels="false" @change="changUserList(value.gkdw)" :props="{children:'children',value:'orgId',label:'name'}"
            :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="责任民警" prop="zrmj">
          <el-select v-model="value.zrmj" filterable @change="changUser()" style="width: 100%">
            <el-option style="height: auto" v-for="item in userList" :key="item.userId" :label="item.xm" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系方式" prop="lxfs" label-width="106px">
          <el-input :maxlength="50" v-model="value.lxfs"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="协控单位" prop="xkdw">
          <el-cascader :maxlength="50" :show-all-cldjs="false" :filterable="true" v-model="value.xkdw" :options="CollectDeptList" :clearable="true" :show-all-levels="false" @change="changUserList2(value.xkdw)" :props="{children:'children',value:'orgId',label:'name'}"
            :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="责任民警" prop="xkzrmj">
          <el-select v-model="value.xkzrmj" filterable @change="changUser2()" style="width: 100%">
            <el-option style="height: auto" v-for="item in userList2" :key="item.userId" :label="item.xm" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系方式" prop="xklxfs" label-width="106px">
          <el-input :maxlength="50" v-model="value.xklxfs"></el-input>
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
export default {
  mixins: [mixin],
  components: {},
  computed: {
    ...mapState(['users', 'orgs'])
  },
  data() {
    return {
      dictLists: [],
      selectQueryLoading: false, // 远程搜索loading
      currentTableListUser: [], // 当前列表存在的用户
      newinfo: null,
      userList: [],
      IsSelectOrg: '',
      IsSelectOrg2: '',
      CollectDeptList: [],
      userList2: [],
      name: ''
    }
  },
  methods: {
    /**
     * 填充关联信息
     * @param item
     */
    selectUserInfo2(item) {
      this.userList.map(ri => {
        if(ri.userId === item) {
          this.value.xklxfs = ri.tel
          this.value.xkdw = ri.unitText
          // let _te = this.editForm
          // this.editForm = Object.assign(_te, ri)
        }
      })
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
    changUser() {
      if(this.value.gkdw && this.value.gkdw.length !== 0 && this.value.gkdw) {
        this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.gkdw[this.value.gkdw.length - 1] }).then(d => {
          this.userList = clone(this.users.sysUserFromOrgid)
          if(this.userList && this.userList.length !== 0 && this.value.zrmj) {
            this.value.lxfs = this.userList.find(d => d.userId === this.value.zrmj).mobile || ''
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
          this.value.zrmj = ''
        })
      } else {
        this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: '431200000000' }).then(d => {
          this.userList = clone(this.users.sysUserFromOrgid)
          this.value.zrmj = ''
        })
      }
    },
    changUser2() {
      if(this.value.xkdw && this.value.xkdw.length !== 0 && this.value.xkdw) {
        this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.xkdw[this.value.xkdw.length - 1] }).then(d => {
          this.userList2 = clone(this.users.sysUserFromOrgid)
          if(this.userList2 && this.userList2.length !== 0 && this.value.xkzrmj) {
            this.value.xklxfs = this.userList2.find(d => d.userId === this.value.xkzrmj).mobile || ''
          }
        })
      }
    },
    /**
     * 修改单位下拉列表
     * @return {[type]} [description]
     */
    changUserList2(value) {
      this.IsSelectOrg2 = value
      if(value && value.length !== 0 && value !== '') {
        this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: value[value.length - 1] }).then(d => {
          this.userList2 = clone(this.users.sysUserFromOrgid)
          this.value.xkzrmj = ''
        })
      } else {
        this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: '431200000000' }).then(d => {
          this.userList2 = clone(this.users.sysUserFromOrgid)
          this.value.xkzrmj = ''
        })
      }
    },
    /**
     * 清除表单关联信息
     */
    clearUserInfo() {
      this.reset()
    },
    initDialog() {
      // this.editForm = clone(this.dataForm)
      if(this.dictLists.length <= 0) {
        this.queryDictType()
      }
      this.GetSysOrgDictTree('430000000000')
    },
    queryDictType() {
      //  表单字典初始化
      this.getDict(['TGSKYY', 'CZQK', 'GKXZ']).then(res => {
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
