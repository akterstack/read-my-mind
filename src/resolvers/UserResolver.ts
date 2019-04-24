import { User } from '@/entities';
import { AuthParams, Context, LoginInfo } from '@/resolvers/helpers';
import { UserService } from '@/services';
import * as bcrypt from 'bcrypt';
import { Arg, Args, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Resolver(User)
export class UserResolver {
  constructor(
    private userService: UserService,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  @Query(() => User)
  user(@Arg('id', () => Int) id: number) {
    return this.userRepository.findOne(id);
  }

  @Query(() => LoginInfo)
  userLoginInfo(@Ctx() { user }: Context) {
    const info = new LoginInfo();
    info.id = user.id;
    info.username = user.username;
    return info;
  }

  @Mutation(() => String)
  async signup(@Args() { username, password, confirmPassword }: AuthParams) {
    if (password !== confirmPassword) {
      throw Error('Password mismatched.');
    }
    const existingUser = await this.userRepository.findOne({ username });
    if (existingUser) {
      throw Error('Username has been already taken.');
    }
    // @ts-ignore
    const user = await this.userService.create({
      username,
      password: await bcrypt.hash(password, 10),
    });

    return this.userService.generateToken(user);
  }

  @Mutation(() => String)
  async login(@Args() { username, password }: AuthParams) {
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw Error(`No user for username: '${username}'`);
    }
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error('Incorrect password');
    }
    return this.userService.generateToken(user);
  }
}
