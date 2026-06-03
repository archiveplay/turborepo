import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { prisma } from '@pkg/db/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return prisma.user.findMany();
  }
}
