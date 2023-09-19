import { CreateUserDto } from 'src/users/user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';

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

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return await this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(AccessTokenGuard)
  @Patch('password')
  async changePassword(@Body() passwordDto, @Req() req: Request) {
    return await this.authService.changePassword(req.user['sub'], passwordDto);
  }
}

// https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token
