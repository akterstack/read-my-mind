import { User } from '@/entities';
import { Id } from '@/resolvers/helpers';
import { UserService } from '@/services';
import { Args, Mutation, Query, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Resolver(User)
export class UserResolver {
  constructor(
    private userService: UserService,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  @Query(() => User)
  user(@Args() { id }: Id) {
    return this.userRepository.findOne(id);
  }

  @Mutation(() => User)
  userCreate(args) {
    // @ts-ignore
    return this.userService.save(args);
  }
}
