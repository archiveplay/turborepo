import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ZodResponse } from 'nestjs-zod';
import {
  UserFindUniqueReqDto,
  UserFindUniqueResDto,
} from 'src/common/dto/user.dto';
import { QueryCacheInterceptor } from 'src/common/interceptors/cache/query.cache.intercetptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('find-unique')
  @ZodResponse({ type: UserFindUniqueResDto })
  @UseInterceptors(QueryCacheInterceptor)
  findUnique(@Body() dto: UserFindUniqueReqDto) {
    return this.userService.findUnique(dto);
  }
}
