import { CommittedPlayer, Game, User } from '@/entities';
import { GameStatus } from '@/entities/helper';
import { Context } from '@/resolvers/helper';
import { CommittedPlayerService, GameService } from '@/services';
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
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

export class GameResolver {
  constructor(
    private readonly gameService: GameService,
    private readonly committedPlayerService: CommittedPlayerService,
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(CommittedPlayer)
    private readonly committedPlayerRepository: Repository<CommittedPlayer>
  ) {}

  @Query(() => Game)
  game(@Arg('id', () => Int) id: number): Promise<Game> {
    return this.gameRepository.findOne(id);
  }

  @Query(() => [Game])
  async gamesToJoin(@Ctx() { user }: Context): Promise<Game[]> {
    return (await this.gameRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.host', 'host')
      .leftJoinAndSelect('game.players', 'player')
      .where('game.status = :status', { status: GameStatus.PUBLISED })
      .andWhere('host.id != :hostId', { hostId: user.id })
      .andWhere('(player.id != :playerId OR player.id ISNULL)', {
        playerId: user.id,
      })
      .getMany()).filter(game => {
      // @ts-ignore
      return game.maxPlayer > game.__players__.length;
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
      take: 100,
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
    @Ctx() { user }: Context,
    @PubSub('GAME_UPDATE') updateGamePublisher: Publisher<Game>,
    @PubSub('GAME_IN_SESSION') sessionGamePublisher: Publisher<Game>
  ): Promise<Game> {
    const gameInSession = await this.gameService.gameInSession(user);
    if (status === GameStatus.STARTED && gameInSession) {
      throw new Error('GAME_IN_SESSION');
    }
    const game = await this.gameRepository.findOne({
      id,
      host: { id: user.id },
    });
    if (!game) {
      throw new Error(
        `Game not exists or you are not the owner of the Game { id: ${id} }`
      );
    }
    const gameToUpdate = { ...game, status };
    // @ts-ignore
    const latestGame = await this.gameService.save(gameToUpdate);
    await updateGamePublisher(latestGame);
    await sessionGamePublisher(latestGame);
    return latestGame;
  }

  @Mutation(() => Game)
  async gameDelete(
    @Arg('id', () => Int) id: number,
    @Ctx() { user }: Context,
    @PubSub('GAME_DELETE') deleteGamePublisher: Publisher<Game>
  ): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: {
        id,
        host: { id: user.id },
      },
    });
    if (!game) {
      throw new Error(
        `Game not exists or you are not the owner of the Game { id: ${id} }`
      );
    }
    await this.gameRepository.delete(id);
    await deleteGamePublisher(game);
    return game;
  }

  @Mutation(() => Game)
  async gameJoin(
    @Arg('id', () => Int!) id: number,
    @Ctx() { user }: Context,
    @PubSub('JOIN_GAME') publishJoinGame: Publisher<Game>
  ): Promise<Game> {
    const game = await this.gameRepository.findOne(id);
    if (game.host.id === user.id) {
      throw new Error('You cannot join your own game');
    }
    const myUser = await this.userRepository.findOne(user.id);
    (await game.players).push(myUser);
    // @ts-ignore
    const latestGame = await this.gameService.save(game);
    await publishJoinGame(latestGame);
    return latestGame;
  }

  @Mutation(() => CommittedPlayer)
  async commitWord(
    @Arg('word') word: string,
    @Arg('gameId', () => Int!) gameId: number,
    @Ctx() { user }: Context
  ): Promise<CommittedPlayer> {
    // @ts-ignore
    const committedPlayer = await this.committedPlayerService.save(
      word,
      gameId,
      user.id
    );
    return this.committedPlayerRepository.findOne(committedPlayer.id);
  }

  @Subscription({
    topics: ['GAME_CREATE', 'GAME_UPDATE', 'GAME_DELETE'],
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

  @Subscription({
    topics: 'JOIN_GAME',
    filter: ({ payload, context: { user } }) => {
      return payload.host.id === user.id;
    },
  })
  onJoinGame(@Root() gamePayload: Game): Game {
    return gamePayload;
  }
}
