import { GameHint } from '@/entities';
import { GameStatus } from '@/entities/helper';
import { IsNotEmpty, Max } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
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
  @IsNotEmpty()
  @Index()
  @Column({ default: GameStatus.CREATED })
  status: GameStatus;

  @Field(() => User)
  @Index()
  @ManyToOne(() => User)
  winner: User;

  @Field(() => User)
  @Index()
  @ManyToOne(() => User, user => user.hostOfGames, {
    nullable: false,
    eager: true,
  })
  host: User;

  @Field(() => [User])
  @ManyToMany(() => User, user => user.playerOfGames, { eager: true })
  @JoinTable()
  players: Promise<User[]>;

  @Field(() => [GameHint])
  @OneToMany(() => GameHint, hint => hint.game)
  hints: [GameHint];

  @Field()
  @Column({ default: new Date() })
  created: Date = new Date();

  @Field()
  @Column({ default: new Date() })
  updated: Date = new Date();
}
