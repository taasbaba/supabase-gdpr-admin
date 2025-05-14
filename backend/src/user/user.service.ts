import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // adjust path if needed
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a user profile by auth user ID
   */
  async findProfileById(id: string) {
    return this.prisma.user_profiles.findUnique({
      where: { id },
    });
  }

  /**
   * Create user profile using Supabase user ID
   */
  async createProfile(userId: string, dto: CreateProfileDto) {
    return this.prisma.user_profiles.create({
      data: {
        id: userId,
        full_name: dto.full_name,
        team_id: dto.team_id,
        role: dto.role,
      },
    });
  }

  /**
   * Upsert user profile using Supabase user ID
   */
  async upsertProfile(userId: string, dto: CreateProfileDto) {
    return this.prisma.user_profiles.upsert({
      where: { id: userId },
      create: {
        id: userId,
        full_name: dto.full_name,
        team_id: dto.team_id,
        role: dto.role,
      },
      update: {
        full_name: dto.full_name,
        team_id: dto.team_id,
        role: dto.role,
      },
    });
  }
}
