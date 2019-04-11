<template>
<div class="res-list">
  <div class="app-toolbar top-tool">
    <el-row>
      <el-col :span="12">
        <div class="tips-bar" v-if="showList===true">
          <!-- <el-checkbox v-model="checkAll" @change="checkAll">全选</el-checkbox> -->
          <span v-if="count>0">
            有信息:
            <span>{{count}}条</span>
          </span>
          <span v-if="count===0 && loading===false">
            <span>经分析, 此条件无相关结果, 请修改战法应用条件后重新启动战法.</span>
          </span>
        </div>
        <div class="tips-bar" v-else>
          <span>
            <span>请输入条件后启动战法</span>
          </span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="btn-box">
          <div v-if="showList===true" class="event-box">
            <!-- <el-button icon="icon iconfont icon-excel" @click="exportDialog=true">Excel导出</el-button> -->
            <el-button icon="icon iconfont icon-image" @click="exportSnapshot('tactics-result')">图片保存</el-button>
            <!-- <el-button icon="icon iconfont icon-link">关联</el-button> -->
            <!-- <el-button icon="icon iconfont icon-share">分享</el-button> -->
          </div>

          <!-- <el-button-group v-if="showList===true">
            <el-button type="" @click="listType=2" :class="{action:listType===2}" title="列表模式"><i class="iconfont icon-fold"></i></el-button>
            <el-button type="" @click="listType=1" :class="{action:listType===1}" title="紧凑模式"><i class="iconfont icon-card-list"></i></el-button>
          </el-button-group> -->

          <div class="search-menu-button" @click="switchToolbar">
            <i :class="{'organ-button':true,'el-icon-d-arrow-right':showRightbar===true,'el-icon-d-arrow-left':showRightbar===false}"></i>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>

  <div class="app-content" ref="tactics-result" id="tactics-result">
    <div v-if="showList===true" class="list-box">
      <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-if="tableList.length > 0" :show-header="listType===2" :data="tableList" :border="true" :height="'100%'">
        <!-- <el-table-column type="selection" :class-name="listType===1?'compact':''" label="选择"></el-table-column> -->
        <el-table-column v-if="listType===2" type="index" label="序号" width="80">
          <template scope="scope">{{scope.$index+(50 * 0)+1}}</template>
</el-table-column>
<!---->
<el-table-column v-if="listType===2" v-for="column in columns" :prop="column.prop" :label="column.label" :key="column.id">
  <template scope="scope">
            <span v-html="heightLightElms(scope.row[column.prop] ,heightLightKey)"></span>
          </template>
</el-table-column>

<el-table-column v-if="listType===2" label="操作" width="120">
  <template scope="scope">
            <!-- <el-tooltip :open-delay="500" placement="top" transition="none" content="分享"> -->
            <el-button type="text" size="small" @click="share(scope.row)" v-if="checkRule('Notice/AddShare',true)===true"><i class="iconfont icon-share" title="分享"></i></el-button>
<el-button v-if="scope.row['callsql'] && scope.row['callsql']!==null && scope.row['callsql']!==''" type="primary" class="btnf" size="small" @click='openDetails(scope.row)'><i class="iconfont icon-jia" title="详情"></i>详情</el-button>
            <!-- <el-tooltip :open-delay="500" placement="top" transition="none" content="导出数据"> -->
            <!-- <el-button type="text" size="small" @click="remove(scope.row)" title="删除"><i class="iconfont icon-trash"></i></el-button> -->
            <!-- </el-tooltip> -->
          </template>
</el-table-column>

<el-table-column v-if="listType===1" class-name="compact" label="内容集">
  <template scope="scope">
            <div class="compact__wrap compact__wrap--grid">
              <div class="compact__btn">
                <el-button v-if="scope.row['callsql'] && scope.row['callsql']!==null && scope.row['callsql']!==''" type="primary" class="btnf" size="small" @click='openDetails(scope.row)'><i class="iconfont icon-jia" title="详情"></i>详情</el-button>
              </div>
              <div class="compact__serial">
                <el-tag type="primary">{{scope.$index+(50 * 0)+1}}</el-tag>
                <!-- 采集时间: 2017-09-07 19:50 -->
                <!-- <el-tooltip :open-delay="500" placement="top" transition="none" content="分享"> -->
                <el-button type="text" size="small" @click="share(scope.row)"><i class="iconfont icon-share" title="分享"></i></el-button>
                <!-- </el-tooltip> -->

                <!-- <el-tooltip :open-delay="500" placement="top" transition="none" content="导出数据"> -->
                <!-- <el-button type="text" size="small" @click="remove(scope.row)" title="删除"><i class="iconfont icon-trash"></i></el-button> -->
                <!-- </el-tooltip> -->
              </div>
              <div class="compact__box">
                <div :class="{'compact__item':true,'compact__item--point':column.type!==null}" v-for="column in columns" :key="column.id" @click="colOnClickEvent(column.type,scope.row[column.prop],scope.row)">
                  <label class='colmu_label' v-html="column.label"></label>
                  <span class='colmu_span' v-html="heightLightElms(scope.row[column.prop]||'暂无', heightLightKey)"></span>
                </div>
              </div>
            </div>
          </template>
</el-table-column>
</el-table>
</div>
<html-to-image :height="snapshot.height" :printName="snapshot.name" :el="snapshot.el" :submit="snapshot.isTF" @generate="generateState"></html-to-image>
<div v-if="showList===true" class="app-toolbar tool-pagination">
  <el-row>
    <el-col :span="24">
      <pagination :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
    </el-col>
  </el-row>
</div>

<!-- 右侧栏 -->
<side-right-box style="padding:0 0 0 10px; top:0; height: calc(100% - 45px);" :unfoldHandle="showRightbar">
  <right-side @update:title="val=>this.$emit('update:title',val)"></right-side>
</side-right-box>
</div>

<div :class="{'el-loading-mask':true,'action':loading}">
  <div class="el-loading-spinner loader--circular"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div>
</div>
<dialog-export :dialog="exportDialog" @close="exportDialog=false"></dialog-export>
<dialog-people-info :dialog="peopleInfoDialog" :data="detail" @close="peopleInfoDialog=false" @call:dialog="openInfoDialog"></dialog-people-info>
<dialog-car-info :dialog="carInfoDialog" :data="detail" @close="carInfoDialog=false" @call:dialog="openInfoDialog"></dialog-car-info>
<dialog-mobile-info :dialog="mobileInfoDialog" :data="detail" @close="mobileInfoDialog=false" @call:dialog="openInfoDialog"></dialog-mobile-info>
<share-dialog :dialog="dialogShare" :content="shareContent" @close="dialogShare=false"></share-dialog>
<details-dialog :dialog="dialogDetails" @close="dialogDetails=false" :tableList="dialogList"> </details-dialog>
</div>
</template>
<style lang="scss" scoped>
  .tips-bar {
    span span {
      color: #ff6600;
    }
  }

  .res-list {
    height: calc(100vh - 40px);
    overflow: hidden;
    position: relative;
    .app-toolbar {
      position: relative;
      &.top-tool {
        padding: 8px 15px;
      }
      .btn-box {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        .el-button {
          color: #666;
          padding: 0 12px;
          border-radius: 2px;
          border-color: #e4e4e4;
          .iconfont {
            color: #53a9ff;
            margin-right: 8px;
          }
          &.action,
          &:hover {
            background: #73b8fd;
            color: #fff;
            .iconfont {
              color: #fff;
            }
          }
          &+& {
            margin-left: 10px;
          }
        }
        .event-box {
          display: inline-block;
          .el-button {
            border: 0;
            .iconfont {
              &.icon-excel {
                color: #6fb47b;
              }
              &.icon-image {
                color: #53a9ff;
              }
              &.icon-link {
                color: #e64b4b;
              }
              &.icon-share {
                color: #0096d5;
              }
            }
            &:hover {
              background: #f97136;
              color: #fff;
              .iconfont {
                color: #fff;
              }
            }
          }
        }
        .el-button-group {
          margin-left: 10px;
          .el-button {
            text-align: center;
            width: 36px;
            padding: 0;
            .iconfont {
              margin: 0;
            }
          }
        }
        .search-menu-button {
          border: 1px solid #D7D7D7;
          cursor: pointer;
          display: inline-block;
          i.search {
            padding-left: 10px;
            padding-right: 10px;
            color: #D7D7D7;
          }
          i.organ-button {
            background-color: #F2F2F2;
            color: #666;
            margin-top: 0;
            padding: 6px 5px;
          }
          &:hover {
            border-color: #6FB6EA;
          }
        }
      }
    }
    .app-content {
      background: url('/static/img/s_bg.jpg') no-repeat 30% 50%;
      height: 100%;
      position: relative;
      .list-box {
        height: calc(100% - 110px);
        padding: 10px;
        overflow: auto;
        .el-table {
          border: 1px solid #ccc;
        }
      }
    }
    .tool-pagination {
      padding: 0 15px;
    }
  }

  .el-loading-mask {
    display: none;
    &.action {
      display: block;
    }
  }

</style>

<script>
  import { mapState } from 'vuex'
  import { FETCH_TACTICS_RESULT } from '../../../store/types'

  import mixin from '../../../utils/mixin'
  import infoDialogEvents from '../../../utils/infoDialogEvents'

  import { clone, arrayGetRid, outerHeight } from '../../../utils/util'
  import columnsMap from '../../../utils/columnsMap'

  import sideRightBox from '../../control/side-right-box.vue'
  import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'
  import shareDialog from '../../../widgets/share-dialog/share-dialog.vue'
  import rightSide from '../apply/rightSide'

  import dialogExport from '../../search/dialog-export'
  import dialogInfo from '../../../widgets/info-dialog/info-dialog'
  import pagination from '../../../widgets/pagination/pagination'
  import detailsDialog from './dialog-details.vue'
  import htmlToImage from '../../../widgets/html-image/html-to-image.vue'
  export default {
    mixins: [mixin, infoDialogEvents],
    components: {
      shareDialog,
      pagination,
      detailsDialog,
      'right-side': rightSide,
      'side-right-box': sideRightBox,
      'right-toolbar': rightToolbar,
      'dialog-export': dialogExport,
      'dialog-people-info': dialogInfo,
      'dialog-car-info': dialogInfo,
      'dialog-mobile-info': dialogInfo,
      htmlToImage
    },
    data() {
      return {
        snapshot: { // 研判报告快照参数初始化
          isTF: false,
          name: '研判报告',
          height: 0,
          el: document.body
        },
        dialogDetails: false,
        dialogShare: false,
        shareContent: {
          text: '',
          value: null
        },
        showList: false,
        keyword: '',
        heightLightKey: '',
        detail: {
          id: 1,
          city: '长沙',
          name: '李明钟',
          idCard: '440104198005065314',
          mobile: '13585466875',
          sex: '男',
          birthday: '1980-05-06',
          nation: '汉',
          // native: '湖南省怀化市鹤城区',
          // residence: '湖南省怀化市鹤城区',
          domicile: '湖南省怀化市鹤城区坨院街道',
          plateNo: '湘N A56R7',
          service: '不详'
        },
        exportDialog: false,
        showRightbar: false,
        listType: 2,
        tableList: [],
        dialogList: [],
        count: 0,
        pagenav: { limit: 20, currentpage: 1 },
        columns: []
      }
    },
    props: ['query'],
    computed: {
      ...mapState(['tactics'])
    },
    watch: {
      query() {
        this.count = 0
        if (this.pagenav.currentpage === 1) {
          this.fetchList()
        } else {
          this.pagenav.currentpage = 1
        }
      },
      pagenav: {
        handler() {
          this.fetchList()
        },
        deep: true
      }
    },
    methods: {
      exportSnapshot(r) {
        this.$nextTick(() => {
          let _tDom = this.$('#' + r).clone().appendTo(document.body)
          if (_tDom) {
            _tDom.css('width', this.$('#' + r).width());
            this.snapshot.height = outerHeight(_tDom[0])
            this.snapshot.el = _tDom[0]
            this.$nextTick(_ => {
              this.snapshot.isTF = true
            })
          }
        })
      },
      generateState(type) {
        this.caseChartImgShow = false;
        // 快照生成结束,状态重置
        this.snapshot.isTF = false
        setTimeout(() => {
          this.$(this.snapshot.el).remove();
        }, 500)
      },
      fetchList() {
        if (this.checkRule('zfsc/library/qdzf') === true) {
          let query = clone(this.query)
          query.PageIndex = this.pagenav.currentpage
          query.PageSize = this.pagenav.limit
          query.zfid = this.$route.query.id
          this.dispatch(FETCH_TACTICS_RESULT, query).then(() => {
            let firstItem = this.tactics.result.PageDate[0],
              columns = []
            for (let item in firstItem) {
              if (item.indexOf('sql') === -1) {
                columns.push({
                  label: columnsMap[item] || item,
                  prop: item,
                  type: null
                })
              }
            }
            this.columns = columns
            this.count = this.tactics.result.DataCount
            this.tableList = this.tactics.result.PageDate
          })
        }
      },
      openDetails(val) {
        this.dialogList = val
        this.dialogDetails = true
      },
      checkAll() {},
      share(item) {
        let content = ''
        this.columns.forEach(column => {
          content += `${column.label}: ${item[column.prop]} `
        })
        this.shareContent.value = item
        this.shareContent.text = content
        this.dialogShare = true
      },
      remove(item) {
        this.$confirm('确定要删除此内容?', '温馨提示', {
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功',
            showClose: true
          })
          arrayGetRid(this.tableList, [item])
        })
      },
      switchToolbar() {
        this.showRightbar = this.showRightbar === false
      }
    },
    created() {},
    mounted() {
      this.showRightbar = true
    }
  }

</script>
