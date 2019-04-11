<template>
  <div>
    <el-dialog v-draggable="dialogDraggableOptions" size="middle--fixed" :visible.sync="detailDialog" :modal="true" :close-on-click-modal="false"
               :before-close="cancel" title="系统详情">
      <el-row :gutter="10">
        <el-col :span="5">
          <div class="info-logo_box">
            <img :src="data.webLogo">
          </div>
        </el-col>
        <el-col :span="19">
          <el-row>
            <el-col :span="24"><span class="textName">系统名称:</span>{{data.name}}</el-col>
            <el-col :span="24"><span class="textName">系统链接:</span>{{data.link}}</el-col>
            <el-col :span="24"><span class="textName">联系人:</span>{{data.user}}</el-col>
            <el-col :span="24"><span class="textName">联系电话:</span>{{data.phone}}</el-col>
            <el-col :span="24"><span class="textName">单位:</span>{{data.area}}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24"><span class="textName">系统简介:</span>{{data.desc}}</el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <span class="textName">系统功能</span><span v-for="item in data.system" class="system">{{item}}</span>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button class="return" @click="cancel()">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
  .textName {
    color: #999;
    padding-right: 10px;
  }

  .info-logo_box {
    min-width: 100px;
    min-height: 120px;
    overflow: hidden;
    position: relative;
    > img {
      max-width: 100%;
      max-height: 100%;
      position: absolute;
      top: 50%;
      left: 0;
      -webkit-transform:translateY(-50%);
      transform: translateY(-50%);
    }
  }

  .system {
    color: #666;
    padding-right: 10px;
  }
</style>
<script>
  import mixin from '../../../utils/mixin'
  import regulation from '../../../assets/regulation.gif'
  import {DOWNLOAD_FILE_PATH} from '../../../config'
  export default {
    mixins: [mixin],
    data() {
      return {}
    },
    props: ['detailDialog', 'data'],
    computed: {},
    methods: {
      initDialog() {
        // 填充表单基本数据
      },
      cancel() {
        this.$emit('close')
      }
    },
    watch: {
      'data'(val) {
        if (val) {
          this.data.webLogo = val.webLogo ? DOWNLOAD_FILE_PATH + val.webLogo : regulation
        }
      }
    },
    created() {

    },
    mounted() {
    }
  }
</script>
