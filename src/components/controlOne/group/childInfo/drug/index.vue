<template>
<div style="height:100%">
  <div>
    <!-- <h3>社会面吸毒人员</h3> -->
  </div>

  <div>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-form-item label-width="206px" label="是否纳入重点人员一体化系统" prop="nrxt">
          <el-radio-group v-model="value.nrxt">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="106px" label="高风险" prop="gfxdm" class="checkArr">
          <el-checkbox-group v-model="value.gfxdm" style="margin-bottom:0px">
            <el-checkbox :disabled="value.zfxdm.length>0 ||value.dfxdm.length>0" :label="item.value" v-for="item in dictLists['GFX']" style="width:100%; margin-left:15px" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label-width="106px" label="中风险" prop="zfxdm" class="checkArr">
          <el-checkbox-group v-model="value.zfxdm" style="margin-bottom:0px">
            <el-checkbox :disabled="value.gfxdm.length>0 ||value.dfxdm.length>0" :label="item.value" v-for="item in dictLists['ZFX']" style="width:100%; margin-left:15px" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label-width="106px" label="低风险" prop="dfxdm" class="checkArr">
          <el-checkbox-group v-model="value.dfxdm" style="margin-bottom:0px">
            <el-checkbox :disabled="value.gfxdm.length>0 ||value.zfxdm.length>0" :label="item.value" v-for="item in dictLists['DFX']" style="width:100%; margin-left:15px" :key="item.value">{{item.label}} </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="106px" label="管控措施" prop="gkcs" class="checkArr">
          <el-checkbox-group v-model="value.gkcs" style="margin-bottom:0px">
            <el-checkbox :label="item.value" v-for="item in dictLists['GKCS']" style="margin-left:15px" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="106px" label="管控状态" prop="gkzt" class="checkArr">
          <el-checkbox-group v-model="value.gkzt" style="margin-bottom:0px">
            <el-checkbox :label="item.value" v-for="item in dictLists['GKZT']" style="margin-left:15px" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="6" label="工作抓手" prop="Address">
        <el-input :maxlength="50" v-model="form.Address"></el-input>
      </el-col> -->
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
<script>
import mixin from '../../../../../utils/mixin'
import { mapState } from 'vuex'
import { clone } from '../../../../../utils/util'
import { listToTree } from '../../../../../utils/listToTree'
import { GET_SYS_ORG_TREE, FETCH_SYS_USERS_BY_ORGID } from '../../../../../store/types'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      dictLists: [],
      newinfo: null,
      selectQueryLoading: false, // 远程搜索loading
      currentTableListUser: [], // 当前列表存在的用户
      userList: [],
      IsSelectOrg: '',
      IsSelectOrg2: '',
      CollectDeptList: [],
      userList2: []
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
    /**
     * 填充关联信息
     * @param item
     */
    selectUserInfo(item) {
      this.userList.map(ri => {
        if(ri.userId === item) {
          this.value.lxfs = ri.tel
          this.value.zkdw = ri.unitText
          // let _te = this.editForm
          // this.editForm = Object.assign(_te, ri)
        }
      })
    },
    /**
     * [initUserList 初始化用户下拉框]
     * @return {[type]} [description]
     */
    initUserList() {
      if(this.value.gkdw && this.value.gkdw.length !== 0 && this.value.gkdw[0] !== '' && this.value.gkdw !== '') {
        this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.gkdw[this.value.gkdw.length - 1] }).then(d => {
          this.userList = clone(this.users.sysUserFromOrgid)
        })
      }
      if(this.value.xkdw && this.value.xkdw.length !== 0 && this.value.xkdw[0] !== '' && this.value.xkdw !== '') {
        this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.xkdw[this.value.xkdw.length - 1] }).then(d => {
          this.userList2 = clone(this.users.sysUserFromOrgid)
        })
      }
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
    initDialog() {
      // this.editForm = clone(this.dataForm)
      if(this.dictLists.length <= 0) {
        this.queryDictType()
      }
      this.GetSysOrgDictTree('430000000000')
    },
    queryDictType() {
      //  表单字典初始化
      this.getDict(['LXFSLX', 'GFX', 'ZFX', 'DFX', 'GKZT', 'GKCS']).then(res => {
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
  computed: {
    ...mapState(['users', 'orgs'])
  },
  props: ['value', 'form'],
  mounted() {},
  created() {
    this.initDialog()
  }
}
</script>
