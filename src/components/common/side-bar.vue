<style>
  .el-submenu__title {
    height: 40px;
    line-height: 40px;
    padding-left: 15px !important;
  }

  .el-submenu .el-menu-item {
    height: 40px;
    line-height: 40px;
    padding: 0 40px !important;
    min-width: 200px;
  }

</style>
<script>
  import { mapState } from 'vuex'
  import menuHelper from '../../utils/menu-helper'
  // import { removeClass } from '../../../node_modules/element-ui/src/utils/dom'
  // GET_SYS_MENU
  import { FETCH_USER_MENU } from '../../store/types'
  import mixin from '../../utils/mixin'
  import { listToTree } from '../../utils/listToTree'
  import { get, remove, save } from '../../utils/storage'
  import { getTokenUrl } from '../../utils/util'

  import loaderBar from '../../widgets/loader/loader-bar.vue'
  let itemSelectHandler = null;
  export default {
    mixins: [menuHelper, mixin],
    components: {
      'loader-bar': loaderBar
    },
    data() {
      return {
        itemClickTimeout: null,
        clickStart: new Date(),
        items: [],
        menus: []
      }
    },
    props: {
      collapsed: Boolean,
      active: {
        type: String,
        default: ''
      },
      data: {
        type: Array,
        default: null
      },
      router: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      ...mapState({
        //        menus: state => state.menus.SideBarMenus,
        menuList: state => state.users.userMenu,
        menusInfo: state => state.menus.Model
      })
    },
    methods: {
      findMenuItemByPath(path) {
        let res
        res = this.items.find(d => {
          if (d.RequestUrl !== null && d.RequestUrl !== '') {
            if (path === '/system') {
              return d.RequestUrl === path
            } else {
              return d.RequestUrl.indexOf(path) !== -1
            }
          } else {
            return false
          }
        })
        if (!res) {
          this.items.forEach(m => {
            let subRes = m.SubMenus.find(d => {
              if (d.RequestUrl !== null && d.RequestUrl !== '') {
                return (d.RequestUrl.indexOf(path) !== -1 && d.RequestUrl.length <= path.length)
              } else {
                return false
              }
            })
            if (subRes) {
              res = subRes
              return false
            }
          })
        }
        return res
      },
      /*
       * @function
       * 特殊处理,如果同一菜单中有两种路由,都赋予权限,
       * 否则切换路由后跳转，按F5刷新，会因为localStorage中没有相应的permission而要求重新登陆
       * MenuType===1 是菜单, MenuType === 3是外部菜单,只须对MenuType == 1 的权限进行设置
       */
      setReferMenuAuth(menu) {
        let path = this.permission ? this.permission.split('_')[1] : '';
        if (path) {
          menu.forEach((item, idx) => {
            // menuType：1 菜单类型，
            if (item.MenuType === 1) {
              // 得到该菜单项的一级路由，与当前有权限的路由进行比较，如果不存在，复制一份权限。
              let itemPath = item.RequestUrl ? item.RequestUrl.split('/')[1] : path;
              if (itemPath && itemPath !== path) {
                let permissionObj = get('permission_' + itemPath);
                if (!permissionObj) {
                  save('permission_' + itemPath, get(this.permission));
                }
              }
            }
          })
        }
      },
      itemSelected(path) {
        if (this.itemClickTimeout) {
          clearTimeout(this.itemClickTimeout)
        }
        // 判断权限
        let menuItem = this.findMenuItemByPath(path)
        if (menuItem.HasAuthority === '0') {
          // 无权
          this.$message({
            type: 'error',
            message: '暂无此功能权限！',
            showClose: true
          })
        } else if (menuItem.Sfqy === '0') {
          // 未启用
          this.$message('此处正在施工中……')
        } else {
          // 有权,跳转
          if (menuItem.MenuType === 3) {
            this.$emit('update:external', getTokenUrl(path, this.userData.UserToken))
          } else {
            if (path.indexOf('/control') !== -1 && path.indexOf('/controlManage') === -1) {
              this.$emit('update:external', menuItem)
              this.router && (window.location.href = '/#' + path)
            } else {
              let clickEnd = new Date();
              if (clickEnd - this.clickStart >= 500) {
                this.$emit('update:external', '')
                this.router && (this.$router.push(path))
                this.clickStart = clickEnd;
              } else {
                this.itemClickTimeout = setTimeout(() => {
                  this.$emit('update:external', '')
                  this.router && (this.$router.push(path))
                }, 500);
              }
            }
          }
        }
      }
    },
    watch: {
      collapsed(val) {
        if (val) {
          this.handleMouseLeave()
        }
      }
    },
    render(h) {
      let targetActive = '',
        items = this.items = this.data !== null ? this.data : this.menus,
        targetMenuItem = this.findMenuItemByPath(this.$route.path),
        openedItem = items[0]
      items = items.filter(d => d.Sfqy === '1')
      if (items !== null && items.length > 0) {
        if (this.$route.path.indexOf('/external') === 0) {
          // 外部系统特殊处理
          let defaultIndex = parseInt(this.$route.query.default) || 0
          if (defaultIndex > items.length - 1) defaultIndex = 0
          if (items[defaultIndex]) {
            targetActive = items[defaultIndex].RequestUrl
            this.$emit('update:external', getTokenUrl(targetActive, this.userData.UserToken))
          }
        } else if (targetMenuItem) {
          // 默认展开
          targetActive = targetMenuItem.RequestUrl // + '?id=' + targetMenuItem.TreeId
          openedItem = items.find(d => d.TreeId === targetMenuItem.ParentId) || items[0]
        } else {
          targetActive = this.$route.path // + '?id=' + this.$route.query.id
        }
        this.$emit('init:success', items)

        const nodes = this.menuItemRender(h, 'horizontal', {
          text: 'MenuName',
          path: 'RequestUrl',
          icon: 'MenuIcon',
          id: 'TreeId',
          children: 'SubMenus',
          type: 'MenuType'
        }, targetActive, this.data)

        return h('div', {
          'class': 'app-side-bar'
        }, [h('el-menu', {
          'class': { 'el-menu--collapsed': this.collapsed === true },
          ref: 'menu',
          on: {
            select: itemSelectHandler
          },
          props: {
            'unique-opened': true,
            'default-active': targetActive,
            'default-openeds': this.collapsed === true ? [] : (!openedItem ? [] : [openedItem.RequestUrl + '?id=' + openedItem.TreeId]),
            // 'default-openeds': !openedItem ? [] : [openedItem.RequestUrl + '?id=' + openedItem.TreeId],
            router: false
          }
        }, nodes)])
      }
    },
    mounted() {},
    created() {
      this.loading = true
      const permissionId = (get(this.permission) || {}).id || this.$route.query.menuId;
      // this.dispatch(GET_SYS_MENU, {
      //   data: {
      //     treeId: permissionId
      //   }
      // }).then(() => {
      // todo:判断菜单权限
      // if (this.menusInfo.type === 1) {
      if (!permissionId) {
        remove(this.permission)
        remove('ngw_user_actions')
        this.$router.push('/login')
      } else {
        this.dispatch(FETCH_USER_MENU, {
          CurMenuId: permissionId
        }).then(() => {
          let authMenus = this.menuList.filter(d => (d.MenuType === 1 || d.MenuType === 3) && d.HasAuthority === '1');
          this.setReferMenuAuth(authMenus)
          this.menus = listToTree(authMenus, permissionId, 0, {
            id: 'TreeId',
            parentId: 'ParentId',
            children: 'SubMenus',
            order: 'OrderSeq'
          }) // 显示侧栏菜单
          this.loading = false
        })
      }
      itemSelectHandler = this.itemSelected.bind(this);
    },
    updated() {}
  }

</script>
