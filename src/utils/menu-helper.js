const KEY_MAP = {
  text: 'text',
  path: 'path',
  icon: 'icon',
  id: 'id',
  children: 'children',
  type: 'type'
}

/**
 * 判断菜单数组中是否有分组
 * @param array
 */
function hasGroup(array) {
  return array.some(n => {
    return !!n.group
  })
}

/**
 * 最菜单同一个层级数组进行分组处理
 * @param array
 * @returns {{default: Array}}
 */
function groupping(array) {
  let group = {
    'default': []
  }
  array.forEach(n => {
    const key = n.group
    if (key) {
      group[key] = group[key] || []
      group[key].push(n)
    } else {
      group['default'].push(n)
    }
  })
  return group
}

/**
 * 创建图标VNode
 * @param h
 * @param icon
 * @returns {XML}
 */
function createIcon(h, icon) {
  if (icon) {
    // return (<i class={icon}></i>)
    return h('i', {
      'class': icon
    })
  }
}

/**
 * 创建子菜单容器VNode，在这个结点上绑定鼠标事件，目的是让折叠起来的垂直菜单支持hover触发显示，因为el-submenu绑定DOM事件无效
 * @param component 组件实例
 * @param h  渲染函数
 * @param collapsed  是否折叠
 * @param submenu  子菜单VNodes
 * @param item  当前菜单项的数据
 * @param isRoot 菜单是否是顶级
 * @returns {*}
 */
function submenuWrapper(component, h, collapsed, submenu, item, isRoot) {
  const events = (isRoot && collapsed) ? {
    mouseenter: e => {
      component.handleMouseEnter(item.path)
    },
    mouseleave: e => {
      component.handleMouseLeave(item.path)
    }
  } : null
  return h('div', {
    'class': 'el-submenu__wrapper',
    on: events
  }, [submenu])
}

/**
 * 创建菜单分组容器VNode
 * @param h 渲染函数
 * @param title 分组名称
 * @param nodes 包含的菜单VNode
 * @returns {XML}
 */
function groupWrapper(h, title, nodes) {
  return h('el-menu-item-group', {
    props: {
      title: title
    }
  }, nodes)
}

/**
 * 将数据项数组转换成VNodes
 * @param component 组件实例
 * @param h 渲染函数
 * @param collapsed 是否折叠
 * @param isRoot 是否根级别
 * @param items 数据项数组
 * @param mode 菜单模式 horizontal 或 vertical
 * @returns {Array}
 */
function getNodes(component, h, collapsed, isRoot, active, items, mode, props) {
  let nodes = []
  // 先判断当前级别的菜单数据是否有分组
  if (mode !== 'horizontal' && hasGroup(items)) {
    //  如果有分组，进行分组处理数据
    const group = groupping(items)
    // 遍历所有分组，转换成VNodes
    for (let key in group) {
      let groupNodes = []
      group[key].forEach(item => {
        groupNodes.push(traversal(component, h, active, item, collapsed, isRoot, mode, props))
      })
      // 如果分组名称为default，标识该菜单不属于任何分组，单独做处理
      if (key === 'default') {
        nodes = nodes.concat(groupNodes)
      } else {
        nodes.push(groupWrapper(h, key, groupNodes))
      }
    }
  } else {
    // 没有分组，递归下一级
    items.forEach(item => {
      nodes.push(traversal(component, h, active, item, collapsed, isRoot, mode, props))
    })
  }
  return nodes
}

/**
 * 遍历制定菜单项数据下的所有子菜单项，转换成VNode
 * @param component 组件实例
 * @param h 渲染函数
 * @param item 菜单项数据
 * @param collapsed 是否折叠
 * @param isRoot  菜单项是否在根级别
 * @param mode 菜单模式 horizontal 或 vertical
 * @returns {*}
 */
function traversal(component, h, active, item, collapsed, isRoot, mode, props) {
  // 该菜单项是否有子菜单
  // 按钮类型 不树状左侧显示
  if (item[props.type] === 2 || item.Sfqy === '0') {
    return false
  }

  // 判断有无需要显示的子菜单,初始化默认 无显示子菜单,
  let isShowChildren = false
  if (item[props.children].length > 0) {
    item[props.children].forEach(itemChildren => {
      if (itemChildren[props.type] === 1) {
        isShowChildren = true
      }
    })
  }

  if (isShowChildren && item[props.children] && item[props.children].length > 0 && item[props.type] === 1) {
    // 将菜单下的子级菜单转换成符合el-menu组件的VNodes
    let subNodes = getNodes(component, h, collapsed, false, active, item[props.children], mode, props)

    subNodes.unshift(h('template', { slot: 'title' }, [createIcon(h, item[props.icon]), (collapsed && isRoot) ? '' : item[props.text]]))

    let submenu = h('el-submenu', {
      'class': (collapsed && isRoot) ? 'el-submenu--collapsed' : '',
      key: item[props.path],
      props: {
        index: item[props.path] + '?id=' + item[props.id]
      }
    }, subNodes)
    return mode === 'horizontal' ? submenu : submenuWrapper(component, h, collapsed, submenu, item, isRoot)
  } else {
    // 如果没子菜单，将当前菜单转换成VNode
    return h('el-menu-item', {
      'class': {
        'el-submenu--collapsed': collapsed === true && isRoot === true
      },
      attrs: { title: item[props.text] },
      key: item[props.path],
      props: {
        index: item[props.path] // + '?id=' + item[props.id]
      }
    }, [createIcon(h, item[props.icon]), (collapsed && isRoot) ? '' : item[props.text]])
  }
}

export default {
  props: {
    collapsed: Boolean
  },
  methods: {
    /**
     * 在折叠起来的垂直菜单，鼠标经过时，展示子菜单
     * @param index
     */
    handleMouseEnter(index) {
      this.$refs.menu && this.$refs.menu.openMenu(index, [index])
    },
    /**
     * 在折叠起来的垂直菜单，鼠标离开时，隐藏子菜单
     * @param index
     */
    handleMouseLeave(index) {
      this.$refs.menu && this.$refs.menu.closeMenu(index, [index])
    },
    /**
     * 在折叠起来的垂直菜单，点击子菜单后，隐藏子菜单
     * @param index
     */
    handleItemClick(index) {
      this.$refs.menu && this.$refs.menu.closeMenu(index, [index])
    },
    /**
     * 渲染菜单项，不包含 el-menu 节点
     * @param h
     * @returns {Array}
     */
    menuItemRender(h, mode = 'horizontal', props = KEY_MAP, active = '', data = null) {
      let menuData = data === null ? this.menus : data
      return getNodes(this, h, this.collapsed, true, active, menuData, mode, props)
    }
  }
}
