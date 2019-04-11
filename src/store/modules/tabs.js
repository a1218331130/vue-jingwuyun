/**
 *  {label, name}
 */
export default {
  state: {
    list: [],
    selected: ''
  },
  mutations: {
    pushTab(state, payload) {
      // tab: {label, name}
      let tab = payload.tab
      let hasTab = false
      state.list.forEach(item => {
        // 如果当前的列表中已经存在了要添加的tab，把tab改成选中状态
        if (item.name === tab.name) {
          state.selected = item.name
          hasTab = true
        }
      })

      // 如果不存在要添加tab，即追加到列表最后，并改成选中状态
      if (!hasTab) {
        state.list.push(tab)
        state.selected = tab.name
      }

      // 只有一个选项卡时允许删除
      state.list.forEach(item => {
        item.closable = true
      })

      // 只有一个选项卡时不允许删除
      //   if (state.list.length === 1) {
      //     const tab = state.list[0]
      //     tab.closable = false
      //     state.list.splice(0, 1, tab)
      //   } else {
      //     state.list.forEach(item => {
      //       item.closable = true
      //     })
      //   }
    },
    remove(state, payload) {
      const name = payload.name
      state.list.forEach((item, index) => {
        if (item.name === name) {
          state.list.splice(index, 1)
        }
      })

      if (name === state.selected && state.list.length > 0) { // 删除后最后一个选项卡变为选中状态
        state.selected = state.list[state.list.length - 1].name
      } else if (state.list.length === 0) { // 无选项卡(最后一个选项卡被删除)时触发回调
        if (payload.emptyCallBack) payload.emptyCallBack()
      }

      // 只有一个选项卡时不允许删除
      //   if (state.list.length === 1) {
      //     const tab = state.list[0]
      //     tab.closable = false
      //     state.list.splice(0, 1, tab)
      //   }
    }
  }
}
