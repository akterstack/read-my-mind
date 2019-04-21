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
  @IsNotEmpty()
  @Column()
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
  @Column({ default: true })
  isPublic: boolean;

  @Field(() => User)
  @ManyToOne(() => User, user => user.hostOfGames, {
    nullable: false,
  })
  host: User;

  @Field(() => [User])
  @ManyToMany(() => User, user => user.playerOfGames)
  players: User[];
}
