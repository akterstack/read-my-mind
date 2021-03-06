import gql from 'graphql-tag';
import apollo from '@/apollo';

export default {
  namespaced: true,
  state: {
    status: '',
    token: localStorage.getItem('token'),
    user: false,
  },
  actions: {
    async signup({ dispatch }, { username, password, confirmPassword }) {
      return new Promise(resolve => {
        apollo.mutate({
          mutation: gql`
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
          variables: {
            username,
            password,
            confirmPassword,
          },
          update: async (proxy, { data }) => {
            const token = data.signup;
            localStorage.setItem('token', token);
            await dispatch('fetchUserLoginInfo');
            resolve();
          },
        });
      });
    },
    async login({ dispatch }, { username, password }) {
      return new Promise(resolve => {
        apollo.mutate({
          mutation: gql`
            mutation Login($username: String!, $password: String!) {
              login(username: $username, password: $password)
            }
          `,
          variables: {
            username,
            password,
          },
          update: async (proxy, { data }) => {
            const token = data.login;
            localStorage.setItem('token', token);
            await dispatch('fetchUserLoginInfo');
            resolve();
          },
        });
      });
    },
    async fetchUserLoginInfo({ commit }) {
      const { data } = await apollo.query({
        query: gql`
          query {
            userLoginInfo {
              id
              username
            }
          }
        `,
      });
      await commit('success', {
        token: localStorage.getItem('token'),
        user: data.userLoginInfo,
      });
    },
    async logout({ commit }) {
      localStorage.removeItem('token');
      await commit('logout');
    },
  },
  mutations: {
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
      state.user = false;
    },
  },
};
