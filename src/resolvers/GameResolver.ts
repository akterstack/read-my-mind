import { Game } from '@/entities';
import { GameStatus } from '@/entities/helper';
import { Context } from '@/resolvers/helper';
import { GameService } from '@/services';
import { Arg, Ctx, Int, Mutation, Query } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

export class GameResolver {
  constructor(
    private gameService: GameService,
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>
  ) {}

  @Query(() => Game)
  game(@Arg('id', () => Int) id: number): Promise<Game> {
    return this.gameRepository.findOne(id);
  }

  @Query(() => [Game])
  gameList(): Promise<Game[]> {
    return this.gameRepository.find({
      relations: ['players'],
      where: [
        {
          status: GameStatus.PUBLISED,
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
    @Ctx() { user }: Context
  ): Promise<Game> {
    const gameInSession = await this.gameService.gameInSession(user);
    if (status === GameStatus.STARTED && gameInSession) {
      throw new Error('You have a game in session.');
    }
    // @ts-ignore
    const game: Game = await this.gameService.save({
      word,
      maxPlayer,
      maxHint,
      status,
      host: { id: user.id },
    });
    return this.gameRepository.findOne(game.id);
  }

  @Mutation(() => Game)
  gameUpdate(id: number, args): Promise<Game> {
    const game = this.gameRepository.findOne(id);
    const gameToUpdate = { ...game, ...args };
    // @ts-ignore
    return this.gameService.save(gameToUpdate);
  }
}
