<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">涉众型经济犯罪群体登记</h3>
  </div>

  <div>
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item label="常住地址" prop="jcjzdz">
          <el-input :maxlength="50" v-model="value.jcjzdz"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="案件类别" prop="ajlb">
          <el-select placeholder="请选择" v-model="value.ajlb" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['SZAJLB']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="所涉案件" prop="ssaj">
          <el-input :maxlength="50" v-model="value.ssaj"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="案情简要" prop="sajyqk">
          <el-input type="textarea" :maxlength="500" v-model="value.sajyqk"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <!-- <el-col :span="8">
          <el-form-item label="办案单位" prop="badw">
            <el-input :maxlength="50" v-model="value.badw"></el-input>
          </el-form-item>
        </el-col>
        <el-form-item label="主办民警" prop="zbmj">
          <el-input :maxlength="50" v-model="value.zbmj"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="民警电话" prop="zbmjdh">
          <el-input :maxlength="50" v-model="value.zbmjdh"></el-input>
        </el-form-item>
      </el-col> -->
        <el-form-item label="办案单位" prop="badw">
          <el-cascader :maxlength="50" :show-all-cldjs="false" :filterable="true" v-model="value.badw" :options="CollectDeptList" :clearable="true" :show-all-levels="false" @change="changUserList(value.badw)" :props="{children:'children',value:'orgId',label:'name'}"
            :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="主办民警" prop="zbmj">
          <el-select v-model="value.zbmj" filterable @change="changUser()" style="width: 100%">
            <el-option style="height: auto" v-for="item in userList" :key="item.userId" :label="item.xm" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="民警电话" prop="lxfs" label-width="106px">
          <el-input :maxlength="50" v-model="value.lxfs"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <h3 class="addh3">涉稳风险表现形式</h3>


      <el-col :span="24">
        <el-form-item label-width="250px" label="经济风险向政治安全领域传导" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="xzzcd">
              <el-radio-group v-model="value.xzzcd">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="xzzcdsm">
              <el-input :maxlength="50" v-model="value.xzzcdsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="曾被列入涉稳人员名单仍需稳控" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="clrwk">
              <el-radio-group v-model="value.clrwk">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="clrwksm">
              <el-input :maxlength="50" v-model="value.clrwksm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="赴省进京聚访" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="sjjf">
              <el-radio-group v-model="value.sjjf">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="sjjfsm">
              <el-input :maxlength="50" v-model="value.sjjfsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="涉稳舆情" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="swyq">
              <el-radio-group v-model="value.swyq">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="swyqsm">
              <el-input :maxlength="50" v-model="value.swyqsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="个人极端事件" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="jdsj">
              <el-radio-group v-model="value.jdsj">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="jdsjsm">
              <el-input :maxlength="50" v-model="value.jdsjsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="涉稳群体骨干分子或挑头人员" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="ggtt">
              <el-radio-group v-model="value.ggtt">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="ggttsm">
              <el-input :maxlength="50" v-model="value.ggttsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="其他形式" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="qtxs">
              <el-radio-group v-model="value.qtxs">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="qtxssm">
              <el-input :maxlength="50" v-model="value.qtxssm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>


    </el-row>
    <el-row :gutter="5">
      <h3 class="addh3">原因分类</h3>

      <el-col :span="24">
        <el-form-item label-width="250px" label="认为应当立案而未立案" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="wla">
              <el-radio-group v-model="value.wla">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="wlasm">
              <el-input :maxlength="50" v-model="value.wlasm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="认为有犯罪嫌疑人应当打击处理而未打击处理" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="djcl">
              <el-radio-group v-model="value.djcl">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="djclsm">
              <el-input :maxlength="50" v-model="value.djclsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="对案件定性不满意" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="dxbmy">
              <el-radio-group v-model="value.dxbmy">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="ajlb">
              <el-input :maxlength="50" v-model="value.dxbmysm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="认为案件侦查推进不快、工作不力" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="zcbk">
              <el-radio-group v-model="value.zcbk">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="zcbksm">
              <el-input :maxlength="50" v-model="value.zcbksm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="要求受偿损失或对追赃挽损不满意" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="zzbm">
              <el-radio-group v-model="value.zzbm">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="zzbmsm">
              <el-input :maxlength="50" v-model="value.zzbmsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="沟通说服不够造成误解" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="gtbf">
              <el-radio-group v-model="value.gtbf">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="gtbfsm">
              <el-input :maxlength="50" v-model="value.gtbfsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="不满被司法机关打击处理" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="bmdj">
              <el-radio-group v-model="value.bmdj">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="bmdjsm">
              <el-input :maxlength="50" v-model="value.bmdjsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="无正当理由" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="wzdly">
              <el-radio-group v-model="value.wzdly">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="wzdlysm">
              <el-input :maxlength="50" v-model="value.wzdlysm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="其他原因" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="qtyy">
              <el-radio-group v-model="value.qtyy">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="qtyysm">
              <el-input :maxlength="50" v-model="value.qtyysm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>


    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <h3 class="addh3">稳控处置</h3>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <h3 class="addh3">稳控落实情况</h3>
      <el-col :span="24">
        <el-form-item label-width="250px" label="报告党委政府" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="bgdwzf">
              <el-radio-group v-model="value.bgdwzf">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="bgdwzfsm">
              <el-input :maxlength="50" v-model="value.bgdwzfsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="通报维稳办等党政责任部门" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="tbwwbm">
              <el-radio-group v-model="value.tbwwbm">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="tbwwbmsm">
              <el-input :maxlength="50" v-model="value.tbwwbmsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="采取稳控措施" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="cqwkcs">
              <el-radio-group v-model="value.cqwkcs">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="cqwkcssm">
              <el-input :maxlength="50" v-model="value.cqwkcssm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>


    </el-row>
    <el-row :gutter="5">
      <h3 class="addh3">在控状态</h3>

      <el-col :span="24">
        <el-form-item label-width="250px" label="稳控在本地" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="wkbd">
              <el-radio-group v-model="value.wkbd">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="wkbdsm">
              <el-input :maxlength="50" v-model="value.wkbdsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="省内双列管" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="snslg">
              <el-radio-group v-model="value.snslg">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="snslgsm">
              <el-input :maxlength="50" v-model="value.snslgsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="省际双稳控" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="szswk">
              <el-radio-group v-model="value.szswk">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="szswksm">
              <el-input :maxlength="50" v-model="value.szswksm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="失控" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="sk">
              <el-radio-group v-model="value.sk">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="sksm">
              <el-input :maxlength="50" v-model="value.sksm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>


    </el-row>
    <el-row :gutter="5">
      <h3 class="addh3">稳控方式</h3>

      <el-col :span="24">
        <el-form-item label-width="250px" label="党委政府牵头稳控">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="dzfwk">
              <el-radio-group v-model="value.dzfwk">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="dzfwksm">
              <el-input :maxlength="50" v-model="value.dzfwksm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="基层群众组织参与稳控" prop="">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="jcqzwk">
              <el-radio-group v-model="value.jcqzwk">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="jcqzwksm">
              <el-input :maxlength="50" v-model="value.jcqzwksm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="所在单位参与稳控">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="szdwwk">
              <el-radio-group v-model="value.szdwwk">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="szdwwksm">
              <el-input :maxlength="50" v-model="value.szdwwksm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="铁路、公路、民航等部门协助稳控">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="jtxzwk">
              <el-radio-group v-model="value.jtxzwk">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="jtxzwksm">
              <el-input :maxlength="50" v-model="value.jtxzwksm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="通过亲友等社会关系协助稳控">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="qygxwk">
              <el-radio-group v-model="value.qygxwk">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="qygxwksm">
              <el-input :maxlength="50" v-model="value.qygxwksm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="上门教育疏导稳控">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="smjd">
              <el-radio-group v-model="value.smjd">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="smjdsm">
              <el-input :maxlength="50" v-model="value.smjdsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="电话联系掌握情况稳控">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="dhwk">
              <el-radio-group v-model="value.dhwk">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="dhwksm">
              <el-input :maxlength="50" v-model="value.dhwksm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="依法打击涉稳群体骨干和挑头闹事者">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="djnsz">
              <el-radio-group v-model="value.djnsz">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="djnszsm">
              <el-input :maxlength="50" v-model="value.djnszsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="其他方式">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="qtfs">
              <el-radio-group v-model="value.qtfs">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="qtfssm">
              <el-input :maxlength="50" v-model="value.qtfssm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>

    </el-row>
    <el-row :gutter="5">
      <h3 class="addh3">失控原因</h3>

      <el-col :span="24">
        <el-form-item label-width="250px" label="去向不明且电话等方式联系不上">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="lxbs">
              <el-radio-group v-model="value.lxbs">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="lxbssm">
              <el-input :maxlength="50" v-model="value.lxbssm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="明确表态不服从稳控">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="bfwk">
              <el-radio-group v-model="value.bfwk">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="bfwksm">
              <el-input :maxlength="50" v-model="value.bfwksm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="无正当理由赴省进京">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="wlyjj">
              <el-radio-group v-model="value.wlyjj">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="wlyjjsm">
              <el-input :maxlength="50" v-model="value.wlyjjsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="隐瞒本人真实活动">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="ymhd">
              <el-radio-group v-model="value.ymhd">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="ymhdsm">
              <el-input :maxlength="50" v-model="value.ymhdsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="250px" label="其他原因">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="skqtyy">
              <el-radio-group v-model="value.skqtyy">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="skqtyysm">
              <el-input :maxlength="50" v-model="value.skqtyysm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>

    </el-row>
    <el-row :gutter="5">
      <h3 class="addh3">情报支撑情况</h3>


      <el-col :span="24">
        <el-form-item label-width="250px" label="情报部门是否定期提供研判支撑">
          <el-col :span="8">
            <el-form-item label="排查结果" prop="tgyp">
              <el-radio-group v-model="value.tgyp">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="补充说明" prop="tgypsm">
              <el-input :maxlength="50" v-model="value.tgypsm"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>

    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <h3 class="addh3">稳控落实情况</h3>

      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item label="公安机关责任领导" prop="zrld" label-width="206px">
          <el-select v-model="value.zrld" @clear="clearUserInfo" filterable remote clearable :remote-method="nameRemoteScreen" :loading="selectQueryLoading" style="width: 100%" placeholder="输入姓名关键字搜索">
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
      <el-col :span="12">
        <el-form-item label="责任民警" prop="zrmj" label-width="206px">
          <el-select v-model="value.zrmj" @clear="clearUserInfo" filterable remote clearable :remote-method="nameRemoteScreen" :loading="selectQueryLoading" style="width: 100%" placeholder="输入姓名关键字搜索">
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
import { clone } from '../../../../../utils/util'
import { listToTree } from '../../../../../utils/listToTree'
import { GET_SYS_ORG_TREE, FETCH_SYS_USERS_BY_ORGID, FETCH_USER_LIST_BY_KEYWORD } from '../../../../../store/types'
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
      userList: [],
      IsSelectOrg: '',
      IsSelectOrg2: '',
      CollectDeptList: [],
      userList2: []
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
     * [initUserList 初始化用户下拉框]
     * @return {[type]} [description]
     */
    initUserList() {
      if(this.value.badw && this.value.badw.length !== 0 && this.value.badw[0] !== '' && this.value.badw !== '') {
        this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.badw[this.value.badw.length - 1] }).then(d => {
          this.userList = clone(this.users.sysUserFromOrgid)
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
    changUser() {
      if(this.value.badw && this.value.badw.length !== 0 && this.value.badw) {
        this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: this.value.badw[this.value.badw.length - 1] }).then(d => {
          this.userList = clone(this.users.sysUserFromOrgid)
          if(this.userList && this.userList.length !== 0 && this.value.zbmj) {
            this.value.lxfs = this.userList.find(d => d.userId === this.value.zbmj).mobile || ''
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
          this.value.zbmj = ''
        })
      } else {
        this.dispatch(FETCH_SYS_USERS_BY_ORGID, { orgId: '431200000000' }).then(d => {
          this.userList = clone(this.users.sysUserFromOrgid)
          this.value.zbmj = ''
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
      // this.editForm = clone(this.dataForm)
      if(this.dictLists.length <= 0) {
        this.queryDictType()
      }
      this.GetSysOrgDictTree('430000000000')
    },
    queryDictType() {
      //  表单字典初始化
      this.getDict(['SZAJLB']).then(res => {
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
