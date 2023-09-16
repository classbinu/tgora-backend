import { Injectable } from '@nestjs/common';
import { UsersDto } from './users.model';
import { UsersMongoRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersMongoRepository) {}

  async getAllUsers() {
    return await this.usersRepository.getAllUsers();
  }

  async getUser(id) {
    return await this.usersRepository.getUser(id);
  }

  createUser(usersDto: UsersDto) {
    this.usersRepository.createUser(usersDto);
  }

  deleteUser(id) {
    this.usersRepository.deleteUser(id);
  }

  updateUser(id, usersDto: UsersDto) {
    this.usersRepository.updateUser(id, usersDto);
  }
}
