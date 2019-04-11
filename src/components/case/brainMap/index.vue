<!-- 侦查导图 -->
<template>
<div style="height: 100%;" v-loading.body="loading" class="brain-map">
  <div v-if="listShow===true" class="app-toolbar" style="border: none">
    <span class="" style="color: #46BDFD;font-size: 16px">侦查导图</span>
    <div class="app-search__buttons" v-if="checkUserRuleCase('ajgl/reconnaissancemap/save',caseId,true,cjrId)">
      <el-button type="primary" size="small" icon="plus" @click="add">新增</el-button>
    </div>
  </div>
  <div v-if="listShow===true" class="app-content-box">
    <el-table class="app-table" border stripe :data="list">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="state" label="公开状态"></el-table-column>
      <el-table-column prop="explain" label="说明"></el-table-column>
      <el-table-column prop="founder" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="160">
        <template scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.isCreater===false && checkUserRuleCase('ajgl/reconnaissancemap/info',caseId,true,cjrId)" @click="detail(scope.row.id)" icon="icon iconfont icon-xiangqing">查看详情
          </el-button>
          <el-button type="primary" size="mini" v-if="scope.row.isCreater===true && checkUserRuleCase('ajgl/reconnaissancemap/update',caseId,true,cjrId)" @click="edit(scope.row.id)" icon="icon iconfont icon-brush">编辑
          </el-button>
          <el-button type="danger" size="mini" v-if="scope.row.isCreater===true && checkUserRuleCase('ajgl/reconnaissancemap/delete',caseId,true,cjrId)" @click="remove(scope.row.id)" icon="icon iconfont icon-trash">删除
          </el-button>
        </template>
</el-table-column>
</el-table>
</div>

<div class="" v-if="listShow===false">

  <form :action="screenshotAction" method="post" ref="caseBrainExport">
    <input name="image64" type="hidden" :value="chartImage" />
    <input name="name" type="hidden" :value="form.title||'侦查导图'" />
  </form>
  <el-form :inline="true" style="height:calc(100% - 10px);padding:0 10px; margin-bottom:10px;">
    <el-row :gutter="20" style="background-color: #fff;height: 38px;border-bottom: 2px solid #46bdfd">
      <el-col :span="24" style="height: 100%">
        <el-button size="mini" type="primary" style="margin-top: 5px" @click="listShow = true"><i class="iconfont icon-undo"></i>返回
        </el-button>
        <div style="float: right;margin-top: 5px">
          <el-button size="mini" type="primary" @click="makeImage"><i class="iconfont icon-export"></i>导出图片
          </el-button>
          <el-button size="mini" type="primary" v-if="readOnly===false" @click="save"><i class="iconfont icon-save"></i>保存
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row style="height: calc(100% - 38px - 10px);background-color: #fff;border: 1px solid #d7d7d7;margin-top: 10px">
      <el-col :span="24">
        <el-row style="border-bottom: 1px solid #d7d7d7;padding:0 15px;padding-top: 11px;">
          <el-col :span="24">
            <el-form-item label="思维名称">
              <el-input v-model="form.title" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="公开状态">
              <!-- <el-select v-model="form.type" placeholder="">
                  <el-option label="公开" value="1"></el-option>
                  <el-option label="不公开" value="0"></el-option>
                </el-select> -->
              <el-radio label="1" v-model="form.type">公开</el-radio>
              <el-radio label="0" v-model="form.type">不公开</el-radio>
            </el-form-item>

            <el-form-item label="说明" class="explain" style="width:650px">
              <el-input v-model="form.remark" placeholder="" style="width: 100%" :maxlength="200" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="24">
        <el-row style="border-bottom: 1px solid #d7d7d7;padding: 10px 10px 0 10px;">
          <el-form-item label="导图">
            <!-- <el-button size="mini" type="" @click="addNode" style="border: none"><i class="iconfont icon-plus icon-color"></i>添加节点</el-button> -->
            <el-button size="mini" type="" @click="clearAll" style="border: none"><i class="iconfont icon-trash icon-color"></i>清除面板
            </el-button>
            <!-- <el-button size="mini" type="" @click="addSubNode" style="border: none"><i class="iconfont icon-fenxi icon-color"></i>添加子节点</el-button>
                    <el-button size="mini" type="" @click="removeNode" style="border: none"><i class="iconfont icon-trash icon-color"></i>删除项</el-button> -->
          </el-form-item>

          <!-- <el-dropdown style="line-height: 35px;border-left: 2px solid #d7d7d7;padding-left: 15px;cursor: pointer">
                    <span>
                      布局&nbsp;<i class="el-icon-caret-bottom el-icon-right"></i>
                      </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>布局一</el-dropdown-item>
                      <el-dropdown-item>布局二</el-dropdown-item>
                      <el-dropdown-item>布局三</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>

                  <el-dropdown style="line-height: 35px;border-right: 2px solid #d7d7d7;margin:0 15px;padding-right: 15px;cursor: pointer">
                    <span>
                      标记&nbsp;<i class="el-icon-caret-bottom el-icon-right"></i>
                      </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>标记一</el-dropdown-item>
                      <el-dropdown-item>标记二</el-dropdown-item>
                      <el-dropdown-item>标记三</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown> -->
          <el-form-item label="搜索">
            <div data-v-5c0f8fba="" class="el-input" style="width: 150px;">
              <i class="el-input__icon el-icon-search"></i>
              <input autocomplete="off" placeholder="关键字查找节点" v-model="form.keyword" @keyup.enter="findNode" icon="search" type="text" rows="2" validateevent="true" class="el-input__inner" />
            </div>
          </el-form-item>

          <el-form-item label="展示到研判报告">
            <el-switch v-model="form.showInRecord" on-text="展示" on-value="1" off-value="0" off-text="隐藏"></el-switch>
          </el-form-item>

          <span style="color: #999;float: right;line-height: 36px">已全部加载</span>
        </el-row>
      </el-col>

      <el-col :span="24" style="overflow: hidden;position:relative;">
        <div v-draggable="panelDraggableOptions" class="color-panel">
          <div id="brainMapEditPanel"></div>
        </div>
        <!-- TreeLayout -->
        <gocharts ref="goBox" class="maker-box" :data="chartData" :options="{readOnly:readOnly,
                    allowZoom :true, 
                    layout: 'ForceDirectedLayout',
                    inspector: inspector
                  }" @update:data="val=>postData=val" @update:imageData="updateImageData"></gocharts>
      </el-col>
    </el-row>
  </el-form>
</div>


<div class="app-toolbar footer" v-if="listShow">
  <pagination :count="pagenav.count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
</div>
</div>
</template>
<style lang="scss" scoped>
  .app-content-box {
    height: calc(100% - 139px);
    background: #fff;
    margin-top: 3px;
  }

  .icon-color {
    color: #169bd5;
  }

  .maker-box {
    width: 100%;
    height: calc(100vh - 290px);
  }

</style>
<style lang="scss">
  .brain-map {
    .el-form-item.explain {
      .el-form-item__content {
        width: 600px;
      }
    }
  }

  .color-panel {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 99999;
    min-width: 125px;
    min-height: 96px;
  }

  .color-panel-title {
    border: 1px solid #ccc;
    text-align: center;
  }

</style>

<script>
  import { mapState } from 'vuex'
  import { GET_CASE_INFO, FETCH_BRAINMAP, POST_BRAINMAP, UPDATE_BRAINMAP, GET_BRAINMAP, REMOVE_BRAINMAP } from '../../../store/types'

  import { IMAGE_CONVERSION_PATH } from '../../../config'

  import mixin from '../../../utils/mixin'

  import gocharts from '../../../widgets/gocharts/gocharts'
  import pagination from '../../../widgets/pagination/pagination'

  export default {
    mixins: [mixin],
    components: {
      gocharts,
      pagination
    },
    data() {
      return {
        panelDraggableOptions: {
          handle: '.color-panel-title',
          children: '.color-panel',
          range: {
            left: -10000,
            top: 0,
            width: 10000,
            height: 10000
          }
        },
        inspector: {
          containerId: 'brainMapEditPanel',
          properties: {
            '背景': {
              show: window.Inspector.showIfPresent,
              type: 'color'
            },
            '文字': {
              show: window.Inspector.showIfPresent,
              type: 'color'
            },
            'key': {
              show: false
            },
            category: {
              show: false
            },
            loc: {
              show: false
            },
            name: {
              show: false
            },
            text: {
              show: false
            },
            isToLink: {
              show: false
            },
            from: {
              show: false
            },
            to: {
              show: false
            },
            curviness: {
              show: false
            }
          }
        },
        screenshotAction: IMAGE_CONVERSION_PATH,
        listShow: true,
        postData: null,
        readOnly: false,
        chartData: {
          nodeDataArray: [],
          linkDataArray: []
        },
        cjrId: '',
        chartImage: '',
        form: {
          id: '',
          title: '临时模型',
          type: '0',
          remark: '',
          keyword: '',
          showInRecord: '0'
        },
        pagenav: { limit: 10, currentpage: 1, count: 0 },
        list: []
      }
    },
    computed: {
      H() {
        return document.body.scrollHeight - 150 - 45 - 60 + 'px'
      },
      caseId() {
        let res
        if (this.$route.query) {
          res = this.$route.query.a
        } else {
          res = ''
        }
        return res
      },
      ...mapState(['brainmap', 'caseInfo'])
    },
    watch: {
      pagenav: {
        handler() {
          this.fetchList()
        },
        deep: true
      }
    },
    methods: {
      findNode(e) {
        let nodeList = this.$refs.goBox.mainGo.diagram.model.nodeDataArray;
        let nodeFinded = nodeList.find(r => {
          return r.name.includes(this.form.keyword)
        })
        if (nodeFinded) {
          let diagram = this.$refs.goBox.mainGo.diagram;
          let node = diagram.model.findNodeDataForKey(nodeFinded.key);
          // diagram.model.setDataProperty(node, 'isHighlighted', true)
          console.log(node)
        }
      },
      fetchList() {
        if (this.checkUserRuleCase('ajgl/reconnaissancemap/list', this.caseId, true, this.cjrId)) {
          this.dispatch(FETCH_BRAINMAP, {
            ajid: this.caseId,
            PageIndex: this.pagenav.currentpage,
            PageSize: this.pagenav.limit
          }).then(() => {
            this.list = this.brainmap.list.PageData.map(d => {
              this.pagenav.count = this.brainmap.list.DataCount
              return {
                id: d.id,
                title: d.bt,
                state: d.gkzt === '1' ? '公开' : '不公开',
                explain: d.sm,
                founder: d.cjrxm,
                createTime: d.cjsj,
                isCreater: d.sfcjr === '1'
              }
            })
          })
        }
      },
      reload() {
        if (this.pagenav.currentpage === 1) {
          this.fetchList()
        } else {
          this.pagenav.currentpage = 1
        }
      },
      add() {
        this.readOnly = false
        this.form.id = ''
        this.initChart()
        this.listShow = false
      },
      detail(id) {
        this.readOnly = true
        this.openDetail(id)
      },
      edit(id) {
        this.readOnly = false
        this.openDetail(id)
      },
      openDetail(id) {
        this.dispatch(GET_BRAINMAP, {
          id: id
        }).then(() => {
          let d = this.brainmap.detail
          this.chartData = JSON.parse(d.dt)
          this.form = {
            id: id,
            title: d.bt,
            type: d.gkzt,
            remark: d.sm,
            keyword: '',
            showInRecord: d.sfzs
          }
          this.listShow = false
        })
      },
      /**
       * [initChart 初始化GO图表]
       * @return {[type]} [description]
       */
      initChart() {
        console.log(this.caseInfo);
        // 如新建, 默认存在案件基本节点
        this.chartData = {
          nodeDataArray: [{
            key: 0,
            category: 'main',
            loc: '-501 -169.5',
            name: this.caseInfo.Model.ajmc,
            text: this.caseInfo.Model.ajmc,
            '背景': '#74a1c0',
            '文字': '#fff'
          }],
          linkDataArray: []
        }
      },
      /**
       * [clearAll 清空]
       * @return {[type]} [description]
       */
      clearAll() {
        this.loading = true
        this.initChart()
        setTimeout(() => {
          this.$refs.goBox.initMaker()
          this.loading = false
        }, 300)
      },
      /**
       * [makeImage 产图]
       * @return {[type]} [description]
       */
      makeImage() {
        console.log('makeImage')
        this.$refs.goBox.makeImage()
      },
      updateImageData(val) {
        console.log('updateImage')
        this.chartImage = val.data;
        this.$nextTick(() => {
          this.$refs.caseBrainExport.submit();
          this.$message({
            type: 'success',
            message: '导出成功！',
            duration: 1500
          })
        })
      },
      /**
       * [save 保存]
       * @return {[type]} [description]
       */
      save() {
        let source = this.form.id === '' ? POST_BRAINMAP : UPDATE_BRAINMAP
        this.$refs.goBox.commitData()
        this.dispatch(source, {
          id: this.form.id,
          bt: this.form.title, // 标题
          gkzt: this.form.type, // 公开状态1公开，0不公开
          sm: this.form.remark,
          ajid: this.caseId, // 案件id
          sfzs: this.form.showInRecord, // 是否展示到研判报告
          dt: JSON.stringify(this.postData) // 导图
        }).then(() => {
          this.$message({
            type: 'success',
            message: '导图保存成功',
            showClose: true
          })
          this.listShow = true
          this.reload()
        })
      },
      remove(id) {
        this.$confirm('确定要删除此导图?', '温馨提示', {
          type: 'warning'
        }).then(() => {
          this.dispatch(REMOVE_BRAINMAP, {
            id: id
          }).then(() => {
            this.$message({
              type: 'success',
              message: '导图删除成功',
              showClose: true
            })
            this.reload()
          })
        })
      }
    },
    created() {
      this.cjrId = this.$route.query.b // 初始化获取案件创建人id
    },
    mounted() {
      this.fetchList()
      this.dispatch(GET_CASE_INFO, { data: { id: this.caseId } })
    }
  }

</script>
