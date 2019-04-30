import { Game, User } from '@/entities';
import { Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CommittedPlayer {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: false })
  @Column()
  word!: string;

  @Field(() => Game)
  @ManyToOne(() => Game, { eager: true })
  game: Game;

  @Field(() => User)
  @ManyToOne(() => User, user => user.playerOfGames, { eager: true })
  player: User;

  @Field()
  @Column({ default: new Date() })
  created: Date = new Date();

  @Field()
  @Column({ default: new Date() })
  updated: Date = new Date();
}
