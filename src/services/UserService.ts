import { User } from '@/entities';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';

import { Repository, Transaction, TransactionRepository } from 'typeorm';

@Service()
export class UserService {
  // @ts-ignore
  @Transaction()
  create(args, @TransactionRepository(User) txr: Repository<User>) {
    return txr.save(args);
  }

  generateToken({ id, username }: User): string {
    return jwt.sign({ id, username }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
  }
}
