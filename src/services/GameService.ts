import { Game } from '@/entities';
import { Service } from 'typedi';
import { Repository, Transaction, TransactionRepository } from 'typeorm';
// import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class GameService {
  // constructor(
  //   @InjectRepository(Game) private readonly gameRepository: Repository<Game>
  // ) {}

  // findGameStartedByHost(user: User): Promise<Game> {
  //   return this.gameRepository
  //     .createQueryBuilder('game')
  //     .leftJoin('user', )
  //     .where('game.status = :status AND (game.host.id = :userId OR game.', {
  //       userId: user.id,
  //       status: GameStatus.STARTED,
  //     })
  //     .getOne();
  // }
  //
  // findGameStartedOrJoinedByPlayer(user: User): Promise<Game> {
  //   return this.gameRepository
  //     .createQueryBuilder('game')
  //     .where()
  // }
  //
  // gameInSession() {
  //
  // }

  // @ts-ignore
  @Transaction()
  save(args, @TransactionRepository(Game) txr: Repository<Game>) {
    return txr.save(args);
  }
}
