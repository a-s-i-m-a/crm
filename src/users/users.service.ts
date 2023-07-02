import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.usersRepository.save({ ...createUserDto });
  }

  async getAllUser(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }
}
