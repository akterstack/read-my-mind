import axios from 'axios';
import { GraphQLError } from 'graphql';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 10000,
});

export async function execute(query, variables) {
  console.debug(query);
  console.debug(variables);
  const token = localStorage.getItem('token');
  api.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
  const res = await api.post('', {
    query,
    variables,
  });
  if (res.data.errors) {
    console.debug(`GraphQL Error ${res.data.errors}`);
    throw new GraphQLError(res.data.errors);
  }
  return res.data.data;
}

export default api;
