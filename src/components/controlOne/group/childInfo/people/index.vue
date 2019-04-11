<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">重点人群工作信息</h3>
  </div>

  <div>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="管控级别" prop="gkjb">
          <el-input :maxlength="50" v-model="value.gkjb"></el-input>
        </el-form-item>
      </el-col>


      <el-col :span="8">
        <el-form-item label="管控措施" prop="gkcs">
          <el-input :maxlength="50" v-model="value.gkcs"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="工作抓手" prop="gzzs">
          <el-input :maxlength="50" v-model="value.gzzs"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="危害评估" prop="whpg">
          <el-input type="textarea" placeholder="请输入危害评估" :autosize="{minRows: 3, maxRows: 50}" v-model="value.whpg"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="主控单位" prop="zkdw">
          <el-cascader :maxlength="50" :show-all-cldjs="false" :filterable="true" v-model="value.zkdw" :options="CollectDeptList" :clearable="true" :show-all-levels="false" @change="changUserList(value.zkdw)" :props="{children:'children',value:'orgId',label:'name'}"
            :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="责任民警" prop="zkzrmj">
          <el-select v-model="value.zkzrmj" filterable @change="changUser" style="width: 100%">
            <el-option style="height: auto" v-for="item in userList" :key="item.userId" :label="item.xm" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系方式" prop="zklxfs" label-width="106px">
          <el-input :maxlength="50" v-model="value.zklxfs"></el-input>
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
      <span style="color:#c00;margin-left:100px">(主控及协控单位：修改后将档案移交到其他单位管控， 非主控或协控单位人员无法查看人员信息，请谨慎修改。)
      </span>
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
  components: {
    listToTree
  },
  data() {
    return {
      dictLists: [],
      selectQueryLoading: false, // 远程搜索loading
      currentTableListUser: [], // 当前列表存在的用户
      userList: [],
      IsSelectOrg: '',
      IsSelectOrg2: '',
      CollectDeptList: [],
      userList2: [],
      newinfo: null
    }
  },
  methods: {
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
    changUser(zkzrmj) {
      if(this.value.zkdw && this.value.zkdw.length !== 0 && this.value.zkdw) {
        this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.zkdw[this.value.zkdw.length - 1] }).then(d => {
          this.userList = clone(this.users.sysUserFromOrgid)
          if(this.userList && this.userList.length !== 0 && zkzrmj) {
            this.value.zklxfs = this.userList.find(d => d.userId === zkzrmj).mobile || ''
          }
        })
      } else {
        if(this.userList && this.userList.length !== 0 && zkzrmj) {
          this.value.zklxfs = this.userList.find(d => d.userId === zkzrmj).mobile || ''
        }
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
          this.value.zkzrmj = ''
        })
      } else {
        this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: '431200000000' }).then(d => {
          this.userList = clone(this.users.sysUserFromOrgid)
          this.value.zkzrmj = ''
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
      //  this.reset()
    },
    initDialog() {
      this.GetSysOrgDictTree('430000000000')
    }
  },
  watch: {
    newinfo: {
      handle() {
        this.$emit('updata:value', this.value)
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['orgs', 'users'])
  },
  props: ['value', 'form'],
  mounted() {},
  created() {
    this.initDialog()
  }
}
</script>
