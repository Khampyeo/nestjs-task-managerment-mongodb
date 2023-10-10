import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from 'config';

@Module({
  imports: [
    MongooseModule.forRoot(
      `${process.env.DATABASE || config.get('db').DATABASE_LOCAL}`,
    ),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
