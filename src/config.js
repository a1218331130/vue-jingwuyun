/*
 ex:
 export const API_HOST = 'http://127.0.0.1:8070'
 */

import { getSiteInfo } from './utils/storage'
let serviceBaseInfo = getSiteInfo(),
  serviceBasePath,
  javaPath
if(serviceBaseInfo.static === true) {
  serviceBasePath = serviceBaseInfo.port !== '' ? serviceBaseInfo.path + ':' + serviceBaseInfo.port : serviceBaseInfo.path
  javaPath = serviceBasePath
} else {
  serviceBasePath = `http://${serviceBaseInfo.NET_HOST}:${serviceBaseInfo.NET_PORT}`
  javaPath = `http://${serviceBaseInfo.JAVA_HOST}:${serviceBaseInfo.JAVA_PORT}`
}

// 登录服务器
export const LOGIN_HOST = serviceBasePath + '/jwy'

// 网站基本配置DES密钥
export const SITEOPTIONS_KEY = 'zhjw2017'

// 服务总线接口
export const FWZX_BASE_PATH = serviceBasePath + '/fwzx/fwzx'
export const FWZX_PATH = FWZX_BASE_PATH + '/call?id='
export const FWZX_JUMP_URL = FWZX_BASE_PATH + '/urlvalidate'
export const JAVA_PATH = javaPath

// 上传文件临时保存接口，消息通知后台已做永久保存处理
export const UPLOAD_PATH = LOGIN_HOST + '/sys/FileUploader'

// 上传Base64 转为图片附件 返回ID
export const BASE_64_IMAGE_SAVER = LOGIN_HOST + '/sys/Base64ImageUploader'

// 上传文件(导入模块)
export const UPLOAD_PATH_IMPORT = LOGIN_HOST + '/Sjdr/UploadFile'

// 上传文件接口，永久保存file 【已迁移至服务总线配置 fileToFormal 2017-10-10】
export const UPLOAD_PATH_SAVE = LOGIN_HOST + '/Sys/FileUploaderToSave'

// 获取附件ID
export const DOWNLOAD_FILE_PATH = LOGIN_HOST + '/DownFile.ashx?id='

// socket.io 服务器
export const SOCKET_SERVER = `${serviceBaseInfo.NET_HOST || serviceBaseInfo.path}:${serviceBasePath.SOCKIT_PORT || '1093'}/user` // serviceBaseInfo.path + ':1093/user'

// 只用来测试
export const TEST_PATH = 'http://localhost:8001'

// 登录接口公钥
export const RSA_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCw/4C59kESmcXlPQmU36TkqI/KWlP2qjIelRrkuy4+SWytqo/8kfUKDoZAHDn7eJTaqwAPSdtwOoSsyPfpO4Acx7EFnL9uDAoBbMAlnw590vVOOT4Ifj3itArFQhPZoNaBK6nl/ImuEa26TyWaN294UlfT9s1cimVO7388j+fJ/QIDAQAB'

// 后台管理功能页面嵌套地址(java)
export const ADMIN_PATH = `http://${javaPath}`

// 菜单数据同步
export const SYNC_MENU_PATH = serviceBasePath + '/jwy/Sys/RefreshCaches'

// 服务总线管理数据同步
export const SYNC_SERVICE_PATH = serviceBasePath + '/fwzx'

// 图片转换  Base64 转换 成图片
export const IMAGE_CONVERSION_PATH = LOGIN_HOST + '/sys/cutimage'

// 通过一个字符串生成文本文件
export const STRING_CONVERSION_PATH = LOGIN_HOST + '/sys/getfilebystring'

// 警务论坛地址
export const JWYBBS_PATH = serviceBasePath + '/jwybbs'

// PGIS 资源查询接口
export const EZ_POIS_SEARCH_S = 'http://10.146.90.6:8080/EzPOISearchS/PoiSearchV1REST'

// 静态资源目录
export const STATIC_PATH = serviceBasePath + '/jwy/static'

// 汽车型号图片目录
export const CAR_VERSION_PATH = STATIC_PATH + '/car_version'
// 汽车品牌图片目录
export const CAR_BRAND_PATH = STATIC_PATH + '/car_brand'
