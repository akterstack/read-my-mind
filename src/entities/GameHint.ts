import { Game } from '@/entities';
import { HostResponse } from '@/entities/helper';
import { Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class GameHint {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  question: string;

  @Field()
  @Column()
  response: HostResponse;

  @Field()
  @ManyToOne(() => Game, game => game.hints)
  game: Game;
}
