import { execute } from '@/api';

export default {
  state: {},
  actions: {
    async signup({ dispatch }, { username, password, confirmPassword }) {
      const data = await execute(
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
      localStorage.setItem('token', data.signup);
      dispatch('fetchUserLoginInfo');
    },
    async login({ dispatch }, { username, password }) {
      const data = await execute(
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
      localStorage.setItem('token', data.login);
      dispatch('fetchUserLoginInfo');
    },
    async fetchUserLoginInfo({ commit }) {
      const data = await execute(
        `
          query {
            userLoginInfo {
              id
              username
            }
          }
        `
      );
      commit('setUserLoginInfo', data.userLoginInfo);
    },
  },
  mutations: {
    setUserLoginInfo: (state, user) => {
      state.user = user;
    },
  },
};
