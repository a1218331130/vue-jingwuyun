<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">培训机构信息</h3>
  </div>

  <div>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="培训机构名称 " prop="xssmc" label-width="106px">
          <el-input :maxlength="50" vv-model="value.xssmc" style="width: 100%"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="所属市州 " prop="sssz" label-width="106px">
          <el-input :maxlength="50" vv-model="value.sssz"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="工商登记时间 " prop="gsdjsj" label-width="106px">
          <el-date-picker v-model="value.djsj" type="datetime" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="授权情况 " prop="sqqk" label-width="106px">
          <el-input :maxlength="50" vv-model="value.sqqk"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="法人/责任人" prop="fadb" label-width="106px">
          <el-input :maxlength="50" vv-model="value.fadb"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="责任人身份证" prop="fasfz" label-width="106px">
          <el-input :maxlength="50" vv-model="value.fasfz" placeholder="法人/责任人身份证"></el-input>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系方式" prop="lxfs" label-width="106px">
          <el-input :maxlength="50" vv-model="value.lxfs"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">

      <!-- <el-col :span="8">
        <el-form-item label="授权范围 " prop="xkzrwj" label-width="106px">
          <el-select v-model="value.xkzrwj" @change="selectUserInfo2" @clear="clearUserInfo" filterable remote clearable :remote-method="nameRemoteScreen" :loading="selectQueryLoading" style="width: 100%" placeholder="输入姓名关键字搜索">
            <el-option style="height: auto" v-for="(item,ik) in userList" :key="ik" :label="item.name" :value="item.userId">
              <div class="select-option_div">
                <b>{{item.name}}</b><br/>
                <span style="font-size: 12px;line-height: 1">{{item.num}}<br/></span>
                <span style="font-size: 12px;line-height: 1">{{item.unitText}}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col> -->
      <el-col :span="8">
        <el-form-item label="登记人 " prop="djr" label-width="106px">
          <el-input :maxlength="50" vv-model="value.djr"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="登记单位 " prop="djdw" label-width="106px">
          <el-input :maxlength="50" vv-model="value.djdw"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="登记时间  " prop="djsj" label-width="106px">
          <el-date-picker v-model="value.djsj" type="datetime" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="机构详细地址 " prop="xxdz" label-width="106px">
          <el-input :maxlength="50" vv-model="value.xxdz" placeholder="培训机构详细地址"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="bz1" label-width="106px">
          <el-input :maxlength="50" vv-model="value.bz1"></el-input>
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
import { FETCH_USER_LIST_BY_KEYWORD } from '../../../../../store/types'
export default {
  mixins: [mixin],
  components: {},
  computed: {
    ...mapState(['users'])
  },
  data() {
    return {
      dictLists: [],
      selectQueryLoading: false, // 远程搜索loading
      currentTableListUser: [], // 当前列表存在的用户
      newinfo: null,
      userList: [],
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
     * 根据关键条件查询民警信息列表
     */
    queryPoliceInfo(condition, callback = () => {}) {
      this.dispatch(FETCH_USER_LIST_BY_KEYWORD, condition).then(d => {
        callback()
      })
    },
    /**
     * 姓名远程筛选
     * @param keyword
     */
    nameRemoteScreen(keyword) {
      if(keyword !== '') {
        this.selectQueryLoading = false
        this.queryPoliceInfo({
          name: keyword
        }, () => {
          this.userList = this.users.fetchUserListByKeyword.map(r => {
            return {
              userId: r.userId,
              name: r.xm, // 姓名
              num: r.code, // 警号
              unit: r.orgId, // 单位id
              mobile: r.mobile, // 职位
              unitText: r.orgname, // 单位名称
              tel: r.mobile
            }
          })
          this.selectQueryLoading = false
        })
      } else {
        this.userList = []
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
