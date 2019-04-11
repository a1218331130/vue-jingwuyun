<template>
<!-- <div class="app-wrapper" ondragstart="return false" @contextmenu="mouseRightClickEvent" @click="closeContextMenu"> -->
<div class="app-wrapper" ondragstart="return false">
  <transition enter-active-class="animated fadeIn">
    <keep-alive>
       <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
  </transition>
  <transition>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  <div id="globalContextMenu" class="global-contextmenu" v-show="showContextMenu" @mouseleave="menuMouseLeave" @mouseover="menuMouseEnter">
    <ul>
      <li @click="jumpToSearch">慧搜检索 "{{selectedText}}"</li>
      <li @click="showCard" v-if="hoverType!==''">查看卡片</li>
      <li @click="showDossier" v-if="hoverType==='car' || hoverType === 'idCard'">查看档案</li>
      <li @click="copySelection" class="menu-clip-copy" :data-clipboard-text="copyText">复制</li>
      <!-- <li @click="paseSelection">粘贴</li> -->
    </ul>
  </div>

  <dialog-people-info :dialog="peopleInfoDialog"  v-if="renderDialogs" :data="infoDialogData" @close="peopleInfoDialog=false" @call:dialog="openInfoDialog"></dialog-people-info>
<dialog-car-info :dialog="carInfoDialog"  v-if="renderDialogs" :data="infoDialogData" @close="carInfoDialog=false" @call:dialog="openInfoDialog"></dialog-car-info>
<dialog-mobile-info :dialog="mobileInfoDialog" v-if="renderDialogs" :data="infoDialogData" @close="mobileInfoDialog=false" @call:dialog="openInfoDialog"></dialog-mobile-info>

</div>
</template>
<script>
  import { save } from './utils/storage'
  import dialogInfo from './widgets/info-dialog/info-dialog'
  import infoDialogEvents from './utils/infoDialogEvents'
  import Clipboard from 'clipboard';
  export default {
    mixins: [infoDialogEvents],
    data() {
      return {
        showContextMenu: false,
        selectedText: '',
        hoverType: '', // 鼠标悬停元素的类别
        hoverKey: '', // 鼠标悬停元素的值
        clickDossierLink: '',
        // menuOperating 和 elHover 只用来处理菜单的显示和隐藏逻辑，与功能无关
        menuOperating: false,
        elHover: false,
        copyText: '',
        dossierLink: {
          car: '/#/dossier/car?key=',
          idCard: '/#/dossier/people?key='
        },
        cardTypes: {
          idCard: 1,
          car: 2,
          mobile: 3,
          case: 4
        }
      }
    },
    computed: {
      renderDialogs() {
        let ren = true;
        // 在登陆之前接口，登陆窗口内的代码逻辑与 KPI 登陆loginMixin内的 mounted代码冲突，
        // (登陆之前dialog内就要调接口请求数据，请求不到数据又跳回登陆页，导致KPI登陆失效）
        // 改为在登陆页和中心页不渲染
        switch (this.$route.path) {
          case '/':
          case '/login':
          case '/xCenter':
          case '/maintenance':
          case '/ie/message':
            ren = false;
        }
        return ren;
      }
    },
    methods: {
      menuMouseLeave(e) {
        this.menuOperating = false;
        setTimeout(() => {
          if (!this.elHover) {
            this.showContextMenu = false;
          }
        }, 300)
      },
      menuMouseEnter(e) {
        this.menuOperating = true;
        this.showContextMenu = true;
      },
      /**
       * 全局鼠标右键事件
       */
      mouseRightClickEvent(e) {
        e.preventDefault()
        let selection = document.getSelection(),
          menuElm = document.querySelector('#globalContextMenu')
        if (selection.extentOffset > 0 && selection.type === 'Range') {
          this.selectedText = selection.focusNode.data
          menuElm.style.top = e.clientY + 'px'
          menuElm.style.left = e.clientX + 'px'
          this.showContextMenu = true
        }
      },
      /**
       * 关闭右键菜单
       */
      closeContextMenu() {
        this.selectedText = ''
        this.showContextMenu = false
      },
      /**
       * 跳转到检索
       */
      jumpToSearch() {
        let formData = {
          SearchWhere: [{
            Keyword: this.selectedText, // 关键字
            KeywordType: 0, // 关键字类型 0:文本, 1:时间段, 2:年龄段
            Name: '来自右键的检索, source:' + this.$route.path,
            SearchType: 0
          }], // 查询条件，检索关键字(8.1.7)的集合
          TypeId: 0,
          SearchType: 0,
          TableIDs: [],
          FlTypeIDs: []
        }
        save('ngw_search_searcWhere_' + this.selectedText, formData)
        save('ngw_search_catTreeData', null)

        window.open('/#' + `/search/result?key=${this.selectedText}&type=0`)
      },
      showCard() {
        let cardMap = {
          idCard: 1,
          car: 2,
          mobile: 3,
          case: 4
        }
        this.openInfoDialog(cardMap[this.hoverType], this.hoverKey.toString())
        this.closeContextMenu()
      },
      showDossier() {
        let url = this.dossierLink[this.hoverType] + this.hoverKey;
        window.open(url)
        this.closeContextMenu()
      },
      /**
       * 复制
       */
      copySelection(e) {
        this.copyText = this.selectedText;
        this.$nextTick(() => {
          let clipboard = new Clipboard('.menu-clip-copy');
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
          setTimeout(() => {
            this.closeContextMenu()
          }, 300);
        })
      },
      /**
       * 粘贴
       */
      paseSelection() {
        this.closeContextMenu()
      }
    },
    components: {
      'dialog-people-info': dialogInfo,
      'dialog-car-info': dialogInfo,
      'dialog-mobile-info': dialogInfo
    },
    created() {
      let _this = this;
      let menuTimeout = null;
      // 鼠标点击打开卡片
      this.$('body').on('click', '.hover-menu', function(e) {
        let key = _this.$(e.target).text().trim();
        let type = _this.$(e.target).data('type');
        _this.hoverType = type;
        _this.hoverKey = key;
        _this.showCard();
      })
      // 鼠标悬停弹出菜单
      this.$('body').on('mouseover', '.hover-menu', function(e) {
        this.elHover = true;
        if (menuTimeout) {
          clearTimeout(menuTimeout)
        }
        if (_this.showContextMenu) {
          return;
        }
        menuTimeout = setTimeout(() => {
          let key = _this.$(e.target).text().trim();
          let type = _this.$(e.target).data('type');
          _this.selectedText = this.innerText;
          _this.hoverType = type;
          _this.hoverKey = key;
          let menuElm = document.querySelector('#globalContextMenu')
          menuElm.style.top = e.clientY + 'px'
          menuElm.style.left = e.clientX + 'px'
          _this.showContextMenu = true
        }, 400)
      })
      this.$('body').on('mouseleave', '[class*="hover-menu-"]', function(e) {
        this.elHover = false;
        // 鼠标离开标签后如果马上进入菜单，菜单不会消失
        setTimeout(() => {
          if (!_this.menuOperating) {
            _this.hoverType = '';
            _this.hoverKey = '';
            _this.showContextMenu = false
          }
        }, 300);
      })
    }
  }

</script>
