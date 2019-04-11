import { getStyle } from '../../node_modules/element-ui/src/utils/dom'
import { get } from './storage'

export function trim(string) {
  return(string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

/**
 * innerWidth
 * 取元素内宽度
 * 包含padding, 不包含margin,border
 * @param  {Object} el DOM节点元素
 * @return {Number}    结果
 */
export function innerWidth(el) {
  const width = Number.parseInt(getStyle(el, 'width')),
    paddingLeft = Number.parseInt(getStyle(el, 'paddingLeft')),
    paddingRight = Number.parseInt(getStyle(el, 'paddingRight'))
  return width - paddingLeft - paddingRight
}

/**
 * outerWidth
 * 取元素外宽度
 * 包含padding,margin,border
 * @param  {Object} el DOM节点元素
 * @return {Number}    结果
 */
export function outerWidth(el) {
  const offsetWidth = el.offsetWidth,
    marginLeft = Number.parseInt(getStyle(el, 'marginLeft')),
    marginRight = Number.parseInt(getStyle(el, 'marginRight'))
  return offsetWidth + marginLeft + marginRight
}

/**
 * innerHeight
 * 取元素内高度
 * 包含padding, 不包含margin,border
 * @param  {Object} el DOM节点元素
 * @return {Number}    结果
 */
export function innerHeight(el) {
  const height = Number.parseInt(getStyle(el, 'height')),
    paddingTop = Number.parseInt(getStyle(el, 'paddingTop')),
    paddingBottom = Number.parseInt(getStyle(el, 'paddingBottom'))
  return height - paddingTop - paddingBottom
}

/**
 * outerHeight
 * 取元素外高度
 * 包含padding,margin,border
 * @param  {Object} el DOM节点元素
 * @return {Number}    结果
 */
export function outerHeight(el) {
  const offsetHeight = el.offsetHeight,
    marginTop = Number.parseInt(getStyle(el, 'marginTop')),
    marginBottom = Number.parseInt(getStyle(el, 'marginBottom'))
  return offsetHeight + marginTop + marginBottom
}

/**
 * hasClass
 * 判断元素是否存在某一个class
 * @param  {Object}  el  DOM节点元素
 * @param  {String}  cls class name
 * @return {Boolean}     结果
 */
export function hasClass(el, cls) {
  if(!el || !cls) return false
  if(cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if(el.classList) {
    return el.classList.contains(cls)
  } else {
    return(' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

/**
 * addClass
 * 为指定元素添加一个class
 * @param  {Object}  el  DOM节点元素
 * @param  {String}  cls class name
 */
export function addClass(el, cls) {
  if(!el) return
  var curClass = el.className
  var classes = (cls || '').split(' ')

  for(var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if(!clsName) continue

    if(el.classList) {
      el.classList.add(clsName)
    } else {
      if(!hasClass(el, clsName)) {
        curClass += ' ' + clsName
      }
    }
  }
  if(!el.classList) {
    el.className = curClass
  }
}

/**
 * removeClass
 * 为指定元素移除一个class
 * @param  {Object} el  DOM节点元素
 * @param  {String} cls class name
 */
export function removeClass(el, cls) {
  if(!el || !cls) return
  var classes = cls.split(' ')
  var curClass = ' ' + el.className + ' '

  for(var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if(!clsName) continue

    if(el.classList) {
      el.classList.remove(clsName)
    } else {
      if(hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ')
      }
    }
  }
  if(!el.classList) {
    el.className = trim(curClass)
  }
}

/**
 * tableFill
 * @desc 固定表格高度, 本方法依赖jquery
 * @param  {Object} $ JQUERY实例
 * @param  {String} parent  父级元素选择器, 默认: '.app-content-box'
 * @param  {JqueryObject} $elm    目标元素(需控制高度的元素)jquery选择器
 * @param  {Number} diffVal 偏差值(px)
 * @return {Number}         结果高度值
 */
export function tableFill($, parent, $elm, diffVal) {
  return action()

  function action() {
    if(!parent) parent = '.app-content-box'
    if(!$elm) $elm = $('.el-table')
    // $elm.each(function() {
    let $item = $elm, // $(this),
      $itemBody = $item.find('.el-table__body-wrapper'),
      $target = $itemBody.length > 0 ? $itemBody : $item,
      $box = $target.closest(parent),
      $boxParent = $box.parent(),
      diff = ($box.outerHeight(true) - $box.height()) * 2,
      height
    $box.height('auto')
    $boxParent.height(diffVal || '100%')
    //  - ($item.find('.el-table__header-wrapper').height() || 0)
    height = $boxParent.height() - diff
    $box.siblings(':visible').each(function () {
      height -= $(this).outerHeight(true) || 0
    })
    if(!height || height <= 0) height = 'auto'
    $target.height(height)
    return height || 0
    // })
    // 修复数据表格出现横向滚动条
    // setTimeout(_ => {
    //   let $box = $elm.find('.el-table__body')
    //   $box.width($box.width()) // .css('width', 'auto')
    // }, 3000)
  }
}

/**
 * /jwy/src
 * @desc 获取父级关系数组
 * @param  {Array}  [subject=[]]  主数组, 所有目标在本数据内进行查找
 * @param  {String} [sourceId=''] 源id, 起点id, 以本值为基础向上级查找所有等级父级
 * @param  {Object} [props={}]    属性map
 * @return {Array}                返回向上查找结果数组, 从左往右按顺序排列
 */
export function getTopNexus(subject = [], sourceId = '', props = {
  id: 'id',
  children: 'children',
  parentId: 'parentId'
}) {
  let result = [sourceId]
  if(!subject || subject.length === 0 || !sourceId) {
    return []
  } else {
    let obj = subject.find(s => s[props.id] === sourceId)
    if(obj && obj[props.parentId]) {
      return explorer(obj[props.parentId])
    } else {
      return []
    }
  }

  function explorer(parentId) {
    let parent = subject.find(s => s[props.id] === parentId)
    if(!parent) {
      return result
    } else {
      result = [...[parent[props.id]], ...result]
      return explorer(parent[props.parentId])
    }
  }
}

/**
 * getQuery
 * 参数字符串转换成对象形式
 * @param {String} str 需要转换的字符串, 如:a=1&b=2
 * @param {String} sep 连接符，可选，默认 &
 * @param {String} eq 键值间隔符，可选，默认 =
 * @returns {Object} 结果, 如:{a:1, b:2}
 */
export function getQuery(str, sep, eq) {
  let obj = {}
  str = (str || location.search)
    .replace(/^[^]*\?/, '')
  sep = sep || '&'
  eq = eq || '='
  let arr,
    reg = new RegExp('(?:^|\\' + sep + ')([^\\' + eq + '\\' + sep + ']+)(?:\\' + eq + '([^\\' + sep + ']*))?', 'g')
  while((arr = reg.exec(str)) !== null) {
    if(arr[1] !== str) {
      obj[decodeURIComponent(arr[1])] = decodeURIComponent(arr[2] || '')
    }
  }
  return obj
}

/**
 * queryToString
 * 键值对转换成查询字符串
 * @param query
 * @returns {String}
 */
export function queryToString(query) {
  let str = ''
  for(let key in query) {
    if(query.hasOwnProperty(key)) {
      str += [key, encodeURIComponent(query[key])].join('=')
    }
  }
  return str
}

/**
 * clone
 * 深度拷贝对象或数组
 * @param {Object} obj 需克隆的Object
 * @return {Object} 克隆结果
 */
export function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * arrayGetRid
 * 数组剔除指定元素
 * 存在重复指定元素同时删除
 * @param  {Array}  [array=[]] 原始数组
 * @param  {Array} [ele=[]]   剔除数组
 * @return {Array}            结果
 */
export function arrayGetRid(array = [], ele = []) {
  ele = typeof ele !== 'object' ? Array.of(ele) : ele
  let uniqueA = e => {
    let arrayIndex = array.indexOf(e)
    if(arrayIndex >= 0) {
      array.splice(arrayIndex, 1)
      uniqueA(e)
    }
  }
  for(let e of ele) {
    uniqueA(e)
  }
  return array
}

/**
 * getAgeGroup
 * 年龄段生成
 * @param {String} 升或降序  'sort'/'reverse', 默认: 'reverse'
 * @return {Array} 排序结果
 * */
export function getAgeGroup(param) {
  var date = new Date()
  let arr = []
  let thisYear = date.getFullYear() + 1
  let oldYear = thisYear - 100
  if(param === 'sort') {
    while(thisYear > oldYear) {
      thisYear = thisYear - 5
      arr.push(thisYear + '-' + (thisYear + 4))
    }
  } else {
    while(thisYear > oldYear) {
      thisYear = thisYear - 5
      arr.unshift(thisYear + '-' + (thisYear + 4))
    }
  }
  return arr
}

/**
 * closestRef
 * 向上查找最近的指定ref父级
 * closestRef(this, 'aaa')
 * @param  {Object} [vm={}]              [vue model]
 * @param  {String} [target='']          [目标ref]
 * @param  {Function} [callback]         [回调, 第一参数:结果, 如无, 则返回null]
 */
export function closestRef(vm = {}, target = '', callback) {
  explorer(vm)

  function explorer(self) {
    if(!self.$parent) {
      if(callback) callback(null)
    } else {
      let res = self.$parent.$refs[target]
      if(!res) {
        explorer(self.$parent)
      } else {
        if(callback) callback(res)
      }
    }
  }
}

/**
 * fitSize
 * @param  {Number} [widthLimit=0]   宽度限制
 * @param  {Array}  [heightLimit=[]] 高度区间,[100,3000], 100px~3000px
 * @param  {Array}  [heightRang=[]]  高度区间,[100,3000], 100px~3000px
 * @return {Object}                  { mini: null, height: null }
 */
export function fitSize(widthLimit = 0, heightLimit = [], heightRang = []) {
  let res = {
      mini: null,
      height: null
    },
    bodyWidth = document.body.offsetWidth,
    bodyHeight = document.body.offsetHeight

  if(bodyWidth < widthLimit) {
    res.mini = true
  } else {
    res.mini = false
  }

  if(bodyHeight <= heightLimit[1] && bodyHeight > heightLimit[0]) {
    res.height = 480
  } else if(bodyHeight <= heightLimit[0]) {
    res.height = heightRang[0]
  } else {
    res.height = heightRang[1]
  }

  return res
}
/***
 *getOnlyArray
 * 数组去重
 * @param  {Array} data 需去重的源数组
 * @returns {Array} 去重结果数组
 */
export function getOnlyArray(data) {
  let res = []
  data.forEach((d, i) => {
    if(!res.find(r => d === r)) {
      res.push(d)
    } else {}
  })
  return res
}

/**
 * 组合token link
 * 依赖 makeQueryUrl
 * @param  {String} url   源url
 * @param  {String} token token
 * @return {String}       添加了token的url
 */
export function getTokenUrl(url, token) {
  return makeQueryUrl(url, [{ name: 'token', value: token }])
}

/**
 * URL添加参数
 * 兼容保留原有参数和原无参数的两种情况
 * @param  {String} url   源url
 * @param  {Array} paramsArr 参数数组, 结构:{name:参数名称, value:参数值}, 例: [{name:'id', value:1}]
 * @return {String}       添加参数后的新url
 */
export function makeQueryUrl(url, paramsArr = []) {
  let res = '',
    params = '',
    path = ''
  if(paramsArr.length === 0) return false
  if(url.indexOf('?') !== -1) {
    params = url.substr(url.indexOf('?') + 1, url.length - 1)
    if(params.indexOf('&amp;') !== -1) {
      getParams('&amp;')
    } else if(params.indexOf('&') !== -1) {
      getParams('&')
    } else {}

    paramsArr.forEach((d, i) => {
      params += `${params === '' ? '' : '&'}${d.name}=${d.value}`
    })

    path = url.substr(0, url.indexOf('?'))
    res = `${path}?${params}`
  } else {
    paramsArr.forEach((d, i) => {
      if(i === 0) {
        res = `${url}?${d.name}=${d.value}`
      } else {
        res += `&${d.name}=${d.value}`
      }
    })
  }
  return res

  function getParams(s) {
    let paramsRes = params.split(s).map(d => {
      return d.split('=')
    })

    // .filter(d => d[0].toLowerCase() !== 'token')
    paramsRes = paramsRes.filter(d => {
      return !paramsArr.find(c => d[0] === c.name)
    })

    // paramsArr.forEach(d => {
    //   paramsRes.push([d.name, d.value])
    // })

    paramsRes = paramsRes.map(d => {
      return d.join('=')
    }).join('&')
    params = paramsRes
  }
}
/**
 * Date 转日期字符串
 * @param  {Date} date   源Date
 * @param  {String} fmt  日期格式, 如: 'yyyy-MM-dd'
 * @return {String}      处理结果
 */
export function dateFormat(date, fmt) { // author: meizz
  if(!date) {
    return date
  }
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for(let k in o) {
    if(new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

/**
 * 获取登出回跳URL
 * @param  {VueRouterObject} target VUE路由对象, 方法会从该对象中提取重新登录回跳URL信息
 * @return {String}        回跳链接
 */
export function getReturnPath(target) {
  let res, permission,
    path = target.path || '',
    returnPath = ''
  if(path.indexOf('external-single') !== -1) {
    permission = 'permission_' + 'external_' + path.split('/')[2]
  } else {
    permission = 'permission_' + path.split('/')[1]
  }
  res = get(permission)
  if(!res) {
    res = { id: target.query.menuId || null, name: target.query.menuName || null }
  }
  if(!res.id || !res.name) {
    returnPath = path
  } else {
    returnPath = makeQueryUrl(path, [{ name: 'menuId', value: res.id }, { name: 'menuName', value: res.name }])
  }
  return returnPath
}
