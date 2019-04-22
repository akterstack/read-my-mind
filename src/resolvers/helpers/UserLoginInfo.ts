import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class UserLoginInfo {
  @Field(() => Int)
  id: number;
  @Field()
  username: string;
}
