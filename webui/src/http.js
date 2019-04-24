import { GraphQLError } from 'graphql';
import Axios from 'axios';

export const http = Axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 10000,
});

const token = localStorage.getItem('token');
if (token) {
  http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export async function executeGraphQL(query, variables) {
  console.debug(query);
  console.debug(variables);
  const res = await http.post('', {
    query,
    variables,
  });
  if (res.data.errors) {
    console.debug(`GraphQL Error`);
    console.log(res.data.errors);
    throw new GraphQLError(res.data.errors);
  }
  return res.data.data;
}

export default http;
