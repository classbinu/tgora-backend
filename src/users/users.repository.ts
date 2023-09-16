import { Users, UsersDocument } from './Users.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { UsersDto } from './users.model';
import { Model } from 'mongoose';

export interface UsersRepository {
  getAllUsers(): Promise<UsersDto[]>;
  createUser(usersDto: UsersDto);
  deleteUser(id: string);
  updateUser(id: string, usersDto: UsersDto);
}

@Injectable()
export class UsersMongoRepository implements UsersRepository {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
  ) {}

  async getAllUsers(): Promise<Users[]> {
    return await this.usersModel.find().sort({ createdAt: -1 }).exec();
  }

  async getUser(id: string): Promise<Users> {
    return await this.usersModel.findById(id);
  }

  async createUser(usersDto: UsersDto) {
    const createUser = {
      ...usersDto,
      createdAt: new Date(),
    };
    this.usersModel.create(createUser);
  }

  async deleteUser(id: string) {
    await this.usersModel.findByIdAndDelete(id);
  }

  async updateUser(id: string, usersDto: UsersDto) {
    const updateUser = { ...usersDto };
    await this.usersModel.findByIdAndUpdate(id, updateUser);
  }
}
