import Vue from 'vue'
import pathToRegex from 'path-to-regexp'
import { getQuery } from '../utils/util'

// 编译过的url缓存
let pathToRegexCaches = {}
let hostRegex = /^http:\/\/[\w.:]*\//

/**
 * 构建通用适配处理ajax返回数据Promise
 * @param http
 * @returns {Promise}
 */
function createPromise(http) {
  return new Promise(function(resolve, reject) {
    http.then(function(res) {
      if (res.data) {
        // 处理接口返回大小不一致问题
        if (Number.parseInt(res.data.status) === 1 || Number.parseInt(res.data.Status) === 1) {
          resolve(res.data.data || res.data.Data)
        } else {
          reject(res.data)
        }
      }
    }).catch(function(res) {
      reject({
        status: 0,
        httpStatus: res.status,
        msg: res.statusText
      })
    })
  })
}

/**
 * 获取url的Host段，
 * 如：http://127.0.0.1:8001/api/abc/123
 * 提取结果：http://127.0.0.1:8001/
 * @param url
 * @returns {string}
 */
function getHost(url) {
  let matches = url.match(hostRegex)
  if (matches) {
    return matches[0]
  }
  return ''
}

export default function(options) {
  let config = Object.assign({
    url: null,
    params: {}, // url参数，如: /api/user/:id
    query: {}, // 查询参数 如: /api/user/list?a=3&b=5
    method: 'get',
    crossOrigin: false,
    emulateJSON: true, // 设置请求头Content-Type的值为application/x-www-form-urlencoded
    credentials: true, // 跨域发送请求带上cookie
    emulateHTTP: true // 用HTTP的POST方式PUT，PATCH，DELETE等请求，并设置请求头字段HTTP_Method_Override为原始请求方法。
  }, options || {})
  if (!config.url) {
    throw new Error('ajax url param is required')
  }

  // 适配总线接口，如果有查询参数id，获取ID的值注入到POST的数据中
  if (config.url.indexOf('call?id=') > 0) {
    const callQuery = getQuery(config.url);
    config.body = { ...config.body, ...callQuery }
    config.body.data = JSON.stringify(JSON.parse(config.body.data))
    // let dataStr = config.body.data;
    // if (dataStr) {
    //   config.body.data = JSON.stringify({ ...JSON.parse(dataStr), ...callQuery })
    // }
  }
  let compileCache = pathToRegexCaches[config.url],
    host = getHost(config.url)
  if (!compileCache) {
    // 先排除host段，因为host段的端口号与参数写法有冲突
    compileCache = pathToRegexCaches[config.url] = pathToRegex.compile(config.url.replace(host, ''))
  }
  // 补回host段
  config.url = host + compileCache(config.params)
  // VueResource 的url带参数是选项设置是params，需要适配VueResource
  config.params = config.query
  delete config.query

  let type = config.method.toLowerCase()
  // get(url, [options])
  // head(url, [options])
  // delete(url, [options])
  // jsonp(url, [options])
  // post(url, [body], [options])
  // put(url, [body], [options])
  // patch(url, [body], [options])
  if (['get', 'head', 'delete'].indexOf(type) > -1) {
    return createPromise(Vue.http[type](config.url, config))
  } else {
    return createPromise(Vue.http[type](config.url, config.body, config))
  }
}
