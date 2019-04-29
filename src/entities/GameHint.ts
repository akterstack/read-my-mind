import { Game, User } from '@/entities';
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

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  answer: HostAnswer;

  @Field(() => User)
  @ManyToOne(() => User, user => user.playerOfGames, { eager: true })
  player: User;

  @Field(() => Game)
  @ManyToOne(() => Game, game => game.hints, { eager: true })
  game: Game;

  @Field()
  @Column({ default: new Date() })
  created: Date = new Date();

  @Field()
  @Column({ default: new Date() })
  updated: Date = new Date();
}
