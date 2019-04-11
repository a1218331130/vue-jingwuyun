<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">重点行业单位基本信息</h3>
  </div>

  <div>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="重点行业单位类型" prop="zdhylb" label-width="147px">
          <el-select :maxlength="50" v-model="value.zdhylb" disabled filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdhylbArr['ZDHYDW']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="行业单位名称" prop="zdhymc" label-width="147px">
          <el-input :maxlength="50" :disabled="flag" v-model="value.zdhymc"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="单位电话" prop="hydh" label-width="147px">
          <el-input :maxlength="50" :disabled="flag" v-model="value.hydh"></el-input>
        </el-form-item>
      </el-col>

    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="详细地址" prop="xxdz" label-width="104px">
          <el-input :maxlength="200" :disabled="flag" v-model="value.xxdz"></el-input>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="8">
        <el-form-item label="经度" prop="jd" label-width="147px">
          <el-input v-model="value.jd" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="纬度" prop="wd" label-width="147px">
          <el-input v-model="value.wd" :maxlength="50"></el-input>
        </el-form-item>
      </el-col> -->
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="管控原因" prop="gkyy" label-width="104px">
          <el-input type="textarea" :disabled="flag" :maxlength="500" v-model="value.gkyy"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8" icon="icon iconfont icon-plus">
        <el-form-item label="经纬度" label-width="147px">
          <el-col :span="11" style="padding:0">
            <el-input v-model="value.jd" :disabled="flag" :maxlength="50"></el-input>
          </el-col>
          <el-col :span="2">-</el-col>
          <el-col :span="11" style="padding:0">
            <el-input v-model="value.wd" :disabled="flag" :maxlength="50"></el-input>
          </el-col>
          <el-button v-if="!flag" type="text" icon="icon iconfont icon-dingwei" @click="openMap" style="position:absolute;z-index:9"></el-button>
        </el-form-item>
      </el-col>

      <el-col :span="8" v-if="dataType === 'school'||dataType === 'lg'">
        <el-form-item label="工作人员数量" prop="gzrysl" label-width="147px">
          <el-input :maxlength="50" :disabled="flag" v-model="value.gzrysl"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="dataType === 'wljdy'">
        <el-form-item label="机构类型" prop="jglx" label-width="147px">
          <el-select :maxlength="50" v-model="value.jglx" :disabled="flag" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdhylbArr['JGLX']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="dataType === 'yhbz'" :span="8">
        <el-form-item label="单位类别" prop="dwlb" label-width="147px">
          <el-select :maxlength="50" v-model="value.dwlb" :disabled="flag" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdhylbArr['DWLB']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="dataType === 'wb'">
        <el-form-item label="运营状态" prop="yyzt" label-width="147px">
          <el-select :maxlength="50" v-model="value.yyzt" :disabled="flag" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdhylbArr['YYZT']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="dataType === 'wb'">
        <el-form-item label="停运时间" prop="tysj" label-width="147px">
          <el-date-picker :disabled="value.yyzt!=='YYZT002' && flag" v-model="value.tysj" :maxlength="50" type="datetime" placeholder="请选择时间" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>

      <!-- 党政机关 -->
      <el-col :span="8" v-if="dataType === 'dzjg'">
        <el-form-item label="保卫部门（专干）" prop="bwbm" label-width="147px">
          <el-input v-model="value.bwbm" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="dataType === 'dzjg'">
        <el-form-item label="联系电话" prop="lxdh" label-width="147px">
          <el-input v-model="value.lxdh" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <!-- 医院 -->
      <el-col :span="8" v-if="dataType === 'yy'">
        <el-form-item label="医院等级" prop="yydj" label-width="147px">
          <el-select :maxlength="50" v-model="value.yydj" :disabled="flag" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdhylbArr['YYDJ']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 易制毒 -->
      <el-col :span="8" v-if="dataType === 'yzddw'">
        <el-form-item label="单位(企业)类型" prop="dwlx" label-width="147px">
          <el-select :maxlength="50" v-model="value.dwlx" :disabled="flag" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdhylbArr['ZDDWLX']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="dataType === 'yzddw'">
        <el-form-item label="单位(企业)现状" prop="dwxz" label-width="147px">
          <el-select :maxlength="50" v-model="value.dwxz" :disabled="flag" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdhylbArr['ZDDWXZ']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 经济犯罪 -->
      <el-col :span="8" v-if="dataType === 'jjfzwsdw'">
        <el-form-item label="案件类别" prop="ajlb" label-width="147px">
          <el-select :maxlength="50" v-model="value.ajlb" :disabled="flag" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdhylbArr['SZAJLB']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="dataType === 'jjfzwsdw'">
        <el-form-item label="法定代表人" prop="fddbr" label-width="147px">
          <el-input v-model="value.fddbr" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 银行金融  -->
    <el-row :gutter="5" v-if="dataType==='yhjrjg'">
      <el-col :span="8">
        <el-form-item label="安保部门负责人姓名" prop="abbmfzrxm" label-width="147px">
          <!-- <el-select :maxlength="50" v-model="value.aqzrrzw" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdhylbArr['ZRRZW']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select> -->
          <el-input :maxlength="50" :disabled="flag" v-model="value.abbmfzrxm"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="有效身份证件号码" prop="yxsfzhm" label-width="147px">
          <el-input :maxlength="50" :disabled="flag" v-model="value.yxsfzhm"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="负责人联系电话" prop="lxdh" label-width="147px">
          <el-input v-model="value.lxdh" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 剧毒危险化学品 民爆物品 易制爆单位 枪支弹药单位 烟火爆竹企业 放射性物品单位 -->
    <el-row :gutter="5" v-if="dataType === 'wxhxwp'||dataType === 'mbqy'||dataType === 'yzbdw'||dataType === 'sqsc'||dataType === 'yhbz'||dataType === 'fsxwp'">

      <el-col :span="8">
        <el-form-item label="负责人姓名" prop="dwfzrxm" label-width="147px">
          <el-input v-model="value.dwfzrxm" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="负责人身份证号" prop="dwfzrsfz" label-width="147px">
          <el-input v-model="value.dwfzrsfz" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="负责人联系电话" prop="fzrlxdh" label-width="147px">
          <el-input v-model="value.fzrlxdh" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col v-if="dataType === 'wxhxwp'||dataType === 'fsxwp'" :span="24">
        <el-form-item label="发现的其他问题" prop="qtwt" label-width="147px">
          <el-input type="textarea" v-model="value.qtwt" :disabled="flag" :maxlength="300"></el-input>
        </el-form-item>
      </el-col>

      <!-- <el-col :span="8">
        <el-form-item label="检查单位" prop="jcdw" label-width="147px">
          <el-input v-model="value.jcdw" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="检查人员" prop="jcry" label-width="147px">
          <el-input v-model="value.jcry" :maxlength="50"></el-input>
        </el-form-item>
      </el-col> -->

      <el-col :span="8">
        <el-form-item label="检查单位" prop="jcdw" label-width="147px">
          <el-cascader :maxlength="50" :show-all-cldjs="false" :filterable="true" :disabled="flag" v-model="value.jcdw" :options="CollectDeptList" :clearable="true" :show-all-levels="false" @change="changUserList(value.jcdw)" :props="{children:'children',value:'orgId',label:'name'}"
            :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="检查人员" prop="jcry" label-width="147px">
          <el-select v-model="value.jcry" :disabled="flag" filterable @change="changUser()" style="width: 100%">
            <el-option style="height: auto" v-for="item in userList" :key="item.userId" :label="item.xm" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="检查日期" prop="jcrq" label-width="147px">
          <el-date-picker v-model="value.jcrq" :disabled="flag" :maxlength="50" placeholder="请选择日期" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <!--经济犯罪涉稳单位-->
    <el-row :gutter="5" v-if="dataType === 'jjfzwsdw'">

      <el-col :span="8">
        <el-form-item label="涉及地域" prop="sjdy" label-width="147px">
          <el-select :maxlength="50" v-model="value.sjdy" :disabled="flag" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdhylbArr['SJDY']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="涉案金额" prop="saje" label-width="147px">
          <el-input v-model="value.saje" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="涉及人数" prop="sjrs" label-width="147px">
          <el-input v-model="value.sjrs" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="受案单位" prop="sadw" label-width="147px">
          <el-cascader :maxlength="50" :show-all-cldjs="false" :filterable="true" :disabled="flag" v-model="value.sadw" :options="CollectDeptList" :clearable="true" :show-all-levels="false" @change="changUserList(value.sadw)" :props="{children:'children',value:'orgId',label:'name'}"
            :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="主办民警" prop="zbmj" label-width="147px">
          <el-input v-model="value.zbmj" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="民警联系方式" prop="mjlxfs" label-width="147px">
          <el-input v-model="value.mjlxfs" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="涉案简要情况" prop="sajyqk" label-width="147px">
          <el-input type="textarea" v-model="value.sajyqk" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 医院 -->
    <el-row :gutter="5" v-if="dataType === 'yy'">
      <el-col :span="24">
        <el-form-item label="涉医案件发案情况" prop="stajfaqk" label-width="147px">
          <el-input type="textarea" v-model="value.stajfaqk" :disabled="flag" :maxlength="300"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="分管保卫领导姓名" prop="fgbwldxm" label-width="147px">
          <el-input v-model="value.fgbwldxm" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="分管保卫联系电话" prop="fgbwlxdh" label-width="147px">
          <el-input v-model="value.fgbwlxdh" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5" v-if="dataType === 'yy'">
      <el-col :span="8">
        <el-form-item label="保卫部门负责人姓名" prop="bwbmfzrxm" label-width="147px">
          <el-input v-model="value.bwbmfzrxm" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="保卫部门联系电话" prop="bwbmlxdh" label-width="147px">
          <el-input v-model="value.bwbmlxdh" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 旅馆 -->
    <el-row :gutter="5" v-if="dataType === 'lg'">
      <!-- <el-col :span="8">
        <el-form-item label="工作人员数量" prop="gzrysl" label-width="147px">
          <el-input v-model="value.gzrysl" :maxlength="50"></el-input>
        </el-form-item>
      </el-col> -->
      <el-col :span="8">
        <el-form-item label="有证无证" prop="yzwz" label-width="147px">
          <el-select :maxlength="50" v-model="value.yzwz" :disabled="flag" placeholder="请选择" style="width: 100%">
            <el-option label="无" value="0"></el-option>
            <el-option label="有" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="工商营业执照编号" prop="gsyyzzbh" label-width="147px">
          <el-input v-model="value.gsyyzzbh" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发照时间" prop="yyzzfzsj" label-width="147px">
          <el-date-picker v-model="value.yyzzfzsj" :disabled="flag" :maxlength="50" type="date" placeholder="请选择时间" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="有无特种证" prop="ywtzz" label-width="147px">
          <el-select :maxlength="50" v-model="value.ywtzz" :disabled="flag" placeholder="请选择" style="width: 100%">
            <el-option label="无" value="0"></el-option>
            <el-option label="有" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="特种行业许可证编号" prop="tzhyxkzbh" label-width="147px">
          <el-input v-model="value.tzhyxkzbh" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发证时间" prop="hyxkzfzsj" label-width="147px">
          <el-date-picker v-model="value.hyxkzfzsj" :disabled="flag" :maxlength="50" type="date" placeholder="请选择时间" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="经营负责人姓名" prop="jyfzrxm" label-width="147px">
          <el-input v-model="value.jyfzrxm" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="有效身份证件号码" prop="jyfzrsfz" label-width="147px">
          <el-input v-model="value.jyfzrsfz" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="负责人联系电话" prop="jyfzrdh" label-width="147px">
          <el-input v-model="value.jyfzrdh" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 物流寄递单位 -->
    <el-row :gutter="5" v-if="dataType === 'wljdy'">
      <el-col :span="8">
        <el-form-item label="分支机构数" prop="fzjgs" label-width="147px">
          <el-input v-model="value.fzjgs" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="末端网点数" prop="mdwds" label-width="147px">
          <el-input v-model="value.mdwds" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5" v-if="dataType === 'wljdy'">
      <el-col :span="8">
        <el-form-item label="快递业务员数" prop="kdywys" label-width="147px">
          <el-input v-model="value.kdywys" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="持证快递业务员数" prop="czkdywys" label-width="147px">
          <el-input v-model="value.czkdywys" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5" v-if="dataType === 'wljdy'">
      <el-col :span="8">
        <el-form-item label="法人姓名" prop="frxm" label-width="147px">
          <el-input v-model="value.frxm" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="法人身份证号" prop="frsfz" label-width="147px">
          <el-input v-model="value.frsfz" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="法人联系电话" prop="frlxfs" label-width="147px">
          <el-input v-model="value.frlxfs" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5" v-if="dataType === 'wljdy'">
      <el-col :span="8">
        <el-form-item label="工商营业执照编号" prop="gsyyzzbh" label-width="147px">
          <el-input v-model="value.gsyyzzbh" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="营业执照审批时间" prop="yyzzspsj" label-width="147px">
          <el-date-picker v-model="value.yyzzspsj" :disabled="flag" :maxlength="50" type="date" placeholder="请选择时间" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5" v-if="dataType === 'wljdy'">
      <el-col :span="8">
        <el-form-item label="行政许可证编号" prop="hyxzxkzbh" label-width="147px">
          <el-input v-model="value.hyxzxkzbh" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="许可证审批时间" prop="xzxkspsj" label-width="147px">
          <el-date-picker v-model="value.xzxkspsj" :disabled="flag" :maxlength="50" type="date" placeholder="请选择时间" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5" v-if="dataType === 'wljdy'">
      <el-col :span="8">
        <el-form-item label="治安负责人姓名" prop="zafzrxm" label-width="147px">
          <el-input v-model="value.zafzrxm" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="治安负责人身份证号" prop="zafzrsfz" label-width="147px">
          <el-input v-model="value.zafzrsfz" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="治安负责人联系电话" prop="zafzrlxdh" label-width="147px">
          <el-input v-model="value.zafzrlxdh" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 易制毒单位 -->
    <el-row :gutter="5" v-if="dataType === 'yzddw'">
      <el-col :span="24">
        <el-form-item label="涉及易制毒化学品" prop="sjyzdhxpmc" label-width="147px">
          <el-input type="textarea" v-model="value.sjyzdhxpmc" :disabled="flag" :maxlength="300"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5" v-if="dataType === 'yzddw'">
      <!-- <el-col :span="8">
        <el-form-item label="安全责任单位" prop="aqzrdw" label-width="147px">
          <el-input v-model="value.aqzrdw" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="安全责任人" prop="aqzrr" label-width="147px">
          <el-input v-model="value.aqzrr" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="负责人联系电话" prop="aqzrrlxdh" label-width="147px">
          <el-input v-model="value.aqzrrlxdh" :maxlength="50"></el-input>
        </el-form-item>
      </el-col> -->
      <el-col :span="8">
        <el-form-item label="安全责任单位" prop="aqzrdw" label-width="147px">
          <el-cascader :maxlength="50" :show-all-cldjs="false" :filterable="true" v-model="value.aqzrdw" :options="CollectDeptList" :clearable="true" :show-all-levels="false" @change="changUserList2(value.aqzrdw)" :props="{children:'children',value:'orgId',label:'name'}"
            :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="安全责任人" prop="aqzrr" label-width="147px">
          <el-select v-model="value.aqzrr" :disabled="flag" filterable @change="changUser2()" style="width: 100%">
            <el-option style="height: auto" v-for="item in userList2" :key="item.userId" :label="item.xm" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="负责人联系电话" prop="aqzrrlxdh" label-width="147px">
          <el-input :maxlength="50" v-model="value.aqzrrlxdh" :disabled="flag"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 网吧 -->
    <!-- <el-row :gutter="5" v-if="dataType === 'wb'">
      <el-col :span="8">
        <el-form-item label="运营状态" prop="yyzt" label-width="147px">
          <el-select :maxlength="50" v-model="value.yyzt" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdhylbArr['YYZT']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="停运时间" prop="tysj" label-width="147px">
          <el-date-picker :disabled="value.yyzt!=='YYZT002'" v-model="value.tysj" :maxlength="50" type="datetime" placeholder="请选择时间" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row> -->
    <!--中小学及幼儿园-->
    <el-row :gutter="5" v-if="dataType === 'school'">
      <el-col :span="8">
        <el-form-item label="单位负责人姓名" prop="gdwfzrxm" label-width="147px">
          <el-input v-model="value.gdwfzrxm" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="有效身份证件号码" prop="yxfszhm" label-width="147px">
          <el-input v-model="value.yxfszhm" :disabled="flag" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系电话" prop="lxdh" label-width="147px">
          <el-input :maxlength="50" :disabled="flag" v-model="value.lxdh"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!--保安服务公司-->
    <el-row :gutter="5" v-if="dataType === 'bafwgs'">
      <el-col :span="8">
        <el-form-item label="分管保卫领导姓名" prop="fgbwldxm" label-width="147px">
          <el-input v-model="value.fgbwldxm" :disabled="flag" :maxlength="300"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="分管保卫联系电话" prop="fgbwlxdh" label-width="147px">
          <el-input v-model="value.fgbwlxdh" :disabled="flag" :maxlength="300"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5" v-if="dataType === 'bafwgs'">
      <el-col :span="8">
        <el-form-item label="保安服务负责人姓名" prop="bafwfzrxm" label-width="147px">
          <el-input v-model="value.bafwfzrxm" :disabled="flag" :maxlength="300"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="保安服务联系电话" prop="bafwlxdh" label-width="147px">
          <el-input v-model="value.bafwlxdh" :disabled="flag" :maxlength="300"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
  <!-- 地图弹窗 -->
  <!--  v-draggable="dialogDraggableOptions" -->
  <el-dialog :visible.sync="dialogMapvisible" size="full" :modal="false">
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
  import pgis from '../../../../../widgets/location-selector/control-map.vue'
  import mixin from '../../../../../utils/mixin'
  import bus from '../../../../../utils/bus'
  import { mapState } from 'vuex'
  import { clone } from '../../../../../utils/util'
  import { listToTree } from '../../../../../utils/listToTree'
  import { GET_SYS_ORG_TREE, FETCH_SYS_USERS_BY_ORGID } from '../../../../../store/types'
  export default {
    mixins: [mixin],
    components: { pgis },
    data() {
      return {
        dictLists: [],
        newinfo: null,
        userList: [],
        IsSelectOrg: '',
        IsSelectOrg2: '',
        CollectDeptList: [],
        userList2: [],
        zdhylbArr: [],
        dialogMapvisible: false,
        flag: false
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
        bus.$on('details', d => {
          this.flag = d;
        })
      },
      /**
       * [initUserList 初始化用户下拉框]
       * @return {[type]} [description]
       */
      initUserList() {
        if (this.value.jcdw && this.value.jcdw.length !== 0 && this.value.jcdw[0] !== '' && this.value.jcdw !== '') {
          this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.jcdw[this.value.jcdw.length - 1] }).then(d => {
            this.userList = clone(this.users.sysUserFromOrgid)
          })
        }
        if (this.value.aqzrdw && this.value.aqzrdw.length !== 0 && this.value.aqzrdw[0] !== '' && this.value.aqzrdw !== '') {
          this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.aqzrdw[this.value.aqzrdw.length - 1] }).then(d => {
            this.userList2 = clone(this.users.sysUserFromOrgid)
          })
        }
      },
      changUser() {
        if (this.value.jcdw && this.value.jcdw.length !== 0 && this.value.jcdw[0] !== '' && this.value.jcdw) {
          this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.jcdw[this.value.jcdw.length - 1] }).then(d => {
            this.userList = clone(this.users.sysUserFromOrgid)
            if (this.userList && this.userList.length !== 0 && this.value.jcry) {
              this.value.aqzrrdh = this.userList.find(d => d.userId === this.value.jcry).mobile || ''
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
      /**
       * 修改单位下拉列表
       * @return {[type]} [description]
       */
      changUserList(value) {
        this.IsSelectOrg = value
        if (value && value.length !== 0 && value !== '') {
          this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: value[value.length - 1] }).then(d => {
            this.userList = clone(this.users.sysUserFromOrgid)
            this.value.jcry = ''
          })
        } else {
          this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: '431200000000' }).then(d => {
            this.userList = clone(this.users.sysUserFromOrgid)
            this.value.jcry = ''
          })
        }
      },
      changUser2() {
        if (this.value.aqzrdw && this.value.aqzrdw.length !== 0 && this.value.aqzrdw) {
          this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.aqzrdw[this.value.aqzrdw.length - 1] }).then(d => {
            this.userList2 = clone(this.users.sysUserFromOrgid)
            if (this.userList2 && this.userList2.length !== 0 && this.value.aqzrr) {
              this.value.aqzrrlxdh = this.userList2.find(d => d.userId === this.value.aqzrr).mobile || ''
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
        if (value && value.length !== 0 && value !== '') {
          this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: value[value.length - 1] }).then(d => {
            this.userList2 = clone(this.users.sysUserFromOrgid)
            this.value.aqzrr = ''
          })
        } else {
          this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: '431200000000' }).then(d => {
            this.userList2 = clone(this.users.sysUserFromOrgid)
            this.value.aqzrr = ''
          })
        }
      },
      queryDictType() {
        // 表单字典初始化
        this.getDict(['ZDHYDW', 'JQDJ', 'ZRRZW', 'CSLX', 'SYGN', 'JZYT', 'YYZT', 'YYDJ', 'DWLB', 'JGLX', 'ZDDWLX', 'ZDDWXZ', 'SZAJLB', 'SJDY']).then(res => {
          this.zdhylbArr = res
        })
      },
      handleGrid(data) {
        if (data) {
          this.value.jd = parseFloat(data[0].toFixed(3))
          this.value.wd = parseFloat(data[1].toFixed(3))
          this.dialogMapvisible = false
        }
      },
      openMap() {
        this.dialogMapvisible = true
        setTimeout(() => {
          if (this.value.jd && this.value.wd && parseInt(this.value.jd) && typeof parseInt(this.value.wd)) {
            this.$refs.controlPgis.renderMarker([{ x: this.value.jd, y: this.value.wd }])
            let position = new window.EzCoord(this.value.jd, this.value.wd)
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
    computed: {
      ...mapState(['users', 'orgs'])
    },
    props: ['value', 'form', 'dataType', 'flag'],
    mounted() {},
    created() {
      this.initDialog()
    }
  }

</script>
