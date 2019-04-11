/**
 * 拖拽指令
 * @desc 注意：需要设置拖拽容器元素的css position才能启动拖拽
 *
 * 用法：
 * <div v-draggable="options"></div>
 *
 * options: [Boolean, Object]
 *
 * 选项默认值：
 *
 *      const defaultOptions = {
 *
 *       // 拖拽句柄元素选择器
 *       handle: null,
 *
 *       // 限制拖拽方向可选: v 垂直、h 水平，默认不限制
 *       axis: null,
 *
 *       // 延时开始拖拽
 *       delay: 100,
 *
 *       // 限制拖拽范围
 *       range: {
 *         left: -10000,
 *         top: -10000,
 *         width: 10000,
 *         height: 10000
 *       },
 *
 *       // 是否禁用拖拽
 *       disabled: false,
 *
 *       // 开始拖拽时回调
 *       onStartDrag: noop,
 *
 *       // 结束拖拽时回调
 *       onStopDrag: noop,
 *
 *       // 正在拖拽时回调
 *       onDrag: noop
 *     };
 *
 */

import { addClass, removeClass, setStyle } from '../../node_modules/element-ui/src/utils/dom'

import Base from './base'

// 拖拽容器的className
const DRAGGABLE_CLASS = 'el-draggable';

// 拖拽句柄的元素className
const DRAGGABLE_HANDLE_CLASS = 'el-draggable__handle';

// 禁止页面选择className
const USER_SELECT_NONE = 'user-select--none';

// 空函数
const noop = function () {};

/**
 * 拖拽类实例化默认参数
 */
const defaultOptions = {

  // 拖拽句柄元素选择器
  handle: null,

  // 限制拖拽方向可选: v 垂直、h 水平，默认不限制
  axis: null,

  // 延时开始拖拽
  delay: 100,

  // 限制拖拽范围
  range: {
    left: -10000,
    top: -10000,
    width: 10000,
    height: 10000
  },

  // 是否禁用拖拽
  disabled: false,

  // 开始拖拽时回调
  onStartDrag: noop,

  // 结束拖拽时回调
  onStopDrag: noop,

  // 正在拖拽时回调
  onDrag: noop
};

class Draggable extends Base {
  constructor(document, el, options) {
    super();
    this.document = document;
    this.el = el;
    this.init(options);
  }

  init(options) {
    let o = this.options = Object.assign({},
      defaultOptions,
      options === false ? { disabled: true } : options);

    this.handle = o.handle ? (this.el.querySelector(o.handle) || this.el) : this.el;
    if(!o.disabled) {
      addClass(this.el, DRAGGABLE_CLASS);
      addClass(this.handle, DRAGGABLE_HANDLE_CLASS);
      this.bind(this.handle, 'mousedown', this.handleMouseDown);
    }
  }

  /**
   *  当选项参数改变时调用，更新组件
   * @param options
   */
  reset(options) {
    this.destroy();
    this.init(options);
  }

  handleMouseDown(e) {
    // 设置延迟开始拖拽
    this.timer = setTimeout(() => {
      this.bind(this.document, 'mousemove', this.handleMouseMove);
      this.startDrag(e.pageX, e.pageY);
    }, this.options.delay);

    this.bind(this.document, 'mouseup', this.handleMouseUp);
  }

  handleMouseMove(e) {
    if(!this.isDragging) return;

    // 如果元素同时绑定了resizable，当resizable正在Resizing时，不进行拖拽
    if(this.el.__resizable__ && this.el.__resizable__.isResizing) return;

    this.drag(e.pageX, e.pageY)
  }

  handleMouseUp() {
    clearTimeout(this.timer);
    if(this.isDragging) {
      this.unbind(this.document, 'mousemove', this.handleMouseMove);
      this.stopDrag();
    }
    this.unbind(this.document, 'mouseup', this.handleMouseUp);
  }

  /**
   * 为了防止拖拽过程中鼠标选中了页面的文字导致 mouseup 事件不被触发，在开始拖拽时禁止页面选择文字，在停止拖拽后再恢复
   * @param none
   */
  setBodySelect(none) {
    none ? addClass(this.document.body, USER_SELECT_NONE) : removeClass(this.document.body, USER_SELECT_NONE);
  }

  startDrag(pageX, pageY) {
    const left = this.el.offsetLeft;
    const top = this.el.offsetTop;
    const width = this.el.offsetWidth;
    const height = this.el.offsetHeight;
    this.isDragging = true;
    this.dragData = {
      startLeft: left,
      startTop: top,
      left: left,
      top: top,
      startX: pageX,
      startY: pageY,
      width: width,
      height: height,
      offsetWidth: pageX - left,
      offsetHeight: pageY - top
    };
    this.options.onStartDrag(this.dragData);
    this.setBodySelect(true);
  }

  getDragRange(left, top, width, height) {
    const range = this.options.range;
    let offset = {
      left: left,
      top: top
    };
    if(left < range.left) {
      offset.left = range.left
    }
    if(top < range.top) {
      offset.top = range.top
    }
    if(left + width > range.width) {
      offset.left = range.width - width;
    }
    if(top + height > range.height) {
      offset.top = range.height - height;
    }
    return offset;
  }

  drag(pageX, pageY) {
    let data = this.dragData;
    let left = data.startLeft + pageX - data.startX;
    let top = data.startTop + pageY - data.startY;
    const range = this.getDragRange(left, top, data.width, data.height);
    switch(this.options.axis) {
      case 'h':
        data.left = range.left;
        break;
      case 'v':
        data.top = range.top;
        break;
      default:
        data.left = range.left;
        data.top = range.top;
        break;
    }
    this.applyDrag();
    this.options.onDrag(this.dragData);
  }

  applyDrag() {
    let data = this.dragData;
    setStyle(this.el, 'left', `${data.left}px`);
    setStyle(this.el, 'top', `${data.top}px`);
  }

  stopDrag() {
    this.isDragging = false;
    this.setBodySelect();
    this.options.onStopDrag(this.dragData);
  }

  destroy() {
    this.unbind(this.handle, 'mousedown', this.handleMouseDown);
    removeClass(this.el, DRAGGABLE_CLASS);
    removeClass(this.handle, DRAGGABLE_HANDLE_CLASS);
  }
}

export default {
  bind(el, binding) {
    el.__draggable__ = new Draggable(window.document, el, binding.value);
  },
  inserted(el) {
    // const instance = el.__draggable__;
    // console.log(instance);
  },
  componentUpdated(el, binding) {
    const instance = el.__draggable__;
    instance.reset(binding.value);
  },
  unbind(el) {
    const instance = el.__draggable__;
    instance.destroy();
  }
}
