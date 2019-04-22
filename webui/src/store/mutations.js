export default {
  setLogin(state, login) {
    state.login = login;
  },
  buildGame(state, game) {
    state.game = { ...state.game, ...game };
  },
};
