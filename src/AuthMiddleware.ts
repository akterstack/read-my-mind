import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';

export class AuthMiddleware implements MiddlewareInterface {
  async use({ context, info }: ResolverData<any>, next: NextFn) {
    const api = `${info.parentType.name}.${info.fieldName}`;
    if (context.user) {
      return next();
    } else if (api === 'Mutation.signup' || api === 'Query.login') {
      return next();
    }
    throw Error('401 | Unauthorized access.');
  }
}
