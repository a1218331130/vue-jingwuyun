<template>
<div class="side-right-box_div control-manage-apply" v-loading="loading">
  <el-tabs v-model="currentTab" @tab-click="changeList">
    <ul class="top-menu">
      <li style="margin-top: -35px;margin-right: 50px;">
        <el-button icon="plus" class="import-btn add" @click="newEdit" title="申请" style="vertical-align: middle; height: 32px;line-height: 32px;padding: 0 15px;">申请</el-button>
      </li>
    </ul>
    <!-- 侧栏触发器 -->
    <span class="unfold-button iconfont icon-fold" @click="handleRightSide"></span>

    <el-tab-pane v-for="tab in tabs" :key="tab.id" :name="tab.id.toString()" :label="tab.label">
      <div class="app-content-box">
         <!-- 待审批 -->
         <el-table @cell-mouse-enter="cellMouseEnter" v-if="tab.id===1" class="app-table" border :stripe="true" :data="list">
          <el-table-column align="center" type="index" label="序号" width="50">
            <template scope="scope">
              {{scope.$index + 1 + 30 * (1 - 1)}}
            </template>
</el-table-column>
<el-table-column label="策略名称" prop="title" width="150"></el-table-column>
<el-table-column label="简要概况" prop="desc"></el-table-column>
<el-table-column label="开始时间" prop="slot" width="150">
  <template scope="scope">
                <span>{{scope.row.slot[0]}}</span>
              </template>
</el-table-column>
<el-table-column label="结束时间" prop="slot" width="150">
  <template scope="scope">
                <span>{{scope.row.slot[1]}}</span>
              </template>
</el-table-column>
<el-table-column align="center" label="是否已推送" prop="resultPushed" width="150">
  <template scope="scope">
              <span>{{scope.row.resultPushed?'是':'否'}}</span>
            </template>
</el-table-column>
<el-table-column align="center" label="累计执行次数" prop="count" width="100"></el-table-column>
<el-table-column align="center" label="频率" prop="rate" width="80"></el-table-column>
<el-table-column align="center" label="结果" prop="hasResult" width="80"></el-table-column>
<el-table-column align="center" label="操作" width="350">
  <!-- @click="callDetailDialog(0,scope.row.id,scope.row.lcid,scope.row.bktype)" -->
  <template scope="scope">
              <el-button type="primary" size="mini" icon="icon iconfont icon-xiangqing" title="查看详情" @click="lookDetail(scope.row)">
                查看详情
              </el-button>
            </template>
</el-table-column>
</el-table>
<!-- 未开始 -->
<el-table @cell-mouse-enter="cellMouseEnter" v-if="tab.id===2" class="app-table" border :stripe="true" :data="list">
  <el-table-column align="center" type="index" label="序号" width="50">
    <template scope="scope">
              {{scope.$index + 1 + 30 * (1 - 1)}}
            </template>
  </el-table-column>
  <el-table-column label="策略名称" prop="title" width="150"></el-table-column>
  <el-table-column label="简要概况" prop="desc"></el-table-column>
  <el-table-column label="开始时间" prop="slot" width="150">
    <template scope="scope">
                <span>{{scope.row.slot[0]}}</span>
              </template>
  </el-table-column>
  <el-table-column label="结束时间" prop="slot" width="150">
    <template scope="scope">
                <span>{{scope.row.slot[1]}}</span>
              </template>
  </el-table-column>
  <el-table-column align="center" label="是否已推送" prop="resultPushed" width="150">
    <template scope="scope">
              <span>{{scope.row.resultPushed?'是':'否'}}</span>
            </template>
  </el-table-column>
  <el-table-column align="center" label="累计执行次数" prop="count" width="100"></el-table-column>
  <el-table-column align="center" label="频率" prop="rate" width="80"></el-table-column>
  <el-table-column align="center" label="结果" prop="hasResult" width="80"></el-table-column>
  <el-table-column align="center" label="操作" width="350">
    <!-- @click="callDetailDialog(0,scope.row.id,scope.row.lcid,scope.row.bktype)" -->
    <template scope="scope">
              <el-button type="primary" size="mini" icon="icon iconfont icon-xiangqing" title="查看详情" @click="lookDetail(scope.row)">
                查看详情
              </el-button>
              <!-- <el-button style="background:#f60;color:white" v-show="scope.row.state===0" size="mini" class="play" icon="icon iconfont icon-qidong" @click="setActive(scope.row, 1)">启动</el-button>
              <el-button style="background:#f60;color:white" v-show="scope.row.state===1" size="mini" class="stop" icon="icon iconfont icon-stop" @click="setActive(scope.row, 0)">停止</el-button>
              <el-button v-show="scope.row.state < 2" type="primary" size="mini" icon="icon iconfont icon-task" @click="openDetail(scope.row)">
                布控结果
              </el-button> -->
            </template>
  </el-table-column>
</el-table>
<!-- 进行中 -->
<el-table @cell-mouse-enter="cellMouseEnter" v-if="tab.id===3" class="app-table" border :stripe="true" :data="list">
  <el-table-column align="center" type="index" label="序号" width="50">
    <template scope="scope">
              {{scope.$index + 1 + 30 * (1 - 1)}}
            </template>
  </el-table-column>
  <el-table-column label="策略名称" prop="title" width="150"></el-table-column>
  <el-table-column label="简要概况" prop="desc"></el-table-column>
  <el-table-column label="开始时间" prop="slot" width="150">
    <template scope="scope">
                <span>{{scope.row.slot[0]}}</span>
              </template>
  </el-table-column>
  <el-table-column label="结束时间" prop="slot" width="150">
    <template scope="scope">
                <span>{{scope.row.slot[1]}}</span>
              </template>
  </el-table-column>
  <el-table-column align="center" label="是否已推送" prop="resultPushed" width="150">
    <template scope="scope">
              <span>{{scope.row.resultPushed?'是':'否'}}</span>
            </template>
  </el-table-column>
  <el-table-column align="center" label="累计执行次数" prop="count" width="100"></el-table-column>
  <el-table-column align="center" label="频率" prop="rate" width="80"></el-table-column>
  <el-table-column align="center" label="结果" prop="hasResult" width="80"></el-table-column>
  <el-table-column align="center" label="操作" width="350">
    <!-- @click="callDetailDialog(0,scope.row.id,scope.row.lcid,scope.row.bktype)" -->
    <template scope="scope">
              <el-button type="primary" size="mini" icon="icon iconfont icon-xiangqing"title="查看详情" @click="lookDetail(scope.row)">
                查看详情
              </el-button>
              <el-button style="background:#f60;color:white" v-if="scope.row.state !==1" size="mini" class="play"title="启动" icon="icon iconfont icon-qidong" @click="setActive(scope.row, 1)">启动</el-button>
              <el-button style="background:#f60;color:white" v-if="scope.row.state ===1" size="mini" class="stop" icon="icon iconfont icon-stop" @click="setActive(scope.row, 0)"title="停止">停止</el-button>
              <el-button v-show="scope.row.state < 2" type="primary" size="mini" icon="icon iconfont icon-task"title="布控结果" @click="openDetail(scope.row)">
                布控结果
              </el-button>
            </template>
  </el-table-column>
</el-table>
<!-- 已结束 -->
<el-table @cell-mouse-enter="cellMouseEnter" v-if="tab.id===4" class="app-table" border :stripe="true" :data="list">
  <el-table-column align="center" type="index" label="序号" width="50">
    <template scope="scope">
              {{scope.$index + 1 + 30 * (1 - 1)}}
            </template>
  </el-table-column>
  <el-table-column label="策略名称" prop="title" width="150"></el-table-column>
  <el-table-column label="简要概况" prop="desc"></el-table-column>
  <el-table-column label="开始时间" prop="slot" width="150">
    <template scope="scope">
                <span>{{scope.row.slot[0]}}</span>
              </template>
  </el-table-column>
  <el-table-column label="结束时间" prop="slot" width="150">
    <template scope="scope">
                <span>{{scope.row.slot[1]}}</span>
              </template>
  </el-table-column>
  <el-table-column align="center" label="是否已推送" prop="resultPushed" width="150">
    <template scope="scope">
              <span>{{scope.row.resultPushed?'是':'否'}}</span>
            </template>
  </el-table-column>
  <el-table-column align="center" label="累计执行次数" prop="count" width="100"></el-table-column>
  <el-table-column align="center" label="频率" prop="rate" width="80"></el-table-column>
  <el-table-column align="center" label="结果" prop="hasResult" width="80"></el-table-column>
  <el-table-column align="center" label="操作" width="350">
    <!-- @click="callDetailDialog(0,scope.row.id,scope.row.lcid,scope.row.bktype)" -->
    <template scope="scope">
              <el-button type="primary" size="mini" icon="icon iconfont icon-xiangqing"title="查看详情" @click="lookDetail(scope.row)">
                查看详情
              </el-button>
              <!-- <el-button style="background:#f60;color:white" v-show="scope.row.state===0" size="mini" class="play" icon="icon iconfont icon-qidong" @click="setActive(scope.row, 1)">启动</el-button>
              <el-button style="background:#f60;color:white" v-show="scope.row.state===1" size="mini" class="stop" icon="icon iconfont icon-stop" @click="setActive(scope.row, 0)">停止</el-button> -->
              <el-button v-show="scope.row.state < 2" type="primary" size="mini" icon="icon iconfont icon-task"title="布控结果" @click="openDetail(scope.row)">
                布控结果
              </el-button>
              <el-button type="danger" size="mini" icon="icon iconfont icon-trash"title="删除" @click="deleteTacticsApply(scope.row)">删除
              </el-button>
            </template>
  </el-table-column>
</el-table>
<!-- 草稿 -->
<el-table @cell-mouse-enter="cellMouseEnter" v-if="tab.id===6" class="app-table" border :stripe="true" :data="list">
  <el-table-column align="center" type="index" label="序号" width="50">
    <template scope="scope">
              {{scope.$index + 1 + 30 * (1 - 1)}}
            </template>
  </el-table-column>
  <el-table-column label="策略名称" prop="title" width="150"></el-table-column>
  <el-table-column label="简要概况" prop="desc"></el-table-column>
  <el-table-column label="开始时间" prop="slot" width="150">
    <template scope="scope">
                <span>{{scope.row.slot[0]}}</span>
              </template>
  </el-table-column>
  <el-table-column label="结束时间" prop="slot" width="150">
    <template scope="scope">
                <span>{{scope.row.slot[1]}}</span>
              </template>
  </el-table-column>
  <el-table-column align="center" label="是否已推送" prop="resultPushed" width="150">
    <template scope="scope">
              <span>{{scope.row.resultPushed?'是':'否'}}</span>
            </template>
  </el-table-column>
  <el-table-column align="center" label="累计执行次数" prop="count" width="100"></el-table-column>
  <el-table-column align="center" label="频率" prop="rate" width="80"></el-table-column>
  <el-table-column align="center" label="结果" prop="hasResult" width="80"></el-table-column>
  <el-table-column align="center" label="操作" width="350">
    <!-- @click="callDetailDialog(0,scope.row.id,scope.row.lcid,scope.row.bktype)" -->
    <template scope="scope">
              <el-button type="primary" size="mini" icon="icon iconfont icon-xiangqing" title="查看详情"@click="lookDetail(scope.row)">
                查看详情
              </el-button>
              <el-button type="primary" size="mini" icon="icon iconfont icon-export" title="发送审批" @click="sendApply(scope.row,scope.$index)">
                发送审批
              </el-button>
              <!-- <el-button style="background:#f60;color:white"size="mini" class="play" icon="icon iconfont icon-qidong" @click="editTacticsApply(list, scope.$index)">编辑</el-button> -->
              <!-- <el-button style="background:#f60;color:white" v-show="scope.row.state===1" size="mini" class="stop" icon="icon iconfont icon-stop" @click="setActive(scope.row, 0)">停止</el-button>
              <el-button v-show="scope.row.state < 2" type="primary" size="mini" icon="icon iconfont icon-task" @click="openDetail(scope.row)">
                布控结果
              </el-button> -->
              <el-button type="danger" size="mini" icon="icon iconfont icon-trash"title="删除" @click="deleteTacticsApply(scope.row)">删除
              </el-button>
            </template>
  </el-table-column>
</el-table>
</div>
</el-tab-pane>
</el-tabs>
<!-- @update:pagenav="handlePageChange" -->
<div class="app-toolbar" style="position:absolute;width:100%;bottom:0;padding:12px 0;">
  <pagination :count="count" :pagenav="pagenav"></pagination>
</div>
<!-- <div class="app-toolbar">
    <el-row>
      <el-col :span="12">
        策略布控合计:
        <font color="#ff6600">{{count}}条</font>
      </el-col>
      <el-col :span="12" class="text-right">
        <el-button icon="plus" class="import-btn add import-right" @click="newEdit" style="height:32px; line-height:32px;">申请</el-button>
      </el-col>
  <span class="unfold-button iconfont icon-fold" style ="top:10px;"@click="handleRightSide"></span>
    </el-row>
  </div> -->
<!-- <div class="list" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="12" v-for="(item,i) in list" :key="i">
        <div class="list__item"> -->
<!-- <i class="el-icon-delete2" style="position:absolute;right:60px;top:20px;width:25px;height:25px;cursor: pointer;" title="编辑" @click.stop="editTacticsApply(item)"></i> -->
<!-- <i class="el-icon-delete2" style="position:absolute;right:20px;top:20px;width:25px;height:25px;cursor: pointer;" title="删除" @click.stop="deleteTacticsApply(item)"></i>
          <div class="list__item__image">
            <img v-show="item.state===0" src="/static/img/res/c_4.png" alt="已停用">
            <img v-show="item.state === 1 && item.hasResult >0" src="/static/img/res/c_5.png" alt="预警">
            <img v-show="item.state === 1 && item.hasResult === '0'" src="/static/img/res/c_3.png" alt="已启用">
            <img v-show="item.state===2" src="/static/img/res/c_1.png" alt="审核中">
            <img v-show="item.state===3" src="/static/img/res/c_2.png" alt="未通过">
            <div :class="{list__item__image__text:true, blue:item.state > 1, green:item.state === 1 && item.hasResult === false, red:item.state === 1 && item.hasResult === true, gray:item.state === 0}">
              <span v-show="item.state===0">已停用</span>
              <span v-show="item.state === 1 && item.hasResult === true">预警</span>
              <span v-show="item.state === 1 && item.hasResult === false">已启用</span>
              <span v-show="item.state===2">审核中</span>
              <span v-show="item.state===3">未通过</span>
            </div>
          </div> -->
<!-- id: 1, state: 0, // 0: 停用, 1:启用, 2:审核中 -->
<!-- <div class="list__item__content"> -->
<!-- <div class="list__item__title">
              {{item.title}}
            </div>

            <div class="list__item__desc">
              {{item.desc}}
            </div> -->

<!-- <div class="list__item__meta"> -->
<!-- <el-row>
                <el-col :span="6">
                  <div class="list__item__meta__item">是否已推送:
                    <span :class="{red:!item.resultPushed}">{{item.resultPushed?'是':'否'}}</span>
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="list__item__meta__item">开始时间:
                    <span>{{item.slot[0]}}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="list__item__meta__item">累计执行次数:
                    <span>{{item.count}}</span>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <div class="list__item__meta__item">频率:
                    <span>{{item.rate}}</span>
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="list__item__meta__item">结束时间:
                    <span>{{item.slot[1]}}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="list__item__meta__item">结果:
                    <span>{{item.hasResult}}</span>
                  </div>
                </el-col>
              </el-row> -->
<!-- 修改 -->
<!-- <div class="list__item__meta__item">是否已推送:
                <span :class="{red:!item.resultPushed}">{{item.resultPushed?'是':'否'}}</span>
              </div>
              <div class="list__item__meta__item">开始时间:
                <span>{{item.slot[0]}}</span>
              </div>
              <div class="list__item__meta__item">累计执行次数:
                <span>{{item.count}}</span>
              </div>
              <div class="list__item__meta__item">频率:
                <span>{{item.rate}}</span>
              </div>
              <div class="list__item__meta__item">结束时间:
                <span>{{item.slot[1]}}</span>
              </div>
              <div class="list__item__meta__item">结果:
                <span>{{item.hasResult}}</span>
              </div> -->
<!-- </div> -->
<!-- <div class="list__item__ctrl">
              <el-button class="details" icon="icon iconfont icon-xiangqing" @click="lookDetail(item)">详情</el-button>
              <el-button v-show="item.state===0" class="play" icon="icon iconfont icon-qidong" @click="setActive(item, 1)">启动</el-button>
              <el-button v-show="item.state===1" class="stop" icon="icon iconfont icon-stop" @click="setActive(item, 0)">停止</el-button>
              <el-button v-show="item.state < 2" icon="icon iconfont icon-task" @click="openDetail(item)">布控结果</el-button>
            </div> -->
<!-- </div> -->
<!-- <div class="list__item__ctrl">
            <el-button v-show="item.state===0" class="play" icon="icon iconfont icon-qidong" @click="setActive(item, 1)">启动</el-button>
            <el-button v-show="item.state===1" class="stop" icon="icon iconfont icon-stop" @click="setActive(item, 0)">停止</el-button>
            <el-button v-show="item.state < 2" icon="icon iconfont icon-sousuo" @click="openDetail(item)">详情</el-button>
          </div> -->
<!-- </div> -->
<!-- </el-col>
    </el-row> -->
<!-- </div> -->
<!-- 申请 -->
<dialog-form :dialog="formDialog" @close="dialogFormClose" @success="applySuccess" @openNotifPersonDialog=" openNotifPersonDialog" @openNotifUnitDialog="openNotifUnitDialog" :notifPerson="dialogData.notifPerson" :notifUnit="dialogData.notifUnit" :data="detailData"
  :type="statusType">
</dialog-form>
<!-- 查看详情 -->
<dialog-form :dialog="detailFormDialog" @close="dialogFormClose" @success="applySuccess" @openNotifPersonDialog=" openNotifPersonDialog" @openNotifUnitDialog="openNotifUnitDialog" :notifPerson="dialogData.notifPerson" :notifUnit="dialogData.notifUnit"
  :data="detailData" :type="statusType">
</dialog-form>
<!-- 编辑 -->
<dialog-form :dialog="editFormDialog" @close="dialogFormClose" @success="applySuccess" @openNotifPersonDialog=" openNotifPersonDialog" @openNotifUnitDialog="openNotifUnitDialog" :notifPerson="dialogData.notifPerson" :notifUnit="dialogData.notifUnit" :data="detailData"
  :type="statusType">
</dialog-form>

<user-selector :dialog="chooseNotifPersonDialog" @update:value="updateNotifPerson" size="middle--user" @close="chooseNotifPersonDialog=false"></user-selector>

<unit-selector :dialog="chooseNotifUnitDialog" @update:value="val=>dialogData.notifUnit=val" size="middle--user" @close="chooseNotifUnitDialog=false"></unit-selector>

<!-- 右侧栏 -->
<side-right-box :unfoldHandle="unfoldT">
  <right-toolbar title="查询列表" :diffrent="1" :params="screen.queryForm" :options="screen.options" @packup="packup" @update:params="updateData"></right-toolbar>
</side-right-box>

</div>
</template>
<style lang="scss" scoped>
  /* .import-right {
    margin-right: 50px;
  }

  .tactics-apply {
    .app-toolbar {
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
    }
    .list {
      padding: 20px;
      &__item {
        background: -webkit-gradient(linear, 0 0, 0 bottom, from(rgba(248, 255, 248, 1)), to(rgba(222, 241, 248, 1)));
        font-size: 16px;
        color: #999;
        width: 100%; // height: 160px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        display: flex;
        position: relative;
        &:hover {
          background: -webkit-gradient(linear, 0 0, 0 bottom, from(rgba(234, 254, 232, 1)), to(rgba(199, 236, 230, 1)));
          box-shadow: 0 0 10px #ccc;
        }
        &__content {
          width: calc(100% - 170px);
          flex-shrink: 1;
        }
        &__title {
          font-size: 20px;
          color: #000;
          line-height: 40px;
          margin: 0;
          padding: 0;
        }
        &__image {
          background: #fff;
          width: 130px;
          height: 130px;
          margin: 20px;
          border-radius: 500px;
          overflow: hidden;
          position: relative;
          transform: translateY(15%);
          img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-65%);
            z-index: 1;
          }
          &__text {
            color: #fff;
            text-align: center;
            vertical-align: top;
            width: 130px;
            height: 130px;
            line-height: 1;
            padding: 10px 0;
            position: absolute;
            z-index: 2;
            bottom: -110px;
            left: 0;
            &.blue {
              background-color: #54a8e7;
            }
            &.red {
              background-color: #eb2121;
            }
            &.green {
              background-color: #00cc66;
            }
            &.gray {
              background-color: #999;
            }
          }
        }
        &__desc {
          height: 58px;
          line-height: 20px;
          margin: 0;
          padding: 0 10px 0 0;
          margin-bottom: 20px;
        }
        &__meta {
          max-width: 500px;
          overflow: hidden;
          &__item {
            margin-bottom: 15px;
            min-width: 88px;
          }
          span {
            display: inline-block;
            min-width: 20px;
            color: #0099ff;
            &.red {
              color: #ff0033;
            }
          }
        }
        &__ctrl {
          // position: absolute;
          // bottom: 15px;
          // right: 20px;
          // 修改部分
          float: right;
          margin-right: 20px;
          height: 30px;
          .el-button {
            background: #54a8e7;
            font-size: 14px;
            color: #fff;
            height: 30px;
            line-height: 30px;
            padding: 0 10px;
            border: 0;
            &.play,
            &.stop {
              background: #ff6600;
            }
            &.details {
              background: #0043ff;
            }
          }
        }
      }
    }
  }

  .list__item__meta__item {
    float: left;
    margin-right: 20px;
  } */

  .apply-query-form {
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .log-expand {
    font-size: 0;
  }

  .log-expand label {
    color: #99a9bf;
  }

  .log-expand span {
    color: #000;
  }

  .app-content-box {
    overflow-y: auto;
  }

  .el-tabs {
    margin-bottom: 10px;
  }

  .el-dialog .el-dialog--large .el-dialog__body {
    padding: 15px;
    max-height: calc(75vh - 150px);
    overflow: auto;
    background-color: #F5F5F5;
  }

</style>
<!-- 申请按钮样式 -->
<style lang="scss">
  /* .tactics-apply {
    .app-toolbar {
      .text-right {
        .el-button:active,
        .el-button:focus,
        .el-button:hover {
          background-color: #FF9900;
          color: #fff;
          border-color: #FF9900;
        }
      }
    }
  } */

  .side-right-box_div.control-manage-apply {
    .app-table {
      .el-table__body-wrapper {
        overflow-x: hidden;
        overflow-y: scroll;
        max-height: 700px;
      }
    }
  }

</style>
<script>
  import pagination from '../../../widgets/pagination/pagination'
  import { mapState } from 'vuex'
  import { GET_WARN_LIST, FETCH_SURVEILLANCE_COUNT, GET_SURVEILLANCE_COUNT, POST_SURVEILLANCE_ACTIVE, POST_SURVEILLANCE_DELETE, SURVEILLANCE_DETAILS, ADD_TO_DRAFT } from '../../../store/types'
  import mixin from '../../../utils/mixin'
  import { clone } from '../../../utils/util'
  import dialogForm from './dialog-form'
  import userselector from '../../../widgets/user-selector/user-selector'
  import unitselector from '../../../widgets/unit-selector/unit-selector'
  import sideRightBox from '../../control/side-right-box.vue'
  import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'
  export default {
    mixins: [mixin],
    components: {
      pagination,
      dialogForm,
      sideRightBox,
      rightToolbar,
      'user-selector': userselector,
      'unit-selector': unitselector
    },
    data: () => ({
      currentTab: '1',
      dialogData: {
        notifPerson: [],
        notifUnit: []
      },
      current: 0,
      pagenav: {
        currentpage: 1,
        limit: 100
      },
      tabs: [{
        bkflag: 'dsp',
        bkzt: 2,
        id: 1,
        label: '待审批 (0)'
      }, {
        bkflag: 'wks',
        bkzt: 3,
        id: 2,
        label: '未开始 (0)'
      }, {
        bkflag: 'jxz',
        bkzt: 3,
        id: 3,
        label: '进行中 (0)'
      }, {
        bkflag: 'yjs',
        bkzt: 3,
        id: 4,
        label: '已结束(0) '
      }, {
        bkflag: 'cg',
        bkzt: 1,
        id: 6,
        label: '草稿箱 (0)'
      }],
      statusType: 1, // 1是申请按钮进入,2详情按钮进入,3编辑按钮
      unfoldT: false,
      detailData: {},
      screen: {
        queryForm: {
          clmc: '',
          bkzt: '',
          kssj: '',
          jssj: ''
        },
        options: [
          {
            title: '策略名称',
            prop: 'clmc',
            type: 'input',
            subTitle: true
          }, {
            title: '布控时间范围',
            prop: 'applyTime',
            type: 'daterange'
          }
          // , {
          //   title: '布控状态',
          //   prop: 'bkzt',
          //   type: 'select',
          //   children: [{ value: '', label: '请选择' }, { value: '2', label: '待审批' }, { value: '3', label: '已审批' }]
          // }
        ]
      },
      sendData: {
        PageIndex: 1,
        PageSize: 50
      },
      formDialog: false,
      editFormDialog: false,
      detailFormDialog: false,
      count: 0,
      list: [],
      chooseNotifPersonDialog: false,
      chooseNotifUnitDialog: false
    }),
    computed: {
      ...mapState(['surveillance'])
    },
    methods: {
      updateNotifPerson(val) {
        this.dialogData.notifPerson = val
      },
      getState(examine, run) {
        // 0: 停用, 1:启用, 2:审核中, 3:未通过
        let res
        // 审批状态(ZZJX:正在进行；YWC:已完成；WTG:未通过；字典类型:LC_SPZT)
        if (examine === 'ZZJX') {
          res = 2
        } else if (examine === 'WTG') {
          res = 3
        } else {
          res = !run ? 0 : 1
        }
        return res
      },
      fetchList() {
        this.dispatch(GET_WARN_LIST, this.sendData).then(() => {
          this.list = this.surveillance.getWarnListResult.PageData.map(d => {
            return {
              id: d.id,
              state: this.getState(d.spzt, d.sfqy === '1'), // 0: 停用, 1:启用, 2:审核中
              title: d.clmc,
              desc: d.jygk,
              rate: d.clpl, // 频率
              count: d.zxcs, // 累计
              slot: [(d.kssj.split(' ')[0]), (d.jssj ? d.jssj.split(' ')[0] : '')], // 时间段
              hasResult: d.sfyjg, // 分析状态 是否有结果
              resultPushed: d.sfts === '1', // 分析状态是否已推送
              lastRunTime: d.scqdsj
              // "cjr": "1",                                            //创建人
              // "cjrbm": "431200010000",                               //创建人部门
              // "cjrbmmc": null,                                       //创建人部门名称
              // "cjrxm": "admin",                                      //创建人姓名
              // "cjsj": "2018-01-18 15:07:32",                         //创建时间
              // "clmc": "celue bu kong",                               //策略名称
              // "clpl": "2",                                           //策略频率（1：1小时；2：六小时；3：十二小时；4：一天）
              // "cltype": "0",                                         //策略类型（0：个人策略；1：通用策略）
              // "clyj": null,                                          //处理意见（1：同意；0：不同意）
              // "id": "204d42f1a0724b9ea85a26f158fe7f75",               //策略ID
              // "jssj": "2018-02-10 00:00:00",                         //结束时间
              // "jygk": "ji ben gai yao",                              //简要概况
              // "kssj": "2018-01-10 00:00:00",                         //开始时间
              // "lcid": null,                                          //流程ID
              // "notice_people": null,                                 //通知人集合
              // "object_info": null,                                   //策略对象集合
              // "scqdsj": "2018-01-19 00:41:50",                       //上次启动时间
              // "sfdxtx": "1",                                         //是否短信提醒1是0否
              // "sfqy": "1",                                           //是否启用 1是 0否
              // "sfsc": "0",                                           //是否删除1是0否
              // "sfxttx": "1",                                         //是否系统提醒1是0否
              // "sfyjtx": "1",                                         //是否邮件提醒1是0否
              // "spr": null,                                           //审批人
              // "spsj": "2018-01-18 14:56:32",                         //审批时间
              // "spyj": null,                                          //审批意见
              // "spzt": "YWC",                                 //审批状态(ZZJX:正在进行；YWC:已完成；WTG:未通过；字典类型:LC_SPZT)
              // "wjid": "319e232aebee0533c5c920a42",                   //文件ID
              // "wjmc": "wenjian",                                    //文件名称
              // "xgsj": null,                                         //修改时间
              // "zfid": "60E9C7AAC44B8CF7E053455C920AD5E8",           //战法ID
              // "sfyjg": "1",                                     //是否有结果（1：是；0：否）
              // "sfts": "1",                                      //是否推送（1：是；0：否）
              // "zxcs": "2"                                       //累计执行次数
            }
          })
          if (this.sendData) {
            this.count = this.list.length
          }
          this.$nextTick(() => {
            // console.log(this.list, 'this.list')
          })
        })
      },
      setActive(item, mode) {
        this.dispatch(POST_SURVEILLANCE_ACTIVE, { clid: item.id, sfqy: mode + '' }).then(() => {
          item.state = mode
          this.fetchList()
        })
      },
      newEdit() { // 申请
        if (this.checkRule('zfsc/library/getzflist') && this.checkRule('bkyj/warn/zfyytj')) {
          this.statusType = 1
          this.formDialog = true
        }
      },
      editTacticsApply(val, idx) { // 编辑
        this.$nextTick(() => {
          this.dispatch(SURVEILLANCE_DETAILS, { id: val[idx].id }).then(() => {
            this.detailData = this.surveillance.surveillanceDetailsResult
          })
          this.editFormDialog = true;
          this.statusType = 3
        })
      },
      lookDetail(val) { // 查看详情
        this.getSurveillanceDetails(val)
        this.detailFormDialog = true;
        this.statusType = 2
      },
      sendApplyData(idx) {
        let data = clone(this.surveillance.getWarnListResult.PageData[idx])
        data.flag = 'cg'
        this.dispatch(ADD_TO_DRAFT, data).then(() => {
          if (this.surveillance.addToDraftResult === 'success') {
            this.list.splice(idx, 1)
            this.fetchCount()
          }
        })
      },
      sendApply(val, idx) {
        this.$confirm('是否发送申请审批?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.sendApplyData(idx)
        })
      },
      getEdit(val) {
        this.formDialog = true
      },
      openDetail(item) {
        let time = new Date().getTime()
        if (time < new Date(item.slot[0]).getTime()) {
          this.$alert('暂无布控结果!', '温馨提示')
        } else {
          this.jumpTo(`/controlManage/tacticsApplyDetail/${item.id}/${item.lastRunTime}`, true)
        }
      },
      applySuccess(val) {
        this.formDialog = false
        this.count++;
        this.fetchList(val)
        this.fetchCount()
      },
      dialogFormClose() {
        this.formDialog = false
        this.detailFormDialog = false
        this.editFormDialog = false
        this.chooseNotifPersonDialog = false
        this.chooseNotifUnitDialog = false
      },
      // 判断下我们的对象策略是否为空
      openNotifPersonDialog() {
        this.chooseNotifPersonDialog = true
      },
      openNotifUnitDialog() {
        this.chooseNotifUnitDialog = true
      },
      deleteTacticsApply(val) {
        this.$confirm('此操作将永久删除该数据，是否继续？', '温馨提示', { type: 'warning' }).then(() => {
          this.deleteTacticsData(val)
        });
      },
      deleteTacticsData(val) {
        this.dispatch(POST_SURVEILLANCE_DELETE, { id: val.id }).then(() => {
          let status = this.surveillance.postSurveillanceDeletes;
          if (status === '删除成功') {
            this.count--;
            this.list = this.list.filter(item => {
              return item.id !== val.id
            })
            this.$alert('删除成功', '温馨提示', { type: 'warning' })
          }
        })
      },
      handleRightSide() {
        // 右侧窗体状态操作
        this.unfoldT = !this.unfoldT
      },
      packup() {
        // 收起侧栏
        this.unfoldT = false
      },
      sideState(s) {
        // 窗体自身操作更新窗体状态
        this.unfoldT = s
      },
      updateData(val) {
        // let transParam = this.screen.queryForm
        // this.sendData = {}
        if (val.applyTime && val.applyTime.filter(items => { return items.length > 0 }).length > 0) {
          val.applyTime.map((item, idx) => {
            idx === 0 ? val.kssj = item.slice(0, 10) : val.jssj = item.slice(0, 10)
          })
        }
        for (let key in val) {
          if (val[key]) {
            this.sendData[key] = val[key]
          }
          for (let keys in this.sendData) {
            if (key === keys && !val[key] && key !== 'bkzt') {
              delete this.sendData[keys]
            }
          }
        }
        this.fetchList()
      },
      getSurveillanceDetails(val) {
        this.detailData = {}
        this.dispatch(SURVEILLANCE_DETAILS, { id: val.id }).then(() => {
          this.detailData = this.surveillance.surveillanceDetailsResult
        })
      },
      changeList(val) {
        if (!val) {
          this.current = 0;
        } else {
          this.current = val.index;
        }
        let objTrans = {};
        for (let key in this.sendData) {
          if (key === 'bkflag') {
            objTrans[key] = this.sendData[key]
          } else if (key === 'bkzt') {
            objTrans[key] = this.sendData[key]
          } else if (key === 'PageIndex') {
            objTrans[key] = this.sendData[key]
          } else if (key === 'PageSize') {
            objTrans[key] = this.sendData[key]
          }
        }
        this.sendData = objTrans;
        this.sendData.bkflag = this.tabs[this.current].bkflag;
        this.sendData.bkzt = this.tabs[this.current].bkzt;
        this.fetchList()
      },
      fetchCount() {
        this.dispatch(FETCH_SURVEILLANCE_COUNT).then(() => {
          let getCount = this.surveillance.fetchSurveillanceCountResult;
          this.tabs.map(item => {
            for (let key in getCount) {
              if (item.bkflag.indexOf(key) !== -1) {
                item.label = `${item.label.substr(0, 3)}(${getCount[key]})`
              }
            }
          })
        })
      }
    },
    created() {
      this.fetchCount();
      this.changeList()
      this.dispatch(GET_SURVEILLANCE_COUNT).then(() => {
        this.count = this.surveillance.surveillanceCount.cltotal || 0
      })
    }
  }

</script>
