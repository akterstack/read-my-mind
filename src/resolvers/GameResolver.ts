import { Game } from '@/entities';
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

  @Mutation(() => Game)
  async gameCreate(
    @Arg('word') word: string,
    @Arg('maxPlayer', () => Int, { nullable: true }) maxPlayer: number,
    @Arg('maxHint', () => Int, { nullable: true }) maxHint: number,
    @Arg('status', { nullable: true }) status: string,
    @Ctx() { user }: Context
  ): Promise<Game> {
    // @ts-ignore
    const gameUpToDate: Game = await this.gameService.save({
      word,
      maxPlayer,
      maxHint,
      status,
      host: { id: user.id },
    });
    return this.gameRepository.findOne(gameUpToDate.id);
  }

  @Mutation(() => Game)
  gameUpdate(id: number, args): Promise<Game> {
    const game = this.gameRepository.findOne(id);
    const gameToUpdate = { ...game, ...args };
    // @ts-ignore
    return this.gameService.save(gameToUpdate);
  }
}
