<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">重点场所基本信息</h3>
  </div>

  <div ref="formSet">
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="重点场所类型" prop="zdcslx" label-width="147px">
          <el-select :maxlength="50" v-model="value.zdcslx" disabled filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdcslxArr['ZDCSBW']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="场所名称" prop="csmc" label-width="147px">
          <el-input :maxlength="50" :disabled="this.flag" v-model="value.csmc"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="场所电话" prop="csdh" label-width="147px">
          <el-input :maxlength="50" :disabled="this.flag" v-model="value.csdh"></el-input>
        </el-form-item>
      </el-col>

    </el-row>
    <el-row :gutter="5">
      <!-- <el-col :span="8">
        <el-form-item label="联系电话" prop="dwfzrdh" label-width="147px">
          <el-input :maxlength="50" v-model="value.dwfzrdh"></el-input>
        </el-form-item>
      </el-col> -->
      <!-- <el-col :span="8">
        <el-form-item label="经度" prop="csjd" label-width="147px">
          <el-input v-model="value.csjd" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="纬度" prop="cdwd" label-width="147px">
          <el-input v-model="value.cdwd" :maxlength="50"></el-input>
        </el-form-item>
      </el-col> -->
      <el-col :span="8" icon="icon iconfont icon-plus">
        <el-form-item label="经纬度" label-width="104px">
          <el-col :span="11" style="padding:0">
            <el-input v-model="value.csjd" :disabled="this.flag" :maxlength="50"></el-input>
          </el-col>
          <el-col :span="2">-</el-col>
          <el-col :span="11" style="padding:0">
            <el-input v-model="value.cdwd" :disabled="this.flag" :maxlength="50"></el-input>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="4" v-if="!this.flag">
        <el-button type="text" icon="icon iconfont icon-dingwei" @click="openMap"></el-button>
      </el-col>
      <el-col :span="24">
        <el-form-item label="详细地址" prop="csdz" label-width="104px">
          <el-input v-model="value.csdz" type="textarea" :disabled="this.flag" :maxlength="300"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="管控原因" prop="gkyy" label-width="104px">
          <el-input type="textarea" :maxlength="300" :disabled="this.flag" v-model="value.gkyy"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!--旅游景区-->
    <el-row :gutter="5" v-if="dataType === 'lyjq'">
      <el-col :span="8">
        <el-form-item label="景区等级" prop="jqdj" label-width="147px">
          <el-select :maxlength="50" :disabled="this.flag" v-model="value.jqdj" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdcslxArr['JQDJ']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="景点数" prop="jds" label-width="147px">
          <el-input v-model="value.jds" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="日接待游客数量" prop="rjdyks" label-width="147px">
          <el-input v-model="value.rjdyks" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="场所负责人" prop="dwfzrxm" label-width="147px">
          <el-input v-model="value.dwfzrxm" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="责任人职位" prop="aqzrrzw" label-width="147px">
          <el-select :maxlength="50" :disabled="this.flag" v-model="value.aqzrrzw" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdcslxArr['ZRRZW']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="有效身份证件号码" prop="dwfzrsfz" label-width="147px">
          <el-input :maxlength="50" :disabled="this.flag" v-model="value.dwfzrsfz"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!--旅游景区end-->
    <!-- 关注人员聚集场所 -->
    <el-row :gutter="5" v-if="dataType === 'ryjjcs'">
      <el-col :span="8">
        <el-form-item label="场所类型" prop="cslx" label-width="147px">
          <el-select :maxlength="50" :disabled="this.flag" v-model="value.cslx" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdcslxArr['CSLX']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="规模" prop="gm" label-width="147px">
          <el-input v-model="value.gm" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="单位责任人" prop="dwzrr" label-width="147px">
          <el-input v-model="value.dwzrr" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="责任人电话" prop="zrrdh" label-width="147px">
          <el-input v-model="value.zrrdh" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="责任人职务" prop="zrrzw" label-width="147px">
          <el-select :maxlength="50" :disabled="this.flag" v-model="value.zrrzw" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdcslxArr['ZRRZW']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="群体人数" prop="qtrs" label-width="147px">
          <el-input v-model="value.qtrs" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="主要来源地" prop="qtrs" label-width="147px">
          <el-input v-model="value.zylyd" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="从业情况" prop="qtrs" label-width="147px">
          <el-input v-model="value.cyqk" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 关注人员聚集场所end -->
    <!-- 大型室内市场 -->
    <el-row :gutter="5" v-if="dataType === 'dxsnsc'">
      <!-- <el-col :span="8">
        <el-form-item label="检查人员警号" prop="jcyjh" label-width="147px">
          <el-input v-model="value.jcyjh" :maxlength="50"></el-input>
        </el-form-item>
      </el-col> -->
      <el-col :span="8">
        <el-form-item label="场所层数" prop="cscs" label-width="147px">
          <el-input v-model="value.cscs" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="营业面积" prop="yymz" label-width="147px">
          <el-input v-model="value.yymz" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="投入使用时间" prop="trsysj" label-width="147px">
          <el-date-picker :maxlength="50" :disabled="this.flag" type="date" v-model="value.trsysj" placeholder="请选择" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="8">
        <el-form-item label="检查单位" prop="jcdwmc" label-width="147px">
          <el-input v-model="value.jcdwmc" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="检查人员姓名" prop="jcyxm" label-width="147px">
          <el-input v-model="value.jcyxm" :maxlength="50"></el-input>
        </el-form-item>
      </el-col> -->
      <el-col :span="8">
        <el-form-item label="检查单位" prop="jcdwid" label-width="147px">
          <el-cascader :maxlength="50" :disabled="this.flag" :show-all-cldjs="false" :filterable="true" v-model="value.jcdwid" :options="CollectDeptList" :clearable="true" :show-all-levels="false" @change="changUserList2(value.jcdwid)" :props="{children:'children',value:'orgId',label:'name'}"
            :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="检查人" prop="jcyjh" label-width="147px">
          <el-select v-model="value.jcyjh" :disabled="this.flag" filterable @change="changUser2()" style="width: 100%">
            <el-option style="height: auto" v-for="item in userList2" :key="item.userId" :label="item.xm" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="检查时间" prop="jcsj" label-width="147px">
          <el-date-picker :maxlength="50" :disabled="this.flag" v-model="value.jcsj" placeholder="请选择" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>

    </el-row>
    <!-- 大型室内市场end -->
    <!-- 农村团寨 -->
    <el-row :gutter="5" v-if="dataType === 'nctz'">
      <el-col :span="8">
        <el-form-item label="检查人员警号" prop="jcryjh" label-width="147px">
          <el-input v-model="value.jcryjh" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="检查人员姓名" prop="jcryxm" label-width="147px">
          <el-input v-model="value.jcryxm" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="户数" prop="hs" label-width="147px">
          <el-input v-model="value.hs" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="常住人口" prop="czrk" label-width="147px">
          <el-input v-model="value.czrk" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 农村团寨end -->
    <!-- 大型商场及金银珠宝店 -->
    <el-row :gutter="5" v-if="dataType === 'dxsczb'">
      <el-col :span="8">
        <el-form-item label="工商营业执照编号" prop="yyzz" label-width="147px">
          <el-input v-model="value.yyzz" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="审批时间" prop="spsj" label-width="147px">
          <el-date-picker :maxlength="50" :disabled="this.flag" v-model="value.spsj" placeholder="请选择" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 大型商场及金银珠宝店end -->
    <!-- 大型活动 -->
    <el-row :gutter="5" v-if="dataType === 'dxhd'">
      <el-col :span="8">
        <el-form-item label="举办时间" prop="jbsj" label-width="147px">
          <el-date-picker :maxlength="50" :disabled="this.flag" type="datetime" v-model="value.jbsj" placeholder="请选择" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="参与人员数量" prop="cyrs" label-width="147px">
          <el-input v-model="value.cyrs" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="许可类型" prop="xklx" label-width="147px">
          <el-input v-model="value.xklx" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="审批机构" prop="spjg" label-width="147px">
          <el-input v-model="value.spjg" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 大型活动end -->
    <!-- 高层建筑 -->
    <el-row :gutter="5" v-if="dataType === 'gcjz'">
      <el-col :span="8">
        <el-form-item label="检查人员" prop="jcry" label-width="147px">
          <el-input v-model="value.jcry" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="使用或管理单位" prop="syhgldw" label-width="147px">
          <el-input v-model="value.syhgldw" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="建成年份" prop="jcnf" label-width="147px">
          <el-input v-model="value.jcnf" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="建筑面积(㎡)" prop="jzmz" label-width="147px">
          <el-input v-model="value.jzmz" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="建筑层数(地上)" prop="jzcs1" label-width="147px">
          <el-input v-model="value.jzcs1" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="建筑层数(地下)" prop="jzcs2" label-width="147px">
          <el-input v-model="value.jzcs2" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="建筑高度(m)" prop="jzgd" label-width="147px">
          <el-input v-model="value.jzgd" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="使用功能" prop="sygn" label-width="147px">
          <el-select :maxlength="50" :disabled="this.flag" v-model="value.sygn" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdcslxArr['SYGN']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="建筑用途" prop="jzyt" label-width="147px">
          <el-select :maxlength="50" :disabled="this.flag" v-model="value.jzyt" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdcslxArr['JZYT']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 高层建筑end -->
    <el-row :gutter="5" v-if="dataType === 'gcjz' || dataType === 'nctz'">
      <el-col :span="8">
        <el-form-item label="检查单位" prop="jcdw" label-width="147px">
          <el-select :maxlength="50" :disabled="this.flag" v-model="value.jcdw" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdcslxArr['JCDW']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="检查日期" prop="jcrq" label-width="147px">
          <el-date-picker :maxlength="50" :disabled="this.flag" v-model="value.jcrq" placeholder="请选择" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>

    <!--大型广场人员密集场所-->
    <el-row :gutter="5" v-if="dataType === 'rymjcs'">
      <el-col :span="8">
        <el-form-item label="安全容量" prop="aqrl" label-width="147px">
          <el-input :maxlength="50" :disabled="this.flag" v-model="value.aqrl"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="面积" prop="mz" label-width="147px">
          <el-input v-model="value.mz" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="人员密度" prop="rymd" label-width="147px">
          <el-input v-model="value.rymd" :disabled="this.flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="经常举办活动情况" prop="jcjbhdqk" label-width="147px">
          <el-input :maxlength="150" :disabled="this.flag" v-model="value.jcjbhdqk"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!--大型广场人员密集场所end-->


    <!-- <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="安全责任单位" prop="aqzrdwid" label-width="147px">
          <el-input v-model="value.aqzrdwid" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="安全责任人" prop="aqzrrjh" label-width="147px">
          <el-input v-model="value.aqzrrjh" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="安全责任人联系电话" prop="aqzrrdh" label-width="147px">
          <el-input v-model="value.aqzrrdh" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row> -->
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="安全责任单位" prop="aqzrdwid" label-width="147px">
          <el-cascader :maxlength="50" :disabled="this.flag" :show-all-cldjs="false" :filterable="true" v-model="value.aqzrdwid" :options="CollectDeptList" :clearable="true" :show-all-levels="false" @change="changUserList(value.aqzrdwid)" :props="{children:'children',value:'orgId',label:'name'}"
            :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="安全责任人" prop="aqzrrjh" label-width="147px">
          <el-select v-model="value.aqzrrjh" :disabled="this.flag" filterable @change="changUser()" style="width: 100%">
            <el-option style="height: auto" v-for="item in userList" :key="item.userId" :label="item.xm" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="安全责任人联系电话" prop="aqzrrdh" label-width="147px">
          <el-input :maxlength="50" :disabled="this.flag" v-model="value.aqzrrdh"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
  <!-- 地图弹窗 -->
  <el-dialog :visible.sync="dialogMapvisible" size="full" :modal="dialogModal">
    <pgis ref="controlPgis" class="map-box__item" layer="PGIS_CS_FWCS_DH_PG_BG" mapStyle="height:100%;" :showSidebar="false" :showTools="false" @on-updata-grid="handleGrid"></pgis>
  </el-dialog>
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
  import pgis from '../../../../../widgets/location-selector/control-map.vue'
  export default {
    mixins: [mixin],
    components: {
      pgis
    },
    data() {
      return {
        dictLists: [],
        newinfo: null,
        zdcslxArr: [],
        userList: [],
        IsSelectOrg: '',
        CollectDeptList: [],
        IsSelectOrg2: '',
        userList2: [],
        dialogMapvisible: false,
        dialogModal: false
      }
    },
    methods: {
      initDialog() {
        // this.editForm = clone(this.dataForm)
        if (this.dictLists.length <= 0) {
          this.queryDictType()
        }
        this.GetSysOrgDictTree('430000000000')
        this.initUserList()
      },
      initUserList() {
        if (this.value.aqzrdwid && this.value.aqzrdwid.length !== 0 && this.value.aqzrdwid[0] !== '' && this.value.aqzrdwid !== '') {
          this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.aqzrdwid[this.value.aqzrdwid.length - 1] }).then(d => {
            this.userList = clone(this.users.sysUserFromOrgid)
          })
        }
        if (this.value.jcdwid && this.value.jcdwid.length !== 0 && this.value.jcdwid[0] !== '' && this.value.jcdwid !== '') {
          this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.jcdwid[this.value.jcdwid.length - 1] }).then(d => {
            this.userList2 = clone(this.users.sysUserFromOrgid)
          })
        }
      },
      changUser() {
        if (this.value.aqzrdwid && this.value.aqzrdwid.length !== 0 && this.value.aqzrdwid[0] !== '' && this.value.aqzrdwid) {
          this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.aqzrdwid[this.value.aqzrdwid.length - 1] }).then(d => {
            this.userList = clone(this.users.sysUserFromOrgid)
            if (this.userList && this.userList.length !== 0 && this.value.aqzrrjh) {
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
        if (value && value.length !== 0 && value !== '') {
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
      changUser2() {
        if (this.value.jcdwid && this.value.jcdwid.length !== 0 && this.value.jcdwid[0] !== '' && this.value.jcdwid) {
          this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.jcdwid[this.value.jcdwid.length - 1] }).then(d => {
            this.userList2 = clone(this.users.sysUserFromOrgid)
          })
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
            this.value.jcyjh = ''
          })
        } else {
          this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: '431200000000' }).then(d => {
            this.userList2 = clone(this.users.sysUserFromOrgid)
            this.value.jcyjh = ''
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
        this.getDict(['ZDCSBW', 'JQDJ', 'ZRRZW', 'CSLX', 'SYGN', 'JZYT', 'JCDW']).then(res => {
          this.zdcslxArr = res
        })
      },
      handleGrid(data) {
        if (data) {
          this.value.csjd = data[0].toFixed(3)
          this.value.cdwd = data[1].toFixed(3)
          this.dialogMapvisible = false
        }
      },
      openMap() {
        this.dialogMapvisible = true
        setTimeout(() => {
          if (this.value.csjd && this.value.cdwd && parseInt(this.value.csjd) && typeof parseInt(this.value.cdwd)) {
            this.$refs.controlPgis.renderMarker([{ x: this.value.csjd, y: this.value.cdwd }])
            let position = new window.EzCoord(this.value.csjd, this.value.cdwd)
            this.$refs.controlPgis.map.centerAndZoom(position, 10)
          } else {
            this.$refs.controlPgis.clearMap()
          }
        }, 20)
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
    props: ['value', 'form', 'dataType', 'flag'],
    // methods: {},
    mounted() {},
    computed: {
      ...mapState(['users', 'orgs'])
    },
    created() {
      this.initDialog()
    }
  }

</script>
