import { Module } from '@nestjs/common';
import { TuitsController } from './tuits.controller';
import { TuitsService } from './tuits.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tuit } from './tuit.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tuit, User])],
  controllers: [TuitsController],
  providers: [TuitsService],
})
export class TuitsModule {}
