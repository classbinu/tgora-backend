import { Users, UsersDocument } from './users.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { UsersDto } from './users.model';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './user.dto';

export interface UsersRepository {
  findAll(): Promise<UsersDto[]>;
  findByUsername(username: string);
  create(usersDto: CreateUserDto);
  update(id: string, usersDto: UpdateUserDto);
  remove(id: string);
}

@Injectable()
export class UsersMongoRepository implements UsersRepository {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
  ) {}

  async findAll(): Promise<Users[]> {
    return await this.usersModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string) {
    return await this.usersModel.findById(id).exec();
  }

  async findByUsername(username: string) {
    return await this.usersModel.findOne({ username: username }).exec();
  }

  async findByKeyValue(condition) {
    return await this.usersModel
      .find(condition)
      .select([
        '-username',
        '-password',
        '-grade',
        '-nickname',
        '-createdAt',
        '-refreshToken',
        '-__v',
      ])
      .exec();
  }

  async findUsersByMentorId(id: string) {
    return await this.usersModel
      .find({ mentor: id })
      .select([
        '-username',
        '-password',
        '-nickname',
        '-grade',
        '-createdAt',
        '-refreshToken',
        '-__v',
      ])
      .exec();
  }

  async create(usersDto: CreateUserDto) {
    const createdUser = new this.usersModel(usersDto);
    return createdUser.save();
  }

  // async update(id: string, usersDto: UpdateUserDto) {
  //   const updateUser = { ...usersDto };
  //   await this.usersModel
  //     .findByIdAndUpdate(id, updateUser, { new: true })
  //     .exec();
  // }

  async update(id: string, usersDto: UpdateUserDto) {
    const { grade, nickname, email, phone, refreshToken } = usersDto;
    const updateFields: any = {};

    const user = await this.usersModel.findById(id);
    if (nickname && user.nickname.pop() !== nickname) {
      updateFields.$push = { nickname: { $each: [nickname] } };
    }

    if (grade) {
      updateFields.grade = grade;
    }

    if (email) {
      updateFields.email = email;
    }

    if (phone) {
      updateFields.phone = phone;
    }

    if (refreshToken) {
      updateFields.refreshToken = refreshToken;
    }

    const updatedUser = await this.usersModel
      .findByIdAndUpdate(id, updateFields, { new: true })
      .exec();

    return updatedUser;
  }

  async remove(id: string) {
    await this.usersModel.findByIdAndDelete(id).exec();
  }
}
