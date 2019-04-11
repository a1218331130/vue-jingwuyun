/**
 *  {label, value}
 */
export default {
  state: [],
  mutations: {
    pushDict(state, payload) {
      if (!state.find(s => s.type === payload.type)) {
        state.push(payload)
      }
    }
  }
}
