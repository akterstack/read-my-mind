import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class LoginInfo {
  @Field(() => Int)
  id: number;
  @Field()
  username: string;
}
