import { NestFactory } from '@nestjs/core';
import * as session from 'express-session'; // new code
import * as connectRedis from 'connect-redis'; // new code
import IoRedis from 'ioredis'; // new code

import { AppModule } from './app.module';

const RedisStore = connectRedis(session); // new code
const redisClient = new IoRedis('redis://localhost:6379'); // new code

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // we add sessions middleware
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: 'super-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true, // prevents javascript from accessing the cookies
        maxAge: 1000 * 60 * 15, // cookie expiration date = 15 minutes
      },
    }),
  );

  await app.listen(3333);
}
bootstrap();
