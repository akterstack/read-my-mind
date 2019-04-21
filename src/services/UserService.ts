import { User } from '@/entities';
import { Service } from 'typedi';
import { Repository, Transaction, TransactionRepository } from 'typeorm';

@Service()
export class UserService {
  // @ts-ignore
  @Transaction()
  save(args, @TransactionRepository(User) txr: Repository<User>) {
    return txr.save(args);
  }
}
