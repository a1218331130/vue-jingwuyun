export default {
  components: {},
  data() {
    return {
      infoDialogData: null,
      peopleInfoDialog: false,
      carInfoDialog: false,
      mobileInfoDialog: false
    }
  },
  computed: {},
  methods: {
    /**
     * 要素列点击事件
     * @desc {
     *    idCard:'身份证',
     *    plateNum:'车牌号',
     *    caseNum:'案件编号',
     *    tel:'电话号码'
     * }
     * @param  {String} type 要素类型
     * @param  {String} val  查询对象关键字
     * @param  {Object} data 实体数据对象
     */
    colOnClickEvent(type, val, data) {
      if(data.HasQx !== 'False') {
        switch(type) {
          case 'name':
            this.openInfoDialog(1, val, data)
            break
          case 'idCard':
          case 'SFZH':
            this.openInfoDialog(1, val, data)
            break
          case 'plateNum':
          case 'CPHM':
            this.openInfoDialog(2, val, data)
            break
          case 'caseNum':
          case 'AJBH':
            this.openInfoDialog(4, val, data)
            break
          case 'tel':
          case 'LXDH':
            this.openInfoDialog(3, val, data)
            break
          case 'bankAccount':
            this.$alert('链接银行账号详情', '测试提示')
            break
          case 'qq':
            this.$alert('链接QQ号码相关内容', '测试提示')
            break
          case 'email':
            this.$alert('链接电子邮箱相关内容', '测试提示')
            break
          default:
            return false
        }
      }
    },
    /**
     * 打开对象信息窗口
     * @param  {String} type 要素类型, 参考 要素列点击事件
     * @param  {String} val  查询对象关键字
     * @param  {Object} data 实体数据对象
     */
    openInfoDialog(type, val, data) {
      if(type) {
        let targetType = type,
          targetVal = val
        if(type instanceof Object) {
          targetType = type.type
          targetVal = type.key
        }
        // if (data) {
        //   data.contentType = type
        //   this.detail = data
        // } else {
        //   this.detail.contentType = type
        // }
        this.infoDialogData = { contentType: targetType, keyId: targetVal }
        switch(targetType) {
          case 1:
            this.peopleInfoDialog = true
            break
          case 2:
            this.carInfoDialog = true
            break
          case 3:
            this.mobileInfoDialog = true
            break
          case 4:
            this.mobileInfoDialog = true
            break
          default:
        }
      }
    }
  }
}
