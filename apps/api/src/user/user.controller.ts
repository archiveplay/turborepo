import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ZodResponse } from 'nestjs-zod';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserFindUniqueDto, UserFindUniqueResDto } from 'src/common/dto/user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('find-unique')
  @ZodResponse({ type: UserFindUniqueResDto })
  @ApiOkResponse({ type: UserFindUniqueResDto })
  findUnique(@Body() dto: UserFindUniqueDto) {
    return this.userService.findUnique(dto);
  }
}
