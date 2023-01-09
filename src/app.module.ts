import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TasksModule } from './tasks/tasks.module';
import { RolesModule } from './modules/roles/roles.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('db.mysql.host', 'localhost'),
          port: configService.get('db.mysql.port', 3306),
          username: configService.get('db.mysql.userName', 'root'),
          password: configService.get('db.mysql.password', 'root'),
          database: configService.get('db.mysql.dbName', 'm_cube'),
          entities: ['dist/**/entities/**.entity{.ts,.js}'],
          timezone: configService.get('db.mysql.timezone', '+08:00'),
          charset: configService.get('db.mysql.charset', 'utf8mb4'),
          synchronize: configService.get('db.mysql.synchronize', false),
          logging: configService.get('db.mysql.logging', false),
        };
      },
    }),
    TasksModule,
    UserModule,
    AuthModule,
    ThrottlerModule.forRoot(),
    RolesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Rate Limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
