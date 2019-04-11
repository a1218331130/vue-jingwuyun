<template>
<div class="app-box-wrap">
  <div class="app-box">
    <!-- 列表 -->
    <el-table class="app-table table-judge" @cell-mouse-enter="cellMouseEnter" :show-header="listType===2" :height="tableHeight" v-loading.body="loading" :data="list" :border="true" style="margin-bottom:0;">
      <el-table-column v-if="listType===2" align="center" width="50px" type="index" label="序号"></el-table-column>
      <el-table-column v-if="listType===2" prop="number" width="220px" label="案件编号"></el-table-column>
      <el-table-column v-if="listType===2" prop="name" label="案件名称"></el-table-column>
      <el-table-column v-if="listType===2" prop="unit" label="受理单位"></el-table-column>
      <el-table-column v-if="listType===2" prop="typeText" width="200px" label="报案类别"></el-table-column>
      <el-table-column v-if="listType===2" prop="stateText" align="center" label="案件状态"></el-table-column>
      <el-table-column v-if="listType===2" prop="meansText" label="作案特点"></el-table-column>
      <el-table-column v-if="listType===2" prop="area" label="发案地点"></el-table-column>
      <el-table-column v-if="listType===2" prop="peopleNumber" align="center" width="80px" label="涉案人数"></el-table-column>
      <el-table-column v-if="listType===2" prop="facts" label="简要案情"></el-table-column>
      <el-table-column v-if="listType===3" prop="userId" label="创建人ID"></el-table-column>
<!-- 内容列表 -->
<el-table-column class-name="compact" label="内容集" v-if="listType===1">
  <template scope="scope">
          <ul class="checked-select-list">
            <li>
              <!-- 多选框 -->
              <!--<el-checkbox :label="i" :key="k">&nbsp;</el-checkbox>-->
              <!-- 信息 -->


              <div class="list-info-box_div">
                <el-row :gutter="0">
                  <el-tag type="primary" style="min-width: 25px;text-align: center;position: absolute;left: -30px;">{{scope.$index + 1}}</el-tag>
                  <el-col :span="24">
                    <el-row>
                      <el-col :span="24" class="name-box_elcol">
                        <div class="user-info-box_elrow">
                          <label>案件编号:</label>
                          <span class="ID-card-text_span cursor--pointer" v-if="checkRule('ajgl/lawcase/info',true)" @click="handleStudyCaseTo(scope.row.id,scope.row.userId)">{{scope.row.number}}</span>
                          <span class="ID-card-text_span cursor--pointer" v-if="!checkRule('ajgl/lawcase/info',true)">{{scope.row.number}}</span>
                          <label style="margin-left: 10px">案件名称:</label>
                          <span style="font-weight: bold;">{{scope.row.name}}</span>
                          <label style="margin-left: 10px">来源:</label>
                          <span style="font-weight: bold;">{{scope.row.sourceText}}</span>
                          <!--<span class="people-label">{{scope.row.stateText}}</span>-->
                          <!--<span class="info-source">来源：{{scope.row.sourceText}}</span>-->
                        </div>
                        <span style="float: right">
                          <el-button class="import-btn" @click="handleStudyCaseTo(scope.row.id,scope.row.userId)" v-if="checkRule('ajgl/lawcase/infolb',true)"><i class="iconfont icon-browse"></i>&nbsp;研判
                          </el-button>
                          <el-button class="import-btn delete" @click="remove(scope.row.id,scope.$index)" v-if="checkRule('ajgl/lawcase/delete',true)"><i class="iconfont icon-trash"></i>&nbsp;删除
                          </el-button>
                        </span>
                      </el-col>
                      <el-col :span="24" class="name-box_elcol">
                        <div class="user-info-box_elrow">
                          <label>案件状态:</label>
                          <span>{{scope.row.stateText}}</span>
                        </div>
                        <div class="user-info-box_elrow">
                          <label>报案类别:</label>
                          <span>{{scope.row.typeText}}</span>
                        </div>
                        <div class="user-info-box_elrow">
                          <label>作案特点:</label>
                          <span>{{scope.row.meansText}}</span>
                        </div>
                        <div class="user-info-box_elrow">
                          <label>作案时间上限:</label>
                          <span>{{scope.row.startTime}}</span>
                        </div>
                        <div class="user-info-box_elrow">
                          <label>作案时间下限:</label>
                          <span>{{scope.row.endTime}}</span>
                        </div>
                        <div class="user-info-box_elrow">
                          <label>主办人:</label>
                          <span>{{scope.row.bary}}</span>
                        </div>
                        <div class="user-info-box_elrow">
                          <label>创建人:</label>
                          <span>{{scope.row.user}}</span>
                        </div>
                        <div class="user-info-box_elrow">
                          <label>受理单位:</label>
                          <span>{{scope.row.unit}}</span>
                        </div>
                        <div class="user-info-box_elrow">
                          <label>涉案人数:</label>
                          <span>{{scope.row.caseSum}}</span>
                        </div>
                        <div class="user-info-box_elrow">
                          <label>发案地点:</label>
                          <span>{{scope.row.area}}</span>
                        </div>
                      </el-col>
                      <el-col :span="24" class="name-box_elcol">
                        <div class="user-info-box_elrow" style="width: calc(100%)">
                          <label style="width: 60px">简要案情:</label>
                          <span style="width: calc(100% - 100px);min-width: 750px;">{{scope.row.facts}}</span>
                        </div>
                      </el-col>
                      <el-col :span="24" class="name-box_elcol" v-if="scope.row.isEndCase !== '0'">
                        <div class="user-info-box_elrow">
                          <label style="width: 60px">结案描述:</label>
                          <span style="width: calc(100% - 100px);min-width: 750px;">{{scope.row.jams}}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </li>

          </ul>
        </template>
</el-table-column>
      <el-table-column v-if="listType===2" prop="id" width="80px" label="操作" align="center">
        <template scope="scope">
          <el-button type="text" size="small" @click="handleStudyCaseTo(scope.row.id,scope.row.userId)" v-if="checkRule('ajgl/lawcase/info',true)">
            <i class="iconfont icon-iconfontsousuo1" title="研判"></i>
          </el-button>

          <el-button type="text" size="small" @click="remove(scope.row.id,scope.$index)" v-if="checkRule('ajgl/lawcase/delete',true)">
            <i class="iconfont icon-trash" title="删除"></i>
          </el-button>
        </template>
</el-table-column>
</el-table>
</div>
<div class="app-toolbar footer">
  <pagination :count="pageInfo.count" :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}" @update:pagenav="pagenavChange"></pagination>
</div>
</div>
</template>
<style lang="scss" scoped>
  .app-box-wrap {
    height: 100%;
    overflow: hidden;
  }

  .peoplel {
    font-size: 12px;
    background-color: #FFC323;
    color: #fff;
    padding: 0 6px;
    border-radius: 3px;
    margin-left: 2px;
  }

  .compact {
    position: fixed;
    &__wrap {
      white-space: normal;
      padding: 15px 0;
      display: flex;
    }
    &__serial {
      line-height: 40px;
      width: 70px;
    }
    &__box {
      text-align: left;
      line-height: 16px;
    }
    &__title {
      color: #fd6533;
      display: block;
    }
    &__item {
      color: #333;
      margin-right: 15px;
      display: inline;
      label {
        color: #656565;
        &:after {
          content: ':';
        }
      }
      &--point {
        @extend .compact__item;
        color: #1e8ffd;
        cursor: pointer;
        &:hover {
          opacity: 0.9;
        }
      }
    }
  }

  .import-btn {
    border-radius: 3px;
    border: none;
    padding: 4px 10px;
    color: #ffffff;
    background-color: #6FB6EA;
    &.delete {
      background-color: #ffffff;
      color: #666;
      i {
        color: #6FB6EA;
        font-size: 23px;
      }
    }
  }

  .tool-box {
    text-align: right;
    background-color: red;
  }

  .app-table {
    margin-top: 10px;
  }

  .detail-box {
    height: 100%;
    background-color: #ffffff;
    .detail-box__title {
      font-size: 20px;
      margin-top: 10px;
      color: #333333;
      height: 50px;
      line-height: 50px;
    }
    .detail-box__time {
      height: 30px;
      line-height: 30px;
    }
    .detail-box-content {
      height: calc(100% - 285px);
      text-indent: 2rem;
      margin-top: 20px;
      padding: 0 50px 20px;
      line-height: 25px;
      overflow: scroll;
      border-bottom: 1px solid #cccccc;
    }
    .detail-box-content__return {
      position: absolute;
      bottom: 10px;
      left: 100px;
    }
    .enclosure-box {
      height: 155px;
      width: 100%;
      position: absolute;
      bottom: 0;
      .enclosure-box__title {
        margin-top: 10px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        background-color: #ebebeb;
        .iconfont {
          font-size: 16px;
          margin-left: 10px;
        }
      }
      .enclosure-box__content {
        background-color: red;
        .enclosure-list {
          position: relative;
          margin: 10px 0 0 25px;
          img {
            position: absolute;
            top: 30px;
            left: 0;
          }
          .info-box {
            position: absolute;
            left: 45px;
            top: 0;
            p {
              height: 14px;
              line-height: 14px;
            }
          }
        }
      }
    }
  }

  .checked-select-list {
    padding: 0;
    list-style: none;
    background-color: #fff;
    margin: 0;
    >li {
      overflow: hidden;
      border-bottom: none;
      &:last-child {}
      >.el-checkbox {
        padding: 15px 2px 15px 10px;
        float: left;
      }
      >.list-info-box_div {
        float: left;
        padding: 15px 10px 12px 30px;
        width: calc(100% - 62px);
        .list-info-user-img_div {
          border: 1px solid #eaeaea;
          width: calc(100% - 8px);
          padding: 3px;
          background-color: #f1f1f1;
          position: relative;
          >img {
            width: 100%;
            min-height: 100%;
          }
          >.people-tag {
            position: absolute;
            background-color: #cd2941;
            padding: 0 10px;
            color: #fff;
            top: 0;
            left: 0;
            font-size: 12px;
            line-height: 18px;
          }
        }
        .people-button_div {
          background-color: rgba(84, 168, 231, 0.8);
          color: #fff;
          width: 100%;
          margin: 5px auto;
          line-height: 24px;
          font-size: 12px;
          text-align: center;
          border-radius: 2px;
          cursor: pointer;
          &:hover {
            background-color: #54A8E7;
          }
        }
        .name-box_elcol {
          margin-bottom: 5px;
          .name-text {
            color: #1e1e1e;
            font-size: 16px;
            font-weight: bold;
          }
          .people-label {
            font-size: 12px;
            background-color: #FFC323;
            color: #fff;
            padding: 0 6px;
            border-radius: 3px;
            margin: 0 10px;
          }
          .info-source {
            font-size: 12px;
            margin-left: 2px;
          }
        }
        .info-list-handle_dl {
          display: none;
          float: right;
          margin-top: -10px;
          margin-right: -17px;
          font-size: 12px;
          >dd {
            float: left;
            height: 24px;
            line-height: 24px;
            padding: 0 10px;
            background-color: #fff;
            cursor: pointer;
            margin-left: 0;
            margin-right: 5px;
            >i {
              margin-right: 2px;
            }
            &:hover {
              background-color: #6FB6EA;
              color: #fff;
            }
          }
          >dd.color-orange {
            >i.iconfont {
              color: #F97136;
            }
            &:hover {
              background-color: rgba(249, 113, 54, 0.6);
            }
          }
          >dd.color-blue {
            >i.iconfont {
              color: #1296DB;
            }
            &:hover {
              background-color: rgba(18, 150, 219, 0.6);
            }
          }
          >dd.color-green {
            >i.iconfont {
              color: #39D293;
            }
            &:hover {
              background-color: rgba(57, 210, 147, 0.6);
            }
          }
        }
        .user-info-box_elrow {
          >.el-col {
            margin: 2px auto;
            >label {
              float: left;
              color: #a6a6a6;
              margin-right: 10px;
            }
            >span {
              float: left;
              color: #333;
              font-weight: 400;
            }
            >span.ID-card-text_span {
              color: #54A8E7;
            }
          }
        }
        .user-info-box_elrow {
          padding-right: 30px;
          overflow: hidden;
          float: left;
          line-height: 26px;
          white-space: initial;
          text-align: left;
          >label {
            float: left;
            color: #a6a6a6;
            margin-right: 10px;
          }
          >span {
            float: left;
            color: #333;
            font-weight: 400;
          }
          >span.ID-card-text_span {
            color: #54A8E7;
          }
          >span.label-box-list_dl {
            background-color: #FF6600;
            color: #fff;
            padding: 0 10px;
            font-size: 12px;
            border-radius: 3px;
          }
        }
      }
      &:hover {
        .info-list-handle_dl {
          display: inline;
        }
      }
    }
  }

</style>

<script>
  import { mapState } from 'vuex'
  import mixin from '../../../utils/mixin'
  import { FETCH_CASE_LIST, REMOVE_CASE_INFO } from '../../../store/types'
  import { tableFill, clone } from '../../../utils/util'
  import { save, get } from '../../../utils/storage'
  import pagination from '../../../widgets/pagination/pagination.vue'
  export default {
    mixins: [mixin],
    components: {
      pagination
    },
    props: ['listType', 'queryCondition'],
    data() {
      return {
        caseList: {},
        tableHeight: 0,
        demoCount: 10,
        list: [],
        pageInfo: { // 页面分页信息相关配置
          count: 10,
          limit: 10,
          currentpage: 1
        },
        listDataCountStorage: {
          caseList_0: '',
          caseList_1: ''
        }
      }
    },
    computed: {
      ...mapState(['caseInfo'])
    },
    methods: {
      dataMatchs(DM) {
        return {
          id: DM.id, // 案件id
          number: DM.ajbh, // 案件编号
          state: DM.ajzt, // 案件状态
          stateText: DM.ajztmc, // 案件状态名称
          source: DM.ajly, // 案件来源
          sourceText: DM.ajly === '1' ? '手动添加' : '外部导入', // 案件来源名称
          name: DM.ajmc, // 案件名称
          peopleNumber: DM.sars, // 涉案人数
          type: DM.ajlb, // 案件类别
          typeText: DM.ajlbmc, // 案件类别名称
          means: DM.zasd,
          meansText: DM.zasdmc, // 案件手段名称
          startTime: DM.fasjsx, // 发案时间上限
          endTime: DM.fasjxx, // 发案时间下限
          unit: DM.badwmc, //  办案单位
          bary: DM.bary || '暂无', // 主办人
          user: DM.cjrmc, // 创建人名称
          userId: DM.cjr, // 创建人名称
          caseSum: DM.sars, // 涉案人数
          area: DM.fadd, // 发案地址
          facts: DM.jyaq, // 案情简要
          jams: DM.jams, // 结案描述
          isEndCase: DM.sfja, // 是否结案
          label: ['盗窃', '涉黑'] // 标签
        }
      },
      queryList() {
        let _tempQuery = Object.assign(this.queryCondition, {
          PageIndex: this.pageInfo.currentpage,
          PageSize: this.pageInfo.limit
        })
        let _tempSecondQuery = _tempQuery.sfja === '0' ? Object.assign(clone(_tempQuery), { sfja: '1' }) : Object.assign(clone(_tempQuery), { sfja: '0' })
        let _currentData, _currentDataSecond
        // 查询列表
        this.dispatch(FETCH_CASE_LIST, {
          data: _tempQuery
        }).then(r => {
          _currentData = clone(this.caseInfo)
          if (_currentData.PageData) {
            this.list = _currentData.PageData.map(d => {
              return this.dataMatchs(d)
            })
            this.pageInfo.count = _currentData.DataCount
            this.pageInfo.currentpage = _currentData.PageIndex
            this.pageInfo.limit = _currentData.PageSize
          }
          this.listDataCountStorage['caseList_' + _tempQuery.sfja] = _currentData.DataCount
          save('case_list_count', this.listDataCountStorage) // 缓存类型数据统计
          this.$emit('call:list-update')

          // 查询另一状态的数据
          this.dispatch(FETCH_CASE_LIST, {
            data: _tempSecondQuery
          }).then(rs => {
            _currentDataSecond = clone(this.caseInfo)
            this.listDataCountStorage['caseList_' + _tempSecondQuery.sfja] = _currentDataSecond.DataCount
            save('case_list_count', this.listDataCountStorage) // 缓存类型数据统计
            this.$emit('call:list-update')
          })
        })
      },
      /**
       * 案件研判跳转
       * @param cId
       */
      handleStudyCaseTo(cId, cjrId) {
        console.log('当前案件', cId, cjrId);
        let _pathR = this.$route.path
        if (get('case_menu_list')[_pathR]) {
          save('study_judge_per', {
            id: get('case_menu_list')[_pathR].id,
            treeId: get('case_menu_list')[_pathR].treeId,
            name: get('case_menu_list')[_pathR].name
          });
        }
        this.jumpTo('/case/base?a=' + cId + '&b=' + cjrId, true)
      },
      remove(rowPeopleId, rowIndex) {
        // 删除
        this.$confirm('确定要删除此项?', '温馨提示', {
          type: 'warning'
        }).then(() => {
          this.dispatch(REMOVE_CASE_INFO, {
            data: {
              ids: rowPeopleId
            }
          }, rowIndex).then(() => {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.queryList()
          })
        }).catch(() => {});
      },
      pagenavChange(obj) {
        // 分页切换操作
        this.pageInfo.limit = obj.limit
        this.pageInfo.currentpage = obj.currentpage
        this.queryList()
      },
      resizeHeight() {
        // 动态高度调整
        this.tableHeight = tableFill(this.$, '.app-box', this.$('.table-judge'), this.$('.app-content').height() - 45)
      }
    },
    watch: {
      queryCondition: {
        handler: function(val, oldVal) {
          this.queryList()
        },
        deep: true
      },
      listType(val) {
        // 初始化查询列表
        this.queryList()
      }
    },
    created() {
      // 初始化查询列表
      this.queryList()
      window.addEventListener('resize', (e) => {
        this.resizeHeight()
      })
    },
    updated() {
      this.resizeHeight()
    },
    mounted() {
      this.resizeHeight()
    }
  }

</script>
