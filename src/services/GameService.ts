import { Game } from '@/entities';
import { Service } from 'typedi';
import { Repository, Transaction, TransactionRepository } from 'typeorm';

@Service()
export class GameService {
  // @ts-ignore
  @Transaction()
  save(args, @TransactionRepository(Game) txr: Repository<Game>) {
    return txr.save(args);
  }
}
