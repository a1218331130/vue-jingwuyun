export default {
  data() {
    return {
      tableColumnWidths: []
    }
  },
  methods: {
    /**
     * @param {any} list 传入列表
     * @param {any} columnArr 列名数组
     * @param {any} columnName 列名数组中的字段key
     * @param {any} options 自定义宽度
     * @returns {Array} 生成的宽度值数组
     */
    generateTableWidth(list, columnArr, columnName, options = {}) {
      let length = list.length >= 3 ? 3 : list.length;
      let widthArr = columnArr.map(r => {
        return 60;
      });
      for(let i = 0; i < length; i++) {
        for(let j = 0; j < columnArr.length; j++) {
          let count = list[i][columnArr[j][columnName]].toString().length;
          let isNotNum = isNaN(parseInt(list[i][columnArr[j][columnName]])) || parseInt(list[i][columnArr[j][columnName]]).toString().length !== list[i][columnArr[j][columnName]].toString().length;
          let isNotDate = new Date().toString() === 'Invalid Date';
          let offsetWidth = isNotNum && isNotDate ? 20 : 10;
          let colWidth = count * offsetWidth;
          if(options[columnArr[j][columnName]]) {
            widthArr[j] = options[columnArr[j][columnName]];
          } else if(widthArr[j] < colWidth) {
            widthArr[j] = colWidth;
          }
        }
      }
      return widthArr;
    }
  }
}
