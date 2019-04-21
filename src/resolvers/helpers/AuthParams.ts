import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class AuthParams {
  @Field()
  username: string;

  @Field()
  password: string;
}
