import { Game, User } from '@/entities';
import { GameStatus } from '@/entities/helper';
import { Context } from '@/resolvers/helper';
import { GameService } from '@/services';
import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Publisher,
  PubSub,
  Query,
  Root,
  Subscription,
} from 'type-graphql';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

export class GameResolver {
  constructor(
    private gameService: GameService,
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  @Query(() => Game)
  game(@Arg('id', () => Int) id: number): Promise<Game> {
    return this.gameRepository.findOne(id);
  }

  @Query(() => [Game])
  async gamesToJoin(@Ctx() { user }: Context): Promise<Game[]> {
    return this.gameRepository.find({
      relations: ['host', 'players'],
      where: [
        {
          status: GameStatus.PUBLISED,
          host: { id: Not(user.id) },
        },
      ],
    });
  }

  @Query(() => Game)
  async gameInSession(@Ctx() { user }: Context): Promise<Game> {
    return this.gameService.gameInSession(user);
  }

  @Query(() => [Game])
  async hostedGames(@Ctx() { user }: Context): Promise<Game[]> {
    return this.gameRepository.find({
      relations: ['players'],
      where: [
        {
          host: { id: user.id },
        },
      ],
      order: {
        updated: 'DESC',
      },
      take: 10,
      cache: true,
    });
  }

  @Query(() => [Game])
  playedGames(@Ctx() { user }: Context): Promise<Game[]> {
    return this.gameRepository
      .createQueryBuilder('game')
      .leftJoin('game.players', 'player')
      .where('player.id = :playerId', {
        playerId: user.id,
      })
      .getMany();
  }

  @Mutation(() => Game)
  async gameCreate(
    @Arg('word') word: string,
    @Arg('maxPlayer', () => Int, { nullable: true }) maxPlayer: number,
    @Arg('maxHint', () => Int, { nullable: true }) maxHint: number,
    @Arg('status', { nullable: true }) status: string,
    @Ctx() { user }: Context,
    @PubSub('GAME_CREATE') publish: Publisher<Game>
  ): Promise<Game> {
    const gameInSession = await this.gameService.gameInSession(user);
    if (status === GameStatus.STARTED && gameInSession) {
      throw new Error('GAME_IN_SESSION');
    }
    // @ts-ignore
    const game: Game = await this.gameService.save({
      word,
      maxPlayer,
      maxHint,
      status,
      host: { id: user.id },
    });
    const fullGame = await this.gameRepository.findOne(game.id);
    await publish(fullGame);
    return fullGame;
  }

  @Mutation(() => Game)
  async gameUpdate(
    @Arg('id', () => Int) id: number,
    @Arg('status') status: string,
    @Ctx() ctx: Context,
    @PubSub('GAME_UPDATE') updateGamePublisher: Publisher<Game>,
    @PubSub('GAME_IN_SESSION') sessionGamePublisher: Publisher<Game>
  ): Promise<Game> {
    const gameInSession = await this.gameService.gameInSession(ctx.user);
    if (status === GameStatus.STARTED && gameInSession) {
      throw new Error('GAME_IN_SESSION');
    }
    const game = await this.gameRepository.findOne(id);
    if (game.host.id !== ctx.user.id) {
      throw new Error('You are not the host of this game');
    }
    const gameToUpdate = { ...game, status };
    // @ts-ignore
    const latestGame = await this.gameService.save(gameToUpdate);
    await updateGamePublisher(latestGame);
    await sessionGamePublisher(latestGame);
    return latestGame;
  }

  @Mutation(() => Game)
  async gameJoin(
    @Arg('id', () => Int) id: number,
    @Ctx() { user }: Context
  ): Promise<Game> {
    const game = await this.gameRepository.findOne(id);
    if (game.host.id === user.id) {
      throw new Error('You cannot join your own game');
    }
    const myUser = await this.userRepository.findOne(user.id);
    (await game.players).push(myUser);
    // @ts-ignore
    return this.gameService.save(game);
  }

  @Subscription({
    topics: ['GAME_CREATE', 'GAME_UPDATE'],
  })
  gameSubscribe(@Root() gamePayload: Game): Game {
    return gamePayload;
  }

  @Subscription({
    topics: 'GAME_IN_SESSION',
    filter: ({ payload, context: { user } }) => {
      return payload.__players__.map(player => player.id).includes(user.id);
    },
  })
  gameInSessionSubscribe(@Root() gamePayload: Game): Game {
    return gamePayload;
  }
}
