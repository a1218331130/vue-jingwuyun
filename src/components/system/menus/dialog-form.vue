<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="协作申请" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">

  <el-form ref="editForm" :model="editForm" label-width="80px">
    <el-form-item label="父菜单">
      <cascader :options="$store.getters.menuTree" :cascaderProps="defaultPropsCascader" @change="cascaderChange" v-model="upParentArry" :disabled="submitType === 'add'"></cascader>
    </el-form-item>

    <el-form-item label="名称" prop="name">
      <el-input v-model="formname" :maxlength="15"></el-input>
    </el-form-item>

    <el-form-item label="顺序" prop="orderNum">
      <el-input v-model.number="formorderNum" :maxlength="2"></el-input>
    </el-form-item>

    <el-form-item label="图标类别" prop="iconType">
      <el-radio-group v-model="iconType">
        <el-radio :label="1">图标</el-radio>
        <el-radio :label="2">字体</el-radio>
      </el-radio-group>
      <icon-upload @uploadSuccessCallback="iconSuccessUpload" :imageUrl="formicon" v-if="iconType === 1" :fileList="fileList"></icon-upload>
      <el-input v-model="formicon" v-if="iconType === 2"></el-input>
      <icon-selector v-model="formicon" :mode="iconType === 1?'image':''"></icon-selector>
    </el-form-item>

    <el-form-item label="类型" prop="type">
      <el-radio-group v-model="formtype" v-if="operate  !== 'update'">
        <el-radio label="0">中心</el-radio>
        <el-radio label="1" v-if="operate  !== 'root'">菜单</el-radio>
        <el-radio label="2" v-if="operate  !== 'root'&& operate === 1">按钮</el-radio>
      </el-radio-group>
      <el-radio-group v-model="formtype" v-if="operate  === 'update'">
        <el-radio :label="0">中心</el-radio>
        <el-radio :label="1">菜单</el-radio>
        <el-radio :label="2">按钮</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="URL" v-if="formtype != 2" prop="url">
      <el-input v-model="formurl" :value="formurl"></el-input>
    </el-form-item>

    <el-form-item label="按钮类型" v-if="formtype == 2" prop="czlx">
      <el-radio-group v-model="formczlx">
        <el-radio label="1">查询</el-radio>
        <el-radio label="2">新增</el-radio>
        <el-radio label="3">修改</el-radio>
        <el-radio label="4">删除</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="服务总线" v-if="formtype == 2" prop="perms">
      <el-select v-model="formperms" style="width: 100%" multiple filterable remote placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
        <el-option v-for="item in permsOps" :key="item.id" :label="item.name" :value="item.id">
          <span style="float:left">{{item.name}}</span>
          <span style="float:right;color:#8492a6;font-size:13px;padding-right:20px;">{{item.ms||''}}</span>
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>

  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit(false)">确定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
  // .el-dialog__body {
  //     padding: 0;
  // }

</style>
<script>
  import mixin from '../../../utils/mixin'
  import { UPLOAD_PATH_SAVE } from '../../../config'

  import { mapState } from 'vuex'
  import { ADD_SYS_MENU, UPDATE_SYS_MENU, GET_SERVICE_BUS, GET_SYS_MENU } from '../../../store/types'

  import { clone } from '../../../utils/util'

  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        defaultPropsCascader: {
          value: 'menuId',
          label: 'name',
          children: 'children'
        },
        fileList: [],
        fileListArry: [],
        form: {
          parentId: [],
          name: '',
          type: '',
          czlx: '1',
          url: '',
          icon: '',
          orderNum: null,
          perms: []
        }
      }
    },
    props: ['dialog', 'id'],
    computed: {
      ...mapState(['menus', 'serviceBus'])
    },
    methods: {
      initDialog() {},
      initData() {
        if (this.id !== null) {}
      },
      submit() {
        this.loading = true
      },
      closeEvent() {
        this.$refs.formresetFields()
        this.$emit('close')
      },
      reset() {
        this.$refs.menuModel.resetFields()
        this.fileListArry = [];
        this.fileList = [];
      },

      remoteMethod(query) {
        this.dispatch(GET_SERVICE_BUS, {
          name: query,
          czlx: this.menuModel.czlx
        }).then(_ => {
          this.permsOps = [...this.serviceBus.serviceBusByName]
        })
      },

      updataMenu(e, data) {
        e.preventDefault();
        e.stopPropagation();
        this.dispatch(GET_SYS_MENU, {
          data: {
            menuId: data.menuId
          }
        }).then(() => {
          let thisMenuObj = this.menus.Model;

          this.menuModel = clone(this.menus.Model)
          this.menuModel.czlx = this.menuModel.appId

          if (thisMenuObj.perms !== null && thisMenuObj.perms.indexOf(',')) {
            this.menuModel.perms = thisMenuObj.perms.split(',')
          }

          if (thisMenuObj.icon !== null && typeof thisMenuObj.icon !== 'undefined') {
            this.fileList = [{
              name: typeof thisMenuObj.icon.split('?')[1] !== 'undefined' ? thisMenuObj.icon.split('?')[1] : data.name,
              url: thisMenuObj.icon.split('?')[0]
            }]
          }

          this.upParentArry = Array.of(this.menuModel.parentId);
          this.submitType = 'updata'
          this.operate = 'update'
          this.dialogTitle = '更新【' + data.name + '】菜单'
          this.menuDialog = true;
        })
      },

      onSubmit() {
        if (this.iconType === 2 || this.fileListArry.length === 0) {
          this.submitInfo({
            data: this.menuModel
          });
          return false
        }
        let fileList = {
          FileDetail: this.fileListArry,
          token: this.userData.UserToken
        };
        this.$http.post(UPLOAD_PATH_SAVE, {
          data: JSON.stringify(fileList)
        }, this.httpSettings).then(res => {
          if (res.body.Status !== 1) {
            console.log('图标上传失败！', res)
            return false;
          }
          this.menuModel.icon = res.body.Data[0].FileAbsPath + res.body.Data[0].FilePath + '?' + res.body.Data[0].FileName + '.' + res.body.Data[0].FileType;
          // todo:开始更新菜单信息
          this.submitInfo({
            data: this.menuModel
          });
        });
      },
      iconSuccessUpload(res, file) {
        //  上传要保存的临时文件
        this.fileListArry = [{
          CreatedTime: res.Data[0].CreatedTime,
          Creator: res.Data[0].Creator,
          CreatorName: res.Data[0].CreatorName,
          FileGuid: res.Data[0].FileGuid,
          FileId: res.Data[0].FileId,
          FileName: res.Data[0].FileName,
          FilePath: res.Data[0].FilePath,
          FileSize: res.Data[0].FileSize,
          FileType: res.Data[0].FileType,
          SourceId: res.Data[0].SourceId,
          UrlFlag: res.Data[0].UrlFlag
        }];
        // 上传列表数据
        this.fileList = [{
          name: file.name,
          url: file.url
        }];
        // icon预览路径
        this.menuModel.icon = URL.createObjectURL(file.raw)
      },

      submitInfo(data) {
        this.menuModel.perms = this.menuModel.perms.join(',');
        this.menuModel.parentId = this.upParentArry[this.upParentArry.length - 1];
        let disType = ADD_SYS_MENU;
        let tipMsgS = '添加菜单成功！'
        let tipMsgI = '添加菜单失败！'
        if (this.submitType === 'updata') {
          disType = UPDATE_SYS_MENU;
          tipMsgS = '更新菜单成功！'
          tipMsgI = '更新菜单失败！'
        }
        this.dispatch(disType, data).then(() => {
          this.$message({
            type: 'success',
            message: tipMsgS
          });
          this.fetchMenu();
          this.closeEvent()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: tipMsgI
          });
          this.fetchMenu();
          this.closeEvent()
        })
      },
      cascaderChange(val) {
        // todo:获取选择最后一级父类
        let pa = val[val.length - 1];
        this.upParentArry = val
        this.menuModel.parentId = pa
      }
    },
    created() {
      this.remoteMethod();
    },
    mounted() {}
  }

</script>
