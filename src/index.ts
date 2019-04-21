import 'reflect-metadata';
// tslint:disable ordered-imports
import { GameResolver, UserResolver } from '@/resolvers';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import * as TypeORM from 'typeorm';
import { Container } from 'typedi';

TypeORM.useContainer(Container);
async function bootstrap() {
  await TypeORM.createConnection();

  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    container: Container,
    resolvers: [UserResolver, GameResolver],
  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
