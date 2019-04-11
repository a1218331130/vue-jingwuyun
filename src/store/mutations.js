export default {
  zsmbFormIncrement(state, n) {
    if (!state.knowTemplate.Model) {
      state.knowTemplate.Model = {
        ZDDXXLIST: []
      }
    }
    state.knowTemplate.Model.ZDDXXLIST.push(n);
  },
  redueForm(state, n) {
    state.knowTemplate.Model.ZDDXXLIST.splice(n, 1);
  },
  createNewZSMBModel(state) {
    state.knowTemplate.Model = {
      ZSKMBMC: '',
      ZSKBQ: '',
      ZSKMS: '',
      SX: 0,
      ZDDXXLIST: []
    };
  }
}
