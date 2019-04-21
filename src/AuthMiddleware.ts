import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';

const isPublicApi = ({ info }) => {
  const api = `${info.parentType.name}.${info.fieldName}`;
  return api === 'Mutation.signup' || api === 'Query.login';
};

export class AuthMiddleware implements MiddlewareInterface {
  async use({ context, info }: ResolverData<any>, next: NextFn) {
    if (context.user || isPublicApi({ info })) {
      return next();
    }
    throw Error('401 | Unauthorized access.');
  }
}
