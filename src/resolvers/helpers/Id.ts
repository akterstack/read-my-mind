import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class Id {
  @Field(() => Int!)
  id: number;
}
