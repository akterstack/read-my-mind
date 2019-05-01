import 'reflect-metadata';
// tslint:disable ordered-imports
import { GameHintResolver, GameResolver, UserResolver } from '@/resolvers';
import * as path from 'path';
import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as jwt from 'jsonwebtoken';
import * as expressJwt from 'express-jwt';
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
    resolvers: [UserResolver, GameResolver, GameHintResolver],
  });

  const graphqlPath = '/graphql';
  const app = express();
  if (process.env.NODE_ENV === 'development') {
    app.use(
      cors({
        origin: 'http://localhost:8080',
      })
    );
  }

  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    context: ({ req, connection }: any) => {
      return {
        user: req
          ? req.user // `req.user` comes from `express-expressJwt`
          : jwt.decode(connection.context.Authorization.replace('Bearer ', '')),
      };
    },
  });

  app.use(
    graphqlPath,
    expressJwt({
      secret: process.env.JWT_SECRET,
      // signup/login api should be public
      // auth check will be done in type-graphql middleware (AuthMiddleware)
      credentialsRequired: false,
    })
  );

  app.use(
    '/public',
    express.static(path.resolve(__dirname, '../webui/public'))
  );
  app.use(express.static(path.resolve(__dirname, '../webui/dist')));
  app.get('/', (_, res) => {
    res.sendFile(path.resolve(__dirname, '../webui/dist/index.html'));
  });

  server.applyMiddleware({ app, path: graphqlPath });

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${PORT}${
        server.subscriptionsPath
      }`
    );
  });
}

(async function f() {
  try {
    await bootstrap();
  } catch (e) {
    console.log(e);
  }
})();
