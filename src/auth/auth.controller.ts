import { CreateUserDto } from 'src/users/user.dto';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { Request, Response } from 'express';
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
  async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signIn(authDto);
    const cookieOptions = {
      domain: null,
      path: '/',
      httpOnly: true,
    };
    res
      .cookie('access_token', tokens.accessToken, cookieOptions)
      .cookie('refresh_token', tokens.refreshToken, cookieOptions);
    return await this.authService.signIn(authDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    console.log(userId);
    console.log(refreshToken);
    return this.authService.refreshTokens(userId, refreshToken);
  }
}

// https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token
