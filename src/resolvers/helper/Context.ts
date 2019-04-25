import { LoggedInUser } from '@/resolvers/helper';

export interface Context {
  user?: LoggedInUser;
}
