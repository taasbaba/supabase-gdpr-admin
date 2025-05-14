import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getSelfProfile(uid: string) {
    const profile = await this.prisma.user_profiles.findUnique({
      where: { id: uid },
    });
    if (!profile) throw new ForbiddenException('User profile not found');
    return profile;
  }

  async getAllByRole(profile: { role: string; team_id: number }) {
    const whereClause: any = { team_id: profile.team_id };
    if (profile.role === 'leader') {
      whereClause.role = { in: ['leader', 'member'] };
    }

    const users = await this.prisma.user_profiles.findMany({
      where: whereClause,
      select: { id: true, full_name: true },
    });

    return { users };
  }

  async getUserProfileByRole(
    targetId: string,
    self: { role: string; team_id: number },
  ) {
    const target = await this.prisma.user_profiles.findUnique({
      where: { id: targetId },
    });

    if (!target || target.team_id !== self.team_id)
      throw new ForbiddenException();

    if (self.role === 'leader' && target.role === 'manager') {
      throw new ForbiddenException();
    }

    return target;
  }
}
