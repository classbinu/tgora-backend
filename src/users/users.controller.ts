import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/profile')
  @UseGuards(AccessTokenGuard)
  getProfile(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.usersService.findById(userId);
  }

  @Get('/mentees')
  @UseGuards(AccessTokenGuard)
  getMentees(@Req() req: Request) {
    const value = req.user['sub'];
    return this.usersService.findByKeyValue({ mentor: value });
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/:id')
  update(@Param('id') id: string, @Body() usersDto: UpdateUserDto) {
    return this.usersService.update(id, usersDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
