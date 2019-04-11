<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">个人极端行为排查</h3>
  </div>

  <div>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="犯罪行为表现方式" prop="fzxwfs" label-width="210px">
          <el-checkbox-group v-model="value.fzxwfs">
            <el-checkbox :label="item.value" v-for="item in dictLists['FZXWFS']" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="原因分析" prop="yyfx" label-width="210px">
          <el-checkbox-group v-model="value.yyfx">
            <el-checkbox :label="item.value" v-for="item in dictLists['YYFX']" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="线索来源" prop="xsly" label-width="210px">
          <el-checkbox-group v-model="value.xsly">
            <el-checkbox :label="item.value" v-for="item in dictLists['XXLY']" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="扬言或预谋实施使用手段" prop="sysd" label-width="210px">
          <el-checkbox-group v-model="value.sysd">
            <el-checkbox :label="item.value" v-for="item in dictLists['YMSYSD']" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="扬言或预谋实施使用场所" prop="sycs" label-width="210px">
          <el-checkbox-group v-model="value.sycs">
            <el-checkbox :label="item.value" v-for="item in dictLists['YMSYCS']" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="6" label="工作抓手" prop="Address">
        <el-input v-model="form.Address"></el-input>
      </el-col> -->
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="是否明确责任领导及责任人 " prop="sfmqzrld" label-width="210px">
          <el-radio-group v-model="value.sfmqzrld">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否实施准备" prop="sfsszb" label-width="147px">
          <el-radio-group v-model="value.sfsszb">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否通报责任部门" prop="sftbzrbm" label-width="147px">
          <el-radio-group v-model="value.sftbzrbm">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="基层政府部门责任领导 " prop="jczfzrld" label-width="210px">
          <el-input :maxlength="50" v-model="value.jczfzrld"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="责任人" prop="zrr1" label-width="147px">
          <el-input :maxlength="50" v-model="value.zrr1"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="责任人" prop="zrr2" label-width="147px">
          <el-input :maxlength="50" v-model="value.zrr2"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="派出所领导 " prop="pcsld" label-width="210px">
          <el-select v-model="value.pcsld" @clear="clearUserInfo" filterable remote clearable :remote-method="nameRemoteScreen" :loading="selectQueryLoading" style="width: 100%" placeholder="输入姓名关键字搜索">
            <el-option style="height: auto" v-for="(item,ik) in userList" :key="ik" :label="item.name" :value="item.name">
              <div class="select-option_div">
                <b>{{item.name}}</b><br/>
                <span style="font-size: 12px;line-height: 1">{{item.num}}<br/></span>
                <span style="font-size: 12px;line-height: 1">{{item.unitText}}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="责任民警" prop="zrmj1" label-width="147px">
          <el-select v-model="value.zrmj1" @clear="clearUserInfo" filterable remote clearable :remote-method="nameRemoteScreen" :loading="selectQueryLoading" style="width: 100%" placeholder="输入姓名关键字搜索">
            <el-option style="height: auto" v-for="(item,ik) in userList" :key="ik" :label="item.name" :value="item.name">
              <div class="select-option_div">
                <b>{{item.name}}</b><br/>
                <span style="font-size: 12px;line-height: 1">{{item.num}}<br/></span>
                <span style="font-size: 12px;line-height: 1">{{item.unitText}}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="责任民警" prop="zrmj2" label-width="147px">
          <el-select v-model="value.zrmj2" @clear="clearUserInfo" filterable remote clearable :remote-method="nameRemoteScreen" :loading="selectQueryLoading" style="width: 100%" placeholder="输入姓名关键字搜索">
            <el-option style="height: auto" v-for="(item,ik) in userList" :key="ik" :label="item.name" :value="item.name">
              <div class="select-option_div">
                <b>{{item.name}}</b><br/>
                <span style="font-size: 12px;line-height: 1">{{item.num}}<br/></span>
                <span style="font-size: 12px;line-height: 1">{{item.unitText}}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="稳控方式 " prop="wkfs" label-width="210px">
          <el-select placeholder="请选择" v-model="value.wkfs" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['WKFS']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="失控原因" prop="skyy" label-width="147px">
          <el-select placeholder="请选择" v-model="value.skyy" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['JDSKYY']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="在控状态" prop="zkzt" label-width="147px">
          <el-select placeholder="请选择" v-model="value.zkzt" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['JDZKZT']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="情报部门是否提供每日研判省级 " prop="ypzc" label-width="210px">
          <el-radio-group v-model="value.ypzc">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="市州" prop="ypzcsz" label-width="147px">
          <el-radio-group v-model="value.ypzcsz">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="县市区" prop="ypzcxj" label-width="147px">
          <el-radio-group v-model="value.ypzcxj">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="风险等级 " prop="fxdj" label-width="210px">
          <el-select placeholder="请选择" v-model="value.fxdj" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['FXDJ']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="风险隐患描述" prop="fxyhms" label-width="147px">
          <el-input v-model="value.fxyhms"></el-input>
        </el-form-item>
      </el-col>
    </el-row> -->

    <!-- <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="登记民警姓名" prop="djmj" label-width="210px">
          <el-input v-model="value.djmj" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="登记民警单位" prop="djdw" label-width="147px">
          <el-input v-model="value.djdw" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="登记时间" prop="djsj" label-width="147px">
          <el-date-picker v-model="value.djsj" type="datetime" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="操作民警姓名" prop="czmj" label-width="210px">
          <el-input v-model="value.czmj" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="操作单位" prop="czdw" label-width="147px">
          <el-input v-model="value.czdw" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="操作时间" prop="czsj" label-width="147px">
          <el-date-picker v-model="value.czsj" type="datetime" style="width: 100%"></el-date-picker>
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
import { FETCH_USER_LIST_BY_KEYWORD } from '../../../../../store/types'
import { mapState } from 'vuex'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      dictLists: [],
      newinfo: null,
      selectQueryLoading: false, // 远程搜索loading
      currentTableListUser: [], // 当前列表存在的用户
      userList: []
    }
  },
  computed: {
    ...mapState(['orgs', 'users'])
  },
  methods: {
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
      //  this.reset()
    },
    initDialog() {
      // this.value = clone(this.dataForm)
      if(this.dictLists.length <= 0) {
        this.queryDictType()
      }
    },
    queryDictType() {
      //  表单字典初始化
      this.getDict(['FZXWFS', 'YYFX', 'XXLY', 'YMSYSD', 'YMSYCS', 'WKFS', 'JDSKYY', 'JDZKZT']).then(res => {
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
