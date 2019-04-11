/**
 * 把列表数据转换成树结构, 列表数据必须有父节点标识
 * 如列表：[{id, parentId}, ...]
 * 转换成：[{id, parentId, level, children:[{id, parentId, level}, ...]}, ...]
 * @param list 原始列表数据
 * @param parentId 从哪个父节点的标识开始查找
 * @param level 制定第一层的标识
 * @param prop  属性map
 * @returns {Array.<*>}
 */
export function treeToList(list, parentId, level = 0, prop = {
  id: 'id',
  parentId: 'parentId',
  children: 'children',
  level: 'level',
  order: 'order'
}, success = function() {}) {
  let result = [],
    temp
  list.forEach(item => {
    if (item[prop.parentId] === parentId) {
      let obj = Object.assign({}, item)
      obj[prop.level] = level
      temp = treeToList(list, obj[prop.id], level + 1, prop)
      if (temp.length > 0) {
        obj[prop.children] = temp
      }
      result.push(obj)
    }
  })
  // 有排序字段
  if (result[0] && result[0][prop.order]) {
    let sortRes = result.sort((a, b) => {
      return a[prop.order] - b[prop.order]
    })
    success(sortRes)
    return sortRes
  } else {
    // 无排序
    success(result)
    return result
  }
}

/**
 * 列表数据转换成表格数结构
 * @param list
 * @param parentId
 * @param level
 * @param prop
 * @param idPath
 * @returns {Array.<*>}
 */
export function listToTableTree(list, parentId, level = 0, prop = {
  id: 'id',
  parentId: 'parentId',
  children: 'children',
  level: 'level',
  order: 'order'
}, idPath) {
  let result = [],
    temp
  list.forEach(item => {
    if (item[prop.parentId] === parentId) {
      let obj = Object.assign({}, item)
      obj[prop.level] = level
      obj.idPath = (idPath || '') + '_' + item[prop.id]
      result.push(obj)
      temp = listToTableTree(list, obj[prop.id], level + 1, prop, obj.idPath)
      if (temp.length > 0) {
        result = result.concat(temp)
      }
    }
  })
  return result.sort((a, b) => {
    return a[prop.order] - b[prop.order]
  })
}
