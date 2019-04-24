import { Game } from '@/entities';
import { GameService } from '@/services';
import { Arg, Int, Mutation, Query } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

export class GameResolver {
  constructor(
    private gameService: GameService,
    @InjectRepository(Game) private readonly gameRepository: Repository<Game> // private userRepository: UserRepository,
  ) {}

  @Query(() => Game)
  game(@Arg('id', () => Int) id: number): Promise<Game> {
    return this.gameRepository.findOne(id);
  }

  @Mutation(() => Game)
  async gameCreate(
    @Arg('word') word: string,
    @Arg('maxPlayer', () => Int, { nullable: true }) maxPlayer: number,
    @Arg('maxHint', () => Int, { nullable: true }) maxHint: number,
    @Arg('status', { nullable: true }) status: string,
    @Arg('hostId', () => Int) hostId: number
  ): Promise<Game> {
    // @ts-ignore
    const gameUpToDate: Game = await this.gameService.save({
      word,
      maxPlayer,
      maxHint,
      status,
      host: { id: hostId },
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
