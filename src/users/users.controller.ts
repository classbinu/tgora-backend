import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('/:id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Post()
  createUser(@Body() UsersDto) {
    this.usersService.createUser(UsersDto);
    return 'success';
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    this.usersService.deleteUser(id);
    return 'success';
  }

  @Put('/:id')
  updateUser(@Param('id') id: string, @Body() UsersDto) {
    return this.usersService.updateUser(id, UsersDto);
  }
}
