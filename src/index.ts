import 'reflect-metadata';
// tslint:disable ordered-imports
import { GameResolver, UserResolver } from '@/resolvers';
import * as express from 'express';
import * as jwt from 'express-jwt';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import * as TypeORM from 'typeorm';
import { Container } from 'typedi';
import { AuthMiddleware } from '@/AuthMiddleware';

TypeORM.useContainer(Container);
async function bootstrap() {
  await TypeORM.createConnection();

  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    container: Container,
    globalMiddlewares: [AuthMiddleware],
    resolvers: [UserResolver, GameResolver],
  });

  const path = '/api';
  const app = express();
  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      return {
        req,
        user: req.user, // `req.user` comes from `express-jwt`
      };
    },
  });

  app.use(
    path,
    jwt({
      secret: process.env.JWT_SECRET,
      // signup/login api should be public
      // auth check will be done in type-graphql middleware (AuthMiddleware)
      credentialsRequired: false,
    })
  );

  server.applyMiddleware({ app, path });

  // Start the server
  app.listen({ port: 4000 }, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
}

bootstrap();
