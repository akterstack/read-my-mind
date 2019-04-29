import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  Entity, Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Game } from './Game';

@ObjectType()
@Entity()
@Unique('UQ_username', ['username'])
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Index()
  @Column()
  username: string;

  @Field()
  @Column()
  password: string;

  @Field(() => [Game])
  @OneToMany(() => Game, game => game.host)
  hostOfGames: Game[];

  @Field(() => [Game])
  @ManyToMany(() => Game, game => game.players)
  playerOfGames: Game[];

  @Field()
  @Column({ default: new Date() })
  created: Date = new Date();

  @Field()
  @Column({ default: new Date() })
  updated: Date = new Date();
}
