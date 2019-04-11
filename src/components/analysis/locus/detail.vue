<template>
<div>

  <!--通话详情分析-->
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <div class="tabs">
        <div :class="{'tabs__item':true,'current':currentTab===i}" v-for="(item,i) in tabs" @click="currentTab=i">
          {{item.number}}
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
  <searchBox>
    <div slot="formBox">
      <el-form :model="queryForm" :inline="true" label-position="right" label-width="109px">
        <el-form-item label="时间区间">
          <el-date-picker type="daterange" v-model="timeSlot" :editable="false" @change="dateRange()" format="yyyy-MM-dd" placeholder="请选择时间区间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="同住类型">
          <el-checkbox-group v-model="queryForm.jztype">
            <el-checkbox label="同旅馆" name="0"></el-checkbox>
            <el-checkbox label="同房间" name="1"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="同住次数≥">
          <el-input v-model="queryForm.tznumber" class="miniinput"></el-input>
        </el-form-item>
        <el-form-item label="时间类型">
          <el-checkbox-group v-model="queryForm.timeType">
            <el-checkbox label="同入住" name="0"></el-checkbox>
            <el-checkbox label="同时离开" name="1"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="前后时间偏移">
          <el-input v-model="queryForm.tznumber" class="miniinput" placeholder="分钟"></el-input>
        </el-form-item>


      </el-form>
      <el-button type="primary" class="analysis" native-type="submit" @click.prevent="submit">查询</el-button>
    </div>
  </searchBox>
  <!-- 查询结果 -->
  <div class="app-content-box" v-if="resBox===true">
    <ul>
      <li>
        <div class="miniimg">
          <data-image :idCard="this.$route.query.Key"></data-image>
        </div>
        <div class="list-right">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">姓名：</span>李明珠
              </div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">身份证：</span><a href="#">44042119556878505x</a></div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">性别：</span>男
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">

            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">手机号：</span>
                <a href="#"><span class="hover-menu" data-type="mobile">15818955056</span></a>
                </div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">出生日期：</span>1955年6月10日
              </div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">房号：</span>505
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">酒店名称：</span>湖南怀化市某某酒店
              </div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">入住时间：</span>2017年10月7日
              </div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">离店时间：</span>2017年10月15日
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <span class="tags">前科人员</span>
              <span class="tags">前科人员</span>
              <span class="tags">前科人员</span>
            </el-col>
          </el-row>
        </div>
      </li>

      <li>
        <div class="miniimg">
          <data-image :idCard="this.$route.query.Key"></data-image>
        </div>
        <div class="list-right">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">姓名：</span>李明珠
              </div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">身份证：</span><a href="#">44042119556878505x</a></div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">性别：</span>男
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">

            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">手机号：</span><a href="#">15818955056</a></div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">出生日期：</span>1955年6月10日
              </div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">房号：</span>505
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">酒店名称：</span>湖南怀化市某某酒店
              </div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">入住时间：</span>2017年10月7日
              </div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">离店时间：</span>2017年10月15日
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <span class="tags">前科人员</span>
              <span class="tags">前科人员</span>
              <span class="tags">前科人员</span>
            </el-col>
          </el-row>
        </div>
      </li>

      <li>
        <div class="miniimg">
          <data-image :idCard="this.$route.query.Key"></data-image>
        </div>
        <div class="list-right">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">姓名：</span>李明珠
              </div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">身份证：</span><a href="#">44042119556878505x</a></div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">性别：</span>男
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">

            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">手机号：</span><a href="#">15818955056</a></div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">出生日期：</span>1955年6月10日
              </div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">房号：</span>505
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">酒店名称：</span>湖南怀化市某某酒店
              </div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">入住时间：</span>2017年10月7日
              </div>
            </el-col>
            <el-col :span="8">
              <div class="listbox">
                <span class="listtitle">离店时间：</span>2017年10月15日
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <span class="tags">前科人员</span>
              <span class="tags">前科人员</span>
              <span class="tags">前科人员</span>
            </el-col>
          </el-row>
        </div>
      </li>
    </ul>
  </div>
</div>
</template>
<style>
  .app-content-box {
    padding: 16px 10px;
  }

  .tel-list-box .app-toolbar .miniinput>input {
    width: 75px;
  }

</style>
<style lang="scss" scoped>
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
  import searchBox from '../search-tool'
  import dataImage from '../../../widgets/data-image/data-image'
  import mixin from '../../../utils/mixin'
  import dateFormat from '../../../utils/dateFormat'
  export default {
    mixins: [mixin],
    components: {
      searchBox,
      dataImage
    },
    data() {
      return {
        isArrow: true,
        resBox: false,
        detailBox: false,
        timeSlot: '',
        timeLebelList: ['大于等于', '小于等于'],
        timeInterval: ['时段1', '时段2', '时段3', '时段4', '时段5'],
        callTypeList: ['全部', '类型1', '类型2'],
        queryForm: {
          tznumber: '',
          timeType: [],
          otherPhone: '',
          placeCall: '',
          callType: '',
          callDate: '',
          callTime: '',
          timeLeght: '',
          timeLebel: '',
          callArea: '',
          BeginDate: '',
          EndDate: '',
          jztype: []
        },
        tabs: []
      }
    },
    props: [],
    computed: {},
    methods: {
      submit() {
        this.resBox = true
        console.log(this.resBox);
      },
      dateRange() {
        this.BeginDate = this.timeSlot === '' ? this.timeSlot[0] : dateFormat(new Date(this.timeSlot[0]), 'yyyy-MM-dd');
        this.EndDate = this.timeSlot === '' ? this.timeSlot[1] : dateFormat(new Date(this.timeSlot[1]), 'yyyy-MM-dd');
      }
    },
    created() {
      this.active = this.$route.path
    },
    mounted() {}
  }

</script>
