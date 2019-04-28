import { GameHint, User } from '@/entities';
import { HostAnswer } from '@/entities/helper';
import { GameHintService } from '@/services';
import {Arg, Int, Mutation, Publisher, PubSub, Resolver, Root, Subscription} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Resolver(User)
export class GameHintResolver {
  constructor(
    private hintService: GameHintService,
    @InjectRepository(GameHint)
    private readonly hintRepository: Repository<GameHint>
  ) {}

  @Mutation(() => GameHint)
  async askHint(
    @Arg('gameId', () => Int!) gameId: number,
    @Arg('question') question: string,
    @PubSub('GAME_HINT_CREATE') createPublisher: Publisher<GameHint>
  ): Promise<GameHint> {
    // @ts-ignore
    const hint = await this.hintService.save({
      question,
      game: { id: gameId },
    });
    await createPublisher(hint);
    return hint;
  }

  @Mutation(() => GameHint)
  async giveAnswer(
    @Arg('id', () => Int!) id: number,
    @Arg('answer', () => String!) answer: string,
    @PubSub('GAME_HINT_UPDATE') updatePublisher: Publisher<GameHint>
  ): Promise<GameHint> {
    const xHint = await this.hintRepository.findOne(id);
    xHint.answer =
      answer.toLowerCase() === 'yes' ? HostAnswer.YES : HostAnswer.NO;
    // @ts-ignore
    const nHint = await this.hintService.save(xHint);
    await updatePublisher(nHint);
    return nHint;
  }

  @Subscription(() => GameHint, {
    topics: ['GAME_HINT_CREATE'],
    filter: ({ args, payload }) => payload.id === args.gameId,
  })
  gameHintCreateSubs(@Root() hintPayload: GameHint) {
    return hintPayload;
  }
}
