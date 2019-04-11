<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="申请详情" :modal-append-to-body="true" :append-to-body="true" size="bigest--fixed" :modal="false" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-row v-loading="loading" v-if="checkRule('Xtbg/GetXcxxData')===true">
    <el-col :span="24">
      <div :class="{'detail-box':true,'detail-box--m':showCtrl === true}">
        <div :ref="snapshotParentRef" v-if="assistInfo!==null" style="background: #fff;padding: 10px;">
          <div class="detail-box__title">
            {{baseInfo.Title}}
            <div class="detail-box__btn-box">
              <!--<el-button type="primary" size="small" icon="icon iconfont icon-share">分享</el-button>-->
              <el-button type="primary" size="small" icon="icon iconfont icon-export" @click="exportSnapshot">导出
              </el-button>
              <!--<el-button type="primary" size="small" icon="icon iconfont icon-dayin">打印</el-button>-->
            </div>
          </div>
          <div class="detail-box__step-box">
            <el-steps v-if="list.length>0" :space="190" :active="list[list.length-1].handler===''?list.length-1:list.length" finish-status="success">
              <el-step v-for="item in list" :key="item.id" :title="item.title+'-'+(list[list.length-1].handler===''?'待处理':item.handler)" :description="item.sendTime"></el-step>
              <!-- <el-step title="评论"></el-step> -->
            </el-steps>
          </div>

          <el-form :model="form" label-width="100px">
            <el-row>
              <div class="base-box">
                <el-col :span="24">
                  <el-form-item label="配侦部门">
                    <span>{{assistInfo.JzlxMc}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="协查标题">{{baseInfo.Title}}</el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                      <el-form-item label="协查编号"></el-form-item>
                    </el-col> -->
                <!-- <el-col :span="12">
                  <el-form-item label="案件编号">{{baseInfo.CaseNo}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="案件名称">{{baseInfo.CaseName}}</el-form-item>
                </el-col> -->
                <el-col :span="24">
                  <el-form-item label="警情摘要">{{baseInfo.CaseNote}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="紧急程度">{{getLeveName(baseInfo.Level)}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话">{{baseInfo.Tel}}</el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="附件列表">
                    <div class="detail-box__attachment">
                      <a class="detail-box__attachment__item" v-for="item in baseInfo.FileInfos" :href="downloadFilePath+item.ID" :download="item.Name">
                          <i :class="'iconfont ' + getFileIconByType(item.Extend)"></i><span
                          class="detail-box__attachment__filename cursor--pointer">{{item.Name}}</span>
                        </a>
                    </div>
                  </el-form-item>
                </el-col>
              </div>
            </el-row>
          </el-form>

          <div class="detail-box__title">协作单位</div>
          <!--<el-tabs>-->
          <!--<el-tab-pane label='技侦'>-->
          <el-form ref="form" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="协办单位">
                  {{assistInfo.OrgName}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="协办模板">
                  {{assistInfo.MbMc}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="反馈期限">
                  {{assistInfo.FeedbackTime}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否超期">
                  {{assistInfo.FeedbackOverdue === '1' ? '是' : '否'}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="侦查要求">
                </el-form-item>
              </el-col>
            </el-row>
            <!-- style="text-align:center;" -->
            <div style="margin-left:20px" v-html="assistInfo.Note">
              <!-- <img src="/static/img/test/f.jpg"> -->
            </div>
            <div>
              <el-form-item label="附件列表">
                <div class="detail-box__attachment">
                  <a class="detail-box__attachment__item" v-for="item in assistInfo.FileInfos" :href="downloadFilePath+item.ID" :download="item.Name">
                      <i :class="'iconfont ' + getFileIconByType(item.Extend)"></i><span
                      class="detail-box__attachment__filename cursor--pointer">{{item.Name}}</span>
                    </a>
                </div>
              </el-form-item>
            </div>
          </el-form>
          <!--</el-tab-pane>-->
          <!--</el-tabs>-->

          <div class="detail-box__title">流程明细</div>
          <el-table @cell-mouse-enter="cellMouseEnter" :data="list" border>
            <el-table-column label="序号" prop="id" width="80"></el-table-column>
            <el-table-column label="步骤名称" prop="title" width="100"></el-table-column>
            <!--<el-table-column label="发送人" prop="sender" width="80"></el-table-column>-->
            <el-table-column label="发送时间" prop="sendTime" width="200"></el-table-column>
            <el-table-column label="处理人" prop="handler" width="80"></el-table-column>
            <el-table-column label="处理时间" prop="handleTime" width="200"></el-table-column>
            <el-table-column label="状态" prop="state" width="80"></el-table-column>
            <el-table-column label="意见" prop="opinion"></el-table-column>
          </el-table>

          <div class="detail-box__title" v-if="dueList.length>0">督导意见</div>
          <el-row v-for="elem in dueList" :key="elem.time" style="margin: 10px 0;">
            <el-col :span="6">
              <span v-if="elem.type=1">建议人：</span>
              <span v-if="elem.type=0">回复人：</span>
              <span style="font-weight: bold;">{{elem.person|| '暂无'}}</span>
            </el-col>
            <el-col :span="12">
              <span style="font-weight: bold;">{{elem.content}}</span>
            </el-col>
            <el-col :span="6">时间：
              <span style="font-weight: bold;">{{elem.time}}</span>
            </el-col>
          </el-row>

          <div v-show="assistInfo.FkjgModel.length>0" class="detail-box__title">反馈结果</div>
          <el-form v-show="assistInfo.FkjgModel.length>0" label-width="100px">
            <div v-for="(freebackItem,freebackI) in assistInfo.FkjgModel" :key="freebackI">
              <p>{{freebackItem.Feedback || '暂无'}}</p>
              <el-form-item v-if="freebackItem.FileInfos.length>0" label="附件列表">
                <div class="detail-box__attachment">
                  <a class="detail-box__attachment__item" v-for="item in assistInfo.FileInfos" :href="downloadFilePath+item.ID" target="_blank">
                      <i :class="'iconfont ' + getFileIconByType(item.Extend)"></i><span
                      class="detail-box__attachment__filename cursor--pointer">{{item.Name}}</span>
                    </a>
                </div>
              </el-form-item>
            </div>
          </el-form>

          <div class="detail-box__title" v-show="assistInfo.PjxxModel.length>0">评价</div>
          <el-form class="detail-box__comment-box" v-show="assistInfo.PjxxModel.length>0">
            <el-row v-for="(commentItem,commentI) in assistInfo.PjxxModel" :key="commentI">
              <el-col :span="12">
                <el-form-item label="质量">
                  <el-rate v-model="commentItem.QualityScore" disabled></el-rate>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="效率">
                  <el-rate v-model="commentItem.EfficiencyScore" disabled></el-rate>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="评价">
                  {{commentItem.EvaluativeInfo}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="战果">{{commentItem.IsVictory === '1' ? '有' : '无'}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="抓获人数">{{commentItem.VictoryPersonNum}}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div :class="{'ctrl-box':true,'ctrl-box--m':showCtrl===true}" v-if="!type===false && type !== 6">
        <el-button type="text" class="btn-switch" @click="switchCtrl"><i :class="{iconfont:true, 'icon-unfold1':showCtrl === true,  'icon-packup-2':showCtrl === false}"></i>
        </el-button>
        <div class="ctrl-box__content" v-if="id!==null&&assistInfo!==null">
          <!-- <reply v-if="type===0" :assistId="id" :processId="assistInfo.Lczbid"></reply> -->
          <sign v-if="type===1" :assistId="id" :processId="assistInfo.Lczbid" @close="closeEvent"></sign>
          <examine v-if="type===2" :assistId="id" :processId="assistInfo.Lczbid" @close="closeEvent"></examine>
          <assign v-if="type===3" :assistId="id" :processId="assistInfo.Lczbid" @close="closeEvent"></assign>
          <comment v-if="type===4" :assistId="id" :processId="assistInfo.Lczbid" @close="closeEvent"></comment>
          <feedback v-if="type===5" :assistId="id" :processId="assistInfo.Lczbid" @close="closeEvent"></feedback>
        </div>
      </div>
      <div :class="{'ctrl-box':true,'ctrl-box--s':showCtrl===true}" v-if="!type===false && type===6">
        <el-button type="text" class="btn-switch" @click="switchCtrl"><i :class="{iconfont:true, 'icon-unfold1':showCtrl === true,  'icon-packup-2':showCtrl === false}"></i>
        </el-button>
        <div class="ctrl-box__contents" v-if="id!==null&&assistInfo!==null">
          <supervisor v-if="type===6" :assistId="id" :processId="assistInfo.Lczbid" :steer="due" @close="closeEvent"></supervisor>
        </div>
      </div>
      <div :class="{'ctrl-box':true,'ctrl-box--s':showCtrl===true}" v-if="type===0&&dueList.length>0">
        <el-button type="text" class="btn-switch" @click="switchCtrl"><i :class="{iconfont:true, 'icon-unfold1':showCtrl === true,  'icon-packup-2':showCtrl === false}"></i>
        </el-button>
        <div class="ctrl-box__contents" v-if="id!==null&&assistInfo!==null">
          <reply v-if="type===0" :assistId="id" :processId="assistInfo.Lczbid" :steer="due" @close="closeEvent"></reply>
        </div>
      </div>
    </el-col>
  </el-row>

  <html-to-image :height="snapshotHeight" :printName="snapshotName" :submit="snapshot" @generate="generateState" :el="snapshotDom"></html-to-image>
</el-dialog>
</template>
<style lang="scss" scoped>
.detail-box {
    height: calc(65vh - 30px);
    padding: 0 15px;
    overflow-y: auto;
    &--m {
        height: calc(40vh - 30px);
    }
    &__title {
        font-size: 16px;
        color: #46bdfd;
        height: 38px;
        line-height: 38px;
        margin-bottom: 10px;
        border-bottom: 2px solid #4db8ff;
        position: relative;
    }
    &__btn-box {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
    }
    &__step-box {
        width: 850px;
        margin: 0 auto 20px;
        overflow: hidden;
    }
    &__attachment {
        &__item {
            margin-right: 10px;
        }
        .icon {
            font-size: 20px;
            vertical-align: middle;
            margin-right: 5px;
            display: inline-block;
            &-word {
                color: #4c83e5;

            }
        }
        &__filename {
            font-size: 12px;
            color: #0099ff;
            text-decoration: underline;
        }
    }
    &__comment-box {
        line-height: 22px;
        padding: 20px;
    }
}

.ctrl-box {
    background: #F8F8F8;
    width: 100%;
    height: 1px;
    border-top: 1px solid #ccc;
    position: relative;
    // transition: 0.3s;
    &--m {
        height: calc(25vh - 30px);
    }
    &--s {
        height: calc(19vh - 16px);
    }
    &__content {
        width: 100%;
        height: 100%;
        overflow: hidden;
        overflow-y: auto;
    }
    &__contents {
        width: 100%;
        height: 107%;
        overflow: hidden;
        overflow-y: auto;
    }
    .btn-switch {
        background: #fff;
        text-align: center;
        width: 80px;
        height: 30px;
        line-height: 30px;
        padding: 0;
        border: 1px solid #ccc;
        border-bottom: 0;
        border-radius: 5px 5px 0 0;
        cursor: pointer;
        opacity: 0.8;
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        &:hover {
            opacity: 1;
        }
        .iconfont {
            margin: 0;
        }
    }
}
</style>
<script>
import { mapState } from 'vuex'
import { GET_UNION_ASSIST_DETAIL, GET_PROCESS_DETAIL, GET_UNION_STEERING } from '../../../store/types'

import mixin from '../../../utils/mixin'

import sign from './sign'
import examine from './examine'
import assign from './assign'
import comment from './comment'
import feedback from './feedback'
import supervisor from './supervisor'
import reply from './reply'

import htmlToImage from '../../../widgets/html-image/html-to-image.vue'
import { outerHeight, clone } from '../../../utils/util'

export default {
  mixins: [mixin],
  components: {
    sign,
    examine,
    assign,
    comment,
    htmlToImage,
    feedback,
    supervisor,
    reply
  },
  data() {
    return {
      dueList: [],
      dictList: null,
      showCtrl: false,
      form: null,
      assistInfo: null,
      baseInfo: null,
      // 导出图片快照相关配置start
      snapshot: false,
      snapshotDom: document.body,
      snapshotName: '协同办公',
      snapshotHeight: 0,
      snapshotParentRef: 'dialog-union-detail_ref',
      // 导出图片快照相关配置end
      list: [],
      feedbackContent: '反馈结果: 同意'
    }
  },
  // type:0:普通详情, 1:签收, 2:审批, 3:指派, 4:评价, 5:反馈, 6:督导
  props: ['dialog', 'id', 'type', 'due'],
  // props: {
  //   dialog: {
  //     type: String,
  //     default: ''
  //   },
  //   id: {
  //     type: String,
  //     default: ''
  //   },
  //   type: {
  //     type: Number,
  //     default: 0
  //   },
  //   due: {
  //     type: Object,
  //     default: {}
  //   },
  //   size: {
  //     type: String,
  //     default: 'bigest'
  //   }
  // },
  computed: {
    ...mapState(['union', 'process'])
  },
  methods: {
    initDialog() {
      if(this.id !== null) {
        this.getDetail()
      }
      this.showCtrl = true
      // this.showCtrl = !this.type === true
    },
    getDetail() {
      if(this.checkRule('Xtbg/GetXcxxData') === false) {
        return false
      }
      this.dispatch(GET_UNION_ASSIST_DETAIL, {
        KeyId: this.id
      }).then(() => {
        this.assistInfo = clone(this.union.assistDetail)
        this.assistInfo.Note = decodeURIComponent(this.assistInfo.Note)
        this.baseInfo = this.assistInfo.JbxxModel
        if(this.assistInfo.Lczbid != null) {
          this.dispatch(GET_PROCESS_DETAIL, {
            Lczbid: this.assistInfo.Lczbid
          }).then(() => {
            let i = 0;
            this.list = this.process.processDetail.map(d => {
              i++;
              return {
                id: i,
                title: d.FromNodeName,
                // sender: '我', 2017-10-14 xiehuan 不要发送人栏位了
                sendTime: d.SendTime,
                handler: d.HandlerName,
                handleTime: d.HandleTime,
                state: this.getGjState(d.State),
                opinion: d.HandleNote
              }
            })
          })
        }
      })
      this.dispatch(GET_UNION_STEERING, {
        V_XCID: this.id
      }).then(() => {
        this.dueList = this.union.unionSteeringList.map(d => {
          return {
            time: d.CJSJ,
            content: d.CONTENT,
            person: d.USERNAME,
            type: d.TYPE
          }
        })
      })
    },
    getGjState(v) {
      return this.dictList.LC_CLZT.find(d => d.value === v).label
    },
    getLeveName(v) {
      return this.dictList.JJCD.find(d => d.value === v).label
    },
    submit() {
      this.closeEvent()
    },
    closeEvent() {
      this.assistInfo = null
      this.baseInfo = null
      this.list = []
      this.$emit('close')
    },
    switchCtrl() {
      this.showCtrl = this.showCtrl === false
    },
    exportSnapshot() {
      // 开始导出(快照)
      let $dom = this.$(this.$refs['dialog-union-detail_ref']).clone().appendTo(document.body);
      $dom.css('width', '940px');
      this.snapshotDom = $dom[0]
      this.snapshotHeight = outerHeight(this.snapshotDom);
      this.$nextTick(_ => {
        this.snapshot = true
      })
    },
    generateState(type) {
      // 快照生成结束,状态重置
      this.snapshot = false
      this.$(this.snapshotDom).remove();
    }
  },
  created() {
    this.getDict(['JJCD', 'LC_CLZT']).then(res => {
      this.dictList = res
    })
  },
  mounted() {

  }
}
</script>
