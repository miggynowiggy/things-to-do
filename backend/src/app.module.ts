import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MongoDriver } from '@mikro-orm/mongodb';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TasksModule,
    MikroOrmModule.forRoot({
      driver: MongoDriver,
      autoLoadEntities: true,
      clientUrl: process.env.MONGODB_URL,
      dbName: process.env.DB_NAME,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: Number(process.env.THROTTLE_LIMIT) || 10,
          ttl: seconds(Number(process.env.THROTTLE_TTL) || 60),
        },
      ],
      storage: new ThrottlerStorageRedisService(process.env.REDIS_URL),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
