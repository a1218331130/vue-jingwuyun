<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="关系管理" :modal-append-to-body="true" :append-to-body="true" size="relation-bigest" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <div :class="{'list-aside': true,'wrap': wrapStatus === 'wrap'}">
    <div :class="{'wrap-btn': true, 'wrap': wrapStatus === 'wrap'}">
      <i class="icon iconfont icon-enter" v-if="wrapStatus === 'wrap'" @click="wrapStatus = 'open'"></i>
      <i class="icon iconfont icon-return" v-if="wrapStatus === 'open'" @click="wrapStatus = 'wrap'"></i>
      </div>
    <div class="list-panel" ref="listPanel" v-loading="$refs.caseSideBar && $refs.caseSideBar.showBodyLoader">
    <el-row style="text-align:center;padding: 10px;">
      <div @keyup.enter = "search">
        <el-input placeholder="输入案件名称或编号检索" v-model="keyword" :on-icon-click="search"
        size="small" style="width: 200px">
          <template slot="suffix">
            <i class="icon iconfont icon-sousuo search-icon" @click="search"></i>
            </template>
</el-input>
</div>
</el-row>

<xdh-scroll ref="caseSideBar" :on-reach-bottom="handleReachBottom" :distance-to-edge="-200" loading-text="加载中..." :height="506" :total="pageInfo.total" :personList="caseList" class="case-side-bar">
  <div v-for="(item, idx) in viewList" :key="idx" @click="getRelations(item.id, idx)">
    <div class="case-item" :class="{active:idx===activeIndex}">

      <div class="seq">{{idx +1}}</div>
      <div class="case-name">{{item.label}}</div>
      <div class="case-number">{{item.value}}</div>
    </div>
  </div>
  <div v-if="caseList.length === pageInfo.total" style="line-height: 50px;text-align: center;">没有更多数据~</div>
</xdh-scroll>
</div>
</div>
<!-- <div v-loading="caseLoading" class="case-side-bar">
        <div v-for="(item, idx) in caseList" :key="idx" @click="getRelations(item.value,idx)" class="case-item" :class="{active:idx===activeIndex}">
          {{item.label}}
        </div>
      </div> -->
<div class="el-container relation-manage__body" v-loading="loading">
  <div :span="18" :class="{'el-main':true,'relation-manage__content':true, 'wrap':wrapStatus === 'wrap'}">
    <ul class="case-relation-list" v-if="tableData.length!==0">
      <li v-for="(item, idx) in tableData" :key="idx" class="case-relation-item">
        <div class="container">
          <div class="index" width="20px">
            <span class="seq">{{idx+1}}</span>
          </div>
          <div class="main">
            <div class="title">{{item.bt}}</div>
            <!-- <el-input v-if="item.showInput" v-model="item.bt"></el-input>  -->
            <div class="desc">{{item.sm}}</div>
            <!-- <el-input class="desc" v-if="item.showInput" v-model="item.sm"></el-input> -->
            <div>
              <span class="foot">{{item.cjsj}}</span>
              <span class="foot"> 显示到报告: ( {{item.sfxs === '1' ? '是' : '否'}} )</span>
            </div>
          </div>
          <div class="btns">
            <span @click="viewRelation(item)" class="btn view">
              <i class="icon iconfont icon-browse"></i>查看</span>
            <span @click="remove(item)" class="btn delete">
              <i class="icon iconfont icon-trash"></i>删除</span>
            <!-- <el-button size="mini" type="primary" @click="edit(item)" icon="icon iconfont icon-brush">{{item.showInput === true ? '保存' : '编辑'}}</el-button> -->
          </div>
        </div>
      </li>
    </ul>
    <div v-if="tableData.length === 0" class="empty"></div>
  </div>
</div>
</el-dialog>
</template>
<style lang="scss">
  .el-dialog.el-dialog--relation-bigest {
    width: 60%;
    height: 600px;
    max-width: 1000px;
    .el-dialog__body {
      padding: 0;
      max-height: 557px;
      height: 557px;
    }
  }

</style>
<style lang="scss" scoped>
  .el-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    min-width: 0;
  }

  .el-main {
    flex: 1;
    flex-basis: auto;
    overflow: auto;
    box-sizing: border-box;
    padding: 20px;
  } // $height: calc(90vh - 300px);
  .relation-bigest {
    height: 550px;
    width: 800px;
  }

  .wrap-btn {
    background-color: #fff;
    width: 30px;
    height: 40px;
    text-align: center;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-radius: 3px;
    position: absolute;
    left: 367px;
    top: 50%;
    margin-top: -20px;
    transition: all 300ms ease;
    cursor: pointer;
    &.wrap {
      left: 0;
    }
    i {
      font-size: 25px;
      line-height: 40px;
    }
  }

  .list-aside::-webkit-scrollbar {
    display: none;
  }

  .list-aside {
    position: absolute;
    left: 0;
    bottom: 5px;
    top: 35px;
    width: 400px;
    z-index: 9999;
    background-color: transparent;
    transition: all 300ms ease;
    .search-icon {
      line-height: 30px;
      cursor: pointer;
    }
    &.wrap {
      width: 30px;
    }
  }

  .list-panel {
    background-color: #fff;
    position: absolute;
    overflow-y: scroll;
    right: 30px;
    border: 1px solid #bbb;
    left: 0;
    bottom: 0;
    top: 0;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .case-side-bar {
    .case-item {
      border-bottom: 1px solid #ccc;
      position: relative;
      padding: 5px 10px 10px 35px;
      background: #fff;
      margin-top: 2px;
      color: #333;
      height: 60px;
      .case-number {
        color: #999;
        font-size: 12px;
      }
      .seq {
        position: absolute;
        top: 8px;
        left: 5px;
        text-align: center;
        line-height: 20px;
        background-color: #5babe6;
        width: 20px;
        height: 20px;
        color: #fff;
        border-radius: 50%;
      }
      .case-name {
        margin-bottom: 5px;
      }
      &.active,
      &:hover {
        cursor: pointer;
        background: #daefff;
      }
    }
  }

  .case-relation-list {
    list-style: none;
    padding: 20px 0;
    margin: 0;
    .empty {
      width: 100%;
      height: 100px;
      line-height: 100px;
    }
  }

  .case-relation-item {
    padding: 10px;
    border: 1px solid #ccc;
    margin: 3px 15px 0 40px;
    box-sizing: border-box;
    position: relative;
    .index {
      position: absolute;
      left: 10px;
      top: 10px;
    }
    .main {
      padding: 0 55px 0 30px;
    }
    .btns {
      position: absolute;
      top: 10px;
      right: 10px;
      .btn {
        display: block;
        cursor: pointer;
        color: #fff;
        margin-bottom: 10px;
        font-size: 12px;
        border-radius: 3px;
        padding: 3px 5px;
      }
      .view {
        background-color: #2e9ad0;
      }
      .delete {
        background-color: #df5000;
      }
    }
    .desc {
      text-indent: 2em;
      padding: 10px;
      line-height: 0 20px;
      margin-bottom: 10px;
    }
    .seq {
      background-color: #0f74a8;
      padding: 3px 5px;
      color: #fff;
    }
    .title {
      line-height: 30px;
      font-weight: 600;
    }
    .foot {
      border: 1px solid #ccc;
      padding: 3px 5px;
      margin-right: 5px;
      border-radius: 3px;
      font-size: 12px;
      background-color: #eee;
    }
  }

  .relation-manage {
    &__body {
      height: 557px;
    }
    &__content {
      position: relative;
      padding: 0;
      margin-left: 360px;
      transition: all 300ms ease;
      &.wrap {
        margin-left: 0;
      }
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  import mixin from '../../../utils/mixin'
  import XdhScroll from '@/widgets/xdh-scroll'
  import { FETCH_CASE_LIST, FETCH_CASE_RELATION_LIST, DELETE_CASE_RELATION } from '../../../store/types'
  export default {
    mixins: [mixin],
    components: {
      XdhScroll
    },
    data() {
      return {
        wrapStatus: 'open',
        keyword: '',
        listHeight: 300,
        activeIndex: 0,
        caseLoading: false,
        caseId: '',
        pageInfo: {
          total: 1,
          limit: 20,
          currentpage: 1
        },
        tableData: [],
        caseList: [],
        relationList: [],
        rules: {
          target: {
            required: true,
            message: '请输入值'
          }
        }
      }
    },
    props: ['dialog'],
    computed: {
      ...mapState(['caseInfo', 'analysisRelation']),
      viewList() {
        return this.caseList.filter(r => r.label !== '' && r.label !== null);
      }
    },
    methods: {
      search() {
        this.pageInfo.currentpage = 1;
        this.caseList = [];
        this.fetchCase();
      },
      handleReachBottom() {
        if (this.pageInfo.total >= this.caseList.length) {
          this.pageInfo.currentpage++;
          return new Promise((resolve) => {
            this.fetchCase().then(() => {
              resolve();
            })
          })
        }
      },
      initDialog() {
        // this.caseLoading = true;
        this.fetchCase();
      },
      fetchCase() {
        return new Promise((resolve, reject) => {
          let query = {
            ajmc: this.keyword,
            PageIndex: this.pageInfo.currentpage,
            PageSize: this.pageInfo.limit
          }
          this.dispatch(FETCH_CASE_LIST, query).then(() => {
            if (this.caseInfo.PageData.length > 0) {
              let tempList = this.caseInfo.PageData.map(d => {
                return {
                  label: d.ajmc,
                  value: d.ajbh,
                  id: d.id,
                  data: { // 案件
                    caseId: d.id, // 案件编号
                    caseName: d.ajmc, // 案件名称
                    caseDesc: d.jyaq, // 基本案情
                    data: d // 原对象
                  }
                }
              })
              let prevList = JSON.parse(JSON.stringify(tempList));
              this.caseList = this.caseList.concat(prevList);
              this.pageInfo.total = this.caseInfo.DataCount;
              if (this.tableData.length === 0) {
                this.getRelations(this.caseList[0].id, 0)
              }
            } else {
              this.caseList = []
            }
            // this.caseLoading = false;
          })
        })
      },
      rowSelect() {},
      viewRelation(row) {
        let data = JSON.parse(row.data);
        console.log(row)
        this.$emit('show', data, row);
        this.closeEvent();
      },
      remove(row) {
        console.log(row.id);
        this.dispatch(DELETE_CASE_RELATION, {
          id: row.id
        }).then(() => {
          this.$message({
            type: 'success',
            message: '关系删除成功！'
          })
          this.getRelations(this.caseId)
        })
      },
      closeEvent(success) {
        if (success === true) {
          this.$emit('success')
        } else {
          this.$emit('close')
        }
      },
      // todo --编辑修改 待定
      // edit(item) {
      //   this.$set(item, 'showInput', true);
      // },
      getRelations(caseId, index) {
        this.activeIndex = index;
        this.caseId = caseId;
        this.dispatch(FETCH_CASE_RELATION_LIST, {
          ajid: caseId
        }).then(() => {
          if (this.analysisRelation.caseRelationList) {
            this.tableData = this.analysisRelation.caseRelationList;
          }
        })
      }
    },
    watch: {},
    created() {},
    mounted() {}
  }

</script>
