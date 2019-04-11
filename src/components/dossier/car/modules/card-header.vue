<!-- 各个模块头部工具区域 -->
<template>
<div class="header-tool">
  <span class="d-sub-title iconfont icon-iconziti23">{{title}}</span>
  <el-button type="text" :class="{'iconfont':true,'icon-packup-2':flag,'icon-unfold1':!flag}" style="line-height: 25px;padding: 10px" v-if="expand" @click="isShow"></el-button>
  <dl class="handle-tool" v-if="tool==='share'">
    <!--<dd >关注</dd>-->
    <!--<dd class="iconfont icon-share">分享</dd>-->
    <form ref="form" :action="rod+'jwy/vehicleFile/exportword'" method="post">
      <input type="hidden" :value="carKey" name="cphm">
      <input type="hidden" :value="jdcfdjddjh" name="jdcfdjddjh">
      <input type="hidden" name="token" :value="userData.UserToken">
    </form>
    <dd>
      <el-button type="text" class="export-text iconfont icon-daochu" @click="
  exportWord
">导出</el-button>
      <html-to-image :height="snapshotHeight" :el="snapshotDOM" :printName="snapshotName" :submit="snapshot" @generate="exportWord"></html-to-image>
    </dd>
    <dd>
      <el-button type="text" class="export-text iconfont icon-daochu" @click="exportSnapshot">快照</el-button>
      <html-to-image :height="snapshotHeight" :el="snapshotDOM" :printName="snapshotName" :submit="snapshot" @generate="generateState"></html-to-image>
    </dd>
    <dd>
      <print-button btnType="text" class="print-text iconfont icon-dayin" printRange="dossier-list-ref"></print-button>
    </dd>
    <!-- <dd>
      <printButton btnType="text" printRange="#dossier-list-ref" class="print-text iconfont icon-dayin"></printButton>
    </dd> -->
  </dl>
  <el-button v-else-if="tool==='addbtn'" icon="plus" @click="dialogformvisible=true" size="mini" class="import-btn add">&nbsp新增
  </el-button>
  <div v-else></div>
  <el-dialog v-draggable="dialogDraggableOptions" :title=logtitle :visible.sync="dialogformvisible">
    <!--车主信息-->
    <div v-if="type==1">
      <el-form :model="kinshipnFrom" label-width="120px" ref="kinshipnFrom">
        <el-form-item prop="xm" label="姓名" :rules="[{required: true, message: '必须输入姓名'}]">
          <el-input v-model.trim="kinshipnFrom.xm" placeholder="请输入人员姓名" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="证件号码" prop="zjhm" :rules="[{required: true, message: '必须输入证件号码'},{type:'number', message: '请输入正确的证件号码'}]">
          <el-input v-model.number="kinshipnFrom.zjhm" placeholder="请输入证件号码" :maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="人员描述" prop="ms" :rules="[{required: true, message: '必须输入人员描述'}]">
          <el-input type="textarea" :row="2" v-model.trim="kinshipnFrom.ms" placeholder="请输入人员描述" :maxlength="300"></el-input>
        </el-form-item>
        <el-form-item style="text-align:center" label-width="0px">
          <el-button type="primary" @click="kinshipnFromsubmit('kinshipnFrom')">确定</el-button>
          <el-button type="primary" @click="dialogformvisible=false">取消</el-button>
        </el-form-item>
      </el-form>

    </div>

  </el-dialog>
</div>
</template>
<style scoped lang="scss">
  .import-btn {
    float: right;
    margin: 9px;
  }

  .expandMark {
    float: right;
    font-size: 18px;
  }

  .header-tool {
    overflow: hidden;
    border-bottom: 2px solid #46BDFD;
    color: #46BDFD;
  }

  .d-sub-title {
    float: left;
    font-size: 14px;
    line-height: 45px;
  }

  .text-c {
    text-align: center;
  }

  .handle-tool {
    float: right;
    padding: 0;
    margin: 9px;
    dd {
      float: left;
      width: 65px;
      height: 28px;
      background-color: #46BDFD;
      line-height: 28px;
      color: #fff;
      text-align: center;
      font-size: 14px;
      margin-left: 10px;
      cursor: pointer;
      .print-text {
        padding: 0;
        color: #fff;
        font-size: 14px;
        width: 100%;
        height: 100%;
      }
      &.bg-yello {
        background-color: #FF9900;
      }
      .export-text {
        padding: 0;
        color: #fff;
        font-size: 14px;
        width: 100%;
        height: 100%;
      }
      &:hover {
        background-color: #ff9900;
      }
    }
    .icon-move:before {
      margin-right: 3px;
    }
    .icon-save:before {
      margin-right: 3px;
    }
    .icon-export:before {
      margin-right: 3px;
    }
  }

</style>
<script>
  import { FWZX_PATH } from '../../../../config'
  import printButton from '../../../../widgets/print/print.vue'
  // import printButton from '../../../../widgets/print/jq-print.vue'
  import htmlToImage from '../../../../widgets/html-image/html-to-image.vue'
  import { closestRef, outerHeight } from '../../../../utils/util'
  import dossierMixin from '../../dossierMixin'
  import { NEW_ARCHIVES, ADD_CHE_ZHU_INFO } from '../../../../store/types'
  import { mapState } from 'vuex'
  export default {
    mixins: [dossierMixin],
    data() {
      return {
        rod: FWZX_PATH,
        flag: false, // 展开收起标记
        snapshot: false,
        snapshotName: '车辆档案',
        snapshotHeight: 0,
        snapshotDOM: document.body,
        dialogformvisible: false,
        // 亲属人员
        kinshipnFrom: {
          xm: '',
          zjhm: '',
          cphm: '',
          ms: ''
        }
      }
    },
    props: {
      title: {
        type: String,
        default: '标题'
      },
      jdcfdjddjh: {
        type: String,
        default: ''
      },
      tool: {
        type: String,
        default: ' '
      },
      type: {
        type: Number,
        default: 1
      },
      tableData: {},
      logtitle: {
        type: String,
        default: ' '
      },
      carKey: {
        type: String,
        default: ' '
      },
      expand: {
        type: Boolean,
        default: false
      }
    },
    components: {
      htmlToImage,
      printButton
    },
    watch: {
      tableData(val) {
        val.length ? this.flag = true : this.flag = false
        if (val.length !== 0) {
          this.$emit('on-update-expand', true)
        }
      }
    },
    methods: {
      exportSnapshot() {
        // 开始导出
        closestRef(this, 'dossier-list-ref', dom => {
          this.snapshotHeight = outerHeight(dom)
          this.snapshotDOM = dom
          this.$('.handle-tool').css({ 'display': 'none' })
          this.$('.dossier-list-context').css({ 'padding': '20px 10px' })
          this.$nextTick(_ => {
            this.snapshot = true
          })
        })
      },
      generateState(type) {
        // 快照生成结束,状态重置
        this.$('.handle-tool').css({ 'display': 'block' })
        this.$('.dossier-list-context').css({ 'padding': '20px 0' })
        this.snapshot = false
      },
      exportWord(val) {
        console.log(this.carKey, 'carKey');
        this.$refs.form.submit()
      },
      onsubmit(ruleform) {
        let addObject = {
          ArchivesType: '2',
          Keyword: this.carKey,
          Module: this.title,
          CustomType: this.form.qsgx,
          KeyContent: this.form.qszjh,
          Detail: this.form.ms,
          IsOpen: '0',
          Reservation1: this.form.qsgx,
          Reservation2: this.form.qsxm
        }
        this.dispatch(NEW_ARCHIVES, addObject).then(() => {
          this.$message('档案添加成功');
          this.resetform();
          this.dialogformvisible = false
        })
      },
      // 新增亲属人员
      kinshipnFromsubmit(kinshipnFrom) {
        let addObject = {
          cphm: this.carKey,
          xm: this.kinshipnFrom.xm,
          zjhm: this.kinshipnFrom.zjhm,
          ms: this.kinshipnFrom.ms,
          fdjh: this.jdcfdjddjh
        }
        this.$refs.kinshipnFrom.validate((valid) => {
          if (valid === true) {
            this.dispatch(ADD_CHE_ZHU_INFO, addObject).then(() => {
              this.$message('档案添加成功');
              this.resetform();
              this.dialogformvisible = false
              this.$emit('call:change-update')
            })
          }
        })
      },
      resetform() {
        for (let key in this.form) {
          if (this.form[key] instanceof Array) {
            this.form[key] = []
          } else {
            this.form[key] = ''
          }
        }
      },
      // 列表展开与收起
      isShow() {
        this.flag ? this.flag = false : this.flag = true
        this.$emit('on-update-expand', this.flag)
      }
    },
    created() {},
    computed: {
      ...mapState(['dossier'])
    }
  }

</script>
