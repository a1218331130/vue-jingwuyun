<template>
<div v-loading="menuLoading">
  <tabs :tab="tab"></tabs>

  <!-- 查询条件 -->
  <div class="app-toolbar clearfix ">
    <el-form :inline="true" class="app-search__form">
      <el-form-item label="关键字">
        <el-input placeholder="输入关键字查询" v-model="filterText"></el-input>
      </el-form-item>
      <!-- <el-form-item>
                <el-button type="primary" native-type="submit">查询</el-button>
              </el-form-item> -->
    </el-form>

    <div class="app-search__buttons">
      <el-button icon="plus" type="primary" @click="addRootMenu">添加根目录</el-button>
      <!-- <el-button :plain="true" type="info" :loading="loading" @click="syncMenuData">菜单同步</el-button> -->
    </div>
  </div>

  <div class="app-content menu-tree-box">
    <el-tree class="filter-tree" :data="$store.getters.menuTree" :props="defaultProps" :node-key="defaultProps.id" :filter-node-method="filterNode" :render-content="renderContent" :default-expanded-keys="defaultExpandedKeys" :default-expanded-all="true" @node-expand="nodeExpand"
      @node-collapse="nodeCollapse" ref="menus"></el-tree>
  </div>

  <el-dialog v-draggable="dialogDraggableOptions" :title="dialogTitle" :visible.sync="menuDialog" class="el-dialog-box" :before-close="closeEvent">
    <el-form ref="menuModel" :model="menuModel" label-width="80px" v-loading="loading">
      <el-form-item label="父菜单">
        <cascader :options="$store.getters.menuTree" :cascaderProps="defaultPropsCascader" @change="cascaderChange" v-model="upParentArry" :disabled="submitType === 'add'"></cascader>
      </el-form-item>

      <el-form-item label="名称" prop="name">
        <el-input v-model="menuModel.name" :maxlength="15"></el-input>
      </el-form-item>

      <el-form-item label="顺序" prop="orderNum">
        <el-input v-model.number="menuModel.orderNum" :maxlength="2"></el-input>
      </el-form-item>

      <el-form-item label="图标类别" prop="iconType">
        <el-radio-group v-model="iconType">
          <el-radio :label="1">图标</el-radio>
          <el-radio :label="2">字体</el-radio>
        </el-radio-group>
        <icon-upload @uploadSuccessCallback="iconSuccessUpload" :imageUrl="menuModel.icon" v-if="iconType === 1" :fileList="fileList"></icon-upload>
        <el-input v-model="menuModel.icon" v-if="iconType === 2"></el-input>
        <icon-selector v-model="menuModel.icon" :mode="iconType === 1?'image':''"></icon-selector>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="新窗口" prop="openType">
            <el-switch v-model="menuModel.openType" :value="menuModel.openType" :width="50" on-text="" off-text="" on-value="3" off-value="2"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否隐藏" prop="sfyc">
            <el-switch v-model="menuModel.sfyc" :value="menuModel.sfyc" :width="50" on-text="是" off-text="否" on-value="1" off-value="0"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="menuModel.type" v-if="operate  !== 'update'">
          <el-radio label="0">中心</el-radio>
          <el-radio label="1" v-if="operate  !== 'root'">菜单</el-radio>
          <el-radio label="2" v-if="operate  !== 'root'&& operate === 1">按钮</el-radio>
          <el-radio label="3">外部菜单</el-radio>
          <el-radio label="4">大屏</el-radio>
          <el-radio label="5">通用面板</el-radio>
          <el-radio label="5">第三方应用</el-radio>
        </el-radio-group>
        <el-radio-group v-model="menuModel.type" v-if="operate  === 'update'">
          <el-radio :label="0">中心</el-radio>
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
          <el-radio :label="3">外部菜单</el-radio>
          <el-radio :label="4">大屏</el-radio>
          <el-radio :label="5">通用面板</el-radio>
          <el-radio :label="6">第三方应用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="URL" v-if="menuModel.type != 2" prop="url">
        <el-input v-model="menuModel.url" :value="menuModel.url"></el-input>
      </el-form-item>

      <el-form-item label="按钮类型" v-if="menuModel.type == 2" prop="czlx">
        <el-radio-group v-model="menuModel.czlx" @change="remoteMethod('')">
          <el-radio label="1">查询</el-radio>
          <el-radio label="2">新增</el-radio>
          <el-radio label="3">修改</el-radio>
          <el-radio label="4">删除</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="服务总线" v-if="menuModel.type == 2" prop="perms">
        <el-select v-model="menuModel.perms" style="width: 100%" multiple filterable remote placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
          <el-option v-for="item in permsOps" :key="item.id" :label="item.name" :value="item.id">
            <span style="float:left">{{item.name}}</span>
            <span style="float:right;color:#8492a6;font-size:13px;padding-right:20px;">{{item.ms||''}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="cdms">
        <el-input type="textarea" v-model="menuModel.cdms" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <!-- <el-button type="" @click="reset">重置</el-button> -->
      <el-button @click="closeEvent">取消</el-button>
      <el-button type="primary" @click="onSubmit">确认</el-button>
    </div>
  </el-dialog>
</div>
</template>

<style scoped>
  .filter-tree {
    margin-top: 20px;
  }

</style>
<style lang="scss">
  .el-dialog-box .el-dialog--small {
    min-width: 500px;
  }

</style>

<script>
  import mixin from '../../../utils/mixin'
  import { UPLOAD_PATH_SAVE } from '../../../config' // , SYNC_MENU_PATH

  import { mapState } from 'vuex'
  import { FETCH_SYS_MENU, ADD_SYS_MENU, UPDATE_SYS_MENU, REMOVE_SYS_MENU, GET_SYS_MENU, GET_SERVICE_BUS } from '../../../store/types' // FETCH_USER_MENU,

  // import draggable from 'vuedraggable'
  // , clone
  import { arrayGetRid } from '../../../utils/util'
  // import { get } from '../../../utils/storage'

  import Tabs from '../../common/tabs.vue'
  import IconUpload from '../../common/icon-upload.vue'
  import Cascader from '../../../widgets/cascader/cascader.vue'
  import iconSelector from '../../../widgets/icon-selector/icon-selector.vue'

  export default {
    mixins: [mixin],
    components: {
      // draggable,
      iconSelector,
      Cascader,
      Tabs,
      IconUpload
    },
    computed: {
      ...mapState(['menus', 'serviceBus'])
    },
    data() {
      return {
        menuLoading: false,
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'name',
          id: 'menuId'
        },
        defaultPropsCascader: {
          value: 'menuId',
          label: 'name',
          children: 'children'
        },
        menuDialog: false,
        menuModel: {
          parentId: [],
          name: '',
          type: '',
          czlx: '1',
          openType: '2',
          sfyc: '0',
          url: '',
          icon: '',
          orderNum: null,
          perms: [],
          cdms: ''
        },
        submitType: '',
        dialogTitle: '菜单',
        operate: '',
        fileList: [],
        fileListArry: [],
        iconType: 1,
        permsOps: [],
        options: {},
        upParentArry: [],
        defaultExpandedKeys: ['D572AF92ED9340EE992286CDF71607DA_1']
      }
    },
    watch: {
      filterText(val) {
        this.$refs.menus.filter(val);
      },
      upParentArry(val) {
        let ml = this.queryParent(val);
        if (typeof ml !== 'undefined' && ml.parentId !== '0') this.upParentArry.unshift(ml.parentId)
      }
    },
    methods: {
      closeEvent() {
        this.reset()
        this.menuDialog = false
      },
      filterNode(value, data) {
        if (!value || !data.name) return true;
        return data.name.indexOf(value) !== -1;
      },
      nodeExpand(data) {
        this.defaultExpandedKeys.push(data.menuId);
      },
      nodeCollapse(data) {
        arrayGetRid(this.defaultExpandedKeys, data.menuId)
      },
      menuTag(h, menuType) {
        let menuTypeMap = { '0': ['中心', 'danger'], '1': ['菜单', 'success'], '2': ['按钮', 'warning'], '3': ['外部菜单', 'gray'], '4': ['大屏', 'success'], '5': ['通用面板', 'success'], '6': ['第三方应用', 'success'] }
        return h('el-tag', {
          props: {
            type: menuTypeMap[menuType][1]
          }
        }, menuTypeMap[menuType][0])
      },
      queryParent(pId) {
        const menuListT = this.menus.PageData;
        let thisPid = pId[0];
        for (const ml of menuListT) {
          if (ml.menuId === thisPid) {
            return {
              parentId: ml.parentId
            }
          }
        }
        return {
          parentId: '0'
        }
      },
      fetchMenu() {
        this.menuLoading = true
        this.dispatch(FETCH_SYS_MENU).then(() => {
          this.menuLoading = false
        })
      },
      addMenu(e, data) {
        e.preventDefault();
        e.stopPropagation();

        this.menuModel.parentId = Array.of(data.menuId)
        this.menuModel.type = data.type === 0 ? '1' : data.type.toString()

        this.upParentArry = this.menuModel.parentId;
        this.submitType = 'add'
        this.operate = data.type
        this.dialogTitle = '新建【' + data.name + '】子类'
        this.menuDialog = true;
      },
      addRootMenu(e) {
        e.preventDefault();
        e.stopPropagation();

        this.menuModel.parentId = Array.of('0')
        this.menuModel.type = '0'

        this.upParentArry = this.menuModel.parentId;
        this.submitType = 'add'
        this.operate = 'root'
        this.dialogTitle = '新建根目录'
        this.menuDialog = true;
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
          // this.menuModel = clone(this.menus.Model)
          // this.menuModel.czlx = this.menuModel.appId
          this.menuModel.menuId = thisMenuObj.menuId
          this.menuModel.parentId = thisMenuObj.parentId
          this.menuModel.name = thisMenuObj.name
          this.menuModel.type = thisMenuObj.type
          this.menuModel.czlx = thisMenuObj.appId
          this.menuModel.openType = thisMenuObj.openType
          this.menuModel.sfyc = thisMenuObj.sfyc || '0'
          this.menuModel.url = thisMenuObj.url
          this.menuModel.icon = thisMenuObj.icon
          this.menuModel.orderNum = thisMenuObj.orderNum
          this.menuModel.cdms = thisMenuObj.cdms || ''

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
          this.remoteMethod(''); // 服务总线
        })
      },
      removeMenu(e, data) {
        e.preventDefault();
        e.stopPropagation();
        this.$confirm('此操作将删除该菜单，是否继续？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dispatch(REMOVE_SYS_MENU, {
            data: {
              ids: data.menuId
            }
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
            this.fetchMenu();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
          this.fetchMenu();
        });
      },
      remoteMethod(query) {
        this.dispatch(GET_SERVICE_BUS, {
          name: query,
          czlx: this.menuModel.czlx
        }).then(_ => {
          this.permsOps = [...this.serviceBus.serviceBusByName]
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
        this.menuModel.perms = (typeof this.menuModel.perms) === 'object' ? this.menuModel.perms.join(',') : this.menuModel.perms;
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
      },
      // syncMenuData() {
      //   this.loading = true
      //   this.$http.get(SYNC_MENU_PATH).then((r) => {
      //     if (r.body.Status === 1) {
      //       this.$message({
      //         duration: 1000,
      //         type: 'info',
      //         message: '菜单数据同步成功!'
      //       });
      //       this.dispatch(FETCH_USER_MENU, {
      //         CurMenuId: get(this.permission).id
      //       })
      //     } else {
      //       this.$message({
      //         duration: 1000,
      //         type: 'warning',
      //         message: '菜单数据同步异常,请重试！'
      //       });
      //     }
      //     this.loading = false
      //   })
      // },
      changeOrderNum(e, brothers, item, orderType) {
        e.preventDefault();
        e.stopPropagation();

        let self = this,
          order = item.orderNum

        // 顺序更改
        // todo:开始更新菜单顺序
        if (orderType === 'up' && item.orderNum > 0) {
          if (item.orderNum > 1) {
            order -= 1
            active()
          } else {
            this.$message({ type: 'info', message: '到顶了!' });
          }
        } else if (orderType === 'down') {
          if (item.orderNum < brothers.length) {
            order += 1
            active()
          } else {
            this.$message({ type: 'info', message: '到底了!' });
          }
        } else {
          this.$message({ type: 'warning', message: '未知必要参数: orderType' });
        }

        function active() {
          let suffer = brothers.find(d => d.data.orderNum === order)
          suffer.data.orderNum = item.orderNum < order ? suffer.data.orderNum - 1 : suffer.data.orderNum + 1
          item.orderNum = order

          self.dispatch(UPDATE_SYS_MENU, {
            data: { menuId: suffer.data.menuId, orderNum: suffer.data.orderNum }
          }).then(() => {
            self.dispatch(UPDATE_SYS_MENU, {
              data: { menuId: item.menuId, orderNum: item.orderNum }
            }).then(() => {
              self.$message({ type: 'success', message: '更新菜单顺序成功!' });
              self.fetchMenu();
            }).catch(() => {
              self.$message({ type: 'danger', message: '更新菜单顺序失败!' });
              self.fetchMenu();
            })
          }).catch(() => {
            self.$message({ type: 'danger', message: '更新菜单顺序失败!' });
            self.fetchMenu();
          })
        }
      },
      renderContent(h, { node, data, store }) {
        let tW = 12 * (node.level - 1) + node.level;
        // let orderButton = [
        //   h('el-button', {
        //     'class': 'el-icon-arrow-up',
        //     style: {
        //       border: 'none'
        //     },
        //     props: {
        //       size: 'small',
        //       type: 'info'
        //     },
        //     on: {
        //       click: (e) => {
        //         this.changeOrderNum(e, node.parent.childNodes, data, 'up')
        //       }
        //     }
        //   }, [
        //     // data.orderNum
        //   ]),
        //   h('el-button', {
        //     'class': 'el-icon-arrow-down',
        //     style: {
        //       border: 'none'
        //     },
        //     props: {
        //       size: 'small',
        //       type: 'info'
        //     },
        //     on: {
        //       click: (e) => {
        //         this.changeOrderNum(e, node.parent.childNodes, data, 'down')
        //       }
        //     }
        //   }, [
        //     //              data.orderNum
        //   ])
        // ]
        return h('div', {
          'class': 'menu-row-box'
        }, [
          h('div', {
            'class': 'menu-title-box',
            style: {
              width: 'calc(20%  - ' + tW + 'px)'
            }
          }, [
            h('span', {}, [
              node.label
            ])
          ]),
          h('div', {
            'class': 'menu-url-box'
          }, [
            data.url ? data.url : '-'
          ]),
          h('div', {
            'class': 'menu-type-box'
          }, [
            this.menuTag(h, data.type), data.sfyc === '1' ? h('el-tag', {
              props: {
                type: 'gray'
              }
            }, '隐藏') : ''
          ]),
          // h('div', {
          //   'class': 'menu-type-box'
          // }, orderButton),
          h('div', {
            'class': 'menu-operation-box'
          }, [
            h('el-button', {
              props: {
                size: 'small'
              },
              style: {
                display: data.type === 2 ? 'none' : 'inline'
              },
              on: {
                click: (e) => {
                  this.addMenu(e, data);
                }
              }
            }, [
              '添加子类' // + data.orderNum // 菜单当前顺序
            ]),
            h('el-button', {
              props: {
                size: 'small',
                type: 'primary',
                icon: 'icon iconfont icon-brush'
              },
              on: {
                click: (e) => {
                  this.updataMenu(e, data);
                }
              }
            }, [
              '编辑'
            ]),
            h('el-button', {
              props: {
                size: 'small',
                type: 'danger',
                icon: 'icon iconfont icon-trash',
                disabled: data.parentId === '0'
              },
              on: {
                click: (e) => {
                  this.removeMenu(e, data);
                }
              }
            }, [
              '删除'
            ])
          ])
        ])
      },
      reset() {
        this.$refs.menuModel.resetFields()
        this.fileListArry = [];
        this.fileList = [];
      }
    },
    activated() {
      this.tab = {
        label: this.$route.name,
        name: this.$route.path
      }
    },
    created() {
      this.remoteMethod();
      this.tab = {
        label: '菜单管理',
        name: this.$route.path
      }
      this.fetchMenu();
    },
    mounted() {}
  }

</script>
