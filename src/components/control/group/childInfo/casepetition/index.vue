<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">非正常上访重点人管控</h3>
  </div>

  <div>
    <el-row :gutter="8">
      <el-col :span="12">
        <el-form-item label="管控情况" prop="gkqk" label-width="106px">
          <el-radio-group v-model="value.gkqk">
            <el-radio :label="item.value" v-for="item in dictLists['GKQK']" style="margin-left:15px;  white-space: initial; vertical-align: top;" :key="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="管控等级 " prop="gkdj" label-width="106px">
          <el-radio-group v-model="value.gkdj">
            <el-radio :label="item.value" v-for="item in dictLists['GKDJ']" style="margin-left:15px;  white-space: initial; vertical-align: top;" :key="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="责任单位" prop="zrdw" label-width="106px">
          <el-cascader :maxlength="50" :show-all-cldjs="false" :filterable="true" v-model="value.zrdw" :options="CollectDeptList" :clearable="true" :props="{children:'children',value:'orgId',label:'name'}" :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="责任人" prop="zrr" label-width="106px">
          <el-input v-model="value.zrr" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系方式" prop="zrrlxfs" label-width="106px">
          <el-input v-model="value.zrrlxfs" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row> -->
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="主控单位" prop="zrdw">
          <el-cascader :maxlength="50" :show-all-cldjs="false" :filterable="true" v-model="value.zrdw" :options="CollectDeptList" :clearable="true" :show-all-levels="false" @change="changUserList(value.zrdw)" :props="{children:'children',value:'orgId',label:'name'}"
            :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="责任民警" prop="zrr">
          <el-select v-model="value.zrr" filterable @change="changUser" style="width: 100%">
            <el-option style="height: auto" v-for="item in userList" :key="item.userId" :label="item.xm" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系方式" prop="zrrlxfs" label-width="106px">
          <el-input :maxlength="50" v-model="value.zrrlxfs"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="3">
      <el-col :span="24">
        <el-form-item label="列管事由" prop="lgsy" label-width="106px">
          <el-input :maxlength="150" type="textarea" v-model="value.lgsy"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="3">
      <el-col :span="24">
        <el-form-item label="管控措施" prop="gkcs" label-width="106px">
          <el-input :maxlength="150" type="textarea" v-model="value.gkcs"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="登记民警" prop="djmj" label-width="106px">
          <el-input v-model="value.djmj" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="登记单位" prop="djdw" label-width="106px">
          <el-input v-model="value.djdw" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="登记时间" prop="cjsj" label-width="106px">
          <el-date-picker v-model="value.cjsj" type="datetime" style="width: 100%"></el-date-picker>
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
      newinfo: null,
      userList: [],
      IsSelectOrg: '',
      CollectDeptList: []
    }
  },
  computed: {
    ...mapState(['orgs', 'users'])
  },
  methods: {
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
    changUser(zkzrmj) {
      if(this.value.zrdw && this.value.zrdw.length !== 0 && this.value.zrdw) {
        this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.zrdw[this.value.zrdw.length - 1] }).then(d => {
          this.userList = clone(this.users.sysUserFromOrgid)
          if(this.userList && this.userList.length !== 0 && zkzrmj) {
            this.value.zrrlxfs = this.userList.find(d => d.userId === zkzrmj).mobile || ''
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
          this.value.zkzrmj = ''
        })
      } else {
        this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: '431200000000' }).then(d => {
          this.userList = clone(this.users.sysUserFromOrgid)
          this.value.zkzrmj = ''
        })
      }
    },
    queryDictType() {
      //  表单字典初始化
      this.getDict(['GKQK', 'GKDJ']).then(res => {
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
