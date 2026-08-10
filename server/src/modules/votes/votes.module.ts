import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VotesService } from './votes.service'
import { VotesController } from './votes.controller'
import { ZawerVote } from '../../entities/zawer-vote.entity'
import { Merchant } from '../../entities/merchant.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ZawerVote, Merchant])],
  controllers: [VotesController],
  providers: [VotesService],
  exports: [VotesService],
})
export class VotesModule {}
