import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UserService } from './user.service';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('me')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  getMe(@Req() req) {
    return {
      email: req.user?.email,
      sub: req.user?.sub,
    };
  }

  @Get('full-token')
  getFullToken(@Req() req) {
    return {
      message: 'Decoded JWT payload',
      payload: req.user, // contains full token claims
    };
  }
  
  /**
   * Create the user's own profile
   */
  @ApiOperation({ summary: 'Create or update user profile (upsert)' })
  @Post('profile')
  async createProfile(@Req() req, @Body() dto: CreateProfileDto) {
    const uid = req.user?.sub;
    return this.userService.upsertProfile(uid, dto);
  }

  /**
   * Get the user's own profile
   */
  @Get('profile')
  async getOwnProfile(@Req() req) {
    const uid = req.user?.sub;
    return this.userService.findProfileById(uid);
  }
}
