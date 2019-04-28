import { GameHint } from '@/entities';
import { Service } from 'typedi';

import { Repository, Transaction, TransactionRepository } from 'typeorm';

@Service()
export class GameHintService {
  // @ts-ignore
  @Transaction()
  save(args, @TransactionRepository(GameHint) txr: Repository<GameHint>) {
    return txr.save(args);
  }
}
