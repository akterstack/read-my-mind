import Axios from 'axios';

export const http = Axios.create({
  baseURL: 'http://localhost:4000/graphql',
  timeout: 10000,
});

const token = localStorage.getItem('token');
if (token) {
  http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export async function executeGraphQL(query, variables, onError) {
  if (typeof variables === 'function') {
    onError = variables;
    variables = {};
  }
  console.debug(`GraphQL Query/Mutation: ${query}`);
  console.debug(`GraphQL Variables: ${JSON.stringify(variables, null, 2)}`);
  const res = await http.post('', {
    query,
    variables,
  });
  if (res.data.errors) {
    if (typeof onError === 'function') {
      onError(res.data.errors);
    } else {
      throw res.data.errors;
    }
  }
  console.debug(`GraphQL Response: ${JSON.stringify(res.data, null, 2)}`);
  return res.data.data;
}

export default http;
