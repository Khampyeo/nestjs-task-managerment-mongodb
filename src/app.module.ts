import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from 'config';

@Module({
  imports: [
    MongooseModule.forRoot(
      `${config.get('db').LOCAL_DATABASE || process.env.DATABASE}`,
    ),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
