<template>
<!-- 个人旅店分析 -->
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
          <el-form :model="item.queryForm" :inline="true" :ref="item.queryForm" :rules="rules" label-position="right" label-width="90px">
            <el-row v-for="(timeItem,ii) in item.queryForm.timeSpace" :key="ii">
              <el-col :span="6">
                <el-form-item prop="type" label="范围类型">
                  <el-select style="width: 270px" v-model="timeItem.type" @change="typeChange(ii)" filterable>
                    <el-option v-for="typeItem in typeList" :key="typeItem.value" :value="typeItem.value" :label="typeItem.label"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="address" label="活动地点">
                  <el-select style="width: 270px" :disabled="addreeAble" v-loading="loading" v-model="timeItem.address" filterable>
                    <el-option v-for="addressItem in AddressList"  :key="addressItem.value" :value="addressItem.value" :label="addressItem.label"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="time" label="活动时间">
                  <el-date-picker type="daterange" v-model="timeItem.time" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm, val)" placeholder="请选择"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="">
                  <el-button icon="plus" @click="addTimeSpace(item)"></el-button>
                  <el-button size="mini" icon="close" @click="removeTimeSpace(item.queryForm.timeSpace, timeItem)"></el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-button type="primary" class="analysis" native-type="submit" @click.prevent="query()">分析
            </el-button>
          </el-form>
        </div>
      </searchBox>
      <div class="app-content-box">
        <!-- 结果列表 -->
        <div class="res-box" v-if="resBox===true">
          <el-table @cell-mouse-enter="cellMouseEnter" :data="item.mainList" v-loading="loading" @row-click="showDetail">
            <el-table-column v-for="item in table.columns" :key="item.prop" :label="item.label" :prop="item.prop" align="center"></el-table-column>
            <el-table-column :key="item.prop" label="操作" align="center">
              <template scope="scope">
                  <el-button type="primary" v-if="checkRuleCase('ajgl/clue/update')" size="mini"
                             @click="queryDetail(scope.row)" icon="icon iconfont icon-brush">详情
                  </el-button>
                </template>
            </el-table-column>
          </el-table>
          <!--<div class="app-content-box" v-if="resBox===true" v-for="ld in item.mainList">
              <ul>
                <li>
                  <div class="miniimg">
                    <data-image :idCard="ld.zjhm"></data-image>
                  </div>
                  <div class="list-right">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">姓名：</span>{{ld.xm}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">身份证：</span><a href="#">{{ld.zjhm}}</a></div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">活动地点：</span>{{ld.xb === '2' ? ld.xb === '1' ? '未知' : '女' : '男'}}
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">

                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">数据类型：</span>{{ld.lgmc}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">命中次数：</span>{{ld.lgdz}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">入住房号：</span>{{ld.rzfh}}
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">入住时间：</span>{{ld.rzsj}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">退房时间：</span>{{ld.tfsj}}
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="listbox">
                          <span class="listtitle">分析人证件号码：</span>{{ld.fxrzjhm}}
                        </div>
                      </el-col>
                      <el-col :span="16">
                        <div class="listbox">
                          <span class="listtitle">旅客编号：</span>{{ld.lkbh}}
                        </div>
                      </el-col>
                    </el-row>
                    &lt;!&ndash;<el-row :gutter="20">&ndash;&gt;
                    &lt;!&ndash;<el-col :span="24">&ndash;&gt;
                    &lt;!&ndash;<span class="tags">前科人员</span>&ndash;&gt;
                    &lt;!&ndash;<span class="tags">前科人员</span>&ndash;&gt;
                    &lt;!&ndash;<span class="tags">前科人员</span>&ndash;&gt;
                    &lt;!&ndash;</el-col>&ndash;&gt;
                    &lt;!&ndash;</el-row>&ndash;&gt;
                  </div>
                </li>
              </ul>
            </div>-->
        </div>
      </div>
    </div>
  </div>
  <!-- 编辑模态窗 large/tiny-->
  <multiInfo :dialog="editDialog" :editmode="editMode" @close="editDialog=false"></multiInfo>
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
import { FETCH_LOCUS_PERSON_LIST, GET_LOCUS_PERSON_DETAIL, FETCH_LOCUS_ADDRESS_BY_PLACE } from '../../../../store/types'
import locusMixin from '../locusMinxin'
import dataImage from '../../../../widgets/data-image/data-image'
import searchBox from '../../search-tool'
import list from '../detail.vue'
import multiInfo from './multiInfo.vue'
import { arrayGetRid } from '../../../../utils/util'
export default {
  mixins: [locusMixin],
  components: {
    'data-image': dataImage,
    searchBox,
    multiInfo,
    list
  },
  data() {
    return {
      noConnectCase: true,
      tabName: '多时空分析',
      addreeAble: true,
      editMode: {
        XM: '赵三未',
        ZJHM: '430333199009090909',
        csmc: '长沙市长沙县泉塘街道23号',
        kssj: '2017-12-06 18:00:39',
        jssj: '2017-12-06 18:00:42',
        wzh: 'WZ123145679',
        Sjlx: '卡口'
      },
      editmode: '',
      editDialog: false,
      commName: 'multi',
      resBox: false,
      detailBox: false,
      floor: true,
      table: {
        columns: [
          { label: '姓名', prop: 'XM' },
          { label: '证件号码', prop: 'ZJHM' },
          { label: '处所名称', prop: 'csmc' },
          { label: '开始时间', prop: 'kssj' },
          { label: '结束时间', prop: 'jssj' },
          { label: '位置号', prop: 'wzh' },
          { label: '数据类型', prop: 'Sjlx' }
//            {label: '操作', prop: 'cz'}
        ],
        data: []
      },
      rules: {
        type: [{
          required: false,
          message: '请输入类型'
        }],
        address: [{
          required: false,
          message: '请输入地点'
        }],
        time: [{
          required: false,
          message: '请输入时间范围'
        }]
      },
      typeList: [{ label: '旅店', value: 'LD' }, { label: '网吧', value: 'WB' }, { label: '铁路', value: 'TL' }, {
        label: '航班',
        value: 'HB'
      }, { label: '卡口', value: 'KK' }, { label: 'wifi围栏', value: 'WIFI' }],
      AddressList: [],
      mainGo: null,
      diagram: null,
      testData: ['622588743697531', '622588523698521', '622587412587412']
    }
  },
  props: [],
  computed: {},
  methods: {
    query() {
      this.fetchMainList()
      this.detailBox = false
    },
    /**
     *查询接口并显示列表
     */
    fetchMainList() {
      let target = this.tabs[this.currentTab]
      console.log('参数timespace', target.queryForm.timeSpace)
      let chekinfos = []
      var isflag = true
      target.queryForm.timeSpace.forEach(d => {
        if (d.time[0] === null || d.time[1] === null || d.time.length === 0) {
          console.log('时间', d);
          alert('时间不能为空')
          isflag = false;
        } else {
          chekinfos.push({
            ddmc: d.adress,
            type: d.type,
            kssj: d.time[0].getFullYear() + '' + (d.time[0].getMonth() > 10 ? d.time[0].getMonth() : ('0' + d.time[0].getMonth())) + '' + (d.time[0].getDay() > 10 ? d.time[0].getDay() : ('0' + d.time[0].getDay())),
            jssj: d.time[1].getFullYear() + '' + (d.time[1].getMonth() > 10 ? d.time[1].getMonth() : ('0' + d.time[1].getMonth())) + '' + (d.time[1].getDay() > 10 ? d.time[1].getDay() : ('0' + d.time[1].getDay()))
          })
        }
      })
      if (!isflag) {
        return false;
      }
      this.resBox = true
      console.log(chekinfos)
      this.dispatch(FETCH_LOCUS_PERSON_LIST, {
        PageIndex: 1,
        PageSize: 20,
        checkinfo: chekinfos,
        zjhm: target.guid
      }).then(() => {
        console.log('多时空分析返回值', this.analysisLocus.personList.PageData);
        let res = []
        if (this.analysisLocus.personList.PageData === null) {
          res.push({
            XM: '赵三未',
            ZJHM: '430333199009090909',
            csmc: '长沙市长沙县泉塘街道23号',
            kssj: '2017-12-06 18:00:39',
            jssj: '2017-12-06 18:00:42',
            wzh: 'WZ123145679',
            Sjlx: '卡口'
          })
        }
        console.log('转换后', res)
        target.mainList = res
      })
    },
    /**
     * 查询详情
     * @param row
     */
    getQueryInfo(rowId, callback = () => {}) {
      // 查询单条信息
      let target = this.tabs[this.currentTab]
      console.log('参数timespace', target.queryForm.timeSpace)
      let chekinfos = []
      target.queryForm.timeSpace.forEach(d => {
        if (d.time[0] === null || d.time[1] === null || d.time.length === 0) {
          console.log('时间', d);
          alert('时间不能为空')
        }
        chekinfos.push({
          ddmc: d.address,
          type: d.type,
          kssj: d.time[0].getFullYear() + '' + (d.time[0].getMonth() > 10 ? d.time[0].getMonth() : ('0' + d.time[0].getMonth())) + '' + (d.time[0].getDay() > 10 ? d.time[0].getDay() : ('0' + d.time[0].getDay())),
          jssj: d.time[1].getFullYear() + '' + (d.time[1].getMonth() > 10 ? d.time[1].getMonth() : ('0' + d.time[1].getMonth())) + '' + (d.time[1].getDay() > 10 ? d.time[1].getDay() : ('0' + d.time[1].getDay()))
        })
      })
      this.dispatch(GET_LOCUS_PERSON_DETAIL, {
        PageIndex: 1,
        PageSize: 20,
        checkinfo: chekinfos,
        zjhm: target.guid
      }).then(() => {
        if (this.analysisLocus.personDetail.PageData !== null) {
          this.editMode = this.analysisLocus.personDetail.PageData
        }
        console.log('sssss', this.editMode)
        callback()
      })
      console.log('mode', this.editmode)
    },
    queryDetail(row) {
      this.getQueryInfo(row, () => {
        // this.editMode = 'edit'
        this.editDialog = true
      })
    },
    showDetail() {
      this.detailBox = true
      //        this.initMaker()
    },
    /**
     * 增加筛选条件
     * @param tab
     */
    addTimeSpace(tab) {
      tab.queryForm.timeSpace.push({
        type: '',
        adress: '',
        time: [new Date() - (3600 * 1000 * 24 * 365), new Date()]
      })
    },
    /**
     * 减少筛选条件
     * @param tab
     */
    removeTimeSpace(tab, item) {
      if (tab.length > 1) {
        arrayGetRid(tab, [item])
      }
    },
    submitForm(queryForm) {
      console.log(queryForm)
      //        this.$refs[queryForm].validate((valid) => {
      //          if (valid) {
      //            alert('提交成功');
      //          } else {
      //            alert('提交失败');
      //            return false;
      //          }
      //        });
    },
    restForm(queryForm) {
      let target = this.tabs[this.currentTab]
      target.queryForm = [];
      //        this.$refs[this.queryForm].resetFields();
    },
    typeChange(i) {
      let target = this.tabs[this.currentTab]
      console.log('范围值改变', target.queryForm.timeSpace[i].type)
      this.dispatch(FETCH_LOCUS_ADDRESS_BY_PLACE, {
        type: target.queryForm.timeSpace[i].type,
        keyword: target.queryForm.timeSpace[i].address
      }).then(() => {
        this.AddressList = this.analysisLocus.fetchLocusAddressByPlace.map(d => {
          return {
            key: d.id,
            label: d.ddmc,
            value: d.ddmc
          }
        })
      })
      this.addreeAble = false
    }
    //      addressChange(i) {
    //        let target = this.tabs[this.currentTab]
    //        console.log('地址改变', target)
    //        this.dispatch(FETCH_LOCUS_ADDRESS_BY_PLACE, {
    //          type: target.queryForm.timeSpace[i].type,
    //          keyword: target.queryForm.timeSpace[i].address
    //        }).then(() => {
    //          console.log('返回下拉选项', this.analysisLocus.fetchLocusAddressByPlace)
    //          this.AddressList = this.analysisLocus.fetchLocusAddressByPlace.map(d => {
    //            return {
    //              key: d.id,
    //              label: d.ddmc,
    //              value: d.ddmc
    //            }
    //          })
    //          this.addreeAble = false
    //        })
    //      }
  },
  created() {},
  mounted() {}
}
</script>
