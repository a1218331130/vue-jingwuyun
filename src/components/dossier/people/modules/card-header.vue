<!-- 各个模块头部工具区域 -->
<template>
<div :class="{'header-tool':true,'header-border':show}">
  <span :class="{'d-sub-title':true, 'iconfont':!show, 'icon-iconziti23':!show}">{{title}}</span>
  <el-button type="text" :class="{'iconfont':true,'icon-packup-2':flag,'icon-unfold1':!flag}" style="line-height: 25px;padding: 10px" v-if="expand" @click="isShow"></el-button>
  <slot name="title-center"></slot>
  <dl class="handle-tool" v-if="tool==='share'">
  <slot name="export"></slot>
    <!--<dd >关注</dd>-->
    <!--<dd class="iconfont icon-share">分享</dd>-->
    <dd>
      <el-button type="text" class="export-text iconfont icon-daochu" @click="exportSnapshot">快照</el-button>
      <html-to-image :height="snapshotHeight" :el="snapshotDOM" :printName="snapshotName" :submit="snapshot" @generate="generateState"></html-to-image>
    </dd>
    <dd>
      <print-button btnType="text" class="print-text iconfont icon-dayin" printRange="dossier-list-ref"></print-button>
    </dd>
  </dl>
  <dl class="handle-tool" v-if="tool==='addbtn'">
    <dd>
      <el-button type="text" @click="dialogformvisible=true" size="mini" class="export-text iconfont icon-plus">新增
      </el-button>
    </dd>
  </dl>
  <el-dialog v-draggable="dialogDraggableOptions" :title=logtitle :visible.sync="dialogformvisible" @open="init">
    <!--亲属人群-->
    <div v-if="type==1">
      <el-form :model="kinshipnFrom" label-width="120px" ref="kinshipnFrom">
        <el-form-item label="姓名" prop="gxrxm" :rules="[{required: true, message: '必须输入姓名'}]">
          <el-input v-model.trim="kinshipnFrom.gxrxm" placeholder="请输入姓名" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="关系" prop="gx" :rules="[{required: true, message: '必须请选择关系', trigger: 'change'}]">
          <el-select v-model="kinshipnFrom.gx" placeholder="请选择关系" style="width:100%">
            <el-option v-for="item in kinshipnFrom.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" prop="gxrzjhm" :rules="[{required: true, message: '必须输入证件号码'},{pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '你的身份证格式不正确', trigger: 'blur'}]">
          <el-input v-model="kinshipnFrom.gxrzjhm" placeholder="关系人证件号" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="人员描述" prop="ms" :rules="[{required: true, message: '必须输入人员描述'}]">
          <el-input type="textarea" :row="2" v-model.trim="kinshipnFrom.ms" placeholder="请输入人员描述" :maxlength="300"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="kinshipnFromsubmit('kinshipnFrom')">确定</el-button>
          <el-button type="primary" @click="dialogformvisible=false">取消</el-button>
        </el-form-item>
      </el-form>

    </div>
    <!--证件信息-->
    <div v-if="type==2">
      <el-form :model="certificateFrom" label-width="120px" ref="certificateFrom">
        <el-form-item label="证件类型" prop="zjlxmc" :rules="[{required: true, message: '请选择证件类型'}]">
          <el-select v-model="certificateFrom.zjlxmc" placeholder="请选择证件类型" :maxlength="50" >
            <el-option value="身份证" label="身份证"></el-option>
            <el-option value="护照" label="护照"></el-option>
            <el-option value="警官证" label="警官证"></el-option>
            <el-option value="其他" label="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" prop="zjhm" :rules="[{required: true, message: '必须输入证件号码'}]">
          <el-input v-model.trim="certificateFrom.zjhm" placeholder="证件号码" :maxlength="28"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="ms" :rules="[{required: true, message: '必须输入描述'}]">
          <el-input type="textarea" :row="2" v-model="certificateFrom.ms" placeholder="请输入描述" :maxlength="200"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="certificateFromsubmit('certificateFrom')">确定</el-button>
          <el-button type="primary" @click="dialogformvisible=false">取消</el-button>
        </el-form-item>
      </el-form>

    </div>
    <!--通讯方式-->
    <div v-if="type==3">
      <el-form :model="communicationFrom" label-width="120px" ref="communicationFrom">
        <el-form-item label="通信号码" prop="txhm" :rules="[{required: true, message: '必须输入通信号码'},{type:'number', message: '通信号码必须为数字'}]">
          <el-input v-model.number="communicationFrom.txhm" placeholder="请输入通信号码" :maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="通讯类型" prop="txlx" :rules="[{required: true, message: '必须输入通讯类型'}]">
          <el-select v-model="communicationFrom.txlx" placeholder="请输入通讯类型"  >
            <el-option value="手机" label="手机"></el-option>
            <el-option value="固话" label="固话"></el-option>
            <el-option value="传真" label="传真"></el-option>
            <el-option value="QQ" label="QQ"></el-option>
            <el-option value="邮箱" label="邮箱"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="ms" :rules="[{required: true, message: '必须输描述'}]">
          <el-input type="textarea" :row="2" v-model="communicationFrom.ms" placeholder="请输入描述" :maxlength="200"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="communicationFromsubmit('communicationFrom')">确定</el-button>
          <el-button type="primary" @click="dialogformvisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--虚拟账户-->
    <div v-if="type==4">
      <el-form :model="virtualFrom" label-width="120px" ref="virtualFrom">
        <el-form-item label="账号" prop="zh" :rules="[{required: true, message: '必须输入账号'},{type:'number', message: '账号必须为数字'}]">
          <el-input v-model.number="virtualFrom.zh" placeholder="请输入账号" :maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="账号类型" prop="zhlx" :rules="[{required: true, message: '必须输入账号类型'}]">
          <el-input v-model="virtualFrom.zhlx" required placeholder="请输入账号类型" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nc">
          <el-input v-model="virtualFrom.nc" required placeholder="请输入昵称" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="ms" :rules="[{required: true, message: '必须输描述'}]">
          <el-input type="textarea" :row="2" v-model="virtualFrom.ms" placeholder="请输入描述" :maxlength="200"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="virtualFromsubmit('virtualFrom')">确定</el-button>
          <el-button type="primary" @click="dialogformvisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--轨迹规律-->
    <div v-if="type==5">
      <el-form :model="form" label-width="80px">
        <el-form-item label="关系">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="证件号">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-c">
        <el-button type="primary">确定</el-button>
        <el-button type="primary" @click="dialogformvisible=false">取消</el-button>
      </div>
    </div>
    <!--财产信息-->
    <div v-if="type==6">
      <div>
        <span>资产类型：</span>
        <el-radio-group v-model="propertyFrom.activeName">
          <el-radio label="GQ">股权</el-radio>
          <el-radio label="FC">房产</el-radio>
          <el-radio label="YH">银行</el-radio>
          <el-radio label="CL">车辆</el-radio>
          <el-radio label="ELSE">其他</el-radio>
        </el-radio-group>
      </div>
      <div>
          <el-form class="mar-t" :model="propertyFrom" label-width="100px" ref="propertyFrom" v-if="propertyFrom.activeName==='GQ'">
            <el-form-item label="企业编号" :rules="[{required: true, message: '必须输入企业编号'}]" prop="qybh">
              <el-input v-model="propertyFrom.qybh" required placeholder="请输入企业编号" :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="企业名称" :rules="[{required: true, message: '必须输入企业名称'}]" prop="qymc">
              <el-input v-model="propertyFrom.qymc" required placeholder="请输入企业名称" :maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="投资金额" :rules="[{required: true, message: '必须输入投资金额'}]" prop="tzje">
              <el-input v-model="propertyFrom.tzje" required placeholder="请输入投资金额" :maxlength="18"></el-input>
            </el-form-item>
            <el-form-item label="投资时间" :rules="[{required: true, message: '必须输入投资时间'}]" prop="tzsj">
              <el-date-picker type="date" v-model="propertyFrom.tzsj" placeholder="请选择日期" style="width:100%" @change="datemoth"></el-date-picker>
            </el-form-item>
            <el-form-item label="投资比例" :rules="[{required: true, message: '必须输入投资比例'}]" prop="tzbl">
              <el-input v-model="propertyFrom.tzbl" required placeholder="请输入投资比例" :maxlength="28"></el-input>
            </el-form-item>
          </el-form>

          <el-form class="mar-t" :model="propertyFrom" label-width="140px" ref="propertyFrom" v-if="propertyFrom.activeName==='FC'">
            <el-form-item label="房屋编号" :rules="[{required: true, message: '必须输入房屋编号'}]" prop="fwbh">
              <el-input v-model="propertyFrom.fwbh" required placeholder="请输入房屋编号" :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="产权证证件号码" :rules="[{required: true, message: '必须输入产权证证件号码'}]" prop="cqzzjhm">
              <el-input v-model="propertyFrom.cqzzjhm" required placeholder="请输入产权证证件号码" :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="地址" :rules="[{required: true, message: '必须输入地址'}]" prop="address">
              <el-input v-model="propertyFrom.address" required placeholder="请输入地址" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="房屋用途" :rules="[{required: true, message: '必须输入房屋用途'}]" prop="yt">
              <el-input v-model="propertyFrom.yt" required placeholder="请输入房屋用途" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="面积" :rules="[{required: true, message: '必须输入面积'},{type:'number', message: '请输入正确的面积数据，数据必须为数字'}]" prop="area">
              <el-input v-model.number="propertyFrom.area" required placeholder="请输入面积" :maxlength="28"></el-input>
            </el-form-item>
          </el-form>

          <el-form class="mar-t" :model=" propertyFrom" label-width="130px " ref="propertyFrom" v-if="propertyFrom.activeName==='YH'">
            <el-form-item label="银行帐号" :rules="[{required: true, message: '必须输入银行帐号'}] " prop="yhzh">
              <el-input v-model="propertyFrom.yhzh" required placeholder="请输入银行帐号 " :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="开户银行" :rules="[{required: true, message: '必须输入开户银行'}] " prop="khmc">
              <el-input v-model="propertyFrom.khmc" required placeholder="请输入开户银行 " :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="开户银行单位" :rules="[{required: true, message: '必须输入开户银行单位'}] " prop="dwmc">
              <el-input v-model="propertyFrom.dwmc" required placeholder="请输入开户银行单位" :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="开户日期 " :rules="[{required: true, message: '必须输入开户日期'}] " prop="khrq">
              <el-date-picker type="date" v-model="propertyFrom.khrq" placeholder="请选择开户日期" style="width:100%" @change="datemoth"></el-date-picker>
            </el-form-item>
          </el-form>

          <el-form class="mar-t" :model="propertyFrom" label-width="100px " ref="propertyFrom" v-if="propertyFrom.activeName==='CL'">
            <el-form-item label="登记时间" :rules="[{required: true, message: '必须输入登记时间'}]" prop="djsj">
              <el-date-picker type="date" v-model="propertyFrom.djsj" placeholder="请选择日期" style="width:100%" @change="datemoth"></el-date-picker>
            </el-form-item>
            <el-form-item label="品牌名称" :rules="[{required: true, message: '必须输入品牌名称'}]" prop="zwppmc">
              <el-input v-model="propertyFrom.zwppmc" required placeholder="请输入品牌名称" :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="车辆型号" :rules="[{required: true, message: '必须输入车辆型号'}]" prop="clxh">
              <el-input v-model="propertyFrom.clxh" required placeholder="请输入车辆型号" :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="金额" :rules="[{required: true, message: '必须输入金额'}]" prop="je">
              <el-input v-model="propertyFrom.je" required placeholder="请输入金额" :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="车牌号码" :rules="[{required: true, message: '必须输入车牌号码'}]" prop="cphm">
              <el-input v-model="propertyFrom.cphm" required placeholder="请输入金额" :maxlength="28"></el-input>
            </el-form-item>
          </el-form>

          <el-form class="mar-t" :model="propertyFrom" label-width="100px " ref="propertyFrom" v-if="propertyFrom.activeName==='ELSE'">
            <el-form-item label="标题" :rules="[{required: true, message: '必须输入标题'}]" prop="bt">
              <el-input v-model="propertyFrom.bt" required placeholder="请输入标题 " :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="标签" :rules="[{required: true, message: '必须输入标签'}]" prop="bq">
              <el-input v-model="propertyFrom.bq" required placeholder="请输入标签 " :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="描述" :rules="[{required: true, message: '必须输入描述'}]" prop="ms">
              <el-input v-model="propertyFrom.ms" required placeholder="请输入描述 " :maxlength="28"></el-input>
            </el-form-item>
          </el-form>
      </div>
      <div class="text-c ">
        <el-button type="primary " @click="propertyFromsubmit('ruleform') ">确定</el-button>
        <el-button type="primary " @click="dialogformvisible=false ">取消</el-button>
      </div>
    </div>
    <!--人事社保 -->
    <div v-if="type==8 ">
      <div>
        <span>人事社保类型：</span>
        <el-radio-group v-model="securityFrom.activeName">
          <el-radio label="RZ">任职</el-radio>
          <el-radio label="SB">社保</el-radio>
          <el-radio label="ELSE">其他</el-radio>
        </el-radio-group>
      </div>
      <div>
          <el-form class="mar-t" :model="securityFrom" label-width="100px" ref="securityFrom" v-if="securityFrom.activeName==='RZ'">
            <el-form-item label="单位名称" :rules="[{required: true, message: '必须输入单位名称'}]" prop="dwmc">
              <el-input v-model="securityFrom.dwmc" required placeholder="请输入单位名称" :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="单位代码" :rules="[{required: true, message: '必须输入单位代码'}]" prop="dwdm">
              <el-input v-model="securityFrom.dwdm" required placeholder="请输入单位代码" :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="职务" :rules="[{required: true, message: '必须输入职务'}]" prop="zw">
              <el-input v-model="securityFrom.zw" required placeholder="请输入职务" :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="入职时间" :rules="[{required: true, message: '必须输入创建时间'}]" prop="cjsj">
              <el-date-picker type="date" v-model="securityFrom.cjsj" placeholder="请选择创建时间" style="width:100%" @change="datemoth"></el-date-picker>
            </el-form-item>
          </el-form>

          <el-form class="mar-t" :model="securityFrom" label-width="140px" ref="securityFrom" v-if="securityFrom.activeName==='SB'">
            <el-form-item label="性别" :rules="[{required: true, message: '必须输入性别'}]" prop="xb">
              <el-input v-model="securityFrom.xb" required placeholder="请输入性别" :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="社保卡号" :rules="[{required: true, message: '必须输入社保卡号'}]" prop="sbkh">
              <el-input v-model="securityFrom.sbkh" required placeholder="请输入社保卡号" :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="单位" :rules="[{required: true, message: '必须输入单位'}]" prop="dwdz">
              <el-input v-model="securityFrom.dwdz" required placeholder="请输入单位" :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" :rules="[{required: true, message: '必须输入联系电话'}]" prop="lxdh">
              <el-input v-model="securityFrom.lxdh" required placeholder="请输入联系电话" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="文化程度" :rules="[{required: true, message: '必须输入文化程度'}]" prop="whcd">
              <el-input v-model="securityFrom.whcd" required placeholder="请输入文化程度" :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="就业状态" :rules="[{required: true, message: '必须输入就业状态'}]" prop="jyzt">
              <el-input v-model="securityFrom.jyzt" required placeholder="请输入就业状态" :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="工种" :rules="[{required: true, message: '必须输入工种'}]" prop="gz">
              <el-input v-model="securityFrom.gz" required placeholder="请输入工种" :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="职务" :rules="[{required: true, message: '必须输入职务'}]" prop="zw">
              <el-input v-model="securityFrom.zw" required placeholder="请输入职务" :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="办理单位名称" :rules="[{required: true, message: '必须输入办理单位名称'}]" prop="bldw">
              <el-input v-model="securityFrom.bldw" required placeholder="请输入办理单位名称" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="办理银行名称" :rules="[{required: true, message: '必须输入办理银行名称'}]" prop="blyh">
              <el-input v-model="securityFrom.blyh" required placeholder="请输入办理银行名称" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="代扣机构" :rules="[{required: true, message: '必须输入代扣机构'}]" prop="dkjg">
              <el-input v-model="securityFrom.dkjg" required placeholder="请输入代扣机构" :maxlength="100"></el-input>
            </el-form-item>

          </el-form>

          <el-form class="mar-t" :model="securityFrom" label-width="100px " ref="securityFrom" v-if="securityFrom.activeName==='ELSE'">
            <el-form-item label="标题" :rules="[{required: true, message: '必须输入标题'}]" prop="bt">
              <el-input v-model="securityFrom.bt" required placeholder="请输入标题 " :maxlength="28"></el-input>
            </el-form-item>
            <el-form-item label="标签" :rules="[{required: true, message: '必须输入标签'}]" prop="bq">
              <el-input v-model="securityFrom.bq" required placeholder="请输入标签 " :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="描述" :rules="[{required: true, message: '必须输入描述'}]" prop="ms">
              <el-input v-model="securityFrom.ms" required placeholder="请输入描述 " :maxlength="200"></el-input>
            </el-form-item>
          </el-form>
      </div>
      <div class="text-c ">
        <el-button type="primary " @click="securityFromsubmit('securityFrom')">确定</el-button>
        <el-button type="primary " @click="dialogformvisible=false ">取消</el-button>
      </div>
    </div>
    <!--图片视频 -->
    <div v-if="type==9 ">
      <el-form :model="picvideoFrom" label-width="100px" ref="picvideoFrom">
        <el-form-item prop="qsgx" label="类型">
          <el-radio-group v-model="picvideoFrom.type">
            <el-radio label="PIC">图片</el-radio>
            <el-radio label="VIDEO">视频</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="filename" label="文件名" :rules="[{required: true, message: '必须输入文件名'}] ">
          <el-input v-model="picvideoFrom.filename" placeholder="请输入文件名称" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="文件" prop="fileid">
          <div class="wrap-box__content">
            <input type="hidden" v-model="picvideoFrom.fileid" />
            <upload uploadType="previewMultiple" :isSinglePic="false" :isFormalSubmit="isFormalSubmit" @upload:submit="uploadSubmit" :currentFiles="currentFiles" :accept="accept">
            </upload>
          </div>
        </el-form-item>
      </el-form>
      <div class="text-c ">
        <el-button type="primary " @click="picvideoFromsubmit">确定</el-button>
        <el-button type="primary " @click="dialogformvisible=false ">取消</el-button>
      </div>
    </div>
    <!--社会关系 -->
    <div v-if="type==10 ">
      <el-form :model="socialconnectionFrom" label-width="150px " ref="socialconnectionFrom">
        <el-form-item label="关系人姓名" :rules="[{required: true, message: '必须输入关系人姓名'}] " prop="gxrxm">
          <el-input v-model="socialconnectionFrom.gxrxm" placeholder="请输入关系人姓名" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="关系人身份证号码" :rules="[{required: true, message: '必须输入关系人身份证号码'}] " prop="gxrzjhm">
          <el-input v-model="socialconnectionFrom.gxrzjhm" placeholder="请输入关系人身份证号码" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="关系描述" :rules="[{required: true, message: '必须输入关系描述'}] " prop="gxms">
          <el-input v-model="socialconnectionFrom.gxms" placeholder="请输入关系描述" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="标签" :rules="[{required: true, message: '必须输入标签'}] " prop="bq">
          <el-input v-model="socialconnectionFrom.bq" placeholder="请输入标签" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="性别" :rules="[{required: true, message: '必须输入性别'}] " prop="xb">
          <el-input v-model="socialconnectionFrom.xb" placeholder="请输入性别"></el-input>
        </el-form-item>
        <el-form-item label="籍贯" :rules="[{required: true, message: '必须输入籍贯'}] " prop="jg">
          <el-input v-model="socialconnectionFrom.jg" placeholder="请输入籍贯" :maxlength="50"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-c ">
        <el-button type="primary " @click="socialconnectionFromsubmit('ruleform')">确定</el-button>
        <el-button type="primary " @click="dialogformvisible=false">取消</el-button>
      </div>
    </div>
    <!--案事件关联 -->
    <div v-if="type==11 ">
      <el-form class="mar-t" :model="caseeventFrom" label-width="100px " ref="caseeventFrom">
        <el-form-item label="标题" :rules="[{required: true, message: '必须输入标题'}]" prop="bt">
          <el-input v-model="caseeventFrom.bt" required placeholder="请输入标题 " :maxlength="28"></el-input>
        </el-form-item>
        <el-form-item label="标签" :rules="[{required: true, message: '必须输入标签'}]" prop="bq">
          <el-input v-model="caseeventFrom.bq" required placeholder="请输入标签如:赌博... " :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="描述" :rules="[{required: true, message: '必须输入描述'}]" prop="ms">
          <el-input v-model="caseeventFrom.ms" required placeholder="请输入描述 " :maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-c ">
        <el-button type="primary " @click="caseeventFromsubmit">确定</el-button>
        <el-button type="primary " @click="dialogformvisible=false ">取消</el-button>
      </div>
    </div>
    <!--关联线索 -->
    <div v-if="type==12 ">
      <el-form :model="form " label-width="100px " ref="formbtn ">
        <el-form-item label="名称 " :rules="[{required: true, message: '必须输入名称'}] " prop="qsgx ">
          <el-input v-model="form.qsgx " placeholder="请输入名称 " :maxlength="28"></el-input>
        </el-form-item>
        <el-form-item label="标签 " :rules="[{required: true, message: '必须输入标签'}] " prop="qszjh ">
          <el-input v-model="form.qszjh " placeholder="可输入多个，用逗号分隔；”名称”、”描述” " :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="案件描述 " :maxlength="200 ">
          <el-input type="textarea " v-model="form.ms " placeholder="请输入案件描述 " :maxlength="200"></el-input>
        </el-form-item>

      </el-form>
      <div class="text-c ">
        <el-button type="primary " @click="onsubmit ">确定</el-button>
        <el-button type="primary " @click="dialogformvisible=false ">取消</el-button>
      </div>
    </div>
  </el-dialog>
</div>
</template>
<style scoped lang="scss">
  .header-tool {
    overflow: hidden;
    border-bottom: 2px solid #46BDFD;
    color: #46BDFD;
    position: relative;
    .expandMark {
      float: right;
      font-size: 18px;
    }
  }

  .d-sub-title {
    float: left;
    font-size: 14px;
    line-height: 45px;
  }

  .text-c {
    text-align: center;
  }

  .handle-tool {
    float: right;
    padding: 0;
    margin: 9px;
    dd {
      float: left;
      width: 65px;
      height: 28px;
      background-color: #46BDFD;
      line-height: 28px;
      color: #fff;
      text-align: center;
      font-size: 14px;
      margin-left: 10px;
      cursor: pointer;
      .print-text {
        padding: 0;
        color: #fff;
        font-size: 14px;
        width: 100%;
        height: 100%;
      }
      &.bg-yello {
        background-color: #FF9900;
      }
      .export-text {
        padding: 0;
        color: #fff;
        font-size: 14px;
        width: 100%;
        height: 100%;
        &.icon-plus {
          background-color: #f90;
        }
      }
      &:hover {
        background-color: #ff9900;
      }
    }
    .icon-move:before {
      margin-right: 3px;
    }
    .icon-save:before {
      margin-right: 3px;
    }
    .icon-export:before {
      margin-right: 3px;
    }
  }

  .mar-t {
    margin-top: 15px;
  }

  .header-tool.header-border {
    border-bottom: 1px solid #eee;
    .d-sub-title {}
  }

</style>
<script>
  import printButton from '../../../../widgets/print/print.vue'
  // import printButton from '../../../../widgets/print/jq-print.vue'
  import htmlToImage from '../../../../widgets/html-image/html-to-image.vue'
  import { closestRef, outerHeight } from '../../../../utils/util'
  import upload from '../../../../widgets/upload/upload.vue'
  import dossierMixin from '../../dossierMixin'
  import bus from '../../../../utils/bus'
  import {
    NEW_ARCHIVES,
    ADD_FAMILY_INFO,
    ADDPROPERTYINFO,
    ADDSOCIALRELATIONSHIPSINFO,
    ADD_PERSON_COMMUNICATION_INFO,
    ADD_VIRTUAL_INFO,
    ADD_PERSON_CERTIFICATE_INFO,
    ADDASSOCIATEDCUESINFO,
    ADDSOCIALSECURITYINFO,
    ADDPICANDVIDEOINFO
  } from '../../../../store/types'
  import { mapState } from 'vuex'
  export default {
    mixins: [dossierMixin],
    data() {
      return {
        isFormalSubmit: false,
        currentFiles: [], // 当前文件集合
        snapshot: false,
        flag: false, // 展开收起标记
        snapshotName: '人员档案',
        snapshotHeight: 0,
        snapshotDOM: document.body,
        accept: 'image/gif,image/jpg,image/png,image/jpeg,video/mp4', // 文件上传限制
        dialogformvisible: false,
        inittime: '',
        ryname: '',
        form: {
          qsxm: '',
          qsgx: '',
          qszjh: '',
          ms: ''
        },
        // 亲属人员
        kinshipnFrom: {
          ryname: '',
          gxrxm: '',
          gxrzjhm: '',
          gx: '',
          ms: '',
          options: [{
            value: '父',
            label: '父'
          }, {
            value: '母',
            label: '母'
          }, {
            value: '子',
            label: '子'
          }, {
            value: '女',
            label: '女'
          }]
        },
        // 证件信息
        certificateFrom: {
          ryname: '', // 姓名
          zjlx: '', // 证件类型
          zjlxmc: '', // 证件类型
          zjhm: '', // 证件号码
          ms: '' // 描述
        },
        // 通信信息
        communicationFrom: {
          ryname: '', // 姓名
          txlx: '', // 通信类型
          txhm: '', // 通信号码
          ms: '' // 描述
        },
        // 虚拟账户
        virtualFrom: {
          ryname: '', // 人员姓名
          zhlx: '', // 账号类型
          zh: '', // 账号
          nc: '', // 昵称(别名)
          ms: '' // 描述
        },
        // 财产信息
        propertyFrom: {
          activeName: 'GQ',
          type: '', // 类型
          ryname: '', // 姓名
          // 财产企业
          qybh: '', // 企业编号
          qymc: '', // 企业名称
          tzje: '', // 投资金额
          tzsj: '', // 投资时间
          tzbl: '', // 投资比例
          // 财产车辆
          djsj: '', // 登记时间
          zwppmc: '', // 品牌名称
          clxh: '', // 车辆型号
          je: '', // 金额
          cphm: '', // 车牌号码
          // 财产房产
          fwbh: '', // 房产编号
          cqzzjhm: '', // 产权证证件号码
          address: '', // 地址
          yt: '', // 房屋用途
          area: '', // 面积
          // 财产银行账号
          yhzh: '', // 银行账号
          khmc: '', // 开户名称
          dwmc: '', // 开户银行单位
          khrq: '', // 开户日期
          // 财产其他
          bt: '', // 标题
          ms: '', // 描述
          bq: '' // 标签
        },
        // 社会关系
        socialconnectionFrom: {
          ryname: '',
          gxrxm: '',
          gxrzjhm: '',
          gxms: '',
          bq: '',
          xb: '',
          jg: ''
        },
        // 事件关联
        caseeventFrom: {
          ryname: '', // 姓名
          bt: '', // 标题
          ms: '', // 描述
          bq: '' // 标签
        },
        // 社保信息
        securityFrom: {
          activeName: 'RZ',
          type: '', // 类型
          ryname: '', // 姓名
          // 任职
          dwmc: '',
          dwdm: '',
          cjsj: '',
          // 社保
          xb: '',
          dwdz: '',
          sbkh: '',
          lxdh: '',
          whcd: '',
          jyzt: '',
          gz: '',
          zw: '',
          bldw: '',
          blyh: '',
          dkjg: '',
          // 其他
          bt: '', // 标题
          ms: '', // 描述
          bq: '' // 标签
        },
        // 图片视频
        picvideoFrom: {
          ryname: '', // 姓名
          type: 'PIC',
          data: '',
          filename: ''
        }
      }
    },
    props: {
      title: {
        type: String,
        default: '标题'
      },
      tool: {
        type: String,
        default: ' '
      },
      type: {
        type: Number,
        default: 1
      },
      logtitle: {
        type: String,
        default: ' '
      },
      caseKey: {
        type: String,
        default: ' '
      },
      tableData: {},
      show: {
        type: Boolean,
        default: false
      },
      expand: {
        type: Boolean,
        default: false
      }
    },
    components: {
      htmlToImage,
      printButton,
      upload
    },
    watch: {
      tableData(val) {
        val.length ? this.flag = true : this.flag = false
        if (val.length !== 0) {
          this.$emit('on-update-expand', true)
        }
      }
    },
    methods: {
      uploadSubmit(f) {
        // 获取当前上传文件列表文件id
        if (f.Status === 1) { // 文件更新保存成功后提交
          let _fileIdArray = [],
            _fileName = [];
          // this.currentFiles = []
          for (let ii in f.data.fileList) {
            _fileIdArray.push({ name: f.data.fileList[ii].name.split('.')[0], id: f.data.fileList[ii].response.Data.ID })
            _fileName.push(f.data.fileList[ii].name.split('.')[0])
            // this.currentFiles.push({
            //   name: f.data.fileList[ii].name,
            //   id: f.data.fileList[ii].response.Data.ID
            // })
          }
          this.picvideoFrom.data = _fileIdArray
          this.picvideoFrom.filename = _fileName.join();
          console.log(this.picvideoFrom, 'this.picvideoFrom')
        }
      },
      datemoth(val) {
        this.inittime = val
      },
      init() {
        if (this.$refs.formbtn) this.$refs.formbtn.resetFields()
      },
      exportSnapshot() {
        // 开始导出
        closestRef(this, 'dossier-list-ref', dom => {
          this.snapshotHeight = outerHeight(dom)
          this.snapshotDOM = dom
          this.$('.handle-tool').css({ 'display': 'none' })
          this.$('.dossier-list-context').css({ 'padding': '20px 10px' })
          this.$nextTick(_ => {
            this.snapshot = true
          })
        })
      },
      generateState(type) {
        // 快照生成结束,状态重置
        this.$('.handle-tool').css({ 'display': 'block' })
        this.$('.dossier-list-context').css({ 'padding': '20px 0' })
        this.snapshot = false
      },
      // 杨梅自定义事件
      onsubmit(ruleform) {
        let addObject = {
          ArchivesType: '1',
          Keyword: this.caseKey,
          Module: this.title,
          CustomType: this.form.qsgx,
          KeyContent: this.form.qszjh,
          Detail: this.form.ms,
          IsOpen: '0',
          Reservation1: this.form.qsgx,
          Reservation2: this.form.qsxm
        }
        this.$refs.formbtn.validate((valid) => {
          if (valid === true) {
            this.dispatchDossier(NEW_ARCHIVES, addObject).then(() => {
              this.$message('档案添加成功');
              this.tableData.push(addObject)
              this.resetform(this.form);
              this.dialogformvisible = false
              this.$emit('call:change-update')
            })
          }
        })
      },
      // 新增亲属人员
      kinshipnFromsubmit(kinshipnFrom) {
        let addObject = {
          idcard: this.caseKey,
          ryname: this.ryname,
          gxrxm: this.kinshipnFrom.gxrxm,
          gxrzjhm: this.kinshipnFrom.gxrzjhm,
          gx: this.kinshipnFrom.gx,
          ms: this.kinshipnFrom.ms
        }
        this.$refs.kinshipnFrom.validate((valid) => {
          if (valid === true) {
            this.dispatchDossier(ADD_FAMILY_INFO, addObject).then(() => {
              this.$message('档案添加成功');
              this.resetform(this.kinshipnFrom);
              this.dialogformvisible = false
              this.$emit('call:change-update')
            })
          }
        })
      },
      // 新增证件信息
      certificateFromsubmit(certificateFrom) {
        let addObject = {
          idcard: this.caseKey,
          ryname: this.ryname,
          zjlx: '1',
          zjlxmc: this.certificateFrom.zjlxmc,
          zjhm: this.certificateFrom.zjhm,
          ms: this.certificateFrom.ms
        }
        this.$refs.certificateFrom.validate((valid) => {
          if (valid === true) {
            this.dispatchDossier(ADD_PERSON_CERTIFICATE_INFO, addObject).then(() => {
              this.$message('档案添加成功');
              this.resetform(this.certificateFrom);
              this.dialogformvisible = false
              this.$emit('call:change-update')
            })
          }
        })
      },
      // 新增通信信息
      communicationFromsubmit(communicationFrom) {
        let addObject = {
          idcard: this.caseKey,
          ryname: this.ryname,
          txlx: this.communicationFrom.txlx,
          txhm: this.communicationFrom.txhm,
          ms: this.communicationFrom.ms

        }
        this.$refs.communicationFrom.validate((valid) => {
          if (valid === true) {
            this.dispatchDossier(ADD_PERSON_COMMUNICATION_INFO, addObject).then(() => {
              this.$message('档案添加成功');
              this.resetform(this.communicationFrom);
              this.dialogformvisible = false
              this.$emit('call:change-update')
            })
          }
        })
      },
      // 新增虚拟账户
      virtualFromsubmit(virtualFrom) {
        let addObject = {
          idcard: this.caseKey,
          ryname: this.ryname,
          zhlx: this.virtualFrom.zhlx,
          zh: this.virtualFrom.zh,
          nc: this.virtualFrom.nc,
          ms: this.virtualFrom.ms
        }
        this.$refs.virtualFrom.validate((valid) => {
          if (valid === true) {
            this.dispatchDossier(ADD_VIRTUAL_INFO, addObject).then(() => {
              this.$message('档案添加成功');
              this.resetform(this.virtualFrom);
              this.dialogformvisible = false
              this.$emit('call:change-update')
            })
          }
        })
      },
      // 新增财产信息
      propertyFromsubmit(propertyFrom) {
        let addObject = {
          idcard: this.caseKey,
          ryname: this.ryname,
          type: this.propertyFrom.activeName,
          // 股权
          qybh: this.propertyFrom.qybh,
          qymc: this.propertyFrom.qymc,
          tzje: this.propertyFrom.tzje,
          tzsj: this.inittime,
          tzbl: this.propertyFrom.tzbl,
          // 房屋
          fwbh: this.propertyFrom.fwbh,
          cqzzjhm: this.propertyFrom.cqzzjhm,
          address: this.propertyFrom.address,
          yt: this.propertyFrom.yt,
          area: this.propertyFrom.area,
          // 车辆
          djsj: this.inittime,
          zwppmc: this.propertyFrom.zwppmc,
          clxh: this.propertyFrom.clxh,
          jeL: this.propertyFrom.jeL,
          cphm: this.propertyFrom.cphm,
          // 银行
          yhzh: this.propertyFrom.yhzh,
          khmc: this.propertyFrom.khmc,
          dwmc: this.propertyFrom.dwmc,
          khrq: this.inittime,
          // 自定义
          bt: this.propertyFrom.bt,
          ms: this.propertyFrom.ms,
          bq: this.propertyFrom.bq
        }
        this.$refs.propertyFrom.validate((valid) => {
          if (valid === true) {
            this.dispatchDossier(ADDPROPERTYINFO, addObject).then(() => {
              this.$message('档案添加成功');
              this.resetform(this.propertyFrom);
              this.dialogformvisible = false
              this.$emit('call:change-update')
            })
          }
        })
      },
      // 新增社会关系
      socialconnectionFromsubmit(socialconnectionFrom) {
        let addObject = {
          idcard: this.caseKey,
          ryname: this.ryname,
          gxrxm: this.socialconnectionFrom.gxrxm,
          gxrzjhm: this.socialconnectionFrom.gxrzjhm,
          gxms: this.socialconnectionFrom.gxms,
          bq: this.socialconnectionFrom.bq,
          xb: this.socialconnectionFrom.xb,
          jg: this.socialconnectionFrom.jg
        }
        this.$refs.socialconnectionFrom.validate((valid) => {
          this.dispatchDossier(ADDSOCIALRELATIONSHIPSINFO, addObject).then(() => {
            this.$message('档案添加成功');
            this.resetform(this.socialconnectionFrom);
            this.dialogformvisible = false
            this.$emit('call:change-update')
          })
        })
      },
      // 案事件关联
      caseeventFromsubmit(caseeventFrom) {
        let addObject = {
          idcard: this.caseKey,
          ryname: this.ryname,
          bt: this.caseeventFrom.bt,
          ms: this.caseeventFrom.ms,
          bq: this.caseeventFrom.bq
        }
        this.$refs.caseeventFrom.validate((valid) => {
          if (valid === true) {
            this.dispatchDossier(ADDASSOCIATEDCUESINFO, addObject).then(() => {
              this.$message('档案添加成功');
              this.resetform(this.caseeventFrom);
              this.dialogformvisible = false
              this.$emit('call:change-update')
            })
          }
        })
      },
      // 新增社保信息
      securityFromsubmit(securityFrom) {
        let addObject = {
          idcard: this.caseKey,
          type: this.securityFrom.activeName,
          ryname: this.ryname,
          // 任职
          dwmc: this.securityFrom.dwmc,
          dwdm: this.securityFrom.dwdm,
          cjsj: this.inittime,
          // 社保
          xb: this.securityFrom.xb,
          dwdz: this.securityFrom.dwdz,
          sbkh: this.securityFrom.sbkh,
          lxdh: this.securityFrom.lxdh,
          whcd: this.securityFrom.whcd,
          jyzt: this.securityFrom.jyzt,
          gz: this.securityFrom.gz,
          zw: this.securityFrom.zw,
          bldw: this.securityFrom.bldw,
          blyh: this.securityFrom.blyh,
          dkjg: this.securityFrom.dkjg,
          // 其他
          bt: this.securityFrom.bt,
          ms: this.securityFrom.ms,
          bq: this.securityFrom.bq
        }
        this.$refs.securityFrom.validate((valid) => {
          if (valid) {
            this.dispatchDossier(ADDSOCIALSECURITYINFO, addObject).then(() => {
              this.$message('档案添加成功');
              this.resetform(this.securityFrom);
              this.dialogformvisible = false
              this.$emit('call:change-update')
            })
          }
        })
      },
      // 新增图片视频
      picvideoFromsubmit() {
        this.picvideoFrom.data.map((item, idx) => {
          item.name = this.picvideoFrom.filename.split(',')[idx]
        })
        let addObject = {
          idcard: this.caseKey,
          type: this.picvideoFrom.type,
          ryname: this.ryname,
          fileInfo: this.picvideoFrom.data
        }
        this.$refs.picvideoFrom.validate((valid) => {
          if (valid) {
            this.dispatchDossier(ADDPICANDVIDEOINFO, addObject).then(() => {
              this.$message('档案添加成功');
              this.resetform(this.picvideoFrom);
              this.dialogformvisible = false
              this.$emit('call:change-update')
            })
          }
        })
      },
      resetform(forms) {
        for (let key in forms) {
          if (forms[key] instanceof Array) {
            forms[key] = []
          } else {
            forms[key] = ''
          }
        }
      },
      // 列表展开与收起
      isShow() {
        this.flag ? this.flag = false : this.flag = true
        this.$emit('on-update-expand', this.flag)
      }
    },
    created() {
      bus.$on('getPeopleXm', data => {
        this.ryname = data
      })
    },
    computed: {
      ...mapState(['dossier'])
    }
  }

</script>
