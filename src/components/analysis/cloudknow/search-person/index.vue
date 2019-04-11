<template>
<el-layout class="app-layout" :fit="true" style="overflow: hidden;min-height:600px">
  <!-- 通顶 -->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar>
      <div slot="search">
        <span class="sub-title">云知道</span>
        <div class="search-input" @keyup.13="search()">
          <el-input v-model="inputValue" style="width:446px">
            <el-button slot="append" icon="search" @click="search()" class="search-btn" style="width:72px;padding-right:15px;"></el-button>
          </el-input>
        </div>
      </div>
    </top-bar>
  </el-region>
  <!-- 内容 -->
  <el-region class="app-center" slot="center" type="center" style="overflow: hidden">
    <div style="height:calc(100vh - 100px)">
      <!-- 查询信息栏 -->
      <el-row class="search-function">
        <el-col :span="12">
          <div class="result-summary">
            关键字：
            <!-- <span>{{secondKeys === ""?keyword:secondKeys}}</span> -->
            <span>
              <span class="keyword">夏文律<i class="iconfont icon-close" title="移除"></i></span>
            </span>
            命中：
            <span>{{total}}</span>
            用时：
            <span>{{queryTime?queryTime+'秒':''}}</span>
          </div>
        </el-col>
      </el-row>
      <!-- 查询内容区 -->
      <div class="result-list" ref="list">
        <xdh-scroll :on-reach-bottom="handleReachBottom" :distance-to-edge="-150" :height="listHeight" :total="total" :personList="resultList">
          <el-row>
            <el-col class="result-list-content" :span="12" v-for="(elem,i) in resultList" :key="i">
              <person-item :itemData="elem"></person-item>
            </el-col>
          </el-row>
        </xdh-scroll>
        <!-- 结果为空 -->
        <div class="empty empty--tips" v-if="total===0">
          <span>暂无符合“{{keyword}}”的数据，请更换关键字搜索。</span>
        </div>
        <!-- 加载动画 -->
        <div :class="{'el-loading-mask':true,'action':loading}" v-show="loading">
          <div class="el-loading-spinner loader--circular">
            <svg viewBox="25 25 50 50" class="circular">
                <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
              </svg>
          </div>
        </div>
      </div>
    </div>
  </el-region>
</el-layout>
</template>

<style lang="scss" scoped>
.search-input {
    display: inline-block;
    vertical-align: top;
    padding-top: 10px;
    padding-left: 20px;
}

.search-type {
    margin: 0 15px;
}

.search-function {
    background: #fff;
    border-bottom: 1px solid #ccc;
}

.result-summary {
    padding-left: 15px;
    height: 40px;
    line-height: 40px;
    .keyword {
        margin-right: 0;
        .iconfont {
            visibility: hidden;
            color: #8391a5;
        }
        &:hover {
            .iconfont {
                visibility: visible;
            }
        }
    }
}

.result-summary span {
    color: orangered;
    margin-right: 20px;
}

.search-tools {
    text-align: right;
    padding-right: 15px;
    padding-top: 4px;
}

.search-tools .el-input {
    margin-right: 10px;
}

.search-tools .iconfont {
    font-size: 14px;
}

.result-list {
    padding: 0;
    height: calc(100vh - 100px);
    overflow: hidden;
    .result-list-content {
        &:nth-child(even) {
            &:after {
                content: '';
                height: 0;
                line-height: 0;
                display: block;
                visibility: hidden;
                clear: both;
            }
        }
    }
}
</style>
<style lang="scss" scoped>
.el-form--inline .el-form-item__label {
    padding-right: 4px;
}

.result-wd .el-form-item__label {
    font-size: 12px;
}

.result-wd .el-form-item__content {
    font-size: 12px;
}
.el-form-item__content {
    line-height: 30px;
}

.el-form-item__content span {
    line-height: 30px;
    color: #333;
}
.el-input__inner {
    height: 36px;
}
.el-tabs__item {
    width: 120px;
    text-align: center;
}
.el-tab-pane {
    width: 120px;
}

.el-form-item__label {
    padding: 0;
    line-height: 30px;
}
// 隔行变色
.result-item.changeColor {
    background-color: #f4f9fd;
}
</style>

<script>
// import { mapState } from 'vuex'
import TopBar from '../../../common/topbar/index.vue'
import XdhScroll from '../../../../widgets/xdh-scroll'
import mixin from '../../../../utils/mixin'
import personItem from './person-item.vue'

export default {
  components: {
    TopBar,
    XdhScroll,
    personItem
  },
  mixins: [mixin],
  data() {
    return {
      listHeight: 500,
      inputValue: '', // 查询关键字
      keyword: '', // 关键字
      total: 0, // 结果条数
      resultList: [], // 结果列表
      queryTime: '', // 查询耗时
      searchList: {
        status: 200,
        qtime: 43,
        page: 1,
        rows: 10,
        totalrows: 1,
        'results': [
          {
            'guid': '1509012039000123000015090',
            'name': ['张二强', '二强张', '小强'],
            'gender': '男',
            'telnum': ['15715100000', '15365000000'],
            'ftelnum': ['025-86800000'],
            'qq': [{
              'value': '461196465',
              'group': ['654321', '123456']
            }, {
              'value': '461196466',
              'group': ['223456', '423456', '623456']
            }],
            'idcard': ['429004198605053534'],
            'msn': ['zeqmsn@qq.com'],
            'email': ['461196465@qq.com'],
            'mblog': ['http://zeqmblog.com'],
            'location': '/中国/江苏/南京',
            'address': ['禄口镇禄口街道纬七路32号'],
            'homeurl': ['http://blog.sina.com.cn/ab22223'],
            'faceimg': ['http://qzone.qq.com/my/s220202.jpg'],
            'birth': '80后',
            'nplace': '江苏省淮安市清浦区人',
            'wechat': ['wx_zhangerqiang2010'],
            'job': ['资深软件工程师', 'CEO', '私营'],
            'relationshipstats': {
              'kindred': 0,
              'schoolmate': 0
            }
          }, {
            'guid': '1509012039000123000015090',
            'name': ['张二强', '二强张', '小强'],
            'gender': '男',
            'telnum': ['15715100000', '15365000000'],
            'ftelnum': ['025-86800000'],
            'qq': [{
              'value': '461196465',
              'group': ['654321', '123456']
            }, {
              'value': '461196466',
              'group': ['223456', '423456', '623456']
            }],
            'idcard': ['429004198605053534'],
            'msn': ['zeqmsn@qq.com'],
            'email': ['461196465@qq.com'],
            'mblog': ['http://zeqmblog.com'],
            'location': '/中国/江苏/南京',
            'address': ['禄口镇禄口街道纬七路32号'],
            'homeurl': ['http://blog.sina.com.cn/ab22223'],
            'faceimg': ['http://qzone.qq.com/my/s220202.jpg'],
            'birth': '80后',
            'nplace': '江苏省淮安市清浦区人',
            'wechat': ['wx_zhangerqiang2010'],
            'job': ['资深软件工程师', 'CEO', '私营'],
            'relationshipstats': {
              'kindred': 0,
              'schoolmate': 0
            }
          }, {
            'guid': '1509012039000123000015090',
            'name': ['张二强', '二强张', '小强'],
            'gender': '男',
            'telnum': ['15715100000', '15365000000'],
            'ftelnum': ['025-86800000'],
            'qq': [{
              'value': '461196465',
              'group': ['654321', '123456']
            }, {
              'value': '461196466',
              'group': ['223456', '423456', '623456']
            }],
            'idcard': ['429004198605053534'],
            'msn': ['zeqmsn@qq.com'],
            'email': ['461196465@qq.com'],
            'mblog': ['http://zeqmblog.com'],
            'location': '/中国/江苏/南京',
            'address': ['禄口镇禄口街道纬七路32号'],
            'homeurl': ['http://blog.sina.com.cn/ab22223'],
            'faceimg': ['http://qzone.qq.com/my/s220202.jpg'],
            'birth': '80后',
            'nplace': '江苏省淮安市清浦区人',
            'wechat': ['wx_zhangerqiang2010'],
            'job': ['资深软件工程师', 'CEO', '私营'],
            'relationshipstats': {
              'kindred': 0,
              'schoolmate': 0
            }
          }, {
            'guid': '1509012039000123000015090',
            'name': ['张二强', '二强张', '小强'],
            'gender': '男',
            'telnum': ['15715100000', '15365000000'],
            'ftelnum': ['025-86800000'],
            'qq': [{
              'value': '461196465',
              'group': ['654321', '123456']
            }, {
              'value': '461196466',
              'group': ['223456', '423456', '623456']
            }],
            'idcard': ['429004198605053534'],
            'msn': ['zeqmsn@qq.com'],
            'email': ['461196465@qq.com'],
            'mblog': ['http://zeqmblog.com'],
            'location': '/中国/江苏/南京',
            'address': ['禄口镇禄口街道纬七路32号'],
            'homeurl': ['http://blog.sina.com.cn/ab22223'],
            'faceimg': ['http://qzone.qq.com/my/s220202.jpg'],
            'birth': '80后',
            'nplace': '江苏省淮安市清浦区人',
            'wechat': ['wx_zhangerqiang2010'],
            'job': ['资深软件工程师', 'CEO', '私营'],
            'relationshipstats': {
              'kindred': 0,
              'schoolmate': 0
            }
          }, {
            'guid': '1509012039000123000015090',
            'name': ['张二强', '二强张', '小强'],
            'gender': '男',
            'telnum': ['15715100000', '15365000000'],
            'ftelnum': ['025-86800000'],
            'qq': [{
              'value': '461196465',
              'group': ['654321', '123456']
            }, {
              'value': '461196466',
              'group': ['223456', '423456', '623456']
            }],
            'idcard': ['429004198605053534'],
            'msn': ['zeqmsn@qq.com'],
            'email': ['461196465@qq.com'],
            'mblog': ['http://zeqmblog.com'],
            'location': '/中国/江苏/南京',
            'address': ['禄口镇禄口街道纬七路32号'],
            'homeurl': ['http://blog.sina.com.cn/ab22223'],
            'faceimg': ['http://qzone.qq.com/my/s220202.jpg'],
            'birth': '80后',
            'nplace': '江苏省淮安市清浦区人',
            'wechat': ['wx_zhangerqiang2010'],
            'job': ['资深软件工程师', 'CEO', '私营'],
            'relationshipstats': {
              'kindred': 0,
              'schoolmate': 0
            }
          }, {
            'guid': '1509012039000123000015090',
            'name': ['张二强', '二强张', '小强'],
            'gender': '男',
            'telnum': ['15715100000', '15365000000'],
            'ftelnum': ['025-86800000'],
            'qq': [{
              'value': '461196465',
              'group': ['654321', '123456']
            }, {
              'value': '461196466',
              'group': ['223456', '423456', '623456']
            }],
            'idcard': ['429004198605053534'],
            'msn': ['zeqmsn@qq.com'],
            'email': ['461196465@qq.com'],
            'mblog': ['http://zeqmblog.com'],
            'location': '/中国/江苏/南京',
            'address': ['禄口镇禄口街道纬七路32号'],
            'homeurl': ['http://blog.sina.com.cn/ab22223'],
            'faceimg': ['http://qzone.qq.com/my/s220202.jpg'],
            'birth': '80后',
            'nplace': '江苏省淮安市清浦区人',
            'wechat': ['wx_zhangerqiang2010'],
            'job': ['资深软件工程师', 'CEO', '私营'],
            'relationshipstats': {
              'kindred': 0,
              'schoolmate': 0
            }
          }, {
            'guid': '1708272346007116000012926',
            'name': ['向美良', '向美良信用卡免费', '向美良(财神)', '向美良总监', '向美良pos机', '向美良13923708714', '吴沙', '客户美良13923708714', '信友会向美良', '向美良财富岛投资pos机中百饰', '向美良2客户', '向美良1发信息', '目标向美良', '合伙人向美良', '同向美良', '吴洁敏', '向美良公众演说班', '向美良老号', '向美良新方向', '向美良子公司',
              '向美良pos机贷款', 'sz向美良', 'A公司向美良旺财', 'vp向美良信用卡免费', '向美良信用卡', 'IFC117向美良', '美良', '飞凡向美良', 'XY向美良', '0322向美良信用卡免费主动', '向美良财富岛', '向美良信用卡免费(云)', '向美良(培训口才)', '向美良宝付支付名片通', '向美良信用卡免费(登登公司)', '向美良非凡口才', '小向', '向美良(新方向)', '顺旺发向美良', '向美良131',
              '向美良l', '王锐锐', '叶雪', '向美良同行', '深圳向美良pos'],
            'gender': '男',
            'telnum': ['13148713193', '13148714193', '18682209468', '13923708714'],
            'ftelnum': ['310314347', '075582512825', '1891330', '4008116980'],
            'qq': [
              { 'value': '1218068921', 'group': [] },
              { 'value': '310314347', 'group': [] }
            ],
            'msn': [],
            'email': ['310314347@qq.com'],
            'mblog': [],
            'location': '/中国/广东/深圳',
            'address': [
              '生命中的贵人\\您好!为您分享一个好消息,一场由8一10多位银行行长,6一8位演说家,40多家投资公司,300一400位企业家联合主办的投融资摩根盛通游艇会,在11月8一10号深圳大梅沙隆重举行!其中三天一起在五星级酒店共进午餐,一同学习成长,像这样绝佳学习成长链接高端人脉的好机会,您会错过吗?如果这三天您没有任何收获,您只不过浪费了三天和500元钱,万一学到好方法,找到好项目,融到资本,链接对自己的人生事业有帮助朋友,有没有可能让自己受益一辈子,有没有可能加速到达成自己的梦想和目标,让自己有更多的时间孝敬父母,培养孩子,提升亲人幸福指数如果您因为忙,挤不出这三天时间,那您要忙到什么时候?中国是一个人情社会,当您遇到难办事情,一定是没有找对方法,找对人您会为了自己的梦想和目标,为了您家人把握这次机会吗?您是我生命中的贵人,也非常希望能和您深度链接,为您服务,传递正能量,您会帮我转介绍或转发吗?感恩!感恩!感恩!用我这开过光加磁过的嘴,祝福您\\所有美好的事情都发生在您和您的家人身上!服务链接18682209468向美良感恩!11月8一10日,地址\\深圳市盐',
              '亲早上好!我们好久没有联系了!一年即将过完,对今年成绩满意吗?是不是感觉钱特别紧张呢?这个周末您是怎样安排的?无论您有信用卡或即将会去办信用卡还是您身边的亲朋好友有信用卡,我都建议您认真读完下面这条信息,这也许是改变许多人命运的一条神奇短信您不容错过!引爆信用核威力-正确使用信用卡研讨会您知道您在银行信用的价值吗?您相信利用您的信用可以撬动财富自由吗?您想知道如何使用信用变成银行A类客户吗?建立良好信用,杠杆信用资本细数银行秘密,撬动银行资产,让银行的钱来为我们服务,揭秘顶级富豪不传秘籍,以及躺在被窝里面蹲在马桶上面信手抓钱的秘诀耳提面命如何让自己少花钱拥有10到几百万的信用卡,亲在我们不缺钱的时候和银行建立信贷关系,缺钱的时候银行才会把钱借给我,为了我们将来的幸福生活建立防火墙实操落地分享,为您搭建实现财富自由的平台时间\\1月31(星期六)2月1日(星期天)中午1\\30一5\\00地点:深圳市罗湖区发送名字十电话十人数到13923708714向美良亲自为您预订席位!转发详细地址给您,这也是提升生活品质,改变命运的一堂神奇的课,您会',
              '生命中的贵人\\您好!为您分享一个好消息,一场由8一10多位银行行长,6一8位演说家,40多家投资公司,300一400位企业家联合主办的投融资摩根盛通游艇会,在深圳6,7,8号,三天一起在五星级酒店共进午餐,一同学习成长,像这样绝佳学习成长链接高端人脉的好机会,您会错过吗?如果这三天您没有任何收获,您只不过浪费了三天和500元钱,万一学到好方法,找到好项目,融到资本,链接对自己的人生事业有帮助朋友,有没有可能让自己受益一辈子,有没有可能加速到达成自己的梦想和目标,让自己有更多的时间孝敬父母,培养孩子,提升亲人幸福指数如果您因为忙,挤不出这三天时间,那您要忙到什么时候?中国是一个人情社会,当您遇到难办事情,一定是没有找对方法,找对人您会为了自己的梦想和目标,为了您家人把握这次机会吗?您是我生命中的贵人,也非常希望能和您深度链接,为您服务,传递正能量,您会帮我转介绍或转发吗?感恩!感恩!感恩!用我这开过光加磁过的嘴,祝福您\\所有美好的事情都发生在您和您的家人身上!服务链接18682209468向美良感恩!参加投融资高端银企对接峰会条件,带总经理或法',
              '亲早上好!我们好久没有联系了!一年即将过完,对今年成绩满意吗?是不是感觉钱特别紧张呢?这个周末您是怎样安排的?无论您有信用卡或即将会去办信用卡还是您身边的亲朋好友有信用卡,我都建议您认真读完下面这条信息,这也许是改变许多人命运的一条神奇短信您不容错过!引爆信用核威力-正确使用信用卡研讨会\\您知道您在银行信用的价值吗-您相信利用您的信用可以撬动财富自由吗-您想知道如何使用信用变成银行A类客户吗?建立良好信用,杠杆信用资本细数银行秘密,撬动银行资产,让银行的钱来为我们服务,揭秘顶级富豪不传秘籍,以及躺在被窝里面蹲在马桶上面信手抓钱的秘诀耳提面命如何让自己少花钱拥有10到几百万的信用卡,亲在我们不缺钱的时候和银行建立信贷关系,缺钱的时候银行才会把钱借给我,为了我们将来的幸福生活建立防火墙\\实操落地分享,为您搭建实现财富自由的平台\\时间\\1月31(星期六)2月1日(星期天)中午1\\30一5\\00\\地点:深圳市罗湖区发送名字十电话十人数到13923708714向美良亲自为您预订席位-转发详细地址给您,这也是提升生活品质,改变命运的一堂',
              '深圳市罗湖区深南东路4003号世界金融中心亲爱的家人\\您好-我不知道您对人寿保险是如何看法,投资人寿保险,很多人都觉得没必要,其实我在了解人寿保险之前,我也这样认为,随着对保险了解越深,我的看法也发生了变化下面谈一下我对人寿保险的看法,也希望您能帮我分析一下,我的看法是否正确-常说\\好人一生平安或好人有好报,但人生谁也无法避免的五重变故\\生老病死-人人都会老,但到老无病而终的人,一定很少,这点您应该也认同吧?当人到年老,有病,却无保障,可以想象,应该有多惨-我们都是赚钱能手,只要我们健在,一定能创造出源源不断的收入,家人在我们的呵护下,幸福快乐,这也是我们最大的心愿,但心愿不管有多美好,有多美好但要达成心愿都需要时间精力钱还有资源人生不论我们能力有多强,但有两件事我们却无法掌控\\一意外,二疾病当人生遭遇这样的不幸时,我们的心愿还能实现吗?当人生走得太匆忙,哪怕只剩下最后一口气,自己至亲至爱的人,哪怕变卖家产就是借高利贷,也会尽力挽留,留下来这些最亲最爱的人,却失去了持续不断的收入,得到了一身的债务,这是作为',
              '节日喜讯您的店里成交收钱,还要掏高额的手续费吗?您有信用卡吗?您取信用卡的钱还在银行排队吗?还在找套现公司吗?银行.套现公司随时都在身边吗?如果没有在身边怎么办?您想您在收款,套现,蓄储卡,信用卡,随时随地刷吗?而且不要手续费吗?只需要中信银行三维度卡就可以开通零手续费pos机,您想要吗?如您想要就请立既拨打\\18682209468三维度免手费pos机,全国总代理,向先生立既拨打免费送网络pos机送海南,或云南旅游票一套[强]超级好消息!中秋我来送礼啦-招行信用卡提额一小时到帐!1万额度以上-用卡3个月以上-可提5一40倍固额!提供身份证-信用卡-查询密码和招行借记卡(用于存款-诚招代理商!名额有限-3天内有效!顺祝中秋快乐-玫瑰-太阳]非常荣幸能认识您!我叫向美良我是办理大额信用卡和网络pOS机的我现在就有关如何办理的方法与窍门要向您分享也许能帮助到您优惠办理的常见问题解答!问:可以办理多少额度的信用卡?答:10万到100万问:我没有任何信用卡是否可以办理?答:不管你是否有信用卡,都可以办理主要',
              '强]超级好消息!国庆我来送礼啦-招行信用卡提额一小时到帐!1万额度以上-用卡3个月以上-可提5一40倍固额!提供身份证-信用卡-查询密码和招行借记卡(用于存款-诚招代理商!名额有限-3天内有效-顺祝中秋快乐-最有缘份的兄弟姐妹我生命的贵人因为有您更精彩轻松愉快的国庆在高潮幸福中结束您的好友我送来迟来的祝福愿所有美好的事情都发生在您和您家人的身上0手续费三维度pos机农行三维度卡又可以办了,明天后天拿机的朋友免费送超低点位的网络pos机明天凡拿两台以上三维度机的朋友另送云南海南港澳或泰国双人旅游一套届时将会汇聚200多位企业执行董事和总裁及银行家与风投机构等嘉宾,帮助企业对接资金和项目,拓展高端人脉整合产业链,彻底解决中小企业的资金人才产品三大问题,教您快速融资,股权激励,总裁智慧,上市公司商业模式与管控等-如果您这边企业对企业融资,企业上市,资本运营感兴趣,不妨抽出时间来学习交流-如果您缺少高端商圈人脉渠道,不妨抽出时间来拓展下上下游产业链的对接',
              '羊年首届家庭财富论坛扬帆起航首届新财富家庭论坛的大幕即将拉起,您,能抓住这次机会吗?华南大区深圳站3月20-22白金课开课啦!现场拆解:1.通过合理配置,打造永续不断的被动性现金流2.解析固定资产的金融属性及信用体系的打造及维护3.重点剖析金融奇观\\资产增值五大铁律4.真人版财富沙盘演练,原汁原味财商观念5.分析未来固定资产及流动资产配置的资产面对面6.多种融资管道方法分享特别提示:本次新财富论坛将有多位重量级教练和数位亿万富翁现场分享致富之路,赚钱之道!为您搭建高端人脉交流经验学习借鉴的平台,3天2夜的全程共同交流交友!活动现场火热报名场地有限,先报先得!鉴于还有特邀嘉宾单位赞助,仅收场地费980元位,食宿自理活动时间2015年3月20日3月22日活动地址深圳市盐田区大梅沙倚云路8号,中兴和泰酒店五楼多功能厅签到时间:8\\309\\00参会对象:ITFIBS学员企业老板企业高管股东董事,限300个席位财富热线13923708714向美良(名额有限,预定席位',
              '您好!非常荣幸能=识您非常期待与=深度链接成为好朋-成为一辈子的=利益共同体!一路=行!我相信人生有-从此人生更精彩-感恩老天!幸亏=您,往后成功道路=寂寞!亲爱的此=此刻开始我们一=起分享商机,智慧=成长道路上的喜悦=吗?亲爱的别=落我!常联系,请=记得我新换的手机=号码13148714193(一生一=发去一世依旧有=山)13923708714向美良,我=的工作普及金融知-提升全民财商-解决钱从那里来-钱到那里去,共同=贵)专业办理10一1000=银行利息贷各种=号的pos机揭秘办办=大额信用卡的秘决=代做流水代发工=代交社保亲爱=的您会为我详细=介绍自己吗?我好=想多一点了解您啊-1.买房买车有月供1年=上的,不管省内外=都可按月供(45~60)倍=贷款2.房款已=清可3厘贷款=3.批发零售个体户=业执照一年以上并=3个月流水平均10万=以上,贷款25~50万=4.在深圳有一=以上社保',
              '非常荣幸能认识您!我叫向美良我是办理大额信用卡和网络pOS机的我现在就有关如何办理的方法与窍门要向节日喜讯非常荣幸能认识您!我叫向美良我是办理大额信用卡和网络pOS机的我现在就有关如何办理的方法与窍门要向特大喜讯', '罗湖深南东路4003号世界金融中心B座818室(人民桥站)深圳中国'
            ],
            'homeurl': ['http://www.shuakabao.cn'],
            'faceimg': [],
            'relationshipstats': { 'kindred': 0, 'schoolmate': 0 },
            'birth': '70后',
            'nplace': '湖北省咸宁地区通城县人',
            'wechat': ['cs13148714193', 'wxid_nhhbdef4kbr521'],
            'idcard': ['422324197306104419'],
            'job': [],
            'vtime': ['1302281445', '1708112333'],
            'last_upd_time': '1708112333'
          }
        ]
      }
    }
  },
  props: {},
  methods: {
    handleReachBottom() {
      console.log(this.listHeight, 'listHeight')
    },
    handleResize() {
      if(this.$refs.list) {
        let rect = this.$refs.list.getBoundingClientRect()
        this.listHeight = rect.height
      }
    },
    search() {
      this.loading = true
      setTimeout(() => {
        this.resultList = this.searchList.results
        this.total = this.searchList.totalrows
        this.queryTime = this.searchList.qtime
        this.loading = false
      }, 1500)
    }
  },
  watch: {},
  mounted() {
    this.handleResize()
    window.addEventListener('resize', () => {
      this.handleResize()
    })
  },
  created() {
    window.addEventListener('resize', this.handleResize.bind(this))
  }
}
</script>
