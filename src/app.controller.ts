import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('user/:tenantId')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  findUser() {
    return this.appService.findUser();
  }

  @Get('/create')
  createUser() {
    return this.appService.createUser();
  }
}
