<template>
  <transition :enter-active-class="enterClass" :leave-active-class="leaveClass">
    <div :class="['el-panel', {'el-panel--maximized':isMaximized}]"
         v-show="isShowed"
         v-draggable="draggableOptions"
         v-resizable="resizableOptions"
    >
      <div class="el-panel__header" ref="header" v-if="hasHeader">
        <div class="el-panel__title">
          <span v-if="icon" :class="['el-panel__icon', icon ? icon: '']"></span>
          <slot name="title">{{title}}</slot>
        </div>
        <div class="el-panel__tools">

          <a v-for="tool in tools"
             :class="['el-panel__tool', tool.icon]"
             @click="tool.handler"
          ></a>

          <a v-if="minimizable"
             :class="['el-panel__tool', {'iconfont':minimizable,'icon-min':minimizable}]"
             @click="hide"
          ></a>
          <a v-if="maximizable"
             @click="maximize"
             :class="['el-panel__tool',{'iconfont':maximizable}, maximizable? (isMaximized ? 'icon-max--active':'icon-max'):'' ]"></a>
          <a
            v-if="closable"
            :class="['el-panel__tool',{'iconfont':closable,'icon-close':closable}]"
            @click="close"
          ></a>
        </div>
      </div>
      <el-scrollbar>
        <div class="el-panel__body" ref="body">
          <div class="el-panel__content" ref="content">
            <slot></slot>
          </div>
        </div>
      </el-scrollbar>

    </div>

  </transition>
</template>

<script>
  import draggable from '../../utils/draggable'
  import resizable from '../../utils/resizable'
  import {innerHeight, outerHeight} from '../../utils/util'
  import {
    getStyle,
    setStyle,
    once
  } from '../../../node_modules/element-ui/src/utils/dom'
  export default {
    name: 'ElPanel',
    props: {
      title: String,
      icon: String,
      closable: Boolean,
      showed: {
        type: Boolean,
        default: true
      },
      maximizable: Boolean,
      minimizable: Boolean,
      maximized: Boolean,
      draggable: [Boolean, Object],
      resizable: [Boolean, Object],
      enterClass: {
        type: String,
        default: 'animated fadeIn'
      },
      leaveClass: {
        type: String,
        default: 'animated fadeOut'
      },
      tools: Array
    },
    data() {
      return {
        isShowed: this.showed,
        isMaximized: this.maximized,
        panelHeight: 0,
        headerHeight: 0,
        bodyHeight: 0,
        originalStyle: {}
      }
    },
    computed: {
      hasHeader() {
        return this.title || this.$slots.title;
      },
      draggableOptions() {
        return this.draggable
          ? Object.assign({}, this.draggable, {
            handle: this.hasHeader ? '.el-panel__header' : null
          })
          : false;
      },
      resizableOptions() {
        return this.resizable
          ? Object.assign({}, this.resizable, {
            onResize: data => {
              this.bodyHeight = data.height - data.deltaHeight - this.headerHeight;
            }
          })
          : false;
      }
    },
    methods: {
      init() {
        this.panelHeight = Number.parseInt(getStyle(this.$el, 'height'));
        this.headerHeight = this.$refs.header ? outerHeight(this.$refs.header) : 0;
        this.bodyHeight = innerHeight(this.$el) - this.headerHeight;
      },
      hide() {
        this.isShowed = false;
        this.$emit('hide');
      },
      show() {
        this.isShowed = true;
        this.$emit('show');
      },
      close() {
        this.isShowed = false;
        if (this.leaveClass) {
          const events = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'.split(' ');
          events.forEach(name => {
            once(this.$el, name, () => {
              this.$emit('close');
              this.destroy();
            })
          });
        } else {
          this.destroy();
        }
      },
      destroy() {
        this.$destroy();
        this.$el.parentNode.removeChild(this.$el);
      },
      maximize() {
        this.isMaximized = !this.isMaximized;
        this.$emit('maximize', this.isMaximized);
      },
      setOriginalStyle() {
        ['left', 'top', 'width', 'height'].forEach(name => {
          this.originalStyle[name] = this.$el.style[name];
        });
      }

    },
    watch: {
      bodyHeight(val) {
        setStyle(this.$refs.body, 'height', `${val}px`);
      }
    },
    mounted() {
      this.setOriginalStyle();
    },
    updated() {
      this.init();
    },
    directives: {
      draggable,
      resizable
    }
  }
</script>
