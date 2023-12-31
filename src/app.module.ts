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
import { AccessControlModule, ACGuard } from 'nest-access-control';

import config from './config';
import { PaginatorMiddleware } from './middlewares/paginator.middleware';
import { UserJoinTeamModule } from './modules/user-join-team/user-join-team.module';
import { RPAC_POLICY } from './modules/auth/rbac-policy';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot(config.database),
    NodemailerModule.forRoot(config.nodemailer),
    // AccessControlModule.forRoles(RPAC_POLICY),
    UsersModule,
    AuthModule,
    ProfilesModule,
    EmailModule,
    AwsModule,
    TeamsModule,
    UserJoinTeamModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    //  { provide: APP_GUARD, useClass: ACGuard }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaginatorMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
