import Vue from 'vue';
import { default as Vuex, Store } from 'vuex';
import persistState from 'vuex-persistedstate';
import gql from 'graphql-tag';
import { default as apollo } from '@/apollo';
import { auth } from './modules';

Vue.use(Vuex);

function initGame() {
  return {
    status: '',
    word: '',
    maxPlayer: 1,
    maxHint: 20,
  };
}

export default new Store({
  plugins: [persistState()],
  modules: {
    auth,
  },
  state: {
    redirectTo: '',
    game: initGame(),
    isWinner: false,
  },
  actions: {
    async createGame({ state, commit }) {
      const data = await apollo.mutate({
        mutation: gql`
          mutation CreateGame(
            $word: String!
            $maxPlayer: Int
            $maxHint: Int
            $status: String
          ) {
            gameCreate(
              word: $word
              maxPlayer: $maxPlayer
              maxHint: $maxHint
              status: $status
            ) {
              id
              status
            }
          }
        `,
        variables: state.game,
      });
      commit('setGame', data.gameCreate);
    },
    updateGame({ commit }, { id, status }) {
      return apollo.mutate({
        mutation: gql`
          mutation StartGame($id: Int!, $status: String!) {
            gameUpdate(id: $id, status: $status) {
              id
              status
            }
          }
        `,
        variables: {
          id,
          status,
        },
        update: (proxy, { data: { gameUpdate } }) => {
          commit('setGame', gameUpdate);
        },
      });
    },
  },
  mutations: {
    redirectTo(state, path) {
      if (path === '/signup' || path === '/login') return;
      state.redirectTo = path;
    },
    setGame(state, game) {
      state.game = { ...state.game, ...game };
    },
    clearGame(state) {
      state.game = initGame();
    },
    setCelebration(state, isWinner) {
      state.isWinner = isWinner;
    },
  },
});
