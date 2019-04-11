const _ = require('lodash')
const beautify = require('js-beautify').js_beautify
const fs = require('fs')
const rm = require('rimraf')
var pathToRegexp = require('path-to-regexp')
const ELEMENT_UI = require('./element-ui.js')
const apiRender = require('./templates/api')
const mockRender = require('./templates/mock')
const typesRender = require('./templates/types')
const storeRender = require('./templates/store')

const SCHEMA = require('./schema.json')
const OUTPUT_API_PATH = './src/api/code/'
const OUTPUT_MOCK_PATH = './src/mock/code/'
const OUTPUT_STORE_PATH = './src/store/code/'
const OUTPUT_STORE_TYPES_PATH = './src/store/'
const GLOBAL_CONFIG = Object.assign({
  pathPrefix: '',
  methods: [
    'fetch',
    'get',
    'add',
    'update',
    'remove'
  ],
  methodTypeMap: {
    fetch: 'get',
    get: 'get',
    add: 'post',
    update: 'post',
    remove: 'get'
  },
  methodSuffixMap: {
    fetch: '/list',
    get: '/info/:id',
    add: '/save',
    update: '/update',
    remove: '/delete'
  },
  stateListName: 'list',
  stateModelName: 'model',
  statePageName: 'page',
  statePageSizeName: 'limit',
  stateTotalName: 'total',
  successCodeValue: 0 // 接口成功时code的值

}, SCHEMA.global || {})

const AJAX_PARAM_NAME_MAP = {
    get: 'query',
    post: 'body',
    head: 'query',
    'delete': 'query',
    put: 'body',
    patch: 'body'
  }
  // 解析后的Models
const MODELS = parseModels(SCHEMA.models || {})

/**
 * 创建文件
 * @param path
 * @param fileName
 * @param content
 */
function writeFile(path, fileName, content) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
  fs.writeFileSync(path + fileName + '.js', content, { encoding: 'utf8' })
}

function toUpperCase(name) {
  return name.toUpperCase()
}

/**
 * Foo Bar | --foo-bar | __foo_bar__ => fooBar
 * @param name
 */
function toCamelCase(name) {
  return _.camelCase(name)
}
/**
 * Foo Bar | fooBar | --foo-bar => foo_bar
 * @param name
 */
function toSnakeCase(name) {
  return _.snakeCase(name)
}

function toUpperSnakeCaseName(name) {
  return toUpperCase(toSnakeCase(name))
}

/**
 * 格式化js代码
 * @param content
 * @returns {*}
 */
function beautifyJs(content) {
  content = content.replace(/(\r\n|\n)\s*/g, '\n')
    .replace(/\(\n/g, '(')
    .replace(/,\n/g, ',')
    .replace(/\/\*\*/g, '\n/**')
    .replace(/\n\/\//g, '\n\n//')

  return beautify(content, {
    indent_with_tabs: false,
    indent_size: 2,
    jslint_happy: true,
    end_with_newline: true,
    space_after_anon_function: true
  })
}

/**
 * JSON转换成字符串，并把双引号转换成单引号
 * @param json
 */
function stringify(json) {
  let str = JSON.stringify(json)
    // return str.replace(/'/g, '\\\'').replace(/"/g, '\'')
  return str.replace(/\'/g, '\\\'').replace(/\"/g, '\'')
}
/**
 * 解析models
 * @param models
 * @returns {{}}
 */
function parseModels(models) {
  let result = {}
  _.each(models, function(model, name) {
    result[name] = parseModel(model, name)
  })
  return result
}

/**
 * 解析单个model
 * @param model
 * @param name
 * @returns {Array}
 */
function parseModel(model, name) {
  let result = []
  if (_.isArray(model)) {
    _.each(model, function(item) {
      if (item.disabled !== true && item.path) {
        result = result.concat(parseModel(item, name))
      }
    })
  } else {
    if (model.disabled !== true && model.path) {

      if (model.methods === false) {
        if ((!model.state && !model.method) || !model.name) {
          throw Error('methods为false时，必须要设置state 和 name')
        }
        let options = _.extend({}, { method: 'post' }, model.options || {})
        result.push({
          path: model.path,
          prefix: model.prefix || GLOBAL_CONFIG.pathPrefix,
          options: options,
          columns: model.columns,
          methodType: model.method || model.name,
          httpMethod: options.method,
          suffix: '',
          upperSnakeCaseName: toUpperSnakeCaseName(model.name),
          camelCaseName: toCamelCase(model.name),
          ajaxParam: AJAX_PARAM_NAME_MAP[options.method] || 'query',
          template: model.template,
          name: model.name,
          state: model.state
        })
      } else {
        let methods = model.methods || GLOBAL_CONFIG.methods
        _.each(methods, function(method) {
          // ajax请求类型
          let httpMethod = GLOBAL_CONFIG.methodTypeMap[method] || 'get'
            // vue-resource options
          let options = _.extend({}, { method: httpMethod }, method.options || {})
          result.push({
            path: model.path,
            prefix: model.prefix || GLOBAL_CONFIG.pathPrefix,
            suffix: GLOBAL_CONFIG.methodSuffixMap[method] || '',
            options: options,
            columns: model.columns,
            methodType: method,
            httpMethod: httpMethod,
            upperSnakeCaseName: toUpperSnakeCaseName(method + '_' + name),
            camelCaseName: toCamelCase(method + '_' + name),
            ajaxParam: AJAX_PARAM_NAME_MAP[httpMethod] || 'query',
            template: model.template
          })
        })
      }
    }
  }
  return result
}

/**
 * 生成api文件
 */
function writeApi() {
  _.each(MODELS, function(model, name) {
    let items = [],
      configKeys = []
    _.each(model, function(item) {
        if (item.prefix) {
          configKeys.push(item.prefix)
        }
        let url = item.path + item.suffix
        let keys = []
        pathToRegexp(url, keys)

        // 去重，在数组中已存在的URL不加进去
        if (!items.some(n => n.URL === item.upperSnakeCaseName)) {
          items.push({
            URL: item.upperSnakeCaseName,
            url: item.path + item.suffix,
            prefix: item.prefix,
            params: keys.map(n => n.name),
            camelCaseName: item.camelCaseName,
            options: item.options,
            ajaxParam: item.ajaxParam
          })
        }
      })
      // 去重
    configKeys = _.uniq(configKeys)
    writeFile(OUTPUT_API_PATH, name, beautifyJs(apiRender({
      configKeys: configKeys,
      items: items
    })))
  })
}

/**
 * 生成mock文件
 */
function writeMock() {
  let dbConfig = [],
    extendsArray = []
  _.each(MODELS, function(model, name) {
    dbConfig.push(`import ${name} from './code/${name}'`)
    extendsArray.push(`...${name}`)
    let mocks = [],
      importApiArray = [],
      templateArray = []
    _.each(model, function(item) {
      if (item.columns || item.template) {
        importApiArray.push(item.upperSnakeCaseName)
      }
      if (item.template) {
        templateArray.push(item.template)
      }
      if (item.columns || item.template) {
        mocks.push({
          URL: item.upperSnakeCaseName,
          page: GLOBAL_CONFIG.statePageName || 'page',
          limit: GLOBAL_CONFIG.statePageSizeName || 'limit',
          total: GLOBAL_CONFIG.stateTotalName || 'total',
          list: GLOBAL_CONFIG.stateListName || 'list',
          httpMethod: item.httpMethod,
          methodType: item.methodType,
          columns: stringify(item.columns || {}, '', '\t'),
          template: item.template
        })
      }
    })
    importApiArray = _.uniq(importApiArray)
    templateArray = _.uniq(templateArray)
    writeFile(OUTPUT_MOCK_PATH, name, beautifyJs(mockRender({
      importApiArray: importApiArray,
      name: name,
      mocks: mocks,
      code: GLOBAL_CONFIG.mockCodeName || 'code',
      data: GLOBAL_CONFIG.mockDataName || 'data',
      message: GLOBAL_CONFIG.mockMsgName || 'message',
      templateArray: templateArray,
      codeValue: GLOBAL_CONFIG.successCodeValue
    })))
  })
  dbConfig.push(`export default [${extendsArray.join(', ')}]`)
  writeFile('./src/mock/', 'config', dbConfig.join('\n') + '\n')
}

/**
 * 生成store文件
 */
function writeStore() {
  let types = {}
  let config = [],
    extendsArray = []
  _.each(MODELS, function(model, name) {
    config.push(`import ${name} from './code/${name}'`)
    extendsArray.push(name)

    let importTypeArray = [],
      importApiArray = [],
      customStateArray = [],
      items = []
    types[name] = []
    _.each(model, function(item) {
      types[name].push({
        name: item.upperSnakeCaseName
      })
      importTypeArray.push(item.upperSnakeCaseName)
      importApiArray.push(item.camelCaseName)
      if (item.state) {
        customStateArray.push(item.state)
      }
      let url = item.path + item.suffix
      let keys = []
      pathToRegexp(url, keys)

      items.push({
        NAME: item.upperSnakeCaseName,
        name: item.camelCaseName,
        state: item.state,
        params: keys.map(n => n.name),
        httpMethod: item.httpMethod,
        methodType: item.methodType,
        ajaxParam: item.ajaxParam
      })
    })
    importTypeArray = _.uniq(importTypeArray)
    importApiArray = _.uniq(importApiArray)
    customStateArray = _.uniq(customStateArray)

    writeFile(OUTPUT_STORE_PATH, name, beautifyJs(storeRender({
      name: name,
      importTypeArray: importTypeArray,
      importApiArray: importApiArray,
      customStateArray: customStateArray,
      page: GLOBAL_CONFIG.statePageName || 'page',
      limit: GLOBAL_CONFIG.statePageSizeName || 'limit',
      total: GLOBAL_CONFIG.stateTotalName || 'total',
      list: GLOBAL_CONFIG.stateListName || 'list',
      model: GLOBAL_CONFIG.stateModelName || 'model',
      items: items
    })))

  })

  writeFile(OUTPUT_STORE_TYPES_PATH, 'types', beautifyJs(typesRender({ types: types })))
  config.push(`export default {${extendsArray.join(', ')}}`)
  writeFile('./src/store/', 'modules', config.join('\n') + '\n')
}

/**
 * 生成elementUI组件引用
 */
function writeElementUI() {
  let content = [`import Vue from 'vue'`]
  content.push(`import { ${ELEMENT_UI.join(',\n')} } from 'element-ui';`)
  _.each(ELEMENT_UI, function(module, i) {
    switch (module) {
      case 'Loading':
        content.push(`Vue.use(${module}.directive);`)
        content.push('Vue.prototype.$loading = Loading.service;')
        break
      case 'Message':
        content.push('Vue.prototype.$message = Message;')
        break
      case 'MessageBox':
        content.push('Vue.prototype.$msgbox = MessageBox;')
        content.push('Vue.prototype.$alert = MessageBox.alert;')
        content.push('Vue.prototype.$confirm = MessageBox.confirm;')
        content.push('Vue.prototype.$prompt = MessageBox.prompt;')
        break
      case 'Notification':
        content.push('Vue.prototype.$notify = Notification;')
        break
      default:
        content.push(`Vue.use(${module});`)
        break

    }
  })
  content.push('export default Vue;')
  writeFile('./src/', 'elementui', beautifyJs(content.join('\n')))
}

function init() {
  console.info('开始构建code ......')
  writeApi()
  writeMock()
  writeStore()
  writeElementUI()
  console.info('构建code完成。')
}

init()
