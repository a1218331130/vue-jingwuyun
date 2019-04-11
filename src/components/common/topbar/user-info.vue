<template>
<div class="header-per">
  <el-popover ref="popover1" placement="bottom" width="260" class="popoverBox" trigger="hover" transition="none">
    <el-row>
      <el-col :span="18">{{userData.UserName}}</el-col>
      <el-col :span="6">
        <div class="cursor--pointer" style="color: #20a0ff;" @click="passEditorDialog=true">
          修改密码
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">{{userData.UserSfz}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span class="nameTip">警号：</span>{{userData.UserCode}}</el-col>
      <el-col :span="12">
        <span class="nameTip">单位：</span>{{userData.DeptName}}</el-col>
    </el-row>
    <el-row>
      <!-- <el-col :span="12"><span class="nameTip">岗位：</span>{{userData.PostName}}</el-col> -->
      <el-col :span="24">
        <span class="nameTip">职务：</span>{{userData.PosLevelName}}</el-col>
    </el-row>
  </el-popover>
  <div class="user-box">
    <div class="infoBox" v-popover:popover1>
      <img v-if="userData.FacePicId!=='' && userData.FacePicId!==null" class="head-portrait" :src="fileBasePath + userData.FacePicId" />
      <data-image v-else class="head-portrait" :idCard="userData.UserSfz"></data-image>
      <dl class="head-user-title">
        <dd>
          {{userData.UserName}}&nbsp;&nbsp;{{userData.PosLevelName}}
        </dd>
        <dd>
          {{userData.DeptName}}
        </dd>
      </dl>
    </div>
    <!-- 顶栏 右侧工具 -->
    <header-tool-list ref="toolList" @showDialog="showDialog"></header-tool-list>
  </div>

  <!-- 密码修改模态窗 -->
  <dialog-pass-editor :dialog="passEditorDialog" @close="passEditorDialog=false"></dialog-pass-editor>
  <!--通告中心弹窗-->
  <notification :dialog="dialogVisible" @close="closeNotice" @call:readed="updateUnreadCount"></notification>
</div>
</template>
<style lang="scss" scoped>
.notification {
    z-index: 99;
}
.header-per {
    float: right;
    margin-right: 20px;
    width: 661px;
    display: flex;
    justify-content: flex-end;
    .infoBox {
        display: inline-block;
        height: 60px;
        float: left;
        margin-right: 20px;
        .head-portrait {
            height: 50px;
            margin-top: 5px;
            float: left;
        }
    }
}

.head-user-title {
    float: left;
    color: #fff;
    margin: 9px auto;
}

.head-user-title > dd {
    margin-left: 10px;
    text-align: left;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dropDownBox {
    height: 60px;
    float: right;
}

i.el-dropdown-link {
    padding: 23px;
    position: absolute;
    top: 0;
    right: 0;
}
</style>
<script>
import mixin from '../../../utils/mixin'
const defaultHead = require('../../../assets/head.jpg')
import Notification from './notification.vue'
import headerToolList from '../topbar/header-tool-list.vue'
import dialogPassEditor from '../../../widgets/dialog-pass-editor/dialog-pass-editor'
import dataImage from '../../../widgets/data-image/data-image'

import { DOWNLOAD_FILE_PATH } from '../../../config'

export default {
  mixins: [mixin],
  components: {
    notification: Notification,
    headerToolList,
    dialogPassEditor,
    dataImage
  },
  data() {
    return {
      passEditorDialog: false,
      dialogVisible: false,
      defaultHead: defaultHead,
      fileBasePath: ''
    }
  },
  computed: {},
  methods: {
    dropMemuEvent(command) {
      if(command === 'logout') {
        this.logout();
      }
      if(command === 'showDialog') {
        this.showDialog();
      }
    },
    showDialog() {
      this.dialogVisible = true;
    },
    closeNotice() {
      this.dialogVisible = false
      // window.location.reload()
      this.$refs.toolList.getUnredCount()
    },
    updateUnreadCount() {
      // this.$refs.toolList.queryNotificationUnredCount()
      this.$refs.toolList.getUnredCount()
    }
  },
  created() {
    this.fileBasePath = DOWNLOAD_FILE_PATH
  }
}
</script>
