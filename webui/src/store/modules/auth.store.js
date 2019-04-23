import http, { executeGraphQL } from '@/http';

export default {
  namespaced: true,
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: {},
  },
  getters: {
    isLoggedIn: state => !!state.token,
    status: state => state.status,
  },
  actions: {
    async signup(
      { dispatch, commit },
      { username, password, confirmPassword }
    ) {
      commit('pending');
      const data = await executeGraphQL(
        `
          mutation CreateAccount(
            $username: String!
            $password: String!
            $confirmPassword: String!
          ) {
            signup(
              username: $username
              password: $password
              confirmPassword: $confirmPassword
            )
          }
        `,
        {
          username,
          password,
          confirmPassword,
        }
      );
      const token = data.signup;
      localStorage.setItem('token', token);
      http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch('fetchUserLoginInfo');
    },
    async login({ dispatch, commit }, { username, password }) {
      commit('pending');
      const data = await executeGraphQL(
        `
          mutation Login($username: String!, $password: String!) {
            login(username: $username, password: $password)
          }
        `,
        {
          username,
          password,
        }
      );
      const token = data.login;
      localStorage.setItem('token', token);
      http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch('fetchUserLoginInfo');
    },
    async fetchUserLoginInfo({ commit }) {
      const data = await executeGraphQL(
        `
          query {
            userLoginInfo {
              id
              username
            }
          }
        `
      );
      commit('success', {
        token: localStorage.getItem('token'),
        user: data.userLoginInfo,
      });
    },
    logout({ commit }) {
      localStorage.removeItem('token');
      commit('logout');
    },
  },
  mutations: {
    pending(state) {
      state.status = 'pending';
    },
    success(state, { token, user }) {
      state.status = 'success';
      state.token = token;
      state.user = user;
    },
    failed(state) {
      state.status = 'error';
    },
    logout(state) {
      state.status = '';
      state.token = '';
      state.user = '';
    },
  },
};
