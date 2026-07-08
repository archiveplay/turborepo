import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ZodResponse } from 'nestjs-zod';
import {
  UserFindUniqueReqDto,
  UserFindUniqueResDto,
} from 'src/common/dto/user.dto';
import { QueryCacheInterceptor } from 'src/common/interceptors/cache/query.cache.intercetptor';
import { AuthService } from 'src/common/modules/auth/auth.service';
import { Request, Response } from 'express';
import { AuthCookieService } from 'src/common/modules/auth/auth-cookie.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly authCookieService: AuthCookieService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    return req.user;
  }

  @Post('find-unique')
  @ZodResponse({ type: UserFindUniqueResDto })
  @UseInterceptors(QueryCacheInterceptor)
  findUnique(@Body() dto: UserFindUniqueReqDto) {
    return this.userService.findUnique(dto);
  }

  @Post('auth/telegram')
  @HttpCode(200)
  async telegramAuth(
    @Body() body: { initData: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.authenticateTelegram(body.initData);
    const token = await this.authService.createToken(user);
    this.authCookieService.setToken(response, token);

    return {
      user,
    };
  }
}
