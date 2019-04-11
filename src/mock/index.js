import Mock from 'mockjs'
import pathToRegex from 'path-to-regexp'
import config from './config'
import {getQuery} from '../utils/util'

let hostRegex = /^http:\/\/[\w.:]*\//

/**
 * 从url 的 path中提取参数对象，
 * 如： regexUrl = /api/:type/:id , url = /api/abc/123
 * 提取结果： {type: 'abc', id: 123}
 * @param regexUrl
 * @param url
 * @returns {{}}
 */
function getParams(regexUrl, url) {
  let keys = [], host = getHost(regexUrl)
  // 先排除host段，因为host段的端口号与参数写法有冲突
  let regex = pathToRegex(regexUrl.replace(host, ''), keys)
  let matches = regex.exec(url.replace(host, ''))
  let params = {}
  keys.forEach((key, index) => {
    params[key.name] = matches[index + 1]
  })
  return params
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

function parseBody(body) {
  if (!body) return {};
  body = getQuery(body);
  let data = body.data;
  if (data) {
    try {
      data = JSON.parse(data)
    } catch (e) {
      data = body;
    }
  }
  return Object.assign({}, body || {}, data || {})
}

// 模拟请求延时时间
Mock.setup({
  timeout: '20-50'
})

// 变量处理配置请求
config.forEach(function (item) {
  // 匹配的请求url
  let oRegex = pathToRegex(item.url)
  // 只匹配path，忽略参数
  let regex = new RegExp(oRegex.source.replace('(?:\\/(?=$))?$', ''), 'i')
  // 设置拦截请求url
  Mock.mock(regex, function (options) {
    let result
    // 把GET、POST请求的参数对象与默认的参数进行合并组成新的对象
    let query = Object.assign({}, getParams(item.url, options.url), item.params || {}, getQuery(options.url || ' '), parseBody(options.body || ' '))
    if (typeof item.template === 'function') {
      result = item.template(Mock, options.url, query, options)
    } else {
      // 把模拟数据模板字转换成字符串，因为需要对模板插入自定义参数
      let templateString = JSON.stringify(item.template)

      // 替换在模板中的参数标识
      for (let key in query) {
        templateString = templateString.replace(new RegExp('{{' + key + '}}', 'g'), query[key])
      }
      // 返回模拟数据
      result = Mock.mock(JSON.parse(templateString))
    }

    // 打印模拟请求日志
    console.info('【Mock】' + item.title + ' :', options, result, '\n----------------------')
    return result
  })
})
