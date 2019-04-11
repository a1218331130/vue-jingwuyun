// doc https://github.com/surmon-china/vue-quill-editor
export default {
  data() {
    return {
      editorOptions: {
        placeholder: '请输入内容 ...',
        readOnly: false,
        delta: {
          ops: [
            { insert: 'White', attributes: { color: '#fff' } }
          ]
        },
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'], // toggled buttons
            // [{ 'size': ['small', false, 'large'] }], // custom dropdown
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            // ['blockquote', 'code-block'],
            // [{'header': 1}, {'header': 2}],               // custom button values
            // [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
            // [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
            // [{'direction': 'rtl'}],                         // text direction
            // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
            [{ 'align': [] }]
          ]
        }
      }
    }
  }
}
