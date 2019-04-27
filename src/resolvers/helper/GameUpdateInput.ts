import { Game } from '@/entities';
import { GameStatus } from '@/entities/helper';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class GameUpdateInput implements Partial<Game> {
  @Field(() => Int!)
  id!: number;

  @Field(() => String)
  status: GameStatus;
}
