import { GameStatus } from '@/GameStatus';
import { IsNotEmpty, Max } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class Game {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @IsNotEmpty()
  word: string;

  @Field()
  @Max(10)
  @Column({ default: 1 })
  maxPlayer: number;

  @Field()
  @Max(20)
  @Column({ default: 20 })
  maxHint: number;

  @Field()
  @Column({ default: GameStatus.CREATED })
  @IsNotEmpty()
  status: GameStatus;

  @Field()
  @Column({ default: new Date() })
  created: Date = new Date();

  @Field()
  @Column({ default: new Date() })
  updated: Date = new Date();

  @Field(() => User)
  @ManyToOne(() => User, user => user.hostOfGames, {
    nullable: false,
  })
  host: User;

  @Field(() => [User])
  @ManyToMany(() => User, user => user.playerOfGames)
  players: User[];
}
