import { Game, GameHint } from '@/entities';
import { Service } from 'typedi';

import { Repository, Transaction, TransactionRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class GameHintService {
  constructor(
    @InjectRepository(GameHint)
    private readonly hintRepository: Repository<GameHint>,
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>
  ) {}

  async validate(gameId, playerId) {
    const xHintsCountPromise = this.hintRepository.find({
      where: {
        game: { id: gameId },
        player: { id: playerId },
      },
    });
    const gamePromise = this.gameRepository.findOne(gameId);
    const xHintsCount = await xHintsCountPromise;
    const game = await gamePromise;
    if (xHintsCount.length === game.maxHint) {
      throw new Error(`MaxHintsRedeemed`);
    }
  }

  // @ts-ignore
  @Transaction()
  save(
    args,
    @TransactionRepository(GameHint) txr: Repository<GameHint>
  ): Promise<GameHint> {
    return txr.save(args);
  }
}
