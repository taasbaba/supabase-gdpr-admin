import {
  Controller,
  Post,
  Get,
  Req,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { AttendanceService } from './attendance.service';
import { JwtGuard } from '../auth/jwt.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('time-in')
  async timeIn(@Req() req: Request) {
    const userId = req.user?.sub;
    if (!userId) throw new BadRequestException('Invalid user');

    const ip =
      req.headers['x-forwarded-for']?.toString() ||
      req.socket.remoteAddress ||
      'unknown';

    return this.attendanceService.timeIn(userId, ip);
  }

  @Post('time-out')
  async timeOut(@Req() req: Request) {
    const userId = req.user?.sub;
    if (!userId) throw new BadRequestException('Invalid user');

    const ip =
      req.headers['x-forwarded-for']?.toString() ||
      req.socket.remoteAddress ||
      'unknown';

    return this.attendanceService.timeOut(userId, ip);
  }

  @Get('me')
  async getOwnAttendance(@Req() req: Request) {
    const userId = req.user?.sub;
    if (!userId) throw new BadRequestException('Invalid user');

    return this.attendanceService.getRecentForUser(userId);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'View another user’s attendance (restricted)',
    description:
      'Only leaders and managers can access this. Members will receive 403 Forbidden. Target must be in the same team.',
  })
  @ApiForbiddenResponse({
    description:
      'Access denied if caller is a member or target is unauthorized.',
  })
  async getUserAttendance(@Param('uuid') uuid: string, @Req() req: Request) {
    const viewerId = req.user?.sub;
    if (!viewerId) throw new BadRequestException('Invalid user');

    return this.attendanceService.getRecentForTarget(uuid, viewerId);
  }
}
