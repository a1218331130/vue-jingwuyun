<!-- 关系分析 -->
<template>
<el-layout :class="{'app-layout':!idCardFlag}" :fit="true">
  <!-- 头部导航 -->
  <!-- <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
      <top-bar></top-bar>
    </el-region> -->
  <!-- 内容区 -->
  <el-region class="app-center" slot="center" type="center">
    <div class="relation-box" v-loading.body="loading || importting || initting" :element-loading-text="(importting?'数据导入中...':(initting?'正在初始化...':''))">
      <el-row>
        <el-col :span="24">
          <div class="tool-bar">
            <!-- 功能按钮区 -->
            <el-button-group>
              <el-button icon="icon iconfont icon-xinzengdaikuan" @click="dialogObjectSelector=true" title="从数据源添加节点">检索添加</el-button>
              <el-button icon="icon iconfont icon-jia" @click="nodeDialog=true" title="添加自定义节点">创建节点</el-button>
              <el-button icon="icon iconfont icon-trash_fill" title="删除节点" @click="analysisRemoveNode">删除</el-button>
              <!-- <el-button icon="icon iconfont icon-brush_fill" title="编辑节点" @click="">编辑</el-button> -->
              <el-button icon="icon iconfont icon-refresh" @click="clearAll()" title="清空画布内容">清空画布</el-button>
              <el-button icon="icon iconfont icon-password" @click="toggleLock(true)" v-if="!diagramEnabled">解锁画布</el-button>
              <el-button icon="icon iconfont icon-password" @click="toggleLock(false)" v-if="diagramEnabled">锁定画布</el-button>
              <el-button icon="icon iconfont icon-folder-open" @click="switchTemp" title="生成快照">草稿</el-button>
              <!-- </el-button-group>
              <el-button-group> -->
            
              <el-button icon="icon iconfont icon-tupian" @click="makeImage">截图</el-button>
            </el-button-group> <input type="file" ref="relationImportUploadBtn" class="hide" accept="text/*,application/json,.json" @change="v=>importData(v)">
            <div class="separate"></div>
            <!-- 布局按钮区 -->
            <el-button-group>
              <el-button type="text" :type="this.goOptions.layout==='LayeredDigraphLayout'?'primary':''" size="mini" @click="setLayout('LayeredDigraphLayout','analysisRelationGoBox')"> <i class="icon iconfont icon-data-slice"></i>分层</el-button>
              <el-button type="text" :type="this.goOptions.layout==='ForceDirectedLayout'?'primary':''" size="mini" @click="setLayout('ForceDirectedLayout','analysisRelationGoBox')"><i class="icon iconfont icon-hudong"></i>力导向</el-button>
              <el-button type="text" :type="this.goOptions.layout==='GridLayout'?'primary':''" size="mini" @click="setLayout('GridLayout','analysisRelationGoBox')"><i class="icon iconfont icon-guanlian1"></i>网格</el-button>
              <el-button type="text" :type="this.goOptions.layout==='CircularLayout'?'primary':''" size="mini" @click="setLayout('CircularLayout','analysisRelationGoBox')"><i class="icon iconfont icon-fenleijishougongtongbu"></i>圆形</el-button>
              <el-button type="text" :type="this.goOptions.layout==='TreeLayout'?'primary':''" size="mini" @click="setLayout('TreeLayout','analysisRelationGoBox')"><i class="icon iconfont icon-ranking"></i>树形</el-button>
            </el-button-group>
             <div class="separate"></div>
             <el-button-group>
                 <el-button icon="icon iconfont icon-save" @click="openSaveDialog">保存</el-button>
              <el-button icon="icon iconfont icon-download" @click="importData(null)">导入</el-button>
              <el-button icon="icon iconfont icon-upload" @click="exportData">导出</el-button>
                <el-button icon="icon iconfont icon-fenxi" @click="manageDialog=true">关系管理</el-button>

             </el-button-group>
          </div>
          <!-- <div class="search"
               style=" position:absolute; top:15px; right:60px;">
            <el-input v-model="keyword"
                      placeholder="输入内容搜索节点"
                      icon="search"></el-input>
          </div> -->
          <span class="iconfont icon-fold" style="color:#fff; padding: 6px 0 7px 15px; cursor: pointer; position:absolute; top:15px; right:20px;" @click="switchRightBar"></span>
          <span class="iconfont icon-iconziti23" style="color:#fff; padding: 6px 0 7px 15px; cursor: pointer; position:absolute; top:15px; right:60px;" @click="switchRightFilter"></span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="position:relative; overflow: hidden;">
          <!-- 添加按钮 -->
          <!-- <el-button class="btn-plus" icon="plus" title="添加对象" @click="dialogObjectSelector=true"></el-button> -->
          <!-- 临时记录 -->
          <temp v-show="showTemp" class="temp-box" :list="recordList" @close="showTemp=false" @call:newRecord="addRecord" @call:remove="removeRecord" @call:useRecord="updateChartDataFromRecord"></temp>
          <!-- GO CHART -->
          <gocharts ref="analysisRelationGoBox" boxId="analysisRelationGoBox" class="maker-box" :data="chartData" 
           background="none" :options="goOptions" @update:data="val=>postData=val" @update:imageData="updateImageData" @link-contextmenu="linkContextmenu"
            @link-drawn="linkDrawn" @inited="afterInited" @hideContextMenu="hideContextMenu"
            @link-click="linkClickEvent"></gocharts>
          <div id="analysisRelationOverview" ref="analysisRelationOverview" class="go-overview" style="pointer-events:none"></div>
          <!-- 节点右键菜单 -->
          <div id="analysisRelationContextMenu" ref="analysisRelationContextMenu" class="context-menu">
            <div class="context-menu__title">分析</div>
            <div class="context-menu__item" @click="analysisAction()"><i class="iconfont icon-share"></i> 关系分析</div>
            <!-- <div class="context-menu__item" @click="analysisAction">关系挖掘</div>
            <div class="context-menu__item" @click="analysisAction">定向分析</div>
            <div class="context-menu__item" @click="analysisAction">全局关系</div> -->
            <!-- <div @click="analysisDossier">人员档案</div> -->
            <!-- <li @click="analysisLocus">活动轨迹</li> -->
            <!-- <div @click="analysisSearch">慧搜检索</div> -->
            <div class="context-menu__title">对象操作</div>
            <!-- <div class="context-menu__item" @click="analysisSubNode"><i class="iconfont icon-brush_fill"></i> 编辑</div> -->
            <div class="context-menu__item" @click="analysisSubNode"><i class="iconfont icon-jia"></i> 子节点</div>
            <div class="context-menu__item" @click="analysisRemoveNode"><i class="iconfont icon-trash_fill"></i> 删除节点</div>
            <div class="context-menu__item" @click="removeNode"><i class="iconfont icon-close"></i> 移除节点</div>
            <!-- <div class="context-menu__item" @click="removeNodeFromDiagram"><i class="iconfont icon-close"></i>从画布移除</div> -->
            <!-- <div class="context-menu__item"><i class="iconfont icon-fenxi"></i> 一键标注</div> -->
            <!-- <li>固定/活动</li> -->
            <!-- <li>展开/收缩</li> -->
            <!-- <div @click="analysisRelation">对象标注</div> -->
            <!-- <div @click="analysisDetail">查看详情</div> -->
            </div>
          <!-- 连线右键菜单 -->
          <div id="analysisRelationLinkContextMenu" ref="analysisRelationLinkContextMenu" class="context-menu">
            <div class="context-menu__title">关系</div>
            <!-- <div v-if="linkContextMenuList.length>1" class="context-menu__item" style="width: auto;" @click="removeRelation(null)"><i class="iconfont icon-trash_fill"></i> 删除全部关系</div> -->
            <div v-for="(item,i) in linkContextMenuList" :key="i" class="context-menu__item" style="width: auto;" @click="removeRelation(item)"><i class="iconfont icon-trash_fill"></i> 只删除 -> {{item.text}}</div>
          </div>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="24">
          <div class="info-bar">
            已选对象 XXX
          </div>
        </el-col>
      </el-row> -->
      <div class="right-bar" v-show="showRightBar===true">
        <el-tabs v-model="detailTab">
          <el-tab-pane label="节点信息" name="1">
            <base-info ref="baseInfoBox" class="base-info"></base-info>
          </el-tab-pane>
          <el-tab-pane label="统计信息" name="2">
            <statistics class="statistics" :data="chartData"></statistics>
          </el-tab-pane>
          <el-tab-pane label="数据" name="3" v-if="packList.length !== 0">
            <filter-box ref="filterBox" class="filter-box" :list="packList" @update:value="filter" @call:addNode="addFilterNode"
            @call:removeNode="removeFilterNode"></filter-box>
          </el-tab-pane>
          <el-tab-pane label="案件关系" name="4" v-if="relationInfoData">
            <relation-box ref="relationBox" :relationInfoData="relationInfoData"
            class="relation-box"></relation-box>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="right-bar filter" v-show="showRightFilter===true">
         <div class="filter-title">筛选查看关系</div>
         <ul>
           <li @click="filterRelation()" :class="{active: currFilter.length === 0}"> <span>全部 </span></li>
           <li v-for="(item,idx) in relationFilters" @click="filterRelation(item, idx)" :key="idx" :class="{active: currFilter.includes(item)}">
             <span >{{item}}</span>
             </li>
           </ul>
      </div>
    </div>

    <form :action="screenshotAction" method="post" ref="screenshotForm">
      <input name="image64" type="hidden" :value="chartImage" />
      <input name="name" type="hidden" value="关系截图" />
    </form>
    <dialog-save :dialog="saveDialog" @close="saveDialog=false" :graphOptions="this.goOptions" :graphObj="postData" @success="saveRelation" ref="saveDialog"></dialog-save>
    <dialog-manage :dialog="manageDialog" @close="manageDialog=false"  ref="manageDialog" @show="showRelation"></dialog-manage>
    <dialog-node :dialog="nodeDialog" @close="nodeDialog=false" @success="addNewNode"></dialog-node>
    <dialog-subnode :dialog="subnodeDialog" :parent="parentNode" @close="subnodeDialog=false" @success="addSubNode"></dialog-subnode>
    <dialog-relation :dialog="relationDialog" :data="linkData" @close="relationDialog=false" @success="addLink"></dialog-relation>
    <dialog-table :dialog="tableDialog" :data="postData" @close="tableDialog=false"></dialog-table>
    <object-selector-dialog :dialog="dialogObjectSelector" @close="dialogObjectSelector=false" @call:addObject="addObject"></object-selector-dialog>
  </el-region>
</el-layout>
</template>

<style lang="scss" scoped>
  .app-center {
    // background: rgba(0,16,39,1);
    background: linear-gradient(90deg, rgba(0, 0, 0, .5) 10%, transparent 0), linear-gradient(rgba(0, 0, 0, .5) 10%, transparent 0), rgba(0, 16, 39, .8);
    background-size: 10px 10px; // background: url("/static/img/bg_r.jpg") repeat center center;
  }

</style>
<style lang="scss">
  .relation-box .right-bar .cursor--pointer {
    text-decoration: underline;
    &:hover {
      color: #ffff00;
    }
  }

  .relation-box .right-bar {
    &.filter {
      .filter-title {
        color: #fff;
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
      }
      ul li {
        display: inline-block;
        cursor: pointer;
        color: #fff;
        border: 1px solid #fff;
        border-radius: 4px;
        padding: 3px 5px;
        margin: 5px;
        &.active {
          color: yellow;
          border: 1px solid yellow;
        }
      }
    }
  }

</style>
<script>
  import '../../../themes/default/relation.scss'
  import func from './func'
  export default {
    mixins: [func]
  }

</script>
