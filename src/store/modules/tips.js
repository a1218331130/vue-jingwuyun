/**
 *  提示框状态
 */
export default {
  state: {
    isTipsing: false
  },
  mutations: {
    changeTipsingState(state, payload) {
      state.isTipsing = payload
    }
  }
}
