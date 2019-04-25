import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class LoggedInUser {
  @Field(() => Int)
  id: number;
  @Field()
  username: string;
}
