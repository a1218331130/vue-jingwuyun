<template>
<!-- 个人网吧分析 -->
<!-- 本页套数据 -->
<div class="tel-list">
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <div class="tabs">
        <div :class="{'tabs__item':true,'current':currentTab===i}" v-for="(item,i) in tabs" @click="currentTab=i">
          {{item.keyVal}}
          <i class="iconfont icon-close" @click.stop="removeTab(item)"></i>
        </div>
      </div>
    </el-col>
    <el-col :span="4" class="collap-col">
      <div class="collap-box pointer">
        <slot name="switchRightBarBtn"></slot>
      </div>
    </el-col>
  </el-row>

  <div class="tabs-box">
    <div class="tabs-box__item" v-for="(item,i) in tabs" v-show="i===currentTab">
      <searchBox>
        <div slot="formBox">
          <el-form :model="item.queryForm" :inline="true" label-position="right" label-width="90px">
            <el-form-item label="时间区间">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm, val)" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <el-form-item label="网吧">
              <!--remote="true" :remote-method="remoteMethod"-->
              <!--<el-select v-model="item.queryForm.cyberBars" multiple filterable placeholder="请选择">-->
              <!--<el-option v-for="item in cyberBarList" :label="item.label" :value="item.value"-->
              <!--:key="item.value"></el-option>-->
              <!--</el-select>-->
              <el-input v-model="item.queryForm.cyberBars"></el-input>
            </el-form-item>
            <el-form-item label="同上网次数" labelWidth="110px">
              <!--<el-select class="small" v-model="item.queryForm.callCountLabel" placeholder="请选择">-->
              <!--<el-option v-for="item in logicOps" :label="item.label" :value="item.value"-->
              <!--:key="item.value"></el-option>-->
              <!--</el-select>-->
              >=
              <el-input-number class="small" v-model="item.queryForm.callCount" size="small" :min="1" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item label="同上网规则" labelWidth="110px">
              <el-select class="small" v-model="item.queryForm.online" placeholder="请选择">
                <el-option v-for="item in onlineList" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="前后时间偏移" labelWidth="120px">
              <el-input-number v-model="item.queryForm.toTime" size="small" :min="1" :max="1000" class="small"></el-input-number>
            </el-form-item>
            <!--<el-form-item label="多人身份证" labelWidth="120px">-->
            <!--&lt;!&ndash; el-input v-model="item.queryForm.drsfz"></el-input &ndash;&gt;-->
            <!--{{item.guid.join(', ')}}-->
            <!--</el-form-item>-->
            <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query">分析</el-button>
          </el-form>
        </div>
      </searchBox>
      <div class="app-content-box">
        <!-- 结果列表 -->
        <div class="res-box" v-if="resBox===true">
          <!--<h3>个人网吧分析</h3>-->
          <!--<el-table @cell-mouse-enter="cellMouseEnter" :data="item.mainList" v-loading="loading"-->
          <!--@row-click="showDetail">-->
          <!--<el-table-column v-for="item in table.columns" :key="item.prop" :label="item.label" :prop="item.note"-->
          <!--align="center"></el-table-column>-->
          <!--</el-table>-->
          <el-table v-loading="loading">
            <div class="app-content-box" v-if="resBox===true" v-for="wb in item.mainList">
              <ul>
                <li>
                  <div class="miniimg">
                    <data-image :idCard="wb.zjhm"></data-image>
                  </div>
                  <div class="list-right">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">姓名：</span>{{wb.xm}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">身份证：</span><a href="#">{{wb.zjhm}}</a></div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">分析人证件号码：</span>{{wb.fxrzjhm}}
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">网吧代码：</span>{{wb.wbdm}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">开始时间：</span>{{wb.kssj}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">结束时间：</span>{{wb.jssj}}
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">网吧地址：</span>{{wb.wbdz}}
                        </div>
                      </el-col>
                      <el-col :span="10">
                        <div class="listbox">
                          <span class="listtitle">网吧名称：</span>{{wb.wbmc}}
                        </div>
                      </el-col>
                    </el-row>
                    <!--<el-row :gutter="20">-->
                    <!--<el-col :span="24">-->
                    <!--<span class="tags">前科人员</span>-->
                    <!--<span class="tags">前科人员</span>-->
                    <!--<span class="tags">前科人员</span>-->
                    <!--</el-col>-->
                    <!--</el-row>-->
                  </div>
                </li>
              </ul>
            </div>
          </el-table>
        </div>
      </div>
    </div>
  </div>

</div>
</template>
<style lang="scss" scoped>
.comm {
    .maker {
        background: #fff;
        height: calc(100vh - 205px);
    }
    .overview-box {
        width: 200px;
        height: 100px;
        position: absolute;
        bottom: 0;
        right: 0;
    }
}

.app-content-box {
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
        li {
            list-style: none;
            margin: 0;
            padding: 12px;
            border: 1px solid #d7d7d7;
            border-bottom: 0;
            &:last-child {
                border-bottom: 1px solid #d7d7d7;
            }
            &:after {
                content: '';
                display: block;
                height: 0;
                clear: both;
            }
        }
    }
    .miniimg {
        width: 89px;
        height: 103px;
        background: #f2f2f2;
        padding: 2px;
        border: 1px solid #d7d7d7;
        float: left;
        img {
            position: relative;
            width: 100%;
            height: 100%;

        }
    }
    .list-right {
        float: left;
        width: calc(100% - 109px);
        line-height: 30px;
        .listtitle {
            color: #999;
            width: 130px;
            text-align: right;
            display: inline-block;
        }
    }
    .tags {
        position: relative;
        background: #ff8d42;
        display: inline-block;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        padding: 0 10px;
        color: #fff;
        margin-left: 25px;
        line-height: 22px;
        &:first-child {
            margin-left: 50px;
        }
        &:before {
            content: '';
            display: block;
            position: absolute;
            right: -11px;
            top: 0;
            border-top: 11px solid transparent;
            border-bottom: 11px solid transparent;
            border-left: 11px solid #ff8d42;
            border-right: 0;
        }
    }
    .content-right {}

}
</style>
<script>
import { FETCH_LOCUS_INTERNET_BAR_LIST } from '../../../../store/types'
import locusMixin from '../locusMinxin'
import searchBox from '../../search-tool'
import list from '../detail.vue'
import { NgwGo } from '../../../../utils/ngw.go'
import ElInput from '../../../../../node_modules/element-ui/packages/input/src/input';
import dataImage from '../../../../widgets/data-image/data-image'
export default {
  mixins: [locusMixin],
  components: {
    'data-image': dataImage,
    ElInput,
    searchBox,
    list
  },
  data() {
    return {
      cyberBars: [],
      singleTab: true,
      commName: 'manyCyberBar',
      resBox: false,
      detailBox: false,
      onlineList: [{ label: '同上网且同下网', value: '1' }, { label: '同上网', value: '2' }, { label: '同下网', value: '3' }],
      cyberBarList: [{ label: '极速网吧', value: '1' }, { label: '天宇网吧', value: '2' }, { label: '天天见网吧', value: '3' }],
      table: {
        columns: [
          { label: '分析人姓名', prop: 'findPeopleName', note: 'fxrxm' }, {
            label: '开始时间',
            prop: 'startTime',
            note: 'kssj'
          }, { label: '结束时间', prop: 'endTime', note: 'jssj' }, { label: '姓名', prop: 'name', note: 'xm' }, {
            label: '网吧地址',
            prop: 'Address',
            note: 'wbdz'
          }, { label: '分析人证件号码', prop: 'findPeopleIdCard', note: 'fxrzjhm' }, {
            label: '证件号码',
            prop: 'IdCard',
            note: 'zjhm'
          }, { label: '网吧名称', prop: 'cyberBarName', note: 'wbmc' }, {
            label: '网吧代码',
            prop: 'cyberBarId',
            note: 'wbdm'
          }
        ],
        data: []
      },
      mainGo: null,
      diagram: null,
      /**
       * [data 模型数据对象(最终结果)]
       * @type {Object}
       */
      goData: {
        /**
         * [nodeDataArray 节点数据]
         * @type {Array}
         */
        // [], //
        nodeDataArray: [],
        /**
         * [linkDataArray 连线数据]
         * @type {Array}
         */
        // [] //
        linkDataArray: []
      },
      testData: ['622588743697531', '622588523698521', '622587412587412']
    }
  },
  props: [],
  computed: {},
  methods: {
    initMaker() {
      let self = this;
      if (this.mainGo === null) {
        self.mainGo = new NgwGo({
          diagram: self.diagram,
          data: self.goData,
          readOnly: true,
          overview: 'overViewBox'
        })
      }
      self.mainGo.init()
    },
    query() {
      this.fetchMainList()
      this.resBox = true
      this.detailBox = false
    },
    /**
     * 分析按钮提交参数
     */
    fetchMainList() {
      let target = this.tabs[this.currentTab]
      console.log('参数target', target)
      if (target.guid.length < 2) {
        this.$alert('必需选择一个以上不同的身份证', '温馨提示');
        return false
      }
      this.dispatch(FETCH_LOCUS_INTERNET_BAR_LIST, {
        PageIndex: 1,
        PageSize: 20,
        //          zjhm: target.guid,
        zjhm: target.guid.join(','),
        wbmc: target.queryForm.cyberBars,
        swtj: target.queryForm.online,
        kssj: target.queryForm.timeSlot[0].split('-').join('') || '',
        jssj: target.queryForm.timeSlot[1].split('-').join('') || '',
        txcs: target.queryForm.callCount,
        sjpy: target.queryForm.toTime
      }).then(() => {
        console.log('网吧返回值', this.analysisLocus.internetBarList.PageData);
        target.mainList = this.analysisLocus.internetBarList.PageData
      })
    },
    showDetail() {
      //        this.detailBox = true
      //        this.initMaker()
    }
  },
  created() {},
  mounted() {}
}
</script>
