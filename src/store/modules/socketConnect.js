export default {
  state: { socketConnected: false },
  mutations: {
    socketConnected(state, payload) {
      state.socketConnected = payload
    }
  }
}
