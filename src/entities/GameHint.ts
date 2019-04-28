import { Game } from '@/entities';
import { HostAnswer } from '@/entities/helper';
import { Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class GameHint {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: false })
  @Column()
  question!: string;

  @Field(() => String)
  @Column()
  answer: HostAnswer;

  @Field(() => Game, { nullable: false })
  @ManyToOne(() => Game, game => game.hints)
  game: Game;
}
