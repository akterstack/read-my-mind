import { Game } from '@/entities';
import { LoggedInUser } from '@/resolvers/helper';
import { Service } from 'typedi';
import { Repository, Transaction, TransactionRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>
  ) {}

  async gameInSession(user: LoggedInUser): Promise<Game> {
    const gameInSession = await this.gameRepository.query(
      `
      select g.id
      from game g
      where g.status = 'started' and g."hostId" = $1
      union select g.id from game g
      inner join game_players_user gu on gu."gameId" = g.id
      inner join "user" u on u.id = gu."userId"
      where g.status in ('published', 'started') and "userId" = $1
      `,
      [user.id]
    );
    if (gameInSession.length) {
      return this.gameRepository.findOne(gameInSession[0]);
    }
    return null;
  }

  // @ts-ignore
  @Transaction()
  save(args, @TransactionRepository(Game) txr: Repository<Game>) {
    return txr.save(args);
  }
}
