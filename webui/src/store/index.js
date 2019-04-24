import Vue from 'vue';
import { default as Vuex, Store } from 'vuex';
import persistState from 'vuex-persistedstate';
import { executeGraphQL } from '@/http';
import { auth } from './modules';

Vue.use(Vuex);

export default new Store({
  plugins: [persistState()],
  state: {
    redirectTo: '',
    game: {
      status: '',
      word: '',
      maxPlayer: 1,
      maxHint: 20,
    },
  },
  actions: {
    async createGame({ state, commit }) {
      const data = await executeGraphQL(
        `
          mutation CreateGame(
            $word: String!
            $maxPlayer: Int
            $maxHint: Int
            $status: String
            $hostId: Int!
          ) {
            gameCreate(
              word: $word
              maxPlayer: $maxPlayer
              maxHint: $maxHint
              status: $status
              hostId: $hostId
            ) {
              id
              status
            }
          }
        `,
        { ...state.game, hostId: state.auth.user.id }
      );
      commit('setGame', data);
    },
  },
  mutations: {
    redirectTo(state, path) {
      state.redirectTo = path;
    },
    setGame(state, game) {
      state.game = { ...state.game, ...game };
    },
  },
  modules: {
    auth,
  },
});
