<template>
  <div>
    <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="dialogMode==='edit'?'修改系统':'新增系统'" :modal-append-to-body="true" :append-to-body="true"
               size="bigest" :modal="true" :close-on-click-modal="false" @open="initDialog"
               :before-close="closeEvent">
      <el-form :model="navEditForm" ref="navEditForm" label-width="90px" :rules="rules">
        <el-row :gutter="5" style="margin: 10px 20px">
          <el-col :span="24">
            <el-col :span="7">
              <el-form-item label="图片上传">
                <upload uploadType="picture" :isSinglePic="true" :isFormalSubmit="isFormalSubmit"
                        @upload:submit="uploadSubmit" :currentFiles="currentFiles"></upload>
              </el-form-item>
            </el-col>
            <el-col :span="17">
              <el-form-item label="系统名称" prop="name">
                <el-input placeholder="请输入系统名称" v-model="navEditForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="17">
              <el-form-item label="系统链接" prop="link">
                <el-input placeholder="请输入系统链接" v-model="navEditForm.link"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="17">
              <el-form-item label="系统ip" prop="systemIp">
                <el-input placeholder="请输入系统ip" type="text" :maxlength="15"
                          v-model.trim="navEditForm.systemIp"></el-input>
              </el-form-item>
            </el-col>
          </el-col>

          <el-col :span="12">
            <el-form-item label="联系人" prop="user">
              <el-input placeholder="请输入联系人" v-model="navEditForm.user"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input type="phone" placeholder="请输入联系电话" v-model="navEditForm.phone"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="单位" prop="area">
              <el-input placeholder="请输入单位" v-model="navEditForm.area"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="order">
              <el-input placeholder="请输入序号" type="number" min="0" v-model.number="navEditForm.order"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="单点登录" prop="idSSO">
              <el-switch v-model="navEditForm.idSSO" on-text="是" on-value="1" off-text="否" off-value="0"></el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="8" v-if="navEditForm.idSSO === '1'">
            <el-form-item label="密钥" prop="secretKey">
              {{navEditForm.secretKey}}
            </el-form-item>
          </el-col>
          <el-col :span="8" v-else>&nbsp</el-col>

          <el-col :span="12">
            <el-form-item label="支持IE" prop="by1">
              <el-switch v-model="navEditForm.by1" on-text="是" on-value="1" off-text="否" off-value="0"></el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="系统级别" prop="level">
              <el-radio-group v-model="navEditForm.level">
                <el-radio v-for="item in levelList" :key="item.id" :label="item.id">{{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="系统分类" prop="type">
              <el-checkbox-group v-model="navEditForm.type" :min="1">
                <el-checkbox v-for="item in dictLists['XTZTCLX']" :key="item.value" :label="item.value">{{item.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="系统功能" prop="system">
              <el-tag :key="tag" v-for="tag in navEditForm.system" :closable="true" :close-transition="false"
                      @close="handleClose(tag)">
                {{tag}}
              </el-tag>
              <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini"
                        @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item label="系统简介" prop="desc">
              <el-input type="textarea" placeholder="请输入系统简介" v-model="navEditForm.desc" :rows="5"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="reset('navEditForm')">重置</el-button>
        <el-button type="primary" @click="submit('navEditForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
  .el-tag.el-tag--primary .el-select__tags-text {
    width: 100%;
    overflow: hidden;
    dislay: inline-block;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  }

  .el-upload-list {
    margin-top: 5px
  }

  .el-upload-list__item.is-success {
    width: 150px;
    float: left;
  }

  .el-upload-list__item:first-child {
    margin-top: 5px;
  }

</style>
<script>
  import {
    UPLOAD_PATH
  } from '../../../config'
  import {
    GET_XTZTC_INFO,
    UPDATE_XTZTC,
    ADD_XTZTC,
    GET_SECRET_KEY
  } from '../../../store/types'
  import mixin from '../../../utils/mixin'
  import {
    mapState
  } from 'vuex'
  import upload from '../../../widgets/upload/upload.vue'

  export default {
    mixins: [mixin],
    components: {
      upload
    },
    data() {
      return {
        isFormalSubmit: false,
        filesObj: {},
        currentFiles: [], // 当前文件集合
        dictLists: [], // 字典集合
        action: UPLOAD_PATH,
        inputVisible: false,
        diaologImageUrl: 'url',
        inputValue: '',
        fileList: [],
        data: {
          data: ''
        },
        levelList: [{id: '3', name: '市级'}, {id: '2', name: '省级'}, {id: '1', name: '部级'}],
        navEditForm: {
          name: '',
          link: '',
          user: '',
          phone: '',
          area: '',
          order: '',
          level: '3',
          idSSO: '0',
          by1: '0',
          secretKey: '',
          type: ['1'],
          system: [],
          systemIp: '',
          desc: '',
          pic: ''
        },
        rules: {
          name: [{
            required: true,
            message: '系统名称不能为空'
          }],
          systemIp: [{
            required: true,
            validator: (r, v, c) => {
              if (!v) {
                c(new Error('系统ip不能为空'))
              }
              let isMatch = v.replace(/^(((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))\.){3}((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))/, '')
              if (isMatch) { // 格式正确
                c(new Error('ip格式不正确'))
              } else {
                c()
              }
            }
          }],
          system: [{
            required: true,
            message: '系统功能不能为空'
          }],
          level: [{
            required: true
          }],
          type: [{
            required: true
          }],
          link: [{
            required: true,
            message: '请输入系统链接'
          }, {
            type: 'url',
            message: '请输入正确格式的网址'
          }],
          phone: [{
            required: true,
            message: '请输入正确格式手机号'
          }]
        }
      }
    },
    props: ['dialog', 'obj', 'editMode'],
    computed: {
      ...mapState(['xtztc', 'dict', 'colleXtztc', 'applyXtztc', 'sooKey']),
      dialogMode() {
        return this.editMode || 'add'
      }
    },
    watch: {
      'navEditForm.systemIp'(val) {
        this.navEditForm.systemIp = val.replace(/[\u2E80-\u9FFF]+/g, '')
      }
    },
    methods: {
      /**
       * 初始化编辑窗口
       * @return {[type]} [description]
       */
      initDialog() {
        // 初始化获取直通车单点登录密钥
        this.querySecretKey()

        this.currentFiles = [] //  清空附件
        this.isFormalSubmit = false; // 初始化图片上传状态
        // 填充表单基本数据
        this.queryDictType() // 初始化表单字典
        if (this.dialogMode === 'edit' && this.obj.id !== '') {
          // 修改
          this.dispatch(GET_XTZTC_INFO, {
            id: this.obj.id
          }).then(d => {
            this.navEditForm = {
              id: this.xtztc.Model.id,
              name: this.xtztc.Model.xtmc,
              link: this.xtztc.Model.xtlj,
              user: this.xtztc.Model.lxr,
              phone: this.xtztc.Model.lxdh,
              area: this.xtztc.Model.dw,
              order: this.xtztc.Model.px,
              level: this.xtztc.Model.xtjb,
              type: this.xtztc.Model.xtlx,
              system: [...this.xtztc.Model.xtgn],
              desc: this.xtztc.Model.jj,
              pic: this.xtztc.Model.pic,
              systemIp: this.xtztc.Model.ip, // 系统ip
              idSSO: this.xtztc.Model.sfdddl, // 是否单点登录
              secretKey: this.xtztc.Model.skey, // 单点登录密钥
              by1: this.xtztc.Model.by1
            }
            if (this.navEditForm.pic) {
              this.currentFiles = [{
                name: 'system web icon',
                id: this.navEditForm.pic
              }]
            }
          })
        } else {
          // (默认)新增
        }
      },
      /**
       * 初始化字典表单
       */
      queryDictType() {
        //  表单字典初始化
        this.getDict(['XTZTCLX']).then(res => {
          this.dictLists = res
        })
      },
      /**
       * 系统功能添加[标签]
       */
      handleClose(tag) {
        this.navEditForm.system.splice(this.navEditForm.system.indexOf(tag), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.navEditForm.system.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      /**
       * 编辑窗关闭事件
       * @return {[type]} [description]
       */
      closeEvent() {
        this.reset()
        this.$emit('close')
        // this.dialog = false
      },
      /**
       * 提交编辑文章表单事件
       * @return {[type]} [description]
       */
      submit(navEditForm) {
        // 表单验证
        this.$refs['navEditForm'].validate((valid) => {
          if (valid) {
            let _navEditForm = {
              dw: this.navEditForm.area,
              jj: this.navEditForm.desc,
              lxdh: this.navEditForm.phone,
              lxid: this.navEditForm.id,
              lxr: this.navEditForm.user,
              pic: this.navEditForm.pic,
              px: this.navEditForm.order,
              xtgn: this.navEditForm.system,
              xtjb: this.navEditForm.level,
              xtlj: this.navEditForm.link,
              xtlx: this.navEditForm.type,
              xtmc: this.navEditForm.name,
              ip: this.navEditForm.systemIp, // 系统ip
              sfdddl: this.navEditForm.idSSO, // 是否单点登录
              skey: this.navEditForm.secretKey, // 单点登录密钥
              by1: this.navEditForm.by1 // 是否
            }
            if (this.dialogMode === 'edit' && this.data.id !== '') {
              _navEditForm.id = this.navEditForm.id
              this.dispatch(UPDATE_XTZTC,
                _navEditForm
              ).then(d => {
                this.isFormalSubmit = true;
                this.closeEvent()
              })
            } else {
              this.dispatch(ADD_XTZTC, _navEditForm).then(d => {
                this.isFormalSubmit = true;
                this.closeEvent()
              })
            }
          }
        })
      },
      /**
       * 编辑模态窗取消按钮事件
       * @return {[type]} [description]
       */
      cancel() {
        this.closeEvent()
      },
      /**
       * 重置表单
       */
      reset() {
        if (this.$refs['navEditForm']) {
          this.$refs['navEditForm'].resetFields()
        }
      },
      // 附件上传
      uploadSubmit(f) {
        // 获取当前上传文件列表文件id
        if (f.Status === 1) { // 文件更新保存成功后提交
          let _fileIdArray = []
          for (let ii in f.data.fileList) {
            _fileIdArray.push(f.data.fileList[ii].response.Data.ID)
            this.currentFiles.push({
              name: f.data.fileList[ii].name,
              id: f.data.fileList[ii].response.Data.ID
            })
          }
          this.navEditForm.pic = _fileIdArray.join()
        }
      },
      /**
       * 获取单点登录秘钥key
       */
      querySecretKey() {
        this.dispatch(GET_SECRET_KEY).then(r => {
          this.navEditForm.secretKey = this.sooKey.getSecretKey.skey
        })
      }
    },
    created() {
    },
    mounted() {
    }
  }

</script>
