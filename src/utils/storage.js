/**
 * 登录信息缓存key
 * @type {string}
 */
export const SITE_INFO_KEY = 'ngw_site_info';
export const LOGIN_USER_KEY = 'UserLogin';

/**
 * 保存缓存
 * @param key
 * @param value
 */
export const save = function (key, value) {
  const str = typeof value === 'object' ? JSON.stringify(value) : value;
  localStorage.setItem(key, str);
}

/**
 * 获取用户信息
 * @param key
 * @returns {null}
 */
export const get = function (key) {
  const info = localStorage.getItem(key);
  return info ? JSON.parse(info) : null;
}

/**
 * 删除缓存
 * @param key
 */
export const remove = function (key) {
  localStorage.removeItem(key)
}

/**
 * 删除全部缓存
 */
export const clear = function () {
  localStorage.clear();
}

/**
 * 保存缓存 sessionStorage
 * @param key
 * @param value
 */
export const sessionSave = function (key, value) {
  const str = typeof value === 'object' ? JSON.stringify(value) : value;
  sessionStorage.setItem(key, str);
}

/**
 * 获取用户信息 sessionStorage
 * @param key
 * @returns {null}
 */
export const sessionGet = function (key) {
  const info = sessionStorage.getItem(key);
  return info ? JSON.parse(info) : null;
}

/**
 * 删除缓存 sessionStorage
 * @param key
 */
export const sessionRemove = function (key) {
  sessionStorage.removeItem(key)
}

/**
 * 删除全部缓存 sessionStorage
 */
export const sessionClear = function () {
  sessionStorage.clear();
}

/**
 * 保存登录用户信息
 * @param user
 */
export const saveLoginUser = function (user) {
  if(user.UserData) {
    if(user.UserData.JumpType === 'DLRK_4X') {
      user.UserData.JumpUrl = '/xCenter'
    } else if(user.UserData.JumpType === 'DLRK_PT') {
      let mainMenu = user.UserData.UserMenu.find(d => d.MenuId === user.UserData.MenuId)
      user.UserData.mainMenu = { treeId: mainMenu.TreeId, menuId: mainMenu.MenuId, name: '' }
      user.UserData.JumpUrl = '/mainIndex/' + mainMenu.TreeId
    } else if(user.UserData.JumpType === 'DLRK_HT') {

    }
    sessionSave(LOGIN_USER_KEY, user);
    save(LOGIN_USER_KEY, user);
  }
}

/**
 * 删除登录用户信息
 */
export const removeLoginUser = function () {
  sessionRemove(LOGIN_USER_KEY)
  remove(LOGIN_USER_KEY)
  removeSiteInfo()
  remove('ngw_user_actions')
  remove('permission_logincat')
}

/**
 * 获取登录用户信息
 * @returns {null}
 */
export const getLoginUser = function () {
  if(!sessionGet(LOGIN_USER_KEY)) {
    return null
  } else {
    return get(LOGIN_USER_KEY)
  }
}

/**
 * 保存网站信息
 */
export const saveSiteInfo = function (siteInfo) {
  return save(SITE_INFO_KEY, siteInfo);
}

/**
 * 获取网站信息
 * @returns siteInfo
 */
export const getSiteInfo = function () {
  return get(SITE_INFO_KEY) || window.JWY_SERVICE_BASE_INFO;
}
/**
 * 移除网站信息
 */
export const removeSiteInfo = function () {
  return remove(SITE_INFO_KEY);
}
/**
 * 获取系统管理员用户信息
 */
export const getAdminUser = function () {
  return { userId: '1' };
}
