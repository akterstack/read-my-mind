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
      return apollo.mutate({
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
        update: (proxy, { data }) => {
          const token = data.signup;
          localStorage.setItem('token', token);
          dispatch('fetchUserLoginInfo');
        },
      });
    },
    async login({ dispatch }, { username, password }) {
      return apollo.mutate({
        mutation: gql`
          mutation Login($username: String!, $password: String!) {
            login(username: $username, password: $password)
          }
        `,
        variables: {
          username,
          password,
        },
        update: (proxy, { data }) => {
          const token = data.login;
          localStorage.setItem('token', token);
          dispatch('fetchUserLoginInfo');
        },
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
