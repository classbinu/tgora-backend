import { Controller, Get } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getHello(): string {
    const message = this.configService.get('DB_URL');
    return message;
  }

  @Get('service-url')
  getServiceUrl(): string {
    return this.configService.get('SERVICE_URL');
  }

  @Get('db-info')
  getTest(): string {
    return '';
  }
}
