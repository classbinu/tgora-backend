import { CreateUserDto, UpdateUserDto } from './user.dto';

import { Injectable } from '@nestjs/common';
import { UsersDocument } from './users.schema';
import { UsersMongoRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersMongoRepository) {}

  async create(usersDto: CreateUserDto) {
    return await this.usersRepository.create(usersDto);
  }

  async findAll() {
    return await this.usersRepository.findAll();
  }

  async findByUsername(username: string): Promise<UsersDocument> {
    return await this.usersRepository.findByUsername(username);
  }

  async findById(id) {
    return await this.usersRepository.findById(id);
  }

  async findUsersByMentorId(id) {
    return await this.usersRepository.findUsersByMentorId(id);
  }

  async update(id, usersDto: UpdateUserDto) {
    return this.usersRepository.update(id, usersDto);
  }

  async remove(id) {
    return this.usersRepository.remove(id);
  }
}
