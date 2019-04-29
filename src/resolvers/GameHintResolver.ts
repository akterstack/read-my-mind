import { GameHint, User } from '@/entities';
import { HostAnswer } from '@/entities/helper';
import { Context } from '@/resolvers/helper';
import { GameHintService } from '@/services';
import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Publisher,
  PubSub,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Resolver(User)
export class GameHintResolver {
  constructor(
    private hintService: GameHintService,
    @InjectRepository(GameHint)
    private readonly hintRepository: Repository<GameHint>
  ) {}

  @Query(() => [GameHint])
  async hints(
    @Arg('gameId', () => Int!) gameId: number,
    @Arg('playerId', () => Int, { nullable: true }) playerId: number,
    @Ctx() { user }: Context
  ): Promise<GameHint[]> {
    return this.hintRepository.find({
      where: {
        game: { id: gameId },
        player: { id: playerId || user.id },
      },
    });
  }

  @Mutation(() => GameHint)
  async askHint(
    @Arg('gameId', () => Int!) gameId: number,
    @Arg('question') question: string,
    @Ctx() { user }: Context,
    @PubSub('GAME_HINT_ASK') publisher: Publisher<GameHint>
  ): Promise<GameHint> {
    // @ts-ignore
    const hint = await this.hintService.save({
      question,
      game: { id: gameId },
      player: { id: user.id },
    });
    await publisher(hint);
    return hint;
  }

  @Mutation(() => GameHint)
  async giveAnswer(
    @Arg('id', () => Int!) id: number,
    @Arg('answer', () => String!) answer: string,
    @PubSub('GAME_HINT_ANSWER') publisher: Publisher<GameHint>
  ): Promise<GameHint> {
    const xHint = await this.hintRepository.findOne(id);
    xHint.answer =
      answer.toLowerCase() === 'yes' ? HostAnswer.YES : HostAnswer.NO;
    // @ts-ignore
    const nHint = await this.hintService.save(xHint);
    await publisher(nHint);
    return nHint;
  }

  @Subscription(() => GameHint, {
    topics: ['GAME_HINT_ASK'],
    filter: ({ args, payload }) => payload.id === args.gameId,
  })
  onAskGameHint(@Root() hintPayload: GameHint) {
    return hintPayload;
  }
}
