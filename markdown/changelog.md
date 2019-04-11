# 项目工程模板更新日志

## v1.0.0
vue-cli 初始化项目工程模板，不支持测试
- 支持mock
- widgets提供draggable、resizable、layout、echarts、panel组件
- iconfont 图标库

## v1.1.0

### 新功能
- 增加代码生成器coder，支持生成api、Mock、store、elementUI引用代码
- 增加发布脚本release
- 新增从svn导出node_modules项目目录
- 新增公共tabs组件，支持以选项卡的方式加载路由页面
- 新增富文本编辑器vue-quill-editor

### 改进
- vue版本更新到v2.4.2
- element-ui 更新到 v1.4.1
- ajax、mock 支持URL路径参数
- build/build.js 支持模块导出Promise实例
- utils/mixin.js 支持登录注销, dispatch提供是否需要loading和错误提示的显示
- 登录成功支持url参数跳转到指定页面
- node_modules的node-sass包同时支持windows、mac、linux 64位系统

### 修复
- /src/api/ajax.js 不支持跨域发送cookie验证信息

## v1.2.0

### 计划
- 代码生成器可配置mock接口成功返回的code值 【完成】
- 菜单支持属性名称自定义 【完成】
- src/utils/util.js 增加 queryToString 键值对转换成查询字符串函数、深度拷贝对象函数clone 【完成】
- 表格树组件/src/widgets/tree-grid 【完成】
- 输入框下拉树选择组件/src/widgets/tree-select  【完成】
- 更新element-ui 到 v1.4.2 【完成】
- 框架菜单支持回传节点对象，可自定义跳转路径 【完成】
- UI组件示例页面
- coder 支持新增、更新、删除接口响应模拟数据自定义
- coder 使用手册
