import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtGuard } from './auth/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class AppController {
  @UseGuards(JwtGuard)
  @Get('/me')
  getMe(@Req() req) {
    return {
      email: req.user?.email,
      sub: req.user?.sub,
    };
  }
}
