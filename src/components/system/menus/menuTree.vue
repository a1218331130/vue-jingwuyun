<template>
<div v-loading="menuLoading">
  <tabs :tab="tab"></tabs>

  <div class="app-content menu-tree-box">
    <el-tree class="filter-tree" :data="tree" :props="treeProps" :node-key="treeProps.id" :render-content="renderContent" :default-expanded-keys="defaultExpandedKeys" :default-expanded-all="true" ref="menus" @node-collapse="nodeCollapse" @node-expand="nodeExpand"></el-tree>
  </div>

  <el-dialog v-draggable="dialogDraggableOptions" :title="dialogTitle" :visible.sync="menuDialog" size="middle--fixed" @open="initDialog" :before-close="closeEvent">
    <el-form ref="editForm" :model="editForm" label-width="80px" v-loading="loading" style="height:200px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="名称" prop="name">
            <el-input v-model="editForm.name" :maxlength="15"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单描述" prop="menuText">
            <el-input v-model="editForm.menuText" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="图标" prop="icon">
            <el-radio-group v-model="iconType">
              <el-radio :label="1">图标</el-radio>
              <el-radio :label="2">字体</el-radio>
            </el-radio-group>
            <icon-upload @uploadSuccessCallback="iconSuccessUpload" :imageUrl="formicon" v-if="iconType === 1" :fileList="fileList"></icon-upload>
            <el-input v-model="editForm.icon" v-if="iconType === 2"></el-input>
            <icon-selector v-model="editForm.icon" :mode="iconType === 1?'image':''"></icon-selector>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="orgerNum">
            <el-input v-model="editForm.orderNum" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用" prop="action">
            <el-radio-group v-model="editForm.action">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="关联菜单" prop="menuId">
        <el-cascader :options="this.$store.getters.menuTree" v-model="editForm.menuId" :props="{value:'menuId', label:'name'}" filterable change-on-select placeholder="选择关联菜单"></el-cascader>
      </el-form-item>

    </el-form>
    <div slot="footer">
      <!-- <el-button type="" @click="reset">重置</el-button> -->
      <el-button @click="closeEvent">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
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

  import { mapState } from 'vuex'
  import { FETCH_SYS_MENU, FETCH_MENU_TREE_BY_USER, POST_MENU_TREE, UPDATE_MENU_TREE, DELETE_MENU_TREE, GET_MENU_TREE, POST_COPY_SON_MENUS_TO_TREE } from '../../../store/types'

  // import draggable from 'vuedraggable'
  // , clone
  import { clone, arrayGetRid, getTopNexus } from '../../../utils/util'
  import { listToTree } from '../../../utils/listToTree'
  // import { get } from '../../../utils/storage'

  import Tabs from '../../common/tabs.vue'
  import IconUpload from '../../common/icon-upload.vue'
  import Cascader from '../../../widgets/cascader/cascader.vue'
  import iconSelector from '../../../widgets/icon-selector/icon-selector.vue'
  import upload from '../../../widgets/upload/upload.vue'

  export default {
    mixins: [mixin],
    components: {
      upload,
      // draggable,
      iconSelector,
      Cascader,
      Tabs,
      IconUpload
    },
    data() {
      return {
        menuLoading: false,
        id: '',
        treeProps: {
          children: 'children',
          label: 'nodeName',
          id: 'id'
        },
        tree: [],
        simpleMenuTree: [],
        menuDialog: false,
        editForm: {
          id: '',
          parentId: '',
          icon: '',
          menuText: '',
          name: '',
          menuId: [],
          action: '1',
          orderNum: 0
        },
        iconType: 1,
        formicon: '',
        fileList: [],
        currentFiles: [], // 当前文件集合
        isFormalSubmit: false,
        dialogTitle: '菜单',
        defaultExpandedKeys: ['D572AF92ED9340EE992286CDF71607DA']
      }
    },
    computed: {
      ...mapState(['menus', 'menuTree', 'serviceBus'])
    },
    methods: {
      initDialog() {
        if (this.id !== '') {
          this.dispatch(GET_MENU_TREE, {
            id: this.id
          }).then(() => {
            this.editForm = clone({
              id: this.menuTree.detail.id,
              parentId: this.menuTree.detail.parentId,
              name: this.menuTree.detail.nodeName,
              menuId: getTopNexus(this.menus.PageData, this.menuTree.detail.menuId, {
                id: 'menuId',
                children: 'children',
                parentId: 'parentId'
              }),
              action: this.menuTree.detail.sfqy,
              icon: this.menuTree.detail.icon,
              menuText: this.menuTree.detail.cdms,
              orderNum: this.menuTree.detail.orderNum
            })
            this.formicon = this.menuTree.detail.icon
            console.log(this.$store.getters.menuTree, this.editForm, 'this.$store.getters.menuTree');
            this.dialogTitle = '编辑'
          })
        } else {}
      },
      closeEvent() {
        this.reset()
        this.menuDialog = false
      },
      fetchList() {
        this.menuLoading = true
        this.dispatch(FETCH_MENU_TREE_BY_USER).then(() => {
          this.tree = listToTree(this.menuTree.userList, '0', 0, {
            id: 'id',
            parentId: 'parentId',
            children: 'children',
            order: 'orderNum'
          }, (res) => {
            this.menuLoading = false
          })
        })
      },
      nodeExpand(data) {
        this.defaultExpandedKeys.push(data.id);
      },
      nodeCollapse(data) {
        arrayGetRid(this.defaultExpandedKeys, data.id)
      },
      addMenu(e, data) {
        e.preventDefault();
        e.stopPropagation();
        this.id = ''
        this.editForm.parentId = data.id
        this.dialogTitle = '新建【' + data.nodeName + '】的子类'
        this.menuDialog = true;
      },
      updataMenu(e, data) {
        e.preventDefault();
        e.stopPropagation();
        this.id = data.id
        this.menuDialog = true;
      },
      copyChildrenFromMenu(e, data) {
        this.$confirm('此功能将对应菜单下的子菜单复制到本菜单树下, 请谨慎操作？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dispatch(POST_COPY_SON_MENUS_TO_TREE, {
            TreeId: data.id,
            MenuId: data.menuId
          }).then(() => {
            this.$message({
              type: 'success',
              message: `成功复制 ${this.menuTree.copySonMenusRes} 个菜单`,
              showClose: true
            })
            this.fetchList()
          })
        })
      },
      removeMenu(e, data, store) {
        e.preventDefault();
        e.stopPropagation();
        this.$confirm('此操作将删除该菜单，是否继续？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dispatch(DELETE_MENU_TREE, {
            ids: data.id
          }).then(() => {
            store.remove(data)
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
            // this.fetchList();
          })
        })
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
      getStateTag(h, state) {
        let menuTypeMap = { '0': ['停用', 'danger'], '1': ['启用', 'success'] }
        return h('el-tag', {
          props: {
            type: menuTypeMap[state][1]
          }
        }, menuTypeMap[state][0])
      },
      renderContent(h, { node, data, store }) {
        let tW = 12 * (node.level - 1) + node.level;
        return h('div', { 'class': 'menu-row-box' }, [
          h('div', {
            'class': 'menu-title-box',
            style: { width: 'calc(20%  - ' + tW + 'px)' }
          }, [
            h('span', {}, [node.label])
          ]),
          h('div', {
            'class': 'menu-type-box'
          }, [
            this.getStateTag(h, data.sfqy)
          ]),
          h('div', {
            'class': 'menu-operation-box'
          }, [
            h('el-button', {
              props: { size: 'small' },
              style: { display: data.type === 2 ? 'none' : 'inline' },
              on: {
                click: (e) => {
                  this.addMenu(e, data);
                }
              }
            }, ['添加子类']),
            h('el-button', {
              props: { size: 'small' },
              style: {},
              on: {
                click: (e) => {
                  this.copyChildrenFromMenu(e, data);
                }
              }
            }, ['从菜单管理复制子菜单']),
            h('el-button', {
              props: { size: 'small', type: 'primary', icon: 'icon iconfont icon-brush' },
              on: {
                click: (e) => {
                  this.updataMenu(e, data);
                }
              }
            }, ['编辑']),
            h('el-button', {
              props: { size: 'small', type: 'danger', icon: 'icon iconfont icon-trash', disabled: data.parentId === '0' },
              on: {
                click: (e) => {
                  this.removeMenu(e, data, store);
                }
              }
            }, ['删除'])
          ])
        ])
      },
      submit() {
        this.dispatch(this.editForm.id === '' ? POST_MENU_TREE : UPDATE_MENU_TREE, {
          id: this.editForm.id,
          parentId: this.editForm.parentId,
          nodeName: this.editForm.name,
          menuId: this.editForm.menuId[this.editForm.menuId.length - 1],
          orderNum: this.editForm.orderNum,
          icon: this.editForm.icon,
          cdms: this.editForm.menuText,
          sfqy: this.editForm.action
        }).then(() => {
          this.$message({
            type: 'success',
            message: '保存成功',
            showClose: true
          })
          this.closeEvent()
          this.fetchList()
        })
      },
      reset() {
        this.editForm = {
          id: '',
          parentId: '',
          name: '',
          menuId: [],
          action: '1',
          orderNum: 0
        }
        // this.$refs.editForm.resetFields()
      }
    },
    watch: {},
    created() {
      this.tab = {
        label: '菜单树管理',
        name: this.$route.path
      }
      this.dispatch(FETCH_SYS_MENU)
      this.fetchList();
    },
    activated() {
      this.tab = {
        label: this.$route.name,
        name: this.$route.path
      }
    },
    mounted() {}
  }

</script>
