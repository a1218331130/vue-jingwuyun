<template>
 <div class="page-container">
  <div class="container is-vertical">
    <div class="header">
      {{systemName}}
    </div>
    <div class="main">
      <el-row class="content">
        <p>友情提示：</p>
        <p style="text-indent: 2em;">由于{{systemName}}需要在IE浏览器下运行，请复制下面地址到IE浏览器访问。</p>
        <el-form>
          <el-form-item :label="copyTextLabel">
            <el-input v-model="jumpUrl">
                <el-button slot="append" @click="copy" class="clip-copy"
 :data-clipboard-text="jumpUrl">复制地址</el-button>
            </el-input>

          </el-form-item>
          </el-form>
          <div v-if="systemName === '车辆查缉布控平台'">
        <p style="text-indent:2em;">注：登录平台前请先确认是否已经安装平台播放器，否则无法正常登录。</p>
        <p style="text-align:center;">
        <span style="vertical-align:middle;">点击下载安装：</span>
          <a href="http://10.146.12.134/ActiveX/MediaPlugin.exe" class="download-btn"> 
          <img src="../assets/vedioOCX.png">
          </a>
        </p>
        </div>
      </el-row>
    </div>
  </div>
  </div>
  </template>
<style lang="scss" scoped>
  .page-container {
    background: url(/static/img/main_bg3.df1bbaa.jpg) no-repeat center top;
  }

  .container {
    background-color: #fff;
    max-width: 800px;
    border: 1px solid #85c0e9;
    margin: 100px auto;
    box-shadow: 3px 3px 6px #555;
    padding: 20px 50px;
    display: flex;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    &.is-vertical {
      flex-direction: column;
    }
  }

  .header {
    text-align: center;
    height: 60px;
    line-height: 60px;
    font-size: 30px;
    color: #333;
    padding: 20px;
    flex-shrink: 0;
    border-bottom: 1px solid #959EA0;
  }

  .main {
    flex: 1;
    flex-basis: auto;
    overflow: auto;
    box-sizing: border-box;
    padding: 20px;
  }

  .content {
    max-width: 800px;
    margin: 10px auto;
  }

  .download-btn {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
  }

</style>
<script>
  import Clipboard from 'clipboard';
  export default {
    data() {
      return {
        jumpUrl: '',
        systemName: '车辆查缉布控平台',
        copyTextLabel: '单点登录地址'
      }
    },
    methods: {
      downloadPlugin() {
        console.log('download')
      },
      copy() {
        let clipboard = new Clipboard('.clip-copy');
        clipboard.on('success', e => {
          this.$message({
            type: 'info',
            message: '复制成功'
          })
          clipboard.destroy();
        })
        clipboard.on('error', e => {
          clipboard.destroy();
        })
      }
    },
    created() {
      console.log('ie-message-jump', this.$route.query.jumpPage);
      this.jumpUrl = `${this.$route.query.jumpPage}?token=${this.$route.query.token}`;
      this.systemName = `${this.$route.query.sysName ? this.$route.query.sysName : this.systemName}`;
      this.copyTextLabel = `${this.$route.query.sysName ? '登录地址' : this.copyTextLabel}`
    }
  }

</script>
