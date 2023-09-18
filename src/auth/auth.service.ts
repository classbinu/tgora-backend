import * as argon2 from 'argon2';

import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthDto } from './auth.dto';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(usersDto: CreateUserDto) {
    const user = await this.usersService.findByUsername(usersDto.username);
    if (user) {
      throw new HttpException(
        '해당 유저가 이미 있습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!objectIdPattern.test(usersDto.mentor)) {
      throw new HttpException(
        `${usersDto.mentor}는 유효하지 않습니다.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const mentor = await this.usersService.findById(usersDto.mentor);
    if (!mentor) {
      throw new HttpException(
        '존재하지 않는 추천인입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const mentees = await this.usersService.findUsersByMentorId(
      usersDto.mentor,
    );
    if (mentees.length >= 2) {
      throw new HttpException('만료된 초대장입니다.', HttpStatus.BAD_REQUEST);
    }

    const hash = await this.hashData(usersDto.password);
    const newUser = await this.usersService.create({
      ...usersDto,
      password: hash,
    });
    const tokens = await this.getTokens(newUser._id, newUser.username);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return tokens;
  }

  async signIn(data: AuthDto) {
    const user = await this.usersService.findByUsername(data.username);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 아이디입니다.');
    }
    const passwordMatches = await argon2.verify(user.password, data.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const tokens = await this.getTokens(user._id, user.username);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '14d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  // async validateUser(username: string, password: string) {
  //   const user = await this.usersService.getUser(username);

  //   if (!user) {
  //     return null;
  //   }
  //   const { password: hashedPassword, ...userInfo } = user;
  //   if (bcrypt.compareSync(password, hashedPassword)) {
  //     return userInfo;
  //   }
  //   return null;
  // }
}
