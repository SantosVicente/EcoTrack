import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';

import { USERS_SERVICE } from './users.constants';
import { UsersController } from './users.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    UsersService,
    {
      provide: USERS_SERVICE,
      useClass: UsersService,
    },
  ],
  exports: [UsersService, USERS_SERVICE],
  controllers: [UsersController],
})
export class UsersModule {}
