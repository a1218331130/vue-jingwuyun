module.exports = {
  "tags": {
    "allowUnknownTags": true,
    "dictionaries": ["jsdoc"]
  },
  "source": {
    "include": [
      // "coder/schemas",
      "src/utils",
      "src/widgets",
      "src/components/analysis/relation/func.js",
      // "src/components",
      "package.json",
      "README.md"
    ],
    "includePattern": "\\.(vue|js)$",
    "excludePattern": "(node_modules/|docs|mock)"
  },
  // 使用插件
  "plugins": [
    "plugins/markdown",
    "./jsdoc-vue"
  ],
  "templates": {
    "systemName": "XDH-WEB",
    "copyright": "Copyright by 新德汇前端团队",
    "includeDate": "true",
    "navType": "vertical", // "{vertical|inline}"
    "theme": "Yeti",
    "cleverLinks": false,
    "monospaceLinks": true,
    "useLongnameInNav": false,
    "showInheritedInNav": false,
    "outputSourcePath": true
  },
  "opts": {
    "destination": "./docs/assemble/",
    "encoding": "utf8",
    "private": true,
    "recurse": true,
    // "template": "./node_modules/minami",
    "template": "./node_modules/ink-docstrap/template"
  }
}
