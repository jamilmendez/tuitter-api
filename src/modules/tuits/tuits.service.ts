import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Tuit } from './tuit.entity';
import { User } from '../users/entities/user.entity';
import { CreateTuitDto, PaginationQueryDto, UpdateTuitDto } from './dto';

@Injectable()
export class TuitsService {
  constructor(
    @InjectRepository(Tuit) private readonly tuitRepository: Repository<Tuit>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getTuits({ limit, offset }: PaginationQueryDto): Promise<Tuit[]> {
    return await this.tuitRepository.find({
      relations: ['user'],
      skip: offset,
      take: limit,
    });
  }

  async getTuit(id: number): Promise<Tuit> {
    const tuit = await this.tuitRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!tuit) {
      throw new NotFoundException('Resource not found');
    }

    return tuit;
  }

  async createTuit({ message, user }: CreateTuitDto) {
    const tuit = this.tuitRepository.create({ message, user });
    return this.tuitRepository.save(tuit);
  }

  async updateTuit(id: number, { message }: UpdateTuitDto) {
    const tuit = await this.tuitRepository.preload({
      id,
      message,
    });

    if (!tuit) {
      throw new NotFoundException('Resource not found');
    }

    return this.tuitRepository.save(tuit);
  }

  async removeTuit(id: number) {
    const tuit = await this.tuitRepository.findOne({ where: { id } });

    if (!tuit) {
      throw new NotFoundException('Resource not found');
    }

    this.tuitRepository.remove(tuit);
  }
}
