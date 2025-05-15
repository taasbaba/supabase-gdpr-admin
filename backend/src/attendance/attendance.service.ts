import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfToday, subDays } from 'date-fns';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async timeIn(userId: string, ip: string) {
    const today = startOfToday();
    const now = new Date();

    return this.prisma.user_daily_attendance.upsert({
      where: {
        user_id_date: {
          user_id: userId,
          date: today,
        },
      },
      update: {
        time_in: now,
        ip_address: ip,
        updated_at: now,
      },
      create: {
        user_id: userId,
        date: today,
        time_in: now,
        ip_address: ip,
        created_at: now,
        updated_at: now,
      },
    });
  }

  async timeOut(userId: string, ip: string) {
    const today = startOfToday();
    const now = new Date();

    return this.prisma.user_daily_attendance.upsert({
      where: {
        user_id_date: {
          user_id: userId,
          date: today,
        },
      },
      update: {
        time_out: now,
        ip_address: ip,
        updated_at: now,
      },
      create: {
        user_id: userId,
        date: today,
        time_out: now,
        ip_address: ip,
        created_at: now,
        updated_at: now,
      },
    });
  }

  async getRecentForUser(userId: string) {
    const from = subDays(startOfToday(), 30);
    return this.prisma.user_daily_attendance.findMany({
      where: {
        user_id: userId,
        date: { gte: from },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getRecentForTarget(targetId: string, viewerId: string) {
    const viewer = await this.prisma.user_profiles.findUnique({
      where: { id: viewerId },
    });

    if (!viewer) throw new ForbiddenException('Viewer not found');
    if (viewer.role === 'member') throw new ForbiddenException('Access denied');

    const target = await this.prisma.user_profiles.findUnique({
      where: { id: targetId },
    });

    if (!target || target.team_id !== viewer.team_id) {
      throw new ForbiddenException('Target not in your team');
    }

    if (viewer.role === 'leader' && target.role === 'manager') {
      throw new ForbiddenException('Leaders cannot view manager data');
    }

    const from = subDays(startOfToday(), 30);
    return this.prisma.user_daily_attendance.findMany({
      where: {
        user_id: targetId,
        date: { gte: from },
      },
      orderBy: { date: 'desc' },
    });
  }
}