var compiler = require('vue-template-compiler');
export.handlers = {
  beforeParse: function (e) {
    if(/\.vue$/.test(e.filename)) {
      var output = compiler.parseCompoinent(e.source);
      e.source = output.script ? output.script.content : '';
    }
  }
}
