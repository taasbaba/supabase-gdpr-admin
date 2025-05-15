import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { ApproveLeaveDto } from './dto/approve-leave.dto';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  async createLeaveRequest(userId: string, role: string, dto: CreateLeaveDto) {
    const leave = await this.prisma.leave_requests.create({
      data: {
        user_id: userId,
        reason: dto.reason,
        requested_from: new Date(dto.requested_from),
        requested_to: new Date(dto.requested_to),
        // default status is handled by DB
      },
    });
    console.log("createLeaveRequest, ", userId, role);
    if (role === 'member') {
      const leader = await this.findTeamUser(userId, 'leader');
      if (!leader) {
        throw new BadRequestException('No leader found in your team');
      }
      console.log("createLeaveRequest role: member");
      await this.createInbox(leader.id, leave.id, 'leave_request');
    }

    if (role === 'leader') {
      const manager = await this.findTeamUser(userId, 'manager');
      if (!manager) {
        throw new BadRequestException('No manager found in your team');
      }
      await this.prisma.leave_requests.update({
        where: { id: leave.id },
        data: { status: 'pending_manager' },
      });
      console.log("createLeaveRequest role: leader");
      await this.createInbox(manager.id, leave.id, 'leave_request');
    }

    if (role === 'manager') {
      await this.prisma.leave_requests.update({
        where: { id: leave.id },
        data: { status: 'approved' },
      });
      console.log("createLeaveRequest role: manager");
    }

    return leave;
  }

  async approveLeaveRequest(
    leaveId: number,
    approverId: string,
    role: string,
    dto?: ApproveLeaveDto,
  ) {
    const leave = await this.prisma.leave_requests.findUnique({
      where: { id: leaveId },
    });
    if (!leave) throw new NotFoundException('Leave request not found');
    if (leave.user_id === approverId)
      throw new ForbiddenException('You cannot approve your own request');

    if (leave.status === 'pending_leader' && role === 'leader') {
      if (!leave.user_id) {
        throw new BadRequestException(
          'Leave request has no associated user ID',
        );
      }
      const manager = await this.findTeamUser(leave.user_id, 'manager');
      if (!manager)
        throw new BadRequestException('No manager found in user team');
      await this.prisma.leave_requests.update({
        where: { id: leave.id },
        data: {
          status: 'pending_manager',
          updated_at: new Date(),
        },
      });
      await this.resolveInbox(approverId, 'leave_request', leave.id);
      await this.createInbox(manager.id, leave.id, 'leave_request');
    } else if (leave.status === 'pending_manager' && role === 'manager') {
      await this.prisma.leave_requests.update({
        where: { id: leave.id },
        data: {
          status: 'approved',
          updated_at: new Date(),
        },
      });
      await this.resolveInbox(approverId, 'leave_request', leave.id);
    } else {
      throw new ForbiddenException(
        'You are not allowed to approve this request',
      );
    }

    return { message: 'Leave request updated successfully' };
  }

  async getMyLeaveRequests(userId: string) {
    return this.prisma.leave_requests.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  private async createInbox(
    userId: string,
    referenceId: number,
    type: 'leave_request',
  ) {
    console.log("createInbox:", userId, referenceId);
    await this.prisma.user_inbox_items.create({
      data: {
        user_id: userId,
        reference_id: referenceId,
        type,
      },
    });
  }

  private async resolveInbox(
    userId: string,
    type: 'leave_request',
    referenceId: number,
  ) {
    await this.prisma.user_inbox_items.updateMany({
      where: {
        user_id: userId,
        reference_id: referenceId,
        type,
        status: 'pending',
      },
      data: {
        status: 'resolved',
        resolved_at: new Date(),
      },
    });
  }

  private async findTeamUser(
    baseUserId: string,
    targetRole: 'leader' | 'manager',
  ) {
    const baseUser = await this.prisma.user_profiles.findUnique({
      where: { id: baseUserId },
    });

    if (!baseUser || !baseUser.team_id) return null;

    return this.prisma.user_profiles.findFirst({
      where: {
        team_id: baseUser.team_id,
        role: targetRole,
      },
    });
  }
}
