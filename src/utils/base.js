import {on, off} from '../../node_modules/element-ui/src/utils/dom'

/**
 * 面向对象DOM事件绑定基类
 */
class Base {
  constructor() {
    this.__handlers__ = [];
  }

  /**
   * 绑定事件
   * @param el 元素DOM对象
   * @param eventName 事件名称如：click、mouseenter、keydown
   * @param callback 事件回调函数，函数内的this会修改指向类的实例
   */
  bind(el, eventName, callback) {
    const proxy = callback.bind(this);
    const handler = {el, eventName, callback, proxy};
    this.__handlers__.push(handler);
    on(el, eventName, proxy);
  }

  /**
   * 销毁指定事件
   * @param el
   * @param eventName
   * @param callback
   */
  unbind(el, eventName, callback) {
    this.__handlers__.forEach((item, index) => {
      if (item.el === el && item.eventName === eventName && item.callback === callback) {
        off(item.el, item.eventName, item.proxy);
        this.__handlers__.splice(index, 1);
      }
    });
  }

}
export default Base;
