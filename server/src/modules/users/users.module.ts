import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../../entities/user.entity';
import { Favorite } from '../../entities/favorite.entity';
import { Merchant } from '../../entities/merchant.entity';
import { Review } from '../../entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Favorite, Merchant, Review])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
