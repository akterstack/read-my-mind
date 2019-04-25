import { Context } from '@/resolvers/helper';
import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';

const isPublicApi = ({ info }) => {
  const api = `${info.parentType}.${info.fieldName}`;
  return api === 'Mutation.signup' || api === 'Mutation.login';
};

export class AuthMiddleware implements MiddlewareInterface<Context> {
  async use({ context, info }: ResolverData<Context>, next: NextFn) {
    if (context.user || isPublicApi({ info })) {
      return next();
    }
    throw Error('401 | Unauthorized access.');
  }
}
