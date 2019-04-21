import { User } from '@/entities';
import { Id } from '@/resolvers/helpers';
import { AuthParams } from '@/resolvers/helpers/AuthParams';
import { UserService } from '@/services';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
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

  @Mutation(() => String)
  async signup(@Args() { username, password }: AuthParams) {
    const existingUser = await this.userRepository.findOne({ username });
    if (existingUser) {
      throw Error('Username has been already taken.');
    }
    // @ts-ignore
    const user = await this.userService.create({
      username,
      password: await bcrypt.hash(password, 10),
    });

    return jwt.sign({ id: user.id, email: user.email }, 'Calipsa', {
      expiresIn: 60 * 60,
    });
  }

  @Query(() => String)
  async login(@Args() { username, password }: AuthParams) {
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw Error(`No user for username: '${username}'`);
    }
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error('Incorrect password');
    }

    // return json web token
    return jwt.sign({ id: user.id }, 'Calipsa', { expiresIn: '1d' });
  }
}
