import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users';

@Module({
  providers: [UsersService, Users],
  exports: [UsersService],
})
export class UsersModule {}
