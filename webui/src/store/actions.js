import axios from 'axios';
import gql from 'graphql-tag';
import {executeGraphQL} from "@/http";

const api = axios.create({
  baseURL: 'http://localhost:4000/grqphql',
});

export default {
  async login({ commit }, { username, password }) {
    const [, data] = await executeGraphQL(
      gql`
        mutation Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            id
          }
        }
      `,
      {
        username,
        password,
      }
    );
    commit('setLogin', { login: data.id });
  },
};
