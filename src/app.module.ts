import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { EmailModule } from './common/modules/email/email.module';
import { NodemailerModule } from '@crowdlinker/nestjs-mailer';
import { AwsModule } from './common/modules/aws/aws.module';
import { TeamsModule } from './modules/teams/teams.module';

import config from './config';
import { PaginatorMiddleware } from './common/middlewares/Paginator.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(config.database),
    NodemailerModule.forRoot(config.nodemailer),
    UsersModule,
    AuthModule,
    ProfilesModule,
    EmailModule,
    AwsModule,
    TeamsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaginatorMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
