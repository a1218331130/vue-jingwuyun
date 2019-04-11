<template>
<div class="timeline">
  <div class="person-box">
    <div class="person-box__title">
      <h4> 分析对象</h4>
      <el-button v-show="showObjects===false" size="mini" @click="showObjects=true" icon="icon iconfont icon-fold">展开</el-button>
    </div>

    <transition name="fade">
      <div class="person-list" v-show="showObjects===true">
        <div class="person-list__item" v-for="item in personList">
          <data-image class="person-list__item__image" :idCard="item.idCard"></data-image>
          <div class="person-list__item__name">{{item.name}}</div>
          <el-button @click="removePerson(item)" icon="icon iconfont icon-trash_fill"></el-button>
        </div>
        <div class="person-list__item person-list__item--add" @click="dialogObjectSelector=true" v-if="showAddbutton===true"></div>
        <div class="person-addinput" v-if="dialogObjectSelector===true" style="width:30%">
          <el-input v-model="personNumber" placeholder="请输入证件号码" size="large" icon="icon iconfont icon-plus">
            <el-button slot="append" @click="searchPerson">添加</el-button>
          </el-input>
        </div>
      </div>
    </transition>
  </div>

  <div class="form">
    <el-form ref="queryForm" :model="form" label-width="100px" :inline="true">
      <el-form-item prop="dateRange" label="时间范围">
        <el-date-picker type="daterange" v-model="form.dateRange" range-separator=" / " @change="val=>form.dateRangeVal=val" :picker-options="pickerOptions" placeholder="选择时间范围"></el-date-picker>
      </el-form-item>
      <el-form-item prop="keyword" label="关键字">
        <el-input v-model="form.keyword" placeholder="请输入关键字"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="cardNumber" label-width="115px" label="可自填证件号">
        <el-input v-model="form.cardNumber" placeholder="请输入证件号"></el-input>
      </el-form-item> -->
      <!-- <el-form-item prop="area" label="区域类型">
        <tree-select :tree="{data:areaTree, 'node-key':'id','show-checkbox':true, 'check-strictly':false}" v-model="form.area" v-loading="dictLoading===true"></tree-select>

      </el-form-item> -->
      <el-form-item label="">
        <el-button type="primary" icon="search" @click="fetchList">分析</el-button>
      </el-form-item>
    </el-form>
  </div>

  <transition name="fade">
    <div class="content" v-show="isFirst===false">
      <div class="content__btn-box">
        <el-button type="warning" v-for="(item, i) in types" :key="i" :plain="item.checked===false" @click="checkType(item)">{{item.label}}(<span>{{item.count}}</span>)</el-button>
        <!-- <el-select v-model="sort" style="width:75px; float:right;">
          <el-option key="1" label="升序" value="aes"></el-option>
          <el-option key="2" label="降序" value="desc"></el-option>
        </el-select> -->
      </div>

      <div id="timeLineListBox" class="list-box">
        <timeLine :timeLine="timeLine" v-if="timeLine.length>0"></timeLine>
      </div>

      <!-- <div :class="{empty:true,'empty--tips':this.treeRes===null}" v-show="showTips===true">
        <span v-if="this.treeRes===null">请从左边树菜单选择地区或要素</span>
      </div> -->

      <div v-if="list.length===0 && listLoading===false" class="empty"></div>
    </div>
  </transition>

  <div :class="{'el-loading-mask':true,'action':(listLoading===true || filterLoading===true)}">
    <div class="el-loading-spinner loader--circular"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div>
  </div>

  <!-- <object-selector-dialog :dialog="dialogObjectSelector" type="person" v-model="personList" @close="dialogObjectSelector=false"></object-selector-dialog> -->

</div>
</template>

<style lang="scss" scoped>
  .timeline {
    height: calc(100% - 20px);
    padding: 10px;
    position: relative;
    overflow: hidden;
    .person-box {
      background: #fff;
      border: 1px solid #d7d7d7;
      &__title {
        border-bottom: 1px solid #d7d7d7;
        padding-left: 15px;
        position: relative;
        h4 {
          display: inline-block;
          color: #ff9900;
          border-bottom: 2px solid #ff9900;
          margin: 0;
          padding: 4px;
        }
        .el-button {
          padding: 4px 10px;
          position: absolute;
          top: 3px;
          right: 5px;
        }
      }
      .person-list {
        padding: 0 20px;
        margin: 10px 0;
        &__item {
          background-color: #cccccc;
          width: 64px;
          height: 83px;
          margin-right: 5px;
          border: 1px solid #cccccc;
          display: inline-block;
          position: relative;
          &__image {
            width: 100%;
            height: 100%;
          }
          &__name {
            width: 100%;
            background: rgba(0, 0, 0, .5);
            position: absolute;
            bottom: 0;
            left: 0;
            font-size: 12px;
            color: #fff;
            text-align: center;
          }
          .el-button {
            padding: 2px;
            border: 0;
            border-radius: 0 0 0 10px;
            display: none;
            position: absolute;
            top: 0;
            right: 0;
          }
          &:hover {
            .el-button {
              display: block;
            }
          }
          &--add {
            background: #fff;
            border-style: dashed;
            cursor: pointer;
            opacity: 0.8;
            &:hover {
              opacity: 1;
            }
            &:after {
              content: '+';
              font-size: 32px;
              color: #999;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translateX(-50%) translateY(-50%);
            }
          }
        }
      }
    }
    .form {
      margin-top: 11px;
      background: #fff;
      border: 1px solid #d7d7d7;
      padding: 15px;
      .el-form-item {
        margin-bottom: 0;
        .el-button {
          height: 31px;
          line-height: 31px;
          padding: 0 5px;
        }
      }
    }
    .content {
      background: #fff;
      height: calc(100vh - 235px);
      padding: 15px;
      margin-top: 11px;
      border: 1px solid #d7d7d7;
      overflow-y: auto;
      position: relative;
      .list-box {
        height: calc(100% - 46px);
        margin-top: 10px;
        overflow-y: auto;
        position: relative;
        &__item {
          margin-top: 10px;
          &:after {
            content: '';
            width: 100%;
            margin: 0 auto 10px;
            border-bottom: 1px solid #ccc;
            display: block;
          }
        }
      }
      .icon-w {
        width: 20px;
        float: left;
        .bage {
          width: 24px;
          heigth: 24px;
          background: #97cbff;
          color: #fff;
          text-align: center;
        }
      }
      .list {
        font-size: 24px;
        width: auto;
        margin-top: 40px;
        margin-bottom: 10px;
        margin-left: 40px;
        height: 35px;
        display: flex;
        float: left;
        color: #48ACE6;
        &__title {
          color: #ff9900;
          font-weight: bold;
          margin-bottom: 5px;
          font-size: 16px;
          width: auto;
          .yellow {
            color: #ff9900;
          }
        }
        &__time {
          font-weight: bold;
          margin-top: 5px;
        }
        &__line {
          height: 1px;
          background: #cccccc;
          position: relative;
          &:after {
            content: '';
            background: #cccccc;
            width: 16px;
            height: 1px;
            display: block;
            position: absolute;
            top: -5px;
            right: 0;
            transform: rotate(36deg);
          }
        }
        &__desc {
          flex-grow: 1;
        }
        &__linebox {
          flex-grow: 0;
          flex-shrink: 0;
          width: 200px;
          margin: 0 15px;
          text-align: center;
          .list__title {
            color: #999;
          }
        }
      }
      .table {
        width: 600px;
        float: left;
      }
      &__btn-box {
        .el-button {
          background: #f79e06;
          color: #fff;
          &.is-plain {
            background: #fff;
            color: #666;
          }
        }
      }
      &__box {
        padding: 0 15px;
        color: #666;
        background: #fff;
      }
      &__address {
        color: #000;
        font-weight: bold;
      }
      &__name {
        color: #333;
        padding: 10px 0;
        background: #f2f2f2;
        text-align: center;
      }
      &__body {
        color: #333;
        padding: 10px 5px;
        background: #fafafa;
      }
    }
  }

  .empty {
    // margin-top: 20px;
    // position: static;
  }

  .el-loading-mask {
    z-index: 995;
    display: none;
    &.action {
      display: block;
    }
  }

  .line-content {
    position: relative;
    top: 48px; // left: 30px;
    margin-left: 30px;
    span {
      margin-left: 30px;
      font-size: 30px;
      color: #333;
    }
  }

  .line-ul {
    li {
      list-style: none;
      display: inline-block;
      height: 20px;
      margin-bottom: 10px;
      margin-top: 60px;
      margin-right: 55px;
      color: #555;
      font-size: 16px;
    }
  }

</style>

<script>
  import { mapState } from 'vuex'
  import { FETCH_ANALYSIS_TIMELINE, GET_PERSON_INFO_FROM_MAIN_DATA } from '../../../store/types'
  import mixin from '../../../utils/mixin'
  import '../../../utils/dateFormat'
  import bus from '../../../utils/bus'

  // import { listToTree } from '../../../utils/listToTree'
  import { arrayGetRid } from '../../../utils/util'

  import TreeSelect from '../../../widgets/tree-select'
  // import objectSelectorDialog from '../../../widgets/object-selector-dialog/object-selector-dialog'
  import dataImage from '../../../widgets/data-image/data-image'
  import timeLine from '../../dossier/people/modules/time_line'

  export default {
    mixins: [mixin],
    components: {
      TreeSelect,
      // 'object-selector-dialog': objectSelectorDialog,
      'data-image': dataImage,
      timeLine
    },
    data() {
      return {
        personNumber: '',
        timeLine: [],
        showAddbutton: true,
        listLoading: false,
        filterLoading: false,
        isFirst: true,
        showObjects: true,
        dialogObjectSelector: false,
        personList: [],
        areaTree: [],
        targetId: '',
        form: {
          dateRange: [],
          dateRangeVal: '',
          keyword: '',
          area: [],
          cardNumber: ''
        },
        // rules: {
        //   dateRange: [{ required: true, message: '时间范围不能为空', trigger: 'blur' }]
        // },
        sort: 'desc',
        types: [
          { label: '卡口', value: 'KK', count: 0, checked: false, icon: 'iconfont icon-cheliang' },
          { label: '铁路', value: 'TL', count: 0, checked: false, icon: 'iconfont icon-huoche' },
          { label: '航空', value: 'HB', count: 0, checked: false, icon: 'iconfont icon-hangkongyunshu' },
          { label: '网吧', value: 'WB', count: 0, checked: false, icon: 'iconfont icon-wangba' },
          { label: '旅业', value: 'LY', count: 0, checked: false, icon: 'iconfont icon-jiudian' },
          { label: '资金流动', value: 'YH', count: 0, checked: false, icon: 'iconfont icon-zhangdan' },
          { label: '通话记录', value: 'THJL', count: 0, checked: false, icon: 'iconfont icon-order-phone' }
        ]
      }
    },
    computed: {
      idCard() {
        return this.$route.query.id || ''
      },
      caseId() {
        return this.$route.query.caseId || ''
      },
      type() {
        return this.types.filter(d => d.checked === true).map(d => d.value) || []
      },
      list() {
        let res
        if (this.analysisTimeline && this.analysisTimeline.list) {
          res = [...this.analysisTimeline.list]
          // 筛选
          if (this.type.length > 0) {
            res = res.filter(d => {
              if (!this.type.find(t => t === d.gjlx)) {
                return false
              } else {
                return true
              }
            })
          } else {
            // 无筛选项时置空
            res = []
          }
          // 排序(基于开始时间)
          if (res.length > 0) {
            res.sort((a, b) => {
              let aVal = Date.parse(new Date(a.kssj)),
                bVal = Date.parse(new Date(b.kssj))
              if (this.sort === 'aes') {
                return aVal - bVal
              } else {
                return bVal - aVal
              }
            })
          }
        } else {
          res = []
        }
        return res
      },
      ...mapState(['analysisTimeline', 'dossier', 'baseData'])
    },
    methods: {
      fetchList() {
        this.timeLine = []
        let newYear = new Date().getFullYear(),
          lastYear = newYear - 1,
          preYear = lastYear - 1,
          newYeararr = [],
          lastYeararr = [],
          preYeararr = []
        if (this.personList.length === 0 && this.form.cardNumber === '') {
          this.$alert('分析对象不能为空', '温馨提示')
          return false
        }
        if (this.form.dateRangeVal !== '') {
          let dateRange = this.form.dateRangeVal.split(' / ').map(d => d.split('-').join(''))
          this.showObjects = false
          this.showAddbutton === false
          this.isFirst = false
          this.listLoading = true
          this.dispatch(FETCH_ANALYSIS_TIMELINE, {
            v_zjhm: this.personList.map(d => d.idCard).join(','), // '43122619980319001X',
            v_starttime: dateRange[0],
            v_endtime: dateRange[1],
            v_xzqh: this.form.keyword,
            v_gjz: this.form.area.join(',')
          }).then(() => {
            // 结果集合计
            this.types.forEach(d => {
              let len = this.analysisTimeline.list.filter(c => c.gjlx === d.value).length || 0
              d.count = len
              if (len === 0) {
                d.checked = false
              } else {
                d.checked = true
              }
            })

            this.listLoading = false
            // 提交时间段到时间轴组件(去重步骤在时间轴组件内完成)
            bus.$emit('update:timelist', [...this.analysisTimeline.list.map(d => d.kssj)])
            // this.analysisTimeline.list
          }).then(() => {
            if (this.analysisTimeline.list.length > 0) {
              // 数据按照年份分组
              this.analysisTimeline.list.map(d => {
                d.month = d.kssj.split('-')[1] + '-' + d.kssj.split('-')[2].substr(0, 3)
                if (d.kssj.split('-')[0] === newYear.toString()) {
                  newYeararr.push({
                    time: d.month,
                    room: d.wzh,
                    address: d.csmc,
                    startroom: d.kssj,
                    endroom: d.jssj,
                    type: d.gjlx,
                    name: d.xm,
                    number: d.csbh,
                    jsddmc: d.jsddmc,
                    ksddmc: d.ksddmc,
                    show: true
                  })
                } else if (d.kssj.split('-')[0] === lastYear.toString()) {
                  lastYeararr.push({
                    time: d.month,
                    room: d.wzh,
                    address: d.csmc,
                    startroom: d.kssj,
                    endroom: d.jssj,
                    type: d.gjlx,
                    name: d.xm,
                    number: d.csbh,
                    jsddmc: d.jsddmc,
                    ksddmc: d.ksddmc,
                    show: true
                  })
                } else {
                  preYeararr.push({
                    time: d.month,
                    room: d.wzh,
                    address: d.csmc,
                    startroom: d.kssj,
                    endroom: d.jssj,
                    type: d.gjlx,
                    name: d.xm,
                    number: d.csbh,
                    jsddmc: d.jsddmc,
                    ksddmc: d.ksddmc,
                    show: true
                  })
                }
              })
              this.timeLine.push({
                type: true,
                year: newYear,
                detailed: newYeararr
              }, {
                type: false,
                year: lastYear,
                detailed: lastYeararr
              }, {
                type: false,
                year: preYear,
                detailed: preYeararr
              })
              console.log(this.timeLine, 'this.timeLine')
              // this.dossierLoading = false
            } else {
              // this.dossierLoading = false
            }
          })
        } else {
          this.$alert('时间范围不能为空', '温馨提示')
          return false
        }
      },
      removePerson(item) {
        arrayGetRid(this.personList, [item])
      },
      checkType(item) {
        this.filterLoading = true
        setTimeout(() => {
          item.checked = item.checked === false
        }, 300)
        this.timeLine.forEach(d => {
          d.detailed.forEach(c => {
            if (c.type === item.value) {
              c.show = !c.show
            }
          })
        })
        console.log(this.timeLine, 'this.timeLine')
      },
      searchPerson() {
        if (this.personNumber === '') {
          this.$alert('请输入证件号', '温馨提示');
          return false
        }
        this.dispatch(GET_PERSON_INFO_FROM_MAIN_DATA, {
          sfzh: this.personNumber
        }).then(() => {
          this.personList.push({
            idCard: this.baseData.personInfo.xp.SFZH,
            name: this.baseData.personInfo.xp.XM
          })
        })
        this.personNumber = ''
        this.dialogObjectSelector = false
      }
    },
    watch: {
      // personList(val) {
      //   if (val.length > 1) {
      //     let List = []
      //     List.push(val[0])
      //     this.personList = List
      //     this.showAddbutton = false
      //     this.$alert('分析对象只能为一个', '温馨提示')
      //   } else if (val.length === 1) {
      //     this.showAddbutton = false
      //   } else if (val.length === 0) {
      //     this.showAddbutton = true
      //   }
      // }
    },
    created() {
      // this.getDict(['XZQHDM']).then(res => {
      //   let resAreaTree = listToTree(res['XZQHDM'].map(r => { return { id: r.value, parentId: r.parentId, label: r.label } }), '', 0, {
      //     id: 'id',
      //     parentId: 'parentId',
      //     children: 'children'
      //   })
      //   this.areaTree = resAreaTree
      // })
      if (this.$route.query.id) {
        if (this.$route.query.id.indexOf(',')) {
          this.personList = (this.$route.query.id).split(',').map(d => {
            return {
              name: '',
              idCard: d
            }
          })
        } else {
          this.personList.push({
            name: '',
            idCard: this.$route.query.id
          })
        }
      }

      bus.$on('call:timeline-month', data => {
        let target = this.list.find(d => {
            let dateArr = d.kssj.split('-')
            if (dateArr[0] === data[0] && dateArr[1] === data[1]) {
              return true
            } else {
              return false
            }
          }),
          index = this.list.indexOf(target),
          $listBox = this.$('#timeLineListBox'),
          targetItemTop = index * 112 // $listBox.find('.list-box__item').eq(index).offset().top
        $listBox.animate({
          scrollTop: targetItemTop
        }, 300)
      })
    },
    updated() {
      this.$nextTick(() => {
        this.filterLoading = false
      })
    },
    mounted() {
      console.log(this.timeLine, 'thistimeLine')
    }
  }

</script>
