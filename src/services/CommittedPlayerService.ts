import { CommittedPlayer } from '@/entities';
import { Service } from 'typedi';
import { Repository, Transaction, TransactionRepository } from 'typeorm';

@Service()
export class CommittedPlayerService {
  // @ts-ignore
  @Transaction()
  async save(
    word: string,
    gameId: number,
    playerId: number,
    @TransactionRepository(CommittedPlayer) txr: Repository<CommittedPlayer>
  ): Promise<CommittedPlayer> {
    return txr.save({
      word,
      game: { id: gameId },
      player: { id: playerId },
    });
  }
}
