import {
  Controller,
  Get,
  Param,
  Req,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard } from '../auth/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('getall')
  async getAll(@Req() req) {
    const uid = req.user.sub;
    const userProfile = await this.adminService.getSelfProfile(uid);

    if (userProfile.role === 'member') throw new ForbiddenException();
    if (userProfile.team_id === null) {
      throw new ForbiddenException('User not assigned to any team');
    }
    return this.adminService.getAllByRole({
      role: userProfile.role,
      team_id: userProfile.team_id,
    });
  }

  @Get(':uuid')
  async getUserProfile(@Param('uuid') uuid: string, @Req() req) {
    const uid = req.user.sub;
    const userProfile = await this.adminService.getSelfProfile(uid);

    if (userProfile.role === 'member') throw new ForbiddenException();
    if (userProfile.team_id === null)
      throw new ForbiddenException('User not assigned to any team');

    return this.adminService.getUserProfileByRole(uuid, {
      role: userProfile.role,
      team_id: userProfile.team_id,
    });
  }
}
