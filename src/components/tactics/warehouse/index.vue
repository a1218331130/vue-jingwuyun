<!-- 战法仓库 -->
<template>
<div slot="center" class="tactics-box" v-loading.body="loading">

 <!-- <!-- <el-button v-popover:popover1>popover test1</el-button> -->
 <!-- <el-button v-popover:popover1>popover test2</el-button> -->
  <div class="app-toolbar">
    <el-row>
      <el-col :span="12">
        战法:
        <font color="#ff6600">{{this.count}}条</font>
      </el-col>
      <el-col :span="12" class="text-right">
        <!-- <div class="ware-button-box">
            <el-button-group>
              <el-button class="iconfont icon-fold" @click="switchRightBar">
              </el-button>
            </el-button-group>
          </div> -->

        <el-button-group>
          <el-button title="卡片模式" @click="listType=2" :class="{action:listType===2}"><i class="iconfont icon-card-list"></i></el-button>
          <el-button title="列表模式" @click="listType=1" :class="{action:listType===1}"><i class="iconfont icon-fold"></i></el-button>
        </el-button-group>
        <span title="筛选条件" class="iconfont icon-fold" style="float: right; padding: 6px 0 7px 15px; cursor: pointer;" @click="switchRightBar"></span>
      </el-col>
    </el-row>
  </div>
  <el-row id="tacticsListBox" class="ware-list-wrap" :style="listType===1?'padding:0;':''">
    <!-- v-for="cat in list" :key="cat.id" -->

    <el-table v-show="listType===1" @cell-mouse-enter="cellMouseEnter" border :data="list" :height="tableHeight">
      <el-table-column type="index" label="序号" align="center" width="60">
        <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
</el-table-column>
<el-table-column label="标题" prop="title"></el-table-column>
<el-table-column label="分类" prop="tag" width="80"></el-table-column>
<!-- <el-table-column label="简介" prop="desc"></el-table-column> -->
<el-table-column label="使用次数" prop="count" align="center" width="80"></el-table-column>
<el-table-column label="创建者" prop="author" align="center" width="80"></el-table-column>
<el-table-column label="创建时间" prop="postTime" align="center" width="180"></el-table-column>
<el-table-column label="创建单位" prop="org" align="center" width="200"></el-table-column>
<el-table-column label="统计" align="center" width="180">
  <template scope="scope">
            <div class="ware-list__item__interactive" style="text-align:center; width:auto; ">
    <el-card v-loading="tacticsInfoLoading" :class="{'list1-card':true,'bottom':scope.$index>=15}" v-show="popoverShow1===scope.row.id">
      <div class="body-text" v-if="tacticsDataInfoArr.length != 0">
        <div class="text" v-for="(data,i) in tacticsDataInfoArr" :key="i">
          数据来源: {{data.TABLENAME}} </br>
          数量: {{data.COUNT}} </br>
          最后更新时间: {{data.LASTUPDATETIME}}
        </div>
      </div>
      <div class="text" v-else>暂无信息</div>
    </el-card>
    <em class="cursor--pointer" @click="praiseCollection(scope.row.id, (scope.row.isPraise===false ? 1 : 2), 2)">
                  点赞(<span>{{scope.row.praiseCount}}</span>)
                </em>
    <em class="cursor--pointer" @click="praiseCollection(scope.row.id, (scope.row.isCollection===false ? 1 : 2), 1)">
                  收藏(<span>{{scope.row.collectionCount}}</span>)
                </em> 评论(
              <span>{{scope.row.commentCount}}</span>)
            <i class="el-icon-info"
            @mouseenter="listMouseOver(scope.row,1)"
            @mouseleave="listMouseLeave(1)"
            >其他</i>
            </div>
          </template>
</el-table-column>
<el-table-column label="启动" align="center" width="80">
  <template scope="scope">
          <el-button class="orange" @click="jumpTo(scope.row.newType===true?`/tactics/apply-new?id=${scope.row.id}`:`/tactics/apply?id=${scope.row.id}`,true,'zfsc/library/zfyytj')">
            <i class="iconfont icon-qidong"></i> 启动
          </el-button>
        </template>
</el-table-column>
</el-table>

<el-col v-show="listType===2" class="ware-list" :span="24">
  <!-- <div class="ware-list__title" v-show="type!==1">
          <div class="ware-list__title__text">{{(type===2?cat.name:cat.cat)}}</div>
          <div class="ware-list__title__count">{{cat.count}}条</div>
        </div> -->


  <el-collapse v-model="activeName">
    <el-collapse-item :name='items.title' :title="items.title" v-for="(items,idx) in listColl" v-if="items.title" :key="idx">
      <template slot="title">
            <span style="font-size:16px;font-weight:900">{{items.title}}</span>
            <span style=" color:#ff6c00;margin-left:15px;">({{items.count}})</span>
          </template>
      <el-row :gutter="20">
        <el-col :span="miniModel===true?8:6" v-for="(item, idy) in items.data" :key="idy" style="position:relative;">
          <el-card v-loading="tacticsInfoLoading" class="list2-card" v-show="popoverShow2===item.ID">
            <div class="body-text" v-if="tacticsDataInfoArr.length != 0">
              <div class="text" v-for="(data,i) in tacticsDataInfoArr" :key="i">
                数据来源: {{data.TABLENAME}} </br>
                数量: {{data.COUNT}} </br>
                最后更新时间: {{data.LASTUPDATETIME}}
              </div>
            </div>
            <div class="text" v-else>暂无信息</div>
          </el-card>
          <div class="ware-list__item " @mouseenter="listMouseOver(item,2)" @mouseleave="listMouseLeave(2)">
            <div class="ware-list__item__tag ">{{item.listColl.tag}}</div>
            <el-row :gutter="10 ">
              <el-col :span="7 ">
                <div class="ware-list__item__image ">
                  <img :src=" '/static/img/res/'+item.listColl.icon " />
                </div>
              </el-col>
              <el-col :span="17 ">
                <div class="ware-list__item__title ">
                  {{item.listColl.title}}
                </div>
                <div class="ware-list__item__desc ">
                  {{item.listColl.desc}}
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="10 ">
                <div class="ware-list__item__count ">
                  使用次数: {{item.listColl.count}}
                </div>
              </el-col>
              <el-col :span="14 ">
                <div class="ware-list__item__interactive ">
                  <el-row>
                    <el-col :span="8 ">
                      点赞(
                      <span>{{item.listColl.praiseCount}}</span>)
                    </el-col>
                    <el-col :span="8 ">
                      收藏(
                      <span>{{item.listColl.collectionCount}}</span>)
                    </el-col>
                    <el-col :span="8 ">
                      评论(
                      <span>{{item.listColl.commentCount}}</span>)
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>

            <div class="ware-list__item__meta ">
              <div class="ware-list__item__meta__author ">
                创建者: {{item.listColl.author}}
              </div>
              <div class="ware-list__item__meta__post-time ">
                时间: {{item.listColl.postTime}}
              </div>
              <div class="ware-list__item__meta__org ">
                创建单位: {{item.listColl.org}}
              </div>
            </div>

            <div class="ware-list__item__ctrl ">
              <el-row>
                <el-col :span="12 ">
                  <el-button class="orange " @click="jumpTo(item.listColl.newType===true?`/tactics/apply-new?id=${item.listColl.id}`:`/tactics/apply?id=${item.listColl.id}`,true, 'zfsc/library/zfyytj') ">
                    <i class="iconfont icon-qidong "></i> 启动
                  </el-button>
                </el-col>
                <el-col :span="12 " class="text-right ">
                  <el-button :class="{orange:item.listColl.isPraise===true,gray:item.listColl.isPraise===false} " @click="praiseCollection(item.listColl.id, (item.listColl.isPraise===false ? 1 : 2), 2) "><i class="iconfont icon-praise_fill "></i></el-button>
                  <el-button :class="{blue:item.listColl.isCollection===true,gray:item.listColl.isCollection===false} " @click="praiseCollection(item.listColl.id, (item.listColl.isCollection===false ? 1 : 2), 1) "><i class="iconfont icon-shoucang "></i></el-button>
                </el-col>
              </el-row>
            </div>
          </div>

        </el-col>
      </el-row>
    </el-collapse-item>

  </el-collapse>
</el-col>
</el-row>

<div class="app-toolbar " v-show="listType===1 ">
  <pagination :count="count " :pagenav="pagenav " @update:pagenav="val=>pagenav=val"></pagination>
</div>

<!-- 右侧栏 -->
<side-right-box style="height:calc(100% - 80px); top:54px;" :unfoldHandle="showRightBar">
  <right-toolbar title="查询列表" :params="filter" :options="filterOptions" @packup="this.showRightBar = false" @update:params="searchSubmit"></right-toolbar>
</side-right-box>
</div>
</template>
<style lang="scss" scoped>
  .el-button-group {
    .el-button {
      &.action,
      &:hover {
        background-color: #53a9ff;
        color: #ffffff;
      }
    }
  }

</style>
<style lang="scss">
  .tactics-box .el-collapse-item .el-collapse-item__header {
    border-bottom: 2px solid #ccc;
    border-left: 5px solid #ff9900;
    box-shadow: 0px 5px 3px rgba(0, 0, 0, .1);
  }

  .tactics-box .el-collapse-item.is-active .el-collapse-item__header {
    background: #f0f0f0;
  }

  .tactics-box .el-collapse-item:nth-child(2) .el-collapse-item__header {
    border-left: 5px solid #67c1b9
  }

  .tactics-box .el-collapse-item:nth-child(3) .el-collapse-item__header {
    border-left: 5px solid #7cbae8
  }

  .tactics-box .el-collapse-item:nth-child(4) .el-collapse-item__header {
    border-left: 5px solid #E48A8F
  }

  .tactics-box .el-collapse-item:nth-child(5) .el-collapse-item__header {
    border-left: 5px solid #ff9900
  }

  .tactics-box .el-collapse-item__header:nth-child(6) {
    border-left: 5px solid #C0AEE4
  }

  .tactics-box .ware-list__item,
  .el-collapse-item__wrap {
    overflow: visible;
  }

  .el-card {
    box-shadow: none;
  }

  .body-text div {
    font-size: 14px;
    border-bottom: 1px solid #ccc;
  }

  .body-text div:nth-last-child(1) {
    border-bottom: none;
  }

  .list2-card {
    min-height: 100px;
    position: absolute;
    top: 170px;
    left: 10px;
    width: calc(100% - 20px);
    z-index: 99;
  }

  .list1-card {
    min-height: 100px;
    position: absolute;
    top: 20px;
    right: 60px;
    text-align: left;
    width: calc(100% + 150px);
    z-index: 999;
    &.bottom {
      top: initial;
      bottom: 20px;
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { FETCH_TACTICS_LIST, TACTICS_PRAISE_COLLECTION, ZFSC_TYPELIST, FETCH_TACTICS_DATA_INFO } from '../../../store/types'

  import mixin from '../../../utils/mixin'

  import { fitSize } from '../../../utils/util'

  import pagination from '../../../widgets/pagination/pagination'

  import sideRightBox from '../../control/side-right-box.vue'
  import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'

  export default {
    mixins: [mixin],
    components: {
      pagination,
      'side-right-box': sideRightBox,
      'right-toolbar': rightToolbar
    },
    data() {
      return {
        // popoverList2: {},
        tacticsInfoLoading: false,
        tacticsDataInfo: {},
        tacticsDataInfoArr: [],
        popoverShow1: '',
        popoverShow2: '',
        activeName: [],
        type: 1,
        showRightBar: false,
        miniModel: false,
        dictList: [],
        listType: 2,
        tableHeight: 0,
        count: 0,
        pagenav: { currentpage: 1, limit: 20 },
        filter: {
          keyword: '',
          cat: '',
          type: '',
          date: '',
          sort: '',
          daterange: ''
        },
        start_time: '',
        end_time: '',
        filterOptions: [{
          title: '关键字',
          prop: 'keyword',
          type: 'input'
        }, {
          title: '分类',
          prop: 'cat',
          type: 'radio',
          children: ''
        }, {
          title: '中心',
          prop: 'type',
          type: 'radio',
          children: ''
        }, {
          title: '创建时间',
          prop: 'daterange',
          type: 'daterange'
        }, {
          title: '排序',
          prop: 'sort',
          type: 'radio',
          children: [
            { label: '次数升序', value: '1' },
            { label: '次数降序', value: '2' },
            { label: '日期升序', value: '3' },
            { label: '日期降序', value: '4' }
          ]
        }],
        list: [],
        listColl: []
      }
    },
    computed: {
      ...mapState(['tactics'])
    },
    watch: {
      type() {

      },
      pagenav: {
        handler() {
          if (this.loading === false) {
            this.fetchList()
          }
        },
        deep: true
      }
    },
    methods: {
      listMouseOver(item, listType) {
        this.tacticsDataInfoArr = [];
        console.log(item)
        let itemID = item[{ 1: 'id', 2: 'ID' }[listType]];
        this['popoverShow' + listType] = itemID;
        this.tacticsInfoLoading = true;
        if (this.tacticsDataInfo[itemID]) {
          this.tacticsDataInfoArr = this.tacticsDataInfo[itemID]
          this.tacticsInfoLoading = false;
        } else {
          if (this.checkRule('zfsc/library/dataInfo') === true) {
            this.tacticsInfoLoading = true;
            this.dispatch(FETCH_TACTICS_DATA_INFO, { zfid: itemID }, null, true).then(() => {
              this.tacticsDataInfoArr = this.tactics.dataInfo;
              this.tacticsDataInfo[itemID] = this.tactics.dataInfo;
              this.tacticsInfoLoading = false;
            })
          }
        }
      },
      listMouseLeave(listType) {
        this['popoverShow' + listType] = '';
      },
      reload() {
        this.fetchListcoll()
        if (this.pagenav.currentpage === 1) {
          this.fetchList()
        } else {
          this.pagenav.currentpage = 1
        }
      },
      fetchListcoll() {
        if (this.checkRule('zfsc/library/getzflist') === true) {
          this.dispatch(ZFSC_TYPELIST, {
            keyword: this.filter.keyword,
            zflx: this.filter.cat, // 战法类型
            type: this.filter.type, // 警种
            starttime: this.start_time, // 开始时间
            endtime: this.end_time, // 结束时间
            // date: this.filter.date, // 生成日
            sort: this.filter.sort // 排序（1：次数升序；2：次数降序；3：日期升序；4：日期降序）
          }).then(() => {
            this.listColl = this.tactics.zfscTypelist
            // console.log(this.list)
            this.listColl.forEach((a, idx) => {
              this.activeName.push(a.title)
              if (a.data) {
                a.data.forEach((d, i) => {
                  // 控制popover显示与隐藏
                  // this.popoverList2['popover_' + idx + '_' + i] = false;
                  d.listColl = {
                    id: d.id || d.ID,
                    icon: d.tbm || d.TBM,
                    title: d.zfbt || d.ZFBT || d.zfmc || d.ZFMC || '暂无',
                    desc: d.zfgy || d.ZFGY,
                    img: (i < 10 ? '0' + (i + 1) : (i + 1)),
                    tag: d.zfflmc || d.ZFFLMC || '暂无',
                    count: d.sycs || d.SYCS,
                    author: d.cjr || d.CJR,
                    org: d.dwmc || d.DWMC,
                    postTime: d.xgsj || d.XGSJ,
                    type: d.SSLX,
                    collectionCount: d.sccs || d.SCCS || 0,
                    praiseCount: d.dzcs || d.DZCS || 0,
                    commentCount: d.plcs || d.PLCS || 0,
                    isPraise: d.dzStatus ? d.dzStatus === '1' : d.DZSTATUS === '1',
                    isCollection: d.scStatus ? d.scStatus === '1' : d.SCSTATUS === '1',
                    newType: d.xslx === 'LB' || d.XSLX === 'LB',
                    zftype: d.ZFLX,
                    zftypename: d.ZFFLMC
                  }
                })
              }
            })
            if (this.tactics.list) this.count = this.tactics.list.DataCount
          })
        }
      },
      fetchList() {
        if (this.checkRule('zfsc/library/getzflist') === true) {
          this.dispatch(FETCH_TACTICS_LIST, {
            keyword: this.filter.keyword,
            zflx: this.filter.cat, // 战法类型
            type: this.filter.type, // 警种
            starttime: this.start_time, // 开始时间
            endtime: this.end_time, // 结束时间
            // date: this.filter.date, // 生成日
            sort: this.filter.sort, // 排序（1：次数升序；2：次数降序；3：日期升序；4：日期降序）
            PageIndex: this.pagenav.currentpage,
            PageSize: this.pagenav.limit
          }).then(() => {
            this.list = this.tactics.list.PageData.map((d, i) => {
              return {
                id: d.id || d.ID,
                icon: d.tbm || d.TBM,
                title: d.zfbt || d.ZFBT || d.zfmc || d.ZFMC || '暂无',
                desc: d.zfgy || d.ZFGY,
                img: (i < 10 ? '0' + (i + 1) : (i + 1)),
                tag: d.zfflmc || d.ZFFLMC || '暂无',
                count: d.sycs || d.SYCS,
                author: d.cjr || d.CJR,
                org: d.dwmc || d.DWMC,
                postTime: d.xgsj || d.XGSJ,
                type: d.SSLX,
                collectionCount: d.sccs || d.SCCS,
                praiseCount: d.dzcs || d.DZCS,
                commentCount: d.plcs || d.PLCS,
                isPraise: d.dzStatus ? d.dzStatus === '1' : d.DZSTATUS === '1',
                isCollection: d.scStatus ? d.scStatus === '1' : d.SCSTATUS === '1',
                newType: d.xslx === 'LB' || d.XSLX === 'LB',
                zftype: d.ZFLX,
                zftypename: d.ZFFLMC
              }
            })
            if (this.tactics.list) this.count = this.tactics.list.DataCount
          })
        }
      },
      searchSubmit(obj) {
        // 提交条件筛选
        this.filter = obj
        // this.filter.cat = this.filter.cat.join(',')
        let daterange = obj.daterange
        if (daterange !== '' && daterange[0] != null) {
          this.start_time = this.dateFormat(new Date(daterange[0]), 'yyyyMMdd');
          this.end_time = this.dateFormat(new Date(daterange[1]), 'yyyyMMdd');
        }
        this.reload()
        this.showRightBar = false
      },
      switchRightBar() {
        this.showRightBar = this.showRightBar === false
      },
      praiseCollection(id, flag, type) {
        if (this.checkRule('zfsc/dzsc/handle') === true) {
          this.dispatch(TACTICS_PRAISE_COLLECTION, {
            zfid: id, // 战法id
            flag: flag, // 标识操作是添加或取消(1:添加 2:取消)
            type: type // 类型(1:收藏 2:点赞)
          }).then(() => {
            this.fetchList()
            this.fetchListcoll()
            this.$emit('updateList')
            // alert(321)
          })
        }
      },
      fitEvent() {
        let res = fitSize(1380)
        this.miniModel = res.mini
        this.tableHeight = this.$('#tacticsListBox').height()
      }
    },
    created() {
      this.getDict(['JZLX', 'ZFKLB'], false).then((res) => {
        this.dictList = res
        this.filterOptions.find(c => c.prop === 'type').children = res.find(c => c.type === 'JZLX').children
        this.filterOptions.find(c => c.prop === 'cat').children = res.find(c => c.type === 'ZFKLB').children
      })
    },
    mounted() {
      this.fetchList()
      this.fetchListcoll()
      this.fitEvent()
      window.addEventListener('resize', (e) => {
        this.fitEvent()
      })
    }
  }

</script>
