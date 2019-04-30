import { Game, GameHint, User } from '@/entities';
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
import { In, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Resolver(User)
export class GameHintResolver {
  constructor(
    private hintService: GameHintService,
    @InjectRepository(GameHint)
    private readonly hintRepository: Repository<GameHint>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>
  ) {}

  @Query(() => [GameHint])
  async allPlayersHints(
    @Arg('gameId', () => Int!) gameId: number
  ): Promise<GameHint[]> {
    const game = await this.gameRepository.findOne(gameId);
    return this.hintRepository.find({
      relations: ['player'],
      where: {
        game: { id: gameId },
        player: { id: In((await game.players).map(player => player.id)) },
      },
    });
  }

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
  async askQuestion(
    @Arg('gameId', () => Int!) gameId: number,
    @Arg('question') question: string,
    @Ctx() { user }: Context,
    @PubSub('GAME_HINT_QUESTION') publisher: Publisher<GameHint>
  ): Promise<GameHint> {
    await this.hintService.validate(gameId, user.id);
    // @ts-ignore
    const hint = await this.hintService.save({
      question,
      game: { id: gameId },
      player: { id: user.id },
    });
    const fullHint = await this.hintRepository.findOne(hint.id);
    await publisher(fullHint);
    return fullHint;
  }

  @Mutation(() => GameHint)
  async giveAnswer(
    @Arg('hintId', () => Int!) hintId: number,
    @Arg('answer', () => String!) answer: string,
    @PubSub('GAME_HINT_ANSWER') publisher: Publisher<GameHint>
  ): Promise<GameHint> {
    const xHint = await this.hintRepository.findOne(hintId);
    xHint.answer =
      answer.toLowerCase() === 'yes' ? HostAnswer.YES : HostAnswer.NO;
    // @ts-ignore
    const nHint = await this.hintService.save(xHint);
    try {
      await this.hintService.validate(nHint.game.id, nHint.player.id);
    } catch (e) {
      if (e.message === 'MaxHintsRedeemed') {
        nHint.isAllHintsRedeemed = true;
      }
    }
    await publisher(nHint);
    return nHint;
  }

  @Subscription(() => GameHint, {
    topics: ['GAME_HINT_QUESTION'],
    filter: ({ args, payload, context: { user } }) => {
      return (
        payload.game.id === args.gameId && payload.game.host.id === user.id
      );
    },
  })
  onGameHintQuestion(
    @Root() hintPayload: GameHint,
    @Arg('gameId', () => Int!) _: number
  ) {
    return hintPayload;
  }

  @Subscription(() => GameHint, {
    topics: ['GAME_HINT_ANSWER'],
    filter: ({ args, payload, context: { user } }) => {
      return payload.game.id === args.gameId && payload.player.id === user.id;
    },
  })
  onGameHintAnswer(
    @Root() hintPayload: GameHint,
    @Arg('gameId', () => Int!) _: number
  ) {
    return hintPayload;
  }
}
