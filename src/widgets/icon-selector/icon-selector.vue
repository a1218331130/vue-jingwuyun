<template>
<el-select v-model="icon" placeholder="请选择" @change="update" filterable clearable allow-create>
  <el-option v-for="item in (mode!=='image'?iconOptions:imagesOptions)" :key="item" :value="item">
    <div class="icon-selector__item" v-if="mode!=='image'"><i :class="'iconfont '+item"></i> {{item}}</div>
    <img v-else :src="item" />
  </el-option>
</el-select>
</template>
<style lang="scss" scoped>
  .el-select-dropdown__item {
    text-align: center;
    height: auto;
    display: inline-block;
  }

  .icon-selector__item {
    text-align: left;
  }

</style>
<script>
  /**
   * @module IconSelector
   * @desc 图标选择组件
   * @example <icon-selector v-model="form.icon" mode="image"></icon-selector>
   */
  export default {
    data: function() {
      return {
        icon: '',
        // icon先写死, 之后再改
        iconOptions: [
          'iconfont icon-tupian',
          'iconfont icon-fangda',
          'iconfont icon-plus',
          'iconfont icon-circle',
          'iconfont icon-iconziti23',
          'iconfont icon-iconfontsousuo1',

          'iconfont icon-dangan',

          'iconfont icon-menu',

          'iconfont icon-ruzhu',

          'iconfont icon-image',

          'iconfont icon-biaoqian',

          'iconfont icon-msnui-report-data',

          'iconfont icon-msnui-report-complain',

          'iconfont icon-feiji2',

          'iconfont icon-ditu1',

          'iconfont icon-fenxi',

          'iconfont icon-gongzuotai',

          'iconfont icon-xietong',

          'iconfont icon-fenxizhenduan',

          'iconfont icon-icon',

          'iconfont icon-sort',

          'iconfont icon-dianhua1',

          'iconfont icon-tiwen',

          'iconfont icon-folder',

          'iconfont icon-upload',

          'iconfont icon-wangba',

          'iconfont icon-liebiao',

          'iconfont icon-hangkongyunshu',

          'iconfont icon-is_sort',

          'iconfont icon-z047',

          'iconfont icon-jia',

          'iconfont icon-qq',

          'iconfont icon-guanlian1',

          'iconfont icon-huzhao',

          'iconfont icon-dangan2',

          'iconfont icon-dianhuadingdan',

          'iconfont icon-fcstubiao25',

          'iconfont icon-setup',

          'iconfont icon-records',

          'iconfont icon-iconset0398',

          'iconfont icon-dingwei2',

          'iconfont icon-video',

          'iconfont icon-save',

          'iconfont icon-qidong',

          'iconfont icon-tijianbaogaochaxun',

          'iconfont icon-msnui-webpage',

          'iconfont icon-renqun',

          'iconfont icon-tonghua',

          'iconfont icon-rili',

          'iconfont icon-move',

          'iconfont icon-ipguishudi',

          'iconfont icon-bianji',

          'iconfont icon-combination',

          'iconfont icon-zhifeijikuai',

          'iconfont icon-password',

          'iconfont icon-huoche',

          'iconfont icon-ai-home',

          'iconfont icon-shijian',

          'iconfont icon-3',

          'iconfont icon-jiangpai',

          'iconfont icon-race-copy',

          'iconfont icon-share',

          'iconfont icon-police',

          'iconfont icon-bianji1',

          'iconfont icon-qidong-copy',

          'iconfont icon-taopaiche',

          'iconfont icon-ranking',

          'iconfont icon-file',

          'iconfont icon-zhiwen',

          'iconfont icon-link',

          'iconfont icon-paixu',

          'iconfont icon-user',

          'iconfont icon-yonghuquntiliebiao',

          'iconfont icon-hudong',

          'iconfont icon-touxiang',

          'iconfont icon-baobiao',

          'iconfont icon-close',

          'iconfont icon-ditu2',

          'iconfont icon-haofangtuo400iconfontwoshenqingdeshikan',

          'iconfont icon-class',

          'iconfont icon-xinjianbiji',

          'iconfont icon-calendar',

          'iconfont icon-wenjianjia',

          'iconfont icon-wechat-copy',

          'iconfont icon-shenqing',

          'iconfont icon-weibo',

          'iconfont icon-max--active',

          'iconfont icon-max',

          'iconfont icon-dunpai',

          'iconfont icon-gongzuojingyan',

          'iconfont icon-rili1',

          'iconfont icon-daochu',

          'iconfont icon-wenhao',

          'iconfont icon-dangan21',

          'iconfont icon-jingbao',

          'iconfont icon-msg',

          'iconfont icon-biaoqian1',

          'iconfont icon-jinxingzhong',

          'iconfont icon-note',

          'iconfont icon-kuaidi',

          'iconfont icon-card-list',

          'iconfont icon-folder-open',

          'iconfont icon-iconfontwenjian2copy',

          'iconfont icon-ripple',

          'iconfont icon-duofangtonghua',

          'iconfont icon-yiwancheng',

          'iconfont icon-zip',

          'iconfont icon-quanbu',

          'iconfont icon-hczz',

          'iconfont icon-yewurenyuanxinxiguanli',

          'iconfont icon-gaojingxinxi',

          'iconfont icon-web',

          'iconfont icon-city',

          'iconfont icon-xinzengdaikuan',

          'iconfont icon-download',

          'iconfont icon-xiaoqiche',

          'iconfont icon-mobanguanli',

          'iconfont icon-yuedu',

          'iconfont icon-fenxiang',

          'iconfont icon-handcuffs',

          'iconfont icon-jingqing',

          'iconfont icon-jiaochakoufenxi',

          'iconfont icon-lujingchaxun',

          'iconfont icon-tongjibiaodan',

          'iconfont icon-qiujiurenyuan',

          'iconfont icon-biaoshilei_paibanrenyuan',

          'iconfont icon-xiansuoku',

          'iconfont icon-jiangxu',

          'iconfont icon-sort-ascend',

          'iconfont icon-zhengjian',

          'iconfont icon-Issued',

          'iconfont icon-fenxi3',

          'iconfont icon-fenxi1',

          'iconfont icon-TXT',

          'iconfont icon-web-quit',

          'iconfont icon-dianhua',

          'iconfont icon-zhangdan',

          'iconfont icon-data-box',

          'iconfont icon-tuzu',

          'iconfont icon-into',

          'iconfont icon-dangan1',

          'iconfont icon-dashboard',

          'iconfont icon-sousuo',

          'iconfont icon-fenleijishougongtongbu',

          'iconfont icon-zijin',

          'iconfont icon-xiangqing',

          'iconfont icon-pinglu',

          'iconfont icon-biji',

          'iconfont icon-tubiao-bingtu',

          'iconfont icon-dingwei',

          'iconfont icon-jipiao',

          'iconfont icon-guanliyuan',

          'iconfont icon-avi',

          'iconfont icon-jpg',

          'iconfont icon-rar',

          'iconfont icon-min',

          'iconfont icon-paihang',

          'iconfont icon-meitidaoru',

          'iconfont icon-quanbu1',

          'iconfont icon-right-tag',

          'iconfont icon-shouji',

          'iconfont icon-guiji1',

          'iconfont icon-dayin',

          'iconfont icon-chicun',

          'iconfont icon-fenxi2',

          'iconfont icon-zhongdiancheliang',

          'iconfont icon-stop',

          'iconfont icon-ppt',

          'iconfont icon-guiji',

          'iconfont icon-jiangbei1',

          'iconfont icon-merge',

          'iconfont icon-guiji_xiao',

          'iconfont icon-ditu',

          'iconfont icon-fq_kucunchaxun',

          'iconfont icon-qianshou',

          'iconfont icon-shoucang',

          'iconfont icon-xitong_shoucang',

          'iconfont icon-accessory',

          'iconfont icon-addpeople_fill',

          'iconfont icon-addpeople',

          'iconfont icon-addressbook_fill',

          'iconfont icon-addressbook',

          'iconfont icon-browse_fill',

          'iconfont icon-browse',

          'iconfont icon-brush',

          'iconfont icon-brush_fill',

          'iconfont icon-collection_fill',

          'iconfont icon-collection',

          'iconfont icon-coordinates_fill',

          'iconfont icon-coordinates',

          'iconfont icon-enter',

          'iconfont icon-homepage_fill',

          'iconfont icon-homepage',

          'iconfont icon-like_fill',

          'iconfont icon-like',

          'iconfont icon-lock_fill',

          'iconfont icon-lock',

          'iconfont icon-mail',

          'iconfont icon-mail_fill',

          'iconfont icon-praise_fill',

          'iconfont icon-praise',

          'iconfont icon-refresh',

          'iconfont icon-remind_fill',

          'iconfont icon-remind',

          'iconfont icon-return',

          'iconfont icon-task',

          'iconfont icon-task_fill',

          'iconfont icon-tasklist_fill',

          'iconfont icon-tasklist',

          'iconfont icon-trash',

          'iconfont icon-trash_fill',

          'iconfont icon-undo',

          'iconfont icon-minganguanjianzi',

          'iconfont icon-pc',

          'iconfont icon-biaozhu',

          'iconfont icon-frequency',

          'iconfont icon-xiaoche',

          'iconfont icon-excel',

          'iconfont icon-word',

          'iconfont icon-feiji',

          'iconfont icon-home',

          'iconfont icon-public__easyi',

          'iconfont icon-tower',

          'iconfont icon-yanpan',

          'iconfont icon-chepaihao',

          'iconfont icon-packup-2',

          'iconfont icon-unfold1',

          'iconfont icon-unfold',

          'iconfont icon-shiliangzhinengduixiang',

          'iconfont icon-config-link-audit',

          'iconfont icon-chakan',

          'iconfont icon-export',

          'iconfont icon-import',

          'iconfont icon-guanlian',

          'iconfont icon-jiangbei',

          'iconfont icon-dingwei1',

          'iconfont icon-tonghuajilu',

          'iconfont icon-jian',

          'iconfont icon-jiudian',

          'iconfont icon-zhiding',

          'iconfont icon-data-slice',

          'iconfont icon-shiyongliang',

          'iconfont icon-cheliang',

          'iconfont icon-xitongxinxi',

          'iconfont icon-order-phone',

          'iconfont icon-icon_gerendangan_normal',

          'iconfont icon-fold',

          'iconfont icon-pdf',

          'iconfont icon-renliziyuanzhutifenxi',

          'iconfont icon-leijianzhucailiaox',

          'iconfont icon-guanxi',

          'iconfont icon-youlun',

          'iconfont icon-data-cloud',

          'iconfont icon-ren1',

          'iconfont icon-diyiming',

          'iconfont icon-diermingyajunjiangbei',

          'iconfont icon-disanmingjijunjiangbei',

          'iconfont icon-xiaokongguanli',

          'iconfont icon-leimupinleifenleileibie',

          'iconfont icon-anjianyanpan',

          'iconfont icon-copy',

          'iconfont icon-chaxun',

          'iconfont icon-biji-copy',

          'iconfont icon-erji-baobiaocelve',

          'iconfont icon-erji-anquanfuwukaitongqingkuang',

          'iconfont icon-is_order',

          'iconfont icon-lianxirenguanli'
        ],
        // 图片
        imagesOptions: [
          '/static/img/res/default.png',
          '/static/img/res/menu_01.png',
          '/static/img/res/menu_02.png',
          '/static/img/res/menu_03.png',
          '/static/img/res/menu_04.png',
          '/static/img/res/menu_05.png',
          '/static/img/res/menu_06.png',
          '/static/img/res/menu_07.png',
          '/static/img/res/menu_08.png',
          '/static/img/res/menu_09.png',
          '/static/img/res/menu_10.png',
          '/static/img/res/menu_11.png',
          '/static/img/res/menu_12.png',
          '/static/img/res/menu_13.png',
          '/static/img/res/menu_14.png',
          '/static/img/res/menu_15.png',
          '/static/img/res/menu_16.png',
          '/static/img/res/menu_17.png',
          '/static/img/res/menu_18.png',
          '/static/img/res/menu_19.png',
          '/static/img/res/menu_20.png',
          '/static/img/res/menu_21.png',
          '/static/img/res/menu_22.png',
          '/static/img/res/menu_23.png',
          '/static/img/res/menu_24.png',
          '/static/img/res/menu_25.png',
          '/static/img/res/menu_26.png',
          '/static/img/res/menu_27.png',
          '/static/img/res/menu_28.png',
          '/static/img/res/menu_29.png',
          '/static/img/res/menu_30.png',
          '/static/img/res/menu_31.png',
          '/static/img/res/menu_32.png',
          '/static/img/res/menu_33.png',
          '/static/img/res/menu_34.png',
          '/static/img/res/menu_35.png',
          '/static/img/res/menu_36.png',
          '/static/img/res/menu_37.png',
          '/static/img/res/menu_38.png',
          '/static/img/res/menu_39.png',
          '/static/img/res/menu_40.png',
          '/static/img/res/menu_41.png',
          '/static/img/res/menu_42.png',
          '/static/img/res/menu_43.png',
          '/static/img/res/menu_44.png',
          '/static/img/res/menu_45.png',
          '/static/img/res/menu_46.png',
          '/static/img/res/menu_47.png',
          '/static/img/res/menu_48.png',
          '/static/img/res/menu_49.png',
          '/static/img/res/menu_50.png',
          '/static/img/res/menu_51.png',
          '/static/img/res/menu_52.png',
          '/static/img/res/menu_53.png',
          '/static/img/res/menu_54.png',
          '/static/img/res/menu_55.png',
          '/static/img/res/menu_56.png',
          '/static/img/res/menu_57.png',
          '/static/img/res/menu_58.png',
          '/static/img/res/menu_59.png',
          '/static/img/res/menu_60.png',
          '/static/img/res/menu_61.png',
          '/static/img/res/menu_62.png',
          '/static/img/res/menu_63.png',
          '/static/img/res/menu_64.png',
          '/static/img/res/menu_65.png',
          '/static/img/res/menu_66.png',
          '/static/img/res/menu_67.png',
          '/static/img/res/menu_68.png',
          '/static/img/res/menu_69.png',
          '/static/img/res/menu_70.png',
          '/static/img/res/menu_71.png',
          '/static/img/res/menu_72.png',
          '/static/img/res/menu_73.png',
          '/static/img/res/menu_74.png',
          '/static/img/res/menu_75.png',
          '/static/img/res/menu_76.png',
          '/static/img/res/menu_77.png',
          '/static/img/res/menu_78.png',
          '/static/img/res/menu_79.png',
          '/static/img/res/menu_80.png',
          '/static/img/res/menu_81.png',
          '/static/img/res/menu_82.png',
          '/static/img/res/menu_83.png',
          '/static/img/res/menu_84.png',
          '/static/img/res/menu_85.png',
          '/static/img/res/menu_86.png',
          '/static/img/res/menu_87.png',
          '/static/img/res/menu_88.png',
          '/static/img/res/menu_89.png',
          '/static/img/res/menu_90.png',
          '/static/img/res/menu_91.png',
          '/static/img/res/menu_92.png',
          '/static/img/res/menu_93.png',
          '/static/img/res/menu_94.png',
          '/static/img/res/big_screen_1.jpg',
          '/static/img/res/big_screen_2.jpg',
          '/static/img/res/big_screen_3.jpg',
          '/static/img/res/big_screen_4.jpg',
          '/static/img/res/big_screen_5.jpg',
          '/static/img/res/big_screen_6.jpg',
          '/static/img/res/big_screen_7.jpg',
          '/static/img/res/big_screen_8.jpg',
          '/static/img/res/big_screen_9.jpg',
          '/static/img/res/big_screen_10.jpg',
          '/static/img/res/big_screen_11.jpg',
          '/static/img/res/big_screen_12.jpg',
          '/static/img/res/big_screen_13.jpg',
          '/static/img/res/big_screen_14.jpg',
          '/static/img/res/big_screen_15.jpg',
          '/static/img/res/big_screen_16.jpg',
          '/static/img/res/big_screen_17.jpg',
          '/static/img/res/big_screen_18.jpg',
          '/static/img/res/big_screen_19.jpg',
          '/static/img/res/big_screen_21.jpg',
          '/static/img/res/big_screen_22.jpg',
          '/static/img/res/big_screen_23.jpg',
          '/static/img/res/big_screen_24.jpg',
          '/static/img/res/big_screen_25.jpg',
          '/static/img/res/big_screen_26.jpg',
          '/static/img/res/big_screen_27.jpg',
          '/static/img/res/big_screen_28.jpg',
          '/static/img/res/big_screen_29.jpg',
          '/static/img/res/1.png',
          '/static/img/res/2.png',
          '/static/img/res/3.png',
          '/static/img/res/4.png',
          '/static/img/res/5.png',
          '/static/img/res/6.png',
          '/static/img/res/7.png',
          '/static/img/res/8.png',
          '/static/img/res/9.png',
          '/static/img/res/10.png',
          '/static/img/res/11.png',
          '/static/img/res/12.png',
          '/static/img/res/13.png',
          '/static/img/res/14.png',
          '/static/img/res/15.png',
          '/static/img/res/16.png',
          '/static/img/res/17.png',
          '/static/img/res/18.png',
          '/static/img/res/19.png',
          '/static/img/res/20.png',
          '/static/img/res/21.png',
          '/static/img/res/22.png',
          '/static/img/res/23.png',
          '/static/img/res/24.png',
          '/static/img/res/25.png',
          '/static/img/res/26.png',
          '/static/img/res/27.png',
          '/static/img/res/28.png',
          '/static/img/res/29.png',
          '/static/img/res/30.png',
          '/static/img/res/31.png',
          '/static/img/res/32.png',
          '/static/img/res/33.png',
          '/static/img/res/34.png',
          '/static/img/res/35.png',
          '/static/img/res/36.png',
          '/static/img/res/37.png',
          '/static/img/res/38.png',
          '/static/img/res/39.png',
          '/static/img/res/40.png',
          '/static/img/res/41.png',
          '/static/img/res/42.png'
        ]
      }
    },
    /**
     * 接收参数
     * @prop {String} mode 模式, (image: 图片|icon: 字符图标), 默认: icon
     */
    props: ['value', 'mode'],
    computed: {},
    watch: {
      value(val) {
        this.icon = val
      }
    },
    methods: {
      update(val) {
        this.$emit('input', val);
      }
    },
    mounted: function() {
      this.icon = this.value
    }
  }

</script>
