import { CreateUserDto } from 'src/users/user.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async register(@Body() usersDto: CreateUserDto) {
    return await this.authService.signUp(usersDto);
  }

  @Post('signin')
  async login(@Body() authDto: AuthDto) {
    return await this.authService.signIn(authDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }
}

// https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token
