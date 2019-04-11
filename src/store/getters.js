/*
 ex:
 doneTodosCount: (state, getters) => {
 return getters.doneTodos.length
 }
 */
import { get, save, getLoginUser } from '../utils/storage'
import { listToTree } from '../utils/listToTree'
export default {
  // token(state) {
  //   const user = getLoginUser() // || state.users.UserLogin
  //   if (user && user.UserData) {
  //     return user.UserData.UserToken
  //   }
  //   return null
  // },
  menuTree(state) {
    return listToTree(state.menus.PageData || [], '0', 0, {
      id: 'menuId',
      parentId: 'parentId',
      children: 'children',
      level: 'level',
      order: 'orderNum'
    })
  },
  userMenu(state) {
    const user = state.users.userMenu
    if (user) {
      return user
    } else {
      return null
    }
  },
  isTipsing(state) {
    return state.tips.isTipsing
  },
  getSearchWhere(state) {
    console.log(111, state.searchWhere)
    return state.searchWhere || null
  },
  dict(state) {
    if (state.dict.GetSysDictByType) {
      return state.dict.GetSysDictByType.map(d => {
        return {
          label: d.DictName,
          value: d.Code,
          parentId: d.ParentCode || '',
          children: []
        }
      })
    } else {
      return null
    }
  },
  userOrgInfo(state) {
    let orgInfo = getLoginUser().UserData,
      res = {
        mainOrg: orgInfo.UserDept[0], // .find(d=>d.),
        mainOrgId: orgInfo.DeptNo, // .find(d=>d.),
        mainParentId: orgInfo.UserDept.find(d => d.DeptNo === orgInfo.DeptNo).ParentId,
        orgList: orgInfo.UserDept
      }
    return res
  },
  userDept(state) {
    if (state.dict.GetDeptDictsList) {
      return state.dict.GetDeptDictsList.map(d => {
        return {
          children: [],
          parentId: d.ParentCode,
          label: d.DictName,
          value: d.KeyId
        }
      })
    } else {
      return null
    }
  },
  dictList(state) {
    if (state.dictList) {
      return state.dictList
    } else {
      return null
    }
  },
  dictMap(state) {
    let res = {}
    state.dictList.forEach(s => {
      res[s.type] = s.children
    })
    return res
  },
  userActionMap(state) {
    let map = get('ngw_user_actions')
    if ((map instanceof Object && JSON.stringify(map) === '{}') || !map) {
      map = {}
      let actions = state.users.UserActions || []
      actions.forEach(a => {
        map[a.ReqALias] = true
      })
      save('ngw_user_actions', map)
    }
    return map
  },
  cascaderDept(state, mainOrgId) {
    if (state.orgs.orgByCurryOrg) {
      let array = []
      array[0] = state.orgs.orgByCurryOrg.map(d => {
        return {
          label: d.name,
          id: d.orgId,
          parentId: d.parentId,
          children: d.SonModels
        }
      })
      console.log('mainOrgId', mainOrgId);
      array[1] = listToTree(state.orgs.orgByCurryOrg.map(d => {
        return {
          label: d.name,
          id: d.orgId,
          parentId: d.parentId,
          children: d.children
        }
      }) || [], mainOrgId, 0, {
        id: 'orgId',
        parentId: 'parentId',
        children: 'children'
      })
      console.log('array', array);
      return array
    } else {
      return null
    }
  },
  cascaderNative(state) {
    if (state.dict.GetSysDictByType) {
      let array = []
      array[0] = state.dict.GetSysDictByType.map(d => {
        return {
          label: d.DictName,
          id: d.Code,
          parentId: d.ParentCode,
          children: d.SonModels
        }
      })
      array[1] = listToTree(state.dict.GetSysDictByType.map(d => {
        return {
          label: d.DictName,
          id: d.Code,
          parentId: d.ParentCode,
          children: d.SonModels
        }
      }) || [], null, 0, {
        id: 'id',
        parentId: 'parentId',
        children: 'children'
      })
      return array
    } else {
      return null
    }
  }
}
