import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { ApproveLeaveDto } from './dto/approve-leave.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Leave Requests')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('leave-request')
export class LeaveController {
  constructor(
    private readonly leaveService: LeaveService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * User submits a new leave request.
   */
  @Post()
  async submitRequest(@Req() req, @Body() dto: CreateLeaveDto) {
    const userId = req.user?.sub;

    const userProfile = await this.prisma.user_profiles.findUnique({
      where: { id: userId },
    });

    if (!userProfile) throw new Error('User profile not found');

    return this.leaveService.createLeaveRequest(userId, userProfile.role, dto);
  }

  /**
   * Approver approves a pending request.
   */
  @Put(':id/approve')
  async approveRequest(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ApproveLeaveDto,
  ) {
    const userId = req.user?.sub;

    const userProfile = await this.prisma.user_profiles.findUnique({
      where: { id: userId },
    });

    if (!userProfile) throw new Error('User profile not found');

    return this.leaveService.approveLeaveRequest(
      id,
      userId,
      userProfile.role,
      dto,
    );
  }

  /**
   * Get all leave requests submitted by the current user.
   */
  @Get('my')
  async getMyRequests(@Req() req) {
    const userId = req.user?.sub;
    return this.leaveService.getMyLeaveRequests(userId);
  }
}
